import { useEffect, useMemo, useRef } from 'react';
import {
  type ExtrapolationType,
  type SharedValue,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
  type WithSpringConfig,
  withTiming,
  type WithTimingConfig,
} from 'react-native-reanimated';
import { type AnimatedProp, notifyChange, Skia, type SkPath } from '@shopify/react-native-skia';
import * as interpolate from 'd3-interpolate-path';

import { unwrapAnimatedValue } from './chart';

/**
 * Transition configuration for animations.
 * Supports timing and spring animation types.
 * Used for paths, positions, opacity, and any other animated properties.
 *
 * @example
 * // Spring animation
 * { type: 'spring', damping: 10, stiffness: 100 }
 *
 * @example
 * // Timing animation
 * { type: 'timing', duration: 500, easing: Easing.inOut(Easing.ease) }
 */
export type TransitionConfig =
  | ({ type: 'timing' } & WithTimingConfig)
  | ({ type: 'spring' } & WithSpringConfig);

/**
 * Default transition configuration used across all chart components.
 * Uses a smooth spring animation with balanced stiffness and damping.
 */
export const defaultTransition: TransitionConfig = {
  type: 'spring',
  stiffness: 900,
  damping: 120,
};

/**
 * Custom hook that uses d3-interpolate-path for more robust path interpolation.
 * then use Skia's native interpolation in the worklet.
 *
 * @param progress - Shared value between 0 and 1
 * @param fromPath - Starting path as SVG string
 * @param toPath - Ending path as SVG string
 * @returns Interpolated SkPath as a shared value
 */
export const useD3PathInterpolation = (
  progress: SharedValue<number>,
  fromPath: string,
  toPath: string,
): SharedValue<SkPath> => {
  // Pre-compute intermediate paths on JS thread using d3-interpolate-path
  const { fromSkiaPath, i0, i1, toSkiaPath } = useMemo(() => {
    const pathInterpolator = interpolate.interpolatePath(fromPath, toPath);
    const d = 1e-3;

    return {
      fromSkiaPath: Skia.Path.MakeFromSVGString(fromPath) ?? Skia.Path.Make(),
      i0: Skia.Path.MakeFromSVGString(pathInterpolator(d)) ?? Skia.Path.Make(),
      i1: Skia.Path.MakeFromSVGString(pathInterpolator(1 - d)) ?? Skia.Path.Make(),
      toSkiaPath: Skia.Path.MakeFromSVGString(toPath) ?? Skia.Path.Make(),
    };
  }, [fromPath, toPath]);

  const result = useSharedValue(fromSkiaPath);

  useAnimatedReaction(
    () => progress.value,
    (t) => {
      'worklet';
      result.value = i1.interpolate(i0, t) ?? toSkiaPath;
      notifyChange(result);
    },
    [fromSkiaPath, i0, i1, toSkiaPath],
  );

  return result;
};

// Interpolator and useInterpolator are brought over from non exported code in @shopify/react-native-skia
/**
 * @worklet
 */
type Interpolator<T> = (
  value: number,
  input: number[],
  output: T[],
  options: ExtrapolationType,
  result: T,
) => T;

export const useInterpolator = <T>(
  factory: () => T,
  value: SharedValue<number>,
  interpolator: Interpolator<T>,
  input: number[],
  output: T[],
  options?: ExtrapolationType,
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const init = useMemo(() => factory(), []);
  const result = useSharedValue(init);
  useAnimatedReaction(
    () => value.value,
    (val) => {
      result.value = interpolator(val, input, output, options, result.value);
      notifyChange(result);
    },
    [input, output, options],
  );
  return result;
};

/**
 * Builds a react-native-reanimated animation based on the configuration.
 *
 * @param targetValue - The target value to animate to
 * @param config - The transition configuration
 * @returns The animation value to assign to a shared value
 *
 * @example
 * // Use directly for animation
 * progress.value = 0;
 * progress.value = buildTransition(1, { type: 'spring', damping: 10, stiffness: 100 });
 *
 * @example
 * // Coordinate animations
 * animatedX.value = buildTransition(100, { type: 'spring', damping: 10, stiffness: 100 });
 * animatedY.value = buildTransition(200, { type: 'spring', damping: 10, stiffness: 100 });
 *
 * @example
 * // Timing animation
 * progress.value = buildTransition(1, { type: 'timing', duration: 500 });
 */
export const buildTransition = (targetValue: number, config: TransitionConfig): number => {
  'worklet';

  switch (config.type) {
    case 'timing': {
      const { type, ...timingConfig } = config;
      return withTiming(targetValue, timingConfig);
    }
    case 'spring': {
      const { type, ...springConfig } = config;
      return withSpring(targetValue, springConfig);
    }
    default: {
      // Fallback to default transition config
      const { type, ...springConfig } = defaultTransition;
      return withSpring(targetValue, springConfig);
    }
  }
};

/**
 * Custom hook that manages path animation state and transitions.
 * Handles both simple path-to-path transitions and enter animations with different configs.
 * When path changes, the animation will start from the previous completed position to the new path.
 * Supports AnimatedProp<string> for currentPath to respond to SharedValue changes without React re-renders.
 *
 * @param currentPath - Current target path to animate to (can be string or SharedValue<string>)
 * @param initialPath - Initial path for enter animation. When provided, the first animation will go from initialPath to currentPath. If not provided, defaults to currentPath (no enter animation)
 * @param transitionConfigs - Transition configurations for different animation phases
 * @returns Animated SkPath as a shared value
 *
 * @example
 * // Simple path transition (like SolidLine)
 * const path = usePathTransition({
 *   currentPath: d ?? '',
 *   transitionConfigs: {
 *     update: { type: 'timing', duration: 3000 }
 *   }
 * });
 *
 * @example
 * // With SharedValue for currentPath
 * const animatedPath = useSharedValue('M0,0 L100,100');
 * const path = usePathTransition({
 *   currentPath: animatedPath,
 *   transitionConfigs: {
 *     update: { type: 'spring', damping: 20, stiffness: 300 }
 *   }
 * });
 *
 * @example
 * // Enter animation with different initial config (like DefaultBar)
 * const path = usePathTransition({
 *   currentPath: targetPath,
 *   initialPath: baselinePath,
 *   transitionConfigs: {
 *     enter: { type: 'timing', duration: 1000 },
 *     update: { type: 'timing', duration: 300 }
 *   }
 * });
 */
export const usePathTransition = ({
  currentPath,
  initialPath,
  transitionConfigs,
}: {
  /**
   * Current target path to animate to (can be string or SharedValue<string>).
   */
  currentPath: AnimatedProp<string>;
  /**
   * Initial path for enter animation.
   * When provided, the first animation will go from initialPath to currentPath.
   * If not provided, defaults to currentPath (no enter animation).
   */
  initialPath?: string;
  /**
   * Transition configurations for different animation phases.
   */
  transitionConfigs?: {
    /**
     * Transition used when the path first enters/mounts.
     */
    enter?: TransitionConfig;
    /**
     * Transition used when the path morphs to new data.
     */
    update?: TransitionConfig;
  };
}): SharedValue<SkPath> => {
  const isInitialRender = useRef(true);
  const progress = useSharedValue(0);

  // Get initial path value
  const initialCurrentPath = unwrapAnimatedValue(currentPath);
  const previousPathRef = useRef(initialPath ?? initialCurrentPath);
  const targetPathRef = useRef(initialCurrentPath);

  // Shared values to track path state in worklet context
  const fromPathSV = useSharedValue(previousPathRef.current);
  const toPathSV = useSharedValue(targetPathRef.current);

  // Handle path changes using useAnimatedReaction for SharedValue support
  useAnimatedReaction(
    () => unwrapAnimatedValue(currentPath),
    (newPath, previousPath) => {
      'worklet';

      // Skip if path hasn't actually changed
      if (newPath === previousPath) {
        return;
      }

      const currentProgress = progress.value;
      const isInterrupting = currentProgress > 0 && currentProgress < 1;

      let startPath: string;

      if (isInterrupting) {
        // Animation was interrupted - capture current interpolated path
        const pathInterpolator = interpolate.interpolatePath(fromPathSV.value, toPathSV.value);
        startPath = pathInterpolator(currentProgress);
      } else {
        // Normal transition (from completed position to new target)
        startPath = toPathSV.value;
      }

      // Update path state
      fromPathSV.value = startPath;
      toPathSV.value = newPath;

      // Determine which config to use
      const configToUse = transitionConfigs?.update ?? defaultTransition;

      // Start animation
      progress.value = 0;
      progress.value = buildTransition(1, configToUse);
    },
    [transitionConfigs],
  );

  // Handle initial render and enter animation
  useEffect(() => {
    if (isInitialRender.current) {
      const currentPathValue = unwrapAnimatedValue(currentPath);
      const hasInitialPath = initialPath !== undefined;

      if (hasInitialPath) {
        // Set up enter animation
        fromPathSV.value = initialPath;
        toPathSV.value = currentPathValue;

        const configToUse = transitionConfigs?.enter ?? defaultTransition;
        progress.value = 0;
        progress.value = buildTransition(1, configToUse);
      } else {
        // No enter animation - start at current path
        fromPathSV.value = currentPathValue;
        toPathSV.value = currentPathValue;
        progress.value = 1;
      }

      // Update refs
      previousPathRef.current = fromPathSV.value;
      targetPathRef.current = toPathSV.value;

      isInitialRender.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath, initialPath, transitionConfigs]);

  return useD3PathInterpolation(progress, fromPathSV.value, toPathSV.value);
};

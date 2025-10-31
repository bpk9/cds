import { useEffect, useRef } from 'react';
import { interpolatePath } from 'd3-interpolate-path';
import {
  animate as framerAnimate,
  type AnimationPlaybackControls,
  type MotionValue,
  type Transition,
  useMotionValue,
  useTransform,
} from 'framer-motion';

/**
 * Default transition configuration used across all chart components.
 * Uses a smooth spring animation with balanced stiffness and damping.
 */
export const defaultTransition: Transition = {
  type: 'spring',
  stiffness: 900,
  damping: 120,
  mass: 4,
};

/**
 * Custom hook that manages path animation state and transitions using d3-interpolate-path
 * with framer-motion's transition system (supports springs, tweens, etc.).
 *
 * This provides smooth path morphing with configurable transition types.
 * When the path changes, the animation will start from the previous completed position to the new path.
 *
 * @param currentPath - Current target path to animate to
 * @param initialPath - Initial path for enter animation. When provided, the first animation will go from initialPath to currentPath. If not provided, defaults to currentPath (no enter animation)
 * @param transitionConfigs - Transition configurations for different animation phases
 * @returns MotionValue containing the current interpolated path string
 *
 * @example
 * // Simple path transition with spring
 * const animatedPath = usePathTransition({
 *   currentPath: d ?? '',
 *   transitionConfigs: {
 *     update: { type: 'spring', stiffness: 300, damping: 20 }
 *   }
 * });
 *
 * @example
 * // Enter animation with different initial config
 * const animatedPath = usePathTransition({
 *   currentPath: targetPath,
 *   initialPath: baselinePath,
 *   transitionConfigs: {
 *     enter: { type: 'spring', duration: 0.6 },
 *     update: { type: 'tween', duration: 0.3, ease: 'easeInOut' }
 *   }
 * });
 */
export const usePathTransition = ({
  currentPath,
  initialPath,
  transitionConfigs,
}: {
  /**
   * Current target path to animate to.
   */
  currentPath: string;
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
    enter?: Transition;
    /**
     * Transition used when the path morphs to new data.
     */
    update?: Transition;
  };
}): MotionValue<string> => {
  const isInitialRender = useRef(true);
  const previousPathRef = useRef(initialPath ?? currentPath);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const progress = useMotionValue(0);
  const targetPathRef = useRef(currentPath);

  // Store transition configs in a ref so they don't trigger effect re-runs
  const transitionConfigsRef = useRef(transitionConfigs);
  transitionConfigsRef.current = transitionConfigs;

  // Derive the interpolated path from progress using useTransform
  const interpolatedPath = useTransform(progress, (latest) => {
    const pathInterpolator = interpolatePath(previousPathRef.current, targetPathRef.current);
    return pathInterpolator(latest);
  });

  useEffect(() => {
    console.log('⚡ useEffect triggered', {
      targetMatchesCurrent: targetPathRef.current === currentPath,
      hasAnimation: !!animationRef.current,
    });

    // Only proceed if the target path has actually changed
    if (targetPathRef.current !== currentPath) {
      // Cancel any ongoing animation before starting a new one
      const wasAnimating = !!animationRef.current;
      if (animationRef.current) {
        console.log('🛑 Cancelling existing animation');
        animationRef.current.cancel();
        animationRef.current = null;
      }

      // ALWAYS capture the current interpolated path
      // This is our source of truth for where we currently are
      const currentInterpolatedPath = interpolatedPath.get();

      console.log('🔄 Path change detected', {
        wasAnimating,
        currentTarget: targetPathRef.current.substring(0, 50) + '...',
        newPath: currentPath.substring(0, 50) + '...',
        currentInterpolatedPath: currentInterpolatedPath.substring(0, 50) + '...',
      });

      // If we were animating, the interpolated path is our current position
      // Use it as the starting point for the next animation
      if (
        wasAnimating &&
        currentInterpolatedPath !== previousPathRef.current &&
        currentInterpolatedPath !== currentPath
      ) {
        console.log('⚠️ Animation interrupted! Using interpolated position as start');
        previousPathRef.current = currentInterpolatedPath;
      }

      targetPathRef.current = currentPath;

      // Determine which transition config to use
      const configs = transitionConfigsRef.current;
      const configToUse =
        isInitialRender.current && configs?.enter
          ? configs.enter
          : (configs?.update ?? defaultTransition);

      console.log('🚀 Starting animation', {
        configType: isInitialRender.current && configs?.enter ? 'enter' : 'update',
        fromPath: previousPathRef.current.substring(0, 50) + '...',
        toPath: targetPathRef.current.substring(0, 50) + '...',
      });

      // Animate progress from 0 to 1 using framer-motion
      progress.set(0);
      animationRef.current = framerAnimate(progress, 1, {
        ...(configToUse as any),
        onComplete: () => {
          console.log('✨ Animation complete');
          previousPathRef.current = currentPath;
        },
      } as any);

      isInitialRender.current = false;
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.cancel();
      }
    };
    // Note: progress and interpolatedPath are MotionValues with stable references.
    // Including them would cause this effect to run on every animation frame, breaking interruption logic.
    // transitionConfigs is stored in a ref to prevent re-runs when its object identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);

  return interpolatedPath;
};

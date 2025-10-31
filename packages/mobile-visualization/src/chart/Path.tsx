import { memo, type ReactNode, useMemo } from 'react';
import type { Rect, SharedProps } from '@coinbase/cds-common/types';
import { Group, Path as SkiaPath, Skia } from '@shopify/react-native-skia';

import type { TransitionConfig } from './utils/transition';
import { usePathTransition } from './utils/transition';
import { useCartesianChartContext } from './ChartProvider';

export type PathProps = SharedProps & {
  /**
   * The SVG path data string.
   */
  d?: string;
  /**
   * Children for declarative shaders (e.g., LinearGradient, ImageShader).
   */
  children?: ReactNode;
  /**
   * Path fill color.
   */
  fill?: string;
  /**
   * Path fill opacity.
   */
  fillOpacity?: number;
  /**
   * Path stroke color.
   */
  stroke?: string;
  /**
   * Path stroke opacity.
   */
  strokeOpacity?: number;
  /**
   * Path stroke width.
   */
  strokeWidth?: number;
  /**
   * Stroke line cap.
   */
  strokeLinecap?: 'butt' | 'round' | 'square';
  /**
   * Stroke line join.
   */
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  /**
   * Whether to animate this path. Overrides the animate prop on the Chart component.
   */
  animate?: boolean;
  /**
   * Custom clip path rect. If provided, this overrides the default chart rect for clipping.
   */
  clipRect?: Rect;
  /**
   * The offset to add to the clip rect boundaries.
   */
  clipOffset?: number;
  /**
   * Transition configurations for different animation phases.
   * Allows separate control over enter and update animations.
   *
   * @example
   * // Fast update, slow enter
   * transitionConfigs={{
   *   enter: { type: 'spring', damping: 8, stiffness: 100 },
   *   update: { type: 'timing', duration: 300 }
   * }}
   *
   * @example
   * // Spring animation for all phases
   * transitionConfigs={{
   *   update: { type: 'spring', damping: 20, stiffness: 300 }
   * }}
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
};

const AnimatedPath = memo<Omit<PathProps, 'animate' | 'clipRect' | 'clipOffset'>>(
  ({
    d = '',
    fill,
    fillOpacity,
    stroke,
    strokeOpacity,
    strokeWidth,
    strokeLinecap,
    strokeLinejoin,
    children,
    transitionConfigs,
  }) => {
    const animatedPath = usePathTransition({
      currentPath: d,
      transitionConfigs,
    });

    const isFilled = fill !== undefined && fill !== 'none';
    const isStroked = stroke !== undefined && stroke !== 'none';

    return (
      <>
        {isFilled && (
          <SkiaPath color={fill} opacity={fillOpacity} path={animatedPath} style="fill">
            {children}
          </SkiaPath>
        )}
        {isStroked && (
          <SkiaPath
            color={stroke}
            opacity={strokeOpacity}
            path={animatedPath}
            strokeCap={strokeLinecap}
            strokeJoin={strokeLinejoin}
            strokeWidth={strokeWidth}
            style="stroke"
          >
            {children}
          </SkiaPath>
        )}
      </>
    );
  },
);

export const Path = memo<PathProps>(
  ({
    animate: animateProp,
    clipRect,
    clipOffset = 0,
    d = '',
    fill,
    fillOpacity,
    stroke,
    strokeOpacity,
    strokeWidth,
    strokeLinecap,
    strokeLinejoin,
    children,
    transitionConfigs,
  }) => {
    const context = useCartesianChartContext();
    const rect = clipRect ?? context.drawingArea;
    const animate = animateProp ?? context.animate;

    // The clip offset provides extra padding to prevent path from being cut off
    // Area charts typically use offset=0 for exact clipping, while lines use offset=2 for breathing room
    const totalOffset = clipOffset * 2; // Applied on both sides

    // Create clip path from rect
    const clipPath = useMemo(() => {
      if (!rect) return null;

      const path = Skia.Path.Make();
      path.addRect({
        x: rect.x - clipOffset,
        y: rect.y - clipOffset,
        width: rect.width + totalOffset,
        height: rect.height + totalOffset,
      });
      return path;
    }, [rect, clipOffset, totalOffset]);

    // Convert SVG path string to SkPath for static rendering
    const staticPath = useMemo(() => {
      return Skia.Path.MakeFromSVGString(d) ?? Skia.Path.Make();
    }, [d]);

    const isFilled = fill !== undefined && fill !== 'none';
    const isStroked = stroke !== undefined && stroke !== 'none';

    if (!clipPath) return null;

    return (
      <Group clip={clipPath}>
        {!animate ? (
          <>
            {isFilled && (
              <SkiaPath color={fill} opacity={fillOpacity} path={staticPath} style="fill">
                {children}
              </SkiaPath>
            )}
            {isStroked && (
              <SkiaPath
                color={stroke}
                opacity={strokeOpacity}
                path={staticPath}
                strokeCap={strokeLinecap}
                strokeJoin={strokeLinejoin}
                strokeWidth={strokeWidth}
                style="stroke"
              >
                {children}
              </SkiaPath>
            )}
          </>
        ) : (
          <AnimatedPath
            d={d}
            fill={fill}
            fillOpacity={fillOpacity}
            stroke={stroke}
            strokeLinecap={strokeLinecap}
            strokeLinejoin={strokeLinejoin}
            strokeOpacity={strokeOpacity}
            strokeWidth={strokeWidth}
            transitionConfigs={transitionConfigs}
          >
            {children}
          </AnimatedPath>
        )}
      </Group>
    );
  },
);

import { memo, useEffect, useRef } from 'react';
import { m as motion, type Transition } from 'framer-motion';

import { useCartesianChartContext } from '../ChartProvider';
import type { GradientConfig } from '../utils/gradient';
import { defaultTransition } from '../utils/transition';

export type GradientProps = {
  /**
   * Unique ID for the gradient definition.
   * Will be used in `url(#${id})` references.
   */
  id: string;
  /**
   * Gradient configuration with colors and positions.
   */
  config: GradientConfig;
  /**
   * Gradient direction.
   * - 'vertical': Top to bottom (for y-axis colormaps)
   * - 'horizontal': Left to right (for x-axis colormaps)
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal';
  /**
   * Drawing area bounds for userSpaceOnUse gradients.
   * When provided, uses absolute coordinates instead of percentages.
   * This ensures the gradient maps consistently across different shapes (line vs area).
   */
  drawingArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /**
   * Whether to animate gradient changes.
   */
  animate?: boolean;
  /**
   * Transition configurations for different animation phases.
   * Allows separate control over enter and update animations.
   */
  transitionConfigs?: {
    /**
     * Transition used when the gradient first enters/mounts.
     */
    enter?: Transition;
    /**
     * Transition used when the gradient changes.
     */
    update?: Transition;
  };
};

/**
 * Renders an SVG linearGradient element based on a GradientConfig.
 * The gradient can be referenced via `fill="url(#${id})"` or `stroke="url(#${id})"`.
 */
export const Gradient = memo<GradientProps>(
  ({
    id,
    config,
    direction = 'vertical',
    drawingArea,
    animate: animateProp,
    transitionConfigs,
  }) => {
    const context = useCartesianChartContext();
    const animate = animateProp ?? context.animate;
    const { colors, positions, opacities } = config;
    const isInitialRender = useRef(true);

    // Determine gradient units and coordinates
    let gradientUnits: 'objectBoundingBox' | 'userSpaceOnUse' = 'objectBoundingBox';
    let coordinates: Record<string, string | number>;

    if (drawingArea) {
      // Use userSpaceOnUse with absolute coordinates
      // This ensures line and area use the same gradient mapping
      gradientUnits = 'userSpaceOnUse';
      const { x, y, width, height } = drawingArea;

      if (direction === 'vertical') {
        // Vertical: bottom to top (y increases downward in SVG)
        coordinates = {
          x1: x,
          y1: y + height, // Bottom
          x2: x,
          y2: y, // Top
        };
      } else {
        // Horizontal: left to right
        coordinates = {
          x1: x,
          y1: y,
          x2: x + width,
          y2: y,
        };
      }
    } else {
      // Use objectBoundingBox with percentages (legacy behavior)
      coordinates =
        direction === 'vertical'
          ? { x1: '0%', y1: '100%', x2: '0%', y2: '0%' }
          : { x1: '0%', y1: '0%', x2: '100%', y2: '0%' };
    }

    // Determine which transition to use
    const transition =
      isInitialRender.current && transitionConfigs?.enter
        ? transitionConfigs.enter
        : (transitionConfigs?.update ?? defaultTransition);

    // Mark as no longer initial render after first animation is set up
    useEffect(() => {
      if (animate && config) {
        isInitialRender.current = false;
      }
    }, [animate, config]);

    return (
      <linearGradient gradientUnits={gradientUnits} id={id} {...coordinates}>
        {colors.map((color, index) => {
          const offset = `${positions[index] * 100}%`;
          const opacity = opacities?.[index];

          if (!animate) {
            return (
              <stop
                key={`${id}-stop-${index}`}
                offset={offset}
                stopColor={color}
                {...(opacity !== undefined && { stopOpacity: opacity })}
              />
            );
          }

          return (
            <motion.stop
              key={`${id}-stop-${index}`}
              animate={{
                offset,
                stopColor: color,
                ...(opacity !== undefined && { stopOpacity: opacity }),
              }}
              initial={{
                offset,
                stopColor: color,
                ...(opacity !== undefined && { stopOpacity: opacity }),
              }}
              transition={transition}
            />
          );
        })}
      </linearGradient>
    );
  },
);

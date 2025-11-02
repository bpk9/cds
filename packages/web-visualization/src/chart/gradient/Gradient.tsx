import { memo, useEffect, useRef } from 'react';
import { m as motion, type Transition } from 'framer-motion';

import { useCartesianChartContext } from '../ChartProvider';
import type { GradientStop } from '../utils';
import { defaultTransition } from '../utils/transition';

export type GradientProps = {
  /**
   * Unique ID for the gradient definition.
   * Will be used in `url(#${id})` references.
   */
  id: string;
  /**
   * Gradient stops with colors and positions.
   */
  stops: GradientStop[];
  /**
   * Axis that the gradient maps to.
   * - 'y': Vertical gradient (top to bottom)
   * - 'x': Horizontal gradient (left to right)
   * @default 'y'
   */
  axis?: 'x' | 'y';
  /**
   * Y-axis ID to use when axis is 'y'.
   * When provided, the gradient will align with the specified y-axis range.
   * This ensures gradients work correctly when the axis has a custom range configuration.
   */
  yAxisId?: string;
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
  ({ id, stops, axis = 'y', yAxisId, animate: animateProp, transitionConfigs }) => {
    const context = useCartesianChartContext();
    const animate = animateProp ?? context.animate;
    const isInitialRender = useRef(true);

    // Determine which transition to use
    const transition =
      isInitialRender.current && transitionConfigs?.enter
        ? transitionConfigs.enter
        : (transitionConfigs?.update ?? defaultTransition);

    // Mark as no longer initial render after first animation is set up
    useEffect(() => {
      if (animate && Array.isArray(stops)) {
        isInitialRender.current = false;
      }
    }, [animate, stops]);

    const drawingArea = context.drawingArea;
    const yAxis = context.getYAxis(yAxisId);
    const xAxis = context.getXAxis();

    let coordinates: Record<string, number>;

    if (axis === 'y') {
      const yRange = yAxis?.range;
      if (yRange) {
        coordinates = {
          x1: drawingArea.x,
          y1: yRange.max,
          x2: drawingArea.x,
          y2: yRange.min,
        };
      } else {
        coordinates = {
          x1: drawingArea.x,
          y1: drawingArea.y + drawingArea.height,
          x2: drawingArea.x,
          y2: drawingArea.y,
        };
      }
    } else {
      const xRange = xAxis?.range;
      if (xRange) {
        coordinates = {
          x1: xRange.min,
          y1: drawingArea.y,
          x2: xRange.max,
          y2: drawingArea.y,
        };
      } else {
        coordinates = {
          x1: drawingArea.x,
          y1: drawingArea.y,
          x2: drawingArea.x + drawingArea.width,
          y2: drawingArea.y,
        };
      }
    }

    return (
      <linearGradient gradientUnits="userSpaceOnUse" id={id} {...coordinates}>
        {stops.map((stop, index) => {
          const offset = `${stop.offset * 100}%`;
          const opacity = stop.opacity;

          if (!animate) {
            return (
              <stop
                key={`${id}-stop-${index}`}
                offset={offset}
                stopColor={stop.color}
                stopOpacity={opacity ?? 1}
              />
            );
          }

          return (
            <motion.stop
              key={`${id}-stop-${index}`}
              animate={{
                offset,
              }}
              initial={{
                offset,
              }}
              stopColor={stop.color}
              stopOpacity={opacity ?? 1}
              transition={transition}
            />
          );
        })}
      </linearGradient>
    );
  },
);

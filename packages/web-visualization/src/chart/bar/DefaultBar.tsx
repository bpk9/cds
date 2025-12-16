import React, { memo, useMemo } from 'react';
import { m as motion } from 'framer-motion';

import { useCartesianChartContext } from '../ChartProvider';
import { getBarPath } from '../utils';

import type { BarComponentProps } from './Bar';

/**
 * Creates an SVG path string for a horizontal bar with selective corner rounding.
 * Used for horizontal bar charts where bars extend left/right from a baseline.
 */
const getHorizontalBarPath = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  roundRight: boolean,
  roundLeft: boolean,
): string => {
  const roundBothSides = roundRight && roundLeft;
  const r = Math.min(radius, height / 2, roundBothSides ? width / 2 : width);
  const rightR = roundRight ? r : 0;
  const leftR = roundLeft ? r : 0;

  // Build path with selective rounding
  // Start at top-left, go clockwise
  let path = `M ${x + leftR} ${y}`;

  // Top edge to top-right
  path += ` L ${x + width - rightR} ${y}`;

  // Top-right corner
  path += ` A ${rightR} ${rightR} 0 0 1 ${x + width} ${y + rightR}`;

  // Right edge to bottom-right
  path += ` L ${x + width} ${y + height - rightR}`;

  // Bottom-right corner
  path += ` A ${rightR} ${rightR} 0 0 1 ${x + width - rightR} ${y + height}`;

  // Bottom edge to bottom-left
  path += ` L ${x + leftR} ${y + height}`;

  // Bottom-left corner
  path += ` A ${leftR} ${leftR} 0 0 1 ${x} ${y + height - leftR}`;

  // Left edge to top-left
  path += ` L ${x} ${y + leftR}`;

  // Top-left corner
  path += ` A ${leftR} ${leftR} 0 0 1 ${x + leftR} ${y}`;

  path += ' Z';
  return path;
};

export type DefaultBarProps = BarComponentProps & {
  /**
   * Custom class name for the bar.
   */
  className?: string;
  /**
   * Custom styles for the bar.
   */
  style?: React.CSSProperties;
  /**
   * X coordinate of the baseline/origin for horizontal bar animations.
   * When provided, the bar animates horizontally from this origin.
   */
  originX?: number;
};

/**
 * Default bar component that renders a solid bar with animation.
 * Supports both vertical bars (animating from originY) and horizontal bars (animating from originX).
 */
export const DefaultBar = memo<DefaultBarProps>(
  ({
    x,
    y,
    width,
    height,
    borderRadius = 4,
    roundTop,
    roundBottom,
    originY,
    originX,
    d,
    fill = 'var(--color-fgPrimary)',
    fillOpacity = 1,
    dataX,
    dataY,
    transition,
    ...props
  }) => {
    const { animate, orientation } = useCartesianChartContext();

    const initialPath = useMemo(() => {
      if (!animate) return undefined;

      // For horizontal bars (vertical orientation), animate from originX
      if (orientation === 'vertical' && originX !== undefined) {
        const minWidth = 1;
        // Initial position: thin bar at the baseline (originX)
        const initialX = originX;
        return getHorizontalBarPath(
          initialX,
          y,
          minWidth,
          height,
          borderRadius,
          !!roundTop, // roundRight
          !!roundBottom, // roundLeft
        );
      }

      // For vertical bars (horizontal orientation), animate from originY
      const minHeight = 1;
      const initialY = (originY ?? 0) - minHeight;
      return getBarPath(x, initialY, width, minHeight, borderRadius, !!roundTop, !!roundBottom);
    }, [
      animate,
      orientation,
      originX,
      originY,
      x,
      y,
      width,
      height,
      borderRadius,
      roundTop,
      roundBottom,
    ]);

    if (animate && initialPath) {
      return (
        <motion.path
          {...props}
          animate={{ d }}
          fill={fill}
          fillOpacity={fillOpacity}
          initial={{ d: initialPath }}
          transition={transition}
        />
      );
    }

    return <path {...props} d={d} fill={fill} fillOpacity={fillOpacity} />;
  },
);

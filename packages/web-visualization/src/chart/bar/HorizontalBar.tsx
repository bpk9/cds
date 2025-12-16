import React, { memo, useMemo } from 'react';
import type { SVGProps } from 'react';
import type { Transition } from 'framer-motion';

import { DefaultBar } from './';
import type { BarComponent } from './Bar';

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

export type HorizontalBarBaseProps = {
  /**
   * The series ID this bar belongs to.
   */
  seriesId?: string;
  /**
   * X coordinate of the bar (left edge).
   */
  x: number;
  /**
   * Y coordinate of the bar (top edge).
   */
  y: number;
  /**
   * Width of the bar.
   */
  width: number;
  /**
   * Height of the bar.
   */
  height: number;
  /**
   * Border radius for the bar.
   * @default 4
   */
  borderRadius?: number;
  /**
   * Whether to round the right side of the bar (away from baseline for positive values).
   */
  roundRight?: boolean;
  /**
   * Whether to round the left side of the bar (toward baseline for positive values).
   */
  roundLeft?: boolean;
  /**
   * X coordinate of the baseline/origin for animations.
   * Used to calculate initial animation state.
   */
  originX?: number;
  /**
   * The x-axis data value for this bar.
   */
  dataX?: number | [number, number] | null;
  /**
   * The y-axis data value for this bar (category index).
   */
  dataY?: number | string;
  /**
   * Fill color for the bar.
   */
  fill?: string;
  /**
   * Fill opacity for the bar.
   */
  fillOpacity?: number;
  /**
   * Stroke color for the bar outline.
   */
  stroke?: string;
  /**
   * Stroke width for the bar outline.
   */
  strokeWidth?: number;
  /**
   * Component to render the bar.
   */
  BarComponent?: BarComponent;
};

export type HorizontalBarProps = HorizontalBarBaseProps & {
  /**
   * Transition configuration for animation.
   */
  transition?: Transition;
};

export type HorizontalBarComponentProps = Omit<HorizontalBarProps, 'BarComponent'> & {
  /**
   * The path data for the bar shape.
   */
  d: SVGProps<SVGPathElement>['d'];
};

/**
 * Horizontal bar component that renders a single bar extending horizontally.
 * Used in vertical orientation charts where bars extend left/right from a baseline.
 *
 * @example
 * ```tsx
 * <HorizontalBar x={10} y={20} width={100} height={30} fill="blue" />
 * ```
 */
export const HorizontalBar = memo<HorizontalBarProps>(
  ({
    seriesId,
    x,
    y,
    width,
    height,
    originX,
    dataX,
    dataY,
    BarComponent = DefaultBar,
    fill = 'var(--color-fgPrimary)',
    fillOpacity = 1,
    stroke,
    strokeWidth,
    borderRadius = 4,
    roundRight = true,
    roundLeft = true,
    transition,
  }) => {
    const barPath = useMemo(() => {
      return getHorizontalBarPath(x, y, width, height, borderRadius, roundRight, roundLeft);
    }, [x, y, width, height, borderRadius, roundRight, roundLeft]);

    const effectiveOriginX = originX ?? x;

    if (!barPath) return;

    // Map horizontal bar props to BarComponent props
    // BarComponent expects roundTop/roundBottom, we map roundRight/roundLeft
    // dataX can be number | [number, number] | null, but BarComponent expects number | string | undefined
    const normalizedDataX =
      dataX === null ? undefined : Array.isArray(dataX) ? dataX[dataX.length - 1] : dataX;

    return (
      <BarComponent
        borderRadius={borderRadius}
        d={barPath}
        dataX={normalizedDataX}
        dataY={typeof dataY === 'number' ? dataY : undefined}
        fill={fill}
        fillOpacity={fillOpacity}
        height={height}
        originX={effectiveOriginX} // For horizontal bars, animate from X baseline
        originY={y}
        roundBottom={roundLeft}
        roundTop={roundRight}
        seriesId={seriesId}
        stroke={stroke}
        strokeWidth={strokeWidth}
        transition={transition}
        width={width}
        x={x}
        y={y}
      />
    );
  },
);

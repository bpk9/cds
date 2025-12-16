import { memo, useId, useMemo } from 'react';
import { m as motion } from 'framer-motion';

import { useCartesianChartContext } from '../ChartProvider';
import { getBarPath } from '../utils';

import type { BarStackComponentProps } from './BarStack';

/**
 * Creates an SVG path string for a horizontal bar with selective corner rounding.
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

  let path = `M ${x + leftR} ${y}`;
  path += ` L ${x + width - rightR} ${y}`;
  path += ` A ${rightR} ${rightR} 0 0 1 ${x + width} ${y + rightR}`;
  path += ` L ${x + width} ${y + height - rightR}`;
  path += ` A ${rightR} ${rightR} 0 0 1 ${x + width - rightR} ${y + height}`;
  path += ` L ${x + leftR} ${y + height}`;
  path += ` A ${leftR} ${leftR} 0 0 1 ${x} ${y + height - leftR}`;
  path += ` L ${x} ${y + leftR}`;
  path += ` A ${leftR} ${leftR} 0 0 1 ${x + leftR} ${y}`;
  path += ' Z';
  return path;
};

export type DefaultBarStackProps = BarStackComponentProps & {
  /**
   * Custom class name for the stack group.
   */
  className?: string;
  /**
   * Custom styles for the stack group.
   */
  style?: React.CSSProperties;
  /**
   * X coordinate of the baseline/origin for horizontal bar animations.
   */
  xOrigin?: number;
};

/**
 * Default stack component that renders children in a group with animated clip path.
 * Supports both vertical bars (animating from yOrigin) and horizontal bars (animating from xOrigin).
 */
export const DefaultBarStack = memo<DefaultBarStackProps>(
  ({
    children,
    className,
    style,
    width,
    height,
    x,
    y,
    borderRadius = 4,
    roundTop = true,
    roundBottom = true,
    yOrigin,
    xOrigin,
    transition,
  }) => {
    const { animate, orientation } = useCartesianChartContext();
    const clipPathId = useId();

    const clipPathData = useMemo(() => {
      if (orientation === 'vertical') {
        // For horizontal bars, roundTop = roundRight, roundBottom = roundLeft
        return getHorizontalBarPath(x, y, width, height, borderRadius, roundTop, roundBottom);
      }
      return getBarPath(x, y, width, height, borderRadius, roundTop, roundBottom);
    }, [x, y, width, height, borderRadius, roundTop, roundBottom, orientation]);

    const initialClipPathData = useMemo(() => {
      if (!animate) return undefined;

      if (orientation === 'vertical') {
        // For horizontal bars, animate from xOrigin (baseline)
        const initialX = xOrigin ?? x;
        return getHorizontalBarPath(initialX, y, 1, height, borderRadius, roundTop, roundBottom);
      }

      // For vertical bars, animate from yOrigin (baseline)
      return getBarPath(x, yOrigin ?? y + height, width, 1, borderRadius, roundTop, roundBottom);
    }, [animate, orientation, x, xOrigin, y, yOrigin, height, width, borderRadius, roundTop, roundBottom]);

    return (
      <>
        <defs>
          <clipPath id={clipPathId}>
            {animate ? (
              <motion.path
                animate={{ d: clipPathData }}
                initial={{ d: initialClipPathData }}
                transition={transition}
              />
            ) : (
              <path d={clipPathData} />
            )}
          </clipPath>
        </defs>
        <g className={className} clipPath={`url(#${clipPathId})`} style={style}>
          {children}
        </g>
      </>
    );
  },
);

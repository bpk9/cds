import React, { memo, useMemo } from 'react';
import { getBarPath } from '@coinbase/cds-common/visualizations/charts';
import { m as motion } from 'framer-motion';

import { useCartesianChartContext } from '../ChartProvider';

import type { BarComponentProps } from './Bar';

export type DefaultBarBaseProps = BarComponentProps;

export type DefaultBarProps = DefaultBarBaseProps & {
  /**
   * Custom class name for the bar.
   */
  className?: string;
  /**
   * Custom styles for the bar.
   */
  style?: React.CSSProperties;
};

/**
 * Default bar component that renders a solid bar with animation.
 */
export const DefaultBar = memo<DefaultBarProps>(
  ({
    x,
    width,
    borderRadius,
    roundTop,
    roundBottom,
    originY,
    d,
    fill = 'var(--color-fgPrimary)',
    fillOpacity = 1,
    dataX,
    dataY,
    ...props
  }) => {
    const { animate } = useCartesianChartContext();
    const initialPath = useMemo(() => {
      if (!animate) return undefined;
      // Need a minimum height to allow for animation
      const minHeight = 1;
      const initialY = originY - minHeight;
      return getBarPath(x, initialY, width, minHeight, borderRadius, roundTop, roundBottom);
    }, [animate, x, originY, width, borderRadius, roundTop, roundBottom]);

    if (animate && initialPath) {
      return (
        <motion.path
          {...props}
          animate={{ d }}
          fill={fill}
          fillOpacity={fillOpacity}
          initial={{ d: initialPath }}
          transition={{ type: 'spring', duration: 1, bounce: 0 }}
        />
      );
    }

    return <path {...props} d={d} fill={fill} fillOpacity={fillOpacity} />;
  },
);

import React, { memo, useRef } from 'react';
import { generateRandomId } from '@coinbase/cds-utils';

import { useChartContext } from '../ChartContext';
import { Path, type PathProps } from '../Path';

import type { AreaComponentProps } from './Area';

export type GradientAreaProps = Omit<PathProps, 'd' | 'fill' | 'fillOpacity'> &
  AreaComponentProps & {
    /**
     * The color of the start of the gradient.
     * @default fill or 'var(--color-fgPrimary)'
     */
    startColor?: string;
    /**
     * The color of the end of the gradient.
     * @default fill or 'var(--color-fgPrimary)'
     */
    endColor?: string;
    /**
     * Opacity of the start color.
     */
    startOpacity?: number;
    /**
     * Opacity of the end color.
     */
    endOpacity?: number;
  };

/**
 * A customizable gradient area component which uses Path.
 */
export const GradientArea = memo<GradientAreaProps>(
  ({
    d,
    fill = 'var(--color-fgPrimary)',
    fillOpacity = 1,
    startColor,
    endColor,
    startOpacity = 0.4 * fillOpacity,
    endOpacity = 0,
    disableAnimations,
    clipRect,
    ...pathProps
  }) => {
    const context = useChartContext();
    const patternIdRef = useRef<string>(generateRandomId());

    return (
      <>
        <defs>
          <linearGradient id={patternIdRef.current} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={startColor ?? fill} stopOpacity={startOpacity} />
            <stop offset="100%" stopColor={endColor ?? fill} stopOpacity={endOpacity} />
          </linearGradient>
        </defs>
        <Path
          clipRect={clipRect}
          d={d}
          disableAnimations={
            disableAnimations !== undefined ? disableAnimations : context.disableAnimations
          }
          fill={`url(#${patternIdRef.current})`}
          {...pathProps}
        />
      </>
    );
  },
);

import React, { memo, useRef } from 'react';
import { useSparklineAreaOpacity } from '@coinbase/cds-common/visualizations/useSparklineAreaOpacity';
import { generateRandomId } from '@coinbase/cds-utils';
import { useTheme } from '@coinbase/cds-web/hooks/useTheme';

import { useChartContext } from '../ChartContext';
import { Path, type PathProps } from '../Path';

import type { AreaComponentProps } from './Area';

export type DottedAreaProps = Omit<PathProps, 'd' | 'fill' | 'fillOpacity'> &
  AreaComponentProps & {
    /**
     * Size of the pattern unit (width and height).
     * @default 4
     */
    patternSize?: number;
    /**
     * Size of the dots within the pattern.
     * @default 1
     */
    dotSize?: number;
    className?: string;
    style?: React.CSSProperties;
    /**
     * Custom class names for the component.
     */
    classNames?: {
      /**
       * Custom class name for the root element.
       */
      root?: string;
      /**
       * Custom class name for the pattern element.
       */
      pattern?: string;
      /**
       * Custom class name for the area path element.
       */
      path?: string;
    };
    /**
     * Custom styles for the component.
     */
    styles?: {
      /**
       * Custom styles for the root element.
       */
      root?: React.CSSProperties;
      /**
       * Custom styles for the pattern element.
       */
      pattern?: React.CSSProperties;
      /**
       * Custom styles for the area path element.
       */
      path?: React.CSSProperties;
    };
  };

export const DottedArea = memo<DottedAreaProps>(
  ({
    d,
    fill,
    // todo: fillOpacity, fix this opacity, default is normally 1 but we want useSparklineAreaOpacity
    className,
    style,
    patternSize = 4,
    dotSize = 1,
    classNames,
    styles,
    disableAnimations,
    clipRect,
    ...pathProps
  }) => {
    const context = useChartContext();
    const { activeColorScheme } = useTheme();
    const patternIdRef = useRef<string>(generateRandomId());

    const defaultFillOpacity = useSparklineAreaOpacity(activeColorScheme);
    const effectiveFillOpacity = defaultFillOpacity; // fillOpacity ?? defaultFillOpacity;

    const dotCenterPosition = patternSize / 2;

    return (
      <g className={className ?? classNames?.root} style={style ?? styles?.root}>
        <defs>
          <pattern
            className={classNames?.pattern}
            height={patternSize}
            id={patternIdRef.current}
            patternUnits="userSpaceOnUse"
            style={styles?.pattern}
            width={patternSize}
            x="0"
            y="0"
          >
            <circle
              cx={dotCenterPosition}
              cy={dotCenterPosition}
              fill={fill}
              fillOpacity={effectiveFillOpacity}
              r={dotSize}
            />
          </pattern>
        </defs>
        <Path
          className={classNames?.path}
          clipRect={clipRect}
          d={d}
          disableAnimations={
            disableAnimations !== undefined ? disableAnimations : context.disableAnimations
          }
          fill={`url(#${patternIdRef.current})`}
          style={styles?.path}
          {...pathProps}
        />
      </g>
    );
  },
);

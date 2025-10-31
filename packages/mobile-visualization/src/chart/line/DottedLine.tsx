import { memo, useMemo } from 'react';
import type { SharedProps } from '@coinbase/cds-common/types';
import { useTheme } from '@coinbase/cds-mobile/hooks/useTheme';
import { DashPathEffect, LinearGradient, Path as SkiaPath } from '@shopify/react-native-skia';

import { useCartesianChartContext } from '../ChartProvider';
import { type PathProps } from '../Path';
import { getGradientConfig } from '../utils/gradient';
import { usePathTransition } from '../utils/transition';

import { type LineComponentProps } from './SolidLine';

export type DottedLineProps = SharedProps &
  Omit<PathProps, 'fill' | 'strokeWidth' | 'd'> &
  LineComponentProps & {
    fill?: string;
  };

/**
 * A customizable dotted line component.
 * Supports gradient for gradient effects on the dots and smooth data transitions via AnimatedPath.
 */
export const DottedLine = memo<DottedLineProps>(
  ({
    fill = 'none',
    stroke,
    strokeDasharray = '0 4',
    strokeLinecap = 'round',
    strokeLinejoin = 'round',
    strokeOpacity = 1,
    strokeWidth = 2,
    vectorEffect = 'non-scaling-stroke',
    gradient,
    seriesId,
    yAxisId,
    d,
    animate: animateProp,
    transitionConfig,
    ...props
  }) => {
    const theme = useTheme();
    const context = useCartesianChartContext();

    const xScale = context.getXScale();
    const yScale = context.getYScale(yAxisId);

    // Use prop value if provided, otherwise fall back to context
    const shouldAnimate = animateProp ?? context.animate;

    const currentPath = d ?? '';

    const gradientConfig = useMemo(() => {
      if (!gradient || !xScale || !yScale) return;
      return getGradientConfig(gradient, xScale, yScale);
    }, [gradient, xScale, yScale]);

    // Parse strokeDasharray into intervals for DashPathEffect
    // todo: change the prop to be this array instead
    const dashIntervals = useMemo(() => {
      if (!strokeDasharray) return [0, 4]; // default
      return strokeDasharray.split(/[\s,]+/).map((v) => parseFloat(v));
    }, [strokeDasharray]);

    const path = usePathTransition({
      currentPath,
      animate: shouldAnimate,
      transitionConfigs: transitionConfig ? { update: transitionConfig } : undefined,
    });

    return (
      <SkiaPath
        color={stroke ?? theme.color.bgLine}
        opacity={strokeOpacity}
        path={path}
        strokeCap={strokeLinecap}
        strokeJoin={strokeLinejoin}
        strokeWidth={strokeWidth}
        style="stroke"
      >
        <DashPathEffect intervals={dashIntervals} />
        {gradientConfig && (
          <LinearGradient
            colors={gradientConfig.colors}
            end={gradientConfig.end}
            positions={gradientConfig.positions ?? undefined}
            start={gradientConfig.start}
          />
        )}
      </SkiaPath>
    );
  },
);

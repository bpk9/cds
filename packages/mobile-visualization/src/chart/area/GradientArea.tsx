import { memo, useMemo } from 'react';
import { useTheme } from '@coinbase/cds-mobile/hooks/useTheme';
import { LinearGradient } from '@shopify/react-native-skia';

import { useCartesianChartContext } from '../ChartProvider';
import { Path, type PathProps } from '../Path';
import { applyOpacityToColor, getGradientConfig, type GradientDefinition } from '../utils/gradient';

import { type AreaComponentProps } from './SolidArea';

export type GradientAreaProps = Omit<PathProps, 'd' | 'fill' | 'fillOpacity'> &
  AreaComponentProps & {
    /**
     * Opacity at peak values.
     * @default 0.3
     */
    peakOpacity?: number;
    /**
     * Opacity at the baseline.
     * @default 0
     */
    baselineOpacity?: number;
  };

/**
 * A customizable gradient area component which uses Path with Skia linear gradient shader.
 *
 * When no gradient is provided, automatically creates an appropriate gradient:
 * - For data crossing zero: Creates a diverging gradient with peak opacity at both extremes
 *   and baseline opacity at zero (or the specified baseline).
 * - For all-positive or all-negative data: Creates a simple gradient from baseline to peak.
 */
export const GradientArea = memo<GradientAreaProps>(
  ({
    d,
    fill: fillProp,
    // todo: should we drop fillOpacity?
    fillOpacity = 1,
    gradient: gradientProp,
    seriesId,
    // todo: what about peak opacity?
    peakOpacity = 0.3,
    baselineOpacity = 0,
    baseline,
    yAxisId,
    clipRect,
    animate,
    transitionConfig,
    ...pathProps
  }) => {
    const context = useCartesianChartContext();
    const theme = useTheme();

    const fill = fillProp ?? theme.color.fgPrimary;

    const xScale = context.getXScale();
    const yScale = context.getYScale(yAxisId);
    const yAxisConfig = context.getYAxis(yAxisId);

    const gradient = useMemo((): GradientDefinition | undefined => {
      if (gradientProp) return gradientProp;
      if (!yAxisConfig) return;

      const { min, max } = yAxisConfig.domain;
      const baselineValue = min >= 0 ? min : max <= 0 ? max : (baseline ?? 0);

      // Diverging gradient (data crosses zero)
      if (min < 0 && max > 0) {
        return {
          axis: 'y',
          stops: [
            { offset: min, color: fill, opacity: peakOpacity },
            { offset: baselineValue, color: fill, opacity: baselineOpacity },
            { offset: max, color: fill, opacity: peakOpacity },
          ],
        };
      }

      // Simple gradient (all positive or all negative)
      const peakValue = min >= 0 ? max : min;
      return {
        axis: 'y',
        stops:
          max <= 0
            ? [
                { offset: peakValue, color: fill, opacity: peakOpacity },
                { offset: baselineValue, color: fill, opacity: baselineOpacity },
              ]
            : [
                { offset: baselineValue, color: fill, opacity: baselineOpacity },
                { offset: peakValue, color: fill, opacity: peakOpacity },
              ],
      };
    }, [gradientProp, yAxisConfig, fill, baseline, peakOpacity, baselineOpacity]);

    const gradientConfig = useMemo(() => {
      if (!gradient || !xScale || !yScale) return;

      const config = getGradientConfig(gradient, xScale, yScale);
      if (!config) return;

      if (fillOpacity < 1) {
        return {
          ...config,
          colors: config.colors.map((color: string) => applyOpacityToColor(color, fillOpacity)),
        };
      }

      return config;
    }, [gradient, xScale, yScale, fillOpacity]);

    if (!gradientConfig) return null;

    return (
      <Path
        animate={animate}
        clipRect={clipRect}
        d={d}
        fill={fill}
        transitionConfigs={transitionConfig ? { update: transitionConfig } : undefined}
      >
        <LinearGradient
          colors={gradientConfig.colors}
          end={gradientConfig.end}
          mode="clamp"
          positions={gradientConfig.positions}
          start={gradientConfig.start}
        />
      </Path>
    );
  },
);

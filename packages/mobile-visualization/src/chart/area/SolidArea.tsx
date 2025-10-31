import { memo, useMemo } from 'react';
import type { Rect } from '@coinbase/cds-common/types';
import { useTheme } from '@coinbase/cds-mobile/hooks/useTheme';
import { LinearGradient, Path as SkiaPath } from '@shopify/react-native-skia';

import { useCartesianChartContext } from '../ChartProvider';
import { type PathProps } from '../Path';
import { getGradientConfig, type Gradient } from '../utils/gradient';
import { type TransitionConfig, usePathTransition } from '../utils/transition';

/**
 * Shared props for area component implementations.
 * Used by SolidArea, DottedArea, GradientArea, and other area variants.
 */
export type AreaComponentProps = {
  d: string;
  fill: string;
  fillOpacity?: number;
  clipRect?: Rect;
  stroke?: string;
  strokeWidth?: number;
  /**
   * Series ID - used to retrieve colorMap scale from context.
   */
  seriesId?: string;
  /**
   * ID of the y-axis to use.
   * If not provided, defaults to the default y-axis.
   */
  yAxisId?: string;
  /**
   * Baseline value for the gradient.
   * When set, overrides the default baseline.
   */
  baseline?: number;
  /**
   * Gradient configuration.
   * When provided, creates gradient or threshold-based coloring.
   */
  gradient?: Gradient;
  /**
   * Whether to animate the area.
   * Overrides the animate value from the chart context.
   */
  animate?: boolean;
  /**
   * Transition configuration for area animations.
   * Defines how the area transitions when data changes.
   *
   * @example
   * // Spring animation
   * transitionConfig={{ type: 'spring', damping: 10, stiffness: 100 }}
   *
   * @example
   * // Timing animation
   * transitionConfig={{ type: 'timing', duration: 500 }}
   */
  transitionConfig?: TransitionConfig;
};

export type SolidAreaProps = Omit<PathProps, 'd' | 'fill' | 'fillOpacity'> & AreaComponentProps;

/**
 * A customizable solid area component which uses Path.
 * When a gradient is provided, renders with gradient fill.
 * Otherwise, renders with solid fill (no automatic fade).
 */
export const SolidArea = memo<SolidAreaProps>(
  ({
    d,
    fill: fillProp,
    fillOpacity = 1,
    clipRect,
    gradient: gradientProp,
    seriesId,
    yAxisId,
    animate: animateProp,
    transitionConfig,
    ...props
  }) => {
    const context = useCartesianChartContext();
    const theme = useTheme();

    const fill = fillProp ?? theme.color.fgPrimary;

    // Use prop value if provided, otherwise fall back to context
    const shouldAnimate = animateProp ?? context.animate;

    const currentPath = d ?? '';

    // Get gradient from series if seriesId is provided and gradient is not
    const targetSeries = seriesId ? context.getSeries(seriesId) : undefined;
    const seriesGradient = targetSeries?.gradient;
    const gradient = gradientProp ?? seriesGradient;

    const xScale = context.getXScale();
    const yScale = context.getYScale(yAxisId);

    const gradientConfig = useMemo(() => {
      if (!gradient || !xScale || !yScale) return;
      return getGradientConfig(gradient, xScale, yScale);
    }, [gradient, xScale, yScale]);

    const path = usePathTransition({
      currentPath,
      animate: shouldAnimate,
      transitionConfigs: transitionConfig ? { update: transitionConfig } : undefined,
    });

    return (
      <SkiaPath color={fill} opacity={fillOpacity} path={path} style="fill">
        {gradientConfig && (
          <LinearGradient
            colors={gradientConfig.colors}
            end={gradientConfig.end}
            mode="clamp"
            positions={gradientConfig.positions}
            start={gradientConfig.start}
          />
        )}
      </SkiaPath>
    );
  },
);

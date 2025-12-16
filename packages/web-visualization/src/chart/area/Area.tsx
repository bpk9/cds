import React, { memo, useMemo } from 'react';
import type { SVGProps } from 'react';
import type { Transition } from 'framer-motion';

import { useCartesianChartContext } from '../ChartProvider';
import { type ChartPathCurveType, getAreaPath, type GradientDefinition } from '../utils';

import { DottedArea } from './DottedArea';
import { GradientArea } from './GradientArea';
import { SolidArea } from './SolidArea';

export type AreaBaseProps = {
  /**
   * The ID of the series to render. Will be used to find the data from the chart context.
   */
  seriesId: string;
  /**
   * The curve interpolation method to use for the line.
   * @default 'bump'
   */
  curve?: ChartPathCurveType;
  /**
   * The type of area to render.
   * @default 'solid'
   */
  type?: 'solid' | 'dotted' | 'gradient';
  /**
   * Component to render the area.
   * Takes precedence over the type prop if provided.
   */
  AreaComponent?: AreaComponent;
  /**
   * When true, the area is connected across null values.
   */
  connectNulls?: boolean;
  /**
   * The color of the area.
   * @default color of the series or 'var(--color-fgPrimary)'
   */
  fill?: string;
  /**
   * Opacity of the area
   * @note when combined with gradient, both will be applied
   * @default 1
   */
  fillOpacity?: number;
  /**
   * Baseline value for the gradient.
   * When set, overrides the default baseline.
   */
  baseline?: number;
  /**
   * Gradient configuration.
   * When provided, creates gradient or threshold-based coloring.
   */
  gradient?: GradientDefinition;
  /**
   * Whether to animate the area.
   * Overrides the animate value from the chart context.
   */
  animate?: boolean;
};

export type AreaProps = AreaBaseProps & {
  /**
   * Transition configuration for path animations.
   */
  transition?: Transition;
};

export type AreaComponentProps = Pick<
  AreaProps,
  'fill' | 'fillOpacity' | 'baseline' | 'gradient' | 'animate' | 'transition'
> & {
  /**
   * Path of the area
   */
  d: SVGProps<SVGPathElement>['d'];
  /**
   * ID of the y-axis to use.
   * If not provided, defaults to the default y-axis.
   */
  yAxisId?: string;
};

export type AreaComponent = React.FC<AreaComponentProps>;

export const Area = memo<AreaProps>(
  ({
    seriesId,
    curve = 'bump',
    type = 'solid',
    AreaComponent: AreaComponentProp,
    fill: fillProp,
    fillOpacity = 1,
    baseline,
    connectNulls,
    gradient: gradientProp,
    transition,
    animate,
  }) => {
    const { getSeries, getSeriesData, getXScale, getYScale, getXAxis, getYAxis, orientation } =
      useCartesianChartContext();

    const matchedSeries = useMemo(() => getSeries(seriesId), [seriesId, getSeries]);
    const gradient = useMemo(
      () => gradientProp ?? matchedSeries?.gradient,
      [gradientProp, matchedSeries?.gradient],
    );
    const fill = useMemo(() => fillProp ?? matchedSeries?.color, [fillProp, matchedSeries?.color]);

    const sourceData = useMemo(() => getSeriesData(seriesId), [seriesId, getSeriesData]);

    const xAxis = getXAxis();
    const yAxis = getYAxis(matchedSeries?.yAxisId);
    const xScale = getXScale();
    const yScale = getYScale(matchedSeries?.yAxisId);

    const area = useMemo(() => {
      if (!sourceData || sourceData.length === 0 || !xScale || !yScale) return '';

      // For horizontal orientation, use xAxis data; for vertical, use yAxis data
      const categoryAxis = orientation === 'vertical' ? yAxis : xAxis;
      const categoryData =
        categoryAxis?.data && Array.isArray(categoryAxis.data) && typeof categoryAxis.data[0] === 'number'
          ? (categoryAxis.data as number[])
          : undefined;

      return getAreaPath({
        data: sourceData,
        xScale,
        yScale,
        curve,
        xData: orientation === 'vertical' ? undefined : categoryData,
        yData: orientation === 'vertical' ? categoryData : undefined,
        connectNulls,
        orientation,
      });
    }, [sourceData, xScale, yScale, curve, xAxis?.data, yAxis?.data, connectNulls, orientation]);

    const AreaComponent = useMemo((): AreaComponent => {
      if (AreaComponentProp) {
        return AreaComponentProp;
      }

      switch (type) {
        case 'dotted':
          return DottedArea;
        case 'gradient':
          return GradientArea;
        case 'solid':
        default:
          return SolidArea;
      }
    }, [AreaComponentProp, type]);

    if (!xScale || !yScale || !sourceData || !area) return;

    return (
      <AreaComponent
        animate={animate}
        baseline={baseline}
        d={area}
        fill={fill}
        fillOpacity={fillOpacity}
        gradient={gradient}
        transition={transition}
        yAxisId={matchedSeries?.yAxisId}
      />
    );
  },
);

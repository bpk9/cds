import { forwardRef, memo, useMemo } from 'react';
import { Box, VStack, type VStackProps } from '@coinbase/cds-web/layout';
import { Text } from '@coinbase/cds-web/typography';

import { XAxis, type XAxisProps, YAxis, type YAxisProps } from '../axis';
import { BarPlot, type BarPlotProps } from '../bar';
import {
  CartesianChart,
  type CartesianChartBaseProps,
  type CartesianChartProps,
} from '../CartesianChart';
import { DefaultLegendShape, type LegendShapeProps } from '../legend/DefaultLegendShape';
import { type CartesianAxisConfigProps, type GradientDefinition, type LegendShape } from '../utils';

/**
 * A single segment in the progress chart.
 * Unlike BarSeries which accepts an array of data points,
 * ProgressSegment accepts a single value representing this segment's portion.
 */
export type ProgressSegment = {
  /**
   * Unique identifier for the segment.
   */
  id: string;
  /**
   * The value for this segment.
   * All segment values should sum to 100 (or your custom max) to represent proportions.
   */
  value: number;
  /**
   * Label displayed in the legend.
   * Defaults to the segment id if not provided.
   */
  label?: string;
  /**
   * Color of the segment.
   * @default 'var(--color-fgPrimary)'
   */
  color?: string;
  /**
   * Optional gradient for the segment.
   */
  gradient?: GradientDefinition;
  /**
   * Shape to display in the legend.
   * @default 'circle'
   */
  legendShape?: LegendShape;
};

/**
 * Props for the standalone progress legend.
 */
export type ProgressLegendProps = Pick<VStackProps<'div'>, 'justifyContent' | 'flexDirection'> & {
  /**
   * The segments to display in the legend.
   */
  segments: Array<ProgressSegment>;
  /**
   * Gap between legend items.
   * @default 2
   */
  gap?: VStackProps<'div'>['gap'];
  /**
   * Custom component to render the legend shape.
   */
  ShapeComponent?: React.FC<LegendShapeProps>;
};

/**
 * Standalone legend component for the progress chart.
 * Does not require chart context.
 */
const ProgressLegend = memo<ProgressLegendProps>(
  ({
    segments,
    gap = 2,
    justifyContent = 'space-between',
    flexDirection = 'row',
    ShapeComponent = DefaultLegendShape,
  }) => {
    return (
      <Box
        alignItems="center"
        columnGap={gap}
        display="flex"
        flexDirection={flexDirection}
        flexWrap="wrap"
        justifyContent={justifyContent}
        rowGap={1}
      >
        {segments.map((segment) => (
          <Box key={segment.id} alignItems="center" display="flex" gap={1}>
            <ShapeComponent
              color={segment.color ?? 'var(--color-fgPrimary)'}
              shape={segment.legendShape ?? 'circle'}
            />
            <Text font="label1">{segment.label ?? segment.id}</Text>
          </Box>
        ))}
      </Box>
    );
  },
);

export type SegmentedProgressChartBaseProps = Omit<
  CartesianChartBaseProps,
  'xAxis' | 'yAxis' | 'series' | 'orientation'
> &
  Pick<
    BarPlotProps,
    | 'BarComponent'
    | 'fillOpacity'
    | 'stroke'
    | 'strokeWidth'
    | 'borderRadius'
    | 'BarStackComponent'
    | 'stackGap'
    | 'roundBaseline'
    | 'transition'
  > & {
    /**
     * The segments to display in the progress bar.
     * Each segment represents a portion of the total.
     */
    segments: Array<ProgressSegment>;
    /**
     * Maximum value for the progress bar.
     * Segment values should sum to this value.
     * @default 100
     */
    max?: number;
    /**
     * Whether to show the legend.
     * @default true
     */
    showLegend?: boolean;
    /**
     * Position of the legend relative to the progress bar.
     * @default 'bottom'
     */
    legendPosition?: 'top' | 'bottom';
    /**
     * Props to pass to the legend.
     */
    legendProps?: Omit<ProgressLegendProps, 'segments'>;
    /**
     * Whether to show the X axis (value axis).
     * @default false
     */
    showXAxis?: boolean;
    /**
     * Whether to show the Y axis (category axis).
     * @default false
     */
    showYAxis?: boolean;
    /**
     * Configuration for x-axis (value axis).
     */
    xAxis?: Partial<CartesianAxisConfigProps> & XAxisProps;
    /**
     * Configuration for y-axis (category axis).
     */
    yAxis?: Partial<CartesianAxisConfigProps> & YAxisProps;
    /**
     * Optional category label for the progress bar.
     * If not provided, an empty label is used.
     */
    category?: string;
    /**
     * Height of the progress bar itself (excluding legend).
     * @default 24
     */
    barHeight?: number;
    /**
     * Gap between the progress bar and legend.
     * @default 2
     */
    legendGap?: 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  };

export type SegmentedProgressChartProps = SegmentedProgressChartBaseProps &
  Omit<CartesianChartProps, 'xAxis' | 'yAxis' | 'series' | 'orientation'>;

const DEFAULT_STACK_ID = 'progress-stack';

/**
 * A chart component for displaying segmented progress bars.
 * Useful for showing proportions like "bought vs sold" or portfolio allocations.
 *
 * @example
 * ```tsx
 * <SegmentedProgressChart
 *   segments={[
 *     { id: 'bought', value: 76, label: '76% bought', color: 'var(--color-accentBoldGreen)' },
 *     { id: 'sold', value: 24, label: '24% sold', color: 'var(--color-accentBoldRed)' },
 *   ]}
 * />
 * ```
 */
export const SegmentedProgressChart = memo(
  forwardRef<SVGSVGElement, SegmentedProgressChartProps>(
    (
      {
        segments,
        max = 100,
        showLegend = true,
        legendPosition = 'bottom',
        legendProps,
        legendGap = 2,
        showXAxis = false,
        showYAxis = false,
        xAxis,
        yAxis,
        category = '',
        barHeight = 24,
        children,
        BarComponent,
        fillOpacity,
        stroke,
        strokeWidth,
        borderRadius = 4,
        BarStackComponent,
        stackGap = 4,
        roundBaseline = true,
        transition,
        height,
        ...chartProps
      },
      ref,
    ) => {
      // Convert ProgressSegments to CartesianSeries format
      const series = useMemo(() => {
        return segments.map((segment) => ({
          id: segment.id,
          data: [segment.value],
          label: segment.label ?? segment.id,
          color: segment.color,
          gradient: segment.gradient,
          legendShape: segment.legendShape ?? 'circle',
          stackId: DEFAULT_STACK_ID,
        }));
      }, [segments]);

      const seriesIds = useMemo(() => segments.map((s) => s.id), [segments]);

      // Split axis props into config props for Chart and visual props for axis components
      const {
        scaleType: xScaleType,
        data: xData,
        categoryPadding: xCategoryPadding,
        domain: xDomain,
        domainLimit: xDomainLimit,
        range: xRange,
        ...xAxisVisualProps
      } = xAxis || {};

      const {
        scaleType: yScaleType,
        data: yData,
        categoryPadding: yCategoryPadding,
        domain: yDomain,
        domainLimit: yDomainLimit,
        range: yRange,
        id: yAxisId,
        ...yAxisVisualProps
      } = yAxis || {};

      // X axis is the value axis (linear, 0 to max)
      const xAxisConfig: Partial<CartesianAxisConfigProps> = {
        scaleType: xScaleType ?? 'linear',
        data: xData,
        categoryPadding: xCategoryPadding,
        domain: xDomain ?? { min: 0, max },
        domainLimit: xDomainLimit,
        range: xRange,
      };

      // Y axis is the category axis (band scale with single category)
      const yAxisConfig: Partial<CartesianAxisConfigProps> = {
        scaleType: yScaleType ?? 'band',
        data: yData ?? [category],
        categoryPadding: yCategoryPadding ?? 0,
        domain: yDomain,
        domainLimit: yDomainLimit,
        range: yRange,
      };

      // Calculate total height based on components shown
      const computedHeight = useMemo(() => {
        if (height !== undefined) return height;

        let totalHeight = barHeight;

        // Add padding for axes if shown
        if (showXAxis) totalHeight += 24;

        return totalHeight;
      }, [height, barHeight, showXAxis]);

      // Default inset to 0 for progress bars (no padding needed)
      const defaultInset = { top: 0, bottom: 0, left: 0, right: 0 };

      const chartElement = (
        <CartesianChart
          inset={defaultInset}
          {...chartProps}
          ref={ref}
          height={computedHeight}
          orientation="vertical"
          series={series}
          xAxis={xAxisConfig}
          yAxis={yAxisConfig}
        >
          {showXAxis && <XAxis {...xAxisVisualProps} />}
          {showYAxis && <YAxis axisId={yAxisId} {...yAxisVisualProps} />}
          <BarPlot
            BarComponent={BarComponent}
            BarStackComponent={BarStackComponent}
            borderRadius={borderRadius}
            fillOpacity={fillOpacity}
            roundBaseline={roundBaseline}
            seriesIds={seriesIds}
            stackGap={stackGap}
            stroke={stroke}
            strokeWidth={strokeWidth}
            transition={transition}
          />
          {children}
        </CartesianChart>
      );

      // If no legend, just return the chart
      if (!showLegend) {
        return chartElement;
      }

      // Wrap in VStack for legend positioning
      return (
        <VStack gap={legendGap} style={{ width: '100%' }}>
          {legendPosition === 'top' && <ProgressLegend segments={segments} {...legendProps} />}
          {chartElement}
          {legendPosition === 'bottom' && <ProgressLegend segments={segments} {...legendProps} />}
        </VStack>
      );
    },
  ),
);

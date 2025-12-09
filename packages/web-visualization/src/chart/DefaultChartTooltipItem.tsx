import { memo, useMemo } from 'react';
import type { SharedProps } from '@coinbase/cds-common/types';
import { HStack } from '@coinbase/cds-web/layout';
import { Text } from '@coinbase/cds-web/typography';

import { DefaultLegendItem, type LegendItemComponent } from './legend/DefaultLegendItem';
import type { LegendShapeComponent } from './legend/DefaultLegendShape';
import { useCartesianChartContext } from './ChartProvider';
import type { CartesianSeries } from './utils';

export type ChartTooltipItemBaseProps = SharedProps & {
  /**
   * The series to display.
   */
  series: CartesianSeries;
  /**
   * The current scrubber position (data index).
   */
  scrubberPosition: number;
  /**
   * Formatter function for series values.
   * Receives the numeric series value and should return a ReactNode.
   * String results will automatically be wrapped in Text.
   */
  valueFormatter?: (value: number) => React.ReactNode;
  /**
   * Custom component to render the legend item (shape + label).
   * @default DefaultLegendItem
   */
  LegendItemComponent?: LegendItemComponent;
  /**
   * Custom component to render the legend shape.
   * Only used when LegendItemComponent is DefaultLegendItem.
   * @default DefaultLegendShape
   */
  ShapeComponent?: LegendShapeComponent;
};

export type ChartTooltipItemProps = ChartTooltipItemBaseProps;

export type ChartTooltipItemComponent = React.FC<ChartTooltipItemProps>;

export const DefaultChartTooltipItem = memo<ChartTooltipItemProps>(
  ({
    series,
    scrubberPosition,
    valueFormatter,
    LegendItemComponent = DefaultLegendItem,
    ShapeComponent,
    testID,
  }) => {
    const { getSeriesData } = useCartesianChartContext();

    const formattedValue: React.ReactNode = useMemo(() => {
      const data = getSeriesData(series.id);
      const dataPoint = data?.[scrubberPosition];
      let value: number | undefined;

      if (dataPoint && dataPoint !== null) {
        const [start, end] = dataPoint;
        value = end - start;
      } else if (series.data) {
        const rawPoint = series.data[scrubberPosition];
        if (rawPoint !== undefined && rawPoint !== null) {
          value = Array.isArray(rawPoint) ? rawPoint.at(-1) : rawPoint;
        }
      }

      if (value === undefined || value === null || Number.isNaN(value)) return;

      return valueFormatter ? valueFormatter(value) : value;
    }, [series.id, series.data, scrubberPosition, getSeriesData, valueFormatter]);

    if (formattedValue === undefined) return;

    return (
      <HStack alignItems="center" data-testid={testID} justifyContent="space-between">
        <LegendItemComponent
          ShapeComponent={ShapeComponent}
          color={series.color}
          label={series.label ?? series.id}
          seriesId={series.id}
          shape={series.legendShape}
        />
        {typeof formattedValue === 'string' || typeof formattedValue === 'number' ? (
          <Text color="fgMuted" font="label2">
            {formattedValue}
          </Text>
        ) : (
          formattedValue
        )}
      </HStack>
    );
  },
);

import React, { memo, useMemo } from 'react';
import { Box, type BoxProps } from '@coinbase/cds-web/layout';

import { ChartOverlay } from '../ChartOverlay';
import { useCartesianChartContext } from '../ChartProvider';
import type { Series } from '../utils';

import { DefaultLegendItem, type LegendItemComponent } from './DefaultLegendItem';

export type LegendBaseProps = {
  /**
   * The position of the legend relative to the chart.
   * @default 'top'
   */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Array of series IDs to display in the legend.
   * By default, all series will be displayed.
   */
  seriesIds?: Series['id'][];
  /**
   * Custom component to render each legend item.
   * @default DefaultLegendItem
   */
  ItemComponent?: LegendItemComponent;
};

export type LegendProps = Omit<BoxProps<'div'>, 'position'> & LegendBaseProps;

export const Legend = memo(function Legend({
  position = 'top',
  flexDirection = position === 'top' || position === 'bottom' ? 'row' : 'column',
  justifyContent = 'center',
  alignItems = position === 'top' || position === 'bottom' ? 'center' : 'flex-start',
  flexWrap = 'wrap',
  gap = 1,
  seriesIds,
  ItemComponent = DefaultLegendItem,
  width = position === 'top' || position === 'bottom' ? '100%' : undefined,
  height = position === 'left' || position === 'right' ? '100%' : undefined,
  ...props
}: LegendProps) {
  const { series, slotRefs } = useCartesianChartContext();

  const filteredSeries = useMemo(() => {
    if (!series) return [];
    if (seriesIds === undefined) return series;
    return series.filter((s) => seriesIds.includes(s.id));
  }, [series, seriesIds]);

  if (filteredSeries.length === 0) return null;

  const slotRef =
    position === 'top'
      ? slotRefs?.topRef
      : position === 'bottom'
        ? slotRefs?.bottomRef
        : position === 'left'
          ? slotRefs?.leftRef
          : slotRefs?.rightRef;

  return (
    <ChartOverlay slotRef={slotRef}>
      <Box
        alignItems={alignItems}
        flexDirection={flexDirection}
        flexWrap={flexWrap}
        gap={gap}
        height={height}
        justifyContent={justifyContent}
        width={width}
        {...props}
      >
        {filteredSeries.map((s) => (
          <ItemComponent
            key={s.id}
            color={s.color}
            label={s.label ?? s.id}
            legendShape={s.legendShape}
            seriesId={s.id}
          />
        ))}
      </Box>
    </ChartOverlay>
  );
});

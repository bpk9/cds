import { forwardRef, memo, useMemo } from 'react';
import { Box, type BoxProps } from '@coinbase/cds-web/layout';

import { useChartContext } from '../ChartProvider';
import { ChartSlot } from '../ChartSlot';

import { DefaultLegendItem, type LegendItemComponent } from './DefaultLegendItem';
import type { LegendShapeComponent } from './DefaultLegendShape';

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
  seriesIds?: string[];
  /**
   * Custom component to render each legend item.
   * @default DefaultLegendItem
   */
  ItemComponent?: LegendItemComponent;
  /**
   * Custom component to render the legend shape within each item.
   * Only used when ItemComponent is not provided or is DefaultLegendItem.
   * @default DefaultLegendShape
   */
  ShapeComponent?: LegendShapeComponent;
};

export type LegendProps = Omit<BoxProps<'div'>, 'position'> & LegendBaseProps;

export const Legend = memo(
  forwardRef<HTMLDivElement, LegendProps>(
    (
      {
        position = 'top',
        flexDirection = position === 'top' || position === 'bottom' ? 'row' : 'column',
        justifyContent = 'center',
        alignItems = position === 'top' || position === 'bottom' ? 'center' : 'flex-start',
        flexWrap = 'wrap',
        gap = 1,
        seriesIds,
        ItemComponent = DefaultLegendItem,
        ShapeComponent,
        width = position === 'top' || position === 'bottom' ? '100%' : undefined,
        height = position === 'left' || position === 'right' ? '100%' : undefined,
        ...props
      },
      ref,
    ) => {
      const { series, slotRefs } = useChartContext();

      const filteredSeries = useMemo(() => {
        if (seriesIds === undefined) return series;
        return series.filter((s) => seriesIds.includes(s.id));
      }, [series, seriesIds]);

      if (filteredSeries.length === 0) return;

      const slotRef =
        position === 'top'
          ? slotRefs?.topRef
          : position === 'bottom'
            ? slotRefs?.bottomRef
            : position === 'left'
              ? slotRefs?.leftRef
              : slotRefs?.rightRef;

      return (
        <ChartSlot slotRef={slotRef}>
          <Box
            ref={ref}
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
                ShapeComponent={ShapeComponent}
                color={s.color}
                label={s.label ?? s.id}
                seriesId={s.id}
                shape={s.legendShape}
              />
            ))}
          </Box>
        </ChartSlot>
      );
    },
  ),
);

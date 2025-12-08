import { forwardRef, memo, useMemo } from 'react';
import type { View } from 'react-native';
import type { SharedProps } from '@coinbase/cds-common/types';
import { Box, type BoxProps } from '@coinbase/cds-mobile/layout';

import { useChartContext } from '../ChartProvider';

import { DefaultLegendItem, type LegendItemComponent } from './DefaultLegendItem';
import type { LegendShapeComponent } from './DefaultLegendShape';

export type LegendBaseProps = SharedProps & {
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

export type LegendProps = BoxProps & LegendBaseProps;

export const Legend = memo(
  forwardRef<View, LegendProps>(function Legend(
    {
      flexDirection = 'row',
      justifyContent = 'center',
      alignItems = flexDirection === 'row' ? 'center' : 'flex-start',
      flexWrap = 'wrap',
      gap = 1,
      seriesIds,
      ItemComponent = DefaultLegendItem,
      ShapeComponent,
      ...props
    },
    ref,
  ) {
    const { series } = useChartContext();

    const filteredSeries = useMemo(() => {
      if (seriesIds === undefined) return series;
      return series.filter((s) => seriesIds.includes(s.id));
    }, [series, seriesIds]);

    if (filteredSeries.length === 0) return null;

    return (
      <Box
        ref={ref}
        alignItems={alignItems}
        flexDirection={flexDirection}
        flexWrap={flexWrap}
        gap={gap}
        justifyContent={justifyContent}
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
    );
  }),
);

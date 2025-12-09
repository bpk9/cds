import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Box, Divider, HStack, VStack, type VStackProps } from '@coinbase/cds-web/layout';
import { Portal } from '@coinbase/cds-web/overlays/Portal';
import { tooltipContainerId } from '@coinbase/cds-web/overlays/PortalProvider';
import { Text } from '@coinbase/cds-web/typography';
import { flip, offset, shift, useFloating, type VirtualElement } from '@floating-ui/react-dom';
import { css } from '@linaria/core';

import { DefaultLegendShape } from './legend/DefaultLegendShape';

const legendMediaWrapperCss = css`
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
import type { LegendShape } from './utils/chart';
import { useCartesianChartContext, useChartContext, usePolarChartContext } from './ChartProvider';
import { useHighlightContext } from './utils';

export type ChartTooltipProps = VStackProps<'div'> & {
  /**
   * Label text displayed at the top of the tooltip.
   * For cartesian charts: can be a static string, a custom ReactNode, or a function that receives the current dataIndex.
   * For polar charts: can be a static string or a custom ReactNode.
   * If not provided, defaults to the x-axis data value (cartesian) or series label (polar).
   * If null is returned, the label is omitted.
   */
  label?: React.ReactNode | ((dataIndex: number) => React.ReactNode);
  /**
   * Array of series IDs to include in the tooltip.
   * By default, all series will be included.
   */
  seriesIds?: string[];
  /**
   * Formatter function for series values.
   * Receives the numeric series value and should return a ReactNode.
   * String results will automatically be wrapped in Text with font="label2".
   */
  valueFormatter?: (value: number) => React.ReactNode;
};

type TooltipSeriesItem = {
  id: string;
  label?: string;
  color?: string;
  shape?: LegendShape;
  value: React.ReactNode;
};

/**
 * ChartTooltip - displays contextual data on hover/scrub.
 * Works with both CartesianChart (via scrubbing) and PolarChart (via highlighting).
 */
export const ChartTooltip = (props: ChartTooltipProps) => {
  const chartContext = useChartContext();

  if (chartContext.type === 'cartesian') {
    return <CartesianChartTooltip {...props} />;
  }

  return <PolarChartTooltip {...props} />;
};

/**
 * Tooltip for Cartesian charts - uses highlight context for positioning.
 */
const CartesianChartTooltip = ({
  label,
  seriesIds,
  valueFormatter,
  gap = 1,
  minWidth = 200,
  ...props
}: ChartTooltipProps) => {
  const { ref, series, getSeriesData, getXAxis } = useCartesianChartContext();
  const highlightContext = useHighlightContext();
  const [legendMediaWidth, setLegendMediaWidth] = useState<number>(0);
  const legendMediaRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const enableHighlighting = highlightContext?.enableHighlighting ?? false;
  const highlightedItem = highlightContext?.highlightedItem;
  const dataIndex = highlightedItem?.dataIndex;

  const isTooltipVisible = enableHighlighting && dataIndex !== undefined;

  const { refs, floatingStyles } = useFloating({
    open: isTooltipVisible,
    placement: 'bottom-start',
    middleware: [
      offset(({ placement }) => {
        const mainAxis = placement.includes('bottom') ? 16 : 8;
        const crossAxis = placement.includes('start') ? 16 : -8;

        return { mainAxis, crossAxis };
      }),
      flip({
        fallbackPlacements: ['top-start', 'bottom-end', 'top-end'],
      }),
      shift({ padding: 8 }),
    ],
  });

  useEffect(() => {
    const element = ref?.current;
    if (!element || !enableHighlighting) return;

    const handleMouseMove = (event: Event) => {
      const { clientX, clientY } = event as MouseEvent;
      const virtualEl: VirtualElement = {
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: clientX,
            y: clientY,
            left: clientX,
            right: clientX,
            top: clientY,
            bottom: clientY,
          } as DOMRect;
        },
      };
      refs.setReference(virtualEl);
    };

    element.addEventListener('mousemove', handleMouseMove);

    return () => element.removeEventListener('mousemove', handleMouseMove);
  }, [enableHighlighting, refs, ref]);

  const { resolvedLabel, seriesItems } = useMemo(() => {
    if (dataIndex === undefined) {
      return { resolvedLabel: null, seriesItems: [] as TooltipSeriesItem[] };
    }

    // Resolve label
    let resolvedLabel: React.ReactNode;
    if (label !== undefined) {
      resolvedLabel = typeof label === 'function' ? label(dataIndex) : label;
    } else {
      // Default to x-axis data value
      const xAxis = getXAxis();
      if (xAxis?.data && xAxis.data[dataIndex] !== undefined) {
        resolvedLabel = xAxis.data[dataIndex];
      } else {
        resolvedLabel = dataIndex;
      }
    }

    // Wrap string label in Text
    if (typeof resolvedLabel === 'string' || typeof resolvedLabel === 'number') {
      resolvedLabel = <Text font="label1">{resolvedLabel}</Text>;
    }

    // Filter series - if highlightedItem has seriesId, optionally emphasize it
    const filteredSeries = seriesIds ? series.filter((s) => seriesIds.includes(s.id)) : series;

    // Resolve series data
    const seriesItems: TooltipSeriesItem[] = [];
    filteredSeries.forEach((s) => {
      const data = getSeriesData(s.id);
      const dataPoint = data?.[dataIndex];
      let value: number | undefined;

      if (dataPoint && dataPoint !== null) {
        const [start, end] = dataPoint;
        value = end - start;
      } else if (s.data) {
        const rawPoint = s.data[dataIndex];
        if (rawPoint !== undefined && rawPoint !== null) {
          value = Array.isArray(rawPoint) ? (rawPoint[1] ?? undefined) : (rawPoint as number);
        }
      }

      if (value === undefined || value === null || Number.isNaN(value)) return;

      let formattedValue: React.ReactNode = value;
      if (valueFormatter) {
        formattedValue = valueFormatter(value);
      }

      if (formattedValue === null || formattedValue === undefined) {
        return;
      }

      if (typeof formattedValue === 'string' || typeof formattedValue === 'number') {
        formattedValue = <Text font="label2">{formattedValue}</Text>;
      }

      seriesItems.push({
        id: s.id,
        label: s.label,
        color: s.color,
        shape: s.legendShape,
        value: formattedValue,
      });
    });

    return {
      resolvedLabel: resolvedLabel ?? null,
      seriesItems,
    };
  }, [dataIndex, label, seriesIds, series, getSeriesData, getXAxis, valueFormatter]);

  // Measure legend media widths and find the maximum
  useLayoutEffect(() => {
    if (seriesItems.length === 0) {
      setLegendMediaWidth(0);
      return;
    }

    let maxWidth = 0;
    legendMediaRefs.current.forEach((el) => {
      if (el) {
        const width = el.scrollWidth;
        if (width > maxWidth) {
          maxWidth = width;
        }
      }
    });

    if (maxWidth !== legendMediaWidth) {
      setLegendMediaWidth(maxWidth);
    }
  }, [seriesItems, legendMediaWidth]);

  // Create a ref callback for each legend media item
  const setLegendMediaRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) {
        legendMediaRefs.current.set(id, el);
      } else {
        legendMediaRefs.current.delete(id);
      }
    },
    [],
  );

  if (!isTooltipVisible || (!resolvedLabel && seriesItems.length === 0)) {
    return null;
  }

  return (
    <Portal containerId={tooltipContainerId}>
      <VStack
        ref={refs.setFloating}
        background="bg"
        borderRadius={400}
        color="fg"
        elevation={2}
        gap={gap}
        minWidth={minWidth}
        paddingX={2}
        paddingY={1.5}
        style={floatingStyles}
        {...props}
      >
        {resolvedLabel}
        <Divider />
        {seriesItems.length > 0 && (
          <VStack gap={1}>
            {seriesItems.map((item) => (
              <HStack key={item.id} alignItems="center" gap={1} justifyContent="space-between">
                <HStack alignItems="center" gap={1}>
                  <Box
                    ref={setLegendMediaRef(item.id)}
                    className={legendMediaWrapperCss}
                    style={legendMediaWidth > 0 ? { width: legendMediaWidth } : undefined}
                  >
                    <DefaultLegendShape color={item.color} shape={item.shape} />
                  </Box>
                  <Text font="label1">{item.label ?? item.id}</Text>
                </HStack>
                {item.value}
              </HStack>
            ))}
          </VStack>
        )}
      </VStack>
    </Portal>
  );
};

/**
 * Tooltip for Polar charts - uses highlight context.
 */
const PolarChartTooltip = ({
  label,
  seriesIds,
  valueFormatter,
  gap = 1,
  minWidth = 200,
  ...props
}: ChartTooltipProps) => {
  const { ref, series, getSeriesData } = usePolarChartContext();
  const highlightContext = useHighlightContext();
  const [legendMediaWidth, setLegendMediaWidth] = useState<number>(0);
  const legendMediaRef = useRef<HTMLDivElement | null>(null);

  const enableHighlighting = highlightContext?.enableHighlighting ?? false;
  const highlightedItem = highlightContext?.highlightedItem;

  const isTooltipVisible = enableHighlighting && highlightedItem !== undefined;

  const { refs, floatingStyles } = useFloating({
    open: isTooltipVisible,
    placement: 'bottom-start',
    middleware: [
      offset(({ placement }) => {
        const mainAxis = placement.includes('bottom') ? 16 : 8;
        const crossAxis = placement.includes('start') ? 16 : -8;

        return { mainAxis, crossAxis };
      }),
      flip({
        fallbackPlacements: ['top-start', 'bottom-end', 'top-end'],
      }),
      shift({ padding: 8 }),
    ],
  });

  // Track mouse move for tooltip positioning
  useEffect(() => {
    const element = ref?.current;
    if (!element || !enableHighlighting) return;

    const handleMouseMove = (event: Event) => {
      const { clientX, clientY } = event as MouseEvent;
      const virtualEl: VirtualElement = {
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: clientX,
            y: clientY,
            left: clientX,
            right: clientX,
            top: clientY,
            bottom: clientY,
          } as DOMRect;
        },
      };
      refs.setReference(virtualEl);
    };

    element.addEventListener('mousemove', handleMouseMove);

    return () => element.removeEventListener('mousemove', handleMouseMove);
  }, [enableHighlighting, refs, ref]);

  const { resolvedLabel, seriesItem } = useMemo(() => {
    if (!highlightedItem) {
      return { resolvedLabel: null, seriesItem: null };
    }

    const { seriesId, dataIndex } = highlightedItem;

    // For polar charts, we expect both seriesId and dataIndex
    if (seriesId === undefined || dataIndex === undefined) {
      return { resolvedLabel: null, seriesItem: null };
    }

    // Find the highlighted series
    const highlightedSeries = series.find((s) => s.id === seriesId);
    if (!highlightedSeries) {
      return { resolvedLabel: null, seriesItem: null };
    }

    // Check if this series should be shown (based on seriesIds filter)
    if (seriesIds && !seriesIds.includes(seriesId)) {
      return { resolvedLabel: null, seriesItem: null };
    }

    // Resolve label - for polar charts, only show if explicitly provided
    // (otherwise we'd duplicate the series label which is already shown below)
    let resolvedLabel: React.ReactNode = null;
    if (label !== undefined) {
      // For polar charts, the label function receives the data index (if function)
      resolvedLabel = typeof label === 'function' ? label(dataIndex) : label;

      // Wrap string label in Text
      if (typeof resolvedLabel === 'string' || typeof resolvedLabel === 'number') {
        resolvedLabel = <Text font="label1">{resolvedLabel}</Text>;
      }
    }

    // Get series value at the highlighted index
    const data = getSeriesData(seriesId);
    let value: number | undefined;

    // For polar charts, data can be a single number or an array
    if (typeof highlightedSeries.data === 'number') {
      value = highlightedSeries.data;
    } else if (typeof data === 'number') {
      value = data;
    } else if (Array.isArray(data) && data.length > dataIndex) {
      const point = data[dataIndex];
      if (point !== null) {
        value = point;
      }
    } else if (Array.isArray(highlightedSeries.data) && highlightedSeries.data.length > dataIndex) {
      const rawValue = highlightedSeries.data[dataIndex];
      if (typeof rawValue === 'number') {
        value = rawValue;
      }
    }

    if (value === undefined || value === null || Number.isNaN(value)) {
      return { resolvedLabel, seriesItem: null };
    }

    let formattedValue: React.ReactNode = value;
    if (valueFormatter) {
      formattedValue = valueFormatter(value);
    }

    if (formattedValue === null || formattedValue === undefined) {
      return { resolvedLabel, seriesItem: null };
    }

    if (typeof formattedValue === 'string' || typeof formattedValue === 'number') {
      formattedValue = <Text font="label2">{formattedValue}</Text>;
    }

    const seriesItem: TooltipSeriesItem = {
      id: highlightedSeries.id,
      label: highlightedSeries.label,
      color: highlightedSeries.color,
      shape: highlightedSeries.legendShape,
      value: formattedValue,
    };

    return { resolvedLabel: resolvedLabel ?? null, seriesItem };
  }, [highlightedItem, series, seriesIds, label, getSeriesData, valueFormatter]);

  // Measure legend media width
  useLayoutEffect(() => {
    if (!seriesItem || !legendMediaRef.current) {
      setLegendMediaWidth(0);
      return;
    }

    const width = legendMediaRef.current.scrollWidth;
    if (width !== legendMediaWidth) {
      setLegendMediaWidth(width);
    }
  }, [seriesItem, legendMediaWidth]);

  if (!isTooltipVisible || (!resolvedLabel && !seriesItem)) {
    return null;
  }
  return (
    <Portal containerId={tooltipContainerId}>
      <VStack
        ref={refs.setFloating}
        background="bg"
        borderRadius={400}
        color="fg"
        elevation={2}
        gap={gap}
        minWidth={minWidth}
        paddingX={2}
        paddingY={1.5}
        style={floatingStyles}
        {...props}
      >
        {resolvedLabel}
        {seriesItem && (
          <>
            {resolvedLabel && <Divider />}
            <HStack alignItems="center" gap={1} justifyContent="space-between">
              <HStack alignItems="center" gap={1}>
                <Box
                  ref={legendMediaRef}
                  className={legendMediaWrapperCss}
                  style={legendMediaWidth > 0 ? { width: legendMediaWidth } : undefined}
                >
                  <DefaultLegendShape color={seriesItem.color} shape={seriesItem.shape} />
                </Box>
                <Text font="label1">{seriesItem.label ?? seriesItem.id}</Text>
              </HStack>
              {seriesItem.value}
            </HStack>
          </>
        )}
      </VStack>
    </Portal>
  );
};

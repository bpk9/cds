import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Box, Divider, HStack, VStack, type VStackProps } from '@coinbase/cds-web/layout';
import { Portal } from '@coinbase/cds-web/overlays/Portal';
import { tooltipContainerId } from '@coinbase/cds-web/overlays/PortalProvider';
import { Text } from '@coinbase/cds-web/typography';
import { flip, offset, shift, useFloating, type VirtualElement } from '@floating-ui/react-dom';
import { css } from '@linaria/core';

import { LegendMedia } from './legend/LegendMedia';

const legendMediaWrapperCss = css`
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
import type { LegendShape } from './utils/chart';
import { useCartesianChartContext } from './ChartProvider';
import { useScrubberContext } from './utils';

export type ChartTooltipProps = VStackProps<'div'> & {
  /**
   * Label text displayed at the top of the tooltip.
   * Can be a static string, a custom ReactNode, or a function that receives the current dataIndex.
   * If not provided, defaults to the x-axis data value at the current index.
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

export const ChartTooltip = ({
  label,
  seriesIds,
  valueFormatter,
  gap = 1,
  minWidth = 320,
  ...props
}: ChartTooltipProps) => {
  const { svgRef, series, getSeriesData, getXAxis } = useCartesianChartContext();
  const { scrubberPosition, enableScrubbing } = useScrubberContext();
  const [legendMediaWidth, setLegendMediaWidth] = useState<number>(0);
  const legendMediaRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  // Use scrubberPosition from context as the single source of truth for data index
  const isTooltipVisible = enableScrubbing && scrubberPosition !== undefined;

  const { refs, floatingStyles } = useFloating({
    open: isTooltipVisible,
    placement: 'bottom-start', // Default: bottom-right
    middleware: [
      // Use a function to dynamically set the offset
      offset(({ placement }) => {
        // Bottom or top
        const mainAxis = placement.includes('bottom') ? 16 : 8;
        const crossAxis = placement.includes('start') ? 16 : -8;

        return { mainAxis, crossAxis };
      }),

      flip({
        // Define the 4 corners in order of preference
        fallbackPlacements: ['top-start', 'bottom-end', 'top-end'],
      }),

      shift({ padding: 8 }),
    ],
  });

  // Track mouse position only for tooltip floating UI positioning
  useEffect(() => {
    const element = svgRef?.current;
    if (!element || !enableScrubbing) return;

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

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enableScrubbing, refs, svgRef]);

  const { resolvedLabel, seriesItems } = useMemo(() => {
    if (scrubberPosition === undefined) {
      return { resolvedLabel: null, seriesItems: [] as TooltipSeriesItem[] };
    }

    // Resolve label
    let resolvedLabel: React.ReactNode;
    if (label !== undefined) {
      resolvedLabel = typeof label === 'function' ? label(scrubberPosition) : label;
    } else {
      // Default to x-axis data value
      const xAxis = getXAxis();
      if (xAxis?.data && xAxis.data[scrubberPosition] !== undefined) {
        resolvedLabel = xAxis.data[scrubberPosition];
      } else {
        resolvedLabel = scrubberPosition;
      }
    }

    // Wrap string label in Text
    if (typeof resolvedLabel === 'string' || typeof resolvedLabel === 'number') {
      resolvedLabel = <Text font="label1">{resolvedLabel}</Text>;
    }

    // Filter series
    const filteredSeries = seriesIds ? series.filter((s) => seriesIds.includes(s.id)) : series;

    // Resolve series data
    const seriesItems: TooltipSeriesItem[] = [];
    filteredSeries.forEach((s) => {
      const data = getSeriesData(s.id);
      const dataPoint = data?.[scrubberPosition];
      let value: number | undefined;

      if (dataPoint && dataPoint !== null) {
        const [start, end] = dataPoint;
        value = end - start;
      } else if (s.data) {
        const rawPoint = s.data[scrubberPosition];
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
  }, [scrubberPosition, label, seriesIds, series, getSeriesData, getXAxis, valueFormatter]);

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
        paddingX={3}
        paddingY={2}
        style={floatingStyles}
        {...props}
      >
        {resolvedLabel}
        <Divider />
        {seriesItems.length > 0 && (
          <VStack gap={1}>
            {seriesItems.map((item) => (
              <HStack key={item.id} alignItems="center" justifyContent="space-between">
                <HStack alignItems="center" gap={1}>
                  <Box
                    ref={setLegendMediaRef(item.id)}
                    className={legendMediaWrapperCss}
                    style={legendMediaWidth > 0 ? { width: legendMediaWidth } : undefined}
                  >
                    <LegendMedia color={item.color} shape={item.shape} />
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

type TooltipSeriesItem = {
  id: string;
  label?: string;
  color?: string;
  shape?: LegendShape;
  value: React.ReactNode;
};

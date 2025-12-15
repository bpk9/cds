import React, { forwardRef, memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  type LayoutChangeEvent,
  Platform,
  type StyleProp,
  type View,
  type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { Rect } from '@coinbase/cds-common/types';
import { useLayout } from '@coinbase/cds-mobile/hooks/useLayout';
import type { BoxBaseProps, BoxProps } from '@coinbase/cds-mobile/layout';
import { Box } from '@coinbase/cds-mobile/layout';
import { Haptics } from '@coinbase/cds-mobile/utils/haptics';
import { Canvas, Skia, type SkTypefaceFontProvider } from '@shopify/react-native-skia';

import { Legend } from './legend/Legend';
import { ScrubberProvider, type ScrubberProviderProps } from './scrubber/ScrubberProvider';
import { getPointOnSerializableScale } from './utils/point';
import {
  convertToSerializableScale,
  invertSerializableScale,
  type SerializableScale,
} from './utils/scale';
import { useChartContextBridge } from './ChartContextBridge';
import { CartesianChartProvider } from './ChartProvider';
import { HighlightProvider, type HighlightProviderBaseProps } from './HighlightProvider';
import {
  type CartesianAxisConfig,
  type CartesianAxisConfigProps,
  type CartesianChartContextValue,
  type CartesianSeries,
  type ChartInset,
  type ChartScaleFunction,
  defaultAxisId,
  defaultCartesianChartInset,
  getAxisRange,
  getCartesianAxisConfig,
  getCartesianAxisDomain,
  getCartesianAxisScale,
  getCartesianStackedSeriesData as calculateStackedSeriesData,
  getChartInset,
  type HighlightedItemData,
  useTotalAxisPadding,
} from './utils';

type ChartCanvasProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
};

const ChartCanvas = memo(({ children, style, onLayout }: ChartCanvasProps) => {
  const ContextBridge = useChartContextBridge();

  return (
    <Canvas onLayout={onLayout} style={[{ flex: 1, width: '100%' }, style]}>
      <ContextBridge>{children}</ContextBridge>
    </Canvas>
  );
});

export type LegendPosition = 'top' | 'bottom' | 'left' | 'right';

export type CartesianChartBaseProps = Omit<BoxBaseProps, 'fontFamily' | 'accessibilityLabel'> &
  Pick<HighlightProviderBaseProps, 'enableHighlighting' | 'onHighlightChange'> & {
    /**
     * Configuration objects that define how to visualize the data.
     * Each series contains its own data array.
     */
    series?: Array<CartesianSeries>;
    /**
     * Whether scrubbing interaction is enabled.
     * @deprecated Use `enableHighlighting` instead.
     */
    enableScrubbing?: ScrubberProviderProps['enableScrubbing'];
    /**
     * Callback fired when the scrubber position changes.
     * @deprecated Use `onHighlightChange` instead. Access `highlightedItem.dataIndex` for the same value.
     */
    onScrubberPositionChange?: ScrubberProviderProps['onScrubberPositionChange'];
    /**
     * Whether to animate the chart.
     * @default true
     */
    animate?: boolean;
    /**
     * Configuration for x-axis.
     */
    xAxis?: Partial<Omit<CartesianAxisConfigProps, 'id'>>;
    /**
     * Configuration for y-axis(es). Can be a single config or array of configs.
     */
    yAxis?: Partial<CartesianAxisConfigProps> | Partial<CartesianAxisConfigProps>[];
    /**
     * Inset around the entire chart (outside the axes).
     * @default { top: 32, left: 16, bottom: 16, right: 16 }
     */
    inset?: number | Partial<ChartInset>;
    /**
     * Whether to show a legend, or a custom legend element.
     * When `true`, renders the default Legend component.
     * When a ReactNode, renders the provided element.
     * @default false
     */
    legend?: boolean | React.ReactNode;
    /**
     * Position of the legend relative to the chart.
     * @default 'bottom'
     */
    legendPosition?: LegendPosition;
    /**
     * Allows continuous gestures on the chart to continue outside the bounds of the chart element.
     */
    allowOverflowGestures?: boolean;
    /**
     * Accessibility label for the chart. Can be a static string or a function that receives
     * the currently highlighted item data to generate dynamic labels.
     * @example
     * // Static label
     * accessibilityLabel="Sales chart showing monthly revenue"
     *
     * // Dynamic label based on highlighted data
     * accessibilityLabel={(item) => item ? `Month ${item.dataIndex + 1} selected` : "Sales chart"}
     */
    accessibilityLabel?: string | ((highlightedItem: HighlightedItemData | undefined) => string);
  };

export type CartesianChartProps = CartesianChartBaseProps &
  Omit<BoxProps, 'fontFamily' | 'accessibilityLabel'> & {
    /**
     * Default font families to use within ChartText.
     * If not provided, will be the default for the system.
     * @example
     * ['Helvetica', 'sans-serif']
     */
    fontFamilies?: string[];
    /**
     * Skia font provider to allow for custom fonts.
     * If not provided, the only available fonts will be those defined by the system.
     */
    fontProvider?: SkTypefaceFontProvider;
    /**
     * Custom styles for the root element.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Custom styles for the component.
     */
    styles?: {
      /**
       * Custom styles for the root element.
       */
      root?: StyleProp<ViewStyle>;
      /**
       * Custom styles for the chart canvas element.
       */
      chart?: StyleProp<ViewStyle>;
      /**
       * Custom styles for the legend element.
       * @note not used when legend is a ReactNode.
       */
      legend?: StyleProp<ViewStyle>;
    };
  };

export const CartesianChart = memo(
  forwardRef<View, CartesianChartProps>(
    (
      {
        series,
        children,
        animate = true,
        enableScrubbing,
        enableHighlighting,
        xAxis: xAxisConfigProp,
        yAxis: yAxisConfigProp,
        inset,
        onScrubberPositionChange,
        onHighlightChange,
        legend,
        legendPosition = 'bottom',
        width = '100%',
        height = '100%',
        style,
        styles,
        allowOverflowGestures,
        fontFamilies,
        fontProvider: fontProviderProp,
        accessibilityLabel: accessibilityLabelProp,
        // React Native will collapse views by default when only used
        // to group children, which interferes with gesture-handler
        // https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/gesture-detector/#:~:text=%7B%0A%20%20return%20%3C-,View,-collapsable%3D%7B
        collapsable = false,
        ...props
      },
      ref,
    ) => {
      const [containerLayout, onContainerLayout] = useLayout();
      const [highlightedItem, setHighlightedItem] = useState<HighlightedItemData | undefined>();

      const chartWidth = containerLayout.width;
      const chartHeight = containerLayout.height;

      const calculatedInset = useMemo(
        () => getChartInset(inset, defaultCartesianChartInset),
        [inset],
      );

      // there can only be one x axis but the helper function always returns an array
      const xAxisConfig = useMemo(
        () => getCartesianAxisConfig('x', xAxisConfigProp)[0],
        [xAxisConfigProp],
      );
      const yAxisConfig = useMemo(
        () => getCartesianAxisConfig('y', yAxisConfigProp),
        [yAxisConfigProp],
      );

      const { renderedAxes, registerAxis, unregisterAxis, axisPadding } = useTotalAxisPadding();

      const totalInset = useMemo(
        () => ({
          top: calculatedInset.top + axisPadding.top,
          right: calculatedInset.right + axisPadding.right,
          bottom: calculatedInset.bottom + axisPadding.bottom,
          left: calculatedInset.left + axisPadding.left,
        }),
        [calculatedInset, axisPadding],
      );

      const chartRect: Rect = useMemo(() => {
        if (chartWidth <= 0 || chartHeight <= 0) return { x: 0, y: 0, width: 0, height: 0 };

        const availableWidth = chartWidth - totalInset.left - totalInset.right;
        const availableHeight = chartHeight - totalInset.top - totalInset.bottom;

        return {
          x: totalInset.left,
          y: totalInset.top,
          width: availableWidth > 0 ? availableWidth : 0,
          height: availableHeight > 0 ? availableHeight : 0,
        };
      }, [chartHeight, chartWidth, totalInset]);

      const { xAxis, xScale } = useMemo(() => {
        if (!chartRect || chartRect.width <= 0 || chartRect.height <= 0)
          return { xAxis: undefined, xScale: undefined };

        const domain = getCartesianAxisDomain(xAxisConfig, series ?? [], 'x');
        const range = getAxisRange(xAxisConfig, chartRect, 'x');

        const axisConfig: CartesianAxisConfig = {
          scaleType: xAxisConfig.scaleType,
          domain,
          range,
          data: xAxisConfig.data,
          categoryPadding: xAxisConfig.categoryPadding,
          domainLimit: xAxisConfig.domainLimit,
        };

        // Create the scale
        const scale = getCartesianAxisScale({
          config: axisConfig,
          type: 'x',
          range: axisConfig.range,
          dataDomain: axisConfig.domain,
        });

        if (!scale) return { xAxis: undefined, xScale: undefined };

        // Update axis config with actual scale domain (after .nice() or other adjustments)
        const scaleDomain = scale.domain();
        const actualDomain =
          Array.isArray(scaleDomain) && scaleDomain.length === 2
            ? { min: scaleDomain[0] as number, max: scaleDomain[1] as number }
            : axisConfig.domain;

        const finalAxisConfig = {
          ...axisConfig,
          domain: actualDomain,
        };

        return { xAxis: finalAxisConfig, xScale: scale };
      }, [xAxisConfig, series, chartRect]);

      const xSerializableScale = useMemo(() => {
        if (!xScale) return;
        return convertToSerializableScale(xScale);
      }, [xScale]);

      const { yAxes, yScales } = useMemo(() => {
        const axes = new Map<string, CartesianAxisConfig>();
        const scales = new Map<string, ChartScaleFunction>();
        if (!chartRect || chartRect.width <= 0 || chartRect.height <= 0)
          return { yAxes: axes, yScales: scales };

        yAxisConfig.forEach((axisParam) => {
          const axisId = axisParam.id ?? defaultAxisId;

          // Get relevant series data
          const relevantSeries =
            series?.filter((s) => (s.yAxisId ?? defaultAxisId) === axisId) ?? [];

          // Calculate domain and range
          const dataDomain = getCartesianAxisDomain(axisParam, relevantSeries, 'y');
          const range = getAxisRange(axisParam, chartRect, 'y');

          const axisConfig: CartesianAxisConfig = {
            scaleType: axisParam.scaleType,
            domain: dataDomain,
            range,
            data: axisParam.data,
            categoryPadding: axisParam.categoryPadding,
            domainLimit: axisParam.domainLimit,
          };

          // Create the scale
          const scale = getCartesianAxisScale({
            config: axisConfig,
            type: 'y',
            range: axisConfig.range,
            dataDomain: axisConfig.domain,
          });

          if (scale) {
            scales.set(axisId, scale);

            // Update axis config with actual scale domain (after .nice() or other adjustments)
            const scaleDomain = scale.domain();
            const actualDomain =
              Array.isArray(scaleDomain) && scaleDomain.length === 2
                ? { min: scaleDomain[0] as number, max: scaleDomain[1] as number }
                : axisConfig.domain;

            axes.set(axisId, {
              ...axisConfig,
              domain: actualDomain,
            });
          }
        });

        return { yAxes: axes, yScales: scales };
      }, [yAxisConfig, series, chartRect]);

      // We need a set of serialized scales usable in UI thread
      const ySerializableScales = useMemo(() => {
        const serializableScales = new Map<string, SerializableScale>();
        yScales.forEach((scale, id) => {
          const serializableScale = convertToSerializableScale(scale);
          if (serializableScale) {
            serializableScales.set(id, serializableScale);
          }
        });
        return serializableScales;
      }, [yScales]);

      const getXAxis = useCallback(() => xAxis, [xAxis]);
      const getYAxis = useCallback((id?: string) => yAxes.get(id ?? defaultAxisId), [yAxes]);
      const getXScale = useCallback(() => xScale, [xScale]);
      const getYScale = useCallback((id?: string) => yScales.get(id ?? defaultAxisId), [yScales]);
      const getXSerializableScale = useCallback(() => xSerializableScale, [xSerializableScale]);
      const getYSerializableScale = useCallback(
        (id?: string) => ySerializableScales.get(id ?? defaultAxisId),
        [ySerializableScales],
      );
      const getSeries = useCallback(
        (seriesId?: string) => series?.find((s) => s.id === seriesId),
        [series],
      );

      const stackedDataMap = useMemo(() => {
        if (!series) return new Map<string, Array<[number, number] | null>>();
        return calculateStackedSeriesData(series);
      }, [series]);

      const getStackedSeriesData = useCallback(
        (seriesId?: string) => {
          if (!seriesId) return undefined;
          return stackedDataMap.get(seriesId);
        },
        [stackedDataMap],
      );

      const dataLength = useMemo(() => {
        // If xAxis has categorical data, use that length
        if (xAxisConfig.data && xAxisConfig.data.length > 0) {
          return xAxisConfig.data.length;
        }

        // Otherwise, find the longest series
        if (!series || series.length === 0) return 0;
        return series.reduce((max, s) => {
          const seriesData = getStackedSeriesData(s.id);
          return Math.max(max, seriesData?.length ?? 0);
        }, 0);
      }, [xAxisConfig.data, series, getStackedSeriesData]);

      const getAxisBounds = useCallback(
        (axisId: string): Rect | undefined => {
          const axis = renderedAxes.get(axisId);
          if (!axis || !chartRect) return;

          const axesAtPosition = Array.from(renderedAxes.values())
            .filter((a) => a.position === axis.position)
            .sort((a, b) => a.id.localeCompare(b.id));

          const axisIndex = axesAtPosition.findIndex((a) => a.id === axisId);
          if (axisIndex === -1) return;

          // Calculate offset from previous axes at the same position
          const offsetFromPreviousAxes = axesAtPosition
            .slice(0, axisIndex)
            .reduce((sum, a) => sum + a.size, 0);

          if (axis.position === 'top') {
            // Position above the chart rect, accounting for user inset
            const startY = calculatedInset.top + offsetFromPreviousAxes;
            return {
              x: chartRect.x,
              y: startY,
              width: chartRect.width,
              height: axis.size,
            };
          } else if (axis.position === 'bottom') {
            // Position below the chart rect, accounting for user inset
            const startY = chartRect.y + chartRect.height + offsetFromPreviousAxes;
            return {
              x: chartRect.x,
              y: startY,
              width: chartRect.width,
              height: axis.size,
            };
          } else if (axis.position === 'left') {
            // Position to the left of the chart rect, accounting for user inset
            const startX = calculatedInset.left + offsetFromPreviousAxes;
            return {
              x: startX,
              y: chartRect.y,
              width: axis.size,
              height: chartRect.height,
            };
          } else {
            // right - position to the right of the chart rect, accounting for user inset
            const startX = chartRect.x + chartRect.width + offsetFromPreviousAxes;
            return {
              x: startX,
              y: chartRect.y,
              width: axis.size,
              height: chartRect.height,
            };
          }
        },
        [renderedAxes, chartRect, calculatedInset],
      );

      const fontProvider = useMemo(() => {
        if (fontProviderProp) return fontProviderProp;
        return Skia.TypefaceFontProvider.Make();
      }, [fontProviderProp]);

      const chartRef = useRef<View | null>(null);

      const contextValue: CartesianChartContextValue = useMemo(
        () => ({
          type: 'cartesian',
          series: series ?? [],
          getSeries,
          getSeriesData: getStackedSeriesData,
          animate,
          width: chartWidth,
          height: chartHeight,
          fontFamilies,
          fontProvider,
          getXAxis,
          getYAxis,
          getXScale,
          getYScale,
          getXSerializableScale,
          getYSerializableScale,
          drawingArea: chartRect,
          dataLength,
          registerAxis,
          unregisterAxis,
          getAxisBounds,
          ref: chartRef,
        }),
        [
          series,
          getSeries,
          getStackedSeriesData,
          animate,
          chartWidth,
          chartHeight,
          fontFamilies,
          fontProvider,
          getXAxis,
          getYAxis,
          getXScale,
          getYScale,
          getXSerializableScale,
          getYSerializableScale,
          chartRect,
          dataLength,
          registerAxis,
          unregisterAxis,
          getAxisBounds,
          chartRef,
        ],
      );

      const isVerticalLegend = legendPosition === 'top' || legendPosition === 'bottom';
      const isLegendBefore = legendPosition === 'top' || legendPosition === 'left';

      const legendElement = useMemo(() => {
        if (!legend) return;
        if (typeof legend !== 'boolean') return legend;
        return (
          <Legend flexDirection={isVerticalLegend ? 'row' : 'column'} style={styles?.legend} />
        );
      }, [legend, isVerticalLegend, styles?.legend]);

      const rootStyles = useMemo<ViewStyle[]>(() => {
        return [
          { flexDirection: isVerticalLegend ? 'column' : 'row' } as ViewStyle,
          style as ViewStyle,
          styles?.root as ViewStyle,
        ].filter(Boolean);
      }, [isVerticalLegend, style, styles?.root]);

      // Track highlighted item for accessibility label
      const handleHighlightChange = useCallback(
        (item: HighlightedItemData | undefined) => {
          setHighlightedItem(item);
          onHighlightChange?.(item);
        },
        [onHighlightChange],
      );

      // Compute accessibility label
      const accessibilityLabel = useMemo((): string | undefined => {
        if (accessibilityLabelProp === undefined) return undefined;
        if (typeof accessibilityLabelProp === 'string') return accessibilityLabelProp;
        return accessibilityLabelProp(highlightedItem);
      }, [accessibilityLabelProp, highlightedItem]);

      // Gesture handling for highlighting (long press + pan)
      const getDataIndexFromX = useCallback(
        (touchX: number): number => {
          'worklet';

          if (!xSerializableScale || !xAxis) return 0;

          if (xSerializableScale.type === 'band') {
            const [domainMin, domainMax] = xSerializableScale.domain;
            const categoryCount = domainMax - domainMin + 1;
            let closestIndex = 0;
            let closestDistance = Infinity;

            for (let i = 0; i < categoryCount; i++) {
              const xPos = getPointOnSerializableScale(i, xSerializableScale);
              if (xPos !== undefined) {
                const distance = Math.abs(touchX - xPos);
                if (distance < closestDistance) {
                  closestDistance = distance;
                  closestIndex = i;
                }
              }
            }
            return closestIndex;
          } else {
            // For numeric scales with axis data, find the nearest data point
            const axisData = xAxis.data;
            if (axisData && Array.isArray(axisData) && typeof axisData[0] === 'number') {
              const numericData = axisData as number[];
              let closestIndex = 0;
              let closestDistance = Infinity;

              for (let i = 0; i < numericData.length; i++) {
                const xValue = numericData[i];
                const xPos = getPointOnSerializableScale(xValue, xSerializableScale);
                if (xPos !== undefined) {
                  const distance = Math.abs(touchX - xPos);
                  if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = i;
                  }
                }
              }
              return closestIndex;
            } else {
              const xValue = invertSerializableScale(touchX, xSerializableScale);
              const dataIndex = Math.round(xValue);
              const domain = xAxis.domain;
              return Math.max(domain.min ?? 0, Math.min(dataIndex, domain.max ?? 0));
            }
          }
        },
        [xAxis, xSerializableScale],
      );

      const handleStartEndHaptics = useCallback(() => {
        void Haptics.lightImpact();
      }, []);

      // Shared ref for tracking highlighted item in gesture handler
      const highlightedItemRef = useRef<HighlightedItemData | undefined>(undefined);

      const longPressGesture = useMemo(
        () =>
          Gesture.Pan()
            .activateAfterLongPress(110)
            .shouldCancelWhenOutside(!allowOverflowGestures)
            .onStart(function onStart(event) {
              handleStartEndHaptics();

              // Android does not trigger onUpdate when the gesture starts
              if (Platform.OS === 'android') {
                const dataIndex = getDataIndexFromX(event.x);
                const current = highlightedItemRef.current;
                if (current?.dataIndex !== dataIndex) {
                  highlightedItemRef.current = { ...current, dataIndex };
                  handleHighlightChange({ ...current, dataIndex });
                }
              }
            })
            .onUpdate(function onUpdate(event) {
              const dataIndex = getDataIndexFromX(event.x);
              const current = highlightedItemRef.current;
              if (current?.dataIndex !== dataIndex) {
                highlightedItemRef.current = { ...current, dataIndex };
                handleHighlightChange({ ...current, dataIndex });
              }
            })
            .onEnd(function onEnd() {
              if (enableHighlighting) {
                handleStartEndHaptics();
                highlightedItemRef.current = undefined;
                handleHighlightChange(undefined);
              }
            })
            .onTouchesCancelled(function onTouchesCancelled() {
              if (enableHighlighting) {
                highlightedItemRef.current = undefined;
                handleHighlightChange(undefined);
              }
            }),
        [
          allowOverflowGestures,
          handleStartEndHaptics,
          getDataIndexFromX,
          enableHighlighting,
          handleHighlightChange,
        ],
      );

      const chartContent = (
        <CartesianChartProvider value={contextValue}>
          <HighlightProvider
            enableHighlighting={enableHighlighting}
            onHighlightChange={handleHighlightChange}
          >
            <ScrubberProvider
              allowOverflowGestures={allowOverflowGestures}
              enableScrubbing={enableScrubbing}
              onScrubberPositionChange={onScrubberPositionChange}
            >
              <Box
                ref={(node) => {
                  chartRef.current = node;
                  if (ref) {
                    if (typeof ref === 'function') {
                      ref(node);
                    } else {
                      ref.current = node;
                    }
                  }
                }}
                accessibilityLabel={accessibilityLabel}
                accessibilityLiveRegion="polite"
                accessibilityRole="image"
                collapsable={collapsable}
                height={height}
                style={rootStyles}
                width={width}
                {...props}
              >
                {isLegendBefore && legendElement}
                <ChartCanvas onLayout={onContainerLayout} style={styles?.chart}>
                  {children}
                </ChartCanvas>
                {!isLegendBefore && legendElement}
              </Box>
            </ScrubberProvider>
          </HighlightProvider>
        </CartesianChartProvider>
      );

      // Wrap with gesture handler only if highlighting is enabled
      if (enableHighlighting) {
        return <GestureDetector gesture={longPressGesture}>{chartContent}</GestureDetector>;
      }

      return chartContent;
    },
  ),
);

import React, { forwardRef, memo, useCallback, useMemo } from 'react';
import { type StyleProp, type View, type ViewStyle } from 'react-native';
import type { Rect } from '@coinbase/cds-common/types';
import { useLayout } from '@coinbase/cds-mobile/hooks/useLayout';
import type { BoxBaseProps, BoxProps } from '@coinbase/cds-mobile/layout';
import { Box } from '@coinbase/cds-mobile/layout';
import { Canvas, Skia, type SkTypefaceFontProvider } from '@shopify/react-native-skia';

import { useChartContextBridge } from './ChartContextBridge';
import { PolarChartProvider } from './polar/PolarChartProvider';
import type { PolarSeries } from './polar/utils';
import {
  type AngularAxisConfig,
  defaultPolarAxisId,
  type RadialAxisConfig,
} from './polar/utils/axis';
import type { PolarChartContextValue } from './utils/context';
import { type ChartInset, defaultChartInset, getChartInset } from './utils';

const ChartCanvas = memo(
  ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => {
    const ContextBridge = useChartContextBridge();

    return (
      <Canvas style={[{ width: '100%', height: '100%' }, style]}>
        <ContextBridge>{children}</ContextBridge>
      </Canvas>
    );
  },
);

export type PolarChartBaseProps = Omit<BoxBaseProps, 'fontFamily'> & {
  /**
   * Configuration object that defines the data to visualize.
   */
  series?: PolarSeries[];
  /**
   * Whether to animate the chart.
   * @default true
   */
  animate?: boolean;
  /**
   * Configuration for angular axis/axes (controls start/end angles).
   * Can be a single axis config or an array of axis configs for multiple angular ranges.
   * Default range: { min: 0, max: 360 } (full circle)
   *
   * @example
   * Single axis (default):
   * ```tsx
   * // Semicircle
   * <PolarChart angularAxis={{ range: { min: 0, max: 180 } }} />
   *
   * // Add padding between slices
   * <PolarChart angularAxis={{ paddingAngle: 2 }} />
   * ```
   *
   * @example
   * Multiple axes:
   * ```tsx
   * <PolarChart
   *   angularAxis={[
   *     { id: 'top', range: { min: 0, max: 180 } },
   *     { id: 'bottom', range: { min: 180, max: 360 } },
   *   ]}
   *   series={[
   *     { id: 'topData', data: [...], angularAxisId: 'top' },
   *     { id: 'bottomData', data: [...], angularAxisId: 'bottom' },
   *   ]}
   * />
   * ```
   */
  angularAxis?: AngularAxisConfig | AngularAxisConfig[];
  /**
   * Configuration for radial axis/axes (controls inner/outer radii).
   * Can be a single axis config or an array of axis configs for multiple radial ranges.
   * Default range: { min: 0, max: [radius in pixels] } (pie chart using full radius)
   *
   * @example
   * Single axis (default):
   * ```tsx
   * // Donut chart with 50% inner radius
   * <PolarChart radialAxis={{ range: ({ max }) => ({ min: max * 0.5, max }) }} />
   * ```
   *
   * @example
   * Multiple axes (nested rings):
   * ```tsx
   * <PolarChart
   *   radialAxis={[
   *     { id: 'inner', range: ({ max }) => ({ min: 0, max: max * 0.4 }) },
   *     { id: 'outer', range: ({ max }) => ({ min: max * 0.6, max }) },
   *   ]}
   *   series={[
   *     { id: 'innerData', data: [...], radialAxisId: 'inner' },
   *     { id: 'outerData', data: [...], radialAxisId: 'outer' },
   *   ]}
   * />
   * ```
   */
  radialAxis?: RadialAxisConfig | RadialAxisConfig[];
  /**
   * Inset around the entire chart (outside the drawing area).
   */
  inset?: number | Partial<ChartInset>;
};

export type PolarChartProps = PolarChartBaseProps &
  Omit<BoxProps, 'fontFamily'> & {
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
    };
  };

/**
 * Base component for polar coordinate charts (pie, donut).
 * Provides context and layout for polar chart child components.
 */
export const PolarChart = memo(
  forwardRef<View, PolarChartProps>(
    (
      {
        series = [],
        children,
        animate = true,
        angularAxis,
        radialAxis,
        inset: insetInput,
        width = '100%',
        height = '100%',
        style,
        styles,
        fontFamilies,
        fontProvider: fontProviderProp,
        // React Native will collapse views by default when only used
        // to group children, which interferes with gesture-handler
        // https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/gesture-detector/#:~:text=%7B%0A%20%20return%20%3C-,View,-collapsable%3D%7B
        collapsable = false,
        ...props
      },
      ref,
    ) => {
      const [containerLayout, onContainerLayout] = useLayout();

      const chartWidth = containerLayout.width;
      const chartHeight = containerLayout.height;

      const inset = useMemo(() => {
        return getChartInset(insetInput, defaultChartInset);
      }, [insetInput]);

      // Calculate drawing area - always square for polar charts
      const drawingArea: Rect = useMemo(() => {
        if (chartWidth <= 0 || chartHeight <= 0) return { x: 0, y: 0, width: 0, height: 0 };

        const availableWidth = chartWidth - inset.left - inset.right;
        const availableHeight = chartHeight - inset.top - inset.bottom;

        // Use the smaller dimension to create a square drawing area
        const size = Math.min(
          availableWidth > 0 ? availableWidth : 0,
          availableHeight > 0 ? availableHeight : 0,
        );

        // Center the square drawing area within the available space
        const offsetX = (availableWidth - size) / 2;
        const offsetY = (availableHeight - size) / 2;

        return {
          x: inset.left + offsetX,
          y: inset.top + offsetY,
          width: size,
          height: size,
        };
      }, [chartWidth, chartHeight, inset]);

      const getSeries = useCallback(
        (seriesId?: string) => series.find((s) => s.id === seriesId),
        [series],
      );

      // Build angular axis map
      const angularAxes = useMemo(() => {
        const axesMap = new Map<string, AngularAxisConfig>();

        if (Array.isArray(angularAxis)) {
          angularAxis.forEach((axis) => {
            const id = axis.id ?? defaultPolarAxisId;
            axesMap.set(id, axis);
          });
        } else if (angularAxis) {
          const id = angularAxis.id ?? defaultPolarAxisId;
          axesMap.set(id, angularAxis);
        } else {
          // Default axis
          axesMap.set(defaultPolarAxisId, {});
        }

        return axesMap;
      }, [angularAxis]);

      // Build radial axis map
      const radialAxes = useMemo(() => {
        const axesMap = new Map<string, RadialAxisConfig>();

        if (Array.isArray(radialAxis)) {
          radialAxis.forEach((axis) => {
            const id = axis.id ?? defaultPolarAxisId;
            axesMap.set(id, axis);
          });
        } else if (radialAxis) {
          const id = radialAxis.id ?? defaultPolarAxisId;
          axesMap.set(id, radialAxis);
        } else {
          // Default axis
          axesMap.set(defaultPolarAxisId, {});
        }

        return axesMap;
      }, [radialAxis]);

      const getAngularAxis = useCallback(
        (id?: string) => angularAxes.get(id ?? defaultPolarAxisId),
        [angularAxes],
      );

      const getRadialAxis = useCallback(
        (id?: string) => radialAxes.get(id ?? defaultPolarAxisId),
        [radialAxes],
      );

      const fontProvider = useMemo(() => {
        if (fontProviderProp) return fontProviderProp;
        return Skia.TypefaceFontProvider.Make();
      }, [fontProviderProp]);

      const contextValue: PolarChartContextValue = useMemo(
        () => ({
          series,
          getSeries,
          animate,
          width: chartWidth,
          height: chartHeight,
          fontFamilies,
          fontProvider,
          drawingArea,
          angularAxes,
          radialAxes,
          getAngularAxis,
          getRadialAxis,
        }),
        [
          series,
          getSeries,
          animate,
          chartWidth,
          chartHeight,
          fontFamilies,
          fontProvider,
          drawingArea,
          angularAxes,
          radialAxes,
          getAngularAxis,
          getRadialAxis,
        ],
      );

      const rootStyles = useMemo(() => {
        return [style, styles?.root];
      }, [style, styles?.root]);

      return (
        <PolarChartProvider value={contextValue}>
          <Box
            ref={ref}
            accessibilityLiveRegion="polite"
            accessibilityRole="image"
            collapsable={collapsable}
            height={height}
            onLayout={onContainerLayout}
            style={rootStyles}
            width={width}
            {...props}
          >
            <ChartCanvas style={styles?.chart}>{children}</ChartCanvas>
          </Box>
        </PolarChartProvider>
      );
    },
  ),
);


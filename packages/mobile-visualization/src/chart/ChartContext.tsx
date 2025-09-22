import { createContext, useContext } from 'react';
import type { Rect } from '@coinbase/cds-common/types';
import type {
  AxisConfig,
  ChartPadding,
  ChartScaleFunction,
  Series,
} from '@coinbase/cds-common/visualizations/charts';

export type ChartContextValue = {
  /**
   * Configuration objects that define how to visualize the data.
   */
  series?: Array<Series>;
  /**
   * Map of stacked data by series ID.
   * Contains transformed [bottom, top] tuples for series that are part of a stack.
   */
  stackedDataMap: Map<string, Array<[number, number] | null>>;
  /**
   * Returns the series which matches the seriesId or undefined.
   * @param seriesId - A series' id
   */
  getSeries: (seriesId?: string) => Series | undefined;
  /**
   * Returns the data for a series, using stacked data if available.
   * @param seriesId - A series' id
   * @returns The stacked data if series is stacked, otherwise original data
   */
  getSeriesData: (
    seriesId?: string,
  ) => Array<number | null> | Array<[number, number] | null> | undefined;
  /**
   * Returns stacked/normalized tuple data for a series.
   * @param seriesId - A series' id
   * @returns Stacked tuple data for the series
   */
  getStackedSeriesData: (seriesId?: string) => Array<[number, number] | null> | undefined;
  /**
   * Prevents default animations on the chart.
   */
  disableAnimations?: boolean;
  /**
   * Map of x-axis configurations by axis ID.
   */
  xAxes: Map<string, AxisConfig>;
  /**
   * Map of y-axis configurations by axis ID.
   */
  yAxes: Map<string, AxisConfig>;
  /**
   * Map of x-axis scale functions by axis ID.
   */
  xScales: Map<string, ChartScaleFunction>;
  /**
   * Map of y-axis scale functions by axis ID.
   */
  yScales: Map<string, ChartScaleFunction>;
  /**
   * Dimensions of the svg.
   */
  width: number;
  height: number;
  /**
   * Padding around the chart content.
   */
  padding: ChartPadding;
  /**
   * Chart rectangle bounds factoring in padding.
   */
  rect: Rect;
  /**
   * Helper to get x-axis configuration by ID.
   * @param id - The axis ID. Defaults to defaultAxisId.
   */
  getXAxis: (id?: string) => AxisConfig | undefined;
  /**
   * Helper to get y-axis configuration by ID.
   * @param id - The axis ID. Defaults to defaultAxisId.
   */
  getYAxis: (id?: string) => AxisConfig | undefined;
  /**
   * Helper to get x-axis scale function by ID.
   * @param id - The axis ID. Defaults to defaultAxisId.
   */
  getXScale: (id?: string) => ChartScaleFunction | undefined;
  /**
   * Helper to get y-axis scale function by ID.
   * @param id - The axis ID. Defaults to defaultAxisId.
   */
  getYScale: (id?: string) => ChartScaleFunction | undefined;
  /**
   * Helper to get the default x-axis configuration.
   */
  getDefaultXAxis: () => AxisConfig | undefined;
  /**
   * Helper to get the default y-axis configuration.
   */
  getDefaultYAxis: () => AxisConfig | undefined;
};

export const ChartContext = createContext<ChartContextValue | undefined>(undefined);

export const useChartContext = (): ChartContextValue => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error('useChartContext must be used within a Chart component');
  }
  return context;
};

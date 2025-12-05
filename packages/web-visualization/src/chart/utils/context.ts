import { createContext, useContext } from 'react';
import type { Rect } from '@coinbase/cds-common/types';

import type { AngularAxisConfig, RadialAxisConfig } from '../polar/utils/axis';
import type { PolarSeries } from '../polar/utils/polar';

import type { AxisConfig } from './axis';
import type { Series } from './chart';
import type { ChartScaleFunction } from './scale';

/**
 * Base context value shared by all chart types.
 * Contains common properties needed by shared components like ChartText.
 */
export type ChartContextValue = {
  /**
   * Whether to animate the chart.
   */
  animate: boolean;
  /**
   * Width of the chart.
   */
  width: number;
  /**
   * Height of the chart.
   */
  height: number;
  /**
   * Drawing area of the chart.
   */
  drawingArea: Rect;
};

/**
 * Context value for Cartesian (X/Y) coordinate charts.
 * Contains axis-specific methods and properties for rectangular coordinate systems.
 */
export type CartesianChartContextValue = ChartContextValue & {
  /**
   * The series data for the chart.
   */
  series: Series[];
  /**
   * Returns the series which matches the seriesId or undefined.
   * @param seriesId - A series' id
   */
  getSeries: (seriesId?: string) => Series | undefined;
  /**
   * Returns the data for a series
   * @param seriesId - A series' id
   * @returns data for series, if series exists
   */
  getSeriesData: (seriesId?: string) => Array<[number, number] | null> | undefined;
  /**
   * Get x-axis configuration.
   */
  getXAxis: () => AxisConfig | undefined;
  /**
   * Get y-axis configuration by ID.
   * @param id - The axis ID. Defaults to defaultAxisId.
   */
  getYAxis: (id?: string) => AxisConfig | undefined;
  /**
   * Get x-axis scale function.
   */
  getXScale: () => ChartScaleFunction | undefined;
  /**
   * Get y-axis scale function by ID.
   * @param id - The axis ID. Defaults to defaultAxisId.
   */
  getYScale: (id?: string) => ChartScaleFunction | undefined;
  /**
   * Length of the data domain.
   * This is equal to the length of xAxis.data or the longest series data length
   * This equals the number of possible scrubber positions
   */
  dataLength: number;
  /**
   * Registers an axis.
   * Used by axis components to reserve space in the chart, preventing overlap with the drawing area.
   * @param id - The axis ID
   * @param position - The axis position ('top'/'bottom' for x-axis, 'left'/'right' for y-axis)
   * @param size - The size of the axis in pixels
   */
  registerAxis: (id: string, position: 'top' | 'bottom' | 'left' | 'right', size: number) => void;
  /**
   * Unregisters an axis.
   */
  unregisterAxis: (id: string) => void;
  /**
   * Gets the rectangle bounds of a requested axis.
   * Computes the bounds of the axis based on the chart's drawing area chart/axis config, and axis position.
   */
  getAxisBounds: (id: string) => Rect | undefined;
  /**
   * Reference to the chart's SVG element.
   */
  svgRef?: React.RefObject<SVGSVGElement | null>;
  /**
   * References to the chart's slot containers for portaling content.
   */
  slotRefs?: {
    topRef: React.RefObject<HTMLElement | null>;
    bottomRef: React.RefObject<HTMLElement | null>;
    leftRef: React.RefObject<HTMLElement | null>;
    rightRef: React.RefObject<HTMLElement | null>;
  };
};

/**
 * Context value for polar coordinate charts (pie, donut, etc.).
 * Contains axis-specific methods and properties for circular coordinate systems.
 */
export type PolarChartContextValue = ChartContextValue & {
  /**
   * The series data for the chart.
   */
  series: PolarSeries[];
  /**
   * Returns the series which matches the seriesId or undefined.
   * @param seriesId - A series' id
   */
  getSeries: (seriesId?: string) => PolarSeries | undefined;
  /**
   * Map of angular axis configurations by ID.
   */
  angularAxes: Map<string, AngularAxisConfig>;
  /**
   * Map of radial axis configurations by ID.
   */
  radialAxes: Map<string, RadialAxisConfig>;
  /**
   * Returns the angular axis configuration by ID.
   * If no ID is provided, returns the default angular axis.
   */
  getAngularAxis: (id?: string) => AngularAxisConfig | undefined;
  /**
   * Returns the radial axis configuration by ID.
   * If no ID is provided, returns the default radial axis.
   */
  getRadialAxis: (id?: string) => RadialAxisConfig | undefined;
};

export type ScrubberContextValue = {
  /**
   * Enables scrubbing interactions.
   * When true, allows scrubbing and makes scrubber components interactive.
   */
  enableScrubbing: boolean;
  /**
   * The current position of the scrubber.
   */
  scrubberPosition?: number;
  /**
   * Callback fired when the scrubber position changes.
   * Receives the dataIndex of the scrubber or undefined when not scrubbing.
   */
  onScrubberPositionChange: (index: number | undefined) => void;
};

export const ScrubberContext = createContext<ScrubberContextValue | undefined>(undefined);

export const useScrubberContext = (): ScrubberContextValue => {
  const context = useContext(ScrubberContext);
  if (!context) {
    throw new Error('useScrubberContext must be used within a Chart component');
  }
  return context;
};

/**
 * Context for Cartesian charts.
 * @internal Use useCartesianChartContext() to access.
 */
export const CartesianChartContext = createContext<CartesianChartContextValue | undefined>(
  undefined,
);

/**
 * Context for Polar charts.
 * @internal Use usePolarChartContext() to access.
 */
export const PolarChartContext = createContext<PolarChartContextValue | undefined>(undefined);

/**
 * Hook to access the base chart context.
 * Works in both CartesianChart and PolarChart components.
 * Use this for components that need to work in any chart type (e.g., ChartText).
 *
 * @example
 * const { width, height, animate } = useChartContext();
 */
export const useChartContext = (): ChartContextValue => {
  const cartesian = useContext(CartesianChartContext);
  const polar = useContext(PolarChartContext);

  const context = cartesian ?? polar;
  if (!context) {
    throw new Error(
      'useChartContext must be used within a Chart component (CartesianChart or PolarChart).',
    );
  }

  return context;
};

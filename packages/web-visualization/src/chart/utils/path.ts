import {
  area as d3Area,
  curveBumpX,
  curveCatmullRom,
  curveLinear,
  curveLinearClosed,
  curveMonotoneX,
  curveNatural,
  curveStep,
  curveStepAfter,
  curveStepBefore,
  line as d3Line,
  curveMonotoneY,
  curveBumpY,
} from 'd3-shape';

import { getPointOnScale, projectPoint, projectPoints } from './point';
import { type ChartScaleFunction, isCategoricalScale } from './scale';
import type { CartesianChartLayout } from './context';

export type ChartPathCurveType =
  | 'bump'
  | 'catmullRom'
  | 'linear'
  | 'linearClosed'
  | 'monotone'
  | 'natural'
  | 'step'
  | 'stepBefore'
  | 'stepAfter';

/**
 * Get the d3 curve function for a path.
 * See https://d3js.org/d3-shape/curve
 * @param curve - The curve type. Defaults to 'linear'.
 * @param layout - The chart layout. Defaults to 'horizontal'.
 * @returns The d3 curve function.
 */
export const getPathCurveFunction = (
  curve: ChartPathCurveType = 'linear',
  layout: CartesianChartLayout = 'horizontal',
) => {
  switch (curve) {
    case 'catmullRom':
      return curveCatmullRom;
    case 'monotone':
      return layout === 'vertical' ? curveMonotoneY : curveMonotoneX;
    case 'natural':
      return curveNatural;
    case 'step':
      return curveStep;
    case 'stepBefore':
      return curveStepBefore;
    case 'stepAfter':
      return curveStepAfter;
    case 'bump':
      return layout === 'vertical' ? curveBumpY : curveBumpX;
    case 'linearClosed':
      return curveLinearClosed;
    case 'linear':
    default:
      return curveLinear;
  }
};

/**
 * Generates an SVG line path string from data using chart scale functions.
 *
 * @example
 * ```typescript
 * const chartScale = getChartScale({ chartRect, domain, range, xScale, yScale });
 * const path = getLinePath({ data: [1, 2, 3], chartScale, curve: 'bump' });
 * ```
 */
export const getLinePath = ({
  data,
  curve = 'bump',
  xScale,
  yScale,
  xData,
  yData,
  connectNulls,
  layout = 'horizontal',
}: {
  data: (number | null | { x: number; y: number })[];
  curve?: ChartPathCurveType;
  xScale: ChartScaleFunction;
  yScale: ChartScaleFunction;
  xData?: number[];
  yData?: number[];
  /**
   * When true, null values are skipped and the line connects across gaps.
   * By default, null values create gaps in the line.
   */
  connectNulls?: boolean;
  /**
   * Chart layout.
   * @default 'horizontal'
   */
  layout?: CartesianChartLayout;
}): string => {
  if (data.length === 0) {
    return '';
  }

  const curveFunction = getPathCurveFunction(curve, layout);

  const dataPoints = projectPoints({ data, xScale, yScale, xData, yData, layout });

  // When connectNulls is true, filter out null values before rendering
  // When false, use defined() to create gaps in the line
  const filteredPoints = connectNulls ? dataPoints.filter((d) => d !== null) : dataPoints;

  const pathGenerator = d3Line<{ x: number; y: number } | null>()
    .x((d) => d!.x)
    .y((d) => d!.y)
    .curve(curveFunction)
    .defined((d) => connectNulls || d !== null);

  return pathGenerator(filteredPoints) ?? '';
};

/**
 * Generates an SVG area path string from data using chart scale functions.
 * Supports both single values (area from baseline to value) and tuples ([baseline, value]).
 *
 * @example
 * ```typescript
 * // Single values - area from baseline to value
 * const area = getAreaPath({
 *   data: [1, 2, 3],
 *   xScale,
 *   yScale,
 * });
 *
 * // Range values - area from low to high
 * const rangeArea = getAreaPath({
 *   data: [[0, 3], [2, 4], [1, 5]],
 *   xScale,
 *   yScale,
 *   curve: 'monotone'
 * });
 * ```
 */
export const getAreaPath = ({
  data,
  curve = 'bump',
  xScale,
  yScale,
  xData,
  yData,
  connectNulls,
  layout = 'horizontal',
}: {
  data: (number | null)[] | Array<[number, number] | null>;
  xScale: ChartScaleFunction;
  yScale: ChartScaleFunction;
  curve: ChartPathCurveType;
  xData?: number[];
  yData?: number[];
  /**
   * When true, null values are skipped and the area connects across gaps.
   * By default null values create gaps in the area.
   */
  connectNulls?: boolean;
  /**
   * Chart layout.
   * @default 'horizontal'
   */
  layout?: CartesianChartLayout;
}): string => {
  if (data.length === 0) {
    return '';
  }

  const curveFunction = getPathCurveFunction(curve, layout);
  const isHorizontal = layout === 'horizontal';

  // Determine baseline from the value scale
  const valueScale = isHorizontal ? yScale : xScale;
  const domain = valueScale.domain();
  const min = Math.min(...domain);

  const normalizedData: Array<[number, number] | null> = data.map((item) => {
    if (item === null) {
      return null;
    }

    if (Array.isArray(item)) {
      if (item.length >= 2 && typeof item[0] === 'number' && typeof item[1] === 'number') {
        return [item[0], item[1]];
      }
      return null;
    }

    if (typeof item === 'number') {
      return [min, item];
    }

    return null;
  });

  const dataPoints = normalizedData.map((range, index) => {
    if (range === null) {
      return {
        x: 0,
        y: 0,
        low: null,
        high: null,
        isValid: false,
      };
    }

    // Determine the position along the independent (index) axis
    let indexValue: number = index;
    const indexScale = isHorizontal ? xScale : yScale;
    const indexData = isHorizontal ? xData : yData;

    if (!isCategoricalScale(indexScale) && indexData && indexData[index] !== undefined) {
      indexValue = indexData[index];
    }

    const pos = getPointOnScale(indexValue, indexScale);
    const low = getPointOnScale(range[0], valueScale);
    const high = getPointOnScale(range[1], valueScale);

    return {
      x: isHorizontal ? pos : 0,
      y: !isHorizontal ? pos : 0,
      low,
      high,
      isValid: true,
    };
  });

  // When connectNulls is true, filter out invalid points before rendering
  // When false, use defined() to create gaps in the area
  const filteredPoints = connectNulls ? dataPoints.filter((d) => d.isValid) : dataPoints;

  const areaGenerator = d3Area<{
    x: number;
    y: number;
    low: number | null;
    high: number | null;
    isValid: boolean;
  }>();

  if (isHorizontal) {
    areaGenerator
      .x((d) => d.x)
      .y0((d) => d.low ?? 0)
      .y1((d) => d.high ?? 0);
  } else {
    areaGenerator
      .y((d) => d.y)
      .x0((d) => d.low ?? 0)
      .x1((d) => d.high ?? 0);
  }

  areaGenerator
    .curve(curveFunction)
    .defined((d) => connectNulls || (d.isValid && d.low != null && d.high != null));

  const result = areaGenerator(filteredPoints);
  return result ?? '';
};

/**
 * Converts line coordinates to an SVG path string.
 * Useful for rendering axis lines and tick marks.
 *
 * @example
 * ```typescript
 * const path = lineToPath(0, 0, 100, 100);
 * // Returns: "M 0 0 L 100 100"
 * ```
 */
export const lineToPath = (x1: number, y1: number, x2: number, y2: number): string => {
  return `M${x1},${y1} L${x2},${y2}`;
};

/**
 * Creates an SVG path string for a rectangle with selective corner rounding.
 * Useful for creating bars in charts with optional rounded corners.
 *
 * @example
 * ```typescript
 * // Simple rectangle bar
 * const barPath = getBarPath(10, 20, 50, 100, 0, false, false);
 *
 * // Bar with rounded top corners
 * const roundedPath = getBarPath(10, 20, 50, 100, 8, true, false);
 * ```
 */
export const getBarPath = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  roundTop: boolean,
  roundBottom: boolean,
  layout: CartesianChartLayout = 'horizontal',
): string => {
  const roundBothSides = roundTop && roundBottom;
  const isHorizontal = layout === 'horizontal';
  const r = Math.min(radius, width / 2, roundBothSides ? height / 2 : height);

  // In horizontal layout:
  // - roundTop rounds the top face (min Y)
  // - roundBottom rounds the bottom face (max Y)
  // In vertical layout:
  // - roundTop rounds the right face (max X)
  // - roundBottom rounds the left face (min X)

  const rTL = isHorizontal ? (roundTop ? r : 0) : (roundBottom ? r : 0);
  const rTR = isHorizontal ? (roundTop ? r : 0) : (roundTop ? r : 0);
  const rBR = isHorizontal ? (roundBottom ? r : 0) : (roundTop ? r : 0);
  const rBL = isHorizontal ? (roundBottom ? r : 0) : (roundBottom ? r : 0);

  // Build path with selective rounding
  let path = `M ${x + rTL} ${y}`;
  path += ` L ${x + width - rTR} ${y}`;
  path += ` A ${rTR} ${rTR} 0 0 1 ${x + width} ${y + rTR}`;

  path += ` L ${x + width} ${y + height - rBR}`;
  path += ` A ${rBR} ${rBR} 0 0 1 ${x + width - rBR} ${y + height}`;

  path += ` L ${x + rBL} ${y + height}`;
  path += ` A ${rBL} ${rBL} 0 0 1 ${x} ${y + height - rBL}`;

  path += ` L ${x} ${y + rTL}`;
  path += ` A ${rTL} ${rTL} 0 0 1 ${x + rTL} ${y}`;

  path += ' Z';
  return path;
};

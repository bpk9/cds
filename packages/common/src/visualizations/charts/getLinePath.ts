import { line as d3Line } from 'd3-shape';

import { type ChartPathCurveType, getPathCurveFunction } from './getPathCurveFunction';
import { projectPoints } from './getPoints';
import type { ChartScaleFunction } from './scale';

/**
 * Generates an SVG line path string from data using chart scale functions.
 *
 * @example
 * ```typescript
 * const chartScale = getChartScale({ chartRect, domain, range, xScale, yScale });
 * const path = getLinePath({ data: [1, 2, 3], chartScale, curve: 'linear' });
 * ```
 */
export const getLinePath = ({
  data,
  curve = 'linear',
  xScale,
  yScale,
  xData,
}: {
  data: (number | null | { x: number; y: number })[];
  curve?: ChartPathCurveType;
  xScale: ChartScaleFunction;
  yScale: ChartScaleFunction;
  xData?: number[];
}): string => {
  if (data.length === 0) {
    return '';
  }

  const curveFunction = getPathCurveFunction(curve);

  const dataPoints = projectPoints({ data, xScale, yScale, xData });

  const pathGenerator = d3Line<{ x: number; y: number } | null>()
    .x((d) => d!.x)
    .y((d) => d!.y)
    .curve(curveFunction)
    .defined((d) => d !== null); // Only draw lines where point is not null

  // todo: is it fine that 1 data point = a dot vs a flat line?
  return pathGenerator(dataPoints) ?? '';
};

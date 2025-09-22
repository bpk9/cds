import { type ChartScaleFunction, isBandScale, isNumericScale } from './scale';

/**
 * Projects a data point to pixel coordinates using the chart scale.
 *
 * @example
 * ```typescript
 * const chartScale = getChartScale({ chartRect, domain, range, xScale, yScale });
 * const pixelCoord = projectPoint({ x: 5, y: 10, chartScale });
 * ```
 * @example
 * ```typescript
 * const chartScale = getChartScale({ chartRect, domain, range, xScale, yScale });
 * const pixelCoord = projectPoint({ x: 2, y: 10, chartScale, xData: ['Jan', 'Feb', 'Mar'] });
 * ```
 */
export const projectPoint = ({
  x,
  y,
  xScale,
  yScale,
}: {
  x: number;
  y: number;
  xScale: ChartScaleFunction;
  yScale: ChartScaleFunction;
}): { x: number; y: number } => {
  let pixelX: number;
  let pixelY: number;

  if (isNumericScale(xScale)) {
    pixelX = xScale(x) ?? 0;
  } else {
    const bandStart = xScale(x) ?? 0;
    const bandwidth = xScale.bandwidth?.() ?? 0;
    // Center within the band
    pixelX = bandStart + bandwidth / 2;
  }

  if (isNumericScale(yScale)) {
    pixelY = yScale(y as number) ?? 0;
  } else {
    // Band scale - convert index to category if needed
    pixelY = (yScale as any)(String(y)) ?? 0;
    // Center within the band
    const bandwidth = (yScale as any).bandwidth?.() ?? 0;
    pixelY += bandwidth / 2;
  }

  return { x: pixelX, y: pixelY };
};

/**
 * Projects multiple data points to pixel coordinates using chart scale functions.
 * Handles both numeric and band scales automatically.
 *
 * @example
 * ```typescript
 * const chartScale = getChartScale({ chartRect, domain, range, xScale, yScale });
 * const pixelPoints = projectPoints({ data, chartScale });
 * // For mixed scales
 * const pixelPoints = projectPoints({ data, chartScale, xData: ['Jan', 'Feb', 'Mar'] });
 * ```
 */
export const projectPoints = ({
  data,
  xScale,
  yScale,
  xData,
  yData,
}: {
  data: (number | null | { x: number; y: number })[];
  xData?: number[];
  yData?: number[];
  xScale: ChartScaleFunction;
  yScale: ChartScaleFunction;
}): Array<{ x: number; y: number } | null> => {
  if (data.length === 0) {
    return [];
  }

  return data.map((value, index) => {
    if (value === null) {
      return null;
    }

    if (typeof value === 'object' && 'x' in value && 'y' in value) {
      return projectPoint({
        x: value.x,
        y: value.y,
        xScale,
        yScale,
      });
    }

    // For scales with axis data, determine the correct x value
    let xValue: number = index;

    // For band scales, always use the index
    if (!isBandScale(xScale)) {
      // For numeric scales with axis data, use the axis data values instead of indices
      if (xData && Array.isArray(xData) && xData.length > 0) {
        // Check if it's numeric data
        if (typeof xData[0] === 'number') {
          const numericXData = xData as number[];
          xValue = numericXData[index] ?? index;
        }
      }
    }

    let yValue: number = value as number;
    if (
      isNumericScale(yScale) &&
      yData &&
      Array.isArray(yData) &&
      yData.length > 0 &&
      typeof yData[0] === 'number' &&
      typeof value === 'number'
    ) {
      yValue = value as number;
    }

    return projectPoint({
      x: xValue,
      y: yValue,
      xScale,
      yScale,
    });
  });
};

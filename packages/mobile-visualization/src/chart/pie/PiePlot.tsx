import React, { memo, useMemo } from 'react';

import { usePolarChartContext } from '../polar';
import {
  type ArcData,
  calculateArcData,
  defaultPolarAxisId,
  getAngularAxisRadians,
  getPolarColor,
  getRadialAxisPixels,
  type PolarDataPoint,
} from '../polar/utils';

import { Arc, type ArcProps } from './Arc';

export type PiePlotBaseProps = {
  /**
   * ID of the series to render.
   * - If provided: Only renders that specific series
   * - If not provided: Aggregates all series sharing the same radialAxisId and angularAxisId
   */
  seriesId?: string;
  /**
   * ID of the radial axis to filter series by when seriesId is not provided.
   * Defaults to the default radial axis.
   */
  radialAxisId?: string;
  /**
   * ID of the angular axis to filter series by when seriesId is not provided.
   * Defaults to the default angular axis.
   */
  angularAxisId?: string;
  /**
   * Custom Arc component to use for rendering slices.
   */
  ArcComponent?: React.ComponentType<ArcProps>;
  /**
   * Whether to animate this plot. Overrides the chart-level animate setting.
   */
  animate?: boolean;
  /**
   * Fill opacity for all arcs.
   * @default 1
   */
  fillOpacity?: number;
  /**
   * Stroke color for all arcs.
   */
  stroke?: string;
  /**
   * Stroke width in pixels.
   * @default 0
   */
  strokeWidth?: number;
  /**
   * Corner radius in pixels.
   * @default 0
   */
  cornerRadius?: number;
  /**
   * ID of another series to use as a clipping mask. The current series will only be visible
   * where it overlaps with the specified series.
   * Note: On mobile, this generates Skia clip paths.
   */
  clipToSeriesId?: string;
  /**
   * Custom clip path ID to apply to all arcs. Takes precedence over clipToSeriesId.
   * Use with getArcPath() to create custom clipping shapes.
   * Note: On mobile, pass the actual SVG path string.
   */
  clipPathId?: string;
};

export type PiePlotProps = PiePlotBaseProps;

/**
 * Renders all arcs (slices) for a polar chart.
 * Used internally by PieChart and DonutChart.
 */
export const PiePlot = memo<PiePlotProps>(
  ({
    seriesId,
    radialAxisId: radialAxisIdProp,
    angularAxisId: angularAxisIdProp,
    ArcComponent = Arc,
    animate: animateOverride,
    fillOpacity,
    stroke = '#ffffff',
    strokeWidth = 1,
    cornerRadius,
    clipToSeriesId,
    clipPathId,
  }) => {
    const {
      series,
      getSeries,
      animate: contextAnimate,
      drawingArea,
      getAngularAxis,
      getRadialAxis,
    } = usePolarChartContext();

    // Calculate center and max radius from drawing area
    const { centerX, centerY, maxRadius } = useMemo(() => {
      const cx = drawingArea.x + drawingArea.width / 2;
      const cy = drawingArea.y + drawingArea.height / 2;
      const r = Math.min(drawingArea.width, drawingArea.height) / 2;
      return {
        centerX: cx,
        centerY: cy,
        maxRadius: Math.max(0, r),
      };
    }, [drawingArea]);

    // Use overrides if provided, otherwise use context values
    const shouldAnimate = animateOverride !== undefined ? animateOverride : contextAnimate;

    // Convert series data to PolarDataPoint[]
    const convertSeriesToDataPoints = useMemo(() => {
      return (targetSeries: typeof series) => {
        const dataPoints: PolarDataPoint[] = [];

        targetSeries.forEach((s) => {
          // Get the first value from data (single number or first element of array)
          const value = typeof s.data === 'number' ? s.data : s.data[0];

          if (value !== null && value !== undefined) {
            dataPoints.push({
              value,
              label: s.label,
              color: s.color,
              id: s.id,
            });
          }
        });

        return dataPoints;
      };
    }, []);

    // Get target series and axis config
    const { targetSeriesArray, targetRadialAxisId, targetAngularAxisId } = useMemo(() => {
      if (seriesId) {
        // Single series mode
        const singleSeries = getSeries(seriesId);
        return {
          targetSeriesArray: singleSeries ? [singleSeries] : [],
          targetRadialAxisId: singleSeries?.radialAxisId ?? defaultPolarAxisId,
          targetAngularAxisId: singleSeries?.angularAxisId ?? defaultPolarAxisId,
        };
      } else {
        // Aggregate mode: get all series with matching radialAxisId AND angularAxisId
        const filterRadialAxisId = radialAxisIdProp ?? defaultPolarAxisId;
        const filterAngularAxisId = angularAxisIdProp ?? defaultPolarAxisId;

        const matchingSeries = series.filter(
          (s) =>
            (s.radialAxisId ?? defaultPolarAxisId) === filterRadialAxisId &&
            (s.angularAxisId ?? defaultPolarAxisId) === filterAngularAxisId,
        );

        return {
          targetSeriesArray: matchingSeries,
          targetRadialAxisId: filterRadialAxisId,
          targetAngularAxisId: filterAngularAxisId,
        };
      }
    }, [seriesId, radialAxisIdProp, angularAxisIdProp, getSeries, series]);

    // Get the angular axis config
    const angularAxisConfig = useMemo(() => {
      return getAngularAxis(targetAngularAxisId);
    }, [targetAngularAxisId, getAngularAxis]);

    // Get the radial axis config
    const radialAxisConfig = useMemo(() => {
      return getRadialAxis(targetRadialAxisId);
    }, [targetRadialAxisId, getRadialAxis]);

    // Calculate angular axis values
    const {
      startAngle: startAngleRadians,
      endAngle: endAngleRadians,
      padAngle,
    } = useMemo(() => {
      return getAngularAxisRadians(angularAxisConfig);
    }, [angularAxisConfig]);

    // Calculate radial axis values
    const { innerRadius, outerRadius } = useMemo(() => {
      return getRadialAxisPixels(maxRadius, radialAxisConfig);
    }, [maxRadius, radialAxisConfig]);

    // Convert series to data points and calculate arcs
    const arcs = useMemo(() => {
      if (!targetSeriesArray.length) {
        return [];
      }

      const dataPoints = convertSeriesToDataPoints(targetSeriesArray);

      if (!dataPoints.length) {
        return [];
      }

      return calculateArcData(
        dataPoints,
        innerRadius,
        outerRadius,
        startAngleRadians,
        endAngleRadians,
        padAngle,
      );
    }, [
      targetSeriesArray,
      convertSeriesToDataPoints,
      innerRadius,
      outerRadius,
      startAngleRadians,
      endAngleRadians,
      padAngle,
    ]);

    if (!arcs.length) {
      return null;
    }

    // TODO: Implement clipToSeriesId support for mobile using Skia clip paths
    // For now, only clipPathId is supported

    return (
      <>
        {/* Render arcs */}
        {arcs.map((arcData: ArcData, index: number) => {
          const fill = getPolarColor(index, arcData.data.color);

          return (
            <ArcComponent
              key={arcData.data.id ?? index}
              arcData={arcData}
              baselineAngle={startAngleRadians}
              clipPathId={clipPathId}
              cornerRadius={cornerRadius}
              fill={fill}
              fillOpacity={fillOpacity}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          );
        })}
      </>
    );
  },
);


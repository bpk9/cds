import React, { memo, useMemo } from 'react';
import type { Rect } from '@coinbase/cds-common';
import type { Transition } from 'framer-motion';

import { useCartesianChartContext } from '../ChartProvider';
import type { CartesianSeries, ChartScaleFunction } from '../utils';
import { evaluateGradientAtValue, getGradientConfig } from '../utils/gradient';

import type { BarComponent, BarProps } from './Bar';
import { DefaultBarStack } from './DefaultBarStack';
import { HorizontalBar } from './HorizontalBar';
import type { BarStackComponent, BarStackComponentProps } from './BarStack';

const EPSILON = 1e-4;

/**
 * Extended series type that includes bar-specific properties.
 */
export type HorizontalBarSeries = CartesianSeries & {
  /**
   * Custom component to render bars for this series.
   */
  BarComponent?: BarComponent;
};

export type HorizontalBarStackBaseProps = Pick<
  BarProps,
  'BarComponent' | 'fillOpacity' | 'stroke' | 'strokeWidth' | 'borderRadius'
> & {
  /**
   * Array of series configurations that belong to this stack.
   */
  series: HorizontalBarSeries[];
  /**
   * The category index for this stack.
   */
  categoryIndex: number;
  /**
   * Y position for this stack (top edge).
   */
  y: number;
  /**
   * Height of this stack.
   */
  height: number;
  /**
   * X scale function (value axis for horizontal bars).
   */
  xScale: ChartScaleFunction;
  /**
   * Chart rect for bounds.
   */
  rect: Rect;
  /**
   * Y axis ID to use.
   * If not provided, will use the yAxisId from the first series.
   */
  yAxisId?: string;
  /**
   * Custom component to render the stack container.
   * Can be used to add clip paths, outlines, or other custom styling.
   * @default DefaultBarStack
   */
  BarStackComponent?: BarStackComponent;
  /**
   * Whether to round the baseline of a bar (where the value is 0).
   */
  roundBaseline?: boolean;
  /**
   * Gap between bars in the stack.
   */
  stackGap?: number;
  /**
   * Minimum size for individual bars in the stack.
   */
  barMinSize?: number;
  /**
   * Minimum size for the entire stack.
   */
  stackMinSize?: number;
};

export type HorizontalBarStackProps = HorizontalBarStackBaseProps & {
  /**
   * Transition configuration for animation.
   */
  transition?: Transition;
};

/**
 * HorizontalBarStack component that renders a single stack of horizontal bars at a specific category index.
 * Handles the stacking logic for bars within a single category, extending horizontally from the baseline.
 */
export const HorizontalBarStack = memo<HorizontalBarStackProps>(
  ({
    series,
    categoryIndex,
    y,
    height,
    xScale,
    rect,
    BarComponent: defaultBarComponent,
    fillOpacity: defaultFillOpacity,
    stroke: defaultStroke,
    strokeWidth: defaultStrokeWidth,
    borderRadius = 4,
    BarStackComponent = DefaultBarStack,
    stackGap,
    barMinSize,
    stackMinSize,
    roundBaseline,
    transition,
  }) => {
    const { getSeriesData, getYAxis, getYScale, getSeries } = useCartesianChartContext();

    const yScale = getYScale();
    const barMinSizePx = barMinSize;
    const stackMinSizePx = stackMinSize;

    const yAxis = getYAxis();

    // Calculate baseline (x position where value is 0)
    const baseline = useMemo(() => {
      const domain = xScale.domain();
      const [domainMin, domainMax] = domain;
      const baselineValue = domainMin >= 0 ? domainMin : domainMax <= 0 ? domainMax : 0;
      const baseline = xScale(baselineValue) ?? rect.x;

      return Math.max(rect.x, Math.min(baseline, rect.x + rect.width));
    }, [rect.width, rect.x, xScale]);

    const seriesGradients = useMemo(() => {
      return series.map((s) => {
        if (!s.gradient || !xScale || !yScale) return null;

        const gradientScale = s.gradient.axis === 'x' ? xScale : yScale;
        const stops = getGradientConfig(s.gradient, xScale, yScale);
        if (!stops) return null;

        return {
          seriesId: s.id,
          gradient: s.gradient,
          scale: gradientScale,
          stops,
        };
      });
    }, [series, xScale, yScale]);

    // Calculate bars for this specific category
    const { bars, stackRect } = useMemo(() => {
      let allBars: Array<{
        seriesId: string;
        x: number;
        y: number;
        width: number;
        height: number;
        dataX?: number | [number, number] | null;
        BarComponent?: BarComponent;
        fill?: string;
        fillOpacity?: number;
        stroke?: string;
        strokeWidth?: number;
        borderRadius?: BarProps['borderRadius'];
        roundRight?: boolean;
        roundLeft?: boolean;
        shouldApplyGap?: boolean;
      }> = [];

      // Track how many bars we've stacked in each direction for gap calculation
      let positiveBarCount = 0;
      let negativeBarCount = 0;

      // Track stack bounds for clipping
      let minX = Infinity;
      let maxX = -Infinity;

      // Process each series in the stack
      series.forEach((s) => {
        const data = getSeriesData(s.id);
        if (!data) return;

        const value = data[categoryIndex];
        if (value === null || value === undefined) return;

        const originalData = s.data;
        const originalValue = originalData?.[categoryIndex];
        // Only apply gap logic if the original data wasn't tuple format
        const shouldApplyGap = !Array.isArray(originalValue);

        // Sort to be in ascending order
        const [left, right] = (value as [number, number]).sort((a, b) => a - b);

        const isRightOfBaseline = left >= 0 && right !== left;
        const isLeftOfBaseline = left <= 0 && left !== right;

        const barLeft = xScale(left) ?? baseline;
        const barRight = xScale(right) ?? baseline;

        // Track bar counts for later gap calculations
        if (shouldApplyGap) {
          if (isRightOfBaseline) {
            positiveBarCount++;
          } else if (isLeftOfBaseline) {
            negativeBarCount++;
          }
        }

        // Calculate width
        const width = Math.abs(barRight - barLeft);
        const x = Math.min(barLeft, barRight);

        // Skip bars that would have zero or negative width
        if (width <= 0) {
          return;
        }

        // Update stack bounds
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x + width);

        let barFill = s.color ?? 'var(--color-fgPrimary)';

        // Evaluate gradient if provided (using precomputed stops)
        const seriesGradientConfig = seriesGradients.find((g) => g?.seriesId === s.id);
        if (seriesGradientConfig && originalValue !== null && originalValue !== undefined) {
          const axis = seriesGradientConfig.gradient.axis ?? 'x';
          let evalValue: number;
          if (axis === 'y') {
            evalValue = categoryIndex;
          } else {
            evalValue = Array.isArray(originalValue) ? originalValue[1] : originalValue;
          }
          const evaluatedColor = evaluateGradientAtValue(
            seriesGradientConfig.stops,
            evalValue,
            seriesGradientConfig.scale,
          );
          if (evaluatedColor) {
            barFill = evaluatedColor;
          }
        }

        allBars.push({
          seriesId: s.id,
          x,
          y,
          width,
          height,
          dataX: value,
          fill: barFill,
          // Check if the bar should be rounded based on the baseline
          roundRight: roundBaseline || Math.abs(barRight - baseline) >= EPSILON,
          roundLeft: roundBaseline || Math.abs(barLeft - baseline) >= EPSILON,
          BarComponent: s.BarComponent,
          shouldApplyGap,
        });
      });

      // Apply proportional gap distribution to maintain total stack width
      if (stackGap && allBars.length > 1) {
        // Separate bars by baseline side
        const barsRightOfBaseline = allBars.filter((bar) => {
          const [left, right] = (bar.dataX as [number, number]).sort((a, b) => a - b);
          return left >= 0 && right !== left && bar.shouldApplyGap;
        });
        const barsLeftOfBaseline = allBars.filter((bar) => {
          const [left, right] = (bar.dataX as [number, number]).sort((a, b) => a - b);
          return left <= 0 && left !== right && bar.shouldApplyGap;
        });

        // Apply proportional gaps to bars right of baseline
        if (barsRightOfBaseline.length > 1) {
          const totalGapSpace = stackGap * (barsRightOfBaseline.length - 1);
          const totalDataWidth = barsRightOfBaseline.reduce((sum, bar) => sum + bar.width, 0);
          const widthReduction = totalGapSpace / totalDataWidth;

          const sortedBars = barsRightOfBaseline.sort((a, b) => a.x - b.x);

          let currentX = baseline;
          sortedBars.forEach((bar, index) => {
            const newWidth = bar.width * (1 - widthReduction);

            const barIndex = allBars.findIndex((b) => b.seriesId === bar.seriesId);
            if (barIndex !== -1) {
              allBars[barIndex] = {
                ...allBars[barIndex],
                width: newWidth,
                x: currentX,
              };
            }

            currentX = currentX + newWidth + (index < sortedBars.length - 1 ? stackGap : 0);
          });
        }

        // Apply proportional gaps to bars left of baseline
        if (barsLeftOfBaseline.length > 1) {
          const totalGapSpace = stackGap * (barsLeftOfBaseline.length - 1);
          const totalDataWidth = barsLeftOfBaseline.reduce((sum, bar) => sum + bar.width, 0);
          const widthReduction = totalGapSpace / totalDataWidth;

          const sortedBars = barsLeftOfBaseline.sort((a, b) => b.x - a.x);

          let currentX = baseline;
          sortedBars.forEach((bar, index) => {
            const newWidth = bar.width * (1 - widthReduction);
            const newX = currentX - newWidth;

            const barIndex = allBars.findIndex((b) => b.seriesId === bar.seriesId);
            if (barIndex !== -1) {
              allBars[barIndex] = {
                ...allBars[barIndex],
                width: newWidth,
                x: newX,
              };
            }

            currentX = newX - (index < sortedBars.length - 1 ? stackGap : 0);
          });
        }

        // Recalculate stack bounds after gap adjustments
        if (allBars.length > 0) {
          minX = Math.min(...allBars.map((bar) => bar.x));
          maxX = Math.max(...allBars.map((bar) => bar.x + bar.width));
        }
      }

      // Apply border radius logic
      const applyBorderRadiusLogic = (bars: typeof allBars) => {
        return bars
          .sort((a, b) => a.x - b.x)
          .map((a, index) => {
            const barBefore = index > 0 ? bars[index - 1] : null;
            const barAfter = index < bars.length - 1 ? bars[index + 1] : null;

            const shouldRoundRight =
              index === bars.length - 1 ||
              (a.shouldApplyGap && stackGap) ||
              (!a.shouldApplyGap && barAfter && barAfter.x !== a.x + a.width);

            const shouldRoundLeft =
              index === 0 ||
              (a.shouldApplyGap && stackGap) ||
              (!a.shouldApplyGap && barBefore && barBefore.x + barBefore.width !== a.x);

            return {
              ...a,
              roundRight: Boolean(a.roundRight && shouldRoundRight),
              roundLeft: Boolean(a.roundLeft && shouldRoundLeft),
            };
          });
      };

      allBars = applyBorderRadiusLogic(allBars);

      // Calculate the bounding rect for the entire stack
      let stackBounds = {
        x: minX === Infinity ? baseline : minX,
        y,
        width: maxX === -Infinity ? 0 : maxX - minX,
        height,
      };

      return { bars: allBars, stackRect: stackBounds };
    }, [
      series,
      stackGap,
      barMinSizePx,
      y,
      baseline,
      height,
      stackMinSizePx,
      getSeriesData,
      categoryIndex,
      xScale,
      seriesGradients,
      roundBaseline,
    ]);

    const yData =
      yAxis?.data && Array.isArray(yAxis.data) && typeof yAxis.data[0] === 'number'
        ? (yAxis.data as number[])
        : undefined;
    const dataY = yData ? yData[categoryIndex] : categoryIndex;

    const barElements = bars.map((bar, index) => (
      <HorizontalBar
        key={`${bar.seriesId}-${categoryIndex}-${index}`}
        BarComponent={bar.BarComponent || defaultBarComponent}
        borderRadius={borderRadius}
        dataX={bar.dataX}
        dataY={dataY}
        fill={bar.fill}
        fillOpacity={bar.fillOpacity ?? defaultFillOpacity}
        height={bar.height}
        originX={baseline}
        roundLeft={bar.roundLeft}
        roundRight={bar.roundRight}
        seriesId={bar.seriesId}
        stroke={bar.stroke ?? defaultStroke}
        strokeWidth={bar.strokeWidth ?? defaultStrokeWidth}
        transition={transition}
        width={bar.width}
        x={bar.x}
        y={bar.y}
      />
    ));

    // Check if the stack should be rounded based on the baseline
    const stackRoundRight =
      roundBaseline || Math.abs(stackRect.x + stackRect.width - baseline) >= EPSILON;
    const stackRoundLeft = roundBaseline || Math.abs(stackRect.x - baseline) >= EPSILON;

    return (
      <BarStackComponent
        borderRadius={borderRadius}
        categoryIndex={categoryIndex}
        height={stackRect.height}
        roundBottom={stackRoundLeft}
        roundTop={stackRoundRight}
        transition={transition}
        width={stackRect.width}
        x={stackRect.x}
        xOrigin={baseline}
        y={stackRect.y}
        yOrigin={y}
      >
        {barElements}
      </BarStackComponent>
    );
  },
);


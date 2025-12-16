import { memo, useMemo } from 'react';

import { useCartesianChartContext } from '../ChartProvider';
import { getBarSizeAdjustment } from '../utils/bar';
import { isCategoricalScale } from '../utils/scale';

import type { BarStackProps } from './BarStack';
import { BarStack } from './BarStack';
import { HorizontalBarStack } from './HorizontalBarStack';

export type BarStackGroupProps = Pick<
  BarStackProps,
  | 'BarComponent'
  | 'fillOpacity'
  | 'stroke'
  | 'strokeWidth'
  | 'borderRadius'
  | 'roundBaseline'
  | 'stackGap'
  | 'barMinSize'
  | 'stackMinSize'
  | 'BarStackComponent'
  | 'transition'
> &
  Pick<BarStackProps, 'series' | 'yAxisId'> & {
    /**
     * Index of this stack within the category (0-based).
     */
    stackIndex: number;
    /**
     * Total number of stacks per category.
     */
    totalStacks: number;
    /**
     * Padding between bar groups (0-1).
     * @default 0.1
     */
    barPadding?: number;
  };

/**
 * BarStackGroup component that renders a group of stacks across all categories.
 * Delegates the actual stacking logic to BarStack (vertical bars) or HorizontalBarStack (horizontal bars)
 * for each category, based on chart orientation.
 */
export const BarStackGroup = memo<BarStackGroupProps>(
  ({ series, yAxisId, stackIndex, totalStacks, barPadding = 0.1, ...props }) => {
    const { getXScale, getYScale, drawingArea, dataLength, orientation } =
      useCartesianChartContext();

    const xScale = getXScale();
    const yScale = getYScale(yAxisId);

    // For horizontal orientation: X is category axis, Y is value axis (vertical bars)
    // For vertical orientation: Y is category axis, X is value axis (horizontal bars)
    const categoryScale = orientation === 'vertical' ? yScale : xScale;
    const valueScale = orientation === 'vertical' ? xScale : yScale;

    const stackConfigs = useMemo(() => {
      if (!categoryScale || !valueScale || !drawingArea || dataLength === 0) return [];

      if (!isCategoricalScale(categoryScale)) {
        return [];
      }

      const categorySize = categoryScale.bandwidth();

      // Calculate size for each stack within a category
      // Only apply barPadding when there are multiple stacks
      const gapSize = totalStacks > 1 ? (categorySize * barPadding) / (totalStacks - 1) : 0;
      const barSize = categorySize / totalStacks - getBarSizeAdjustment(totalStacks, gapSize);

      const configs: Array<{
        categoryIndex: number;
        position: number;
        size: number;
      }> = [];

      // Calculate position for each category
      for (let categoryIndex = 0; categoryIndex < dataLength; categoryIndex++) {
        // Get position for this category
        const categoryPosition = categoryScale(categoryIndex);
        if (categoryPosition !== undefined) {
          // Calculate position for this specific stack within the category
          const stackPosition = categoryPosition + stackIndex * (barSize + gapSize);

          configs.push({
            categoryIndex,
            position: stackPosition,
            size: barSize,
          });
        }
      }

      return configs;
    }, [categoryScale, valueScale, drawingArea, dataLength, stackIndex, totalStacks, barPadding]);

    if (categoryScale && !isCategoricalScale(categoryScale)) {
      const axisName = orientation === 'vertical' ? 'y-axis' : 'x-axis';
      throw new Error(
        `BarStackGroup requires a band scale for ${axisName}. See https://cds.coinbase.com/components/graphs/XAxis/#scale-type`,
      );
    }

    if (!valueScale || !drawingArea || stackConfigs.length === 0) return null;

    // Render vertical bars (horizontal orientation) or horizontal bars (vertical orientation)
    if (orientation === 'vertical') {
      return stackConfigs.map(({ categoryIndex, position, size }) => (
        <HorizontalBarStack
          {...props}
          key={`stack-${stackIndex}-category-${categoryIndex}`}
          categoryIndex={categoryIndex}
          height={size}
          rect={drawingArea}
          series={series}
          xScale={valueScale}
          y={position}
          yAxisId={yAxisId}
        />
      ));
    }

    return stackConfigs.map(({ categoryIndex, position, size }) => (
      <BarStack
        {...props}
        key={`stack-${stackIndex}-category-${categoryIndex}`}
        categoryIndex={categoryIndex}
        rect={drawingArea}
        series={series}
        width={size}
        x={position}
        yAxisId={yAxisId}
        yScale={valueScale}
      />
    ));
  },
);

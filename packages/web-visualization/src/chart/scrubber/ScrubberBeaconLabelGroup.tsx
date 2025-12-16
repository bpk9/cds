import { memo, useCallback, useMemo, useState } from 'react';
import type { SharedProps } from '@coinbase/cds-common/types';

import { useCartesianChartContext } from '../ChartProvider';
import type { ChartTextProps } from '../text';
import { getPointOnScale, useHighlightContext } from '../utils';
import {
  calculateLabelYPositions,
  getLabelPosition,
  type LabelDimensions,
  type LabelPosition,
  type ScrubberLabelPosition,
} from '../utils/scrubber';

import { DefaultScrubberBeaconLabel } from './DefaultScrubberBeaconLabel';
import type { ScrubberBeaconLabelComponent, ScrubberBeaconLabelProps } from './Scrubber';

const PositionedLabel = memo<{
  index: number;
  positions: (LabelPosition | null)[];
  position: ScrubberLabelPosition;
  label: string;
  color?: string;
  seriesId: string;
  onDimensionsChange: (id: string, dimensions: LabelDimensions) => void;
  BeaconLabelComponent: ScrubberBeaconLabelComponent;
  labelHorizontalOffset: number;
  labelFont?: ChartTextProps['font'];
}>(
  ({
    index,
    positions,
    position,
    label,
    color,
    seriesId,
    onDimensionsChange,
    BeaconLabelComponent,
    labelHorizontalOffset,
    labelFont,
  }) => {
    const pos = positions[index];

    // Don't render if position is null (invalid data)
    if (!pos) {
      return null;
    }

    const x = pos.x;
    const y = pos.y;
    const dx = position === 'right' ? labelHorizontalOffset : -labelHorizontalOffset;
    const horizontalAlignment = position === 'right' ? 'left' : 'right';

    return (
      <BeaconLabelComponent
        color={color}
        dx={dx}
        font={labelFont}
        horizontalAlignment={horizontalAlignment}
        label={label}
        onDimensionsChange={(d) => onDimensionsChange(seriesId, d)}
        seriesId={seriesId}
        x={x}
        y={y}
      />
    );
  },
);

export type ScrubberBeaconLabelGroupBaseProps = SharedProps & {
  /**
   * Labels to be displayed.
   */
  labels: Array<Pick<ScrubberBeaconLabelProps, 'seriesId' | 'label' | 'color'>>;
  /**
   * Minimum gap between labels in pixels.
   * @default 4
   */
  labelMinGap?: number;
  /**
   * Horizontal offset of labels from the scrubber line in pixels.
   * @default 16
   */
  labelHorizontalOffset?: number;
  /**
   * Font style for the beacon labels.
   */
  labelFont?: ChartTextProps['font'];
};

export type ScrubberBeaconLabelGroupProps = ScrubberBeaconLabelGroupBaseProps & {
  /**
   * Custom component to render as a scrubber beacon label.
   * @default DefaultScrubberBeaconLabel
   */
  BeaconLabelComponent?: ScrubberBeaconLabelComponent;
};

export const ScrubberBeaconLabelGroup = memo<ScrubberBeaconLabelGroupProps>(
  ({
    labels,
    labelMinGap = 4,
    labelHorizontalOffset = 16,
    labelFont,
    BeaconLabelComponent = DefaultScrubberBeaconLabel,
  }) => {
    const {
      getSeries,
      getSeriesData,
      getXScale,
      getYScale,
      getXAxis,
      getYAxis,
      drawingArea,
      dataLength,
      orientation,
    } = useCartesianChartContext();
    const highlightContext = useHighlightContext();
    const scrubberPosition = highlightContext?.highlightedItem?.dataIndex;

    const [labelDimensions, setLabelDimensions] = useState<Record<string, LabelDimensions>>({});

    const handleDimensionsChange = useCallback((seriesId: string, dimensions: LabelDimensions) => {
      setLabelDimensions((prev) => {
        const existing = prev[seriesId];

        if (
          existing &&
          existing.width === dimensions.width &&
          existing.height === dimensions.height
        ) {
          return prev;
        }

        return {
          ...prev,
          [seriesId]: dimensions,
        };
      });
    }, []);

    const seriesInfo = useMemo(() => {
      return labels
        .map((label) => {
          const series = getSeries(label.seriesId);
          if (!series) return null;

          const sourceData = getSeriesData(label.seriesId);
          // In horizontal: Y is value axis; in vertical: X is value axis
          const valueScale = orientation === 'vertical' ? getXScale() : getYScale(series.yAxisId);

          return {
            seriesId: label.seriesId,
            sourceData,
            valueScale,
          };
        })
        .filter((info): info is NonNullable<typeof info> => info !== null);
    }, [labels, getSeries, getSeriesData, getXScale, getYScale, orientation]);

    // Category scale/axis depends on orientation
    const categoryScale = orientation === 'vertical' ? getYScale() : getXScale();
    const categoryAxis = orientation === 'vertical' ? getYAxis() : getXAxis();

    const dataIndex = useMemo(() => {
      return scrubberPosition ?? Math.max(0, dataLength - 1);
    }, [scrubberPosition, dataLength]);

    const categoryValue = useMemo(() => {
      if (
        categoryAxis?.data &&
        Array.isArray(categoryAxis.data) &&
        categoryAxis.data[dataIndex] !== undefined
      ) {
        const dataValue = categoryAxis.data[dataIndex];
        return typeof dataValue === 'string' ? dataIndex : dataValue;
      }
      return dataIndex;
    }, [categoryAxis, dataIndex]);

    const allLabelPositions = useMemo(() => {
      if (!categoryScale || categoryValue === undefined) return [];

      const sharedCategoryPixel = getPointOnScale(categoryValue, categoryScale);

      const desiredPositions = seriesInfo.map((info) => {
        let dataValue: number | undefined;
        if (info.valueScale) {
          if (
            info.sourceData &&
            dataIndex !== undefined &&
            dataIndex >= 0 &&
            dataIndex < info.sourceData.length
          ) {
            const sourceValue = info.sourceData[dataIndex];

            if (typeof sourceValue === 'number') {
              dataValue = sourceValue;
            } else if (Array.isArray(sourceValue)) {
              const validValues = sourceValue.filter((val): val is number => val !== null);
              if (validValues.length >= 1) {
                dataValue = validValues[validValues.length - 1];
              }
            }
          }
        }

        if (dataValue !== undefined && info.valueScale) {
          const valuePixel = getPointOnScale(dataValue, info.valueScale);
          // In horizontal: x = category, y = value
          // In vertical: x = value, y = category
          return {
            seriesId: info.seriesId,
            x: orientation === 'vertical' ? valuePixel : sharedCategoryPixel,
            desiredY: orientation === 'vertical' ? sharedCategoryPixel : valuePixel,
          };
        }

        // Return null for invalid data
        return null;
      });

      const maxLabelHeight = Math.max(...Object.values(labelDimensions).map((dim) => dim.height));

      const maxLabelWidth = Math.max(...Object.values(labelDimensions).map((dim) => dim.width));

      // Only apply collision detection to valid positions
      const validPositions = desiredPositions.filter((pos) => pos !== null);

      // Convert to LabelDimension format expected by utility
      const dimensions = validPositions.map((pos) => {
        const trackedDimensions = labelDimensions[pos.seriesId];
        return {
          seriesId: pos.seriesId,
          width: trackedDimensions?.width ?? maxLabelWidth,
          height: trackedDimensions?.height ?? maxLabelHeight,
          preferredX: pos.x,
          preferredY: pos.desiredY,
        };
      });

      // Calculate Y positions with collision resolution for valid positions only
      const yPositions = calculateLabelYPositions(
        dimensions,
        drawingArea,
        maxLabelHeight,
        labelMinGap,
      );

      // Return all positions (including null ones)
      return desiredPositions.map((pos) => {
        if (!pos) return null;
        return {
          seriesId: pos.seriesId,
          x: pos.x,
          y: yPositions.get(pos.seriesId) ?? pos.desiredY,
        };
      });
    }, [
      seriesInfo,
      dataIndex,
      categoryValue,
      categoryScale,
      labelDimensions,
      drawingArea,
      labelMinGap,
      orientation,
    ]);

    const currentPosition = useMemo(() => {
      if (!categoryScale || categoryValue === undefined) return 'right';

      const categoryPixel = getPointOnScale(categoryValue, categoryScale);
      const maxWidth = Math.max(...Object.values(labelDimensions).map((dim) => dim.width));

      // For horizontal orientation, use the category (X) position to determine left/right
      // For vertical orientation, labels should be positioned based on the X value pixel
      if (orientation === 'vertical') {
        // In vertical, all labels share the same Y (category) position
        // We need to check the X (value) positions for label placement
        // For now, default to 'right' for vertical orientation
        // A more sophisticated approach would check if there's room to the right
        const avgValuePixel =
          allLabelPositions.length > 0
            ? allLabelPositions
                .filter((pos) => pos !== null)
                .reduce((sum, pos) => sum + pos!.x, 0) / allLabelPositions.length
            : drawingArea.x + drawingArea.width / 2;

        return getLabelPosition(avgValuePixel, maxWidth, drawingArea, labelHorizontalOffset);
      }

      return getLabelPosition(categoryPixel, maxWidth, drawingArea, labelHorizontalOffset);
    }, [
      categoryValue,
      categoryScale,
      labelDimensions,
      drawingArea,
      labelHorizontalOffset,
      orientation,
      allLabelPositions,
    ]);

    return seriesInfo.map((info, index) => {
      const labelInfo = labels.find((label) => label.seriesId === info.seriesId);
      if (!labelInfo) return;
      return (
        <PositionedLabel
          key={info.seriesId}
          BeaconLabelComponent={BeaconLabelComponent}
          color={labelInfo.color}
          index={index}
          label={labelInfo.label}
          labelFont={labelFont}
          labelHorizontalOffset={labelHorizontalOffset}
          onDimensionsChange={handleDimensionsChange}
          position={currentPosition}
          positions={allLabelPositions}
          seriesId={info.seriesId}
        />
      );
    });
  },
);

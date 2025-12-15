import React, { memo, useCallback, useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import chunk from 'lodash/chunk';

import { useChartContext } from './ChartProvider';
import { HighlightContext, type HighlightedItemData } from './utils';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
  },
  polarContainer: {
    // Hidden from visual display but accessible to screen readers
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});

export type ChartAccessibilityViewProps = {
  /**
   * Function to generate an accessibility label for each data item.
   * Receives the highlighted item data (dataIndex and optional seriesId).
   */
  accessibilityLabel: (item: HighlightedItemData) => string;
  /**
   * How to group items for screen reader navigation.
   * - 'auto': Chunks for Cartesian charts (handles many data points), individual for Polar (few slices)
   * - 'chunk': Groups data points into maxRegions (good for line/area charts with 100+ points)
   * - 'individual': Every item gets its own accessible region
   * @default 'auto'
   */
  mode?: 'auto' | 'chunk' | 'individual';
  /**
   * Maximum number of regions to divide the chart into for screen reader navigation.
   * Only used when mode is 'chunk' or 'auto' (for Cartesian charts).
   * If the data has fewer points than this value, each point gets its own region.
   * @default 10
   */
  maxRegions?: number;
};

/**
 * ChartAccessibilityView renders an accessible overlay for chart data.
 *
 * For Cartesian charts (line, area, bar):
 * - Divides the chart data into regions (up to maxRegions)
 * - Renders horizontal flex regions over the drawing area
 * - Screen reader users can swipe through regions to hear data
 *
 * For Polar charts (pie, donut):
 * - Creates one accessible element per series (slice)
 * - On focus, highlights the corresponding slice via opacity dimming
 *
 * This component should only be rendered when accessibility is needed.
 */
export const ChartAccessibilityView = memo(function ChartAccessibilityView({
  accessibilityLabel,
  mode = 'auto',
  maxRegions = 10,
}: ChartAccessibilityViewProps) {
  const chartContext = useChartContext();
  const highlightContext = useContext(HighlightContext);

  const { type, series, dataLength, drawingArea } = chartContext;

  // Determine effective mode based on chart type
  const effectiveMode = useMemo(() => {
    if (mode !== 'auto') return mode;
    // Polar charts always use individual mode (one per series/slice)
    // Cartesian charts use chunk mode by default
    return type === 'polar' ? 'individual' : 'chunk';
  }, [mode, type]);

  // Handle focus on an accessible region
  const handleFocus = useCallback(
    (item: HighlightedItemData) => {
      highlightContext?.setHighlightedItem(item);
    },
    [highlightContext],
  );

  // Handle blur (when focus leaves)
  const handleBlur = useCallback(() => {
    highlightContext?.setHighlightedItem(undefined);
  }, [highlightContext]);

  // For Cartesian charts: create chunked indices
  const chunkedIndices = useMemo(() => {
    if (type !== 'cartesian' || dataLength === 0) return [];

    // Create array of indices [0, 1, 2, ..., dataLength-1]
    const indices = Array.from({ length: dataLength }, (_, i) => i);

    // If individual mode or fewer data points than max regions, each point gets its own region
    if (effectiveMode === 'individual' || dataLength <= maxRegions) {
      return indices.map((i) => [i]);
    }

    // Otherwise, chunk into maxRegions groups
    const chunkSize = Math.ceil(dataLength / maxRegions);
    const chunks = chunk(indices, chunkSize);

    // If we have one extra chunk due to uneven division, merge it with the previous
    if (chunks.length > maxRegions && chunks.length > 1) {
      const lastChunk = chunks.pop();
      chunks[chunks.length - 1] = chunks[chunks.length - 1].concat(lastChunk ?? []);
    }

    return chunks;
  }, [type, dataLength, effectiveMode, maxRegions]);

  const getFlexStyle = useCallback(
    (length: number) => ({
      flex: length,
    }),
    [],
  );

  const cartesianContainerStyle = useMemo(
    () => [
      styles.container,
      {
        left: drawingArea.x,
        top: drawingArea.y,
        width: drawingArea.width,
        height: drawingArea.height,
      },
    ],
    [drawingArea],
  );

  // Render Cartesian accessibility view (horizontal flex regions)
  if (type === 'cartesian') {
    if (dataLength === 0 || chunkedIndices.length === 0) return null;

    return (
      <View pointerEvents="box-none" style={cartesianContainerStyle}>
        {chunkedIndices.map((indexChunk, chunkIndex) => {
          // Use the first index in the chunk for the accessibility label
          const firstIndex = indexChunk[0];
          const item: HighlightedItemData = { dataIndex: firstIndex };

          return (
            <View
              key={chunkIndex}
              accessible
              accessibilityLabel={accessibilityLabel(item)}
              accessibilityRole="button"
              onAccessibilityEscape={handleBlur}
              onAccessibilityTap={() => handleFocus(item)}
              style={getFlexStyle(indexChunk.length)}
            />
          );
        })}
      </View>
    );
  }

  // Render Polar accessibility view (one element per series)
  if (type === 'polar') {
    if (!series || series.length === 0) return null;

    return (
      <View accessibilityRole="list" pointerEvents="box-none" style={styles.polarContainer}>
        {series.map((s, index) => {
          const item: HighlightedItemData = { seriesId: s.id, dataIndex: index };

          return (
            <View
              key={s.id}
              accessible
              accessibilityLabel={accessibilityLabel(item)}
              accessibilityRole="button"
              onAccessibilityEscape={handleBlur}
              onAccessibilityTap={() => handleFocus(item)}
            />
          );
        })}
      </View>
    );
  }

  return null;
});

import React, { memo, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { type AccessibilityActionEvent, AccessibilityInfo, StyleSheet, View } from 'react-native';
import chunk from 'lodash/chunk';

import { useChartContext } from './ChartProvider';
import { HighlightContext, type HighlightedItemData } from './utils';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
  },
  polarContainer: {
    position: 'absolute',
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
 * - Elements are positioned over the drawing area for VoiceOver discovery
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

  // Container style positioned over drawing area
  const containerStyle = useMemo(
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
      <View pointerEvents="box-none" style={containerStyle}>
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
              style={{ flex: indexChunk.length }}
            />
          );
        })}
      </View>
    );
  }

  // Render Polar accessibility view (single adjustable element covering entire pie)
  // User can swipe up/down to cycle through slices while the view stays in place
  if (type === 'polar') {
    if (!series || series.length === 0) return null;

    return (
      <PolarAccessibilityElement
        accessibilityLabel={accessibilityLabel}
        drawingArea={drawingArea}
        handleBlur={handleBlur}
        handleFocus={handleFocus}
        series={series}
      />
    );
  }

  return null;
});

/**
 * Polar chart accessibility element that uses the "adjustable" role.
 * Renders a single element covering the entire pie that allows swipe up/down
 * to navigate between slices.
 *
 * Has two states:
 * 1. Overview state (initial): No slice highlighted, waits for user interaction
 * 2. Selection state: Shows individual slice labels with position indicator
 */
const PolarAccessibilityElement = memo(function PolarAccessibilityElement({
  series,
  accessibilityLabel,
  drawingArea,
  handleFocus,
  handleBlur,
}: {
  series: Array<{ id: string }>;
  accessibilityLabel: (item: HighlightedItemData) => string;
  drawingArea: { x: number; y: number; width: number; height: number };
  handleFocus: (item: HighlightedItemData) => void;
  handleBlur: () => void;
}) {
  // Use ref for current index to avoid stale closures and ensure sync between
  // visual highlight and announcement
  const currentIndexRef = useRef<number | null>(null);
  // State to trigger re-renders for accessibility label updates
  const [, forceUpdate] = useState({});

  // Helper to get the announcement text for an index
  const getAnnouncementText = useCallback(
    (index: number) => {
      const item: HighlightedItemData = {
        seriesId: series[index]?.id,
        dataIndex: index,
      };
      const sliceLabel = accessibilityLabel(item);
      return `${sliceLabel}. ${index + 1} of ${series.length}`;
    },
    [series, accessibilityLabel],
  );

  // Helper to select a slice - updates highlight and announces
  const selectSlice = useCallback(
    (index: number) => {
      currentIndexRef.current = index;

      // Update visual highlight immediately
      const item: HighlightedItemData = {
        seriesId: series[index]?.id,
        dataIndex: index,
      };
      handleFocus(item);

      // Announce the new selection (this ensures sync with visual)
      const announcement = getAnnouncementText(index);
      AccessibilityInfo.announceForAccessibility(announcement);

      // Trigger re-render to update accessibility props
      forceUpdate({});
    },
    [series, handleFocus, getAnnouncementText],
  );

  // Helper to clear selection
  const clearSelection = useCallback(() => {
    currentIndexRef.current = null;
    handleBlur();
    forceUpdate({});
  }, [handleBlur]);

  // Container style positioned over drawing area
  const containerStyle = useMemo(
    () => [
      styles.polarContainer,
      {
        left: drawingArea.x,
        top: drawingArea.y,
        width: drawingArea.width,
        height: drawingArea.height,
      },
    ],
    [drawingArea],
  );

  // Handle accessibility actions (increment/decrement for swipe up/down)
  const handleAccessibilityAction = useCallback(
    (event: AccessibilityActionEvent) => {
      const actionName = event.nativeEvent.actionName;
      const currentIndex = currentIndexRef.current;
      const isOverview = currentIndex === null;

      if (actionName === 'increment') {
        // From overview, go to first slice; otherwise go to next
        const nextIndex = isOverview ? 0 : (currentIndex + 1) % series.length;
        selectSlice(nextIndex);
      } else if (actionName === 'decrement') {
        // From overview, go to last slice; otherwise go to previous
        const prevIndex = isOverview
          ? series.length - 1
          : (currentIndex - 1 + series.length) % series.length;
        selectSlice(prevIndex);
      } else if (actionName === 'escape') {
        clearSelection();
      }
    },
    [series.length, selectSlice, clearSelection],
  );

  // Accessibility actions for VoiceOver swipe gestures
  const accessibilityActions = useMemo(
    () => [
      { name: 'increment' as const, label: 'Next slice' },
      { name: 'decrement' as const, label: 'Previous slice' },
    ],
    [],
  );

  // Current state for accessibility props
  const currentIndex = currentIndexRef.current;
  const isOverview = currentIndex === null;

  // In overview state, no label - parent chart handles overview
  // In selection state, show slice info with position
  const label = isOverview ? undefined : getAnnouncementText(currentIndex);

  return (
    <View
      accessible
      accessibilityActions={accessibilityActions}
      accessibilityLabel={label}
      accessibilityRole="adjustable"
      accessibilityValue={label ? { text: label } : undefined}
      onAccessibilityAction={handleAccessibilityAction}
      onAccessibilityEscape={clearSelection}
      pointerEvents="box-none"
      style={containerStyle}
    />
  );
});

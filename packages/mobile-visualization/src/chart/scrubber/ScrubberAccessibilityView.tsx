import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import chunk from 'lodash/chunk';

import { useCartesianChartContext } from '../ChartProvider';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
  },
});

export type ScrubberAccessibilityViewBaseProps = {
  /**
   * Function to generate an accessibility label for each data index.
   * Receives the data index and should return a descriptive string for screen readers.
   */
  accessibilityLabel: (dataIndex: number) => string;
  /**
   * Maximum number of regions to divide the chart into for screen reader navigation.
   * If the data has fewer points than this value, each point gets its own region.
   * @default 10
   */
  screenReaderMaxRegions?: number;
};

export type ScrubberAccessibilityViewProps = ScrubberAccessibilityViewBaseProps;

/**
 * ScrubberAccessibilityView renders an accessible overlay for the chart's scrubber.
 *
 * It divides the chart data into regions (up to screenReaderMaxRegions), rendering each as a View
 * with flex width proportional to the chunk size. The first data point in each chunk is used
 * to generate an accessibilityLabel via the provided function.
 *
 * This component is only rendered when a screen reader is active.
 */
export const ScrubberAccessibilityView = memo(function ScrubberAccessibilityView({
  accessibilityLabel,
  screenReaderMaxRegions = 10,
}: ScrubberAccessibilityViewProps) {
  const { dataLength, drawingArea } = useCartesianChartContext();

  const chunkedIndices = useMemo(() => {
    if (dataLength === 0) return [];

    // Create array of indices [0, 1, 2, ..., dataLength-1]
    const indices = Array.from({ length: dataLength }, (_, i) => i);

    // If we have fewer data points than max regions, each point gets its own region
    if (dataLength <= screenReaderMaxRegions) {
      return indices.map((i) => [i]);
    }

    // Otherwise, chunk into screenReaderMaxRegions groups
    const chunkSize = Math.ceil(dataLength / screenReaderMaxRegions);
    const chunks = chunk(indices, chunkSize);

    // If we have one extra chunk due to uneven division, merge it with the previous
    if (chunks.length > screenReaderMaxRegions && chunks.length > 1) {
      const lastChunk = chunks.pop();
      chunks[chunks.length - 1] = chunks[chunks.length - 1].concat(lastChunk ?? []);
    }

    return chunks;
  }, [dataLength, screenReaderMaxRegions]);

  const getStyleByLength = useCallback(
    (length: number) => ({
      flex: length,
    }),
    [],
  );

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

  if (dataLength === 0 || chunkedIndices.length === 0) return null;

  return (
    <View pointerEvents="box-none" style={containerStyle}>
      {chunkedIndices.map((indexChunk, chunkIndex) => {
        // Use the first index in the chunk for the accessibility label
        const firstIndex = indexChunk[0];

        return (
          <View
            key={chunkIndex}
            accessible
            accessibilityLabel={accessibilityLabel(firstIndex)}
            style={getStyleByLength(indexChunk.length)}
          />
        );
      })}
    </View>
  );
});

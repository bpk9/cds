import React, { useCallback, useMemo } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import { HighlightContext, type HighlightContextValue, type HighlightedItemData } from './utils';

export type HighlightProviderBaseProps = {
  /**
   * Whether highlighting is enabled.
   * @default false
   */
  enableHighlighting?: boolean;
  /**
   * Callback when highlighted item changes.
   */
  onHighlightChange?: (item: HighlightedItemData | undefined) => void;
};

export type HighlightProviderProps = HighlightProviderBaseProps & {
  children: React.ReactNode;
};

/**
 * A component which encapsulates the HighlightContext.
 * Provides unified highlight state management for both Cartesian and Polar charts on mobile.
 *
 * Uses SharedValue for smooth animations with react-native-reanimated.
 * Gesture handling is managed by individual chart components (CartesianChart, PolarChart).
 */
export const HighlightProvider: React.FC<HighlightProviderProps> = ({
  children,
  enableHighlighting = false,
  onHighlightChange,
}) => {
  const highlightedItem = useSharedValue<HighlightedItemData | undefined>(undefined);

  const setHighlightedItem = useCallback(
    (item: HighlightedItemData | undefined) => {
      highlightedItem.value = item;
      onHighlightChange?.(item);
    },
    [highlightedItem, onHighlightChange],
  );

  const contextValue: HighlightContextValue = useMemo(
    () => ({
      enableHighlighting,
      highlightedItem,
      setHighlightedItem,
    }),
    [enableHighlighting, highlightedItem, setHighlightedItem],
  );

  return <HighlightContext.Provider value={contextValue}>{children}</HighlightContext.Provider>;
};

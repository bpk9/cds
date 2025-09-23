import { memo, useCallback, useState } from 'react';
import type { Rect } from '@coinbase/cds-common/types';
import { G } from 'react-native-svg';
import { useTheme } from '@coinbase/cds-mobile';

import { useChartContext } from '../ChartContext';
import { ChartText, type ChartTextProps } from '../text';

export type ScrubberHeadLabelProps = ChartTextProps & {
  /**
   * Preferred side for label placement.
   * @default 'auto' - automatically chooses based on available space
   */
  preferredSide?: 'left' | 'right' | 'auto';
  /**
   * Opacity of the entire label.
   * @default 1
   */
  opacity?: number;
  /**
   * Custom styles to apply to the label
   */
  style?: React.CSSProperties;
  /**
   * Custom className to apply to the label
   */
  className?: string;
};

/**
 * The ScrubberHeadLabel is a special instance of ChartText used to label a series' scrubber head (i.e. a point on the series pinned to the scrubber position).
 * It contains logic to automatically change the ChartText's textAnchor based on it's proximity to the chart's bounds.
 */
export const ScrubberHeadLabel = memo<ScrubberHeadLabelProps>(
  ({
    preferredSide = 'auto',
    background = 'white',
    color,
    opacity = 1,
    padding = 12,
    onDimensionsChange,
    elevation = background !== undefined ? 1 : undefined,
    borderRadius = background !== undefined ? 200 : undefined,
    style,
    className,
    testID,
    dx = 0,
    ...chartTextProps
  }) => {
    const { rect: chartRect } = useChartContext();
    const theme = useTheme();

    // Track current side for auto placement
    const [currentSide, setCurrentSide] = useState<'left' | 'right'>('right');
    const side = preferredSide === 'auto' ? currentSide : preferredSide;
    // invert value of dx depending on the side the label is going to be placed on
    const dxValue = typeof dx === 'number' ? dx : 0;
    const spacing = Math.abs(dxValue) * (side === 'right' ? 1 : -1);

    // Collision detection callback for automatic side switching
    const handleDimensionsChange = useCallback(
      (rect: Rect) => {
        // Check if label is clipped and switch sides if needed
        const effectiveBounds = chartRect;
        if (preferredSide === 'auto' && effectiveBounds) {
          // Simple collision detection: check if rect extends beyond bounds
          const isClipped =
            rect.x < effectiveBounds.x ||
            rect.x + rect.width > effectiveBounds.x + effectiveBounds.width;

          if (isClipped) {
            setCurrentSide(currentSide === 'right' ? 'left' : 'right');
          }
        }
        onDimensionsChange?.(rect);
      },
      [chartRect, preferredSide, currentSide, onDimensionsChange],
    );

    return (
      <G data-testid={testID} opacity={opacity}>
        <ChartText
          background={background}
          borderRadius={borderRadius}
          color={color || theme.color.fgPrimary}
          dominantBaseline="central"
          dx={spacing}
          elevation={elevation}
          onDimensionsChange={handleDimensionsChange}
          padding={typeof padding === 'number' ? padding : 12}
          textAnchor={side === 'right' ? 'start' : 'end'}
          {...chartTextProps}
        />
      </G>
    );
  },
);

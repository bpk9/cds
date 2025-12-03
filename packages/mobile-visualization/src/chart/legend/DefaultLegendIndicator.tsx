import React, { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@coinbase/cds-mobile';
import { Box, type BoxProps } from '@coinbase/cds-mobile/layout';

import type { LegendIndicator } from '../utils';

const shapeDimensions = StyleSheet.create({
  pill: {
    height: 24,
    width: 6,
  },
  circle: {
    height: 10,
    width: 10,
  },
  square: {
    height: 10,
    width: 10,
  },
  squircle: {
    height: 10,
    width: 10,
  },
});

export type LegendIndicatorProps = Omit<BoxProps, 'color'> & {
  /**
   * The color of the legend indicator.
   * @default theme.color.fg
   */
  color?: string;
  /**
   * The indicator to display.
   * @default 'circle'
   */
  indicator?: LegendIndicator;
};

export type LegendIndicatorComponent = React.FC<LegendIndicatorProps>;

/**
 * Default indicator component for chart legends.
 * Renders a colored shape (pill, circle, square, or squircle).
 */
export const DefaultLegendIndicator = memo<LegendIndicatorProps>(
  ({ color: colorProp, indicator = 'circle', style, testID, ...props }) => {
    const theme = useTheme();
    const color = colorProp ?? theme.color.fg;
    const dimensionStyle = shapeDimensions[indicator] ?? shapeDimensions.circle;

    const borderRadiusStyle = useMemo(() => {
      if (indicator === 'square') {
        return { borderRadius: 0 };
      }
      if (indicator === 'squircle') {
        return { borderRadius: theme.borderRadius[200] };
      }
      return { borderRadius: theme.borderRadius[1000] };
    }, [indicator, theme.borderRadius]);

    return (
      <Box
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={[dimensionStyle, borderRadiusStyle, { backgroundColor: color }, style]}
        testID={testID}
        {...props}
      />
    );
  },
);

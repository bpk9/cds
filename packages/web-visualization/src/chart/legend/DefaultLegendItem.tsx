import React, { memo } from 'react';
import type { SharedProps } from '@coinbase/cds-common/types';
import { Box, HStack } from '@coinbase/cds-web/layout';
import { Text } from '@coinbase/cds-web/typography';
import { css } from '@linaria/core';

import type { Series } from '../utils';

import { LegendMedia } from './LegendMedia';

const legendMediaWrapperCss = css`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const legendItemCss = css`
  align-items: center;
`;

export type LegendItemProps = SharedProps & {
  /**
   * The unique identifier for the series.
   */
  seriesId: Series['id'];
  /**
   * The display label for the legend item.
   */
  label: string;
  /**
   * The color associated with the series.
   */
  color?: Series['color'];
  /**
   * The shape to display in the legend media.
   */
  legendShape?: Series['legendShape'];
  /**
   * Custom className for styling.
   */
  className?: string;
  /**
   * Custom inline styles.
   */
  style?: React.CSSProperties;
};

export type LegendItemComponent = React.FC<LegendItemProps>;

export const DefaultLegendItem = memo(function DefaultLegendItem({
  label,
  color,
  legendShape,
  className,
  style,
  testID,
}: LegendItemProps) {
  return (
    <HStack className={className ?? legendItemCss} data-testid={testID} gap={1} style={style}>
      <Box className={legendMediaWrapperCss}>
        <LegendMedia color={color} shape={legendShape} />
      </Box>
      <Text font="label2">{label}</Text>
    </HStack>
  );
});

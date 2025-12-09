import { memo } from 'react';
import type { SharedProps } from '@coinbase/cds-common/types';
import { cx } from '@coinbase/cds-web';
import {
  Box,
  HStack,
  type HStackBaseProps,
  type HStackDefaultElement,
  type HStackProps,
} from '@coinbase/cds-web/layout';
import { Text } from '@coinbase/cds-web/typography';
import { css } from '@linaria/core';

import type { Series } from '../utils';

import { DefaultLegendShape, type LegendShapeComponent } from './DefaultLegendShape';

const shapeWrapperCss = css`
  width: 10px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const legendItemCss = css`
  align-items: center;
`;

export type LegendItemBaseProps = Omit<HStackBaseProps, 'children'> &
  SharedProps & {
    /**
     * Id of the series.
     */
    seriesId: string;
    /**
     * Display label for the legend item.
     * Can be a string or a custom ReactNode.
     * If a ReactNode is provided, it replaces the default Text component.
     */
    label: React.ReactNode;
    /**
     * Color associated with the series.
     */
    color?: Series['color'];
    /**
     * Shape to display in the legend.
     */
    shape?: Series['legendShape'];
    /**
     * Custom component to render the legend shape.
     * @default DefaultLegendShape
     */
    ShapeComponent?: LegendShapeComponent;
  };

export type LegendItemProps = Omit<HStackProps<HStackDefaultElement>, 'children'> &
  LegendItemBaseProps & {
    /**
     * Custom class names for the component parts.
     */
    classNames?: {
      /**
       * Custom class name for the root element.
       */
      root?: string;
      /**
       * Custom class name for the shape wrapper element.
       */
      shapeWrapper?: string;
      /**
       * Custom class name for the shape element.
       */
      shape?: string;
      /**
       * Custom class name for the text element.
       */
      text?: string;
    };
    /**
     * Custom styles for the component parts.
     */
    styles?: {
      /**
       * Custom styles for the root element.
       */
      root?: React.CSSProperties;
      /**
       * Custom styles for the shape wrapper element.
       */
      shapeWrapper?: React.CSSProperties;
      /**
       * Custom styles for the shape element.
       */
      shape?: React.CSSProperties;
      /**
       * Custom styles for the text element.
       */
      text?: React.CSSProperties;
    };
  };

export type LegendItemComponent = React.FC<LegendItemProps>;

export const DefaultLegendItem = memo(
  ({
    label,
    color,
    shape,
    ShapeComponent = DefaultLegendShape,
    gap = 1,
    className,
    classNames,
    style,
    styles,
    testID,
    ...props
  }: LegendItemProps) => {
    const isStringLabel = typeof label === 'string';

    return (
      <HStack
        className={cx(legendItemCss, className, classNames?.root)}
        data-testid={testID}
        gap={gap}
        style={{ ...style, ...styles?.root }}
        {...props}
      >
        <Box className={cx(shapeWrapperCss, classNames?.shapeWrapper)} style={styles?.shapeWrapper}>
          <ShapeComponent
            className={classNames?.shape}
            color={color}
            shape={shape}
            style={styles?.shape}
          />
        </Box>
        {isStringLabel ? (
          <Text className={classNames?.text} font="label1" style={styles?.text}>
            {label}
          </Text>
        ) : (
          label
        )}
      </HStack>
    );
  },
);

import React, { memo, useMemo } from 'react';

import { Box, HStack, VStack } from '../../layout';
import { Tag } from '../../tag/Tag';
import { Text } from '../../typography';

export type DataCardLayoutBaseProps = {
  /** Text or React node to display as the card title. When a string is provided, it will be rendered in a CardTitle component. */
  title: React.ReactNode;
  /** Text or React node to display as the card subtitle. When a string is provided, it will be rendered in a CardSubtitle component. */
  subtitle?: React.ReactNode;
  /** Text or React node to display as a tag. When a string is provided, it will be rendered in a Tag component. */
  tag?: React.ReactNode;
  /** React node to display as a thumbnail in the header area. */
  thumbnail?: React.ReactNode;
  /** Layout orientation of the card. Horizontal places header and visualization side by side, vertical stacks them. */
  layout: 'horizontal' | 'vertical';
  /** child node to display as the visualization (e.g., ProgressBar or ProgressCircle). */
  children?: React.ReactNode;
};

export type DataCardLayoutProps = DataCardLayoutBaseProps & {
  classNames?: {
    layoutContainer?: string;
    headerContainer?: string;
    headerContent?: string;
    titleContainer?: string;
  };
  styles?: {
    layoutContainer?: React.CSSProperties;
    headerContainer?: React.CSSProperties;
    headerContent?: React.CSSProperties;
    titleContainer?: React.CSSProperties;
  };
};

export const DataCardLayout = memo(
  ({
    title,
    subtitle,
    tag,
    thumbnail,
    layout = 'vertical',
    classNames = {},
    styles = {},
    children,
  }: DataCardLayoutProps) => {
    const titleNode = useMemo(() => {
      if (typeof title === 'string') {
        return (
          <Text as="h3" font="headline" numberOfLines={2}>
            {title}
          </Text>
        );
      }
      return title;
    }, [title]);

    const subtitleNode = useMemo(() => {
      if (typeof subtitle === 'string') {
        return (
          <Text color="fgMuted" font="label2" numberOfLines={1}>
            {subtitle}
          </Text>
        );
      }
      return subtitle;
    }, [subtitle]);

    const tagNode = useMemo(() => {
      if (typeof tag === 'string') return <Tag>{tag}</Tag>;
      return tag;
    }, [tag]);

    const layoutContainerSpacingProps = useMemo(() => {
      return {
        flexDirection: layout === 'horizontal' ? 'row' : 'column',
        gap: layout === 'horizontal' ? 2 : 1,
        padding: 2,
      } as const;
    }, [layout]);

    const headerSpacingProps = useMemo(() => {
      return {
        flexDirection: layout === 'horizontal' ? 'column' : 'row',
        gap: layout === 'horizontal' ? 1.5 : 1,
        alignItems: layout === 'horizontal' ? 'flex-start' : 'center',
      } as const;
    }, [layout]);

    return (
      <Box
        className={classNames?.layoutContainer}
        flexGrow={1}
        style={styles?.layoutContainer}
        {...layoutContainerSpacingProps}
      >
        <Box
          flexGrow={1}
          {...headerSpacingProps}
          as="header"
          className={classNames?.headerContainer}
          style={styles?.headerContainer}
        >
          {thumbnail}
          <VStack className={classNames?.headerContent} style={styles?.headerContent}>
            <HStack
              className={classNames?.titleContainer}
              flexDirection="row-reverse"
              flexWrap="wrap"
              gap={0.5}
              justifyContent="flex-end"
              style={styles?.titleContainer}
            >
              {tagNode}
              {titleNode}
            </HStack>
            {subtitleNode}
          </VStack>
        </Box>
        {children}
      </Box>
    );
  },
);

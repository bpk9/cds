import React, { forwardRef, memo, useMemo } from 'react';
import type { StyleProp, View, ViewStyle } from 'react-native';

import { HStack } from '../../layout';
import { Box, type BoxBaseProps } from '../../layout/Box';
import { VStack, type VStackProps } from '../../layout/VStack';
import { Text } from '../../typography';

export type ContentCardBodyBaseProps = BoxBaseProps & {
  title: React.ReactNode;
  description?: React.ReactNode;
  media?: React.ReactNode;
  mediaPlacement?: 'top' | 'bottom' | 'start' | 'end';
  styles?: {
    root: StyleProp<ViewStyle>;
    contentContainer: StyleProp<ViewStyle>;
    mediaContainer: StyleProp<ViewStyle>;
  };
};

export type ContentCardBodyProps = ContentCardBodyBaseProps;

export const ContentCardBody = memo(
  forwardRef<View, ContentCardBodyProps>(
    (
      { title, description, media, mediaPlacement = 'top', style, styles, padding = 2, ...props },
      ref,
    ) => {
      const hasMedia = !!media;
      const isHorizontal = hasMedia && (mediaPlacement === 'start' || mediaPlacement === 'end');
      const isMediaFirst = hasMedia && (mediaPlacement === 'top' || mediaPlacement === 'start');

      const titleNode = useMemo(() => {
        if (typeof title === 'string') {
          return (
            <Text font="headline" numberOfLines={2}>
              {title}
            </Text>
          );
        }
        return title;
      }, [title]);

      const descriptionNode = useMemo(() => {
        if (typeof description === 'string') {
          return (
            <Text color="fgMuted" font="label2" numberOfLines={3}>
              {description}
            </Text>
          );
        }
        return description;
      }, [description]);

      const contentNode = useMemo(() => {
        return (
          <VStack
            flexGrow={1}
            flexShrink={1}
            gap={isHorizontal ? 1 : 0}
            style={styles?.contentContainer}
          >
            {titleNode}
            {descriptionNode}
          </VStack>
        );
      }, [isHorizontal, styles?.contentContainer, titleNode, descriptionNode]);

      const mediaNode = useMemo(() => {
        if (!hasMedia) return null;
        return (
          <HStack
            borderRadius={500}
            flexShrink={0}
            overflow="hidden"
            style={styles?.mediaContainer}
          >
            {media}
          </HStack>
        );
      }, [hasMedia, media, styles?.mediaContainer]);

      return (
        <Box
          ref={ref}
          alignItems="flex-start"
          flexDirection={isHorizontal ? 'row' : 'column'}
          gap={isHorizontal ? 2 : 1}
          padding={padding}
          style={[styles?.root, style]}
          {...props}
        >
          {isMediaFirst ? mediaNode : contentNode}
          {isMediaFirst ? contentNode : mediaNode}
        </Box>
      );
    },
  ),
);

ContentCardBody.displayName = 'ContentCardBody';

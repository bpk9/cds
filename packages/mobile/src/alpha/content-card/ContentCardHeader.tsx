import React, { forwardRef, memo, useMemo } from 'react';
import type { StyleProp, View, ViewStyle } from 'react-native';

import { type BoxBaseProps } from '../../layout/Box';
import { HStack } from '../../layout/HStack';
import { VStack } from '../../layout/VStack';
import { Text } from '../../typography';

export type ContentCardHeaderBaseProps = BoxBaseProps & {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  thumbnail: React.ReactNode;
  action: React.ReactNode;
  styles?: {
    root: StyleProp<ViewStyle>;
    contentContainer: StyleProp<ViewStyle>;
  };
};

export type ContentCardHeaderProps = ContentCardHeaderBaseProps;

export const ContentCardHeader = memo(
  forwardRef<View, ContentCardHeaderProps>(
    (
      {
        title,
        subtitle,
        thumbnail,
        styles,
        action,
        gap = 1.5,
        paddingX = 2,
        paddingTop = 2,
        style,
        ...props
      },
      ref,
    ) => {
      const titleNode = useMemo(() => {
        if (typeof title === 'string') {
          return (
            <Text font="label1" numberOfLines={1}>
              {title}
            </Text>
          );
        }
        return title;
      }, [title]);

      const subtitleNode = useMemo(() => {
        if (typeof subtitle === 'string') {
          return (
            <Text color="fgMuted" font="legal" numberOfLines={1}>
              {subtitle}
            </Text>
          );
        }
        return subtitle;
      }, [subtitle]);

      return (
        <HStack
          ref={ref}
          alignItems="center"
          gap={gap}
          paddingTop={paddingTop}
          paddingX={paddingX}
          style={[styles?.root, style]}
          {...props}
        >
          {thumbnail}
          <VStack
            flexGrow={1}
            flexShrink={1}
            justifyContent="flex-start"
            style={styles?.contentContainer}
          >
            {titleNode}
            {subtitleNode}
          </VStack>
          {action}
        </HStack>
      );
    },
  ),
);

ContentCardHeader.displayName = 'ContentCardHeader';

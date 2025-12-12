import React, { forwardRef, memo, useMemo } from 'react';

import type { Polymorphic } from '../../core/polymorphism';
import { cx } from '../../cx';
import { type BoxBaseProps, HStack, VStack, type VStackBaseProps } from '../../layout';
import { Text } from '../../typography';

export type ContentCardHeaderBaseProps = Polymorphic.ExtendableProps<
  BoxBaseProps,
  {
    title: React.ReactNode;
    subtitle: React.ReactNode;
    thumbnail: React.ReactNode;
    action: React.ReactNode;
    styles?: {
      root: React.CSSProperties;
      contentContainer: React.CSSProperties;
    };
    classNames?: {
      root: string;
      contentContainer: string;
    };
  }
>;

export type ContentCardHeaderProps<AsComponent extends React.ElementType> = Polymorphic.Props<
  AsComponent,
  ContentCardHeaderBaseProps
>;

type ContentCardHeaderComponent = (<AsComponent extends React.ElementType = 'header'>(
  props: ContentCardHeaderProps<AsComponent>,
) => Polymorphic.ReactReturn) &
  Polymorphic.ReactNamed;

export const ContentCardHeader: ContentCardHeaderComponent = memo(
  forwardRef<React.ReactElement<ContentCardHeaderBaseProps>, ContentCardHeaderBaseProps>(
    <AsComponent extends React.ElementType>(
      {
        as,
        title,
        subtitle,
        thumbnail,
        action,
        gap = 1.5,
        paddingX = 2,
        paddingTop = 2,
        styles,
        style,
        classNames,
        className,
        ...props
      }: ContentCardHeaderProps<AsComponent>,
      ref?: Polymorphic.Ref<AsComponent>,
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

      const Component = (as ?? 'header') satisfies React.ElementType;

      return (
        <HStack
          ref={ref}
          alignItems="center"
          as={Component}
          className={cx(classNames?.root, className)}
          gap={1.5}
          paddingTop={paddingTop}
          paddingX={paddingX}
          style={{ ...style, ...styles?.root }}
          {...props}
        >
          {thumbnail}
          <VStack
            className={classNames?.contentContainer}
            flexGrow={1}
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

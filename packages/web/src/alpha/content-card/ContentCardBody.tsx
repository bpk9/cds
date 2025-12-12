import { forwardRef, memo, useMemo } from 'react';

import type { Polymorphic } from '../../core/polymorphism';
import { cx } from '../../cx';
import { Box, type BoxBaseProps, VStack } from '../../layout';
import { Text } from '../../typography';

export type ContentCardBodyBaseProps = Polymorphic.ExtendableProps<
  BoxBaseProps,
  {
    title: React.ReactNode;
    description?: React.ReactNode;
    media?: React.ReactNode;
    mediaPlacement?: 'top' | 'bottom' | 'start' | 'end';
    styles?: {
      root: React.CSSProperties;
      contentContainer: React.CSSProperties;
      mediaContainer: React.CSSProperties;
    };
    classNames?: {
      root: string;
      contentContainer: string;
      mediaContainer: string;
    };
  }
>;

export type ContentCardBodyProps<AsComponent extends React.ElementType> = Polymorphic.Props<
  AsComponent,
  ContentCardBodyBaseProps
>;

type ContentCardBodyComponent = (<AsComponent extends React.ElementType>(
  props: ContentCardBodyProps<AsComponent>,
) => Polymorphic.ReactReturn) &
  Polymorphic.ReactNamed;

export const ContentCardBody: ContentCardBodyComponent = memo(
  forwardRef<React.ReactElement<ContentCardBodyBaseProps>, ContentCardBodyBaseProps>(
    <AsComponent extends React.ElementType>(
      {
        as,
        title,
        description,
        media,
        mediaPlacement = 'top',
        style,
        styles,
        classNames,
        className,
        padding = 2,
        ...props
      }: ContentCardBodyProps<AsComponent>,
      ref?: Polymorphic.Ref<AsComponent>,
    ) => {
      const Component = (as ?? 'div') satisfies React.ElementType;
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
            className={classNames?.contentContainer}
            gap={isHorizontal ? 1 : 0}
            style={styles?.contentContainer}
          >
            {titleNode}
            {descriptionNode}
          </VStack>
        );
      }, [
        isHorizontal,
        classNames?.contentContainer,
        styles?.contentContainer,
        titleNode,
        descriptionNode,
      ]);

      const mediaNode = useMemo(() => {
        if (!hasMedia) return null;
        return (
          <VStack
            borderRadius={500}
            className={classNames?.mediaContainer}
            flexShrink={0}
            overflow="hidden"
            style={styles?.mediaContainer}
          >
            {media}
          </VStack>
        );
      }, [hasMedia, media, classNames?.mediaContainer, styles?.mediaContainer]);

      return (
        <Box
          ref={ref}
          alignItems="flex-start"
          as={Component}
          className={cx(classNames?.root, className)}
          flexDirection={isHorizontal ? 'row' : 'column'}
          gap={isHorizontal ? 2 : 1}
          padding={padding}
          style={{ ...style, ...styles?.root }}
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

import React, { forwardRef, memo } from 'react';

import type { Polymorphic } from '../../core/polymorphism';
import { VStack } from '../../layout/VStack';
import { Pressable, type PressableBaseProps } from '../../system/Pressable';

export type ContentCardBaseProps = Polymorphic.ExtendableProps<
  PressableBaseProps,
  {
    children?: React.ReactNode;
    renderAsPressable?: boolean;
  }
>;

export type ContentCardProps<AsComponent extends React.ElementType = 'article'> = Polymorphic.Props<
  AsComponent,
  ContentCardBaseProps
>;

type ContentCardComponent = (<AsComponent extends React.ElementType = 'article'>(
  props: Polymorphic.Props<AsComponent, ContentCardBaseProps>,
) => Polymorphic.ReactReturn) &
  Polymorphic.ReactNamed;

export const ContentCard: ContentCardComponent = memo(
  forwardRef<React.ReactElement<ContentCardBaseProps>, ContentCardBaseProps>(
    <AsComponent extends React.ElementType>(
      {
        renderAsPressable,
        children,
        background = 'bg',
        borderRadius = 500,
        ...props
      }: ContentCardProps<AsComponent>,
      ref?: Polymorphic.Ref<AsComponent>,
    ) => {
      if (renderAsPressable) {
        const { as, ...pressableRestProps } = props;
        return (
          <Pressable
            ref={ref}
            as={as ?? 'button'}
            background={background}
            borderRadius={borderRadius}
            flexDirection="column"
            {...(pressableRestProps as any)}
          >
            {children}
          </Pressable>
        );
      } else {
        const { as, ...vstackRestProps } = props;
        return (
          <VStack
            ref={ref}
            as={as ?? 'article'}
            background={background}
            borderRadius={borderRadius}
            {...(vstackRestProps as any)}
          >
            {children}
          </VStack>
        );
      }
    },
  ),
);

ContentCard.displayName = 'ContentCard';

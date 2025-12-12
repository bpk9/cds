import { forwardRef, memo } from 'react';

import type { Polymorphic } from '../../core/polymorphism';
import { HStack, type HStackBaseProps } from '../../layout';

export type ContentCardFooterBaseProps = HStackBaseProps;

export type ContentCardFooterProps<AsComponent extends React.ElementType> = Polymorphic.Props<
  AsComponent,
  ContentCardFooterBaseProps
>;

type ContentCardFooterComponent = (<AsComponent extends React.ElementType>(
  props: ContentCardFooterProps<AsComponent>,
) => Polymorphic.ReactReturn) &
  Polymorphic.ReactNamed;

export const ContentCardFooter: ContentCardFooterComponent = memo(
  forwardRef<React.ReactElement<ContentCardFooterBaseProps>, ContentCardFooterBaseProps>(
    <AsComponent extends React.ElementType>(
      { as, paddingX = 2, paddingBottom = 2, ...props }: ContentCardFooterProps<AsComponent>,
      ref?: Polymorphic.Ref<AsComponent>,
    ) => {
      const Component = (as ?? 'footer') satisfies React.ElementType;
      return (
        <HStack
          ref={ref}
          as={Component}
          paddingBottom={paddingBottom}
          paddingX={paddingX}
          {...props}
        />
      );
    },
  ),
);

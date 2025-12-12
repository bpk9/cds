import React, { forwardRef, memo } from 'react';
import type { View } from 'react-native';

import { VStack } from '../../layout';
import { Pressable, type PressableProps } from '../../system';

export type ContentCardBaseProps = {
  children: React.ReactNode;
  renderAsPressable?: boolean;
};

export type ContentCardProps = ContentCardBaseProps & PressableProps;

export const ContentCard = memo(
  forwardRef<View, ContentCardProps>(({ children, renderAsPressable, ...props }, ref) => {
    const Component = renderAsPressable ? Pressable : VStack;
    return (
      <Component ref={ref} borderRadius={500} {...props}>
        {children}
      </Component>
    );
  }),
);

ContentCard.displayName = 'ContentCard';

import React, { forwardRef, memo } from 'react';
import type { View } from 'react-native';

import { HStack } from '../layout/HStack';
import { Pressable, type PressableProps } from '../system/Pressable';

export type CardRootBaseProps = {
  children: React.ReactNode;
  renderAsPressable?: boolean;
};

export type CardRootProps = CardRootBaseProps & PressableProps;

export const CardRoot = memo(
  forwardRef<View, CardRootBaseProps>(({ children, renderAsPressable, ...props }, ref) => {
    const Component = renderAsPressable ? Pressable : HStack;
    return (
      <Component ref={ref} {...props}>
        {children}
      </Component>
    );
  }),
);

CardRoot.displayName = 'CardRoot';

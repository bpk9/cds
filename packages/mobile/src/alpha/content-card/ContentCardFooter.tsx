import React, { forwardRef, memo } from 'react';
import type { View } from 'react-native';

import { HStack, type HStackProps } from '../../layout/HStack';

export type ContentCardFooterBaseProps = HStackProps;

export type ContentCardFooterProps = ContentCardFooterBaseProps;

export const ContentCardFooter = memo(
  forwardRef<View, ContentCardFooterProps>(({ paddingX = 2, paddingBottom = 2, ...props }, ref) => {
    return <HStack ref={ref} paddingBottom={paddingBottom} paddingX={paddingX} {...props} />;
  }),
);

ContentCardFooter.displayName = 'ContentCardFooter';

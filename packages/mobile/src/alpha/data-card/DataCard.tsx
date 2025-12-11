import { forwardRef, memo } from 'react';
import type { View } from 'react-native';
import type { ThemeVars } from '@coinbase/cds-common';

import { CardRoot, type CardRootProps } from '../../cards/CardRoot';

import { DataCardLayout, type DataCardLayoutProps } from './DataCardLayout';

export type DataCardBaseProps = DataCardLayoutProps & {
  styles?: {
    root?: React.CSSProperties;
  };
};

export type DataCardProps = Omit<CardRootProps, 'children'> & DataCardBaseProps;

const dataCardContainerProps = {
  borderRadius: 500 as ThemeVars.BorderRadius,
  background: 'bgAlternate' as ThemeVars.Color,
  overflow: 'hidden' as const,
};

export const DataCard = memo(
  forwardRef<View, DataCardProps>(
    (
      {
        title,
        subtitle,
        tag,
        thumbnail,
        children,
        layout,
        renderAsPressable,
        styles: { root: rootStyle, ...layoutStyles } = {},
        ...props
      },
      ref,
    ) => (
      <CardRoot
        ref={ref}
        renderAsPressable={renderAsPressable}
        style={rootStyle}
        {...dataCardContainerProps}
        {...props}
      >
        <DataCardLayout
          layout={layout}
          styles={layoutStyles}
          subtitle={subtitle}
          tag={tag}
          thumbnail={thumbnail}
          title={title}
        >
          {children}
        </DataCardLayout>
      </CardRoot>
    ),
  ),
);

DataCard.displayName = 'DataCard';

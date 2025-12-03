import React, { memo } from 'react';
import { cx } from '@coinbase/cds-web';
import { Box, type BoxProps } from '@coinbase/cds-web/layout';
import { css } from '@linaria/core';

import type { LegendIndicator, LegendIndicatorVariant } from '../utils/chart';

const pillCss = css`
  width: 6px;
  height: 24px;
  border-radius: var(--borderRadius-1000);
`;

const circleCss = css`
  width: 10px;
  height: 10px;
  border-radius: var(--borderRadius-1000);
`;

const squareCss = css`
  width: 10px;
  height: 10px;
`;

const squircleCss = css`
  width: 10px;
  height: 10px;
  border-radius: 2px;
`;

const stylesByVariant: Record<LegendIndicatorVariant, string> = {
  pill: pillCss,
  circle: circleCss,
  square: squareCss,
  squircle: squircleCss,
};

const isVariantIndicator = (indicator: LegendIndicator): indicator is LegendIndicatorVariant =>
  typeof indicator === 'string' && indicator in stylesByVariant;

export type LegendIndicatorProps = BoxProps<'div'> & {
  /**
   * The color of the legend indicator.
   * @default 'var(--color-fgPrimary)'
   */
  color?: string;
  /**
   * The indicator to display. Can be a preset shape or a custom ReactNode.
   * @default 'circle'
   */
  indicator?: LegendIndicator;
};

export type LegendIndicatorComponent = React.FC<LegendIndicatorProps>;

/**
 * Default indicator component for chart legends.
 * Renders a colored shape (pill, circle, square, or squircle) or a custom ReactNode.
 */
export const DefaultLegendIndicator = memo<LegendIndicatorProps>(
  ({ color = 'var(--color-fgPrimary)', indicator = 'circle', className, style, ...props }) => {
    // If indicator is a custom ReactNode, render it directly
    if (!isVariantIndicator(indicator)) {
      return <>{indicator}</>;
    }

    const variantStyle = stylesByVariant[indicator];

    return (
      <Box
        className={cx(variantStyle, className)}
        style={{ backgroundColor: color, ...style }}
        {...props}
      />
    );
  },
);

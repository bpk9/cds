import React, { memo } from 'react';
import { imageSize, mediaSize } from '@coinbase/cds-common/tokens/cell';

import type { fallbackDefaultElement, FallbackProps } from '../layout/Fallback';
import { Fallback } from '../layout/Fallback';

import type { CellMediaType } from './CellMedia';

export type MediaFallbackProps = Omit<
  FallbackProps<typeof fallbackDefaultElement>,
  'height' | 'width'
> & {
  height?: number | string;
  width?: number | string;
  type: CellMediaType;
};

export const MediaFallback = memo(function MediaFallback({
  type,
  testID,
  width,
  height,
  ...props
}: MediaFallbackProps) {
  if (type === 'image') {
    return (
      <Fallback
        height={height ?? imageSize}
        shape="squircle"
        testID={testID}
        width={width ?? imageSize}
        {...props}
      />
    );
  }

  return (
    <Fallback
      height={height ?? mediaSize}
      shape="circle"
      testID={testID}
      width={width ?? mediaSize}
      {...props}
    />
  );
});

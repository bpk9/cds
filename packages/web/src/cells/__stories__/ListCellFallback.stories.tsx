import React from 'react';

import type { CellSpacing } from '../../cells/Cell';
import { ListCellFallback } from '../ListCellFallback';

export default {
  title: 'Components/Cells/ListCellFallback',
  component: ListCellFallback,
};

const innerSpacing: CellSpacing = {
  paddingX: 2,
  paddingY: 4,
};
const outerSpacing: CellSpacing = {
  paddingX: 10,
  paddingY: 8,
};

export const Fallbacks = () => {
  return (
    <>
      <ListCellFallback disableRandomRectWidth title />
      <ListCellFallback description disableRandomRectWidth title />
      <ListCellFallback detail disableRandomRectWidth title />
      <ListCellFallback disableRandomRectWidth subdetail title />
      <ListCellFallback description detail disableRandomRectWidth title />
      <ListCellFallback description detail disableRandomRectWidth subdetail title />
      <ListCellFallback disableRandomRectWidth title start="icon" />
      <ListCellFallback description disableRandomRectWidth title start="asset" />
      <ListCellFallback detail disableRandomRectWidth title start="image" />
      <ListCellFallback disableRandomRectWidth subdetail title start="avatar" />
      <ListCellFallback description detail disableRandomRectWidth title start="icon" />
      <ListCellFallback description detail disableRandomRectWidth subdetail title start="asset" />
      <ListCellFallback description detail subdetail title rectWidthVariant={0} start="asset" />
      <ListCellFallback description detail subdetail title rectWidthVariant={1} start="asset" />
      <ListCellFallback description detail subdetail title rectWidthVariant={2} start="asset" />
      <ListCellFallback disableRandomRectWidth helperText title />
      <ListCellFallback description disableRandomRectWidth helperText title />
      <ListCellFallback
        description
        disableRandomRectWidth
        helperText
        title
        start="pictogram"
        styles={{
          helperText: {
            paddingLeft: 48,
          },
        }}
      />
      <ListCellFallback
        description
        detail
        disableRandomRectWidth
        helperText
        subdetail
        title
        start="asset"
        styles={{
          helperText: {
            paddingLeft: 48,
          },
        }}
      />
      <ListCellFallback
        description
        detail
        disableRandomRectWidth
        helperText
        subdetail
        title
        start="image"
        styles={{
          helperText: {
            paddingLeft: 64,
          },
        }}
      />
      <ListCellFallback
        description
        detail
        disableRandomRectWidth
        subdetail
        title
        innerSpacing={innerSpacing}
        outerSpacing={outerSpacing}
        start="asset"
      />
    </>
  );
};

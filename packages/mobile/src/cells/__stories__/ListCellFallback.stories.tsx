import React from 'react';

import { Example, ExampleScreen } from '../../examples/ExampleScreen';
import type { CellSpacing } from '../Cell';
import { ListCellFallback } from '../ListCellFallback';

const innerSpacing: CellSpacing = {
  paddingX: 2,
  paddingY: 4,
};
const outerSpacing: CellSpacing = {
  paddingX: 10,
  paddingY: 8,
};

const Fallbacks = () => {
  return (
    <>
      <ListCellFallback disableRandomRectWidth title spacingVariant="condensed" />
      <ListCellFallback description disableRandomRectWidth title spacingVariant="condensed" />
      <ListCellFallback detail disableRandomRectWidth title spacingVariant="condensed" />
      <ListCellFallback disableRandomRectWidth subdetail title spacingVariant="condensed" />
      <ListCellFallback
        description
        detail
        disableRandomRectWidth
        title
        spacingVariant="condensed"
      />
      <ListCellFallback
        description
        detail
        disableRandomRectWidth
        subdetail
        title
        spacingVariant="condensed"
      />
      <ListCellFallback disableRandomRectWidth title spacingVariant="condensed" start="icon" />
      <ListCellFallback
        description
        disableRandomRectWidth
        title
        spacingVariant="condensed"
        start="asset"
      />
      <ListCellFallback
        detail
        disableRandomRectWidth
        title
        spacingVariant="condensed"
        start="image"
      />
      <ListCellFallback
        disableRandomRectWidth
        subdetail
        title
        spacingVariant="condensed"
        start="avatar"
      />
      <ListCellFallback
        description
        detail
        disableRandomRectWidth
        title
        spacingVariant="condensed"
        start="icon"
      />
      <ListCellFallback
        description
        detail
        disableRandomRectWidth
        subdetail
        title
        spacingVariant="condensed"
        start="asset"
      />
      <ListCellFallback
        description
        detail
        subdetail
        title
        rectWidthVariant={0}
        spacingVariant="condensed"
        start="asset"
      />
      <ListCellFallback
        description
        detail
        subdetail
        title
        rectWidthVariant={1}
        spacingVariant="condensed"
        start="asset"
      />
      <ListCellFallback
        description
        detail
        subdetail
        title
        rectWidthVariant={2}
        spacingVariant="condensed"
        start="asset"
      />
      <ListCellFallback disableRandomRectWidth title spacingVariant="compact" />
      <ListCellFallback description disableRandomRectWidth title spacingVariant="compact" />
      <ListCellFallback detail disableRandomRectWidth title spacingVariant="compact" />
      <ListCellFallback disableRandomRectWidth subdetail title spacingVariant="compact" />
      <ListCellFallback description detail disableRandomRectWidth title spacingVariant="compact" />
      <ListCellFallback
        description
        detail
        disableRandomRectWidth
        subdetail
        title
        spacingVariant="compact"
      />
      <ListCellFallback disableRandomRectWidth title spacingVariant="compact" start="icon" />
      <ListCellFallback
        description
        disableRandomRectWidth
        title
        spacingVariant="compact"
        start="asset"
      />
      <ListCellFallback
        detail
        disableRandomRectWidth
        title
        spacingVariant="compact"
        start="image"
      />
      <ListCellFallback
        disableRandomRectWidth
        subdetail
        title
        spacingVariant="compact"
        start="avatar"
      />
      <ListCellFallback
        description
        detail
        disableRandomRectWidth
        title
        spacingVariant="compact"
        start="icon"
      />
      <ListCellFallback
        description
        detail
        disableRandomRectWidth
        subdetail
        title
        spacingVariant="compact"
        start="asset"
      />
      <ListCellFallback
        description
        detail
        subdetail
        title
        rectWidthVariant={0}
        spacingVariant="compact"
        start="asset"
      />
      <ListCellFallback
        description
        detail
        subdetail
        title
        rectWidthVariant={1}
        spacingVariant="compact"
        start="asset"
      />
      <ListCellFallback
        description
        detail
        subdetail
        title
        rectWidthVariant={2}
        spacingVariant="compact"
        start="asset"
      />
      <ListCellFallback
        disableRandomRectWidth
        title
        innerSpacing={innerSpacing}
        outerSpacing={outerSpacing}
      />
      <ListCellFallback disableRandomRectWidth helperText spacingVariant="condensed" />
      <ListCellFallback disableRandomRectWidth helperText title spacingVariant="condensed" />
      <ListCellFallback
        description
        detail
        disableRandomRectWidth
        helperText
        subdetail
        title
        spacingVariant="compact"
        start="image"
        styles={{ helperText: { paddingLeft: 64 } }}
      />
      <ListCellFallback
        disableRandomRectWidth
        helperText
        title
        spacingVariant="compact"
        start="icon"
        styles={{ helperText: { paddingLeft: 48 } }}
      />
      <ListCellFallback
        disableRandomRectWidth
        helperText
        title
        spacingVariant="compact"
        start="icon"
        styles={{ helperText: { paddingLeft: 48 } }}
      />
    </>
  );
};

const ListCellFallbackScreen = () => {
  return (
    <ExampleScreen>
      <Example>
        <Fallbacks />
      </Example>
    </ExampleScreen>
  );
};

export default ListCellFallbackScreen;

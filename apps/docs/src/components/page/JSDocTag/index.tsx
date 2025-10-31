import { memo } from 'react';
import { Tag } from '@coinbase/cds-web/tag/Tag';

export const JSDOC_TAG_VARIANTS = ['deprecated', 'alpha', 'new', 'required'] as const;

type JSDocTagVariant = (typeof JSDOC_TAG_VARIANTS)[number];

const TAG_PROPS = {
  deprecated: {
    colorScheme: 'red',
    intent: 'informational',
  },
  alpha: {
    colorScheme: 'blue',
    intent: 'informational',
  },
  new: {
    colorScheme: 'blue',
    intent: 'promotional',
  },
  required: {
    colorScheme: 'gray',
    intent: 'informational',
  },
} as const;

type JSDocTagProps = {
  variant: JSDocTagVariant;
};

const LABELS: Record<JSDocTagVariant, string> = {
  alpha: 'Alpha',
  deprecated: 'Deprecated',
  new: 'New',
  required: 'Required',
};

const JSDocTag = memo(function JSDocTag({ variant }: JSDocTagProps) {
  return <Tag {...TAG_PROPS[variant]}>{LABELS[variant] ?? variant}</Tag>;
});

export default JSDocTag;

import React from 'react';

import { Example, ExampleScreen } from '../../examples/ExampleScreen';
import { VStack } from '../../layout';
import { Text } from '../../typography/Text';
import type { MobileBannerProps } from '../Banner';
import { Banner } from '../Banner';

const shortMessage = 'Lorem ipsum dolar sit amet, consecturo.';
const label = 'Last updated today at 3:33pm';

const styleProps: MobileBannerProps[] = [
  {
    variant: 'warning',
    title: 'Warning message',
    startIcon: 'warning',
    startIconActive: true,
    children: shortMessage,
    startIconAccessibilityLabel: 'Warning',
    closeAccessibilityLabel: 'Close',
  },
  {
    variant: 'informational',
    title: 'Informative message',
    startIcon: 'info',
    startIconActive: true,
    children: shortMessage,
    startIconAccessibilityLabel: 'Information',
    closeAccessibilityLabel: 'Close',
  },
  {
    variant: 'promotional',
    title: 'Promotional message',
    startIcon: 'info',
    startIconActive: true,
    children: shortMessage,
    startIconAccessibilityLabel: 'Information',
    closeAccessibilityLabel: 'Close',
  },
  {
    variant: 'error',
    title: 'Error message',
    startIcon: 'error',
    startIconActive: true,
    children: shortMessage,
    startIconAccessibilityLabel: 'Error',
    closeAccessibilityLabel: 'Close',
  },
];

const BannerVariantsScreen = () => {
  return (
    <ExampleScreen>
      <Example title="Contextual Variants">
        <VStack gap={2}>
          {styleProps.map((props) => (
            <Banner key={`contextual-${props.variant}`} {...props} />
          ))}
        </VStack>
      </Example>
      <Example title="Inline Variants">
        <VStack gap={2}>
          {styleProps.map((props) => (
            <Banner key={`inline-${props.variant}`} {...props} styleVariant="inline" />
          ))}
        </VStack>
      </Example>
      <Example title="Global Variants">
        <VStack gap={2}>
          {styleProps.map((props) => (
            <Banner
              key={`global-${props.variant}`}
              {...props}
              label={label}
              styleVariant="global"
            />
          ))}
        </VStack>
      </Example>
      <Example title="Variants with Dismiss">
        <VStack gap={2}>
          <Text font="title1">Contextual</Text>
          {styleProps.map((props) => (
            <Banner
              key={`contextual-dismiss-${props.variant}`}
              {...props}
              showDismiss
              onClose={() => {}}
            />
          ))}
          <Text font="title1">Inline</Text>
          {styleProps.map((props) => (
            <Banner
              key={`inline-dismiss-${props.variant}`}
              {...props}
              showDismiss
              styleVariant="inline"
              onClose={() => {}}
            />
          ))}
          <Text font="title1">Global</Text>
          {styleProps.map((props) => (
            <Banner
              key={`global-dismiss-${props.variant}`}
              {...props}
              label={label}
              showDismiss
              styleVariant="global"
              onClose={() => {}}
            />
          ))}
        </VStack>
      </Example>
    </ExampleScreen>
  );
};

export default BannerVariantsScreen;

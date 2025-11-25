import React from 'react';
import type { MobileBannerProps } from '../Banner';

import { Example, ExampleScreen } from '../../examples/ExampleScreen';
import { Spacer, VStack } from '../../layout';
import { Text } from '../../typography/Text';
import { Banner } from '../Banner';

const shortMessage = 'Lorem ipsum dolar sit amet, consecturo.';

const exampleProps = {
  title: 'Failure Message',
  startIcon: 'error' as const,
  startIconActive: true,
  startIconAccessibilityLabel: 'Error',
  closeAccessibilityLabel: 'Close',
};

const examplePropsWithOffset = {
  ...exampleProps,
  marginX: -2 as const,
  children: 'Lorem ipsum dolar sit amet',
};

const borderRadiusValues = [0, 200, 400] as const;

const BannerCustomizationScreen = () => {
  return (
    <ExampleScreen>
      <Example title="Custom Offset">
        <VStack gap={2}>
          <Spacer />
          <Text font="title1">Global</Text>
          <Banner
            {...examplePropsWithOffset}
            showDismiss
            startIconAccessibilityLabel="Information"
            styleVariant="global"
            variant="informational"
          />
          <Banner
            {...examplePropsWithOffset}
            showDismiss
            startIconAccessibilityLabel="Information"
            styleVariant="global"
            variant="promotional"
          />
          <Banner
            {...examplePropsWithOffset}
            startIconActive
            startIcon="warning"
            startIconAccessibilityLabel="Warning"
            styleVariant="global"
            variant="warning"
          />

          <Banner {...examplePropsWithOffset} styleVariant="global" variant="error" />
          <Spacer />
          <Text font="title1">Inline</Text>
          <Banner
            {...examplePropsWithOffset}
            showDismiss
            startIconAccessibilityLabel="Information"
            styleVariant="inline"
            variant="informational"
          />
          <Banner
            {...examplePropsWithOffset}
            showDismiss
            startIconAccessibilityLabel="Information"
            styleVariant="inline"
            variant="promotional"
          />
          <Banner
            {...examplePropsWithOffset}
            startIconActive
            startIcon="warning"
            startIconAccessibilityLabel="Warning"
            styleVariant="inline"
            variant="warning"
          />
          <Banner {...examplePropsWithOffset} styleVariant="inline" variant="error" />
        </VStack>
      </Example>
      <Example title="Vertical Align">
        <VStack gap={2}>
          <Banner
            {...exampleProps}
            alignItems="center"
            startIconAccessibilityLabel="Information"
            title={undefined}
            variant="informational"
          >
            {examplePropsWithOffset.children}
          </Banner>
          <Banner
            {...exampleProps}
            showDismiss
            alignItems="center"
            startIconAccessibilityLabel="Information"
            title={undefined}
            variant="promotional"
          >
            {examplePropsWithOffset.children}
          </Banner>
          <Banner {...exampleProps} alignItems="center" variant="error" />
          <Banner
            {...exampleProps}
            showDismiss
            startIconActive
            alignItems="center"
            startIcon="warning"
            startIconAccessibilityLabel="Warning"
            variant="warning"
          />
        </VStack>
      </Example>
      <Example title="Border Radius">
        <VStack gap={2}>
          <Text font="title1">Contextual</Text>
          <VStack gap={2}>
            {borderRadiusValues.map((radius) => (
              <Banner
                key={`mobile-contextual-${radius}`}
                {...exampleProps}
                borderRadius={radius}
                title={`Contextual radius ${radius}`}
                variant="informational"
              >
                {shortMessage}
              </Banner>
            ))}
          </VStack>
          <Text font="title1">Inline</Text>
          <VStack gap={2}>
            {borderRadiusValues.map((radius) => (
              <Banner
                key={`mobile-inline-${radius}`}
                {...exampleProps}
                borderRadius={radius}
                styleVariant="inline"
                title={`Inline radius ${radius}`}
                variant="informational"
              >
                {shortMessage}
              </Banner>
            ))}
          </VStack>
        </VStack>
      </Example>
    </ExampleScreen>
  );
};

export default BannerCustomizationScreen;


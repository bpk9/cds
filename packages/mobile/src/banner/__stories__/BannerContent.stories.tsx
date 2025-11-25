import React from 'react';
import { loremIpsum } from '@coinbase/cds-common/internal/data/loremIpsum';
import { NoopFn as noopFn } from '@coinbase/cds-common/utils/mockUtils';

import { Button } from '../../buttons';
import { Example, ExampleScreen } from '../../examples/ExampleScreen';
import { VStack } from '../../layout';
import { Link } from '../../typography/Link';
import { Text } from '../../typography/Text';
import { Banner } from '../Banner';

const primaryAction = <Link to="https://www.coinbase.com">Primary</Link>;
const secondaryAction = <Link to="https://www.coinbase.com">Secondary</Link>;
const shortMessage = 'Lorem ipsum dolar sit amet, consecturo.';
const longMessage = `${loremIpsum}${loremIpsum}${loremIpsum}`;

const BannerContentScreen = () => {
  return (
    <ExampleScreen>
      <Example title="With Actions">
        <VStack gap={2}>
          <Text font="title1">Primary Action</Text>
          <Banner
            startIconActive
            primaryAction={primaryAction}
            startIcon="info"
            startIconAccessibilityLabel="Information"
            title="With Primary Action"
            variant="informational"
          >
            {shortMessage}
          </Banner>
          <Text font="title1">Multiple Actions</Text>
          <Banner
            startIconActive
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
            startIcon="warning"
            startIconAccessibilityLabel="Warning"
            title="With Multiple Actions"
            variant="warning"
          >
            {shortMessage}
          </Banner>
          <Text font="title1">Actions with Dismiss</Text>
          <Banner
            showDismiss
            startIconActive
            onClose={noopFn}
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
            startIcon="error"
            startIconAccessibilityLabel="Error"
            title="With Actions and Dismiss"
            variant="error"
          >
            {shortMessage}
          </Banner>
        </VStack>
      </Example>
      <Example title="Button Actions">
        <VStack gap={2}>
          <Text font="title1">Primary Action as Button</Text>
          <Banner
            startIconActive
            primaryAction={<Button compact>Primary Action</Button>}
            startIcon="info"
            startIconAccessibilityLabel="Information"
            title="Button Primary Action"
            variant="promotional"
          >
            {shortMessage}
          </Banner>
          <Text font="title1">Secondary Action as Button</Text>
          <Banner
            startIconActive
            secondaryAction={<Button compact>Secondary Action</Button>}
            startIcon="warning"
            startIconAccessibilityLabel="Warning"
            title="Button Secondary Action"
            variant="warning"
          >
            {shortMessage}
          </Banner>
        </VStack>
      </Example>
      <Example title="With Links">
        <VStack gap={2}>
          <Text font="title1">Inline with Link</Text>
          <Banner
            startIconActive
            startIcon="info"
            startIconAccessibilityLabel="Information"
            styleVariant="inline"
            title="Learn more about this feature"
            variant="informational"
          >
            <Link font="label2" to="https://www.coinbase.com">
              Read documentation
            </Link>
          </Banner>
          <Text font="title1">Contextual with Inline Link</Text>
          <Banner
            startIconActive
            startIcon="info"
            startIconAccessibilityLabel="Information"
            title="Important update"
            variant="promotional"
          >
            <Text font="label2">
              {shortMessage}
              <Link to="https://www.coinbase.com"> Learn more</Link>
            </Text>
          </Banner>
          <Text font="title1">Global with Link</Text>
          <Banner
            startIconActive
            startIcon="warning"
            startIconAccessibilityLabel="Warning"
            styleVariant="global"
            title="Action required"
            variant="warning"
          >
            <Text font="label2">
              Please update your settings.
              <Link to="https://www.coinbase.com"> Update now</Link>
            </Text>
          </Banner>
        </VStack>
      </Example>
      <Example title="Long Content">
        <VStack gap={2}>
          <Text font="title1">Long Text</Text>
          <Banner
            startIconActive
            startIcon="info"
            startIconAccessibilityLabel="Information"
            title={`Long title with detailed information. ${longMessage}`}
            variant="informational"
          >
            {longMessage}
          </Banner>
          <Text font="title1">Long Text with Actions</Text>
          <Banner
            startIconActive
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
            startIcon="warning"
            startIconAccessibilityLabel="Warning"
            title={`Warning with long content. ${longMessage}`}
            variant="warning"
          >
            {longMessage}
          </Banner>
          <Text font="title1">Long Text with Actions and Dismiss</Text>
          <Banner
            showDismiss
            startIconActive
            onClose={noopFn}
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
            startIcon="error"
            startIconAccessibilityLabel="Error"
            title={`Complex banner with all features. ${longMessage}`}
            variant="error"
          >
            {longMessage}
          </Banner>
        </VStack>
      </Example>
    </ExampleScreen>
  );
};

export default BannerContentScreen;

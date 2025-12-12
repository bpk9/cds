import React from 'react';
import { ethBackground } from '@coinbase/cds-common/internal/data/assets';

import { Button, IconButton } from '../../../buttons';
import { HStack, VStack } from '../../../layout';
import { RemoteImage } from '../../../media';
import { ContentCard, ContentCardBody, ContentCardFooter, ContentCardHeader } from '../index';

const exampleThumbnail = (
  <RemoteImage
    accessibilityLabel="Example"
    shape="circle"
    size="l"
    source={ethBackground}
    testID="thumbnail"
  />
);

const exampleMedia = (
  <RemoteImage
    alt="Media"
    aria-hidden="true"
    height={164}
    resizeMode="cover"
    shape="rectangle"
    src={ethBackground}
    width="100%"
  />
);

const exampleMediaSquare = (
  <RemoteImage
    alt="Square Media"
    aria-hidden="true"
    height={80}
    resizeMode="cover"
    shape="square"
    src={ethBackground}
    width={80}
  />
);

export const Default = (): JSX.Element => {
  return (
    <HStack gap={2}>
      <ContentCard width={327}>
        <ContentCardHeader
          action={
            <HStack>
              <IconButton compact transparent name="star" variant="secondary" />
              <IconButton compact transparent name="moreVertical" variant="secondary" />
            </HStack>
          }
          subtitle="transparent"
          thumbnail={exampleThumbnail}
          title="Content Card"
        />
        <ContentCardBody
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
          media={exampleMedia}
          mediaPlacement="top"
          title="Lorem ipsum dolor"
        />
        <ContentCardFooter justifyContent="flex-end">
          <Button compact variant="secondary">
            Button
          </Button>
        </ContentCardFooter>
      </ContentCard>
      <ContentCard background="bgAlternate" width={327}>
        <ContentCardHeader
          action={
            <HStack>
              <IconButton compact transparent name="star" variant="secondary" />
              <IconButton compact transparent name="moreVertical" variant="secondary" />
            </HStack>
          }
          subtitle="bgAlternate"
          thumbnail={exampleThumbnail}
          title="Content Card"
        />
        <ContentCardBody
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
          media={exampleMedia}
          mediaPlacement="top"
          title="Lorem ipsum dolor"
        />
        <ContentCardFooter justifyContent="flex-end">
          <Button compact variant="secondary">
            Button
          </Button>
        </ContentCardFooter>
      </ContentCard>
    </HStack>
  );
};

export const Interactive = (): JSX.Element => {
  return (
    <VStack gap={2}>
      <ContentCard renderAsPressable onClick={() => alert('Card clicked!')} width={327}>
        <ContentCardHeader
          action={
            <HStack gap={0.5}>
              <IconButton compact transparent name="star" variant="secondary" />
              <IconButton compact transparent name="moreVertical" variant="secondary" />
            </HStack>
          }
          subtitle="Subtitle"
          thumbnail={exampleThumbnail}
          title="Title"
        />
        <ContentCardBody
          description="Clickable card with onClick handler"
          media={exampleMedia}
          mediaPlacement="top"
          title="Card with Button"
        />
        <ContentCardFooter justifyContent="flex-end">
          <Button compact variant="secondary">
            Button
          </Button>
        </ContentCardFooter>
      </ContentCard>
      <ContentCard
        renderAsPressable
        as="a"
        href="https://www.coinbase.com"
        target="_blank"
        width={327}
      >
        <ContentCardHeader
          action={
            <HStack gap={0.5}>
              <IconButton compact transparent name="star" variant="secondary" />
              <IconButton compact transparent name="moreVertical" variant="secondary" />
            </HStack>
          }
          subtitle="Subtitle"
          thumbnail={exampleThumbnail}
          title="Title"
        />
        <ContentCardBody
          description="Card with href link"
          media={exampleMedia}
          mediaPlacement="top"
          title="Card with Link"
        />
        <ContentCardFooter justifyContent="flex-end">
          <Button compact variant="secondary">
            Button
          </Button>
        </ContentCardFooter>
      </ContentCard>
    </VStack>
  );
};

export const MediaPositions = (): JSX.Element => {
  return (
    <VStack gap={2}>
      <ContentCard width={327}>
        <ContentCardBody
          description="Media positioned at the top"
          media={exampleMedia}
          mediaPlacement="top"
          title="Top Media"
        />
      </ContentCard>
      <ContentCard width={327}>
        <ContentCardBody
          description="Media positioned at the bottom"
          media={exampleMedia}
          mediaPlacement="bottom"
          title="Bottom Media"
        />
      </ContentCard>
      <ContentCard width={400}>
        <ContentCardBody
          description="Media positioned at the start (left)"
          media={exampleMediaSquare}
          mediaPlacement="start"
          title="Start Media"
        />
      </ContentCard>
      <ContentCard width={400}>
        <ContentCardBody
          description="Media positioned at the end (right)"
          media={exampleMediaSquare}
          mediaPlacement="end"
          title="End Media"
        />
      </ContentCard>
    </VStack>
  );
};

export const WithoutHeader = (): JSX.Element => {
  return (
    <VStack gap={2}>
      <ContentCard width={327}>
        <ContentCardBody
          description="Card without header section"
          media={exampleMedia}
          mediaPlacement="top"
          title="No Header Card"
        />
        <ContentCardFooter justifyContent="flex-end">
          <Button compact variant="secondary">
            Button
          </Button>
        </ContentCardFooter>
      </ContentCard>
    </VStack>
  );
};

export const WithoutFooter = (): JSX.Element => {
  return (
    <VStack gap={2}>
      <ContentCard width={327}>
        <ContentCardHeader
          action={
            <HStack gap={0.5}>
              <IconButton compact transparent name="star" variant="secondary" />
              <IconButton compact transparent name="moreVertical" variant="secondary" />
            </HStack>
          }
          subtitle="Subtitle"
          thumbnail={exampleThumbnail}
          title="Title"
        />
        <ContentCardBody
          description="Card without footer section"
          media={exampleMedia}
          mediaPlacement="top"
          title="No Footer Card"
        />
      </ContentCard>
    </VStack>
  );
};

export const WithoutMedia = (): JSX.Element => {
  return (
    <VStack gap={2}>
      <ContentCard width={327}>
        <ContentCardHeader
          action={
            <HStack gap={0.5}>
              <IconButton compact transparent name="star" variant="secondary" />
              <IconButton compact transparent name="moreVertical" variant="secondary" />
            </HStack>
          }
          subtitle="Subtitle"
          thumbnail={exampleThumbnail}
          title="Title"
        />
        <ContentCardBody
          description="Card without media image"
          media={<div style={{ height: 164, backgroundColor: 'var(--color-bgSecondary)' }} />}
          mediaPlacement="top"
          title="No Media Card"
        />
        <ContentCardFooter justifyContent="flex-end">
          <Button compact variant="secondary">
            Button
          </Button>
        </ContentCardFooter>
      </ContentCard>
    </VStack>
  );
};

export const CustomContent = (): JSX.Element => {
  return (
    <VStack gap={2}>
      <ContentCard width={327}>
        <ContentCardHeader
          action={
            <HStack gap={0.5}>
              <IconButton compact transparent name="star" variant="secondary" />
              <IconButton compact transparent name="moreVertical" variant="secondary" />
            </HStack>
          }
          subtitle={<span style={{ color: 'var(--color-fgPositive)' }}>Custom Subtitle</span>}
          thumbnail={exampleThumbnail}
          title={<strong>Custom Title</strong>}
        />
        <ContentCardBody
          description={
            <span>
              Custom description with <strong>bold text</strong> and <em>italic text</em>
            </span>
          }
          media={exampleMedia}
          mediaPlacement="top"
          title={<span style={{ fontSize: '18px' }}>Custom Title Content</span>}
        />
        <ContentCardFooter justifyContent="flex-end">
          <Button compact variant="secondary">
            Custom Button
          </Button>
        </ContentCardFooter>
      </ContentCard>
    </VStack>
  );
};

export const MultipleCards = (): JSX.Element => {
  return (
    <HStack flexWrap="wrap" gap={2}>
      <ContentCard width={327}>
        <ContentCardHeader
          action={
            <HStack gap={0.5}>
              <IconButton compact transparent name="star" variant="secondary" />
              <IconButton compact transparent name="moreVertical" variant="secondary" />
            </HStack>
          }
          subtitle="Subtitle"
          thumbnail={exampleThumbnail}
          title="Title"
        />
        <ContentCardBody
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
          media={exampleMedia}
          mediaPlacement="top"
          title="Card 1"
        />
        <ContentCardFooter justifyContent="flex-end">
          <Button compact variant="secondary">
            Button
          </Button>
        </ContentCardFooter>
      </ContentCard>
      <ContentCard width={327}>
        <ContentCardHeader
          action={
            <HStack gap={0.5}>
              <IconButton compact transparent name="star" variant="secondary" />
              <IconButton compact transparent name="moreVertical" variant="secondary" />
            </HStack>
          }
          subtitle="Subtitle"
          thumbnail={exampleThumbnail}
          title="Title"
        />
        <ContentCardBody
          description="Second card with different content"
          media={exampleMedia}
          mediaPlacement="top"
          title="Card 2"
        />
        <ContentCardFooter justifyContent="flex-end">
          <Button compact variant="secondary">
            Button
          </Button>
        </ContentCardFooter>
      </ContentCard>
      <ContentCard renderAsPressable onClick={() => alert('Card 3 clicked!')} width={327}>
        <ContentCardHeader
          action={
            <HStack gap={0.5}>
              <IconButton compact transparent name="star" variant="secondary" />
              <IconButton compact transparent name="moreVertical" variant="secondary" />
            </HStack>
          }
          subtitle="Subtitle"
          thumbnail={exampleThumbnail}
          title="Title"
        />
        <ContentCardBody
          description="Card with onClick handler"
          media={exampleMedia}
          mediaPlacement="top"
          title="Card 3"
        />
        <ContentCardFooter justifyContent="flex-end">
          <Button compact variant="secondary">
            Button
          </Button>
        </ContentCardFooter>
      </ContentCard>
      <ContentCard width={327}>
        <ContentCardHeader
          action={
            <HStack gap={0.5}>
              <IconButton compact transparent name="star" variant="secondary" />
              <IconButton compact transparent name="moreVertical" variant="secondary" />
            </HStack>
          }
          subtitle="Subtitle"
          thumbnail={exampleThumbnail}
          title="Title"
        />
        <ContentCardBody
          description="Fourth card example"
          media={exampleMedia}
          mediaPlacement="top"
          title="Card 4"
        />
        <ContentCardFooter justifyContent="flex-end">
          <Button compact variant="secondary">
            Button
          </Button>
        </ContentCardFooter>
      </ContentCard>
      <ContentCard
        renderAsPressable
        as="a"
        href="https://www.coinbase.com"
        target="_blank"
        width={327}
      >
        <ContentCardHeader
          action={
            <HStack gap={0.5}>
              <IconButton compact transparent name="star" variant="secondary" />
              <IconButton compact transparent name="moreVertical" variant="secondary" />
            </HStack>
          }
          subtitle="Subtitle"
          thumbnail={exampleThumbnail}
          title="Title"
        />
        <ContentCardBody
          description="Card with href link"
          media={exampleMedia}
          mediaPlacement="top"
          title="Card 5"
        />
        <ContentCardFooter justifyContent="flex-end">
          <Button compact variant="primary">
            Button
          </Button>
        </ContentCardFooter>
      </ContentCard>
    </HStack>
  );
};

export const LongContent = (): JSX.Element => {
  return (
    <VStack gap={2}>
      <ContentCard width={327}>
        <ContentCardHeader
          action={
            <HStack gap={0.5}>
              <IconButton compact transparent name="star" variant="secondary" />
              <IconButton compact transparent name="moreVertical" variant="secondary" />
            </HStack>
          }
          subtitle="This is a very long subtitle text that demonstrates how the header handles longer content"
          thumbnail={exampleThumbnail}
          title="This is a very long title text that demonstrates how the header handles longer content"
        />
        <ContentCardBody
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          media={exampleMedia}
          mediaPlacement="top"
          title="This is a very long title text that demonstrates how the body handles longer content"
        />
        <ContentCardFooter justifyContent="flex-end">
          <Button compact variant="secondary">
            Button
          </Button>
        </ContentCardFooter>
      </ContentCard>
    </VStack>
  );
};

export default {
  title: 'Components/Alpha/ContentCard',
  component: ContentCard,
};

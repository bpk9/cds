import { Alert } from 'react-native';
import { ethBackground } from '@coinbase/cds-common/internal/data/assets';

import { Button, IconButton } from '../../../buttons';
import { Example, ExampleScreen } from '../../../examples/ExampleScreen';
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
    accessibilityLabel="Media"
    height={164}
    resizeMode="cover"
    shape="rectangle"
    source={ethBackground}
    width="100%"
  />
);

const exampleMediaSquare = (
  <RemoteImage
    accessibilityLabel="Square Media"
    height={80}

    resizeMode="cover"
    shape="square"
    source={ethBackground}
    width={80}
  />
);

const ContentCardScreen = () => {
  return (
    <ExampleScreen>
      <Example title="Default">
        <VStack gap={2}>
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
        </VStack>
      </Example>

      <Example title="Interactive">
        <VStack gap={2}>
          <ContentCard renderAsPressable onPress={() => Alert.alert('Card clicked!')} width={327}>
            <ContentCardHeader
              action={
                <HStack>
                  <IconButton compact transparent name="star" variant="secondary" />
                  <IconButton compact transparent name="moreVertical" variant="secondary" />
                </HStack>
              }
              subtitle="Subtitle"
              thumbnail={exampleThumbnail}
              title="Title"
            />
            <ContentCardBody
              description="Clickable card with onPress handler"
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
        </VStack>
      </Example>

      <Example title="Media Positions">
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
      </Example>

      <Example title="Without Header">
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
      </Example>

      <Example title="Without Footer">
        <VStack gap={2}>
          <ContentCard width={327}>
            <ContentCardHeader
              action={
                <HStack>
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
      </Example>

      <Example title="Without Media">
        <VStack gap={2}>
          <ContentCard width={327}>
            <ContentCardHeader
              action={
                <HStack>
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
              media={<VStack background="bgSecondary" height={164} />}
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
      </Example>

      <Example title="Custom Content">
        <VStack gap={2}>
          <ContentCard width={327}>
            <ContentCardHeader
              action={
                <HStack>
                  <IconButton compact transparent name="star" variant="secondary" />
                  <IconButton compact transparent name="moreVertical" variant="secondary" />
                </HStack>
              }
              subtitle={
                <Button compact variant="secondary">
                  Custom Subtitle
                </Button>
              }
              thumbnail={exampleThumbnail}
              title={
                <Button compact variant="primary">
                  Custom Title
                </Button>
              }
            />
            <ContentCardBody
              description={
                <VStack>
                  <Button compact variant="secondary">
                    Custom description with
                  </Button>
                  <Button compact variant="secondary">
                    bold text
                  </Button>
                </VStack>
              }
              media={exampleMedia}
              mediaPlacement="top"
              title={
                <Button compact variant="primary">
                  Custom Title Content
                </Button>
              }
            />
            <ContentCardFooter justifyContent="flex-end">
              <Button compact variant="secondary">
                Custom Button
              </Button>
            </ContentCardFooter>
          </ContentCard>
        </VStack>
      </Example>

      <Example title="Multiple Cards">
        <HStack flexWrap="wrap" gap={2}>
          <ContentCard width={327}>
            <ContentCardHeader
              action={
                <HStack>
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
                <HStack>
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
          <ContentCard renderAsPressable onPress={() => Alert.alert('Card 3 clicked!')} width={327}>
            <ContentCardHeader
              action={
                <HStack>
                  <IconButton compact transparent name="star" variant="secondary" />
                  <IconButton compact transparent name="moreVertical" variant="secondary" />
                </HStack>
              }
              subtitle="Subtitle"
              thumbnail={exampleThumbnail}
              title="Title"
            />
            <ContentCardBody
              description="Card with onPress handler"
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
        </HStack>
      </Example>

      <Example title="Long Content">
        <VStack gap={2}>
          <ContentCard width={327}>
            <ContentCardHeader
              action={
                <HStack>
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
      </Example>
    </ExampleScreen>
  );
};

export default ContentCardScreen;

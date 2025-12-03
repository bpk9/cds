import { useMemo } from 'react';
import { Example, ExampleScreen } from '@coinbase/cds-mobile/examples/ExampleScreen';
import { HStack, VStack } from '@coinbase/cds-mobile/layout';

import type { LegendIndicatorVariant } from '../../utils/chart';
import { DefaultLegendIndicator } from '..';

const indicators: LegendIndicatorVariant[] = ['pill', 'circle', 'squircle', 'square'];

const spectrumColors = [
  'blue',
  'green',
  'orange',
  'yellow',
  'gray',
  'indigo',
  'pink',
  'purple',
  'red',
  'teal',
  'chartreuse',
];

const LegendStories = () => {
  const colorPalette = useMemo(() => spectrumColors.map((color) => `rgb(var(--${color}40))`), []);

  return (
    <ExampleScreen>
      <Example title="Indicators">
        <VStack gap={2}>
          {indicators.map((indicator) => (
            <HStack key={indicator} gap={0.5}>
              {colorPalette.map((color, index) => (
                <DefaultLegendIndicator
                  key={`${indicator}-${index}`}
                  color={color}
                  indicator={indicator}
                  testID={`legend-indicator-${indicator}-${index}`}
                />
              ))}
            </HStack>
          ))}
        </VStack>
      </Example>
    </ExampleScreen>
  );
};

export default LegendStories;

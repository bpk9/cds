import { Box, HStack, VStack } from '@coinbase/cds-web/layout';
import { Text } from '@coinbase/cds-web/typography';

import { CartesianChart } from '../../CartesianChart';
import { Line, LineChart } from '../../line';
import { Scrubber } from '../../scrubber';
import type { LegendIndicatorVariant } from '../../utils/chart';
import { DefaultLegendIndicator } from '../DefaultLegendIndicator';
import { Legend } from '../Legend';

export default {
  component: DefaultLegendIndicator,
  title: 'Components/Chart/Legend',
};

const Example: React.FC<
  React.PropsWithChildren<{ title: string; description?: string | React.ReactNode }>
> = ({ children, title, description }) => {
  return (
    <VStack gap={2}>
      <Text as="h2" display="block" font="title3">
        {title}
      </Text>
      {description}
      {children}
    </VStack>
  );
};

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

const indicators: LegendIndicatorVariant[] = ['pill', 'circle', 'squircle', 'square'];

export const All = () => {
  return (
    <VStack gap={8}>
      <Example title="Indicators">
        <VStack gap={2}>
          {indicators.map((indicator) => (
            <HStack key={indicator} gap={1}>
              {spectrumColors.map((color) => (
                <Box key={color} justifyContent="center" style={{ width: 10 }}>
                  <DefaultLegendIndicator color={`rgb(var(--${color}40))`} indicator={indicator} />
                </Box>
              ))}
            </HStack>
          ))}
        </VStack>
      </Example>
      <Example title="Line Chart">
        <LineChart
          enableScrubbing
          points
          showArea
          showXAxis
          showYAxis
          curve="natural"
          height={{ base: 200, tablet: 225, desktop: 250 }}
          inset={{ top: 16, right: 16, bottom: 0, left: 0 }}
          series={[
            {
              id: 'line',
              data: [2, 5.5, 2, 8.5, 1.5, 5],
            },
          ]}
          xAxis={{
            data: [1, 2, 3, 5, 8, 10],
            showLine: true,
            showTickMarks: true,
            showGrid: true,
          }}
          yAxis={{
            domain: { min: 0 },
            position: 'left',
            showLine: true,
            showTickMarks: true,
            showGrid: true,
          }}
        >
          <Scrubber hideOverlay />
          <Legend />
        </LineChart>
      </Example>
    </VStack>
  );
};

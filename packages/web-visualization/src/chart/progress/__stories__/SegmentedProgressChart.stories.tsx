import React from 'react';
import { VStack } from '@coinbase/cds-web/layout';
import { Text } from '@coinbase/cds-web/typography';

import { SegmentedProgressChart } from '../SegmentedProgressChart';

export default {
  title: 'Components/Chart/SegmentedProgressChart',
  component: SegmentedProgressChart,
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

const BoughtVsSold = () => {
  return (
    <Example title="Bought vs Sold">
      <SegmentedProgressChart
        barHeight={6}
        borderRadius={3}
        segments={[
          {
            id: 'bought',
            value: 76,
            label: '76% bought',
            color: 'var(--color-accentBoldGreen)',
          },
          {
            id: 'sold',
            value: 24,
            label: '24% sold',
            color: 'var(--color-accentBoldRed)',
          },
        ]}
      />
    </Example>
  );
};

const PortfolioAllocation = () => {
  return (
    <Example title="Portfolio Allocation">
      <SegmentedProgressChart
        legendProps={{ justifyContent: 'flex-start', columnGap: 4 }}
        segments={[
          {
            id: 'stocks',
            value: 60,
            label: 'Stocks (60%)',
            color: 'var(--color-accentBoldBlue)',
            legendShape: 'squircle',
          },
          {
            id: 'bonds',
            value: 25,
            label: 'Bonds (25%)',
            color: 'var(--color-accentBoldGreen)',
            legendShape: 'squircle',
          },
          {
            id: 'cash',
            value: 15,
            label: 'Cash (15%)',
            color: 'var(--color-fgMuted)',
            legendShape: 'squircle',
          },
        ]}
      />
    </Example>
  );
};

const ThreeWaySplit = () => {
  return (
    <Example title="Three-Way Split">
      <SegmentedProgressChart
        borderRadius={0}
        segments={[
          {
            id: 'approved',
            value: 45,
            label: '45% Approved',
            color: 'var(--color-fgPositive)',
          },
          {
            id: 'pending',
            value: 30,
            label: '30% Pending',
            color: 'var(--color-accentBoldYellow)',
          },
          {
            id: 'rejected',
            value: 25,
            label: '25% Rejected',
            color: 'var(--color-fgNegative)',
          },
        ]}
      />
    </Example>
  );
};

const CustomMax = () => {
  return (
    <Example description="Using a custom max value (1000) instead of 100" title="Custom Max Value">
      <SegmentedProgressChart
        max={1000}
        segments={[
          {
            id: 'completed',
            value: 750,
            label: '750 completed',
            color: 'var(--color-accentBoldBlue)',
          },
          {
            id: 'remaining',
            value: 250,
            label: '250 remaining',
            color: 'var(--color-bgSecondary)',
          },
        ]}
      />
    </Example>
  );
};

const LegendOnTop = () => {
  return (
    <Example title="Legend on Top">
      <SegmentedProgressChart
        legendPosition="top"
        segments={[
          {
            id: 'yes',
            value: 65,
            label: '65% Yes',
            color: 'var(--color-accentBoldGreen)',
          },
          {
            id: 'no',
            value: 35,
            label: '35% No',
            color: 'var(--color-accentBoldRed)',
          },
        ]}
      />
    </Example>
  );
};

const NoLegend = () => {
  return (
    <Example title="Without Legend">
      <SegmentedProgressChart
        showLegend={false}
        segments={[
          {
            id: 'progress',
            value: 70,
            color: 'var(--color-accentBoldBlue)',
          },
          {
            id: 'remaining',
            value: 30,
            color: 'var(--color-bgSecondary)',
          },
        ]}
      />
    </Example>
  );
};

const WithXAxis = () => {
  return (
    <Example title="With X Axis">
      <SegmentedProgressChart
        showXAxis
        barHeight={24}
        segments={[
          {
            id: 'used',
            value: 72,
            label: 'Used (72%)',
            color: 'var(--color-accentBoldBlue)',
          },
          {
            id: 'free',
            value: 28,
            label: 'Free (28%)',
            color: 'var(--color-bgSecondary)',
          },
        ]}
        xAxis={{
          tickLabelFormatter: (value: number) => `${value}%`,
        }}
      />
    </Example>
  );
};

const TallerBar = () => {
  return (
    <Example title="Taller Bar">
      <SegmentedProgressChart
        barHeight={48}
        borderRadius={8}
        segments={[
          {
            id: 'active',
            value: 85,
            label: '85% Active Users',
            color: 'var(--color-accentBoldGreen)',
          },
          {
            id: 'inactive',
            value: 15,
            label: '15% Inactive',
            color: 'var(--color-fgMuted)',
          },
        ]}
      />
    </Example>
  );
};

const ManySegments = () => {
  return (
    <Example title="Many Segments">
      <SegmentedProgressChart
        legendProps={{ justifyContent: 'flex-start', columnGap: 3, flexWrap: 'wrap' }}
        segments={[
          { id: 'btc', value: 35, label: 'BTC (35%)', color: '#F7931A' },
          { id: 'eth', value: 25, label: 'ETH (25%)', color: '#627EEA' },
          { id: 'sol', value: 15, label: 'SOL (15%)', color: '#9945FF' },
          { id: 'usdc', value: 10, label: 'USDC (10%)', color: '#2775CA' },
          { id: 'others', value: 15, label: 'Others (15%)', color: 'var(--color-fgMuted)' },
        ]}
      />
    </Example>
  );
};

export const Examples = () => {
  return (
    <VStack gap={8} style={{ maxWidth: 600, width: '100%' }}>
      <BoughtVsSold />
      <PortfolioAllocation />
      <ThreeWaySplit />
      <CustomMax />
      <LegendOnTop />
      <NoLegend />
      <WithXAxis />
      <TallerBar />
      <ManySegments />
    </VStack>
  );
};

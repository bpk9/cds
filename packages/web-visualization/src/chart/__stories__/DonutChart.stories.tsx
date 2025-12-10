import React, { useCallback, useMemo } from 'react';
import { Box, HStack, VStack } from '@coinbase/cds-web/layout';
import { Text } from '@coinbase/cds-web/typography';

import { ChartTooltip } from '../ChartTooltip';
import { DonutChart } from '../DonutChart';

export default {
  component: DonutChart,
  title: 'Components/Chart/DonutChart',
};

const Example: React.FC<React.PropsWithChildren<{ title: string }>> = ({ children, title }) => {
  return (
    <VStack gap={2}>
      <Text as="h2" display="block" font="title3">
        {title}
      </Text>
      {children}
    </VStack>
  );
};

const Basic = () => {
  return (
    <Example title="Basic Donut Chart">
      <Text color="fgMuted" font="body">
        A simple donut chart showing proportional data with a hollow center.
      </Text>
      <DonutChart
        enableHighlighting
        height={250}
        innerRadiusRatio={0.6}
        series={[
          { id: 'a', data: 30, label: 'Category A', color: 'rgb(var(--blue40))' },
          { id: 'b', data: 20, label: 'Category B', color: 'rgb(var(--purple40))' },
          { id: 'c', data: 15, label: 'Category C', color: 'rgb(var(--pink50))' },
          { id: 'd', data: 10, label: 'Category D', color: 'rgb(var(--orange40))' },
          { id: 'e', data: 15, label: 'Category E', color: 'rgb(var(--yellow40))' },
          { id: 'f', data: 10, label: 'Category F', color: 'rgb(var(--green40))' },
        ]}
      >
        <ChartTooltip />
      </DonutChart>
    </Example>
  );
};

const WithLegend = () => {
  const series = useMemo(
    () => [
      {
        id: 'crypto',
        data: 45000,
        label: 'Crypto',
        color: 'rgb(var(--blue40))',
        legendShape: 'circle' as const,
      },
      {
        id: 'cash',
        data: 30000,
        label: 'Cash',
        color: 'rgb(var(--green40))',
        legendShape: 'circle' as const,
      },
      {
        id: 'rewards',
        data: 15000,
        label: 'Rewards',
        color: 'rgb(var(--purple40))',
        legendShape: 'circle' as const,
      },
      {
        id: 'nft',
        data: 10000,
        label: 'NFTs',
        color: 'rgb(var(--orange40))',
        legendShape: 'circle' as const,
      },
    ],
    [],
  );

  const currencyFormatter = useCallback(
    (value: number) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value),
    [],
  );

  return (
    <Example title="With Legend">
      <Text color="fgMuted" font="body">
        Donut chart with legend positioned to the right.
      </Text>
      <DonutChart
        enableHighlighting
        legend
        cornerRadius={4}
        height={{ base: 250, tablet: 300, desktop: 350 }}
        innerRadiusRatio={0.65}
        legendPosition="right"
        series={series}
        stroke="var(--color-bg)"
        strokeWidth={2}
      >
        <ChartTooltip label="Portfolio Holdings" valueFormatter={currencyFormatter} />
      </DonutChart>
    </Example>
  );
};

const InnerRadiusVariants = () => {
  const series = [
    { id: 'a', data: 60, color: 'rgb(var(--blue40))' },
    { id: 'b', data: 40, color: 'rgb(var(--green40))' },
  ];

  return (
    <Example title="Inner Radius Variants">
      <Text color="fgMuted" font="body">
        Control the size of the center hole using innerRadiusRatio (0-1).
      </Text>
      <HStack gap={4} justifyContent="center">
        <VStack alignItems="center" gap={2}>
          <DonutChart
            enableHighlighting
            height={150}
            innerRadiusRatio={0.3}
            series={series}
            width={150}
          >
            <ChartTooltip />
          </DonutChart>
          <Text color="fgMuted" font="label2">
            innerRadiusRatio: 0.3
          </Text>
        </VStack>
        <VStack alignItems="center" gap={2}>
          <DonutChart
            enableHighlighting
            height={150}
            innerRadiusRatio={0.5}
            series={series}
            width={150}
          >
            <ChartTooltip />
          </DonutChart>
          <Text color="fgMuted" font="label2">
            innerRadiusRatio: 0.5
          </Text>
        </VStack>
        <VStack alignItems="center" gap={2}>
          <DonutChart
            enableHighlighting
            height={150}
            innerRadiusRatio={0.75}
            series={series}
            width={150}
          >
            <ChartTooltip />
          </DonutChart>
          <Text color="fgMuted" font="label2">
            innerRadiusRatio: 0.75
          </Text>
        </VStack>
      </HStack>
    </Example>
  );
};

const Styling = () => {
  return (
    <Example title="Styling Options">
      <Text color="fgMuted" font="body">
        Use cornerRadius, stroke, strokeWidth, and paddingAngle to customize appearance.
      </Text>
      <HStack gap={4} justifyContent="center">
        <VStack alignItems="center" gap={2}>
          <DonutChart
            enableHighlighting
            cornerRadius={8}
            height={150}
            series={[
              { id: 'a', data: 30, color: 'rgb(var(--blue40))' },
              { id: 'b', data: 40, color: 'rgb(var(--green40))' },
              { id: 'c', data: 30, color: 'rgb(var(--purple40))' },
            ]}
            width={150}
          >
            <ChartTooltip />
          </DonutChart>
          <Text color="fgMuted" font="label2">
            Corner Radius
          </Text>
        </VStack>
        <VStack alignItems="center" gap={2}>
          <DonutChart
            enableHighlighting
            cornerRadius={4}
            height={150}
            series={[
              { id: 'a', data: 25, color: 'rgb(var(--blue40))' },
              { id: 'b', data: 25, color: 'rgb(var(--green40))' },
              { id: 'c', data: 25, color: 'rgb(var(--purple40))' },
              { id: 'd', data: 25, color: 'rgb(var(--orange40))' },
            ]}
            stroke="var(--color-bg)"
            strokeWidth={3}
            width={150}
          >
            <ChartTooltip />
          </DonutChart>
          <Text color="fgMuted" font="label2">
            With Stroke
          </Text>
        </VStack>
        <VStack alignItems="center" gap={2}>
          <DonutChart
            enableHighlighting
            angularAxis={{ paddingAngle: 4 }}
            cornerRadius={100}
            height={150}
            innerRadiusRatio={0.7}
            series={[
              { id: 'a', data: 30, color: 'rgb(var(--blue40))' },
              { id: 'b', data: 40, color: 'rgb(var(--green40))' },
              { id: 'c', data: 30, color: 'rgb(var(--orange40))' },
            ]}
            width={150}
          >
            <ChartTooltip />
          </DonutChart>
          <Text color="fgMuted" font="label2">
            Padding Angle
          </Text>
        </VStack>
      </HStack>
    </Example>
  );
};

const WithTooltip = () => {
  const series = useMemo(
    () => [
      {
        id: 'completed',
        data: 68,
        label: 'Completed',
        color: 'var(--color-fgPositive)',
        legendShape: 'squircle' as const,
      },
      {
        id: 'inProgress',
        data: 22,
        label: 'In Progress',
        color: 'rgb(var(--blue40))',
        legendShape: 'squircle' as const,
      },
      {
        id: 'pending',
        data: 10,
        label: 'Pending',
        color: 'rgb(var(--gray40))',
        legendShape: 'squircle' as const,
      },
    ],
    [],
  );

  const total = useMemo(() => series.reduce((sum, s) => sum + s.data, 0), [series]);

  const percentFormatter = useCallback(
    (value: number) => {
      const percent = Math.round((value / total) * 100);
      return `${value} tasks (${percent}%)`;
    },
    [total],
  );

  return (
    <Example title="With Tooltip">
      <Text color="fgMuted" font="body">
        Hover over slices to see values with custom formatting.
      </Text>
      <VStack gap={2}>
        <Text font="headline" textAlign="center">
          Task Status
        </Text>
        <DonutChart
          enableHighlighting
          legend
          height={{ base: 250, tablet: 300, desktop: 350 }}
          innerRadiusRatio={0.65}
          legendPosition="bottom"
          series={series}
        >
          <ChartTooltip valueFormatter={percentFormatter} />
        </DonutChart>
      </VStack>
    </Example>
  );
};

const CompactDonut = () => {
  return (
    <Example title="Compact Donut">
      <Text color="fgMuted" font="body">
        Small donut charts for compact displays.
      </Text>
      <HStack gap={4}>
        <HStack alignItems="center" gap={2}>
          <DonutChart
            height={48}
            innerRadiusRatio={0.6}
            series={[
              { id: 'used', data: 75, color: 'rgb(var(--green40))' },
              { id: 'remaining', data: 25, color: 'rgb(var(--gray20))' },
            ]}
            width={48}
          />
          <VStack gap={0}>
            <Text font="label1">75%</Text>
            <Text color="fgMuted" font="label2">
              Complete
            </Text>
          </VStack>
        </HStack>
        <HStack alignItems="center" gap={2}>
          <DonutChart
            height={48}
            innerRadiusRatio={0.6}
            series={[
              { id: 'used', data: 30, color: 'rgb(var(--yellow40))' },
              { id: 'remaining', data: 70, color: 'rgb(var(--gray20))' },
            ]}
            width={48}
          />
          <VStack gap={0}>
            <Text font="label1">30%</Text>
            <Text color="fgMuted" font="label2">
              In Progress
            </Text>
          </VStack>
        </HStack>
      </HStack>
    </Example>
  );
};

const CenterLabel = () => {
  const series = useMemo(
    () => [
      { id: 'btc', data: 40, label: 'Bitcoin', color: 'rgb(var(--orange40))' },
      { id: 'eth', data: 30, label: 'Ethereum', color: 'rgb(var(--blue40))' },
      { id: 'sol', data: 20, label: 'Solana', color: 'rgb(var(--purple40))' },
      { id: 'other', data: 10, label: 'Other', color: 'rgb(var(--gray40))' },
    ],
    [],
  );

  const total = series.reduce((sum, s) => sum + s.data, 0);

  return (
    <Example title="Center Label">
      <Text color="fgMuted" font="body">
        Add a label in the center using absolute positioning.
      </Text>
      <Box height={200} position="relative" width={200}>
        <DonutChart
          enableHighlighting
          cornerRadius={0}
          height={200}
          innerRadiusRatio={0.65}
          series={series}
          stroke="var(--color-bg)"
          strokeWidth={2}
          width={200}
        >
          <ChartTooltip />
        </DonutChart>
        <Box
          alignItems="center"
          bottom={0}
          display="flex"
          justifyContent="center"
          left={0}
          position="absolute"
          right={0}
          style={{ pointerEvents: 'none' }}
          top={0}
        >
          <VStack alignItems="center" gap={0.5}>
            <Text color="fgMuted" font="label1">
              Total
            </Text>
            <Text font="headline">${(total * 100).toLocaleString()}</Text>
          </VStack>
        </Box>
      </Box>
    </Example>
  );
};

export const All = () => {
  return (
    <VStack gap={4}>
      <Basic />
      <WithLegend />
      <InnerRadiusVariants />
      <Styling />
      <WithTooltip />
      <CompactDonut />
      <CenterLabel />
    </VStack>
  );
};

import React, { useCallback, useMemo } from 'react';
import { Box, HStack, VStack } from '@coinbase/cds-web/layout';
import { Text } from '@coinbase/cds-web/typography';

import { ChartTooltip } from '../../ChartTooltip';

import { PieChart } from '../PieChart';

export default {
  component: PieChart,
  title: 'Components/Chart/PieChart',
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
    <Example title="Basic Pie Chart">
      <Text color="fgMuted" font="body">
        A simple pie chart showing proportional data.
      </Text>
      <PieChart
        enableHighlighting
        height={250}
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
      </PieChart>
    </Example>
  );
};

const WithLegend = () => {
  const series = useMemo(
    () => [
      {
        id: 'stocks',
        data: 45,
        label: 'Stocks',
        color: 'rgb(var(--blue40))',
        legendShape: 'circle' as const,
      },
      {
        id: 'bonds',
        data: 25,
        label: 'Bonds',
        color: 'rgb(var(--green40))',
        legendShape: 'circle' as const,
      },
      {
        id: 'realEstate',
        data: 15,
        label: 'Real Estate',
        color: 'rgb(var(--orange40))',
        legendShape: 'circle' as const,
      },
      {
        id: 'commodities',
        data: 10,
        label: 'Commodities',
        color: 'rgb(var(--purple40))',
        legendShape: 'circle' as const,
      },
      {
        id: 'cash',
        data: 5,
        label: 'Cash',
        color: 'rgb(var(--gray40))',
        legendShape: 'circle' as const,
      },
    ],
    [],
  );

  return (
    <Example title="With Legend">
      <Text color="fgMuted" font="body">
        Pie chart with legend positioned to the right.
      </Text>
      <VStack gap={2}>
        <Text font="headline" textAlign="center">
          Portfolio Allocation
        </Text>
        <PieChart
          enableHighlighting
          legend
          cornerRadius={4}
          height={{ base: 250, tablet: 300, desktop: 350 }}
          legendPosition="right"
          series={series}
          stroke="var(--color-bg)"
          strokeWidth={2}
        >
          <ChartTooltip valueFormatter={(value) => `${value}%`} />
        </PieChart>
      </VStack>
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
          <PieChart
            enableHighlighting
            cornerRadius={8}
            height={150}
            series={[
              { id: 'a', data: 30, color: 'rgb(var(--blue40))' },
              { id: 'b', data: 40, color: 'rgb(var(--green40))' },
              { id: 'c', data: 30, color: 'rgb(var(--orange40))' },
            ]}
            width={150}
          >
            <ChartTooltip />
          </PieChart>
          <Text color="fgMuted" font="label2">
            Corner Radius
          </Text>
        </VStack>
        <VStack alignItems="center" gap={2}>
          <PieChart
            enableHighlighting
            cornerRadius={8}
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
          </PieChart>
          <Text color="fgMuted" font="label2">
            With Stroke
          </Text>
        </VStack>
        <VStack alignItems="center" gap={2}>
          <PieChart
            enableHighlighting
            angularAxis={{ paddingAngle: 4 }}
            height={150}
            series={[
              { id: 'a', data: 30, color: 'rgb(var(--blue40))' },
              { id: 'b', data: 40, color: 'rgb(var(--purple40))' },
              { id: 'c', data: 30, color: 'rgb(var(--orange40))' },
            ]}
            width={150}
          >
            <ChartTooltip />
          </PieChart>
          <Text color="fgMuted" font="label2">
            Padding Angle
          </Text>
        </VStack>
      </HStack>
    </Example>
  );
};

const PartialCharts = () => {
  return (
    <Example title="Partial Charts">
      <Text color="fgMuted" font="body">
        Use angularAxis with range to create semicircle or quarter pie charts.
      </Text>
      <HStack gap={4} justifyContent="center">
        <VStack alignItems="center" gap={2}>
          <PieChart
            enableHighlighting
            legend
            angularAxis={{ range: { min: -90, max: 90 } }}
            height={120}
            legendPosition="bottom"
            series={[
              { id: 'low', data: 25, label: 'Low', color: 'rgb(var(--green40))' },
              { id: 'medium', data: 50, label: 'Medium', color: 'rgb(var(--yellow40))' },
              { id: 'high', data: 25, label: 'High', color: 'rgb(var(--red40))' },
            ]}
          >
            <ChartTooltip />
          </PieChart>
          <Text color="fgMuted" font="label2">
            Semicircle
          </Text>
        </VStack>
        <VStack alignItems="center" gap={2}>
          <PieChart
            enableHighlighting
            angularAxis={{ range: { min: 0, max: 90 } }}
            cornerRadius={4}
            height={150}
            series={[
              { id: 'a', data: 40, color: 'rgb(var(--blue40))' },
              { id: 'b', data: 35, color: 'rgb(var(--green40))' },
              { id: 'c', data: 25, color: 'rgb(var(--purple40))' },
            ]}
            width={150}
          >
            <ChartTooltip />
          </PieChart>
          <Text color="fgMuted" font="label2">
            Quarter
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
        id: 'tech',
        data: 35,
        label: 'Technology',
        color: 'rgb(var(--blue40))',
        legendShape: 'circle' as const,
      },
      {
        id: 'health',
        data: 25,
        label: 'Healthcare',
        color: 'rgb(var(--green40))',
        legendShape: 'circle' as const,
      },
      {
        id: 'finance',
        data: 20,
        label: 'Finance',
        color: 'rgb(var(--purple40))',
        legendShape: 'circle' as const,
      },
      {
        id: 'energy',
        data: 12,
        label: 'Energy',
        color: 'rgb(var(--orange40))',
        legendShape: 'circle' as const,
      },
      {
        id: 'other',
        data: 8,
        label: 'Other',
        color: 'rgb(var(--gray40))',
        legendShape: 'circle' as const,
      },
    ],
    [],
  );

  const total = useMemo(() => series.reduce((sum, s) => sum + s.data, 0), [series]);

  const percentFormatter = useCallback(
    (value: number) => {
      const percent = Math.round((value / total) * 100);
      return `${percent}% of portfolio`;
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
          Sector Distribution
        </Text>
        <PieChart
          enableHighlighting
          legend
          cornerRadius={4}
          height={{ base: 250, tablet: 300, desktop: 350 }}
          legendPosition="right"
          series={series}
        >
          <ChartTooltip label="Asset Allocation" valueFormatter={percentFormatter} />
        </PieChart>
      </VStack>
    </Example>
  );
};

const GaugeChart = () => {
  const value = 72;
  const max = 100;

  return (
    <Example title="Gauge Chart">
      <Text color="fgMuted" font="body">
        A semicircle pie chart can be used as a gauge to show progress.
      </Text>
      <Box height={120} position="relative" width={200}>
        <PieChart
          angularAxis={{ range: { min: -90, max: 90 } }}
          cornerRadius={100}
          height={120}
          series={[
            { id: 'value', data: value, color: 'rgb(var(--green40))' },
            { id: 'remaining', data: max - value, color: 'rgb(var(--gray20))' },
          ]}
          width={200}
        />
        <Box
          bottom={0}
          display="flex"
          justifyContent="center"
          left={0}
          position="absolute"
          right={0}
        >
          <VStack alignItems="center">
            <Text font="title1">{value}%</Text>
            <Text color="fgMuted" font="label2">
              Goal Progress
            </Text>
          </VStack>
        </Box>
      </Box>
    </Example>
  );
};

const CompactPie = () => {
  return (
    <Example title="Compact Pie">
      <Text color="fgMuted" font="body">
        Small pie charts for compact displays.
      </Text>
      <HStack gap={4}>
        <HStack alignItems="center" gap={2}>
          <PieChart
            height={40}
            series={[
              { id: 'a', data: 60, color: 'rgb(var(--blue40))' },
              { id: 'b', data: 40, color: 'rgb(var(--gray20))' },
            ]}
            width={40}
          />
          <VStack gap={0}>
            <Text font="label1">60%</Text>
            <Text color="fgMuted" font="label2">
              Allocation
            </Text>
          </VStack>
        </HStack>
        <HStack alignItems="center" gap={2}>
          <PieChart
            height={40}
            series={[
              { id: 'a', data: 33, color: 'rgb(var(--blue40))' },
              { id: 'b', data: 33, color: 'rgb(var(--green40))' },
              { id: 'c', data: 34, color: 'rgb(var(--purple40))' },
            ]}
            width={40}
          />
          <VStack gap={0}>
            <Text font="label1">Equal</Text>
            <Text color="fgMuted" font="label2">
              Split
            </Text>
          </VStack>
        </HStack>
      </HStack>
    </Example>
  );
};

export const All = () => {
  return (
    <VStack gap={4}>
      <Basic />
      <WithLegend />
      <Styling />
      <PartialCharts />
      <WithTooltip />
      <GaugeChart />
      <CompactPie />
    </VStack>
  );
};

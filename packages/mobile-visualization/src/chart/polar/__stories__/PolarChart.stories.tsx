import React, { memo, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from '@coinbase/cds-mobile';
import { Example, ExampleScreen } from '@coinbase/cds-mobile/examples/ExampleScreen';
import { HStack } from '@coinbase/cds-mobile/layout';

import { Arc } from '../../pie/Arc';
import { PiePlot } from '../../pie/PiePlot';
import { PolarChart } from '../../PolarChart';
import { getArcPath } from '../../utils/path';
import { usePolarChartContext } from '../PolarChartProvider';

const BasicPieChart = () => {
  return (
    <PolarChart
      animate
      height={200}
      inset={0}
      series={[
        { id: 'a', data: 30, label: 'A', color: '#5B8DEF' },
        { id: 'b', data: 40, label: 'B', color: '#4CAF93' },
        { id: 'c', data: 30, label: 'C', color: '#E67C5C' },
      ]}
      width={200}
    >
      <PiePlot />
    </PolarChart>
  );
};

const DonutChart = () => {
  return (
    <PolarChart
      animate
      height={200}
      inset={0}
      radialAxis={{ range: ({ max }) => ({ min: max * 0.6, max }) }}
      series={[
        { id: 'card', data: 15, label: 'Card', color: '#5B8DEF' },
        { id: 'cash', data: 45, label: 'Cash', color: '#4CAF93' },
        { id: 'stake', data: 12, label: 'Stake', color: '#E67C5C' },
        { id: 'lend', data: 18, label: 'Lend', color: '#6DD4E0' },
      ]}
      width={200}
    >
      <PiePlot />
    </PolarChart>
  );
};

const SemicircleChart = () => {
  return (
    <PolarChart
      animate
      angularAxis={{ range: { min: -90, max: 90 } }}
      height={100}
      inset={0}
      series={[
        { id: 'a', data: 30, label: 'A', color: '#5B8DEF' },
        { id: 'b', data: 40, label: 'B', color: '#4CAF93' },
        { id: 'c', data: 30, label: 'C', color: '#E67C5C' },
      ]}
      width={200}
    >
      <PiePlot />
    </PolarChart>
  );
};

const NestedRingsChart = () => {
  return (
    <PolarChart
      animate
      height={200}
      inset={0}
      radialAxis={[
        { id: 'inner', range: ({ max }) => ({ min: 0, max: max - 20 }) },
        { id: 'outer', range: ({ max }) => ({ min: max - 20, max }) },
      ]}
      series={[
        // Inner ring
        { id: 'crypto', data: 35, label: 'Crypto', color: '#5B8DEF', radialAxisId: 'inner' },
        { id: 'fiat', data: 45, label: 'Fiat', color: '#4CAF93', radialAxisId: 'inner' },
        { id: 'rewards', data: 20, label: 'Rewards', color: '#E67C5C', radialAxisId: 'inner' },
        // Outer ring
        { id: 'btc', data: 15, label: 'Bitcoin', color: '#7FA8F5', radialAxisId: 'outer' },
        { id: 'eth', data: 12, label: 'Ethereum', color: '#95B8F7', radialAxisId: 'outer' },
        { id: 'other-crypto', data: 8, label: 'Other', color: '#ABC8F9', radialAxisId: 'outer' },
        { id: 'usd', data: 30, label: 'USD', color: '#6BC9A9', radialAxisId: 'outer' },
        { id: 'eur', data: 15, label: 'EUR', color: '#8DD9BC', radialAxisId: 'outer' },
        { id: 'cashback', data: 12, label: 'Cash Back', color: '#ED9274', radialAxisId: 'outer' },
        { id: 'points', data: 8, label: 'Points', color: '#F2AB91', radialAxisId: 'outer' },
      ]}
      width={200}
    >
      <PiePlot radialAxisId="inner" />
      <PiePlot radialAxisId="outer" />
    </PolarChart>
  );
};

const WalletBreakdownPie = () => {
  return (
    <PolarChart
      animate
      height={200}
      inset={0}
      series={[
        { id: 'card', data: 15, label: 'Card', color: '#5B8DEF' },
        { id: 'cash', data: 45, label: 'Cash', color: '#4CAF93' },
        { id: 'stake', data: 12, label: 'Stake', color: '#E67C5C' },
        { id: 'lend', data: 18, label: 'Lend', color: '#6DD4E0' },
      ]}
      width={200}
    >
      <PiePlot />
    </PolarChart>
  );
};

const PaddingAngleChart = () => {
  return (
    <PolarChart
      animate
      angularAxis={{ paddingAngle: 5 }}
      height={200}
      inset={0}
      series={[
        { id: 'a', data: 30, label: 'A', color: '#5B8DEF' },
        { id: 'b', data: 40, label: 'B', color: '#4CAF93' },
        { id: 'c', data: 30, label: 'C', color: '#E67C5C' },
      ]}
      width={200}
    >
      <PiePlot />
    </PolarChart>
  );
};

const CornerRadiusChart = () => {
  return (
    <HStack gap={2}>
      <PolarChart
        animate
        height={100}
        inset={0}
        series={[
          { id: 'a', data: 30, label: 'A', color: '#5B8DEF' },
          { id: 'b', data: 40, label: 'B', color: '#4CAF93' },
          { id: 'c', data: 30, label: 'C', color: '#E67C5C' },
        ]}
        width={100}
      >
        <PiePlot cornerRadius={0} />
      </PolarChart>
      <PolarChart
        animate
        height={100}
        inset={0}
        series={[
          { id: 'a', data: 30, label: 'A', color: '#5B8DEF' },
          { id: 'b', data: 40, label: 'B', color: '#4CAF93' },
          { id: 'c', data: 30, label: 'C', color: '#E67C5C' },
        ]}
        width={100}
      >
        <PiePlot cornerRadius={8} />
      </PolarChart>
    </HStack>
  );
};

const MultiAxisSemicircles = () => {
  return (
    <PolarChart
      animate
      angularAxis={[
        { id: 'top', range: { min: -90, max: 90 } },
        { id: 'bottom', range: { min: 90, max: 270 } },
      ]}
      height={200}
      inset={0}
      series={[
        // Top semicircle
        { id: 'revenue', data: 30, label: 'Revenue', color: '#5B8DEF', angularAxisId: 'top' },
        { id: 'profit', data: 50, label: 'Profit', color: '#4CAF93', angularAxisId: 'top' },
        { id: 'costs', data: 20, label: 'Costs', color: '#E67C5C', angularAxisId: 'top' },
        // Bottom semicircle
        { id: 'users', data: 40, label: 'Users', color: '#9B6DD4', angularAxisId: 'bottom' },
        { id: 'sessions', data: 35, label: 'Sessions', color: '#F5A623', angularAxisId: 'bottom' },
        { id: 'conversions', data: 25, label: 'Conv.', color: '#50E3C2', angularAxisId: 'bottom' },
      ]}
      width={200}
    >
      <PiePlot angularAxisId="top" cornerRadius={4} />
      <PiePlot angularAxisId="bottom" cornerRadius={4} />
    </PolarChart>
  );
};

const QuadrantChart = () => {
  return (
    <PolarChart
      animate
      angularAxis={[
        { id: 'q1', range: { min: 0, max: 90 }, paddingAngle: 3 },
        { id: 'q2', range: { min: 90, max: 180 }, paddingAngle: 3 },
        { id: 'q3', range: { min: 180, max: 270 }, paddingAngle: 3 },
        { id: 'q4', range: { min: 270, max: 360 }, paddingAngle: 3 },
      ]}
      height={200}
      inset={0}
      series={[
        // Q1 (top-right)
        { id: 'a', data: 50, label: 'A', color: '#5B8DEF', angularAxisId: 'q1' },
        { id: 'b', data: 30, label: 'B', color: '#4CAF93', angularAxisId: 'q1' },
        { id: 'c', data: 20, label: 'C', color: '#E67C5C', angularAxisId: 'q1' },
        // Q2 (top-left)
        { id: 'd', data: 40, label: 'D', color: '#9B6DD4', angularAxisId: 'q2' },
        { id: 'e', data: 35, label: 'E', color: '#F5A623', angularAxisId: 'q2' },
        { id: 'f', data: 25, label: 'F', color: '#50E3C2', angularAxisId: 'q2' },
        // Q3 (bottom-left)
        { id: 'g', data: 45, label: 'G', color: '#FF6B9D', angularAxisId: 'q3' },
        { id: 'h', data: 30, label: 'H', color: '#C06C84', angularAxisId: 'q3' },
        { id: 'i', data: 25, label: 'I', color: '#6C5B7B', angularAxisId: 'q3' },
        // Q4 (bottom-right)
        { id: 'j', data: 35, label: 'J', color: '#FFB6B9', angularAxisId: 'q4' },
        { id: 'k', data: 40, label: 'K', color: '#FFC9B9', angularAxisId: 'q4' },
        { id: 'l', data: 25, label: 'L', color: '#FFE5B9', angularAxisId: 'q4' },
      ]}
      width={200}
    >
      <PiePlot angularAxisId="q1" cornerRadius={6} />
      <PiePlot angularAxisId="q2" cornerRadius={6} />
      <PiePlot angularAxisId="q3" cornerRadius={6} />
      <PiePlot angularAxisId="q4" cornerRadius={6} />
    </PolarChart>
  );
};

/**
 * Background arcs component for Coinbase One Rewards chart.
 * Renders the three segmented background arcs with gaps between them.
 */
/**
 * Background arcs component for Coinbase One Rewards chart.
 * Renders the three segmented background arcs with gaps between them.
 */
const RewardsBackgroundArcs = memo<{
  innerRadiusRatio: number;
  startAngleDegrees: number;
  firstSectionEnd: number;
  secondSectionStart: number;
  secondSectionEnd: number;
  thirdSectionStart: number;
  thirdSectionEnd: number;
}>(
  ({
    innerRadiusRatio,
    startAngleDegrees,
    firstSectionEnd,
    secondSectionStart,
    secondSectionEnd,
    thirdSectionStart,
    thirdSectionEnd,
  }) => {
    const theme = useTheme();
    const { drawingArea, animate } = usePolarChartContext();

    const { innerRadius, outerRadius } = useMemo(() => {
      const r = Math.min(drawingArea.width, drawingArea.height) / 2;
      return {
        innerRadius: r * innerRadiusRatio,
        outerRadius: r,
      };
    }, [drawingArea, innerRadiusRatio]);

    const sections = useMemo(
      () => [
        {
          startAngle: (startAngleDegrees * Math.PI) / 180,
          endAngle: (firstSectionEnd * Math.PI) / 180,
        },
        {
          startAngle: (secondSectionStart * Math.PI) / 180,
          endAngle: (secondSectionEnd * Math.PI) / 180,
        },
        {
          startAngle: (thirdSectionStart * Math.PI) / 180,
          endAngle: (thirdSectionEnd * Math.PI) / 180,
        },
      ],
      [
        startAngleDegrees,
        firstSectionEnd,
        secondSectionStart,
        secondSectionEnd,
        thirdSectionStart,
        thirdSectionEnd,
      ],
    );

    return (
      <>
        {sections.map((section, i) => (
          <Arc
            key={i}
            arcData={{
              startAngle: section.startAngle,
              endAngle: section.endAngle,
              innerRadius,
              outerRadius,
              padAngle: 0,
              index: i,
              value: 100,
              data: {
                value: 100,
                id: `background-${i}`,
                color: theme.color.fgMuted,
              },
            }}
            baselineAngle={section.startAngle}
            cornerRadius={100}
            fill={theme.color.fgMuted}
            fillOpacity={0.25}
          />
        ))}
      </>
    );
  },
);

/**
 * Foreground progress with clipping applied
 */
const RewardsClippedProgress = memo<{
  innerRadiusRatio: number;
  startAngleDegrees: number;
  firstSectionEnd: number;
  secondSectionStart: number;
  secondSectionEnd: number;
  thirdSectionStart: number;
  thirdSectionEnd: number;
}>(
  ({
    innerRadiusRatio,
    startAngleDegrees,
    firstSectionEnd,
    secondSectionStart,
    secondSectionEnd,
    thirdSectionStart,
    thirdSectionEnd,
  }) => {
    const { drawingArea } = usePolarChartContext();

    // Compute clip path from the three background sections
    const clipPath = useMemo(() => {
      const r = Math.min(drawingArea.width, drawingArea.height) / 2;
      const innerRadius = r * innerRadiusRatio;
      const outerRadius = r;

      const sections = [
        {
          startAngle: (startAngleDegrees * Math.PI) / 180,
          endAngle: (firstSectionEnd * Math.PI) / 180,
        },
        {
          startAngle: (secondSectionStart * Math.PI) / 180,
          endAngle: (secondSectionEnd * Math.PI) / 180,
        },
        {
          startAngle: (thirdSectionStart * Math.PI) / 180,
          endAngle: (thirdSectionEnd * Math.PI) / 180,
        },
      ];

      // Generate a combined SVG path for all sections
      return sections
        .map((section) =>
          getArcPath({
            startAngle: section.startAngle,
            endAngle: section.endAngle,
            innerRadius,
            outerRadius,
            cornerRadius: 100,
          }),
        )
        .join(' ');
    }, [
      drawingArea,
      innerRadiusRatio,
      startAngleDegrees,
      firstSectionEnd,
      secondSectionStart,
      secondSectionEnd,
      thirdSectionStart,
      thirdSectionEnd,
    ]);

    return <PiePlot clipPathId={clipPath} cornerRadius={100} strokeWidth={0} />;
  },
);

/**
 * Coinbase One Rewards Chart
 * Progress indicator with segmented background.
 */
const CoinbaseOneRewardsChart = () => {
  const theme = useTheme();

  // Chart parameters
  const innerRadiusRatio = 0.75;
  const angleEachSideGap = (45 / 4) * 3; // in degrees

  const startAngleDegrees = angleEachSideGap - 180;
  const endAngleDegrees = 180 - angleEachSideGap;

  const angleGapDegrees = 5;
  const totalGapDegrees = angleGapDegrees * 2;
  const gapBetweenDegrees = totalGapDegrees / 3;

  const sectionLengthDegrees = (endAngleDegrees - startAngleDegrees) / 3 - gapBetweenDegrees;

  const firstSectionEnd = startAngleDegrees + sectionLengthDegrees;
  const secondSectionStart = firstSectionEnd + gapBetweenDegrees;
  const secondSectionEnd = secondSectionStart + sectionLengthDegrees;
  const thirdSectionStart = secondSectionEnd + gapBetweenDegrees;
  const thirdSectionEnd = thirdSectionStart + sectionLengthDegrees;

  // Progress angle (can be animated between startAngleDegrees and endAngleDegrees)
  const progressAngle = -45; // Example: halfway through first section

  return (
    <PolarChart
      animate
      angularAxis={{ range: { min: startAngleDegrees, max: progressAngle } }}
      height={200}
      inset={0}
      radialAxis={{ range: ({ max }) => ({ min: innerRadiusRatio * max, max }) }}
      series={[
        // Foreground: single slice that fills based on progress
        { id: 'progress', data: 100, label: 'Progress', color: theme.color.fg },
      ]}
      width={200}
    >
      <RewardsBackgroundArcs
        firstSectionEnd={firstSectionEnd}
        innerRadiusRatio={innerRadiusRatio}
        secondSectionEnd={secondSectionEnd}
        secondSectionStart={secondSectionStart}
        startAngleDegrees={startAngleDegrees}
        thirdSectionEnd={thirdSectionEnd}
        thirdSectionStart={thirdSectionStart}
      />
      <RewardsClippedProgress
        firstSectionEnd={firstSectionEnd}
        innerRadiusRatio={innerRadiusRatio}
        secondSectionEnd={secondSectionEnd}
        secondSectionStart={secondSectionStart}
        startAngleDegrees={startAngleDegrees}
        thirdSectionEnd={thirdSectionEnd}
        thirdSectionStart={thirdSectionStart}
      />
    </PolarChart>
  );
};

const PolarChartStories = () => {
  return (
    <ScrollView>
      <ExampleScreen>
        <Example title="Coinbase One Rewards">
          <CoinbaseOneRewardsChart />
        </Example>
        <Example title="Basic Pie Chart">
          <BasicPieChart />
        </Example>

        <Example title="Donut Chart">
          <DonutChart />
        </Example>

        <Example title="Wallet Breakdown Pie">
          <WalletBreakdownPie />
        </Example>

        <Example title="Semicircle">
          <SemicircleChart />
        </Example>

        <Example title="Padding Angle">
          <PaddingAngleChart />
        </Example>

        <Example title="Corner Radius">
          <CornerRadiusChart />
        </Example>

        <Example title="Nested Rings">
          <NestedRingsChart />
        </Example>

        <Example title="Multi-Axis Semicircles">
          <MultiAxisSemicircles />
        </Example>

        <Example title="Quadrants">
          <QuadrantChart />
        </Example>
      </ExampleScreen>
    </ScrollView>
  );
};

export default PolarChartStories;

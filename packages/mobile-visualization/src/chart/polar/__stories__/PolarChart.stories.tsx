import React, { memo, useCallback, useMemo, useState } from 'react';
import { useTheme } from '@coinbase/cds-mobile';
import { IconButton } from '@coinbase/cds-mobile/buttons';
import { ExampleScreen } from '@coinbase/cds-mobile/examples/ExampleScreen';
import { Box, HStack, VStack } from '@coinbase/cds-mobile/layout';
import { TextLabel1 } from '@coinbase/cds-mobile/typography';
import { Text } from '@coinbase/cds-mobile/typography/Text';

import { Arc } from '../../pie/Arc';
import { DonutChart } from '../../pie/DonutChart';
import { PieChart } from '../../pie/PieChart';
import { PiePlot } from '../../pie/PiePlot';
import { PolarChart } from '../../PolarChart';
import { ChartText, type ChartTextProps } from '../../text/ChartText';
import { getArcPath } from '../../utils/path';
import { usePolarChartContext } from '../PolarChartProvider';

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Center label component that positions ChartText in the center of the donut.
 */
const DonutCenterLabel = memo<Omit<ChartTextProps, 'x' | 'y'>>(({ children, ...props }) => {
  const { drawingArea } = usePolarChartContext();

  const centerX = drawingArea.x + drawingArea.width / 2;
  const centerY = drawingArea.y + drawingArea.height / 2;

  return (
    <ChartText {...props} x={centerX} y={centerY}>
      {children}
    </ChartText>
  );
});

/**
 * Background arcs component for Coinbase One Rewards chart.
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
    const { drawingArea } = usePolarChartContext();

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
 * Variable Radius Pie Chart component.
 * Each slice's outer radius is proportional to its value.
 */
const VariableRadiusPieArcs = memo(() => {
  const theme = useTheme();
  const { drawingArea } = usePolarChartContext();

  const data = useMemo(
    () => [
      { id: 'a', value: 2548, color: '#5B8DEF' },
      { id: 'b', value: 1754, color: '#9B6DD4' },
      { id: 'c', value: 390, color: '#E67C5C' },
      { id: 'd', value: 250, color: '#4CAF93' },
      { id: 'e', value: 280, color: '#6DD4E0' },
    ],
    [],
  );

  const maxRadius = Math.min(drawingArea.width, drawingArea.height) / 2;
  const minRadius = maxRadius * 0.5;
  const maxValue = Math.max(...data.map((d) => d.value));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const arcs = useMemo(() => {
    let currentAngle = -Math.PI / 2;
    return data.map((d, i) => {
      const angleSpan = (d.value / total) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angleSpan;
      currentAngle = endAngle;

      const outerRadius = minRadius + (d.value / maxValue) * (maxRadius - minRadius);

      return {
        startAngle,
        endAngle,
        innerRadius: 0,
        outerRadius,
        padAngle: 0,
        index: i,
        value: d.value,
        data: { value: d.value, id: d.id, color: d.color },
      };
    });
  }, [data, total, maxValue, minRadius, maxRadius]);

  return (
    <>
      {arcs.map((arcData) => (
        <Arc
          key={arcData.data.id}
          arcData={arcData}
          baselineAngle={-Math.PI / 2}
          cornerRadius={0}
          fill={arcData.data.color}
          stroke={theme.color.bg}
          strokeWidth={2}
        />
      ))}
    </>
  );
});

// ============================================================================
// Example Charts
// ============================================================================

const BasicPieChart = () => (
  <PieChart
    animate
    height={200}
    inset={0}
    series={[
      { id: 'a', data: 30, label: 'A', color: '#5B8DEF' },
      { id: 'b', data: 40, label: 'B', color: '#4CAF93' },
      { id: 'c', data: 30, label: 'C', color: '#E67C5C' },
    ]}
    width={200}
  />
);

const BasicDonutChart = () => (
  <DonutChart
    animate
    height={200}
    innerRadiusRatio={0.6}
    inset={0}
    series={[
      { id: 'card', data: 15, label: 'Card', color: '#5B8DEF' },
      { id: 'cash', data: 45, label: 'Cash', color: '#4CAF93' },
      { id: 'stake', data: 12, label: 'Stake', color: '#E67C5C' },
      { id: 'lend', data: 18, label: 'Lend', color: '#6DD4E0' },
    ]}
    width={200}
  />
);

const DonutWithCenterLabel = () => {
  const theme = useTheme();

  return (
    <PolarChart
      animate
      angularAxis={{ paddingAngle: 0 }}
      height={200}
      inset={0}
      radialAxis={{ range: ({ max }) => ({ min: max * 0.7, max }) }}
      series={[
        { id: 'teal', data: 10, label: 'Other', color: `rgb(${theme.spectrum.teal40})` },
        { id: 'blue', data: 25, label: 'Bitcoin', color: `rgb(${theme.spectrum.blue40})` },
        { id: 'purple', data: 20, label: 'Ethereum', color: `rgb(${theme.spectrum.purple40})` },
        { id: 'pink', data: 15, label: 'Solana', color: `rgb(${theme.spectrum.pink40})` },
        { id: 'orange', data: 15, label: 'Solana', color: `rgb(${theme.spectrum.orange40})` },
        { id: 'yellow', data: 12, label: 'USDC', color: `rgb(${theme.spectrum.yellow40})` },
        { id: 'green', data: 8, label: 'Doge', color: `rgb(${theme.spectrum.green40})` },
      ]}
      width={200}
    >
      <PiePlot stroke={theme.color.bg} strokeWidth={2} />
      <DonutCenterLabel color={theme.color.fgMuted} font="label2" verticalAlignment="bottom">
        label
      </DonutCenterLabel>
      <DonutCenterLabel color={theme.color.fg} font="headline" verticalAlignment="top">
        $9,999.99
      </DonutCenterLabel>
    </PolarChart>
  );
};

const SemicircleChart = () => (
  <PieChart
    animate
    angularAxis={{ range: { min: -90, max: 90 } }}
    height={120}
    inset={0}
    series={[
      { id: 'low', data: 25, label: 'Low', color: '#4CAF93' },
      { id: 'medium', data: 50, label: 'Medium', color: '#F5A623' },
      { id: 'high', data: 25, label: 'High', color: '#E67C5C' },
    ]}
    width={200}
  />
);

const VariableRadiusPieChart = () => (
  <PolarChart animate height={200} inset={0} series={[]} width={200}>
    <VariableRadiusPieArcs />
  </PolarChart>
);

const PaddingAngleChart = () => (
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

const CornerRadiusChart = () => {
  const theme = useTheme();

  return (
    <HStack gap={2} justifyContent="center">
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

const NestedRingsChart = () => (
  <PolarChart
    animate
    height={200}
    inset={0}
    radialAxis={[
      { id: 'inner', range: ({ max }) => ({ min: 0, max: max - 20 }) },
      { id: 'outer', range: ({ max }) => ({ min: max - 20, max }) },
    ]}
    series={[
      { id: 'crypto', data: 35, label: 'Crypto', color: '#5B8DEF', radialAxisId: 'inner' },
      { id: 'fiat', data: 45, label: 'Fiat', color: '#4CAF93', radialAxisId: 'inner' },
      { id: 'rewards', data: 20, label: 'Rewards', color: '#E67C5C', radialAxisId: 'inner' },
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

const MultiAxisSemicircles = () => (
  <PolarChart
    animate
    angularAxis={[
      { id: 'top', range: { min: -90, max: 90 } },
      { id: 'bottom', range: { min: 90, max: 270 } },
    ]}
    height={200}
    inset={0}
    series={[
      { id: 'revenue', data: 30, label: 'Revenue', color: '#5B8DEF', angularAxisId: 'top' },
      { id: 'profit', data: 50, label: 'Profit', color: '#4CAF93', angularAxisId: 'top' },
      { id: 'costs', data: 20, label: 'Costs', color: '#E67C5C', angularAxisId: 'top' },
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

const QuadrantChart = () => (
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
      { id: 'a', data: 50, label: 'A', color: '#5B8DEF', angularAxisId: 'q1' },
      { id: 'b', data: 30, label: 'B', color: '#4CAF93', angularAxisId: 'q1' },
      { id: 'c', data: 20, label: 'C', color: '#E67C5C', angularAxisId: 'q1' },
      { id: 'd', data: 40, label: 'D', color: '#9B6DD4', angularAxisId: 'q2' },
      { id: 'e', data: 35, label: 'E', color: '#F5A623', angularAxisId: 'q2' },
      { id: 'f', data: 25, label: 'F', color: '#50E3C2', angularAxisId: 'q2' },
      { id: 'g', data: 45, label: 'G', color: '#FF6B9D', angularAxisId: 'q3' },
      { id: 'h', data: 30, label: 'H', color: '#C06C84', angularAxisId: 'q3' },
      { id: 'i', data: 25, label: 'I', color: '#6C5B7B', angularAxisId: 'q3' },
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

const CoinbaseOneRewardsChart = () => {
  const theme = useTheme();

  const innerRadiusRatio = 0.75;
  const angleEachSideGap = (45 / 4) * 3;
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
  const progressAngle = -45;

  return (
    <PolarChart
      animate
      angularAxis={{ range: { min: startAngleDegrees, max: progressAngle } }}
      height={200}
      inset={0}
      radialAxis={{ range: ({ max }) => ({ min: innerRadiusRatio * max, max }) }}
      series={[{ id: 'progress', data: 100, label: 'Progress', color: theme.color.fg }]}
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

const WalletBreakdownDonut = () => (
  <DonutChart
    animate
    angularAxis={{ paddingAngle: 3 }}
    cornerRadius={100}
    height={200}
    innerRadiusRatio={0.8}
    inset={0}
    series={[
      { id: 'card', data: 15, label: 'Card', color: '#5B8DEF' },
      { id: 'cash', data: 45, label: 'Cash', color: '#4CAF93' },
      { id: 'stake', data: 12, label: 'Stake', color: '#E67C5C' },
      { id: 'lend', data: 18, label: 'Lend', color: '#6DD4E0' },
    ]}
    width={200}
  />
);

// ============================================================================
// Example Navigator
// ============================================================================

type ExampleItem = {
  title: string;
  component: React.ReactNode;
};

function ExampleNavigator() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const examples = useMemo<ExampleItem[]>(
    () => [
      { title: 'Basic Pie Chart', component: <BasicPieChart /> },
      { title: 'Basic Donut Chart', component: <BasicDonutChart /> },
      { title: 'Donut with Center Label', component: <DonutWithCenterLabel /> },
      { title: 'Semicircle', component: <SemicircleChart /> },
      { title: 'Variable Radius', component: <VariableRadiusPieChart /> },
      { title: 'Padding Angle', component: <PaddingAngleChart /> },
      { title: 'Corner Radius', component: <CornerRadiusChart /> },
      { title: 'Nested Rings', component: <NestedRingsChart /> },
      { title: 'Multi-Axis Semicircles', component: <MultiAxisSemicircles /> },
      { title: 'Quadrants', component: <QuadrantChart /> },
      { title: 'Coinbase One Rewards', component: <CoinbaseOneRewardsChart /> },
      { title: 'Wallet Breakdown', component: <WalletBreakdownDonut /> },
    ],
    [],
  );

  const currentExample = examples[currentIndex];
  const isFirstExample = currentIndex === 0;
  const isLastExample = currentIndex === examples.length - 1;

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(examples.length - 1, prev + 1));
  }, [examples.length]);

  return (
    <ExampleScreen>
      <VStack gap={4}>
        <HStack alignItems="center" justifyContent="space-between" padding={2}>
          <IconButton
            accessibilityHint="Navigate to previous example"
            accessibilityLabel="Previous"
            disabled={isFirstExample}
            name="arrowLeft"
            onPress={handlePrevious}
            variant="secondary"
          />
          <VStack alignItems="center" gap={1}>
            <Text font="title3">{currentExample.title}</Text>
            <TextLabel1 color="fgMuted">
              {currentIndex + 1} / {examples.length}
            </TextLabel1>
          </VStack>
          <IconButton
            accessibilityHint="Navigate to next example"
            accessibilityLabel="Next"
            disabled={isLastExample}
            name="arrowRight"
            onPress={handleNext}
            variant="secondary"
          />
        </HStack>
        <Box alignItems="center" padding={1}>
          {currentExample.component}
        </Box>
      </VStack>
    </ExampleScreen>
  );
}

export default ExampleNavigator;

import React from 'react';
import { ScrollView } from 'react-native';
import { Example, ExampleScreen } from '@coinbase/cds-mobile/examples/ExampleScreen';
import { HStack } from '@coinbase/cds-mobile/layout';

import { DonutChart } from '../DonutChart';
import { PieChart } from '../PieChart';

const BasicPieChart = () => {
  return (
    <PieChart
      animate
      height={200}
      inset={0}
      series={[
        { id: 'a', data: 30, label: 'Category A', color: '#5B8DEF' },
        { id: 'b', data: 40, label: 'Category B', color: '#4CAF93' },
        { id: 'c', data: 30, label: 'Category C', color: '#E67C5C' },
      ]}
      width={200}
    />
  );
};

const WalletBreakdownDonut = () => {
  return (
    <DonutChart
      animate
      height={200}
      innerRadiusRatio={0.7}
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
};

const CustomCornerRadius = () => {
  return (
    <HStack gap={2}>
      <PieChart
        animate
        cornerRadius={8}
        height={100}
        inset={0}
        series={[
          { id: 'a', data: 30, label: 'A', color: '#5B8DEF' },
          { id: 'b', data: 40, label: 'B', color: '#4CAF93' },
          { id: 'c', data: 30, label: 'C', color: '#E67C5C' },
        ]}
        width={100}
      />
      <DonutChart
        animate
        cornerRadius={6}
        height={100}
        innerRadiusRatio={0.6}
        inset={0}
        series={[
          { id: 'a', data: 30, label: 'A', color: '#5B8DEF' },
          { id: 'b', data: 40, label: 'B', color: '#4CAF93' },
          { id: 'c', data: 30, label: 'C', color: '#E67C5C' },
        ]}
        width={100}
      />
    </HStack>
  );
};

const VariousInnerRadii = () => {
  return (
    <HStack gap={2}>
      <DonutChart
        animate
        height={100}
        innerRadiusRatio={0.3}
        inset={0}
        series={[
          { id: 'a', data: 30, label: 'A', color: '#5B8DEF' },
          { id: 'b', data: 40, label: 'B', color: '#4CAF93' },
          { id: 'c', data: 30, label: 'C', color: '#E67C5C' },
        ]}
        width={100}
      />
      <DonutChart
        animate
        height={100}
        innerRadiusRatio={0.5}
        inset={0}
        series={[
          { id: 'a', data: 30, label: 'A', color: '#5B8DEF' },
          { id: 'b', data: 40, label: 'B', color: '#4CAF93' },
          { id: 'c', data: 30, label: 'C', color: '#E67C5C' },
        ]}
        width={100}
      />
      <DonutChart
        animate
        height={100}
        innerRadiusRatio={0.7}
        inset={0}
        series={[
          { id: 'a', data: 30, label: 'A', color: '#5B8DEF' },
          { id: 'b', data: 40, label: 'B', color: '#4CAF93' },
          { id: 'c', data: 30, label: 'C', color: '#E67C5C' },
        ]}
        width={100}
      />
    </HStack>
  );
};

const SemicircleChart = () => {
  return (
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
};

const PieChartStories = () => {
  return (
    <ScrollView>
      <ExampleScreen>
        <Example title="Basic Pie Chart">
          <BasicPieChart />
        </Example>

        <Example title="Donut Chart">
          <WalletBreakdownDonut />
        </Example>

        <Example title="Custom Corner Radius">
          <CustomCornerRadius />
        </Example>

        <Example title="Various Inner Radii">
          <VariousInnerRadii />
        </Example>

        <Example title="Semicircle">
          <SemicircleChart />
        </Example>
      </ExampleScreen>
    </ScrollView>
  );
};

export default PieChartStories;


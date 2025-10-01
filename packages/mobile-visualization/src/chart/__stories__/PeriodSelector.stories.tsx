import { forwardRef, memo, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { assets } from '@coinbase/cds-common/internal/data/assets';
import { useTabsContext } from '@coinbase/cds-common/tabs/TabsContext';
import type { TabValue } from '@coinbase/cds-common/tabs/useTabs';
import { IconButton } from '@coinbase/cds-mobile/buttons';
import { Example, ExampleScreen } from '@coinbase/cds-mobile/examples/ExampleScreen';
import { useTheme } from '@coinbase/cds-mobile/hooks/useTheme';
import { Box, HStack, VStack } from '@coinbase/cds-mobile/layout';
import { type TabComponent, type TabsActiveIndicatorProps } from '@coinbase/cds-mobile/tabs';
import { SegmentedTab, type SegmentedTabProps } from '@coinbase/cds-mobile/tabs/SegmentedTab';
import { TextLabel1 } from '@coinbase/cds-mobile/typography';

import { LiveTabLabel, PeriodSelector, PeriodSelectorActiveIndicator } from '../PeriodSelector';

const PeriodSelectorExample = () => {
  const tabs = [
    { id: '1H', label: '1H' },
    { id: '1D', label: '1D' },
    { id: '1W', label: '1W' },
    { id: '1M', label: '1M' },
    { id: '1Y', label: '1Y' },
    { id: 'All', label: 'All' },
  ];
  const [activeTab, setActiveTab] = useState<TabValue | null>(tabs[0]);
  return <PeriodSelector activeTab={activeTab} onChange={(tab) => setActiveTab(tab)} tabs={tabs} />;
};

const MinWidthPeriodSelectorExample = () => {
  const tabs = [
    { id: '1H', label: '1H' },
    { id: '1D', label: '1D' },
    { id: '1W', label: '1W' },
    { id: '1M', label: '1M' },
    { id: '1Y', label: '1Y' },
    { id: 'All', label: 'All' },
  ];
  const [activeTab, setActiveTab] = useState<TabValue | null>(tabs[0]);
  return (
    <PeriodSelector
      activeTab={activeTab}
      gap={0.5}
      onChange={(tab) => setActiveTab(tab)}
      tabs={tabs}
      width="fit-content"
    />
  );
};

const LivePeriodSelectorExample = () => {
  const tabs = useMemo(
    () => [
      {
        id: '1H',
        label: <LiveTabLabel />,
      },
      { id: '1D', label: '1D' },
      { id: '1W', label: '1W' },
      { id: '1M', label: '1M' },
      { id: '1Y', label: '1Y' },
      { id: 'All', label: 'All' },
    ],
    [],
  );

  const [activeTab, setActiveTab] = useState<TabValue | null>(tabs[0]);
  const isLive = useMemo(() => activeTab?.id === '1H', [activeTab]);

  const activeBackground = useMemo(() => (!isLive ? 'bgPrimaryWash' : 'bgNegativeWash'), [isLive]);

  return (
    <PeriodSelector
      activeBackground={activeBackground}
      activeTab={activeTab}
      onChange={setActiveTab}
      tabs={tabs}
    />
  );
};

const TooManyPeriodsSelectorExample = () => {
  const theme = useTheme();
  const tabs = useMemo(
    () => [
      {
        id: '1H',
        label: <LiveTabLabel />,
      },
      { id: '1D', label: '1D' },
      { id: '1W', label: '1W' },
      { id: '1M', label: '1M' },
      { id: 'YTD', label: 'YTD' },
      { id: '1Y', label: '1Y' },
      { id: '5Y', label: '5Y' },
      { id: 'All', label: 'All' },
    ],
    [],
  );

  const [activeTab, setActiveTab] = useState<TabValue | null>(tabs[0]);
  const isLive = useMemo(() => activeTab?.id === '1H', [activeTab]);

  const activeBackground = useMemo(() => (!isLive ? 'bgPrimaryWash' : 'bgNegativeWash'), [isLive]);

  // todo: icon button cannot have a height lower than 40px - and our PeriodSelector is 36px
  // We can fix this by making IconButton more extensible
  return (
    <HStack alignItems="center" maxWidth="100%" width="100%">
      <ScrollView
        horizontal
        contentContainerStyle={{
          display: 'flex',
          flexDirection: 'row',
          paddingEnd: theme.space[2],
          justifyContent: 'center',
          alignItems: 'center',
        }}
        showsHorizontalScrollIndicator={false}
      >
        <PeriodSelector
          activeBackground={activeBackground}
          activeTab={activeTab}
          gap={1}
          justifyContent="flex-start"
          onChange={setActiveTab}
          tabs={tabs}
          width="fit-content"
        />
      </ScrollView>
      <IconButton
        compact
        accessibilityLabel="Configure chart"
        flexShrink={0}
        name="filter"
        variant="secondary"
      />
    </HStack>
  );
};

const btcColor = assets.btc.color;

const BTCActiveIndicator = memo((props: TabsActiveIndicatorProps) => (
  <PeriodSelectorActiveIndicator {...props} background={`${btcColor}1A` as any} />
));

const BTCActiveExcludingLiveIndicator = memo((props: TabsActiveIndicatorProps) => {
  const theme = useTheme();
  const { activeTab } = useTabsContext();
  const isLive = useMemo(() => activeTab?.id === '1H', [activeTab]);

  const backgroundColor = useMemo(
    () => (isLive ? theme.color.bgNegativeWash : `${btcColor}1A`),
    [isLive, theme.color.bgNegativeWash],
  );

  return <PeriodSelectorActiveIndicator {...props} background={backgroundColor as any} />;
});

const BTCTab: TabComponent = memo(
  forwardRef(({ label, ...props }: SegmentedTabProps, ref: React.ForwardedRef<any>) => {
    const { activeTab } = useTabsContext();
    const isActive = activeTab?.id === props.id;

    const textColor = isActive ? btcColor : undefined;

    return (
      <SegmentedTab
        ref={ref}
        label={
          typeof label === 'string' ? (
            <TextLabel1 style={{ color: textColor }}>{label}</TextLabel1>
          ) : (
            label
          )
        }
        {...props}
      />
    );
  }),
);

const ColoredPeriodSelectorExample = () => {
  const tabs = [
    {
      id: '1H',
      label: (
        <LiveTabLabel styles={{ text: { color: btcColor }, dot: { backgroundColor: btcColor } }} />
      ),
    },
    { id: '1D', label: '1D' },
    { id: '1W', label: '1W' },
    { id: '1M', label: '1M' },
    { id: '1Y', label: '1Y' },
    { id: 'All', label: 'All' },
  ];
  const [activeTab, setActiveTab] = useState<TabValue | null>(tabs[0]);

  return (
    <PeriodSelector
      TabComponent={BTCTab}
      TabsActiveIndicatorComponent={BTCActiveIndicator}
      activeTab={activeTab}
      onChange={(tab) => setActiveTab(tab)}
      tabs={tabs}
    />
  );
};

const ColoredExcludingLivePeriodSelectorExample = () => {
  const tabs = [
    { id: '1H', label: <LiveTabLabel /> },
    { id: '1D', label: '1D' },
    { id: '1W', label: '1W' },
    { id: '1M', label: '1M' },
    { id: '1Y', label: '1Y' },
    { id: 'All', label: 'All' },
  ];
  const [activeTab, setActiveTab] = useState<TabValue | null>(tabs[0]);

  return (
    <PeriodSelector
      TabComponent={BTCTab}
      TabsActiveIndicatorComponent={BTCActiveExcludingLiveIndicator}
      activeTab={activeTab}
      onChange={(tab) => setActiveTab(tab)}
      tabs={tabs}
    />
  );
};

const PeriodSelectorStories = () => {
  return (
    <ExampleScreen>
      <Example title="Basic Example">
        <PeriodSelectorExample />
      </Example>
      <Example title="Min Width Period Selector">
        <MinWidthPeriodSelectorExample />
      </Example>
      <Example title="Live Period Selector">
        <LivePeriodSelectorExample />
      </Example>
      <Example title="Period Selector with Overflow & Button">
        <TooManyPeriodsSelectorExample />
      </Example>
      <Example title="Colored Period Selector">
        <ColoredPeriodSelectorExample />
      </Example>
      <Example title="Colored Excluding Live Period Selector">
        <ColoredExcludingLivePeriodSelectorExample />
      </Example>
    </ExampleScreen>
  );
};

export default PeriodSelectorStories;

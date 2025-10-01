import React, { forwardRef, memo, useMemo } from 'react';
import { useTabsContext } from '@coinbase/cds-common/tabs/TabsContext';
import type { TabComponent, TabsActiveIndicatorProps } from '@coinbase/cds-mobile/tabs';
import { SegmentedTab, type SegmentedTabProps } from '@coinbase/cds-mobile/tabs/SegmentedTab';
import { Text } from '@coinbase/cds-mobile/typography/Text';

import {
  PeriodSelector,
  PeriodSelectorActiveIndicator,
  type PeriodSelectorProps,
} from '../../chart/PeriodSelector';

export type SparklineInteractivePeriodSelectorProps = Omit<PeriodSelectorProps, 'color'> & {
  /**
   * The color to use for the active tab and indicator.
   */
  color?: string;
};

/**
 * SparklineInteractivePeriodSelector is a specialized version of PeriodSelector
 * that supports custom color theming for the active state.
 */
export const SparklineInteractivePeriodSelector = memo(
  forwardRef(
    (
      { color, ...props }: SparklineInteractivePeriodSelectorProps,
      ref: React.ForwardedRef<any>,
    ) => {
      // Create custom active indicator with the provided color
      const CustomActiveIndicator = useMemo(() => {
        if (!color) return PeriodSelectorActiveIndicator;

        return memo(({ style, ...indicatorProps }: TabsActiveIndicatorProps) => (
          <PeriodSelectorActiveIndicator
            {...indicatorProps}
            style={[
              style,
              {
                backgroundColor: color,
                opacity: 0.2,
              },
            ]}
          />
        ));
      }, [color]);

      // Create custom tab component with the provided color for active state
      const CustomTab: TabComponent = useMemo(() => {
        if (!color) {
          // If no custom color, use default PeriodSelector tab behavior
          return memo(
            forwardRef((tabProps: SegmentedTabProps, tabRef: React.ForwardedRef<any>) => (
              <SegmentedTab ref={tabRef} activeColor="fgPrimary" font="label1" {...tabProps} />
            )),
          );
        }

        return memo(
          forwardRef(
            ({ label, style, ...tabProps }: SegmentedTabProps, tabRef: React.ForwardedRef<any>) => {
              const { activeTab } = useTabsContext();
              const isActive = activeTab?.id === tabProps.id;

              return (
                <SegmentedTab
                  ref={tabRef}
                  label={
                    <Text font="label1" style={{ color: isActive ? color : undefined }}>
                      {label}
                    </Text>
                  }
                  style={style}
                  {...tabProps}
                />
              );
            },
          ),
        );
      }, [color]);

      return (
        <PeriodSelector
          ref={ref}
          TabComponent={CustomTab}
          TabsActiveIndicatorComponent={CustomActiveIndicator}
          {...props}
        />
      );
    },
  ),
);

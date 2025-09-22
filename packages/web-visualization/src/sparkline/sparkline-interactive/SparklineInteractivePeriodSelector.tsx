import React, { forwardRef, memo, useMemo } from 'react';
import { useTabsContext } from '@coinbase/cds-common/tabs/TabsContext';
import type {
  SegmentedTabProps,
  TabComponent,
  TabsActiveIndicatorProps,
} from '@coinbase/cds-web/tabs';
import { SegmentedTab } from '@coinbase/cds-web/tabs';
import { TextLabel1 } from '@coinbase/cds-web/typography';

import {
  PeriodSelector,
  PeriodSelectorActiveIndicator,
  type PeriodSelectorProps,
} from '../../chart/PeriodSelector';

export type SparklineInteractivePeriodSelectorProps = PeriodSelectorProps & {
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
      ref: React.ForwardedRef<HTMLElement>,
    ) => {
      // Create custom active indicator with the provided color
      const CustomActiveIndicator = useMemo(() => {
        if (!color || color === 'auto') return PeriodSelectorActiveIndicator;

        return memo(({ style, ...indicatorProps }: TabsActiveIndicatorProps) => (
          <PeriodSelectorActiveIndicator
            {...indicatorProps}
            style={{
              ...style,
              backgroundColor: color,
              opacity: 0.2,
            }}
          />
        ));
      }, [color]);

      // Create custom tab component with the provided color for active state
      const CustomTab: TabComponent = useMemo(() => {
        if (!color || color === 'auto') {
          // If no custom color, use default PeriodSelector tab behavior
          return memo(
            forwardRef(
              (tabProps: SegmentedTabProps, tabRef: React.ForwardedRef<HTMLButtonElement>) => (
                <SegmentedTab ref={tabRef} activeColor="fgPrimary" font="label1" {...tabProps} />
              ),
            ),
          );
        }

        return memo(
          forwardRef(
            (
              { label, style, ...tabProps }: SegmentedTabProps,
              tabRef: React.ForwardedRef<HTMLButtonElement>,
            ) => {
              const { activeTab } = useTabsContext();
              const isActive = activeTab?.id === tabProps.id;

              return (
                <SegmentedTab
                  ref={tabRef}
                  label={
                    <TextLabel1
                      style={{
                        transition: 'color 0.2s ease',
                        color: isActive ? color : undefined,
                      }}
                    >
                      {label}
                    </TextLabel1>
                  }
                  style={{
                    ...style,
                    outlineColor: color,
                  }}
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

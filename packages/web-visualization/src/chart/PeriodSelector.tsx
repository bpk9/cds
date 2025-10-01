import React, { forwardRef, memo, useMemo } from 'react';
import { cx } from '@coinbase/cds-web';
import type { Polymorphic } from '@coinbase/cds-web/core/polymorphism';
import { Box } from '@coinbase/cds-web/layout';
import {
  SegmentedTabs,
  type SegmentedTabsProps,
  type TabComponent,
  type TabsActiveIndicatorProps,
  tabsTransitionConfig,
} from '@coinbase/cds-web/tabs';
import { SegmentedTab, type SegmentedTabProps } from '@coinbase/cds-web/tabs/SegmentedTab';
import { Text, type TextBaseProps } from '@coinbase/cds-web/typography';
import { css } from '@linaria/core';
import { m as motion } from 'framer-motion';

import { pulseTransitionConfig } from './point/Point';

const MotionBox = motion(Box);

// Animated active indicator to support smooth transition of background color
export const PeriodSelectorActiveIndicator = memo(
  ({
    activeTabRect,
    background = 'bgPrimaryWash',
    position = 'absolute',
    borderRadius = 1000,
    style,
  }: TabsActiveIndicatorProps) => {
    const { width, height, x } = activeTabRect;
    const activeAnimation = useMemo(() => ({ width, x }), [width, x]);

    if (!width) return null;

    // todo: see if we can match the transition length or something for this going forward
    return (
      <MotionBox
        animate={activeAnimation}
        borderRadius={borderRadius}
        data-testid="period-selector-active-indicator"
        height={height}
        initial={false}
        position={position}
        role="none"
        style={{
          backgroundColor: `var(--color-${background})`,
          transition: 'background-color 0.2s ease',
          ...style,
        }}
        transition={tabsTransitionConfig}
      />
    );
  },
);

export const liveTabLabelDefaultElement = 'span';

export type LiveTabLabelDefaultElement = typeof liveTabLabelDefaultElement;

export type LiveTabLabelBaseProps = TextBaseProps & {
  /**
   * The label to display.
   * @default 'LIVE'
   */
  label?: string;
  /**
   * Whether to hide the dot.
   */
  hideDot?: boolean;
  /**
   * Whether to disable the pulse animation.
   */
  disablePulse?: boolean;
  /**
   * Style overrides for different parts of the component
   */
  styles?: {
    /** Style for the dot */
    dot?: React.CSSProperties;
    /** Style for the text */
    text?: React.CSSProperties;
  };
  /**
   * ClassName overrides for different parts of the component
   */
  classNames?: {
    /** ClassName for the dot */
    dot?: string;
    /** ClassName for the text */
    text?: string;
  };
};

export type LiveTabLabelProps<AsComponent extends React.ElementType> = Polymorphic.Props<
  AsComponent,
  LiveTabLabelBaseProps
>;

// is this bad to use var(--space-1) for height and width?
const dotBaseCss = css`
  display: inline-flex;
  width: var(--space-1);
  height: var(--space-1);
  background: currentColor;
  border-radius: 1000px;
  margin-inline-end: var(--space-0_75);
`;

type LiveTabLabelComponent = (<AsComponent extends React.ElementType = LiveTabLabelDefaultElement>(
  props: LiveTabLabelProps<AsComponent>,
) => Polymorphic.ReactReturn) &
  Polymorphic.ReactNamed;

export const LiveTabLabel: LiveTabLabelComponent = memo(
  forwardRef<React.ReactElement<LiveTabLabelBaseProps>, LiveTabLabelBaseProps>(
    <AsComponent extends React.ElementType>(
      {
        as,
        color = 'fgNegative',
        label = 'LIVE',
        display = 'inline-flex',
        alignItems = 'center',
        font = 'label1',
        hideDot,
        disablePulse,
        styles,
        classNames,
        className,
        ...props
      }: LiveTabLabelProps<AsComponent>,
      ref?: Polymorphic.Ref<AsComponent>,
    ) => {
      const Component = (as ?? liveTabLabelDefaultElement) satisfies React.ElementType;

      const pulseAnimation = !disablePulse
        ? {
            opacity: [1, 0, 1],
            transition: pulseTransitionConfig,
          }
        : undefined;

      return (
        <Text
          ref={ref}
          alignItems={alignItems}
          as={Component}
          className={cx(className, classNames?.text)}
          color={color}
          display={display}
          font={font}
          style={styles?.text}
          {...props}
        >
          {!hideDot && (
            <motion.span
              animate={!disablePulse && pulseAnimation}
              className={cx(dotBaseCss, classNames?.dot)}
              initial={{ opacity: 1 }}
              style={styles?.dot}
            />
          )}
          {label}
        </Text>
      );
    },
  ),
);

// Custom tab component with primary color for active state
const PeriodSelectorTab: TabComponent = memo(
  forwardRef((props: SegmentedTabProps, ref: React.ForwardedRef<HTMLButtonElement>) => (
    <SegmentedTab ref={ref} activeColor="fgPrimary" font="label1" {...props} />
  )),
);

export type PeriodSelectorProps = SegmentedTabsProps;

/**
 * PeriodSelector is a specialized version of SegmentedTabs optimized for chart period selection.
 * It provides transparent background, primary wash active state, and full-width layout by default.
 */
export const PeriodSelector = memo(
  forwardRef(
    (
      {
        background = 'transparent',
        activeBackground = 'bgPrimaryWash',
        width = '100%',
        justifyContent = 'space-between',
        TabComponent = PeriodSelectorTab,
        TabsActiveIndicatorComponent = PeriodSelectorActiveIndicator,
        ...props
      }: PeriodSelectorProps,
      ref: React.ForwardedRef<HTMLElement>,
    ) => (
      <SegmentedTabs
        ref={ref}
        TabComponent={TabComponent}
        TabsActiveIndicatorComponent={TabsActiveIndicatorComponent}
        activeBackground={activeBackground}
        background={background}
        justifyContent={justifyContent}
        width={width}
        {...props}
      />
    ),
  ),
);

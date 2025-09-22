import { memo } from 'react';
import { HStack, VStack } from '@coinbase/cds-web/layout';
import { Text } from '@coinbase/cds-web/typography';

export type ChartHeaderProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  // todo: expose this as a type
  trendDirection?: 'up' | 'down' | 'neutral';
  trend?: React.ReactNode;
};

// todo: maybe drop this component since we have it in interactivescrubberheader?
export const ChartHeader = memo<ChartHeaderProps>(
  ({ title, description, trendDirection, trend }) => {
    const getTrendColor = () => {
      switch (trendDirection) {
        case 'up':
          return 'fgPositive';
        case 'down':
          return 'fgNegative';
        default:
          return 'fgMuted';
      }
    };

    const getTrendIcon = () => {
      switch (trendDirection) {
        case 'up':
          return '\u2197'; // ↗
        case 'down':
          return '\u2198'; // ↘
        default:
          return null;
      }
    };

    const renderTrend = () => {
      if (!trend) return null;

      const trendColor = getTrendColor();
      const trendIcon = getTrendIcon();

      return (
        <HStack alignItems="center" gap={0.5}>
          {trendIcon && (
            <Text aria-hidden="true" as="span" color={trendColor} font="title4">
              {trendIcon}
            </Text>
          )}
          {typeof trend === 'string' ? (
            <Text as="p" color={trendColor} font="title4">
              {trend}
            </Text>
          ) : (
            trend
          )}
        </HStack>
      );
    };

    return (
      <VStack gap={0.5}>
        {title && (
          <Text as="p" color="fgMuted" font="headline">
            {title}
          </Text>
        )}
        {description && (
          <Text as="p" font="display3">
            {description}
          </Text>
        )}
        {renderTrend()}
      </VStack>
    );
  },
);

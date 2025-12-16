import { forwardRef, memo, useCallback, useImperativeHandle, useMemo } from 'react';
import { useRefMap } from '@coinbase/cds-common/hooks/useRefMap';
import type { SharedProps } from '@coinbase/cds-common/types';

import { useCartesianChartContext } from '../ChartProvider';
import {
  type ChartScaleFunction,
  evaluateGradientAtValue,
  getGradientConfig,
  useHighlightContext,
} from '../utils';

import { DefaultScrubberBeacon } from './DefaultScrubberBeacon';
import type { ScrubberBeaconComponent, ScrubberBeaconProps, ScrubberBeaconRef } from './Scrubber';

// Helper component to calculate beacon data for a specific series
const BeaconWithData = memo<{
  seriesId: string;
  dataIndex: number;
  categoryValue: number;
  isIdle: boolean;
  BeaconComponent: ScrubberBeaconComponent;
  idlePulse?: boolean;
  transitions?: ScrubberBeaconProps['transitions'];
  className?: string;
  style?: React.CSSProperties;
  testID?: string;
  beaconRef: (ref: ScrubberBeaconRef | null) => void;
  orientation: 'horizontal' | 'vertical';
}>(
  ({
    seriesId,
    dataIndex,
    categoryValue,
    isIdle,
    BeaconComponent,
    idlePulse,
    transitions,
    className,
    style,
    testID,
    beaconRef,
    orientation,
  }) => {
    const { getSeries, getSeriesData, getXScale, getYScale } = useCartesianChartContext();

    const series = useMemo(() => getSeries(seriesId), [getSeries, seriesId]);
    const sourceData = useMemo(() => getSeriesData(seriesId), [getSeriesData, seriesId]);
    const gradient = series?.gradient;

    // Get the value from series data
    const dataValue = useMemo(() => {
      if (sourceData && dataIndex >= 0 && dataIndex < sourceData.length) {
        const value = sourceData[dataIndex];

        if (typeof value === 'number') {
          return value;
        } else if (Array.isArray(value)) {
          const validValues = value.filter((val): val is number => val !== null);
          if (validValues.length >= 1) {
            return validValues[validValues.length - 1];
          }
        }
      }
      return undefined;
    }, [sourceData, dataIndex]);

    // In horizontal orientation: dataX = category (index), dataY = value
    // In vertical orientation: dataX = value, dataY = category (index)
    const dataX = orientation === 'vertical' ? dataValue : categoryValue;
    const dataY = orientation === 'vertical' ? categoryValue : dataValue;

    // Evaluate gradient color
    const color = useMemo(() => {
      if (dataValue === undefined) return series?.color ?? 'var(--color-fgPrimary)';

      if (gradient) {
        const xScale = getXScale();
        const yScale = getYScale(series?.yAxisId);

        if (xScale && yScale) {
          const gradientScale = gradient.axis === 'x' ? xScale : yScale;
          const stops = getGradientConfig(gradient, xScale, yScale);

          if (stops) {
            const gradientAxis = gradient.axis ?? 'y';
            const gradientValue = gradientAxis === 'x' ? dataX : dataY;
            if (gradientValue !== undefined) {
              const evaluatedColor = evaluateGradientAtValue(
                stops,
                gradientValue,
                gradientScale as ChartScaleFunction,
              );
              if (evaluatedColor) {
                return evaluatedColor;
              }
            }
          }
        }
      }

      return series?.color ?? 'var(--color-fgPrimary)';
    }, [gradient, dataX, dataY, dataValue, series?.color, series?.yAxisId, getXScale, getYScale]);

    if (dataX === undefined || dataY === undefined) return null;

    return (
      <BeaconComponent
        ref={beaconRef}
        className={className}
        color={color}
        dataX={dataX}
        dataY={dataY}
        idlePulse={idlePulse}
        isIdle={isIdle}
        seriesId={seriesId}
        style={style}
        testID={testID}
        transitions={transitions}
      />
    );
  },
);

export type ScrubberBeaconGroupRef = {
  /**
   * Triggers a pulse animation on all beacons.
   */
  pulse: () => void;
};

export type ScrubberBeaconGroupBaseProps = SharedProps & {
  /**
   * Array of series IDs to render beacons for.
   */
  seriesIds: string[];
  /**
   * Pulse the beacons while at rest.
   */
  idlePulse?: boolean;
};

export type ScrubberBeaconGroupProps = ScrubberBeaconGroupBaseProps & {
  /**
   * Transition configuration for beacon animations.
   */
  transitions?: ScrubberBeaconProps['transitions'];
  /**
   * Custom component for the scrubber beacon.
   * @default DefaultScrubberBeacon
   */
  BeaconComponent?: ScrubberBeaconComponent;
  /**
   * Custom className for beacon styling.
   */
  className?: string;
  /**
   * Custom inline styles for beacons.
   */
  style?: React.CSSProperties;
};

export const ScrubberBeaconGroup = memo(
  forwardRef<ScrubberBeaconGroupRef, ScrubberBeaconGroupProps>(
    (
      {
        seriesIds,
        idlePulse,
        transitions,
        BeaconComponent = DefaultScrubberBeacon,
        className,
        style,
        testID,
      },
      ref,
    ) => {
      const ScrubberBeaconRefs = useRefMap<ScrubberBeaconRef>();
      const highlightContext = useHighlightContext();
      const scrubberPosition = highlightContext?.highlightedItem?.dataIndex;
      const { getXScale, getYScale, getXAxis, getYAxis, dataLength, series, orientation } =
        useCartesianChartContext();

      // Expose imperative handle with pulse method
      useImperativeHandle(ref, () => ({
        pulse: () => {
          Object.values(ScrubberBeaconRefs.refs).forEach((beaconRef) => {
            beaconRef?.pulse();
          });
        },
      }));

      const filteredSeries = useMemo(() => {
        return series?.filter((s) => seriesIds.includes(s.id)) ?? [];
      }, [series, seriesIds]);

      const { categoryValue, dataIndex } = useMemo(() => {
        // In horizontal orientation, category axis is X; in vertical, it's Y
        const categoryScale = orientation === 'vertical' ? getYScale() : getXScale();
        const categoryAxis = orientation === 'vertical' ? getYAxis() : getXAxis();

        if (!categoryScale) return { categoryValue: undefined, dataIndex: undefined };

        const dataIndex = scrubberPosition ?? Math.max(0, dataLength - 1);

        // Convert index to actual category value if axis has data
        let categoryValue: number;
        if (
          categoryAxis?.data &&
          Array.isArray(categoryAxis.data) &&
          categoryAxis.data[dataIndex] !== undefined
        ) {
          const dataValue = categoryAxis.data[dataIndex];
          categoryValue = typeof dataValue === 'string' ? dataIndex : dataValue;
        } else {
          categoryValue = dataIndex;
        }

        return { categoryValue, dataIndex };
      }, [getXScale, getYScale, getXAxis, getYAxis, scrubberPosition, dataLength, orientation]);

      const isIdle = scrubberPosition === undefined;

      const createBeaconRef = useCallback(
        (seriesId: string) => {
          return (beaconRef: ScrubberBeaconRef | null) => {
            if (beaconRef) {
              ScrubberBeaconRefs.registerRef(seriesId, beaconRef);
            }
          };
        },
        [ScrubberBeaconRefs],
      );

      if (categoryValue === undefined || dataIndex === undefined) return null;

      return filteredSeries.map((s) => (
        <BeaconWithData
          key={s.id}
          BeaconComponent={BeaconComponent}
          beaconRef={createBeaconRef(s.id)}
          categoryValue={categoryValue}
          className={className}
          dataIndex={dataIndex}
          idlePulse={idlePulse}
          isIdle={isIdle}
          orientation={orientation}
          seriesId={s.id}
          style={style}
          testID={testID ? `${testID ?? 'beacon'}-${s.id}` : undefined}
          transitions={transitions}
        />
      ));
    },
  ),
);

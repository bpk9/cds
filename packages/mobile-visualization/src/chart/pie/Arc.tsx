import React, { memo, useEffect, useMemo, useState } from 'react';
import { runOnJS, useAnimatedReaction, useSharedValue, withTiming } from 'react-native-reanimated';
import { Group, Path as SkiaPath, Skia } from '@shopify/react-native-skia';

import { usePolarChartContext } from '../ChartProvider';
import { defaultAxisId } from '../utils';
import { getArcPath } from '../utils/path';
import { degreesToRadians } from '../utils/polar';

export type ArcBaseProps = {
  /**
   * Start angle in radians.
   */
  startAngle: number;
  /**
   * End angle in radians.
   */
  endAngle: number;
  /**
   * Inner radius in pixels (0 for pie chart).
   */
  innerRadius: number;
  /**
   * Outer radius in pixels.
   */
  outerRadius: number;
  /**
   * Padding angle in radians between adjacent arcs.
   */
  paddingAngle?: number;
  /**
   * Fill color for the arc.
   */
  fill?: string;
  /**
   * Fill opacity.
   * @default 1
   */
  fillOpacity?: number;
  /**
   * Stroke color.
   */
  stroke?: string;
  /**
   * Stroke width in pixels.
   */
  strokeWidth?: number;
  /**
   * Corner radius in pixels.
   */
  cornerRadius?: number;
  /**
   * Clip path ID to apply to this arc.
   * Note: On mobile, this creates a Skia clip path.
   */
  clipPathId?: string;
  /**
   * ID of the angular axis to use for determining the animation baseline.
   * If not provided, uses the default angular axis.
   */
  angularAxisId?: string;
  /**
   * Whether to animate the arc. Overrides the chart-level animate setting.
   * If not provided, uses the chart context's animate value.
   */
  animate?: boolean;
};

export type ArcProps = ArcBaseProps;

/**
 * Renders an arc (slice) in a polar chart.
 * Used by PieChart and DonutChart components.
 */
export const Arc = memo<ArcProps>(
  ({
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    paddingAngle,
    fill,
    fillOpacity = 1,
    stroke,
    strokeWidth,
    cornerRadius,
    clipPathId,
    angularAxisId,
    animate: animateProp,
  }) => {
    const { animate: contextAnimate, drawingArea, getAngularAxis } = usePolarChartContext();
    const animate = animateProp !== undefined ? animateProp : contextAnimate;

    const baselineAngle = useMemo(() => {
      const angularAxis = getAngularAxis(angularAxisId ?? defaultAxisId);
      const startDegrees = angularAxis?.range?.min ?? 0;
      return degreesToRadians(startDegrees);
    }, [getAngularAxis, angularAxisId]);

    const { centerX, centerY } = useMemo(
      () => ({
        centerX: drawingArea.x + drawingArea.width / 2,
        centerY: drawingArea.y + drawingArea.height / 2,
      }),
      [drawingArea.x, drawingArea.y, drawingArea.width, drawingArea.height],
    );

    const animatedStartAngle = useSharedValue(baselineAngle);
    const animatedEndAngle = useSharedValue(baselineAngle);

    const [animatedSvgPath, setAnimatedSvgPath] = useState(() =>
      getArcPath({
        startAngle: baselineAngle,
        endAngle: baselineAngle,
        innerRadius,
        outerRadius,
        cornerRadius,
        paddingAngle,
      }),
    );

    // JS thread function to compute SVG path
    const updateSvgPath = (animStartAngle: number, animEndAngle: number) => {
      const svgPath = getArcPath({
        startAngle: animStartAngle,
        endAngle: animEndAngle,
        innerRadius,
        outerRadius,
        cornerRadius,
        paddingAngle,
      });
      setAnimatedSvgPath(svgPath);
    };

    // Watch angle changes and compute SVG path on JS thread
    useAnimatedReaction(
      () => ({
        start: animatedStartAngle.value,
        end: animatedEndAngle.value,
      }),
      (angles) => {
        // Call the function on JS thread
        runOnJS(updateSvgPath)(angles.start, angles.end);
      },
      [innerRadius, outerRadius, cornerRadius, paddingAngle],
    );

    // Convert SVG path string to Skia Path (can happen on UI thread)
    const animatedPath = useMemo(() => {
      return Skia.Path.MakeFromSVGString(animatedSvgPath) ?? Skia.Path.Make();
    }, [animatedSvgPath]);

    // Trigger animation when the component mounts or data changes
    useEffect(() => {
      if (animate) {
        animatedStartAngle.value = baselineAngle;
        animatedEndAngle.value = baselineAngle;
        animatedStartAngle.value = withTiming(startAngle, {
          duration: 1000,
        });
        animatedEndAngle.value = withTiming(endAngle, {
          duration: 1000,
        });
      } else {
        animatedStartAngle.value = startAngle;
        animatedEndAngle.value = endAngle;
      }
    }, [startAngle, endAngle, animate, animatedStartAngle, animatedEndAngle, baselineAngle]);

    // Static path for non-animated rendering
    const staticPath = useMemo(() => {
      const svgPath = getArcPath({
        startAngle,
        endAngle,
        innerRadius,
        outerRadius,
        cornerRadius,
        paddingAngle,
      });

      return Skia.Path.MakeFromSVGString(svgPath) ?? Skia.Path.Make();
    }, [startAngle, endAngle, innerRadius, outerRadius, cornerRadius, paddingAngle]);

    const clipSkiaPath = useMemo(() => {
      if (!clipPathId) return;
      return Skia.Path.MakeFromSVGString(clipPathId) ?? null;
    }, [clipPathId]);

    if (outerRadius <= 0) return;

    const path = animate ? animatedPath : staticPath;
    const isFilled = fill !== undefined && fill !== 'none';
    const isStroked = stroke !== undefined && stroke !== 'none';

    const content = (
      <>
        {isFilled && <SkiaPath color={fill} opacity={fillOpacity} path={path} style="fill" />}
        {isStroked && (
          <SkiaPath
            color={stroke}
            opacity={1}
            path={path}
            strokeWidth={strokeWidth}
            style="stroke"
          />
        )}
      </>
    );

    return (
      <Group
        clip={clipSkiaPath ?? undefined}
        transform={[{ translateX: centerX }, { translateY: centerY }]}
      >
        {content}
      </Group>
    );
  },
);

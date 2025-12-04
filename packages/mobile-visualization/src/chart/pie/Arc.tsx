import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  useSharedValue,
  useDerivedValue,
  withTiming,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { Group, Path as SkiaPath, Skia } from '@shopify/react-native-skia';

import { type ArcData, usePolarChartContext } from '../polar';
import { getArcPath } from '../utils/path';

export type ArcBaseProps = {
  /**
   * Arc data containing angles and radii.
   */
  arcData: ArcData;
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
   * @default 0
   */
  strokeWidth?: number;
  /**
   * Corner radius in pixels.
   * @default 0
   */
  cornerRadius?: number;
  /**
   * Clip path ID to apply to this arc.
   * Note: On mobile, this creates a Skia clip path.
   */
  clipPathId?: string;
  /**
   * Baseline angle for animation in radians.
   * Arcs will animate from this angle to their final position.
   * @default 0
   */
  baselineAngle?: number;
};

export type ArcProps = ArcBaseProps;

/**
 * Renders an arc (slice) in a polar chart.
 * Used by PieChart and DonutChart components.
 */
export const Arc = memo<ArcProps>(
  ({
    arcData,
    fill,
    fillOpacity = 1,
    stroke,
    strokeWidth = 0,
    cornerRadius = 0,
    clipPathId,
    baselineAngle = 0,
  }) => {
    const { animate, drawingArea } = usePolarChartContext();

    // Calculate center from drawing area
    const centerX = drawingArea.x + drawingArea.width / 2;
    const centerY = drawingArea.y + drawingArea.height / 2;

    // Animate both angles from the baseline angle to their respective positions
    // This creates a sweeping effect while ensuring segments positioned later stay ahead
    // and never get passed by earlier segments
    const animatedStartAngle = useSharedValue(baselineAngle);
    const animatedEndAngle = useSharedValue(baselineAngle);

    // Store the SVG path string (computed on JS thread)
    const [animatedSvgPath, setAnimatedSvgPath] = useState(() =>
      getArcPath({
        startAngle: baselineAngle,
        endAngle: baselineAngle,
        innerRadius: arcData.innerRadius,
        outerRadius: arcData.outerRadius,
        cornerRadius,
        padAngle: arcData.padAngle,
      }),
    );

    // JS thread function to compute SVG path
    const updateSvgPath = (startAngle: number, endAngle: number) => {
      const svgPath = getArcPath({
        startAngle,
        endAngle,
        innerRadius: arcData.innerRadius,
        outerRadius: arcData.outerRadius,
        cornerRadius,
        padAngle: arcData.padAngle,
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
      [arcData.innerRadius, arcData.outerRadius, cornerRadius, arcData.padAngle],
    );

    // Convert SVG path string to Skia Path (can happen on UI thread)
    const animatedPath = useMemo(() => {
      return Skia.Path.MakeFromSVGString(animatedSvgPath) ?? Skia.Path.Make();
    }, [animatedSvgPath]);

    // Trigger animation when the component mounts or data changes
    useEffect(() => {
      if (animate) {
        animatedStartAngle.value = withTiming(arcData.startAngle, {
          duration: 1000,
        });
        animatedEndAngle.value = withTiming(arcData.endAngle, {
          duration: 1000,
        });
      } else {
        animatedStartAngle.value = arcData.startAngle;
        animatedEndAngle.value = arcData.endAngle;
      }
    }, [
      arcData.startAngle,
      arcData.endAngle,
      arcData.index,
      animate,
      animatedStartAngle,
      animatedEndAngle,
    ]);

    // Static path for non-animated rendering
    const staticPath = useMemo(() => {
      const svgPath = getArcPath({
        startAngle: arcData.startAngle,
        endAngle: arcData.endAngle,
        innerRadius: arcData.innerRadius,
        outerRadius: arcData.outerRadius,
        cornerRadius,
        padAngle: arcData.padAngle,
      });

      return Skia.Path.MakeFromSVGString(svgPath) ?? Skia.Path.Make();
    }, [
      arcData.startAngle,
      arcData.endAngle,
      arcData.innerRadius,
      arcData.outerRadius,
      cornerRadius,
      arcData.padAngle,
    ]);

    // Convert clipPathId (SVG path string) to Skia Path if provided
    // This must be before the early return to maintain consistent hook ordering
    const clipSkiaPath = useMemo(() => {
      if (!clipPathId) return null;
      return Skia.Path.MakeFromSVGString(clipPathId) ?? null;
    }, [clipPathId]);

    // Don't render if we don't have valid dimensions
    if (arcData.outerRadius <= 0) return null;

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

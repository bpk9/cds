import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import Reanimated, {
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  ClipPath,
  Defs,
  G,
  Path as SvgPath,
  type PathProps as SvgPathProps,
  Rect,
  type RectProps,
} from 'react-native-svg';
import { usePreviousValue } from '@coinbase/cds-common/hooks/usePreviousValue';
import type { Rect as RectType, SharedProps } from '@coinbase/cds-common/types';
import * as interpolate from 'd3-interpolate-path';

import { useCartesianChartContext } from './ChartProvider';

const AnimatedRect = Reanimated.createAnimatedComponent(Rect);

const AnimatedSvgRect = memo(({ width, rectProps }: { width: number; rectProps: RectProps }) => {
  const animatedWidth = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => {
    return {
      width: animatedWidth.value,
    };
  });

  useEffect(() => {
    animatedWidth.value = withTiming(width + 4, {
      duration: 1000,
    });
  }, [animatedWidth, width]);

  return <AnimatedRect animatedProps={animatedProps} {...rectProps} />;
});

export type PathProps = SharedProps &
  SvgPathProps & {
    /**
     * The SVG path data string
     */
    d?: string;
    /**
     * Path fill color
     */
    fill?: string;
    /**
     * Path stroke color
     */
    stroke?: string;
    /**
     * Path stroke width
     */
    strokeWidth?: number;
    /**
     * Path stroke opacity
     */
    strokeOpacity?: number;
    /**
     * Path fill opacity
     */
    fillOpacity?: number;
    /**
     * Custom clip path rect. If provided, this overrides the default chart rect for clipping.
     */
    clipRect?: RectType;
    /**
     * Stroke dash array for dashed lines
     */
    strokeDasharray?: string;
    /**
     * Whether to animate the path.
     * Overrides the animate prop on the Chart component.
     */
    animate?: boolean;
  };

export const Path = memo<PathProps>(
  ({
    clipRect,
    d = '',
    fill,
    stroke,
    strokeWidth,
    strokeOpacity,
    fillOpacity,
    strokeDasharray,
    testID,
    animate: animateProp,
    ...pathProps
  }) => {
    const pathRef = useRef<SvgPath | null>(null);
    const { animate: animateContext, drawingArea: contextRect } = useCartesianChartContext();
    const rect = clipRect ?? contextRect;
    const animate = animateProp ?? animateContext;

    const clipPathId = useMemo(() => `clip-path-${Math.random().toString(36).substr(2, 9)}`, []);

    const animationProgress = useSharedValue(0);

    const targetPath = useMemo(() => d, [d]);
    const previousPath = usePreviousValue(targetPath);

    const fromPath = useMemo(() => {
      if (!animate) return targetPath;
      return previousPath || '';
    }, [animate, previousPath, targetPath]);

    const pathInterpolator = useMemo(
      () => interpolate.interpolatePath(fromPath, targetPath),
      [fromPath, targetPath],
    );

    const updatePath = useCallback(
      (progress: number) => {
        if (!pathInterpolator) return;
        const val = Number(progress.toFixed(4));
        pathRef.current?.setNativeProps({
          d: pathInterpolator(val),
        });
      },
      [pathInterpolator],
    );

    useAnimatedReaction(
      () => animationProgress.value,
      (progress) => {
        'worklet';
        runOnJS(updatePath)(progress);
      },
      [updatePath],
    );

    useEffect(() => {
      if (!pathRef.current) return;

      if (!animate || !pathInterpolator) {
        pathRef.current.setNativeProps({
          d: targetPath,
        });
        animationProgress.value = 1;
        return;
      }

      animationProgress.value = 0;
      animationProgress.value = withTiming(1, {
        duration: 300,
      });
    }, [animate, animationProgress, targetPath, pathInterpolator]);

    if (!d || !rect) {
      return null;
    }

    return (
      <G>
        <Defs>
          {animate && (
            <ClipPath id={clipPathId}>
              <AnimatedSvgRect
                rectProps={{ height: rect.height, x: rect.x, y: rect.y }}
                width={rect.width}
              />
            </ClipPath>
          )}
        </Defs>
        <SvgPath
          ref={pathRef}
          clipPath={`url(#${clipPathId})`}
          clipRule="nonzero"
          d={fromPath}
          fill={fill}
          fillOpacity={fillOpacity}
          stroke={stroke}
          strokeDasharray={strokeDasharray}
          strokeOpacity={strokeOpacity}
          strokeWidth={strokeWidth}
          testID={testID}
          {...pathProps}
        />
      </G>
    );
  },
);

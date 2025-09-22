import 'd3-transition';

import React, { memo, useCallback, useEffect, useRef } from 'react';
import type { SVGProps } from 'react';
import { useValueChanges } from '@coinbase/cds-common/hooks/useValueChanges';
import type { Rect, SharedProps } from '@coinbase/cds-common/types';
import { generateRandomId } from '@coinbase/cds-utils';
import { interpolatePath } from 'd3-interpolate-path';
import { select } from 'd3-selection';
import { m } from 'framer-motion';

import { useChartContext } from './ChartContext';

export type PathProps = SharedProps &
  Omit<
    SVGProps<SVGPathElement>,
    | 'onAnimationStart'
    | 'onAnimationEnd'
    | 'onAnimationIteration'
    | 'onAnimationStartCapture'
    | 'onAnimationEndCapture'
    | 'onAnimationIterationCapture'
    | 'onDrag'
    | 'onDragEnd'
    | 'onDragStart'
    | 'onDragCapture'
    | 'onDragEndCapture'
    | 'onDragStartCapture'
  > & {
    /**
     * Whether to disable animations for this path.
     */
    disableAnimations?: boolean;
    /**
     * Custom clip path rect. If provided, this overrides the default chart rect for clipping.
     */
    clipRect?: Rect;
  };

export const Path = memo<PathProps>(({ disableAnimations, clipRect, d = '', ...pathProps }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const clipPathIdRef = useRef<string>(generateRandomId());
  const { rect: contextRect } = useChartContext();
  const rect = clipRect ?? contextRect;

  // todo: do we need useValueChanges?
  const {
    previousValue: previousPath,
    newValue: newPath,
    hasChanged,
    addPreviousValue,
  } = useValueChanges(d);

  const morphPath = useCallback(() => {
    if (!pathRef.current || !newPath || !previousPath) return;

    select(pathRef.current)
      .transition()
      .duration(300)
      .attrTween('d', function tween() {
        return interpolatePath(previousPath as string, newPath as string);
      });
  }, [previousPath, newPath]);

  useEffect(() => {
    addPreviousValue(newPath);

    if (!disableAnimations && hasChanged && previousPath) {
      morphPath();
    }
  }, [addPreviousValue, newPath, disableAnimations, hasChanged, previousPath, morphPath]);

  // Brought the extra padding (2px per side, 4px total) from getSparklinePath
  // We will need to decide how to best handle it but this prevents the path from being cut off
  // todo: bring this same logic to the overlay for scrubber line which de-emphasizes path to the
  // right of the currently viewed spot

  return (
    <>
      <defs>
        <clipPath id={clipPathIdRef.current}>
          {disableAnimations ? (
            <rect height={rect.height + 4} width={rect.width + 4} x={rect.x - 2} y={rect.y - 2} />
          ) : (
            <m.rect
              animate="visible"
              height={rect.height + 4}
              initial="hidden"
              variants={{
                hidden: { width: 0 },
                visible: {
                  width: rect.width + 4,
                  transition: { type: 'spring', duration: 1, bounce: 0 },
                },
              }}
              x={rect.x - 2}
              y={rect.y - 2}
            />
          )}
        </clipPath>
      </defs>
      <path ref={pathRef} clipPath={`url(#${clipPathIdRef.current})`} d={d} {...pathProps} />
    </>
  );
});

import { memo, type SVGProps } from 'react';
import type { SharedProps } from '@coinbase/cds-common/types';

import { useChartContext } from '../ChartContext';
import { Path, type PathProps } from '../Path';

// todo: reuse shared props
export type SolidLineProps = SharedProps &
  Omit<PathProps, 'fill'> & {
    fill?: SVGProps<SVGPathElement>['fill'];
  };

/**
 * A customizable solid line component which uses path element.
 */
export const SolidLine = memo<SolidLineProps>(
  ({
    fill = 'none',
    stroke = 'var(--color-bgLine)',
    strokeLinecap = 'round',
    strokeLinejoin = 'round',
    strokeOpacity = 1,
    strokeWidth = 2,
    disableAnimations,
    ...props
  }) => {
    const context = useChartContext();

    return (
      <Path
        disableAnimations={
          disableAnimations !== undefined ? disableAnimations : context.disableAnimations
        }
        fill={fill}
        stroke={stroke}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth}
        {...props}
      />
    );
  },
);

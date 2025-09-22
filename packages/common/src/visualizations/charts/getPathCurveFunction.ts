import {
  curveBumpX,
  curveCatmullRom,
  curveLinear,
  curveLinearClosed,
  curveMonotoneX,
  curveNatural,
  curveStep,
  curveStepAfter,
  curveStepBefore,
} from 'd3-shape';

// todo: see if we can support basis, basisClosed, and basisOpen

export type ChartPathCurveType =
  | 'bump'
  | 'catmullRom'
  | 'linear'
  | 'linearClosed'
  | 'monotone'
  | 'natural'
  | 'step'
  | 'stepBefore'
  | 'stepAfter';

/**
 * Get the d3 curve function for a path.
 * See https://d3js.org/d3-shape/curve
 * @param curve - The curve type. Defaults to 'linear'.
 * @returns The d3 curve function.
 */
export const getPathCurveFunction = (curve: ChartPathCurveType = 'linear') => {
  switch (curve) {
    case 'catmullRom':
      return curveCatmullRom;
    case 'monotone': // todo: when we support layout="vertical" this should dynamically switch to curveMonotoneY
      return curveMonotoneX;
    case 'natural':
      return curveNatural;
    case 'step':
      return curveStep;
    case 'stepBefore':
      return curveStepBefore;
    case 'stepAfter':
      return curveStepAfter;
    case 'bump': // todo: when we support layout="vertical" this should dynamically switch to curveBumpY
      return curveBumpX;
    case 'linearClosed':
      return curveLinearClosed;
    case 'linear':
    default:
      return curveLinear;
  }
};

import { createContext, useContext } from 'react';
import type { Rect } from '@coinbase/cds-common/types';

export type RegisteredAxis = {
  id: string;
  type: 'x' | 'y';
  position: 'start' | 'end';
  size: number;
};

export type ChartDrawingAreaContextValue = {
  registerAxis: (id: string, type: 'x' | 'y', position: 'start' | 'end', size: number) => void;
  unregisterAxis: (id: string) => void;
  getAxisBounds: (id: string) => Rect | undefined;
};

export const ChartDrawingAreaContext = createContext<ChartDrawingAreaContextValue | undefined>(
  undefined,
);

export const useChartDrawingAreaContext = (): ChartDrawingAreaContextValue => {
  const context = useContext(ChartDrawingAreaContext);
  if (!context) {
    throw new Error('useChartDrawingAreaContext must be used within a Chart component');
  }
  return context;
};

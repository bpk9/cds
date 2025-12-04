import { useContext } from 'react';

import { CartesianChartContext, type CartesianChartContextValue } from './utils';

export const useCartesianChartContext = (): CartesianChartContextValue => {
  const context = useContext(CartesianChartContext);
  if (!context) {
    throw new Error(
      'useCartesianChartContext must be used within a CartesianChart component. See http://cds.coinbase.com/components/graphs/CartesianChart.',
    );
  }
  return context;
};

export const CartesianChartProvider = CartesianChartContext.Provider;

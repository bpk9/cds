export type ChartPadding = {
  top: number;
  left: number;
  bottom: number;
  right: number;
};

export const defaultChartPadding: ChartPadding = {
  top: 32,
  left: 8,
  bottom: 8,
  right: 8,
};

/**
 * Normalize padding to include all sides with a value.
 * @param padding - The padding to get.
 * @param defaults - Optional complete default values to use instead of 0.
 * @returns The calculated padding.
 */
export const getPadding = (
  padding?: number | Partial<ChartPadding>,
  defaults?: ChartPadding,
): ChartPadding => {
  const baseDefaults = defaults ?? {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  };

  if (typeof padding === 'number') {
    return {
      top: padding,
      left: padding,
      bottom: padding,
      right: padding,
    };
  }

  return {
    top: padding?.top ?? baseDefaults.top,
    left: padding?.left ?? baseDefaults.left,
    bottom: padding?.bottom ?? baseDefaults.bottom,
    right: padding?.right ?? baseDefaults.right,
  };
};

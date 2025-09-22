/**
 * Generates an SVG path string for a bar (rectangle) shape.
 *
 * @example
 * ```typescript
 * const barPath = getBarPath({
 *   x: 10,
 *   y: 20,
 *   width: 50,
 *   height: 100
 * ```
 */
export const getBarPath = ({
  x,
  y,
  width,
  height,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
}): string => {
  return `M${x},${y} L${x + width},${y} L${x + width},${y + height} L${x},${y + height} Z`;
};

/**
 * Creates an SVG path string for a rectangle with selective corner rounding.
 * Useful for creating rounded bars in charts.
 *
 * @example
 * ```typescript
 * const roundedPath = createRoundedRectPath(10, 20, 50, 100, 8, true, false);
 * ```
 */
export const createRoundedRectPath = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  roundTop: boolean,
  roundBottom: boolean,
): string => {
  const roundBothSides = roundTop && roundBottom;
  const r = Math.min(radius, width / 2, roundBothSides ? height / 2 : height);
  const topR = roundTop ? r : 0;
  const bottomR = roundBottom ? r : 0;

  // Build path with selective rounding
  let path = `M ${x + (roundTop ? r : 0)} ${y}`;
  path += ` L ${x + width - topR} ${y}`;

  path += ` A ${topR} ${topR} 0 0 1 ${x + width} ${y + topR}`;

  path += ` L ${x + width} ${y + height - bottomR}`;

  path += ` A ${bottomR} ${bottomR} 0 0 1 ${x + width - bottomR} ${y + height}`;

  path += ` L ${x + bottomR} ${y + height}`;

  path += ` A ${bottomR} ${bottomR} 0 0 1 ${x} ${y + height - bottomR}`;

  path += ` L ${x} ${y + topR}`;

  path += ` A ${topR} ${topR} 0 0 1 ${x + topR} ${y}`;

  path += ' Z';
  return path;
};

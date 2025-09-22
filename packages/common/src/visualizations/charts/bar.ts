export function getBarSizeAdjustment(barCount: number, gapSize: number): number {
  if (barCount <= 1) {
    return 0;
  }

  return (gapSize * (barCount - 1)) / barCount;
}

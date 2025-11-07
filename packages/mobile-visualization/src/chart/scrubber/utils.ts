import type { Rect } from '@coinbase/cds-common/types';

type LabelDimension = {
  id: string;
  width: number;
  height: number;
  preferredX: number;
  preferredY: number;
};

type LabelAdjustment = {
  x: number;
  y: number;
  side: 'left' | 'right';
};

/**
 * Determines the optimal side (left/right) and shared X position for label positioning.
 */
export function calculateLabelXPositioning(
  dimensions: LabelDimension[],
  drawingArea: Rect,
  labelHorizontalInset: number = 4,
): { side: 'left' | 'right'; sharedX: number } {
  'worklet';

  if (dimensions.length === 0) {
    return { side: 'right', sharedX: 0 };
  }

  // Calculate shared pixel X from the first label's preferredX
  const sharedX = dimensions[0].preferredX;

  const anchorRadius = 10; // Same as used in ScrubberBeaconLabel
  const bufferPx = 5; // Small buffer to prevent premature switching

  // Safety check for valid bounds
  if (drawingArea.width <= 0 || drawingArea.height <= 0) {
    return { side: 'right', sharedX }; // Default to right if bounds are invalid
  }

  // Check if labels would overflow when positioned on the right side
  const wouldOverflow = dimensions.some((dim) => {
    const labelRightEdge = sharedX + anchorRadius + labelHorizontalInset + dim.width + bufferPx;
    return labelRightEdge > drawingArea.x + drawingArea.width;
  });

  return { side: wouldOverflow ? 'left' : 'right', sharedX };
}

type LabelWithPosition = {
  id: string;
  preferredY: number;
  boundedY: number;
  finalY: number;
};

/**
 * Finds groups of labels that would overlap with the given spacing requirements.
 */
function findOverlappingGroups(
  labels: LabelWithPosition[],
  labelHeight: number,
  minGap: number,
): LabelWithPosition[][] {
  'worklet';

  const groups: LabelWithPosition[][] = [];
  const visited = new Set<string>();
  const requiredSpace = labelHeight + minGap;

  for (const label of labels) {
    if (visited.has(label.id)) continue;

    const group = [label];
    visited.add(label.id);

    // Find all labels that would overlap with this one
    for (const other of labels) {
      if (visited.has(other.id)) continue;

      // Check if labels would overlap or be too close
      const distance = Math.abs(other.boundedY - label.boundedY);
      if (distance < requiredSpace) {
        group.push(other);
        visited.add(other.id);
      }
    }

    groups.push(group);
  }

  return groups;
}

/**
 * Redistributes labels in a group to avoid overlaps while maintaining relative order.
 */
function redistributeGroup(
  group: LabelWithPosition[],
  drawingArea: Rect,
  labelHeight: number,
  minGap: number,
): void {
  'worklet';

  if (group.length === 1) {
    // Single label - just ensure it's within bounds
    const label = group[0];
    const minY = drawingArea.y + labelHeight / 2;
    const maxY = drawingArea.y + drawingArea.height - labelHeight / 2;
    label.finalY = Math.max(minY, Math.min(maxY, label.boundedY));
    return;
  }

  // Sort group by original preferred Y to maintain relative order
  group.sort((a, b) => a.preferredY - b.preferredY);

  // Calculate total space needed
  const totalLabelSpace = group.length * labelHeight;
  const totalGapSpace = (group.length - 1) * minGap;
  const totalNeeded = totalLabelSpace + totalGapSpace;

  if (totalNeeded > drawingArea.height) {
    // Not enough space - compress gaps if necessary
    const availableGapSpace = drawingArea.height - totalLabelSpace;
    const compressedGap = Math.max(1, availableGapSpace / Math.max(1, group.length - 1));

    let currentY = drawingArea.y + labelHeight / 2;
    for (const label of group) {
      label.finalY = currentY;
      currentY += labelHeight + compressedGap;
    }
  } else {
    // Enough space - center the group around the average preferred position
    const groupCenter = group.reduce((sum, l) => sum + l.preferredY, 0) / group.length;
    const groupTop = groupCenter - totalNeeded / 2;

    // Ensure group fits within bounds
    const minGroupTop = drawingArea.y + labelHeight / 2;
    const maxGroupTop = drawingArea.y + drawingArea.height - totalNeeded + labelHeight / 2;
    const clampedTop = Math.max(minGroupTop, Math.min(maxGroupTop, groupTop));

    // Distribute labels evenly within the group
    let currentY = clampedTop;
    for (const label of group) {
      label.finalY = currentY;
      currentY += labelHeight + minGap;
    }
  }
}

/**
 * Calculates Y positions for all labels avoiding overlaps while maintaining order.
 */
export function calculateLabelYPositions(
  dimensions: LabelDimension[],
  drawingArea: Rect,
  labelHeight: number,
  minGap: number = 2,
): Map<string, number> {
  'worklet';

  if (dimensions.length === 0) {
    return new Map();
  }

  // Step 1: Sort by preferred Y values and create working labels
  const sortedLabels: LabelWithPosition[] = [...dimensions]
    .sort((a, b) => a.preferredY - b.preferredY)
    .map((dim) => ({
      id: dim.id,
      preferredY: dim.preferredY,
      boundedY: dim.preferredY,
      finalY: dim.preferredY,
    }));

  // Step 2: Initial bounds fitting
  const minY = drawingArea.y + labelHeight / 2;
  const maxY = drawingArea.y + drawingArea.height - labelHeight / 2;

  for (const label of sortedLabels) {
    // Clamp to bounds while preserving relative order
    label.boundedY = Math.max(minY, Math.min(maxY, label.preferredY));
  }

  // Step 3: Find overlapping groups and redistribute
  const overlappingGroups = findOverlappingGroups(sortedLabels, labelHeight, minGap);

  for (const group of overlappingGroups) {
    redistributeGroup(group, drawingArea, labelHeight, minGap);
  }

  // Return final positions
  const result = new Map<string, number>();
  for (const label of sortedLabels) {
    result.set(label.id, label.finalY);
  }

  return result;
}

/**
 * Main function that orchestrates the complete label positioning algorithm.
 * Uses the new simplified approach with separate X and Y positioning.
 */
export function calculateLabelPositions(
  dimensions: LabelDimension[],
  drawingArea: Rect,
  minGap: number = 2,
  labelHorizontalInset: number = 4,
  labelHeight: number = 21, // Standard label height
): { strategy: 'left' | 'right'; adjustments: Map<string, LabelAdjustment> } {
  'worklet';

  if (dimensions.length === 0) {
    return { strategy: 'right', adjustments: new Map() };
  }

  // Step 1: Calculate X positioning and side strategy
  const { side, sharedX } = calculateLabelXPositioning(
    dimensions,
    drawingArea,
    labelHorizontalInset,
  );

  // Step 2: Calculate Y positions with overlap resolution
  const yPositions = calculateLabelYPositions(dimensions, drawingArea, labelHeight, minGap);

  // Step 3: Combine into final adjustments map
  const adjustments = new Map<string, LabelAdjustment>();

  for (const dimension of dimensions) {
    const finalY = yPositions.get(dimension.id) ?? dimension.preferredY;

    adjustments.set(dimension.id, {
      x: sharedX,
      y: finalY,
      side,
    });
  }

  return { strategy: side, adjustments };
}

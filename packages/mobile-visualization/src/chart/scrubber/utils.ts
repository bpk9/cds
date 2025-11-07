type LabelDimension = {
  id: string;
  width: number;
  height: number;
  preferredX: number;
  preferredY: number;
};

type DrawingArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type LabelAdjustment = {
  x: number;
  y: number;
  side: 'left' | 'right';
};

/**
 * Performs iterative collision detection between labels to resolve overlaps.
 * This is the core algorithm from the web version.
 */
export function resolveCollisions(
  dimensions: LabelDimension[],
  minGap: number,
  maxIterations = 10,
): Map<string, LabelAdjustment> {
  'worklet';
  const adjustments = new Map<string, LabelAdjustment>();

  // Sort by Y position to handle overlaps systematically
  const sortedDimensions = [...dimensions].sort((a, b) => a.preferredY - b.preferredY);

  // Initialize all labels at their preferred positions (default to right side for now)
  for (const dim of sortedDimensions) {
    adjustments.set(dim.id, {
      x: dim.preferredX,
      y: dim.preferredY,
      side: 'right',
    });
  }

  // Iterative collision resolution
  let iteration = 0;
  while (iteration < maxIterations) {
    let hasCollisions = false;
    iteration++;

    // Sort by current Y position for systematic collision resolution
    const currentPositions = sortedDimensions
      .map((dim) => ({
        ...dim,
        currentY: adjustments.get(dim.id)!.y,
      }))
      .sort((a, b) => a.currentY - b.currentY);

    // Check adjacent labels for overlaps
    for (let i = 0; i < currentPositions.length - 1; i++) {
      const current = currentPositions[i];
      const next = currentPositions[i + 1];

      const currentAdjustment = adjustments.get(current.id)!;
      const nextAdjustment = adjustments.get(next.id)!;

      // Calculate required separation
      const requiredSeparation = current.height / 2 + next.height / 2 + minGap;
      const currentSeparation = nextAdjustment.y - currentAdjustment.y;

      if (currentSeparation < requiredSeparation) {
        hasCollisions = true;
        const deficit = requiredSeparation - currentSeparation;

        // Move labels apart - split the adjustment
        const offsetPerLabel = deficit / 2;

        adjustments.set(current.id, {
          ...currentAdjustment,
          y: currentAdjustment.y - offsetPerLabel,
        });
        adjustments.set(next.id, {
          ...nextAdjustment,
          y: nextAdjustment.y + offsetPerLabel,
        });
      }
    }

    if (!hasCollisions) {
      break;
    }
  }

  return adjustments;
}

/**
 * Finds groups of labels that are close together or overlapping.
 * This prevents distant labels from being unnecessarily shifted.
 */
export function findConnectedGroups(
  dimensions: LabelDimension[],
  adjustments: Map<string, LabelAdjustment>,
  minGap: number,
): string[][] {
  'worklet';
  const labelIds = Array.from(adjustments.keys());
  const groups: string[][] = [];
  const visited = new Set<string>();

  for (const id of labelIds) {
    if (visited.has(id)) continue;

    const group: string[] = [id];
    visited.add(id);
    const queue = [id];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const currentAdjustment = adjustments.get(currentId)!;
      const currentDim = dimensions.find((d) => d.id === currentId)!;

      // Check if this label overlaps or is close to any other unvisited label
      for (const otherId of labelIds) {
        if (visited.has(otherId)) continue;

        const otherAdjustment = adjustments.get(otherId)!;
        const otherDim = dimensions.find((d) => d.id === otherId)!;

        // Calculate distance between labels
        const distance = Math.abs(currentAdjustment.y - otherAdjustment.y);
        const minDistance = (currentDim.height + otherDim.height) / 2 + minGap * 2;

        // Labels are considered connected if they're close enough to potentially overlap
        if (distance <= minDistance) {
          visited.add(otherId);
          group.push(otherId);
          queue.push(otherId);
        }
      }
    }

    groups.push(group);
  }

  return groups;
}

/**
 * Ensures label groups fit within the drawing area bounds.
 * Applies repositioning strategies for groups that overflow.
 */
export function applyBoundsChecking(
  dimensions: LabelDimension[],
  adjustments: Map<string, LabelAdjustment>,
  connectedGroups: string[][],
  drawingArea: DrawingArea,
  minGap: number,
): void {
  'worklet';
  // Process each connected group independently
  for (const groupIds of connectedGroups) {
    // Check if any labels in this group are outside bounds
    const groupOutOfBounds = groupIds.some((id) => {
      const adjustment = adjustments.get(id)!;
      const dim = dimensions.find((d) => d.id === id)!;
      const labelTop = adjustment.y - dim.height / 2;
      const labelBottom = adjustment.y + dim.height / 2;
      return labelTop < drawingArea.y || labelBottom > drawingArea.y + drawingArea.height;
    });

    if (groupOutOfBounds) {
      // Get labels in this group sorted by their preferred Y position
      const groupLabels = groupIds
        .map((id) => ({
          id,
          dim: dimensions.find((d) => d.id === id)!,
          preferredY: dimensions.find((d) => d.id === id)!.preferredY,
          currentY: adjustments.get(id)!.y,
        }))
        .sort((a, b) => a.preferredY - b.preferredY);

      // Calculate total height needed for this group
      const totalLabelHeight = groupLabels.reduce((sum, label) => sum + label.dim.height, 0);
      const totalGaps = (groupLabels.length - 1) * minGap;
      const totalNeeded = totalLabelHeight + totalGaps;

      if (totalNeeded > drawingArea.height) {
        // Not enough space - use compressed equal spacing as fallback
        const compressedGap = Math.max(
          2,
          (drawingArea.height - totalLabelHeight) / Math.max(1, groupLabels.length - 1),
        );
        let currentY = drawingArea.y + groupLabels[0].dim.height / 2;

        for (const label of groupLabels) {
          adjustments.set(label.id, {
            ...adjustments.get(label.id)!,
            y: currentY,
          });

          currentY += label.dim.height + compressedGap;
        }
      } else {
        // Enough space - use minimal displacement algorithm for this group
        const finalPositions = [...groupLabels];

        // Ensure minimum spacing between adjacent labels in this group
        for (let i = 1; i < finalPositions.length; i++) {
          const prev = finalPositions[i - 1];
          const current = finalPositions[i];

          // Calculate minimum Y position for current label
          const minCurrentY =
            prev.preferredY + prev.dim.height / 2 + minGap + current.dim.height / 2;

          if (current.preferredY < minCurrentY) {
            // Need to push this label down
            current.preferredY = minCurrentY;
          }
        }

        // Check if this specific group fits within bounds, if not shift only this group
        const groupTop = finalPositions[0].preferredY - finalPositions[0].dim.height / 2;
        const groupBottom =
          finalPositions[finalPositions.length - 1].preferredY +
          finalPositions[finalPositions.length - 1].dim.height / 2;

        let shiftAmount = 0;

        if (groupTop < drawingArea.y) {
          // Group is too high, shift down
          shiftAmount = drawingArea.y - groupTop;
        } else if (groupBottom > drawingArea.y + drawingArea.height) {
          // Group is too low, shift up
          shiftAmount = drawingArea.y + drawingArea.height - groupBottom;
        }

        // Apply final positions with shift only to this group
        for (const label of finalPositions) {
          const finalY = label.preferredY + shiftAmount;

          // Final bounds check for individual labels
          const clampedY = Math.max(
            drawingArea.y + label.dim.height / 2,
            Math.min(drawingArea.y + drawingArea.height - label.dim.height / 2, finalY),
          );

          adjustments.set(label.id, {
            ...adjustments.get(label.id)!,
            y: clampedY,
          });
        }
      }
    }
  }
}

/**
 * Determines the optimal side (left/right) for label positioning based on overflow detection.
 */
export function determineGlobalSide(
  dimensions: LabelDimension[],
  drawingArea: DrawingArea,
  labelHorizontalInset: number,
): 'left' | 'right' {
  'worklet';
  const anchorRadius = 10; // Same as used in ScrubberBeaconLabel
  const bufferPx = 5; // Small buffer to prevent premature switching

  // Safety check for valid bounds
  if (drawingArea.width <= 0 || drawingArea.height <= 0) {
    return 'right'; // Default to right if bounds are invalid
  }

  // Check if labels would overflow when positioned on the right side
  const wouldOverflow = dimensions.some((dim) => {
    const labelRightEdge =
      dim.preferredX + anchorRadius + labelHorizontalInset + dim.width + bufferPx;
    return labelRightEdge > drawingArea.x + drawingArea.width;
  });

  return wouldOverflow ? 'left' : 'right';
}

/**
 * Main function that orchestrates the complete label positioning algorithm.
 * This combines all the individual steps from the web version.
 */
export function calculateLabelPositions(
  dimensions: LabelDimension[],
  drawingArea: DrawingArea,
  minGap: number = 2,
  labelHorizontalInset: number = 4,
): { strategy: 'left' | 'right'; adjustments: Map<string, LabelAdjustment> } {
  'worklet';
  if (dimensions.length === 0) {
    return { strategy: 'right', adjustments: new Map() };
  }

  // Step 1: Determine global side strategy
  const globalSide = determineGlobalSide(dimensions, drawingArea, labelHorizontalInset);

  // Step 2: Resolve collisions with iterative algorithm
  const adjustments = resolveCollisions(dimensions, minGap);

  // Step 3: Update all adjustments with the determined side
  for (const [id, adjustment] of adjustments) {
    adjustments.set(id, { ...adjustment, side: globalSide });
  }

  // Step 4: Find connected groups
  const connectedGroups = findConnectedGroups(dimensions, adjustments, minGap);

  // Step 5: Apply bounds checking and group repositioning
  applyBoundsChecking(dimensions, adjustments, connectedGroups, drawingArea, minGap);

  return { strategy: globalSide, adjustments };
}

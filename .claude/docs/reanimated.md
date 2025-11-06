# Using D3 Scales with React Native Reanimated

## The Problem

D3 scales are powerful tools for transforming data into screen coordinates, but they **cannot run on the Reanimated UI thread**. This creates a challenge when building interactive charts that need to:

- Respond to gestures at 60fps
- Transform data coordinates to screen positions during touch events
- Maintain smooth animations without blocking the JS thread

Attempting to call d3 scale functions directly in a worklet will fail:

```typescript
// ❌ This will NOT work
const gesture = Gesture.Pan().onUpdate((e) => {
  'worklet';
  // D3 scales are not worklet-compatible!
  const screenX = xScale(dataValue); // ERROR
});
```

## The Solution: Pre-calculate and Store in SharedValues

The key insight is to **separate the scaling operation from the gesture handling**:

1. **JS Thread**: Use d3 scales to transform all data points to screen coordinates
2. **Store Results**: Put the transformed coordinates in Reanimated SharedValues
3. **UI Thread**: Gesture handlers only read pre-calculated values and perform lookups

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       JS Thread (Render)                     │
├─────────────────────────────────────────────────────────────┤
│  1. Create d3 scales (scaleLinear, scaleLog, etc.)          │
│  2. Transform ALL data points using scales                   │
│  3. Store in SharedValue:                                    │
│     - inputValues: [original data]                           │
│     - outputPositions: [screen coordinates from scale]       │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    useEffect to update
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Reanimated Shared State                   │
├─────────────────────────────────────────────────────────────┤
│  SharedValue<{                                               │
│    ix: [1, 2, 3, ...],        // input x values             │
│    ox: [50, 100, 150, ...],   // output x positions (scaled)│
│    iy: [10, 20, 15, ...],     // input y values             │
│    oy: [200, 100, 150, ...]   // output y positions (scaled)│
│  }>                                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    Read in worklet
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  UI Thread (Gesture Handler)                 │
├─────────────────────────────────────────────────────────────┤
│  1. User touches at screen coordinate (x, y)                 │
│  2. Find closest point in outputPositions array              │
│  3. Read corresponding input value                           │
│  4. Update tooltip position from pre-calculated coordinates  │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Guide

### Step 1: Define Your Data Structure

```typescript
import { useSharedValue } from 'react-native-reanimated';
import type { ScaleLinear } from 'd3-scale';

type TransformedData = {
  // Input values (original data)
  ix: number[]; // x values from your data
  iy: Record<string, number[]>; // y values, keyed by series name

  // Output positions (screen coordinates from scales)
  ox: number[]; // x positions in pixels
  oy: Record<string, number[]>; // y positions in pixels
};
```

### Step 2: Create Scales and Transform Data (JS Thread)

```typescript
import { scaleLinear } from 'd3-scale';
import { useMemo, useEffect } from 'react';

function MyChart({ data, width, height, padding }) {
  // Initialize shared value for transformed data
  const transformedData = useSharedValue<TransformedData>({
    ix: [],
    iy: {},
    ox: [],
    oy: {},
  });

  // Create scales and transform data in useMemo
  const { xScale, yScale, scaledData } = useMemo(() => {
    // Define your scales
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([padding, width - padding]);

    const yScale = scaleLinear()
      .domain([0, Math.max(...data.map((d) => d.value))])
      .range([height - padding, padding]); // Note: inverted for screen coords

    // Transform ALL data points using the scales
    const scaledData: TransformedData = {
      ix: data.map((d) => d.x),
      iy: { series1: data.map((d) => d.value) },
      ox: data.map((d) => xScale(d.x)), // 👈 OUTPUT POSITIONS saved here
      oy: { series1: data.map((d) => yScale(d.value)) }, // 👈 OUTPUT POSITIONS saved here
    };

    return { xScale, yScale, scaledData };
  }, [data, width, height, padding]);

  // Update shared value when scaled data changes
  useEffect(() => {
    transformedData.value = scaledData; // 👈 Transferred to SharedValue here
  }, [scaledData, transformedData]);

  // ... rest of component
}
```

**In Victory Native XL codebase, this happens in:**

```345:351:lib/src/cartesian/utils/transformInputData.ts
const ox = ixNum.map((x) => xScale(x)!);

return {
  ix,
  y,
  isNumericalData,
  ox,
```

**For Y values:**

```239:252:lib/src/cartesian/utils/transformInputData.ts
const yData = yKeysForAxis.reduce(
  (acc, key) => {
    acc[key] = {
      i: data.map((datum) => datum[key] as MaybeNumber),
      o: data.map((datum) =>
        typeof datum[key] === "number"
          ? yScale(datum[key] as number)  // 👈 Scale applied here
          : (datum[key] as number),
      ),
    };
    return acc;
  },
  {} as Record<string, { i: MaybeNumber[]; o: MaybeNumber[] }>,
);
```

**Then transferred to SharedValue in CartesianChart:**

```300:302:lib/src/cartesian/CartesianChart.tsx
React.useEffect(() => {
  tData.value = _tData;  // 👈 Output positions now in SharedValue
}, [_tData, tData]);
```

````

### Step 3: Create Gesture Handler (UI Thread)

```typescript
import { Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

function MyChart({ data, width, height, padding }) {
  // ... (scale setup from Step 2)

  // Create shared values for tooltip state
  const tooltipX = useSharedValue(0);
  const tooltipY = useSharedValue(0);
  const tooltipValue = useSharedValue(0);
  const isActive = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      "worklet";
      isActive.value = true;

      // Find closest data point
      const touchX = e.x;
      const idx = findClosestIndex(transformedData.value.ox, touchX);

      if (idx !== -1) {
        // Read pre-calculated screen positions
        tooltipX.value = transformedData.value.ox[idx];
        tooltipY.value = transformedData.value.oy.series1[idx];
        // Also store the original data value if needed
        tooltipValue.value = transformedData.value.iy.series1[idx];
      }
    })
    .onUpdate((e) => {
      "worklet";
      const touchX = e.x;
      const idx = findClosestIndex(transformedData.value.ox, touchX);

      if (idx !== -1) {
        tooltipX.value = transformedData.value.ox[idx];
        tooltipY.value = transformedData.value.oy.series1[idx];
        tooltipValue.value = transformedData.value.iy.series1[idx];
      }
    })
    .onEnd(() => {
      "worklet";
      isActive.value = false;
    });

  // ... render logic
}
````

### Step 4: Helper Function for Finding Closest Point

This runs on the UI thread, so it needs to be a worklet:

```typescript
/**
 * Find the index of the value in array closest to target
 * This function runs on the UI thread
 */
function findClosestIndex(array: number[], target: number): number {
  'worklet';

  if (array.length === 0) return -1;

  let closestIdx = 0;
  let minDistance = Math.abs(array[0] - target);

  for (let i = 1; i < array.length; i++) {
    const distance = Math.abs(array[i] - target);
    if (distance < minDistance) {
      minDistance = distance;
      closestIdx = i;
    }
  }

  return closestIdx;
}
```

**Optimization:** For very large datasets, consider using binary search if your x-values are sorted:

```typescript
function findClosestIndexBinary(array: number[], target: number): number {
  'worklet';

  if (array.length === 0) return -1;

  let left = 0;
  let right = array.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (array[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  // Check if left-1 is closer
  if (left > 0 && Math.abs(array[left - 1] - target) < Math.abs(array[left] - target)) {
    return left - 1;
  }

  return left;
}
```

### Step 5: Render with Skia

```typescript
import { Canvas, Circle, Path, Skia } from "@shopify/react-native-skia";
import Animated, { useDerivedValue } from "react-native-reanimated";

function MyChart({ data, width, height, padding }) {
  // ... (setup from previous steps)

  // Create animated path for line chart
  const path = useDerivedValue(() => {
    const p = Skia.Path.Make();
    const { ox, oy } = transformedData.value;

    if (ox.length > 0) {
      p.moveTo(ox[0], oy.series1[0]);
      for (let i = 1; i < ox.length; i++) {
        p.lineTo(ox[i], oy.series1[i]);
      }
    }

    return p;
  }, []);

  return (
    <GestureDetector gesture={panGesture}>
      <Canvas style={{ width, height }}>
        {/* Draw the line */}
        <Path
          path={path}
          color="blue"
          style="stroke"
          strokeWidth={2}
        />

        {/* Draw tooltip when active */}
        {isActive.value && (
          <Circle
            cx={tooltipX}
            cy={tooltipY}
            r={8}
            color="red"
          />
        )}
      </Canvas>
    </GestureDetector>
  );
}
```

## Advanced: Handling Pan/Zoom Transforms

When implementing pan and zoom, you need to **rescale** your scales. Use `d3-zoom`'s `ZoomTransform`:

```typescript
import { ZoomTransform } from "d3-zoom";
import { useAnimatedReaction, runOnJS } from "react-native-reanimated";

function MyChart({ data, width, height }) {
  // Transform state (from gestures)
  const scaleX = useSharedValue(1);
  const translateX = useSharedValue(0);

  const [rescaledData, setRescaledData] = useState<TransformedData>({...});

  // When transform changes, rescale on JS thread
  useAnimatedReaction(
    () => ({ k: scaleX.value, tx: translateX.value }),
    (transform) => {
      runOnJS(rescaleData)(transform);
    }
  );

  const rescaleData = useCallback((transform: { k: number; tx: number }) => {
    // Create d3 zoom transform
    const zoomTransform = new ZoomTransform(transform.k, transform.tx, 0);

    // Rescale the x scale
    const rescaledXScale = zoomTransform.rescaleX(xScale);

    // Recompute output positions
    const newScaledData: TransformedData = {
      ix: scaledData.ix, // input values don't change
      iy: scaledData.iy,
      ox: scaledData.ix.map(x => rescaledXScale(x)), // recompute positions
      oy: scaledData.oy, // y positions unchanged if only panning X
    };

    transformedData.value = newScaledData;
  }, [xScale, scaledData]);
}
```

## Key Patterns and Best Practices

### ✅ DO

1. **Pre-calculate everything**: Transform all data points during render/useMemo
2. **Store in SharedValues**: Use `useSharedValue` for data that gesture handlers need
3. **Keep scales on JS thread**: Create and use scales in useMemo/useEffect
4. **Use array lookups on UI thread**: Simple index-based access is fast enough
5. **Update SharedValues via useEffect**: Avoid setting shared values during render

### ❌ DON'T

1. **Don't call scale functions in worklets**: They aren't worklet-compatible
2. **Don't use useDerivedValue for scales**: Scales are plain JS objects, not reactive
3. **Don't store scales in SharedValues**: They're not serializable
4. **Don't transform data on every gesture event**: Pre-calculate once

### Performance Considerations

**Memory vs CPU tradeoff:**

- Pre-calculating stores more data (both input and output values)
- But enables 60fps gesture handling without any scale calculations
- For 1000 data points: ~16KB of extra memory (negligible on modern devices)

**Large datasets:**

- Consider downsampling for display while keeping full data for tooltips
- Use binary search for finding closest points (O(log n) vs O(n))
- Virtualize/window data if rendering millions of points

## Complete Example: Interactive Line Chart

```typescript
import React, { useMemo, useEffect, useCallback } from "react";
import { StyleSheet } from "react-native";
import { Canvas, Circle, Path, Skia } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue, useDerivedValue } from "react-native-reanimated";
import { scaleLinear } from "d3-scale";

type DataPoint = { x: number; y: number };

export function InteractiveLineChart({
  data,
  width,
  height,
  padding = 20,
}: {
  data: DataPoint[];
  width: number;
  height: number;
  padding?: number;
}) {
  // SharedValue for transformed data
  const transformedData = useSharedValue<{
    ix: number[];
    iy: number[];
    ox: number[];
    oy: number[];
  }>({
    ix: [],
    iy: [],
    ox: [],
    oy: [],
  });

  // Create scales and transform data
  const scaledData = useMemo(() => {
    const xScale = scaleLinear()
      .domain([Math.min(...data.map(d => d.x)), Math.max(...data.map(d => d.x))])
      .range([padding, width - padding]);

    const yScale = scaleLinear()
      .domain([Math.min(...data.map(d => d.y)), Math.max(...data.map(d => d.y))])
      .range([height - padding, padding]);

    return {
      ix: data.map(d => d.x),
      iy: data.map(d => d.y),
      ox: data.map(d => xScale(d.x)),
      oy: data.map(d => yScale(d.y)),
    };
  }, [data, width, height, padding]);

  // Update shared value when data changes
  useEffect(() => {
    transformedData.value = scaledData;
  }, [scaledData, transformedData]);

  // Tooltip state
  const tooltipX = useSharedValue(0);
  const tooltipY = useSharedValue(0);
  const isActive = useSharedValue(false);

  // Gesture handler
  const gesture = Gesture.Pan()
    .onStart((e) => {
      "worklet";
      isActive.value = true;
      const idx = findClosestIndex(transformedData.value.ox, e.x);
      if (idx !== -1) {
        tooltipX.value = transformedData.value.ox[idx];
        tooltipY.value = transformedData.value.oy[idx];
      }
    })
    .onUpdate((e) => {
      "worklet";
      const idx = findClosestIndex(transformedData.value.ox, e.x);
      if (idx !== -1) {
        tooltipX.value = transformedData.value.ox[idx];
        tooltipY.value = transformedData.value.oy[idx];
      }
    })
    .onEnd(() => {
      "worklet";
      isActive.value = false;
    });

  // Create path
  const path = useDerivedValue(() => {
    const p = Skia.Path.Make();
    const { ox, oy } = transformedData.value;

    if (ox.length > 0) {
      p.moveTo(ox[0], oy[0]);
      for (let i = 1; i < ox.length; i++) {
        p.lineTo(ox[i], oy[i]);
      }
    }

    return p;
  }, []);

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={{ width, height }}>
        <Path
          path={path}
          color="#2563eb"
          style="stroke"
          strokeWidth={2}
        />
        {isActive.value && (
          <>
            <Circle cx={tooltipX} cy={tooltipY} r={8} color="#dc2626" />
            <Circle cx={tooltipX} cy={tooltipY} r={4} color="#fff" />
          </>
        )}
      </Canvas>
    </GestureDetector>
  );
}

function findClosestIndex(array: number[], target: number): number {
  "worklet";
  if (array.length === 0) return -1;

  let closestIdx = 0;
  let minDistance = Math.abs(array[0] - target);

  for (let i = 1; i < array.length; i++) {
    const distance = Math.abs(array[i] - target);
    if (distance < minDistance) {
      minDistance = distance;
      closestIdx = i;
    }
  }

  return closestIdx;
}
```

## Comparison with Other Approaches

### Approach 1: Transform on Every Gesture Event (❌ Bad)

```typescript
// BAD: This doesn't work
const gesture = Gesture.Pan().onUpdate((e) => {
  'worklet';
  const screenX = xScale(dataValue); // ❌ Scale not available on UI thread
});
```

### Approach 2: Use runOnJS (⚠️ Suboptimal)

```typescript
// WORKS but janky - bridges to JS thread on every event
const gesture = Gesture.Pan().onUpdate((e) => {
  'worklet';
  runOnJS(updateTooltip)(e.x);
});

function updateTooltip(x: number) {
  // Runs on JS thread - can use scales
  const value = xScale.invert(x);
  // But now you have to bridge back to update UI...
}
```

**Problems:**

- Bridges between UI/JS thread on every gesture event
- Causes frame drops and janky interactions
- Defeats the purpose of Reanimated

### Approach 3: Pre-calculate (✅ Best)

```typescript
// BEST: Pre-calculate, store in SharedValue, read on UI thread
const transformedData = useSharedValue({ ox: [], oy: [] });

// On JS thread during render:
transformedData.value = {
  ox: data.map((d) => xScale(d.x)),
  oy: data.map((d) => yScale(d.y)),
};

// On UI thread during gesture:
const gesture = Gesture.Pan().onUpdate((e) => {
  'worklet';
  const idx = findClosest(transformedData.value.ox, e.x); // ✅ Fast array lookup
  tooltipX.value = transformedData.value.ox[idx]; // ✅ Already scaled!
});
```

## Conclusion

The key to using d3 scales with Reanimated is **separation of concerns**:

- **JS Thread**: Responsible for data transformation using d3 scales
- **Shared State**: Stores both input and output values
- **UI Thread**: Performs fast lookups and reads pre-calculated positions

This architecture enables:

- 🚀 Smooth 60fps gestures
- 📊 Powerful d3 transformations
- 💪 Complex interactions (multi-touch, pan/zoom)
- 🎨 Beautiful Skia rendering

The memory overhead is minimal, and the performance benefits are substantial. This is the same pattern used in production by Victory Native XL to handle charts with thousands of data points and complex interactions.

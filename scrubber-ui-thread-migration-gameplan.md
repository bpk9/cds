# Scrubber UI Thread Migration Gameplan

## Overview

The goal is to move the scrubber position state from the JS thread to the UI thread using `useSharedValue`, creating a fully UI thread-driven scrubbing experience with JS thread callbacks only for customer notifications.

## Current Architecture Analysis

### Current State Flow

1. **Gesture Detection** (UI Thread) → `runOnJS()` → **Position Calculation** (JS Thread) → **State Update** (JS Thread) → **Component Re-renders** (JS Thread)
2. The `scrubberPosition` is currently a regular JS state managed by `setScrubberPosition`
3. All chart components (`Scrubber`, `ScrubberBeacon`) consume this via `useScrubberContext()`
4. Customer callbacks (`onScrubberPositionChange`) are called synchronously on JS thread

### Target Architecture (End State)

1. **Gesture Detection** (UI Thread) → **Position Calculation** (UI Thread) → **Visual Updates** (UI Thread) + **Customer Callbacks** (JS Thread via `runOnJS`)
2. All internal positioning, animations, and visual updates happen on UI thread
3. Only customer-facing callbacks cross the bridge to JS thread
4. Zero JS thread involvement in visual updates during scrubbing

## Final Architecture Design

### Core State Management

```typescript
// ScrubberProvider - Single source of truth on UI thread
const scrubberPositionShared = useSharedValue<number | undefined>(undefined);

// Context provides only the shared value - no JS state
export type ScrubberContextValue = {
  enableScrubbing: boolean;
  scrubberPositionShared: SharedValue<number | undefined>;
  // Customer callback - only for external notifications
  onScrubberPositionChange?: (index: number | undefined) => void;
};
```

### Gesture Handling (Pure UI Thread)

```typescript
// All gesture logic runs as worklets on UI thread
const getDataIndexFromXWorklet = (touchX: number) => {
  'worklet';
  // Scale functions cached as shared values
  const xScale = xScaleShared.value;
  const xAxis = xAxisShared.value;

  // All calculation logic moved to worklet
  // Returns data index directly on UI thread
};

const longPressGesture = Gesture.Pan()
  .onStart((event) => {
    // Pure worklet - no runOnJS for internal state
    scrubberPositionShared.value = getDataIndexFromXWorklet(event.x);
  })
  .onUpdate((event) => {
    // Pure worklet - immediate UI thread updates
    scrubberPositionShared.value = getDataIndexFromXWorklet(event.x);
  })
  .onEnd(() => {
    // Pure worklet - immediate UI thread cleanup
    scrubberPositionShared.value = undefined;
  });
```

### Component Architecture (UI Thread Driven)

#### Scrubber.tsx - Pure Derived Values

```typescript
export const Scrubber = () => {
  const { scrubberPositionShared } = useScrubberContext();

  // All positioning calculated on UI thread
  const scrubberData = useDerivedValue(() => {
    'worklet';
    const position = scrubberPositionShared.value;
    if (position === undefined) return null;

    // All coordinate calculations happen here on UI thread
    const xScale = xScaleShared.value;
    const dataX = position; // or calculated value
    const pixelX = xScale ? xScale(dataX) : 0;

    return { dataX, pixelX, dataIndex: position };
  });

  // Pure animated styles - no JS thread involvement
  const scrubberLineStyle = useAnimatedStyle(() => ({
    opacity: scrubberData.value ? 1 : 0,
    transform: [{ translateX: scrubberData.value?.pixelX ?? 0 }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    width: scrubberData.value?.pixelX ?? 0,
  }));

  // Beacons get their positions from derived values
  const beaconPositions = useDerivedValue(() => {
    'worklet';
    const data = scrubberData.value;
    if (!data) return [];

    // Calculate all beacon positions on UI thread
    return seriesData.map((series) => ({
      x: data.pixelX,
      y: calculateYPosition(series, data.dataIndex),
      seriesId: series.id,
    }));
  });
};
```

#### ScrubberBeacon.tsx - Pure Animation

```typescript
export const ScrubberBeacon = ({ seriesId }) => {
  const { scrubberPositionShared } = useScrubberContext();

  // Position derived entirely on UI thread
  const beaconPosition = useDerivedValue(() => {
    'worklet';
    const position = scrubberPositionShared.value;
    if (position === undefined) return null;

    // All series data and scale calculations cached as shared values
    const seriesData = seriesDataShared.value[seriesId];
    const xScale = xScaleShared.value;
    const yScale = yScaleShared.value;

    if (!seriesData || !xScale || !yScale) return null;

    const dataPoint = seriesData[position];
    const pixelX = xScale(position);
    const pixelY = yScale(dataPoint);

    return { x: pixelX, y: pixelY };
  });

  // Pure animated positioning
  const animatedStyle = useAnimatedStyle(() => {
    const pos = beaconPosition.value;
    return {
      opacity: pos ? 1 : 0,
      transform: [{ translateX: pos?.x ?? 0 }, { translateY: pos?.y ?? 0 }],
    };
  });

  // Smooth transitions with native animations
  const pulseOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  // Idle state detection on UI thread
  const isIdle = useDerivedValue(() => scrubberPositionShared.value === undefined);
};
```

### Customer Callback Integration (Minimal JS Bridge)

```typescript
// ScrubberProvider - Only bridge for customer notifications
useAnimatedReaction(
  () => scrubberPositionShared.value,
  (currentPosition, previousPosition) => {
    'worklet';
    if (currentPosition !== previousPosition && onScrubberPositionChange) {
      // Only customer callback crosses to JS thread
      runOnJS(onScrubberPositionChange)(currentPosition);
    }
  },
);
```

### Scale Function Caching Strategy

```typescript
// Cache scale functions as shared values to avoid repeated calculations
const xScaleShared = useSharedValue<ChartScaleFunction | null>(null);
const yScaleShared = useSharedValue<ChartScaleFunction | null>(null);
const seriesDataShared = useSharedValue<Record<string, number[]>>({});

// Update cached values when chart context changes
useEffect(() => {
  xScaleShared.value = getXScale();
  yScaleShared.value = getYScale();
  seriesDataShared.value = getAllSeriesData();
}, [getXScale, getYScale, series]);
```

## Implementation Checklist

### ScrubberProvider Changes

- [ ] Replace JS state with `scrubberPositionShared` shared value
- [ ] Convert gesture handlers to pure worklets (no `runOnJS` for internal state)
- [ ] Move `getDataIndexFromX` logic to worklet
- [ ] Cache scale functions and axis data as shared values
- [ ] Add `useAnimatedReaction` for customer callback notifications only
- [ ] Update context to provide only shared value

### Scrubber Component Changes

- [ ] Remove all JS state dependencies
- [ ] Convert position calculations to `useDerivedValue` worklets
- [ ] Update line positioning to use `useAnimatedStyle`
- [ ] Update overlay positioning to use `useAnimatedStyle`
- [ ] Calculate beacon positions in derived values
- [ ] Remove `useMemo` dependencies on JS state

### ScrubberBeacon Changes

- [ ] Remove JS state consumption entirely
- [ ] Convert all coordinate calculations to `useDerivedValue`
- [ ] Update animation styles to use `useAnimatedStyle`
- [ ] Implement smooth position transitions with shared values
- [ ] Move idle state detection to UI thread

### Context Updates

- [ ] Simplify context to only provide `scrubberPositionShared`
- [ ] Remove JS `scrubberPosition` from context
- [ ] Update `useScrubberContext` hook
- [ ] Keep customer callback in context for notifications

### Scale Function Caching

- [ ] Create shared values for all scale functions
- [ ] Cache series data as shared values
- [ ] Update cached values when chart context changes
- [ ] Optimize worklet access to cached data

### Testing & Validation

- [ ] Performance testing: ensure 60fps during scrubbing
- [ ] Memory testing: monitor shared value cleanup
- [ ] Cross-platform testing: iOS and Android behavior
- [ ] Gesture responsiveness testing
- [ ] Customer callback timing validation

## Benefits of Final Architecture

1. **Maximum Performance**:
   - Zero JS thread blocking during scrubbing
   - Native 60fps animations and positioning
   - Immediate visual feedback with no bridge delays

2. **Simplified State Management**:
   - Single source of truth on UI thread
   - No state synchronization complexity
   - Cleaner component architecture

3. **Optimal Resource Usage**:
   - Minimal JS bridge crossings
   - Cached scale functions reduce repeated calculations
   - Efficient worklet execution

4. **Better User Experience**:
   - Buttery smooth scrubbing interactions
   - No visual lag or stuttering
   - Consistent performance across devices

5. **Maintainable Code**:
   - Clear separation between UI thread logic and customer callbacks
   - Predictable data flow
   - Easier debugging with focused responsibilities

## Key Architectural Principles

1. **UI Thread First**: All visual updates happen on UI thread
2. **Minimal Bridge Crossings**: Only customer notifications use `runOnJS`
3. **Cached Dependencies**: Scale functions and data cached as shared values
4. **Pure Worklets**: All position calculations run as worklets
5. **Derived Everything**: All component positioning derived from single shared state

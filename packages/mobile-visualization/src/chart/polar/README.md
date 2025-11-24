# Mobile Polar Charts

This directory contains the mobile implementation of polar coordinate charts (pie, donut, etc.).

## Structure

```
polar/
├── __stories__/
│   └── PolarChart.stories.tsx  # Storybook examples
├── utils/
│   ├── axis.ts                 # Angular and radial axis utilities
│   ├── polar.ts                # Arc calculations and data structures
│   └── index.ts                # Barrel export
├── PolarChartProvider.tsx       # Context provider
└── index.ts                     # Barrel export
```

The main `PolarChart` component is located at `../PolarChart.tsx` (sibling to `CartesianChart.tsx`).

## Comparison: Web vs Mobile PolarChart

### Similarities

Both implementations share:
- **Same API**: Identical prop structure (`series`, `animate`, `angularAxis`, `radialAxis`, `inset`)
- **Same utilities**: Shared logic for axis calculations, arc data, etc.
- **Same context structure**: `PolarChartContextValue` is identical
- **Same coordinate system**: Angular (degrees) and radial (pixels) axes
- **Multi-axis support**: Both support multiple angular and radial axes

### Key Differences

#### 1. **Rendering Platform**
- **Web**: Uses SVG via React DOM
  - `<Box as="svg">` for the chart container
  - Child components render SVG elements
- **Mobile**: Uses Skia Canvas via React Native
  - `<Canvas>` from `@shopify/react-native-skia`
  - Child components render Skia primitives
  - Requires `ChartContextBridge` for context access inside Canvas

#### 2. **Structure**
- **Web**: Two-element structure
  ```tsx
  <Box>                      {/* Wrapper for dimension observation */}
    <Box as="svg">           {/* SVG canvas */}
      <PolarChartProvider>
        {children}
      </PolarChartProvider>
    </Box>
  </Box>
  ```
- **Mobile**: Two-element structure
  ```tsx
  <Box onLayout={...}>       {/* Wrapper for dimension observation */}
    <Canvas>                 {/* Skia canvas */}
      <ContextBridge>        {/* Bridge context to Canvas */}
        {children}
      </ContextBridge>
    </Canvas>
  </Box>
  ```

#### 3. **Styling**
- **Web**: Uses Linaria CSS
  - `className` and `classNames` props
  - `style` and `styles` props
  - CSS-in-JS with `css` template literals
- **Mobile**: Uses React Native StyleSheet
  - `style` and `styles` props only (no classNames)
  - StyleSheet.create() for static styles
  - `StyleProp<ViewStyle>` types

#### 4. **Dimension Tracking**
- **Web**: `useDimensions()` hook with ref observation
  - Observes ref callback
- **Mobile**: `useLayout()` hook
  - Uses `onLayout` event from React Native
  - Returns `[layout, onLayout]` tuple

#### 5. **Font Support**
- **Web**: Uses CSS font-family
  - Standard web fonts
  - No special font management needed
- **Mobile**: Uses Skia font provider
  - `fontProvider` prop (`SkTypefaceFontProvider`)
  - `fontFamilies` prop (string array)
  - Required for custom fonts in ChartText

#### 6. **Accessibility**
- **Web**:
  - `aria-live="polite"`
  - `role="figure"`
- **Mobile**:
  - `accessibilityLiveRegion="polite"`
  - `accessibilityRole="image"`

#### 7. **Props Structure**
- **Web**: `PolarChartProps` extends `BoxProps<'div'>`
  - Can use any div props
- **Mobile**: `PolarChartProps` extends `BoxProps`
  - Includes `collapsable` prop for gesture handling
  - Omits `fontFamily` (handled via `fontProvider`)

#### 8. **Animation**
- **Web**: CSS/SVG animations (will use framer-motion)
  - Animate prop passed to context
  - Child components handle animations
- **Mobile**: react-native-reanimated
  - Animate prop passed to context
  - Child components use `useSharedValue`, `useAnimatedStyle`, etc.

## Context Structure

Both share the same `PolarChartContextValue` type:

```typescript
type PolarChartContextValue = {
  series: PolarSeries[];
  getSeries: (seriesId?: string) => PolarSeries | undefined;
  animate: boolean;
  width: number;
  height: number;
  drawingArea: Rect;
  angularAxes: Map<string, AngularAxisConfig>;
  radialAxes: Map<string, RadialAxisConfig>;
  getAngularAxis: (id?: string) => AngularAxisConfig | undefined;
  getRadialAxis: (id?: string) => RadialAxisConfig | undefined;
  // Mobile-only:
  fontFamilies?: string[];
  fontProvider: SkTypefaceFontProvider;
};
```

## Usage Example

```tsx
import { PolarChart } from '@coinbase/cds-mobile-visualization';

// Basic pie chart
<PolarChart
  series={[
    { id: 'a', data: 30, label: 'A', color: '#5B8DEF' },
    { id: 'b', data: 40, label: 'B', color: '#4CAF93' },
    { id: 'c', data: 30, label: 'C', color: '#E67C5C' },
  ]}
  width={200}
  height={200}
>
  {/* Child components will render arcs */}
</PolarChart>

// Donut chart with inner radius
<PolarChart
  series={[...]}
  radialAxis={{ range: ({ max }) => ({ min: max * 0.6, max }) }}
  width={200}
  height={200}
/>

// Semicircle
<PolarChart
  series={[...]}
  angularAxis={{ range: { min: -90, max: 90 } }}
  width={200}
  height={100}
/>
```

## Implementation Status

### ✅ Completed
- [x] Polar utilities (axis calculations, arc data)
- [x] PolarChart component
- [x] PolarChartProvider and context
- [x] Type definitions
- [x] Basic stories
- [x] PiePlot component (renders the actual arcs)
- [x] Arc component (individual arc rendering)
- [x] DonutChart convenience wrapper
- [x] PieChart convenience wrapper
- [x] Animations with react-native-reanimated (sweeping arc animation)
- [x] getArcPath utility in path.ts

### 🚧 To Do
- [ ] Arc labels/text support (using ChartText)
- [ ] Touch interactions (deferred)
- [ ] Clip path support for mobile (complex clipping)
- [ ] Advanced animations (hover effects, etc.)

## Related Files

- **Web implementation**: `packages/web-visualization/src/chart/PolarChart.tsx`
- **Shared types**: Both use same utility types in their respective `polar/utils/` folders
- **CartesianChart**: Sibling component for X/Y coordinate charts


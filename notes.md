commit 002f313c2f4342c992325131d6124e82b627df7c
Author: Hunter Copp <huntercolecopp@gmail.com>
Date:   Mon Dec 15 19:24:47 2025 -0500

    feat: chart orientation

diff --git a/apps/docs/docs/components/graphs/BarChart/_webExamples.mdx b/apps/docs/docs/components/graphs/BarChart/_webExamples.mdx
index 066e6382..00f16a07 100644
--- a/apps/docs/docs/components/graphs/BarChart/_webExamples.mdx
+++ b/apps/docs/docs/components/graphs/BarChart/_webExamples.mdx
@@ -73,6 +73,139 @@ function MonthlyGainsByAsset() {
 }
 ```
 
+## Horizontal Bars (Vertical Orientation)
+
+You can display bars horizontally by setting `orientation="vertical"`. This swaps the category and value axes - the Y-axis becomes the category axis and the X-axis becomes the value axis.
+
+### Basic Horizontal Bar Chart
+
+```jsx live
+<BarChart
+  orientation="vertical"
+  height={{ base: 200, tablet: 250, desktop: 300 }}
+  inset={{ top: 8, bottom: 8, left: 8, right: 8 }}
+  series={[
+    {
+      id: 'sales',
+      data: [45, 82, 68, 95, 110, 72],
+      color: 'var(--color-accentBoldBlue)',
+    },
+  ]}
+  showXAxis
+  showYAxis
+  xAxis={{
+    domain: { min: 0 },
+    showGrid: true,
+  }}
+  yAxis={{
+    scaleType: 'band',
+    data: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E', 'Product F'],
+    width: 80,
+  }}
+/>
+```
+
+### Horizontal Bars with Multiple Series
+
+Horizontal bar charts are great for comparing categories with long labels.
+
+```jsx live
+function RegionalSales() {
+  const ThinSolidLine = memo((props: SolidLineProps) => <SolidLine {...props} strokeWidth={1} />);
+
+  const tickFormatter = useCallback(
+    (amount) =>
+      new Intl.NumberFormat('en-US', {
+        style: 'currency',
+        currency: 'USD',
+        notation: 'compact',
+      }).format(amount),
+    [],
+  );
+
+  return (
+    <BarChart
+      orientation="vertical"
+      height={{ base: 200, tablet: 280, desktop: 320 }}
+      inset={{ top: 8, bottom: 8, left: 8, right: 8 }}
+      series={[
+        {
+          id: 'q1',
+          data: [125000, 98000, 156000, 87000, 112000],
+          color: 'var(--color-accentBoldBlue)',
+        },
+        {
+          id: 'q2',
+          data: [142000, 105000, 178000, 95000, 128000],
+          color: 'var(--color-accentBoldGreen)',
+        },
+      ]}
+      showXAxis
+      showYAxis
+      xAxis={{
+        domain: { min: 0 },
+        showGrid: true,
+        GridLineComponent: ThinSolidLine,
+        tickLabelFormatter: tickFormatter,
+      }}
+      yAxis={{
+        scaleType: 'band',
+        data: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'],
+        width: 100,
+      }}
+    />
+  );
+}
+```
+
+### Stacked Horizontal Bars
+
+Stacking works the same way with horizontal bars.
+
+```jsx live
+function StackedHorizontalBars() {
+  const ThinSolidLine = memo((props: SolidLineProps) => <SolidLine {...props} strokeWidth={1} />);
+
+  return (
+    <BarChart
+      orientation="vertical"
+      stacked
+      height={{ base: 200, tablet: 280, desktop: 320 }}
+      inset={{ top: 8, bottom: 8, left: 8, right: 8 }}
+      series={[
+        {
+          id: 'completed',
+          data: [42, 38, 55, 28, 62],
+          color: 'var(--color-fgPositive)',
+        },
+        {
+          id: 'in-progress',
+          data: [18, 24, 12, 32, 15],
+          color: 'var(--color-accentBoldYellow)',
+        },
+        {
+          id: 'pending',
+          data: [8, 12, 5, 18, 8],
+          color: 'var(--color-fgMuted)',
+        },
+      ]}
+      showXAxis
+      showYAxis
+      xAxis={{
+        domain: { min: 0 },
+        showGrid: true,
+        GridLineComponent: ThinSolidLine,
+      }}
+      yAxis={{
+        scaleType: 'band',
+        data: ['Engineering', 'Design', 'Product', 'Marketing', 'Sales'],
+        width: 80,
+      }}
+    />
+  );
+}
+```
+
 ## Series Stacking
 
 You can also configure stacking for your chart using the `stacked` prop.
diff --git a/apps/docs/docs/components/graphs/CartesianChart/_webExamples.mdx b/apps/docs/docs/components/graphs/CartesianChart/_webExamples.mdx
index a38b2885..297c128d 100644
--- a/apps/docs/docs/components/graphs/CartesianChart/_webExamples.mdx
+++ b/apps/docs/docs/components/graphs/CartesianChart/_webExamples.mdx
@@ -661,3 +661,341 @@ function TradingTrends() {
   );
 }
 ```
+
+## Orientation
+
+By default, CartesianChart uses a horizontal orientation where the X-axis is the category/independent axis and the Y-axis is the value/dependent axis. You can switch to a vertical orientation by setting `orientation="vertical"`, which swaps these roles - the Y-axis becomes the category axis and the X-axis becomes the value axis.
+
+### Horizontal Bars with CartesianChart
+
+When using `orientation="vertical"`, bar charts render horizontally. This is particularly useful for displaying ranked data or categories with long labels.
+
+```jsx live
+function HorizontalBarExample() {
+  const ThinSolidLine = memo((props: SolidLineProps) => <SolidLine {...props} strokeWidth={1} />);
+
+  return (
+    <CartesianChart
+      orientation="vertical"
+      height={{ base: 250, tablet: 300, desktop: 350 }}
+      inset={{ top: 8, bottom: 8, left: 8, right: 8 }}
+      series={[
+        {
+          id: 'revenue',
+          data: [182, 156, 143, 128, 112, 98, 85],
+          color: 'var(--color-accentBoldBlue)',
+        },
+      ]}
+      xAxis={{
+        domain: { min: 0, max: 200 },
+        showGrid: true,
+        GridLineComponent: ThinSolidLine,
+      }}
+      yAxis={{
+        scaleType: 'band',
+        data: ['Bitcoin', 'Ethereum', 'Solana', 'Cardano', 'Polygon', 'Avalanche', 'Chainlink'],
+      }}
+    >
+      <XAxis showLine />
+      <YAxis position="left" width={80} />
+      <BarPlot />
+    </CartesianChart>
+  );
+}
+```
+
+### Horizontal Stacked Bars
+
+Stacking also works with horizontal bars in vertical orientation.
+
+```jsx live
+function StackedHorizontalExample() {
+  const ThinSolidLine = memo((props: SolidLineProps) => <SolidLine {...props} strokeWidth={1} />);
+
+  return (
+    <CartesianChart
+      orientation="vertical"
+      height={{ base: 280, tablet: 320, desktop: 360 }}
+      inset={{ top: 8, bottom: 8, left: 8, right: 8 }}
+      series={[
+        {
+          id: 'buy',
+          data: [65, 48, 72, 55, 42],
+          color: 'var(--color-fgPositive)',
+          stackId: 'orders',
+        },
+        {
+          id: 'sell',
+          data: [45, 62, 38, 51, 68],
+          color: 'var(--color-fgNegative)',
+          stackId: 'orders',
+        },
+      ]}
+      xAxis={{
+        domain: { min: 0 },
+        showGrid: true,
+        GridLineComponent: ThinSolidLine,
+        tickLabelFormatter: (value) => `${value}%`,
+      }}
+      yAxis={{
+        scaleType: 'band',
+        data: ['Bitcoin', 'Ethereum', 'Solana', 'Cardano', 'Polygon'],
+      }}
+    >
+      <XAxis showLine />
+      <YAxis position="left" width={70} />
+      <BarPlot />
+    </CartesianChart>
+  );
+}
+```
+
+### Multiple Series Horizontal Bars
+
+You can display multiple series as grouped horizontal bars.
+
+```jsx live
+function GroupedHorizontalBars() {
+  const ThinSolidLine = memo((props: SolidLineProps) => <SolidLine {...props} strokeWidth={1} />);
+
+  return (
+    <CartesianChart
+      orientation="vertical"
+      height={{ base: 280, tablet: 320, desktop: 360 }}
+      inset={{ top: 8, bottom: 8, left: 8, right: 8 }}
+      series={[
+        {
+          id: 'actual',
+          data: [85, 72, 95, 68, 78, 62],
+          color: 'var(--color-accentBoldBlue)',
+        },
+        {
+          id: 'target',
+          data: [90, 80, 85, 75, 85, 70],
+          color: 'var(--color-fgMuted)',
+        },
+      ]}
+      xAxis={{
+        domain: { min: 0, max: 100 },
+        showGrid: true,
+        GridLineComponent: ThinSolidLine,
+        tickLabelFormatter: (value) => `${value}%`,
+      }}
+      yAxis={{
+        scaleType: 'band',
+        data: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024'],
+      }}
+    >
+      <XAxis showLine />
+      <YAxis position="left" width={70} />
+      <BarPlot />
+    </CartesianChart>
+  );
+}
+```
+
+### Voter Turnout Chart with Piecewise Gradient
+
+This example shows a horizontal bar chart with piecewise color gradient based on value thresholds: red for low turnout (&lt;50%), gray for average (50-85%), and blue for high turnout (&gt;85%).
+
+```jsx live
+function VoterTurnoutChart() {
+  const ThinSolidLine = memo((props: SolidLineProps) => <SolidLine {...props} strokeWidth={1} />);
+
+  const voterData = [
+    { country: 'Romania (2020)', turnout: 33.2 },
+    { country: 'Bulgaria (2024)', turnout: 33.4 },
+    { country: 'Albania (2021)', turnout: 46.3 },
+    { country: 'United Kingdom (2024)', turnout: 60.0 },
+    { country: 'Spain (2023)', turnout: 66.0 },
+    { country: 'France (2024)', turnout: 66.7 },
+    { country: 'Germany (2021)', turnout: 76.4 },
+    { country: 'Sweden (2022)', turnout: 83.8 },
+    { country: 'Malta (2022)', turnout: 85.6 },
+    { country: 'Turkey (2023)', turnout: 87.0 },
+    { country: 'Belgium (2024)', turnout: 88.5 },
+  ];
+
+  const turnoutValues = voterData.map((d) => d.turnout);
+  const countries = voterData.map((d) => d.country);
+
+  return (
+    <VStack gap={4}>
+      <Text font="title3">European countries with lowest & highest voter turnout</Text>
+      <CartesianChart
+        orientation="vertical"
+        height={{ base: 400, tablet: 450, desktop: 500 }}
+        inset={{ top: 8, bottom: 8, left: 8, right: 8 }}
+        series={[
+          {
+            id: 'low',
+            data: [],
+            label: 'lowest turnout',
+            color: 'var(--color-accentBoldRed)',
+            legendShape: 'squircle',
+          },
+          {
+            id: 'avg',
+            data: [],
+            label: 'average',
+            color: 'var(--color-fgMuted)',
+            legendShape: 'squircle',
+          },
+          {
+            id: 'high',
+            data: [],
+            label: 'highest turnout',
+            color: 'var(--color-accentBoldBlue)',
+            legendShape: 'squircle',
+          },
+          {
+            id: 'turnout',
+            data: turnoutValues,
+            gradient: {
+              axis: 'x',
+              // Piecewise gradient: red < 50, gray 50-85, blue > 85
+              // Using duplicate stops at thresholds creates hard color transitions
+              stops: [
+                { offset: 0, color: 'var(--color-accentBoldRed)' },
+                { offset: 49.9, color: 'var(--color-accentBoldRed)' },
+                { offset: 50, color: 'var(--color-fgMuted)' },
+                { offset: 84.9, color: 'var(--color-fgMuted)' },
+                { offset: 85, color: 'var(--color-accentBoldBlue)' },
+                { offset: 100, color: 'var(--color-accentBoldBlue)' },
+              ],
+            },
+          },
+        ]}
+        xAxis={{
+          domain: { min: 0, max: 100 },
+          showGrid: true,
+          GridLineComponent: ThinSolidLine,
+          tickLabelFormatter: (value) => `${value}%`,
+        }}
+        yAxis={{
+          scaleType: 'band',
+          data: countries,
+        }}
+      >
+        <Legend seriesIds={['low', 'avg', 'high']} />
+        <XAxis showLine />
+        <YAxis position="left" width={140} />
+        <BarPlot seriesIds={['turnout']} borderRadius={0} />
+      </CartesianChart>
+    </VStack>
+  );
+}
+```
+
+### Multi-Segment Progress Bar
+
+This example shows how to create a segmented progress bar using stacked horizontal bars. This is useful for showing proportions like "bought vs sold" or any multi-segment breakdown that sums to 100%.
+
+```jsx live
+function MultiSegmentProgressBar() {
+  // Data represents percentages that sum to 100
+  const bought = 76;
+  const sold = 24;
+
+  return (
+    <VStack gap={2} style={{ width: '100%' }}>
+      <CartesianChart
+        orientation="vertical"
+        height={40}
+        inset={{ top: 0, bottom: 0, left: 0, right: 0 }}
+        series={[
+          {
+            id: 'bought',
+            data: [bought],
+            label: `${bought}% bought`,
+            color: 'var(--color-accentBoldGreen)',
+            stackId: 'progress',
+            legendShape: 'circle',
+          },
+          {
+            id: 'sold',
+            data: [sold],
+            label: `${sold}% sold`,
+            color: 'var(--color-accentBoldRed)',
+            stackId: 'progress',
+            legendShape: 'circle',
+          },
+        ]}
+        xAxis={{
+          domain: { min: 0, max: 100 },
+        }}
+        yAxis={{
+          scaleType: 'band',
+          data: [''],
+        }}
+      >
+        <BarPlot borderRadius={4} />
+      </CartesianChart>
+      <Legend justifyContent="space-between" />
+    </VStack>
+  );
+}
+```
+
+### Multi-Segment Progress with Multiple Rows
+
+You can also display multiple progress bars with different breakdowns.
+
+```jsx live
+function MultiRowProgressBars() {
+  const data = [
+    { category: 'Portfolio A', stocks: 60, bonds: 25, cash: 15 },
+    { category: 'Portfolio B', stocks: 45, bonds: 40, cash: 15 },
+    { category: 'Portfolio C', stocks: 80, bonds: 15, cash: 5 },
+  ];
+
+  return (
+    <VStack gap={3} style={{ width: '100%' }}>
+      <CartesianChart
+        orientation="vertical"
+        height={160}
+        inset={{ top: 8, bottom: 8, left: 8, right: 8 }}
+        series={[
+          {
+            id: 'stocks',
+            data: data.map((d) => d.stocks),
+            label: 'Stocks',
+            color: 'var(--color-accentBoldBlue)',
+            stackId: 'allocation',
+            legendShape: 'squircle',
+          },
+          {
+            id: 'bonds',
+            data: data.map((d) => d.bonds),
+            label: 'Bonds',
+            color: 'var(--color-accentBoldGreen)',
+            stackId: 'allocation',
+            legendShape: 'squircle',
+          },
+          {
+            id: 'cash',
+            data: data.map((d) => d.cash),
+            label: 'Cash',
+            color: 'var(--color-fgMuted)',
+            stackId: 'allocation',
+            legendShape: 'squircle',
+          },
+        ]}
+        xAxis={{
+          domain: { min: 0, max: 100 },
+          tickLabelFormatter: (value) => `${value}%`,
+        }}
+        yAxis={{
+          scaleType: 'band',
+          data: data.map((d) => d.category),
+        }}
+      >
+        <XAxis showLine />
+        <YAxis position="left" width={90} />
+        <BarPlot borderRadius={4} />
+      </CartesianChart>
+      <Legend />
+    </VStack>
+  );
+}
+```
diff --git a/apps/docs/docs/components/graphs/LineChart/_webExamples.mdx b/apps/docs/docs/components/graphs/LineChart/_webExamples.mdx
index a24df9c1..33e996c5 100644
--- a/apps/docs/docs/components/graphs/LineChart/_webExamples.mdx
+++ b/apps/docs/docs/components/graphs/LineChart/_webExamples.mdx
@@ -327,6 +327,219 @@ LineChart uses `linear` scaling on axes by default, but you can also use other t
 />
 ```
 
+## Orientation
+
+By default, LineChart uses a horizontal orientation where the X-axis is the category/independent axis and the Y-axis is the value/dependent axis. You can switch to a vertical orientation by setting `orientation="vertical"`, which swaps these roles.
+
+### Vertical Line Chart
+
+In vertical orientation, the line chart draws lines horizontally from left to right, with categories on the Y-axis.
+
+```jsx live
+<LineChart
+  orientation="vertical"
+  height={{ base: 250, tablet: 300, desktop: 350 }}
+  inset={{ top: 8, bottom: 8, left: 8, right: 8 }}
+  series={[
+    {
+      id: 'scores',
+      data: [85, 72, 95, 68, 78, 62],
+      color: 'var(--color-accentBoldBlue)',
+    },
+  ]}
+  showXAxis
+  showYAxis
+  xAxis={{
+    domain: { min: 0, max: 100 },
+    showGrid: true,
+    tickLabelFormatter: (value) => `${value}%`,
+  }}
+  yAxis={{
+    scaleType: 'band',
+    data: ['Project A', 'Project B', 'Project C', 'Project D', 'Project E', 'Project F'],
+    width: 80,
+  }}
+/>
+```
+
+### Vertical Line Chart with Area
+
+You can combine vertical orientation with area fill.
+
+```jsx live
+function VerticalLineWithArea() {
+  const ThinSolidLine = memo((props: SolidLineProps) => <SolidLine {...props} strokeWidth={1} />);
+
+  return (
+    <LineChart
+      orientation="vertical"
+      showArea
+      height={{ base: 280, tablet: 320, desktop: 360 }}
+      inset={{ top: 8, bottom: 8, left: 8, right: 8 }}
+      series={[
+        {
+          id: 'revenue',
+          data: [145, 128, 172, 98, 156, 112, 89],
+          color: 'var(--color-accentBoldGreen)',
+        },
+      ]}
+      showXAxis
+      showYAxis
+      xAxis={{
+        domain: { min: 0 },
+        showGrid: true,
+        GridLineComponent: ThinSolidLine,
+        tickLabelFormatter: (value) => `$${value}k`,
+      }}
+      yAxis={{
+        scaleType: 'band',
+        data: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
+        width: 70,
+      }}
+    />
+  );
+}
+```
+
+### Vertical Line Chart with Gradient
+
+You can use gradients with vertical orientation. The gradient is applied along the value axis (X-axis in vertical orientation). Note that gradient `offset` values are **data values**, not percentages.
+
+```jsx live
+<LineChart
+  orientation="vertical"
+  showArea
+  height={{ base: 280, tablet: 320, desktop: 360 }}
+  inset={{ top: 8, bottom: 8, left: 8, right: 8 }}
+  series={[
+    {
+      id: 'performance',
+      data: [25, 45, 72, 85, 95, 88, 78],
+      gradient: {
+        axis: 'x',
+        // offset values correspond to actual data values (0-100 in this case)
+        stops: [
+          { offset: 0, color: 'var(--color-accentBoldRed)' },
+          { offset: 50, color: 'var(--color-accentBoldYellow)' },
+          { offset: 100, color: 'var(--color-accentBoldGreen)' },
+        ],
+      },
+    },
+  ]}
+  showXAxis
+  showYAxis
+  xAxis={{
+    domain: { min: 0, max: 100 },
+    showGrid: true,
+    tickLabelFormatter: (value) => `${value}%`,
+  }}
+  yAxis={{
+    scaleType: 'band',
+    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
+    width: 40,
+  }}
+/>
+```
+
+### Vertical Line Chart with Y-Axis Gradient
+
+You can also apply the gradient along the Y-axis (category axis in vertical orientation). For band scales, the offset is the category index.
+
+```jsx live
+function VerticalGradientY() {
+  const ThinSolidLine = memo((props: SolidLineProps) => <SolidLine {...props} strokeWidth={1} />);
+  const categories = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E', 'Product F'];
+
+  return (
+    <LineChart
+      enableScrubbing
+      orientation="vertical"
+      showArea
+      height={{ base: 300, tablet: 350, desktop: 400 }}
+      inset={{ top: 8, bottom: 8, left: 8, right: 8 }}
+      series={[
+        {
+          id: 'sales',
+          data: [120, 85, 145, 92, 178, 156],
+          label: 'Sales',
+          gradient: {
+            axis: 'y',
+            // For band scales, offset is the category index (0 to length-1)
+            stops: [
+              { offset: 0, color: 'var(--color-accentBoldPurple)' },
+              { offset: categories.length - 1, color: 'var(--color-accentBoldBlue)' },
+            ],
+          },
+        },
+      ]}
+      showXAxis
+      showYAxis
+      xAxis={{
+        domain: { min: 0 },
+        showGrid: true,
+        GridLineComponent: ThinSolidLine,
+        tickLabelFormatter: (value) => `$${value}k`,
+      }}
+      yAxis={{
+        scaleType: 'band',
+        data: categories,
+        width: 80,
+      }}
+    >
+      <Scrubber />
+    </LineChart>
+  );
+}
+```
+
+### Multiple Lines with Scrubber in Vertical Orientation
+
+Multiple series work with vertical orientation including scrubber interaction. The scrubber line and beacons are positioned horizontally.
+
+```jsx live
+function MultipleVerticalLines() {
+  const ThinSolidLine = memo((props: SolidLineProps) => <SolidLine {...props} strokeWidth={1} />);
+
+  return (
+    <LineChart
+      enableScrubbing
+      orientation="vertical"
+      height={{ base: 280, tablet: 320, desktop: 360 }}
+      inset={{ top: 8, bottom: 8, left: 8, right: 8 }}
+      series={[
+        {
+          id: 'actual',
+          data: [85, 72, 95, 68, 78],
+          color: 'var(--color-accentBoldBlue)',
+          label: 'Actual',
+        },
+        {
+          id: 'target',
+          data: [90, 80, 85, 75, 85],
+          color: 'var(--color-fgMuted)',
+          label: 'Target',
+        },
+      ]}
+      showXAxis
+      showYAxis
+      xAxis={{
+        domain: { min: 0, max: 100 },
+        showGrid: true,
+        GridLineComponent: ThinSolidLine,
+        tickLabelFormatter: (value) => `${value}%`,
+      }}
+      yAxis={{
+        scaleType: 'band',
+        data: ['North', 'South', 'East', 'West', 'Central'],
+        width: 60,
+      }}
+    >
+      <Scrubber />
+    </LineChart>
+  );
+}
+```
+
 ## Interaction
 
 Charts have built in functionality enabled through scrubbing, which can be used by setting `enableScrubbing` to true. You can listen to value changes through `onScrubberPositionChange`. Adding `Scrubber` to LineChart showcases the current scrubber position.
diff --git a/packages/web-visualization/src/chart/CartesianChart.tsx b/packages/web-visualization/src/chart/CartesianChart.tsx
index 53e00c0a..10c9720c 100644
--- a/packages/web-visualization/src/chart/CartesianChart.tsx
+++ b/packages/web-visualization/src/chart/CartesianChart.tsx
@@ -15,6 +15,7 @@ import {
   type CartesianChartContextValue,
   type CartesianSeries,
   type ChartInset,
+  type ChartOrientation,
   type ChartScaleFunction,
   defaultAxisId,
   defaultCartesianChartInset,
@@ -63,6 +64,13 @@ export type CartesianChartBaseProps = BoxBaseProps &
      * Each series contains its own data array.
      */
     series?: Array<CartesianSeries>;
+    /**
+     * Chart orientation. Determines which axis is the category axis.
+     * - 'horizontal' (default): X is category axis, Y is value axis (vertical bars, left-to-right data flow)
+     * - 'vertical': Y is category axis, X is value axis (horizontal bars, top-to-bottom data flow)
+     * @default 'horizontal'
+     */
+    orientation?: ChartOrientation;
     /**
      * Whether to animate the chart.
      * @default true
@@ -161,6 +169,7 @@ export const CartesianChart = memo(
       {
         series,
         children,
+        orientation = 'horizontal',
         animate = true,
         xAxis: xAxisConfigProp,
         yAxis: yAxisConfigProp,
@@ -228,7 +237,7 @@ export const CartesianChart = memo(
         if (!chartRect || chartRect.width <= 0 || chartRect.height <= 0)
           return { xAxis: undefined, xScale: undefined };
 
-        const domain = getCartesianAxisDomain(xAxisConfig, series ?? [], 'x');
+        const domain = getCartesianAxisDomain(xAxisConfig, series ?? [], 'x', orientation);
         const range = getAxisRange(xAxisConfig, chartRect, 'x');
 
         const axisConfig: CartesianAxisConfig = {
@@ -246,6 +255,7 @@ export const CartesianChart = memo(
           type: 'x',
           range: axisConfig.range,
           dataDomain: axisConfig.domain,
+          orientation,
         });
 
         if (!scale) return { xAxis: undefined, xScale: undefined };
@@ -263,7 +273,7 @@ export const CartesianChart = memo(
         };
 
         return { xAxis: finalAxisConfig, xScale: scale };
-      }, [xAxisConfig, series, chartRect]);
+      }, [xAxisConfig, series, chartRect, orientation]);
 
       const { yAxes, yScales } = useMemo(() => {
         const axes = new Map<string, CartesianAxisConfig>();
@@ -279,7 +289,7 @@ export const CartesianChart = memo(
             series?.filter((s) => (s.yAxisId ?? defaultAxisId) === axisId) ?? [];
 
           // Calculate domain and range
-          const dataDomain = getCartesianAxisDomain(axisParam, relevantSeries, 'y');
+          const dataDomain = getCartesianAxisDomain(axisParam, relevantSeries, 'y', orientation);
           const range = getAxisRange(axisParam, chartRect, 'y');
 
           const axisConfig: CartesianAxisConfig = {
@@ -297,6 +307,7 @@ export const CartesianChart = memo(
             type: 'y',
             range: axisConfig.range,
             dataDomain: axisConfig.domain,
+            orientation,
           });
 
           if (scale) {
@@ -317,7 +328,7 @@ export const CartesianChart = memo(
         });
 
         return { yAxes: axes, yScales: scales };
-      }, [yAxisConfig, series, chartRect]);
+      }, [yAxisConfig, series, chartRect, orientation]);
 
       const getXAxis = useCallback(() => xAxis, [xAxis]);
       const getYAxis = useCallback((id?: string) => yAxes.get(id ?? defaultAxisId), [yAxes]);
@@ -416,6 +427,7 @@ export const CartesianChart = memo(
       const contextValue: CartesianChartContextValue = useMemo(
         () => ({
           type: 'cartesian',
+          orientation,
           series: series ?? [],
           getSeries,
           getSeriesData: getStackedSeriesData,
@@ -434,6 +446,7 @@ export const CartesianChart = memo(
           ref: chartRef,
         }),
         [
+          orientation,
           series,
           getSeries,
           getStackedSeriesData,
@@ -493,20 +506,34 @@ export const CartesianChart = memo(
         [isControlled, currentHighlightedItem, onHighlightChange, onScrubberPositionChange],
       );
 
-      // Convert mouse X position to data index
-      const getDataIndexFromX = useCallback(
-        (mouseX: number): number => {
-          if (!xScale || !xAxis) return 0;
-
-          if (isCategoricalScale(xScale)) {
-            const categories = xScale.domain?.() ?? xAxis.data ?? [];
-            const bandwidth = xScale.bandwidth?.() ?? 0;
+      // Get the category scale and axis based on orientation
+      const getCategoryScaleAndAxis = useCallback(() => {
+        if (orientation === 'vertical') {
+          // For vertical orientation, Y is the category axis
+          return {
+            scale: yScales.get(defaultAxisId),
+            axis: yAxes.get(defaultAxisId),
+          };
+        }
+        // For horizontal orientation, X is the category axis
+        return { scale: xScale, axis: xAxis };
+      }, [orientation, xScale, xAxis, yScales, yAxes]);
+
+      // Convert mouse position to data index (supports both orientations)
+      const getDataIndexFromPosition = useCallback(
+        (mousePosition: number): number => {
+          const { scale: categoryScale, axis: categoryAxis } = getCategoryScaleAndAxis();
+          if (!categoryScale || !categoryAxis) return 0;
+
+          if (isCategoricalScale(categoryScale)) {
+            const categories = categoryScale.domain?.() ?? categoryAxis.data ?? [];
+            const bandwidth = categoryScale.bandwidth?.() ?? 0;
             let closestIndex = 0;
             let closestDistance = Infinity;
             for (let i = 0; i < categories.length; i++) {
-              const xPos = xScale(i);
-              if (xPos !== undefined) {
-                const distance = Math.abs(mouseX - (xPos + bandwidth / 2));
+              const pos = categoryScale(i);
+              if (pos !== undefined) {
+                const distance = Math.abs(mousePosition - (pos + bandwidth / 2));
                 if (distance < closestDistance) {
                   closestDistance = distance;
                   closestIndex = i;
@@ -516,17 +543,17 @@ export const CartesianChart = memo(
             return closestIndex;
           } else {
             // For numeric scales with axis data, find the nearest data point
-            const axisData = xAxis.data;
+            const axisData = categoryAxis.data;
             if (axisData && Array.isArray(axisData) && typeof axisData[0] === 'number') {
               const numericData = axisData as number[];
               let closestIndex = 0;
               let closestDistance = Infinity;
 
               for (let i = 0; i < numericData.length; i++) {
-                const xValue = numericData[i];
-                const xPos = xScale(xValue);
-                if (xPos !== undefined) {
-                  const distance = Math.abs(mouseX - xPos);
+                const dataValue = numericData[i];
+                const pos = categoryScale(dataValue);
+                if (pos !== undefined) {
+                  const distance = Math.abs(mousePosition - pos);
                   if (distance < closestDistance) {
                     closestDistance = distance;
                     closestIndex = i;
@@ -535,24 +562,25 @@ export const CartesianChart = memo(
               }
               return closestIndex;
             } else {
-              const xValue = xScale.invert(mouseX);
-              const dataIndexVal = Math.round(xValue);
-              const domain = xAxis.domain;
+              const dataValue = categoryScale.invert(mousePosition);
+              const dataIndexVal = Math.round(dataValue);
+              const domain = categoryAxis.domain;
               return Math.max(domain.min ?? 0, Math.min(dataIndexVal, domain.max ?? 0));
             }
           }
         },
-        [xScale, xAxis],
+        [getCategoryScaleAndAxis],
       );
 
       // Handle pointer move (mouse or touch)
       const handlePointerMove = useCallback(
-        (clientX: number, target: SVGSVGElement) => {
+        (clientX: number, clientY: number, target: SVGSVGElement) => {
           if (!enableHighlighting || !series || series.length === 0) return;
 
           const rect = target.getBoundingClientRect();
-          const x = clientX - rect.left;
-          const dataIndexVal = getDataIndexFromX(x);
+          // For horizontal orientation, use X position; for vertical, use Y position
+          const position = orientation === 'vertical' ? clientY - rect.top : clientX - rect.left;
+          const dataIndexVal = getDataIndexFromPosition(position);
 
           // Only update if dataIndex changed
           if (dataIndexVal !== lastDataIndexRef.current) {
@@ -563,7 +591,13 @@ export const CartesianChart = memo(
             }));
           }
         },
-        [enableHighlighting, series, getDataIndexFromX, setHighlightedItemInternal],
+        [
+          enableHighlighting,
+          series,
+          orientation,
+          getDataIndexFromPosition,
+          setHighlightedItemInternal,
+        ],
       );
 
       // Handle pointer leave
@@ -577,25 +611,27 @@ export const CartesianChart = memo(
       const handleKeyDown = useCallback(
         (event: KeyboardEvent) => {
           if (!enableHighlighting) return;
-          if (!xScale || !xAxis) return;
 
-          const isBand = isCategoricalScale(xScale);
+          const { scale: categoryScale, axis: categoryAxis } = getCategoryScaleAndAxis();
+          if (!categoryScale || !categoryAxis) return;
+
+          const isBand = isCategoricalScale(categoryScale);
 
           // Determine navigation bounds
           let minIndex: number;
           let maxIndex: number;
 
           if (isBand) {
-            const categories = xScale.domain?.() ?? xAxis.data ?? [];
+            const categories = categoryScale.domain?.() ?? categoryAxis.data ?? [];
             minIndex = 0;
             maxIndex = Math.max(0, categories.length - 1);
           } else {
-            const axisData = xAxis.data;
+            const axisData = categoryAxis.data;
             if (axisData && Array.isArray(axisData)) {
               minIndex = 0;
               maxIndex = Math.max(0, axisData.length - 1);
             } else {
-              const domain = xAxis.domain;
+              const domain = categoryAxis.domain;
               minIndex = domain.min ?? 0;
               maxIndex = domain.max ?? 0;
             }
@@ -610,29 +646,30 @@ export const CartesianChart = memo(
 
           let newIndex: number | undefined;
 
-          switch (event.key) {
-            case 'ArrowLeft':
-              event.preventDefault();
-              newIndex = Math.max(minIndex, currentIndex - stepSize);
-              break;
-            case 'ArrowRight':
-              event.preventDefault();
-              newIndex = Math.min(maxIndex, currentIndex + stepSize);
-              break;
-            case 'Home':
-              event.preventDefault();
-              newIndex = minIndex;
-              break;
-            case 'End':
-              event.preventDefault();
-              newIndex = maxIndex;
-              break;
-            case 'Escape':
-              event.preventDefault();
-              newIndex = undefined;
-              break;
-            default:
-              return;
+          // For horizontal orientation: ArrowLeft/Right navigate data
+          // For vertical orientation: ArrowUp/Down navigate data
+          const isDecreaseKey =
+            orientation === 'vertical' ? event.key === 'ArrowUp' : event.key === 'ArrowLeft';
+          const isIncreaseKey =
+            orientation === 'vertical' ? event.key === 'ArrowDown' : event.key === 'ArrowRight';
+
+          if (isDecreaseKey) {
+            event.preventDefault();
+            newIndex = Math.max(minIndex, currentIndex - stepSize);
+          } else if (isIncreaseKey) {
+            event.preventDefault();
+            newIndex = Math.min(maxIndex, currentIndex + stepSize);
+          } else if (event.key === 'Home') {
+            event.preventDefault();
+            newIndex = minIndex;
+          } else if (event.key === 'End') {
+            event.preventDefault();
+            newIndex = maxIndex;
+          } else if (event.key === 'Escape') {
+            event.preventDefault();
+            newIndex = undefined;
+          } else {
+            return;
           }
 
           if (newIndex !== lastDataIndexRef.current) {
@@ -647,7 +684,13 @@ export const CartesianChart = memo(
             }
           }
         },
-        [enableHighlighting, xScale, xAxis, currentHighlightedItem, setHighlightedItemInternal],
+        [
+          enableHighlighting,
+          orientation,
+          getCategoryScaleAndAxis,
+          currentHighlightedItem,
+          setHighlightedItemInternal,
+        ],
       );
 
       // Handle blur - clear highlighting when focus leaves
@@ -665,20 +708,20 @@ export const CartesianChart = memo(
         const svg = chartRef.current;
 
         const handleMouseMove = (event: MouseEvent) => {
-          handlePointerMove(event.clientX, svg);
+          handlePointerMove(event.clientX, event.clientY, svg);
         };
 
         const handleTouchStart = (event: TouchEvent) => {
           if (!event.touches.length) return;
           const touch = event.touches[0];
-          handlePointerMove(touch.clientX, svg);
+          handlePointerMove(touch.clientX, touch.clientY, svg);
         };
 
         const handleTouchMove = (event: TouchEvent) => {
           if (!event.touches.length) return;
           event.preventDefault();
           const touch = event.touches[0];
-          handlePointerMove(touch.clientX, svg);
+          handlePointerMove(touch.clientX, touch.clientY, svg);
         };
 
         svg.addEventListener('mousemove', handleMouseMove);
diff --git a/packages/web-visualization/src/chart/area/Area.tsx b/packages/web-visualization/src/chart/area/Area.tsx
index 74e9c522..edc84a83 100644
--- a/packages/web-visualization/src/chart/area/Area.tsx
+++ b/packages/web-visualization/src/chart/area/Area.tsx
@@ -99,7 +99,8 @@ export const Area = memo<AreaProps>(
     transition,
     animate,
   }) => {
-    const { getSeries, getSeriesData, getXScale, getYScale, getXAxis } = useCartesianChartContext();
+    const { getSeries, getSeriesData, getXScale, getYScale, getXAxis, getYAxis, orientation } =
+      useCartesianChartContext();
 
     const matchedSeries = useMemo(() => getSeries(seriesId), [seriesId, getSeries]);
     const gradient = useMemo(
@@ -111,16 +112,18 @@ export const Area = memo<AreaProps>(
     const sourceData = useMemo(() => getSeriesData(seriesId), [seriesId, getSeriesData]);
 
     const xAxis = getXAxis();
+    const yAxis = getYAxis(matchedSeries?.yAxisId);
     const xScale = getXScale();
     const yScale = getYScale(matchedSeries?.yAxisId);
 
     const area = useMemo(() => {
       if (!sourceData || sourceData.length === 0 || !xScale || !yScale) return '';
 
-      // Get numeric x-axis data if available
-      const xData =
-        xAxis?.data && Array.isArray(xAxis.data) && typeof xAxis.data[0] === 'number'
-          ? (xAxis.data as number[])
+      // For horizontal orientation, use xAxis data; for vertical, use yAxis data
+      const categoryAxis = orientation === 'vertical' ? yAxis : xAxis;
+      const categoryData =
+        categoryAxis?.data && Array.isArray(categoryAxis.data) && typeof categoryAxis.data[0] === 'number'
+          ? (categoryAxis.data as number[])
           : undefined;
 
       return getAreaPath({
@@ -128,10 +131,12 @@ export const Area = memo<AreaProps>(
         xScale,
         yScale,
         curve,
-        xData,
+        xData: orientation === 'vertical' ? undefined : categoryData,
+        yData: orientation === 'vertical' ? categoryData : undefined,
         connectNulls,
+        orientation,
       });
-    }, [sourceData, xScale, yScale, curve, xAxis?.data, connectNulls]);
+    }, [sourceData, xScale, yScale, curve, xAxis?.data, yAxis?.data, connectNulls, orientation]);
 
     const AreaComponent = useMemo((): AreaComponent => {
       if (AreaComponentProp) {
diff --git a/packages/web-visualization/src/chart/bar/Bar.tsx b/packages/web-visualization/src/chart/bar/Bar.tsx
index 0dc9223a..1b12e4b0 100644
--- a/packages/web-visualization/src/chart/bar/Bar.tsx
+++ b/packages/web-visualization/src/chart/bar/Bar.tsx
@@ -42,9 +42,14 @@ export type BarBaseProps = {
   roundBottom?: boolean;
   /**
    * Y coordinate of the baseline/origin for animations.
-   * Used to calculate initial animation state.
+   * Used to calculate initial animation state for vertical bars.
    */
   originY?: number;
+  /**
+   * X coordinate of the baseline/origin for animations.
+   * Used to calculate initial animation state for horizontal bars.
+   */
+  originX?: number;
   /**
    * The x-axis data value for this bar.
    */
diff --git a/packages/web-visualization/src/chart/bar/BarChart.tsx b/packages/web-visualization/src/chart/bar/BarChart.tsx
index 8a136848..16902401 100644
--- a/packages/web-visualization/src/chart/bar/BarChart.tsx
+++ b/packages/web-visualization/src/chart/bar/BarChart.tsx
@@ -88,6 +88,7 @@ export const BarChart = memo(
         barMinSize,
         stackMinSize,
         transition,
+        orientation = 'horizontal',
         ...chartProps
       },
       ref,
@@ -123,8 +124,14 @@ export const BarChart = memo(
         ...yAxisVisualProps
       } = yAxis || {};
 
+      // Default scale types based on orientation:
+      // - Horizontal: X is category (band), Y is value (linear)
+      // - Vertical: Y is category (band), X is value (linear)
+      const defaultXScaleType = orientation === 'horizontal' ? 'band' : 'linear';
+      const defaultYScaleType = orientation === 'vertical' ? 'band' : undefined;
+
       const xAxisConfig: Partial<CartesianAxisConfigProps> = {
-        scaleType: xScaleType ?? 'band',
+        scaleType: xScaleType ?? defaultXScaleType,
         data: xData,
         categoryPadding: xCategoryPadding,
         domain: xDomain,
@@ -143,12 +150,24 @@ export const BarChart = memo(
         );
       }, [series]);
 
-      // Set default min domain to 0 for area chart, but only if there are no negative values
+      // Set default min domain to 0 for value axis, but only if there are no negative values
+      // For horizontal orientation, Y is the value axis
+      // For vertical orientation, X is the value axis
+      const xAxisDomain =
+        orientation === 'vertical' && !hasNegativeValues ? { min: 0, ...xDomain } : xDomain;
+      const yAxisDomain =
+        orientation === 'horizontal' && !hasNegativeValues ? { min: 0, ...yDomain } : yDomain;
+
+      const xAxisConfigWithDomain: Partial<CartesianAxisConfigProps> = {
+        ...xAxisConfig,
+        domain: xAxisDomain,
+      };
+
       const yAxisConfig: Partial<CartesianAxisConfigProps> = {
-        scaleType: yScaleType,
+        scaleType: yScaleType ?? defaultYScaleType,
         data: yData,
         categoryPadding: yCategoryPadding,
-        domain: hasNegativeValues ? yDomain : { min: 0, ...yDomain },
+        domain: yAxisDomain,
         domainLimit: yDomainLimit,
         range: yRange,
       };
@@ -157,8 +176,9 @@ export const BarChart = memo(
         <CartesianChart
           {...chartProps}
           ref={ref}
+          orientation={orientation}
           series={seriesToRender}
-          xAxis={xAxisConfig}
+          xAxis={xAxisConfigWithDomain}
           yAxis={yAxisConfig}
         >
           {showXAxis && <XAxis {...xAxisVisualProps} />}
diff --git a/packages/web-visualization/src/chart/bar/BarStack.tsx b/packages/web-visualization/src/chart/bar/BarStack.tsx
index d35a4589..5202efdc 100644
--- a/packages/web-visualization/src/chart/bar/BarStack.tsx
+++ b/packages/web-visualization/src/chart/bar/BarStack.tsx
@@ -110,9 +110,13 @@ export type BarStackComponentProps = Pick<
    */
   roundBottom?: boolean;
   /**
-   * The y-origin for animations (baseline position).
+   * The y-origin for animations (baseline position for vertical bars).
    */
   yOrigin?: number;
+  /**
+   * The x-origin for animations (baseline position for horizontal bars).
+   */
+  xOrigin?: number;
 };
 
 export type BarStackComponent = React.FC<BarStackComponentProps>;
diff --git a/packages/web-visualization/src/chart/bar/BarStackGroup.tsx b/packages/web-visualization/src/chart/bar/BarStackGroup.tsx
index 31ea2e64..e171fd98 100644
--- a/packages/web-visualization/src/chart/bar/BarStackGroup.tsx
+++ b/packages/web-visualization/src/chart/bar/BarStackGroup.tsx
@@ -6,6 +6,7 @@ import { isCategoricalScale } from '../utils/scale';
 
 import type { BarStackProps } from './BarStack';
 import { BarStack } from './BarStack';
+import { HorizontalBarStack } from './HorizontalBarStack';
 
 export type BarStackGroupProps = Pick<
   BarStackProps,
@@ -39,74 +40,98 @@ export type BarStackGroupProps = Pick<
 
 /**
  * BarStackGroup component that renders a group of stacks across all categories.
- * Delegates the actual stacking logic to BarStack for each category.
+ * Delegates the actual stacking logic to BarStack (vertical bars) or HorizontalBarStack (horizontal bars)
+ * for each category, based on chart orientation.
  */
 export const BarStackGroup = memo<BarStackGroupProps>(
   ({ series, yAxisId, stackIndex, totalStacks, barPadding = 0.1, ...props }) => {
-    const { getXScale, getYScale, drawingArea, dataLength } = useCartesianChartContext();
+    const { getXScale, getYScale, drawingArea, dataLength, orientation } =
+      useCartesianChartContext();
 
     const xScale = getXScale();
     const yScale = getYScale(yAxisId);
 
+    // For horizontal orientation: X is category axis, Y is value axis (vertical bars)
+    // For vertical orientation: Y is category axis, X is value axis (horizontal bars)
+    const categoryScale = orientation === 'vertical' ? yScale : xScale;
+    const valueScale = orientation === 'vertical' ? xScale : yScale;
+
     const stackConfigs = useMemo(() => {
-      if (!xScale || !yScale || !drawingArea || dataLength === 0) return [];
+      if (!categoryScale || !valueScale || !drawingArea || dataLength === 0) return [];
 
-      if (!isCategoricalScale(xScale)) {
+      if (!isCategoricalScale(categoryScale)) {
         return [];
       }
 
-      const categoryWidth = xScale.bandwidth();
+      const categorySize = categoryScale.bandwidth();
 
-      // Calculate width for each stack within a category
+      // Calculate size for each stack within a category
       // Only apply barPadding when there are multiple stacks
-      const gapWidth = totalStacks > 1 ? (categoryWidth * barPadding) / (totalStacks - 1) : 0;
-      const barWidth = categoryWidth / totalStacks - getBarSizeAdjustment(totalStacks, gapWidth);
+      const gapSize = totalStacks > 1 ? (categorySize * barPadding) / (totalStacks - 1) : 0;
+      const barSize = categorySize / totalStacks - getBarSizeAdjustment(totalStacks, gapSize);
 
       const configs: Array<{
         categoryIndex: number;
-        x: number;
-        width: number;
+        position: number;
+        size: number;
       }> = [];
 
       // Calculate position for each category
-      // todo: look at using xDomain for this instead of dataLength
       for (let categoryIndex = 0; categoryIndex < dataLength; categoryIndex++) {
-        // Get x position for this category
-        const categoryX = xScale(categoryIndex);
-        if (categoryX !== undefined) {
-          // Calculate x position for this specific stack within the category
-          const stackX = categoryX + stackIndex * (barWidth + gapWidth);
+        // Get position for this category
+        const categoryPosition = categoryScale(categoryIndex);
+        if (categoryPosition !== undefined) {
+          // Calculate position for this specific stack within the category
+          const stackPosition = categoryPosition + stackIndex * (barSize + gapSize);
 
           configs.push({
             categoryIndex,
-            x: stackX,
-            width: barWidth,
+            position: stackPosition,
+            size: barSize,
           });
         }
       }
 
       return configs;
-    }, [xScale, yScale, drawingArea, dataLength, stackIndex, totalStacks, barPadding]);
+    }, [categoryScale, valueScale, drawingArea, dataLength, stackIndex, totalStacks, barPadding]);
 
-    if (xScale && !isCategoricalScale(xScale)) {
+    if (categoryScale && !isCategoricalScale(categoryScale)) {
+      const axisName = orientation === 'vertical' ? 'y-axis' : 'x-axis';
       throw new Error(
-        'BarStackGroup requires a band scale for x-axis. See https://cds.coinbase.com/components/graphs/XAxis/#scale-type',
+        `BarStackGroup requires a band scale for ${axisName}. See https://cds.coinbase.com/components/graphs/XAxis/#scale-type`,
       );
     }
 
-    if (!yScale || !drawingArea || stackConfigs.length === 0) return null;
+    if (!valueScale || !drawingArea || stackConfigs.length === 0) return null;
+
+    // Render vertical bars (horizontal orientation) or horizontal bars (vertical orientation)
+    if (orientation === 'vertical') {
+      return stackConfigs.map(({ categoryIndex, position, size }) => (
+        <HorizontalBarStack
+          {...props}
+          key={`stack-${stackIndex}-category-${categoryIndex}`}
+          categoryIndex={categoryIndex}
+          height={size}
+          rect={drawingArea}
+          series={series}
+          xScale={valueScale}
+          y={position}
+          yAxisId={yAxisId}
+        />
+      ));
+    }
 
-    return stackConfigs.map(({ categoryIndex, x, width }) => (
+    return stackConfigs.map(({ categoryIndex, position, size }) => (
       <BarStack
         {...props}
         key={`stack-${stackIndex}-category-${categoryIndex}`}
         categoryIndex={categoryIndex}
         rect={drawingArea}
         series={series}
-        width={width}
-        x={x}
+        width={size}
+        x={position}
         yAxisId={yAxisId}
-        yScale={yScale}
+        yScale={valueScale}
       />
     ));
   },
diff --git a/packages/web-visualization/src/chart/bar/DefaultBar.tsx b/packages/web-visualization/src/chart/bar/DefaultBar.tsx
index c5cdf633..31478c17 100644
--- a/packages/web-visualization/src/chart/bar/DefaultBar.tsx
+++ b/packages/web-visualization/src/chart/bar/DefaultBar.tsx
@@ -6,6 +6,56 @@ import { getBarPath } from '../utils';
 
 import type { BarComponentProps } from './Bar';
 
+/**
+ * Creates an SVG path string for a horizontal bar with selective corner rounding.
+ * Used for horizontal bar charts where bars extend left/right from a baseline.
+ */
+const getHorizontalBarPath = (
+  x: number,
+  y: number,
+  width: number,
+  height: number,
+  radius: number,
+  roundRight: boolean,
+  roundLeft: boolean,
+): string => {
+  const roundBothSides = roundRight && roundLeft;
+  const r = Math.min(radius, height / 2, roundBothSides ? width / 2 : width);
+  const rightR = roundRight ? r : 0;
+  const leftR = roundLeft ? r : 0;
+
+  // Build path with selective rounding
+  // Start at top-left, go clockwise
+  let path = `M ${x + leftR} ${y}`;
+
+  // Top edge to top-right
+  path += ` L ${x + width - rightR} ${y}`;
+
+  // Top-right corner
+  path += ` A ${rightR} ${rightR} 0 0 1 ${x + width} ${y + rightR}`;
+
+  // Right edge to bottom-right
+  path += ` L ${x + width} ${y + height - rightR}`;
+
+  // Bottom-right corner
+  path += ` A ${rightR} ${rightR} 0 0 1 ${x + width - rightR} ${y + height}`;
+
+  // Bottom edge to bottom-left
+  path += ` L ${x + leftR} ${y + height}`;
+
+  // Bottom-left corner
+  path += ` A ${leftR} ${leftR} 0 0 1 ${x} ${y + height - leftR}`;
+
+  // Left edge to top-left
+  path += ` L ${x} ${y + leftR}`;
+
+  // Top-left corner
+  path += ` A ${leftR} ${leftR} 0 0 1 ${x + leftR} ${y}`;
+
+  path += ' Z';
+  return path;
+};
+
 export type DefaultBarProps = BarComponentProps & {
   /**
    * Custom class name for the bar.
@@ -15,19 +65,28 @@ export type DefaultBarProps = BarComponentProps & {
    * Custom styles for the bar.
    */
   style?: React.CSSProperties;
+  /**
+   * X coordinate of the baseline/origin for horizontal bar animations.
+   * When provided, the bar animates horizontally from this origin.
+   */
+  originX?: number;
 };
 
 /**
  * Default bar component that renders a solid bar with animation.
+ * Supports both vertical bars (animating from originY) and horizontal bars (animating from originX).
  */
 export const DefaultBar = memo<DefaultBarProps>(
   ({
     x,
+    y,
     width,
+    height,
     borderRadius = 4,
     roundTop,
     roundBottom,
     originY,
+    originX,
     d,
     fill = 'var(--color-fgPrimary)',
     fillOpacity = 1,
@@ -36,15 +95,44 @@ export const DefaultBar = memo<DefaultBarProps>(
     transition,
     ...props
   }) => {
-    const { animate } = useCartesianChartContext();
+    const { animate, orientation } = useCartesianChartContext();
 
     const initialPath = useMemo(() => {
       if (!animate) return undefined;
-      // Need a minimum height to allow for animation
+
+      // For horizontal bars (vertical orientation), animate from originX
+      if (orientation === 'vertical' && originX !== undefined) {
+        const minWidth = 1;
+        // Initial position: thin bar at the baseline (originX)
+        const initialX = originX;
+        return getHorizontalBarPath(
+          initialX,
+          y,
+          minWidth,
+          height,
+          borderRadius,
+          !!roundTop, // roundRight
+          !!roundBottom, // roundLeft
+        );
+      }
+
+      // For vertical bars (horizontal orientation), animate from originY
       const minHeight = 1;
       const initialY = (originY ?? 0) - minHeight;
       return getBarPath(x, initialY, width, minHeight, borderRadius, !!roundTop, !!roundBottom);
-    }, [animate, x, originY, width, borderRadius, roundTop, roundBottom]);
+    }, [
+      animate,
+      orientation,
+      originX,
+      originY,
+      x,
+      y,
+      width,
+      height,
+      borderRadius,
+      roundTop,
+      roundBottom,
+    ]);
 
     if (animate && initialPath) {
       return (
diff --git a/packages/web-visualization/src/chart/bar/DefaultBarStack.tsx b/packages/web-visualization/src/chart/bar/DefaultBarStack.tsx
index 932a3c5b..806d7995 100644
--- a/packages/web-visualization/src/chart/bar/DefaultBarStack.tsx
+++ b/packages/web-visualization/src/chart/bar/DefaultBarStack.tsx
@@ -6,6 +6,36 @@ import { getBarPath } from '../utils';
 
 import type { BarStackComponentProps } from './BarStack';
 
+/**
+ * Creates an SVG path string for a horizontal bar with selective corner rounding.
+ */
+const getHorizontalBarPath = (
+  x: number,
+  y: number,
+  width: number,
+  height: number,
+  radius: number,
+  roundRight: boolean,
+  roundLeft: boolean,
+): string => {
+  const roundBothSides = roundRight && roundLeft;
+  const r = Math.min(radius, height / 2, roundBothSides ? width / 2 : width);
+  const rightR = roundRight ? r : 0;
+  const leftR = roundLeft ? r : 0;
+
+  let path = `M ${x + leftR} ${y}`;
+  path += ` L ${x + width - rightR} ${y}`;
+  path += ` A ${rightR} ${rightR} 0 0 1 ${x + width} ${y + rightR}`;
+  path += ` L ${x + width} ${y + height - rightR}`;
+  path += ` A ${rightR} ${rightR} 0 0 1 ${x + width - rightR} ${y + height}`;
+  path += ` L ${x + leftR} ${y + height}`;
+  path += ` A ${leftR} ${leftR} 0 0 1 ${x} ${y + height - leftR}`;
+  path += ` L ${x} ${y + leftR}`;
+  path += ` A ${leftR} ${leftR} 0 0 1 ${x + leftR} ${y}`;
+  path += ' Z';
+  return path;
+};
+
 export type DefaultBarStackProps = BarStackComponentProps & {
   /**
    * Custom class name for the stack group.
@@ -15,10 +45,15 @@ export type DefaultBarStackProps = BarStackComponentProps & {
    * Custom styles for the stack group.
    */
   style?: React.CSSProperties;
+  /**
+   * X coordinate of the baseline/origin for horizontal bar animations.
+   */
+  xOrigin?: number;
 };
 
 /**
  * Default stack component that renders children in a group with animated clip path.
+ * Supports both vertical bars (animating from yOrigin) and horizontal bars (animating from xOrigin).
  */
 export const DefaultBarStack = memo<DefaultBarStackProps>(
   ({
@@ -33,19 +68,32 @@ export const DefaultBarStack = memo<DefaultBarStackProps>(
     roundTop = true,
     roundBottom = true,
     yOrigin,
+    xOrigin,
     transition,
   }) => {
-    const { animate } = useCartesianChartContext();
+    const { animate, orientation } = useCartesianChartContext();
     const clipPathId = useId();
 
     const clipPathData = useMemo(() => {
+      if (orientation === 'vertical') {
+        // For horizontal bars, roundTop = roundRight, roundBottom = roundLeft
+        return getHorizontalBarPath(x, y, width, height, borderRadius, roundTop, roundBottom);
+      }
       return getBarPath(x, y, width, height, borderRadius, roundTop, roundBottom);
-    }, [x, y, width, height, borderRadius, roundTop, roundBottom]);
+    }, [x, y, width, height, borderRadius, roundTop, roundBottom, orientation]);
 
     const initialClipPathData = useMemo(() => {
       if (!animate) return undefined;
+
+      if (orientation === 'vertical') {
+        // For horizontal bars, animate from xOrigin (baseline)
+        const initialX = xOrigin ?? x;
+        return getHorizontalBarPath(initialX, y, 1, height, borderRadius, roundTop, roundBottom);
+      }
+
+      // For vertical bars, animate from yOrigin (baseline)
       return getBarPath(x, yOrigin ?? y + height, width, 1, borderRadius, roundTop, roundBottom);
-    }, [animate, x, yOrigin, y, height, width, borderRadius, roundTop, roundBottom]);
+    }, [animate, orientation, x, xOrigin, y, yOrigin, height, width, borderRadius, roundTop, roundBottom]);
 
     return (
       <>
diff --git a/packages/web-visualization/src/chart/bar/HorizontalBar.tsx b/packages/web-visualization/src/chart/bar/HorizontalBar.tsx
new file mode 100644
index 00000000..f2683e4c
--- /dev/null
+++ b/packages/web-visualization/src/chart/bar/HorizontalBar.tsx
@@ -0,0 +1,207 @@
+import React, { memo, useMemo } from 'react';
+import type { SVGProps } from 'react';
+import type { Transition } from 'framer-motion';
+
+import { DefaultBar } from './';
+import type { BarComponent } from './Bar';
+
+/**
+ * Creates an SVG path string for a horizontal bar with selective corner rounding.
+ * Used for horizontal bar charts where bars extend left/right from a baseline.
+ */
+const getHorizontalBarPath = (
+  x: number,
+  y: number,
+  width: number,
+  height: number,
+  radius: number,
+  roundRight: boolean,
+  roundLeft: boolean,
+): string => {
+  const roundBothSides = roundRight && roundLeft;
+  const r = Math.min(radius, height / 2, roundBothSides ? width / 2 : width);
+  const rightR = roundRight ? r : 0;
+  const leftR = roundLeft ? r : 0;
+
+  // Build path with selective rounding
+  // Start at top-left, go clockwise
+  let path = `M ${x + leftR} ${y}`;
+
+  // Top edge to top-right
+  path += ` L ${x + width - rightR} ${y}`;
+
+  // Top-right corner
+  path += ` A ${rightR} ${rightR} 0 0 1 ${x + width} ${y + rightR}`;
+
+  // Right edge to bottom-right
+  path += ` L ${x + width} ${y + height - rightR}`;
+
+  // Bottom-right corner
+  path += ` A ${rightR} ${rightR} 0 0 1 ${x + width - rightR} ${y + height}`;
+
+  // Bottom edge to bottom-left
+  path += ` L ${x + leftR} ${y + height}`;
+
+  // Bottom-left corner
+  path += ` A ${leftR} ${leftR} 0 0 1 ${x} ${y + height - leftR}`;
+
+  // Left edge to top-left
+  path += ` L ${x} ${y + leftR}`;
+
+  // Top-left corner
+  path += ` A ${leftR} ${leftR} 0 0 1 ${x + leftR} ${y}`;
+
+  path += ' Z';
+  return path;
+};
+
+export type HorizontalBarBaseProps = {
+  /**
+   * The series ID this bar belongs to.
+   */
+  seriesId?: string;
+  /**
+   * X coordinate of the bar (left edge).
+   */
+  x: number;
+  /**
+   * Y coordinate of the bar (top edge).
+   */
+  y: number;
+  /**
+   * Width of the bar.
+   */
+  width: number;
+  /**
+   * Height of the bar.
+   */
+  height: number;
+  /**
+   * Border radius for the bar.
+   * @default 4
+   */
+  borderRadius?: number;
+  /**
+   * Whether to round the right side of the bar (away from baseline for positive values).
+   */
+  roundRight?: boolean;
+  /**
+   * Whether to round the left side of the bar (toward baseline for positive values).
+   */
+  roundLeft?: boolean;
+  /**
+   * X coordinate of the baseline/origin for animations.
+   * Used to calculate initial animation state.
+   */
+  originX?: number;
+  /**
+   * The x-axis data value for this bar.
+   */
+  dataX?: number | [number, number] | null;
+  /**
+   * The y-axis data value for this bar (category index).
+   */
+  dataY?: number | string;
+  /**
+   * Fill color for the bar.
+   */
+  fill?: string;
+  /**
+   * Fill opacity for the bar.
+   */
+  fillOpacity?: number;
+  /**
+   * Stroke color for the bar outline.
+   */
+  stroke?: string;
+  /**
+   * Stroke width for the bar outline.
+   */
+  strokeWidth?: number;
+  /**
+   * Component to render the bar.
+   */
+  BarComponent?: BarComponent;
+};
+
+export type HorizontalBarProps = HorizontalBarBaseProps & {
+  /**
+   * Transition configuration for animation.
+   */
+  transition?: Transition;
+};
+
+export type HorizontalBarComponentProps = Omit<HorizontalBarProps, 'BarComponent'> & {
+  /**
+   * The path data for the bar shape.
+   */
+  d: SVGProps<SVGPathElement>['d'];
+};
+
+/**
+ * Horizontal bar component that renders a single bar extending horizontally.
+ * Used in vertical orientation charts where bars extend left/right from a baseline.
+ *
+ * @example
+ * ```tsx
+ * <HorizontalBar x={10} y={20} width={100} height={30} fill="blue" />
+ * ```
+ */
+export const HorizontalBar = memo<HorizontalBarProps>(
+  ({
+    seriesId,
+    x,
+    y,
+    width,
+    height,
+    originX,
+    dataX,
+    dataY,
+    BarComponent = DefaultBar,
+    fill = 'var(--color-fgPrimary)',
+    fillOpacity = 1,
+    stroke,
+    strokeWidth,
+    borderRadius = 4,
+    roundRight = true,
+    roundLeft = true,
+    transition,
+  }) => {
+    const barPath = useMemo(() => {
+      return getHorizontalBarPath(x, y, width, height, borderRadius, roundRight, roundLeft);
+    }, [x, y, width, height, borderRadius, roundRight, roundLeft]);
+
+    const effectiveOriginX = originX ?? x;
+
+    if (!barPath) return;
+
+    // Map horizontal bar props to BarComponent props
+    // BarComponent expects roundTop/roundBottom, we map roundRight/roundLeft
+    // dataX can be number | [number, number] | null, but BarComponent expects number | string | undefined
+    const normalizedDataX =
+      dataX === null ? undefined : Array.isArray(dataX) ? dataX[dataX.length - 1] : dataX;
+
+    return (
+      <BarComponent
+        borderRadius={borderRadius}
+        d={barPath}
+        dataX={normalizedDataX}
+        dataY={typeof dataY === 'number' ? dataY : undefined}
+        fill={fill}
+        fillOpacity={fillOpacity}
+        height={height}
+        originX={effectiveOriginX} // For horizontal bars, animate from X baseline
+        originY={y}
+        roundBottom={roundLeft}
+        roundTop={roundRight}
+        seriesId={seriesId}
+        stroke={stroke}
+        strokeWidth={strokeWidth}
+        transition={transition}
+        width={width}
+        x={x}
+        y={y}
+      />
+    );
+  },
+);
diff --git a/packages/web-visualization/src/chart/bar/HorizontalBarStack.tsx b/packages/web-visualization/src/chart/bar/HorizontalBarStack.tsx
new file mode 100644
index 00000000..05017b24
--- /dev/null
+++ b/packages/web-visualization/src/chart/bar/HorizontalBarStack.tsx
@@ -0,0 +1,434 @@
+import React, { memo, useMemo } from 'react';
+import type { Rect } from '@coinbase/cds-common';
+import type { Transition } from 'framer-motion';
+
+import { useCartesianChartContext } from '../ChartProvider';
+import type { CartesianSeries, ChartScaleFunction } from '../utils';
+import { evaluateGradientAtValue, getGradientConfig } from '../utils/gradient';
+
+import type { BarComponent, BarProps } from './Bar';
+import { DefaultBarStack } from './DefaultBarStack';
+import { HorizontalBar } from './HorizontalBar';
+import type { BarStackComponent, BarStackComponentProps } from './BarStack';
+
+const EPSILON = 1e-4;
+
+/**
+ * Extended series type that includes bar-specific properties.
+ */
+export type HorizontalBarSeries = CartesianSeries & {
+  /**
+   * Custom component to render bars for this series.
+   */
+  BarComponent?: BarComponent;
+};
+
+export type HorizontalBarStackBaseProps = Pick<
+  BarProps,
+  'BarComponent' | 'fillOpacity' | 'stroke' | 'strokeWidth' | 'borderRadius'
+> & {
+  /**
+   * Array of series configurations that belong to this stack.
+   */
+  series: HorizontalBarSeries[];
+  /**
+   * The category index for this stack.
+   */
+  categoryIndex: number;
+  /**
+   * Y position for this stack (top edge).
+   */
+  y: number;
+  /**
+   * Height of this stack.
+   */
+  height: number;
+  /**
+   * X scale function (value axis for horizontal bars).
+   */
+  xScale: ChartScaleFunction;
+  /**
+   * Chart rect for bounds.
+   */
+  rect: Rect;
+  /**
+   * Y axis ID to use.
+   * If not provided, will use the yAxisId from the first series.
+   */
+  yAxisId?: string;
+  /**
+   * Custom component to render the stack container.
+   * Can be used to add clip paths, outlines, or other custom styling.
+   * @default DefaultBarStack
+   */
+  BarStackComponent?: BarStackComponent;
+  /**
+   * Whether to round the baseline of a bar (where the value is 0).
+   */
+  roundBaseline?: boolean;
+  /**
+   * Gap between bars in the stack.
+   */
+  stackGap?: number;
+  /**
+   * Minimum size for individual bars in the stack.
+   */
+  barMinSize?: number;
+  /**
+   * Minimum size for the entire stack.
+   */
+  stackMinSize?: number;
+};
+
+export type HorizontalBarStackProps = HorizontalBarStackBaseProps & {
+  /**
+   * Transition configuration for animation.
+   */
+  transition?: Transition;
+};
+
+/**
+ * HorizontalBarStack component that renders a single stack of horizontal bars at a specific category index.
+ * Handles the stacking logic for bars within a single category, extending horizontally from the baseline.
+ */
+export const HorizontalBarStack = memo<HorizontalBarStackProps>(
+  ({
+    series,
+    categoryIndex,
+    y,
+    height,
+    xScale,
+    rect,
+    BarComponent: defaultBarComponent,
+    fillOpacity: defaultFillOpacity,
+    stroke: defaultStroke,
+    strokeWidth: defaultStrokeWidth,
+    borderRadius = 4,
+    BarStackComponent = DefaultBarStack,
+    stackGap,
+    barMinSize,
+    stackMinSize,
+    roundBaseline,
+    transition,
+  }) => {
+    const { getSeriesData, getYAxis, getYScale, getSeries } = useCartesianChartContext();
+
+    const yScale = getYScale();
+    const barMinSizePx = barMinSize;
+    const stackMinSizePx = stackMinSize;
+
+    const yAxis = getYAxis();
+
+    // Calculate baseline (x position where value is 0)
+    const baseline = useMemo(() => {
+      const domain = xScale.domain();
+      const [domainMin, domainMax] = domain;
+      const baselineValue = domainMin >= 0 ? domainMin : domainMax <= 0 ? domainMax : 0;
+      const baseline = xScale(baselineValue) ?? rect.x;
+
+      return Math.max(rect.x, Math.min(baseline, rect.x + rect.width));
+    }, [rect.width, rect.x, xScale]);
+
+    const seriesGradients = useMemo(() => {
+      return series.map((s) => {
+        if (!s.gradient || !xScale || !yScale) return null;
+
+        const gradientScale = s.gradient.axis === 'x' ? xScale : yScale;
+        const stops = getGradientConfig(s.gradient, xScale, yScale);
+        if (!stops) return null;
+
+        return {
+          seriesId: s.id,
+          gradient: s.gradient,
+          scale: gradientScale,
+          stops,
+        };
+      });
+    }, [series, xScale, yScale]);
+
+    // Calculate bars for this specific category
+    const { bars, stackRect } = useMemo(() => {
+      let allBars: Array<{
+        seriesId: string;
+        x: number;
+        y: number;
+        width: number;
+        height: number;
+        dataX?: number | [number, number] | null;
+        BarComponent?: BarComponent;
+        fill?: string;
+        fillOpacity?: number;
+        stroke?: string;
+        strokeWidth?: number;
+        borderRadius?: BarProps['borderRadius'];
+        roundRight?: boolean;
+        roundLeft?: boolean;
+        shouldApplyGap?: boolean;
+      }> = [];
+
+      // Track how many bars we've stacked in each direction for gap calculation
+      let positiveBarCount = 0;
+      let negativeBarCount = 0;
+
+      // Track stack bounds for clipping
+      let minX = Infinity;
+      let maxX = -Infinity;
+
+      // Process each series in the stack
+      series.forEach((s) => {
+        const data = getSeriesData(s.id);
+        if (!data) return;
+
+        const value = data[categoryIndex];
+        if (value === null || value === undefined) return;
+
+        const originalData = s.data;
+        const originalValue = originalData?.[categoryIndex];
+        // Only apply gap logic if the original data wasn't tuple format
+        const shouldApplyGap = !Array.isArray(originalValue);
+
+        // Sort to be in ascending order
+        const [left, right] = (value as [number, number]).sort((a, b) => a - b);
+
+        const isRightOfBaseline = left >= 0 && right !== left;
+        const isLeftOfBaseline = left <= 0 && left !== right;
+
+        const barLeft = xScale(left) ?? baseline;
+        const barRight = xScale(right) ?? baseline;
+
+        // Track bar counts for later gap calculations
+        if (shouldApplyGap) {
+          if (isRightOfBaseline) {
+            positiveBarCount++;
+          } else if (isLeftOfBaseline) {
+            negativeBarCount++;
+          }
+        }
+
+        // Calculate width
+        const width = Math.abs(barRight - barLeft);
+        const x = Math.min(barLeft, barRight);
+
+        // Skip bars that would have zero or negative width
+        if (width <= 0) {
+          return;
+        }
+
+        // Update stack bounds
+        minX = Math.min(minX, x);
+        maxX = Math.max(maxX, x + width);
+
+        let barFill = s.color ?? 'var(--color-fgPrimary)';
+
+        // Evaluate gradient if provided (using precomputed stops)
+        const seriesGradientConfig = seriesGradients.find((g) => g?.seriesId === s.id);
+        if (seriesGradientConfig && originalValue !== null && originalValue !== undefined) {
+          const axis = seriesGradientConfig.gradient.axis ?? 'x';
+          let evalValue: number;
+          if (axis === 'y') {
+            evalValue = categoryIndex;
+          } else {
+            evalValue = Array.isArray(originalValue) ? originalValue[1] : originalValue;
+          }
+          const evaluatedColor = evaluateGradientAtValue(
+            seriesGradientConfig.stops,
+            evalValue,
+            seriesGradientConfig.scale,
+          );
+          if (evaluatedColor) {
+            barFill = evaluatedColor;
+          }
+        }
+
+        allBars.push({
+          seriesId: s.id,
+          x,
+          y,
+          width,
+          height,
+          dataX: value,
+          fill: barFill,
+          // Check if the bar should be rounded based on the baseline
+          roundRight: roundBaseline || Math.abs(barRight - baseline) >= EPSILON,
+          roundLeft: roundBaseline || Math.abs(barLeft - baseline) >= EPSILON,
+          BarComponent: s.BarComponent,
+          shouldApplyGap,
+        });
+      });
+
+      // Apply proportional gap distribution to maintain total stack width
+      if (stackGap && allBars.length > 1) {
+        // Separate bars by baseline side
+        const barsRightOfBaseline = allBars.filter((bar) => {
+          const [left, right] = (bar.dataX as [number, number]).sort((a, b) => a - b);
+          return left >= 0 && right !== left && bar.shouldApplyGap;
+        });
+        const barsLeftOfBaseline = allBars.filter((bar) => {
+          const [left, right] = (bar.dataX as [number, number]).sort((a, b) => a - b);
+          return left <= 0 && left !== right && bar.shouldApplyGap;
+        });
+
+        // Apply proportional gaps to bars right of baseline
+        if (barsRightOfBaseline.length > 1) {
+          const totalGapSpace = stackGap * (barsRightOfBaseline.length - 1);
+          const totalDataWidth = barsRightOfBaseline.reduce((sum, bar) => sum + bar.width, 0);
+          const widthReduction = totalGapSpace / totalDataWidth;
+
+          const sortedBars = barsRightOfBaseline.sort((a, b) => a.x - b.x);
+
+          let currentX = baseline;
+          sortedBars.forEach((bar, index) => {
+            const newWidth = bar.width * (1 - widthReduction);
+
+            const barIndex = allBars.findIndex((b) => b.seriesId === bar.seriesId);
+            if (barIndex !== -1) {
+              allBars[barIndex] = {
+                ...allBars[barIndex],
+                width: newWidth,
+                x: currentX,
+              };
+            }
+
+            currentX = currentX + newWidth + (index < sortedBars.length - 1 ? stackGap : 0);
+          });
+        }
+
+        // Apply proportional gaps to bars left of baseline
+        if (barsLeftOfBaseline.length > 1) {
+          const totalGapSpace = stackGap * (barsLeftOfBaseline.length - 1);
+          const totalDataWidth = barsLeftOfBaseline.reduce((sum, bar) => sum + bar.width, 0);
+          const widthReduction = totalGapSpace / totalDataWidth;
+
+          const sortedBars = barsLeftOfBaseline.sort((a, b) => b.x - a.x);
+
+          let currentX = baseline;
+          sortedBars.forEach((bar, index) => {
+            const newWidth = bar.width * (1 - widthReduction);
+            const newX = currentX - newWidth;
+
+            const barIndex = allBars.findIndex((b) => b.seriesId === bar.seriesId);
+            if (barIndex !== -1) {
+              allBars[barIndex] = {
+                ...allBars[barIndex],
+                width: newWidth,
+                x: newX,
+              };
+            }
+
+            currentX = newX - (index < sortedBars.length - 1 ? stackGap : 0);
+          });
+        }
+
+        // Recalculate stack bounds after gap adjustments
+        if (allBars.length > 0) {
+          minX = Math.min(...allBars.map((bar) => bar.x));
+          maxX = Math.max(...allBars.map((bar) => bar.x + bar.width));
+        }
+      }
+
+      // Apply border radius logic
+      const applyBorderRadiusLogic = (bars: typeof allBars) => {
+        return bars
+          .sort((a, b) => a.x - b.x)
+          .map((a, index) => {
+            const barBefore = index > 0 ? bars[index - 1] : null;
+            const barAfter = index < bars.length - 1 ? bars[index + 1] : null;
+
+            const shouldRoundRight =
+              index === bars.length - 1 ||
+              (a.shouldApplyGap && stackGap) ||
+              (!a.shouldApplyGap && barAfter && barAfter.x !== a.x + a.width);
+
+            const shouldRoundLeft =
+              index === 0 ||
+              (a.shouldApplyGap && stackGap) ||
+              (!a.shouldApplyGap && barBefore && barBefore.x + barBefore.width !== a.x);
+
+            return {
+              ...a,
+              roundRight: Boolean(a.roundRight && shouldRoundRight),
+              roundLeft: Boolean(a.roundLeft && shouldRoundLeft),
+            };
+          });
+      };
+
+      allBars = applyBorderRadiusLogic(allBars);
+
+      // Calculate the bounding rect for the entire stack
+      let stackBounds = {
+        x: minX === Infinity ? baseline : minX,
+        y,
+        width: maxX === -Infinity ? 0 : maxX - minX,
+        height,
+      };
+
+      return { bars: allBars, stackRect: stackBounds };
+    }, [
+      series,
+      stackGap,
+      barMinSizePx,
+      y,
+      baseline,
+      height,
+      stackMinSizePx,
+      getSeriesData,
+      categoryIndex,
+      xScale,
+      seriesGradients,
+      roundBaseline,
+    ]);
+
+    const yData =
+      yAxis?.data && Array.isArray(yAxis.data) && typeof yAxis.data[0] === 'number'
+        ? (yAxis.data as number[])
+        : undefined;
+    const dataY = yData ? yData[categoryIndex] : categoryIndex;
+
+    const barElements = bars.map((bar, index) => (
+      <HorizontalBar
+        key={`${bar.seriesId}-${categoryIndex}-${index}`}
+        BarComponent={bar.BarComponent || defaultBarComponent}
+        borderRadius={borderRadius}
+        dataX={bar.dataX}
+        dataY={dataY}
+        fill={bar.fill}
+        fillOpacity={bar.fillOpacity ?? defaultFillOpacity}
+        height={bar.height}
+        originX={baseline}
+        roundLeft={bar.roundLeft}
+        roundRight={bar.roundRight}
+        seriesId={bar.seriesId}
+        stroke={bar.stroke ?? defaultStroke}
+        strokeWidth={bar.strokeWidth ?? defaultStrokeWidth}
+        transition={transition}
+        width={bar.width}
+        x={bar.x}
+        y={bar.y}
+      />
+    ));
+
+    // Check if the stack should be rounded based on the baseline
+    const stackRoundRight =
+      roundBaseline || Math.abs(stackRect.x + stackRect.width - baseline) >= EPSILON;
+    const stackRoundLeft = roundBaseline || Math.abs(stackRect.x - baseline) >= EPSILON;
+
+    return (
+      <BarStackComponent
+        borderRadius={borderRadius}
+        categoryIndex={categoryIndex}
+        height={stackRect.height}
+        roundBottom={stackRoundLeft}
+        roundTop={stackRoundRight}
+        transition={transition}
+        width={stackRect.width}
+        x={stackRect.x}
+        xOrigin={baseline}
+        y={stackRect.y}
+        yOrigin={y}
+      >
+        {barElements}
+      </BarStackComponent>
+    );
+  },
+);
+
diff --git a/packages/web-visualization/src/chart/index.ts b/packages/web-visualization/src/chart/index.ts
index 1b46a167..da91fd8c 100644
--- a/packages/web-visualization/src/chart/index.ts
+++ b/packages/web-visualization/src/chart/index.ts
@@ -16,6 +16,7 @@ export * from './PeriodSelector';
 export * from './pie/index';
 export * from './point/index';
 export * from './PolarChart';
+export * from './progress/index';
 export * from './scrubber/index';
 export * from './text/index';
 export * from './utils/index';
diff --git a/packages/web-visualization/src/chart/line/Line.tsx b/packages/web-visualization/src/chart/line/Line.tsx
index a70b4859..793ea91f 100644
--- a/packages/web-visualization/src/chart/line/Line.tsx
+++ b/packages/web-visualization/src/chart/line/Line.tsx
@@ -157,8 +157,16 @@ export const Line = memo<LineProps>(
     gradient: gradientProp,
     ...props
   }) => {
-    const { animate, getSeries, getSeriesData, getXScale, getYScale, getXAxis, getYAxis } =
-      useCartesianChartContext();
+    const {
+      animate,
+      getSeries,
+      getSeriesData,
+      getXScale,
+      getYScale,
+      getXAxis,
+      getYAxis,
+      orientation,
+    } = useCartesianChartContext();
 
     const matchedSeries = useMemo(() => getSeries(seriesId), [getSeries, seriesId]);
     const gradient = useMemo(
@@ -168,6 +176,7 @@ export const Line = memo<LineProps>(
     const sourceData = useMemo(() => getSeriesData(seriesId), [getSeriesData, seriesId]);
 
     const xAxis = useMemo(() => getXAxis(), [getXAxis]);
+    const yAxis = useMemo(() => getYAxis(matchedSeries?.yAxisId), [getYAxis, matchedSeries?.yAxisId]);
     const xScale = useMemo(() => getXScale(), [getXScale]);
     const yScale = useMemo(
       () => getYScale(matchedSeries?.yAxisId),
@@ -180,10 +189,11 @@ export const Line = memo<LineProps>(
     const path = useMemo(() => {
       if (!xScale || !yScale || chartData.length === 0) return '';
 
-      // Get numeric x-axis data if available
-      const xData =
-        xAxis?.data && Array.isArray(xAxis.data) && typeof xAxis.data[0] === 'number'
-          ? (xAxis.data as number[])
+      // For horizontal orientation, use xAxis data; for vertical, use yAxis data
+      const categoryAxis = orientation === 'vertical' ? yAxis : xAxis;
+      const categoryData =
+        categoryAxis?.data && Array.isArray(categoryAxis.data) && typeof categoryAxis.data[0] === 'number'
+          ? (categoryAxis.data as number[])
           : undefined;
 
       return getLinePath({
@@ -191,10 +201,12 @@ export const Line = memo<LineProps>(
         xScale,
         yScale,
         curve,
-        xData,
+        xData: orientation === 'vertical' ? undefined : categoryData,
+        yData: orientation === 'vertical' ? categoryData : undefined,
         connectNulls,
+        orientation,
       });
-    }, [chartData, xScale, yScale, curve, xAxis?.data, connectNulls]);
+    }, [chartData, xScale, yScale, curve, xAxis?.data, yAxis?.data, connectNulls, orientation]);
 
     const LineComponent = useMemo((): LineComponent => {
       if (SelectedLineComponent) {
diff --git a/packages/web-visualization/src/chart/progress/SegmentedProgressChart.tsx b/packages/web-visualization/src/chart/progress/SegmentedProgressChart.tsx
new file mode 100644
index 00000000..0d4444f4
--- /dev/null
+++ b/packages/web-visualization/src/chart/progress/SegmentedProgressChart.tsx
@@ -0,0 +1,348 @@
+import { forwardRef, memo, useMemo } from 'react';
+import { Box, VStack, type VStackProps } from '@coinbase/cds-web/layout';
+import { Text } from '@coinbase/cds-web/typography';
+
+import { XAxis, type XAxisProps, YAxis, type YAxisProps } from '../axis';
+import { BarPlot, type BarPlotProps } from '../bar';
+import {
+  CartesianChart,
+  type CartesianChartBaseProps,
+  type CartesianChartProps,
+} from '../CartesianChart';
+import { DefaultLegendShape, type LegendShapeProps } from '../legend/DefaultLegendShape';
+import { type CartesianAxisConfigProps, type GradientDefinition, type LegendShape } from '../utils';
+
+/**
+ * A single segment in the progress chart.
+ * Unlike BarSeries which accepts an array of data points,
+ * ProgressSegment accepts a single value representing this segment's portion.
+ */
+export type ProgressSegment = {
+  /**
+   * Unique identifier for the segment.
+   */
+  id: string;
+  /**
+   * The value for this segment.
+   * All segment values should sum to 100 (or your custom max) to represent proportions.
+   */
+  value: number;
+  /**
+   * Label displayed in the legend.
+   * Defaults to the segment id if not provided.
+   */
+  label?: string;
+  /**
+   * Color of the segment.
+   * @default 'var(--color-fgPrimary)'
+   */
+  color?: string;
+  /**
+   * Optional gradient for the segment.
+   */
+  gradient?: GradientDefinition;
+  /**
+   * Shape to display in the legend.
+   * @default 'circle'
+   */
+  legendShape?: LegendShape;
+};
+
+/**
+ * Props for the standalone progress legend.
+ */
+export type ProgressLegendProps = Pick<VStackProps<'div'>, 'justifyContent' | 'flexDirection'> & {
+  /**
+   * The segments to display in the legend.
+   */
+  segments: Array<ProgressSegment>;
+  /**
+   * Gap between legend items.
+   * @default 2
+   */
+  gap?: VStackProps<'div'>['gap'];
+  /**
+   * Custom component to render the legend shape.
+   */
+  ShapeComponent?: React.FC<LegendShapeProps>;
+};
+
+/**
+ * Standalone legend component for the progress chart.
+ * Does not require chart context.
+ */
+const ProgressLegend = memo<ProgressLegendProps>(
+  ({
+    segments,
+    gap = 2,
+    justifyContent = 'space-between',
+    flexDirection = 'row',
+    ShapeComponent = DefaultLegendShape,
+  }) => {
+    return (
+      <Box
+        alignItems="center"
+        columnGap={gap}
+        display="flex"
+        flexDirection={flexDirection}
+        flexWrap="wrap"
+        justifyContent={justifyContent}
+        rowGap={1}
+      >
+        {segments.map((segment) => (
+          <Box key={segment.id} alignItems="center" display="flex" gap={1}>
+            <ShapeComponent
+              color={segment.color ?? 'var(--color-fgPrimary)'}
+              shape={segment.legendShape ?? 'circle'}
+            />
+            <Text font="label1">{segment.label ?? segment.id}</Text>
+          </Box>
+        ))}
+      </Box>
+    );
+  },
+);
+
+export type SegmentedProgressChartBaseProps = Omit<
+  CartesianChartBaseProps,
+  'xAxis' | 'yAxis' | 'series' | 'orientation'
+> &
+  Pick<
+    BarPlotProps,
+    | 'BarComponent'
+    | 'fillOpacity'
+    | 'stroke'
+    | 'strokeWidth'
+    | 'borderRadius'
+    | 'BarStackComponent'
+    | 'stackGap'
+    | 'roundBaseline'
+    | 'transition'
+  > & {
+    /**
+     * The segments to display in the progress bar.
+     * Each segment represents a portion of the total.
+     */
+    segments: Array<ProgressSegment>;
+    /**
+     * Maximum value for the progress bar.
+     * Segment values should sum to this value.
+     * @default 100
+     */
+    max?: number;
+    /**
+     * Whether to show the legend.
+     * @default true
+     */
+    showLegend?: boolean;
+    /**
+     * Position of the legend relative to the progress bar.
+     * @default 'bottom'
+     */
+    legendPosition?: 'top' | 'bottom';
+    /**
+     * Props to pass to the legend.
+     */
+    legendProps?: Omit<ProgressLegendProps, 'segments'>;
+    /**
+     * Whether to show the X axis (value axis).
+     * @default false
+     */
+    showXAxis?: boolean;
+    /**
+     * Whether to show the Y axis (category axis).
+     * @default false
+     */
+    showYAxis?: boolean;
+    /**
+     * Configuration for x-axis (value axis).
+     */
+    xAxis?: Partial<CartesianAxisConfigProps> & XAxisProps;
+    /**
+     * Configuration for y-axis (category axis).
+     */
+    yAxis?: Partial<CartesianAxisConfigProps> & YAxisProps;
+    /**
+     * Optional category label for the progress bar.
+     * If not provided, an empty label is used.
+     */
+    category?: string;
+    /**
+     * Height of the progress bar itself (excluding legend).
+     * @default 24
+     */
+    barHeight?: number;
+    /**
+     * Gap between the progress bar and legend.
+     * @default 2
+     */
+    legendGap?: 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
+  };
+
+export type SegmentedProgressChartProps = SegmentedProgressChartBaseProps &
+  Omit<CartesianChartProps, 'xAxis' | 'yAxis' | 'series' | 'orientation'>;
+
+const DEFAULT_STACK_ID = 'progress-stack';
+
+/**
+ * A chart component for displaying segmented progress bars.
+ * Useful for showing proportions like "bought vs sold" or portfolio allocations.
+ *
+ * @example
+ * ```tsx
+ * <SegmentedProgressChart
+ *   segments={[
+ *     { id: 'bought', value: 76, label: '76% bought', color: 'var(--color-accentBoldGreen)' },
+ *     { id: 'sold', value: 24, label: '24% sold', color: 'var(--color-accentBoldRed)' },
+ *   ]}
+ * />
+ * ```
+ */
+export const SegmentedProgressChart = memo(
+  forwardRef<SVGSVGElement, SegmentedProgressChartProps>(
+    (
+      {
+        segments,
+        max = 100,
+        showLegend = true,
+        legendPosition = 'bottom',
+        legendProps,
+        legendGap = 2,
+        showXAxis = false,
+        showYAxis = false,
+        xAxis,
+        yAxis,
+        category = '',
+        barHeight = 24,
+        children,
+        BarComponent,
+        fillOpacity,
+        stroke,
+        strokeWidth,
+        borderRadius = 4,
+        BarStackComponent,
+        stackGap = 4,
+        roundBaseline = true,
+        transition,
+        height,
+        ...chartProps
+      },
+      ref,
+    ) => {
+      // Convert ProgressSegments to CartesianSeries format
+      const series = useMemo(() => {
+        return segments.map((segment) => ({
+          id: segment.id,
+          data: [segment.value],
+          label: segment.label ?? segment.id,
+          color: segment.color,
+          gradient: segment.gradient,
+          legendShape: segment.legendShape ?? 'circle',
+          stackId: DEFAULT_STACK_ID,
+        }));
+      }, [segments]);
+
+      const seriesIds = useMemo(() => segments.map((s) => s.id), [segments]);
+
+      // Split axis props into config props for Chart and visual props for axis components
+      const {
+        scaleType: xScaleType,
+        data: xData,
+        categoryPadding: xCategoryPadding,
+        domain: xDomain,
+        domainLimit: xDomainLimit,
+        range: xRange,
+        ...xAxisVisualProps
+      } = xAxis || {};
+
+      const {
+        scaleType: yScaleType,
+        data: yData,
+        categoryPadding: yCategoryPadding,
+        domain: yDomain,
+        domainLimit: yDomainLimit,
+        range: yRange,
+        id: yAxisId,
+        ...yAxisVisualProps
+      } = yAxis || {};
+
+      // X axis is the value axis (linear, 0 to max)
+      const xAxisConfig: Partial<CartesianAxisConfigProps> = {
+        scaleType: xScaleType ?? 'linear',
+        data: xData,
+        categoryPadding: xCategoryPadding,
+        domain: xDomain ?? { min: 0, max },
+        domainLimit: xDomainLimit,
+        range: xRange,
+      };
+
+      // Y axis is the category axis (band scale with single category)
+      const yAxisConfig: Partial<CartesianAxisConfigProps> = {
+        scaleType: yScaleType ?? 'band',
+        data: yData ?? [category],
+        categoryPadding: yCategoryPadding ?? 0,
+        domain: yDomain,
+        domainLimit: yDomainLimit,
+        range: yRange,
+      };
+
+      // Calculate total height based on components shown
+      const computedHeight = useMemo(() => {
+        if (height !== undefined) return height;
+
+        let totalHeight = barHeight;
+
+        // Add padding for axes if shown
+        if (showXAxis) totalHeight += 24;
+
+        return totalHeight;
+      }, [height, barHeight, showXAxis]);
+
+      // Default inset to 0 for progress bars (no padding needed)
+      const defaultInset = { top: 0, bottom: 0, left: 0, right: 0 };
+
+      const chartElement = (
+        <CartesianChart
+          inset={defaultInset}
+          {...chartProps}
+          ref={ref}
+          height={computedHeight}
+          orientation="vertical"
+          series={series}
+          xAxis={xAxisConfig}
+          yAxis={yAxisConfig}
+        >
+          {showXAxis && <XAxis {...xAxisVisualProps} />}
+          {showYAxis && <YAxis axisId={yAxisId} {...yAxisVisualProps} />}
+          <BarPlot
+            BarComponent={BarComponent}
+            BarStackComponent={BarStackComponent}
+            borderRadius={borderRadius}
+            fillOpacity={fillOpacity}
+            roundBaseline={roundBaseline}
+            seriesIds={seriesIds}
+            stackGap={stackGap}
+            stroke={stroke}
+            strokeWidth={strokeWidth}
+            transition={transition}
+          />
+          {children}
+        </CartesianChart>
+      );
+
+      // If no legend, just return the chart
+      if (!showLegend) {
+        return chartElement;
+      }
+
+      // Wrap in VStack for legend positioning
+      return (
+        <VStack gap={legendGap} style={{ width: '100%' }}>
+          {legendPosition === 'top' && <ProgressLegend segments={segments} {...legendProps} />}
+          {chartElement}
+          {legendPosition === 'bottom' && <ProgressLegend segments={segments} {...legendProps} />}
+        </VStack>
+      );
+    },
+  ),
+);
diff --git a/packages/web-visualization/src/chart/progress/__stories__/SegmentedProgressChart.stories.tsx b/packages/web-visualization/src/chart/progress/__stories__/SegmentedProgressChart.stories.tsx
new file mode 100644
index 00000000..11611f9e
--- /dev/null
+++ b/packages/web-visualization/src/chart/progress/__stories__/SegmentedProgressChart.stories.tsx
@@ -0,0 +1,268 @@
+import React from 'react';
+import { VStack } from '@coinbase/cds-web/layout';
+import { Text } from '@coinbase/cds-web/typography';
+
+import { SegmentedProgressChart } from '../SegmentedProgressChart';
+
+export default {
+  title: 'Components/Chart/SegmentedProgressChart',
+  component: SegmentedProgressChart,
+};
+
+const Example: React.FC<
+  React.PropsWithChildren<{ title: string; description?: string | React.ReactNode }>
+> = ({ children, title, description }) => {
+  return (
+    <VStack gap={2}>
+      <Text as="h2" display="block" font="title3">
+        {title}
+      </Text>
+      {description}
+      {children}
+    </VStack>
+  );
+};
+
+const BoughtVsSold = () => {
+  return (
+    <Example title="Bought vs Sold">
+      <SegmentedProgressChart
+        barHeight={6}
+        borderRadius={3}
+        segments={[
+          {
+            id: 'bought',
+            value: 76,
+            label: '76% bought',
+            color: 'var(--color-accentBoldGreen)',
+          },
+          {
+            id: 'sold',
+            value: 24,
+            label: '24% sold',
+            color: 'var(--color-accentBoldRed)',
+          },
+        ]}
+      />
+    </Example>
+  );
+};
+
+const PortfolioAllocation = () => {
+  return (
+    <Example title="Portfolio Allocation">
+      <SegmentedProgressChart
+        legendProps={{ justifyContent: 'flex-start', columnGap: 4 }}
+        segments={[
+          {
+            id: 'stocks',
+            value: 60,
+            label: 'Stocks (60%)',
+            color: 'var(--color-accentBoldBlue)',
+            legendShape: 'squircle',
+          },
+          {
+            id: 'bonds',
+            value: 25,
+            label: 'Bonds (25%)',
+            color: 'var(--color-accentBoldGreen)',
+            legendShape: 'squircle',
+          },
+          {
+            id: 'cash',
+            value: 15,
+            label: 'Cash (15%)',
+            color: 'var(--color-fgMuted)',
+            legendShape: 'squircle',
+          },
+        ]}
+      />
+    </Example>
+  );
+};
+
+const ThreeWaySplit = () => {
+  return (
+    <Example title="Three-Way Split">
+      <SegmentedProgressChart
+        borderRadius={0}
+        segments={[
+          {
+            id: 'approved',
+            value: 45,
+            label: '45% Approved',
+            color: 'var(--color-fgPositive)',
+          },
+          {
+            id: 'pending',
+            value: 30,
+            label: '30% Pending',
+            color: 'var(--color-accentBoldYellow)',
+          },
+          {
+            id: 'rejected',
+            value: 25,
+            label: '25% Rejected',
+            color: 'var(--color-fgNegative)',
+          },
+        ]}
+      />
+    </Example>
+  );
+};
+
+const CustomMax = () => {
+  return (
+    <Example description="Using a custom max value (1000) instead of 100" title="Custom Max Value">
+      <SegmentedProgressChart
+        max={1000}
+        segments={[
+          {
+            id: 'completed',
+            value: 750,
+            label: '750 completed',
+            color: 'var(--color-accentBoldBlue)',
+          },
+          {
+            id: 'remaining',
+            value: 250,
+            label: '250 remaining',
+            color: 'var(--color-bgSecondary)',
+          },
+        ]}
+      />
+    </Example>
+  );
+};
+
+const LegendOnTop = () => {
+  return (
+    <Example title="Legend on Top">
+      <SegmentedProgressChart
+        legendPosition="top"
+        segments={[
+          {
+            id: 'yes',
+            value: 65,
+            label: '65% Yes',
+            color: 'var(--color-accentBoldGreen)',
+          },
+          {
+            id: 'no',
+            value: 35,
+            label: '35% No',
+            color: 'var(--color-accentBoldRed)',
+          },
+        ]}
+      />
+    </Example>
+  );
+};
+
+const NoLegend = () => {
+  return (
+    <Example title="Without Legend">
+      <SegmentedProgressChart
+        showLegend={false}
+        segments={[
+          {
+            id: 'progress',
+            value: 70,
+            color: 'var(--color-accentBoldBlue)',
+          },
+          {
+            id: 'remaining',
+            value: 30,
+            color: 'var(--color-bgSecondary)',
+          },
+        ]}
+      />
+    </Example>
+  );
+};
+
+const WithXAxis = () => {
+  return (
+    <Example title="With X Axis">
+      <SegmentedProgressChart
+        showXAxis
+        barHeight={24}
+        segments={[
+          {
+            id: 'used',
+            value: 72,
+            label: 'Used (72%)',
+            color: 'var(--color-accentBoldBlue)',
+          },
+          {
+            id: 'free',
+            value: 28,
+            label: 'Free (28%)',
+            color: 'var(--color-bgSecondary)',
+          },
+        ]}
+        xAxis={{
+          tickLabelFormatter: (value: number) => `${value}%`,
+        }}
+      />
+    </Example>
+  );
+};
+
+const TallerBar = () => {
+  return (
+    <Example title="Taller Bar">
+      <SegmentedProgressChart
+        barHeight={48}
+        borderRadius={8}
+        segments={[
+          {
+            id: 'active',
+            value: 85,
+            label: '85% Active Users',
+            color: 'var(--color-accentBoldGreen)',
+          },
+          {
+            id: 'inactive',
+            value: 15,
+            label: '15% Inactive',
+            color: 'var(--color-fgMuted)',
+          },
+        ]}
+      />
+    </Example>
+  );
+};
+
+const ManySegments = () => {
+  return (
+    <Example title="Many Segments">
+      <SegmentedProgressChart
+        legendProps={{ justifyContent: 'flex-start', columnGap: 3, flexWrap: 'wrap' }}
+        segments={[
+          { id: 'btc', value: 35, label: 'BTC (35%)', color: '#F7931A' },
+          { id: 'eth', value: 25, label: 'ETH (25%)', color: '#627EEA' },
+          { id: 'sol', value: 15, label: 'SOL (15%)', color: '#9945FF' },
+          { id: 'usdc', value: 10, label: 'USDC (10%)', color: '#2775CA' },
+          { id: 'others', value: 15, label: 'Others (15%)', color: 'var(--color-fgMuted)' },
+        ]}
+      />
+    </Example>
+  );
+};
+
+export const Examples = () => {
+  return (
+    <VStack gap={8} style={{ maxWidth: 600, width: '100%' }}>
+      <BoughtVsSold />
+      <PortfolioAllocation />
+      <ThreeWaySplit />
+      <CustomMax />
+      <LegendOnTop />
+      <NoLegend />
+      <WithXAxis />
+      <TallerBar />
+      <ManySegments />
+    </VStack>
+  );
+};
diff --git a/packages/web-visualization/src/chart/progress/index.ts b/packages/web-visualization/src/chart/progress/index.ts
new file mode 100644
index 00000000..bff34fc6
--- /dev/null
+++ b/packages/web-visualization/src/chart/progress/index.ts
@@ -0,0 +1,6 @@
+export { SegmentedProgressChart } from './SegmentedProgressChart';
+export type {
+  ProgressSegment,
+  SegmentedProgressChartBaseProps,
+  SegmentedProgressChartProps,
+} from './SegmentedProgressChart';
diff --git a/packages/web-visualization/src/chart/scrubber/Scrubber.tsx b/packages/web-visualization/src/chart/scrubber/Scrubber.tsx
index 9af075e0..1a9c3dae 100644
--- a/packages/web-visualization/src/chart/scrubber/Scrubber.tsx
+++ b/packages/web-visualization/src/chart/scrubber/Scrubber.tsx
@@ -259,7 +259,7 @@ export const Scrubber = memo(
 
       const highlightContext = useHighlightContext();
       const scrubberPosition = highlightContext?.highlightedItem?.dataIndex;
-      const { getXScale, getXAxis, animate, series, drawingArea, dataLength } =
+      const { getXScale, getXAxis, getYScale, getYAxis, animate, series, drawingArea, dataLength, orientation } =
         useCartesianChartContext();
 
       // Expose imperative handle with pulse method
@@ -276,12 +276,33 @@ export const Scrubber = memo(
         return seriesIds;
       }, [series, seriesIds]);
 
-      const { dataX, dataIndex } = useMemo(() => {
+      // For horizontal orientation, the scrubber tracks X position (category axis)
+      // For vertical orientation, the scrubber tracks Y position (category axis)
+      const { dataX, dataY, dataIndex } = useMemo(() => {
+        const dataIndex = scrubberPosition ?? Math.max(0, dataLength - 1);
+
+        if (orientation === 'vertical') {
+          // For vertical orientation, use Y axis
+          const yScale = getYScale() as ChartScaleFunction;
+          const yAxis = getYAxis();
+          if (!yScale) return { dataX: undefined, dataY: undefined, dataIndex: undefined };
+
+          // Convert index to actual y value if axis has data
+          let dataY: number;
+          if (yAxis?.data && Array.isArray(yAxis.data) && yAxis.data[dataIndex] !== undefined) {
+            const dataValue = yAxis.data[dataIndex];
+            dataY = typeof dataValue === 'string' ? dataIndex : dataValue;
+          } else {
+            dataY = dataIndex;
+          }
+
+          return { dataX: undefined, dataY, dataIndex };
+        }
+
+        // For horizontal orientation, use X axis
         const xScale = getXScale() as ChartScaleFunction;
         const xAxis = getXAxis();
-        if (!xScale) return { dataX: undefined, dataIndex: undefined };
-
-        const dataIndex = scrubberPosition ?? Math.max(0, dataLength - 1);
+        if (!xScale) return { dataX: undefined, dataY: undefined, dataIndex: undefined };
 
         // Convert index to actual x value if axis has data
         let dataX: number;
@@ -292,8 +313,8 @@ export const Scrubber = memo(
           dataX = dataIndex;
         }
 
-        return { dataX, dataIndex };
-      }, [getXScale, getXAxis, scrubberPosition, dataLength]);
+        return { dataX, dataY: undefined, dataIndex };
+      }, [orientation, getXScale, getXAxis, getYScale, getYAxis, scrubberPosition, dataLength]);
 
       // Compute resolved accessibility label
       const resolvedAccessibilityLabel = useMemo(() => {
@@ -324,36 +345,49 @@ export const Scrubber = memo(
         [series, filteredSeriesIds],
       );
 
-      // Check if we have at least the default X scale
+      // Check if we have the required scale for the current orientation
       const defaultXScale = getXScale();
-      if (!defaultXScale) return null;
+      const defaultYScale = getYScale();
+
+      if (orientation === 'vertical') {
+        if (!defaultYScale) return null;
+      } else {
+        if (!defaultXScale) return null;
+      }
 
+      // Compute pixel position based on orientation
       const pixelX =
-        dataX !== undefined && defaultXScale ? getPointOnScale(dataX, defaultXScale) : undefined;
+        orientation !== 'vertical' && dataX !== undefined && defaultXScale
+          ? getPointOnScale(dataX, defaultXScale)
+          : undefined;
+      const pixelY =
+        orientation === 'vertical' && dataY !== undefined && defaultYScale
+          ? getPointOnScale(dataY, defaultYScale)
+          : undefined;
 
-      return (
-        <motion.g
-          aria-atomic="true"
-          aria-label={resolvedAccessibilityLabel}
-          aria-live="polite"
-          data-component="scrubber-group"
-          data-testid={testID}
-          role="status"
-          {...(animate
-            ? {
-                animate: {
-                  opacity: 1,
-                  transition: {
-                    duration: accessoryFadeTransitionDuration,
-                    delay: accessoryFadeTransitionDelay,
-                  },
-                },
-                exit: { opacity: 0, transition: { duration: accessoryFadeTransitionDuration } },
-                initial: { opacity: 0 },
-              }
-            : {})}
-        >
-          {!hideOverlay && scrubberPosition !== undefined && pixelX !== undefined && (
+      // Render overlay based on orientation
+      const renderOverlay = () => {
+        if (hideOverlay || scrubberPosition === undefined) return null;
+
+        if (orientation === 'vertical' && pixelY !== undefined) {
+          // For vertical orientation, overlay covers the bottom portion
+          return (
+            <rect
+              className={classNames?.overlay}
+              fill="var(--color-bg)"
+              height={drawingArea.y + drawingArea.height - pixelY + overlayOffset}
+              opacity={0.8}
+              style={styles?.overlay}
+              width={drawingArea.width + overlayOffset * 2}
+              x={drawingArea.x - overlayOffset}
+              y={pixelY}
+            />
+          );
+        }
+
+        if (orientation !== 'vertical' && pixelX !== undefined) {
+          // For horizontal orientation, overlay covers the right portion
+          return (
             <rect
               className={classNames?.overlay}
               fill="var(--color-bg)"
@@ -364,8 +398,37 @@ export const Scrubber = memo(
               x={pixelX}
               y={drawingArea.y - overlayOffset}
             />
-          )}
-          {!hideLine && scrubberPosition !== undefined && dataX !== undefined && (
+          );
+        }
+
+        return null;
+      };
+
+      // Render reference line based on orientation
+      const renderLine = () => {
+        if (hideLine || scrubberPosition === undefined) return null;
+
+        if (orientation === 'vertical' && dataY !== undefined) {
+          // For vertical orientation, render horizontal line
+          return (
+            <ReferenceLine
+              LabelComponent={LabelComponent}
+              LineComponent={LineComponent}
+              classNames={{ label: classNames?.line }}
+              dataY={dataY}
+              label={typeof label === 'function' ? label(dataIndex) : label}
+              labelBoundsInset={labelBoundsInset}
+              labelElevated={labelElevated}
+              labelFont={labelFont}
+              stroke={lineStroke}
+              styles={{ label: styles?.line }}
+            />
+          );
+        }
+
+        if (orientation !== 'vertical' && dataX !== undefined) {
+          // For horizontal orientation, render vertical line
+          return (
             <ReferenceLine
               LabelComponent={LabelComponent}
               LineComponent={LineComponent}
@@ -378,7 +441,36 @@ export const Scrubber = memo(
               stroke={lineStroke}
               styles={{ label: styles?.line }}
             />
-          )}
+          );
+        }
+
+        return null;
+      };
+
+      return (
+        <motion.g
+          aria-atomic="true"
+          aria-label={resolvedAccessibilityLabel}
+          aria-live="polite"
+          data-component="scrubber-group"
+          data-testid={testID}
+          role="status"
+          {...(animate
+            ? {
+                animate: {
+                  opacity: 1,
+                  transition: {
+                    duration: accessoryFadeTransitionDuration,
+                    delay: accessoryFadeTransitionDelay,
+                  },
+                },
+                exit: { opacity: 0, transition: { duration: accessoryFadeTransitionDuration } },
+                initial: { opacity: 0 },
+              }
+            : {})}
+        >
+          {renderOverlay()}
+          {renderLine()}
           <ScrubberBeaconGroup
             ref={beaconGroupRef}
             BeaconComponent={BeaconComponent}
diff --git a/packages/web-visualization/src/chart/scrubber/ScrubberBeaconGroup.tsx b/packages/web-visualization/src/chart/scrubber/ScrubberBeaconGroup.tsx
index 34751bf8..60d963ed 100644
--- a/packages/web-visualization/src/chart/scrubber/ScrubberBeaconGroup.tsx
+++ b/packages/web-visualization/src/chart/scrubber/ScrubberBeaconGroup.tsx
@@ -17,7 +17,7 @@ import type { ScrubberBeaconComponent, ScrubberBeaconProps, ScrubberBeaconRef }
 const BeaconWithData = memo<{
   seriesId: string;
   dataIndex: number;
-  dataX: number;
+  categoryValue: number;
   isIdle: boolean;
   BeaconComponent: ScrubberBeaconComponent;
   idlePulse?: boolean;
@@ -26,11 +26,12 @@ const BeaconWithData = memo<{
   style?: React.CSSProperties;
   testID?: string;
   beaconRef: (ref: ScrubberBeaconRef | null) => void;
+  orientation: 'horizontal' | 'vertical';
 }>(
   ({
     seriesId,
     dataIndex,
-    dataX,
+    categoryValue,
     isIdle,
     BeaconComponent,
     idlePulse,
@@ -39,6 +40,7 @@ const BeaconWithData = memo<{
     style,
     testID,
     beaconRef,
+    orientation,
   }) => {
     const { getSeries, getSeriesData, getXScale, getYScale } = useCartesianChartContext();
 
@@ -46,15 +48,15 @@ const BeaconWithData = memo<{
     const sourceData = useMemo(() => getSeriesData(seriesId), [getSeriesData, seriesId]);
     const gradient = series?.gradient;
 
-    // Get dataY from series data
-    const dataY = useMemo(() => {
+    // Get the value from series data
+    const dataValue = useMemo(() => {
       if (sourceData && dataIndex >= 0 && dataIndex < sourceData.length) {
-        const dataValue = sourceData[dataIndex];
+        const value = sourceData[dataIndex];
 
-        if (typeof dataValue === 'number') {
-          return dataValue;
-        } else if (Array.isArray(dataValue)) {
-          const validValues = dataValue.filter((val): val is number => val !== null);
+        if (typeof value === 'number') {
+          return value;
+        } else if (Array.isArray(value)) {
+          const validValues = value.filter((val): val is number => val !== null);
           if (validValues.length >= 1) {
             return validValues[validValues.length - 1];
           }
@@ -63,9 +65,14 @@ const BeaconWithData = memo<{
       return undefined;
     }, [sourceData, dataIndex]);
 
+    // In horizontal orientation: dataX = category (index), dataY = value
+    // In vertical orientation: dataX = value, dataY = category (index)
+    const dataX = orientation === 'vertical' ? dataValue : categoryValue;
+    const dataY = orientation === 'vertical' ? categoryValue : dataValue;
+
     // Evaluate gradient color
     const color = useMemo(() => {
-      if (dataY === undefined) return series?.color ?? 'var(--color-fgPrimary)';
+      if (dataValue === undefined) return series?.color ?? 'var(--color-fgPrimary)';
 
       if (gradient) {
         const xScale = getXScale();
@@ -77,23 +84,25 @@ const BeaconWithData = memo<{
 
           if (stops) {
             const gradientAxis = gradient.axis ?? 'y';
-            const dataValue = gradientAxis === 'x' ? dataX : dataY;
-            const evaluatedColor = evaluateGradientAtValue(
-              stops,
-              dataValue,
-              gradientScale as ChartScaleFunction,
-            );
-            if (evaluatedColor) {
-              return evaluatedColor;
+            const gradientValue = gradientAxis === 'x' ? dataX : dataY;
+            if (gradientValue !== undefined) {
+              const evaluatedColor = evaluateGradientAtValue(
+                stops,
+                gradientValue,
+                gradientScale as ChartScaleFunction,
+              );
+              if (evaluatedColor) {
+                return evaluatedColor;
+              }
             }
           }
         }
       }
 
       return series?.color ?? 'var(--color-fgPrimary)';
-    }, [gradient, dataX, dataY, series?.color, series?.yAxisId, getXScale, getYScale]);
+    }, [gradient, dataX, dataY, dataValue, series?.color, series?.yAxisId, getXScale, getYScale]);
 
-    if (dataY === undefined) return null;
+    if (dataX === undefined || dataY === undefined) return null;
 
     return (
       <BeaconComponent
@@ -168,7 +177,8 @@ export const ScrubberBeaconGroup = memo(
       const ScrubberBeaconRefs = useRefMap<ScrubberBeaconRef>();
       const highlightContext = useHighlightContext();
       const scrubberPosition = highlightContext?.highlightedItem?.dataIndex;
-      const { getXScale, getXAxis, dataLength, series } = useCartesianChartContext();
+      const { getXScale, getYScale, getXAxis, getYAxis, dataLength, series, orientation } =
+        useCartesianChartContext();
 
       // Expose imperative handle with pulse method
       useImperativeHandle(ref, () => ({
@@ -183,24 +193,30 @@ export const ScrubberBeaconGroup = memo(
         return series?.filter((s) => seriesIds.includes(s.id)) ?? [];
       }, [series, seriesIds]);
 
-      const { dataX, dataIndex } = useMemo(() => {
-        const xScale = getXScale();
-        const xAxis = getXAxis();
-        if (!xScale) return { dataX: undefined, dataIndex: undefined };
+      const { categoryValue, dataIndex } = useMemo(() => {
+        // In horizontal orientation, category axis is X; in vertical, it's Y
+        const categoryScale = orientation === 'vertical' ? getYScale() : getXScale();
+        const categoryAxis = orientation === 'vertical' ? getYAxis() : getXAxis();
+
+        if (!categoryScale) return { categoryValue: undefined, dataIndex: undefined };
 
         const dataIndex = scrubberPosition ?? Math.max(0, dataLength - 1);
 
-        // Convert index to actual x value if axis has data
-        let dataX: number;
-        if (xAxis?.data && Array.isArray(xAxis.data) && xAxis.data[dataIndex] !== undefined) {
-          const dataValue = xAxis.data[dataIndex];
-          dataX = typeof dataValue === 'string' ? dataIndex : dataValue;
+        // Convert index to actual category value if axis has data
+        let categoryValue: number;
+        if (
+          categoryAxis?.data &&
+          Array.isArray(categoryAxis.data) &&
+          categoryAxis.data[dataIndex] !== undefined
+        ) {
+          const dataValue = categoryAxis.data[dataIndex];
+          categoryValue = typeof dataValue === 'string' ? dataIndex : dataValue;
         } else {
-          dataX = dataIndex;
+          categoryValue = dataIndex;
         }
 
-        return { dataX, dataIndex };
-      }, [getXScale, getXAxis, scrubberPosition, dataLength]);
+        return { categoryValue, dataIndex };
+      }, [getXScale, getYScale, getXAxis, getYAxis, scrubberPosition, dataLength, orientation]);
 
       const isIdle = scrubberPosition === undefined;
 
@@ -215,18 +231,19 @@ export const ScrubberBeaconGroup = memo(
         [ScrubberBeaconRefs],
       );
 
-      if (dataX === undefined || dataIndex === undefined) return null;
+      if (categoryValue === undefined || dataIndex === undefined) return null;
 
       return filteredSeries.map((s) => (
         <BeaconWithData
           key={s.id}
           BeaconComponent={BeaconComponent}
           beaconRef={createBeaconRef(s.id)}
+          categoryValue={categoryValue}
           className={className}
           dataIndex={dataIndex}
-          dataX={dataX}
           idlePulse={idlePulse}
           isIdle={isIdle}
+          orientation={orientation}
           seriesId={s.id}
           style={style}
           testID={testID ? `${testID ?? 'beacon'}-${s.id}` : undefined}
diff --git a/packages/web-visualization/src/chart/scrubber/ScrubberBeaconLabelGroup.tsx b/packages/web-visualization/src/chart/scrubber/ScrubberBeaconLabelGroup.tsx
index 507a4fd1..c5dd5a6f 100644
--- a/packages/web-visualization/src/chart/scrubber/ScrubberBeaconLabelGroup.tsx
+++ b/packages/web-visualization/src/chart/scrubber/ScrubberBeaconLabelGroup.tsx
@@ -104,8 +104,17 @@ export const ScrubberBeaconLabelGroup = memo<ScrubberBeaconLabelGroupProps>(
     labelFont,
     BeaconLabelComponent = DefaultScrubberBeaconLabel,
   }) => {
-    const { getSeries, getSeriesData, getXScale, getYScale, getXAxis, drawingArea, dataLength } =
-      useCartesianChartContext();
+    const {
+      getSeries,
+      getSeriesData,
+      getXScale,
+      getYScale,
+      getXAxis,
+      getYAxis,
+      drawingArea,
+      dataLength,
+      orientation,
+    } = useCartesianChartContext();
     const highlightContext = useHighlightContext();
     const scrubberPosition = highlightContext?.highlightedItem?.dataIndex;
 
@@ -137,62 +146,73 @@ export const ScrubberBeaconLabelGroup = memo<ScrubberBeaconLabelGroupProps>(
           if (!series) return null;
 
           const sourceData = getSeriesData(label.seriesId);
-          const yScale = getYScale(series.yAxisId);
+          // In horizontal: Y is value axis; in vertical: X is value axis
+          const valueScale = orientation === 'vertical' ? getXScale() : getYScale(series.yAxisId);
 
           return {
             seriesId: label.seriesId,
             sourceData,
-            yScale,
+            valueScale,
           };
         })
         .filter((info): info is NonNullable<typeof info> => info !== null);
-    }, [labels, getSeries, getSeriesData, getYScale]);
+    }, [labels, getSeries, getSeriesData, getXScale, getYScale, orientation]);
 
-    const xScale = getXScale();
-    const xAxis = getXAxis();
+    // Category scale/axis depends on orientation
+    const categoryScale = orientation === 'vertical' ? getYScale() : getXScale();
+    const categoryAxis = orientation === 'vertical' ? getYAxis() : getXAxis();
 
     const dataIndex = useMemo(() => {
       return scrubberPosition ?? Math.max(0, dataLength - 1);
     }, [scrubberPosition, dataLength]);
 
-    const dataX = useMemo(() => {
-      if (xAxis?.data && Array.isArray(xAxis.data) && xAxis.data[dataIndex] !== undefined) {
-        const dataValue = xAxis.data[dataIndex];
+    const categoryValue = useMemo(() => {
+      if (
+        categoryAxis?.data &&
+        Array.isArray(categoryAxis.data) &&
+        categoryAxis.data[dataIndex] !== undefined
+      ) {
+        const dataValue = categoryAxis.data[dataIndex];
         return typeof dataValue === 'string' ? dataIndex : dataValue;
       }
       return dataIndex;
-    }, [xAxis, dataIndex]);
+    }, [categoryAxis, dataIndex]);
 
     const allLabelPositions = useMemo(() => {
-      if (!xScale || dataX === undefined) return [];
+      if (!categoryScale || categoryValue === undefined) return [];
 
-      const sharedPixelX = getPointOnScale(dataX, xScale);
+      const sharedCategoryPixel = getPointOnScale(categoryValue, categoryScale);
 
       const desiredPositions = seriesInfo.map((info) => {
-        let dataY: number | undefined;
-        if (info.yScale) {
+        let dataValue: number | undefined;
+        if (info.valueScale) {
           if (
             info.sourceData &&
             dataIndex !== undefined &&
             dataIndex >= 0 &&
             dataIndex < info.sourceData.length
           ) {
-            const dataValue = info.sourceData[dataIndex];
+            const sourceValue = info.sourceData[dataIndex];
 
-            if (Array.isArray(dataValue)) {
-              const validValues = dataValue.filter((val): val is number => val !== null);
+            if (typeof sourceValue === 'number') {
+              dataValue = sourceValue;
+            } else if (Array.isArray(sourceValue)) {
+              const validValues = sourceValue.filter((val): val is number => val !== null);
               if (validValues.length >= 1) {
-                dataY = validValues[validValues.length - 1];
+                dataValue = validValues[validValues.length - 1];
               }
             }
           }
         }
 
-        if (dataY !== undefined && info.yScale) {
+        if (dataValue !== undefined && info.valueScale) {
+          const valuePixel = getPointOnScale(dataValue, info.valueScale);
+          // In horizontal: x = category, y = value
+          // In vertical: x = value, y = category
           return {
             seriesId: info.seriesId,
-            x: sharedPixelX,
-            desiredY: getPointOnScale(dataY, info.yScale),
+            x: orientation === 'vertical' ? valuePixel : sharedCategoryPixel,
+            desiredY: orientation === 'vertical' ? sharedCategoryPixel : valuePixel,
           };
         }
 
@@ -236,16 +256,50 @@ export const ScrubberBeaconLabelGroup = memo<ScrubberBeaconLabelGroupProps>(
           y: yPositions.get(pos.seriesId) ?? pos.desiredY,
         };
       });
-    }, [seriesInfo, dataIndex, dataX, xScale, labelDimensions, drawingArea, labelMinGap]);
+    }, [
+      seriesInfo,
+      dataIndex,
+      categoryValue,
+      categoryScale,
+      labelDimensions,
+      drawingArea,
+      labelMinGap,
+      orientation,
+    ]);
 
     const currentPosition = useMemo(() => {
-      if (!xScale || dataX === undefined) return 'right';
+      if (!categoryScale || categoryValue === undefined) return 'right';
 
-      const pixelX = getPointOnScale(dataX, xScale);
+      const categoryPixel = getPointOnScale(categoryValue, categoryScale);
       const maxWidth = Math.max(...Object.values(labelDimensions).map((dim) => dim.width));
 
-      return getLabelPosition(pixelX, maxWidth, drawingArea, labelHorizontalOffset);
-    }, [dataX, xScale, labelDimensions, drawingArea, labelHorizontalOffset]);
+      // For horizontal orientation, use the category (X) position to determine left/right
+      // For vertical orientation, labels should be positioned based on the X value pixel
+      if (orientation === 'vertical') {
+        // In vertical, all labels share the same Y (category) position
+        // We need to check the X (value) positions for label placement
+        // For now, default to 'right' for vertical orientation
+        // A more sophisticated approach would check if there's room to the right
+        const avgValuePixel =
+          allLabelPositions.length > 0
+            ? allLabelPositions
+                .filter((pos) => pos !== null)
+                .reduce((sum, pos) => sum + pos!.x, 0) / allLabelPositions.length
+            : drawingArea.x + drawingArea.width / 2;
+
+        return getLabelPosition(avgValuePixel, maxWidth, drawingArea, labelHorizontalOffset);
+      }
+
+      return getLabelPosition(categoryPixel, maxWidth, drawingArea, labelHorizontalOffset);
+    }, [
+      categoryValue,
+      categoryScale,
+      labelDimensions,
+      drawingArea,
+      labelHorizontalOffset,
+      orientation,
+      allLabelPositions,
+    ]);
 
     return seriesInfo.map((info, index) => {
       const labelInfo = labels.find((label) => label.seriesId === info.seriesId);
diff --git a/packages/web-visualization/src/chart/utils/axis.ts b/packages/web-visualization/src/chart/utils/axis.ts
index 4070a02c..0ce43b85 100644
--- a/packages/web-visualization/src/chart/utils/axis.ts
+++ b/packages/web-visualization/src/chart/utils/axis.ts
@@ -175,6 +175,10 @@ export const getPolarAxisScale = ({
  * For numeric scales, the domain limit controls whether bounds are "nice" (human-friendly)
  * or "strict" (exact min/max). Range can be customized using function-based configuration.
  *
+ * Range inversion is determined by axis role (category vs value) and orientation:
+ * - Horizontal orientation: Y axis (value) is inverted for SVG coordinate system
+ * - Vertical orientation: X axis (value) is NOT inverted (values flow left-to-right)
+ *
  * @param params - Scale parameters
  * @returns The D3 scale function
  * @throws An Error if bounds are invalid
@@ -184,18 +188,25 @@ export const getCartesianAxisScale = ({
   type,
   range,
   dataDomain,
+  orientation = 'horizontal',
 }: {
   config?: CartesianAxisConfig;
   type: 'x' | 'y';
   range: AxisBounds;
   dataDomain: AxisBounds;
+  orientation?: 'horizontal' | 'vertical';
 }): ChartScaleFunction => {
   const scaleType = config?.scaleType ?? 'linear';
 
   let adjustedRange = range;
 
-  // Invert range for Y axis for SVG coordinate system
-  if (type === 'y') {
+  // Determine if this axis needs range inversion for SVG coordinate system.
+  // For horizontal orientation: Y axis (value axis) needs inversion (higher values at top)
+  // For vertical orientation: Y axis (category axis) needs inversion (first category at top)
+  // X axis never needs inversion (left-to-right is natural for both orientations)
+  const shouldInvertRange = type === 'y';
+
+  if (shouldInvertRange) {
     adjustedRange = { min: adjustedRange.max, max: adjustedRange.min };
   }
 
@@ -283,12 +294,14 @@ export const getCartesianAxisConfig = (
  * @param axisParam - The axis configuration
  * @param series - Array of series objects (for stacking support)
  * @param axisType - Whether this is an 'x' or 'y' axis
+ * @param orientation - Chart orientation ('horizontal' or 'vertical')
  * @returns The calculated axis bounds
  */
 export const getCartesianAxisDomain = (
   axisParam: CartesianAxisConfigProps,
   series: CartesianSeries[],
   axisType: 'x' | 'y',
+  orientation: 'horizontal' | 'vertical' = 'horizontal',
 ): AxisBounds => {
   let dataDomain: AxisBounds | null = null;
   if (axisParam.data && Array.isArray(axisParam.data) && axisParam.data.length > 0) {
@@ -312,7 +325,12 @@ export const getCartesianAxisDomain = (
   }
 
   // Calculate domain from series data
-  const seriesDomain = axisType === 'x' ? getCartesianDomain(series) : getCartesianRange(series);
+  // In horizontal orientation: X is category (domain), Y is value (range)
+  // In vertical orientation: Y is category (domain), X is value (range)
+  const isCategoryAxis =
+    (orientation === 'horizontal' && axisType === 'x') ||
+    (orientation === 'vertical' && axisType === 'y');
+  const seriesDomain = isCategoryAxis ? getCartesianDomain(series) : getCartesianRange(series);
 
   // If data sets the domain, use that instead of the series domain
   const preferredDataDomain = dataDomain ?? seriesDomain;
diff --git a/packages/web-visualization/src/chart/utils/context.ts b/packages/web-visualization/src/chart/utils/context.ts
index 127ee3bf..0e7f375f 100644
--- a/packages/web-visualization/src/chart/utils/context.ts
+++ b/packages/web-visualization/src/chart/utils/context.ts
@@ -5,11 +5,32 @@ import type { AngularAxisConfig, CartesianAxisConfig, RadialAxisConfig } from '.
 import type { CartesianSeries, PolarSeries, Series } from './chart';
 import type { ChartScaleFunction } from './scale';
 
+/**
+ * Determines which axis represents categories and which represents values based on orientation.
+ * This helper makes code more readable when dealing with orientation-dependent logic.
+ */
+export const getOrientedScales = <T>(
+  xValue: T,
+  yValue: T,
+  orientation: 'horizontal' | 'vertical',
+): { category: T; value: T } => {
+  return orientation === 'vertical'
+    ? { category: yValue, value: xValue }
+    : { category: xValue, value: yValue };
+};
+
 /**
  * Chart context type discriminator.
  */
 export type ChartType = 'cartesian' | 'polar';
 
+/**
+ * Chart orientation for Cartesian charts.
+ * - 'horizontal' (default): X is category axis, Y is value axis (vertical bars, left-to-right data flow)
+ * - 'vertical': Y is category axis, X is value axis (horizontal bars, top-to-bottom data flow)
+ */
+export type ChartOrientation = 'horizontal' | 'vertical';
+
 /**
  * Base context value for all chart types.
  */
@@ -58,6 +79,12 @@ export type CartesianChartContextValue = Omit<ChartContextValue, 'series' | 'typ
    * The type of chart.
    */
   type: 'cartesian';
+  /**
+   * Chart orientation.
+   * - 'horizontal' (default): X is category axis, Y is value axis
+   * - 'vertical': Y is category axis, X is value axis
+   */
+  orientation: ChartOrientation;
   /**
    * The series data for the chart.
    */
diff --git a/packages/web-visualization/src/chart/utils/path.ts b/packages/web-visualization/src/chart/utils/path.ts
index 31b1b49b..dcaeb220 100644
--- a/packages/web-visualization/src/chart/utils/path.ts
+++ b/packages/web-visualization/src/chart/utils/path.ts
@@ -2,10 +2,12 @@ import {
   arc as d3Arc,
   area as d3Area,
   curveBumpX,
+  curveBumpY,
   curveCatmullRom,
   curveLinear,
   curveLinearClosed,
   curveMonotoneX,
+  curveMonotoneY,
   curveNatural,
   curveStep,
   curveStepAfter,
@@ -13,7 +15,8 @@ import {
   line as d3Line,
 } from 'd3-shape';
 
-import { projectPoint, projectPoints } from './point';
+import { projectPoint, projectPoints, projectPointsVertical } from './point';
+import type { ChartOrientation } from './context';
 import { type ChartScaleFunction, isCategoricalScale } from './scale';
 
 export type ChartPathCurveType =
@@ -31,14 +34,22 @@ export type ChartPathCurveType =
  * Get the d3 curve function for a path.
  * See https://d3js.org/d3-shape/curve
  * @param curve - The curve type. Defaults to 'linear'.
+ * @param orientation - Chart orientation. For 'vertical' orientation, uses Y-axis variants
+ *                      of curves that have them (bump, monotone).
  * @returns The d3 curve function.
  */
-export const getPathCurveFunction = (curve: ChartPathCurveType = 'linear') => {
+export const getPathCurveFunction = (
+  curve: ChartPathCurveType = 'linear',
+  orientation: ChartOrientation = 'horizontal',
+) => {
+  const isVertical = orientation === 'vertical';
+
   switch (curve) {
     case 'catmullRom':
       return curveCatmullRom;
-    case 'monotone': // When we support layout="vertical" this should dynamically switch to curveMonotoneY
-      return curveMonotoneX;
+    case 'monotone':
+      // For vertical orientation, use curveMonotoneY which assumes Y is the independent axis
+      return isVertical ? curveMonotoneY : curveMonotoneX;
     case 'natural':
       return curveNatural;
     case 'step':
@@ -47,8 +58,9 @@ export const getPathCurveFunction = (curve: ChartPathCurveType = 'linear') => {
       return curveStepBefore;
     case 'stepAfter':
       return curveStepAfter;
-    case 'bump': // When we support layout="vertical" this should dynamically switch to curveBumpY
-      return curveBumpX;
+    case 'bump':
+      // For vertical orientation, use curveBumpY which creates smooth bumps along the Y axis
+      return isVertical ? curveBumpY : curveBumpX;
     case 'linearClosed':
       return curveLinearClosed;
     case 'linear':
@@ -72,26 +84,39 @@ export const getLinePath = ({
   xScale,
   yScale,
   xData,
+  yData,
   connectNulls,
+  orientation = 'horizontal',
 }: {
   data: (number | null | { x: number; y: number })[];
   curve?: ChartPathCurveType;
   xScale: ChartScaleFunction;
   yScale: ChartScaleFunction;
   xData?: number[];
+  yData?: number[];
   /**
    * When true, null values are skipped and the line connects across gaps.
    * By default, null values create gaps in the line.
    */
   connectNulls?: boolean;
+  /**
+   * Chart orientation. For 'vertical' orientation, data flows top-to-bottom with
+   * Y as the category axis and X as the value axis.
+   * @default 'horizontal'
+   */
+  orientation?: ChartOrientation;
 }): string => {
   if (data.length === 0) {
     return '';
   }
 
-  const curveFunction = getPathCurveFunction(curve);
+  const curveFunction = getPathCurveFunction(curve, orientation);
 
-  const dataPoints = projectPoints({ data, xScale, yScale, xData });
+  // For vertical orientation, use projectPointsVertical which swaps the interpretation
+  const dataPoints =
+    orientation === 'vertical'
+      ? projectPointsVertical({ data, xScale, yScale, yData })
+      : projectPoints({ data, xScale, yScale, xData });
 
   // When connectNulls is true, filter out null values before rendering
   // When false, use defined() to create gaps in the line
@@ -134,27 +159,42 @@ export const getAreaPath = ({
   xScale,
   yScale,
   xData,
+  yData,
   connectNulls,
+  orientation = 'horizontal',
 }: {
   data: (number | null)[] | Array<[number, number] | null>;
   xScale: ChartScaleFunction;
   yScale: ChartScaleFunction;
   curve: ChartPathCurveType;
   xData?: number[];
+  yData?: number[];
   /**
    * When true, null values are skipped and the area connects across gaps.
    * By default null values create gaps in the area.
    */
   connectNulls?: boolean;
+  /**
+   * Chart orientation. For 'vertical' orientation, the area extends horizontally
+   * from a vertical baseline.
+   * @default 'horizontal'
+   */
+  orientation?: ChartOrientation;
 }): string => {
   if (data.length === 0) {
     return '';
   }
 
-  const curveFunction = getPathCurveFunction(curve);
+  const curveFunction = getPathCurveFunction(curve, orientation);
+
+  // For horizontal orientation: Y is value axis (area fills vertically)
+  // For vertical orientation: X is value axis (area fills horizontally)
+  const valueScale = orientation === 'vertical' ? xScale : yScale;
+  const categoryScale = orientation === 'vertical' ? yScale : xScale;
+  const categoryData = orientation === 'vertical' ? yData : xData;
 
-  const yDomain = yScale.domain();
-  const yMin = Math.min(...yDomain);
+  const valueDomain = valueScale.domain();
+  const valueMin = Math.min(...valueDomain);
 
   const normalizedData: Array<[number, number] | null> = data.map((item, index) => {
     if (item === null) {
@@ -169,7 +209,7 @@ export const getAreaPath = ({
     }
 
     if (typeof item === 'number') {
-      return [yMin, item];
+      return [valueMin, item];
     }
 
     return null;
@@ -178,51 +218,74 @@ export const getAreaPath = ({
   const dataPoints = normalizedData.map((range, index) => {
     if (range === null) {
       return {
-        x: 0,
+        category: 0,
         low: null,
         high: null,
         isValid: false,
       };
     }
 
-    let xValue: number = index;
-    if (!isCategoricalScale(xScale) && xData && xData[index] !== undefined) {
-      xValue = xData[index];
+    let categoryValue: number = index;
+    if (!isCategoricalScale(categoryScale) && categoryData && categoryData[index] !== undefined) {
+      categoryValue = categoryData[index];
     }
 
-    const xPoint = projectPoint({ x: xValue, y: 0, xScale, yScale });
-    const lowPoint = projectPoint({
-      x: xValue,
-      y: range[0],
-      xScale,
-      yScale,
-    });
-    const highPoint = projectPoint({
-      x: xValue,
-      y: range[1],
-      xScale,
-      yScale,
-    });
-
-    return {
-      x: xPoint.x,
-      low: lowPoint.y,
-      high: highPoint.y,
-      isValid: true,
-    };
+    if (orientation === 'vertical') {
+      // For vertical orientation: Y is category, X is value
+      const yPoint = projectPoint({ x: 0, y: categoryValue, xScale, yScale });
+      const lowPoint = projectPoint({ x: range[0], y: categoryValue, xScale, yScale });
+      const highPoint = projectPoint({ x: range[1], y: categoryValue, xScale, yScale });
+
+      return {
+        category: yPoint.y,
+        low: lowPoint.x,
+        high: highPoint.x,
+        isValid: true,
+      };
+    } else {
+      // For horizontal orientation: X is category, Y is value
+      const xPoint = projectPoint({ x: categoryValue, y: 0, xScale, yScale });
+      const lowPoint = projectPoint({ x: categoryValue, y: range[0], xScale, yScale });
+      const highPoint = projectPoint({ x: categoryValue, y: range[1], xScale, yScale });
+
+      return {
+        category: xPoint.x,
+        low: lowPoint.y,
+        high: highPoint.y,
+        isValid: true,
+      };
+    }
   });
 
   // When connectNulls is true, filter out invalid points before rendering
   // When false, use defined() to create gaps in the area
   const filteredPoints = connectNulls ? dataPoints.filter((d) => d.isValid) : dataPoints;
 
+  if (orientation === 'vertical') {
+    // For vertical orientation, area extends horizontally from a vertical line
+    const areaGenerator = d3Area<{
+      category: number;
+      low: number | null;
+      high: number | null;
+      isValid: boolean;
+    }>()
+      .y((d) => d.category) // Y is the category axis
+      .x0((d) => d.low ?? 0) // Left boundary (low values)
+      .x1((d) => d.high ?? 0) // Right boundary (high values)
+      .curve(curveFunction)
+      .defined((d) => connectNulls || (d.isValid && d.low != null && d.high != null));
+
+    return areaGenerator(filteredPoints) ?? '';
+  }
+
+  // Horizontal orientation (default)
   const areaGenerator = d3Area<{
-    x: number;
+    category: number;
     low: number | null;
     high: number | null;
     isValid: boolean;
   }>()
-    .x((d) => d.x)
+    .x((d) => d.category) // X is the category axis
     .y0((d) => d.low ?? 0) // Bottom boundary (low values), fallback to 0
     .y1((d) => d.high ?? 0) // Top boundary (high values), fallback to 0
     .curve(curveFunction)
diff --git a/packages/web-visualization/src/chart/utils/point.ts b/packages/web-visualization/src/chart/utils/point.ts
index af4a62fc..3942b467 100644
--- a/packages/web-visualization/src/chart/utils/point.ts
+++ b/packages/web-visualization/src/chart/utils/point.ts
@@ -67,6 +67,7 @@ export const projectPoint = ({
 /**
  * Projects multiple data points to pixel coordinates using chart scale functions.
  * Handles both numeric and band scales automatically.
+ * Used for horizontal orientation where X is the category axis.
  *
  * @example
  * ```typescript
@@ -143,6 +144,76 @@ export const projectPoints = ({
   });
 };
 
+/**
+ * Projects multiple data points to pixel coordinates for vertical orientation.
+ * In vertical orientation, Y is the category axis and X is the value axis.
+ * Data values represent X values, and index/yData represents Y positions.
+ *
+ * @example
+ * ```typescript
+ * // For vertical orientation where data flows top-to-bottom
+ * const pixelPoints = projectPointsVertical({ data: [10, 20, 30], xScale, yScale });
+ * // Point 0: y=0, x=10
+ * // Point 1: y=1, x=20
+ * // Point 2: y=2, x=30
+ * ```
+ */
+export const projectPointsVertical = ({
+  data,
+  xScale,
+  yScale,
+  yData,
+}: {
+  data: (number | null | { x: number; y: number })[];
+  yData?: number[];
+  xScale: ChartScaleFunction;
+  yScale: ChartScaleFunction;
+}): Array<{ x: number; y: number } | null> => {
+  if (data.length === 0) {
+    return [];
+  }
+
+  return data.map((value, index) => {
+    if (value === null) {
+      return null;
+    }
+
+    // For explicit x/y objects, use them directly
+    if (typeof value === 'object' && 'x' in value && 'y' in value) {
+      return projectPoint({
+        x: value.x,
+        y: value.y,
+        xScale,
+        yScale,
+      });
+    }
+
+    // For vertical orientation: Y is category axis (index), X is value axis (data value)
+    let yValue: number = index;
+
+    // For band scales, always use the index
+    if (!isCategoricalScale(yScale)) {
+      // For numeric scales with axis data, use the axis data values instead of indices
+      if (yData && Array.isArray(yData) && yData.length > 0) {
+        if (typeof yData[0] === 'number') {
+          const numericYData = yData as number[];
+          yValue = numericYData[index] ?? index;
+        }
+      }
+    }
+
+    // Data value is the X value (value axis)
+    const xValue: number = value as number;
+
+    return projectPoint({
+      x: xValue,
+      y: yValue,
+      xScale,
+      yScale,
+    });
+  });
+};
+
 /**
  * Determines text alignment based on label position.
  * For example, a 'top' position needs the text aligned to the 'bottom' so it appears above the point.

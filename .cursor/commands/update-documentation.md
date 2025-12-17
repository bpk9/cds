# Update Documentation

Updates and refines documentation for a CDS component by analyzing the component code, existing docs, documentation guidelines, and examples from popular open source design systems.

## Arguments

- `componentName` (required): The name of the component to update documentation for (e.g., "Button", "TextInput", "LineChart")

## Instructions

You are tasked with updating and refining the documentation for the **$componentName** component.

### Step 1: Gather Context

First, collect all relevant information:

1. **Read the documentation guidelines** from `.cursor/rules/component-docs.mdc` to understand the required structure and conventions

2. **Find the component source code** by searching for the component in:
   - `packages/web/src/` for web components
   - `packages/mobile/src/` for mobile components
   - Read the main component file(s) to understand all props, features, and usage patterns

3. **Find existing documentation** by searching in:
   - `apps/docs/docs/components/` for the component's documentation directory
   - Read all files: `index.mdx`, `_webExamples.mdx`, `_mobileExamples.mdx`, metadata files, etc.

4. **Research documentation from popular open source libraries** for the same or similar components. Use web search to find documentation from these libraries in priority order:
   1. **Mantine** (mantine.dev/core)
   2. **Material UI / MUI** (mui.com/material-ui/react-\*)
   3. **shadcn/ui** (ui.shadcn.com/docs/components)
   4. **Ant Design** (ant.design/components)
   5. **Radix UI** (radix-ui.com/primitives/docs/components)

   Focus on gathering:
   - What examples they include
   - What key features they document
   - Any accessibility guidance (only if users must handle it themselves)

### Step 2: Analyze and Compare

After gathering all information:

1. **Identify gaps** in the current CDS documentation compared to:
   - The component-docs.mdc guidelines
   - What other libraries document for similar components

2. **Identify areas for improvement**:
   - Missing or incomplete Basics section
   - Interaction patterns not documented
   - Missing composed/real-world examples

3. **Identify what to REMOVE or simplify**:
   - Introduction paragraphs (description is in metadata)
   - Over-documentation of minor features
   - Accessibility sections when the component handles a11y automatically
   - Excessive subheadings within sections

### Step 3: Generate Refined Documentation

Create updated documentation files that:

1. **Follow the structure** defined in component-docs.mdc exactly:
   - **NO introduction paragraph** - start directly with `## Basics`
   - Basics section (required, always first) - include common props like subtitle, media in examples
   - Interaction (if component has controlled state) - ONE example with brief intro, no subheadings
   - Accessibility (ONLY if users must provide labels themselves)
   - Styling (if there are appearance-modifying props) - use simple prop names as headers
   - Composed Examples (complex real-world use cases, always last)

2. **Keep descriptions brief**:
   - Metadata description: ONE sentence describing what the component does (not use cases)
   - Example text: 1-2 sentences max before each code block
   - Don't explain use cases - show them in Composed Examples instead

3. **Be selective about what to document**:
   - Focus on the most important features
   - Don't create separate sections for every prop
   - Show common props in Basics examples rather than separate sections
   - Skip Accessibility section if component handles a11y automatically

4. **Use the correct code patterns**:
   - Web: Use `jsx live` for interactive examples
   - Mobile: Use `jsx` for static code snippets
   - Include proper hooks usage (useMemo, useCallback, useState)
   - Follow the component's actual API from the source code

5. **Link related components naturally**:
   - In Basics: "ComponentName uses [ChildComponent](/link) to render items."
   - Don't list related components at the top of the file

### Step 4: Present the Changes

Present the refined documentation with:

1. A summary of what was improved and why
2. The complete updated content for each file that needs changes
3. Any recommendations for additional improvements that weren't implemented

### Output Format

For each file being updated, show:

- The file path
- A brief explanation of what changed
- The complete updated content

If creating new files, explain why they're needed.

---

**Important Notes:**

- Do NOT modify the component source code, only documentation
- Ensure web and mobile examples follow the same structure when both platforms exist
- Keep examples concise - don't over-explain
- Focus on teaching developers how to use the component effectively
- **NO introduction paragraph** - the description is in metadata
- **Skip Accessibility section** if users don't need to handle a11y themselves
- **Show common props in Basics** examples, not as separate sections

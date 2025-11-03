# AI Data Analyst - Design Guidelines

## Design Approach

**Selected System:** Material Design principles adapted for data-dense productivity applications
**Rationale:** This is a utility-focused data analysis tool requiring clarity, efficiency, and professional presentation. Material Design provides excellent patterns for data tables, cards, and interactive elements while maintaining clean hierarchy.

**Core Principles:**
- Information clarity over visual flair
- Efficient data scanning and comprehension
- Clear visual hierarchy for complex data
- Professional, trustworthy appearance for data analysis

---

## Typography System

**Font Family:** 
- Primary: Inter or Roboto (via Google Fonts CDN)
- Monospace: JetBrains Mono or Fira Code for data/numbers

**Hierarchy:**
- Page Title: text-3xl font-semibold (32px, 600 weight)
- Section Headers: text-xl font-semibold (20px, 600 weight)
- Subsection Headers: text-lg font-medium (18px, 500 weight)
- Body Text: text-base font-normal (16px, 400 weight)
- Data Labels: text-sm font-medium (14px, 500 weight)
- Data Values: text-sm font-mono (14px, monospace)
- Helper Text: text-xs (12px, 400 weight)

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Micro spacing (within components): p-2, gap-2
- Component padding: p-4, p-6
- Section spacing: mb-8, mb-12
- Page margins: p-8, max-w-7xl mx-auto

**Grid Structure:**
- Single-column primary flow for main content
- Two-column layout for analysis controls + results (lg:grid-cols-2)
- Three-column for column selection cards (md:grid-cols-2 lg:grid-cols-3)
- Full-width tables and charts with horizontal scroll on mobile

**Container Strategy:**
- Max-width: max-w-7xl for main content wrapper
- Full-width for data tables and charts
- Contained cards: max-w-4xl for focused content areas

---

## Component Library

### 1. Header Section
- Full-width header with page title and description
- Includes: App name (text-2xl font-bold), tagline (text-base)
- Layout: py-6 px-8, border-b-2
- Sticky positioning on scroll (sticky top-0 z-10)

### 2. File Upload Zone
- Large dropzone area (min-h-48)
- Dashed border (border-2 border-dashed) with rounded corners (rounded-lg)
- Center-aligned upload icon (w-12 h-12 from Heroicons)
- Primary text: "Drop CSV file here or click to browse"
- Secondary text: "Supports .csv files up to 10MB"
- Padding: p-12
- Hover state: Scale icon slightly, add subtle border emphasis

### 3. Data Preview Table
- Full-width responsive table with horizontal scroll
- Header row: sticky top-0, font-medium text-sm
- Cell padding: px-4 py-3
- Alternating row pattern for readability
- Max height with scroll: max-h-96 overflow-y-auto
- Column headers: Sortable with small arrow icons
- Monospace font for numeric data

### 4. Column Selection Cards
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
- Each card: Checkbox + Column name + Data type badge + Missing count
- Card structure: p-4 rounded-lg border-2
- Selected state: Bold border, checkmark icon visible
- Data type badges: Small rounded pills (px-2 py-1 rounded-full text-xs)
- Missing data indicator: Warning icon if >0% missing

### 5. Analysis Control Panel
- Horizontal button group layout: flex flex-wrap gap-4
- Primary action buttons: px-6 py-3 rounded-lg font-medium text-base
- Icons from Heroicons: ChartBarIcon, TableCellsIcon, SparklesIcon
- Button arrangement: "Summary Stats" | "Correlation Matrix" | "AI Insights"
- Margin: my-8

### 6. Results Display Cards
**Statistics Table:**
- Compact table layout with label-value pairs
- Row structure: py-2 border-b
- Labels: font-medium, Values: font-mono
- Section grouping with subtle spacing

**Correlation Matrix:**
- Heatmap visualization using Plotly.js
- Full-width container with aspect ratio preservation
- Responsive height: min-h-96
- Axis labels at 45-degree angle for readability

**Charts (Plotly.js):**
- Histogram: Full-width, height 400px
- Scatter Matrix: Responsive square aspect ratio
- Chart container: p-4 rounded-lg border

### 7. AI Insights Card
- Prominent card: p-6 rounded-xl border-2 shadow-lg
- Header with sparkle icon + "AI-Generated Insights" title
- Insights text: prose max-w-none (use Tailwind typography plugin)
- Structured sections with bullet points and paragraphs
- Action buttons at bottom:
  - "Regenerate Insights" (secondary button)
  - "Ask Follow-up Question" (opens text input)
- Follow-up input: Full-width textarea with submit button

### 8. Loading States
- Spinner component: Centered within parent, w-8 h-8 animated spin
- Skeleton loaders for tables: Animated gradient bars (h-4 rounded)
- Loading overlay: Semi-transparent backdrop with centered spinner
- Loading text: "Processing data..." or "Generating insights..."

### 9. Error States
- Error alert card: p-4 rounded-lg border-l-4
- Icon: ExclamationTriangleIcon from Heroicons
- Error message: font-medium text-base
- Dismissible close button
- Retry button if applicable

### 10. Empty States
- Centered content with large icon (w-16 h-16)
- Primary message: text-lg font-medium
- Secondary message: text-sm
- Call-to-action: Upload prompt or example data link

---

## Page Structure & Flow

**Main Layout:**
```
1. Header (sticky)
2. Upload Zone (if no data)
3. Data Preview Section
   - Preview table (first 10 rows)
   - Column count + row count summary
4. Column Selection Panel
   - Grid of selectable column cards
   - "Select All Numeric" quick action
5. Analysis Controls
   - Action button row
6. Results Area (dynamic, stacked vertically)
   - Summary statistics table
   - Correlation matrix chart
   - Additional visualizations
7. AI Insights Section
   - Insights card with regeneration
   - Follow-up Q&A interface
```

**Vertical Rhythm:**
- Section spacing: mb-12 between major sections
- Card spacing: mb-8 for result cards
- Component spacing: mb-6 within sections

---

## Interactive Patterns

**Data Table Interactions:**
- Hover row: Subtle highlight
- Click column header: Sort ascending/descending
- Horizontal scroll indicator on mobile

**Chart Interactions:**
- Plotly.js default controls: Zoom, pan, reset, download
- Tooltip on hover for data points
- Legend toggle for multi-series charts

**Column Selection:**
- Click card to toggle selection
- Checkbox indicator updates immediately
- Selected count badge updates dynamically

**AI Insights:**
- Typewriter effect for generating text (optional, subtle)
- Expandable/collapsible sections if long
- Copy-to-clipboard button for insights text

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px (md) - Single column, stacked layout
- Tablet: 768px - 1024px - Two-column where appropriate
- Desktop: > 1024px - Full multi-column layouts

**Mobile Adaptations:**
- Upload zone: Reduced padding (p-6)
- Tables: Horizontal scroll, sticky first column
- Column cards: Full-width stack (grid-cols-1)
- Charts: Full-width with preserved aspect ratio
- Buttons: Full-width on mobile (w-full md:w-auto)

---

## Accessibility

- All interactive elements: min-height 44px (touch target size)
- Form labels: Explicit label-input associations
- ARIA labels for icon-only buttons
- Keyboard navigation: Tab order follows visual flow
- Focus indicators: 2px outline offset
- Screen reader text for data table structure
- Alt text for all icons and visual indicators

---

## Assets

**Icons:** Heroicons (via CDN)
- Upload: CloudArrowUpIcon
- Chart: ChartBarIcon
- Table: TableCellsIcon
- AI: SparklesIcon
- Error: ExclamationTriangleIcon
- Loading: ArrowPathIcon (spinning)
- Success: CheckCircleIcon
- Close: XMarkIcon

**No images required** - This is a data-focused application tool where functional clarity takes precedence over visual imagery.
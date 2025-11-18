# UI Guidelines

## Design Philosophy

This application follows Material Design principles with a memory-bank/computer binary theme inspired by classic green screen monitors and terminal interfaces. The design emphasizes clarity, functionality, and a nostalgic computing aesthetic.

---

## Color Palette

### Dark Mode (Primary Theme)

The dark mode palette evokes the classic green-on-black terminal aesthetic with modern Material Design principles.

#### Primary Colors
- **Background**: `#0A0E0F` - Deep black (terminal background)
- **Surface**: `#121617` - Slightly lighter black for elevated surfaces
- **Surface Variant**: `#1A1F21` - Lighter variant for cards and panels

#### Accent Colors
- **Primary Green**: `#00FF41` - Classic terminal green (primary actions)
- **Primary Green Dark**: `#00CC33` - Darker green for hover states
- **Primary Green Light**: `#33FF66` - Lighter green for highlights
- **Cyan Accent**: `#00FFFF` - Cyan for secondary actions and links
- **Cyan Accent Dark**: `#00CCCC` - Darker cyan for hover states

#### Text Colors
- **On Background**: `#E0E0E0` - Light gray for primary text
- **On Surface**: `#FFFFFF` - White for high contrast text
- **On Primary**: `#0A0E0F` - Black text on green buttons
- **Secondary Text**: `#B0B0B0` - Medium gray for secondary text
- **Disabled Text**: `#666666` - Dark gray for disabled states

#### Status Colors
- **Success**: `#00FF41` - Green (matches primary)
- **Warning**: `#FFAA00` - Amber/yellow
- **Error**: `#FF3333` - Red
- **Info**: `#00FFFF` - Cyan

#### Border & Divider
- **Border**: `#1E3A2E` - Dark green-gray for subtle borders
- **Divider**: `#2A4A3A` - Medium green-gray for dividers

### Light Mode

The light mode provides a modern, clean interface with green accents while maintaining readability.

#### Primary Colors
- **Background**: `#FAFAFA` - Off-white background
- **Surface**: `#FFFFFF` - Pure white for elevated surfaces
- **Surface Variant**: `#F5F5F5` - Light gray for cards and panels

#### Accent Colors
- **Primary Green**: `#006633` - Deep green (primary actions)
- **Primary Green Dark**: `#004422` - Darker green for hover states
- **Primary Green Light**: `#008844` - Lighter green for highlights
- **Cyan Accent**: `#0066CC` - Blue-cyan for secondary actions and links
- **Cyan Accent Dark**: `#0055AA` - Darker cyan for hover states

#### Text Colors
- **On Background**: `#212121` - Near black for primary text
- **On Surface**: `#000000` - Black for high contrast text
- **On Primary**: `#FFFFFF` - White text on green buttons
- **Secondary Text**: `#616161` - Medium gray for secondary text
- **Disabled Text**: `#9E9E9E` - Light gray for disabled states

#### Status Colors
- **Success**: `#006633` - Deep green
- **Warning**: `#FF6F00` - Orange
- **Error**: `#C62828` - Red
- **Info**: `#0066CC` - Blue-cyan

#### Border & Divider
- **Border**: `#E0E0E0` - Light gray for subtle borders
- **Divider**: `#BDBDBD` - Medium gray for dividers

### Color Usage Guidelines

- **Primary Green**: Use for primary actions, important highlights, and key interactive elements
- **Cyan Accent**: Use for secondary actions, links, and informational elements
- **Maintain contrast ratios**: Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
- **Status colors**: Use consistently across the application for feedback and alerts

---

## Typography

### Font Family

**Primary Font**: `'Roboto Mono', 'Courier New', monospace`
- Use monospace fonts to maintain the terminal/computer aesthetic
- Roboto Mono provides excellent readability while maintaining the technical feel

**Fallback Stack**: `'Roboto Mono', 'Courier New', 'Consolas', 'Monaco', monospace`

### Type Scale

Based on Material Design type scale, adapted for monospace fonts:

#### Display Styles
- **Display Large**: `57px / 64px` (line-height) - `font-weight: 400`
  - Use for hero sections and major headings
- **Display Medium**: `45px / 52px` - `font-weight: 400`
  - Use for large section headers
- **Display Small**: `36px / 44px` - `font-weight: 400`
  - Use for prominent page titles

#### Headline Styles
- **Headline Large**: `32px / 40px` - `font-weight: 400`
  - Use for main page headings
- **Headline Medium**: `28px / 36px` - `font-weight: 400`
  - Use for section headings
- **Headline Small**: `24px / 32px` - `font-weight: 400`
  - Use for subsection headings

#### Title Styles
- **Title Large**: `22px / 28px` - `font-weight: 500`
  - Use for card titles and important labels
- **Title Medium**: `16px / 24px` - `font-weight: 500`
  - Use for button labels and form section headers
- **Title Small**: `14px / 20px` - `font-weight: 500`
  - Use for small labels and captions

#### Body Styles
- **Body Large**: `16px / 24px` - `font-weight: 400`
  - Use for primary body text
- **Body Medium**: `14px / 20px` - `font-weight: 400`
  - Use for secondary body text
- **Body Small**: `12px / 16px` - `font-weight: 400`
  - Use for helper text and fine print

#### Label Styles
- **Label Large**: `14px / 20px` - `font-weight: 500`
  - Use for form labels and buttons
- **Label Medium**: `12px / 16px` - `font-weight: 500`
  - Use for small buttons and tags
- **Label Small**: `11px / 16px` - `font-weight: 500`
  - Use for overlines and tiny labels

### Typography Guidelines

- **Line Height**: Maintain 1.5x to 1.75x the font size for optimal readability
- **Letter Spacing**: Use `0.5px` for uppercase text, `0px` for normal text
- **Text Alignment**: Left-align body text; center-align only for specific UI elements
- **Text Hierarchy**: Use size, weight, and color to establish clear visual hierarchy
- **Monospace Benefits**: Maintains alignment in code blocks, data tables, and technical content

---

## Grid System

### 12-Column Grid

The application uses a flexible 12-column grid system based on Material Design principles.

#### Grid Structure
- **Total Columns**: 12
- **Gutter Width**: 
  - Mobile: `16px`
  - Tablet: `24px`
  - Desktop: `32px`
- **Column Spacing**: Consistent with gutter width

#### Breakpoints
- **Mobile**: `< 768px` - Single column, full width
- **Tablet**: `768px - 1024px` - Multi-column layout
- **Desktop**: `> 1024px` - Full grid system

#### Grid Usage
- **Containers**: Use grid containers to wrap content
- **Columns**: Content spans 1-12 columns based on layout needs
- **Responsive**: Columns automatically stack on mobile devices
- **Alignment**: Use grid alignment utilities for positioning

### Grid Examples

```
Mobile (< 768px):
┌─────────────────────────────┐
│  [Full Width - 12 columns]  │
│  Margin: 16px                │
└─────────────────────────────┘

Tablet (768px - 1024px):
┌─────────────────────────────────────┐
│  Margin: 24px                       │
│  ┌─────────────────────────────┐   │
│  │  Max Width: 600px            │   │
│  │  [Content Area]              │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘

Desktop (> 1024px):
┌─────────────────────────────────────────────┐
│  Margin: 32px                                │
│           ┌─────────────────────────────┐   │
│           │  Max Width: 600px            │   │
│           │  Centered                    │   │
│           │  [Content Area]              │   │
│           └─────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## Responsive Design

### Mobile (< 768px)

**Layout Specifications:**
- **Margins**: `16px` on all sides
- **Max Width**: `100%` (full viewport width minus margins)
- **Grid**: Single column layout
- **Form Elements**: Stack all form elements vertically
- **Spacing**: Reduced spacing between elements (`8px` base unit)
- **Touch Targets**: Minimum `44px × 44px` for interactive elements

**Design Considerations:**
- Prioritize content over navigation
- Use bottom navigation or hamburger menu
- Optimize images and assets for mobile bandwidth
- Ensure text remains readable without zooming

### Tablet (768px - 1024px)

**Layout Specifications:**
- **Margins**: `24px` on all sides
- **Max Width**: `600px` for main content area
- **Grid**: Multi-column layout (2-3 columns where appropriate)
- **Form Elements**: Can use side-by-side layouts for related fields
- **Spacing**: Standard spacing between elements (`16px` base unit)

**Design Considerations:**
- Balance between mobile and desktop experiences
- Utilize additional horizontal space effectively
- Consider landscape and portrait orientations
- Maintain touch-friendly interactions

### Desktop (> 1024px)

**Layout Specifications:**
- **Margins**: `32px` on all sides
- **Max Width**: `600px` for main content area
- **Centering**: Content centered horizontally on screen
- **Grid**: Full 12-column grid system available
- **Form Elements**: Can use multi-column layouts
- **Spacing**: Generous spacing between elements (`24px` base unit)

**Design Considerations:**
- Maximize readability with optimal line length
- Utilize whitespace effectively
- Support keyboard navigation
- Consider hover states and interactions

### Responsive Breakpoints

```css
/* Mobile First Approach */
/* Base styles for mobile */

/* Tablet */
@media (min-width: 768px) {
  /* Tablet styles */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Desktop styles */
}
```

### Responsive Utilities

- **Hide/Show**: Use responsive utilities to show/hide elements at different breakpoints
- **Flexible Images**: Ensure images scale appropriately (`max-width: 100%`)
- **Fluid Typography**: Consider using `clamp()` for responsive font sizes
- **Container Queries**: Use container queries where appropriate for component-level responsiveness

---

## Component Guidelines

### Buttons

**Primary Button:**
- Background: Primary Green
- Text: On Primary color
- Padding: `12px 24px`
- Border Radius: `4px`
- Font: Label Large

**Secondary Button:**
- Background: Transparent
- Border: 1px solid Primary Green
- Text: Primary Green
- Padding: `12px 24px`
- Border Radius: `4px`

### Cards

- Background: Surface color
- Border: 1px solid Border color
- Border Radius: `8px`
- Padding: `16px` (mobile), `24px` (tablet/desktop)
- Elevation: Subtle shadow for depth (dark mode) or border (light mode)

### Forms

- **Input Fields**: 
  - Border: 1px solid Border color
  - Border Radius: `4px`
  - Padding: `12px 16px`
  - Focus: Border color changes to Primary Green
- **Labels**: Title Medium, positioned above inputs
- **Error States**: Red border and error message below field
- **Success States**: Green border indicator

### Navigation

- **Top Navigation**: Fixed or sticky header
- **Side Navigation**: Collapsible drawer on desktop
- **Bottom Navigation**: Used on mobile for primary actions
- **Active State**: Primary Green underline or background

---

## Spacing System

### Base Unit: 8px

All spacing should be multiples of 8px for consistency:

- `4px` - Extra small spacing
- `8px` - Small spacing
- `16px` - Medium spacing (mobile base)
- `24px` - Large spacing (tablet base)
- `32px` - Extra large spacing (desktop base)
- `48px` - Section spacing
- `64px` - Page spacing

---

## Accessibility

### Color Contrast
- Ensure all text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Test color combinations in both light and dark modes
- Provide alternative indicators beyond color (icons, patterns, text)

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus indicators using Primary Green
- Logical tab order

### Screen Readers
- Semantic HTML elements
- ARIA labels where necessary
- Alt text for images
- Descriptive link text

---

## Animation & Transitions

### Principles
- **Duration**: `200ms` for micro-interactions, `300ms` for standard transitions
- **Easing**: Material Design standard easing curves
- **Purpose**: Enhance usability, not distract
- **Reduced Motion**: Respect `prefers-reduced-motion` media query

### Common Animations
- **Hover**: Subtle scale or color transition
- **Focus**: Border color change with smooth transition
- **Loading**: Subtle pulse or spinner in Primary Green
- **Page Transitions**: Fade or slide transitions

---

## Implementation Notes

### CSS Variables

Consider using CSS custom properties for theming:

```css
:root {
  /* Dark Mode */
  --color-bg-primary: #0A0E0F;
  --color-surface: #121617;
  --color-primary: #00FF41;
  --color-text-primary: #E0E0E0;
  /* ... */
}

[data-theme="light"] {
  /* Light Mode */
  --color-bg-primary: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-primary: #006633;
  --color-text-primary: #212121;
  /* ... */
}
```

### Material Design Components

When using Material Design component libraries:
- Customize colors to match the green screen theme
- Override default fonts to use monospace
- Maintain spacing and sizing guidelines
- Ensure responsive behavior matches specifications

---

## Version History

- **v1.0** - Initial UI Guidelines Document
  - Color palettes for light and dark modes
  - Typography system
  - Grid system and responsive design specifications
  - Component guidelines


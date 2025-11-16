# Design System Documentation

## Overview

SportTrack uses a comprehensive design system built on design tokens and reusable UI components. This document outlines the design principles, tokens, and component library.

## Design Tokens

### Colors

The color system is organized into semantic categories:

- **Primary (Brand)**: Blue tones for primary actions and branding
- **Secondary**: Complementary colors for secondary actions
- **Semantic**: Success, warning, error, and info colors
- **Neutral**: Grays for text, borders, and backgrounds

All colors support both light and dark modes.

### Typography

- **Font Families**: System fonts with fallbacks
- **Font Sizes**: Responsive scale from 12px to 48px
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Line Heights**: Optimized for readability

### Spacing

4px base unit system:

- 0, 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px

### Border Radius

- **sm**: 4px
- **md**: 8px
- **lg**: 12px
- **xl**: 16px
- **full**: 9999px

### Shadows

Elevation levels:

- **sm**: Subtle shadow for cards
- **md**: Medium shadow for elevated elements
- **lg**: Large shadow for modals
- **xl**: Extra large shadow for popovers

### Animations

- **Duration**: 150ms, 200ms, 300ms, 500ms
- **Easing**: ease-in-out, ease-out, ease-in

## UI Components

### Button

Primary interactive element with multiple variants and sizes.

**Variants:**

- `primary`: Main action button
- `secondary`: Secondary action
- `outline`: Outlined button
- `ghost`: Minimal button
- `danger`: Destructive action
- `success`: Success action
- `warning`: Warning action

**Sizes:**

- `sm`: Small (32px height)
- `md`: Medium (40px height)
- `lg`: Large (48px height)

**States:**

- Default, hover, active, disabled, loading

### Input

Form input component with validation states.

**Variants:**

- `default`: Standard input
- `filled`: Filled background
- `outlined`: Outlined border

**Features:**

- Label support
- Helper text
- Error states
- Icon support
- Disabled state

### Card

Container component for grouping content.

**Variants:**

- `default`: Standard card
- `elevated`: Elevated with shadow
- `outlined`: Outlined border
- `filled`: Filled background

**Features:**

- Optional header and footer
- Hoverable state
- Clickable state
- Responsive sizing

### Badge

Small status indicator component.

**Variants:**

- `default`, `primary`, `secondary`, `success`, `warning`, `error`, `info`

**Features:**

- Dot mode
- Multiple sizes
- Color-coded variants

### Select

Dropdown selection component.

**Features:**

- Label and helper text
- Error states
- Disabled state
- Multiple sizes
- Searchable (future)

### Checkbox

Form checkbox component.

**Features:**

- Label and helper text
- Error states
- Indeterminate state
- Disabled state
- Full width option

### Switch

Toggle switch component.

**Features:**

- Label and helper text
- Error states
- Disabled state
- Multiple sizes

### Radio

Radio button component with group support.

**Features:**

- RadioGroup for managing groups
- Label and helper text
- Error states
- Horizontal/vertical orientation

### Textarea

Multi-line text input component.

**Features:**

- Label and helper text
- Error states
- Disabled state
- Resizable
- Row count control

### Tooltip

Contextual information component.

**Features:**

- Multiple positions (top, bottom, left, right)
- Delay configuration
- Mobile auto-disable
- Portal rendering

## Usage

### Importing Components

```tsx
import { Button, Input, Card } from '@/components/ui';
```

### Example Usage

```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  helperText="We'll never share your email"
/>

<Card variant="elevated" header="Title" footer="Footer">
  Content goes here
</Card>
```

## Storybook

All UI components are documented in Storybook. Run `npm run storybook` to view interactive documentation.

## Accessibility

All components follow WCAG 2.1 AA guidelines:

- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

## Responsive Design

Components are mobile-first and responsive:

- Touch-friendly sizes (minimum 44x44px)
- Responsive typography
- Adaptive spacing
- Mobile-specific optimizations

## Dark Mode

All components support dark mode through Tailwind's dark mode classes. The theme is controlled globally and components automatically adapt.

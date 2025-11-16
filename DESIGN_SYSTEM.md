# 🎨 SportTrack Design System

## 📋 Genel Bakış

SportTrack Design System, uygulama genelinde tutarlı bir kullanıcı deneyimi sağlamak için merkezi bir tasarım dili tanımlar. Bu sistem renkler, tipografi, spacing, shadows, animations ve component'ler için standartlar içerir.

---

## 🎨 Renk Sistemi

### Primary Colors (Brand)

- **50**: `#f0f9ff` - Çok açık mavi (backgrounds)
- **100**: `#e0f2fe` - Açık mavi (subtle backgrounds)
- **200**: `#bae6fd` - Açık mavi (hover states)
- **300**: `#7dd3fc` - Orta açık mavi
- **400**: `#38bdf8` - Orta mavi
- **500**: `#0ea5e9` - **Brand Color** (primary actions)
- **600**: `#0284c7` - Koyu mavi (hover states)
- **700**: `#0369a1` - Daha koyu mavi
- **800**: `#075985` - Çok koyu mavi
- **900**: `#0c4a6e` - En koyu mavi
- **950**: `#082f49` - Neredeyse siyah mavi

### Semantic Colors

#### Success

- **500**: `#22c55e` - Başarı mesajları, pozitif durumlar
- **600**: `#16a34a` - Hover states
- **700**: `#15803d` - Active states

#### Warning

- **500**: `#f59e0b` - Uyarı mesajları
- **600**: `#d97706` - Hover states
- **700**: `#b45309` - Active states

#### Error

- **500**: `#ef4444` - Hata mesajları, tehlikeli aksiyonlar
- **600**: `#dc2626` - Hover states
- **700**: `#b91c1c` - Active states

#### Info

- **500**: `#3b82f6` - Bilgilendirme mesajları
- **600**: `#2563eb` - Hover states
- **700**: `#1d4ed8` - Active states

### Neutral Colors (Grays)

- **50**: `#fafafa` - En açık gri (backgrounds)
- **100**: `#f5f5f5` - Çok açık gri
- **200**: `#e5e5e5` - Açık gri (borders)
- **300**: `#d4d4d4` - Orta açık gri
- **400**: `#a3a3a3` - Orta gri (disabled text)
- **500**: `#737373` - Standart gri (secondary text)
- **600**: `#525252` - Koyu gri (secondary text dark mode)
- **700**: `#404040` - Daha koyu gri
- **800**: `#262626` - Çok koyu gri (dark mode backgrounds)
- **900**: `#171717` - Neredeyse siyah (dark mode surfaces)
- **950**: `#0a0a0a` - En koyu gri (dark mode backgrounds)

---

## 📝 Tipografi Sistemi

### Font Sizes

- **xs**: `0.75rem` (12px) - Captions, labels
- **sm**: `0.875rem` (14px) - Small text, helper text
- **base**: `1rem` (16px) - Body text (default)
- **lg**: `1.125rem` (18px) - Large body text
- **xl**: `1.25rem` (20px) - H3 headings
- **2xl**: `1.5rem` (24px) - H2 headings
- **3xl**: `1.875rem` (30px) - H1 headings (mobile)
- **4xl**: `2.25rem` (36px) - H1 headings (desktop)

### Font Weights

- **normal**: `400` - Body text
- **medium**: `500` - Labels, emphasis
- **semibold**: `600` - Subheadings
- **bold**: `700` - Headings

### Line Heights

- **tight**: `1.25` - Headings
- **snug**: `1.375` - Compact text
- **normal**: `1.5` - Default
- **relaxed**: `1.625` - Body text
- **loose**: `2` - Spacious text

---

## 📏 Spacing Sistemi

Base unit: **4px**

- **0**: `0` - No spacing
- **1**: `0.25rem` (4px) - Tight spacing
- **2**: `0.5rem` (8px) - Small spacing
- **3**: `0.75rem` (12px) - Medium-small spacing
- **4**: `1rem` (16px) - Default spacing
- **5**: `1.25rem` (20px) - Medium spacing
- **6**: `1.5rem` (24px) - Large spacing
- **8**: `2rem` (32px) - Extra large spacing
- **10**: `2.5rem` (40px) - XXL spacing
- **12**: `3rem` (48px) - Section spacing
- **16**: `4rem` (64px) - Major section spacing
- **20**: `5rem` (80px) - Page spacing
- **24**: `6rem` (96px) - Maximum spacing

---

## 🎭 Border Radius

- **none**: `0` - No radius
- **sm**: `0.25rem` (4px) - Small elements
- **md**: `0.5rem` (8px) - Medium elements
- **lg**: `0.75rem` (12px) - **Default** (buttons, inputs)
- **xl**: `1rem` (16px) - Cards
- **2xl**: `1.5rem` (24px) - Large cards
- **3xl**: `2rem` (32px) - Extra large cards
- **full**: `9999px` - Pills, badges

---

## 🌑 Shadow System (Elevation)

### Elevation Levels

- **0**: `none` - No shadow
- **1**: `0 1px 2px 0 rgb(0 0 0 / 0.05)` - Subtle elevation
- **2**: `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` - **Default** (cards)
- **3**: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` - Medium elevation
- **4**: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` - High elevation (modals)
- **5**: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` - Very high elevation
- **6**: `0 25px 50px -12px rgb(0 0 0 / 0.25)` - Maximum elevation

### Colored Shadows

- **Primary**: `0 4px 14px 0 rgb(14 165 233 / 0.15)` - Brand elements
- **Primary Hover**: `0 8px 20px 0 rgb(14 165 233 / 0.25)` - Brand elements hover
- **Success**: `0 4px 14px 0 rgb(34 197 94 / 0.15)` - Success elements
- **Warning**: `0 4px 14px 0 rgb(245 158 11 / 0.15)` - Warning elements
- **Error**: `0 4px 14px 0 rgb(239 68 68 / 0.15)` - Error elements

---

## ⚡ Animation System

### Durations

- **instant**: `0ms` - Immediate
- **fast**: `150ms` - Quick transitions
- **normal**: `300ms` - **Default** transitions
- **slow**: `500ms` - Slow transitions
- **slower**: `750ms` - Very slow transitions
- **slowest**: `1000ms` - Maximum duration

### Easing Functions

- **linear**: `linear` - Constant speed
- **ease-in**: `cubic-bezier(0.4, 0, 1, 1)` - Slow start
- **ease-out**: `cubic-bezier(0, 0, 0.2, 1)` - **Default** (slow end)
- **ease-in-out**: `cubic-bezier(0.4, 0, 0.2, 1)` - Slow start and end
- **bounce**: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` - Bouncy effect
- **spring**: `cubic-bezier(0.175, 0.885, 0.32, 1.275)` - Spring effect

---

## 🧩 Component System

### Button Component

**Variants:**

- `primary` - Primary actions (brand color)
- `secondary` - Secondary actions
- `outline` - Outlined buttons
- `ghost` - Transparent buttons
- `danger` - Destructive actions
- `success` - Success actions
- `warning` - Warning actions

**Sizes:**

- `sm` - Small (min-height: 44px on mobile)
- `md` - Medium (default, min-height: 44px)
- `lg` - Large (min-height: 48px)

### Input Component

**Variants:**

- `default` - Standard input
- `filled` - Filled background
- `outlined` - Outlined border

**Sizes:**

- `sm` - Small (min-height: 36px)
- `md` - Medium (default, min-height: 44px)
- `lg` - Large (min-height: 48px)

### Card Component

**Variants:**

- `default` - Standard card
- `elevated` - Higher elevation
- `outlined` - Outlined border
- `filled` - Filled background

**Sizes:**

- `sm` - Small padding
- `md` - Medium padding (default)
- `lg` - Large padding

---

## 📱 Responsive Breakpoints

- **xs**: `475px` - Extra small devices
- **sm**: `640px` - Small devices (mobile)
- **md**: `768px` - Medium devices (tablet)
- **lg**: `1024px` - Large devices (desktop)
- **xl**: `1280px` - Extra large devices
- **2xl**: `1536px` - 2X large devices

**Mobile Breakpoint:** `767px` (BREAKPOINTS.MOBILE)

---

## ♿ Accessibility Standards

### WCAG AA Compliance

- **Contrast Ratio**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Touch Targets**: Minimum 44x44px on mobile
- **Focus States**: Visible focus indicators
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and roles

### Color Contrast Guidelines

- **Primary Text**: `text-gray-900` (light) / `text-gray-100` (dark)
- **Secondary Text**: `text-gray-600` (light) / `text-gray-400` (dark)
- **Disabled Text**: `text-gray-500` (both modes)

---

## 🌓 Dark Mode Support

Tüm component'ler dark mode'u destekler:

- Background colors adapt automatically
- Text colors maintain contrast
- Borders adjust for visibility
- Shadows adapt for dark backgrounds

---

## 📚 Usage Guidelines

### Importing Components

```typescript
import { Button, Input, Card } from '@/components/ui';
```

### Using Design Tokens

```typescript
import { designTokens } from '@/lib/design-tokens';

// Access colors
const brandColor = designTokens.colors.primary[500];

// Access spacing
const spacing = designTokens.spacing.scale[4];

// Access typography
const fontSize = designTokens.typography.fontSize.base;
```

### Using CSS Custom Properties

```css
.my-element {
  color: var(--color-primary-500);
  padding: var(--spacing-4);
  font-size: var(--font-size-base);
}
```

---

## 🔄 Version History

- **v1.0.0** (2025-01) - Initial design system documentation
- Design tokens centralized in `src/lib/design-tokens.ts`
- All UI components follow design system standards
- Storybook stories for all components

---

**Son Güncelleme:** 2025-01  
**Maintainer:** SportTrack Development Team

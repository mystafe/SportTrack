# Changelog

All notable changes to SportTrack will be documented in this file.

## [0.30.0] - 2025-01

### Added

- **Scroll Handler System**: New component for automatic focus management on page transitions
  - Automatic focus on main content area when navigating between pages
  - Improved keyboard navigation with arrow keys
  - Enhanced touch scroll experience on mobile devices

### Changed

- **Dialog Positions**: Conflict Resolution and Export dialogs now start higher on mobile (`pt-28`)
- **Settings Dialog Buttons**: All display settings buttons are now smaller and fit on a single row
  - Button sizes reduced: `text-[6px]`, `min-h-[16px]`, `max-w-[18px]` on mobile
  - Changed from `flex-wrap` to `flex-nowrap` to keep buttons in one row
  - Reduced gap values (`gap-0.5`)
- **Activities Page**: Increased spacing between "Egzersizler" and "Kayıtlar" accordions
  - Mobile: `mt-6` (24px)
  - Desktop: `mt-8` (32px)

### Fixed

- **Accordion Z-Index**: Fixed accordion menus appearing above header during scroll
  - Set accordion z-index to `z-0` to ensure header always stays on top
- **Export Dialog Overflow**: Fixed horizontal scroll issues in Export dialog
  - Added `overflow-x-hidden` to prevent horizontal scrolling
  - Reduced button sizes for better fit
- **Conflict Resolution Dialog**: Fixed dialog appearing below header
  - Adjusted positioning with proper top padding
- **Settings Dialog Buttons**: Fixed buttons overflowing and wrapping to new line
  - All buttons now fit on single row with optimized sizing
- **Scroll Issues**: Fixed keyboard and touch scroll problems
  - Added password manager ignore attributes to prevent interference
  - Improved touch-action handling for better mobile scroll

## [0.21.1] - 2025-01

### Fixed

- **Cloud Sync Infinite Loop**: Fixed infinite reload loop when downloading cloud data
  - Added `isReloadingRef` flag to prevent multiple simultaneous reloads
  - Added `initialSyncCheckStartedRef` flag to prevent multiple initial sync checks
  - Improved coordination between `performInitialSyncCheck` and `subscribeToCloud` callback
  - Reload delay reduced from 500ms to 100ms for faster sync
  - Flags are properly reset on logout and user change
  - Error handling improved to reset flags on failure

## [0.21.0] - 2025-01

### Changed

- **Base Activity Multipliers**: Updated activity multipliers for better point calculation
  - Merdiven Çıkma (Stairs): multiplier increased from x20 to x50
  - Crunch renamed to Plank: multiplier increased from x5 to x10
  - Ağırlık Çalışması (Weight Lifting): multiplier decreased from x20 to x10

- **Cloud Sync Improvements**: Enhanced cloud synchronization
  - Base activity overrides now sync to cloud storage
  - Custom activities and base activity overrides automatically sync without conflict resolution
  - Settings (including custom activities and base overrides) sync automatically
  - Conflict resolution dialog no longer shows activities/settings comparison (they sync automatically)

- **UI Improvements**: Enhanced user interface elements
  - Profile button width increased for better visibility (mobile: 320px → 360px, desktop: 1600px → 1800px)
  - Add Exercise button text enhanced with subtle glow effect for better visibility
  - Profile button text truncation adjusted to show more characters (15 → 18 on mobile)

### Fixed

- **Cloud Sync Base Activity Overrides**: Base activity overrides are now properly synced to and from cloud storage
  - Base activity overrides are stored in activities subcollection
  - Overrides are correctly restored when downloading from cloud
  - Settings include baseActivityOverrides field in sync operations

## [0.20.0] - 2025-01

### Added

- **Base Activity Override System**: Base activities can now be edited directly
  - Added `BaseActivityOverride` type to allow customization of base activities
  - Base activity edits are stored as overrides and merged with base definitions
  - Overrides persist across sessions and sync with cloud storage
  - Base activity overrides are applied when displaying activities

- **Animation Reduction Setting**: Added option to reduce animations
  - New "Reduce Animations" setting in Settings dialog
  - Applies global CSS class to minimize animation durations
  - Respects system `prefers-reduced-motion` preference
  - Improves accessibility and performance for users who prefer less motion

### Changed

- **Page Transition Performance**: Significantly improved page transition speed
  - Reduced transition durations from 0.3s to 0.1s
  - Optimized animation easing functions
  - Reduced transform values for smoother transitions
  - Implemented shallow routing in navigation for faster page loads

- **Animation Durations**: Reduced default animation durations
  - Fast duration: 150ms → 100ms
  - Normal duration: 300ms → 150ms
  - Slow duration: 500ms → 200ms

### Fixed

- **Base Activity Editing**: Fixed base activity edit functionality
  - Base activities can now be edited and saved correctly
  - Override system properly merges base definitions with user customizations
  - Fixed issue where base activity edits were not persisting
  - Improved override key handling in `updateBaseActivity` function

## [0.19.4] - 2025-01

### Removed

- **Onboarding Tour Feature**: Completely removed onboarding tour functionality
  - Removed OnboardingTour and OnboardingManager components from Providers
  - Removed "Show Onboarding Tour" button from Settings dialog
  - Removed onboarding-related localStorage references
  - Cleaned up onboarding-related code and dependencies

### Fixed

- **Sync Conflict Dialog Z-Index**: Fixed conflict resolution dialog appearing behind Settings dialog
  - Increased conflict dialog z-index from `z-[9999]` to `z-[10001]` to ensure it appears above Settings (`z-[10000]`)

- **Add Exercise Button Visibility**: Fixed "Egzersiz Ekle" button not appearing when Settings dialog is open
  - Removed settingsOpen check that was hiding the entire ScrollToTop component
  - Now only the "Scroll to Top" button is hidden when Settings is open
  - "Egzersiz Ekle" button remains visible at all times

### Changed

- **Add Exercise Button Enhancements**:
  - Added "Aktivite Ekle" label below the button for better clarity
  - Implemented Apple-style liquid glass blur effect with backdrop-blur
  - Added semi-transparent background with border for depth
  - Improved visual hierarchy and user experience

- **Profile Button Width**: Increased profile button width for better readability
  - Mobile: `min-w-[200px]` → `min-w-[280px]`, `max-w-[320px]` → `max-w-[400px]`
  - Desktop: `max-w-[1200px]` → `max-w-[1400px]`

- **Z-Index Hierarchy**: Adjusted z-index values for proper layering
  - ScrollToTop component: `z-[99999]` → `z-[9999]` (below Settings)
  - ConflictResolutionDialog: `z-[9999]` → `z-[10001]` (above Settings)

## [0.19.3] - 2025-01

### Changed

- **Settings Dialog UI/UX Improvements**:
  - Renamed "Dışa Aktar/İçe Aktar" section to "Veri İşlemleri" (Data Operations)
  - Moved "Tüm Verileri Temizle" (Clear All Data) button to Data Operations section
  - Moved "Show Onboarding Tour" button to Data Operations section
  - All buttons in Data Operations section now have consistent 24x24px size and outline variant
  - "Görünüm Ayarları" (Display Settings) section restructured:
    - Title displayed separately above controls
    - Language, Theme, and List Density controls displayed in a single row below title
    - List Density toggle redesigned as switch-style buttons with icons (📋 for compact, 📄 for comfortable)
  - Improved visual consistency across all settings buttons
  - Better mobile responsiveness with consistent spacing and sizing

### Fixed

- Button size consistency in settings dialog
- Layout alignment issues in Display Settings section
- Improved button grouping and visual hierarchy

## [0.19.2] - 2025-01

### Added

- **Design System**: Comprehensive design system implementation
  - Design tokens for colors, typography, spacing, border radius, shadows, animations
  - Centralized design token definitions in `src/lib/design-tokens.ts`
  - CSS custom properties for design tokens in `globals.css`
  - Tailwind configuration integration with design tokens

- **UI Component Library**: Reusable React components
  - `Button`: Multiple variants (primary, secondary, outline, ghost, danger, success, warning) and sizes
  - `Input`: Form inputs with variants, labels, helper text, error states, and icon support
  - `Card`: Container component with variants, header/footer, hoverable, and clickable states
  - `Select`: Dropdown selection with labels, helper text, and error states
  - `Textarea`: Multi-line text input with validation states
  - `Badge`: Status indicator with multiple variants and sizes
  - `Checkbox`: Form checkbox with label, helper text, and indeterminate state
  - `Switch`: Toggle switch component with multiple sizes
  - `Radio` & `RadioGroup`: Radio button components with group management
  - `Tooltip`: Contextual information component with multiple positions

- **Component Integration**: 52 components now use new UI components
  - All dialog components (ConfirmDialog, AuthDialog, ExportDialog, etc.)
  - All form components (ActivityForm, ChallengeDialog, etc.)
  - All page components (Activities, Stats, Challenges, Achievements)
  - All utility components (ScrollToTop, FloatingActionButton, etc.)
  - All settings components (SettingsDialog, NotificationSettings, etc.)

- **Storybook Setup**: Component documentation and testing
  - Storybook 10.0.7 installation and configuration
  - Next.js Vite builder integration
  - Dark mode support in Storybook
  - Accessibility addon configuration
  - Story files for Button, Input, Card, Badge, Select, Checkbox components
  - Interactive component documentation

- **Documentation**: Design system documentation
  - `docs/DESIGN_SYSTEM.md`: Comprehensive design system documentation
  - Component usage examples and guidelines
  - Accessibility guidelines
  - Responsive design principles

### Changed

- **Component Architecture**: Migrated from native HTML elements to reusable UI components
  - All `<button>` elements replaced with `Button` component
  - All `<input>` elements replaced with `Input` component
  - All `<select>` elements replaced with `Select` component
  - All `<textarea>` elements replaced with `Textarea` component
  - Consistent styling and behavior across all components

- **Design Consistency**: Unified design language across the application
  - Consistent spacing using 4px base unit system
  - Consistent color usage through design tokens
  - Consistent typography through design tokens
  - Consistent border radius and shadows

### Improved

- **Developer Experience**: Better component reusability and maintainability
  - Centralized component definitions
  - Type-safe component props
  - Consistent API across components
  - Storybook for component development and testing

- **User Experience**: Improved visual consistency and accessibility
  - WCAG 2.1 AA compliant components
  - Consistent interaction patterns
  - Better mobile responsiveness
  - Improved dark mode support

## [0.19.1] - 2025-01

### Fixed

- **TypeScript Type Errors**: Fixed all type errors preventing Firebase and Vercel builds
  - Fixed `ActivityDefinition[]` vs `ActivityRecord[]` confusion in conflict resolver
  - Fixed `CustomActivityDefinition` to `ActivityDefinition` conversion
  - Fixed `Badge` and `Challenge` type casting issues
  - Fixed missing `statistics` field in `CloudData` type
  - Fixed `UserSettings` type compatibility issues

### Changed

- **Build Process**: Improved type safety across all sync-related components
- **Firebase Deploy**: Successfully deployed to Firebase Hosting with all fixes

## [0.19.0] - 2025-01

### Added

- **Comprehensive Sync Testing**: 24+ tests for sync functionality
  - Sync service unit tests (11 tests)
  - Conflict resolver tests (13 tests)
  - Auto sync hook tests
- **Sync State Management**: `useSyncStatus` hook for real-time sync status
- **Sync History**: Track and display sync operations history
- **Debug Tools**: Enhanced console helpers (`syncDebug`)
- **Welcome Toast**: Welcome message after login with animations

### Changed

- **Sync Performance**: Debounce delay reduced from 5s to 2s for faster sync
- **Periodic Check**: Increased from 30s to 60s to reduce Firebase requests
- **Change Detection**: Hash-based detection for content changes (not just count)
- **Sync Triggering**: Now triggers on add, edit, and delete operations
- **Navigation**: Auto-redirect to homepage after activity add and conflict resolution

### Fixed

- **Edit/Delete Sync**: Edit and delete operations now properly trigger sync
- **Hash Detection**: Content changes are now correctly detected
- **Export Functions**: `isEmpty`, `mergeData`, `useNewest` functions are now exported
- **Navigation**: Missing navigation after activity add and conflict resolution

### Improved

- **Conflict Resolution**: Identical data detection to prevent unnecessary syncs
- **Error Handling**: Better error classification and retry mechanisms
- **Sync UI**: Real-time status indicators and sync history display
- **Code Quality**: Comprehensive test coverage and improved type safety

## [0.14.8] - 2025-01

### Fixed

- **ScrollToTop Button Visibility**:
  - Improved visibility detection logic with multiple checks
  - Button now appears higher on screen (bottom-52 mobile, bottom-48 desktop)
  - Better handling of dynamic content loading
  - More reliable visibility on homepage and all pages

### Changed

- **QuoteTicker Improvements**:
  - Reduced height for more compact design (py-2.5 mobile, py-3 desktop)
  - Improved vertical alignment of text and separators
  - Larger text size on desktop (text-base instead of text-sm)
  - Better visual balance with reduced padding

### Improved

- **Manage Activities Button**:
  - Enhanced design with purple-indigo gradient
  - Added gear icon (⚙️) for better visual recognition
  - Improved touch targets and hover effects
  - Better mobile and desktop responsiveness

- **Install Prompt**:
  - Smaller text sizes for more compact design
  - Better spacing and padding adjustments
  - Improved mobile layout

## [0.14.7] - 2025-01

### Fixed

- **Badge Unlock Notification Animation**:
  - Fixed badge notification appearing in top-left corner before centering
  - Badge now appears directly centered on screen from the start
  - Improved animation smoothness and visual consistency
  - Added exit animation when badge is dismissed or clicked

### Changed

- **Badge Unlock Notification Interaction**:
  - Badge notification is now clickable
  - Clicking badge navigates to achievements page
  - Badge disappears smoothly when clicked
  - Added hint text: "Click to view your badges"
  - Improved visual feedback with cursor pointer

### Improved

- **Page Transitions**:
  - Added smooth scroll behavior to HTML element
  - Page transitions are now consistent and smooth
  - Better user experience when navigating between pages

## [0.14.6] - 2025-01

### Fixed

- **Install Prompt Layout**:
  - Install prompt no longer spans full screen width
  - Added max-width constraint (max-w-md) to center the prompt
  - Improved responsive layout: stacked on mobile, horizontal on desktop
  - Enhanced button styling with gradients and better spacing
  - Better visual hierarchy and readability

### Changed

- **Install Prompt Design**:
  - Changed from full-width to centered card with max-width
  - Improved button layout: full-width on mobile, auto-width on desktop
  - Enhanced borders and shadows for better visual appeal
  - Better text contrast and spacing

## [0.14.5] - 2025-01

### Fixed

- **ScrollToTop Button Visibility**:
  - Reduced scroll threshold from 200px to 100px for better visibility
  - Increased bottom offset (mobile: bottom-44, desktop: bottom-40) to ensure button is always above QuoteTicker
  - Added explicit visibility style to ensure button appears correctly
  - Button now appears earlier when scrolling, making it more accessible on homepage

### Changed

- **Activity Templates Mobile Layout**:
  - Changed mobile grid layout from 1 column to 2 columns
  - Activity template cards now display side-by-side on mobile devices
  - Improved space utilization and visual balance on mobile screens

## [0.14.4] - 2025-01

### Fixed

- **iOS Dark Mode Safe Area**:
  - Fixed white background appearing in safe area insets (notch and home indicator areas) on iOS devices in dark mode
  - Added pseudo-elements (`::before` and `::after`) to cover safe area insets with proper background colors
  - Safe area insets now correctly show black background in dark mode
  - Improved visual consistency across iOS devices with notches and home indicators

## [0.14.3] - 2025-01

### Fixed

- **Mood Persistence**:
  - Fixed issue where mood selection was lost after page refresh
  - Mood is now properly loaded from localStorage when settings are initialized
  - Mood persists correctly across page reloads and browser sessions

## [0.14.2] - 2025-01

### Added

- **JSON Export Format**:
  - Added JSON export option to ExportDialog
  - JSON export includes all activities, settings, export date, version, date range, and summary statistics
  - Full backup/restore capability for data migration
  - JSON format compatible with existing import functionality
  - Export file name: `sporttrack-backup-YYYY-MM-DD.json`

### Changed

- **ExportDialog**:
  - Added JSON format button alongside CSV and PDF
  - Format buttons now stack vertically on mobile for better UX
  - JSON export respects date range filters (all time, last 7 days, last 30 days, custom range)

### Fixed

- **Export Functionality**:
  - JSON export now available through ExportDialog (previously only available through DataExportImport component)
  - Consistent export experience across all formats

## [0.14.1] - 2025-01

### Fixed

- **Translation Keys**:
  - Added missing `stats.averageDaily` translation key (TR: "Ortalama Günlük", EN: "Average Daily")
  - Added missing `stats.perActivity` translation key (TR: "Aktivite Başına", EN: "Per Activity")
  - Removed fallback strings from `StatsCards` component
- **Visual Consistency**:
  - Updated `DurationStats` component to use new typography and spacing scale systems
  - Updated `PeriodComparison` component to use consistent card design system
  - Updated `ActivityTimeAnalysis` component to use consistent card design and typography
  - Updated `ActivityTypeTrend` component to use consistent card design and typography
  - Replaced old card styles (`rounded-lg border border-`, `shadow-card`, `hover-lift`) with new unified system
  - Applied `text-heading-3` and `text-body` typography classes throughout
  - Applied `spacing-md` and `spacing-lg` spacing utilities throughout

## [0.14.0] - 2025-01

### Added

- **Comprehensive Performance Optimizations**:
  - Added `React.memo` to all major components:
    - `StatsHighlights`, `StatsCards`, `PersonalRecords`
    - `ChallengeCard`, `PeriodComparison`, `DurationStats`
    - `ActivityTimeAnalysis`, `ActivityTypeTrend`, `ActivityFilters`
  - Implemented `useCallback` hooks for event handlers in `ActivityFilters`
  - Significant reduction in unnecessary re-renders across the application
- **Typography Scale System Integration**:
  - Applied `text-heading-1`, `text-heading-2`, `text-heading-3` throughout components
  - Replaced inline font sizes with `text-body`, `text-body-small`, `text-label`
  - Consistent typography hierarchy across all pages
- **Spacing Scale System Integration**:
  - Applied `spacing-xs`, `spacing-sm`, `spacing-md`, `spacing-lg`, `spacing-xl` utilities
  - Replaced inconsistent `space-y-*` and `gap-*` classes
  - Better visual consistency and maintainability

### Changed

- **Visual Consistency Improvements**:
  - All cards now use consistent `card-entrance` animation and styling
  - Unified card design: `rounded-xl border-2` with gradient backgrounds
  - Consistent shadow system: `shadow-md hover:shadow-xl`
  - Improved border colors: `border-gray-200 dark:border-gray-700`
  - Enhanced gradient backgrounds across all components
- **Component Updates**:
  - `PersonalRecords`: Updated card designs, typography, and spacing
  - `ChallengeCard`: Enhanced mobile touch targets, typography, and visual design
  - `DurationStats`: Improved card styling and typography consistency
  - `PeriodComparison`: Updated card designs and typography
  - `ActivityTimeAnalysis`: Enhanced card styling and typography
  - `ActivityTypeTrend`: Improved card designs and typography
  - `ActivityFilters`: Added memoization and useCallback optimizations
- **Mobile UX Enhancements**:
  - Improved touch target sizes in `ChallengeCard` (min-h-[36px] min-w-[36px]`)
  - Better mobile spacing and padding throughout
  - Enhanced mobile typography scaling

### Fixed

- **Performance**:
  - Reduced unnecessary re-renders in all optimized components
  - Better memory management with proper memoization
  - Improved callback dependency management

## [0.13.5] - 2025-01

### Added

- **Error Boundary Component**:
  - Added React Error Boundary for graceful error handling
  - User-friendly error fallback UI with reload and reset options
  - Development mode error details display
  - Prevents entire app crash on component errors
  - Beautiful error UI with emoji and clear messaging
- **Typography Scale System**:
  - Added consistent typography utility classes
  - `text-heading-1`, `text-heading-2`, `text-heading-3` for headings
  - `text-body`, `text-body-small` for body text
  - `text-label` for form labels and small text
  - Consistent font sizes across the application
- **Spacing Scale System**:
  - Added consistent spacing utility classes
  - `spacing-xs` (gap-2), `spacing-sm` (gap-3), `spacing-md` (gap-4)
  - `spacing-lg` (gap-6), `spacing-xl` (gap-8)
  - Better spacing consistency across components

### Changed

- **Container Padding**:
  - Increased desktop container padding from `px-4` to `px-6` for better spacing
  - Mobile padding remains `px-4` for optimal use of space
- **Component Updates**:
  - Updated `StatsCards` and `StatsHighlights` to use new spacing utilities
  - Better visual consistency across stats components

### Fixed

- **Error Handling**:
  - App no longer crashes completely on component errors
  - Better error recovery with reload and reset options
  - Error messages displayed in development mode for debugging

## [0.13.4] - 2025-01

### Added

- **Performance Optimizations**:
  - Added `React.memo` to `QuickAdd` and `ActivityTemplates` components for better re-render performance
  - Implemented `useCallback` hooks for event handlers to prevent unnecessary re-renders
  - Optimized component memoization for better React performance
- **Accessibility Improvements**:
  - Added `aria-busy` and `aria-disabled` attributes to interactive buttons
  - Enhanced keyboard navigation support (Enter and Space key handlers)
  - Improved ARIA labels for better screen reader support
  - Added descriptive labels for QuickAdd and ActivityTemplates buttons
- **Mobile UX Enhancements**:
  - Increased minimum touch target sizes (`min-w-[90px]` for QuickAdd buttons)
  - Added minimum height constraints for better touch interaction
  - Improved spacing and sizing for mobile devices

### Changed

- **Component Architecture**:
  - Refactored `QuickAdd` and `ActivityTemplates` to use `memo` wrapper
  - Converted event handlers to `useCallback` for performance optimization
  - Better dependency management in callback hooks
- **i18n Translations**:
  - Added `quickAdd.addActivityLabel` translation key
  - Added `templates.selectTemplate` translation key

### Fixed

- **Performance**:
  - Reduced unnecessary re-renders in QuickAdd and ActivityTemplates components
  - Optimized callback dependencies to prevent memory leaks

## [0.13.3] - 2025-01

### Added

- **Enhanced Loading States**:
  - Added comprehensive skeleton loaders for Challenges, Achievements, and Stats pages
  - New `ChallengeCardSkeleton`, `BadgeCardSkeleton`, and `PageSkeleton` components
  - Improved skeleton animations with better gradients and smoother transitions
  - Skeleton loaders now match the actual content layout for better UX
- **Improved Empty States**:
  - Enhanced empty state for Challenges page with emoji, better messaging, and CTA button
  - Improved empty state for Activities page filters with search icon and helpful message
  - Better visual hierarchy and spacing in empty states
  - More engaging and informative empty state messages

### Changed

- **Form Validation Improvements**:
  - Better error messages in ActivityForm with user-friendly Turkish/English messages
  - Error messages now use toast notifications instead of throwing errors
  - More descriptive validation feedback
- **Visual Consistency**:
  - Improved skeleton loader styling to match card designs
  - Better border radius consistency across skeleton components
  - Enhanced gradient backgrounds for skeleton loaders

### Fixed

- **Loading State Consistency**:
  - Replaced simple "Loading..." text with proper skeleton loaders
  - Consistent loading experience across all pages
  - Better visual feedback during data hydration

## [0.13.2] - 2025-01

### Fixed

- **ScrollToTop Button - Final Fix**:
  - Lowered scroll threshold from 300px to 200px for earlier visibility
  - Increased bottom offset (`bottom-40` mobile, `bottom-36` desktop)
  - Added explicit `position: fixed` in inline styles
  - Added capture phase to scroll event listener
  - Added resize event listener
  - Better scroll detection with multiple fallbacks
- **Footer Visibility**:
  - Added margin-bottom (`mb-20` mobile, `mb-24` desktop) to account for QuoteTicker height
  - Footer now readable above QuoteTicker
  - Better text contrast (dark:text-gray-400)
  - Enhanced font weights for better readability

### Changed

- **QuoteTicker Design Improvements**:
  - Enhanced background gradients (stronger colors)
  - Better border styling (border-brand/60)
  - Increased padding (py-3.5 mobile, py-4.5 desktop)
  - Enhanced gradient fade edges (wider, w-20)
  - Added decorative pulsing dots on left and right edges
  - Changed separator from bullet (•) to sparkle (✦)
  - Increased text repetitions from 5 to 6 for smoother scroll
  - Slower animation (30s instead of 25s) for better readability
  - Better backdrop blur (backdrop-blur-md)
  - Added performance optimizations (backface-visibility, transform: translateZ(0))

## [0.13.1] - 2025-01

### Fixed

- **QuoteTicker (Kayan Yazı) - Complete Redesign**:
  - Completely redesigned with beautiful marquee animation
  - Text now repeats 5 times for seamless infinite scroll
  - Added gradient fade edges on left and right sides
  - Enhanced background with stronger gradients and backdrop blur
  - Better border styling (border-brand/50)
  - Improved typography (font-black, larger drop-shadow)
  - Smooth marquee animation (25s duration)
  - Hover to pause functionality
  - Better visual hierarchy and spacing
- **ScrollToTop Button - Complete Fix**:
  - Wrapped button in container div for better control
  - Increased z-index to `z-[99999]` (maximum priority)
  - Increased bottom offset (`bottom-36` mobile, `bottom-32` desktop)
  - Added multiple scroll event listeners (scroll, wheel, touchmove)
  - Enhanced visibility transition with translate-y and scale
  - Larger button size (w-16 h-16 mobile, w-20 h-20 desktop)
  - Multiple glow effects for better visibility
  - Enhanced shine effect
  - Better border styling
  - Improved performance with will-change

### Changed

- **QuoteTicker Design**:
  - New marquee animation system
  - Gradient fade edges for professional look
  - Stronger background gradients
  - Better visual effects
- **ScrollToTop**:
  - Complete restructuring for better visibility
  - Enhanced visual design with multiple effects
  - Better event handling

## [0.13.0] - 2025-01

### Fixed

- **QuoteTicker (Kayan Yazı)**:
  - Fixed scrolling animation - text now scrolls smoothly from right to left
  - Added seamless loop by duplicating quote text 3 times
  - Fixed container width (`w-full`) for proper overflow handling
  - Improved animation timing (20s instead of 30s for better visibility)
  - Added `will-change: transform` for better performance
  - Fixed container height and overflow settings
  - Better padding and spacing
- **ScrollToTop Button**:
  - Fixed visibility issue - button now properly appears when scrolling
  - Added `mounted` state to prevent hydration issues
  - Increased z-index to `z-[9999]` (above all elements)
  - Increased bottom offset (`bottom-32` mobile, `bottom-28` desktop) to account for QuoteTicker height
  - Added initial visibility check on mount
  - Added scale animation for better visibility transition
  - Added `will-change` for performance optimization
  - Added passive event listener for better scroll performance
  - Better transition handling with opacity and scale

### Changed

- **QuoteTicker Animation**:
  - Text now repeats 3 times for seamless infinite scroll
  - Faster animation speed (20s instead of 30s)
  - Better container styling with explicit width/height
- **ScrollToTop**:
  - Better positioning calculation
  - Enhanced visual feedback with scale animation
  - Improved performance with will-change and passive listeners

## [0.12.9] - 2025-01

### Fixed

- **Mobile Logo**: Increased text size from `text-sm sm:text-base` to `text-lg sm:text-xl` for better visibility
- **ScrollToTop Button**:
  - Fixed visibility issue - button now always renders (with opacity control)
  - Increased z-index to z-[100] (above all other elements)
  - Increased bottom offset (bottom-28 mobile, bottom-24 desktop)
  - Larger button size (w-14 h-14 mobile, w-16 h-16 desktop)
  - Enhanced visual design with outer glow ring and pulse animation
  - Better border styling (border-4)
- **Accordion Design**:
  - Unified accordion icons - all use ▼ (down arrow) with consistent rotation
  - Icons rotate -90deg when closed, 0deg when open
  - Brand color for icons (text-brand)
  - Larger icon size (text-lg)
  - All accordions default to open (already implemented, confirmed)

### Changed

- **Activity Records Complete Redesign**:
  - **Card Layout**: Complete restructure with better hierarchy
  - **Today's Activities**: Special highlighting with ring-4, brand gradient background, and star icon
  - **Header Section**:
    - Larger icons (text-3xl mobile, text-4xl desktop)
    - Star icon (⭐) for today's activities
    - "Bugün" badge for today's activities
    - Better spacing and alignment
  - **Details Badges**:
    - Colorful badges with distinct colors (blue, emerald, purple-pink gradient, cyan)
    - Better borders and backgrounds
    - Larger emoji icons (text-base)
    - Font-black for numbers
  - **Note Display**:
    - Gradient background
    - Brand-colored quote marks
    - Better padding and styling
    - Shadow-inner effect
  - **Action Buttons**:
    - Full-width buttons (flex-1)
    - Border-top separator
    - Better spacing and sizing
    - Larger emoji icons
  - **Visual Effects**:
    - Shine effect on hover (sweeping gradient)
    - Enhanced gradient overlays
    - Better shadows (shadow-lg default, shadow-2xl hover/today)
    - Rounded-2xl corners
    - Better border colors

### Improved

- **Typography**: Font-black for headings, better font weights throughout
- **Spacing**: Better padding (px-5 py-4) and gaps
- **Color Scheme**: More vibrant and distinct colors for badges
- **Visual Hierarchy**: Clear separation between sections
- **Mobile Experience**: Optimized sizing and spacing for mobile

## [0.12.8] - 2025-01

### Changed

- **Activity Records Redesign**: Completely redesigned activity record cards with stunning visual effects
  - **Card Design**:
    - Beautiful gradient backgrounds (from-white via-gray-50/50 to-white)
    - Enhanced shadows (shadow-md hover:shadow-2xl)
    - Rounded corners (rounded-xl)
    - Border styling with transparency (border-gray-200/50)
    - Today's activities highlighted with ring effect
  - **Date Headers**:
    - Gradient backgrounds with brand colors
    - Backdrop blur effect
    - Calendar emoji icon
    - Smooth entrance animation
    - Enhanced typography with drop shadows
  - **Activity Icons**:
    - Larger size (text-2xl sm:text-3xl)
    - Floating animation (iconFloat)
    - Smooth rotation and movement
  - **Points Badge**:
    - Gradient background (from-brand via-brand-dark to-brand)
    - Sparkle emoji (✨)
    - Pulse animation
    - Enhanced shadow and border
    - White text with drop shadow
  - **Metadata Badges**:
    - Time badge with clock emoji (🕐)
    - Amount badge with chart emoji (📊)
    - Multiplier badge with gradient (purple to pink) and lightning emoji (⚡)
    - Duration badge with timer emoji (⏱️) when available
    - Each badge has its own background color and styling
  - **Note Display**:
    - Styled with italic font
    - Left border accent (border-l-4 border-brand/50)
    - Background color for better visibility
    - Quote marks around text
  - **Action Buttons**:
    - Gradient backgrounds (brand for edit, red for delete)
    - Emoji icons (✏️ edit, 🗑️ delete)
    - Enhanced shadows and hover effects
    - Scale animations on hover/active
    - Better visibility on hover

### Added

- **New CSS Animations**:
  - `activityCardEntrance`: Stunning entrance animation with blur and scale effects
  - `activityShimmer`: Continuous shimmer effect across cards
  - `activityGlowPulse`: Pulsing glow effect
  - `dateHeaderEntrance`: Smooth slide-in animation for date headers
  - `pointsBadgePulse`: Pulse animation for points badge
  - `iconFloat`: Floating animation for activity icons
  - `cardLiftHover`: Lift effect on hover
  - `activityRipple`: Ripple effect on click/tap
- **Visual Effects**:
  - Gradient overlay on hover
  - Shimmer effect on cards
  - Smooth transitions and transforms
  - Enhanced shadows and borders
  - Better spacing and padding

### Improved

- **Typography**: Larger, bolder fonts for better readability
- **Spacing**: Better padding and gaps between elements
- **Color Contrast**: Improved contrast for better visibility
- **Mobile Experience**: Optimized for mobile with appropriate sizing
- **Accessibility**: Better touch targets and visual feedback

## [0.12.7] - 2025-01

### Fixed

- **ScrollToTop Button**: Fixed visibility and positioning - button now appears correctly above QuoteTicker
  - Increased z-index to z-[60] (above QuoteTicker's z-40)
  - Adjusted bottom positioning (bottom-24 mobile, bottom-20 desktop) to account for QuoteTicker height
  - Enhanced visual design with gradient background, glow effect, and subtle bounce animation
  - Improved button size (w-12 h-12 mobile, w-14 h-14 desktop) for better visibility
  - Added i18n support for button label

### Improved

- **ScrollToTop Visual Design**:
  - Added gradient background (from-brand via-brand to-brand-dark)
  - Added glow effect with pulse animation
  - Added subtle bounce animation (bounceSubtle)
  - Enhanced shadow (shadow-2xl)
  - Better border styling (border-2 border-white/20)
  - Larger icon size for better visibility

## [0.12.6] - 2025-01

### Changed

- **Onboarding Flow**: "Tell Us About You" dialog now appears after onboarding tour completion
- **Apple Health Icons**: Replaced Apple logos (🍎) with iPhone-like logos (📱) throughout the app
- **Badge Unlock Animation**: Fixed positioning issue - animation now starts centered instead of top-left
- **Stats Overview**: Added missing i18n key for "stats.overview" text
- **Accordion Improvements**:
  - Overview accordion now has +/- toggle button
  - All accordions (Overview, Today's Breakdown, Last 7 Days) default to open
  - Desktop accordions can be collapsed/expanded independently
- **Challenges Renamed to Goals**:
  - Navigation: "Zorluklar" → "Hedefler" (Challenges → Goals)
  - Page title: "Zorluklar ve Hedefler" → "Hedefler"
  - All challenge-related text updated to use "Hedef" terminology
- **Apple Health Import**:
  - Removed duplicate Apple Health button on mobile (from DataExportImport)
  - Renamed to "Apple Sağlık Verisi" (Apple Health Data)
- **QuoteTicker Visual Improvements**:
  - Enhanced gradient backgrounds (more visible)
  - Improved border styling
  - Added shadow-lg for depth
  - Better typography (font-bold, drop-shadow)
  - Increased padding for better visibility
- **Dark Mode**:
  - Page outer areas (html/body) now completely black (#000000) in dark mode
  - Removed white space at top and bottom of screen

### Fixed

- **Activity Trend Analysis Language**: Fixed language issue - activities now display in correct language using getActivityLabel
- **Badge Unlock Animation**: Fixed initial positioning to be centered instead of appearing top-left

### Improved

- **Visual Consistency**: Better visual hierarchy and consistency across components
- **Mobile Experience**: Improved mobile-specific styling and behavior
- **Accessibility**: Better contrast and readability in dark mode

## [0.12.5] - 2025-01

### Changed

- **DataExportImport Visual Improvements**:
  - Updated export and import buttons with gradient backgrounds
  - Enhanced button styling with gradients and improved borders
  - Better typography hierarchy (font-semibold)
  - Improved hover effects

- **NotificationSettings Visual Improvements**:
  - Updated toggle switches with gradient backgrounds when enabled
  - Enhanced "Request Permission" button with gradients
  - Improved input fields with gradient backgrounds
  - Better typography hierarchy (font-semibold/font-bold)
  - Enhanced settings section with subtle gradient background
  - Improved visual hierarchy and spacing

### Improved

- **Settings Components**: Unified gradient and shadow system across all settings components
- **Toggle Switches**: Consistent gradient styling when enabled
- **Input Fields**: Consistent gradient backgrounds across all settings inputs
- **Typography**: Better font weights for improved readability
- **Visual Consistency**: Consistent styling across DataExportImport and NotificationSettings

## [0.12.4] - 2025-01

### Fixed

- **Build Error Fix**: Corrected JSX closing tag order in StatsCards component
  - Fixed incorrect closing tag sequence in Overview section
  - Resolved "Unexpected token div" build error
  - Build now completes successfully

## [0.12.3] - 2025-01

### Changed

- **ActivityFilters Visual Improvements**:
  - Updated filter container with gradient backgrounds
  - Enhanced date range buttons with gradients
  - Improved all input fields and selects with gradient backgrounds
  - Better typography hierarchy (font-medium → font-semibold/font-bold)
  - Enhanced "Clear Filters" button styling

- **ExportDialog Visual Improvements**:
  - Updated dialog container with gradient backgrounds
  - Enhanced format selection buttons with gradients
  - Improved date range selector and inputs with gradients
  - Better button styles with gradients
  - Enhanced typography hierarchy

- **ChallengeDialog Visual Improvements**:
  - Updated dialog container with gradient backgrounds
  - Enhanced all input fields and textareas with gradients
  - Improved button styles with gradients
  - Better typography hierarchy
  - Enhanced form element styling

### Improved

- **Filter Components**: Unified gradient and shadow system across all filter components
- **Dialog Consistency**: All dialogs now have consistent gradient backgrounds and styling
- **Form Elements**: Consistent input styling across all dialogs
- **Typography**: Better font weights for improved readability
- **Buttons**: Consistent gradient styles across all filter and dialog buttons

## [0.12.2] - 2025-01

### Changed

- **ActivityForm Visual Improvements**:
  - Updated activity selection buttons with gradient backgrounds
  - Enhanced input fields with gradient backgrounds and better borders
  - Improved textarea styling with gradients
  - Better button styles with gradients and improved shadows
  - Enhanced typography hierarchy (font-medium → font-semibold/font-bold)
  - Improved multiplier badge styling

- **SettingsDialog Visual Improvements**:
  - Updated dialog containers with gradient backgrounds
  - Enhanced input fields with gradient backgrounds
  - Improved button styles with gradients
  - Better typography hierarchy
  - Enhanced shadows and transitions

- **ManageActivitiesDialog Visual Improvements**:
  - Updated dialog container with gradient backgrounds
  - Enhanced all input fields and textareas with gradients
  - Improved button styles with gradients
  - Better activity list item styling with gradients
  - Enhanced typography hierarchy
  - Improved hover effects

### Improved

- **Form Consistency**: Unified gradient and shadow system across all form components
- **Input Fields**: All inputs now have gradient backgrounds and improved borders
- **Typography**: Better font weights for improved readability
- **Buttons**: Consistent gradient styles across all buttons
- **Mobile Experience**: Better touch feedback and visual hierarchy

## [0.12.1] - 2025-01

### Changed

- **Add Activity Page Visual Improvements**:
  - Updated page header with emoji animations and better typography
  - Enhanced form container with gradient backgrounds and improved shadows
  - Better visual hierarchy and spacing

- **Achievements Page Visual Improvements**:
  - Updated page header with emoji animations
  - Enhanced progress summary card with gradient backgrounds
  - Improved badge cards with better gradients and shadows
  - Better typography hierarchy (font-semibold → font-bold)
  - Enhanced progress bar with gradient fill
  - Improved badge icon sizes and animations

- **Challenges Page Visual Improvements**:
  - Updated page header with emoji animations
  - Enhanced "Add Challenge" button with gradients
  - Improved empty state card styling
  - Better section headings typography
  - Enhanced ChallengeCard component with gradients and better shadows
  - Improved progress bars with gradient fills
  - Better button hover effects

- **Dialog Components Visual Improvements**:
  - Enhanced ConfirmDialog with gradient backgrounds
  - Improved button styles with gradients
  - Better typography hierarchy
  - Enhanced shadows and transitions

### Improved

- **Consistency**: Unified gradient and shadow system across Add Activity, Achievements, and Challenges pages
- **Typography**: Better font weights and sizes for improved readability
- **Animations**: Enhanced emoji animations and hover effects
- **Mobile Experience**: Better touch feedback and visual hierarchy

## [0.12.0] - 2025-01

### Changed

- **Activities Page Visual Improvements**:
  - Updated all cards with new gradient backgrounds and improved shadows
  - Enhanced typography hierarchy (font-semibold → font-bold)
  - Improved activity item styling with better contrast
  - Added emoji animations to activity icons
  - Enhanced button styles with gradients and better hover effects
  - Improved filter results card styling
  - Better sticky header with gradient background

- **Stats Page Visual Improvements**:
  - Updated all summary cards with new gradient backgrounds
  - Enhanced chart containers with improved borders and shadows
  - Better typography hierarchy across all sections
  - Improved activity breakdown cards with gradient backgrounds
  - Enhanced date selector input styling
  - Better selected day card styling
  - Improved completion rate section
  - Enhanced trend chart buttons with gradients

- **Enhanced Interactions**:
  - Improved button hover effects with better shadows
  - Enhanced input focus states with gradient backgrounds
  - Better touch feedback on mobile devices
  - Smoother transitions across all components

### Improved

- **Consistency**: Unified gradient and shadow system across Activities and Stats pages
- **Typography**: Better font weights and sizes for improved readability
- **Animations**: Enhanced emoji animations and hover effects
- **Mobile Experience**: Better touch feedback and visual hierarchy

## [0.11.9] - 2025-01

### Changed

- **Visual Design Improvements**:
  - Improved color contrast across all components (text-gray-900 → text-gray-950)
  - Enhanced typography hierarchy with better font weights (font-medium → font-semibold/font-bold)
  - Added subtle gradients to cards (from-white via-gray-50 to-white)
  - Improved card shadows (shadow-lg → shadow-md hover:shadow-xl)
  - Better border colors (border-gray-300 → border-gray-200)
  - Enhanced hover effects with gradient backgrounds
  - Improved font sizes (text-xs → text-sm, text-base → text-lg for headings)
  - Better line heights (leading-relaxed for body text)

### Fixed

- **Page.tsx**: Fixed missing `mounted` state causing hydration issues
- **Input Cursor Shifting**: Added explicit `transform: none` to input focus states to prevent cursor movement

### Improved

- **StatsHighlights**: Better typography hierarchy and contrast
- **QuickAdd**: Enhanced visual design with gradients and better typography
- **ActivityTemplates**: Improved card design and typography
- **StatsCards**: Better gradients, shadows, and typography consistency

## [0.11.8] - 2025-01

### Added

- **Scroll to Top Button**: Added floating scroll-to-top button that appears when scrolling down
- **Quote Ticker**: Added animated scrolling quote ticker at the bottom of the screen
- **Badge Unlock Notification**: Replaced toast notifications with animated badge unlock component
- **Overview Accordion**: Added collapsible Overview section in StatsCards with Today's Points, Total Points, Goal Streak, and Average Daily cards
- **Add Activity Button**: Added quick "Add Activity" button to Activities page

### Changed

- **Activities Page**: Added "Add Activity" button for quick navigation
- **Add Activity Page**: Removed "Manage Activities" button
- **Activity Duration**: Temporarily hidden/removed Activity Duration feature
- **Logo Text**: Increased mobile logo text size for better readability
- **Manage Activities Dialog**: Translation fields (EN/TR) are now optional - if left empty, the first language value is used
- **Settings Dialog**:
  - Tell Us About You dialog now appears after onboarding completion
  - Default name is "user" instead of empty
  - Dialog closes when clicking outside
  - More compact design on mobile
- **StatsCards**: Today's Breakdown and Last 7 Days accordions now open by default on desktop

### Fixed

- **Input Cursor Shifting**: Removed transform animations from input focus states (may need further investigation if issue persists)

## [0.11.7] - 2025-01

### Fixed

- **Apple Health CSV Import - Invalid String Length Error**:
  - Implemented chunked processing for large CSV files (>100MB)
  - Added `parseAppleHealthCSVChunked` function for streaming CSV parsing
  - CSV files are now processed in batches of 1000 lines to avoid memory issues
  - Progress reporting for large CSV files
  - Better error messages for file size limitations
  - Prevents "Invalid string length" errors for very large CSV files

### Added

- **Visual Design Analysis**:
  - Created comprehensive `VISUAL_IMPROVEMENTS.md` document
  - Detailed recommendations for color palette, typography, spacing, and layout
  - Page-specific improvement suggestions
  - Mobile-specific enhancements
  - Dark mode refinements
  - Animation and transition optimizations

### Changed

- **CSV Parsing**: Large CSV files (>100MB) now use chunked processing instead of loading entire file into memory
- **Error Handling**: More specific error messages for CSV parsing failures

## [0.11.6] - 2025-01

### Fixed

- **Hydration Error - Motivational Message**:
  - Fixed hydration mismatch by making motivational message client-side only
  - Added `mounted` state check before generating motivational message
  - Message now renders consistently on server and client
  - Prevents "Text content did not match. Server: '🎯' Client: '🚀'" error

- **Mobile Logo Text Size**:
  - Increased mobile "sport track" text size from `text-[11px]` to `text-xs sm:text-sm`
  - Better readability on mobile devices

### Changed

- **Motivational Message Rendering**: Now uses `useState` and `useEffect` instead of `useMemo` to ensure client-side only rendering

## [0.11.5] - 2025-01

### Fixed

- **Critical: Content Visibility Issues - Animations Causing Text to Disappear**:
  - **Stagger Item Animation**: Removed opacity animation from `staggerFadeIn` - content now always visible
    - Changed from `opacity: 0` → `opacity: 1 !important`
    - Only transform animation remains
  - **Card Entrance Animation**: Removed opacity animation from `cardEntrance` - cards now always visible
    - Changed from `opacity: 0` → `opacity: 1 !important`
    - Only transform animation remains
  - **Fade In Scale Mobile**: Removed opacity animation from `fadeInScaleMobile` - mobile content now always visible
    - Changed from `opacity: 0` → `opacity: 1 !important`
    - Only transform animation remains
  - **Card Lift Animation**: Removed opacity animation from `cardLift` - mobile cards now always visible
    - Changed from `opacity: 0` → `opacity: 1 !important`
    - Only transform animation remains
  - **Slide In Bottom Mobile**: Removed opacity animation from `slideInBottomMobile` - mobile content now always visible
    - Changed from `opacity: 0` → `opacity: 1 !important`
    - Only transform animation remains
  - **Slide In Left/Right**: Removed opacity animations from `slideInLeft` and `slideInRight` - content now always visible
    - Changed from `opacity: 0` → `opacity: 1 !important`
    - Only transform animations remain
  - **Bounce In Mobile**: Removed opacity animation from `bounceInMobile` - mobile content now always visible
    - Changed from `opacity: 0` → `opacity: 1 !important`
    - Only transform animation remains

### Changed

- **All Entrance Animations**: Removed opacity transitions from all entrance animations
  - StatsCards: Always visible
  - StatsHighlights: Always visible
  - QuickAdd: Always visible
  - ActivityTemplates: Always visible
  - Only transform animations (translate, scale) remain for smooth entrance effects

## [0.11.4] - 2025-01

### Fixed

- **Landing Page Text Readability - Critical Fix**:
  - **Z-Index Hierarchy**: Fixed z-index layering - all decorative elements now behind text
    - Quote dots: `z-index: 0` (behind text)
    - Pattern overlay: `z-index: 0` (behind text)
    - Shimmer overlay: `z-index: 0` (behind text)
    - Sparkle particles: `z-index: 1` (behind text)
    - Quote marks: `z-index: 1` (behind text)
    - Decorative icon: `z-index: 10` (behind text)
    - Quote text: `z-index: 50` (always on top)
    - Motivational message: `z-index: 50` (always on top)
  - **Opacity Reductions**: Reduced opacity of all decorative elements to prevent text obstruction
    - Quote dots: `opacity: 0.3` → `0.15` (light), `0.1` (dark)
    - Pattern overlay: `opacity: 0.05` → `0.03` (light), `0.1` → `0.05` (dark)
    - Sparkle particles: `opacity: 1` → `0.6` (max), `opacity: 1` → `0.5` (enhanced)
    - Quote marks: `opacity: 0.15` → `0.1`
    - Decorative icon: `opacity: 20` → `15`
  - **Text Shadow**: Added explicit text shadow to quote and motivational message text for better contrast
    - `textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'`
  - **Motivational Card Background**: Reduced background gradient opacity
    - Light mode: `rgba(14, 165, 233, 0.15)` → `0.1`, `rgba(2, 132, 199, 0.2)` → `0.15`
    - Dark mode: `rgba(14, 165, 233, 0.25)` → `0.15`, `rgba(2, 132, 199, 0.3)` → `0.2`
  - **Pattern Overlay Colors**: Reduced pattern overlay color intensity
    - Light mode: `rgba(14, 165, 233, 0.1)` → `0.05`
    - Dark mode: `rgba(96, 165, 250, 0.15)` → `0.08`

### Changed

- **Text Z-Index**: Increased from `z-20` to `z-50` to ensure text is always above all decorative elements
- **All Decorative Elements**: Explicitly set z-index values to create proper layering hierarchy

## [0.11.3] - 2025-01

### Fixed

- **Critical Text Readability Issues**:
  - **Gradient Text Animation**: Fixed transparent text issue by adding fallback color (`color: #0ea5e9`) and browser support fallback
  - **Quote Text Animations**: Removed opacity animations from `text-reveal`, `rotate-quote`, and `quote-rotate` - text now always visible
  - **Quote Card Entrance**: Removed `blur(4px)` filter from entrance animation that was making text unreadable
  - **Shimmer Overlay**: Moved shimmer overlay behind text (`z-index: 0`) and reduced opacity to prevent text obstruction
  - **Backdrop Blur**: Removed `backdrop-blur-sm` from all cards (StatsCards, StatsHighlights, ActivityTemplates, QuickAdd) - was blurring text
  - **Quote Card**: Removed `backdrop-blur-sm` from quote card container
  - **Motivational Message**: Removed `backdrop-blur-sm` and increased z-index to ensure text visibility
  - **Text Z-Index**: Increased quote text z-index from `z-10` to `z-20` to ensure it's above all decorative elements
  - **Font Weight**: Changed quote text from `font-semibold` to `font-bold` for better visibility
  - **Text Shadow**: Added `drop-shadow-sm` to motivational message text for better contrast

- **Stats Cards Text**:
  - Section headers: `text-gray-500` → `text-gray-700 dark:text-gray-200` with `font-medium`
  - Improved text contrast throughout

- **Stats Highlights Text**:
  - Fallback text: `text-gray-600 dark:text-gray-400` → `text-gray-700 dark:text-gray-200` with `font-medium`

### Changed

- **Page Title**: Removed `gradient-text-animated` on mobile, replaced with solid brand color for better readability
- **Quote Text**: Removed all animation classes (`text-reveal`, `quote-rotate`, `rotate-quote`) that were causing opacity issues
- **All Animations**: Removed opacity transitions from text animations - only transform animations remain

## [0.11.2] - 2025-01

### Fixed

- **React Hydration Error**:
  - Fixed quote hydration mismatch by making quotes client-side only
  - Added `mounted` state to prevent server/client mismatch
  - Quote now renders consistently on server and client

- **Text Readability Improvements**:
  - Quote text: `text-gray-800 dark:text-gray-100` → `text-gray-900 dark:text-white` with `font-semibold`
  - Page title: Added `font-bold` and `text-gray-900 dark:text-white`
  - Subtitle: `text-gray-600 dark:text-gray-400` → `text-gray-700 dark:text-gray-200` with `font-medium`
  - Motivational message: `font-semibold` → `font-bold`, `text-gray-800` → `text-gray-900 dark:text-white`
  - Highlights title: `text-gray-500 dark:text-gray-400` → `text-gray-800 dark:text-gray-200` with `font-bold`
  - Stats link card: Improved text contrast and font weights
  - Activity filters: Better text contrast throughout
  - QuickAdd subtitle: Improved contrast
  - ActivityTemplates: Better text visibility

- **Quote Card Background**:
  - Changed from animated gradient to solid background for better readability
  - Light mode: Pure white background
  - Dark mode: Solid gray-800/gray-900 background
  - Enhanced border visibility

- **Manifest Icon Error**:
  - Added SVG icon as primary icon in manifest
  - Updated metadata icons to include SVG fallback
  - Fixed icon size validation issues

### Changed

- **Card Borders**:
  - Activity filters container: `border` → `border-2`
  - Activity list container: `border` → `border-2`
  - Better border colors for visibility

- **Text Contrast**:
  - All `text-gray-500/400/600` → `text-gray-700/800/900 dark:text-gray-200/300`
  - Added `font-medium` or `font-semibold` to improve readability
  - Quote text now uses `font-semibold` instead of `font-medium`

## [0.11.1] - 2025-01

### Fixed

- **iPhone Safe Area Issues**:
  - Fixed white space at top and bottom on iPhone devices
  - Removed duplicate body background gradients
  - Added proper safe area insets to body and HTML
  - Fixed HTML background color for dark mode

- **Card Visibility Improvements**:
  - Increased border thickness: `border` → `border-2`
  - Improved border colors: `border-gray-200 dark:border-gray-700/50` → `border-gray-300 dark:border-gray-600`
  - Enhanced card backgrounds: `bg-white dark:bg-gray-900/80` → `bg-white dark:bg-gray-800/90`
  - Better shadows: `shadow-card` → `shadow-lg`
  - Improved breakdown card items: `border-2`, `bg-gray-50 dark:bg-gray-900/50`, better hover states

- **Text Contrast Enhancements**:
  - Breakdown items: `text-gray-500` → `text-gray-700 dark:text-gray-300` with `font-medium`
  - Activity labels: Added `font-semibold` and `text-gray-900 dark:text-gray-100`
  - Points display: `font-semibold` → `font-bold` for better visibility
  - Date items: Improved font weights and colors

### Changed

- **Body and HTML Styling**:
  - Removed conflicting background gradients
  - Simplified body background to solid colors
  - Added HTML background color support for dark mode
  - Improved safe area inset handling

- **Card Styling**:
  - All cards now use `border-2` for better definition
  - Enhanced card backgrounds for better contrast
  - Improved hover states with better shadows
  - Better padding and spacing in breakdown items

## [0.11.0] - 2025-01

### Fixed

- **Readability Improvements**:
  - Increased font sizes across all components (cards, highlights, activity records)
  - Improved text contrast: Changed `text-gray-500 dark:text-gray-400` to `text-gray-700 dark:text-gray-300` with `font-medium`
  - Enhanced activity record readability: Larger fonts (`text-sm` → `text-base` on mobile, `text-xs` → `text-sm` for details)
  - Improved highlight cards: Better contrast and larger text sizes
  - Better date headers: Increased font size and improved contrast (`text-xs sm:text-sm font-semibold`)
  - Activity templates: Improved text sizes and contrast
  - QuickAdd buttons: Better text visibility

### Added

- **Onboarding Tour Auto-Close**:
  - Tour automatically closes after 30 seconds of inactivity
  - Tracks user interactions (clicks, keyboard, scroll) to reset timeout
  - Prevents tour from staying open indefinitely

- **Onboarding Tour Reset**:
  - Added "Show Onboarding Tour Again" button in App Settings dialog
  - Allows users to restart the onboarding tour anytime
  - Resets onboarding completion status

### Changed

- **Text Contrast**:
  - Labels: `text-gray-500` → `text-gray-700 dark:text-gray-300` with `font-medium`
  - Values: Maintained `text-gray-900 dark:text-gray-100` for better readability
  - Secondary text: `text-gray-500` → `text-gray-700 dark:text-gray-300` with `font-medium`
  - Activity records: Improved font weights and sizes

- **Mobile Typography**:
  - Activity names: `text-xs` → `text-sm` on mobile
  - Activity details: `text-[10px]` → `text-xs` on mobile
  - Highlight cards: `text-xs` → `text-sm` for labels, `text-sm` → `text-base` for values
  - Date headers: `text-[10px]` → `text-xs` on mobile

## [0.10.9] - 2025-01

### Fixed

- **CSV File Import on Mobile**:
  - Fixed CSV file selection not working on mobile devices
  - Added MIME types to file input accept attribute (`text/csv`, `application/csv`, `application/xml`, `text/xml`, `application/gzip`)
  - Improved file type validation before processing
  - Enhanced mobile file input button with better touch targets and sizing
  - Added better error messages for invalid file types

- **CSV Parsing Improvements**:
  - Better error handling for CSV parsing failures
  - Improved empty CSV file detection
  - Better error messages for large CSV files
  - Fixed "Invalid string length" error handling for CSV files
  - Added try-catch around CSV text decoding

### Changed

- **Mobile File Input**:
  - File input button now has minimum height and width on mobile (`min-h-[36px] min-w-[80px]`)
  - Better touch feedback with `touch-feedback mobile-press` classes
  - Improved text sizing on mobile (`text-[9px]` for mobile)
  - Better flex layout for icon and text alignment

- **File Type Validation**:
  - File type is now validated before processing
  - Checks both file extension and MIME type
  - More descriptive error messages for invalid file types

## [0.10.8] - 2025-01

### Fixed

- **Onboarding Tour Improvements**:
  - Fixed issue where tour would scroll to bottom on second step
  - Reduced overlay blur (from `bg-black/60 backdrop-blur-sm` to `bg-black/40 backdrop-blur-[2px]`)
  - Enhanced highlight visibility with brighter glow and better contrast
  - Improved tooltip positioning to avoid going off-screen
  - Smarter scroll behavior that only scrolls when element is not visible
  - Better viewport edge detection for tooltip placement

- **Apple Health Import Fixes**:
  - Fixed "Invalid string length" error for large XML files (Export.xml)
  - Fixed "Document is empty" error for empty XML files (Export_Cda.xml)
  - Improved ArrayBuffer handling for files larger than 50MB
  - Added better error messages for empty files
  - Added validation for HealthData element in XML files
  - Improved file reading error handling with specific messages

### Changed

- **Onboarding Tour UX**:
  - Overlay is now less intrusive (40% opacity vs 60%)
  - Highlight is more visible with enhanced glow effects
  - Tooltip positioning adapts to viewport edges
  - Scroll behavior is more conservative and user-friendly

- **Apple Health Parser**:
  - Better handling of ArrayBuffer input for large files
  - Improved empty file detection
  - More descriptive error messages
  - Better memory management for very large files

## [0.10.7] - 2025-01

### Added

- **Enhanced Navbar & Header Animations**:
  - Navbar icons with touch feedback and enhanced animations
  - Icon wiggle animation on mobile
  - Active state animations for navbar icons
  - Enhanced ripple effect on touch

- **Enhanced Quote & Motivational Message Animations**:
  - Quote card entrance animation with blur effect
  - Enhanced sparkle particles with staggered animations
  - Quote rotation animation for mobile
  - Motivational message entrance animation
  - Enhanced emoji celebrate animation

- **Enhanced Page Title Animations**:
  - Title entrance animation
  - Gradient text animation for mobile
  - Stats page title with enhanced animations

- **Enhanced Stats Page Animations**:
  - Summary cards with mobile touch feedback
  - Number count animations for all stats
  - Enhanced card entrance animations

- **New CSS Animations**:
  - `quoteCardEntrance`: Quote card entrance with blur
  - `motivationalEntrance`: Motivational message entrance
  - `titleEntrance`: Page title entrance
  - `quoteRotate`: Quote rotation animation
  - `sparkleEnhanced`: Enhanced sparkle animation
  - `gradientText`: Gradient text animation
  - `cardStack`: Card stack entrance
  - `numberIncrement`: Number increment animation
  - `loadingPulse`: Loading pulse animation
  - `dividerGrow`: Divider grow animation
  - `badgeShine`: Badge shine effect
  - `emojiCelebrate`: Enhanced emoji celebration

### Changed

- **Mobile Enhancements**:
  - Navbar icons now have touch feedback on mobile
  - Quote card uses enhanced entrance animation
  - Motivational message uses mobile-optimized entrance
  - Page titles use gradient text animation on mobile
  - Stats cards use mobile-specific number count animations

## [0.10.6] - 2025-01

### Added

- **Mobile-First Animations & Visual Effects**:
  - Touch feedback animations (ripple effect on touch)
  - Press animation for mobile buttons and cards
  - Swipe gesture hint animation
  - Pull to refresh animation
  - Bottom sheet slide up animation
  - Modal backdrop fade animation
  - Card lift on touch animation
  - Shimmer loading for mobile
  - Pulse glow for mobile
  - Bounce in animation for mobile
  - Slide in from bottom for mobile
  - Fade in scale for mobile
  - Number count animation for mobile
  - Icon wiggle animation for mobile
  - Progress bar fill animation for mobile

- **Enhanced Mobile Components**:
  - QuickAdd buttons: touch-feedback, mobile-press, mobile-card-lift, fade-in-scale-mobile
  - StatsCards: mobile-card-lift, touch-feedback, bounce-in-mobile, number-count-mobile, progress-fill-mobile
  - Activity Form buttons: touch-feedback, mobile-press, bounce-in-mobile
  - Activity list items: touch-feedback, mobile-card-lift, slide-in-bottom-mobile
  - Activity Templates: touch-feedback, mobile-press, mobile-card-lift, fade-in-scale-mobile
  - Stats Highlights: mobile-card-lift, touch-feedback, bounce-in-mobile
  - ConfirmDialog: backdrop-fade, slide-up-bottom for mobile

- **Mobile Optimizations**:
  - Disabled hover effects on mobile (magnetic-hover, tilt-3d, scale-on-interact)
  - Enhanced touch feedback for buttons
  - Smoother transitions with optimized timing functions
  - GPU-accelerated animations for better performance

### Changed

- **Mobile Animation Performance**:
  - Reduced animation durations on mobile (stagger-item: 0.3s, card-entrance: 0.4s)
  - Optimized transition timing functions
  - Better touch target sizes and feedback

## [0.10.5] - 2025-01

### Fixed

- **Input Cursor Issue**:
  - Input alanlarına focus olduğunda imleç kayması sorunu düzeltildi
  - `transform: scale(1.01)` efekti kaldırıldı (sadece border ve box-shadow animasyonları kaldı)
  - Daha stabil ve kullanıcı dostu input deneyimi

### Changed

- **Mobile Compact Design**:
  - Activity Form mobilde daha compact:
    - Form spacing azaltıldı (space-y-5 → space-y-3)
    - Activity selection butonları daha küçük (px-2 py-1.5, rounded-lg)
    - Input alanları daha küçük (px-2.5 py-2, min-h-[40px], text-xs)
    - Textarea daha küçük (min-h-[70px], rows={2})
    - Butonlar daha küçük (px-3 py-2, min-h-[40px], text-xs)
    - Font size'lar küçültüldü (text-sm → text-xs)
    - Gap'ler azaltıldı (gap-3 → gap-2)
  - Activity Templates mobilde daha compact:
    - Template card'lar daha küçük (p-2.5, gap-2, rounded-lg)
    - Icon size küçültüldü (text-3xl → text-2xl)
    - Font size'lar küçültüldü (text-base → text-xs, text-sm → text-[10px])
    - Gap'ler azaltıldı (gap-3 → gap-2)
    - Category başlıkları daha küçük (text-xs → text-[9px])
    - Spacing azaltıldı (space-y-4 → space-y-3)
  - Add Activity sayfası mobilde daha compact:
    - Container padding azaltıldı (p-4 sm:p-6 → p-3)
    - Border radius küçültüldü (rounded-xl → rounded-lg)

## [0.10.4] - 2025-01

### Changed

- **Mobile Logo Enhancement**:
  - SportTrack yazısı mobilde biraz daha büyük (text-[10px] → text-[11px])
  - Daha okunabilir görünüm

- **Activities Icon Update**:
  - Aktiviteler ikonu değiştirildi (📝 → 🏃)
  - Daha dinamik ve spor temalı görünüm

- **Mobile User Profile Button**:
  - Kullanıcı butonu genişletildi (max-w-[80px] → max-w-[100px])
  - Daha uzun isimler gösterilebiliyor (6 karakter → 8 karakter)

- **Landing Page Layout Improvements**:
  - StatsCards ve StatsHighlights yan yana gösteriliyor (desktop'ta)
  - QuickAdd, ActivityTemplates'in üstüne taşındı
  - Daha kompakt ve organize layout

- **Onboarding Tour Improvements**:
  - Doğru selector'lar kullanılıyor (data-tour-id attributes)
  - Highlight efekti daha görünür (daha koyu overlay, daha parlak border, glow efekti)
  - Element bulunamazsa alternatif selector'lar deneniyor
  - Element otomatik olarak görünür alana scroll ediliyor
  - Tooltip pozisyonları iyileştirildi

### Fixed

- Onboarding tour'un yanlış elementleri gösterme sorunu düzeltildi
- Highlight'ın hangi elementi işaret ettiği artık daha net anlaşılıyor

## [0.10.3] - 2025-01

### Added

- **Enhanced Activity Form Animations**:
  - Activity selection buttons with gradient backgrounds
  - Icon pulse animation on selection
  - Enhanced input focus states with glow effects
  - Ripple and magnetic hover effects
  - Stagger animations for activity buttons
  - Enhanced submit button with glow animation

- **Stats Page Visual Enhancements**:
  - Animated page title with gradient text
  - Rotating stats icon
  - Chart containers with hover effects
  - Summary cards with enhanced hover animations
  - Activity breakdown items with stagger animations
  - Number transition animations
  - Slide-in animations for charts

- **Stats Highlights Cards Enhanced**:
  - Shimmer sweep effect on hover
  - Enhanced hover scale and glow
  - Number transition animations
  - Bouncing emoji animations
  - Card entrance animations

- **Activity Templates Enhanced**:
  - Gradient border animations on hover
  - Enhanced template card effects
  - Ripple and magnetic hover
  - 3D tilt effects

### Changed

- **Visual Improvements**:
  - All input fields now have enhanced focus states
  - All buttons have glow effects
  - All cards have magnetic hover effects
  - Improved number display animations
  - Better contrast and readability
  - Enhanced dark mode effects

## [0.10.2] - 2025-01

### Added

- **Extraordinary Quote Design & Animations**:
  - Animated gradient backgrounds with smooth color transitions
  - Decorative quote marks with floating animations
  - Sparkle particle effects (5 particles)
  - Glowing border effects with pulse animation
  - Shimmer overlay animation
  - Text reveal animation
  - Rotating quote animation (3D flip effect)
  - Decorative dots pattern background
  - Rotating sparkle icon
  - Pattern overlay for depth
  - Auto-rotating quotes every 10 seconds
  - Enhanced typography with larger, more readable fonts

- **Enhanced Motivational Message Card**:
  - Animated gradient background
  - Bouncing emoji animation
  - Sparkle particles
  - Pattern overlay
  - Shimmer effect
  - Glowing border

- **Expanded Quote Library**:
  - Added 50+ new motivational quotes
  - Total of 80+ unique quotes
  - Diverse and inspiring content

### Changed

- **Visual Improvements**:
  - Quote card now has premium design with multiple layers
  - Larger, more prominent quote text
  - Enhanced spacing and padding
  - Better contrast and readability
  - Dark mode optimizations

## [0.10.1] - 2025-01

### Added

- **Extraordinary Animations & Micro-interactions**:
  - Smooth page transitions with fade-in effects
  - Stagger animations for list items (sequential entrance)
  - Floating animations for cards
  - Gradient animations
  - Ripple effects on button clicks
  - Magnetic hover effects (cards lift and scale)
  - 3D tilt effects on hover
  - Enhanced button animations with ripple
  - Card entrance animations
  - Slide-in animations from sides
  - GPU acceleration for smooth performance
  - Mobile-optimized animation durations
  - Reduced motion support for accessibility
  - Glass morphism effects
  - Smooth scroll behavior

### Changed

- **Visual Enhancements**:
  - All stat cards now have magnetic hover and 3D tilt effects
  - Quick Add buttons enhanced with ripple and magnetic effects
  - Activity list items have stagger animations
  - Stats highlights cards have slide-in animations
  - Activity templates have enhanced hover effects
  - All interactive elements have smooth scale animations
  - Improved performance with GPU acceleration

## [0.10.0] - 2025-01

### Added

- **Keyboard Shortcuts System**:
  - GitHub-style navigation shortcuts (`g h`, `g a`, `g s`, `g c`, `g t`)
  - Quick action shortcuts (`a` for add activity)
  - General shortcuts (`?` to show/hide help, `Esc` to close dialogs)
  - Beautiful keyboard shortcuts help dialog
  - Context API for programmatic access
  - Settings dialog integration
  - Mobile devices excluded (desktop only)
  - Input field detection to prevent conflicts

## [0.9.9] - 2025-01

### Changed

- **Mobile Logo Enhancement**:
  - Logo yanında "sport" ve "track" alt alta küçük font ile gösteriliyor
  - Mavi gradient renk tonu (brand color)
  - Daha kompakt ve şık görünüm

- **Navbar Icons**:
  - Tüm navbar ikonları yuvarlak (rounded-full) yapıldı
  - Daha modern ve tutarlı görünüm
  - Activities ikonu 📋 → 📝 olarak değiştirildi

## [0.9.8] - 2025-01

### Added

- **Onboarding Tour System**:
  - Interactive step-by-step tutorial for new users
  - Highlights key features and navigation elements
  - Skip and navigation controls (Previous/Next)
  - Progress indicator (step X of Y)
  - Responsive design for mobile and desktop
  - Automatic detection of new users (no profile or activities)
  - Completion tracking in localStorage
  - Beautiful overlay with highlighted elements
  - Tooltip positioning (top, bottom, left, right, center)
  - Smooth animations and transitions

### Improved

- **User Experience**:
  - New users get guided tour automatically
  - Better first-time user experience
  - Feature discovery made easier
  - Reduces learning curve for new users

## [0.9.7] - 2025-01

### Added

- **Beautiful Logo**:
  - Custom SVG logo with animated running figure
  - Gradient background with glow effects
  - Responsive design (full logo on desktop, compact "ST" on mobile)
  - Smooth animations and hover effects
  - Dark mode optimized

### Fixed

- **Apple Health CSV Import Error**:
  - Fixed "Invalid string length" error for large CSV files
  - Files larger than 50MB now use ArrayBuffer instead of readAsText
  - Better error handling and memory management
  - Improved progress reporting for large files

### Changed

- **Extraordinary Navbar Icons**:
  - Each icon has unique color-themed gradient backgrounds on hover
  - Shimmer border animation effects
  - Icon-specific glow effects (blue for activities, green for stats, yellow for achievements, red for challenges)
  - Enhanced shadow effects in dark mode
  - Smooth scale animations (125% on hover, 95% on active)
  - Backdrop blur effects
  - 3D lift effect on hover (translateY)
  - Rounded-xl borders for modern look

## [0.9.6] - 2025-01

### Changed

- **Dark Mode Görsel İyileştirmeleri**:
  - Tüm kartlar için daha iyi dark mode kontrastları (`dark:border-gray-700/50`, `dark:bg-gray-900/80`)
  - Backdrop blur efekti eklendi (`backdrop-blur-sm`)
  - Shadow'lar dark mode'da daha belirgin ve elegant
  - Border renkleri dark mode'da daha subtle (`dark:border-gray-700/50`)
  - Text renkleri dark mode'da daha iyi kontrast (`dark:text-gray-100`, `dark:text-gray-400`)

### Improved

- **Mobil Görsel İyileştirmeleri**:
  - Tüm kartlar `rounded-xl` ile daha modern görünüm
  - Background gradient'leri daha subtle ve elegant
  - Card spacing'leri optimize edildi (`gap-2.5` mobilde)
  - Hover efektleri dark mode'da daha belirgin
  - Brand color dark mode'da daha açık (`dark:text-brand-light`)

- **Genel Görsel İyileştirmeleri**:
  - Body background gradient eklendi (light ve dark mode)
  - Shadow utilities dark mode için optimize edildi
  - Tüm kartlar backdrop-blur ile daha modern görünüm
  - Border radius tutarlılığı (`rounded-xl` tüm kartlarda)
  - Text kontrastları iyileştirildi

## [0.9.5] - 2025-01

### Added

- **Default Haftalık Challenge**: 50k puan hedefli haftalık challenge eklendi
  - Yeni kullanıcılar için otomatik olarak oluşturuluyor
  - Mevcut kullanıcılar için de eklenecek (eğer yoksa)
  - getDefaultWeeklyChallenge fonksiyonu eklendi

### Changed

- **Navbar Mobil Uyumluluk**:
  - Logo mobilde "ST" olarak kısaltıldı
  - Navbar container'a `min-w-0` ve `flex-1` eklendi overflow önlemek için
  - Navigation icons container'a `flex-shrink-0` eklendi
  - SettingsDialog butonu mobilde daha compact (max-w-[80px])
  - Uzun kullanıcı isimleri truncate ediliyor (6 karakter + "...")
  - Kullanıcı ismi yoksa 👤 ikonu gösteriliyor
  - Butonlar daha küçük ve estetik (`min-h-[36px]`, `rounded-lg`)
  - Desktop'ta kullanıcı ismi için `max-w-[120px] truncate` eklendi

### Improved

- **Navbar Estetik İyileştirmeleri**:
  - Daha iyi spacing ve alignment
  - Flexbox layout iyileştirmeleri
  - Overflow handling iyileştirildi
  - Responsive tasarım optimizasyonları

## [0.9.4] - 2025-01

### Changed

- **Navbar İkonları Daha Elegant**:
  - Container kaldırıldı, daha minimal ve elegant tasarım
  - İkonlar arası gap azaltıldı (gap-0.5 sm:gap-1)
  - Hover efektleri iyileştirildi (group-hover:scale-110)
  - Daha smooth transition animasyonları (duration-300)
  - İkon boyutları optimize edildi (text-lg sm:text-xl)

- **Activities Sayfası İyileştirmeleri**:
  - Sayfa ikonu değiştirildi: 📝 → 📋
  - "Aktiviteleri Özelleştir" butonu sayfa başlığına taşındı
  - Sayfa daha compact hale getirildi (spacing azaltıldı)
  - Aktivite listesi daha compact (padding ve font size azaltıldı)
  - Filtered stats summary daha compact

- **ActivityFilters Compact Tasarım**:
  - Padding azaltıldı (p-2.5 sm:p-3)
  - Font size'lar küçültüldü (text-[10px] mobilde)
  - Spacing azaltıldı (space-y-1.5)
  - Buton ve input'lar daha compact
  - Shadow daha subtle (shadow-sm)

### Fixed

- **Apple Health Büyük Dosya Desteği (1.3GB+)**:
  - 1GB+ dosyalar için ArrayBuffer ve chunked processing
  - 100MB chunk'lar halinde işleme
  - Browser blocking önlendi (setTimeout ile yield)
  - FileReader için timeout eklendi (5 dakika)
  - Daha iyi hata mesajları ve progress reporting

## [0.9.3] - 2025-01

### Added

- **Yeni Aktivite Ekleme Sayfası**: `/add` route'u eklendi
  - Aktivite ekleme formu artık ayrı bir sayfada
  - Ana sayfadaki "Aktivite Ekle" butonu yeni sayfaya yönlendiriyor
  - Başarılı ekleme sonrası aktiviteler sayfasına yönlendirme

### Changed

- **Navbar İyileştirmeleri**:
  - 4 navigasyon ikonu (📝, 📊, 🏆, 🎯) güzel bir container içinde hizalandı
  - Hover ve active state animasyonları eklendi
  - Background container ile görsel olarak gruplandı
  - İkonlar daha büyük ve tutarlı boyutlarda (text-xl sm:text-2xl)
- **Activities Sayfası**:
  - "Yeni Aktivite" formu kaldırıldı
  - Sayfa artık sadece aktivite listesi ve filtreleme içeriyor
  - Daha temiz ve odaklanmış bir görünüm

### Improved

- **Genel Görsel İyileştirmeler**:
  - Navbar ikonları için modern container tasarımı
  - Smooth hover ve scale animasyonları
  - Daha iyi spacing ve alignment
  - Responsive tasarım iyileştirmeleri

## [0.9.2] - 2025-01

### Added

- **Aktivite Türleri Trend Analizi**: Zaman içinde aktivite türlerinin performans analizi
  - En çok kullanılan 5 aktivite türü için trend grafikleri
  - 7, 30, 90 günlük trend görünümleri
  - Line chart ile aktivite türlerinin zaman içindeki puan dağılımı
  - Her aktivite türü için özet kartları (toplam, toplam puan, günlük ortalama)
  - ActivityTypeTrend bileşeni ve activityTrendUtils utility fonksiyonları

## [0.9.1] - 2025-01

### Changed

- **Navbar İyileştirmeleri**:
  - Activities ve Statistics linklerinde yazı kaldırıldı, sadece ikonlar gösteriliyor (📝 ve 📊)
  - ARIA labels eklendi erişilebilirlik için

### Fixed

- **Apple Health Import Büyük Dosya Desteği**:
  - 1.3GB+ dosyalar için FileReader API ile daha iyi hata yönetimi
  - Büyük dosyalar için chunked/batched processing
  - requestIdleCallback kullanarak UI blocking önlendi
  - Daha sık progress reporting (her 100 kayıtta bir)
  - Memory/quota hataları için daha açıklayıcı hata mesajları
  - FileReader progress events ile dosya okuma ilerlemesi gösterimi

### Improved

- **Aktivite Süresi Entegrasyonu**:
  - ActivityTimer'a başlık ve süre gösterimi eklendi
  - Timer başlığında mevcut süre bilgisi gösteriliyor
  - Daha iyi görsel hiyerarşi ve kullanıcı geri bildirimi

## [0.9.0] - 2025-01

### Changed

- **UI İyileştirmeleri**:
  - Activities sayfasına 📝 ikonu eklendi
  - Statistics sayfasına 📊 ikonu eklendi
  - Statistics sayfası başlığı sadeleştirildi
  - Sayfa başlıkları tutarlı hale getirildi

### Fixed

- Statistics sayfasında aktivite ekleme formu olmadığı doğrulandı
- Activities sayfasında istatistikler ile ilgili içerik olmadığı doğrulandı

## [0.8.9] - 2025-01

### Added

- **Apple Health XML Support**: XML format desteği eklendi
  - XML export dosyalarını parse etme desteği
  - Büyük dosyalar (1GB+) için optimizasyon
  - İlerleme çubuğu (progress bar) gösterimi
  - Dosya boyutu kontrolü ve uyarıları
  - parseAppleHealthXML ve parseAppleHealthFile fonksiyonları

### Changed

- Apple Health import artık hem CSV hem de XML formatlarını destekliyor
- Büyük dosyalar için kullanıcıya onay mesajı gösteriliyor
- İşlem sırasında gerçek zamanlı ilerleme gösterimi eklendi
- Maksimum dosya boyutu 2GB olarak ayarlandı

### Fixed

- Büyük dosyaların işlenmesi sırasında memory optimizasyonu yapıldı
- XML parsing hataları için daha iyi hata mesajları eklendi

## [0.8.8] - 2025-01

### Added

- **Apple Health Import Guide**: Detaylı kullanım rehberi
  - Apple Health'tan veri dışa aktarma adımları
  - CSV dosyası hazırlama rehberi
  - SportTrack'e içe aktarma talimatları
  - AppleHealthGuide bileşeni eklendi

### Changed

- **Görsel İyileştirmeler**:
  - ActivityTemplates bileşeni sayfanın sonuna taşındı
  - Template kartları modern gradient tasarıma güncellendi
  - Template kartlarına hover animasyonları ve shadow efektleri eklendi
  - QuickAdd bileşeni görsel olarak iyileştirildi (gradient, shadow, hover efektleri)
  - Tüm kartlara daha yumuşak geçişler ve animasyonlar eklendi
  - Mobil uyumluluk iyileştirildi

### Fixed

- Template kartlarının responsive tasarımı optimize edildi

## [0.8.7] - 2025-01

### Added

- **Ortalama Günlük Aktivite Süresi Analizi**: Aktivite sürelerinin detaylı analizi
  - Ortalama günlük aktivite süresi hesaplama
  - Toplam aktivite süresi gösterimi
  - Süre kayıtlı gün sayısı
  - En uzun aktivite günü ve tarihi
  - DurationStats bileşeni ile görselleştirme
  - durationUtils utility fonksiyonları (formatDuration, formatDurationShort)

### Changed

- Stats sayfasına Duration Stats bölümü eklendi

## [0.8.6] - 2025-01

### Added

- **Haftalık ve Aylık Karşılaştırma**: Dönemsel performans karşılaştırması
  - Bu hafta vs geçen hafta karşılaştırması
  - Bu ay vs geçen ay karşılaştırması
  - Toplam puan, aktivite sayısı, günlük ortalama ve tamamlama oranı karşılaştırması
  - Değişim göstergeleri (mutlak ve yüzde değerler)
  - Bar chart grafikleri ile görsel karşılaştırma
  - PeriodComparison bileşeni ve comparisonUtils utility fonksiyonları

### Fixed

- ActivityFormInitial tipine `duration` alanı eklendi

## [0.8.5] - 2025-01

### Added

- **Haftalık ve Aylık Karşılaştırma**: Dönemsel performans karşılaştırması
  - PeriodComparison component'i eklendi
  - comparisonUtils utility fonksiyonları

## [0.8.4] - 2025-01

### Added

- **Zaman Analizi**: En aktif saatler ve günler analizi
  - Saat bazında aktivite dağılım grafikleri (0-23 saat)
  - Haftanın günlerine göre aktivite dağılım grafikleri
  - En aktif saat ve gün özet kartları
  - Bar chart grafikleri ile görselleştirme

### Changed

- Weightlifting katsayısı 10'dan 15'e yükseltildi
- Aktivite listesinde süre bilgisi gösterimi eklendi

## [0.8.3] - 2025-01

### Added

- **Aktivite Süresi Takibi**: Gerçek zamanlı timer
  - Başlat/Durdur/Sıfırla butonları
  - Saat:dakika:saniye formatında gösterim
  - Süre bilgisi aktivite kaydına otomatik ekleniyor
  - Aktivite listesinde süre gösterimi

### Changed

- ActivityRecord tipine `duration` alanı eklendi (saniye cinsinden)

## [0.8.2] - 2025-01

### Added

- **Aktivite Süresi Takibi**: Gerçek zamanlı timer bileşeni
  - ActivityTimer component'i eklendi
  - Aktivite formuna timer entegrasyonu

## [0.8.1] - 2025-01

### Added

- **Kişisel Rekorlar Sistemi**: En iyi performansların takibi
  - En iyi gün (en yüksek günlük puan)
  - En uzun seri (en uzun hedef tamamlama serisi)
  - En hızlı hedef tamamlama (hedefin en erken tamamlandığı saat)
  - Aktivite bazında rekorlar (her aktivite için en yüksek puan ve miktar)
  - Stats sayfasına Personal Records bölümü eklendi

## [0.8.0] - 2025-01

### Added

- **Zorluklar ve Hedefler Sistemi**: Kapsamlı hedef takip sistemi
  - Günlük, haftalık, aylık ve özel zorluklar
  - Otomatik ilerleme takibi ve durum yönetimi
  - Varsayılan günlük zorluk (kullanıcının günlük hedefine göre)
  - Zorluk CRUD işlemleri (ekleme, düzenleme, silme)
  - Tamamlanan zorluklar için toast ve push notification
  - `/challenges` sayfası ve ChallengeCard, ChallengeDialog bileşenleri
  - Header'a challenges linki eklendi

## [0.7.9] - 2025-01

### Added

- **Seviye Sistemi**: XP tabanlı seviye ilerlemesi
  - Seviye 1-50+ arası seviyeler
  - XP hesaplama (her puan = 1 XP)
  - Seviye ilerleme çubuğu
  - Seviye başlıkları (Başlangıç, Acemi, Deneyimli, Uzman, Usta, Efsane, Efsanevi)
  - Seviye atlama bildirimleri (toast + push notification)
  - Ayarlar sayfasında seviye gösterimi
  - LevelProvider ve levelStore eklendi

## [0.7.8] - 2025-01

### Fixed

- Template kategorileri ve görüntüleme sorunları düzeltildi
- Export/Import'a mood (ruh hali) desteği eklendi
- Template çevirileri eklendi

## [0.7.7] - 2025-01

### Added

- **Aktivite Şablonları**: Önceden tanımlı aktivite kombinasyonları
  - Aktivite şablonları sistemi (`ActivityTemplates` component)
  - Kategorilere göre şablonlar (hızlı, kardiyo, güç, esneklik, karışık)
  - Şablon ekleme ve onay dialog'u
  - Aktivite filtreleme sistemine kategori filtresi eklendi

## [0.7.6] - 2025-01

### Fixed

- Template sistemindeki sorunlar düzeltildi
- Template kategorileri optimizasyonu

## [0.7.5] - 2025-01

### Added

- **Aktivite Şablonları**: Önceden tanımlı aktivite kombinasyonları
  - `activityTemplates.ts` dosyası ve şablon tanımları
  - `ActivityTemplates` component'i

## [0.7.4] - 2025-01

### Added

- **Apple Health Entegrasyonu**: Apple Health CSV import desteği
  - Apple Health CSV dosyası import
  - Adım verileri otomatik parse ve kayıt
  - Mevcut adım kayıtlarını değiştirme desteği

## [0.7.3] - 2025-01

### Added

- **Aktivite Filtreleme**: Gelişmiş filtreleme ve sıralama
  - Tarih aralığı filtreleme (tümü, bugün, son 7 gün, son 30 gün, özel)
  - Aktivite türü filtreleme
  - Kategori filtreleme
  - Arama (aktivite adı, not, key)
  - Sıralama (tarih, puan - artan/azalan)
  - Filtrelenmiş sonuçlar özeti
  - `ActivityFilters` component ve `useFilteredActivities` hook

## [0.7.2] - 2025-01

### Added

- **Hızlı Aktivite Ekleme**: En çok kullanılan aktiviteler için hızlı erişim
  - QuickAdd component'i
  - En sık kullanılan aktivitelerin otomatik hesaplanması
  - Tek tıkla aktivite ekleme
  - Ana sayfaya entegrasyon

## [0.7.1] - 2025-01

### Added

- **Bildirimler ve Hatırlatıcılar**: Kapsamlı bildirim sistemi
  - Push notification desteği
  - Günlük hatırlatıcılar (özelleştirilebilir saat)
  - Hedef tamamlama bildirimleri
  - Seri koruma uyarıları
  - Rozet kazanma bildirimleri
  - Bildirim ayarları UI (`NotificationSettings` component)
  - Arka plan bildirim kontrolü (`NotificationManager` component)
  - NotificationService singleton class

## [0.7.0] - 2025-01

### Added

- **Rozetler ve Başarımlar**: Gamification sistemi
  - 17 farklı rozet (streak, points, activities, special)
  - Rozet nadirlik seviyeleri (common, rare, epic, legendary)
  - Otomatik rozet kontrolü ve kazanma
  - `/achievements` sayfası
  - Rozet kategorilerine göre gruplandırma
  - Rozet ilerleme çubukları
  - BadgeProvider ve badgeStore eklendi

## [0.6.2] - 2025-01

### Added

- **CSV ve PDF Export**: Gelişmiş veri export özellikleri
  - CSV export (Excel uyumlu, UTF-8 BOM desteği)
  - PDF export (jspdf ve jspdf-autotable kullanarak)
  - Tarih aralığı seçimi (tüm zamanlar, son 7 gün, son 30 gün, özel)
  - ExportDialog component'i
  - Kullanıcı bilgileri ve özet istatistikler PDF'de
  - Ruh hali bilgisi export'a eklendi

## [0.6.1] - 2025-01

### Added

- **Gelişmiş Grafikler**: Recharts kütüphanesi ile görselleştirme
  - Trend grafikleri (7, 30, 90 günlük çizgi grafikleri)
  - Aktivite karşılaştırma grafikleri (bar chart)
  - Aktivite dağılım grafikleri (pie chart)
  - Aktivite heatmap (GitHub tarzı)
  - Responsive chart container'lar
  - Stats sayfasına grafik entegrasyonu

## [0.6.0] - 2025-01

### Added

- **PWA (Progressive Web App) Özellikleri**: Tam PWA desteği
  - Service Worker implementasyonu
  - Offline çalışma desteği
  - Ana ekrana ekleme (Add to Home Screen)
  - App-like deneyim
  - Push notification desteği
  - InstallPrompt component'i
  - Web App Manifest dosyası
  - iOS PWA desteği (safe-area-inset)

## [0.5.7] - 2024

### Added

- Ruh hali seçimi ve motivasyonel mesajlar sistemi
- Motivasyonel alıntılar genişletildi (40+ alıntı)
- Ruh haline göre esprili, ciddi ve motive edici mesajlar

### Changed

- Footer versiyon gösterimi mobilde aynı satırda, sağa hizalı

## [0.5.6] - 2024

### Fixed

- Cross-language hint mesajları düzeltildi
- Placeholder metinleri doğru dilde gösteriliyor
- Mobil date input overflow sorunu çözüldü

## [0.5.5] - 2024

### Changed

- Mobil tasarım iyileştirmeleri
- Touch target boyutları artırıldı (min-h-[44px])
- Kart padding ve font boyutları optimize edildi

## [0.5.4] - 2024

### Changed

- Mobil navbar boyutu artırıldı
- Diğer elementlerin boyutları optimize edildi

## [0.5.3] - 2024

### Changed

- Default aktivitelerin çarpanları, açıklamaları, varsayılan değerleri ve birimleri güncellendi
- Cross-language placeholder metinleri düzeltildi

## [0.5.2] - 2024

### Fixed

- Build hataları düzeltildi (Mood type, motivationalMessages type errors)

## [0.5.1] - 2024

### Fixed

- Placeholder metinleri doğru dilde gösteriliyor
- Footer versiyon gösterimi mobilde düzeltildi

## [0.5.0] - 2024

### Added

- Ruh hali seçimi (sad, unhappy, cheerful, happy, tired/sick)
- Ruh haline göre motivasyonel mesajlar sistemi
- Motivasyonel alıntılar genişletildi

## [0.4.4] - 2024

### Changed

- README.md güncellendi
- Mobil UI iyileştirmeleri

## [0.4.3] - 2024

### Added

- Mobile navbar improvements (larger navbar, smaller buttons)
- Mobile responsive layout for Activity Name, Unit, and Description fields (2 columns on mobile)
- Stats link in mobile navbar
- Goal completion animation stops after 10 seconds
- Auto-redirect to home page after adding new activity (2 seconds after toast notification)
- Separate profile and app settings dialogs on mobile

### Fixed

- Description placeholder texts now show correct language (EN/TR)
- Date filtering in stats page using proper date comparison
- Daily statistics date selection filtering

### Changed

- Mobile cards layout: 2 columns for stats cards and highlights
- Highlights section: removed accordion, always visible
- Footer: version number aligned to the right
- Mobile form fields: compact layout with smaller fonts and padding

## [0.4.2] - 2024

### Fixed

- Description placeholder texts to show correct language (EN/TR)
- Date filtering in stats page using proper date comparison
- Mobile UI improvements

### Changed

- Mobile navbar sizing (larger navbar, smaller buttons)
- Separate profile and app settings dialogs on mobile

## [0.4.1] - 2024

### Added

- Detailed statistics page with day-by-day breakdown
- Loading states with skeleton loaders
- Custom confirmation dialog component
- Data export/import functionality
- Accessibility improvements (ARIA labels, keyboard navigation)
- Enhanced animations for toasts, dialogs, progress bars, cards, buttons
- Goal completion animations (confetti, pulse, shimmer)
- Error handling for storage quota and parse errors
- Performance optimizations (localStorage debouncing, useIsMobile hook)
- Constants file for magic numbers, storage keys, timeouts, limits, breakpoints

### Changed

- Improved ManageActivitiesDialog layout (side-by-side fields)
- Last 7 days order reversed (oldest day first)
- Footer version display updated

### Fixed

- Missing imports in SettingsDialog and i18n
- Duplicate translation keys
- Hydration warnings
- Build cache issues

## [0.3.4] - 2024

### Initial Release

- Basic activity tracking
- Custom activity management
- Statistics and highlights
- Multi-language support (Turkish/English)
- Dark mode support

# Changelog

All notable changes to SportTrack will be documented in this file.

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


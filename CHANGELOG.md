# Changelog

All notable changes to SportTrack will be documented in this file.

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

# Release Notes - v0.30.0

**Release Date:** 2025-01  
**Status:** ✅ Production Ready

---

## 🎉 Major Updates

### UI/UX İyileştirmeleri ve Dialog Optimizasyonları

Bu release, kullanıcı arayüzünde kapsamlı iyileştirmeler ve dialog ekranlarının optimizasyonunu içermektedir.

---

## ✨ New Features

### 1. Scroll Handler Sistemi

- **Sayfa Geçişlerinde Otomatik Focus**: Yeni sayfalara geçişte main content alanına otomatik focus yapılıyor
- **Keyboard Navigation İyileştirmeleri**: Ok tuşları ile scroll yapma sorunları çözüldü
- **Touch Scroll Optimizasyonu**: Mobil cihazlarda dokunmatik scroll deneyimi iyileştirildi

---

## 🔧 Improvements

### 1. Dialog Pozisyonları ve Görünümü

- **Conflict Resolution Dialog**:
  - Mobil görünümde daha yukarıdan başlıyor (`pt-28`)
  - Desktop görünümde merkezi konumlandırma iyileştirildi (`pt-20`)
- **Export Dialog**:
  - Mobil görünümde header altında doğru konumlandırma (`pt-28`)
  - Yatay scroll sorunları çözüldü (`overflow-x-hidden`)
  - Butonlar küçültüldü ve daha kompakt hale getirildi

### 2. Settings Dialog İyileştirmeleri

- **Görünüm Ayarları Butonları**:
  - Tüm butonlar tek satırda yan yana görünecek şekilde düzenlendi (`flex-nowrap`)
  - Buton boyutları küçültüldü (`text-[6px]`, `min-h-[16px]`, `max-w-[18px]`)
  - LanguageToggle ve ThemeToggle bileşenleri optimize edildi
  - Gap değerleri azaltıldı (`gap-0.5`) ve `flex-shrink-0` eklendi

### 3. Accordion Z-Index Düzeltmesi

- **Header Üstünlüğü**: Accordion menülerin z-index değeri `z-0` olarak ayarlandı
- **Scroll Sırasında Görünüm**: Header artık her zaman accordion menülerin üzerinde kalıyor
- **Sayfa Geçişlerinde Tutarlılık**: Tüm sayfalarda tutarlı z-index hiyerarşisi sağlandı

### 4. Activities Sayfası İyileştirmeleri

- **Accordion Boşlukları**: "Egzersizler" ve "Kayıtlar" accordionları arasındaki boşluk artırıldı
  - Mobil: `mt-6` (24px)
  - Desktop: `mt-8` (32px)

### 5. Header ve Navigation İyileştirmeleri

- **Header Z-Index**: Header'ın z-index değeri `z-[60]` olarak ayarlandı
- **Logo Underline**: Logo linkindeki istenmeyen underline kaldırıldı
- **Navbar Opacity**: Navbar arka planı tamamen opak hale getirildi (Apple cam efekti kaldırıldı)

---

## 🐛 Bug Fixes

### 1. Scroll Sorunları

- **Keyboard Scroll**: Ok tuşları ile scroll yapma sorunları çözüldü
- **Touch Scroll**: Mobil cihazlarda dokunmatik scroll çalışmama sorunu düzeltildi
- **Password Manager Interference**: Input alanlarına `data-lpignore` ve `data-1p-ignore` eklendi

### 2. Dialog Görünürlük Sorunları

- **Export Dialog Overflow**: Yatay scroll sorunları çözüldü
- **Conflict Resolution Dialog**: Header altında kalma sorunu düzeltildi
- **Settings Dialog Butonları**: Butonların taşma sorunları çözüldü

### 3. Layout Sorunları

- **Accordion Z-Index**: Accordion menülerin header'ın üzerine çıkma sorunu düzeltildi
- **Activities Page Layout**: Accordion boşlukları optimize edildi

---

## 📝 Technical Changes

### Components Modified

- `src/components/ScrollHandler.tsx` - Yeni component eklendi
- `src/components/ui/Accordion.tsx` - Z-index düzeltmesi
- `src/components/SettingsDialog.tsx` - Buton boyutları ve layout iyileştirmeleri
- `src/components/ThemeToggle.tsx` - Buton boyutları küçültüldü
- `src/components/LanguageToggle.tsx` - Buton boyutları küçültüldü
- `src/components/ConflictResolutionDialog.tsx` - Pozisyon düzeltmeleri
- `src/components/ExportDialog.tsx` - Pozisyon ve overflow düzeltmeleri
- `src/components/Header.tsx` - Z-index ve opacity düzeltmeleri
- `src/app/activities/page.tsx` - Accordion boşlukları
- `src/app/layout.tsx` - Scroll handler entegrasyonu

### CSS Changes

- Global CSS'de agresif overflow kuralları temizlendi
- Mobile scroll area optimizasyonları yapıldı
- Dialog pozisyonları için responsive padding değerleri eklendi

---

## 🚀 Deployment Notes

### Firebase Deployment

```bash
npm run build:firebase
firebase deploy
```

### Version Bump

- **Previous Version**: 0.29.0
- **New Version**: 0.30.0

---

## 📊 Impact

### User Experience

- ✅ Daha tutarlı ve profesyonel dialog görünümü
- ✅ Daha iyi scroll deneyimi (keyboard ve touch)
- ✅ Daha kompakt ve kullanışlı settings dialog
- ✅ Daha iyi görsel hiyerarşi (z-index düzenlemeleri)

### Performance

- ✅ Scroll performansı iyileştirildi
- ✅ Dialog render optimizasyonları yapıldı

---

## 🔮 Next Steps

- [ ] Additional UI/UX refinements based on user feedback
- [ ] Further mobile optimization
- [ ] Accessibility improvements

---

**Full Changelog**: [CHANGELOG.md](./CHANGELOG.md)

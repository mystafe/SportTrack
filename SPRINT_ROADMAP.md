# SportTrack - 3 Sprintlik Kapsamlı Yol Haritası

## Genel Bakış

Bu yol haritası, Settings Dialog ve Dialog Yönetimi sorunlarını çözmek ve uygulamanın genel kalitesini artırmak için 3 sprintlik stratejik bir plan içermektedir.

---

## 🎯 Sprint 1: Dialog Yönetimi ve Z-Index Sorunlarının Köklü Çözümü

**Süre:** 1 hafta  
**Hedef:** Settings dialog ve diğer dialog'ların doğru şekilde yönetilmesi

### 1.1 Dialog Yönetim Sistemi Oluşturma

**Öncelik:** 🔴 Kritik  
**Açıklama:** Merkezi bir dialog yönetim sistemi oluşturarak tüm dialog'ları tek bir yerden yönetmek.

**Görevler:**

- [ ] `DialogManager` context'i oluştur
- [ ] Dialog stack yönetimi (açık dialog'ların sırası)
- [ ] Z-index otomatik hesaplama sistemi
- [ ] Backdrop yönetimi (sadece en üstteki dialog'un backdrop'u görünür)
- [ ] ESC tuşu ile dialog kapatma (en üstteki dialog'u kapat)
- [ ] Dialog açma/kapatma event'leri

**Teknik Detaylar:**

```typescript
interface DialogState {
  id: string;
  component: React.ComponentType;
  props: any;
  zIndex: number;
  backdrop: boolean;
  onClose?: () => void;
}

interface DialogManagerContext {
  openDialog: (dialog: DialogState) => void;
  closeDialog: (id: string) => void;
  closeAll: () => void;
  getTopDialog: () => DialogState | null;
}
```

**Beklenen Sonuç:**

- Tüm dialog'lar merkezi sistemden yönetilir
- Z-index otomatik hesaplanır
- Settings dialog açıkken diğer dialog'lar açıldığında otomatik kapanır
- Backdrop sorunları çözülür

### 1.2 Settings Dialog Refactoring

**Öncelik:** 🔴 Kritik  
**Açıklama:** Settings dialog'unu yeni dialog yönetim sistemine entegre etmek.

**Görevler:**

- [ ] Settings dialog'unu `DialogManager` kullanacak şekilde refactor et
- [ ] `onSettingsClose` prop'unu kaldır (artık gerekli değil)
- [ ] Settings dialog açıkken diğer dialog'lar açıldığında otomatik kapanma
- [ ] Settings dialog'un backdrop'unu yeni sistemle yönet

**Beklenen Sonuç:**

- Settings dialog yeni sistemle çalışır
- Diğer dialog'lar açıldığında otomatik kapanır
- Kod daha temiz ve bakımı kolay

### 1.3 Tüm Dialog'ları Yeni Sisteme Entegre Etme

**Öncelik:** 🔴 Kritik  
**Açıklama:** Mevcut tüm dialog'ları yeni dialog yönetim sistemine entegre etmek.

**Dialog'lar:**

- [ ] ExportDialog
- [ ] ImportPreviewDialog
- [ ] ImportProgressDialog
- [ ] ConflictResolutionDialog
- [ ] DuplicateDetectionDialog
- [ ] ActivityRemindersDialog
- [ ] AuthDialog
- [ ] ConfirmDialog
- [ ] DataExportImport içindeki dialog'lar

**Görevler:**

- [ ] Her dialog'u `DialogManager` kullanacak şekilde güncelle
- [ ] Z-index manuel ayarlarını kaldır
- [ ] Backdrop yönetimini yeni sisteme bırak
- [ ] Test et ve doğrula

**Beklenen Sonuç:**

- Tüm dialog'lar merkezi sistemden yönetilir
- Z-index sorunları tamamen çözülür
- Kod tutarlılığı sağlanır

### 1.4 Test ve Doğrulama

**Öncelik:** 🟡 Yüksek  
**Görevler:**

- [ ] Tüm dialog açma/kapatma senaryolarını test et
- [ ] Z-index hiyerarşisini doğrula
- [ ] Backdrop davranışını test et
- [ ] Mobile ve desktop'ta test et
- [ ] Performance testleri yap

---

## 🎯 Sprint 2: UI/UX İyileştirmeleri ve Performans Optimizasyonu

**Süre:** 1 hafta  
**Hedef:** Kullanıcı deneyimini artırmak ve uygulama performansını optimize etmek

### 2.1 Settings Dialog UX İyileştirmeleri

**Öncelik:** 🟡 Yüksek  
**Görevler:**

- [ ] Settings dialog açılma/kapanma animasyonlarını iyileştir
- [ ] Mobile'da swipe-to-close özelliği ekle
- [ ] Settings dialog içinde scroll performansını optimize et
- [ ] Loading state'lerini iyileştir
- [ ] Error handling'i geliştir

### 2.2 Dialog Animasyonları ve Geçişler

**Öncelik:** 🟡 Yüksek  
**Görevler:**

- [ ] Dialog açılma/kapanma animasyonlarını standardize et
- [ ] Fade-in/fade-out animasyonları ekle
- [ ] Mobile'da slide-up animasyonu
- [ ] Desktop'ta scale animasyonu
- [ ] Animasyon performansını optimize et (will-change, transform kullan)

### 2.3 Performans Optimizasyonu

**Öncelik:** 🟡 Yüksek  
**Görevler:**

- [ ] Dialog component'lerini lazy load et
- [ ] Gereksiz re-render'ları önle (React.memo, useMemo)
- [ ] Dialog açma/kapatma işlemlerini debounce et
- [ ] Memory leak'leri kontrol et ve düzelt
- [ ] Bundle size'ı optimize et

### 2.4 Accessibility (A11y) İyileştirmeleri

**Öncelik:** 🟢 Orta  
**Görevler:**

- [ ] Dialog'lara ARIA attributes ekle
- [ ] Focus trap implementasyonu
- [ ] Keyboard navigation iyileştirmeleri
- [ ] Screen reader desteği
- [ ] Color contrast kontrolleri

---

## 🎯 Sprint 3: Test, Dokümantasyon ve Finalizasyon

**Süre:** 1 hafta  
**Hedef:** Tüm değişiklikleri test etmek, dokümante etmek ve production'a hazırlamak

### 3.1 Kapsamlı Test Süiti

**Öncelik:** 🔴 Kritik  
**Görevler:**

- [ ] Unit testler yaz (DialogManager için)
- [ ] Integration testler (dialog açma/kapatma senaryoları)
- [ ] E2E testler (kullanıcı akışları)
- [ ] Cross-browser testler
- [ ] Mobile device testleri
- [ ] Performance testleri

### 3.2 Dokümantasyon

**Öncelik:** 🟡 Yüksek  
**Görevler:**

- [ ] DialogManager API dokümantasyonu
- [ ] Dialog kullanım kılavuzu
- [ ] Best practices dokümantasyonu
- [ ] Migration guide (eski dialog sisteminden yeniye)
- [ ] Code comments ve JSDoc

### 3.3 Bug Fixes ve Edge Cases

**Öncelik:** 🔴 Kritik  
**Görevler:**

- [ ] Tüm bilinen bug'ları düzelt
- [ ] Edge case'leri handle et
- [ ] Error boundary'leri ekle
- [ ] Fallback mekanizmaları ekle
- [ ] Logging ve error tracking

### 3.4 Final Review ve Production Hazırlığı

**Öncelik:** 🔴 Kritik  
**Görevler:**

- [ ] Code review
- [ ] Performance review
- [ ] Security review
- [ ] Production build testleri
- [ ] Deployment planı hazırla

---

## 📊 Başarı Metrikleri

### Sprint 1:

- ✅ Tüm dialog'lar merkezi sistemden yönetiliyor
- ✅ Z-index sorunları %100 çözüldü
- ✅ Settings dialog açıkken diğer dialog'lar açıldığında otomatik kapanıyor
- ✅ Backdrop sorunları çözüldü

### Sprint 2:

- ✅ Dialog açılma/kapanma animasyonları smooth
- ✅ Mobile UX iyileştirildi
- ✅ Performans metrikleri iyileşti (%20+)
- ✅ Accessibility skoru artırıldı

### Sprint 3:

- ✅ Test coverage %80+
- ✅ Tüm bug'lar düzeltildi
- ✅ Dokümantasyon tamamlandı
- ✅ Production'a hazır

---

## 🚨 Risk Yönetimi

### Risk 1: Dialog Manager'ın karmaşıklığı

**Etki:** Yüksek  
**Olasılık:** Orta  
**Mitigasyon:** Basit bir API tasarla, fazla karmaşıklaştırma

### Risk 2: Mevcut dialog'ların refactoring'i

**Etki:** Yüksek  
**Olasılık:** Yüksek  
**Mitigasyon:** Adım adım migration, her dialog'u tek tek test et

### Risk 3: Performance sorunları

**Etki:** Orta  
**Olasılık:** Düşük  
**Mitigasyon:** Profiling yap, lazy loading kullan, memoization ekle

---

## 📝 Notlar

- Her sprint sonunda demo ve review yapılacak
- Kritik bug'lar için hotfix süreci hazır olacak
- Her görev için acceptance criteria belirlenecek
- Code review zorunlu olacak

---

## 🎯 Öncelik Sıralaması

1. **Sprint 1.1** - Dialog Manager oluşturma (En kritik)
2. **Sprint 1.2** - Settings Dialog refactoring
3. **Sprint 1.3** - Tüm dialog'ları entegre etme
4. **Sprint 1.4** - Test ve doğrulama
5. Sprint 2 ve 3 görevleri...

---

## ✅ Hemen Yapılacaklar (Bug Fixes)

1. ✅ Kayıt ol ekranında isim alanı full width
2. ✅ Kayan yazı bir tik aşağı
3. ✅ Egzersiz Ekle butonu bir tik aşağı

---

**Son Güncelleme:** 2024-01-XX  
**Durum:** Planlama Aşaması  
**Sorumlu:** Development Team

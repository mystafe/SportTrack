# Conflict Resolution UI Test Rehberi

## 🎯 Test Amacı

Conflict Resolution Dialog'unun iyileştirilmiş özelliklerini test etmek:

- Çakışan kayıtların detaylı listesi
- Kayıt bazında karşılaştırma
- Merge preview

---

## 📋 Test Senaryoları

### Test 1: Conflict Resolution Dialog'u Açma

**Önkoşul:** Google ile giriş yapılmış olmalı

**Adımlar:**

1. Google ile giriş yap
2. Birkaç aktivite ekle (yerel)
3. Başka bir cihazda veya farklı bir tarayıcıda aynı hesaba giriş yap
4. Orada farklı aktiviteler ekle (bulut)
5. İlk cihaza geri dön
6. Sayfayı yenile veya sync tetikle
7. Conflict Resolution Dialog açılmalı

**Beklenen Sonuç:**

- ✅ Conflict Resolution Dialog açılır
- ✅ Yerel ve Bulut verileri gösterilir
- ✅ Son değişiklik tarihleri gösterilir

---

### Test 2: Detaylı Farkları Görüntüleme

**Adımlar:**

1. Conflict Resolution Dialog açıkken
2. "▶ Detayları Göster" butonuna tıkla
3. Detaylar bölümü açılmalı
4. Şunları kontrol et:
   - 📲 "Sadece Yerelde" aktiviteler listeleniyor mu?
   - ☁️ "Sadece Bulutta" aktiviteler listeleniyor mu?
   - ⚠️ "Farklı Olanlar" aktiviteler gösteriliyor mu?
   - 🏆 Badge farkları gösteriliyor mu?

**Beklenen Sonuç:**

- ✅ Detaylar bölümü açılır
- ✅ Tüm farklılıklar listelenir
- ✅ Her aktivite için bilgiler gösterilir (aktivite adı, miktar, tarih)

---

### Test 3: Kayıt Bazında Karşılaştırma

**Adımlar:**

1. Conflict Resolution Dialog'u aç
2. "Detayları Göster" butonuna tıkla
3. "Farklı Olanlar" bölümüne bak
4. Her farklı aktivite için kontrol et:
   - Aktivite adı gösteriliyor mu?
   - 📲 Yerel değerler gösteriliyor mu? (miktar, puan)
   - ☁️ Bulut değerleri gösteriliyor mu? (miktar, puan)
   - Değerler yan yana karşılaştırılabiliyor mu?

**Beklenen Sonuç:**

- ✅ Her farklı aktivite için yerel ve bulut değerleri gösterilir
- ✅ Değerler yan yana karşılaştırılabilir
- ✅ Farklar net bir şekilde görülebilir

---

### Test 4: Merge Preview

**Adımlar:**

1. Conflict Resolution Dialog'u aç
2. **Ctrl (Windows/Linux) veya Cmd (Mac)** tuşuna basılı tut
3. **Yerel** kutusuna tıkla (seçilmeli)
4. **Ctrl/Cmd** tuşunu basılı tutmaya devam et
5. **Bulut** kutusuna tıkla (her ikisi de seçilmeli)
6. **Ctrl/Cmd** tuşunu bırak
7. Merge Preview bölümünü kontrol et:
   - Yeşil bilgi kutusu görünüyor mu?
   - "🔄 Birleştirme Önizlemesi" başlığı var mı?
   - Birleştirme sonrası aktivite sayısı gösteriliyor mu?
   - Birleştirme sonrası badge sayısı gösteriliyor mu?

**Beklenen Sonuç:**

- ✅ Her ikisi de seçildiğinde Merge Preview görünür
- ✅ Yeşil bilgi kutusu gösterilir
- ✅ Birleştirme sonrası sayılar doğru hesaplanır

---

### Test 5: Merge İşlemi

**Adımlar:**

1. Conflict Resolution Dialog'u aç
2. Ctrl/Cmd tuşuna basılı tutarak hem Yerel hem Bulut'u seç
3. Merge Preview'ı kontrol et
4. "Devam Et" butonuna tıkla
5. İşlem tamamlanana kadar bekle
6. Sayfa yenilendikten sonra kontrol et:
   - Tüm aktiviteler birleştirildi mi?
   - Badge'ler birleştirildi mi?
   - Veriler doğru mu?

**Beklenen Sonuç:**

- ✅ Merge işlemi başarıyla tamamlanır
- ✅ Tüm aktiviteler birleştirilir
- ✅ Badge'ler birleştirilir
- ✅ Veriler doğru şekilde senkronize edilir

---

### Test 6: Yerel Veriyi Seçme

**Adımlar:**

1. Conflict Resolution Dialog'u aç
2. **Yerel** kutusuna tıkla (sadece Yerel seçilmeli)
3. Merge Preview görünmemeli
4. "Devam Et" butonuna tıkla
5. İşlem tamamlanana kadar bekle
6. Kontrol et:
   - Yerel veriler kullanıldı mı?
   - Bulut veriler göz ardı edildi mi?

**Beklenen Sonuç:**

- ✅ Sadece Yerel seçildiğinde Merge Preview görünmez
- ✅ Yerel veriler kullanılır
- ✅ Bulut veriler göz ardı edilir

---

### Test 7: Bulut Veriyi Seçme

**Adımlar:**

1. Conflict Resolution Dialog'u aç
2. **Bulut** kutusuna tıkla (sadece Bulut seçilmeli)
3. Merge Preview görünmemeli
4. "Devam Et" butonuna tıkla
5. İşlem tamamlanana kadar bekle
6. Kontrol et:
   - Bulut veriler kullanıldı mı?
   - Yerel veriler göz ardı edildi mi?

**Beklenen Sonuç:**

- ✅ Sadece Bulut seçildiğinde Merge Preview görünmez
- ✅ Bulut veriler kullanılır
- ✅ Yerel veriler göz ardı edilir

---

### Test 8: Hiçbir Şey Seçmeden Devam Etme

**Adımlar:**

1. Conflict Resolution Dialog'u aç
2. Hiçbir şey seçme
3. "Devam Et" butonuna tıkla
4. Kontrol et:
   - "Newest" stratejisi kullanıldı mı?
   - En yeni veriler kullanıldı mı?

**Beklenen Sonuç:**

- ✅ Hiçbir şey seçilmediğinde "newest" stratejisi kullanılır
- ✅ En yeni veriler kullanılır

---

### Test 9: Detaylar Bölümü Scroll

**Adımlar:**

1. Conflict Resolution Dialog'u aç
2. Çok sayıda farklılık oluştur (10+ aktivite)
3. "Detayları Göster" butonuna tıkla
4. Detaylar bölümünde scroll yap
5. Scroll performansını kontrol et

**Beklenen Sonuç:**

- ✅ Scroll sorunsuz çalışır
- ✅ Tüm aktiviteler görüntülenebilir
- ✅ Performans iyi

---

### Test 10: Mobil Uyumluluk

**Adımlar:**

1. Chrome DevTools'u aç (F12)
2. Mobile View'ı aktif et (Toggle device toolbar)
3. Bir mobil cihaz seç (örn: iPhone 12)
4. Conflict Resolution Dialog'u aç
5. Kontrol et:
   - Dialog mobilde düzgün görünüyor mu?
   - Detaylar bölümü scroll edilebiliyor mu?
   - Butonlar tıklanabilir mi?
   - Text'ler okunabilir mi?

**Beklenen Sonuç:**

- ✅ Dialog mobilde düzgün görünür
- ✅ Tüm öğeler erişilebilir
- ✅ Scroll çalışır

---

## 🔧 Test İçin Conflict Oluşturma (Manuel)

### Yöntem 1: İki Farklı Cihaz/Tarayıcı

1. **Cihaz 1:**
   - Google ile giriş yap
   - Birkaç aktivite ekle
   - Sync yap

2. **Cihaz 2 (farklı tarayıcı veya incognito):**
   - Aynı Google hesabıyla giriş yap
   - Farklı aktiviteler ekle
   - Sync yap

3. **Cihaz 1'e geri dön:**
   - Sayfayı yenile
   - Conflict dialog açılmalı

---

### Yöntem 2: Console ile (Hızlı Test)

1. Browser Console'u aç (F12 veya Cmd+Option+I)
2. Aşağıdaki kodu çalıştır:

```javascript
// Conflict oluşturma için localStorage'a conflict data ekle
const conflictData = {
  local: {
    activities: [
      {
        id: 'local-1',
        activityKey: 'walking',
        label: 'Yürüme',
        icon: '🚶',
        unit: 'adım',
        multiplier: 1,
        amount: 5000,
        points: 5000,
        performedAt: new Date().toISOString(),
      },
      {
        id: 'local-2',
        activityKey: 'running',
        label: 'Koşu',
        icon: '🏃',
        unit: 'km',
        multiplier: 10,
        amount: 3,
        points: 30,
        performedAt: new Date().toISOString(),
      },
    ],
    badges: [],
    challenges: [],
    settings: null,
  },
  cloud: {
    activities: [
      {
        id: 'cloud-1',
        activityKey: 'cycling',
        label: 'Bisiklet',
        icon: '🚴',
        unit: 'km',
        multiplier: 5,
        amount: 10,
        points: 50,
        performedAt: new Date().toISOString(),
      },
      {
        id: 'local-1', // Aynı ID ama farklı değerler (conflict)
        activityKey: 'walking',
        label: 'Yürüme',
        icon: '🚶',
        unit: 'adım',
        multiplier: 1,
        amount: 8000, // Farklı miktar
        points: 8000, // Farklı puan
        performedAt: new Date().toISOString(),
      },
    ],
    badges: [],
    challenges: [],
    settings: null,
    metadata: {
      lastModified: new Date().toISOString(),
      version: Date.now(),
      userId: 'test-user',
    },
  },
};

// Conflict data'yı localStorage'a kaydet
localStorage.setItem('sporttrack_sync_conflict', JSON.stringify(conflictData));

// Initial sync flag'ini kaldır (conflict dialog'un açılması için)
localStorage.removeItem('sporttrack_initial_sync_complete');

console.log('✅ Conflict data oluşturuldu! Sayfayı yenile...');
// Sayfayı yenile
window.location.reload();
```

3. Sayfa yenilendikten sonra Conflict Resolution Dialog açılmalı

---

### Yöntem 3: Gerçekçi Test Senaryosu

1. **Adım 1:** İlk cihazda aktiviteler ekle

   ```javascript
   // Console'da çalıştır
   const activities = JSON.parse(localStorage.getItem('sporttrack_activities') || '[]');
   // Mevcut aktiviteleri kaydet
   console.log('Mevcut aktiviteler:', activities.length);
   ```

2. **Adım 2:** Cloud'a sync yap (Settings > Cloud Sync > Sync)

3. **Adım 3:** Yeni aktiviteler ekle (yerel)

4. **Adım 4:** Console'da conflict oluştur:

   ```javascript
   // Cloud'dan veri çek (simüle et)
   const cloudActivities = [
     {
       id: 'cloud-new-1',
       activityKey: 'swimming',
       label: 'Yüzme',
       icon: '🏊',
       unit: 'metre',
       multiplier: 2,
       amount: 500,
       points: 1000,
       performedAt: new Date().toISOString(),
     },
   ];

   // Local aktiviteleri al
   const localActivities = JSON.parse(localStorage.getItem('sporttrack_activities') || '[]');

   // Conflict data oluştur
   const conflictData = {
     local: {
       activities: localActivities,
       badges: [],
       challenges: [],
       settings: null,
     },
     cloud: {
       activities: cloudActivities,
       badges: [],
       challenges: [],
       settings: null,
       metadata: {
         lastModified: new Date().toISOString(),
         version: Date.now(),
         userId: 'test-user',
       },
     },
   };

   localStorage.setItem('sporttrack_sync_conflict', JSON.stringify(conflictData));
   localStorage.removeItem('sporttrack_initial_sync_complete');

   console.log('✅ Conflict oluşturuldu! Sayfayı yenile...');
   window.location.reload();
   ```

---

## 📊 Test Sonuçları Takibi

Her test için:

- ✅ Başarılı
- ❌ Başarısız
- ⚠️ Kısmen Başarılı
- ⏭️ Atlanmış

**Notlar:**

- Test sırasında bulunan hataları not al
- Screenshot'lar al (özellikle conflict dialog'u)
- Console log'larını kontrol et

---

## 🐛 Bilinen Sorunlar

Test sırasında bulunan sorunları buraya ekle:

- [ ] Sorun 1: ...
- [ ] Sorun 2: ...

---

## ✅ Test Tamamlama Checklist

- [ ] Test 1: Conflict Resolution Dialog'u Açma
- [ ] Test 2: Detaylı Farkları Görüntüleme
- [ ] Test 3: Kayıt Bazında Karşılaştırma
- [ ] Test 4: Merge Preview
- [ ] Test 5: Merge İşlemi
- [ ] Test 6: Yerel Veriyi Seçme
- [ ] Test 7: Bulut Veriyi Seçme
- [ ] Test 8: Hiçbir Şey Seçmeden Devam Etme
- [ ] Test 9: Detaylar Bölümü Scroll
- [ ] Test 10: Mobil Uyumluluk

---

**Test Tarihi:** ******\_\_\_******
**Test Edilen Versiyon:** v0.18.17+
**Test Eden:** ******\_\_\_******

---

## 💡 İpuçları

1. **Conflict Oluşturma:** Console komutlarını kullanarak hızlı test yapabilirsin
2. **Gerçekçi Test:** İki farklı cihaz/tarayıcı kullanarak gerçek senaryoyu test edebilirsin
3. **Conflict Temizleme:** Test sonrası conflict'i temizlemek için:
   ```javascript
   localStorage.removeItem('sporttrack_sync_conflict');
   localStorage.setItem('sporttrack_initial_sync_complete', 'true');
   window.location.reload();
   ```

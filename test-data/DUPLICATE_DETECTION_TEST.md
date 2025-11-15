# Duplicate Detection Test Rehberi

## 🎯 Test Amacı

Duplicate Detection özelliğinin doğru çalıştığını doğrulamak.

---

## 📋 Test Senaryoları

### Test 1: Duplicate Detection Dialog'u Açma

**Adımlar:**

1. Uygulamayı aç
2. Settings menüsüne git (⚙️ ikonu veya profil butonu)
3. "Export/Import" bölümünde **"🔍 Yinelenen"** butonuna tıkla

**Beklenen Sonuç:**

- ✅ Duplicate Detection Dialog açılır
- ✅ Dialog'da 3 mod seçeneği görünür: "ID", "İçerik", "Her İkisi"
- ✅ Varsayılan mod "Her İkisi" seçili olmalı
- ✅ Summary bölümünde duplicate sayısı gösterilir

---

### Test 2: Duplicate Kayıt Oluşturma (ID Duplicate)

**Adımlar:**

1. Browser Console'u aç (F12 veya Cmd+Option+I)
2. Aşağıdaki kodu çalıştır (aynı ID'ye sahip 2 aktivite oluştur):

```javascript
// LocalStorage'dan mevcut aktiviteleri al
const activities = JSON.parse(localStorage.getItem('sporttrack_activities') || '[]');

// Aynı ID'ye sahip duplicate aktivite oluştur
const duplicateId = activities.length > 0 ? activities[0].id : 'test-id-123';
const duplicateActivity = {
  ...activities[0],
  id: duplicateId, // Aynı ID
  performedAt: new Date().toISOString(), // Farklı tarih
};

// Duplicate'ı ekle
activities.push(duplicateActivity);
localStorage.setItem('sporttrack_activities', JSON.stringify(activities));

// Sayfayı yenile
window.location.reload();
```

3. Sayfa yenilendikten sonra Settings'e git
4. "🔍 Yinelenen" butonuna tıkla
5. Detection Mode'da **"ID"** seçeneğini seç

**Beklenen Sonuç:**

- ✅ Duplicate Detection Dialog açılır
- ✅ "ID" modu seçili
- ✅ Duplicate kayıtlar listelenir
- ✅ Her duplicate'ın yanında "Duplicate ID: ..." mesajı görünür

---

### Test 3: Duplicate Kayıt Oluşturma (Content Duplicate)

**Adımlar:**

1. Browser Console'u aç
2. Aşağıdaki kodu çalıştır (aynı tarih, aktivite ve miktara sahip 2 aktivite):

```javascript
// LocalStorage'dan mevcut aktiviteleri al
const activities = JSON.parse(localStorage.getItem('sporttrack_activities') || '[]');

// Eğer aktivite yoksa, önce bir aktivite ekle
if (activities.length === 0) {
  alert('Önce bir aktivite eklemeniz gerekiyor!');
} else {
  // İlk aktiviteyi al
  const firstActivity = activities[0];

  // Aynı tarih, aktivite ve miktara sahip duplicate oluştur (farklı ID ile)
  const duplicateActivity = {
    ...firstActivity,
    id: 'duplicate-' + Date.now(), // Farklı ID
    performedAt: firstActivity.performedAt, // Aynı tarih
    activityKey: firstActivity.activityKey, // Aynı aktivite
    amount: firstActivity.amount, // Aynı miktar
  };

  // Duplicate'ı ekle
  activities.push(duplicateActivity);
  localStorage.setItem('sporttrack_activities', JSON.stringify(activities));

  console.log('✅ Content duplicate eklendi!');
  // Sayfayı yenile
  window.location.reload();
}
```

3. Sayfa yenilendikten sonra Settings'e git
4. "🔍 Yinelenen" butonuna tıkla
5. Detection Mode'da **"İçerik"** seçeneğini seç

**Beklenen Sonuç:**

- ✅ Duplicate Detection Dialog açılır
- ✅ "İçerik" modu seçili
- ✅ Duplicate kayıtlar listelenir
- ✅ Her duplicate'ın yanında "Duplicate entry: Same date, activity, and amount" mesajı görünür

---

### Test 4: Tümünü Seç / Seçimi Kaldır

**Adımlar:**

1. Duplicate Detection Dialog'u aç
2. "Tümünü Seç" checkbox'ına tıkla
3. Tüm duplicate'ların seçildiğini kontrol et
4. Tekrar "Tümünü Seç" checkbox'ına tıkla
5. Tüm seçimlerin kaldırıldığını kontrol et

**Beklenen Sonuç:**

- ✅ "Tümünü Seç" checkbox'ı tüm duplicate'ları seçer/kaldırır
- ✅ Seçili sayısı güncellenir (örn: "3 / 3 seçili")
- ✅ Seçili duplicate'lar mavi arka planla vurgulanır

---

### Test 5: Tekil Seçim

**Adımlar:**

1. Duplicate Detection Dialog'u aç
2. Bir duplicate kaydın checkbox'ına tıkla
3. Sadece o kaydın seçildiğini kontrol et
4. Başka bir duplicate'ın checkbox'ına tıkla
5. Önceki seçimin kaldırılıp yenisinin seçildiğini kontrol et

**Beklenen Sonuç:**

- ✅ Her duplicate bağımsız olarak seçilebilir
- ✅ Seçili sayısı doğru güncellenir
- ✅ Seçili duplicate'lar vurgulanır

---

### Test 6: Duplicate Kaldırma

**Adımlar:**

1. Duplicate Detection Dialog'u aç
2. Birkaç duplicate seç (checkbox ile)
3. "Seçilenleri Kaldır (X)" butonuna tıkla
4. Toast mesajını kontrol et
5. Dialog'un kapandığını kontrol et
6. Aktivite listesinde duplicate'ların kaldırıldığını kontrol et

**Beklenen Sonuç:**

- ✅ Seçili duplicate'lar kaldırılır
- ✅ Toast mesajı gösterilir: "X yinelenen kayıt kaldırıldı"
- ✅ Dialog kapanır
- ✅ Aktivite listesinde duplicate'lar görünmez

---

### Test 7: Hiçbir Şey Seçmeden Kaldırma

**Adımlar:**

1. Duplicate Detection Dialog'u aç
2. Hiçbir duplicate seçme
3. "Seçilenleri Kaldır (0)" butonuna tıkla

**Beklenen Sonuç:**

- ✅ Buton disabled olmalı (gri, tıklanamaz)
- ✅ Veya warning toast mesajı gösterilmeli: "Lütfen kaldırılacak kayıtları seçin"

---

### Test 8: Duplicate Yok Durumu

**Adımlar:**

1. Tüm duplicate'ları kaldır (Test 6'yı tekrarla)
2. Duplicate Detection Dialog'u tekrar aç
3. Dialog içeriğini kontrol et

**Beklenen Sonuç:**

- ✅ "✅ Yinelenen kayıt bulunamadı!" mesajı gösterilir
- ✅ Yeşil arka planlı bilgi kutusu görünür
- ✅ Duplicate listesi boş

---

### Test 9: Detection Mode Değiştirme

**Adımlar:**

1. Hem ID hem de Content duplicate'ları oluştur (Test 2 ve 3'ü tekrarla)
2. Duplicate Detection Dialog'u aç
3. "Her İkisi" modunu seç
4. Duplicate sayısını not et
5. "ID" modunu seç
6. Duplicate sayısının değiştiğini kontrol et
7. "İçerik" modunu seç
8. Duplicate sayısının tekrar değiştiğini kontrol et

**Beklenen Sonuç:**

- ✅ Her mod değişikliğinde duplicate listesi güncellenir
- ✅ "Her İkisi" modu en fazla duplicate gösterir
- ✅ "ID" ve "İçerik" modları sadece ilgili duplicate'ları gösterir

---

### Test 10: Dialog Kapatma

**Adımlar:**

1. Duplicate Detection Dialog'u aç
2. "İptal" butonuna tıkla
3. Dialog'un kapandığını kontrol et
4. Dialog'u tekrar aç
5. Backdrop'a (arka plan) tıkla
6. Dialog'un kapandığını kontrol et

**Beklenen Sonuç:**

- ✅ "İptal" butonu dialog'u kapatır
- ✅ Backdrop'a tıklamak dialog'u kapatır
- ✅ Seçimler kaybolur (dialog tekrar açıldığında sıfırlanır)

---

### Test 11: Mobil Uyumluluk

**Adımlar:**

1. Chrome DevTools'u aç (F12)
2. Mobile View'ı aktif et (Toggle device toolbar)
3. Bir mobil cihaz seç (örn: iPhone 12)
4. Duplicate Detection Dialog'u aç
5. Dialog'un mobilde düzgün göründüğünü kontrol et:
   - Dialog tam ekran mı?
   - Butonlar tıklanabilir mi?
   - Text'ler okunabilir mi?
   - Scroll çalışıyor mu?

**Beklenen Sonuç:**

- ✅ Dialog mobilde düzgün görünür
- ✅ Tüm öğeler erişilebilir
- ✅ Scroll çalışır

---

### Test 12: Çok Sayıda Duplicate

**Adımlar:**

1. Browser Console'u aç
2. Aşağıdaki kodu çalıştır (10 duplicate oluştur):

```javascript
const activities = JSON.parse(localStorage.getItem('sporttrack_activities') || '[]');

if (activities.length === 0) {
  alert('Önce bir aktivite eklemeniz gerekiyor!');
} else {
  const firstActivity = activities[0];

  // 10 duplicate oluştur
  for (let i = 0; i < 10; i++) {
    const duplicate = {
      ...firstActivity,
      id: 'duplicate-' + Date.now() + '-' + i,
      performedAt: firstActivity.performedAt,
    };
    activities.push(duplicate);
  }

  localStorage.setItem('sporttrack_activities', JSON.stringify(activities));
  console.log('✅ 10 duplicate eklendi!');
  window.location.reload();
}
```

3. Duplicate Detection Dialog'u aç
4. Scroll performansını kontrol et
5. "Tümünü Seç" butonunu test et
6. Tümünü seçip kaldırmayı test et

**Beklenen Sonuç:**

- ✅ Dialog performanslı çalışır
- ✅ Scroll sorunsuz
- ✅ "Tümünü Seç" çalışır
- ✅ Toplu kaldırma çalışır

---

## 🐛 Bilinen Sorunlar

Test sırasında bulunan sorunları buraya ekle:

- [ ] Sorun 1: ...
- [ ] Sorun 2: ...

---

## ✅ Test Sonuçları

Her test için:

- ✅ Başarılı
- ❌ Başarısız
- ⚠️ Kısmen Başarılı
- ⏭️ Atlanmış

**Test Tarihi:** ******\_\_\_******
**Test Edilen Versiyon:** v0.18.17+
**Test Eden:** ******\_\_\_******

---

## 💡 İpuçları

1. **Console Komutları:** Test için console komutlarını kullanabilirsin
2. **LocalStorage:** Duplicate'ları localStorage'dan kontrol edebilirsin: `JSON.parse(localStorage.getItem('sporttrack_activities'))`
3. **Sayfa Yenileme:** Değişikliklerden sonra sayfayı yenilemeyi unutma
4. **Backup:** Test öncesi verilerini yedekle (Export butonu ile)

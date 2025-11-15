# Sprint 1 Test Planı

## Test Senaryoları

### 1. Import Preview Dialog Testi

#### Test 1.1: Normal Import Preview

**Adımlar:**

1. Settings menüsüne git
2. "Import" butonuna tıkla
3. Geçerli bir JSON dosyası seç (export edilmiş bir dosya)
4. Preview dialog'un açıldığını kontrol et

**Beklenen Sonuç:**

- ✅ Preview dialog açılmalı
- ✅ Egzersiz sayısı gösterilmeli
- ✅ Aktivite tanımları sayısı gösterilmeli
- ✅ Tarih aralığı gösterilmeli
- ✅ Toplam puan gösterilmeli
- ✅ En çok yapılan aktiviteler listelenmeli

#### Test 1.2: Preview'da Duplicate Detection

**Adımlar:**

1. Duplicate kayıtlar içeren bir JSON dosyası hazırla (aynı ID veya aynı tarih+aktivite+miktar)
2. Import butonuna tıkla ve dosyayı seç
3. Preview dialog'u kontrol et

**Beklenen Sonuç:**

- ✅ Duplicate kayıtlar tespit edilmeli
- ✅ "Tekrar Eden Kayıtlar" uyarısı gösterilmeli
- ✅ Duplicate sayısı doğru gösterilmeli

#### Test 1.3: Preview'da Validation Errors

**Adımlar:**

1. Geçersiz kayıtlar içeren bir JSON dosyası hazırla (geçersiz tarih, eksik alanlar)
2. Import butonuna tıkla ve dosyayı seç
3. Preview dialog'u kontrol et

**Beklenen Sonuç:**

- ✅ Geçersiz kayıtlar tespit edilmeli
- ✅ "Geçersiz Kayıtlar" uyarısı gösterilmeli
- ✅ Geçersiz kayıt sayısı doğru gösterilmeli

#### Test 1.4: Preview Cancel

**Adımlar:**

1. Import butonuna tıkla ve dosyayı seç
2. Preview dialog'da "Cancel" butonuna tıkla

**Beklenen Sonuç:**

- ✅ Dialog kapanmalı
- ✅ Veriler import edilmemeli
- ✅ Sayfa değişmemeli

---

### 2. Import Progress Dialog Testi

#### Test 2.1: Normal Import Progress

**Adımlar:**

1. Import butonuna tıkla ve dosyayı seç
2. Preview dialog'da "Import Et" butonuna tıkla
3. Progress dialog'u kontrol et

**Beklenen Sonuç:**

- ✅ Progress dialog açılmalı
- ✅ Progress bar görünmeli ve ilerlemeli
- ✅ İşlenen/toplam sayısı gösterilmeli
- ✅ Yüzde gösterilmeli
- ✅ Şu anki işlem bilgisi gösterilmeli
- ✅ Import tamamlandığında başarı mesajı gösterilmeli
- ✅ Sayfa otomatik reload olmalı

#### Test 2.2: Import Progress with Errors

**Adımlar:**

1. Hatalı kayıtlar içeren bir JSON dosyası seç
2. Preview'da "Import Et" butonuna tıkla
3. Progress dialog'u kontrol et

**Beklenen Sonuç:**

- ✅ Progress bar ilerlemeli
- ✅ Hatalar listelenmeli
- ✅ Geçerli kayıtlar import edilmeli
- ✅ Geçersiz kayıtlar atlanmalı

#### Test 2.3: Import Progress Cancel

**Adımlar:**

1. Import butonuna tıkla ve dosyayı seç
2. Preview'da "Import Et" butonuna tıkla
3. Progress dialog açıldığında "Cancel" butonuna tıkla

**Beklenen Sonuç:**

- ✅ Import işlemi durdurulmalı
- ✅ Dialog kapanmalı
- ✅ Kısmen import edilen veriler kalmalı (localStorage'da)

---

### 3. Data Validation Testi

#### Test 3.1: Activity Validation

**Adımlar:**

1. Geçersiz aktivite kayıtları içeren bir JSON hazırla:
   - Geçersiz tarih formatı
   - Eksik required fields (id, activityKey, amount, points)
   - Negatif değerler
   - Gelecek tarihler
2. Import et

**Beklenen Sonuç:**

- ✅ Geçersiz kayıtlar filtrelenmeli
- ✅ Sadece geçerli kayıtlar import edilmeli
- ✅ Hatalar progress dialog'da gösterilmeli

#### Test 3.2: Duplicate Removal

**Adımlar:**

1. Aynı ID'ye sahip kayıtlar içeren JSON hazırla
2. Aynı tarih+aktivite+miktar kombinasyonuna sahip kayıtlar içeren JSON hazırla
3. Import et

**Beklenen Sonuç:**

- ✅ Duplicate kayıtlar tespit edilmeli
- ✅ Sadece unique kayıtlar import edilmeli
- ✅ Duplicate sayısı doğru gösterilmeli

#### Test 3.3: Settings Validation

**Adımlar:**

1. Geçersiz settings içeren JSON hazırla:
   - Geçersiz dailyTarget (negatif, çok yüksek)
   - Geçersiz customActivities
2. Import et

**Beklenen Sonuç:**

- ✅ Settings validation yapılmalı
- ✅ Geçersiz alanlar uyarı olarak gösterilmeli
- ✅ Geçerli settings import edilmeli

#### Test 3.4: Badge & Challenge Validation

**Adımlar:**

1. Geçersiz badge/challenge kayıtları içeren JSON hazırla:
   - Eksik ID
   - Geçersiz tarih formatı
   - Geçersiz target değerleri
2. Import et

**Beklenen Sonuç:**

- ✅ Geçersiz badge/challenge kayıtları filtrelenmeli
- ✅ Sadece geçerli kayıtlar import edilmeli
- ✅ Hatalar gösterilmeli

---

### 4. Offline Sync Queue Testi

#### Test 4.1: Offline Activity Add

**ÖNEMLİ:** Offline modu aktif etmeden önce sayfanın tamamen yüklendiğinden emin ol!

**Adımlar:**

1. Uygulamayı aç ve sayfanın tamamen yüklendiğinden emin ol (ana sayfa veya activities sayfası)
2. Browser DevTools'u aç (F12)
3. Network tab'ına git
4. **ÖNEMLİ:** Henüz offline yapma! Önce sayfanın yüklendiğinden emin ol
5. Şimdi Network tab'ında "Offline" checkbox'ını işaretle
6. Bir aktivite ekle (ana sayfadan veya "Add Exercise" butonundan)
7. Console'u kontrol et (F12 → Console tab)
8. Settings'te Cloud Sync bölümünü kontrol et

**Beklenen Sonuç:**

- ✅ Aktivite localStorage'a kaydedilmeli
- ✅ Queue'ya eklenmeli
- ✅ Console'da "📦 Offline: Adding changes to sync queue..." mesajı görünmeli
- ✅ Console'da "✅ Offline: X items queued for sync" mesajı görünmeli
- ✅ Settings'te "X bekleyen" mesajı gösterilmeli
- ✅ Hata olmamalı (ERR_INTERNET_DISCONNECTED sayfası görünmemeli)

**NOT:** Eğer offline modda sayfa yenilenirse veya yeni sayfaya gidilirse Chrome'un "No internet" sayfası görünebilir. Bu normaldir. Test için offline modu aktif etmeden önce sayfanın yüklendiğinden emin olun.

#### Test 4.2: Online Auto-Sync

**Adımlar:**

1. Offline modda birkaç aktivite ekle
2. "Online" modunu aktif et
3. Cloud Sync durumunu kontrol et

**Beklenen Sonuç:**

- ✅ Online olduğunda otomatik sync başlamalı
- ✅ Queue'daki item'lar sync edilmeli
- ✅ Queue temizlenmeli
- ✅ "X bekleyen" mesajı kaybolmalı

#### Test 4.3: Failed Sync Retry

**Adımlar:**

1. Offline modda aktivite ekle
2. Online ol ama Firebase'e bağlanamayacak şekilde ayarla (yanlış credentials)
3. Sync'in başarısız olduğunu kontrol et
4. "Retry" butonuna tıkla

**Beklenen Sonuç:**

- ✅ Başarısız sync'ler "failed" olarak işaretlenmeli
- ✅ "X başarısız" mesajı gösterilmeli
- ✅ Retry butonu çalışmalı
- ✅ Max retry'e ulaşınca item'lar failed olarak kalmalı

#### Test 4.4: Queue Status Display

**Adımlar:**

1. Offline modda birkaç aktivite ekle
2. Settings'te Cloud Sync bölümüne git
3. Queue durumunu kontrol et

**Beklenen Sonuç:**

- ✅ "X bekleyen" badge'i gösterilmeli
- ✅ Queue durumu doğru gösterilmeli
- ✅ Online olduğunda otomatik sync başlamalı

---

### 5. Integration Testleri

#### Test 5.1: Full Import Flow

**Adımlar:**

1. Mevcut verileri export et
2. Birkaç aktivite ekle
3. Yeni verileri export et
4. Eski export'u import et
5. Conflict resolution dialog'unu kontrol et

**Beklenen Sonuç:**

- ✅ Import preview gösterilmeli
- ✅ Progress dialog çalışmalı
- ✅ Veriler doğru import edilmeli
- ✅ Cloud sync çalışmalı (eğer authenticated ise)

#### Test 5.2: Import + Cloud Sync

**Adımlar:**

1. Authenticated ol
2. Import butonuna tıkla ve dosyayı seç
3. Preview'da "Import Et" butonuna tıkla
4. Progress dialog'u kontrol et
5. Cloud sync durumunu kontrol et

**Beklenen Sonuç:**

- ✅ Import tamamlandıktan sonra cloud sync başlamalı
- ✅ Veriler cloud'a yüklenmeli
- ✅ "Veriler içe aktarıldı ve buluta yüklendi!" mesajı gösterilmeli

#### Test 5.3: Import + Offline Queue

**Adımlar:**

1. Offline modda ol
2. Import butonuna tıkla ve dosyayı seç
3. Preview'da "Import Et" butonuna tıkla
4. Import tamamlandıktan sonra online ol
5. Queue sync'ini kontrol et

**Beklenen Sonuç:**

- ✅ Import offline'da tamamlanmalı
- ✅ Veriler localStorage'a kaydedilmeli
- ✅ Online olduğunda queue sync başlamalı
- ✅ Veriler cloud'a yüklenmeli

---

## Test Checklist

### Import Preview Dialog

- [ ] Preview dialog açılıyor mu?
- [ ] İstatistikler doğru gösteriliyor mu?
- [ ] Duplicate detection çalışıyor mu?
- [ ] Validation errors gösteriliyor mu?
- [ ] Cancel butonu çalışıyor mu?

### Import Progress Dialog

- [ ] Progress bar çalışıyor mu?
- [ ] İlerleme doğru gösteriliyor mu?
- [ ] Hatalar gösteriliyor mu?
- [ ] Başarı mesajı gösteriliyor mu?
- [ ] Sayfa reload oluyor mu?

### Data Validation

- [ ] Activity validation çalışıyor mu?
- [ ] Duplicate removal çalışıyor mu?
- [ ] Settings validation çalışıyor mu?
- [ ] Badge validation çalışıyor mu?
- [ ] Challenge validation çalışıyor mu?

### Offline Sync Queue

- [ ] Offline'da queue'ya ekleniyor mu?
- [ ] Online'da otomatik sync çalışıyor mu?
- [ ] Queue durumu gösteriliyor mu?
- [ ] Retry mekanizması çalışıyor mu?
- [ ] Failed items gösteriliyor mu?

### Integration

- [ ] Full import flow çalışıyor mu?
- [ ] Import + Cloud Sync çalışıyor mu?
- [ ] Import + Offline Queue çalışıyor mu?

---

## Test Verileri Hazırlama

### Test JSON Dosyası 1: Normal Data

```json
{
  "exercises": [
    {
      "id": "test-1",
      "activityKey": "walking",
      "label": "Yürüyüş",
      "icon": "🚶",
      "unit": "adım",
      "multiplier": 1,
      "amount": 5000,
      "points": 5000,
      "performedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "settings": {
    "name": "Test User",
    "dailyTarget": 10000,
    "customActivities": []
  },
  "version": "0.18.17"
}
```

### Test JSON Dosyası 2: Duplicate Data

```json
{
  "exercises": [
    {
      "id": "test-1",
      "activityKey": "walking",
      "amount": 5000,
      "points": 5000,
      "performedAt": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": "test-1",
      "activityKey": "walking",
      "amount": 5000,
      "points": 5000,
      "performedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "settings": {},
  "version": "0.18.17"
}
```

### Test JSON Dosyası 3: Invalid Data

```json
{
  "exercises": [
    {
      "id": "test-1",
      "activityKey": "walking",
      "amount": -100,
      "points": -100,
      "performedAt": "invalid-date"
    }
  ],
  "settings": {},
  "version": "0.18.17"
}
```

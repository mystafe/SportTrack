# Sprint 2 Test Planı

## 📋 Genel Bakış

Sprint 2'de tamamlanan özellikler:

1. ✅ Partial Import & Error Handling
2. ✅ Sync Status & History
3. ✅ Sync Retry & Error Recovery
4. ✅ Export Dialog İyileştirmeleri

---

## Test 1: Partial Import & Error Handling

### Test 1.1: Başarılı Import (Hata Yok)

**Amaç:** Hatalı kayıt olmadan import işleminin başarılı olması

**Adımlar:**

1. Settings menüsüne git
2. "Import" butonuna tıkla
3. `test-data/normal-import.json` dosyasını seç
4. Import Preview Dialog'da bilgileri kontrol et:
   - Aktivite sayısı doğru mu?
   - Tarih aralığı doğru mu?
   - Çakışma var mı?
5. "Import Et" butonuna tıkla
6. Import Progress Dialog'u gözlemle:
   - Progress bar ilerliyor mu?
   - "Current Item" gösteriliyor mu?
   - Hata var mı?
7. Import tamamlandığında:
   - ✅ Success mesajı görünüyor mu?
   - 📊 Summary gösteriliyor mu?
   - "Kapat" butonu görünüyor mu?
8. "Kapat" butonuna tıkla
9. Sayfa reload oluyor mu?
10. Import edilen aktiviteler görünüyor mu?

**Beklenen Sonuç:**

- ✅ Import başarıyla tamamlanır
- ✅ Summary gösterilir (X aktivite import edildi)
- ✅ Hata yok
- ✅ Sayfa reload olur ve aktiviteler görünür

---

### Test 1.2: Partial Import (Bazı Hatalar Var)

**Amaç:** Hatalı kayıtların atlanıp geçerli kayıtların import edilmesi

**Adımlar:**

1. Settings menüsüne git
2. "Import" butonuna tıkla
3. `test-data/invalid-import.json` dosyasını seç
4. Import Preview Dialog'da bilgileri kontrol et
5. "Import Et" butonuna tıkla
6. Import Progress Dialog'u gözlemle:
   - Progress bar ilerliyor mu?
   - ⚠️ Errors bölümü görünüyor mu?
   - ⚠️ Warnings bölümü görünüyor mu?
   - 📊 Summary gösteriliyor mu?
7. Import tamamlandığında:
   - ⚠️ "Partial Success" mesajı görünüyor mu?
   - Hata listesi görünüyor mu?
   - Summary'de "X import edildi, Y kaldırıldı" bilgisi var mı?
   - "Kapat" butonu görünüyor mu?
8. "Kapat" butonuna tıkla
9. Sayfa reload oluyor mu?
10. Sadece geçerli aktiviteler import edildi mi?

**Beklenen Sonuç:**

- ✅ Geçerli aktiviteler import edilir
- ⚠️ Hatalı aktiviteler atlanır ve hata listesinde gösterilir
- ⚠️ Warnings ayrı gösterilir
- 📊 Summary'de import edilen/kaldırılan sayıları gösterilir
- ✅ Sayfa reload olur ve geçerli aktiviteler görünür

---

### Test 1.3: Import İptal Etme

**Amaç:** Import işlemini iptal edebilme

**Adımlar:**

1. Settings menüsüne git
2. "Import" butonuna tıkla
3. Büyük bir JSON dosyası seç (100+ aktivite)
4. "Import Et" butonuna tıkla
5. Import Progress Dialog açıldığında "İptal" butonuna tıkla
6. Dialog kapanıyor mu?
7. Import işlemi duruyor mu?
8. Veriler değişmedi mi?

**Beklenen Sonuç:**

- ✅ Dialog kapanır
- ✅ Import işlemi durur
- ✅ Veriler değişmez

---

### Test 1.4: Import Preview Detayları

**Amaç:** Import Preview Dialog'da tüm bilgilerin doğru gösterilmesi

**Adımlar:**

1. Settings menüsüne git
2. "Import" butonuna tıkla
3. `test-data/normal-import.json` dosyasını seç
4. Import Preview Dialog'da kontrol et:
   - Toplam aktivite sayısı doğru mu?
   - Tarih aralığı doğru mu?
   - Aktivite tipleri listeleniyor mu?
   - Çakışma uyarısı var mı?
   - Mevcut aktivite sayısı gösteriliyor mu?
5. "İptal" butonuna tıkla
6. Dialog kapanıyor mu?

**Beklenen Sonuç:**

- ✅ Tüm bilgiler doğru gösterilir
- ✅ Çakışma varsa uyarı gösterilir
- ✅ İptal butonu çalışır

---

## Test 2: Sync Status & History

### Test 2.1: Sync History Kaydetme

**Amaç:** Sync işlemlerinin geçmişe kaydedilmesi

**Adımlar:**

1. Google ile giriş yap
2. Settings menüsüne git
3. Cloud Sync bölümünde "🔄 Sync" butonuna tıkla
4. Sync tamamlanana kadar bekle
5. "📊 Geçmiş" butonuna tıkla
6. Sync History Dialog'da kontrol et:
   - Son sync görünüyor mu?
   - Sync durumu (✅ başarılı) gösteriliyor mu?
   - Sync edilen öğe sayısı doğru mu?
   - Sync süresi gösteriliyor mu?
7. Dialog'u kapat
8. Birkaç aktivite ekle
9. Tekrar "🔄 Sync" butonuna tıkla
10. Sync tamamlandıktan sonra "📊 Geçmiş" butonuna tıkla
11. Yeni sync kaydı görünüyor mu?
12. İstatistikler güncellenmiş mi?

**Beklenen Sonuç:**

- ✅ Her sync işlemi geçmişe kaydedilir
- ✅ Sync durumu, öğe sayısı, süre bilgileri doğru gösterilir
- ✅ İstatistikler güncellenir

---

### Test 2.2: Sync History İstatistikleri

**Amaç:** Sync istatistiklerinin doğru hesaplanması

**Adımlar:**

1. Google ile giriş yap
2. Settings menüsüne git
3. "📊 Geçmiş" butonuna tıkla
4. Sync History Dialog'da istatistikleri kontrol et:
   - Toplam Sync sayısı doğru mu?
   - Başarılı sync sayısı doğru mu?
   - Başarısız sync sayısı doğru mu?
   - Ortalama sync süresi gösteriliyor mu?
   - Son sync zamanı gösteriliyor mu?
   - Son başarılı sync zamanı gösteriliyor mu?
5. Dialog'u kapat

**Beklenen Sonuç:**

- ✅ Tüm istatistikler doğru hesaplanır
- ✅ Ortalama süre gösterilir
- ✅ Son sync zamanları gösterilir

---

### Test 2.3: Başarısız Sync Kaydı

**Amaç:** Başarısız sync işlemlerinin geçmişe kaydedilmesi

**Adımlar:**

1. Google ile giriş yap
2. Settings menüsüne git
3. Cloud Sync bölümünde "🔄 Sync" butonuna tıkla
4. Sync tamamlanana kadar bekle (başarılı olmalı)
5. İnternet bağlantısını kes (Chrome DevTools > Network > Offline)
6. Bir aktivite ekle
7. Otomatik sync tetiklenir (bekle)
8. İnternet bağlantısını geri aç
9. "📊 Geçmiş" butonuna tıkla
10. Sync History Dialog'da kontrol et:

- Başarısız sync kaydı görünüyor mu?
- ❌ Durumu gösteriliyor mu?
- Hata mesajı gösteriliyor mu?
- İstatistiklerde "Başarısız" sayısı artmış mı?

**Beklenen Sonuç:**

- ✅ Başarısız sync kaydedilir
- ❌ Durumu ve hata mesajı gösterilir
- ✅ İstatistikler güncellenir

---

### Test 2.4: Sync History Geçmiş Limit

**Amaç:** Sync geçmişinin maksimum 50 kayıtla sınırlandırılması

**Adımlar:**

1. Google ile giriş yap
2. Settings menüsüne git
3. Çok sayıda sync işlemi yap (50+)
   - Aktivite ekle → Sync
   - Aktivite ekle → Sync
   - ... (50+ kez)
4. "📊 Geçmiş" butonuna tıkla
5. Sync History Dialog'da kontrol et:
   - En fazla 20 kayıt gösteriliyor mu? (getRecentSyncs(20))
   - En eski kayıtlar silinmiş mi?

**Beklenen Sonuç:**

- ✅ En fazla 20 kayıt gösterilir (recent syncs)
- ✅ Eski kayıtlar localStorage'da tutulur ama UI'da gösterilmez

---

## Test 3: Sync Retry & Error Recovery

### Test 3.1: Exponential Backoff - İlk Retry

**Amaç:** İlk retry'ın 1 saniye sonra yapılması

**Adımlar:**

1. Google ile giriş yap
2. Settings menüsüne git
3. İnternet bağlantısını kes (Chrome DevTools > Network > Offline)
4. Bir aktivite ekle
5. Console'da kontrol et:
   - "📦 Offline: Adding changes to sync queue..." mesajı görünüyor mu?
   - Queue'ya eklendi mi?
6. İnternet bağlantısını geri aç
7. Console'da kontrol et:
   - Sync denemesi yapılıyor mu?
8. Sync başarısız olursa (örneğin geçici hata):
   - Console'da retry count artıyor mu?
   - `nextRetryAt` tarihi hesaplanıyor mu?
9. 1 saniye bekle
10. Console'da kontrol et:
    - Retry yapılıyor mu?
    - `isReadyForRetry` true dönüyor mu?

**Beklenen Sonuç:**

- ✅ İlk retry 1 saniye sonra yapılır
- ✅ `nextRetryAt` tarihi doğru hesaplanır
- ✅ `isReadyForRetry` doğru çalışır

---

### Test 3.2: Exponential Backoff - Artan Gecikme

**Amaç:** Her retry'da gecikmenin artması

**Adımlar:**

1. Google ile giriş yap
2. Settings menüsüne git
3. İnternet bağlantısını kes
4. Bir aktivite ekle
5. İnternet bağlantısını geri aç
6. Sync başarısız olursa (örneğin geçici hata):
   - Console'da `retryCount` kontrol et
   - `nextRetryAt` tarihini kontrol et
   - Delay hesaplamasını kontrol et:
     - Retry 1: ~1s (1000ms)
     - Retry 2: ~2s (2000ms)
     - Retry 3: ~4s (4000ms)
     - Retry 4: ~8s (8000ms)
     - Retry 5: ~16s (16000ms)
     - Max: 60s (60000ms)

**Beklenen Sonuç:**

- ✅ Her retry'da delay 2x artar
- ✅ Max delay 60 saniye
- ✅ Delay hesaplaması doğru: `min(INITIAL_RETRY_DELAY * 2^retryCount, MAX_RETRY_DELAY)`

---

### Test 3.3: Waiting for Retry Gösterimi

**Amaç:** Exponential backoff nedeniyle bekleyen öğelerin gösterilmesi

**Adımlar:**

1. Google ile giriş yap
2. Settings menüsüne git
3. İnternet bağlantısını kes
4. Bir aktivite ekle
5. İnternet bağlantısını geri aç
6. Sync başarısız olursa
7. Cloud Sync Settings'te kontrol et:
   - ⏳ "X bekliyor" badge'i görünüyor mu?
   - Badge turuncu renkte mi?
   - Tooltip'te "Exponential backoff nedeniyle bekliyor" yazıyor mu?
8. `nextRetryAt` zamanı geldiğinde:
   - Badge kayboluyor mu?
   - Retry yapılıyor mu?

**Beklenen Sonuç:**

- ✅ Waiting for retry badge'i gösterilir
- ✅ Badge turuncu renkte
- ✅ Tooltip açıklayıcı
- ✅ Zaman geldiğinde retry yapılır

---

### Test 3.4: Max Retry Count

**Amaç:** Max retry count (5) aşıldığında öğenin failed olarak işaretlenmesi

**Adımlar:**

1. Google ile giriş yap
2. Settings menüsüne git
3. İnternet bağlantısını kes
4. Bir aktivite ekle
5. İnternet bağlantısını geri aç
6. Sync başarısız olursa (5 kez retry yapılır)
7. Console'da kontrol et:
   - Retry count 5'e ulaştı mı?
   - Öğe "failed" olarak işaretlendi mi?
8. Cloud Sync Settings'te kontrol et:
   - ⚠️ "X başarısız" badge'i görünüyor mu?
   - Badge kırmızı renkte mi?
   - "Retry failed" butonu çalışıyor mu?

**Beklenen Sonuç:**

- ✅ Max retry count (5) aşıldığında öğe failed olur
- ✅ Failed badge'i gösterilir
- ✅ Retry butonu çalışır

---

### Test 3.5: Detaylı Hata Mesajları

**Amaç:** Hata mesajlarının detaylı gösterilmesi

**Adımlar:**

1. Google ile giriş yap
2. Settings menüsüne git
3. İnternet bağlantısını kes
4. Bir aktivite ekle
5. İnternet bağlantısını geri aç
6. Sync başarısız olursa
7. Console'da kontrol et:
   - Error message kaydediliyor mu?
   - Error code kaydediliyor mu?
   - Timestamp kaydediliyor mu?
8. Sync History Dialog'da kontrol et:
   - Hata mesajı gösteriliyor mu?
   - Hata detayları görünüyor mu?

**Beklenen Sonuç:**

- ✅ Error message, code, timestamp kaydedilir
- ✅ Sync History'de hata detayları gösterilir

---

## Test 4: Export Dialog İyileştirmeleri

### Test 4.1: Aktivite Filtresi

**Amaç:** Aktivite tipine göre filtreleme

**Adımlar:**

1. Settings menüsüne git
2. "Export" butonuna tıkla
3. Export Dialog'da:
   - Format seç (CSV, PDF veya JSON)
   - Aktivite Filtresi'nde bir aktivite seç (örn: "Yürüme")
4. Export Preview'da kontrol et:
   - Sadece seçilen aktivite gösteriliyor mu?
   - Aktivite sayısı doğru mu?
   - Toplam puan doğru mu?
5. "Export Et" butonuna tıkla
6. Export edilen dosyayı kontrol et:
   - Sadece seçilen aktivite var mı?
   - Diğer aktiviteler yok mu?

**Beklenen Sonuç:**

- ✅ Sadece seçilen aktivite export edilir
- ✅ Preview doğru gösterilir
- ✅ Export edilen dosya doğru

---

### Test 4.2: Puan Filtresi (Min/Max)

**Amaç:** Min/Max puan filtresine göre filtreleme

**Adımlar:**

1. Settings menüsüne git
2. "Export" butonuna tıkla
3. Export Dialog'da:
   - Format seç
   - Min Puan: 100 gir
   - Max Puan: 1000 gir
4. Export Preview'da kontrol et:
   - Sadece 100-1000 puan arası aktiviteler gösteriliyor mu?
   - Aktivite sayısı doğru mu?
   - Toplam puan doğru mu?
5. "Export Et" butonuna tıkla
6. Export edilen dosyayı kontrol et:
   - Sadece filtrelenmiş aktiviteler var mı?
   - Puan aralığı doğru mu?

**Beklenen Sonuç:**

- ✅ Sadece filtrelenmiş aktiviteler export edilir
- ✅ Preview doğru gösterilir
- ✅ Export edilen dosya doğru

---

### Test 4.3: Kombine Filtreler

**Amaç:** Birden fazla filtrenin birlikte çalışması

**Adımlar:**

1. Settings menüsüne git
2. "Export" butonuna tıkla
3. Export Dialog'da:
   - Format seç
   - Tarih Aralığı: Son 7 gün
   - Aktivite Filtresi: "Yürüme"
   - Min Puan: 50
   - Max Puan: 500
4. Export Preview'da kontrol et:
   - Tüm filtreler uygulanıyor mu?
   - Aktivite sayısı doğru mu?
   - Toplam puan doğru mu?
5. "Export Et" butonuna tıkla
6. Export edilen dosyayı kontrol et:
   - Tüm filtreler uygulanmış mı?

**Beklenen Sonuç:**

- ✅ Tüm filtreler birlikte çalışır
- ✅ Preview doğru gösterilir
- ✅ Export edilen dosya doğru

---

### Test 4.4: Export Preview Detayları

**Amaç:** Export Preview'da detaylı bilgilerin gösterilmesi

**Adımlar:**

1. Settings menüsüne git
2. "Export" butonuna tıkla
3. Export Dialog'da filtreleri ayarla
4. Export Preview bölümünde:
   - "▶" butonuna tıkla (preview'ı genişlet)
5. Preview'da kontrol et:
   - İlk 5 aktivite gösteriliyor mu?
   - Aktivite tarihi gösteriliyor mu?
   - Aktivite adı gösteriliyor mu?
   - Puan gösteriliyor mu?
   - "X aktivite daha" mesajı var mı?
6. "▼" butonuna tıkla (preview'ı daralt)
7. Preview daralıyor mu?

**Beklenen Sonuç:**

- ✅ Preview genişletilebilir/daraltılabilir
- ✅ İlk 5 aktivite gösterilir
- ✅ Detaylı bilgiler gösterilir
- ✅ "X aktivite daha" mesajı gösterilir

---

### Test 4.5: Export Başarı Mesajı

**Amaç:** Export sonrası başarı mesajında aktivite sayısının gösterilmesi

**Adımlar:**

1. Settings menüsüne git
2. "Export" butonuna tıkla
3. Export Dialog'da filtreleri ayarla
4. "Export Et" butonuna tıkla
5. Toast mesajını kontrol et:
   - "X aktivite CSV/PDF/JSON olarak export edildi" mesajı görünüyor mu?
   - Aktivite sayısı doğru mu?
6. Dosya indirildi mi?

**Beklenen Sonuç:**

- ✅ Toast mesajında aktivite sayısı gösterilir
- ✅ Dosya başarıyla indirilir

---

### Test 4.6: Boş Filtre Sonucu

**Amaç:** Filtre sonucu boş olduğunda preview'ın doğru gösterilmesi

**Adımlar:**

1. Settings menüsüne git
2. "Export" butonuna tıkla
3. Export Dialog'da:
   - Min Puan: 999999 gir (çok yüksek)
4. Export Preview'da kontrol et:
   - "0 aktivite export edilecek" mesajı görünüyor mu?
   - Preview boş mu?
5. "Export Et" butonuna tıkla
6. Toast mesajını kontrol et:
   - "0 aktivite export edildi" mesajı görünüyor mu?

**Beklenen Sonuç:**

- ✅ Boş sonuç doğru gösterilir
- ✅ Preview boş
- ✅ Toast mesajı doğru

---

## Test 5: Entegrasyon Testleri

### Test 5.1: Import → Sync → Export Akışı

**Amaç:** Import, sync ve export'un birlikte çalışması

**Adımlar:**

1. Google ile giriş yap
2. Settings menüsüne git
3. "Import" butonuna tıkla
4. `test-data/normal-import.json` dosyasını seç
5. Import işlemini tamamla
6. Sync otomatik olarak tetikleniyor mu?
7. Sync History'de import sonrası sync kaydı var mı?
8. "Export" butonuna tıkla
9. Import edilen aktiviteler export edilebiliyor mu?

**Beklenen Sonuç:**

- ✅ Import → Sync → Export akışı sorunsuz çalışır
- ✅ Sync History'de kayıtlar tutulur

---

### Test 5.2: Offline → Online → Sync → History

**Amaç:** Offline değişikliklerin sync edilip history'ye kaydedilmesi

**Adımlar:**

1. Google ile giriş yap
2. Settings menüsüne git
3. İnternet bağlantısını kes
4. Birkaç aktivite ekle
5. Cloud Sync Settings'te kontrol et:
   - 📦 "X bekleyen" badge'i görünüyor mu?
6. İnternet bağlantısını geri aç
7. Otomatik sync tetikleniyor mu?
8. Sync tamamlandıktan sonra:
   - Sync History'de kayıt var mı?
   - Queue temizlendi mi?

**Beklenen Sonuç:**

- ✅ Offline değişiklikler queue'ya eklenir
- ✅ Online olunca otomatik sync yapılır
- ✅ Sync History'ye kaydedilir

---

## Test 6: Edge Cases ve Hata Senaryoları

### Test 6.1: Çok Büyük Import Dosyası

**Amaç:** Büyük dosyaların import edilebilmesi

**Adımlar:**

1. Settings menüsüne git
2. "Import" butonuna tıkla
3. Çok büyük bir JSON dosyası seç (1000+ aktivite)
4. Import Preview Dialog'da:
   - Dosya parse ediliyor mu?
   - Aktivite sayısı doğru mu?
5. "Import Et" butonuna tıkla
6. Import Progress Dialog'u gözlemle:
   - Progress bar yavaş yavaş ilerliyor mu?
   - "Current Item" güncelleniyor mu?
   - İptal edilebiliyor mu?
7. Import tamamlanıyor mu?

**Beklenen Sonuç:**

- ✅ Büyük dosyalar import edilebilir
- ✅ Progress gösterilir
- ✅ İptal edilebilir

---

### Test 6.2: Geçersiz JSON Formatı

**Amaç:** Geçersiz JSON dosyasının hata vermesi

**Adımlar:**

1. Settings menüsüne git
2. "Import" butonuna tıkla
3. Geçersiz bir JSON dosyası seç (syntax hatası olan)
4. Hata mesajı görünüyor mu?
5. Dialog kapanıyor mu?

**Beklenen Sonuç:**

- ✅ Hata mesajı gösterilir
- ✅ Dialog kapanır
- ✅ Veriler değişmez

---

### Test 6.3: Sync History Temizleme

**Amaç:** Sync History'nin localStorage'dan temizlenmesi (manuel)

**Adımlar:**

1. Google ile giriş yap
2. Birkaç sync işlemi yap
3. Browser Console'da:
   ```javascript
   localStorage.removeItem('sporttrack_sync_history');
   ```
4. Sayfayı yenile
5. "📊 Geçmiş" butonuna tıkla
6. Sync History Dialog'da:
   - "Henüz sync geçmişi yok" mesajı görünüyor mu?
   - İstatistikler sıfırlanmış mı?

**Beklenen Sonuç:**

- ✅ History temizlenir
- ✅ "Henüz sync geçmişi yok" mesajı gösterilir

---

### Test 6.4: Export Filtrelerinin Sıfırlanması

**Amaç:** Export Dialog kapatılıp açıldığında filtrelerin sıfırlanması

**Adımlar:**

1. Settings menüsüne git
2. "Export" butonuna tıkla
3. Filtreleri ayarla:
   - Aktivite: "Yürüme"
   - Min Puan: 100
   - Max Puan: 500
4. Dialog'u kapat
5. Tekrar "Export" butonuna tıkla
6. Filtreler sıfırlanmış mı?
   - Aktivite: "Tüm Aktiviteler"
   - Min/Max Puan: Boş

**Beklenen Sonuç:**

- ✅ Dialog kapatılıp açıldığında filtreler sıfırlanır

---

## Test 7: Performans Testleri

### Test 7.1: Import Performansı

**Amaç:** Büyük dosyaların import performansı

**Adımlar:**

1. Settings menüsüne git
2. "Import" butonuna tıkla
3. Büyük bir JSON dosyası seç (500+ aktivite)
4. Import işlemini başlat
5. Browser DevTools > Performance sekmesinde:
   - Import süresini ölç
   - Memory kullanımını kontrol et
   - UI donuyor mu?
6. Import tamamlanıyor mu?

**Beklenen Sonuç:**

- ✅ Import performansı kabul edilebilir (< 5 saniye 500 aktivite için)
- ✅ UI donmuyor
- ✅ Memory kullanımı makul

---

### Test 7.2: Sync History Performansı

**Amaç:** Çok sayıda sync kaydının performansı

**Adımlar:**

1. Google ile giriş yap
2. Çok sayıda sync işlemi yap (50+)
3. "📊 Geçmiş" butonuna tıkla
4. Sync History Dialog açılıyor mu?
5. Dialog yavaş mı?
6. Scroll performansı nasıl?

**Beklenen Sonuç:**

- ✅ Dialog hızlı açılır
- ✅ Scroll performansı iyi
- ✅ 20 kayıt gösterilir (recent syncs)

---

## Test 8: Mobil Uyumluluk

### Test 8.1: Import Progress Dialog (Mobil)

**Amaç:** Mobil cihazlarda Import Progress Dialog'un düzgün görünmesi

**Adımlar:**

1. Mobil cihazda veya Chrome DevTools > Mobile View'da test et
2. Settings menüsüne git
3. "Import" butonuna tıkla
4. Bir JSON dosyası seç
5. Import işlemini başlat
6. Import Progress Dialog'da kontrol et:
   - Dialog tam ekran mı?
   - Progress bar görünüyor mu?
   - Text'ler okunabilir mi?
   - Butonlar tıklanabilir mi?

**Beklenen Sonuç:**

- ✅ Dialog mobilde düzgün görünür
- ✅ Tüm öğeler erişilebilir

---

### Test 8.2: Export Dialog (Mobil)

**Amaç:** Mobil cihazlarda Export Dialog'un düzgün görünmesi

**Adımlar:**

1. Mobil cihazda veya Chrome DevTools > Mobile View'da test et
2. Settings menüsüne git
3. "Export" butonuna tıkla
4. Export Dialog'da kontrol et:
   - Dialog tam ekran mı?
   - Filtreler görünüyor mu?
   - Preview görünüyor mu?
   - Butonlar tıklanabilir mi?

**Beklenen Sonuç:**

- ✅ Dialog mobilde düzgün görünür
- ✅ Tüm öğeler erişilebilir

---

### Test 8.3: Sync History Dialog (Mobil)

**Amaç:** Mobil cihazlarda Sync History Dialog'un düzgün görünmesi

**Adımlar:**

1. Mobil cihazda veya Chrome DevTools > Mobile View'da test et
2. Google ile giriş yap
3. Settings menüsüne git
4. "📊 Geçmiş" butonuna tıkla
5. Sync History Dialog'da kontrol et:
   - Dialog tam ekran mı?
   - İstatistikler görünüyor mu?
   - Sync listesi scroll edilebiliyor mu?
   - Butonlar tıklanabilir mi?

**Beklenen Sonuç:**

- ✅ Dialog mobilde düzgün görünür
- ✅ Tüm öğeler erişilebilir

---

## Test 9: Accessibility (Erişilebilirlik)

### Test 9.1: Keyboard Navigation

**Amaç:** Klavye ile tüm özelliklere erişilebilmesi

**Adımlar:**

1. Tab tuşu ile Export Dialog'a git
2. Tüm filtreleri Tab ile geç
3. Preview'ı Tab ile aç/kapat
4. Export butonuna Enter ile tıkla
5. Import Dialog'da da aynı testi yap
6. Sync History Dialog'da da aynı testi yap

**Beklenen Sonuç:**

- ✅ Tüm öğelere klavye ile erişilebilir
- ✅ Focus görünür
- ✅ Enter/Space ile etkileşim yapılabilir

---

### Test 9.2: Screen Reader Desteği

**Amaç:** Screen reader'ların tüm bilgileri okuyabilmesi

**Adımlar:**

1. Screen reader'ı aç (VoiceOver, NVDA, vb.)
2. Export Dialog'u aç
3. Screen reader tüm bilgileri okuyor mu?
4. Import Progress Dialog'u aç
5. Screen reader progress bilgisini okuyor mu?
6. Sync History Dialog'u aç
7. Screen reader istatistikleri okuyor mu?

**Beklenen Sonuç:**

- ✅ Screen reader tüm bilgileri okur
- ✅ ARIA labels doğru

---

## Test 10: Çoklu Dil Desteği

### Test 10.1: Türkçe Dil Desteği

**Amaç:** Tüm özelliklerin Türkçe'de çalışması

**Adımlar:**

1. Dil ayarını Türkçe yap
2. Tüm testleri Türkçe'de tekrar et:
   - Import Dialog mesajları Türkçe mi?
   - Export Dialog mesajları Türkçe mi?
   - Sync History mesajları Türkçe mi?
   - Toast mesajları Türkçe mi?

**Beklenen Sonuç:**

- ✅ Tüm mesajlar Türkçe

---

### Test 10.2: İngilizce Dil Desteği

**Amaç:** Tüm özelliklerin İngilizce'de çalışması

**Adımlar:**

1. Dil ayarını İngilizce yap
2. Tüm testleri İngilizce'de tekrar et:
   - Import Dialog mesajları İngilizce mi?
   - Export Dialog mesajları İngilizce mi?
   - Sync History mesajları İngilizce mi?
   - Toast mesajları İngilizce mi?

**Beklenen Sonuç:**

- ✅ Tüm mesajlar İngilizce

---

## 📊 Test Sonuçları Takibi

Her test için:

- ✅ Başarılı
- ❌ Başarısız
- ⚠️ Kısmen Başarılı
- ⏭️ Atlanmış

**Notlar:**

- Test sırasında bulunan hataları not al
- Screenshot'lar al (özellikle hata durumlarında)
- Console log'larını kontrol et
- Network tab'ını kontrol et (sync işlemleri için)

---

## 🐛 Bilinen Sorunlar

Test sırasında bulunan sorunları buraya ekle:

- [ ] Sorun 1: ...
- [ ] Sorun 2: ...

---

## ✅ Test Tamamlama Checklist

- [ ] Test 1: Partial Import & Error Handling
- [ ] Test 2: Sync Status & History
- [ ] Test 3: Sync Retry & Error Recovery
- [ ] Test 4: Export Dialog İyileştirmeleri
- [ ] Test 5: Entegrasyon Testleri
- [ ] Test 6: Edge Cases ve Hata Senaryoları
- [ ] Test 7: Performans Testleri
- [ ] Test 8: Mobil Uyumluluk
- [ ] Test 9: Accessibility
- [ ] Test 10: Çoklu Dil Desteği

---

**Test Tarihi:** ******\_\_\_******
**Test Edilen Versiyon:** v0.18.17+
**Test Eden:** ******\_\_\_******

# Sync Debug Kılavuzu

## 🔍 Sorun Tespiti

Sync sorunlarını debug etmek için console'da şu komutları kullanabilirsiniz:

### 1. Sync Durumunu Kontrol Et

```javascript
syncDebug.checkStatus();
```

Bu komut şunları gösterir:

- Kullanıcı ID'si
- Firebase yapılandırması
- Initial sync durumu
- Conflict durumu
- Son sync zamanı

### 2. Sync Geçmişini Görüntüle

```javascript
syncDebug.getSyncHistory();
```

### 3. Flag'leri Temizle (Debug İçin)

```javascript
syncDebug.resetFlags();
```

⚠️ **Dikkat**: Bu tüm sync flag'lerini temizler. Sayfayı yenilemeniz gerekir.

### 4. Initial Sync'i Zorla Tamamla

```javascript
syncDebug.forceInitialSyncComplete();
```

Eğer initial sync flag'i set edilmemişse, bu komutla manuel olarak set edebilirsiniz.

## 📊 Console Log'ları

Sync işlemleri sırasında console'da şu log'ları göreceksiniz:

### Auto-Sync Log'ları

- `📊 Auto-sync durumu:` - Sync durumu kontrolü
- `🔄 Değişiklik tespit edildi:` - Veri değişikliği algılandı
- `🚀 Auto-sync başlatılıyor...` - Sync başladı
- `✅ Auto-sync başarılı!` - Sync tamamlandı
- `❌ Auto-sync failed:` - Sync başarısız
- `⏭️ Auto-sync skipped:` - Sync atlandı (neden gösterilir)

### Upload Log'ları

- `📤 Starting upload...` - Upload başladı
- `📤 Uploading full data:` - Veri detayları
- `✅ Successfully uploaded to cloud!` - Upload başarılı
- `🔄 Resetting isUploading flag` - Flag reset edildi

### Listener Log'ları

- `👂 Subscribing to cloud changes` - Listener başlatıldı
- `📥 Cloud snapshot received` - Cloud'dan değişiklik geldi
- `⏭️ Ignoring snapshot` - Snapshot ignore edildi (neden gösterilir)
- `⏱️ Fallback: Marking initial sync as complete` - Fallback timeout tetiklendi

## 🐛 Yaygın Sorunlar ve Çözümleri

### Sorun 1: "Initial sync not complete"

**Belirtiler:**

```
⏭️ Auto-sync skipped: Initial sync not complete
```

**Çözüm:**

1. Console'da `syncDebug.checkStatus()` çalıştırın
2. Eğer `initialSyncComplete: false` ise:
   - `syncDebug.forceInitialSyncComplete()` çalıştırın
   - Veya sayfayı yenileyin ve listener'ın tetiklenmesini bekleyin

### Sorun 2: "Pending conflict resolution"

**Belirtiler:**

```
⏭️ Auto-sync skipped: Pending conflict resolution
```

**Çözüm:**

1. Conflict resolution dialog'unu tamamlayın
2. Veya `syncDebug.resetFlags()` ile flag'leri temizleyin

### Sorun 3: Sync tetiklenmiyor

**Belirtiler:**

- Değişiklik yapıyorsunuz ama sync başlamıyor

**Kontrol Listesi:**

1. `syncDebug.checkStatus()` ile durumu kontrol edin
2. Console'da `📊 Auto-sync durumu:` log'unu kontrol edin
3. `🔄 Değişiklik tespit edildi:` log'unu görüyor musunuz?
4. Throttle nedeniyle bekliyor olabilir (`⏱️ Throttle:` log'una bakın)

### Sorun 4: Upload başarısız

**Belirtiler:**

```
❌ Auto-sync failed: [error message]
```

**Kontrol Listesi:**

1. Error detaylarını console'da kontrol edin
2. Firebase authentication durumunu kontrol edin
3. Firestore security rules'ı kontrol edin
4. Network bağlantısını kontrol edin

## 🔧 Debug Adımları

### Adım 1: Durum Kontrolü

```javascript
// Sync durumunu kontrol et
syncDebug.checkStatus();

// Beklenen çıktı:
// ✅ userId: "user123"
// ✅ isConfigured: true
// ✅ initialSyncComplete: true
// ✅ hasConflict: false
```

### Adım 2: Log'ları İzle

Console'u açık tutun ve bir aktivite ekleyin. Şu log'ları görmelisiniz:

1. `📊 Auto-sync durumu:` - Durum kontrolü
2. `🔄 Değişiklik tespit edildi:` - Değişiklik algılandı
3. `🚀 Auto-sync başlatılıyor...` - Sync başladı
4. `📤 Starting upload...` - Upload başladı
5. `✅ Successfully uploaded to cloud!` - Başarılı

### Adım 3: Sorun Tespiti

Eğer log'lar görünmüyorsa:

1. **Initial sync tamamlanmamış:**

   ```javascript
   syncDebug.forceInitialSyncComplete();
   ```

2. **Conflict var:**

   ```javascript
   syncDebug.resetFlags();
   // Sayfayı yenileyin
   ```

3. **Throttle nedeniyle bekliyor:**
   - 10 saniye bekleyin veya sayfayı yenileyin

## 📝 Örnek Debug Senaryosu

```javascript
// 1. Durumu kontrol et
syncDebug.checkStatus();

// 2. Bir aktivite ekle ve log'ları izle
// Console'da şunları görmelisiniz:
// - 📊 Auto-sync durumu
// - 🔄 Değişiklik tespit edildi
// - 🚀 Auto-sync başlatılıyor
// - 📤 Starting upload
// - ✅ Successfully uploaded

// 3. Eğer sync başlamıyorsa:
syncDebug.forceInitialSyncComplete();

// 4. Tekrar dene
```

## 💡 İpuçları

1. **Console'u açık tutun**: Tüm sync işlemleri console'da log'lanır
2. **Network tab'ını kontrol edin**: Firebase isteklerini görebilirsiniz
3. **Firebase Console'u kontrol edin**: Verilerin gerçekten yazıldığını doğrulayın
4. **Sayfayı yenileyin**: Bazen flag'ler düzgün set edilmemiş olabilir

## 🆘 Hala Çalışmıyor mu?

1. `syncDebug.resetFlags()` çalıştırın
2. Sayfayı yenileyin
3. Giriş yapın
4. Bir aktivite ekleyin
5. Console log'larını kontrol edin

Eğer hala sorun varsa, console log'larını paylaşın!

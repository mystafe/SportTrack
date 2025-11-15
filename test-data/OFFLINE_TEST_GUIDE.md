# Offline Sync Queue Test Rehberi

## ⚠️ ÖNEMLİ UYARI

Offline modda sayfa yenilendiğinde veya yeni bir sayfaya gidildiğinde Chrome'un "No internet" sayfası görünebilir. Bu **normal bir davranıştır** çünkü Next.js Server-Side Rendering (SSR) kullanıyor ve server'dan veri çekmeye çalışıyor.

## ✅ Doğru Test Adımları

### Test 4.1: Offline Activity Add

1. **Sayfayı Önce Yükle:**
   - Uygulamayı aç (`localhost:3000`)
   - Ana sayfanın tamamen yüklendiğinden emin ol
   - Activities sayfasına git ve yüklendiğinden emin ol

2. **DevTools'u Aç:**
   - F12 tuşuna bas veya sağ tık → "Inspect"
   - Network tab'ına git

3. **Offline Modu Aktif Et:**
   - Network tab'ında "Offline" checkbox'ını işaretle
   - **ÖNEMLİ:** Bu noktadan sonra sayfa yenileme veya yeni sayfaya gitme!

4. **Aktivite Ekle:**
   - Ana sayfadan veya mevcut sayfadan bir aktivite ekle
   - Örnek: Yürüyüş, 5000 adım

5. **Console'u Kontrol Et:**
   - Console tab'ına git (F12 → Console)
   - Şu mesajları görmeli:
     - `📦 Offline: Adding changes to sync queue...`
     - `✅ Offline: X items queued for sync`

6. **Settings'i Kontrol Et:**
   - Profil butonuna tıkla
   - Cloud Sync bölümüne git
   - "X bekleyen" mesajı gösterilmeli

7. **Online Yap:**
   - Network tab'ında "Offline" checkbox'ını kaldır
   - Console'da otomatik sync başlamalı
   - Queue temizlenmeli

## ❌ Yapılmaması Gerekenler

- ❌ Offline modu aktif ettikten sonra sayfa yenileme
- ❌ Offline modda yeni sayfaya gitme (örneğin `/add` sayfasına gitme)
- ❌ Offline modda browser'ı kapatıp açma

## 🔍 Sorun Giderme

### "No internet" Sayfası Görünüyor

**Sorun:** Offline modda sayfa yenilendiğinde veya yeni sayfaya gidildiğinde Chrome'un "No internet" sayfası görünüyor.

**Çözüm:**

- Bu normal bir davranıştır
- Test için offline modu aktif etmeden önce sayfanın tamamen yüklendiğinden emin olun
- Offline modda sayfa yenilemeyin veya yeni sayfaya gitmeyin

### Aktivite Eklenmiyor

**Sorun:** Offline modda aktivite eklenmiyor.

**Kontrol Et:**

- Console'da hata var mı?
- Network tab'ında gerçekten offline mod aktif mi?
- Sayfa tamamen yüklendi mi?

### Queue'ya Eklenmiyor

**Sorun:** Aktivite ekleniyor ama queue'ya eklenmiyor.

**Kontrol Et:**

- Console'da `📦 Offline: Adding changes to sync queue...` mesajı görünüyor mu?
- `localStorage` içinde `sporttrack_sync_queue` key'i var mı? (Application tab → Local Storage)

### Online Olduğunda Sync Başlamıyor

**Sorun:** Online yaptıktan sonra otomatik sync başlamıyor.

**Kontrol Et:**

- Console'da `🚀 Starting debounced sync...` mesajı görünüyor mu?
- `useSyncQueue` hook'u çalışıyor mu?
- `useAutoSync` hook'u çalışıyor mu?

## 📝 Test Checklist

- [ ] Sayfa tamamen yüklendi
- [ ] Offline mod aktif edildi
- [ ] Aktivite eklendi
- [ ] Console'da queue mesajları görünüyor
- [ ] Settings'te "X bekleyen" mesajı gösteriliyor
- [ ] Online yapıldı
- [ ] Otomatik sync başladı
- [ ] Queue temizlendi

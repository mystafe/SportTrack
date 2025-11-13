# SportTrack

Günlük spor aktivitelerini ön tanımlı çarpanlar ile puanlayıp, günlük puan hedefine ne kadar yaklaştığını gösteren hafif bir Next.js uygulaması.

## Teknolojiler
- Next.js 14 (App Router)
- React 18 & TypeScript
- Tailwind CSS
- LocalStorage (client-side data persistence)
- date-fns
- Recharts (grafik görselleştirme)
- jsPDF & jsPDF-autotable (PDF export)
- next-pwa (PWA desteği)

## Kurulum
1. Bağımlılıkları yükle:
   ```bash
   npm install
   ```
2. Geliştirme sunucusunu çalıştır:
   ```bash
   npm run dev
   ```
   Ardından `http://localhost:3000` adresini aç.

## Aktivite Çarpanları
| Aktivite            | Çarpan | Varsayılan Miktar | Birim    | Açıklama                          |
|---------------------|--------|-------------------|----------|-----------------------------------|
| Yürüme              | 1      | 1000              | adım     | Adım sayınızı girin               |
| Koşma               | 2      | 500               | adım     | Koşu adım sayınızı girin          |
| Yüzme               | 5      | 20                | dakika   | Yüzme süresini dakika olarak girin|
| Şınav               | 20     | 20                | tekrar   | Tamamlanan şınav tekrar sayısı    |
| Mekik               | 10     | 20                | tekrar   | Tamamlanan mekik tekrar sayısı    |
| Ağırlık Çalışması   | 15     | 30                | dakika   | Toplam süreyi dakika olarak girin |
| Merdiven Çıkma      | 20     | 50                | basamak  | Çıktığınız toplam basamak sayısı  |

## Özellikler

### Temel Özellikler
- ✅ Aktivite kayıt formu (tarih & saat, miktar, opsiyonel not, süre takibi)
- ✅ Her aktivite için otomatik puan hesabı
- ✅ Özelleştirilebilir günlük puan hedefi (varsayılan: 10.000)
- ✅ İlerleme çubuğu ve hedef tamamlama animasyonları
- ✅ Bugünkü aktivite dağılımı
- ✅ Son 7 güne ait puan dökümü
- ✅ Hedefi tutturan gün serisi hesabı
- ✅ Detaylı istatistikler sayfası (günlük breakdown, aktivite analizi)
- ✅ Özel aktivite ekleme ve yönetimi
- ✅ Çoklu dil desteği (Türkçe/İngilizce)
- ✅ Dark mode desteği
- ✅ Tam responsive tasarım (mobil uyumlu)
- ✅ Erişilebilirlik özellikleri (ARIA labels, klavye navigasyonu)

### Gelişmiş İstatistikler ve Görselleştirme
- ✅ Trend grafikleri (7, 30, 90 günlük)
- ✅ Aktivite karşılaştırma grafikleri (bar chart)
- ✅ Aktivite dağılım grafikleri (pie chart)
- ✅ Aktivite heatmap (GitHub tarzı)
- ✅ Kişisel rekorlar (en iyi gün, en uzun seri, en hızlı hedef tamamlama)
- ✅ Zaman analizi (en aktif saatler ve günler)
- ✅ Aktivite bazında rekorlar

### Veri Yönetimi
- ✅ Veri dışa/içe aktarma (JSON)
- ✅ CSV export (Excel uyumlu)
- ✅ PDF raporlar (aylık/yıllık özet)
- ✅ Apple Health CSV import desteği
- ✅ Ruh hali (mood) export/import desteği

### Gamification ve Motivasyon
- ✅ Rozetler ve başarımlar sistemi (17 farklı rozet)
- ✅ Seviye sistemi (1-50+ seviyeler, XP tabanlı)
- ✅ Zorluklar ve Hedefler (günlük, haftalık, aylık, özel)
- ✅ Ruh hali seçimi ve motivasyonel mesajlar
- ✅ Motivasyonel alıntılar (40+ alıntı)

### Aktivite Özellikleri
- ✅ Aktivite şablonları (hızlı kombinasyonlar)
- ✅ Hızlı aktivite ekleme (en çok kullanılan aktiviteler)
- ✅ Aktivite filtreleme (tarih, kategori, arama, sıralama)
- ✅ Aktivite süresi takibi (gerçek zamanlı timer)
- ✅ Aktivite kategorileri (kardiyo, güç, esneklik, spor, diğer)

### Bildirimler
- ✅ Push bildirimleri desteği
- ✅ Günlük hatırlatıcılar
- ✅ Hedef tamamlama bildirimleri
- ✅ Seri koruma uyarıları
- ✅ Rozet kazanma bildirimleri
- ✅ Seviye atlama bildirimleri
- ✅ Zorluk tamamlama bildirimleri

### PWA (Progressive Web App)
- ✅ Service Worker implementasyonu
- ✅ Offline çalışma desteği
- ✅ Ana ekrana ekleme (Add to Home Screen)
- ✅ App-like deneyim
- ✅ Push notification desteği

### Kullanıcı Deneyimi
- ✅ Loading states (skeleton loaders)
- ✅ Özel confirmation dialogs
- ✅ Toast bildirimleri
- ✅ Animasyonlar (toasts, dialogs, progress bars, cards, buttons)
- ✅ Hedef tamamlama animasyonları (confetti, pulse, shimmer)
- ✅ Error handling (storage quota, parse errors)
- ✅ Performance optimizasyonları (localStorage debouncing)

## Geliştirme Notları
- Yeni aktivite türleri eklemek için `src/lib/activityConfig.ts` içindeki `BASE_ACTIVITY_DEFINITIONS` listesine ekleme yapabilirsiniz.
- Veriler tarayıcının localStorage'ında saklanır.
- Aktivite özelleştirme için Settings > Manage Activities menüsünü kullanabilirsiniz.


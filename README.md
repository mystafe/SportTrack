# SportTrack

Günlük spor aktivitelerini ön tanımlı çarpanlar ile puanlayıp, günlük puan hedefine ne kadar yaklaştığını gösteren hafif bir Next.js uygulaması.

## Teknolojiler
- Next.js 14 (App Router)
- React 18 & TypeScript
- Tailwind CSS
- LocalStorage (client-side data persistence)
- date-fns

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
| Ağırlık Çalışması   | 1      | 30                | dakika   | Toplam süreyi dakika olarak girin |
| Merdiven Çıkma      | 20     | 50                | basamak  | Çıktığınız toplam basamak sayısı  |

## Özellikler
- ✅ Aktivite kayıt formu (tarih & saat, miktar, opsiyonel not)
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
- ✅ Veri dışa/içe aktarma (JSON)
- ✅ Tam responsive tasarım (mobil uyumlu)
- ✅ Erişilebilirlik özellikleri (ARIA labels, klavye navigasyonu)

## Geliştirme Notları
- Yeni aktivite türleri eklemek için `src/lib/activityConfig.ts` içindeki `BASE_ACTIVITY_DEFINITIONS` listesine ekleme yapabilirsiniz.
- Veriler tarayıcının localStorage'ında saklanır.
- Aktivite özelleştirme için Settings > Manage Activities menüsünü kullanabilirsiniz.


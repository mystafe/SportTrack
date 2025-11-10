# SportTrack

Günlük spor aktivitelerini ön tanımlı çarpanlar ile puanlayıp, 10.000 puanlık hedefe ne kadar yaklaştığını gösteren hafif bir Next.js uygulaması.

## Teknolojiler
- Next.js 14 (App Router)
- React 18 & TypeScript
- Tailwind CSS
- Prisma ORM (SQLite)
- date-fns

## Kurulum
1. Bağımlılıkları yükle:
   ```bash
   npm install
   ```
2. Ortam değişkenini tanımla (örnek `.env` içeriği):
   ```bash
   echo 'DATABASE_URL="file:./prisma/dev.db"' > .env
   ```
3. Veritabanını şemayla eşitle:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Geliştirme sunucusunu çalıştır:
   ```bash
   npm run dev
   ```
   Ardından `http://localhost:3000` adresini aç.

## Aktivite Çarpanları
| Aktivite            | Çarpan | Varsayılan Birim | Açıklama                          |
|---------------------|--------|------------------|-----------------------------------|
| Yürüme              | 1      | adım             | Adım sayısı                       |
| Merdiven çıkma      | 20     | basamak          | Toplam basamak sayısı             |
| Mekik               | 10     | tekrar           | Tamamlanan tekrar sayısı          |
| Şınav               | 20     | tekrar           | Tamamlanan tekrar sayısı          |
| Ağırlık çalışması   | 1      | dakika           | Ağırlıkla geçen süre              |

## Özellikler
- Aktivite kayıt formu (tarih & saat, miktar, opsiyonel not)
- Her aktivite için otomatik puan hesabı
- Günlük 10.000 puan hedefi için ilerleme çubuğu
- Bugünkü aktivite dağılımı
- Son 7 güne ait puan dökümü
- Hedefi tutturan gün serisi hesabı

## Geliştirme Notları
- `prisma/schema.prisma` dosyasında aktivite modeli tanımlıdır. Yeni aktivite türleri eklemek için `src/lib/activityConfig.ts` içindeki listede değişiklik yapman yeterli.
- Varsayılan olarak SQLite kullanılır; farklı bir veritabanı için `DATABASE_URL` değişkenini güncelle.


# Vercel Deploy Rehberi

Bu dosya SportTrack uygulamasını Vercel'e deploy etmek için adım adım talimatlar içerir.

## Ön Gereksinimler

1. Vercel hesabı ([vercel.com](https://vercel.com) üzerinden ücretsiz oluşturabilirsiniz)
2. GitHub, GitLab veya Bitbucket hesabı (kodunuzun bir Git repository'sinde olması gerekir)
3. Firebase projesi ve yapılandırması (Cloud Sync için)

## Deploy Yöntemleri

### Yöntem 1: Vercel Dashboard (Önerilen - En Kolay)

#### 1. Projeyi Vercel'e İmport Edin

1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. **"Add New..."** > **"Project"** butonuna tıklayın
3. Git repository'nizi seçin (GitHub, GitLab veya Bitbucket)
4. Repository'yi import edin

#### 2. Proje Ayarlarını Yapılandırın

Vercel otomatik olarak Next.js'i algılar, ancak şunları kontrol edin:

- **Framework Preset**: `Next.js` (otomatik algılanır)
- **Root Directory**: `.` (proje root'u)
- **Build Command**: `npm run build` (varsayılan)
- **Output Directory**: `.next` (varsayılan)
- **Install Command**: `npm install` (varsayılan)

#### 3. Environment Variables Ekleyin

**ÖNEMLİ:** Environment variables'ları eklemeden deploy etmeyin!

Vercel Dashboard'da proje ayarlarına gidin ve şu environment variables'ları ekleyin:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sporttrack-c3b18.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sporttrack-c3b18
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sporttrack-c3b18.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=816124129314
NEXT_PUBLIC_FIREBASE_APP_ID=1:816124129314:web:ab408fc33d4927f04dda7b
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-NCF59DNNEF
```

**Nasıl Eklenir:**

1. Proje ayarlarına gidin
2. **"Environment Variables"** sekmesine tıklayın
3. Her bir variable için:
   - **Name**: Variable adı (yukarıdaki listeden)
   - **Value**: Değeri (`.env.local` dosyanızdan)
   - **Environment**: `Production`, `Preview`, ve `Development` seçin (hepsini seçin)
4. **"Save"** butonuna tıklayın

#### 4. Deploy Edin

1. **"Deploy"** butonuna tıklayın
2. Vercel build işlemini başlatacak
3. Build tamamlandıktan sonra uygulamanız canlı olacak

#### 5. Custom Domain (Opsiyonel)

1. Proje ayarlarına gidin
2. **"Domains"** sekmesine tıklayın
3. Domain'inizi ekleyin
4. DNS kayıtlarını yapılandırın (Vercel size talimat verecek)

---

### Yöntem 2: Vercel CLI (Terminal)

#### 1. Vercel CLI'yi Kurun

```bash
npm install -g vercel
```

#### 2. Vercel'e Giriş Yapın

```bash
vercel login
```

Bu komut tarayıcınızı açacak ve Vercel hesabınıza giriş yapmanızı isteyecek.

#### 3. Projeyi Deploy Edin

```bash
vercel
```

İlk deploy için Vercel size birkaç soru soracak:

- **Set up and deploy?** → `Y`
- **Which scope?** → Vercel hesabınızı seçin
- **Link to existing project?** → `N` (ilk kez deploy ediyorsanız)
- **Project name?** → `sporttrack` (veya istediğiniz isim)
- **Directory?** → `./` (proje root'u)
- **Override settings?** → `N` (varsayılan ayarları kullan)

#### 4. Environment Variables Ekleyin

CLI ile environment variables eklemek için:

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

Her komut için değeri girmeniz istenecek. `.env.local` dosyanızdaki değerleri kullanın.

**Veya toplu olarak:**

`.env.local` dosyanızdaki değerleri kullanarak:

```bash
vercel env pull .env.vercel
```

Sonra `.env.vercel` dosyasını düzenleyip:

```bash
vercel env push
```

#### 5. Production Deploy

```bash
vercel --prod
```

---

## Environment Variables Listesi

Vercel'de ayarlamanız gereken tüm environment variables:

| Variable Name                              | Açıklama                          | Örnek Değer                                 |
| ------------------------------------------ | --------------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Firebase API Key                  | `AIzaSyCcTFviw8VTA1eVaYpxyIktcwKGQHJkfMU`   |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Firebase Auth Domain              | `sporttrack-c3b18.firebaseapp.com`          |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Firebase Project ID               | `sporttrack-c3b18`                          |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Firebase Storage Bucket           | `sporttrack-c3b18.firebasestorage.app`      |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID      | `816124129314`                              |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Firebase App ID                   | `1:816124129314:web:ab408fc33d4927f04dda7b` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`      | Firebase Analytics Measurement ID | `G-NCF59DNNEF`                              |

**Önemli Notlar:**

- `NEXT_PUBLIC_` prefix'i olan variables client-side'da kullanılabilir
- Bu variables'lar build zamanında bundle'a dahil edilir
- Production, Preview ve Development environment'ları için ayrı ayrı ayarlayabilirsiniz

**⚠️ Vercel Uyarıları Hakkında:**

Vercel, `NEXT_PUBLIC_` prefix'li ve `AUTH` içeren environment variables için uyarı gösterebilir:

```
This key, which is prefixed with NEXT_PUBLIC_ and includes the term AUTH,
might expose sensitive information to the browser. Verify it is safe to share publicly.
```

**✅ Bu uyarıları YOK SAYABİLİRSİNİZ** çünkü:

1. **Firebase API Key'ler Public'tir**: Firebase API Key'ler zaten browser'da kullanılmak üzere tasarlanmıştır. Firebase'in güvenlik modeli API Key'lerin public olmasına dayanır.

2. **Güvenlik API Key'den Değil**: Firebase'in güvenliği şu mekanizmalardan gelir:
   - **Firebase Security Rules**: Firestore ve Storage için erişim kontrolü
   - **Firebase App Check**: Bot ve kötüye kullanım koruması
   - **Firebase Authentication**: Kullanıcı kimlik doğrulama
   - **API Key Restrictions**: Firebase Console'da domain/IP kısıtlamaları

3. **Best Practice**: Firebase dokümantasyonu da API Key'lerin client-side'da kullanılmasını önerir. Bu, Firebase'in normal kullanım şeklidir.

4. **Auth Domain**: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` sadece Firebase Authentication servisinin domain'idir ve public bilgidir.

**Sonuç**: Bu uyarıları görmezden gelebilir ve environment variables'ları eklemeye devam edebilirsiniz. Firebase'in güvenlik modeli bu şekilde çalışır.

---

## Firebase Authorized Domains

Vercel deploy sonrası Firebase Authentication için domain eklemeniz gerekir:

1. [Firebase Console](https://console.firebase.google.com/) > Authentication > Settings
2. **"Authorized domains"** bölümüne gidin
3. Vercel'in size verdiği domain'i ekleyin (örneğin: `sporttrack.vercel.app`)
4. Custom domain kullanıyorsanız onu da ekleyin

---

## Otomatik Deploy (Git Integration)

Vercel, Git repository'nize bağlandığında otomatik deploy yapar:

- **Main/Master branch'e push** → Production deploy
- **Diğer branch'lere push** → Preview deploy
- **Pull Request açma** → Preview deploy

Her deploy için:

- Build otomatik başlar
- Environment variables otomatik kullanılır
- Deploy URL'i otomatik oluşturulur

---

## Build Ayarları

Vercel otomatik olarak Next.js'i algılar ve şu ayarları kullanır:

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: Otomatik algılanır (18.x veya 20.x)

`vercel.json` dosyası ile bu ayarları özelleştirebilirsiniz.

---

## Sorun Giderme

### Build Hatası

1. **Environment Variables Kontrolü**: Tüm Firebase variables'ların ekli olduğundan emin olun
2. **Node Version**: Vercel Dashboard'da Node.js versiyonunu kontrol edin (18.x veya 20.x önerilir)
3. **Build Logs**: Vercel Dashboard > Deployments > Build logs'u kontrol edin

### Firebase Authentication Hatası

1. **Authorized Domains**: Firebase Console'da Vercel domain'inizi eklediğinizden emin olun
2. **Environment Variables**: Firebase config variables'larının doğru olduğundan emin olun

### PWA Çalışmıyor

1. **Service Worker**: `vercel.json` dosyasında service worker headers'larının olduğundan emin olun
2. **HTTPS**: Vercel otomatik HTTPS sağlar, ancak custom domain kullanıyorsanız SSL sertifikasını kontrol edin

---

## Deploy Sonrası

Deploy başarılı olduktan sonra:

1. **Production URL**: `https://sporttrack.vercel.app` (veya custom domain)
2. **Preview URLs**: Her branch/PR için otomatik preview URL'leri oluşturulur
3. **Analytics**: Vercel Analytics'i aktifleştirebilirsiniz
4. **Monitoring**: Vercel Dashboard'dan performans metriklerini izleyebilirsiniz

---

## Notlar

- Vercel Next.js'i tam destekler (SSR, API Routes, ISR, vb.)
- Firebase Hosting'den farklı olarak, Vercel'de SSR ve API Routes çalışır
- Environment variables'ları güncelledikten sonra yeni bir deploy gerekir
- Vercel ücretsiz planında sınırsız deploy ve bandwidth var

---

## Hızlı Başlangıç

1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. **"Add New..."** > **"Project"** tıklayın
3. Git repository'nizi seçin
4. Environment variables'ları ekleyin (yukarıdaki listeden)
5. **"Deploy"** tıklayın
6. Firebase Console'da Vercel domain'ini authorized domains'e ekleyin
7. ✅ Hazır!

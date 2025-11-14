# Firebase Hosting Deploy Rehberi

Bu dosya SportTrack uygulamasını Firebase Hosting'e deploy etmek için adım adım talimatlar içerir.

## Ön Gereksinimler

1. Firebase CLI kurulu olmalı (✅ Zaten kuruldu)
2. Firebase projesi oluşturulmuş olmalı (✅ Mevcut: `sporttrack-c3b18`)
3. Firebase Console'da Hosting servisi aktif olmalı

## Deploy Adımları

### 1. Firebase CLI'yi Kurun (Eğer kurulu değilse)

```bash
npm install -g firebase-tools
```

### 2. Firebase'e Giriş Yapın

Terminal'de projenizin root dizininde şu komutu çalıştırın:

```bash
firebase login
```

Bu komut tarayıcınızı açacak ve Firebase hesabınıza giriş yapmanızı isteyecek.

### 3. Firebase Projesini Initialize Edin (İlk Kez)

Eğer ilk kez deploy ediyorsanız:

```bash
firebase init
```

Bu komut size birkaç soru soracak:

- **Which Firebase features do you want to set up?** → `Hosting` seçin (space ile seçin, enter ile devam)
- **What do you want to use as your public directory?** → `public` yazın (zaten ayarlanmış)
- **Configure as a single-page app?** → `Yes` (rewrites için)
- **Set up automatic builds and deploys with GitHub?** → `No` (opsiyonel)

### 4. Build ve Deploy

```bash
npm run deploy
```

Bu komut:

1. Next.js uygulamasını static export olarak build eder (`out/` klasörüne)
2. Build çıktısını `public/` klasörüne kopyalar
3. Firebase Hosting'e deploy eder (`sporttrack` site ID'si ile)

### Alternatif: Sadece Hosting Deploy

Eğer build zaten yapılmışsa:

```bash
npm run deploy:hosting
```

Veya direkt Firebase komutu:

```bash
firebase deploy --only hosting:sporttrack
```

## Firebase Console'da Hosting'i Aktifleştirme

Eğer Hosting servisi henüz aktif değilse:

1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. `sporttrack-c3b18` projesini seçin
3. Sol menüden "Hosting" seçeneğine tıklayın
4. "Get started" butonuna tıklayın
5. Hosting servisi aktif olacaktır

## Environment Variables

Firebase Hosting static hosting olduğu için environment variables'ları build zamanında kullanılır.
Production için environment variables'ları Firebase Console'dan veya CI/CD pipeline'ından ayarlayın.

**Önemli:** `.env.local` dosyasındaki Firebase config değerleri build zamanında kullanılacak, bu yüzden deploy öncesi kontrol edin.

## Custom Domain (Opsiyonel)

Firebase Hosting'e custom domain eklemek için:

1. Firebase Console > Hosting > "Add custom domain"
2. Domain'inizi girin
3. DNS kayıtlarını ekleyin (Firebase size verecek)

## Sorun Giderme

### Build Hatası

- `FIREBASE_DEPLOY=true` environment variable'ı set edildiğinden emin olun
- `next.config.mjs` dosyasını kontrol edin

### Deploy Hatası

- Firebase'e login olduğunuzdan emin olun: `firebase login`
- Proje ID'sini kontrol edin: `.firebaserc` dosyasındaki `sporttrack-c3b18`

### Environment Variables Çalışmıyor

- Static export kullanıldığı için environment variables build zamanında kullanılır
- Production build'de `.env.local` dosyasındaki değerler kullanılır

## Deploy Sonrası

Deploy başarılı olduktan sonra:

- Firebase Console > Hosting'den URL'inizi görebilirsiniz
- Site ID `sporttrack` olduğu için URL: `https://sporttrack.web.app`

## Notlar

- Firebase Hosting static hosting kullandığı için Next.js Server-Side Rendering (SSR) özellikleri çalışmayacak
- Tüm sayfalar static olarak export edilir
- API routes çalışmayacak (eğer varsa)
- Client-side routing ve data fetching normal çalışacak

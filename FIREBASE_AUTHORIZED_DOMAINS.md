# Firebase Authorized Domains Ekleme Rehberi

Google Sign-In için "Unauthorized domain" hatası alıyorsanız, Firebase Console'da domain'inizi authorized domains listesine eklemeniz gerekiyor.

## Adım Adım Talimatlar

### 1. Firebase Console'a Giriş Yapın

1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. `sporttrack-c3b18` projesini seçin

### 2. Authentication Ayarlarına Gidin

1. Sol menüden **"Authentication"** seçeneğine tıklayın
2. Üst menüden **"Settings"** (Ayarlar) sekmesine tıklayın
3. Sayfayı aşağı kaydırın ve **"Authorized domains"** (Yetkili Domainler) bölümünü bulun

### 3. Domain Ekleyin

1. **"Add domain"** (Domain Ekle) butonuna tıklayın
2. Açılan dialog'a şu domain'i girin:
   ```
   sporttrack.web.app
   ```
3. **"Add"** (Ekle) butonuna tıklayın

### 4. Varsayılan Domainler

Firebase otomatik olarak şu domainleri ekler:

- `localhost` (geliştirme için)
- `sporttrack-c3b18.firebaseapp.com` (Firebase default domain)
- `sporttrack-c3b18.web.app` (Firebase default domain)

Ancak custom site ID kullandığınız için (`sporttrack`) `sporttrack.web.app` domain'ini manuel olarak eklemeniz gerekiyor.

### 5. Doğrulama

Domain eklendikten sonra:

1. Birkaç dakika bekleyin (propagation için)
2. `https://sporttrack.web.app` adresini yenileyin
3. Google Sign-In'i tekrar deneyin

## Alternatif: Tüm Firebase Hosting Domainlerini Ekleme

Eğer birden fazla Firebase Hosting site'iniz varsa, tüm Firebase Hosting domainlerini otomatik olarak eklemek için:

1. Firebase Console > Authentication > Settings
2. "Authorized domains" bölümünde
3. "Add domain" yerine Firebase'in otomatik ekleme özelliğini kullanabilirsiniz
4. Ancak custom site ID kullandığınız için manuel ekleme gerekli

## Sorun Giderme

### Domain Ekledim Ama Hala Hata Alıyorum

1. **Cache Temizleme**: Tarayıcı cache'ini temizleyin
2. **Bekleme**: Domain ekleme işlemi 1-5 dakika sürebilir
3. **Doğrulama**: Firebase Console'da domain'in listede olduğundan emin olun
4. **HTTPS**: Domain'in HTTPS ile erişilebilir olduğundan emin olun

### Diğer Domainler

Eğer başka domainler de kullanıyorsanız (örneğin custom domain), onları da eklemeniz gerekir:

- `yourdomain.com`
- `www.yourdomain.com`

## Notlar

- Her domain için ayrı ayrı ekleme yapmanız gerekir
- `localhost` zaten varsayılan olarak eklenmiştir (geliştirme için)
- Production domain'lerini mutlaka eklemeniz gerekir

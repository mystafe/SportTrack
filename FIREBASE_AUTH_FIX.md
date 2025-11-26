# Firebase Authentication Sorunu Çözümü

## Sorun

Firebase CLI her gün authentication soruyor ve token otomatik olarak yenilenmiyor.

## Çözümler

### 1. Otomatik Token Yenileme Script'i

```bash
npm run firebase:refresh
```

Bu script:

- Firebase CLI'yi günceller
- Token'ın expire olup olmadığını kontrol eder
- Gerekirse otomatik olarak yeniler

### 2. CI Token Kullanımı (Önerilen - Daha Uzun Süreli)

CI token oluşturmak için:

```bash
firebase login:ci
```

Bu komut size bir token verecek. Bu token'ı environment variable olarak kullanabilirsiniz:

```bash
export FIREBASE_TOKEN="your-ci-token-here"
firebase deploy --only hosting:sporttrack
```

Veya `.env.local` dosyasına ekleyin:

```
FIREBASE_TOKEN=your-ci-token-here
```

### 3. Token Dosyası İzinlerini Kontrol Etme

Token dosyasının doğru izinlere sahip olduğundan emin olun:

```bash
chmod 600 ~/.config/configstore/firebase-tools.json
```

### 4. Firebase CLI Cache Temizleme

Eğer sorun devam ederse:

```bash
# Cache'i temizle
rm -rf ~/.config/configstore/firebase-tools.json

# Yeniden login
firebase login
```

### 5. Otomatik Yenileme için Cron Job (Mac/Linux)

Her gün otomatik olarak token'ı yenilemek için:

```bash
# Crontab'ı düzenle
crontab -e

# Şunu ekle (her gün saat 02:00'de çalışır)
0 2 * * * cd /Users/mustafaevleksiz/Desktop/Projects/SportTrack && npm run firebase:refresh
```

## En İyi Çözüm: CI Token

CI token kullanmak en güvenilir çözümdür çünkü:

- ✅ Daha uzun süre geçerlidir (aylar/yıllar)
- ✅ Otomatik yenileme gerektirmez
- ✅ Non-interactive ortamlarda çalışır
- ✅ Script'lerde kullanılabilir

CI token oluşturduktan sonra, deploy script'ini şu şekilde güncelleyebilirsiniz:

```bash
# .env.local dosyasına ekleyin
FIREBASE_TOKEN=your-token-here

# Deploy script'ini güncelleyin
firebase deploy --only hosting:sporttrack --token $FIREBASE_TOKEN
```

# Firebase API Key Güvenliği Hakkında

## Vercel Uyarıları

Vercel, Firebase environment variables eklerken şu uyarıyı gösterebilir:

```
This key, which is prefixed with NEXT_PUBLIC_ and includes the term AUTH,
might expose sensitive information to the browser. Verify it is safe to share publicly.
```

## ✅ Bu Uyarıları Yok Sayabilirsiniz

### Neden Güvenli?

1. **Firebase API Key'ler Public'tir**
   - Firebase API Key'ler zaten browser'da kullanılmak üzere tasarlanmıştır
   - Firebase'in güvenlik modeli API Key'lerin public olmasına dayanır
   - Bu, Firebase'in resmi dokümantasyonunda önerilen kullanım şeklidir

2. **Güvenlik API Key'den Değil**
   Firebase'in güvenliği şu mekanizmalardan gelir:
   - **Firebase Security Rules**: Firestore ve Storage için erişim kontrolü
   - **Firebase App Check**: Bot ve kötüye kullanım koruması
   - **Firebase Authentication**: Kullanıcı kimlik doğrulama
   - **API Key Restrictions**: Firebase Console'da domain/IP kısıtlamaları

3. **Auth Domain Public Bilgidir**
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` sadece Firebase Authentication servisinin domain'idir
   - Bu bilgi zaten public'tir ve gizli değildir

## 🔒 Güvenlik Önlemleri

Firebase API Key'inizi korumak için şu önlemleri alın:

### 1. Firebase Console'da API Key Kısıtlamaları

1. [Google Cloud Console](https://console.cloud.google.com/) > APIs & Services > Credentials
2. API Key'inizi bulun
3. **"Application restrictions"** bölümünde:
   - **HTTP referrers (web sites)** seçin
   - Sadece izin verilen domain'leri ekleyin:
     - `https://sporttrack.web.app/*`
     - `https://sporttrack.vercel.app/*`
     - `http://localhost:3000/*` (development)

### 2. Firebase Security Rules

Firestore ve Storage için güvenlik kuralları ayarlayın:

**Firestore Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Storage Rules:**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Firebase App Check

Bot ve kötüye kullanım koruması için App Check'i aktifleştirin:

1. Firebase Console > App Check
2. Web app'inizi seçin
3. reCAPTCHA v3'i aktifleştirin

### 4. Authorized Domains

Firebase Authentication'da sadece izin verilen domain'leri ekleyin:

1. Firebase Console > Authentication > Settings
2. Authorized domains bölümünde sadece gerekli domain'leri tutun
3. Gereksiz domain'leri kaldırın

## 📚 Kaynaklar

- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/best-practices)
- [Firebase API Key Restrictions](https://cloud.google.com/docs/authentication/api-keys#restricting_api_keys)
- [Firebase App Check](https://firebase.google.com/docs/app-check)

## Sonuç

✅ **Firebase API Key'lerin public olması normal ve güvenlidir**
✅ **Vercel uyarılarını görmezden gelebilirsiniz**
✅ **Güvenlik için Security Rules ve App Check kullanın**
✅ **API Key kısıtlamalarını Firebase Console'da ayarlayın**

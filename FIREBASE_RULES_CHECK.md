# Firebase Security Rules Kontrol Listesi

## 🔍 Sorun: setDoc timeout hatası

`setDoc` promise'i resolve olmuyor. Bu genellikle **Firestore Security Rules** yazmaya izin vermediğinde olur.

## ✅ Kontrol Adımları

### 1. Firebase Console'a Gidin

1. [Firebase Console](https://console.firebase.google.com/)
2. Projenizi seçin: **sporttrack-c3b18**
3. **Firestore Database** → **Rules** sekmesine gidin

### 2. Security Rules'ı Kontrol Edin

Rules editöründe şu kuralların olması gerekiyor:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Rules'ı Publish Edin

- Rules editöründe **"Publish"** butonuna tıklayın
- Rules'ların aktif olduğundan emin olun

### 4. Test Edin

1. Browser console'u açın (F12)
2. Upload butonuna basın
3. Console'da şunları görmelisiniz:
   - `📋 Document path: users/qYKEw8Ze05O7KTF1xFCSYNcOmBs2`
   - `🔐 User ID: qYKEw8Ze05O7KTF1xFCSYNcOmBs2`
   - `👤 Auth user: qYKEw8Ze05O7KTF1xFCSYNcOmBs2`
   - `✅ Auth matches: true`
   - `✅ Successfully uploaded to cloud - setDoc completed`

### 5. Eğer Hala Hata Alırsanız

Console'da şu hatalardan birini görebilirsiniz:

- **`permission-denied`**: Security rules yazmaya izin vermiyor
- **`unauthenticated`**: Kullanıcı authenticated değil
- **`not-found`**: Firestore database bulunamadı

## 🔧 Alternatif Çözümler

### Eğer Rules Doğruysa Ama Hala Çalışmıyorsa:

1. **Firestore Database'i Kontrol Edin**
   - Firebase Console → Firestore Database
   - Database'in oluşturulduğundan emin olun

2. **Authentication'ı Kontrol Edin**
   - Firebase Console → Authentication
   - Kullanıcının authenticated olduğundan emin olun

3. **Network'i Kontrol Edin**
   - Browser DevTools → Network tab
   - Firestore isteklerini kontrol edin
   - CORS veya network hatası var mı?

4. **Firebase Config'i Kontrol Edin**
   - `.env.local` dosyasındaki Firebase config değerlerini kontrol edin
   - Tüm değerlerin doğru olduğundan emin olun

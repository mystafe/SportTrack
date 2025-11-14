# Firebase Firestore Database Kurulumu

## 🔴 Sorun: Database görünmüyor ve setDoc timeout veriyor

Firestore database'i oluşturulmamış olabilir. Aşağıdaki adımları takip edin:

## ✅ Adım Adım Kurulum

### 1. Firebase Console'a Gidin

1. [Firebase Console](https://console.firebase.google.com/)
2. Projenizi seçin: **sporttrack-c3b18**

### 2. Firestore Database Oluşturun

1. Sol menüden **"Firestore Database"** seçin
2. Eğer database yoksa, **"Create database"** butonuna tıklayın
3. **"Start in test mode"** seçin (güvenlik için sonra rules ekleyeceğiz)
4. **Location** seçin (örn: `us-central1` veya size en yakın bölge)
5. **"Enable"** butonuna tıklayın

### 3. Security Rules Ekleyin

Database oluşturulduktan sonra:

1. **"Rules"** sekmesine gidin
2. Rules editöründe şu kuralları ekleyin:

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

3. **"Publish"** butonuna tıklayın

### 4. Test Edin

1. Browser'da sayfayı yenileyin
2. Upload butonuna basın
3. Console'da şunları görmelisiniz:
   - `🧪 Testing simple write...`
   - `✅ Test write successful!`
   - `✅ Successfully uploaded to cloud!`

## 🔍 Sorun Giderme

### Database görünmüyor

- Firebase Console'da "Firestore Database" sekmesine gidin
- Eğer "Create database" butonu görünüyorsa, database oluşturulmamış demektir
- Yukarıdaki adımları takip edin

### Permission denied hatası

- Rules'ları kontrol edin
- Rules'ların publish edildiğinden emin olun
- Kullanıcının authenticated olduğundan emin olun

### Timeout hatası

- Database oluşturulmamış olabilir
- Network bağlantısını kontrol edin
- Firebase config değerlerini kontrol edin

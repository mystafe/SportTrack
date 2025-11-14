# Firebase API Key Güvenlik Adımları

## ⚠️ ÖNEMLİ: API Key GitHub'a commit edildi

Firebase API key'iniz GitHub repository'sinde görünüyor. Hemen aşağıdaki adımları uygulayın:

## 1. Firebase Console'da API Key'i Kısıtla veya Yenile

### Seçenek A: API Key'i Kısıtla (Önerilen)

1. [Firebase Console](https://console.firebase.google.com/) → Project Settings → General
2. "Your apps" bölümünde web app'inizi bulun
3. API Key'in yanındaki "Restrict key" butonuna tıklayın
4. **HTTP referrers (web sites)** seçeneğini seçin
5. Sadece kendi domain'inizi ekleyin:
   - `localhost:*` (development için)
   - `your-production-domain.com/*` (production için)
   - `*.vercel.app/*` (Vercel deployment için)

### Seçenek B: API Key'i Yenile

1. Firebase Console → Project Settings → General
2. "Your apps" bölümünde web app'inizi bulun
3. "Regenerate key" butonuna tıklayın
4. Yeni key'i `.env.local` dosyanıza ekleyin

## 2. Firebase App Check'i Etkinleştir (Önerilen)

1. Firebase Console → App Check
2. "Get started" butonuna tıklayın
3. Web app'iniz için App Check'i etkinleştirin
4. Bu, API key'inizin kötüye kullanılmasını önler

## 3. Firestore Security Rules'ı Kontrol Edin

Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Sadece authenticated kullanıcılar kendi verilerine erişebilir
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 4. Git History Temizliği (Opsiyonel)

Eğer `.env.local` dosyasını git history'den tamamen kaldırmak isterseniz:

```bash
# BFG Repo-Cleaner kullanarak (daha hızlı)
# 1. BFG'i indirin: https://rtyley.github.io/bfg-repo-cleaner/
# 2. Çalıştırın:
java -jar bfg.jar --delete-files .env.local

# Veya git filter-branch ile (daha yavaş)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# Sonra force push
git push --force-with-lease origin main
```

**Not:** Force push yaparsanız, tüm collaborator'lar repository'yi yeniden clone etmeli.

## 5. Gelecek için Güvenlik

- ✅ `.env.local` artık `.gitignore`'da
- ✅ README'de placeholder'lar kullanılıyor
- ✅ Yeni commit'lerde credentials olmayacak

## Acil Durum

Eğer API key kötüye kullanılırsa:

1. Hemen Firebase Console'da API key'i devre dışı bırakın
2. Yeni bir API key oluşturun
3. `.env.local` dosyanızı güncelleyin
4. Firestore Security Rules'ı kontrol edin

# Vercel Hataları ve Çözümleri

## 🔴 Yaygın Vercel Hataları

### 1. Firebase API Key Uyarıları ⚠️

Vercel, Firebase environment variables eklerken şu uyarıyı gösterebilir:

```
⚠️ This key, which is prefixed with NEXT_PUBLIC_ and includes the term AUTH,
might expose sensitive information to the browser. Verify it is safe to share publicly.
```

**✅ ÇÖZÜM: Bu uyarıları YOK SAYABİLİRSİNİZ**

**Neden Güvenli?**

- Firebase API Key'ler zaten browser'da kullanılmak üzere tasarlanmıştır
- Firebase'in güvenlik modeli API Key'lerin public olmasına dayanır
- Güvenlik Security Rules ve Authentication'dan gelir, API Key'den değil

**Detaylar için:** `FIREBASE_SECURITY_NOTES.md` dosyasına bakın

---

### 2. Build Hatası: Environment Variables Eksik ❌

**Hata:**

```
Error: NEXT_PUBLIC_FIREBASE_API_KEY is not defined
```

**Çözüm:**

1. Vercel Dashboard > Project Settings > Environment Variables
2. Tüm Firebase environment variables'ları ekleyin:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
3. Her birini **Production**, **Preview**, ve **Development** için ekleyin
4. Yeni bir deploy tetikleyin

---

### 3. Firebase Authentication Hatası: CONFIGURATION_NOT_FOUND ❌

**Hata:**

```
FirebaseError: CONFIGURATION_NOT_FOUND
```

**Çözüm:**

1. Firebase Console > Authentication > Settings > Authorized domains
2. Vercel domain'inizi ekleyin:
   - `sporttrack.vercel.app`
   - Custom domain kullanıyorsanız onu da ekleyin
3. Firebase Console > Authentication > Sign-in method
4. Google Sign-In provider'ı aktifleştirin
5. Authorized domains'de Vercel domain'inizin olduğundan emin olun

---

### 4. Build Hatası: TypeScript Errors ❌

**Hata:**

```
Type error: 'authUser' is possibly 'null'.
```

**Çözüm:**

- TypeScript strict mode açık olduğu için null check'ler eklenmeli
- Bu hata zaten düzeltildi (`src/hooks/useAuth.ts`)

---

### 5. Deploy Hatası: Public Folder Conflict ❌

**Hata:**

```
Error: You can not have a '_next' folder inside of your public folder.
```

**Çözüm:**

- `public/_next` klasörünü silin
- Build öncesi temizlik script'i eklendi (`npm run clean:public`)
- Bu hata zaten düzeltildi

---

## ✅ Vercel Deploy Adımları

### 1. Environment Variables Ekleyin

Vercel Dashboard'da:

1. Project Settings > Environment Variables
2. Her Firebase variable'ı ekleyin (`.env.local` dosyanızdan)
3. **Production**, **Preview**, **Development** için hepsini seçin

### 2. Firebase Authorized Domains

Firebase Console'da:

1. Authentication > Settings > Authorized domains
2. Vercel domain'inizi ekleyin: `sporttrack.vercel.app`
3. Custom domain varsa onu da ekleyin

### 3. Deploy Edin

**CLI ile:**

```bash
npm run deploy:vercel
```

**Veya Dashboard'dan:**

- Git push yaptığınızda otomatik deploy olur
- Manuel deploy için "Deploy" butonuna tıklayın

---

## 🔍 Vercel Build Logs Kontrolü

Eğer deploy hatası varsa:

1. Vercel Dashboard > Deployments
2. Başarısız deployment'a tıklayın
3. "Build Logs" sekmesine bakın
4. Hata mesajını kontrol edin

**Yaygın Hatalar:**

- Environment variables eksik → Environment Variables ekleyin
- TypeScript errors → Local'de `npm run build` çalıştırıp kontrol edin
- Firebase config hatası → Authorized domains kontrol edin

---

## 📝 Checklist

Deploy öncesi kontrol listesi:

- [ ] Tüm Firebase environment variables Vercel'de ekli
- [ ] Firebase Authorized domains'de Vercel domain var
- [ ] Local build başarılı (`npm run build`)
- [ ] TypeScript errors yok (`npm run build` çalıştırın)
- [ ] `.env.local` dosyası güncel
- [ ] Firebase Security Rules publish edilmiş

---

## 🚀 Hızlı Deploy

```bash
# 1. Environment variables kontrol et
# 2. Build test et
npm run build

# 3. Vercel'e deploy et
npm run deploy:vercel

# Veya Firebase Hosting'e deploy et
npm run deploy
```

---

**Son Güncelleme:** 2025-01

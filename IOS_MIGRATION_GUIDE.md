# SportTrack iOS Uygulamasına Dönüştürme Rehberi

**Tarih:** 2025-01  
**Hedef:** React Native ile iOS (ve Android) native uygulama

---

## 📋 Genel Bakış

Bu rehber, mevcut Next.js PWA uygulamasını React Native ile iOS ve Android native uygulamaya dönüştürme sürecini adım adım açıklar.

**Tahmini Süre:** 2-3 ay  
**Zorluk:** Orta-İleri Seviye  
**Kod Paylaşımı:** %70-80

---

## 🎯 Faz 1: Hazırlık ve Kurulum (Hafta 1)

### Adım 1.1: Geliştirme Ortamı Hazırlığı

#### macOS Gereksinimleri

```bash
# 1. Xcode kurulumu (App Store'dan)
# - Xcode 15+ gerekli
# - Command Line Tools kurulumu

# 2. Homebrew kurulumu (eğer yoksa)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 3. Node.js ve npm (zaten var, kontrol edelim)
node --version  # v18+ olmalı
npm --version   # v9+ olmalı

# 4. CocoaPods kurulumu (iOS bağımlılıkları için)
sudo gem install cocoapods

# 5. Watchman kurulumu (React Native için önerilir)
brew install watchman
```

#### Android Gereksinimleri (opsiyonel, şimdilik iOS'a odaklanıyoruz)

```bash
# Android Studio kurulumu
# Java Development Kit (JDK) kurulumu
# Android SDK kurulumu
```

**Kontrol Listesi:**

- [ ] Xcode kurulu ve açılıyor
- [ ] Command Line Tools kurulu (`xcode-select --install`)
- [ ] CocoaPods kurulu (`pod --version`)
- [ ] Watchman kurulu (`watchman --version`)

---

### Adım 1.2: React Native Projesi Oluşturma

```bash
# 1. Yeni React Native projesi oluştur (TypeScript template ile)
npx react-native@latest init SportTrackNative --template react-native-template-typescript

# 2. Proje dizinine git
cd SportTrackNative

# 3. Proje yapısını kontrol et
ls -la
```

**Oluşturulacak Yapı:**

```
SportTrackNative/
├── android/          # Android native kodları
├── ios/              # iOS native kodları
├── src/              # React Native kodları (biz ekleyeceğiz)
├── package.json
├── tsconfig.json
└── ...
```

**Kontrol Listesi:**

- [ ] React Native projesi oluşturuldu
- [ ] TypeScript template kullanıldı
- [ ] Proje dizinine geçildi

---

### Adım 1.3: Gerekli Paketlerin Kurulumu

```bash
# 1. Temel React Native paketleri (zaten kurulu)
# React Navigation (navigation için)
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs

# 2. React Native bağımlılıkları
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler

# 3. Firebase SDK
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore

# 4. UI Library (React Native Paper - Material Design)
npm install react-native-paper react-native-vector-icons

# 5. Utility paketleri
npm install date-fns
npm install @react-native-async-storage/async-storage

# 6. iOS bağımlılıklarını kur
cd ios && pod install && cd ..
```

**Kontrol Listesi:**

- [ ] Tüm paketler kuruldu
- [ ] `pod install` başarılı
- [ ] `package.json` güncellendi

---

### Adım 1.4: Firebase Yapılandırması

#### iOS Firebase Setup

1. **Firebase Console'dan iOS App Oluşturma:**
   - Firebase Console'a git: https://console.firebase.google.com
   - Mevcut projeyi seç (sporttrack-c3b18)
   - "Add app" → iOS seçeneği
   - Bundle ID: `com.sporttrack.app` (veya istediğiniz)
   - `GoogleService-Info.plist` dosyasını indir

2. **GoogleService-Info.plist'i Projeye Ekleme:**

   ```bash
   # GoogleService-Info.plist dosyasını ios/ klasörüne kopyala
   cp ~/Downloads/GoogleService-Info.plist ios/
   ```

3. **Podfile Güncelleme:**

   ```ruby
   # ios/Podfile dosyasını aç ve Firebase pod'larını ekle
   # Zaten @react-native-firebase paketleri bunu otomatik yapar
   ```

4. **iOS Build Ayarları:**
   - Xcode'da projeyi aç: `open ios/SportTrackNative.xcworkspace`
   - Target → Signing & Capabilities → Team seç
   - Bundle Identifier'ı ayarla

**Kontrol Listesi:**

- [ ] Firebase Console'da iOS app oluşturuldu
- [ ] GoogleService-Info.plist indirildi ve projeye eklendi
- [ ] Xcode'da proje açılıyor
- [ ] Build başarılı (henüz kod yok ama setup doğru mu kontrol et)

---

## 🎯 Faz 2: Business Logic Taşıma (Hafta 2-3)

### Adım 2.1: Proje Yapısı Oluşturma

```bash
# React Native projesinde klasör yapısını oluştur
mkdir -p src/lib
mkdir -p src/lib/stores
mkdir -p src/lib/hooks
mkdir -p src/lib/utils
mkdir -p src/lib/types
mkdir -p src/components
mkdir -p src/components/ui
mkdir -p src/screens
mkdir -p src/navigation
```

**Hedef Yapı:**

```
src/
├── lib/
│   ├── stores/          # Zustand store'ları (mevcut store'ları taşı)
│   ├── hooks/           # Custom hook'lar
│   ├── utils/           # Utility fonksiyonları
│   ├── types/           # TypeScript type'ları
│   └── constants.ts     # Sabitler
├── components/          # React Native component'leri
│   └── ui/             # UI component library
├── screens/            # Ekran component'leri
└── navigation/         # Navigation yapılandırması
```

---

### Adım 2.2: Utility Fonksiyonlarını Taşıma

**Taşınacak Dosyalar:**

- `src/lib/activityUtils.ts` → `src/lib/utils/activityUtils.ts`
- `src/lib/dateValidation.ts` → `src/lib/utils/dateValidation.ts`
- `src/lib/formatDuration.ts` → `src/lib/utils/formatDuration.ts`
- `src/lib/computeSummary.ts` → `src/lib/utils/computeSummary.ts`
- Diğer utility dosyaları...

**Yapılacaklar:**

1. Her dosyayı kopyala
2. Browser-specific API'leri kontrol et (localStorage → AsyncStorage)
3. Date-fns import'larını kontrol et (aynı kalabilir)
4. Test et

**Örnek Adaptasyon:**

```typescript
// Eski (Next.js)
import { useActivities } from '@/lib/activityStore';

// Yeni (React Native)
import { useActivities } from '../lib/stores/activityStore';
```

**Kontrol Listesi:**

- [ ] Tüm utility dosyaları taşındı
- [ ] Browser API'leri AsyncStorage'a çevrildi
- [ ] Import path'leri güncellendi
- [ ] Test edildi

---

### Adım 2.3: Store'ları Taşıma (Zustand)

**Zustand React Native'de çalışır!** Sadece localStorage kısmını AsyncStorage'a çevirmemiz gerekiyor.

**Taşınacak Store'lar:**

1. `src/lib/activityStore.tsx` → `src/lib/stores/activityStore.ts`
2. `src/lib/settingsStore.tsx` → `src/lib/stores/settingsStore.ts`
3. `src/lib/badgeStore.tsx` → `src/lib/stores/badgeStore.ts`
4. `src/lib/levelStore.tsx` → `src/lib/stores/levelStore.ts`
5. `src/lib/challengeStore.tsx` → `src/lib/stores/challengeStore.ts`

**AsyncStorage Adaptasyonu:**

```typescript
// Eski (Next.js)
import { useActivities } from '@/lib/activityStore';

// Yeni (React Native)
import AsyncStorage from '@react-native-async-storage/async-storage';

// localStorage.setItem → AsyncStorage.setItem
// localStorage.getItem → AsyncStorage.getItem
// localStorage.removeItem → AsyncStorage.removeItem
```

**Örnek Store Adaptasyonu:**

```typescript
// src/lib/stores/activityStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const STORAGE_KEY = 'sporttrack_activities';

interface ActivityState {
  activities: ActivityRecord[];
  // ... diğer state'ler
}

export const useActivities = create<ActivityState>((set, get) => ({
  activities: [],

  // Hydration
  hydrate: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set({ activities: parsed });
      }
    } catch (error) {
      console.error('Failed to hydrate activities:', error);
    }
  },

  // Save to storage
  save: async (activities: ActivityRecord[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    } catch (error) {
      console.error('Failed to save activities:', error);
    }
  },
}));
```

**Kontrol Listesi:**

- [ ] Tüm store'lar taşındı
- [ ] localStorage → AsyncStorage dönüşümü yapıldı
- [ ] Async/await pattern kullanıldı
- [ ] Error handling eklendi
- [ ] Test edildi

---

### Adım 2.4: Firebase Entegrasyonu

**Firebase React Native Setup:**

1. **Firebase Config Dosyası:**

   ```typescript
   // src/lib/firebase/config.ts
   import { initializeApp, getApps } from '@react-native-firebase/app';
   import auth from '@react-native-firebase/auth';
   import firestore from '@react-native-firebase/firestore';

   // Firebase zaten GoogleService-Info.plist'ten initialize edilir
   // Sadece import'ları yapıyoruz

   export { auth, firestore };
   ```

2. **Cloud Sync Service Adaptasyonu:**

   ```typescript
   // src/lib/cloudSync/syncService.ts
   import firestore from '@react-native-firebase/firestore';
   import auth from '@react-native-firebase/auth';

   // Mevcut sync service kodunu adapte et
   // Firestore API'leri aynı kalır
   ```

3. **Auth Hook Adaptasyonu:**

   ```typescript
   // src/hooks/useAuth.ts
   import auth from '@react-native-firebase/auth';

   // Mevcut useAuth hook'unu adapte et
   // Firebase Auth API'leri aynı kalır
   ```

**Kontrol Listesi:**

- [ ] Firebase config dosyası oluşturuldu
- [ ] Cloud sync service adapte edildi
- [ ] Auth hook adapte edildi
- [ ] Login/logout flow test edildi
- [ ] Sync çalışıyor

---

## 🎯 Faz 3: UI Component'leri (Hafta 3-4)

### Adım 3.1: UI Component Library Seçimi

**Seçenekler:**

1. **React Native Paper** (Önerilen) - Material Design
2. **NativeBase** - Cross-platform
3. **Tamamen Custom** - Mevcut design system'i kullan

**Öneri: React Native Paper + Custom Components**

```bash
# React Native Paper kurulumu (zaten kurduk)
npm install react-native-paper react-native-vector-icons

# iOS için vector icons setup
cd ios && pod install && cd ..
```

---

### Adım 3.2: Temel UI Component'leri Oluşturma

**Taşınacak Component'ler:**

1. Button → React Native Paper Button veya custom
2. Input → React Native Paper TextInput veya custom
3. Card → React Native Paper Card veya custom
4. Badge → Custom component
5. LoadingSpinner → Custom component

**Örnek Button Component:**

```typescript
// src/components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' && { backgroundColor: theme.colors.primary },
        variant === 'secondary' && { backgroundColor: theme.colors.secondary },
        variant === 'outline' && { borderWidth: 2, borderColor: theme.colors.primary },
        (disabled || loading) && { opacity: 0.5 },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.colors.primary : '#fff'} />
      ) : (
        <Text style={[
          styles.text,
          variant === 'outline' && { color: theme.colors.primary },
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // iOS touch target
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

**Kontrol Listesi:**

- [ ] Button component oluşturuldu
- [ ] Input component oluşturuldu
- [ ] Card component oluşturuldu
- [ ] Badge component oluşturuldu
- [ ] LoadingSpinner component oluşturuldu
- [ ] Tüm component'ler test edildi

---

### Adım 3.3: Navigation Yapısı

**React Navigation Setup:**

```typescript
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import StatsScreen from '../screens/StatsScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Activities" component={ActivitiesScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Achievements" component={AchievementsScreen} />
      <Tab.Screen name="Challenges" component={ChallengesScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="AddActivity" component={AddActivityScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**Kontrol Listesi:**

- [ ] Navigation yapısı oluşturuldu
- [ ] Bottom tabs çalışıyor
- [ ] Stack navigation çalışıyor
- [ ] Screen transition'ları smooth

---

## 🎯 Faz 4: Ekranlar (Screens) (Hafta 4-5)

### Adım 4.1: Ana Ekran (Home Screen)

**Taşınacak:** `src/app/page.tsx` → `src/screens/HomeScreen.tsx`

**Adaptasyon:**

- Next.js `Link` → React Navigation `navigation.navigate`
- `useRouter` → `useNavigation` hook
- HTML elementleri → React Native component'leri

**Örnek:**

```typescript
// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useActivities } from '../lib/stores/activityStore';
import { StatsCards } from '../components/StatsCards';
import { Button } from '../components/ui/Button';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { activities } = useActivities();

  return (
    <ScrollView style={styles.container}>
      <StatsCards />
      <Button
        title="Add Activity"
        onPress={() => navigation.navigate('AddActivity')}
        variant="primary"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

**Kontrol Listesi:**

- [ ] HomeScreen oluşturuldu
- [ ] StatsCards component'i çalışıyor
- [ ] Navigation çalışıyor
- [ ] Styling doğru

---

### Adım 4.2: Diğer Ekranlar

**Taşınacak Ekranlar:**

1. Activities Screen (`src/app/activities/page.tsx`)
2. Stats Screen (`src/app/stats/page.tsx`)
3. Achievements Screen (`src/app/achievements/page.tsx`)
4. Challenges Screen (`src/app/challenges/page.tsx`)
5. Add Activity Screen (`src/app/add/page.tsx`)
6. Settings Screen (SettingsDialog → SettingsScreen)

**Her Ekran İçin:**

- [ ] Screen component'i oluşturuldu
- [ ] Navigation entegrasyonu yapıldı
- [ ] Styling yapıldı
- [ ] Test edildi

---

## 🎯 Faz 5: Native Özellikler (Hafta 5-6)

### Adım 5.1: Push Notifications

```bash
npm install @react-native-firebase/messaging
```

**Setup:**

1. Firebase Console'da Cloud Messaging'i aktifleştir
2. APNs sertifikası ekle (iOS)
3. Notification handler'ı implement et

---

### Adım 5.2: Widget'lar (iOS WidgetKit)

**iOS Widget için:**

1. Xcode'da Widget Extension ekle
2. Widget UI'ı oluştur
3. App Groups kullanarak data paylaşımı yap

---

### Adım 5.3: Haptic Feedback

```bash
npm install react-native-haptic-feedback
```

**Kullanım:**

```typescript
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

ReactNativeHapticFeedback.trigger('impactLight');
```

---

## 🎯 Faz 6: Testing ve Polish (Hafta 6-7)

### Adım 6.1: Testing

```bash
npm install --save-dev @testing-library/react-native jest
```

**Test Dosyaları:**

- Unit testler (store'lar, utils)
- Component testleri
- Integration testleri

---

### Adım 6.2: Performance Optimizasyonu

- React.memo kullanımı
- useMemo ve useCallback optimizasyonları
- FlatList kullanımı (büyük listeler için)
- Image optimization

---

### Adım 6.3: App Store Hazırlığı

1. **App Icon ve Launch Screen:**
   - App icon oluştur (1024x1024)
   - Launch screen oluştur

2. **Info.plist Ayarları:**
   - App name
   - Bundle identifier
   - Version number
   - Privacy descriptions

3. **App Store Connect:**
   - App Store Connect'te app oluştur
   - Screenshot'lar hazırla
   - Description yaz
   - Keywords ekle

4. **Build ve Upload:**

   ```bash
   # iOS build
   cd ios
   xcodebuild -workspace SportTrackNative.xcworkspace \
     -scheme SportTrackNative \
     -configuration Release \
     -archivePath build/SportTrackNative.xcarchive \
     archive

   # Archive'i App Store'a upload et (Xcode'dan)
   ```

---

## 📝 Detaylı Adım Adım Checklist

### Hafta 1: Kurulum

- [ ] Geliştirme ortamı hazırlandı
- [ ] React Native projesi oluşturuldu
- [ ] Paketler kuruldu
- [ ] Firebase yapılandırıldı
- [ ] İlk build başarılı

### Hafta 2-3: Business Logic

- [ ] Proje yapısı oluşturuldu
- [ ] Utility fonksiyonları taşındı
- [ ] Store'lar taşındı ve adapte edildi
- [ ] Firebase entegrasyonu tamamlandı
- [ ] Test edildi

### Hafta 3-4: UI Components

- [ ] UI component library seçildi
- [ ] Temel component'ler oluşturuldu
- [ ] Navigation yapısı kuruldu
- [ ] Styling sistemi oluşturuldu

### Hafta 4-5: Screens

- [ ] HomeScreen oluşturuldu
- [ ] ActivitiesScreen oluşturuldu
- [ ] StatsScreen oluşturuldu
- [ ] Diğer ekranlar oluşturuldu
- [ ] Navigation flow test edildi

### Hafta 5-6: Native Features

- [ ] Push notifications eklendi
- [ ] Widget'lar eklendi (opsiyonel)
- [ ] Haptic feedback eklendi
- [ ] Native modüller entegre edildi

### Hafta 6-7: Testing & Polish

- [ ] Testler yazıldı
- [ ] Performance optimizasyonu yapıldı
- [ ] UI/UX iyileştirmeleri yapıldı
- [ ] App Store hazırlığı tamamlandı

---

## 🚀 İlk Adımlar (Şimdi Yapılacaklar)

### 1. React Native Projesi Oluştur

```bash
# Terminal'de çalıştır
npx react-native@latest init SportTrackNative --template react-native-template-typescript
cd SportTrackNative
```

### 2. İlk Build'i Test Et

```bash
# iOS simulator'da çalıştır
npm run ios

# Veya Xcode'dan
open ios/SportTrackNative.xcworkspace
# Xcode'da Run butonuna bas
```

### 3. Proje Yapısını Oluştur

```bash
mkdir -p src/lib/stores
mkdir -p src/lib/utils
mkdir -p src/components/ui
mkdir -p src/screens
mkdir -p src/navigation
```

### 4. İlk Component'i Oluştur

```typescript
// src/components/ui/Button.tsx
// Yukarıdaki örneği kullan
```

---

## 📚 Yararlı Kaynaklar

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Firebase React Native](https://rnfirebase.io/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

---

## ⚠️ Önemli Notlar

1. **localStorage → AsyncStorage:** Tüm localStorage kullanımlarını AsyncStorage'a çevir
2. **Next.js Router → React Navigation:** Tüm navigation'ı React Navigation'a çevir
3. **HTML → React Native:** Tüm HTML elementlerini React Native component'lerine çevir
4. **CSS → StyleSheet:** Tüm CSS class'larını StyleSheet'e çevir
5. **Image Optimization:** React Native Image component'ini kullan
6. **Platform-Specific Code:** iOS ve Android için farklı kod gerekebilir

---

**Hazır mısın? İlk adımla başlayalım! 🚀**

# iOS Uygulamasına Dönüştürme - Adım Adım Kurulum

**Tarih:** 2025-01  
**Durum:** Başlangıç

---

## ✅ Mevcut Durum Kontrolü

- ✅ Node.js v24.10.0 kurulu
- ✅ npm v11.6.0 kurulu
- ⚠️ CocoaPods kurulu değil
- ⚠️ Xcode tam kurulu değil (sadece Command Line Tools var)

---

## 📋 ADIM 1: Geliştirme Ortamı Hazırlığı

### 1.1 Xcode Kurulumu

**Yapılacaklar:**

1. **App Store'dan Xcode'u indir ve kur**
   - App Store'u aç
   - "Xcode" ara
   - İndir ve kur (yaklaşık 15-20 GB, zaman alabilir)
   - İlk açılışta lisans sözleşmesini kabul et

2. **Xcode Command Line Tools'u aktifleştir**

   ```bash
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -license accept
   ```

3. **Xcode'u bir kez aç ve setup'ı tamamla**
   - Xcode'u aç
   - "Open a project" veya "Create a new project" seçeneğini gör
   - Bu, Xcode'un ilk kurulumunu tamamlar

**Kontrol:**

```bash
xcodebuild -version
# Çıktı: Xcode 15.x.x gibi bir versiyon göstermeli
```

---

### 1.2 CocoaPods Kurulumu

**Yapılacaklar:**

```bash
# CocoaPods'u kur
sudo gem install cocoapods

# CocoaPods repo'sunu setup et (ilk kurulumda)
pod setup
```

**Kontrol:**

```bash
pod --version
# Çıktı: 1.x.x gibi bir versiyon göstermeli
```

---

### 1.3 Watchman Kurulumu (Opsiyonel ama Önerilen)

**Yapılacaklar:**

```bash
# Homebrew ile Watchman kur
brew install watchman
```

**Kontrol:**

```bash
watchman --version
```

---

## 📋 ADIM 2: React Native Projesi Oluşturma

### 2.1 Yeni Proje Oluştur

**Yapılacaklar:**

```bash
# Ana proje dizinine git
cd /Users/mustafaevleksiz/Desktop/Projects

# React Native projesi oluştur (TypeScript template ile)
npx react-native@latest init SportTrackNative --template react-native-template-typescript

# Proje dizinine git
cd SportTrackNative
```

**Not:** Bu işlem birkaç dakika sürebilir. Proje oluşturulurken:

- Node modules kurulur
- iOS ve Android klasörleri oluşturulur
- Temel yapılandırma dosyaları oluşturulur

**Kontrol:**

```bash
ls -la
# Şunları görmelisiniz:
# - android/
# - ios/
# - src/ (boş olabilir)
# - package.json
# - tsconfig.json
```

---

### 2.2 İlk Build'i Test Et

**Yapılacaklar:**

```bash
# iOS simulator'da çalıştır
npm run ios

# VEYA Xcode'dan:
open ios/SportTrackNative.xcworkspace
# Xcode'da Run butonuna bas (⌘R)
```

**Beklenen Sonuç:**

- iOS Simulator açılır
- "Welcome to React Native" ekranı görünür
- Herhangi bir hata yoksa başarılı!

**Eğer Hata Alırsanız:**

- CocoaPods kurulumunu kontrol et
- Xcode'un tam kurulu olduğundan emin ol
- `cd ios && pod install && cd ..` komutunu çalıştır

---

## 📋 ADIM 3: Gerekli Paketlerin Kurulumu

### 3.1 Navigation Paketleri

**Yapılacaklar:**

```bash
# React Navigation paketleri
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs

# React Navigation bağımlılıkları
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler
```

---

### 3.2 Firebase Paketleri

**Yapılacaklar:**

```bash
# Firebase React Native paketleri
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore

# iOS bağımlılıklarını kur
cd ios && pod install && cd ..
```

**Önemli:** `pod install` komutunu her Firebase paketi ekledikten sonra çalıştır!

---

### 3.3 UI ve Utility Paketleri

**Yapılacaklar:**

```bash
# React Native Paper (UI library)
npm install react-native-paper react-native-vector-icons

# AsyncStorage (localStorage yerine)
npm install @react-native-async-storage/async-storage

# Date-fns (zaten kullanıyoruz, aynı paket)
npm install date-fns

# iOS bağımlılıklarını kur
cd ios && pod install && cd ..
```

---

## 📋 ADIM 4: Firebase Yapılandırması

### 4.1 Firebase Console'da iOS App Oluşturma

**Yapılacaklar:**

1. **Firebase Console'a git:** https://console.firebase.google.com
2. **Mevcut projeyi seç:** sporttrack-c3b18
3. **iOS App ekle:**
   - Project Settings → "Add app" → iOS ikonuna tıkla
   - **Bundle ID:** `com.sporttrack.app` (veya istediğiniz bir ID)
   - **App nickname:** SportTrack iOS (opsiyonel)
   - **App Store ID:** Şimdilik boş bırak
   - "Register app" butonuna tıkla

4. **GoogleService-Info.plist'i indir:**
   - İndirilen dosyayı bul: `GoogleService-Info.plist`
   - Bu dosyayı `ios/` klasörüne kopyala

**Kontrol:**

```bash
ls ios/GoogleService-Info.plist
# Dosya var mı kontrol et
```

---

### 4.2 Xcode'da Firebase Entegrasyonu

**Yapılacaklar:**

1. **Xcode'da projeyi aç:**

   ```bash
   open ios/SportTrackNative.xcworkspace
   ```

2. **GoogleService-Info.plist'i projeye ekle:**
   - Xcode'da sol panelde proje adına sağ tıkla
   - "Add Files to SportTrackNative" seç
   - `GoogleService-Info.plist` dosyasını seç
   - ✅ "Copy items if needed" işaretle
   - ✅ "Add to targets: SportTrackNative" işaretle
   - "Add" butonuna tıkla

3. **Build Settings Kontrolü:**
   - Xcode'da proje seçiliyken "Build Settings" tab'ına git
   - "Bundle Identifier" kontrol et: `com.sporttrack.app` olmalı

---

## 📋 ADIM 5: Proje Yapısını Oluşturma

### 5.1 Klasör Yapısı

**Yapılacaklar:**

```bash
# Proje dizininde
cd SportTrackNative

# Klasör yapısını oluştur
mkdir -p src/lib/stores
mkdir -p src/lib/utils
mkdir -p src/lib/hooks
mkdir -p src/lib/types
mkdir -p src/components
mkdir -p src/components/ui
mkdir -p src/screens
mkdir -p src/navigation
```

**Oluşturulan Yapı:**

```
SportTrackNative/
├── android/
├── ios/
├── src/
│   ├── lib/
│   │   ├── stores/      # Zustand store'ları
│   │   ├── utils/       # Utility fonksiyonları
│   │   ├── hooks/       # Custom hook'lar
│   │   └── types/       # TypeScript type'ları
│   ├── components/      # React Native component'leri
│   │   └── ui/         # UI component library
│   ├── screens/        # Ekran component'leri
│   └── navigation/    # Navigation yapılandırması
├── package.json
└── ...
```

---

## 📋 ADIM 6: İlk Component'i Oluşturma

### 6.1 Button Component

**Yapılacaklar:**
`src/components/ui/Button.tsx` dosyası oluştur:

```typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: '#0ea5e9' };
      case 'secondary':
        return { backgroundColor: '#64748b' };
      case 'outline':
        return { borderWidth: 2, borderColor: '#0ea5e9', backgroundColor: 'transparent' };
      default:
        return { backgroundColor: '#0ea5e9' };
    }
  };

  const getTextStyle = (): TextStyle => {
    if (variant === 'outline') {
      return { color: '#0ea5e9' };
    }
    return { color: '#ffffff' };
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#0ea5e9' : '#ffffff'} />
      ) : (
        <Text style={[styles.text, getTextStyle()]}>{title}</Text>
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
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
```

---

### 6.2 İlk Ekranı Test Et

**Yapılacaklar:**
`App.tsx` dosyasını güncelle:

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './src/components/ui/Button';

function App(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SportTrack Native</Text>
      <Text style={styles.subtitle}>iOS Uygulamasına Hoş Geldiniz!</Text>
      <Button
        title="Test Button"
        onPress={() => console.log('Button pressed!')}
        variant="primary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0ea5e9',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#64748b',
    textAlign: 'center',
  },
});
```

**Test:**

```bash
npm run ios
```

Button görünmeli ve tıklanabilir olmalı!

---

## 📋 ADIM 7: Store'ları Taşıma (AsyncStorage Adaptasyonu)

### 7.1 AsyncStorage Setup

**Yapılacaklar:**
`src/lib/stores/activityStore.ts` dosyası oluştur:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const STORAGE_KEY = 'sporttrack_activities';

interface ActivityRecord {
  id: string;
  activityKey: string;
  label: string;
  amount: number;
  points: number;
  performedAt: string;
  // ... diğer field'lar
}

interface ActivityState {
  activities: ActivityRecord[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addActivity: (activity: ActivityRecord) => Promise<void>;
  updateActivity: (id: string, activity: Partial<ActivityRecord>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
}

export const useActivities = create<ActivityState>((set, get) => ({
  activities: [],
  hydrated: false,

  hydrate: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set({ activities: parsed, hydrated: true });
      } else {
        set({ hydrated: true });
      }
    } catch (error) {
      console.error('Failed to hydrate activities:', error);
      set({ hydrated: true });
    }
  },

  addActivity: async (activity: ActivityRecord) => {
    const newActivities = [...get().activities, activity];
    set({ activities: newActivities });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newActivities));
    } catch (error) {
      console.error('Failed to save activities:', error);
    }
  },

  updateActivity: async (id: string, updates: Partial<ActivityRecord>) => {
    const updatedActivities = get().activities.map((a) => (a.id === id ? { ...a, ...updates } : a));
    set({ activities: updatedActivities });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedActivities));
    } catch (error) {
      console.error('Failed to update activities:', error);
    }
  },

  deleteActivity: async (id: string) => {
    const filteredActivities = get().activities.filter((a) => a.id !== id);
    set({ activities: filteredActivities });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredActivities));
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  },
}));
```

**Önemli:** Mevcut `activityStore.tsx` dosyasındaki tüm logic'i buraya taşı, sadece localStorage → AsyncStorage değişikliği yap!

---

## 📋 ADIM 8: Navigation Yapısı

### 8.1 Navigation Setup

**Yapılacaklar:**
`src/navigation/AppNavigator.tsx` dosyası oluştur:

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens (şimdilik placeholder)
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      {/* Diğer tab'ları ekleyeceğiz */}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

### 8.2 İlk Screen Oluştur

**Yapılacaklar:**
`src/screens/HomeScreen.tsx` dosyası oluştur:

```typescript
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useActivities } from '../lib/stores/activityStore';
import { Button } from '../components/ui/Button';

export default function HomeScreen() {
  const { activities, hydrated, hydrate } = useActivities();

  useEffect(() => {
    if (!hydrated) {
      hydrate();
    }
  }, [hydrated, hydrate]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>SportTrack</Text>
        <Text style={styles.subtitle}>
          {activities.length} aktivite kaydedildi
        </Text>
        <Button
          title="Add Activity"
          onPress={() => console.log('Add activity')}
          variant="primary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0ea5e9',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#64748b',
  },
});
```

---

### 8.3 App.tsx'i Güncelle

**Yapılacaklar:**
`App.tsx` dosyasını güncelle:

```typescript
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return <AppNavigator />;
}

export default App;
```

**Test:**

```bash
npm run ios
```

Navigation çalışmalı ve HomeScreen görünmeli!

---

## 📋 Sonraki Adımlar

1. ✅ **Store'ları taşı:** Tüm store'ları AsyncStorage'a adapte et
2. ✅ **Firebase entegrasyonu:** Cloud sync'i React Native'e taşı
3. ✅ **UI component'leri:** Tüm UI component'lerini React Native'e adapte et
4. ✅ **Screens:** Tüm ekranları oluştur
5. ✅ **Navigation:** Tam navigation yapısını kur
6. ✅ **Native özellikler:** Push notifications, widgets, vb.

---

## ⚠️ Önemli Notlar

1. **localStorage → AsyncStorage:** Tüm localStorage kullanımlarını AsyncStorage'a çevir
2. **Next.js Router → React Navigation:** Tüm navigation'ı React Navigation'a çevir
3. **HTML → React Native:** Tüm HTML elementlerini React Native component'lerine çevir
4. **CSS → StyleSheet:** Tüm CSS class'larını StyleSheet'e çevir
5. **Platform-Specific Code:** iOS ve Android için farklı kod gerekebilir

---

## 🚀 Şimdi Ne Yapmalıyız?

**İlk Adım:** Xcode ve CocoaPods kurulumunu tamamla, sonra React Native projesini oluşturalım!

Hazır olduğunda bana haber ver, birlikte devam edelim! 🎉

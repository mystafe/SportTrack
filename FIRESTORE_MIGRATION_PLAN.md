# Firestore Yapı Değişikliği - Detaylı Yol Haritası

## Mevcut Yapı

```
users/{userId}
  - activities: ActivityRecord[]
  - settings: UserSettings
  - badges: Badge[]
  - challenges: Challenge[]
  - metadata: SyncMetadata
```

## Yeni Yapı

```
users/{userId}
  - points: number
  - lastModified: Timestamp

users/{userId}/activities (collection)
  - {activityKey}: ActivityDefinition (default + custom)

users/{userId}/exercises (collection)
  - {exerciseId}: ActivityRecord (yapılan exercise'ler)

users/{userId}/statistics (collection)
  - overall: StatisticsDocument
  - period-{start}-{end}: StatisticsDocument

users/{userId}/challenges (collection)
  - {challengeId}: Challenge
```

## Adım Adım Uygulama Planı

### 1. Types Güncellemesi ✅

- [x] `src/lib/cloudSync/types.ts` güncellendi
- [x] `StatisticsDocument` interface eklendi
- [x] `CloudData` interface yeni yapıya göre güncellendi

### 2. Statistics Calculator ✅

- [x] `src/lib/cloudSync/statisticsCalculator.ts` oluşturuldu
- [x] `calculateOverallStatistics` fonksiyonu
- [x] `calculatePeriodStatistics` fonksiyonu

### 3. SyncService Güncellemesi (Devam Ediyor)

- [x] Collection reference fonksiyonları eklendi
- [ ] `uploadToCloud` fonksiyonu yeni yapıya göre güncellenecek
- [ ] `downloadFromCloud` fonksiyonu yeni yapıya göre güncellenecek
- [ ] `subscribeToCloud` fonksiyonu yeni yapıya göre güncellenecek

### 4. Conflict Resolution Güncellemesi

- [ ] `conflictResolver.ts` güncellenecek
- [ ] Sadece exercises, activities, lastModified ve points karşılaştırılacak
- [ ] Statistics ve challenges conflict resolution'dan çıkarılacak

### 5. Export/Import Güncellemesi

- [ ] `exportUtils.ts` güncellenecek
- [ ] `DataExportImport.tsx` güncellenecek
- [ ] Yeni yapıya göre export/import yapılacak

### 6. Migration Script

- [ ] Eski yapıdan yeni yapıya geçiş script'i yazılacak
- [ ] Mevcut kullanıcılar için otomatik migration

## Kritik Noktalar

### Activities Collection

- Default activities: BASE_ACTIVITY_DEFINITIONS
- Custom activities: settings.customActivities
- Her activity bir document olarak kaydedilecek (key = activityKey)

### Exercises Collection

- Şu anki activities kayıtları exercises collection'a taşınacak
- Her exercise bir document olarak kaydedilecek (id = exerciseId)

### Statistics Collection

- Overall statistics: Tüm zamanlar için
- Period statistics: Belirli dönemler için (haftalık, aylık)
- Exercise'lerden otomatik hesaplanacak

### Points ve LastModified

- Points: users document'inde field olarak
- LastModified: users document'inde timestamp olarak

## Güvenlik Kuralları (Firestore Rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /activities/{activityId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /exercises/{exerciseId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /statistics/{statId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /challenges/{challengeId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Test Senaryoları

1. ✅ Yeni kullanıcı kaydı
2. ✅ Mevcut kullanıcı migration
3. ✅ Exercise ekleme/güncelleme/silme
4. ✅ Custom activity ekleme
5. ✅ Statistics hesaplama
6. ✅ Conflict resolution
7. ✅ Export/Import
8. ✅ Cloud sync

## Riskler ve Çözümler

### Risk 1: Mevcut kullanıcıların verileri kaybolabilir

**Çözüm**: Migration script ile otomatik geçiş

### Risk 2: Performance sorunları (çok fazla document)

**Çözüm**: Batch operations kullanılacak, pagination eklenecek

### Risk 3: Conflict resolution karmaşıklaşabilir

**Çözüm**: Sadece kritik alanlar karşılaştırılacak (exercises, activities, points, lastModified)

### Risk 4: Statistics hesaplama maliyetli olabilir

**Çözüm**: Cached statistics, sadece değişiklik olduğunda yeniden hesapla

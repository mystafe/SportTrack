# Firestore'dan Toplam Points Sorgulama Örnekleri

## 📋 Genel Bakış

Firestore'da veriler `users/{userId}` dokümanında `activities` array'i içinde saklanıyor. Her aktivite objesi içinde `points` field'ı var.

## 🔍 Yöntem 1: Dokümanı Çekip Client-Side Hesaplama (Mevcut Yapı)

Bu yöntem, mevcut veri yapınızla çalışır ve array içindeki nested field'lar için idealdir.

### Toplam Points

```typescript
import { getTotalPointsFromFirestore } from '@/lib/cloudSync/firestoreQueries';

// Kullanım
const userId = 'user123';
const totalPoints = await getTotalPointsFromFirestore(userId);
console.log('Toplam Points:', totalPoints);
```

### Bugünün Points'i

```typescript
import { getTodayPointsFromFirestore } from '@/lib/cloudSync/firestoreQueries';

const userId = 'user123';
const todayPoints = await getTodayPointsFromFirestore(userId);
console.log('Bugünün Points:', todayPoints);
```

### Tarih Aralığında Points

```typescript
import { getPointsInDateRangeFromFirestore } from '@/lib/cloudSync/firestoreQueries';

const userId = 'user123';
const startDate = new Date('2024-01-01');
const endDate = new Date('2024-01-31');
const monthlyPoints = await getPointsInDateRangeFromFirestore(userId, startDate, endDate);
console.log('Ocak Ayı Points:', monthlyPoints);
```

### Aktivite Tipine Göre Points

```typescript
import { getPointsByActivityTypeFromFirestore } from '@/lib/cloudSync/firestoreQueries';

const userId = 'user123';
const pointsByType = await getPointsByActivityTypeFromFirestore(userId);
pointsByType.forEach((points, activityKey) => {
  console.log(`${activityKey}: ${points} points`);
});
```

### Detaylı İstatistikler

```typescript
import { getPointsStatisticsFromFirestore } from '@/lib/cloudSync/firestoreQueries';

const userId = 'user123';
const stats = await getPointsStatisticsFromFirestore(userId);
console.log('Toplam:', stats.total);
console.log('Bugün:', stats.today);
console.log('Bu Hafta:', stats.thisWeek);
console.log('Bu Ay:', stats.thisMonth);
```

## 🚀 Yöntem 2: Denormalization (Önerilen - Performans İçin)

Eğer sık sık toplam points sorguluyorsanız, Firestore'da `totalPoints` gibi bir field tutmak daha performanslı olur.

### Veri Yapısını Güncelleme

```typescript
// syncService.ts içinde uploadToCloud fonksiyonunu güncelleyin
const totalPoints = data.activities.reduce((sum, activity) => {
  return sum + (activity.points || 0);
}, 0);

const docData = {
  ...cloudData,
  totalPoints, // Toplam points'i ayrı bir field olarak sakla
  metadata: {
    ...metadata,
    lastModified: serverTimestamp(),
  },
};
```

### Sorgulama

```typescript
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

async function getTotalPoints(userId: string): Promise<number> {
  const userDocRef = doc(db, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    return 0;
  }

  const data = userDocSnap.data();
  return data.totalPoints || 0; // Direkt field'dan oku
}
```

## 📊 Yöntem 3: Firestore Aggregation Queries (Firestore 9.9.0+)

Firestore'un yeni aggregation sorguları array içindeki nested field'lar için çalışmaz, ama eğer veri yapınızı değiştirirseniz kullanabilirsiniz.

### Veri Yapısını Değiştirme (Subcollection)

```typescript
// users/{userId}/activities/{activityId} şeklinde subcollection kullan
// Bu durumda aggregation sorguları çalışır
```

### Aggregation Sorgusu Örneği

```typescript
import { collection, query, sum } from 'firebase/firestore';
import { getAggregateFromServer } from 'firebase/firestore';

async function getTotalPointsAggregate(userId: string): Promise<number> {
  const activitiesRef = collection(db, 'users', userId, 'activities');
  const snapshot = await getAggregateFromServer(query(activitiesRef), {
    totalPoints: sum('points'),
  });

  return snapshot.data().totalPoints || 0;
}
```

## ⚡ Performans Karşılaştırması

| Yöntem                | Performans | Karmaşıklık | Önerilen Kullanım                        |
| --------------------- | ---------- | ----------- | ---------------------------------------- |
| Client-Side Hesaplama | Orta       | Düşük       | Küçük veri setleri                       |
| Denormalization       | Yüksek     | Orta        | Sık sorgulanan veriler                   |
| Aggregation Queries   | Yüksek     | Yüksek      | Büyük veri setleri, subcollection yapısı |

## 💡 Öneri

Mevcut yapınız için **Yöntem 1** (Client-Side Hesaplama) en uygun çözüm. Eğer performans sorunu yaşarsanız, **Yöntem 2** (Denormalization) ile `totalPoints` field'ını ekleyebilirsiniz.

## 📝 Örnek Kullanım Senaryoları

### Senaryo 1: Leaderboard için Toplam Points

```typescript
import { getTotalPointsFromFirestore } from '@/lib/cloudSync/firestoreQueries';

async function getLeaderboard() {
  const userIds = ['user1', 'user2', 'user3'];
  const leaderboard = await Promise.all(
    userIds.map(async (userId) => {
      const points = await getTotalPointsFromFirestore(userId);
      return { userId, points };
    })
  );

  return leaderboard.sort((a, b) => b.points - a.points);
}
```

### Senaryo 2: Haftalık Rapor

```typescript
import { getPointsInDateRangeFromFirestore } from '@/lib/cloudSync/firestoreQueries';

async function getWeeklyReport(userId: string) {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weeklyPoints = await getPointsInDateRangeFromFirestore(userId, weekAgo, now);
  return weeklyPoints;
}
```

### Senaryo 3: Real-time Updates

```typescript
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

function subscribeToTotalPoints(userId: string, callback: (points: number) => void) {
  const userDocRef = doc(db, 'users', userId);

  return onSnapshot(userDocRef, (docSnap) => {
    if (!docSnap.exists()) {
      callback(0);
      return;
    }

    const data = docSnap.data();
    const activities = data.activities || [];
    const totalPoints = activities.reduce((sum: number, activity: any) => {
      return sum + (activity.points || 0);
    }, 0);

    callback(totalPoints);
  });
}

// Kullanım
const unsubscribe = subscribeToTotalPoints('user123', (points) => {
  console.log('Güncel toplam points:', points);
});
```

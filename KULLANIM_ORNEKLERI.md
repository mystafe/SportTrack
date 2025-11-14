# Firestore Query Fonksiyonlarını Kullanma Kılavuzu

## 🚀 Hızlı Başlangıç

### 1. React Hook'ları Kullanarak (Önerilen)

En kolay yöntem, hazır React hook'larını kullanmaktır:

```typescript
import { useTotalPoints } from '@/hooks/useFirestoreQueries';

function MyComponent() {
  const { totalPoints, loading, error, refetch } = useTotalPoints();

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div>
      <h2>Toplam Points: {totalPoints}</h2>
      <button onClick={refetch}>Yenile</button>
    </div>
  );
}
```

### 2. Doğrudan Fonksiyonları Kullanarak

Hook kullanmak istemiyorsanız, doğrudan fonksiyonları da kullanabilirsiniz:

```typescript
import { getTotalPointsFromFirestore } from '@/lib/cloudSync/firestoreQueries';
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user } = useAuth();
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    async function fetchPoints() {
      setLoading(true);
      try {
        const points = await getTotalPointsFromFirestore(user.uid);
        setTotalPoints(points);
      } catch (error) {
        console.error('Hata:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPoints();
  }, [user?.uid]);

  return <div>Toplam Points: {totalPoints}</div>;
}
```

## 📚 Mevcut Hook'lar

### `useTotalPoints()`

Toplam points'i alır ve otomatik olarak yeniler.

```typescript
const { totalPoints, loading, error, refetch } = useTotalPoints();
```

**Kullanım Senaryoları:**

- Profil sayfasında toplam points gösterimi
- Leaderboard'da kullanıcı sıralaması
- Başarı rozetleri için kontrol

**Örnek:**

```typescript
function ProfilePage() {
  const { totalPoints, loading } = useTotalPoints();

  return (
    <div>
      <h1>Profilim</h1>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <p>Toplam Points: {totalPoints.toLocaleString()}</p>
      )}
    </div>
  );
}
```

### `useTodayPoints()`

Bugünün points'ini alır ve her dakika otomatik yeniler.

```typescript
const { todayPoints, loading, error, refetch } = useTodayPoints();
```

**Kullanım Senaryoları:**

- Ana sayfada bugünün özeti
- Günlük hedef ilerlemesi
- Canlı güncellemeler

**Örnek:**

```typescript
function HomePage() {
  const { todayPoints, loading } = useTodayPoints();
  const { settings } = useSettings();
  const dailyTarget = settings?.dailyTarget || 10000;

  const progress = (todayPoints / dailyTarget) * 100;

  return (
    <div>
      <h2>Bugün</h2>
      <p>{todayPoints} / {dailyTarget} points</p>
      <div className="progress-bar">
        <div style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
```

### `usePointsStatistics()`

Detaylı istatistikleri alır (total, today, thisWeek, thisMonth).

```typescript
const { statistics, loading, error, refetch } = usePointsStatistics();
```

**Kullanım Senaryoları:**

- İstatistik sayfası
- Dashboard özeti
- Haftalık/aylık raporlar

**Örnek:**

```typescript
function StatsPage() {
  const { statistics, loading } = usePointsStatistics();

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="stats-grid">
      <StatCard title="Toplam" value={statistics.total} />
      <StatCard title="Bugün" value={statistics.today} />
      <StatCard title="Bu Hafta" value={statistics.thisWeek} />
      <StatCard title="Bu Ay" value={statistics.thisMonth} />
    </div>
  );
}
```

### `usePointsByActivityType()`

Aktivite tipine göre points dağılımını alır.

```typescript
const { pointsByType, loading, error, refetch } = usePointsByActivityType();
```

**Kullanım Senaryoları:**

- Aktivite dağılım grafiği
- En çok yapılan aktiviteler
- Aktivite bazlı analiz

**Örnek:**

```typescript
function ActivityBreakdown() {
  const { pointsByType, loading } = usePointsByActivityType();

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div>
      <h2>Aktivite Dağılımı</h2>
      {Array.from(pointsByType.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([activityKey, points]) => (
          <div key={activityKey}>
            <span>{activityKey}:</span>
            <span>{points} points</span>
          </div>
        ))}
    </div>
  );
}
```

### `usePointsInDateRange(startDate, endDate)`

Belirli bir tarih aralığındaki points'i alır.

```typescript
const startDate = new Date('2024-01-01');
const endDate = new Date('2024-01-31');
const { points, loading, error, refetch } = usePointsInDateRange(startDate, endDate);
```

**Kullanım Senaryoları:**

- Aylık raporlar
- Özel tarih aralığı analizi
- Karşılaştırmalı grafikler

**Örnek:**

```typescript
function MonthlyReport() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
  const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);

  const { points, loading } = usePointsInDateRange(startDate, endDate);

  return (
    <div>
      <h2>Ocak Ayı Raporu</h2>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <p>Toplam Points: {points}</p>
      )}
    </div>
  );
}
```

## 🎯 Gerçek Kullanım Örnekleri

### Örnek 1: Ana Sayfada Points Gösterimi

```typescript
// src/app/page.tsx veya src/components/HomePage.tsx
import { useTodayPoints } from '@/hooks/useFirestoreQueries';
import { usePointsStatistics } from '@/hooks/useFirestoreQueries';

export default function HomePage() {
  const { todayPoints, loading: todayLoading } = useTodayPoints();
  const { statistics, loading: statsLoading } = usePointsStatistics();

  return (
    <div>
      <h1>Hoş Geldiniz!</h1>

      {/* Bugünün Points'i */}
      <div className="today-card">
        <h2>Bugün</h2>
        {todayLoading ? (
          <p>Yükleniyor...</p>
        ) : (
          <p className="text-3xl font-bold">{todayPoints}</p>
        )}
      </div>

      {/* Haftalık Özet */}
      <div className="weekly-summary">
        <h2>Bu Hafta</h2>
        {statsLoading ? (
          <p>Yükleniyor...</p>
        ) : (
          <p>{statistics.thisWeek} points</p>
        )}
      </div>
    </div>
  );
}
```

### Örnek 2: İstatistik Sayfasında Detaylı Bilgi

```typescript
// src/app/stats/page.tsx
import { usePointsStatistics } from '@/hooks/useFirestoreQueries';
import { usePointsByActivityType } from '@/hooks/useFirestoreQueries';

export default function StatsPage() {
  const { statistics, loading: statsLoading } = usePointsStatistics();
  const { pointsByType, loading: typeLoading } = usePointsByActivityType();

  return (
    <div>
      <h1>İstatistikler</h1>

      {/* Genel İstatistikler */}
      <div className="stats-grid">
        <StatCard title="Toplam" value={statistics.total} />
        <StatCard title="Bugün" value={statistics.today} />
        <StatCard title="Bu Hafta" value={statistics.thisWeek} />
        <StatCard title="Bu Ay" value={statistics.thisMonth} />
      </div>

      {/* Aktivite Dağılımı */}
      <div className="activity-breakdown">
        <h2>Aktivite Dağılımı</h2>
        {typeLoading ? (
          <p>Yükleniyor...</p>
        ) : (
          <ActivityChart data={pointsByType} />
        )}
      </div>
    </div>
  );
}
```

### Örnek 3: Leaderboard için Toplam Points

```typescript
// src/components/Leaderboard.tsx
import { getTotalPointsFromFirestore } from '@/lib/cloudSync/firestoreQueries';

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<Array<{ userId: string; points: number }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        // Tüm kullanıcıların ID'lerini al (bu örnek için)
        const userIds = ['user1', 'user2', 'user3'];

        const points = await Promise.all(
          userIds.map(async (userId) => {
            const totalPoints = await getTotalPointsFromFirestore(userId);
            return { userId, points: totalPoints };
          })
        );

        // Points'e göre sırala
        points.sort((a, b) => b.points - a.points);
        setLeaderboard(points);
      } catch (error) {
        console.error('Leaderboard yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div>
      <h1>Liderlik Tablosu</h1>
      {leaderboard.map((entry, index) => (
        <div key={entry.userId}>
          {index + 1}. Kullanıcı {entry.userId}: {entry.points} points
        </div>
      ))}
    </div>
  );
}
```

### Örnek 4: Haftalık Rapor

```typescript
// src/components/WeeklyReport.tsx
import { usePointsInDateRange } from '@/hooks/useFirestoreQueries';

export function WeeklyReport() {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { points, loading } = usePointsInDateRange(weekAgo, now);

  return (
    <div>
      <h2>Son 7 Gün</h2>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <p>Toplam Points: {points}</p>
      )}
    </div>
  );
}
```

## ⚠️ Önemli Notlar

1. **Authentication Kontrolü**: Tüm hook'lar otomatik olarak kullanıcı giriş yapmış mı kontrol eder. Giriş yapılmamışsa `0` döner.

2. **Loading States**: Her hook bir `loading` state'i döner. UI'da loading durumunu gösterin.

3. **Error Handling**: Her hook bir `error` state'i döner. Hataları kullanıcıya gösterin.

4. **Refetch**: Her hook bir `refetch` fonksiyonu döner. Manuel yenileme için kullanabilirsiniz.

5. **Performance**: Hook'lar otomatik olarak cache'lenir ve gereksiz yere yeniden sorgu yapmaz.

## 🔄 Otomatik Yenileme

Bazı hook'lar otomatik olarak yenilenir:

- `useTodayPoints()`: Her 1 dakikada bir
- `usePointsStatistics()`: Her 5 dakikada bir

Manuel yenileme için `refetch()` fonksiyonunu kullanın.

## 📝 Örnek Component'ler

Hazır component örnekleri için `src/components/FirestorePointsDisplay.tsx` dosyasına bakabilirsiniz.

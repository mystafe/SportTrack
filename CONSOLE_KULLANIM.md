# Tarayıcı Console'dan Firestore Query Kullanımı

## 🚀 Hızlı Başlangıç

Uygulama yüklendikten sonra, tarayıcı console'unda (F12) şu komutları kullanabilirsiniz:

```javascript
// Yardım menüsünü göster
fq.help();

// Veya
window.firestoreQueries.help();
```

## 📋 Mevcut Fonksiyonlar

### 1. Toplam Points

```javascript
// Mevcut kullanıcı için (giriş yapmışsanız)
await fq.getTotalPoints();

// Belirli bir kullanıcı için
await fq.getTotalPoints('user123');
```

**Çıktı:**

```
✅ Toplam Points (user123): 15234
```

### 2. Bugünün Points'i

```javascript
await fq.getTodayPoints();
```

**Çıktı:**

```
✅ Bugünün Points (user123): 1250
```

### 3. Detaylı İstatistikler

```javascript
await fq.getStats();
```

**Çıktı:**

```
✅ İstatistikler (user123): {total: 15234, today: 1250, thisWeek: 8500, thisMonth: 12000}
```

Ayrıca console'da tablo formatında da gösterilir.

### 4. Aktivite Tipine Göre Points

```javascript
await fq.getPointsByType();
```

**Çıktı:**

```
✅ Aktivite Tipine Göre Points (user123):
┌─────────────┬────────┐
│  activity   │ points │
├─────────────┼────────┤
│   WALKING   │  5000  │
│   RUNNING   │  3000  │
│  SWIMMING   │  2000  │
└─────────────┴────────┘
```

### 5. Tarih Aralığında Points

```javascript
await fq.getPointsInRange(null, '2024-01-01', '2024-01-31');
```

**Çıktı:**

```
✅ Tarih Aralığı Points (user123): 8500
   Başlangıç: 2024-01-01
   Bitiş: 2024-01-31
```

### 6. Mevcut Kullanıcı ID'si

```javascript
fq.getCurrentUserId();
```

**Çıktı:**

```
✅ Mevcut Kullanıcı ID: user123
```

### 7. Ham Kullanıcı Dokümanı

```javascript
await fq.getUserDoc();
```

**Çıktı:**

```
✅ Kullanıcı Dokümanı (user123): {activities: [...], badges: [...], ...}
📊 Activities: 45
🏆 Badges: 12
🎯 Challenges: 5
💯 Toplam Points (hesaplanan): 15234
```

## 💡 Pratik Örnekler

### Örnek 1: Hızlı Kontrol

```javascript
// Mevcut kullanıcının ID'sini al
const userId = fq.getCurrentUserId();

// Toplam points'i kontrol et
const total = await fq.getTotalPoints(userId);
console.log('Toplam:', total);

// Bugünün points'ini kontrol et
const today = await fq.getTodayPoints(userId);
console.log('Bugün:', today);
```

### Örnek 2: Detaylı Analiz

```javascript
// Tüm istatistikleri al
const stats = await fq.getStats();
console.log('İstatistikler:', stats);

// Aktivite dağılımını gör
const byType = await fq.getPointsByType();
console.log('Aktivite Dağılımı:', byType);

// Ham veriyi incele
const rawData = await fq.getUserDoc();
console.log('Ham Veri:', rawData);
```

### Örnek 3: Tarih Aralığı Analizi

```javascript
// Bu ayın points'ini hesapla
const now = new Date();
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

const thisMonth = await fq.getPointsInRange(
  null,
  firstDay.toISOString().split('T')[0],
  lastDay.toISOString().split('T')[0]
);
console.log('Bu Ay:', thisMonth);

// Geçen ayın points'ini hesapla
const lastMonthFirst = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const lastMonthLast = new Date(now.getFullYear(), now.getMonth(), 0);

const lastMonth = await fq.getPointsInRange(
  null,
  lastMonthFirst.toISOString().split('T')[0],
  lastMonthLast.toISOString().split('T')[0]
);
console.log('Geçen Ay:', lastMonth);
```

### Örnek 4: Karşılaştırma

```javascript
// İki kullanıcıyı karşılaştır
const user1 = 'user123';
const user2 = 'user456';

const [points1, points2] = await Promise.all([fq.getTotalPoints(user1), fq.getTotalPoints(user2)]);

console.log(`${user1}: ${points1} points`);
console.log(`${user2}: ${points2} points`);
console.log(`Fark: ${Math.abs(points1 - points2)} points`);
```

### Örnek 5: Aktivite Analizi

```javascript
// En çok points getiren aktiviteyi bul
const byType = await fq.getPointsByType();
const activities = Array.from(byType.entries())
  .map(([key, points]) => ({ activity: key, points }))
  .sort((a, b) => b.points - a.points);

console.log('En Çok Points Getiren Aktiviteler:');
activities.forEach((item, index) => {
  console.log(`${index + 1}. ${item.activity}: ${item.points} points`);
});
```

## 🔧 Kısayollar

İki farklı şekilde erişebilirsiniz:

```javascript
// Uzun versiyon
window.firestoreQueries.getTotalPoints();

// Kısa versiyon (önerilen)
fq.getTotalPoints();
```

## ⚠️ Önemli Notlar

1. **Async/Await**: Tüm sorgu fonksiyonları `async` olduğu için `await` kullanmanız gerekir.

2. **User ID**: Eğer giriş yapmışsanız, `userId` parametresini atlayabilirsiniz. Fonksiyon otomatik olarak mevcut kullanıcıyı kullanır.

3. **Hata Yönetimi**: Hatalar console'da gösterilir. Try-catch kullanabilirsiniz:

```javascript
try {
  const points = await fq.getTotalPoints();
  console.log('Başarılı:', points);
} catch (error) {
  console.error('Hata:', error);
}
```

4. **Yardım**: Her zaman `fq.help()` ile mevcut fonksiyonları görebilirsiniz.

## 🎯 Debug İçin Kullanım

Console'dan hızlıca veri kontrolü yapmak için:

```javascript
// Hızlı kontrol scripti
(async () => {
  const userId = fq.getCurrentUserId();
  if (!userId) {
    console.error('Giriş yapılmamış!');
    return;
  }

  console.log('=== Hızlı Kontrol ===');
  console.log('User ID:', userId);
  console.log('Toplam:', await fq.getTotalPoints());
  console.log('Bugün:', await fq.getTodayPoints());
  const stats = await fq.getStats();
  console.log('Bu Hafta:', stats.thisWeek);
  console.log('Bu Ay:', stats.thisMonth);
})();
```

Bu script'i console'a yapıştırıp Enter'a basın, tüm bilgileri göreceksiniz!

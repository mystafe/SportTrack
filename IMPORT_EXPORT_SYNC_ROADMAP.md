# Import/Export/Sync İyileştirme Yol Haritası

## 📊 Mevcut Durum Analizi

### ✅ Mevcut Özellikler

- ✅ Temel JSON import/export
- ✅ CSV, PDF, JSON export formatları
- ✅ Apple Health import (CSV/XML)
- ✅ Cloud sync (Firebase)
- ✅ Conflict resolution dialog
- ✅ Legacy format conversion
- ✅ Basic data validation
- ✅ Progress indicator (Apple Health için)

### ❌ Eksikler ve İyileştirme Alanları

---

## 🎯 Öncelikli İyileştirmeler

### 1. Import İyileştirmeleri

#### 1.1 Import Preview (Öncelik: Yüksek)

**Sorun:** Kullanıcı import etmeden önce neyin import edileceğini göremiyor.

**Çözüm:**

- Import edilecek verilerin önizlemesini göster
- İstatistikler: kaç aktivite, rozet, challenge
- Tarih aralığı gösterimi
- Çakışan kayıtları uyar
- Kullanıcı onayladıktan sonra import et

**Faydalar:**

- Kullanıcı neyin import edileceğini bilir
- Yanlış import riski azalır
- Daha güvenli import süreci

#### 1.2 Progress Indicator (Öncelik: Yüksek)

**Sorun:** Büyük dosyalar için import sırasında progress gösterilmiyor.

**Çözüm:**

- Import sırasında progress bar göster
- İşlenen/toplam kayıt sayısı
- Tahmini kalan süre
- İptal butonu

**Faydalar:**

- Kullanıcı import durumunu görür
- Büyük dosyalar için daha iyi UX

#### 1.3 Partial Import & Error Handling (Öncelik: Orta)

**Sorun:** Bir kayıt hatalıysa tüm import başarısız oluyor.

**Çözüm:**

- Hatalı kayıtları atlayıp devam et
- Import sonrası hata raporu göster
- Hangi kayıtların import edildiğini/edilmediğini listele
- Kullanıcıya seçenek sun: tümünü import et veya sadece geçerli olanları

**Faydalar:**

- Daha esnek import süreci
- Kısmi veri kaybı önlenir

#### 1.4 Data Validation & Integrity Checks (Öncelik: Orta)

**Sorun:** Import edilen verilerin doğruluğu yeterince kontrol edilmiyor.

**Çözüm:**

- Tarih validasyonu (gelecek tarih kontrolü)
- Aktivite key validasyonu (mevcut aktivitelerle eşleşme)
- Duplicate detection (aynı ID'ye sahip kayıtlar)
- Data integrity checks (eksik alanlar, geçersiz değerler)
- Import öncesi validation raporu

**Faydalar:**

- Daha güvenilir veri
- Hatalı veri import edilmez

#### 1.5 Rollback Mechanism (Öncelik: Düşük)

**Sorun:** Import başarısız olursa veya yanlış import edilirse geri alma yok.

**Çözüm:**

- Import öncesi backup al
- Import başarısız olursa otomatik rollback
- Manuel rollback seçeneği
- Import history tut

**Faydalar:**

- Veri kaybı riski azalır
- Güvenli import süreci

---

### 2. Export İyileştirmeleri

#### 2.1 Export Dialog İyileştirmeleri (Öncelik: Orta)

**Sorun:** ExportDialog var ama kullanıcı kolay erişemiyor ve özellikler sınırlı.

**Çözüm:**

- ExportDialog'u daha erişilebilir yap
- Export butonuna tıklandığında dialog açılsın
- Daha fazla filtre seçeneği:
  - Aktivite tipi filtreleri
  - Minimum/maksimum puan filtreleri
  - Aktivite kategorisi filtreleri
- Export önizlemesi (kaç kayıt export edilecek)

**Faydalar:**

- Daha esnek export seçenekleri
- Kullanıcı ihtiyacına göre export yapabilir

#### 2.2 Scheduled Exports (Öncelik: Düşük)

**Sorun:** Otomatik export yok, kullanıcı manuel export yapmak zorunda.

**Çözüm:**

- Haftalık/aylık otomatik export
- Email'e gönder (opsiyonel)
- Cloud storage'a otomatik yükle (Google Drive, Dropbox)

**Faydalar:**

- Veri yedekleme otomatikleşir
- Kullanıcı unutursa bile backup alınır

#### 2.3 Export Format İyileştirmeleri (Öncelik: Düşük)

**Sorun:** CSV ve PDF export formatları temel seviyede.

**Çözüm:**

- CSV: Daha detaylı kolonlar, grafik verileri
- PDF: Daha güzel tasarım, grafikler, istatistikler
- Excel formatı desteği (.xlsx)
- JSON: Daha yapılandırılmış format

**Faydalar:**

- Daha profesyonel export dosyaları
- Farklı kullanım senaryolarına uygun

---

### 3. Sync İyileştirmeleri

#### 3.1 Offline Sync Queue (Öncelik: Yüksek)

**Sorun:** Offline iken yapılan değişiklikler sync edilmiyor, bağlantı kurulunca sync edilmiyor.

**Çözüm:**

- Offline değişiklikleri queue'ya al
- Bağlantı kurulunca otomatik sync et
- Queue durumunu göster (kaç değişiklik bekliyor)
- Manuel sync butonu

**Faydalar:**

- Offline çalışma desteği
- Veri kaybı önlenir

#### 3.2 Sync Status & History (Öncelik: Orta)

**Sorun:** Sync durumu ve geçmişi görüntülenemiyor.

**Çözüm:**

- Detaylı sync status gösterimi:
  - Son sync zamanı
  - Sync durumu (başarılı/başarısız)
  - Sync edilen kayıt sayısı
  - Sync hızı
- Sync history:
  - Geçmiş sync işlemleri
  - Hata logları
  - Başarılı sync sayısı

**Faydalar:**

- Kullanıcı sync durumunu takip edebilir
- Sorun tespiti kolaylaşır

#### 3.3 Sync Retry & Error Recovery (Öncelik: Orta)

**Sorun:** Sync başarısız olursa otomatik retry yok.

**Çözüm:**

- Otomatik retry mekanizması (exponential backoff)
- Max retry sayısı
- Retry durumunu göster
- Manuel retry butonu
- Detaylı hata mesajları

**Faydalar:**

- Geçici ağ sorunlarında otomatik çözüm
- Daha güvenilir sync

#### 3.4 Conflict Resolution UI İyileştirmeleri (Öncelik: Düşük)

**Sorun:** Conflict resolution dialog iyi ama daha detaylı olabilir.

**Çözüm:**

- Çakışan kayıtların detaylı listesi
- Kayıt bazında karşılaştırma
- Merge preview (birleştirme önizlemesi)
- Toplu seçim (tüm çakışmaları aynı stratejiyle çöz)

**Faydalar:**

- Daha kontrollü conflict resolution
- Kullanıcı ne yaptığını daha iyi anlar

#### 3.5 Sync Scheduling (Öncelik: Düşük)

**Sorun:** Sync sadece manuel veya değişiklik sonrası tetikleniyor.

**Çözüm:**

- Periyodik sync (her X dakikada bir)
- Kullanıcı tanımlı sync zamanları
- Wi-Fi bağlantısında otomatik sync
- Batarya tasarrufu modu (sync'i azalt)

**Faydalar:**

- Otomatik sync
- Daha güncel veri

---

### 4. Data Management İyileştirmeleri

#### 4.1 Duplicate Detection & Removal (Öncelik: Orta)

**Sorun:** Aynı aktivite birden fazla kez eklenebiliyor.

**Çözüm:**

- Import sırasında duplicate detection
- Duplicate removal tool
- Duplicate detection ayarları (tarih, aktivite, miktar bazlı)
- Duplicate listesi ve toplu silme

**Faydalar:**

- Veri kalitesi artar
- Duplicate kayıtlar temizlenir

#### 4.2 Data Migration & Versioning (Öncelik: Düşük)

**Sorun:** Veri formatı değiştiğinde eski veriler uyumlu olmayabilir.

**Çözüm:**

- Otomatik data migration
- Version kontrolü
- Migration history
- Rollback seçeneği

**Faydalar:**

- Format değişikliklerinde sorunsuz geçiş
- Geriye dönük uyumluluk

---

## 🚀 Uygulama Öncelikleri

### Sprint 1: Kritik İyileştirmeler (1-2 hafta)

1. ✅ Import Preview
2. ✅ Progress Indicator (normal import için)
3. ✅ Offline Sync Queue
4. ✅ Data Validation & Integrity Checks

### Sprint 2: Önemli İyileştirmeler (2-3 hafta)

1. ✅ Partial Import & Error Handling
2. ✅ Sync Status & History
3. ✅ Sync Retry & Error Recovery
4. ✅ Export Dialog İyileştirmeleri

### Sprint 3: İsteğe Bağlı İyileştirmeler (3-4 hafta)

1. ✅ Duplicate Detection & Removal
2. ✅ Conflict Resolution UI İyileştirmeleri
3. ✅ Rollback Mechanism
4. ✅ Export Format İyileştirmeleri

### Sprint 4: Gelecek Özellikler (4+ hafta)

1. ✅ Scheduled Exports
2. ✅ Sync Scheduling
3. ✅ Data Migration & Versioning

---

## 📝 Detaylı Özellik Açıklamaları

### Import Preview Component

```typescript
interface ImportPreviewProps {
  file: File;
  onConfirm: () => void;
  onCancel: () => void;
}

// Gösterilecek bilgiler:
// - Toplam aktivite sayısı
// - Tarih aralığı
// - Aktivite tipleri dağılımı
// - Çakışan kayıtlar (varsa)
// - Import edilecek rozetler/challenges
```

### Progress Indicator Component

```typescript
interface ImportProgressProps {
  processed: number;
  total: number;
  percentage: number;
  currentItem?: string;
  errors?: string[];
  onCancel?: () => void;
}
```

### Offline Sync Queue

```typescript
interface SyncQueueItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  collection: 'exercises' | 'activities' | 'settings' | 'badges' | 'challenges';
  data: any;
  timestamp: Date;
  retryCount: number;
}

// Queue management:
// - Add to queue when offline
// - Process queue when online
// - Retry failed items
// - Show queue status in UI
```

### Sync Status Component

```typescript
interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncStatus: 'success' | 'failed' | 'pending' | 'idle';
  pendingChanges: number;
  syncHistory: SyncHistoryItem[];
}

interface SyncHistoryItem {
  timestamp: Date;
  status: 'success' | 'failed';
  itemsSynced: number;
  error?: string;
}
```

---

## 🎨 UI/UX İyileştirmeleri

### Import Flow

1. Dosya seç
2. Preview göster
3. Validation raporu
4. Onay al
5. Progress göster
6. Sonuç raporu

### Export Flow

1. Export butonuna tıkla
2. Format ve filtreleri seç
3. Preview göster
4. Export et
5. Başarı mesajı

### Sync Flow

1. Otomatik sync (arka planda)
2. Status gösterimi
3. Hata durumunda retry
4. Conflict resolution (gerekirse)

---

## 🔧 Teknik Detaylar

### Yeni Hook'lar

- `useImportPreview` - Import önizlemesi için
- `useSyncQueue` - Offline sync queue yönetimi
- `useSyncStatus` - Sync durumu takibi
- `useDataValidation` - Veri doğrulama

### Yeni Component'ler

- `ImportPreviewDialog` - Import önizleme dialog'u
- `ImportProgress` - Progress indicator
- `SyncStatusIndicator` - Sync durumu göstergesi
- `SyncHistory` - Sync geçmişi
- `DuplicateDetectionDialog` - Duplicate detection ve temizleme

### Yeni Utility Functions

- `validateImportData` - Import verisi doğrulama
- `detectDuplicates` - Duplicate detection
- `createBackup` - Backup oluşturma
- `rollbackImport` - Import geri alma

---

## 📊 Metrikler ve Takip

### Başarı Metrikleri

- Import başarı oranı
- Sync başarı oranı
- Ortalama sync süresi
- Hata oranı
- Kullanıcı memnuniyeti

### İzleme

- Import işlem sayısı
- Export işlem sayısı
- Sync işlem sayısı
- Conflict sayısı
- Hata türleri ve sıklığı

---

## 🎯 Sonuç

Bu yol haritası, import/export/sync sistemini daha güvenilir, kullanıcı dostu ve özellik açısından zengin hale getirmeyi hedefler. Öncelikler kullanıcı deneyimi ve veri güvenliği temel alınarak belirlenmiştir.

/**
 * Sync Debug Utilities
 * Helper functions to debug sync issues from console
 */

import { cloudSyncService } from './cloudSync/syncService';
import { syncHistoryService } from './cloudSync/syncHistory';
import { auth } from './firebase/config';

const INITIAL_SYNC_COMPLETE_KEY = 'sporttrack_initial_sync_complete';
const CONFLICT_STORAGE_KEY = 'sporttrack_sync_conflict';
const LAST_SYNC_TIME_KEY = 'sporttrack_last_sync_time';

export const syncDebug = {
  /**
   * Check sync status
   */
  checkStatus() {
    const userId = auth?.currentUser?.uid;
    const isConfigured = cloudSyncService.isConfigured();
    const initialSyncComplete = localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY) === 'true';
    const hasConflict = localStorage.getItem(CONFLICT_STORAGE_KEY) !== null;
    const lastSyncTime = localStorage.getItem(LAST_SYNC_TIME_KEY);

    console.log('📊 Sync Durumu:', {
      userId: userId || 'Giriş yapılmamış',
      isConfigured,
      initialSyncComplete,
      hasConflict,
      lastSyncTime: lastSyncTime
        ? new Date(parseInt(lastSyncTime, 10)).toLocaleString()
        : 'Hiç sync yapılmamış',
    });

    if (!userId) {
      console.warn('⚠️ Giriş yapılmamış!');
    }
    if (!isConfigured) {
      console.warn('⚠️ Firebase yapılandırılmamış!');
    }
    if (!initialSyncComplete) {
      console.warn('⚠️ Initial sync tamamlanmamış!');
    }
    if (hasConflict) {
      console.warn('⚠️ Bekleyen conflict var!');
      const conflictData = localStorage.getItem(CONFLICT_STORAGE_KEY);
      console.log('Conflict data:', conflictData ? JSON.parse(conflictData) : null);
    }

    return {
      userId,
      isConfigured,
      initialSyncComplete,
      hasConflict,
      lastSyncTime: lastSyncTime ? parseInt(lastSyncTime, 10) : null,
    };
  },

  /**
   * Reset sync flags (for debugging)
   */
  resetFlags() {
    localStorage.removeItem(INITIAL_SYNC_COMPLETE_KEY);
    localStorage.removeItem(CONFLICT_STORAGE_KEY);
    localStorage.removeItem(LAST_SYNC_TIME_KEY);
    console.log("✅ Sync flag'leri temizlendi. Sayfayı yenileyin.");
  },

  /**
   * Force initial sync complete
   */
  forceInitialSyncComplete() {
    localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
    console.log('✅ Initial sync flag manuel olarak set edildi. Auto-sync başlayabilir.');
  },

  /**
   * Get sync history from localStorage
   */
  getSyncHistory() {
    const lastSyncTime = localStorage.getItem(LAST_SYNC_TIME_KEY);
    const initialSyncComplete = localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY);
    const conflict = localStorage.getItem(CONFLICT_STORAGE_KEY);

    console.log('📜 Sync Geçmişi:', {
      lastSyncTime: lastSyncTime ? new Date(parseInt(lastSyncTime, 10)).toLocaleString() : 'Yok',
      initialSyncComplete: initialSyncComplete ? 'Tamamlandı' : 'Tamamlanmadı',
      hasConflict: conflict ? 'Var' : 'Yok',
    });

    return {
      lastSyncTime: lastSyncTime ? parseInt(lastSyncTime, 10) : null,
      initialSyncComplete: initialSyncComplete === 'true',
      conflict: conflict ? JSON.parse(conflict) : null,
    };
  },

  /**
   * Test sync manually
   */
  async testSync() {
    const userId = auth?.currentUser?.uid;
    if (!userId) {
      console.error('❌ Giriş yapılmamış!');
      return;
    }

    if (!cloudSyncService.isConfigured()) {
      console.error('❌ Firebase yapılandırılmamış!');
      return;
    }

    console.log('🧪 Manuel sync testi başlatılıyor...');
    console.log('💡 Not: Bu fonksiyon sadece durum kontrolü yapar');
    console.log('💡 Gerçek sync için Settings > Cloud Sync > Upload butonunu kullanın');

    const status = this.checkStatus();
    return status;
  },

  /**
   * Force trigger sync by clearing last sync ref
   */
  forceSync() {
    console.log('🔄 Force sync: Last sync ref temizleniyor...');
    console.log('💡 Sayfayı yenileyin veya bir aktivite ekleyin');
    console.log(
      '⚠️ Not: Bu sadece debug için. Gerçek sync için Settings > Cloud Sync > Upload kullanın'
    );

    // Clear last sync time to allow immediate sync
    localStorage.removeItem(LAST_SYNC_TIME_KEY);
    console.log('✅ Last sync time temizlendi');
  },

  /**
   * Get detailed sync status
   */
  getStatus() {
    const userId = auth?.currentUser?.uid;
    const isConfigured = cloudSyncService.isConfigured();
    const initialSyncComplete = localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY) === 'true';
    const hasConflict = localStorage.getItem(CONFLICT_STORAGE_KEY) !== null;
    const lastSyncTime = localStorage.getItem(LAST_SYNC_TIME_KEY);
    const statistics = syncHistoryService.getStatistics();

    const status = {
      userId: userId || 'Giriş yapılmamış',
      isConfigured,
      isAuthenticated: !!userId,
      initialSyncComplete,
      hasConflict,
      lastSyncTime: lastSyncTime
        ? new Date(parseInt(lastSyncTime, 10)).toLocaleString()
        : 'Hiç sync yapılmamış',
      statistics: {
        totalSyncs: statistics.totalSyncs,
        successfulSyncs: statistics.successfulSyncs,
        failedSyncs: statistics.failedSyncs,
        averageDuration: Math.round(statistics.averageSyncDuration),
        lastSyncTime: statistics.lastSyncTime ? statistics.lastSyncTime.toLocaleString() : 'Yok',
        lastSuccessfulSyncTime: statistics.lastSuccessfulSyncTime
          ? statistics.lastSuccessfulSyncTime.toLocaleString()
          : 'Yok',
        itemsSyncedToday: statistics.itemsSyncedToday,
        itemsSyncedThisWeek: statistics.itemsSyncedThisWeek,
      },
    };

    console.log('📊 Detaylı Sync Durumu:', status);
    return status;
  },

  /**
   * Get sync history
   */
  getHistory(limit: number = 10) {
    const history = syncHistoryService.getHistory(limit);
    console.log(`📜 Son ${limit} Sync İşlemi:`, history);
    return history;
  },

  /**
   * Clear all flags
   */
  clearFlags() {
    localStorage.removeItem(INITIAL_SYNC_COMPLETE_KEY);
    localStorage.removeItem(CONFLICT_STORAGE_KEY);
    localStorage.removeItem(LAST_SYNC_TIME_KEY);
    console.log("✅ Tüm sync flag'leri temizlendi. Sayfayı yenileyin.");
  },

  /**
   * Simulate conflict (for testing)
   */
  simulateConflict() {
    const mockConflict = {
      local: {
        activities: [{ id: 'test-local', activityKey: 'walking', amount: 1000 }],
        badges: [],
        challenges: [],
        settings: null,
      },
      cloud: {
        activities: [{ id: 'test-cloud', activityKey: 'running', amount: 500 }],
        badges: [],
        challenges: [],
        settings: null,
      },
    };
    localStorage.setItem(CONFLICT_STORAGE_KEY, JSON.stringify(mockConflict));
    console.log('⚠️ Mock conflict oluşturuldu. Sayfayı yenileyin.');
    return mockConflict;
  },

  /**
   * Test download from cloud
   */
  async testDownload() {
    const userId = auth?.currentUser?.uid;
    if (!userId) {
      console.error('❌ Giriş yapılmamış!');
      return null;
    }

    if (!cloudSyncService.isConfigured()) {
      console.error('❌ Firebase yapılandırılmamış!');
      return null;
    }

    console.log('🧪 Cloud download testi başlatılıyor...');
    try {
      const data = await cloudSyncService.downloadFromCloud();
      console.log('✅ Download başarılı:', {
        exercises: data?.exercises?.length || 0,
        activities: data?.activities?.length || 0,
        badges: data?.badges?.length || 0,
        challenges: data?.challenges?.length || 0,
        points: data?.points || 0,
      });
      return data;
    } catch (error) {
      console.error('❌ Download hatası:', error);
      return null;
    }
  },

  /**
   * Test upload to cloud
   */
  async testUpload() {
    const userId = auth?.currentUser?.uid;
    if (!userId) {
      console.error('❌ Giriş yapılmamış!');
      return false;
    }

    if (!cloudSyncService.isConfigured()) {
      console.error('❌ Firebase yapılandırılmamış!');
      return false;
    }

    console.log('🧪 Cloud upload testi başlatılıyor...');
    console.log('💡 Not: Bu fonksiyon gerçek veri upload etmez, sadece bağlantıyı test eder');
    console.log('💡 Gerçek upload için Settings > Cloud Sync > Upload kullanın');

    // Just test the connection
    try {
      const testData = await cloudSyncService.downloadFromCloud();
      console.log('✅ Cloud bağlantısı başarılı. Veri okunabilir.');
      return true;
    } catch (error) {
      console.error('❌ Cloud bağlantı hatası:', error);
      return false;
    }
  },

  /**
   * Show help
   */
  help() {
    console.log(`
🔧 Sync Debug Yardımcıları
============================

Mevcut Fonksiyonlar:

1. syncDebug.checkStatus()
   → Sync durumunu kontrol eder
   → Örnek: syncDebug.checkStatus()

2. syncDebug.getStatus()
   → Detaylı sync durumu (statistics dahil)
   → Örnek: syncDebug.getStatus()

3. syncDebug.getHistory(limit?)
   → Sync geçmişini gösterir (default: 10)
   → Örnek: syncDebug.getHistory(20)

4. syncDebug.resetFlags()
   → Tüm sync flag'lerini temizler
   → Örnek: syncDebug.resetFlags()

5. syncDebug.clearFlags()
   → Flag'leri temizle (resetFlags ile aynı)
   → Örnek: syncDebug.clearFlags()

6. syncDebug.forceInitialSyncComplete()
   → Initial sync flag'ini manuel set eder
   → Örnek: syncDebug.forceInitialSyncComplete()

7. syncDebug.forceSync()
   → Last sync time'ı temizler (throttle'ı bypass eder)
   → Örnek: syncDebug.forceSync()

8. syncDebug.simulateConflict()
   → Mock conflict oluşturur (test için)
   → Örnek: syncDebug.simulateConflict()

9. syncDebug.testDownload()
   → Cloud'dan download testi yapar
   → Örnek: await syncDebug.testDownload()

10. syncDebug.testUpload()
    → Cloud bağlantı testi yapar
    → Örnek: await syncDebug.testUpload()

11. syncDebug.help()
    → Bu yardım mesajını gösterir

Kullanım:
  syncDebug.getStatus()      → Detaylı durum
  syncDebug.getHistory(10)   → Son 10 sync
  syncDebug.clearFlags()     → Flag'leri temizle
    `);
  },
};

// Make available in console
if (typeof window !== 'undefined') {
  (window as any).syncDebug = syncDebug;
  console.log('✅ Sync Debug helpers yüklendi! syncDebug.help() ile başlayın.');
}

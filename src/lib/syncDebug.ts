/**
 * Sync Debug Utilities
 * Helper functions to debug sync issues from console
 */

import { cloudSyncService } from './cloudSync/syncService';
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

2. syncDebug.resetFlags()
   → Tüm sync flag'lerini temizler
   → Örnek: syncDebug.resetFlags()

3. syncDebug.forceInitialSyncComplete()
   → Initial sync flag'ini manuel set eder
   → Örnek: syncDebug.forceInitialSyncComplete()

4. syncDebug.getSyncHistory()
   → Sync geçmişini gösterir
   → Örnek: syncDebug.getSyncHistory()

5. syncDebug.testSync()
   → Manuel sync testi yapar
   → Örnek: await syncDebug.testSync()

6. syncDebug.forceSync()
   → Last sync time'ı temizler (throttle'ı bypass eder)
   → Örnek: syncDebug.forceSync()

7. syncDebug.help()
   → Bu yardım mesajını gösterir

Kullanım:
  syncDebug.checkStatus()  → Durum kontrolü
  syncDebug.resetFlags()   → Flag'leri temizle
    `);
  },
};

// Make available in console
if (typeof window !== 'undefined') {
  (window as any).syncDebug = syncDebug;
  console.log('✅ Sync Debug helpers yüklendi! syncDebug.help() ile başlayın.');
}

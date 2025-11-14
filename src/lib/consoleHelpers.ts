/**
 * Console Helpers
 * Makes Firestore query functions accessible from browser console
 * Usage: window.firestoreQueries.getTotalPoints('userId')
 */

import {
  getTotalPointsFromFirestore,
  getTodayPointsFromFirestore,
  getPointsInDateRangeFromFirestore,
  getPointsByActivityTypeFromFirestore,
  getPointsStatisticsFromFirestore,
} from '@/lib/cloudSync/firestoreQueries';
import { db, auth } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Console helper functions for Firestore queries
 */
export const consoleHelpers = {
  /**
   * Get total points for a user
   * Usage: window.firestoreQueries.getTotalPoints('userId')
   */
  async getTotalPoints(userId?: string): Promise<number> {
    const targetUserId = userId || auth?.currentUser?.uid;
    if (!targetUserId) {
      console.error('❌ User ID gerekli. Kullanım: getTotalPoints("userId") veya giriş yapın');
      return 0;
    }
    try {
      const points = await getTotalPointsFromFirestore(targetUserId);
      console.log(`✅ Toplam Points (${targetUserId}):`, points);
      return points;
    } catch (error) {
      console.error('❌ Hata:', error);
      throw error;
    }
  },

  /**
   * Get today's points for a user
   * Usage: window.firestoreQueries.getTodayPoints('userId')
   */
  async getTodayPoints(userId?: string): Promise<number> {
    const targetUserId = userId || auth?.currentUser?.uid;
    if (!targetUserId) {
      console.error('❌ User ID gerekli. Kullanım: getTodayPoints("userId") veya giriş yapın');
      return 0;
    }
    try {
      const points = await getTodayPointsFromFirestore(targetUserId);
      console.log(`✅ Bugünün Points (${targetUserId}):`, points);
      return points;
    } catch (error) {
      console.error('❌ Hata:', error);
      throw error;
    }
  },

  /**
   * Get points statistics
   * Usage: window.firestoreQueries.getStats('userId')
   */
  async getStats(userId?: string) {
    const targetUserId = userId || auth?.currentUser?.uid;
    if (!targetUserId) {
      console.error('❌ User ID gerekli. Kullanım: getStats("userId") veya giriş yapın');
      return null;
    }
    try {
      const stats = await getPointsStatisticsFromFirestore(targetUserId);
      console.log(`✅ İstatistikler (${targetUserId}):`, stats);
      console.table(stats);
      return stats;
    } catch (error) {
      console.error('❌ Hata:', error);
      throw error;
    }
  },

  /**
   * Get points by activity type
   * Usage: window.firestoreQueries.getPointsByType('userId')
   */
  async getPointsByType(userId?: string) {
    const targetUserId = userId || auth?.currentUser?.uid;
    if (!targetUserId) {
      console.error('❌ User ID gerekli. Kullanım: getPointsByType("userId") veya giriş yapın');
      return null;
    }
    try {
      const pointsMap = await getPointsByActivityTypeFromFirestore(targetUserId);
      const pointsArray = Array.from(pointsMap.entries()).map(([key, points]) => ({
        activity: key,
        points,
      }));
      console.log(`✅ Aktivite Tipine Göre Points (${targetUserId}):`);
      console.table(pointsArray);
      return pointsMap;
    } catch (error) {
      console.error('❌ Hata:', error);
      throw error;
    }
  },

  /**
   * Get points in date range
   * Usage: window.firestoreQueries.getPointsInRange('userId', '2024-01-01', '2024-01-31')
   */
  async getPointsInRange(userId: string | undefined, startDateStr: string, endDateStr: string) {
    const targetUserId = userId || auth?.currentUser?.uid;
    if (!targetUserId) {
      console.error(
        '❌ User ID gerekli. Kullanım: getPointsInRange("userId", "2024-01-01", "2024-01-31") veya giriş yapın'
      );
      return 0;
    }
    try {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      const points = await getPointsInDateRangeFromFirestore(targetUserId, startDate, endDate);
      console.log(`✅ Tarih Aralığı Points (${targetUserId}):`, points);
      console.log(`   Başlangıç: ${startDateStr}`);
      console.log(`   Bitiş: ${endDateStr}`);
      return points;
    } catch (error) {
      console.error('❌ Hata:', error);
      throw error;
    }
  },

  /**
   * Get current user ID
   * Usage: window.firestoreQueries.getCurrentUserId()
   */
  getCurrentUserId(): string | null {
    const userId = auth?.currentUser?.uid || null;
    if (userId) {
      console.log('✅ Mevcut Kullanıcı ID:', userId);
    } else {
      console.warn('⚠️ Giriş yapılmamış');
    }
    return userId;
  },

  /**
   * Get raw user document from Firestore
   * Usage: window.firestoreQueries.getUserDoc('userId')
   */
  async getUserDoc(userId?: string) {
    if (!db) {
      console.error('❌ Firebase yapılandırılmamış');
      return null;
    }

    const targetUserId = userId || auth?.currentUser?.uid;
    if (!targetUserId) {
      console.error('❌ User ID gerekli. Kullanım: getUserDoc("userId") veya giriş yapın');
      return null;
    }

    try {
      const userDocRef = doc(db, 'users', targetUserId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        console.warn('⚠️ Doküman bulunamadı');
        return null;
      }

      const data = userDocSnap.data();
      console.log(`✅ Kullanıcı Dokümanı (${targetUserId}):`, data);
      console.log('📊 Activities:', data.activities?.length || 0);
      console.log('🏆 Badges:', data.badges?.length || 0);
      console.log('🎯 Challenges:', data.challenges?.length || 0);

      // Calculate total points
      const totalPoints = (data.activities || []).reduce((sum: number, activity: any) => {
        return sum + (activity.points || 0);
      }, 0);
      console.log('💯 Toplam Points (hesaplanan):', totalPoints);

      return data;
    } catch (error) {
      console.error('❌ Hata:', error);
      throw error;
    }
  },

  /**
   * List all available functions
   * Usage: window.firestoreQueries.help()
   */
  help() {
    console.log(`
🔧 Firestore Query Console Helpers
=====================================

Mevcut Fonksiyonlar:

1. fq.getTotalPoints()
   → Toplam points'i alır (mevcut kullanıcı için)
   → Örnek: await fq.getTotalPoints()
   → Veya: await fq.getTotalPoints('user123')

2. fq.getTodayPoints()
   → Bugünün points'ini alır
   → Örnek: await fq.getTodayPoints()
   → Veya: await fq.getTodayPoints('user123')

3. fq.getStats()
   → Detaylı istatistikleri alır (total, today, thisWeek, thisMonth)
   → Örnek: await fq.getStats()
   → Veya: await fq.getStats('user123')

4. fq.getPointsByType()
   → Aktivite tipine göre points dağılımını alır
   → Örnek: await fq.getPointsByType()
   → Veya: await fq.getPointsByType('user123')

5. fq.getPointsInRange(startDate, endDate)
   → Tarih aralığındaki points'i alır
   → Örnek: await fq.getPointsInRange(null, '2024-01-01', '2024-01-31')

6. fq.getCurrentUserId()
   → Mevcut kullanıcı ID'sini döner
   → Örnek: fq.getCurrentUserId()

7. fq.getUserDoc()
   → Ham kullanıcı dokümanını alır
   → Örnek: await fq.getUserDoc()
   → Veya: await fq.getUserDoc('user123')

8. fq.help()
   → Bu yardım mesajını gösterir

⚠️ ÖNEMLİ:
- Tüm fonksiyonlar "fq." ile başlamalı
- Async fonksiyonlar için "await" kullanın
- userId parametresi OPSİYONEL (giriş yaptıysanız otomatik kullanılır)

✅ Doğru Kullanım Örnekleri:
  // Mevcut kullanıcı için
  await fq.getTotalPoints()
  await fq.getTodayPoints()
  await fq.getStats()

  // Belirli kullanıcı için
  await fq.getTotalPoints('user123')
  await fq.getPointsInRange(null, '2024-01-01', '2024-01-31')

  // Hızlı kontrol
  const userId = fq.getCurrentUserId()
  const total = await fq.getTotalPoints(userId)
  console.log('Toplam:', total)

❌ YANLIŞ Kullanım:
  getTotalPoints(userId?)  ← Bu TypeScript syntax'ı, JavaScript'te çalışmaz!
  getTotalPoints()         ← "fq." eksik!
    `);
  },
};

/**
 * Make functions available in browser console
 */
if (typeof window !== 'undefined') {
  (window as any).firestoreQueries = consoleHelpers;

  // Also add a shorter alias
  (window as any).fq = consoleHelpers;

  console.log(`
✅ Firestore Query Helpers yüklendi!

Kullanım:
  window.firestoreQueries.help()  → Yardım menüsü
  window.firestoreQueries.getTotalPoints()  → Toplam points
  window.fq.getTotalPoints()  → Kısa versiyon

Veya sadece:
  fq.help()
  fq.getTotalPoints()
  `);
}

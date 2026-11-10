// =====================================================================
// PUBG SIAM - China Marketplace Sync Service
// Real-time synchronization engine from Chinese PUBG Marketplace to Firebase / Supabase
// =====================================================================

import { normalizeChinaAccount } from './chinaAccountParser';
import { firebaseService } from '../firebaseService';

export class ChinaSyncService {
  constructor() {
    this.apiUrl = 'https://fzht.xuxug.com/api/api';
    this.isSyncing = false;
    this.lastSyncResult = null;
    this.intervalId = null;
  }

  getHeaders() {
    return {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'Origin': 'https://xuegaokk.ayxds.com',
      'Referer': 'https://xuegaokk.ayxds.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36'
    };
  }

  // 1. Fetch page from Chinese API
  async fetchPage(page = 1, size = 20) {
    const payload = {
      page,
      size,
      datainfo: {
        zuidijia: '',
        zuigaojia: '',
        guanjianci: '',
        biaoqian: [],
        paixu: ''
      }
    };

    const res = await fetch(`${this.apiUrl}/newShangpinList`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Chinese API HTTP Error: ${res.status}`);
    }

    const data = await res.json();
    return data?.data?.data || [];
  }

  // 2. Fetch full details (screenshots) for an account
  async fetchDetail(id) {
    try {
      const res = await fetch(`${this.apiUrl}/newGoodsDetails`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        const data = await res.json();
        return data?.data || {};
      }
    } catch (_) {}
    return {};
  }

  // 3. Sync batch of accounts to Cloud DB (Firebase or Supabase)
  async runSync(config = {}, onProgress = () => {}) {
    if (this.isSyncing) {
      return { success: false, message: 'ระบบกำลังซิงค์อยู่แล้ว กรุณารอสักครู่' };
    }

    this.isSyncing = true;
    const {
      pages = 2,
      cnyRateThb = 5.2,
      cnyRateVnd = 3700,
      markupPercent = 15,
      provider = 'firebase',
      supabaseUrl,
      supabaseAnonKey,
      fetchScreenshots = true
    } = config;

    const useFirebase = provider === 'firebase' || firebaseService.isInitialized;
    const useSupabase = !!supabaseUrl && !!supabaseAnonKey;

    if (!useFirebase && !useSupabase) {
      this.isSyncing = false;
      return { success: false, message: 'กรุณาเชื่อมต่อ Firebase หรือ Supabase ในหน้าตั้งค่าก่อนเริ่มซิงค์' };
    }

    const cleanUrl = (supabaseUrl || '').trim().replace(/\/$/, '');
    let totalSynced = 0;
    const syncedAccounts = [];

    try {
      onProgress({ 
        stage: 'start', 
        message: `🚀 เริ่มต้นซิงค์สต็อกจีน ${pages} หน้าล่าสุด (${useFirebase ? 'Google Firebase 🔥' : 'Supabase ⚡'})...` 
      });

      for (let page = 1; page <= pages; page++) {
        onProgress({ stage: 'fetching_page', page, message: `📥 กำลังดึงข้อมูลหน้า ${page}/${pages}...` });
        const items = await this.fetchPage(page, 20);

        if (!Array.isArray(items) || items.length === 0) {
          break;
        }

        for (let i = 0; i < items.length; i++) {
          const rawItem = items[i];
          let detail = {};
          if (fetchScreenshots) {
            detail = await this.fetchDetail(rawItem.id);
          }

          const account = normalizeChinaAccount(rawItem, detail, {
            cnyRateThb,
            cnyRateVnd,
            markupPercent
          });

          let savedSuccessfully = false;

          // 1. Write to Google Firebase Firestore
          if (useFirebase) {
            try {
              await firebaseService.saveAccount(account);
              savedSuccessfully = true;
            } catch (fbErr) {
              console.warn('[ChinaSync] Firebase save failed:', fbErr);
            }
          }

          // 2. Write to Supabase (if configured)
          if (useSupabase) {
            try {
              const payload = {
                id: account.id,
                region: 'cn',
                category: account.category,
                title_th: account.title_th,
                title_en: account.title_en,
                subtitle_th: account.subtitle_th,
                subtitle_en: account.subtitle_en,
                price_thb: account.priceTHB,
                price_vnd: account.priceVND,
                original_price_thb: account.originalPriceTHB,
                original_price_vnd: account.originalPriceVND,
                tags: account.tags,
                images: account.images,
                binding_th: account.binding_th,
                binding_en: account.binding_en,
                rank: account.rank,
                playtime_th: account.playtime_th,
                playtime_en: account.playtime_en,
                gun_level_th: account.gunLevel_th,
                gun_level_en: account.gunLevel_en,
                warranty_th: account.warranty_th,
                warranty_en: account.warranty_en,
                details_th: account.details_th,
                details_en: account.details_en,
                video_url: '',
                steam_user: account.steamUser,
                steam_pass: account.steamPass,
                steam_email: account.steamEmail,
                is_sold: false,
                is_hot: account.isHot,
                accent_color: account.accentColor,
                updated_at: new Date().toISOString()
              };

              const upRes = await fetch(`${cleanUrl}/rest/v1/accounts`, {
                method: 'POST',
                headers: {
                  'apikey': supabaseAnonKey,
                  'Authorization': `Bearer ${supabaseAnonKey}`,
                  'Content-Type': 'application/json',
                  'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify(payload)
              });

              if (upRes.ok) {
                savedSuccessfully = true;
              }
            } catch (err) {
              console.warn(`Failed to upsert account ${account.id} to Supabase`, err);
            }
          }

          if (savedSuccessfully) {
            totalSynced++;
            syncedAccounts.push(account);
          }

          onProgress({
            stage: 'progress',
            synced: totalSynced,
            currentAccount: account.id,
            message: `✓ [${account.id}] ${account.title_th.substring(0, 35)}... (฿${account.priceTHB.toLocaleString()})`
          });
        }
      }

      const result = {
        success: true,
        totalSynced,
        syncedAccounts,
        timestamp: new Date().toISOString(),
        message: `🎉 ซิงค์สต็อกสำเร็จแล้ว ${totalSynced} ไอดีล่าสุด เข้าสู่ฐานข้อมูลคลาวด์เรียบร้อย!`
      };

      this.lastSyncResult = result;
      this.isSyncing = false;
      return result;
    } catch (error) {
      this.isSyncing = false;
      return {
        success: false,
        totalSynced,
        error: error.message,
        message: `เกิดข้อผิดพลาดในการซิงค์: ${error.message}`
      };
    }
  }

  // 4. Background Recurring Sync Scheduler
  startScheduledSync(config, intervalMinutes = 15, onTick = () => {}) {
    this.stopScheduledSync();
    console.log(`[ChinaSync] Scheduled auto-sync started (Every ${intervalMinutes} minutes)`);
    
    this.runSync(config, onTick).then(res => {
      onTick({ stage: 'completed', result: res });
    });

    this.intervalId = setInterval(() => {
      console.log('[ChinaSync] Running periodic sync cycle...');
      this.runSync(config, onTick).then(res => {
        onTick({ stage: 'completed', result: res });
      });
    }, intervalMinutes * 60 * 1000);
  }

  stopScheduledSync() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[ChinaSync] Scheduled auto-sync stopped');
    }
  }
}

export const chinaSyncService = new ChinaSyncService();

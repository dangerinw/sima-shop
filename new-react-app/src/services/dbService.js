// Universal Database & Cloud Sync Service for SIMA Shop
// Supports Seamless LocalStorage Fallback + Direct Supabase REST API

export class DbService {
  constructor(settings = {}) {
    this.settings = settings;
    this.supabaseUrl = (settings.supabaseUrl || '').replace(/\/$/, '');
    this.supabaseAnonKey = settings.supabaseAnonKey || '';
    this.useCloudDb = !!settings.useCloudDb && !!this.supabaseUrl && !!this.supabaseAnonKey;
  }

  // Update active connection credentials
  updateSettings(newSettings) {
    this.settings = newSettings;
    this.supabaseUrl = (newSettings.supabaseUrl || '').replace(/\/$/, '');
    this.supabaseAnonKey = newSettings.supabaseAnonKey || '';
    this.useCloudDb = !!newSettings.useCloudDb && !!this.supabaseUrl && !!this.supabaseAnonKey;
  }

  // Helper: Supabase REST request headers
  getHeaders() {
    return {
      'apikey': this.supabaseAnonKey,
      'Authorization': `Bearer ${this.supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  // 1. Test Supabase Connection
  async testConnection(url = this.supabaseUrl, key = this.supabaseAnonKey) {
    if (!url || !key) {
      return { success: false, message: 'กรุณากรอก Supabase URL และ Anon Key ให้ครบถ้วน' };
    }

    const cleanUrl = url.replace(/\/$/, '');
    try {
      const response = await fetch(`${cleanUrl}/rest/v1/store_settings?select=*&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });

      if (response.ok) {
        return { success: true, message: '✓ เชื่อมต่อกับ Supabase Cloud Database สำเร็จ 100%!' };
      } else {
        const errText = await response.text();
        return { success: false, message: `เกิดข้อผิดพลาด (${response.status}): ${errText}` };
      }
    } catch (e) {
      return { success: false, message: `ไม่สามารถเชื่อมต่อได้: ${e.message}` };
    }
  }

  // 2. Fetch Accounts from Cloud or Local
  async getAccounts(fallbackAccounts = []) {
    if (this.useCloudDb) {
      try {
        const res = await fetch(`${this.supabaseUrl}/rest/v1/accounts?select=*&order=created_at.desc`, {
          headers: this.getHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Map SQL snake_case to frontend camelCase
            return data.map((item) => ({
              id: item.id,
              region: item.region,
              category: item.category,
              title_th: item.title_th,
              title_en: item.title_en,
              subtitle_th: item.subtitle_th,
              subtitle_en: item.subtitle_en,
              priceTHB: Number(item.price_thb),
              priceVND: Number(item.price_vnd),
              originalPriceTHB: Number(item.original_price_thb),
              originalPriceVND: Number(item.original_price_vnd),
              tags: item.tags,
              images: item.images || [],
              binding_th: item.binding_th,
              binding_en: item.binding_en,
              rank: item.rank,
              playtime_th: item.playtime_th,
              playtime_en: item.playtime_en,
              gunLevel_th: item.gun_level_th,
              gunLevel_en: item.gun_level_en,
              warranty_th: item.warranty_th,
              warranty_en: item.warranty_en,
              details_th: item.details_th,
              details_en: item.details_en,
              videoUrl: item.video_url,
              steamUser: item.steam_user,
              steamPass: item.steam_pass,
              steamEmail: item.steam_email,
              isSold: item.is_sold,
              isHot: item.is_hot,
              accentColor: item.accent_color
            }));
          }
        }
      } catch (e) {
        console.warn('Cloud DB fetch failed, falling back to local', e);
      }
    }

    // LocalStorage fallback
    try {
      const saved = localStorage.getItem('sima_accounts');
      return saved ? JSON.parse(saved) : fallbackAccounts;
    } catch (e) {
      return fallbackAccounts;
    }
  }

  // 3. Export entire database as JSON backup
  exportBackup(accounts, orders, users, settings) {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      storeName: 'SIMA Shop',
      data: {
        accounts,
        orders,
        users,
        settings
      }
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sima_shop_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // 4. Import database JSON backup
  importBackup(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed && parsed.data) {
            resolve(parsed.data);
          } else {
            reject(new Error('รูปแบบไฟล์ JSON สำรองข้อมูลไม่ถูกต้อง'));
          }
        } catch (err) {
          reject(new Error('ไม่สามารถอ่านไฟล์ JSON ได้: ' + err.message));
        }
      };
      reader.onerror = () => reject(new Error('เกิดข้อผิดพลาดในการเปิดไฟล์'));
      reader.readAsText(file);
    });
  }
}

export const dbService = new DbService();

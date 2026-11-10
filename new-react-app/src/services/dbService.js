// =====================================================================
// Universal Database & Cloud Storage Service for PUBG SIAM
// Supports Google Firebase Firestore 🔥 + Supabase REST ⚡ + LocalStorage Fallback
// =====================================================================

import { firebaseService } from './firebaseService';

export class DbService {
  constructor(settings = {}) {
    this.updateSettings(settings);
  }

  // Update active connection credentials
  updateSettings(settings = {}) {
    this.settings = settings;
    this.provider = settings.cloudDbProvider || 'firebase';

    // 1. Firebase setup
    let firebaseConfig = null;
    if (settings.firebaseConfigSnippet) {
      firebaseConfig = firebaseService.parseConfig(settings.firebaseConfigSnippet);
    }
    if (!firebaseConfig && settings.firebaseProjectId && settings.firebaseApiKey) {
      firebaseConfig = {
        apiKey: settings.firebaseApiKey,
        authDomain: settings.firebaseAuthDomain || `${settings.firebaseProjectId}.firebaseapp.com`,
        projectId: settings.firebaseProjectId,
        storageBucket: settings.firebaseStorageBucket || `${settings.firebaseProjectId}.appspot.com`,
        messagingSenderId: settings.firebaseMessagingSenderId || '',
        appId: settings.firebaseAppId || ''
      };
    }

    if (firebaseConfig) {
      this.firebaseConfig = firebaseConfig;
      firebaseService.init(firebaseConfig);
    }

    // 2. Supabase setup
    let url = (settings.supabaseUrl || '').trim().replace(/\/$/, '');
    if (url.includes('ldcafwhhchsdgfijiqte')) {
      url = url.replace('ldcafwhhchsdgfijiqte', 'ldcafwhhchadgfijiqte');
    }
    this.supabaseUrl = url;
    this.supabaseAnonKey = (settings.supabaseAnonKey || '').trim();

    // 3. Overall cloud active flag
    const hasFirebase = !!firebaseConfig && !!firebaseConfig.projectId;
    const hasSupabase = !!this.supabaseUrl && !!this.supabaseAnonKey;

    if (this.provider === 'firebase') {
      this.useCloudDb = !!settings.useCloudDb && hasFirebase;
    } else {
      this.useCloudDb = !!settings.useCloudDb && hasSupabase;
    }
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

  // 1. Test Database Connection
  async testConnection(settings = this.settings) {
    const provider = settings?.cloudDbProvider || this.provider || 'firebase';

    if (provider === 'firebase') {
      let cfg = null;
      if (settings.firebaseConfigSnippet) {
        cfg = firebaseService.parseConfig(settings.firebaseConfigSnippet);
      }
      if (!cfg && settings.firebaseProjectId) {
        cfg = {
          apiKey: settings.firebaseApiKey,
          projectId: settings.firebaseProjectId,
          authDomain: settings.firebaseAuthDomain,
          storageBucket: settings.firebaseStorageBucket
        };
      }
      return await firebaseService.testConnection(cfg);
    }

    // Supabase test connection
    const url = settings.supabaseUrl || this.supabaseUrl;
    const key = settings.supabaseAnonKey || this.supabaseAnonKey;

    if (!url || !key) {
      return { success: false, message: 'กรุณากรอก Supabase URL และ Anon Key ให้ครบถ้วน' };
    }

    let cleanUrl = url.trim().replace(/\/$/, '');
    if (cleanUrl.includes('ldcafwhhchsdgfijiqte')) {
      cleanUrl = cleanUrl.replace('ldcafwhhchsdgfijiqte', 'ldcafwhhchadgfijiqte');
    }
    const cleanKey = key.trim();

    try {
      const response = await fetch(`${cleanUrl}/rest/v1/store_settings?select=*&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': cleanKey,
          'Authorization': `Bearer ${cleanKey}`
        }
      });

      if (response.ok) {
        return { 
          success: true, 
          message: `✓ เชื่อมต่อกับ Supabase Cloud Database สำเร็จ 100%!`,
          correctedUrl: cleanUrl !== url ? cleanUrl : null
        };
      } else if (response.status === 401) {
        return { 
          success: false, 
          message: 'เกิดข้อผิดพลาด (401 Unauthorized): API Key ไม่ถูกต้อง' 
        };
      } else {
        const errText = await response.text();
        return { success: false, message: `เกิดข้อผิดพลาด (${response.status}): ${errText}` };
      }
    } catch (e) {
      return { 
        success: false, 
        message: `ไม่สามารถเชื่อมต่อได้ (${e.message}) ฐานข้อมูลอาจถูกหยุดชั่วคราว (Paused) กรุณากด Restore ใน Supabase หรือเปลี่ยนไปใช้ Firebase` 
      };
    }
  }

  // 2. Upload Image to Cloud Storage (Firebase Storage or Supabase Storage)
  async uploadImage(fileOrBlobOrDataUrl, folder = 'accounts') {
    if (!this.useCloudDb) return null;

    if (this.provider === 'firebase' && firebaseService.isInitialized) {
      const fbUrl = await firebaseService.uploadImage(fileOrBlobOrDataUrl, folder);
      if (fbUrl) return fbUrl;
    }

    // Fallback: Supabase Storage
    if (this.supabaseUrl && this.supabaseAnonKey) {
      try {
        let blob;
        let contentType = 'image/jpeg';

        if (typeof fileOrBlobOrDataUrl === 'string' && fileOrBlobOrDataUrl.startsWith('data:')) {
          const parts = fileOrBlobOrDataUrl.split(';base64,');
          contentType = parts[0].split(':')[1] || 'image/jpeg';
          const raw = window.atob(parts[1]);
          const rawLength = raw.length;
          const uInt8Array = new Uint8Array(rawLength);
          for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
          }
          blob = new Blob([uInt8Array], { type: contentType });
        } else if (fileOrBlobOrDataUrl instanceof Blob || fileOrBlobOrDataUrl instanceof File) {
          blob = fileOrBlobOrDataUrl;
          contentType = blob.type || 'image/jpeg';
        } else {
          return null;
        }

        const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
        const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

        const res = await fetch(`${this.supabaseUrl}/storage/v1/object/sima-assets/${fileName}`, {
          method: 'POST',
          headers: {
            'apikey': this.supabaseAnonKey,
            'Authorization': `Bearer ${this.supabaseAnonKey}`,
            'Content-Type': contentType,
            'x-upsert': 'true'
          },
          body: blob
        });

        if (res.ok) {
          return `${this.supabaseUrl}/storage/v1/object/public/sima-assets/${fileName}`;
        }
      } catch (e) {
        console.warn('Cloud storage upload error', e);
      }
    }

    return null;
  }

  // 3. Fetch Accounts from Cloud or LocalStorage
  async getAccounts(fallbackAccounts = []) {
    if (this.useCloudDb) {
      if (this.provider === 'firebase' && firebaseService.isInitialized) {
        const fbAccounts = await firebaseService.getAccounts(null);
        if (Array.isArray(fbAccounts) && fbAccounts.length > 0) {
          return fbAccounts;
        }
      }

      if (this.supabaseUrl && this.supabaseAnonKey) {
        try {
          const res = await fetch(`${this.supabaseUrl}/rest/v1/accounts?select=*&order=created_at.desc`, {
            headers: this.getHeaders()
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              return data.map((item) => ({
                id: item.id,
                region: item.region || 'th',
                category: item.category || 'progressive',
                title_th: item.title_th,
                title_en: item.title_en,
                subtitle_th: item.subtitle_th || '',
                subtitle_en: item.subtitle_en || '',
                priceTHB: Number(item.price_thb || 0),
                priceVND: Number(item.price_vnd || 0),
                originalPriceTHB: Number(item.original_price_thb || 0),
                originalPriceVND: Number(item.original_price_vnd || 0),
                tags: item.tags || [],
                images: item.images || [],
                binding_th: item.binding_th || '',
                binding_en: item.binding_en || '',
                rank: item.rank || 'Master',
                playtime_th: item.playtime_th || '',
                playtime_en: item.playtime_en || '',
                gunLevel_th: item.gun_level_th || '',
                gunLevel_en: item.gun_level_en || '',
                warranty_th: item.warranty_th || 'มีประกันมือ 1 แท้ (ปลอดภัย 100%)',
                warranty_en: item.warranty_en || '1st Hand Owner Warranty (100% Secure)',
                details_th: item.details_th || '',
                details_en: item.details_en || '',
                videoUrl: item.video_url || '',
                steamUser: item.steam_user || '',
                steamPass: item.steam_pass || '',
                steamEmail: item.steam_email || '',
                isSold: !!item.is_sold,
                isHot: !!item.is_hot,
                accentColor: item.accent_color || 'from-slate-900 to-amber-950/40',
                createdAt: item.created_at || new Date().toISOString()
              }));
            }
          }
        } catch (e) {
          console.warn('Cloud DB fetch accounts failed, using local', e);
        }
      }
    }

    try {
      const saved = localStorage.getItem('sima_accounts');
      return saved ? JSON.parse(saved) : fallbackAccounts;
    } catch (e) {
      return fallbackAccounts;
    }
  }

  // 4. Save/Upsert Account to Cloud
  async saveAccount(account) {
    if (!this.useCloudDb) return;

    if (this.provider === 'firebase' && firebaseService.isInitialized) {
      await firebaseService.saveAccount(account);
      return;
    }

    if (this.supabaseUrl && this.supabaseAnonKey) {
      try {
        const payload = {
          id: account.id,
          region: account.region || 'th',
          category: account.category || 'progressive',
          title_th: account.title_th,
          title_en: account.title_en,
          subtitle_th: account.subtitle_th || '',
          subtitle_en: account.subtitle_en || '',
          price_thb: Number(account.priceTHB || 0),
          price_vnd: Number(account.priceVND || 0),
          original_price_thb: Number(account.originalPriceTHB || 0),
          original_price_vnd: Number(account.originalPriceVND || 0),
          tags: account.tags || [],
          images: account.images || [],
          binding_th: account.binding_th || '',
          binding_en: account.binding_en || '',
          rank: account.rank || 'Master',
          playtime_th: account.playtime_th || '',
          playtime_en: account.playtime_en || '',
          gun_level_th: account.gunLevel_th || '',
          gun_level_en: account.gunLevel_en || '',
          warranty_th: account.warranty_th || '',
          warranty_en: account.warranty_en || '',
          details_th: account.details_th || '',
          details_en: account.details_en || '',
          video_url: account.videoUrl || '',
          steam_user: account.steamUser || '',
          steam_pass: account.steamPass || '',
          steam_email: account.steamEmail || '',
          is_sold: !!account.isSold,
          is_hot: !!account.isHot,
          accent_color: account.accentColor || 'from-slate-900 to-amber-950/40',
          updated_at: new Date().toISOString()
        };

        await fetch(`${this.supabaseUrl}/rest/v1/accounts`, {
          method: 'POST',
          headers: {
            ...this.getHeaders(),
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.warn('Failed to sync account to cloud', e);
      }
    }
  }

  // 5. Delete Account from Cloud
  async deleteAccount(accountId) {
    if (!this.useCloudDb) return;

    if (this.provider === 'firebase' && firebaseService.isInitialized) {
      await firebaseService.deleteAccount(accountId);
      return;
    }

    if (this.supabaseUrl && this.supabaseAnonKey) {
      try {
        await fetch(`${this.supabaseUrl}/rest/v1/accounts?id=eq.${accountId}`, {
          method: 'DELETE',
          headers: this.getHeaders()
        });
      } catch (e) {
        console.warn('Failed to delete account from cloud', e);
      }
    }
  }

  // 6. Fetch Orders from Cloud or LocalStorage
  async getOrders(fallbackOrders = []) {
    if (this.useCloudDb) {
      if (this.provider === 'firebase' && firebaseService.isInitialized) {
        const fbOrders = await firebaseService.getOrders(null);
        if (Array.isArray(fbOrders) && fbOrders.length > 0) {
          return fbOrders;
        }
      }

      if (this.supabaseUrl && this.supabaseAnonKey) {
        try {
          const res = await fetch(`${this.supabaseUrl}/rest/v1/orders?select=*&order=created_at.desc`, {
            headers: this.getHeaders()
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              return data.map((item) => ({
                orderId: item.order_id,
                userId: item.user_id,
                customerName: item.customer_name,
                accountId: item.account_id,
                accountTitle: item.account_title,
                amountTHB: Number(item.amount_thb || 0),
                amountVND: Number(item.amount_vnd || 0),
                paymentMethod: item.payment_method,
                status: item.status || 'completed',
                steamUser: item.steam_user,
                steamPass: item.steam_pass,
                mailInfo: item.mail_info,
                warranty: item.warranty,
                region: item.region || 'th',
                slipImage: item.slip_image,
                createdAt: item.created_at
              }));
            }
          }
        } catch (e) {
          console.warn('Cloud DB fetch orders failed, using local', e);
        }
      }
    }

    try {
      const saved = localStorage.getItem('sima_orders');
      return saved ? JSON.parse(saved) : fallbackOrders;
    } catch (e) {
      return fallbackOrders;
    }
  }

  // 7. Save Order to Cloud
  async saveOrder(order) {
    if (!this.useCloudDb) return;

    if (this.provider === 'firebase' && firebaseService.isInitialized) {
      await firebaseService.saveOrder(order);
      return;
    }

    if (this.supabaseUrl && this.supabaseAnonKey) {
      try {
        const payload = {
          order_id: order.orderId,
          user_id: order.userId || null,
          customer_name: order.customerName,
          account_id: order.accountId,
          account_title: order.accountTitle,
          amount_thb: Number(order.amountTHB || 0),
          amount_vnd: Number(order.amountVND || 0),
          payment_method: order.paymentMethod,
          status: order.status || 'completed',
          steam_user: order.steamUser,
          steam_pass: order.steamPass,
          mail_info: order.mailInfo,
          warranty: order.warranty || 'มีประกันมือ 1 แท้ (ปลอดภัย 100%)',
          region: order.region || 'th',
          slip_image: order.slipImage || null,
          created_at: order.createdAt || new Date().toISOString()
        };

        await fetch(`${this.supabaseUrl}/rest/v1/orders`, {
          method: 'POST',
          headers: {
            ...this.getHeaders(),
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.warn('Failed to sync order to cloud', e);
      }
    }
  }

  // 8. Update Order Status in Cloud
  async updateOrderStatus(orderId, status) {
    if (!this.useCloudDb) return;

    if (this.provider === 'firebase' && firebaseService.isInitialized) {
      await firebaseService.updateOrderStatus(orderId, status);
      return;
    }

    if (this.supabaseUrl && this.supabaseAnonKey) {
      try {
        await fetch(`${this.supabaseUrl}/rest/v1/orders?order_id=eq.${orderId}`, {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: JSON.stringify({ status })
        });
      } catch (e) {
        console.warn('Failed to update order status in cloud', e);
      }
    }
  }

  // 9. Sync Store Settings to Cloud
  async saveSettings(settings) {
    if (!this.useCloudDb) return;

    if (this.provider === 'firebase' && firebaseService.isInitialized) {
      await firebaseService.saveSettings(settings);
      return;
    }

    if (this.supabaseUrl && this.supabaseAnonKey) {
      try {
        const payload = {
          id: 'global',
          promptpay_id: settings.promptPayId || '',
          promptpay_name: settings.promptPayName || '',
          vietqr_bank: settings.vietQrBank || '',
          vietqr_account_no: settings.vietQrAccountNo || '',
          vietqr_account_name: settings.vietQrAccountName || '',
          announcement_text: settings.announcementText || '',
          auto_delivery: !!settings.autoDelivery,
          auto_slip_verify: !!settings.autoSlipVerify,
          updated_at: new Date().toISOString()
        };

        await fetch(`${this.supabaseUrl}/rest/v1/store_settings`, {
          method: 'POST',
          headers: {
            ...this.getHeaders(),
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.warn('Failed to sync settings to cloud', e);
      }
    }
  }

  // 10. Export entire database as JSON backup
  exportBackup(accounts, orders, users, settings) {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      storeName: 'PUBG SIAM',
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

  // 11. Import database JSON backup
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

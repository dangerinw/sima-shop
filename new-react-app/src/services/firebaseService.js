// =====================================================================
// PUBG SIAM - Google Firebase Cloud Database & Storage Service 🔥
// Powered by Google Cloud Firestore & Firebase Storage
// 100% Free Forever, Never Pauses / Never Sleeps, Ultra-Fast
// =====================================================================

import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc,
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';

export class FirebaseService {
  constructor() {
    this.app = null;
    this.db = null;
    this.storage = null;
    this.config = null;
    this.isInitialized = false;
  }

  // Parse config from string (JSON or JS object snippet) or plain object
  parseConfig(input) {
    if (!input) return null;
    if (typeof input === 'object') return input;
    if (typeof input === 'string') {
      const trimmed = input.trim();
      // Try JSON.parse
      try {
        return JSON.parse(trimmed);
      } catch (_) {}

      // Try extracting key-values from JS snippet: { apiKey: "...", projectId: "..." }
      try {
        const cleaned = trimmed
          .replace(/(const|let|var)\s+\w+\s*=\s*/, '')
          .replace(/;?\s*$/, '')
          .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
          .replace(/'/g, '"');
        return JSON.parse(cleaned);
      } catch (_) {}
    }
    return null;
  }

  // Initialize Firebase App
  init(rawConfig) {
    const config = this.parseConfig(rawConfig);
    if (!config || !config.projectId || !config.apiKey) {
      this.isInitialized = false;
      return false;
    }

    try {
      this.config = config;
      // Check if already initialized
      const existingApps = getApps();
      const simaApp = existingApps.find(a => a.name === 'PUBG_SIAM') || 
                       (existingApps.length > 0 && existingApps[0].options.projectId === config.projectId ? existingApps[0] : null);

      if (simaApp) {
        this.app = simaApp;
      } else {
        this.app = initializeApp(config, 'PUBG_SIAM');
      }

      this.db = getFirestore(this.app);
      try {
        this.storage = getStorage(this.app);
      } catch (_) {}

      this.isInitialized = true;
      return true;
    } catch (err) {
      console.warn('[Firebase] Init failed:', err);
      this.isInitialized = false;
      return false;
    }
  }

  // 1. Test Connection & Permissions
  async testConnection(rawConfig) {
    const config = this.parseConfig(rawConfig) || this.config;
    if (!config || !config.projectId || !config.apiKey) {
      return { 
        success: false, 
        message: 'กรุณากรอก Firebase Project ID และ API Key ให้ครบถ้วนครับ' 
      };
    }

    try {
      this.init(config);
      if (!this.db) {
        throw new Error('ไม่สามารถเริ่มต้น Firestore Database ได้');
      }

      // Try writing and reading a lightweight healthcheck doc
      const testDocRef = doc(this.db, 'store_settings', '_healthcheck');
      await setDoc(testDocRef, {
        lastPing: new Date().toISOString(),
        client: 'PUBG SIAM Admin Test'
      }, { merge: true });

      const snap = await getDoc(testDocRef);
      if (snap.exists()) {
        return {
          success: true,
          message: `✓ เชื่อมต่อกับ Google Firebase Firestore [Project: ${config.projectId}] สำเร็จ 100%! (ฐานข้อมูล Active ตลอดชีพ ไม่หลับ)`
        };
      } else {
        throw new Error('บันทึกข้อมูลได้แต่อ่านกลับไม่พบ');
      }
    } catch (error) {
      console.error('[Firebase] Test Connection Error:', error);
      if (error.code === 'permission-denied') {
        return {
          success: false,
          code: 'permission-denied',
          message: `เชื่อมต่อ Firebase ได้แล้ว แต่ติด Security Rules!\nกรุณาไปที่ Firebase Console > Firestore Database > Rules แล้วเปลี่ยนเป็น:\nallow read, write: if true;`
        };
      }
      return {
        success: false,
        message: `ไม่สามารถเชื่อมต่อ Firebase ได้ (${error.message || error.code})`
      };
    }
  }

  // 2. Fetch Accounts
  async getAccounts(fallbackAccounts = []) {
    if (!this.isInitialized || !this.db) {
      return fallbackAccounts;
    }

    try {
      const q = query(collection(this.db, 'accounts'), orderBy('updated_at', 'desc'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return fallbackAccounts;
      }

      const list = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        list.push({
          id: data.id || docSnap.id,
          region: data.region || 'th',
          category: data.category || 'progressive',
          title_th: data.title_th || '',
          title_en: data.title_en || '',
          subtitle_th: data.subtitle_th || '',
          subtitle_en: data.subtitle_en || '',
          priceTHB: Number(data.price_thb ?? data.priceTHB ?? 0),
          priceVND: Number(data.price_vnd ?? data.priceVND ?? 0),
          originalPriceTHB: Number(data.original_price_thb ?? data.originalPriceTHB ?? 0),
          originalPriceVND: Number(data.original_price_vnd ?? data.originalPriceVND ?? 0),
          tags: Array.isArray(data.tags) ? data.tags : [],
          images: Array.isArray(data.images) ? data.images : [],
          binding_th: data.binding_th || '',
          binding_en: data.binding_en || '',
          rank: data.rank || 'Master',
          playtime_th: data.playtime_th || '',
          playtime_en: data.playtime_en || '',
          gunLevel_th: data.gun_level_th || data.gunLevel_th || '',
          gunLevel_en: data.gun_level_en || data.gunLevel_en || '',
          warranty_th: data.warranty_th || 'มีประกันมือ 1 แท้ (ปลอดภัย 100%)',
          warranty_en: data.warranty_en || '1st Hand Owner Warranty (100% Secure)',
          details_th: data.details_th || '',
          details_en: data.details_en || '',
          videoUrl: data.video_url || data.videoUrl || '',
          steamUser: data.steam_user || data.steamUser || '',
          steamPass: data.steam_pass || data.steamPass || '',
          steamEmail: data.steam_email || data.steamEmail || '',
          isSold: !!(data.is_sold ?? data.isSold),
          isHot: !!(data.is_hot ?? data.isHot),
          accentColor: data.accent_color || data.accentColor || 'from-slate-900 to-amber-950/40',
          createdAt: data.created_at || data.createdAt || new Date().toISOString()
        });
      });

      return list.length > 0 ? list : fallbackAccounts;
    } catch (err) {
      console.warn('[Firebase] getAccounts error:', err);
      return fallbackAccounts;
    }
  }

  // 3. Save / Upsert Account
  async saveAccount(account) {
    if (!this.isInitialized || !this.db || !account || !account.id) return;
    try {
      const payload = {
        id: account.id,
        region: account.region || 'th',
        category: account.category || 'progressive',
        title_th: account.title_th || '',
        title_en: account.title_en || '',
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
        rank: account.rank || '',
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

      await setDoc(doc(this.db, 'accounts', account.id), payload, { merge: true });
    } catch (err) {
      console.warn('[Firebase] saveAccount failed:', err);
    }
  }

  // 4. Delete Account
  async deleteAccount(accountId) {
    if (!this.isInitialized || !this.db || !accountId) return;
    try {
      await deleteDoc(doc(this.db, 'accounts', accountId));
    } catch (err) {
      console.warn('[Firebase] deleteAccount failed:', err);
    }
  }

  // 5. Fetch Orders
  async getOrders(fallbackOrders = []) {
    if (!this.isInitialized || !this.db) {
      return fallbackOrders;
    }

    try {
      const q = query(collection(this.db, 'orders'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return fallbackOrders;
      }

      const list = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        list.push({
          orderId: data.order_id || docSnap.id,
          userId: data.user_id || null,
          customerName: data.customer_name || 'ลูกค้า',
          accountId: data.account_id || '',
          accountTitle: data.account_title || '',
          amountTHB: Number(data.amount_thb || 0),
          amountVND: Number(data.amount_vnd || 0),
          paymentMethod: data.payment_method || 'PromptPay',
          status: data.status || 'completed',
          steamUser: data.steam_user || '',
          steamPass: data.steam_pass || '',
          mailInfo: data.mail_info || '',
          warranty: data.warranty || 'มีประกันมือ 1 แท้ (ปลอดภัย 100%)',
          region: data.region || 'th',
          slipImage: data.slip_image || null,
          createdAt: data.created_at || new Date().toISOString()
        });
      });

      return list.length > 0 ? list : fallbackOrders;
    } catch (err) {
      console.warn('[Firebase] getOrders error:', err);
      return fallbackOrders;
    }
  }

  // 6. Save Order
  async saveOrder(order) {
    if (!this.isInitialized || !this.db || !order || !order.orderId) return;
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

      await setDoc(doc(this.db, 'orders', order.orderId), payload, { merge: true });
    } catch (err) {
      console.warn('[Firebase] saveOrder failed:', err);
    }
  }

  // 7. Update Order Status
  async updateOrderStatus(orderId, status) {
    if (!this.isInitialized || !this.db || !orderId) return;
    try {
      await setDoc(doc(this.db, 'orders', orderId), {
        status,
        updated_at: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('[Firebase] updateOrderStatus failed:', err);
    }
  }

  // 8. Save Store Settings
  async saveSettings(settings) {
    if (!this.isInitialized || !this.db || !settings) return;
    try {
      await setDoc(doc(this.db, 'store_settings', 'global'), {
        ...settings,
        updated_at: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('[Firebase] saveSettings failed:', err);
    }
  }

  // 9. Upload Image to Firebase Storage
  async uploadImage(fileOrBlobOrDataUrl, folder = 'accounts') {
    if (!this.isInitialized || !this.storage) return null;

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
      const storageRef = ref(this.storage, fileName);

      const snapshot = await uploadBytes(storageRef, blob, { contentType });
      return await getDownloadURL(snapshot.ref);
    } catch (err) {
      console.warn('[Firebase] Storage upload error:', err);
      return null;
    }
  }
}

export const firebaseService = new FirebaseService();

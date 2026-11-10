export const defaultStoreSettings = {
  // Order & Contact Purchase Channels (Discord & Facebook Page) 💬
  paymentMode: 'contact_admin', // Contact admin via Discord or Facebook Page
  facebookPageUrl: 'https://facebook.com/pubgsiam',
  facebookPageName: 'PUBG SIAM - ซื้อขายไอดี PUBG PC',
  discordInviteUrl: 'https://discord.gg/pubgsiam',
  discordServerName: 'PUBG SIAM Discord Server',

  // Payment Gateways (Backup / Reference)
  promptPayActive: true,
  promptPayId: '0891234567',
  promptPayName: 'PUBG SIAM (PUBG SIAM)',
  truemoneyActive: true,
  truemoneyPhone: '089-123-4567',

  // Payment Gateways - Vietnam 🇻🇳
  vietQrActive: true,
  vietQrBank: 'MB',
  vietQrAccountNo: '0987654321',
  vietQrAccountName: 'PUBG SIAM VN',
  momoActive: true,
  momoPhone: '0987654321',

  // Verification & Delivery
  autoDelivery: true,
  autoSlipVerify: true,

  // Announcements & Support
  announcementText: '🔥 PUBG SIAM ตลาดซื้อ-ขายไอดี PUBG PC (Steam) อันดับ 1 | ปลอดภัย 100% ส่งมอบเมลแรก & โอนย้าย Steam ทันที',
  supportLine: '@SIMASHOP',
  supportDiscord: 'discord.gg/pubgsiam',

  // Store Front Metrics (Delivered Count)
  deliveredCountMode: 'real', // 'real' | 'custom'
  baseDeliveredCount: 0,

  // Cloud Database Configuration (Google Firebase 🔥 / Supabase ⚡)
  cloudDbProvider: 'firebase', // 'firebase' | 'supabase'
  useCloudDb: true,

  // Google Firebase Configuration 🔥
  firebaseConfigSnippet: `const firebaseConfig = {
  apiKey: "AIzaSyDjg9hzjBB1Nh3rZmoLgHEBhiovGteLXhk",
  authDomain: "sima-shop-a674f.firebaseapp.com",
  projectId: "sima-shop-a674f",
  storageBucket: "sima-shop-a674f.firebasestorage.app",
  messagingSenderId: "792858737977",
  appId: "1:792858737977:web:8f95f4519b8aee31c5fce8",
  measurementId: "G-BJ45QWS1YL"
};`,
  firebaseApiKey: 'AIzaSyDjg9hzjBB1Nh3rZmoLgHEBhiovGteLXhk',
  firebaseAuthDomain: 'sima-shop-a674f.firebaseapp.com',
  firebaseProjectId: 'sima-shop-a674f',
  firebaseStorageBucket: 'sima-shop-a674f.firebasestorage.app',
  firebaseMessagingSenderId: '792858737977',
  firebaseAppId: '1:792858737977:web:8f95f4519b8aee31c5fce8',

  // Supabase (Legacy)
  supabaseUrl: 'https://ldcafwhhchadgfijiqte.supabase.co',
  supabaseAnonKey: '',

  // China Real-time Sync Configuration 🇨🇳
  chinaSyncActive: true,
  chinaStorageMode: 'direct_json', // 'direct_json' (ประหยัดฐานข้อมูล ไม่เปลือง Firebase) | 'firebase'
  chinaCnyRateThb: 5.2,
  chinaCnyRateVnd: 3700,

  // Tiered Profit Markup Settings 🧮
  chinaMarkupMode: 'tiered', // 'tiered' (แบ่งตามเรทราคา) | 'flat' (คงที่)
  chinaMarkupThreshold: 100000, // จุดแบ่งราคา เช่น 100,000 บาท
  chinaMarkupTier1Percent: 10,  // ราคา < 100,000฿: +10%
  chinaMarkupTier2Percent: 13,  // ราคา >= 100,000฿: +13%
  chinaMarkupPercent: 10,       // Fallback flat
  
  chinaSyncIntervalMinutes: 15,
  chinaSyncPages: 3,
  chinaLastSyncTime: null,
  chinaLastSyncCount: 0
};

export const getStoredSettings = () => {
  try {
    const saved = localStorage.getItem('sima_store_settings');
    if (saved) {
      let parsed = JSON.parse(saved);
      // Auto-correct any legacy typo in project URL
      if (parsed.supabaseUrl && parsed.supabaseUrl.includes('ldcafwhhchsdgfijiqte')) {
        parsed.supabaseUrl = parsed.supabaseUrl.replace('ldcafwhhchsdgfijiqte', 'ldcafwhhchadgfijiqte');
        localStorage.setItem('sima_store_settings', JSON.stringify(parsed));
      }
      return { ...defaultStoreSettings, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load store settings', e);
  }
  return defaultStoreSettings;
};

export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem('sima_store_settings', JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save store settings', e);
  }
};

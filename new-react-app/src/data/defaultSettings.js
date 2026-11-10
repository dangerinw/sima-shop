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
  authDomain: "pubg-siam-a674f.firebaseapp.com",
  projectId: "pubg-siam-a674f",
  storageBucket: "pubg-siam-a674f.firebasestorage.app",
  messagingSenderId: "792858737977",
  appId: "1:792858737977:web:8f95f4519b8aee31c5fce8",
  measurementId: "G-BJ45QWS1YL"
};`,
  firebaseApiKey: 'AIzaSyDjg9hzjBB1Nh3rZmoLgHEBhiovGteLXhk',
  firebaseAuthDomain: 'pubg-siam-a674f.firebaseapp.com',
  firebaseProjectId: 'pubg-siam-a674f',
  firebaseStorageBucket: 'pubg-siam-a674f.firebasestorage.app',
  firebaseMessagingSenderId: '792858737977',
  firebaseAppId: '1:792858737977:web:8f95f4519b8aee31c5fce8',

  // Supabase (Legacy)
  supabaseUrl: 'https://ldcafwhhchadgfijiqte.supabase.co',
  supabaseAnonKey: '',

  // China Real-time Sync Configuration 🇨🇳
  chinaSyncActive: false,
  chinaCnyRateThb: 5.2,
  chinaCnyRateVnd: 3700,
  chinaMarkupPercent: 15,
  chinaSyncIntervalMinutes: 15,
  chinaSyncPages: 2,
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

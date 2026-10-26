export const defaultStoreSettings = {
  // Payment Gateways - Thailand 🇹🇭
  promptPayActive: true,
  promptPayId: '0891234567',
  promptPayName: 'นาย สิมะ ช็อป (SIMA SHOP)',
  truemoneyActive: true,
  truemoneyPhone: '089-123-4567',

  // Payment Gateways - Vietnam 🇻🇳
  vietQrActive: true,
  vietQrBank: 'MB',
  vietQrAccountNo: '0987654321',
  vietQrAccountName: 'SIMA SHOP VN',
  momoActive: true,
  momoPhone: '0987654321',

  // Verification & Delivery
  autoDelivery: true,
  autoSlipVerify: true,

  // Announcements & Support
  announcementText: '🔥 SIMA Shop ตลาดซื้อ-ขายไอดี PUBG PC (Steam) อันดับ 1 | ปลอดภัย 100% ส่งมอบเมลแรก & โอนย้าย Steam ทันที',
  supportLine: '@SIMASHOP',
  supportDiscord: 'discord.gg/simashop',

  // Store Front Metrics (Delivered Count)
  deliveredCountMode: 'real', // 'real' | 'custom'
  baseDeliveredCount: 0,

  // Cloud Database (Supabase)
  supabaseUrl: 'https://ldcafwhhchadgfijiqte.supabase.co',
  supabaseAnonKey: '',
  useCloudDb: false
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

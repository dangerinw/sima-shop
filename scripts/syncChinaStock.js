// =====================================================================
// SIMA SHOP - Automated China Stock Sync Daemon
// Supports Google Firebase Firestore 🔥 + Supabase ⚡
// Can run locally, on VPS/Docker, or in GitHub Actions 24/7
// =====================================================================

const https = require('https');

// Default Config (Can be overridden by Environment variables)
const CONFIG = {
  // Google Firebase 🔥
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
  firebaseApiKey: process.env.FIREBASE_API_KEY || '',

  // Supabase ⚡
  supabaseUrl: process.env.SUPABASE_URL || 'https://ldcafwhhchadgfijiqte.supabase.co',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',

  pages: parseInt(process.env.SYNC_PAGES || '3', 10), // 3 pages = 60 accounts per cycle
  cnyRateThb: parseFloat(process.env.CNY_RATE_THB || '5.2'),
  cnyRateVnd: parseFloat(process.env.CNY_RATE_VND || '3700'),
  markupPercent: parseFloat(process.env.MARKUP_PERCENT || '15'),
  intervalMinutes: parseInt(process.env.SYNC_INTERVAL || '15', 10)
};

// Chinese Skin Dictionary for translation
const CHINESE_SKIN_DICTIONARY = [
  { cn: '升级武器', th: 'ปืนอัปเกรด', en: 'Progressive Guns' },
  { cn: '满级', th: 'Lv.10 Max', en: 'Lv.10 Max' },
  { cn: '异色', th: 'Chroma สีพิเศษ', en: 'Chroma Edition' },
  { cn: '竞争者', th: 'Battlestat', en: 'Battlestat' },
  { cn: '火麒麟', th: 'Beryl กิเลนไฟ', en: 'Fire Dragon Beryl' },
  { cn: '美杜莎', th: 'Medusa เมดูซ่า', en: 'Medusa' },
  { cn: '南瓜M4', th: 'M416 ฟักทองฮาโลวีน', en: 'Trick-or-treat M416' },
  { cn: '南瓜m4', th: 'M416 ฟักทองฮาโลวีน', en: 'Trick-or-treat M416' },
  { cn: '南瓜', th: 'M416 ฟักทอง', en: 'Pumpkin M416' },
  { cn: '齿轮大炮', th: 'AWM ฟันเฟือง Gear Head', en: 'Gear Head AWM' },
  { cn: '猪八戒', th: 'หมูทองคำ Pigsy', en: 'Pigsy Skin' },
  { cn: '爆裂AUG', th: 'AUG แดงระเบิดศึก', en: 'Blast AUG' },
  { cn: '宇宙之力98K', th: 'Kar98k พลังจักรวาล', en: 'Cosmic Kar98k' },
  { cn: '宇宙之力', th: 'Kar98k พลังจักรวาล', en: 'Cosmic Power' },
  { cn: '妖魔之触', th: 'Demon Touch', en: 'Demon Touch' },
  { cn: '朱雀', th: 'หงส์เพลิงจูเชว่', en: 'Vermilion Bird' },
  { cn: '金龙', th: 'มังกรทองคำ', en: 'Golden Dragon' },
  { cn: '德拉贡', th: 'Dragunov สกินเทพ', en: 'Dragunov Elite' },
  { cn: '圣诞mini', th: 'Mini14 คริสต์มาส', en: 'Christmas Mini14' },
  { cn: '牛头AUG', th: 'AUG มิโนทอร์กระทิงทอง', en: 'Minotaur AUG' },
  { cn: '极品', th: 'ไอดีเทพท็อปเซิร์ฟ', en: 'God Tier' },
  { cn: '柏林', th: 'PGI เบอร์ลินระดับตำนาน', en: 'PGI Berlin' },
  { cn: '大魔王', th: 'Demon King จอมมาร', en: 'Demon King' },
  { cn: '迈阿密', th: 'ฮาวายไมอามี่ Miami Floral', en: 'Miami Floral' },
  { cn: '金手指', th: 'ถุงมือทองคำ Golden Finger', en: 'Golden Finger' },
  { cn: '东南亚', th: 'เซ็ตเอเชียอาคเนย์ SEA', en: 'SEA Major Outfit' },
  { cn: '黑东', th: 'ชุดเอเชียอาคเนย์ดำ Black SEA', en: 'Black SEA Set' },
  { cn: '红东', th: 'ชุดเอเชียอาคเนย์แดง Red SEA', en: 'Red SEA Set' },
  { cn: '绿东', th: 'ชุดเอเชียอาคเนย์เขียว Green SEA', en: 'Green SEA Set' },
  { cn: '尼尔头', th: 'หัวเนียร์ Nier Mask', en: 'Nier Headgear' },
  { cn: '尼尔', th: 'ชุดเนียร์ Nier Automata', en: 'Nier Automata' },
  { cn: '女团套', th: 'เซ็ตไอดอลเกาหลี Girl Group', en: 'Girl Group Outfit' },
  { cn: '女团', th: 'เซ็ตสาวเกาหลี K-Pop Idol', en: 'K-Pop Girl Group' },
  { cn: '全手套', th: 'ถุงมือแรร์ครบชุด', en: 'All Gloves Collection' },
  { cn: '跑车', th: 'ซูเปอร์คาร์', en: 'Supercar' },
  { cn: '阿斯顿马丁', th: 'Aston Martin', en: 'Aston Martin' },
  { cn: '兰博基尼', th: 'Lamborghini Urus', en: 'Lamborghini Urus' },
  { cn: '保时捷', th: 'Porsche Cayenne', en: 'Porsche Cayenne' }
];

function translateTitle(cnTitle, lang = 'th') {
  let res = cnTitle;
  CHINESE_SKIN_DICTIONARY.forEach((dict) => {
    if (res.includes(dict.cn)) {
      res = res.replaceAll(dict.cn, ` [${dict[lang] || dict.th}] `);
    }
  });
  return res.replace(/\s+/g, ' ').trim();
}

function detectCategory(title) {
  if (title.includes('升级武器') || title.includes('满级') || title.includes('火麒麟') || title.includes('美杜莎')) return 'progressive';
  if (title.includes('柏林') || title.includes('东南亚') || title.includes('金手指') || title.includes('尼尔')) return 'rare-skins';
  if (title.includes('排位') || title.includes('阶段')) return 'rank-ready';
  return 'progressive';
}

function httpRequest(url, method, payload, customHeaders = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const postData = payload ? JSON.stringify(payload) : '';
    const req = https.request({
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...customHeaders
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (_) {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

// Convert JSON object to Firestore typed fields
function toFirestoreFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;
    if (typeof v === 'string') fields[k] = { stringValue: v };
    else if (typeof v === 'number') {
      if (Number.isInteger(v)) fields[k] = { integerValue: v.toString() };
      else fields[k] = { doubleValue: v };
    }
    else if (typeof v === 'boolean') fields[k] = { booleanValue: v };
    else if (Array.isArray(v)) {
      fields[k] = { arrayValue: { values: v.map(item => ({ stringValue: String(item) })) } };
    }
  }
  return { fields };
}

async function syncCycle() {
  console.log(`\n======================================================`);
  console.log(`[${new Date().toLocaleString()}] 🚀 เริ่มต้นรอบซิงค์สต็อกไอดีจีน Real-time...`);
  if (CONFIG.firebaseProjectId) console.log(`✓ ปลายทางคลาวด์: Google Firebase Firestore [${CONFIG.firebaseProjectId}] 🔥`);
  if (CONFIG.supabaseAnonKey) console.log(`✓ ปลายทางคลาวด์: Supabase Cloud DB [${CONFIG.supabaseUrl}] ⚡`);
  console.log(`======================================================`);

  let totalUpserted = 0;

  for (let page = 1; page <= CONFIG.pages; page++) {
    console.log(`📥 กำลังดึงสต็อกจีน หน้า ${page}/${CONFIG.pages}...`);
    try {
      const res = await httpRequest('https://fzht.xuxug.com/api/api/newShangpinList', 'POST', {
        page,
        size: 20,
        datainfo: { zuidijia: '', zuigaojia: '', guanjianci: '', biaoqian: [], paixu: '' }
      }, {
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://xuegaokk.ayxds.com',
        'Referer': 'https://xuegaokk.ayxds.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36'
      });

      const items = res.data?.data?.data || [];
      console.log(`✓ ได้รับข้อมูล ${items.length} รายการจากหน้า ${page}`);

      for (const item of items) {
        // Fetch screenshots
        let screenshots = [];
        try {
          const detailRes = await httpRequest('https://fzht.xuxug.com/api/api/newGoodsDetails', 'POST', { id: item.id }, {
            'Origin': 'https://xuegaokk.ayxds.com',
            'Referer': 'https://xuegaokk.ayxds.com/'
          });
          const detailData = detailRes.data?.data || {};
          const imgRegex = /src=["']([^"']+)["']/g;
          let m;
          while ((m = imgRegex.exec(detailData.xiangqing || '')) !== null) {
            screenshots.push(m[1]);
          }
        } catch (_) {}

        const images = [item.img, ...screenshots].filter(Boolean);
        const rmbPrice = Number(item.shoujia || 0);
        const multiplier = 1 + (CONFIG.markupPercent / 100);
        const priceTHB = Math.round((rmbPrice * CONFIG.cnyRateThb * multiplier) / 10) * 10;
        const priceVND = Math.round((rmbPrice * CONFIG.cnyRateVnd * multiplier) / 1000) * 1000;

        const title = item.title || 'PUBG PC Steam Account';
        const accountPayload = {
          id: `CN-${item.bianhao || item.id}`,
          region: 'cn',
          category: detectCategory(title),
          title_th: `ไอดีจีน: ${translateTitle(title, 'th')}`,
          title_en: `CN Steam: ${translateTitle(title, 'en')}`,
          subtitle_th: `ไอดีเซิร์ฟจีนแท้ [รหัส ${item.bianhao}] ปลอดภัย 100% ประกันมือ 1`,
          subtitle_en: `Authentic CN Account [Code ${item.bianhao}] 100% Secured`,
          price_thb: priceTHB,
          price_vnd: priceVND,
          original_price_thb: Math.round(priceTHB * 1.15),
          original_price_vnd: Math.round(priceVND * 1.15),
          tags: ['ChineseServer', 'OriginalMail', 'Progressive'],
          images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'],
          binding_th: 'id steam เซิร์ฟจีน โอนย้ายเข้าเมลผู้ซื้อทันที มีประกันมือ 1',
          binding_en: 'Authentic CN Steam ID, transferred directly to buyer with warranty',
          rank: '5阶段 (Survivor Tier)',
          playtime_th: '1,500+ ชม.',
          playtime_en: '1,500+ hrs',
          gun_level_th: 'Progressive Weapon Arsenal',
          gun_level_en: 'Progressive Weapon Arsenal',
          warranty_th: 'มีประกันมือ 1 แท้ (ปลอดภัย 100% ไม่ดึงคืน)',
          warranty_en: '1st Hand Owner Warranty (100% Anti-pullback)',
          details_th: `รหัสสินค้าจีน: ${item.bianhao}\nราคาหยวน: ¥${rmbPrice} RMB\nรายละเอียด: ${title}`,
          details_en: `Product Code: ${item.bianhao}\nCNY Price: ¥${rmbPrice} RMB\nDetails: ${title}`,
          steam_user: `cn_steam_${item.bianhao.toLowerCase()}`,
          steam_pass: `SimaCN#${(item.id || 9999).toString().slice(-4)}`,
          steam_email: `pubg_cn_${item.bianhao.toLowerCase()}@163.com | pass: Sima2026!`,
          is_sold: false,
          is_hot: rmbPrice >= 5000 || title.includes('极品'),
          accent_color: 'from-amber-950/60 via-slate-900 to-slate-950',
          updated_at: new Date().toISOString()
        };

        let saved = false;

        // 1. Write to Google Firebase Firestore
        if (CONFIG.firebaseProjectId) {
          try {
            const fbUrl = `https://firestore.googleapis.com/v1/projects/${CONFIG.firebaseProjectId}/databases/(default)/documents/accounts/${accountPayload.id}` +
                          (CONFIG.firebaseApiKey ? `?key=${CONFIG.firebaseApiKey}` : '');
            await httpRequest(fbUrl, 'PATCH', toFirestoreFields(accountPayload));
            saved = true;
            process.stdout.write(`🔥`);
          } catch (e) {
            process.stdout.write(`x`);
          }
        }

        // 2. Write to Supabase (if configured)
        if (CONFIG.supabaseAnonKey) {
          try {
            await httpRequest(`${CONFIG.supabaseUrl}/rest/v1/accounts`, 'POST', accountPayload, {
              'apikey': CONFIG.supabaseAnonKey,
              'Authorization': `Bearer ${CONFIG.supabaseAnonKey}`,
              'Prefer': 'resolution=merge-duplicates'
            });
            saved = true;
            process.stdout.write(`⚡`);
          } catch (e) {
            process.stdout.write(`x`);
          }
        }

        if (saved) totalUpserted++;
      }
      console.log(`\nหน้า ${page} เสร็จสิ้น`);
    } catch (err) {
      console.error(`Error fetching page ${page}:`, err.message);
    }
  }

  console.log(`\n🎉 รอบซิงค์เสร็จสมบูรณ์! อัปเดตไอดีเข้าฐานข้อมูลคลาวด์แล้ว ${totalUpserted} ไอดี`);
}

// Main Runner
const isWatch = process.argv.includes('--watch');

syncCycle().then(() => {
  if (isWatch) {
    console.log(`\n⏱️ โหมด Watch ทำงาน: จะรันรอบใหม่ทุกๆ ${CONFIG.intervalMinutes} นาที...`);
    setInterval(syncCycle, CONFIG.intervalMinutes * 60 * 1000);
  } else {
    console.log(`\nเสร็จสิ้นรอบการทำงาน (One-off run).`);
  }
}).catch(console.error);

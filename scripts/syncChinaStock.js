// =====================================================================
// PUBG SIAM - Automated China Stock Sync Daemon 🇨🇳
// Supports Direct Zero-Cost JSON Output (public/data/china_stock.json)
// Dynamic Tiered Markup: < 100,000฿ (+10%), >= 100,000฿ (+13%)
// Optional Google Firebase Firestore 🔥 & Supabase ⚡
// =====================================================================

const https = require('https');
const fs = require('fs');
const path = require('path');

// Parse CLI flags
const args = process.argv.slice(2);
const isWatch = args.includes('--watch');
const pagesArg = args.find(a => a.startsWith('--pages=') || a === '-p');
let cliPages = 5; // Default 5 pages = 100 accounts
if (pagesArg) {
  if (pagesArg.startsWith('--pages=')) cliPages = parseInt(pagesArg.split('=')[1], 10);
  else {
    const idx = args.indexOf(pagesArg);
    if (idx !== -1 && args[idx + 1]) cliPages = parseInt(args[idx + 1], 10);
  }
}
const shouldSaveFirebase = args.includes('--firebase');
const shouldSaveSupabase = args.includes('--supabase');

const CONFIG = {
  // Google Firebase 🔥
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || 'sima-shop-a674f',
  firebaseApiKey: process.env.FIREBASE_API_KEY || 'AIzaSyDjg9hzjBB1Nh3rZmoLgHEBhiovGteLXhk',

  // Supabase ⚡
  supabaseUrl: process.env.SUPABASE_URL || 'https://ldcafwhhchadgfijiqte.supabase.co',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',

  pages: cliPages,
  cnyRateThb: parseFloat(process.env.CNY_RATE_THB || '5.2'),
  cnyRateVnd: parseFloat(process.env.CNY_RATE_VND || '3700'),

  // Dynamic Tiered Profit Markup 🧮
  markupMode: process.env.MARKUP_MODE || 'tiered', // 'tiered' | 'flat'
  markupThreshold: parseFloat(process.env.MARKUP_THRESHOLD || '100000'), // 100,000 THB
  markupTier1Percent: parseFloat(process.env.MARKUP_TIER1_PERCENT || '10'), // < 100k -> +10%
  markupTier2Percent: parseFloat(process.env.MARKUP_TIER2_PERCENT || '13'), // >= 100k -> +13%
  markupPercent: parseFloat(process.env.MARKUP_PERCENT || '10'), // fallback

  intervalMinutes: parseInt(process.env.SYNC_INTERVAL || '15', 10),
  outputPath: path.resolve(__dirname, '../new-react-app/public/data/china_stock.json')
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
  { cn: '假魔王', th: 'Demon King Style', en: 'Demon King Style' },
  { cn: '迈阿密', th: 'ฮาวายไมอามี่ Miami Floral', en: 'Miami Floral' },
  { cn: '金手指', th: 'ถุงมือทองคำ Golden Finger', en: 'Golden Finger' },
  { cn: '东南亚', th: 'เซ็ตเอเชียอาคเนย์ SEA', en: 'SEA Major Outfit' },
  { cn: '黑东', th: 'ชุดเอเชียอาคเนย์ดำ Black SEA', en: 'Black SEA Set' },
  { cn: '红东', th: 'ชุดเอเชียอาคเนย์แดง Red SEA', en: 'Red SEA Set' },
  { cn: '绿东', th: 'ชุดเอเชียอาคเนย์เขียว Green SEA', en: 'Green SEA Set' },
  { cn: '小绿东', th: 'ชุดเอเชียอาคเนย์เขียว', en: 'Green SEA Set' },
  { cn: '尼尔头', th: 'หัวเนียร์ Nier Mask', en: 'Nier Headgear' },
  { cn: '尼尔', th: 'ชุดเนียร์ Nier Automata', en: 'Nier Automata' },
  { cn: '卡崔娜', th: 'ชุดคัทริน่า Katrina', en: 'Katrina Set' },
  { cn: '女团套', th: 'เซ็ตไอดอลเกาหลี Girl Group', en: 'Girl Group Outfit' },
  { cn: '女团', th: 'เซ็ตสาวเกาหลี K-Pop Idol', en: 'K-Pop Girl Group' },
  { cn: '1代女团', th: 'เกิร์ลกรุ๊ป Gen 1 (Blackpink)', en: 'Girl Group Gen 1' },
  { cn: '2代女团', th: 'เกิร์ลกรุ๊ป Gen 2 (NewJeans)', en: 'Girl Group Gen 2' },
  { cn: '全手套', th: 'ถุงมือแรร์ครบชุด', en: 'All Gloves Collection' },
  { cn: '跑车', th: 'ซูเปอร์คาร์', en: 'Supercar' },
  { cn: '多跑车', th: 'ซูเปอร์คาร์หลายคัน', en: 'Multi Supercars' },
  { cn: '阿斯顿马丁', th: 'Aston Martin', en: 'Aston Martin' },
  { cn: '兰博基尼', th: 'Lamborghini Urus', en: 'Lamborghini Urus' },
  { cn: '保时捷', th: 'Porsche Cayenne', en: 'Porsche Cayenne' }
];

function translateTitle(cnTitle = '', lang = 'th') {
  let res = cnTitle;
  CHINESE_SKIN_DICTIONARY.forEach((dict) => {
    if (res.includes(dict.cn)) {
      res = res.replaceAll(dict.cn, ` [${dict[lang] || dict.th}] `);
    }
  });
  return res.replace(/\s+/g, ' ').trim();
}

function detectCategory(title = '') {
  if (title.includes('升级武器') || title.includes('满级') || title.includes('火麒麟') || title.includes('美杜莎') || title.includes('南瓜')) return 'progressive';
  if (title.includes('柏林') || title.includes('东南亚') || title.includes('金手指') || title.includes('尼尔') || title.includes('女团') || title.includes('黑东')) return 'rare-skins';
  if (title.includes('排位') || title.includes('阶段') || title.includes('生存')) return 'rank-ready';
  return 'progressive';
}

function extractTags(title = '') {
  const tags = ['ChineseServer', 'OriginalMail'];
  if (title.includes('升级武器') || title.includes('满级') || title.includes('火麒麟') || title.includes('美杜莎')) tags.push('Progressive');
  if (title.includes('柏林') || title.includes('东南亚') || title.includes('金手指') || title.includes('尼尔') || title.includes('女团')) tags.push('RareSkins');
  if (title.includes('跑车') || title.includes('车')) tags.push('Supercars');
  if (title.includes('排位') || title.includes('阶段')) tags.push('RankReady');
  if (title.includes('极品') || title.includes('柏林')) tags.push('HotDeal');
  return Array.from(new Set(tags));
}

function extractGunLevels(title = '') {
  const gunMatch = title.match(/(\d+级[^\d\s,]+)/g);
  if (gunMatch && gunMatch.length > 0) {
    return gunMatch.slice(0, 4).map(item => {
      let mapped = item;
      CHINESE_SKIN_DICTIONARY.forEach(d => {
        if (mapped.includes(d.cn)) {
          mapped = mapped.replace(d.cn, d.th);
        }
      });
      return mapped.replace(/(\d+)级/, 'Lv.$1 ');
    }).join(' | ');
  }
  return 'Progressive Weapon Arsenal';
}

/**
 * Tiered Markup Price Calculator
 * < 100,000 THB: +10%
 * >= 100,000 THB: +13%
 */
function calculateTieredPrice(rmbPrice) {
  const rawRmb = Number(rmbPrice || 0);
  const rawThb = rawRmb * CONFIG.cnyRateThb;
  const rawVnd = rawRmb * CONFIG.cnyRateVnd;

  let activeMarkupPercent = CONFIG.markupPercent;
  if (CONFIG.markupMode === 'tiered') {
    if (rawThb < CONFIG.markupThreshold) {
      activeMarkupPercent = CONFIG.markupTier1Percent;
    } else {
      activeMarkupPercent = CONFIG.markupTier2Percent;
    }
  }

  const multiplier = 1 + (activeMarkupPercent / 100);
  const priceTHB = Math.round((rawThb * multiplier) / 10) * 10;
  const priceVND = Math.round((rawVnd * multiplier) / 1000) * 1000;

  return {
    rawThb,
    priceTHB,
    priceVND,
    originalPriceTHB: Math.round(priceTHB * 1.15),
    originalPriceVND: Math.round(priceVND * 1.15),
    activeMarkupPercent,
    profitTHB: Math.round(rawThb * (activeMarkupPercent / 100))
  };
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
  console.log(`[${new Date().toLocaleString()}] 🚀 เริ่มต้นรอบซิงค์สต็อกไอดีจีน PUBG SIAM...`);
  console.log(`✓ โหมดราคาแบบขั้นบันได (Tiered Markup):`);
  console.log(`   - ทุน < ฿${CONFIG.markupThreshold.toLocaleString()} => +${CONFIG.markupTier1Percent}% กำไร`);
  console.log(`   - ทุน >= ฿${CONFIG.markupThreshold.toLocaleString()} => +${CONFIG.markupTier2Percent}% กำไร`);
  console.log(`   - เรทหยวน: 1 RMB = ${CONFIG.cnyRateThb} THB | ${CONFIG.cnyRateVnd} VND`);
  console.log(`✓ บันทึกลง Static File: ${CONFIG.outputPath} (ประหยัดฐานข้อมูล ไม่เปลือง Firebase)`);
  if (shouldSaveFirebase) console.log(`✓ Google Firebase Firestore: เปิดใช้งาน`);
  if (shouldSaveSupabase) console.log(`✓ Supabase Cloud DB: เปิดใช้งาน`);
  console.log(`======================================================`);

  const allAccounts = [];

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
        let detailData = {};
        try {
          const detailRes = await httpRequest('https://fzht.xuxug.com/api/api/newGoodsDetails', 'POST', { id: item.id }, {
            'Origin': 'https://xuegaokk.ayxds.com',
            'Referer': 'https://xuegaokk.ayxds.com/'
          });
          detailData = detailRes.data?.data || {};
          const imgRegex = /src=["']([^"']+)["']/g;
          let m;
          while ((m = imgRegex.exec(detailData.xiangqing || '')) !== null) {
            if (m[1] && !screenshots.includes(m[1])) {
              screenshots.push(m[1]);
            }
          }
        } catch (_) {}

        const images = [item.img, ...screenshots].filter(Boolean);
        const rmbPrice = Number(item.shoujia || detailData.shoujia || 0);
        const priceInfo = calculateTieredPrice(rmbPrice);
        const title = item.title || detailData.title || 'PUBG PC Steam Account';
        const survivalTier = detailData.shengcundengji || '5阶段';
        const playtime = survivalTier === '5阶段' ? '1,500+ ชม.' : (survivalTier === '4阶段' ? '1,000+ ชม.' : '600+ ชม.');
        const playtimeEn = survivalTier === '5阶段' ? '1,500+ hrs' : (survivalTier === '4阶段' ? '1,000+ hrs' : '600+ hrs');

        const account = {
          id: `CN-${item.bianhao || item.id}`,
          region: 'cn',
          category: detectCategory(title),
          title_th: `ไอดีจีน: ${translateTitle(title, 'th')}`,
          title_en: `CN Steam: ${translateTitle(title, 'en')}`,
          subtitle_th: `ไอดีเซิร์ฟจีนแท้ [รหัส ${item.bianhao}] ปลอดภัย 100% ประกันมือ 1 PUBG SIAM`,
          subtitle_en: `Authentic Chinese Server [Code ${item.bianhao}] 100% Secured PUBG SIAM`,
          rmbPrice: rmbPrice,
          priceTHB: priceInfo.priceTHB,
          priceVND: priceInfo.priceVND,
          originalPriceTHB: priceInfo.originalPriceTHB,
          originalPriceVND: priceInfo.originalPriceVND,
          markupAppliedPercent: priceInfo.activeMarkupPercent,
          profitTHB: priceInfo.profitTHB,
          tags: extractTags(title),
          images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'],
          binding_th: 'id steam เซิร์ฟจีน โอนย้ายเข้าเมลผู้ซื้อทันที มีประกันมือ 1',
          binding_en: 'Authentic CN Steam ID, transferred directly to buyer with warranty',
          rank: `${survivalTier} (Rank Ready Plus)`,
          playtime_th: playtime,
          playtime_en: playtimeEn,
          gunLevel_th: extractGunLevels(title),
          gunLevel_en: extractGunLevels(title),
          warranty_th: 'มีประกันมือ 1 แท้ (ปลอดภัย 100% ไม่ดึงคืน)',
          warranty_en: '1st Hand Owner Warranty (100% Anti-pullback)',
          details_th: `รหัสไอดีจีน: ${item.bianhao}\nราคาทุนจีน: ¥${rmbPrice} RMB (≈ ฿${Math.round(priceInfo.rawThb).toLocaleString()})\nกำไรบวกเพิ่ม: +${priceInfo.activeMarkupPercent}%\nรายละเอียดจากระบบจีน: ${title}\nอัปเดตสต็อกล่าสุด: ${item.zuihou_caozuo_time || new Date().toISOString()}`,
          details_en: `China Stock Code: ${item.bianhao}\nOriginal Price: ¥${rmbPrice} RMB\nMarkup: +${priceInfo.activeMarkupPercent}%\nDetails: ${title}\nLast Stock Update: ${item.zuihou_caozuo_time || new Date().toISOString()}`,
          videoUrl: '',
          steamUser: `cn_steam_${item.bianhao.toLowerCase()}`,
          steamPass: `SiamCN#${(item.id || 8888).toString().slice(-4)}`,
          steamEmail: `pubg_cn_${item.bianhao.toLowerCase()}@163.com | pass: Siam2026!`,
          isSold: false,
          isHot: rmbPrice >= 5000 || title.includes('极品') || title.includes('柏林'),
          accentColor: 'from-amber-950/60 via-slate-900 to-slate-950',
          createdAt: new Date().toISOString()
        };

        allAccounts.push(account);
        process.stdout.write(`.`);

        // Optional Firebase
        if (shouldSaveFirebase && CONFIG.firebaseProjectId) {
          try {
            const fbUrl = `https://firestore.googleapis.com/v1/projects/${CONFIG.firebaseProjectId}/databases/(default)/documents/accounts/${account.id}` +
                          (CONFIG.firebaseApiKey ? `?key=${CONFIG.firebaseApiKey}` : '');
            await httpRequest(fbUrl, 'PATCH', toFirestoreFields(account));
          } catch (_) {}
        }

        // Optional Supabase
        if (shouldSaveSupabase && CONFIG.supabaseAnonKey) {
          try {
            await httpRequest(`${CONFIG.supabaseUrl}/rest/v1/accounts`, 'POST', account, {
              'apikey': CONFIG.supabaseAnonKey,
              'Authorization': `Bearer ${CONFIG.supabaseAnonKey}`,
              'Prefer': 'resolution=merge-duplicates'
            });
          } catch (_) {}
        }
      }
      console.log(`\n✓ หน้า ${page} ดึงเสร็จสิ้น (${allAccounts.length} ไอดีสะสม)`);
    } catch (err) {
      console.error(`Error fetching page ${page}:`, err.message);
    }
  }

  // 1. Write to JSON File
  try {
    const dir = path.dirname(CONFIG.outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG.outputPath, JSON.stringify(allAccounts, null, 2), 'utf8');
    console.log(`\n💾 บันทึกไฟล์ ${CONFIG.outputPath} สำเร็จแล้ว (${allAccounts.length} ไอดี)!`);
  } catch (fsErr) {
    console.error('Failed to write JSON output:', fsErr.message);
  }

  console.log(`\n🎉 รอบซิงค์เสร็จสมบูรณ์! ได้รับไอดีจีนทั้งหมด ${allAccounts.length} ไอดี พร้อมเรทกำไรแบบขั้นบันได`);
}

// Main Runner
syncCycle().then(() => {
  if (isWatch) {
    console.log(`\n⏱️ โหมด Watch ทำงาน: จะรันรอบใหม่ทุกๆ ${CONFIG.intervalMinutes} นาที...`);
    setInterval(syncCycle, CONFIG.intervalMinutes * 60 * 1000);
  } else {
    console.log(`\nเสร็จสิ้นรอบการทำงาน (One-off run).`);
  }
}).catch(console.error);

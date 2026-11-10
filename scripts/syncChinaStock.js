// =====================================================================
// PUBG SIAM - Automated China Stock Sync Daemon 🇨🇳
// Supports Direct Zero-Cost JSON Output (public/data/china_stock.json)
// Dynamic Tiered Markup: < 100,000฿ (+10%), >= 100,000฿ (+13%)
// Fast Concurrent Engine: Can pull ALL accounts (12,000+ items) in minutes!
// =====================================================================

const https = require('https');
const fs = require('fs');
const path = require('path');

// Parse CLI flags
const args = process.argv.slice(2);
const isWatch = args.includes('--watch');
const fetchAll = args.includes('--all') || args.includes('-a');
const shouldFetchScreenshots = args.includes('--screenshots');

let cliPages = fetchAll ? 9999 : 50; // Default 50 pages = 1,000 accounts if not specified

const pagesEq = args.find(a => a.startsWith('--pages='));
if (pagesEq) {
  const val = pagesEq.split('=')[1];
  cliPages = val.toLowerCase() === 'all' ? 9999 : parseInt(val, 10);
} else {
  const pIdx = args.findIndex(a => a === '--pages' || a === '-p');
  if (pIdx !== -1 && args[pIdx + 1]) {
    const val = args[pIdx + 1];
    cliPages = val.toLowerCase() === 'all' ? 9999 : parseInt(val, 10);
  }
}

const shouldSaveFirebase = args.includes('--firebase');
const shouldSaveSupabase = args.includes('--supabase');

const CONFIG = {
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || 'sima-shop-a674f',
  firebaseApiKey: process.env.FIREBASE_API_KEY || 'AIzaSyDjg9hzjBB1Nh3rZmoLgHEBhiovGteLXhk',
  supabaseUrl: process.env.SUPABASE_URL || 'https://ldcafwhhchadgfijiqte.supabase.co',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',

  pages: cliPages,
  cnyRateThb: parseFloat(process.env.CNY_RATE_THB || '5.2'),
  cnyRateVnd: parseFloat(process.env.CNY_RATE_VND || '3700'),

  // Dynamic Tiered Profit Markup 🧮
  markupMode: process.env.MARKUP_MODE || 'tiered',
  markupThreshold: parseFloat(process.env.MARKUP_THRESHOLD || '100000'),
  markupTier1Percent: parseFloat(process.env.MARKUP_TIER1_PERCENT || '10'),
  markupTier2Percent: parseFloat(process.env.MARKUP_TIER2_PERCENT || '13'),
  markupPercent: parseFloat(process.env.MARKUP_PERCENT || '10'),

  intervalMinutes: parseInt(process.env.SYNC_INTERVAL || '30', 10),
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

async function fetchPage(page, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
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
      if (res.data?.data) {
        return res.data.data;
      }
    } catch (err) {}
    if (attempt < retries) {
      await new Promise(r => setTimeout(r, 400));
    }
  }
  return {};
}

async function syncCycle() {
  console.log(`\n======================================================`);
  console.log(`[${new Date().toLocaleString()}] 🚀 เริ่มต้นรอบซิงค์สต็อกไอดีจีนแบบเต็มคลัง (Full Stock Engine)...`);
  
  // Wipe previous file if wiping requested or full sweep
  if (fetchAll && fs.existsSync(CONFIG.outputPath)) {
    try {
      fs.unlinkSync(CONFIG.outputPath);
      console.log(`🗑️ ลบไฟล์สต็อกเดิมออกเรียบร้อย: ${CONFIG.outputPath}`);
    } catch (_) {}
  }

  // 1. Fetch Page 1 to inspect total items and total pages
  const firstPageRes = await fetchPage(1);
  const totalInMarket = firstPageRes.total || 12300;
  const lastPageInMarket = firstPageRes.last_page || 616;

  const targetPages = fetchAll ? lastPageInMarket : Math.min(CONFIG.pages, lastPageInMarket);

  console.log(`✓ ข้อมูลคลังจีนทั้งหมดในระบบ: ${totalInMarket.toLocaleString()} ไอดี (${lastPageInMarket} หน้า)`);
  console.log(`✓ เป้าหมายการกวาดรอบนี้: กวาดทั้งหมด ${targetPages} หน้า (ประมาณ ${targetPages * 20} ไอดี)`);
  console.log(`✓ โหมดกำไรขั้นบันได: < ฿${CONFIG.markupThreshold.toLocaleString()} (+${CONFIG.markupTier1Percent}%) | >= ฿${CONFIG.markupThreshold.toLocaleString()} (+${CONFIG.markupTier2Percent}%)`);
  console.log(`✓ ปลายทาง: ${CONFIG.outputPath} (Zero-DB Free Mode)`);
  console.log(`======================================================`);

  const accountMap = new Map();
  const CONCURRENCY = 8;
  const startTime = Date.now();

  for (let p = 1; p <= targetPages; p += CONCURRENCY) {
    const batchPages = [];
    for (let offset = 0; offset < CONCURRENCY && (p + offset) <= targetPages; offset++) {
      batchPages.push(p + offset);
    }

    const results = await Promise.all(batchPages.map(page => fetchPage(page)));

    results.forEach((pageData) => {
      const items = pageData.data || [];
      items.forEach((item) => {
        const id = `CN-${item.bianhao || item.id}`;
        if (accountMap.has(id)) return;

        const rmbPrice = Number(item.shoujia || 0);
        const priceInfo = calculateTieredPrice(rmbPrice);
        const title = item.title || 'PUBG PC Steam Account';

        let survivalTier = '5阶段';
        if (title.includes('1阶段')) survivalTier = '1阶段';
        else if (title.includes('2阶段')) survivalTier = '2阶段';
        else if (title.includes('3阶段')) survivalTier = '3阶段';
        else if (title.includes('4阶段')) survivalTier = '4阶段';
        else if (title.includes('5阶段')) survivalTier = '5阶段';

        const playtime = survivalTier === '5阶段' ? '1,500+ ชม.' : (survivalTier === '4阶段' ? '1,000+ ชม.' : '600+ ชม.');
        const playtimeEn = survivalTier === '5阶段' ? '1,500+ hrs' : (survivalTier === '4阶段' ? '1,000+ hrs' : '600+ hrs');

        const images = [];
        if (item.img) images.push(item.img);

        const account = {
          id,
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
          details_th: `รหัสไอดี: #${item.bianhao}\nราคาจำหน่าย: ฿${priceInfo.priceTHB.toLocaleString()} (${priceInfo.priceVND.toLocaleString()} ₫)\nรายละเอียดสกิน & ของแต่ง: ${title}\nสถานะ: พร้อมส่งมอบอีเมลแรกแท้ 100%`,
          details_en: `Stock ID: #${item.bianhao}\nPrice: ฿${priceInfo.priceTHB.toLocaleString()} (${priceInfo.priceVND.toLocaleString()} ₫)\nSkin Details: ${title}\nStatus: 100% Verified Steam Account with First Mail`,
          videoUrl: '',
          steamUser: `cn_steam_${item.bianhao.toLowerCase()}`,
          steamPass: `SiamCN#${(item.id || 8888).toString().slice(-4)}`,
          steamEmail: `pubg_cn_${item.bianhao.toLowerCase()}@163.com | pass: Siam2026!`,
          isSold: false,
          isHot: rmbPrice >= 5000 || title.includes('极品') || title.includes('柏林'),
          accentColor: 'from-amber-950/60 via-slate-900 to-slate-950',
          createdAt: new Date().toISOString()
        };

        accountMap.set(id, account);
      });
    });

    const endPage = Math.min(p + CONCURRENCY - 1, targetPages);
    const percent = Math.round((endPage / targetPages) * 100);
    const elapsedSec = Math.round((Date.now() - startTime) / 1000);
    process.stdout.write(`[${percent}%] หน้า ${p}-${endPage}/${targetPages} (รวม ${accountMap.size.toLocaleString()} ไอดีใน ${elapsedSec}s)\n`);
  }

  const allAccounts = Array.from(accountMap.values());

  // Write to JSON File
  try {
    const dir = path.dirname(CONFIG.outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG.outputPath, JSON.stringify(allAccounts, null, 2), 'utf8');
    console.log(`\n💾 บันทึกไฟล์สำเร็จ: ${CONFIG.outputPath} (ทั้งหมด ${allAccounts.length.toLocaleString()} ไอดีจีนพร้อมขาย)!`);
  } catch (fsErr) {
    console.error('Failed to write JSON output:', fsErr.message);
  }

  console.log(`\n🎉 กวาดไอดีสำเร็จสมบูรณ์! ได้รับไอดีทั้งหมด ${allAccounts.length.toLocaleString()} ไอดี`);
  return allAccounts.length;
}

// Main Runner
syncCycle().then(() => {
  if (isWatch) {
    console.log(`\n⏱️ โหมด Watch ทำงาน: จะรันรอบใหม่ทุกๆ ${CONFIG.intervalMinutes} นาที...`);
    setInterval(syncCycle, CONFIG.intervalMinutes * 60 * 1000);
  } else {
    console.log(`\nเสร็จสิ้นการทำงาน.`);
  }
}).catch(console.error);

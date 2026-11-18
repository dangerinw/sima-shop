// Vercel Serverless Function: Live Multi-Source China Arrivals Proxy
// Fetches fresh stock directly from all 3 Chinese marketplaces (XueGaoKK, XF Shop, XMGG)
// Dynamic Tiered Markup + Filters out accounts < 500 THB + Edge Caching

const CN_ID_MAP = {
  '北': 'BEI', '法': 'FA', '回': 'HUI', '雨人': 'YUREN', '钢子': 'GANGZI',
  '图图': 'TUTU', '沁沁': 'QINQIN', '聿': 'YU', '北方': 'BEIFANG',
  '小': 'XIAO', '老': 'LAO', '大': 'DA', '黑': 'HEI', '白': 'BAI',
  '红': 'HONG', '金': 'JIN', '号': 'NO', '带': 'WITH', '初始': 'INIT',
  '卡': 'CARD', '改名': 'RENAME', '券': 'TICKET', '寄': 'JI',
  '男': 'NAN', '女': 'NV', '利': 'LI', '商': 'SHANG', '业': 'YE',
  '新': 'XIN', '武': 'WU', '器': 'QI', '挂': 'GUA', '品': 'PIN',
  '安': 'AN', '时': 'SHI', '邮': 'MAIL', '多': 'DUO', '豪': 'HAO', '版': 'VER'
};

const SOURCES = [
  { key: 'xgkk', name: 'XueGaoKK (Link 4)', origin: 'https://xuegaokk.ayxds.com' },
  { key: 'xf', name: 'XF Shop (Link 1)', origin: 'https://xf.ayxds.com' },
  { key: 'xmgg', name: 'XMGG Shop (Link 3)', origin: 'https://xmgg.ayxds.com' }
];

function extractCleanCode(rawBianhao, id) {
  if (!rawBianhao) return String(id || '8888');
  let clean = rawBianhao.trim();
  for (const [cn, en] of Object.entries(CN_ID_MAP)) {
    clean = clean.split(cn).join(en);
  }
  clean = clean.replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase();
  return clean || String(id || '8888');
}

async function fetchSourceItems(src, page = 1) {
  try {
    const res = await fetch('https://fzht.xuxug.com/api/api/newShangpinList', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Origin': src.origin,
        'Referer': `${src.origin}/`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        page,
        size: 20,
        datainfo: { zuidijia: '', zuigaojia: '', guanjianci: '', biaoqian: [], paixu: '' }
      })
    });

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.data?.data) ? data.data.data : [];
  } catch (_) {
    return [];
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Edge cache on Vercel CDN for 30s, background revalidate for 60s
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const pages = Math.min(parseInt(req.query.pages || '2', 10), 3);
    const cnyRateThb = parseFloat(req.query.cnyRateThb || '5.2');
    const cnyRateVnd = parseFloat(req.query.cnyRateVnd || '3700');
    const markupTier1 = parseFloat(req.query.tier1 || '10');
    const markupTier2 = parseFloat(req.query.tier2 || '13');
    const threshold = parseFloat(req.query.threshold || '100000');

    // Fetch across all 3 stores concurrently
    const fetchPromises = [];
    for (const src of SOURCES) {
      for (let p = 1; p <= pages; p++) {
        fetchPromises.push(
          fetchSourceItems(src, p).then(items => ({ src, items }))
        );
      }
    }

    const results = await Promise.all(fetchPromises);
    const itemMap = new Map();
    const seenDedupKeys = new Set();

    for (const { src, items } of results) {
      for (const item of items) {
        const cleanCode = extractCleanCode(item.bianhao, item.id);
        const rmb = parseFloat(item.shoujia || item.price || item.rmbPrice || 0);
        const rawThb = rmb * cnyRateThb;
        const rawVnd = rmb * cnyRateVnd;
        const activeMarkup = rawThb < threshold ? markupTier1 : markupTier2;
        const priceTHB = Math.round((rawThb * (1 + activeMarkup / 100)) / 10) * 10;

        // Exclude Chinese accounts under 500 THB
        if (priceTHB < 500) continue;

        // Cross-shop deduplication key to eliminate duplicate listings
        let dedupKey = '';
        if (item.img) {
          const mImg = item.img.match(/([0-9a-zA-Z_-]+\.(png|jpg|jpeg|webp))/i);
          if (mImg && !mImg[1].startsWith('default')) dedupKey = `IMG_${mImg[1].toLowerCase()}`;
        }
        if (!dedupKey) {
          dedupKey = `CODE_${cleanCode.toUpperCase()}`;
        }

        if (seenDedupKeys.has(dedupKey)) continue;
        seenDedupKeys.add(dedupKey);

        const priceVND = Math.round((rawVnd * (1 + activeMarkup / 100)) / 1000) * 1000;
        const id = `CN-${src.key.toUpperCase()}-${cleanCode}`;

        if (!itemMap.has(id)) {
          itemMap.set(id, {
            id,
            bianhao: cleanCode,
            rawBianhao: item.bianhao || '',
            rawId: item.id,
            sourceShop: src.name,
            sourceKey: src.key,
            region: 'cn',
            category: 'progressive',
            title_th: item.title || `PUBG Steam คลังจีน [รหัส #${cleanCode}]`,
            title_en: item.title || `PUBG Steam CN Stock [#${cleanCode}]`,
            subtitle_th: `ไอดีจีนแท้ [รหัส #${cleanCode}] ปลอดภัย 100% ประกันมือ 1 แท้ PUBG SIAM`,
            subtitle_en: `Authentic CN Steam [Code #${cleanCode}] 100% Anti-pullback Warranty PUBG SIAM`,
            priceTHB,
            priceVND,
            originalPriceTHB: Math.round(priceTHB * 1.15),
            originalPriceVND: Math.round(priceVND * 1.15),
            rmbPrice: rmb,
            markupAppliedPercent: activeMarkup,
            tags: ['ไอดีจีนแท้', 'มือ 1 ปลอดภัย', 'มีประกัน', 'โอนย้ายได้'],
            images: [item.img].filter(Boolean),
            binding_th: 'โอนย้ายเข้า Steam ปลอดภัย 100% มีประกันมือ 1 ไม่ดึงคืน',
            rank: 'Gold / Platinum',
            playtime_th: '100+ ชม.',
            gunLevel_th: 'ปืนอัปเกรด & สกินเด่นในคลัง',
            warranty_th: 'มีประกันมือ 1 แท้ (ปลอดภัย 100% ไม่ดึงคืน)',
            isSold: false,
            isHot: rmb >= 5000,
            accentColor: 'from-amber-950/60 via-slate-900 to-slate-950',
            createdAt: new Date().toISOString()
          });
        }
      }
    }

    const fetchedItems = Array.from(itemMap.values());

    return res.status(200).json({
      success: true,
      total: fetchedItems.length,
      items: fetchedItems,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

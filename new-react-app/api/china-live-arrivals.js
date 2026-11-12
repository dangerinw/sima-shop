// Vercel Serverless Function: Live China Arrivals Proxy with Auto-Markup & Thai Normalization
const CN_ID_MAP = {
  '北': 'BEI', '法': 'FA', '回': 'HUI', '雨人': 'YUREN', '钢子': 'GANGZI',
  '图图': 'TUTU', '沁沁': 'QINQIN', '聿': 'YU', '北方': 'BEIFANG',
  '小': 'XIAO', '老': 'LAO', '大': 'DA', '黑': 'HEI', '白': 'BAI',
  '红': 'HONG', '金': 'JIN', '号': 'NO', '带': 'WITH', '初始': 'INIT',
  '卡': 'CARD', '改名': 'RENAME', '券': 'TICKET', '寄': 'JI',
  '男': 'NAN', '女': 'NV', '利': 'LI', '商': 'SHANG'
};

function extractCleanCode(rawBianhao, id) {
  if (!rawBianhao) return String(id || '8888');
  let clean = rawBianhao.trim();
  for (const [cn, en] of Object.entries(CN_ID_MAP)) {
    clean = clean.split(cn).join(en);
  }
  clean = clean.replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase();
  return clean || String(id || '8888');
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const pages = Math.min(parseInt(req.query.pages || '2', 10), 5);
    const cnyRateThb = parseFloat(req.query.cnyRateThb || '5.2');
    const cnyRateVnd = parseFloat(req.query.cnyRateVnd || '3700');
    const markupTier1 = parseFloat(req.query.tier1 || '10');
    const markupTier2 = parseFloat(req.query.tier2 || '13');
    const threshold = parseFloat(req.query.threshold || '100000');

    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'Origin': 'https://xuegaokk.ayxds.com',
      'Referer': 'https://xuegaokk.ayxds.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36'
    };

    const fetchedItems = [];
    for (let p = 1; p <= pages; p++) {
      const response = await fetch('https://fzht.xuxug.com/api/api/newShangpinList', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          page: p,
          size: 20,
          datainfo: { zuidijia: '', zuigaojia: '', guanjianci: '', biaoqian: [], paixu: '' }
        })
      });

      if (!response.ok) break;
      const data = await response.json();
      const list = data?.data?.data || [];
      if (!Array.isArray(list) || list.length === 0) break;

      list.forEach((item) => {
        const cleanCode = extractCleanCode(item.bianhao, item.id);
        const rmb = parseFloat(item.price || item.rmbPrice || 0);
        const rawThb = rmb * cnyRateThb;
        const rawVnd = rmb * cnyRateVnd;
        const activeMarkup = rawThb < threshold ? markupTier1 : markupTier2;
        const priceTHB = Math.round((rawThb * (1 + activeMarkup / 100)) / 10) * 10;
        const priceVND = Math.round((rawVnd * (1 + activeMarkup / 100)) / 1000) * 1000;

        fetchedItems.push({
          id: `CN-${cleanCode}`,
          bianhao: cleanCode,
          rawBianhao: item.bianhao || '',
          rawId: item.id,
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
      });
    }

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

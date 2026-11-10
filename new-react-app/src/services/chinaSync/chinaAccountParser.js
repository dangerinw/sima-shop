// =====================================================================
// PUBG SIAM - Chinese PUBG Account Translator & Normalizer
// Translates Chinese Marketplace Data into TH/EN Formats for PUBG SIAM
// With Dynamic Tiered Markup (เช่น < 100,000฿ +10%, >= 100,000฿ +13%)
// =====================================================================

export const CHINESE_SKIN_DICTIONARY = [
  // Progressive Skins & Weapon Terms
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

  // Outfits & Legendary Rare Skins
  { cn: '极品', th: 'ไอดีเทพท็อปเซิร์ฟ', en: 'God Tier' },
  { cn: '柏林', th: 'PGI เบอร์ลินระดับตำนาน', en: 'PGI Berlin' },
  { cn: '柏林外套', th: 'แจ็กเก็ต PGI เบอร์ลิน', en: 'PGI Berlin Jacket' },
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
  { cn: '黄手套', th: 'ถุงมือเหลืองแรร์', en: 'Yellow Gloves' },
  { cn: '悲喜手套', th: 'ถุงมือ Beixi', en: 'Beixi Gloves' },
  { cn: '白裙', th: 'กระโปรงขาวคลาสสิก', en: 'Classic White Skirt' },
  { cn: '小黄鸭', th: 'เป็ดเหลือง B.Duck', en: 'B.Duck Collab' },
  { cn: 'GODv夹克', th: 'แจ็กเก็ต GODv 4AM', en: 'GODv 4AM Jacket' },
  { cn: '斗鱼夹克', th: 'แจ็กเก็ต Douyu', en: 'Douyu Streamer Jacket' },
  { cn: '显卡套', th: 'เซ็ตการ์ดจอ GeForce', en: 'GeForce Outfit' },
  { cn: '金边白', th: 'ชุดขอบทองคลาสสิก', en: 'Gold Border White Outfit' },
  { cn: '绷带', th: 'ผ้าพันแผล Mummy Wrap', en: 'Mummy Wrap' },
  { cn: '绿头', th: 'หมวกเขียวแรร์', en: 'Green Helmet' },
  { cn: '双头', th: 'หมวกแรร์ 2 ใบ', en: 'Dual Rare Helmets' },

  // Supercars
  { cn: '跑车', th: 'ซูเปอร์คาร์', en: 'Supercar' },
  { cn: '多跑车', th: 'ซูเปอร์คาร์หลายคัน', en: 'Multi Supercars' },
  { cn: '阿斯顿马丁', th: 'Aston Martin', en: 'Aston Martin' },
  { cn: '兰博基尼', th: 'Lamborghini Urus', en: 'Lamborghini Urus' },
  { cn: '保时捷', th: 'Porsche Cayenne', en: 'Porsche Cayenne' }
];

export function detectCategory(title = '') {
  if (title.includes('升级武器') || title.includes('满级') || title.includes('火麒麟') || title.includes('美杜莎') || title.includes('南瓜')) {
    return 'progressive';
  }
  if (title.includes('柏林') || title.includes('东南亚') || title.includes('黑东') || title.includes('金手指') || title.includes('尼尔') || title.includes('女团')) {
    return 'rare-skins';
  }
  if (title.includes('排位') || title.includes('阶段') || title.includes('生存')) {
    return 'rank-ready';
  }
  return 'progressive';
}

export function translateTitleTh(cnTitle = '') {
  let th = cnTitle;
  CHINESE_SKIN_DICTIONARY.forEach((dict) => {
    if (th.includes(dict.cn)) {
      th = th.replaceAll(dict.cn, ` [${dict.th}] `);
    }
  });
  th = th.replace(/\s+/g, ' ').trim();
  return `ไอดีจีน: ${th}`;
}

export function translateTitleEn(cnTitle = '') {
  let en = cnTitle;
  CHINESE_SKIN_DICTIONARY.forEach((dict) => {
    if (en.includes(dict.cn)) {
      en = en.replaceAll(dict.cn, ` [${dict.en}] `);
    }
  });
  en = en.replace(/\s+/g, ' ').trim();
  return `CN Steam: ${en}`;
}

export function extractTags(title = '') {
  const tags = ['ChineseServer', 'OriginalMail'];
  if (title.includes('升级武器') || title.includes('满级') || title.includes('火麒麟') || title.includes('美杜莎')) {
    tags.push('Progressive');
  }
  if (title.includes('柏林') || title.includes('东南亚') || title.includes('金手指') || title.includes('尼尔') || title.includes('女团')) {
    tags.push('RareSkins');
  }
  if (title.includes('跑车') || title.includes('车')) {
    tags.push('Supercars');
  }
  if (title.includes('排位') || title.includes('阶段')) {
    tags.push('RankReady');
  }
  if (title.includes('极品') || title.includes('柏林')) {
    tags.push('HotDeal');
  }
  return Array.from(new Set(tags));
}

export function extractGunLevels(title = '') {
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
 * Calculates tiered profit margin based on account price
 * e.g. < 100,000 THB -> +10%, >= 100,000 THB -> +13%
 */
export function calculateTieredPrice(rmbPrice, config = {}) {
  const {
    cnyRateThb = 5.2,
    cnyRateVnd = 3700,
    markupMode = 'tiered', // 'tiered' | 'flat'
    markupThreshold = 100000,
    markupTier1Percent = 10,
    markupTier2Percent = 13,
    markupPercent = 15
  } = config;

  const rawRmb = Number(rmbPrice || 0);
  const rawThb = rawRmb * Number(cnyRateThb || 5.2);
  const rawVnd = rawRmb * Number(cnyRateVnd || 3700);

  let activeMarkupPercent = Number(markupPercent || 15);
  if (markupMode === 'tiered') {
    if (rawThb < Number(markupThreshold || 100000)) {
      activeMarkupPercent = Number(markupTier1Percent ?? 10);
    } else {
      activeMarkupPercent = Number(markupTier2Percent ?? 13);
    }
  }

  const multiplier = 1 + (activeMarkupPercent / 100);
  const priceTHB = Math.round((rawThb * multiplier) / 10) * 10;
  const priceVND = Math.round((rawVnd * multiplier) / 1000) * 1000;

  return {
    priceTHB,
    priceVND,
    originalPriceTHB: Math.round(priceTHB * 1.15),
    originalPriceVND: Math.round(priceVND * 1.15),
    activeMarkupPercent,
    profitTHB: Math.round(rawThb * (activeMarkupPercent / 100)),
    rawThb
  };
}

/**
 * Normalizes raw Chinese API item into PUBG SIAM account model
 */
export function normalizeChinaAccount(rawItem, rawDetail = {}, config = {}) {
  const id = `CN-${rawItem.bianhao || rawItem.id}`;
  const rmbPrice = Number(rawItem.shoujia || rawDetail.shoujia || 0);

  // Dynamic Tiered Price Calculation
  const priceInfo = calculateTieredPrice(rmbPrice, config);

  // Extract screenshots
  const images = [];
  if (rawItem.img) images.push(rawItem.img);
  if (rawDetail.img && !images.includes(rawDetail.img)) images.push(rawDetail.img);

  if (rawDetail.xiangqing) {
    const imgRegex = /src=["']([^"']+)["']/g;
    let m;
    while ((m = imgRegex.exec(rawDetail.xiangqing)) !== null) {
      if (m[1] && !images.includes(m[1])) {
        images.push(m[1]);
      }
    }
  }

  const title = rawItem.title || rawDetail.title || 'PUBG PC Steam Account';
  const category = detectCategory(title);
  const tags = extractTags(title);

  const survivalTier = rawDetail.shengcundengji || '5阶段';
  const playtime = survivalTier === '5阶段' ? '1,500+ ชม.' : (survivalTier === '4阶段' ? '1,000+ ชม.' : '600+ ชม.');
  const playtimeEn = survivalTier === '5阶段' ? '1,500+ hrs' : (survivalTier === '4阶段' ? '1,000+ hrs' : '600+ hrs');

  return {
    id,
    region: 'cn',
    category,
    rmbPrice,
    title_th: translateTitleTh(title),
    title_en: translateTitleEn(title),
    subtitle_th: `ไอดีเซิร์ฟจีนแท้ [รหัส ${rawItem.bianhao}] ปลอดภัย 100% ประกันมือ 1 PUBG SIAM`,
    subtitle_en: `Authentic Chinese Server [Code ${rawItem.bianhao}] 100% Secured PUBG SIAM`,
    priceTHB: priceInfo.priceTHB,
    priceVND: priceInfo.priceVND,
    originalPriceTHB: priceInfo.originalPriceTHB,
    originalPriceVND: priceInfo.originalPriceVND,
    markupAppliedPercent: priceInfo.activeMarkupPercent,
    profitTHB: priceInfo.profitTHB,
    tags,
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
    details_th: `รหัสไอดีจีน: ${rawItem.bianhao}\nราคาทุนจีน: ¥${rmbPrice} RMB (≈ ฿${Math.round(priceInfo.rawThb).toLocaleString()})\nกำไรบวกเพิ่ม: +${priceInfo.activeMarkupPercent}%\nรายละเอียดจากระบบจีน: ${title}\nอัปเดตสต็อกล่าสุด: ${rawItem.zuihou_caozuo_time || new Date().toISOString()}`,
    details_en: `China Stock Code: ${rawItem.bianhao}\nOriginal Price: ¥${rmbPrice} RMB\nMarkup: +${priceInfo.activeMarkupPercent}%\nDetails: ${title}\nLast Stock Update: ${rawItem.zuihou_caozuo_time || new Date().toISOString()}`,
    videoUrl: '',
    steamUser: `cn_steam_${rawItem.bianhao.toLowerCase()}`,
    steamPass: `SiamCN#${(rawItem.id || 8888).toString().slice(-4)}`,
    steamEmail: `pubg_cn_${rawItem.bianhao.toLowerCase()}@163.com | pass: Siam2026!`,
    isSold: false,
    isHot: rmbPrice >= 5000 || title.includes('极品') || title.includes('柏林'),
    accentColor: 'from-amber-950/60 via-slate-900 to-slate-950',
    createdAt: new Date().toISOString()
  };
}

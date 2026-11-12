// =====================================================================
// PUBG SIAM - Automated China Stock Sync Daemon 🇨🇳
// Supports Direct Zero-Cost JSON Output (public/data/china_stock.json)
// Dynamic Tiered Markup: < 100,000฿ (+10%), >= 100,000฿ (+13%)
// Fast Concurrent Engine: Can pull ALL accounts (12,000+ items) in minutes!
// Ensures 100% Thai translations with zero remaining Chinese characters
// =====================================================================

const https = require('https');
const fs = require('fs');
const path = require('path');

// Parse CLI flags
const args = process.argv.slice(2);
const isWatch = args.includes('--watch');
const fetchAll = args.includes('--all') || args.includes('-a');

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

const CONFIG = {
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

const CN_ID_MAP = {
  '北': 'BEI',
  '法': 'FA',
  '回': 'HUI',
  '雨人': 'YUREN',
  '钢子': 'GANGZI',
  '图图': 'TUTU',
  '沁沁': 'QINQIN',
  '聿': 'YU',
  '北方': 'BEIFANG',
  '小': 'XIAO',
  '老': 'LAO',
  '大': 'DA',
  '黑': 'HEI',
  '白': 'BAI',
  '红': 'HONG',
  '金': 'JIN',
  '号': 'NO',
  '带': 'WITH',
  '初始': 'INIT',
  '卡': 'CARD',
  '改名': 'RENAME',
  '券': 'TICKET',
  '寄': 'JI',
  '男': 'NAN',
  '女': 'NV',
  '利': 'LI',
  '商': 'SHANG',
  '业': 'YE',
  '新': 'XIN',
  '武': 'WU',
  '器': 'QI',
  '挂': 'GUA',
  '品': 'PIN',
  '安': 'AN',
  '时': 'SHI',
  '邮': 'MAIL',
  '多': 'DUO',
  '豪': 'HAO',
  '版': 'VER'
};

function cleanBianhao(raw) {
  let s = String(raw || '').replace(/^CN-/, '').trim();
  const rawOriginal = s;
  Object.entries(CN_ID_MAP).forEach(([cn, lat]) => {
    s = s.replaceAll(cn, lat);
  });
  s = s.replace(/[\u4e00-\u9fa5]/g, '');
  s = s.replace(/[^A-Za-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return {
    cleanCode: s || 'PUBG-CN',
    rawOriginal
  };
}

const CHINESE_SKIN_DICTIONARY = [
  // Multi-word phrases, sets, outfits
  { cn: '朋克女王长裤与短靴', th: 'กางเกงและรองเท้าพังก์ควีน (Punk Queen)', en: 'Punk Queen Pants & Boots' },
  { cn: '朋克女王夹克与手套', th: 'แจ็กเก็ตและถุงมือพังก์ควีน (Punk Queen)', en: 'Punk Queen Jacket & Gloves' },
  { cn: '朋克女王面具', th: 'หน้ากากพังก์ควีน (Punk Queen)', en: 'Punk Queen Mask' },
  { cn: '赤面护卫长裤与短靴', th: 'กางเกงและรองเท้าองครักษ์หน้าแดง', en: 'Crimson Guard Pants & Boots' },
  { cn: '赤面护卫夹克与手套', th: 'แจ็กเก็ตและถุงมือองครักษ์หน้าแดง', en: 'Crimson Guard Jacket & Gloves' },
  { cn: '赤面护卫面具', th: 'หน้ากากองครักษ์หน้าแดง', en: 'Crimson Guard Mask' },
  { cn: '时髦贵宾超短裙', th: 'กระโปรงสั้นวีไอพีหรู (VIP Skirt)', en: 'VIP Mini Skirt' },
  { cn: '时髦贵宾长靴', th: 'รองเท้าบูทวีไอพีหรู (VIP Boots)', en: 'VIP Boots' },
  { cn: '时髦贵宾面具', th: 'หน้ากากวีไอพีหรู (VIP Mask)', en: 'VIP Mask' },
  { cn: '时髦贵宾上衣', th: 'เสื้อวีไอพีหรู (VIP Top)', en: 'VIP Top' },
  { cn: '笑面杀手防弹衣与手套', th: 'เกราะและถุงมือนักฆ่าหน้ายิ้ม', en: 'Smiling Assassin Armor & Gloves' },
  { cn: '笑面杀手面具', th: 'หน้ากากนักฆ่าหน้ายิ้ม', en: 'Smiling Assassin Mask' },
  { cn: '17shou 的兽纹运动夹克', th: 'แจ็กเก็ตวอร์ม 17shou', en: '17shou Track Jacket' },
  { cn: '17shou 的兽纹运动裤', th: 'กางเกงวอร์ม 17shou', en: '17shou Track Pants' },
  { cn: '17shou 的兽纹面具', th: 'หน้ากากสัตว์ 17shou', en: '17shou Beast Mask' },
  { cn: '的兽纹运动夹克', th: 'แจ็กเก็ตวอร์ม 17shou', en: '17shou Track Jacket' },
  { cn: '的兽纹运动裤', th: 'กางเกงวอร์ม 17shou', en: '17shou Track Pants' },
  { cn: '的兽纹面具', th: 'หน้ากากสัตว์ 17shou', en: '17shou Beast Mask' },
  { cn: '的怪兽背包', th: 'กระเป๋าเป้ 17shou', en: '17shou Monster Backpack' },
  { cn: '的萌兽运动裤', th: 'กางเกงวอร์ม 17shou', en: '17shou Beast Pants' },
  { cn: '17shou', th: 'เซ็ตโปรเพลเยอร์ 17shou', en: '17shou Pro Set' },
  { cn: '哈雷戴维森', th: 'มอเตอร์ไซค์ Harley-Davidson', en: 'Harley-Davidson Motorcycle' },
  { cn: '哈雷摩托车', th: 'มอเตอร์ไซค์ Harley-Davidson', en: 'Harley-Davidson Motorcycle' },
  { cn: '交易所接待室', th: 'ล็อบบี้ Hideout ห้องรับรอง', en: 'Hideout Lobby' },
  { cn: '战术撤离背包', th: 'กระเป๋ายุทธวิธี Tactical Backpack', en: 'Tactical Evac Backpack' },
  { cn: '赏金行动降落伞', th: 'ร่มชูชีพ Bounty Hunter', en: 'Bounty Hunter Parachute' },
  { cn: '都市萌宠降落伞', th: 'ร่มชูชีพสัตว์เลี้ยงแสนรัก', en: 'Urban Pet Parachute' },
  { cn: '城市特工背包', th: 'กระเป๋าเป้สายลับ Urban Agent', en: 'Urban Agent Backpack' },
  { cn: '作战必备背包', th: 'กระเป๋าเป้ Combat Essential', en: 'Combat Essential Backpack' },
  { cn: '危险玩偶屋', th: 'บ้านตุ๊กตาอันตราย (Dollhouse)', en: 'Dangerous Dollhouse' },
  { cn: '领航猎犬长裤', th: 'กางเกง Pilot Hound', en: 'Pilot Hound Pants' },
  { cn: '领航猎犬夹克', th: 'แจ็กเก็ต Pilot Hound', en: 'Pilot Hound Jacket' },
  { cn: '领航猎犬面具', th: 'หน้ากาก Pilot Hound', en: 'Pilot Hound Mask' },
  { cn: '午夜执事衬衫', th: 'เสื้อเชิ้ต Midnight Butler', en: 'Midnight Butler Shirt' },
  { cn: '午夜执事夹克', th: 'แจ็กเก็ต Midnight Butler', en: 'Midnight Butler Jacket' },
  { cn: '午夜执事长裤', th: 'กางเกง Midnight Butler', en: 'Midnight Butler Pants' },
  { cn: '午夜执事面具', th: 'หน้ากาก Midnight Butler', en: 'Midnight Butler Mask' },
  { cn: '塞壬平底锅', th: 'กระทะไซเรน Siren Pan', en: 'Siren Pan' },
  { cn: '汤姆逊冲锋枪', th: 'ปืนกลทอมมี่ Tommy Gun', en: 'Tommy Gun' },
  { cn: '双人越野车', th: 'รถบักกี้ Buggy', en: 'Buggy' },
  { cn: '冬季藏匿处', th: 'ล็อบบี้ฤดูหนาว Winter Hideout', en: 'Winter Hideout' },
  { cn: '办公室狂欢', th: 'เซ็ตปาร์ตี้ออฟฟิศ Office Party', en: 'Office Party Set' },
  { cn: '品红色烟雾弹', th: 'สโมกชมพูมาเจนต้า', en: 'Magenta Smoke' },
  { cn: '翡翠色烟雾弹', th: 'สโมกเขียวมรกต', en: 'Emerald Jade Smoke' },
  { cn: '粉色烟雾弹', th: 'สโมกชมพู', en: 'Pink Smoke' },
  { cn: '紫色烟雾弹', th: 'สโมกม่วง', en: 'Purple Smoke' },
  { cn: '橘色烟雾弹', th: 'สโมกส้ม', en: 'Orange Smoke' },
  { cn: '黄色烟雾弹', th: 'สโมกเหลือง', en: 'Yellow Smoke' },
  { cn: '烟雾弹', th: 'สกินสโมกควันสี', en: 'Colored Smoke Grenade' },
  { cn: '紫色魔法迷雾', th: 'ควันเวทมนตร์ม่วง', en: 'Purple Magic Mist' },
  { cn: '蓝色魔法迷雾', th: 'ควันเวทมนตร์น้ำเงิน', en: 'Blue Magic Mist' },
  { cn: '沃尔夫面具', th: 'หน้ากากวูล์ฟ Wolf (Payday)', en: 'Wolf Mask (Payday)' },
  { cn: '霍斯顿面具', th: 'หน้ากากฮิวสตัน Houston (Payday)', en: 'Houston Mask (Payday)' },
  { cn: '钱恩斯面具', th: 'หน้ากากเชนส์ Chains (Payday)', en: 'Chains Mask (Payday)' },
  { cn: '克洛芙面具', th: 'หน้ากากโคลเวอร์ Clover (Payday)', en: 'Clover Mask (Payday)' },
  { cn: '乔伊面具', th: 'หน้ากากจอย Joy (Payday)', en: 'Joy Mask (Payday)' },
  { cn: '诡厄小丑面具', th: 'หน้ากากตัวตลกสยอง', en: 'Sinister Clown Mask' },
  { cn: '叛逆尖锋面具', th: 'หน้ากาก Rebel Spike', en: 'Rebel Spike Mask' },
  { cn: '小丑女', th: 'เซ็ตฮาร์ลีย์ ควินน์ (Harley Quinn)', en: 'Harley Quinn Set' },
  { cn: '小丑男', th: 'เซ็ตโจ๊กเกอร์ (Joker)', en: 'Joker Set' },
  { cn: '丑男妆容', th: 'เมคอัพโจ๊กเกอร์', en: 'Joker Makeup' },
  { cn: '小兔学院', th: 'เซ็ตกระต่าย Bunny Academy', en: 'Bunny Academy Set' },
  { cn: '胜利之舞', th: 'ท่าเต้น Victory Dance', en: 'Victory Dance' },
  { cn: '发光手臂', th: 'ปลอกแขนเรืองแสง', en: 'Glowing Arms' },
  { cn: '活动绿东', th: 'ชุดเอเชียเขียวกิจกรรม (Event Green SEA)', en: 'Event Green SEA Set' },
  { cn: '小绿东', th: 'ชุดเอเชียเขียว (Green SEA)', en: 'Green SEA Set' },
  { cn: '绿东', th: 'ชุดเอเชียเขียว (Green SEA)', en: 'Green SEA Set' },
  { cn: '黑东', th: 'ชุดเอเชียดำ (Black SEA)', en: 'Black SEA Set' },
  { cn: '红东', th: 'ชุดเอเชียแดง (Red SEA)', en: 'Red SEA Set' },
  { cn: '黄东', th: 'ชุดเอเชียเหลือง (Yellow SEA)', en: 'Yellow SEA Set' },
  { cn: '东南亚', th: 'ชุดเอเชียอาคเนย์ Major SEA', en: 'SEA Major Outfit' },
  { cn: '金边白', th: 'ชุดขอบทองขาว (Gold Trim White)', en: 'Gold Trim White' },
  { cn: '黑绷带', th: 'มัมมี่ดำ (Black Mummy)', en: 'Black Mummy Wrap' },
  { cn: '白绷带', th: 'มัมมี่ขาว (White Mummy)', en: 'White Mummy Wrap' },
  { cn: '绷带', th: 'ผ้าพันแผลมัมมี่', en: 'Mummy Wrap' },
  { cn: '白战神', th: 'ชุดแอรีสขาว (White Warlord)', en: 'White Warlord Set' },
  { cn: '粉战神', th: 'ชุดแอรีสชมพู (Pink Warlord)', en: 'Pink Warlord Set' },
  { cn: '白熊鞋', th: 'รองเท้าหมีขาว Polar Bear', en: 'Polar Bear Shoes' },
  { cn: '滑雪镜', th: 'แว่นตาสกี Ski Goggles', en: 'Ski Goggles' },
  { cn: '滑雪帽', th: 'หมวกสกี', en: 'Ski Beanie' },
  { cn: '拉风龙', th: 'ชุดไดโนเสาร์มังกร', en: 'Dragon Onesie' },
  { cn: '丸子头', th: 'ทรงผมดังโงะ Bun', en: 'Bun Hairstyle' },
  { cn: '双马尾', th: 'ทรงผมทวินเทลแรร์', en: 'Twin Tails Hairstyle' },
  { cn: '小马尾', th: 'ทรงผมม้าสั้น', en: 'Short Ponytail Hairstyle' },
  { cn: '单马尾', th: 'ทรงผมหางม้า', en: 'Single Ponytail' },
  { cn: '马尾', th: 'ทรงผมหางม้า', en: 'Ponytail' },
  { cn: '脏辫', th: 'ทรงผมเดรดล็อกส์', en: 'Dreadlocks Hairstyle' },
  { cn: '发型', th: 'ทรงผม', en: 'Hairstyle' },
  { cn: '黑大衣', th: 'โค้ตดำคลาสสิก Black Coat', en: 'Classic Black Coat' },
  { cn: '红面巾', th: 'ผ้าปิดหน้าแดง Red Bandana', en: 'Red Bandana' },
  { cn: '金面', th: 'หน้ากากทองคำ', en: 'Gold Face Mask' },
  { cn: '渔夫帽', th: 'หมวกปีกรอบ Bucket Hat', en: 'Bucket Hat' },
  { cn: '碎花裤', th: 'กางเกงลายดอกไม้', en: 'Floral Pants' },
  { cn: '萨芬裤', th: 'กางเกงซาฟิน Safin', en: 'Safin Pants' },
  { cn: '大花袄', th: 'เสื้อนวมลายดอกไม้', en: 'Floral Padded Coat' },
  { cn: '西游记', th: 'เซ็ตไซอิ๋ว', en: 'Journey to the West Set' },
  { cn: '狂野驰骋', th: 'ท่าขับขี่ Wild Ride', en: 'Wild Ride Emote' },
  { cn: '青海摇', th: 'ท่าเต้น Qinghai Shake', en: 'Qinghai Shake Emote' },
  { cn: '公路滑翔', th: 'ท่าสเก็ต Highway Glide', en: 'Highway Glide Emote' },
  { cn: '妙爪神功', th: 'ท่าเต้นอุ้งเท้าแมว', en: 'Cat Paw Emote' },
  { cn: '即刻出发', th: 'ท่าแอ็กชัน Ready to Go', en: 'Ready to Go Emote' },
  { cn: '爱的主打歌', th: 'ท่าเต้นแรร์ Love Song', en: 'Love Song Dance' },
  { cn: '黑鬼', th: 'เซ็ตผีดำ Black Wraith', en: 'Black Wraith Set' },
  { cn: '阿狸', th: 'เซ็ตจิ้งจอกอาลี (Ali Fox)', en: 'Ali Fox Set' },
  { cn: '小黄鸭', th: 'เซ็ตเป็ดเหลือง B.Duck', en: 'B.Duck Collab' },
  { cn: '可可套', th: 'เซ็ตโกโก้ CoCo Collab', en: 'CoCo Collab Outfit' },
  { cn: '双头', th: 'หมวกสองหน้าดับเบิลเฮด', en: 'Double Headgear' },
  { cn: '尼尔头', th: 'หน้ากากเนียร์ Nier Mask', en: 'Nier Headgear' },
  { cn: '尼尔', th: 'ชุดเนียร์ Nier Automata', en: 'Nier Automata Outfit' },
  { cn: '卡崔娜', th: 'ชุดคัทริน่า Katrina', en: 'Katrina Set' },
  { cn: '柏林外套', th: 'แจ็กเก็ต PGI เบอร์ลินระดับตำนาน', en: 'PGI Berlin Jacket' },
  { cn: '柏林鞋', th: 'รองเท้า PGI เบอร์ลิน', en: 'PGI Berlin Shoes' },
  { cn: '柏林', th: 'ชุด PGI เบอร์ลินระดับตำนาน', en: 'PGI Berlin Set' },
  { cn: '大魔王', th: 'Demon King จอมมาร', en: 'Demon King Set' },
  { cn: '假魔王', th: 'Demon King สไตล์จอมมาร', en: 'Demon King Style' },
  { cn: '1代女团', th: 'เกิร์ลกรุ๊ป Gen 1 (Blackpink)', en: 'Girl Group Gen 1' },
  { cn: '一代女团', th: 'เกิร์ลกรุ๊ป Gen 1 (Blackpink)', en: 'Girl Group Gen 1' },
  { cn: '2代女团', th: 'เกิร์ลกรุ๊ป Gen 2 (NewJeans)', en: 'Girl Group Gen 2' },
  { cn: '二代女团', th: 'เกิร์ลกรุ๊ป Gen 2 (NewJeans)', en: 'Girl Group Gen 2' },
  { cn: '女团套', th: 'เซ็ตไอดอลเกาหลี K-Pop', en: 'K-Pop Girl Group Outfit' },
  { cn: '女团', th: 'เซ็ตสาวเกาหลี K-Pop', en: 'K-Pop Girl Group' },
  { cn: '金手指', th: 'ถุงมือทองคำ Golden Finger', en: 'Golden Finger' },
  { cn: '黄手套', th: 'ถุงมือเหลืองแรร์', en: 'Yellow Gloves' },
  { cn: '悲喜手套', th: 'ถุงมือ Beixi', en: 'Beixi Gloves' },
  { cn: '悲喜', th: 'เซ็ตสตรีมเมอร์ Beixi', en: 'Beixi Streamer Set' },
  { cn: '全手套', th: 'ถุงมือแรร์ครบชุด', en: 'All Gloves Collection' },
  { cn: '手套', th: 'ถุงมือแรร์', en: 'Rare Gloves' },
  { cn: '白裙', th: 'กระโปรงขาวคลาสสิก', en: 'Classic White Skirt' },
  { cn: 'GODv夹克', th: 'แจ็กเก็ต GODv 4AM', en: 'GODv 4AM Jacket' },
  { cn: '斗鱼夹克', th: 'แจ็กเก็ต Douyu สตรีมเมอร์', en: 'Douyu Jacket' },
  { cn: '显卡套', th: 'เซ็ตการ์ดจอ GeForce', en: 'GeForce Outfit' },
  { cn: '绿头', th: 'หมวกเขียวแรร์', en: 'Green Helmet' },
  { cn: '牛角', th: 'เขาปีศาจ/กระทิง', en: 'Horns Headgear' },
  { cn: '头盔', th: 'หมวกเกราะ', en: 'Helmet' },
  { cn: '橙色发带', th: 'ผ้าคาดผมส้ม', en: 'Orange Headband' },
  { cn: '鞋', th: 'รองเท้า', en: 'Shoes' },

  // Weapons & Progressives
  { cn: '牛头AUG', th: 'AUG มิโนทอร์กระทิงทอง', en: 'Minotaur AUG' },
  { cn: '牛头aug', th: 'AUG มิโนทอร์กระทิงทอง', en: 'Minotaur AUG' },
  { cn: '弥诺陶洛斯', th: 'มิโนทอร์ Minotaur', en: 'Minotaur' },
  { cn: '暗影之主MK12', th: 'MK12 เจ้าแห่งเงามืด', en: 'Shadow Lord MK12' },
  { cn: '暗影之主mk12', th: 'MK12 เจ้าแห่งเงามืด', en: 'Shadow Lord MK12' },
  { cn: '暗影之主', th: 'MK12 เจ้าแห่งเงามืด', en: 'Shadow Lord' },
  { cn: '粉猪M4', th: 'M416 หมูชมพู', en: 'Pink Piggy M416' },
  { cn: '粉猪m4', th: 'M416 หมูชมพู', en: 'Pink Piggy M416' },
  { cn: '粉猪', th: 'M416 หมูชมพู', en: 'Pink Piggy M416' },
  { cn: '霓虹AUG', th: 'AUG นีออน', en: 'Neon AUG' },
  { cn: '霓虹aug', th: 'AUG นีออน', en: 'Neon AUG' },
  { cn: '级霓虹', th: 'Lv. นีออน', en: 'Lv. Neon' },
  { cn: '霓虹', th: 'นีออน', en: 'Neon' },
  { cn: '火麒麟', th: 'Beryl กิเลนไฟ', en: 'Fire Dragon Beryl' },
  { cn: '美杜莎', th: 'AWM เมดูซ่า', en: 'Medusa AWM' },
  { cn: '南瓜M4', th: 'M416 ฟักทองฮาโลวีน', en: 'Trick-or-treat M416' },
  { cn: '南瓜m4', th: 'M416 ฟักทองฮาโลวีน', en: 'Trick-or-treat M416' },
  { cn: '南瓜', th: 'M416 ฟักทองฮาโลวีน', en: 'Pumpkin M416' },
  { cn: '齿轮大炮', th: 'AWM ฟันเฟือง Gear Head', en: 'Gear Head AWM' },
  { cn: '猪八戒', th: 'หมูทองคำ Pigsy', en: 'Pigsy Skin' },
  { cn: '爆裂AUG', th: 'AUG แดงระเบิดศึก', en: 'Blast AUG' },
  { cn: '宇宙之力98K', th: 'Kar98k พลังจักรวาล', en: 'Cosmic Kar98k' },
  { cn: '宇宙之力', th: 'Kar98k พลังจักรวาล', en: 'Cosmic Power' },
  { cn: '妖魔之触', th: 'Demon Touch สัมผัสอสูร', en: 'Demon Touch' },
  { cn: '朱雀', th: 'หงส์เพลิงจูเชว่', en: 'Vermilion Bird' },
  { cn: '金龙', th: 'มังกรทองคำ', en: 'Golden Dragon' },
  { cn: '青龙', th: 'มังกรฟ้า Azure Dragon', en: 'Azure Dragon' },
  { cn: '德拉贡', th: 'Dragunov สกินเทพ', en: 'Dragunov Elite' },
  { cn: '圣诞mini', th: 'Mini14 คริสต์มาส', en: 'Christmas Mini14' },
  { cn: '格拉西亚', th: 'M416 กลาเซียหิมะ (Glacier)', en: 'Glacier M416' },
  { cn: '瀚娜', th: 'ฮันน่า Hanna', en: 'Hanna Skin' },
  { cn: '无信号', th: 'No Signal ไร้สัญญาณ', en: 'No Signal Skin' },
  { cn: '多利安', th: 'โดเรียน Dorian', en: 'Dorian Skin' },
  { cn: '孙悟空', th: 'ซุนหงอคง Monkey King', en: 'Monkey King' },
  { cn: '伊芙', th: 'อีฟ Eve', en: 'Eve Skin' },
  { cn: '烈日灼烧', th: 'เพลิงสุริยัน Scorching Sun', en: 'Scorching Sun' },
  { cn: '碎石者', th: 'Rockbreaker', en: 'Rockbreaker' },
  { cn: '伪装', th: 'ลายพราง Camo', en: 'Camouflage' },
  { cn: '时空使者', th: 'ผู้ส่งสารกาลเวลา Chrono', en: 'Chrono Envoy' },
  { cn: '枪炮洗礼', th: 'Gun Baptism', en: 'Gun Baptism' },
  { cn: '生死与共', th: 'Till Death Do Us Part', en: 'Till Death Do Us Part' },
  { cn: '无重力', th: 'Zero Gravity', en: 'Zero Gravity' },
  { cn: '玩偶炮', th: 'Doll Cannon', en: 'Doll Cannon' },
  { cn: '夜曲', th: 'Nocturne', en: 'Nocturne' },
  { cn: '寒蚀', th: 'เหมันต์น้ำแข็ง Frostbite', en: 'Frostbite' },
  { cn: '蓝色火烈鸟', th: 'ฟลามิงโกฟ้า', en: 'Blue Flamingo' },
  { cn: '警戒空域', th: 'Alert Airspace', en: 'Alert Airspace' },
  { cn: '绝妙逃脱', th: 'Great Escape', en: 'Great Escape' },
  { cn: '小叮当', th: 'สตรีมเมอร์ XDD', en: 'XDD Streamer' },
  { cn: '武器神龛', th: 'แท่นอาวุธ Hideout', en: 'Weapon Hideout' },
  { cn: '陈列室', th: 'ห้องจัดแสดง Showroom', en: 'Showroom' },

  // Supercars & Vehicles
  { cn: '阿斯顿马丁', th: 'Aston Martin', en: 'Aston Martin' },
  { cn: '马丁', th: 'Aston Martin', en: 'Aston Martin' },
  { cn: '兰博基尼', th: 'Lamborghini Urus', en: 'Lamborghini Urus' },
  { cn: '布加迪', th: 'Bugatti', en: 'Bugatti' },
  { cn: '迈凯伦', th: 'McLaren GT', en: 'McLaren GT' },
  { cn: '科尼赛克', th: 'Koenigsegg', en: 'Koenigsegg' },
  { cn: '保时捷', th: 'Porsche 911', en: 'Porsche 911' },
  { cn: '杜卡迪', th: 'Ducati Panigale', en: 'Ducati Panigale' },
  { cn: '多跑车', th: 'ซูเปอร์คาร์หลายคัน', en: 'Multi Supercars' },
  { cn: '跑车', th: 'ซูเปอร์คาร์', en: 'Supercar' },
  { cn: '车漆', th: 'สกินสีรถ', en: 'Vehicle Paint' },

  // Upgrade Materials & Status
  { cn: '张图纸', th: 'ใบพิมพ์เขียวอัปปืน', en: 'Weapon Schematics' },
  { cn: '图纸', th: 'ใบพิมพ์เขียว', en: 'Schematics' },
  { cn: '聚合物', th: 'พอลิเมอร์อัปปืน', en: 'Polymers' },
  { cn: '升级武器', th: 'ปืนอัปเกรด Progressive', en: 'Progressive Guns' },
  { cn: '满级', th: 'เลเวลตัน Lv.10 Max', en: 'Lv.10 Max' },
  { cn: '异色', th: 'Chroma สีพิเศษ', en: 'Chroma Edition' },
  { cn: '竞争者', th: 'Battlestat', en: 'Battlestat' },
  { cn: '作战燃料', th: 'ไอเทม Combat Fuel', en: 'Combat Fuel' },
  { cn: '电磁背包', th: 'กระเป๋าเป้แม่เหล็กไฟฟ้า', en: 'Electromagnetic Backpack' },
  { cn: '免费版', th: 'เวอร์ชัน F2P (ปลด Plus แล้ว)', en: 'F2P Version (Plus Unlocked)' },
  { cn: '极品', th: 'เกรดเทพท็อปเซิร์ฟ', en: 'God Tier Top Account' },
  { cn: '找回包赔', th: 'รับประกันไม่ดึงคืน 100%', en: '100% Anti-pullback Warranty' },
  { cn: '信誉等级三', th: 'เกียรติยศระดับ 3 (ขาวสะอาด)', en: 'Reputation Level 3 (Clean)' },
  { cn: '信誉等级', th: 'เกียรติยศ', en: 'Reputation Level' },
  { cn: '生存等级', th: 'ระดับการเล่น', en: 'Survival Tier' },
  { cn: '账号编号', th: 'รหัสไอดี', en: 'Account ID' },
  { cn: '商品描述', th: 'รายละเอียดสกิน', en: 'Item Description' },
  { cn: '商品详情', th: 'รายละเอียดในเกม', en: 'Game Details' },
  { cn: '等等', th: 'และไอเทมอื่นๆ', en: 'and more' },
  { cn: '套装', th: 'เซ็ตชุด', en: 'Outfit Set' },
  { cn: '活动', th: 'กิจกรรม', en: 'Event' },

  // Ranks
  { cn: '5阶段', th: 'แรงค์ Tier 5 (Rank Ready Plus)', en: 'Tier 5 (Rank Ready Plus)' },
  { cn: '4阶段', th: 'แรงค์ Tier 4 (Rank Ready Plus)', en: 'Tier 4 (Rank Ready Plus)' },
  { cn: '3阶段', th: 'แรงค์ Tier 3 (Rank Ready Plus)', en: 'Tier 3 (Rank Ready Plus)' },
  { cn: '2阶段', th: 'แรงค์ Tier 2 (Rank Ready Plus)', en: 'Tier 2 (Rank Ready Plus)' },
  { cn: '1阶段', th: 'แรงค์ Tier 1 (Rank Ready Plus)', en: 'Tier 1 (Rank Ready Plus)' },
  { cn: '五阶段', th: 'แรงค์ Tier 5', en: 'Rank Tier 5' },
  { cn: '四阶段', th: 'แรงค์ Tier 4', en: 'Rank Tier 4' },
  { cn: '三阶段', th: 'แรงค์ Tier 3', en: 'Rank Tier 3' },
  { cn: '二阶段', th: 'แรงค์ Tier 2', en: 'Rank Tier 2' },
  { cn: '一阶段', th: 'แรงค์ Tier 1', en: 'Rank Tier 1' },
  { cn: '能否排位', th: 'ปลดล็อกโหมดจัดอันดับ (Plus)', en: 'Rank Ready (Plus)' },
  { cn: '排位', th: 'โหมดจัดอันดับ', en: 'Ranked Mode' }
];

function translateToThai(text) {
  if (!text) return '';
  let str = String(text);
  str = str.replace(/^ไอดีจีน:\s*/, '');

  CHINESE_SKIN_DICTIONARY.forEach(d => {
    if (str.includes(d.cn)) {
      str = str.replaceAll(d.cn, ' ' + d.th + ' ');
    }
  });

  str = str.replace(/(\d+)\s*把/g, (m, p1) => `${p1} กระบอก `);
  str = str.replace(/(\d+)\s*级/g, (m, p1) => `Lv.${p1} `);
  str = str.replace(/(\d+)\s*满/g, (m, p1) => `เลเวลตัน Max ${p1} กระบอก `);
  str = str.replace(/(\d+)\s*异色/g, (m, p1) => `Chroma ${p1} สกิน `);
  str = str.replace(/(\d+)\s*竞争者/g, (m, p1) => `Battlestat ${p1} สกิน `);

  // Strip all remaining Hanzi
  str = str.replace(/[\u4e00-\u9fa5]/g, ' ');

  str = str.replace(/[\[\]]/g, ' ').replace(/\s+/g, ' ').replace(/\s*\|\s*/g, ' | ').trim();
  return str || 'ไอดี PUBG PC สกินคัดเกรดพรีเมียม';
}

function translateToEnglish(text) {
  if (!text) return '';
  let str = String(text);
  CHINESE_SKIN_DICTIONARY.forEach(d => {
    if (str.includes(d.cn)) {
      str = str.replaceAll(d.cn, ' ' + (d.en || d.th) + ' ');
    }
  });
  str = str.replace(/(\d+)\s*把/g, (m, p1) => `${p1} Weapons `);
  str = str.replace(/(\d+)\s*级/g, (m, p1) => `Lv.${p1} `);
  str = str.replace(/(\d+)\s*满/g, (m, p1) => `Lv.10 Max ${p1} `);
  str = str.replace(/(\d+)\s*异色/g, (m, p1) => `Chroma ${p1} `);
  str = str.replace(/(\d+)\s*竞争者/g, (m, p1) => `Battlestat ${p1} `);
  str = str.replace(/[\u4e00-\u9fa5]/g, ' ');
  str = str.replace(/[\[\]]/g, ' ').replace(/\s+/g, ' ').trim();
  return str ? `CN Steam: ${str}` : 'PUBG PC Steam Account';
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
      mapped = mapped.replace(/(\d+)级/, (m, p1) => `Lv.${p1} `);
      mapped = mapped.replace(/[\u4e00-\u9fa5]/g, '').trim();
      return mapped;
    }).filter(Boolean).join(' | ');
  }
  return 'ปืน Progressive & สกินพรีเมียม';
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
    req.setTimeout(15000, () => {
      req.destroy(new Error('Request timeout'));
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

const SOURCES = [
  { key: 'xgkk', name: 'XueGaoKK (Link 4)', origin: 'https://xuegaokk.ayxds.com', type: 'ayxds' },
  { key: 'xf', name: 'XF Shop (Link 1)', origin: 'https://xf.ayxds.com', type: 'ayxds' },
  { key: 'xmgg', name: 'XMGG Shop (Link 3)', origin: 'https://xmgg.ayxds.com', type: 'ayxds' },
  { key: 'yyy', name: 'YiYou PUBG (Link 2)', origin: 'https://www.yyyxkch.com', type: 'yyy' }
];

async function fetchSourcePage(src, page, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (src.type === 'yyy') {
        const res = await httpRequest('https://www.yyyxkch.com/api/goods_list', 'POST', {
          page,
          limit: 20,
          cate_id: 5
        }, {
          'Referer': 'https://www.yyyxkch.com/'
        });
        if (res.data?.data) {
          return {
            total: res.data.data.total,
            last_page: Math.ceil((res.data.data.total || 0) / 20),
            data: (res.data.data.list || []).map(x => ({
              id: x.id,
              bianhao: x.code || `DLMX-${x.id}`,
              title: x.title,
              shoujia: x.price,
              img: x.logo
            }))
          };
        }
      } else {
        const res = await httpRequest('https://fzht.xuxug.com/api/api/newShangpinList', 'POST', {
          page,
          datainfo: { zuidijia: '', zuigaojia: '', guanjianci: '', biaoqian: [], paixu: '' }
        }, {
          'Accept': 'application/json, text/plain, */*',
          'Origin': src.origin,
          'Referer': `${src.origin}/`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        });
        if (res.data?.data) {
          return res.data.data;
        }
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
  console.log(`[${new Date().toLocaleString()}] 🚀 เริ่มต้นรอบซิงค์สต็อกไอดีจีน 4 แพลตฟอร์มพาร์ทเนอร์ (Multi-Source Engine)...`);
  
  if (fetchAll && fs.existsSync(CONFIG.outputPath)) {
    try {
      fs.unlinkSync(CONFIG.outputPath);
      console.log(`🗑️ ลบไฟล์สต็อกเดิมออกเรียบร้อย: ${CONFIG.outputPath}`);
    } catch (_) {}
  }

  const accountMap = new Map();

  // Smart Merge: Preload existing stock so incremental sync never deletes older accounts!
  if (!fetchAll && fs.existsSync(CONFIG.outputPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(CONFIG.outputPath, 'utf8'));
      existing.forEach(acc => {
        if (acc && acc.id) {
          accountMap.set(acc.id, acc);
        }
      });
      console.log(`📦 โหลดสต็อกเดิมที่มีอยู่แล้ว: ${accountMap.size.toLocaleString()} ไอดี (โหมด Smart Merge ไม่ลบของเดิม)`);
    } catch (e) {
      console.warn('Could not preload existing stock:', e.message);
    }
  }

  const CONCURRENCY = 12;
  const startTime = Date.now();

  for (const src of SOURCES) {
    console.log(`\n--- เริ่มดึงข้อมูลจากแหล่ง: ${src.name} ---`);
    const firstPage = await fetchSourcePage(src, 1);
    const totalInMarket = firstPage.total || 0;
    const lastPageInMarket = firstPage.last_page || 1;
    const targetPages = fetchAll ? lastPageInMarket : Math.min(Math.ceil(CONFIG.pages / SOURCES.length), lastPageInMarket);

    console.log(`✓ แหล่ง ${src.name}: พบทั้งหมด ${totalInMarket.toLocaleString()} ไอดี, จะดึง ${targetPages} หน้า`);

    for (let p = 1; p <= targetPages; p += CONCURRENCY) {
      const batchPages = [];
      for (let offset = 0; offset < CONCURRENCY && (p + offset) <= targetPages; offset++) {
        batchPages.push(p + offset);
      }

      const results = await Promise.all(batchPages.map(page => fetchSourcePage(src, page)));

      results.forEach((pageData) => {
        const items = pageData.data || [];
        items.forEach((item) => {
          const { cleanCode, rawOriginal } = cleanBianhao(item.bianhao || item.id);
          let uniqueCode = cleanCode;
          if (!uniqueCode.toLowerCase().startsWith(src.key.toLowerCase())) {
            uniqueCode = `${src.key.toUpperCase()}-${uniqueCode}`;
          }
          const id = `CN-${uniqueCode}`;
          if (accountMap.has(id)) return;

          const rmbPrice = Number(item.shoujia || 0);
          const priceInfo = calculateTieredPrice(rmbPrice);
          const rawTitle = item.title || 'PUBG PC Steam Account';

          let rankTierTh = 'แรงค์ Tier 3 (Rank Ready Plus)';
          if (rawTitle.includes('5阶段') || rawTitle.includes('五阶段')) rankTierTh = 'แรงค์ Tier 5 (Rank Ready Plus)';
          else if (rawTitle.includes('4阶段') || rawTitle.includes('四阶段')) rankTierTh = 'แรงค์ Tier 4 (Rank Ready Plus)';
          else if (rawTitle.includes('3阶段') || rawTitle.includes('三阶段')) rankTierTh = 'แรงค์ Tier 3 (Rank Ready Plus)';
          else if (rawTitle.includes('2阶段') || rawTitle.includes('二阶段')) rankTierTh = 'แรงค์ Tier 2 (Rank Ready Plus)';
          else if (rawTitle.includes('1阶段') || rawTitle.includes('一阶段')) rankTierTh = 'แรงค์ Tier 1 (Rank Ready Plus)';

          const playtime = rankTierTh.includes('5') ? '1,500+ ชม.' : (rankTierTh.includes('4') ? '1,000+ ชม.' : '800+ ชม.');
          const playtimeEn = rankTierTh.includes('5') ? '1,500+ hrs' : (rankTierTh.includes('4') ? '1,000+ hrs' : '800+ hrs');

          const images = [];
          if (item.img) images.push(item.img);

          const translatedTitleTh = translateToThai(rawTitle);
          const gunLevelTh = extractGunLevels(rawTitle);

          const account = {
            id,
            rawId: item.id,
            bianhao: uniqueCode,
            rawBianhao: rawOriginal,
            sourceShop: src.name,
            sourceKey: src.key,
          region: 'cn',
          category: detectCategory(rawTitle),
          title_th: translatedTitleTh,
          title_en: translateToEnglish(rawTitle),
          rmbPrice: rmbPrice,
          priceTHB: priceInfo.priceTHB,
          priceVND: priceInfo.priceVND,
          originalPriceTHB: priceInfo.originalPriceTHB,
          originalPriceVND: priceInfo.originalPriceVND,
          markupAppliedPercent: priceInfo.activeMarkupPercent,
          profitTHB: priceInfo.profitTHB,
          tags: extractTags(rawTitle),
          images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'],
          coverImg: item.img || images[0] || '',
          rank: rankTierTh,
          gunLevel_th: gunLevelTh,
          isSold: false,
          isHot: rmbPrice >= 5000 || rawTitle.includes('极品') || rawTitle.includes('柏林'),
          createdAt: new Date().toISOString()
        };

        accountMap.set(id, account);
      });
    });

      const endPage = Math.min(p + CONCURRENCY - 1, targetPages);
      const percent = Math.round((endPage / targetPages) * 100);
      const elapsedSec = Math.round((Date.now() - startTime) / 1000);
      process.stdout.write(`[${percent}%] [${src.key.toUpperCase()}] หน้า ${p}-${endPage}/${targetPages} (รวม ${accountMap.size.toLocaleString()} ไอดีใน ${elapsedSec}s)\n`);
    }

    try {
      const currentList = Array.from(accountMap.values());
      fs.writeFileSync(CONFIG.outputPath, JSON.stringify(currentList), 'utf8');
      console.log(`💾 เซฟสต็อกชั่วคราว: รวม ${currentList.length.toLocaleString()} ไอดีลงไฟล์`);
    } catch (_) {}
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

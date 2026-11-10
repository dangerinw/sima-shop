// =====================================================================
// PUBG SIAM - Chinese PUBG Account Translator & Normalizer
// Translates 100% of Chinese Marketplace Data into Natural Thai for PUBG SIAM
// Dynamic Tiered Markup: < 100,000฿ (+10%), >= 100,000฿ (+13%)
// =====================================================================

export const CN_ID_MAP = {
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

export function cleanBianhao(raw) {
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

export const CHINESE_SKIN_DICTIONARY = [
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

  // Progressive Weapons & Skins
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

/**
 * Completely translates Chinese PUBG strings into natural, readable Thai
 * Strips 100% of remaining Chinese Hanzi characters!
 */
export function translateChinesePubgTitle(cnTitle = '') {
  if (!cnTitle) return '';
  let text = String(cnTitle);
  text = text.replace(/^ไอดีจีน:\s*/, '');

  // 1. Multi-word phrases
  CHINESE_SKIN_DICTIONARY.forEach(({ cn, th }) => {
    if (text.includes(cn)) {
      text = text.replaceAll(cn, ` ${th} `);
    }
  });

  // 2. Patterns
  text = text.replace(/(\d+)\s*把/g, (m, p1) => `${p1} กระบอก `);
  text = text.replace(/(\d+)\s*级/g, (m, p1) => `Lv.${p1} `);
  text = text.replace(/(\d+)\s*满/g, (m, p1) => `เลเวลตัน Max ${p1} กระบอก `);
  text = text.replace(/(\d+)\s*异色/g, (m, p1) => `Chroma ${p1} สกิน `);
  text = text.replace(/(\d+)\s*竞争者/g, (m, p1) => `Battlestat ${p1} สกิน `);

  // 3. Remove all leftover Chinese Hanzi characters
  text = text.replace(/[\u4e00-\u9fa5]/g, ' ');

  // 4. Normalize spaces and punctuation
  text = text.replace(/[\][]/g, ' ').replace(/\s+/g, ' ').replace(/\s*\|\s*/g, ' | ').trim();
  return text || 'ไอดี PUBG PC สกินคัดเกรดพรีเมียม';
}

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
  return translateChinesePubgTitle(cnTitle);
}

export function translateTitleEn(cnTitle = '') {
  let en = String(cnTitle || '');
  CHINESE_SKIN_DICTIONARY.forEach(({ cn, en: enTrans }) => {
    if (en.includes(cn)) {
      en = en.replaceAll(cn, ` ${enTrans} `);
    }
  });
  en = en.replace(/(\d+)\s*把/g, (m, p1) => `${p1} Weapons `);
  en = en.replace(/(\d+)\s*级/g, (m, p1) => `Lv.${p1} `);
  en = en.replace(/(\d+)\s*满/g, (m, p1) => `Lv.10 Max ${p1} `);
  en = en.replace(/(\d+)\s*异色/g, (m, p1) => `Chroma ${p1} `);
  en = en.replace(/(\d+)\s*竞争者/g, (m, p1) => `Battlestat ${p1} `);
  en = en.replace(/[\u4e00-\u9fa5]/g, ' ');
  en = en.replace(/\s+/g, ' ').trim();
  return en ? `CN Steam: ${en}` : 'PUBG PC Steam Account';
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
  const guns = [];
  CHINESE_SKIN_DICTIONARY.forEach(({ cn, th }) => {
    if ((cn.includes('AUG') || cn.includes('M4') || cn.includes('MK12') || cn.includes('98K') || cn.includes('麒麟') || cn.includes('AWM') || cn.includes('mini') || cn.includes('Dragunov') || cn.includes('Beryl')) && title.includes(cn)) {
      guns.push(th);
    }
  });

  const levelMatch = title.match(/(\d+级[^\d\s,]+)/g);
  if (levelMatch) {
    levelMatch.forEach(m => {
      let t = m;
      CHINESE_SKIN_DICTIONARY.forEach(d => {
        if (t.includes(d.cn)) t = t.replace(d.cn, d.th);
      });
      t = t.replace(/(\d+)级/, 'Lv.$1 ');
      t = t.replace(/[\u4e00-\u9fa5]/g, '').trim();
      if (t && !guns.includes(t)) guns.push(t);
    });
  }

  if (guns.length > 0) {
    return guns.slice(0, 3).join(' | ');
  }
  return 'ปืน Progressive & สกินพรีเมียม';
}

export function calculateTieredPrice(rmbPrice, config = {}) {
  const {
    cnyRateThb = 5.2,
    cnyRateVnd = 3700,
    markupMode = 'tiered',
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

export function normalizeChinaAccount(rawItem, rawDetail = {}, config = {}) {
  const { cleanCode, rawOriginal } = cleanBianhao(rawItem.bianhao || rawDetail.bianhao || String(rawItem.id || ''));
  const id = `CN-${cleanCode}`;
  const rmbPrice = Number(rawItem.shoujia || rawDetail.shoujia || 0);

  const priceInfo = calculateTieredPrice(rmbPrice, config);

  const coverImg = rawItem.img || rawDetail.img || '';
  const images = [];
  if (coverImg) images.push(coverImg);

  if (rawDetail.xiangqing) {
    const imgRegex = /src=["']([^"']+)["']/g;
    let m;
    while ((m = imgRegex.exec(rawDetail.xiangqing)) !== null) {
      if (m[1] && !images.includes(m[1]) && m[1] !== coverImg) {
        images.push(m[1]);
      }
    }
  }

  const title = rawItem.title || rawDetail.title || 'PUBG PC Steam Account';
  const category = detectCategory(title);
  const tags = extractTags(title);

  const survivalTier = rawDetail.shengcundengji || (title.includes('5阶段') ? '5阶段' : (title.includes('4阶段') ? '4阶段' : '3阶段'));
  const rankTh = survivalTier.includes('5') ? 'แรงค์ Tier 5 (Rank Ready Plus)' : (survivalTier.includes('4') ? 'แรงค์ Tier 4 (Rank Ready Plus)' : 'แรงค์ Tier 3 (Rank Ready Plus)');
  const playtime = survivalTier.includes('5') ? '1,500+ ชม.' : (survivalTier.includes('4') ? '1,000+ ชม.' : '800+ ชม.');
  const playtimeEn = survivalTier.includes('5') ? '1,500+ hrs' : (survivalTier.includes('4') ? '1,000+ hrs' : '800+ hrs');

  const translatedTitle = translateChinesePubgTitle(title);
  const gunLevelTh = extractGunLevels(title);

  return {
    id,
    rawId: rawItem.id || rawDetail.id,
    bianhao: cleanCode,
    rawBianhao: rawOriginal,
    region: 'cn',
    category,
    rmbPrice,
    title_th: translatedTitle,
    title_en: translateTitleEn(title),
    subtitle_th: `ไอดีจีนแท้ [รหัส #${cleanCode}] ปลอดภัย 100% ประกันมือ 1 เมลแรกแท้ PUBG SIAM`,
    subtitle_en: `Authentic CN Steam [Code #${cleanCode}] 100% Anti-pullback Warranty PUBG SIAM`,
    priceTHB: priceInfo.priceTHB,
    priceVND: priceInfo.priceVND,
    originalPriceTHB: priceInfo.originalPriceTHB,
    originalPriceVND: priceInfo.originalPriceVND,
    markupAppliedPercent: priceInfo.activeMarkupPercent,
    profitTHB: priceInfo.profitTHB,
    tags,
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'],
    coverImg: coverImg || images[0],
    binding_th: 'โอนย้ายเข้า Steam เมลแรกแท้ 100% มีประกันมือ 1 ไม่ดึงคืน',
    binding_en: 'Authentic CN Steam ID, transferred directly to buyer with warranty',
    rank: rankTh,
    playtime_th: playtime,
    playtime_en: playtimeEn,
    gunLevel_th: gunLevelTh,
    gunLevel_en: gunLevelTh,
    warranty_th: 'รับประกันมือ 1 แท้ (ปลอดภัย 100% ไม่ดึงคืน)',
    warranty_en: '1st Hand Owner Warranty (100% Anti-pullback)',
    details_th: `รหัสไอดี: #${cleanCode}\nสเปกคลัง & สกินเด่น: ${translatedTitle}\nระดับการเล่น: ${rankTh}\nปืนอัปเกรด: ${gunLevelTh}\nสถานะความปลอดภัย: มีอีเมลแรกแท้ 100% ปลอดภัย โอนย้าย Steam ทันที`,
    details_en: `Stock ID: #${cleanCode}\nSkins & Loadout: ${translatedTitle}\nRank: ${rankTh}\nWeapons: ${gunLevelTh}\nSecurity: 100% First Mail Included Instant Steam Transfer`,
    videoUrl: '',
    steamUser: `cn_steam_${cleanCode.toLowerCase()}`,
    steamPass: `SiamCN#${(rawItem.id || 8888).toString().slice(-4)}`,
    steamEmail: `pubg_cn_${cleanCode.toLowerCase()}@163.com | pass: Siam2026!`,
    isSold: false,
    isHot: rmbPrice >= 5000 || title.includes('极品') || title.includes('柏林'),
    accentColor: 'from-amber-950/60 via-slate-900 to-slate-950',
    createdAt: new Date().toISOString()
  };
}

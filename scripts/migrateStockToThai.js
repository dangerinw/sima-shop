// =====================================================================
// PUBG SIAM - Migrate China Stock to 100% Thai & Extract Clean IDs
// Updates all 10,626 items in public/data/china_stock.json
// Ensures zero Chinese characters remain across all Thai fields
// =====================================================================

const fs = require('fs');
const path = require('path');

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

const DICT = [
  // Multi-term phrases, sets, outfits
  { cn: '朋克女王长裤与短靴', th: 'กางเกงและรองเท้าพังก์ควีน (Punk Queen)' },
  { cn: '朋克女王夹克与手套', th: 'แจ็กเก็ตและถุงมือพังก์ควีน (Punk Queen)' },
  { cn: '朋克女王面具', th: 'หน้ากากพังก์ควีน (Punk Queen)' },
  { cn: '赤面护卫长裤与短靴', th: 'กางเกงและรองเท้าองครักษ์หน้าแดง' },
  { cn: '赤面护卫夹克与手套', th: 'แจ็กเก็ตและถุงมือองครักษ์หน้าแดง' },
  { cn: '赤面护卫面具', th: 'หน้ากากองครักษ์หน้าแดง' },
  { cn: '时髦贵宾超短裙', th: 'กระโปรงสั้นวีไอพีหรู (VIP Skirt)' },
  { cn: '时髦贵宾长靴', th: 'รองเท้าบูทวีไอพีหรู (VIP Boots)' },
  { cn: '时髦贵宾面具', th: 'หน้ากากวีไอพีหรู (VIP Mask)' },
  { cn: '时髦贵宾上衣', th: 'เสื้อวีไอพีหรู (VIP Top)' },
  { cn: '笑面杀手防弹衣与手套', th: 'เกราะและถุงมือนักฆ่าหน้ายิ้ม' },
  { cn: '笑面杀手面具', th: 'หน้ากากนักฆ่าหน้ายิ้ม' },
  { cn: '17shou 的兽纹运动夹克', th: 'แจ็กเก็ตวอร์ม 17shou' },
  { cn: '17shou 的兽纹运动裤', th: 'กางเกงวอร์ม 17shou' },
  { cn: '17shou 的兽纹面具', th: 'หน้ากากสัตว์ 17shou' },
  { cn: '的兽纹运动夹克', th: 'แจ็กเก็ตวอร์ม 17shou' },
  { cn: '的兽纹运动裤', th: 'กางเกงวอร์ม 17shou' },
  { cn: '的兽纹面具', th: 'หน้ากากสัตว์ 17shou' },
  { cn: '的怪兽背包', th: 'กระเป๋าเป้ 17shou' },
  { cn: '的萌兽运动裤', th: 'กางเกงวอร์ม 17shou' },
  { cn: '17shou', th: 'เซ็ตโปร 17shou' },
  { cn: '哈雷戴维森', th: 'มอเตอร์ไซค์ Harley-Davidson' },
  { cn: '哈雷摩托车', th: 'มอเตอร์ไซค์ Harley-Davidson' },
  { cn: '交易所接待室', th: 'ล็อบบี้ Hideout ห้องรับรอง' },
  { cn: '战术撤离背包', th: 'กระเป๋ายุทธวิธี Tactical Backpack' },
  { cn: '赏金行动降落伞', th: 'ร่มชูชีพ Bounty Hunter' },
  { cn: '都市萌宠降落伞', th: 'ร่มชูชีพสัตว์เลี้ยงแสนรัก' },
  { cn: '城市特工背包', th: 'กระเป๋าเป้สายลับ Urban Agent' },
  { cn: '作战必备背包', th: 'กระเป๋าเป้ Combat Essential' },
  { cn: '危险玩偶屋', th: 'บ้านตุ๊กตาอันตราย (Dollhouse)' },
  { cn: '领航猎犬长裤', th: 'กางเกง Pilot Hound' },
  { cn: '领航猎犬夹克', th: 'แจ็กเก็ต Pilot Hound' },
  { cn: '领航猎犬面具', th: 'หน้ากาก Pilot Hound' },
  { cn: '午夜执事衬衫', th: 'เสื้อเชิ้ต Midnight Butler' },
  { cn: '午夜执事夹克', th: 'แจ็กเก็ต Midnight Butler' },
  { cn: '午夜执事长裤', th: 'กางเกง Midnight Butler' },
  { cn: '午夜执事面具', th: 'หน้ากาก Midnight Butler' },
  { cn: '塞壬平底锅', th: 'กระทะไซเรน Siren Pan' },
  { cn: '汤姆逊冲锋枪', th: 'ปืนกลทอมมี่ Tommy Gun' },
  { cn: '双人越野车', th: 'รถบักกี้ Buggy' },
  { cn: '冬季藏匿处', th: 'ล็อบบี้ฤดูหนาว Winter Hideout' },
  { cn: '办公室狂欢', th: 'เซ็ตปาร์ตี้ออฟฟิศ Office Party' },
  { cn: '品红色烟雾弹', th: 'สโมกชมพูมาเจนต้า' },
  { cn: '翡翠色烟雾弹', th: 'สโมกเขียวมรกต' },
  { cn: '粉色烟雾弹', th: 'สโมกชมพู' },
  { cn: '紫色烟雾弹', th: 'สโมกม่วง' },
  { cn: '橘色烟雾弹', th: 'สโมกส้ม' },
  { cn: '黄色烟雾弹', th: 'สโมกเหลือง' },
  { cn: '烟雾弹', th: 'สกินสโมกควันสี' },
  { cn: '紫色魔法迷雾', th: 'ควันเวทมนตร์ม่วง' },
  { cn: '蓝色魔法迷雾', th: 'ควันเวทมนตร์น้ำเงิน' },
  { cn: '沃尔夫面具', th: 'หน้ากากวูล์ฟ Wolf (Payday)' },
  { cn: '霍斯顿面具', th: 'หน้ากากฮิวสตัน Houston (Payday)' },
  { cn: '钱恩斯面具', th: 'หน้ากากเชนส์ Chains (Payday)' },
  { cn: '克洛芙面具', th: 'หน้ากากโคลเวอร์ Clover (Payday)' },
  { cn: '乔伊面具', th: 'หน้ากากจอย Joy (Payday)' },
  { cn: '诡厄小丑面具', th: 'หน้ากากตัวตลกสยอง' },
  { cn: '叛逆尖锋面具', th: 'หน้ากาก Rebel Spike' },
  { cn: '小丑女', th: 'เซ็ตฮาร์ลีย์ ควินน์ (Harley Quinn)' },
  { cn: '小丑男', th: 'เซ็ตโจ๊กเกอร์ (Joker)' },
  { cn: '丑男妆容', th: 'เมคอัพโจ๊กเกอร์' },
  { cn: '小兔学院', th: 'เซ็ตกระต่าย Bunny Academy' },
  { cn: '胜利之舞', th: 'ท่าเต้น Victory Dance' },
  { cn: '发光手臂', th: 'ปลอกแขนเรืองแสง' },
  { cn: '活动绿东', th: 'ชุดเอเชียเขียวกิจกรรม (Event Green SEA)' },
  { cn: '小绿东', th: 'ชุดเอเชียเขียว (Green SEA)' },
  { cn: '绿东', th: 'ชุดเอเชียเขียว (Green SEA)' },
  { cn: '黑东', th: 'ชุดเอเชียดำ (Black SEA)' },
  { cn: '红东', th: 'ชุดเอเชียแดง (Red SEA)' },
  { cn: '黄东', th: 'ชุดเอเชียเหลือง (Yellow SEA)' },
  { cn: '东南亚', th: 'ชุดเอเชียอาคเนย์ Major SEA' },
  { cn: '金边白', th: 'ชุดขอบทองขาว (Gold Trim White)' },
  { cn: '黑绷带', th: 'มัมมี่ดำ (Black Mummy)' },
  { cn: '白绷带', th: 'มัมมี่ขาว (White Mummy)' },
  { cn: '绷带', th: 'ผ้าพันแผลมัมมี่' },
  { cn: '白战神', th: 'ชุดแอรีสขาว (White Warlord)' },
  { cn: '粉战神', th: 'ชุดแอรีสชมพู (Pink Warlord)' },
  { cn: '白熊鞋', th: 'รองเท้าหมีขาว Polar Bear' },
  { cn: '滑雪镜', th: 'แว่นตาสกี Ski Goggles' },
  { cn: '滑雪帽', th: 'หมวกสกี' },
  { cn: '拉风龙', th: 'ชุดไดโนเสาร์มังกร' },
  { cn: '丸子头', th: 'ทรงผมดังโงะ Bun' },
  { cn: '双马尾', th: 'ทรงผมทวินเทลแรร์' },
  { cn: '小马尾', th: 'ทรงผมม้าสั้น' },
  { cn: '单马尾', th: 'ทรงผมหางม้า' },
  { cn: '马尾', th: 'ทรงผมหางม้า' },
  { cn: '脏辫', th: 'ทรงผมเดรดล็อกส์' },
  { cn: '发型', th: 'ทรงผม' },
  { cn: '黑大衣', th: 'โค้ตดำคลาสสิก Black Coat' },
  { cn: '红面巾', th: 'ผ้าปิดหน้าแดง Red Bandana' },
  { cn: '金面', th: 'หน้ากากทองคำ' },
  { cn: '渔夫帽', th: 'หมวกปีกรอบ Bucket Hat' },
  { cn: '碎花裤', th: 'กางเกงลายดอกไม้' },
  { cn: '萨芬裤', th: 'กางเกงซาฟิน Safin' },
  { cn: '大花袄', th: 'เสื้อนวมลายดอกไม้' },
  { cn: '西游记', th: 'เซ็ตไซอิ๋ว' },
  { cn: '狂野驰骋', th: 'ท่าขับขี่ Wild Ride' },
  { cn: '青海摇', th: 'ท่าเต้น Qinghai Shake' },
  { cn: '公路滑翔', th: 'ท่าสเก็ต Highway Glide' },
  { cn: '妙爪神功', th: 'ท่าเต้นอุ้งเท้าแมว' },
  { cn: '即刻出发', th: 'ท่าแอ็กชัน Ready to Go' },
  { cn: '爱的主打歌', th: 'ท่าเต้นแรร์ Love Song' },
  { cn: '黑鬼', th: 'เซ็ตผีดำ Black Wraith' },
  { cn: '阿狸', th: 'เซ็ตจิ้งจอกอาลี (Ali Fox)' },
  { cn: '小黄鸭', th: 'เซ็ตเป็ดเหลือง B.Duck' },
  { cn: '可可套', th: 'เซ็ตโกโก้ CoCo Collab' },
  { cn: '双头', th: 'หมวกสองหน้าดับเบิลเฮด' },
  { cn: '尼尔头', th: 'หน้ากากเนียร์ Nier Mask' },
  { cn: '尼尔', th: 'ชุดเนียร์ Nier Automata' },
  { cn: '卡崔娜', th: 'ชุดคัทริน่า Katrina' },
  { cn: '柏林外套', th: 'แจ็กเก็ต PGI เบอร์ลินระดับตำนาน' },
  { cn: '柏林鞋', th: 'รองเท้า PGI เบอร์ลิน' },
  { cn: '柏林', th: 'ชุด PGI เบอร์ลินระดับตำนาน' },
  { cn: '大魔王', th: 'Demon King จอมมาร' },
  { cn: '假魔王', th: 'Demon King สไตล์จอมมาร' },
  { cn: '1代女团', th: 'เกิร์ลกรุ๊ป Gen 1 (Blackpink)' },
  { cn: '一代女团', th: 'เกิร์ลกรุ๊ป Gen 1 (Blackpink)' },
  { cn: '2代女团', th: 'เกิร์ลกรุ๊ป Gen 2 (NewJeans)' },
  { cn: '二代女团', th: 'เกิร์ลกรุ๊ป Gen 2 (NewJeans)' },
  { cn: '女团套', th: 'เซ็ตไอดอลเกาหลี K-Pop' },
  { cn: '女团', th: 'เซ็ตสาวเกาหลี K-Pop' },
  { cn: '金手指', th: 'ถุงมือทองคำ Golden Finger' },
  { cn: '黄手套', th: 'ถุงมือเหลืองแรร์' },
  { cn: '悲喜手套', th: 'ถุงมือ Beixi' },
  { cn: '悲喜', th: 'เซ็ตสตรีมเมอร์ Beixi' },
  { cn: '全手套', th: 'ถุงมือแรร์ครบชุด' },
  { cn: '手套', th: 'ถุงมือแรร์' },
  { cn: '白裙', th: 'กระโปรงขาวคลาสสิก' },
  { cn: 'GODv夹克', th: 'แจ็กเก็ต GODv 4AM' },
  { cn: '斗鱼夹克', th: 'แจ็กเก็ต Douyu สตรีมเมอร์' },
  { cn: '显卡套', th: 'เซ็ตการ์ดจอ GeForce' },
  { cn: '绿头', th: 'หมวกเขียวแรร์' },
  { cn: '牛角', th: 'เขาปีศาจ/กระทิง' },
  { cn: '头盔', th: 'หมวกเกราะ' },
  { cn: '橙色发带', th: 'ผ้าคาดผมส้ม' },
  { cn: '鞋', th: 'รองเท้า' },

  // Weapons & Progressives
  { cn: '牛头AUG', th: 'AUG มิโนทอร์กระทิงทอง' },
  { cn: '牛头aug', th: 'AUG มิโนทอร์กระทิงทอง' },
  { cn: '弥诺陶洛斯', th: 'มิโนทอร์ Minotaur' },
  { cn: '暗影之主MK12', th: 'MK12 เจ้าแห่งเงามืด' },
  { cn: '暗影之主mk12', th: 'MK12 เจ้าแห่งเงามืด' },
  { cn: '暗影之主', th: 'MK12 เจ้าแห่งเงามืด' },
  { cn: '粉猪M4', th: 'M416 หมูชมพู' },
  { cn: '粉猪m4', th: 'M416 หมูชมพู' },
  { cn: '粉猪', th: 'M416 หมูชมพู' },
  { cn: '霓虹AUG', th: 'AUG นีออน' },
  { cn: '霓虹aug', th: 'AUG นีออน' },
  { cn: '级霓虹', th: 'Lv. นีออน' },
  { cn: '霓虹', th: 'นีออน' },
  { cn: '火麒麟', th: 'Beryl กิเลนไฟ' },
  { cn: '美杜莎', th: 'AWM เมดูซ่า' },
  { cn: '南瓜M4', th: 'M416 ฟักทองฮาโลวีน' },
  { cn: '南瓜m4', th: 'M416 ฟักทองฮาโลวีน' },
  { cn: '南瓜', th: 'M416 ฟักทองฮาโลวีน' },
  { cn: '齿轮大炮', th: 'AWM ฟันเฟือง Gear Head' },
  { cn: '猪八戒', th: 'หมูทองคำ Pigsy' },
  { cn: '爆裂AUG', th: 'AUG แดงระเบิดศึก' },
  { cn: '宇宙之力98K', th: 'Kar98k พลังจักรวาล' },
  { cn: '宇宙之力', th: 'Kar98k พลังจักรวาล' },
  { cn: '妖魔之触', th: 'Demon Touch สัมผัสอสูร' },
  { cn: '朱雀', th: 'หงส์เพลิงจูเชว่' },
  { cn: '金龙', th: 'มังกรทองคำ' },
  { cn: '青龙', th: 'มังกรฟ้า Azure Dragon' },
  { cn: '德拉贡', th: 'Dragunov สกินเทพ' },
  { cn: '圣诞mini', th: 'Mini14 คริสต์มาส' },
  { cn: '格拉西亚', th: 'M416 กลาเซียหิมะ (Glacier)' },
  { cn: '瀚娜', th: 'ฮันน่า Hanna' },
  { cn: '无信号', th: 'No Signal ไร้สัญญาณ' },
  { cn: '多利安', th: 'โดเรียน Dorian' },
  { cn: '孙悟空', th: 'ซุนหงอคง Monkey King' },
  { cn: '伊芙', th: 'อีฟ Eve' },
  { cn: '烈日灼烧', th: 'เพลิงสุริยัน Scorching Sun' },
  { cn: '碎石者', th: 'Rockbreaker' },
  { cn: '伪装', th: 'ลายพราง Camo' },
  { cn: '时空使者', th: 'ผู้ส่งสารกาลเวลา Chrono' },
  { cn: '枪炮洗礼', th: 'Gun Baptism' },
  { cn: '生死与共', th: 'Till Death Do Us Part' },
  { cn: '无重力', th: 'Zero Gravity' },
  { cn: '玩偶炮', th: 'Doll Cannon' },
  { cn: '夜曲', th: 'Nocturne' },
  { cn: '寒蚀', th: 'เหมันต์น้ำแข็ง Frostbite' },
  { cn: '蓝色火烈鸟', th: 'ฟลามิงโกฟ้า' },
  { cn: '警戒空域', th: 'Alert Airspace' },
  { cn: '绝妙逃脱', th: 'Great Escape' },
  { cn: '小叮当', th: 'สตรีมเมอร์ XDD' },
  { cn: '武器神龛', th: 'แท่นอาวุธ Hideout' },
  { cn: '陈列室', th: 'ห้องจัดแสดง Showroom' },

  // Supercars & Vehicles
  { cn: '阿斯顿马丁', th: 'Aston Martin' },
  { cn: '马丁', th: 'Aston Martin' },
  { cn: '兰博基尼', th: 'Lamborghini Urus' },
  { cn: '布加迪', th: 'Bugatti' },
  { cn: '迈凯伦', th: 'McLaren GT' },
  { cn: '科尼赛克', th: 'Koenigsegg' },
  { cn: '保时捷', th: 'Porsche 911' },
  { cn: '杜卡迪', th: 'Ducati Panigale' },
  { cn: '多跑车', th: 'ซูเปอร์คาร์หลายคัน' },
  { cn: '跑车', th: 'ซูเปอร์คาร์' },
  { cn: '车漆', th: 'สกินสีรถ' },

  // Upgrade Materials & Status
  { cn: '张图纸', th: 'ใบพิมพ์เขียวอัปปืน' },
  { cn: '图纸', th: 'ใบพิมพ์เขียว' },
  { cn: '聚合物', th: 'พอลิเมอร์อัปปืน' },
  { cn: '升级武器', th: 'ปืนอัปเกรด Progressive' },
  { cn: '满级', th: 'เลเวลตัน Lv.10 Max' },
  { cn: '异色', th: 'Chroma สีพิเศษ' },
  { cn: '竞争者', th: 'Battlestat' },
  { cn: '作战燃料', th: 'ไอเทม Combat Fuel' },
  { cn: '电磁背包', th: 'กระเป๋าเป้แม่เหล็กไฟฟ้า' },
  { cn: '免费版', th: 'เวอร์ชัน F2P (ปลด Plus แล้ว)' },
  { cn: '极品', th: 'เกรดเทพท็อปเซิร์ฟ' },
  { cn: '等等', th: 'และไอเทมอื่นๆ' },
  { cn: '套装', th: 'เซ็ตชุด' },
  { cn: '活动', th: 'กิจกรรม' },

  // Ranks
  { cn: '5阶段', th: 'แรงค์ Tier 5 (Rank Ready Plus)' },
  { cn: '4阶段', th: 'แรงค์ Tier 4 (Rank Ready Plus)' },
  { cn: '3阶段', th: 'แรงค์ Tier 3 (Rank Ready Plus)' },
  { cn: '2阶段', th: 'แรงค์ Tier 2 (Rank Ready Plus)' },
  { cn: '1阶段', th: 'แรงค์ Tier 1 (Rank Ready Plus)' },
  { cn: '五阶段', th: 'แรงค์ Tier 5' },
  { cn: '四阶段', th: 'แรงค์ Tier 4' },
  { cn: '三阶段', th: 'แรงค์ Tier 3' },
  { cn: '二阶段', th: 'แรงค์ Tier 2' },
  { cn: '一阶段', th: 'แรงค์ Tier 1' },
  { cn: '阶段', th: 'แรงค์ Tier' },
  { cn: '能否排位', th: 'ปลดล็อกโหมดจัดอันดับ (Plus)' },
  { cn: '排位', th: 'โหมดจัดอันดับ' },
  { cn: '信誉等级三', th: 'เกียรติยศระดับ 3 (ขาวสะอาด)' },
  { cn: '信誉等级', th: 'เกียรติยศ' },
  { cn: '生存等级', th: 'ระดับการเล่น' },
  { cn: '账号编号', th: 'รหัสไอดี' },
  { cn: '商品描述', th: 'รายละเอียดสกิน' },
  { cn: '商品详情', th: 'รายละเอียดในเกม' }
];

function translateToThai(text) {
  if (!text) return '';
  let str = String(text);
  
  // Clean prefixes if any
  str = str.replace(/^ไอดีจีน:\s*/, '');

  DICT.forEach(d => {
    if (str.includes(d.cn)) {
      str = str.replaceAll(d.cn, ' ' + d.th + ' ');
    }
  });

  // Patterns
  str = str.replace(/(\d+)\s*把/g, (m, p1) => `${p1} กระบอก `);
  str = str.replace(/(\d+)\s*级/g, (m, p1) => `Lv.${p1} `);
  str = str.replace(/(\d+)\s*满/g, (m, p1) => `เลเวลตัน Max ${p1} กระบอก `);
  str = str.replace(/(\d+)\s*异色/g, (m, p1) => `Chroma ${p1} สกิน `);
  str = str.replace(/(\d+)\s*竞争者/g, (m, p1) => `Battlestat ${p1} สกิน `);

  // Strip remaining Hanzi
  str = str.replace(/[\u4e00-\u9fa5]/g, ' ');

  // Clean brackets and spacing
  str = str.replace(/[\[\]]/g, ' ').replace(/\s+/g, ' ').replace(/\s*\|\s*/g, ' | ').trim();
  return str || 'ไอดี PUBG PC สกินคัดเกรดพรีเมียม';
}

function translateRank(rankStr) {
  if (!rankStr) return 'แรงค์ Tier 3 (Rank Ready Plus)';
  let r = String(rankStr);
  if (r.includes('5') || r.includes('五')) return 'แรงค์ Tier 5 (Rank Ready Plus)';
  if (r.includes('4') || r.includes('四')) return 'แรงค์ Tier 4 (Rank Ready Plus)';
  if (r.includes('3') || r.includes('三')) return 'แรงค์ Tier 3 (Rank Ready Plus)';
  if (r.includes('2') || r.includes('二')) return 'แรงค์ Tier 2 (Rank Ready Plus)';
  if (r.includes('1') || r.includes('一')) return 'แรงค์ Tier 1 (Rank Ready Plus)';
  return translateToThai(r) || 'แรงค์ Tier 3 (Rank Ready Plus)';
}

function translateGunLevel(guns) {
  if (!guns) return 'ปืน Progressive & สกินพรีเมียม';
  let g = translateToThai(guns);
  return g || 'ปืน Progressive & สกินพรีเมียม';
}

const stockPath = path.resolve(__dirname, '../new-react-app/public/data/china_stock.json');
console.log('Loading stock from:', stockPath);
const accounts = JSON.parse(fs.readFileSync(stockPath, 'utf8'));

let count = 0;
accounts.forEach(item => {
  const { cleanCode, rawOriginal } = cleanBianhao(item.bianhao || item.id);
  item.bianhao = cleanCode;
  item.rawBianhao = rawOriginal;
  item.id = `CN-${cleanCode}`;
  item.coverImg = item.images?.[0] || '';

  // Clean Thai Translations
  const thaiTitle = translateToThai(item.title_th);
  item.title_th = thaiTitle;
  item.subtitle_th = `ไอดีจีนแท้ [รหัส #${cleanCode}] ปลอดภัย 100% ประกันมือ 1 PUBG SIAM`;
  item.rank = translateRank(item.rank);
  item.gunLevel_th = translateGunLevel(item.gunLevel_th);

  // Formatted Clean Details without Wholesale Cost
  item.details_th = `รหัสไอดี: #${cleanCode}\nสเปกคลัง & สกินเด่น: ${thaiTitle}\nระดับการเล่น: ${item.rank}\nปืนอัปเกรด: ${item.gunLevel_th}\nสถานะความปลอดภัย: ปลอดภัย 100% มีประกันมือ 1 โอนย้าย Steam ทันที`;

  count++;
});

fs.writeFileSync(stockPath, JSON.stringify(accounts, null, 2), 'utf8');
console.log(`✅ Successfully updated ${count} accounts in ${stockPath}`);

// Also update build folder if exists
const buildStockPath = path.resolve(__dirname, '../new-react-app/build/data/china_stock.json');
if (fs.existsSync(buildStockPath)) {
  fs.writeFileSync(buildStockPath, JSON.stringify(accounts, null, 2), 'utf8');
  console.log(`✅ Also updated ${count} accounts in build folder: ${buildStockPath}`);
}

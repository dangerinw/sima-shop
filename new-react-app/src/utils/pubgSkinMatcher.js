// PUBG Skin Fuzzy & Colloquial Thai Alias Matcher
// Solves mismatch between real-world seller naming (slang/nicknames) and official Noctis filter catalog.

import filterCategoriesData from '../data/filterCategories.json';

// Flatten catalog of all 239 Noctis skins
export const ALL_FILTER_SKINS = filterCategoriesData.reduce((acc, cat) => {
  if (Array.isArray(cat.items)) {
    cat.items.forEach((item) => {
      acc.push({
        ...item,
        categoryName: cat.name,
        categoryType: cat.category
      });
    });
  }
  return acc;
}, []);

// Comprehensive Thai Slang & Nickname Alias Map
// Maps common seller expressions to skin search terms and target IDs
export const SKIN_SYNONYM_DICTIONARY = [
  // AUG
  {
    targetKeywords: ['minotaur - aug', 'aug มิโนทอร์'],
    aliases: ['มิโน', 'มิโนทอร์', 'กระทิง', 'กระทิงทอง', 'minotaur', 'augมิโน', 'อ็อกมิโน', 'อ๊อกมิโน', 'อ็อก', 'อ๊อก', 'aug minotaur']
  },
  {
    targetKeywords: ['neon dream - aug', 'aug นีออนดรีม'],
    aliases: ['นีออน', 'นีออนดรีม', 'neon dream', 'augนีออน', 'อ็อกนีออน']
  },
  {
    targetKeywords: ['bumper blaster - aug', 'bumper blaster'],
    aliases: ['บัมเปอร์', 'รถชน', 'bumper blaster', 'bumper']
  },
  {
    targetKeywords: ['g-dragon - aug', 'g-dragon'],
    aliases: ['g-dragon', 'gdragon', 'gd', 'จีดราก้อน', 'จีดี']
  },

  // M416
  {
    targetKeywords: ['trick-or-treat - m416', 'the fool', 'ฟักทองฮาโลวีน'],
    aliases: ['โจ๊ก', 'โจ๊กเกอร์', 'the fool', 'เดอะฟูล', 'ฟักทอง', 'ฮาโลวีน', 'm4โจ๊ก', 'm4ฟักทอง', 'fool', 'joker']
  },
  {
    targetKeywords: ['glacier - m416', 'กลาเซียหิมะ'],
    aliases: ['กลาเซีย', 'glacier', 'น้ำแข็ง', 'm4น้ำแข็ง', 'm4กลาเซีย', 'หิมะ']
  },
  {
    targetKeywords: ['phoenix - m416', 'phoenix'],
    aliases: ['ฟีนิกซ์', 'phoenix', 'ฟินิกส์', 'นกฟีนิกซ์', 'm4ฟีนิกซ์']
  },
  {
    targetKeywords: ['zhu bajie - m416', 'zhu bajie'],
    aliases: ['ตือโป๊ยก่าย', 'หมู', 'หมูทอง', 'หมูส้ม', 'zhu bajie', 'bajie']
  },
  {
    targetKeywords: ['no signal - m416', 'no signal'],
    aliases: ['โนซิกแนล', 'no signal', 'สัญญาณ']
  },
  {
    targetKeywords: ['time keeper - m416', 'time keeper'],
    aliases: ['ไทม์คีปเปอร์', 'time keeper', 'นาฬิกา']
  },
  {
    targetKeywords: ['techno threat - m416', 'techno'],
    aliases: ['เทคโน', 'techno', 'ทหารเทคโน']
  },

  // BERYL M762
  {
    targetKeywords: ['azure dragon - m762', 'มังกรฟ้า'],
    aliases: ['มังกรฟ้า', 'azure dragon', 'มังกรเขียว', 'เบอริลมังกร', 'berylมังกร', '762มังกร', 'มังกร']
  },
  {
    targetKeywords: ['gear head - m762', 'เกียร์เฮด'],
    aliases: ['เกียร์เฮด', 'gear head', 'เฟือง', 'เบอริลเฟือง', '762เฟือง', 'gearhead']
  },
  {
    targetKeywords: ['medusa - m762', 'เมดูซ่า'],
    aliases: ['เมดูซ่า', 'medusa', 'เบอริลเมดูซ่า', '762เมดูซ่า', 'งู']
  },
  {
    targetKeywords: ['ryomen sukuna - m762', 'สุคุนะ'],
    aliases: ['สุคุนะ', 'sukuna', 'ซูคุนะ', 'สุกุนะ', 'ryomen']
  },
  {
    targetKeywords: ['darkest depths - m762', 'darkest depths'],
    aliases: ['ใต้สมุทร', 'darkest depths', 'ปลาฉลาม']
  },

  // DRAGUNOV
  {
    targetKeywords: ['rest in pink - dragunov', 'dragunov'],
    aliases: ['ดรากู', 'ดรากูนอฟ', 'dragunov', 'ดรากูชมพู', 'ดรากูนอฟชมพู', 'กุหลาบ', 'rest in pink']
  },

  // SLR
  {
    targetKeywords: ['buzzkill - slr', 'buzzkill'],
    aliases: ['บัสคิล', 'buzzkill', 'slrบัสคิล', 'ตุ๊กตา']
  },
  {
    targetKeywords: ['deadly dollhouse - slr', 'deadly dollhouse'],
    aliases: ['ดอลเฮาส์', 'dollhouse', 'บ้านตุ๊กตา']
  },

  // MINI14
  {
    targetKeywords: ['yule sleigh - mini14', 'cute aggression - mini14', 'คริสต์มาส'],
    aliases: ['คริสต์มาส', 'christmas', 'มินิคริสต์มาส', 'miniคริสต์มาส', 'ซานต้า', 'กวาง']
  },
  {
    targetKeywords: ['sha wujing - mini14', 'sha wujing'],
    aliases: ['ซัวเจ๋ง', 'sha wujing', 'wujing']
  },

  // M24
  {
    targetKeywords: ['sun wukong - m24', 'ซุนหงอคง'],
    aliases: ['หงอคง', 'ซุนหงอคง', 'wukong', 'ลิงหงอคง']
  },
  {
    targetKeywords: ['over the rainbow - m24', 'rainbow'],
    aliases: ['สายรุ้ง', 'เรนโบว์', 'rainbow']
  },

  // KAR98K
  {
    targetKeywords: ['tiger hunter - kar98k', 'tiger hunter'],
    aliases: ['เสือ', 'เสือดาว', 'เสือดำ', 'tiger hunter', 'karเสือ', '98kเสือ']
  },
  {
    targetKeywords: ['cosmic caliber - kar98k', 'cosmic'],
    aliases: ['คอสมิค', 'cosmic', 'จักรวาล']
  },
  {
    targetKeywords: ['midnight menace - kar98k', 'midnight'],
    aliases: ['มิดไนท์', 'midnight menace']
  },

  // MK12
  {
    targetKeywords: ['cyber threat - mk12', 'cyber threat'],
    aliases: ['ไซเบอร์', 'cyber threat', 'mk12ไซเบอร์']
  },
  {
    targetKeywords: ['hocus focus - mk12', 'hocus focus'],
    aliases: ['โฮคัส', 'hocus focus', 'โฮคัสโพคัส']
  },
  {
    targetKeywords: ['bunny patrol - mk12', 'bunny'],
    aliases: ['กระต่าย', 'bunny patrol', 'mkกระต่าย']
  },

  // ACE32
  {
    targetKeywords: ['demon hunter - ace32', 'demon hunter'],
    aliases: ['เดมอน', 'เดมอนฮันเตอร์', 'demon hunter', 'demon']
  },
  {
    targetKeywords: ['demon\'s touch - ace32', 'demon\'s touch'],
    aliases: ['เดมอนทัช', 'demon touch']
  },

  // AWM
  {
    targetKeywords: ['faded ghost - awm', 'ghost'],
    aliases: ['โกสต์', 'ghost', 'ผี', 'awmผี']
  },

  // GROZA
  {
    targetKeywords: ['absolute zero - groza', 'absolute zero'],
    aliases: ['แอบโซลูท', 'absolute zero', 'น้ำแข็งgroza']
  },

  // MP5K
  {
    targetKeywords: ['zero-g - mp5k', 'zero-g'],
    aliases: ['ซีโร่จี', 'zero-g', 'zerog', 'อวกาศ']
  },

  // PAN / MELEE
  {
    targetKeywords: ['siren - pan', 'siren'],
    aliases: ['กระทะไซเรน', 'กระทะชมพู', 'ไซเรน', 'siren']
  },
  {
    targetKeywords: ['void - pan', 'void'],
    aliases: ['กระทะวอยด์', 'กระทะดำ', 'void pan']
  },
  {
    targetKeywords: ['tang sanzang - pan', 'tang sanzang'],
    aliases: ['ถังซัมจั๋ง', 'tang sanzang', 'กระทะพระ']
  },

  // SUPER CARS & VEHICLES
  {
    targetKeywords: ['urus s', 'urus'],
    aliases: ['อุรุส', 'urus', 'ลัมโบอุรุส', 'แลมโบอุรุส', 'urus s', 'urus lusso']
  },
  {
    targetKeywords: ['cayenne turbo gt', 'cayenne'],
    aliases: ['คาเยน', 'cayenne', 'คาแยง', 'ปอร์เช่', 'porsche', 'cayenne turbo']
  },
  {
    targetKeywords: ['aston martin', 'dbx707', 'v12 vantage'],
    aliases: ['แอสตัน', 'aston', 'แอสตันมาร์ติน', 'aston martin', 'dbx707', 'vantage']
  },
  {
    targetKeywords: ['countach lpi 800-4', 'countach'],
    aliases: ['คูนทัช', 'countach', 'ลัมโบ', 'แลมโบ', 'lamborghini countach']
  },
  {
    targetKeywords: ['panamera turbo s', 'panamera'],
    aliases: ['พานาเมร่า', 'panamera']
  },
  {
    targetKeywords: ['911 carrera', '911'],
    aliases: ['911', 'carrera', 'ปอร์เช่911']
  },
  {
    targetKeywords: ['mclaren gt', 'mclaren'],
    aliases: ['แม็คลาเรน', 'แมคลาเรน', 'mclaren']
  },

  // FASHION & RARE SETS
  {
    targetKeywords: ['bape', 'a bathing ape'],
    aliases: ['bape', 'เบป', 'ชุดเบป', 'ชุดลิง', 'หมวกเบป', 'เสื้อเบป']
  },
  {
    targetKeywords: ['shroud'],
    aliases: ['shroud', 'ชราวด์', 'ชราว', 'ชุดชราวด์']
  },
  {
    targetKeywords: ['mummy', 'มัมมี่'],
    aliases: ['มัมมี่', 'mummy', 'มัมมี่ขาว', 'มัมมี่เหลือง', 'ชุดมัมมี่']
  }
];

// Clean and normalize text for robust fuzzy comparison
export const normalizePubgText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[🟢•\-–—_=+/*()[\],.:;#|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Smart Skin Detector:
 * Matches any input text (post caption, title, gun list) against the 239 Noctis skins catalog
 * using both exact keywords and the colloquial Thai slang synonym dictionary.
 * 
 * @param {string} text - The input text to analyze
 * @param {Array} catalog - The 239 Noctis items (defaults to ALL_FILTER_SKINS)
 * @returns {Array} - Array of matched skin items (sorted by relevance)
 */
export const matchSkinsFromText = (text, catalog = ALL_FILTER_SKINS) => {
  if (!text || typeof text !== 'string') return [];
  const normalized = normalizePubgText(text);
  if (!normalized) return [];

  const matchedItems = [];
  const seenIds = new Set();

  // 1. Direct Synonym Map Matching (Highest precision for Thai nicknames)
  SKIN_SYNONYM_DICTIONARY.forEach((entry) => {
    const hasAliasMatch = entry.aliases.some((alias) => {
      const cleanAlias = normalizePubgText(alias);
      if (!cleanAlias) return false;
      // Match with word boundary or clean substring
      return normalized.includes(cleanAlias);
    });

    if (hasAliasMatch) {
      // Find matching items from catalog
      catalog.forEach((item) => {
        if (seenIds.has(item.id)) return;
        const itemText = normalizePubgText(`${item.name} ${item.thaiName || ''} ${(item.keywords || []).join(' ')}`);

        const isTarget = entry.targetKeywords.some((target) => {
          const cleanTarget = normalizePubgText(target);
          return itemText.includes(cleanTarget);
        });

        if (isTarget) {
          seenIds.add(item.id);
          matchedItems.push(item);
        }
      });
    }
  });

  // 2. Exact & Keyword Match on Catalog Items
  catalog.forEach((item) => {
    if (seenIds.has(item.id)) return;

    const keywords = [
      ...(item.keywords || []),
      item.name,
      item.thaiName,
      item.chineseName
    ].filter(Boolean);

    const hit = keywords.some((kw) => {
      const cleanKw = normalizePubgText(kw);
      if (!cleanKw) return false;

      // Single word weapon names should only match when in title / gunLevel
      if (['m4', 'aug', 'mk', 'beryl', 'm762', 'awm', '98k', 'kar98', 'urus', 'bape'].includes(cleanKw)) {
        return normalized.includes(cleanKw);
      }
      if (cleanKw.length <= 2) return false;
      return normalized.includes(cleanKw);
    });

    if (hit) {
      seenIds.add(item.id);
      matchedItems.push(item);
    }
  });

  return matchedItems;
};

/**
 * Storefront Filter Helper:
 * Determines if a selected Noctis Filter skin matches a given account.
 * Checks explicit ID associations first, then falls back to smart synonym matching.
 */
export const isSkinMatchingAccount = (filterItem, account) => {
  if (!filterItem || !account) return false;

  // 1. Explicit ID matches (Instant & exact)
  if (Array.isArray(account.skinItemIds) && account.skinItemIds.includes(filterItem.id)) {
    return true;
  }
  if (Array.isArray(account.skinItems) && account.skinItems.some((it) => it.id === filterItem.id || it.name === filterItem.name)) {
    return true;
  }

  // 2. Check full corpus of the account
  const fullCorpus = [
    account.title,
    account.title_th,
    account.title_en,
    account.gunLevel,
    account.gunLevel_th,
    account.gunLevel_en,
    account.details,
    account.details_th,
    account.details_en,
    account.subtitle,
    account.subtitle_th,
    account.subtitle_en,
    (account.tags || []).join(' ')
  ].filter(Boolean).join(' ').toLowerCase();

  // Direct catalog keywords
  const keywords = [
    ...(filterItem.keywords || []),
    filterItem.name,
    filterItem.thaiName,
    filterItem.chineseName
  ].filter(Boolean);

  if (keywords.some((kw) => fullCorpus.includes(kw.toLowerCase()))) {
    return true;
  }

  // Check synonym dictionary for this filterItem
  const synonymEntry = SKIN_SYNONYM_DICTIONARY.find((entry) => {
    const itemText = `${filterItem.name} ${filterItem.thaiName || ''}`.toLowerCase();
    return entry.targetKeywords.some((target) => itemText.includes(target.toLowerCase()));
  });

  if (synonymEntry) {
    return synonymEntry.aliases.some((alias) => fullCorpus.includes(alias.toLowerCase()));
  }

  return false;
};

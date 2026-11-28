import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import FilterToolbar from './components/FilterToolbar';
import AccountCard from './components/AccountCard';
import AccountModal from './components/AccountModal';
import ItemFilterModal from './components/ItemFilterModal';
import filterCategoriesData from './data/filterCategories.json';
import FeaturesSection from './components/FeaturesSection';
import CountryRulesSection from './components/CountryRulesSection';
import CountryRulesModal from './components/CountryRulesModal';
import CustomerReviewsSection from './components/CustomerReviewsSection';
import GcoinCodeServicesSection from './components/GcoinCodeServicesSection';
import CommunitySection from './components/CommunitySection';
import Footer from './components/Footer';
import Pagination from './components/Pagination';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLoginModal from './components/admin/AdminLoginModal';
import WarrantyForm from './components/WarrantyForm';
import { mockAccounts } from './data/mockAccounts';
import { smurfAccounts } from './data/smurfAccounts';
import { mockOrders } from './data/mockOrders';
import { translations } from './data/translations';
import { getStoredSettings, saveStoredSettings } from './data/defaultSettings';
import { dbService } from './services/dbService';
import { isSkinMatchingAccount } from './utils/pubgSkinMatcher';

// Cross-shop deduplication key helper for Chinese accounts
function getCnDedupKey(acc) {
  if (!acc) return '';
  // Smurf and Crate accounts are unique distinct products and must NEVER be deduped by shared images
  if (acc.category === 'smurf' || acc.isSmurf) {
    return 'SMURF_' + (acc.bianhao || acc.id);
  }
  if (acc.coverImg && !acc.coverImg.includes('hot-deal-showcase')) {
    const mImg = acc.coverImg.match(/([0-9a-zA-Z_-]+\.(png|jpg|jpeg|webp))/i);
    if (mImg && !mImg[1].toLowerCase().startsWith('default')) return 'IMG_' + mImg[1].toLowerCase();
  }
  const code = (acc.bianhao || acc.id || '')
    .replace(/^CN-/, '')
    .replace(/^(XMGG|XGKK|XF)-/i, '')
    .trim()
    .toUpperCase();
  if (code && code.length >= 4) return 'CODE_' + code;
  if (acc.rawBianhao) return 'RAW_' + acc.rawBianhao.trim();
  return acc.id;
}

function App() {
  const [currency, setCurrency] = useState(() => {
    try {
      const saved = localStorage.getItem('sima_currency');
      return saved || 'THB';
    } catch (_) {
      return 'THB';
    }
  });
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('sima_lang');
      return saved || 'th';
    } catch (_) {
      return 'th';
    }
  });

  const handleSetCurrency = (newCurr) => {
    setCurrency(newCurr);
    try {
      localStorage.setItem('sima_currency', newCurr);
    } catch (_) {}
  };

  const handleSetLang = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('sima_lang', newLang);
    } catch (_) {}
  };
  const [viewMode, setViewMode] = useState('store'); // 'store' | 'admin'
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeRegion, setActiveRegion] = useState('all'); // 'all' | 'th' | 'cn' | 'vn'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Backward-compatibility wrappers for selectedTag
  const selectedTag = selectedTags[0] || '';
  const setSelectedTag = (val) => {
    if (Array.isArray(val)) {
      setSelectedTags(val);
    } else if (typeof val === 'function') {
      setSelectedTags(val);
    } else if (!val) {
      setSelectedTags([]);
    } else {
      setSelectedTags([val]);
    }
  };

  // Item Image Filter States ⭐ (Noctis-style filter)
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [isItemFilterOpen, setIsItemFilterOpen] = useState(false);

  // Country Trading Rules Modal States ⭐ (China, Thailand, Vietnam)
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [rulesCountry, setRulesCountry] = useState('th');

  // Warranty Form State ⭐ (A4 Guarantee Certificate & Installment Contract)
  const [warrantyAccount, setWarrantyAccount] = useState(null);
  const [warrantyDocType, setWarrantyDocType] = useState('cash');

  const handleOpenWarranty = useCallback((acc = null, docType = 'cash') => {
    // If foreign account (China, Vietnam, etc.), strictly enforce cash purchase only (no installment)
    const isForeign = acc && ((acc.region && acc.region !== 'th') || (acc.country && acc.country !== 'th'));
    const safeDocType = isForeign ? 'cash' : docType;
    setWarrantyAccount(acc);
    setWarrantyDocType(safeDocType);
    setViewMode('warranty');
  }, []);

  const handleOpenRules = useCallback((country = 'th') => {
    setRulesCountry(country);
    setIsRulesModalOpen(true);
  }, []);

  // Hash route listener for direct deep-linking (#installment, #warranty, #rules-installment)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#installment') {
        handleOpenWarranty(null, 'installment');
      } else if (hash === '#warranty') {
        handleOpenWarranty(null, 'cash');
      } else if (hash === '#rules-installment') {
        handleOpenRules('installment');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [handleOpenWarranty, handleOpenRules]);

  const allFilterItemsMap = useMemo(() => {
    const map = new Map();
    filterCategoriesData.forEach((cat) => {
      cat.items.forEach((it) => {
        if (!map.has(it.id)) map.set(it.id, it);
      });
    });
    return map;
  }, []);

  const selectedFilterItems = useMemo(() => {
    return selectedItemIds.map((id) => allFilterItemsMap.get(id)).filter(Boolean);
  }, [selectedItemIds, allFilterItemsMap]);

  // Store Settings (PromptPay, VietQR, Cloud DB, Announcement)
  const [storeSettings, setStoreSettings] = useState(() => getStoredSettings());

  const handleUpdateStoreSettings = (newSettings) => {
    setStoreSettings(newSettings);
    saveStoredSettings(newSettings);
    dbService.updateSettings(newSettings);
    if (newSettings.useCloudDb) {
      dbService.saveSettings(newSettings);
    }
  };

  // Sync state with Cloud DB / Storage when enabled (Preserves China Stock permanently!)
  useEffect(() => {
    dbService.updateSettings(storeSettings);
    if (storeSettings.useCloudDb) {
      dbService.getAccounts().then((cloudAccounts) => {
        if (Array.isArray(cloudAccounts) && cloudAccounts.length > 0) {
          setAccounts((prev) => {
            // Preserve all China accounts from static stock, never overwrite with Cloud DB!
            const chinaAccounts = prev.filter((a) => a.region === 'cn');
            const map = new Map();
            // 1. Add cloud accounts (Thai / VN / Custom accounts)
            cloudAccounts.forEach((a) => {
              if (a.region !== 'cn') {
                map.set(a.id, a);
              }
            });
            // 2. Always keep all China accounts from china_stock.json
            chinaAccounts.forEach((a) => map.set(a.id, a));
            return Array.from(map.values());
          });
        }
      });
      dbService.getOrders().then((cloudOrders) => {
        if (Array.isArray(cloudOrders) && cloudOrders.length > 0) {
          setOrders(cloudOrders);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeSettings.useCloudDb, storeSettings.supabaseUrl, storeSettings.supabaseAnonKey]);

  // Track sold IDs locally so China accounts persist sold state without saving 43MB JSON
  const [soldAccountIds, setSoldAccountIds] = useState(() => {
    try {
      const saved = localStorage.getItem('sima_sold_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sima_sold_ids', JSON.stringify(soldAccountIds));
    } catch (_) {}
  }, [soldAccountIds]);

  // Live Real-Time Stock Refresh State & Controls
  const [isStockRefreshing, setIsStockRefreshing] = useState(false);
  const [lastStockUpdated, setLastStockUpdated] = useState(() => new Date());

  // Dynamic Tiered Price Markup Calculator for CN accounts
  const calculateCnPricing = useCallback((acc) => {
    if (!acc.rmbPrice) return acc;
    const rawThb = Number(acc.rmbPrice) * Number(storeSettings.chinaCnyRateThb || 5.2);
    const rawVnd = Number(acc.rmbPrice) * Number(storeSettings.chinaCnyRateVnd || 3700);
    let activeMarkup = Number(storeSettings.chinaMarkupPercent || 10);
    if ((storeSettings.chinaMarkupMode || 'tiered') === 'tiered') {
      const threshold = Number(storeSettings.chinaMarkupThreshold || 100000);
      activeMarkup = rawThb < threshold
        ? Number(storeSettings.chinaMarkupTier1Percent ?? 10)
        : Number(storeSettings.chinaMarkupTier2Percent ?? 13);
    }
    const priceTHB = Math.round((rawThb * (1 + activeMarkup / 100)) / 10) * 10;
    const priceVND = Math.round((rawVnd * (1 + activeMarkup / 100)) / 1000) * 1000;
    return {
      ...acc,
      priceTHB,
      priceVND,
      originalPriceTHB: Math.round(priceTHB * 1.15),
      originalPriceVND: Math.round(priceVND * 1.15),
      markupAppliedPercent: activeMarkup,
      profitTHB: Math.round(rawThb * (activeMarkup / 100)),
      isSold: soldAccountIds.includes(acc.id)
    };
  }, [
    storeSettings.chinaMarkupMode,
    storeSettings.chinaMarkupThreshold,
    storeSettings.chinaMarkupTier1Percent,
    storeSettings.chinaMarkupTier2Percent,
    storeSettings.chinaMarkupPercent,
    storeSettings.chinaCnyRateThb,
    storeSettings.chinaCnyRateVnd,
    soldAccountIds
  ]);

  // Ref to track if 63MB static stock has already been loaded (to prevent massive redundant downloads)
  const hasLoadedStaticStockRef = useRef(false);

  // Unified China Stock Sync & Auto-Refresh Function (Optimized for bandwidth preservation)
  const refreshChinaStock = useCallback(async (isSilent = true, loadStatic = false) => {
    if (!isSilent) setIsStockRefreshing(true);
    try {
      // 1. Fetch static stock from china_stock.json (bypass browser cache if loadStatic is explicitly requested)
      let staticPromise = Promise.resolve(null);
      if (loadStatic || !hasLoadedStaticStockRef.current) {
        const cacheBust = loadStatic ? `?v=${Date.now()}` : '';
        staticPromise = fetch(`/data/china_stock.json${cacheBust}`, {
          cache: loadStatic ? 'reload' : 'default'
        })
          .then((res) => {
            if (res.ok) {
              hasLoadedStaticStockRef.current = true;
              return res.json();
            }
            return null;
          })
          .catch(() => null);
      }

      // 2. Query Vercel live serverless proxy for new arrivals (Lightweight ~10-20KB only!)
      const livePromise = fetch(`/api/china-live-arrivals?pages=2&cnyRateThb=${storeSettings.chinaCnyRateThb || 5.2}&tier1=${storeSettings.chinaMarkupTier1Percent ?? 10}&tier2=${storeSettings.chinaMarkupTier2Percent ?? 13}`)
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);

      const [staticStock, liveResult] = await Promise.all([staticPromise, livePromise]);

      const baseList = Array.isArray(staticStock) && staticStock.length > 0 ? staticStock : [];
      const liveItems = Array.isArray(liveResult?.items) ? liveResult.items : [];

      if (baseList.length > 0 || liveItems.length > 0) {
        setAccounts((prev) => {
          const map = new Map();
          const seenCnKeys = new Set();

          const addAccountDedup = (acc) => {
            if (!acc || !acc.id) return;
            if (acc.region === 'cn') {
              const dedupKey = getCnDedupKey(acc);
              if (dedupKey) {
                if (seenCnKeys.has(dedupKey)) return;
                seenCnKeys.add(dedupKey);
              }
            }
            map.set(acc.id, acc);
          };

          // 0. Guarantee all smurfAccounts are always present in the store!
          smurfAccounts.forEach((s) => {
            map.set(s.id, s);
          });

          // 1. Preserve local / Thai / VN custom accounts and all smurf accounts
          prev.forEach((a) => {
            if (a.region !== 'cn' || a.isCustomLocal || a.category === 'smurf' || a.isSmurf) {
              addAccountDedup(a);
            }
          });

          // 2. Prepend live arrivals if available (exclude China accounts < 500 THB unless smurf)
          liveItems.forEach((acc) => {
            const priced = calculateCnPricing(acc);
            const isSmurf = priced.category === 'smurf' || priced.isSmurf;
            if (priced.region !== 'cn' || Number(priced.priceTHB) >= 500 || isSmurf) {
              addAccountDedup(priced);
            }
          });

          // 3. Add base stock accounts if static stock was just loaded (exclude China accounts < 500 THB unless smurf)
          if (baseList.length > 0) {
            baseList.forEach((acc) => {
              const priced = calculateCnPricing(acc);
              const isSmurf = priced.category === 'smurf' || priced.isSmurf;
              if (priced.region !== 'cn' || Number(priced.priceTHB) >= 500 || isSmurf) {
                addAccountDedup(priced);
              }
            });
          } else {
            // Keep existing China stock intact when only updating live arrivals
            prev.forEach((a) => {
              if (a.region === 'cn') {
                addAccountDedup(a);
              }
            });
          }

          return Array.from(map.values());
        });
        setLastStockUpdated(new Date());
      }
    } catch (err) {
      console.warn('Auto-refresh stock failed:', err);
    } finally {
      setIsStockRefreshing(false);
    }
  }, [calculateCnPricing, storeSettings.chinaCnyRateThb, storeSettings.chinaMarkupTier1Percent, storeSettings.chinaMarkupTier2Percent]);

  // Auto-refresh lifecycle: Initial fetch (with static stock) + Interval (live arrivals only every 120s)
  useEffect(() => {
    // 1. Initial Load: Load static stock once + live arrivals
    refreshChinaStock(true, true);

    // 2. Continuous Background Interval: Check ONLY lightweight live arrivals every 2 minutes
    const timer = setInterval(() => {
      refreshChinaStock(true, false);
    }, 120 * 1000);

    // 3. Auto-refresh when customer switches back to this browser tab (live arrivals only)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshChinaStock(true, false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshChinaStock]);

  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('sima_admin_auth') === 'true';
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  // State for inventory & orders with LocalStorage persistence for Real Data
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('sima_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Auto-purge legacy mock items (PC-1006, PC-1005) if present from earlier testing
        if (Array.isArray(parsed)) {
          if (parsed.some((a) => a.id === 'PC-1006' || a.id === 'PC-1005')) {
            localStorage.setItem('sima_accounts', JSON.stringify(mockAccounts));
            return mockAccounts;
          }
          // Merge newly introduced mock accounts (e.g. Chinese Smurf accounts) if not present in cache
          const parsedIds = new Set(parsed.map((a) => a.id));
          const missingMocks = mockAccounts.filter((m) => !parsedIds.has(m.id));
          const merged = [...parsed, ...missingMocks];

          // Ensure smurfAccounts are always included in initial render!
          const existingIds = new Set(merged.map((a) => a.id));
          const missingSmurfs = smurfAccounts.filter((s) => !existingIds.has(s.id));
          const allMerged = [...missingSmurfs, ...merged];

          return allMerged.map((acc) => {
            if (acc.id === 'PC-1001' && (!acc.coverImg || !acc.images || acc.images.length === 0)) {
              return {
                ...acc,
                coverImg: '/images/hot-deal-showcase.jpg',
                images: ['/images/hot-deal-showcase.jpg']
              };
            }
            return acc;
          });
        }
        return parsed;
      }
      const mockIds = new Set(mockAccounts.map((a) => a.id));
      const missingSmurfs = smurfAccounts.filter((s) => !mockIds.has(s.id));
      return [...missingSmurfs, ...mockAccounts];
    } catch (e) {
      return [...smurfAccounts, ...mockAccounts];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('sima_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Auto-purge legacy demo orders (ORD-8821, ORD-8820, ORD-8818) from browser cache
        if (Array.isArray(parsed) && parsed.some((o) => o.orderId === 'ORD-8821' || o.orderId === 'ORD-8820' || o.orderId === 'ORD-8818')) {
          localStorage.setItem('sima_orders', JSON.stringify([]));
          return [];
        }
        return parsed;
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  // Automatically persist changes to LocalStorage so data never vanishes on refresh
  // NOTE: Exclude China stock from localStorage to keep within 5MB browser quota and maintain 60 FPS
  useEffect(() => {
    try {
      const localOnly = accounts.filter((a) => a.region !== 'cn' || a.isCustomLocal || a.category === 'smurf' || a.isSmurf);
      localStorage.setItem('sima_accounts', JSON.stringify(localOnly));
    } catch (e) {
      console.warn('[LocalStorage] Quota exceeded, applying safe image fallback for local persistence:', e);
      try {
        const lightOnly = accounts
          .filter((a) => a.region !== 'cn' || a.isCustomLocal)
          .map((acc) => ({
            ...acc,
            images: (acc.images || []).slice(0, 1)
          }));
        localStorage.setItem('sima_accounts', JSON.stringify(lightOnly));
      } catch (_) {}
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem('sima_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  const searchInputRef = useRef(null);
  const catalogSectionRef = useRef(null);

  // Storefront Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  // Reset pagination to page 1 whenever any filter or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeRegion, selectedTags, searchQuery, sortBy]);

  // Current translation dictionary
  const t = useMemo(() => {
    const base = translations[lang] || translations.th;
    if (storeSettings.announcementText) {
      return { ...base, announcement: storeSettings.announcementText };
    }
    return base;
  }, [lang, storeSettings.announcementText]);

  // Focus search input when navbar search button is clicked
  const handleSearchFocus = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Hot Deal Account for the Hero section spotlight
  const hotAccount = useMemo(() => {
    return (
      accounts.find((item) => item.isHot && !item.isSold && (item.coverImg || item.images?.length > 0)) ||
      accounts.find((item) => item.isHot && !item.isSold) ||
      accounts[0]
    );
  }, [accounts]);

  // Calculate real delivered count (completed orders + base count)
  const realDeliveredCount = useMemo(() => {
    const completedOrders = orders.filter((o) => o.status === 'completed' || !o.status).length;
    const base = Number(storeSettings.baseDeliveredCount || 1850);
    return base + completedOrders;
  }, [orders, storeSettings.baseDeliveredCount]);

  // Category item counts (optimized single pass over accounts)
  const categoryCounts = useMemo(() => {
    let all = 0;
    let progressive = 0;
    let rankReady = 0;
    let rareSkins = 0;
    let smurf = 0;
    for (let i = 0; i < accounts.length; i++) {
      const a = accounts[i];
      if (a.isSold) continue;
      
      const fullText = [
        a.title,
        a.title_th,
        a.title_en,
        a.gunLevel,
        a.gunLevel_th,
        a.gunLevel_en,
        a.details,
        a.details_th,
        (a.tags || []).join(' ')
      ].filter(Boolean).join(' ').toLowerCase();

      const isSmurf = a.category === 'smurf' || a.isSmurf || a.category === 'chicken';

      if (isSmurf) {
        smurf++;
      } else {
        all++;
        if (a.category === 'progressive' || fullText.includes('progressive') || fullText.includes('lv.') || fullText.includes('max') || fullText.includes('ปืนอัปเกรด')) progressive++;
        else if (a.category === 'rank-ready' || fullText.includes('rank') || fullText.includes('แรงค์') || fullText.includes('plus')) rankReady++;
        else if (a.category === 'rare-skins' || fullText.includes('แรร์') || fullText.includes('bape') || fullText.includes('shroud') || fullText.includes('ทรงจีน') || fullText.includes('urus')) rareSkins++;
      }
    }
    return { all, progressive, rankReady, rareSkins, smurf };
  }, [accounts]);

  // Filtered & Sorted accounts for Storefront
  const filteredAccounts = useMemo(() => {
    const seenCnKeys = new Set();
    let result = accounts.filter((item) => {
      // Hide sold accounts in storefront
      if (item.isSold) return false;

      // Identify whether this item is a Smurf or Crate / Workshop item
      const isSmurfItem = item.category === 'smurf' || item.isSmurf || item.category === 'chicken';

      // Hybrid View Filtering Logic:
      // When in 'smurf' category view -> Show only smurf/crate items (regardless of region or low price)
      if (activeCategory === 'smurf') {
        if (!isSmurfItem) return false;
      } else {
        // Exclude Chinese accounts under 500 THB if they are not smurf items
        if (item.region === 'cn' && Number(item.priceTHB) < 500 && !isSmurfItem) return false;
        // In other specific categories or default 'all', keep smurf items out of the main list unless searched
        if (isSmurfItem && !searchQuery) return false;
      }

      // Eliminate cross-shop duplicate listings
      if (item.region === 'cn') {
        const k = getCnDedupKey(item);
        if (k) {
          if (seenCnKeys.has(k)) return false;
          seenCnKeys.add(k);
        }
      }

      // 1. Country / Region match (all | th | cn | vn)
      if (activeRegion !== 'all') {
        const itemReg = String(item.region || 'th').toLowerCase();
        if (itemReg !== activeRegion.toLowerCase()) return false;
      }

      // 2. Category match (supports direct category + tags + keyword heuristics for custom accounts)
      if (activeCategory !== 'all' && activeCategory !== 'smurf') {
        const matchesDirect = item.category === activeCategory;
        const tagList = Array.isArray(item.tags)
          ? item.tags.map((t) => String(t).toLowerCase().replace(/[-_\s]/g, ''))
          : typeof item.tags === 'string'
          ? item.tags.toLowerCase().replace(/[-_\s]/g, '').split(',')
          : [];
        const normActive = activeCategory.toLowerCase().replace(/[-_\s]/g, '');
        const matchesTag = tagList.includes(normActive);

        const fullText = [
          item.title,
          item.title_th,
          item.title_en,
          item.gunLevel,
          item.gunLevel_th,
          item.gunLevel_en,
          item.details,
          item.details_th,
          item.details_en,
          item.subtitle,
          item.subtitle_th,
          item.subtitle_en,
          item.description
        ].filter(Boolean).join(' ').toLowerCase();

        const matchesKeywords = 
          (activeCategory === 'progressive' && (fullText.includes('progressive') || fullText.includes('lv.') || fullText.includes('max') || fullText.includes('ปืนอัปเกรด') || fullText.includes('เติบโต') || fullText.includes('ปืนโต') || fullText.includes('chroma'))) ||
          (activeCategory === 'rank-ready' && (fullText.includes('rank') || fullText.includes('แรงค์') || fullText.includes('plus') || fullText.includes('พร้อมแรงค์') || fullText.includes('diamond') || fullText.includes('master'))) ||
          (activeCategory === 'rare-skins' && (fullText.includes('แรร์') || fullText.includes('bape') || fullText.includes('shroud') || fullText.includes('ชุดแรร์') || fullText.includes('ทรงจีน') || fullText.includes('มัมมี่') || fullText.includes('urus') || fullText.includes('aston') || fullText.includes('cayenne')));

        if (!matchesDirect && !matchesTag && !matchesKeywords) return false;
      }

      // 3. Quick Tag filter (Multi-Select Support)
      if (selectedTags && selectedTags.length > 0) {
        const tagList = Array.isArray(item.tags)
          ? item.tags.map((t) => String(t).toLowerCase().replace(/[-_\s]/g, ''))
          : typeof item.tags === 'string'
          ? item.tags.toLowerCase().replace(/[-_\s]/g, '').split(',')
          : [];

        const fullText = [
          item.title,
          item.title_th,
          item.title_en,
          item.gunLevel,
          item.gunLevel_th,
          item.gunLevel_en,
          item.warranty,
          item.warranty_th,
          item.warranty_en,
          item.binding,
          item.binding_th,
          item.binding_en,
          item.details,
          item.details_th,
          item.details_en
        ].filter(Boolean).join(' ').toLowerCase();

        const matchesAllTags = selectedTags.every((tagId) => {
          const targetTag = String(tagId).toLowerCase().replace(/[-_\s]/g, '');
          const matchesDirect = tagList.includes(targetTag);

          const matchesTagHeuristics =
            (targetTag === 'progressive' && (
              item.category === 'progressive' ||
              fullText.includes('progressive') ||
              fullText.includes('lv.') ||
              fullText.includes('max') ||
              fullText.includes('ปืนอัปเกรด') ||
              fullText.includes('เติบโต')
            )) ||
            (targetTag === 'originalmail' && (
              fullText.includes('มือ 1') ||
              fullText.includes('มือ1') ||
              fullText.includes('ประกัน') ||
              fullText.includes('1st hand') ||
              fullText.includes('warranty')
            )) ||
            (targetTag === 'rankready' && (
              item.category === 'rank-ready' ||
              fullText.includes('rank') ||
              fullText.includes('แรงค์') ||
              fullText.includes('plus')
            )) ||
            (targetTag === 'bape' && (
              item.category === 'rare-skins' ||
              tagList.includes('rareskins') ||
              fullText.includes('bape') ||
              fullText.includes('shroud') ||
              fullText.includes('ทรงจีน') ||
              fullText.includes('มัมมี่')
            )) ||
            (targetTag === 'budget' && (
              (item.priceTHB && item.priceTHB <= 800) ||
              item.category === 'budget'
            ));

          return matchesDirect || matchesTagHeuristics;
        });

        if (!matchesAllTags) return false;
      }

      // 4. Comprehensive Corpus for Item Image Filter & Multi-Keyword Search
      const fullCorpus = [
        item.id,
        item.bianhao,
        item.rawBianhao,
        item.rawId,
        item.title,
        item.title_th,
        item.title_en,
        item.gunLevel,
        item.gunLevel_th,
        item.gunLevel_en,
        item.subtitle,
        item.subtitle_th,
        item.subtitle_en,
        item.details,
        item.details_th,
        item.details_en,
        item.description,
        item.rank,
        item.binding,
        item.binding_th,
        item.binding_en,
        item.warranty,
        item.warranty_th,
        item.warranty_en,
        (item.tags || []).join(' '),
        (item.skinItemIds || []).join(' '),
        Array.isArray(item.skinItems) ? item.skinItems.map((it) => `${it.id} ${it.name} ${it.thaiName || ''}`).join(' ') : ''
      ].filter(Boolean).join(' ').toLowerCase();

      // 5. Item image / skin filter ⭐ (Noctis-style filter with Smart Fuzzy Alias Matcher)
      if (selectedFilterItems.length > 0) {
        const matchEveryItem = selectedFilterItems.every((selItem) => {
          return isSkinMatchingAccount(selItem, item);
        });
        if (!matchEveryItem) return false;
      }

      // 6. Multi-term Search match (supports multiple guns/skins: "AUG M416", "AUG, Beryl", "หมูชมพู กระทิงทอง", "AWM Kar98")
      if (searchQuery.trim()) {
        const terms = searchQuery.toLowerCase().split(/[\s,+/|]+/).map((t) => t.trim()).filter(Boolean);
        if (terms.length > 0) {
          const allMatched = terms.every((term) => {
            if (fullCorpus.includes(term)) return true;
            // Smart Gun & Skin Aliases
            if ((term === 'm4' || term === 'm416') && (fullCorpus.includes('m416') || fullCorpus.includes('หมูชมพู') || fullCorpus.includes('กลาเซีย') || fullCorpus.includes('ฟักทอง') || fullCorpus.includes('glacier'))) return true;
            if (term === 'aug' && (fullCorpus.includes('aug') || fullCorpus.includes('มิโนทอร์') || fullCorpus.includes('นีออน') || fullCorpus.includes('กระทิงทอง') || fullCorpus.includes('ระเบิดศึก') || fullCorpus.includes('minotaur'))) return true;
            if ((term === 'beryl' || term === '762' || term === 'm762') && (fullCorpus.includes('beryl') || fullCorpus.includes('m762') || fullCorpus.includes('กิเลนไฟ') || fullCorpus.includes('762') || fullCorpus.includes('เมดูซ่า') || fullCorpus.includes('gear head'))) return true;
            if ((term === 'mk12' || term === 'mk') && (fullCorpus.includes('mk12') || fullCorpus.includes('เงามืด') || fullCorpus.includes('shadow lord') || fullCorpus.includes('โฮคัส'))) return true;
            if (term === 'awm' && (fullCorpus.includes('awm') || fullCorpus.includes('เมดูซ่า') || fullCorpus.includes('ฟันเฟือง') || fullCorpus.includes('gear head'))) return true;
            if ((term === '98k' || term === 'kar98') && (fullCorpus.includes('kar98') || fullCorpus.includes('98k') || fullCorpus.includes('จักรวาล'))) return true;
            if (term === 'หมู' && (fullCorpus.includes('หมูชมพู') || fullCorpus.includes('หมูทองคำ') || fullCorpus.includes('pigsy'))) return true;
            if (term === 'กระทิง' && (fullCorpus.includes('กระทิงทอง') || fullCorpus.includes('มิโนทอร์') || fullCorpus.includes('minotaur'))) return true;
            if (term === 'มัมมี่' && (fullCorpus.includes('มัมมี่ดำ') || fullCorpus.includes('มัมมี่ขาว') || fullCorpus.includes('ผ้าพันแผล') || fullCorpus.includes('mummy'))) return true;
            if ((term === 'รถ' || term === 'car') && (fullCorpus.includes('urus') || fullCorpus.includes('cayenne') || fullCorpus.includes('aston') || fullCorpus.includes('lambo') || fullCorpus.includes('lamborghini') || fullCorpus.includes('porsche') || fullCorpus.includes('รถ'))) return true;
            if (term === 'ไทย' && (fullCorpus.includes('ไทย') || item.region === 'th')) return true;
            if (term === 'จีน' && (fullCorpus.includes('จีน') || item.region === 'cn')) return true;
            if (term === 'เวียดนาม' && (fullCorpus.includes('เวียดนาม') || item.region === 'vn')) return true;
            return false;
          });

          if (!allMatched) return false;
        }
      }

      return true;
    });

    // Sorting (fast comparison)
    return result.sort((a, b) => {
      if (sortBy === 'price-asc') {
        return currency === 'THB' ? a.priceTHB - b.priceTHB : a.priceVND - b.priceVND;
      }
      if (sortBy === 'price-desc') {
        return currency === 'THB' ? b.priceTHB - a.priceTHB : b.priceVND - a.priceVND;
      }
      return a.id === b.id ? 0 : (b.id > a.id ? 1 : -1);
    });
  }, [accounts, activeCategory, activeRegion, selectedTags, searchQuery, sortBy, currency, selectedFilterItems]);

  // Storefront Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / pageSize));

  // Ensure current page doesn't exceed total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAccounts.slice(startIndex, startIndex + pageSize);
  }, [filteredAccounts, currentPage, pageSize]);

  const handlePageChange = (newPage) => {
    const target = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(target);
    if (catalogSectionRef.current) {
      catalogSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setActiveRegion('all');
    setSelectedTags([]);
    setSearchQuery('');
    setSortBy('newest');
    setSelectedItemIds([]);
  };

  // Inventory Management Handlers
  const handleAddAccount = (newAccount) => {
    setAccounts([newAccount, ...accounts]);
    dbService.saveAccount(newAccount);
  };

  const handleAddBatchAccounts = async (newAccountsList) => {
    if (!Array.isArray(newAccountsList) || newAccountsList.length === 0) return;
    setAccounts((prev) => [...newAccountsList, ...prev]);
    for (const acc of newAccountsList) {
      await dbService.saveAccount(acc);
    }
  };

  const handleUpdateAccount = (updatedAccount) => {
    setAccounts(
      accounts.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc))
    );
    dbService.saveAccount(updatedAccount);
  };

  const handleDeleteAccount = (accountId) => {
    setAccounts(accounts.filter((acc) => acc.id !== accountId));
    dbService.deleteAccount(accountId);
  };

  const handleToggleSold = (accountId) => {
    let targetAcc = null;
    let nextSoldStatus = false;
    setAccounts(
      accounts.map((acc) => {
        if (acc.id === accountId) {
          nextSoldStatus = !acc.isSold;
          targetAcc = { ...acc, isSold: nextSoldStatus };
          return targetAcc;
        }
        return acc;
      })
    );
    setSoldAccountIds((prev) => {
      if (nextSoldStatus) {
        return prev.includes(accountId) ? prev : [...prev, accountId];
      } else {
        return prev.filter((id) => id !== accountId);
      }
    });
    if (targetAcc) {
      dbService.saveAccount(targetAcc);
    }
  };

  const handleMarkSold = useCallback((accountId) => {
    let targetAcc = null;
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === accountId) {
          targetAcc = { ...acc, isSold: true };
          return targetAcc;
        }
        return acc;
      })
    );
    setSoldAccountIds((prev) => (prev.includes(accountId) ? prev : [...prev, accountId]));
    if (targetAcc) {
      dbService.saveAccount(targetAcc);
    }
  }, []);

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((ord) => (ord.orderId === orderId ? { ...ord, status: newStatus } : ord))
    );
    dbService.updateOrderStatus(orderId, newStatus);
  };

  const handleClearAllAccounts = () => {
    setAccounts([]);
  };

  const handleResetDefaultAccounts = () => {
    setAccounts(mockAccounts);
  };

  const handleBuySuccess = (accountId, newOrder) => {
    // 1. Add order to order history
    setOrders([newOrder, ...orders]);
    dbService.saveOrder(newOrder);

    // 2. Mark account as sold in inventory
    let soldAcc = null;
    setAccounts(
      accounts.map((acc) => {
        if (acc.id === accountId) {
          soldAcc = { ...acc, isSold: true };
          return soldAcc;
        }
        return acc;
      })
    );
    setSoldAccountIds((prev) => (prev.includes(accountId) ? prev : [...prev, accountId]));
    if (soldAcc) {
      dbService.saveAccount(soldAcc);
    }
  };

  const handleClearOrders = () => {
    setOrders([]);
  };

  const handleResetOrders = () => {
    setOrders(mockOrders);
  };

  // Restore Backup handler
  const handleRestoreBackup = (backupData) => {
    if (backupData.accounts && Array.isArray(backupData.accounts)) {
      setAccounts((prev) => {
        const chinaAccounts = prev.filter((a) => a.region === 'cn');
        const map = new Map();
        // 1. Add custom / Thai / VN / backup accounts
        backupData.accounts.forEach((a) => map.set(a.id, a));
        // 2. Preserve all existing China accounts if not in backup
        chinaAccounts.forEach((a) => {
          if (!map.has(a.id)) {
            map.set(a.id, a);
          }
        });
        return Array.from(map.values());
      });
    }
    if (backupData.orders && Array.isArray(backupData.orders)) {
      setOrders(backupData.orders);
    }
    if (backupData.settings) {
      handleUpdateStoreSettings(backupData.settings);
    }
  };

  // Admin Authentication Actions
  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setViewMode('admin');
    } else {
      setShowAdminLoginModal(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('sima_admin_auth', 'true');
    setShowAdminLoginModal(false);
    setViewMode('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('sima_admin_auth');
    setViewMode('store');
  };

  // IF ADMIN VIEW MODE (Double-check auth)
  if (viewMode === 'admin') {
    if (!isAdminLoggedIn) {
      setViewMode('store');
      setShowAdminLoginModal(true);
      return null;
    }

    return (
      <AdminDashboard
        accounts={accounts}
        onAddAccount={handleAddAccount}
        onAddBatchAccounts={handleAddBatchAccounts}
        onUpdateAccount={handleUpdateAccount}
        onDeleteAccount={handleDeleteAccount}
        onToggleSold={handleToggleSold}
        onClearAllAccounts={handleClearAllAccounts}
        onResetDefaultAccounts={handleResetDefaultAccounts}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onClearOrders={handleClearOrders}
        onResetOrders={handleResetOrders}
        currency={currency}
        lang={lang}
        onSwitchToStore={() => setViewMode('store')}
        onLogout={handleAdminLogout}
        onOpenWarranty={handleOpenWarranty}
        storeSettings={storeSettings}
        onUpdateStoreSettings={handleUpdateStoreSettings}
        onRestoreBackup={handleRestoreBackup}
      />
    );
  }

  // IF WARRANTY VIEW MODE (A4 Document Generator)
  if (viewMode === 'warranty') {
    return (
      <WarrantyForm
        initialAccount={warrantyAccount}
        initialDocType={warrantyDocType}
        storeSettings={storeSettings}
        onBack={() => {
          setWarrantyAccount(null);
          setViewMode(isAdminLoggedIn ? 'admin' : 'store');
        }}
      />
    );
  }

  // STOREFRONT VIEW MODE
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100 font-sans">
      {/* Navbar with Contact Admin buttons, Language/Currency Switchers, and Admin Login */}
      <Navbar 
        currency={currency} 
        setCurrency={handleSetCurrency}
        lang={lang}
        setLang={handleSetLang}
        t={t}
        onSearchFocus={handleSearchFocus}
        onOpenAdmin={handleOpenAdmin}
        onOpenRules={handleOpenRules}
        onOpenWarranty={handleOpenWarranty}
        storeSettings={storeSettings}
      />

      {/* Hero Presentation & Daily Highlight */}
      <HeroBanner 
        currency={currency}
        lang={lang}
        t={t}
        onOpenAccount={(acc) => setSelectedAccount(acc)} 
        hotAccount={hotAccount} 
        deliveredCount={realDeliveredCount}
        storeSettings={storeSettings}
        onOpenRules={handleOpenRules}
      />

      {/* Interactive Filter Toolbar with Region & Category Filter */}
      <FilterToolbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        activeRegion={activeRegion}
        setActiveRegion={setActiveRegion}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchInputRef={searchInputRef}
        counts={categoryCounts}
        t={t}
        lang={lang}
        onRefreshStock={() => refreshChinaStock(false, true)}
        isStockRefreshing={isStockRefreshing}
        lastStockUpdated={lastStockUpdated}
        totalAccountsCount={accounts.filter((a) => !a.isSold && (activeRegion === 'all' || a.region === activeRegion)).length}
        onOpenItemFilter={() => setIsItemFilterOpen(true)}
        selectedItemIds={selectedItemIds}
        onRemoveSelectedItem={(id) => setSelectedItemIds((prev) => prev.filter((i) => i !== id))}
        onClearItemFilter={() => setSelectedItemIds([])}
      />

      {/* Main Account Catalog */}
      <main ref={catalogSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{t.catalogTitle}</span>
              <span className="text-xs bg-slate-800 text-amber-400 px-2.5 py-0.5 rounded-full border border-slate-700 font-mono">
                {filteredAccounts.length.toLocaleString()} {t.accountsCount}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t.catalogSubtitle}
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredAccounts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedAccounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  currency={currency}
                  lang={lang}
                  t={t}
                  onSelect={(acc) => setSelectedAccount(acc)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredAccounts.length}
              pageSize={pageSize}
              pageSizeOptions={[24, 48, 96]}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              lang={lang}
              t={t}
            />
          </>
        ) : (
          /* Empty Search State */
          <div className="py-16 text-center bg-slate-900/30 rounded-3xl border border-slate-800/80">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{t.emptyTitle}</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-sm mx-auto">
              {t.emptySubtitle}
            </p>
            <button 
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-amber-400 hover:bg-slate-700 text-xs font-bold border border-slate-700 transition-colors shadow-md"
            >
              {t.emptyResetBtn}
            </button>
          </div>
        )}
      </main>

      {/* Country Rules & Regulations Section (China, Thailand, Vietnam in TH & EN) */}
      <CountryRulesSection lang={lang} t={t} onOpenWarranty={handleOpenWarranty} />

      {/* Special Partner Services: Code Item & G-Coin Top-up (All New Code PUBG) ⭐ */}
      <GcoinCodeServicesSection lang={lang} t={t} />

      {/* PUBG Community & TeamSpeak 3 Find Squad Section (id="community") ⭐ */}
      <CommunitySection lang={lang} t={t} />

      {/* Verified Customer Reviews & Facebook Testimonials (id="reviews") ⭐ */}
      <CustomerReviewsSection lang={lang} t={t} storeSettings={storeSettings} />

      {/* Trust & Guarantee Section */}
      <FeaturesSection t={t} />

      {/* Footer */}
      <Footer 
        t={t} 
        storeSettings={storeSettings} 
        onOpenRules={handleOpenRules} 
        onOpenWarranty={handleOpenWarranty} 
        lang={lang} 
      />

      {/* Quick View Account Modal (Contact Admin to Purchase via Facebook/Discord) */}
      <AccountModal
        isOpen={!!selectedAccount}
        account={selectedAccount}
        currency={currency}
        lang={lang}
        t={t}
        onClose={() => setSelectedAccount(null)}
        onBuySuccess={handleBuySuccess}
        onOpenRules={handleOpenRules}
        onOpenWarranty={handleOpenWarranty}
        onMarkSold={handleMarkSold}
        storeSettings={storeSettings}
      />

      {/* Country Trading Rules Modal ⭐ (China, Thailand, Vietnam in TH & EN) */}
      <CountryRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        initialCountry={rulesCountry}
        lang={lang}
        onOpenWarranty={handleOpenWarranty}
      />

      {/* Item Image Filter Modal ⭐ (Noctis-style filter) */}
      <ItemFilterModal
        isOpen={isItemFilterOpen}
        onClose={() => setIsItemFilterOpen(false)}
        selectedItemIds={selectedItemIds}
        onApplyFilter={(ids) => {
          setSelectedItemIds(ids);
          setCurrentPage(1);
        }}
        accounts={accounts}
        lang={lang}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}

export default App;

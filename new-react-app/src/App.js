import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import FilterToolbar from './components/FilterToolbar';
import AccountCard from './components/AccountCard';
import AccountModal from './components/AccountModal';
import ItemFilterModal from './components/ItemFilterModal';
import filterCategoriesData from './data/filterCategories.json';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import Pagination from './components/Pagination';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLoginModal from './components/admin/AdminLoginModal';
import { mockAccounts } from './data/mockAccounts';
import { mockOrders } from './data/mockOrders';
import { translations } from './data/translations';
import { getStoredSettings, saveStoredSettings } from './data/defaultSettings';
import { dbService } from './services/dbService';

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
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Item Image Filter States ⭐ (Noctis-style filter)
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [isItemFilterOpen, setIsItemFilterOpen] = useState(false);

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

  // Unified China Stock Sync & Auto-Refresh Function (combines cache-busted static JSON + live API)
  const refreshChinaStock = useCallback(async (isSilent = true) => {
    if (!isSilent) setIsStockRefreshing(true);
    try {
      // 1. Fetch latest static stock from china_stock.json with cache-busting timestamp
      const staticPromise = fetch(`/data/china_stock.json?_t=${Date.now()}`)
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);

      // 2. Query Vercel live serverless proxy if available
      const livePromise = fetch(`/api/china-live-arrivals?pages=2&cnyRateThb=${storeSettings.chinaCnyRateThb || 5.2}&tier1=${storeSettings.chinaMarkupTier1Percent ?? 10}&tier2=${storeSettings.chinaMarkupTier2Percent ?? 13}`)
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);

      const [staticStock, liveResult] = await Promise.all([staticPromise, livePromise]);

      const baseList = Array.isArray(staticStock) && staticStock.length > 0 ? staticStock : [];
      const liveItems = Array.isArray(liveResult?.items) ? liveResult.items : [];

      if (baseList.length > 0 || liveItems.length > 0) {
        setAccounts((prev) => {
          const map = new Map();

          // 1. Preserve local / Thai / VN custom accounts
          prev.forEach((a) => {
            if (a.region !== 'cn' || a.isCustomLocal) {
              map.set(a.id, a);
            }
          });

          // 2. Prepend live arrivals if available
          liveItems.forEach((acc) => {
            map.set(acc.id, calculateCnPricing(acc));
          });

          // 3. Add base stock accounts (10,589+ items)
          baseList.forEach((acc) => {
            if (!map.has(acc.id)) {
              map.set(acc.id, calculateCnPricing(acc));
            }
          });

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

  // Auto-refresh lifecycle: Initial fetch + Interval (every 60s) + Window Focus Resume
  useEffect(() => {
    // 1. Initial Load
    refreshChinaStock(true);

    // 2. Continuous Background Interval (every 60 seconds)
    const timer = setInterval(() => {
      refreshChinaStock(true);
    }, 60 * 1000);

    // 3. Auto-refresh when customer switches back to this browser tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshChinaStock(true);
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
        if (Array.isArray(parsed) && parsed.some((a) => a.id === 'PC-1006' || a.id === 'PC-1005')) {
          localStorage.setItem('sima_accounts', JSON.stringify(mockAccounts));
          return mockAccounts;
        }
        return parsed;
      }
      return mockAccounts;
    } catch (e) {
      return mockAccounts;
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
      const localOnly = accounts.filter((a) => a.region !== 'cn' || a.isCustomLocal);
      localStorage.setItem('sima_accounts', JSON.stringify(localOnly));
    } catch (e) {}
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
  }, [activeCategory, activeRegion, selectedTag, searchQuery, sortBy]);

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
    return accounts.find((item) => item.isHot && !item.isSold) || accounts[0];
  }, [accounts]);

  // Calculate real delivered count (completed orders + base count)
  const realDeliveredCount = useMemo(() => {
    const completedOrders = orders.filter((o) => o.status === 'completed' || !o.status).length;
    const base = Number(storeSettings.baseDeliveredCount || 0);
    return base + completedOrders;
  }, [orders, storeSettings.baseDeliveredCount]);

  // Category item counts (optimized single pass over accounts)
  const categoryCounts = useMemo(() => {
    let all = 0;
    let progressive = 0;
    let rankReady = 0;
    let rareSkins = 0;
    for (let i = 0; i < accounts.length; i++) {
      const a = accounts[i];
      if (a.isSold) continue;
      all++;
      if (a.category === 'progressive') progressive++;
      else if (a.category === 'rank-ready') rankReady++;
      else if (a.category === 'rare-skins') rareSkins++;
    }
    return { all, progressive, rankReady, rareSkins };
  }, [accounts]);

  // Filtered & Sorted accounts for Storefront
  const filteredAccounts = useMemo(() => {
    let result = accounts.filter((item) => {
      // Hide sold accounts in storefront
      if (item.isSold) return false;

      // Category match
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;

      // Country / Region match (all | th | cn | vn)
      if (activeRegion !== 'all' && item.region !== activeRegion) return false;

      // Tag filter
      if (selectedTag && (!item.tags || !item.tags.includes(selectedTag))) return false;

      // Item image / skin filter ⭐ (Noctis-style filter)
      if (selectedFilterItems.length > 0) {
        const itemCorpus = [
          item.id,
          item.bianhao,
          item.rawBianhao,
          item.rawId,
          item.title_th,
          item.title_en,
          item.gunLevel_th,
          item.gunLevel_en,
          item.subtitle_th,
          item.subtitle_en,
          item.details_th,
          item.rank,
          (item.tags || []).join(' ')
        ].filter(Boolean).join(' ').toLowerCase();

        const matchEveryItem = selectedFilterItems.every((selItem) => {
          return (selItem.keywords || []).some((kw) => itemCorpus.includes(kw.toLowerCase()));
        });
        if (!matchEveryItem) return false;
      }

      // Multi-term Search match (supports multiple guns/skins: "AUG M416", "AUG, Beryl", "หมูชมพู กระทิงทอง", "AWM Kar98")
      if (searchQuery.trim()) {
        const terms = searchQuery.toLowerCase().split(/[\s,+/|]+/).map((t) => t.trim()).filter(Boolean);
        if (terms.length > 0) {
          const corpus = [
            item.id,
            item.bianhao,
            item.rawBianhao,
            item.rawId,
            item.title_th,
            item.title_en,
            item.gunLevel_th,
            item.gunLevel_en,
            item.subtitle_th,
            item.subtitle_en,
            item.details_th,
            item.rank,
            (item.tags || []).join(' ')
          ].filter(Boolean).join(' ').toLowerCase();

          const allMatched = terms.every((term) => {
            if (corpus.includes(term)) return true;
            // Smart Gun & Skin Aliases
            if ((term === 'm4' || term === 'm416') && (corpus.includes('m416') || corpus.includes('หมูชมพู') || corpus.includes('กลาเซีย') || corpus.includes('ฟักทอง'))) return true;
            if (term === 'aug' && (corpus.includes('aug') || corpus.includes('มิโนทอร์') || corpus.includes('นีออน') || corpus.includes('กระทิงทอง') || corpus.includes('ระเบิดศึก'))) return true;
            if ((term === 'beryl' || term === '762' || term === 'm762') && (corpus.includes('beryl') || corpus.includes('m762') || corpus.includes('กิเลนไฟ') || corpus.includes('762'))) return true;
            if ((term === 'mk12' || term === 'mk') && (corpus.includes('mk12') || corpus.includes('เงามืด') || corpus.includes('shadow lord'))) return true;
            if (term === 'awm' && (corpus.includes('awm') || corpus.includes('เมดูซ่า') || corpus.includes('ฟันเฟือง') || corpus.includes('gear head'))) return true;
            if ((term === '98k' || term === 'kar98') && (corpus.includes('kar98') || corpus.includes('98k') || corpus.includes('จักรวาล'))) return true;
            if (term === 'หมู' && (corpus.includes('หมูชมพู') || corpus.includes('หมูทองคำ') || corpus.includes('pigsy'))) return true;
            if (term === 'กระทิง' && (corpus.includes('กระทิงทอง') || corpus.includes('มิโนทอร์'))) return true;
            if (term === 'มัมมี่' && (corpus.includes('มัมมี่ดำ') || corpus.includes('มัมมี่ขาว') || corpus.includes('ผ้าพันแผล'))) return true;
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
  }, [accounts, activeCategory, activeRegion, selectedTag, searchQuery, sortBy, currency, selectedFilterItems]);

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
    setSelectedTag('');
    setSearchQuery('');
    setSortBy('newest');
    setSelectedItemIds([]);
  };

  // Inventory Management Handlers
  const handleAddAccount = (newAccount) => {
    setAccounts([newAccount, ...accounts]);
    dbService.saveAccount(newAccount);
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
        storeSettings={storeSettings}
        onUpdateStoreSettings={handleUpdateStoreSettings}
        onRestoreBackup={handleRestoreBackup}
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
      />

      {/* Interactive Filter Toolbar with Region & Category Filter */}
      <FilterToolbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        activeRegion={activeRegion}
        setActiveRegion={setActiveRegion}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchInputRef={searchInputRef}
        counts={categoryCounts}
        t={t}
        lang={lang}
        onRefreshStock={() => refreshChinaStock(false)}
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

      {/* Trust & Guarantee Section */}
      <FeaturesSection t={t} />

      {/* Footer */}
      <Footer t={t} storeSettings={storeSettings} />

      {/* Quick View Account Modal (Contact Admin to Purchase via Facebook/Discord) */}
      <AccountModal
        isOpen={!!selectedAccount}
        account={selectedAccount}
        currency={currency}
        lang={lang}
        t={t}
        onClose={() => setSelectedAccount(null)}
        onBuySuccess={handleBuySuccess}
        storeSettings={storeSettings}
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

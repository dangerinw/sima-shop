import React, { useState, useMemo, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import FilterToolbar from './components/FilterToolbar';
import AccountCard from './components/AccountCard';
import AccountModal from './components/AccountModal';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLoginModal from './components/admin/AdminLoginModal';
import UserAuthModal from './components/user/UserAuthModal';
import UserPurchasesModal from './components/user/UserPurchasesModal';
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

  // Sync state with Cloud DB / Storage when enabled
  useEffect(() => {
    dbService.updateSettings(storeSettings);
    if (storeSettings.useCloudDb) {
      dbService.getAccounts().then((cloudAccounts) => {
        if (Array.isArray(cloudAccounts) && cloudAccounts.length > 0) {
          setAccounts(cloudAccounts);
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

  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('sima_admin_auth') === 'true';
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  // Customer / User Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sima_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [showUserAuthModal, setShowUserAuthModal] = useState(false);
  const [showUserPurchasesModal, setShowUserPurchasesModal] = useState(false);

  // Automatically persist customer login to LocalStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('sima_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('sima_current_user');
      }
    } catch (e) {}
  }, [currentUser]);

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
  useEffect(() => {
    try {
      localStorage.setItem('sima_accounts', JSON.stringify(accounts));
    } catch (e) {}
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem('sima_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  const searchInputRef = useRef(null);

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

  // Category item counts (counts available accounts)
  const categoryCounts = useMemo(() => {
    const available = accounts.filter((a) => !a.isSold);
    return {
      all: available.length,
      progressive: available.filter((a) => a.category === 'progressive').length,
      rankReady: available.filter((a) => a.category === 'rank-ready').length,
      rareSkins: available.filter((a) => a.category === 'rare-skins').length,
    };
  }, [accounts]);

  // Count purchased accounts for the logged-in customer
  const userPurchasedCount = useMemo(() => {
    if (!currentUser) return 0;
    return orders.filter((order) => {
      if (order.userId && order.userId === currentUser.id) return true;
      if (order.customerName && currentUser.name && order.customerName.toLowerCase() === currentUser.name.toLowerCase()) return true;
      if (order.customerName && currentUser.username && order.customerName.toLowerCase() === currentUser.username.toLowerCase()) return true;
      return false;
    }).length;
  }, [currentUser, orders]);

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

      // Search match (title, subtitle, gun level, or id)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = (item.title_th + ' ' + item.title_en).toLowerCase().includes(query);
        const subMatch = (item.subtitle_th + ' ' + item.subtitle_en).toLowerCase().includes(query);
        const gunMatch = (item.gunLevel_th + ' ' + item.gunLevel_en).toLowerCase().includes(query);
        const idMatch = item.id.toLowerCase().includes(query);
        return titleMatch || subMatch || gunMatch || idMatch;
      }

      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'price-asc') {
        return currency === 'THB' ? a.priceTHB - b.priceTHB : a.priceVND - b.priceVND;
      }
      if (sortBy === 'price-desc') {
        return currency === 'THB' ? b.priceTHB - a.priceTHB : b.priceVND - a.priceVND;
      }
      return b.id.localeCompare(a.id);
    });
  }, [accounts, activeCategory, activeRegion, selectedTag, searchQuery, sortBy, currency]);

  const handleResetFilters = () => {
    setActiveCategory('all');
    setActiveRegion('all');
    setSelectedTag('');
    setSearchQuery('');
    setSortBy('newest');
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
    setAccounts(
      accounts.map((acc) => {
        if (acc.id === accountId) {
          targetAcc = { ...acc, isSold: !acc.isSold };
          return targetAcc;
        }
        return acc;
      })
    );
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
      setAccounts(backupData.accounts);
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

  // Customer Authentication Actions
  const handleUserLoginSuccess = (userData) => {
    setCurrentUser(userData);
  };

  const handleUserLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      setCurrentUser(null);
    }
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
      {/* Navbar with Customer Auth & Admin button & Language/Currency Switchers */}
      <Navbar 
        currency={currency} 
        setCurrency={handleSetCurrency}
        lang={lang}
        setLang={handleSetLang}
        t={t}
        onSearchFocus={handleSearchFocus}
        onOpenAdmin={handleOpenAdmin}
        currentUser={currentUser}
        onOpenUserAuth={() => setShowUserAuthModal(true)}
        onOpenUserPurchases={() => setShowUserPurchasesModal(true)}
        onUserLogout={handleUserLogout}
        userPurchasedCount={userPurchasedCount}
      />

      {/* Hero Presentation & Daily Highlight */}
      <HeroBanner 
        currency={currency}
        lang={lang}
        t={t}
        onOpenAccount={(acc) => setSelectedAccount(acc)} 
        hotAccount={hotAccount} 
        deliveredCount={realDeliveredCount}
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
      />

      {/* Main Account Catalog */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{t.catalogTitle}</span>
              <span className="text-xs bg-slate-800 text-amber-400 px-2.5 py-0.5 rounded-full border border-slate-700 font-mono">
                {filteredAccounts.length} {t.accountsCount}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t.catalogSubtitle}
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredAccounts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map((account) => (
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
      <Footer t={t} />

      {/* Quick View Account Modal (with Dynamic QR & Slip Verification) */}
      <AccountModal
        account={selectedAccount}
        currency={currency}
        lang={lang}
        t={t}
        onClose={() => setSelectedAccount(null)}
        onBuySuccess={handleBuySuccess}
        currentUser={currentUser}
        onOpenUserAuth={() => setShowUserAuthModal(true)}
        onOpenUserPurchases={() => setShowUserPurchasesModal(true)}
        storeSettings={storeSettings}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Customer Auth (Login / Register) Modal */}
      <UserAuthModal
        isOpen={showUserAuthModal}
        onClose={() => setShowUserAuthModal(false)}
        onLoginSuccess={handleUserLoginSuccess}
        lang={lang}
      />

      {/* Customer Purchases & Steam Credentials Vault Modal */}
      <UserPurchasesModal
        isOpen={showUserPurchasesModal}
        onClose={() => setShowUserPurchasesModal(false)}
        currentUser={currentUser}
        orders={orders}
        currency={currency}
        lang={lang}
        onBrowseStore={() => {
          handleSearchFocus();
        }}
      />
    </div>
  );
}

export default App;

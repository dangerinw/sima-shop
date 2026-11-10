import React, { useState, useEffect } from 'react';
import { chinaSyncService } from '../../services/chinaSync/chinaSyncService';
import AddAccountModal from './AddAccountModal';
import Pagination from '../Pagination';
import { dbService } from '../../services/dbService';
import { defaultStoreSettings } from '../../data/defaultSettings';

export default function AdminDashboard({
  accounts,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
  onToggleSold,
  onClearAllAccounts,
  onResetDefaultAccounts,
  orders,
  onUpdateOrderStatus,
  onClearOrders,
  onResetOrders,
  currency,
  lang,
  onSwitchToStore,
  onLogout,
  storeSettings = defaultStoreSettings,
  onUpdateStoreSettings,
  onRestoreBackup
}) {
  const [activeTab, setActiveTab] = useState('inventory'); // inventory | orders | settings
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all'); // all | th | cn | vn
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [inspectOrder, setInspectOrder] = useState(null);

  // Settings State (Sync with parent)
  const [settingsForm, setSettingsForm] = useState(storeSettings);
  const [testingCloud, setTestingCloud] = useState(false);
  const [cloudTestResult, setCloudTestResult] = useState(null);
  const [showAnonKey, setShowAnonKey] = useState(false);

  // China Real-time Sync State
  const [syncingChina, setSyncingChina] = useState(false);
  const [chinaSyncLogs, setChinaSyncLogs] = useState([]);
  const [autoSyncInPage, setAutoSyncInPage] = useState(false);

  // Trigger Instant Sync
  const handleTriggerChinaSync = async () => {
    const isDirectStorage = (settingsForm.chinaStorageMode || 'direct_json') === 'direct_json';
    const isFirebase = (settingsForm.cloudDbProvider || 'firebase') === 'firebase';
    const hasFirebase = !!(settingsForm.firebaseProjectId || settingsForm.firebaseConfigSnippet);
    const hasSupabase = !!(settingsForm.supabaseUrl && settingsForm.supabaseAnonKey);

    if (!isDirectStorage) {
      if (isFirebase && !hasFirebase) {
        alert('กรุณากรอกการตั้งค่า Google Firebase ในแท็บ "ตั้งค่าระบบ" ให้เรียบร้อยก่อนเริ่มซิงค์ครับ');
        return;
      }
      if (!isFirebase && !hasSupabase) {
        alert('กรุณากรอก Supabase URL และ Anon Key ในแท็บ "ตั้งค่าระบบ" ให้เรียบร้อยก่อนเริ่มซิงค์ครับ');
        return;
      }
    }

    const targetPages = settingsForm.chinaSyncPages === 'all' ? 100 : (parseInt(settingsForm.chinaSyncPages, 10) || 50);
    const pageLabel = settingsForm.chinaSyncPages === 'all' ? 'ทั้งหมด (All Stock)' : `${targetPages} หน้า`;

    setSyncingChina(true);
    setChinaSyncLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] 🚀 เริ่มต้นดึงสต็อกจีน ${pageLabel} [โหมด: ${isDirectStorage ? 'หน้าร้านโดยตรง (Direct JSON ไม่เปลือง Firebase)' : (isFirebase ? 'Firebase Firestore 🔥' : 'Supabase ⚡')}]...`,
      ...prev
    ]);

    const result = await chinaSyncService.runSync({
      pages: targetPages,
      storageMode: settingsForm.chinaStorageMode || 'direct_json',
      markupMode: settingsForm.chinaMarkupMode || 'tiered',
      markupThreshold: Number(settingsForm.chinaMarkupThreshold || 100000),
      markupTier1Percent: Number(settingsForm.chinaMarkupTier1Percent ?? 10),
      markupTier2Percent: Number(settingsForm.chinaMarkupTier2Percent ?? 13),
      markupPercent: Number(settingsForm.chinaMarkupPercent || 10),
      cnyRateThb: Number(settingsForm.chinaCnyRateThb || 5.2),
      cnyRateVnd: Number(settingsForm.chinaCnyRateVnd || 3700),
      provider: settingsForm.cloudDbProvider || 'firebase',
      supabaseUrl: settingsForm.supabaseUrl,
      supabaseAnonKey: settingsForm.supabaseAnonKey,
      fetchScreenshots: true
    }, (progress) => {
      if (progress.message) {
        setChinaSyncLogs((prev) => [progress.message, ...prev.slice(0, 40)]);
      }
    });

    setSyncingChina(false);
    if (result.success) {
      const now = new Date().toISOString();
      const updated = {
        ...settingsForm,
        chinaLastSyncTime: now,
        chinaLastSyncCount: result.totalSynced
      };
      setSettingsForm(updated);
      if (onUpdateStoreSettings) {
        onUpdateStoreSettings(updated);
      }
      setChinaSyncLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] ${result.message}`,
        ...prev
      ]);
      if (result.syncedAccounts && result.syncedAccounts.length > 0) {
        const existingMap = new Map(accounts.map((a) => [a.id, a]));
        result.syncedAccounts.forEach((acc) => existingMap.set(acc.id, acc));
        const merged = Array.from(existingMap.values());
        if (onRestoreBackup) {
          onRestoreBackup({ accounts: merged });
        }
      }
    } else {
      setChinaSyncLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] ❌ ${result.message}`,
        ...prev
      ]);
      alert(result.message);
    }
  };

  const handleDownloadChinaJson = () => {
    const chinaAccounts = accounts.filter((a) => a.region === 'cn');
    if (chinaAccounts.length === 0) {
      alert('ยังไม่มีไอดีจีนในระบบให้ส่งออกครับ');
      return;
    }
    const blob = new Blob([JSON.stringify(chinaAccounts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'china_stock.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearOnlyChinaAccounts = () => {
    const chinaCount = accounts.filter((a) => a.region === 'cn').length;
    if (chinaCount === 0) {
      alert('ไม่มีไอดีจีนในระบบให้ลบครับ');
      return;
    }
    if (window.confirm(`คุณต้องการลบไอดีจีนทั้งหมด ${chinaCount} ไอดี ออกจากแคชหน้าร้านใช่หรือไม่? (ไอดีหลักจะไม่ถูกลบ)`)) {
      const nonChina = accounts.filter((a) => a.region !== 'cn');
      if (onRestoreBackup) {
        onRestoreBackup({ accounts: nonChina });
      }
      setChinaSyncLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] 🗑️ ลบไอดีจีน ${chinaCount} รายการออกจากหน้าร้านเรียบร้อย`,
        ...prev
      ]);
    }
  };

  // Auto-sync interval loop in Admin page
  useEffect(() => {
    let interval = null;
    if (autoSyncInPage) {
      const mins = Number(settingsForm.chinaSyncIntervalMinutes || 15);
      interval = setInterval(() => {
        handleTriggerChinaSync();
      }, mins * 60 * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSyncInPage, settingsForm.chinaSyncIntervalMinutes]);

  const formatPrice = (vnd, thb) => {
    if (currency === 'THB') {
      return `฿${Number(thb).toLocaleString()}`;
    }
    return `${Number(vnd).toLocaleString()} ₫`;
  };

  // Calculations for Admin Stats
  const totalAccounts = accounts.length;
  const soldCount = accounts.filter((a) => a.isSold).length;
  const availableCount = totalAccounts - soldCount;
  
  const totalRevenueVND = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + (o.amountVND || 0), 0);
  const totalRevenueTHB = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + (o.amountTHB || 0), 0);

  // Region Badge Helper
  const getRegionBadge = (region) => {
    switch (region) {
      case 'th':
        return { flag: '🇹🇭', label: 'ไอดีไทย', color: 'bg-blue-950/70 text-blue-300 border-blue-700/60' };
      case 'cn':
        return { flag: '🇨🇳', label: 'ไอดีจีน', color: 'bg-rose-950/70 text-rose-300 border-rose-700/60' };
      case 'vn':
        return { flag: '🇻🇳', label: 'ไอดีเวียดนาม', color: 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60' };
      default:
        return { flag: '🌐', label: 'Global', color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  // Filter inventory
  const filteredInventory = accounts.filter((item) => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (regionFilter !== 'all' && item.region !== regionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (item.title_th + ' ' + item.title_en).toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      const matchGun = (item.gunLevel_th + ' ' + item.gunLevel_en).toLowerCase().includes(q);
      return matchTitle || matchId || matchGun;
    }
    return true;
  });

  // Inventory Table Pagination
  const [invPage, setInvPage] = useState(1);
  const [invPageSize, setInvPageSize] = useState(50);

  useEffect(() => {
    setInvPage(1);
  }, [categoryFilter, regionFilter, searchQuery]);

  const invTotalPages = Math.max(1, Math.ceil(filteredInventory.length / invPageSize));

  useEffect(() => {
    if (invPage > invTotalPages) {
      setInvPage(invTotalPages);
    }
  }, [invTotalPages, invPage]);

  const paginatedInventory = filteredInventory.slice(
    (invPage - 1) * invPageSize,
    (invPage - 1) * invPageSize + invPageSize
  );

  const handleOpenAdd = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc) => {
    setEditingAccount(acc);
    setIsModalOpen(true);
  };

  const handleSaveAccount = (accountData) => {
    if (editingAccount) {
      onUpdateAccount(accountData);
    } else {
      onAddAccount(accountData);
    }
    setIsModalOpen(false);
  };

  // Handle Save Settings
  const handleSaveSettings = () => {
    if (onUpdateStoreSettings) {
      onUpdateStoreSettings(settingsForm);
    }
    alert('บันทึกการตั้งค่าร้านค้าเรียบร้อยแล้ว!');
  };

  // Handle Cloud Test
  const handleTestCloudConnection = async () => {
    setTestingCloud(true);
    setCloudTestResult(null);
    const result = await dbService.testConnection(settingsForm);
    if (result.correctedUrl) {
      setSettingsForm((prev) => ({ ...prev, supabaseUrl: result.correctedUrl }));
    }
    setTestingCloud(false);
    setCloudTestResult(result);
  };

  // Handle JSON Backup Export
  const handleExportBackup = () => {
    dbService.exportBackup(accounts, orders, [], settingsForm);
  };

  // Handle JSON Backup Import
  const handleImportBackupFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await dbService.importBackup(file);
      if (onRestoreBackup) {
        onRestoreBackup(data);
      }
      alert('นำเข้าข้อมูลสำเร็จเรียบร้อยแล้ว!');
    } catch (err) {
      alert('ไม่สามารถนำเข้าข้อมูลได้: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b11] text-slate-100 flex flex-col font-sans">
      
      {/* Admin Top Header */}
      <header className="bg-[#0b0f17] border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-xl shadow pubg-glow">
              PS
            </div>
            <div>
              <div className="text-lg font-black tracking-wider text-white flex items-center gap-2">
                PUBG SIAM <span className="text-amber-400">ADMIN</span>
                <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-mono font-bold">
                  CONTROL PANEL
                </span>
              </div>
              <p className="text-xs text-slate-400">ระบบจัดการคลังไอดี PUBG PC & ตรวจสอบออเดอร์</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onSwitchToStore}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors flex items-center gap-1.5 shadow"
            >
              <span>🛒</span>
              <span>ดูหน้าร้าน (Storefront)</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3.5 py-2 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-300 font-bold text-xs border border-red-800/40 transition-colors flex items-center gap-1.5"
                title="ออกจากระบบแอดมิน"
              >
                <span>🚪</span>
                <span>ออกจากระบบ</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111723] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow relative overflow-hidden">
            <div className="text-slate-400 text-xs font-semibold">ยอดขายที่สำเร็จแล้ว</div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
              {formatPrice(totalRevenueVND, totalRevenueTHB)}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">
              ✓ {orders.filter((o) => o.status === 'completed').length} ออเดอร์
            </div>
          </div>

          <div className="bg-[#111723] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow">
            <div className="text-slate-400 text-xs font-semibold">ไอดีคงเหลือในสต็อก</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {availableCount} <span className="text-xs text-slate-400 font-normal">/ {totalAccounts} ไอดี</span>
            </div>
            <div className="text-[11px] text-amber-400 mt-1">
              ไทย ({accounts.filter((a) => !a.isSold && a.region === 'th').length}) | 
              จีน ({accounts.filter((a) => !a.isSold && a.region === 'cn').length}) | 
              เวียดนาม ({accounts.filter((a) => !a.isSold && a.region === 'vn').length})
            </div>
          </div>

          <div className="bg-[#111723] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow">
            <div className="text-slate-400 text-xs font-semibold">ไอดีที่ขายออกแล้ว</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              {soldCount} <span className="text-xs text-slate-400 font-normal">ไอดี</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">ส่งมอบรหัสแล้ว 100%</div>
          </div>

          <div className="bg-[#111723] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow">
            <div className="text-slate-400 text-xs font-semibold">ออเดอร์ทั้งหมดในระบบ</div>
            <div className="text-xl sm:text-2xl font-black text-blue-400 mt-1">
              {orders.length} <span className="text-xs text-slate-400 font-normal">รายการ</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">ตรวจสลิป & ส่งมอบอัตโนมัติ</div>
          </div>
        </div>

        {/* ADMIN NAV TABS */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-3">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs sm:text-sm font-bold gap-1">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'inventory' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📦</span>
              <span>คลังไอดีทั้งหมด ({accounts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'orders' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🧾</span>
              <span>รายการคำสั่งซื้อ ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'settings' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>⚙️</span>
              <span>ตั้งค่าระบบ & ธนาคาร & Cloud DB</span>
            </button>
            <button
              onClick={() => setActiveTab('china-sync')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'china-sync' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇨🇳</span>
              <span>ซิงค์สต็อกจีน Real-time</span>
            </button>
          </div>

          {activeTab === 'inventory' && (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs sm:text-sm transition-all shadow pubg-glow flex items-center gap-1.5"
            >
              <span>➕</span>
              <span>ลงขายไอดีใหม่ (Auto-Fill)</span>
            </button>
          )}
        </div>

        {/* TAB 1: INVENTORY TABLE */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            
            {/* Filter toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111723] p-3 rounded-2xl border border-slate-800 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="ค้นหา: ID, ชื่อปืน, หัวข้อไอดี..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 outline-none w-56 focus:border-amber-500"
                />

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-slate-300 outline-none"
                >
                  <option value="all">ทุกหมวดหมู่</option>
                  <option value="progressive">ปืน Progressive</option>
                  <option value="rank-ready">พร้อมลงแรงค์</option>
                  <option value="rare-skins">สกินแรร์ / BAPE</option>
                  <option value="budget">ไอดีงบประหยัด</option>
                </select>

                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="bg-slate-950 border border-amber-500/40 rounded-xl px-2.5 py-1.5 text-amber-300 font-bold outline-none"
                >
                  <option value="all">🌐 ทุกประเทศ</option>
                  <option value="th">🇹🇭 ไอดีไทย</option>
                  <option value="cn">🇨🇳 ไอดีจีน</option>
                  <option value="vn">🇻🇳 ไอดีเวียดนาม</option>
                </select>
              </div>

              <div className="text-slate-400 font-medium">
                พบ <span className="text-amber-400 font-bold">{filteredInventory.length}</span> จากทั้งหมด {accounts.length} ไอดี
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-[#111723] rounded-2xl border border-slate-800 overflow-hidden shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">รหัส / ประเทศ</th>
                      <th className="py-3 px-4">ชื่อไอดี & สเปกปืนเด่น</th>
                      <th className="py-3 px-4">ราคาขาย (THB / VND)</th>
                      <th className="py-3 px-4">สถานะขาย</th>
                      <th className="py-3 px-4 text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {paginatedInventory.map((item) => {
                      const regionBadge = getRegionBadge(item.region);
                      return (
                        <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-amber-400 block text-xs">#{item.id}</span>
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border mt-1 shadow-sm ${regionBadge.color}`}>
                              <span>{regionBadge.flag}</span>
                              <span>{regionBadge.label}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                            <div className="font-extrabold text-white text-xs sm:text-sm truncate">
                              {item.title_th || item.title_en}
                            </div>
                            <div className="text-slate-400 text-xs truncate mt-0.5">
                              🎯 {item.gunLevel_th || item.subtitle_th}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-bold text-amber-400 text-xs sm:text-sm">
                              ฿{Number(item.priceTHB).toLocaleString()}
                            </div>
                            <div className="text-slate-400 text-[11px]">
                              {Number(item.priceVND).toLocaleString()} ₫
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <button
                              onClick={() => onToggleSold(item.id)}
                              className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                                item.isSold
                                  ? 'bg-rose-950/60 text-rose-400 border-rose-800/50 hover:bg-rose-900/60'
                                  : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/60'
                              }`}
                            >
                              {item.isSold ? '✕ ขายแล้ว' : '✓ ว่างพร้อมส่ง'}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEdit(item)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold transition-colors"
                              >
                                แก้ไข
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`ต้องการลบไอดี #${item.id} ออกจากระบบ?`)) {
                                    onDeleteAccount(item.id);
                                  }
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400 text-xs font-semibold transition-colors"
                              >
                                ลบ
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredInventory.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-xs">
                  ไม่พบไอดีในเงื่อนไขการค้นหา
                </div>
              )}
            </div>

            {/* Inventory Pagination */}
            {filteredInventory.length > 0 && (
              <Pagination
                currentPage={invPage}
                totalPages={invTotalPages}
                totalItems={filteredInventory.length}
                pageSize={invPageSize}
                pageSizeOptions={[25, 50, 100, 200]}
                onPageChange={(p) => setInvPage(p)}
                onPageSizeChange={(s) => {
                  setInvPageSize(s);
                  setInvPage(1);
                }}
                lang={lang}
              />
            )}

          </div>
        )}

        {/* TAB 2: ORDERS & SLIP INSPECTION */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            <div className="bg-[#111723] rounded-2xl border border-slate-800 overflow-hidden shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">รหัสคำสั่งซื้อ</th>
                      <th className="py-3 px-4">ชื่อลูกค้า</th>
                      <th className="py-3 px-4">ไอดีที่ซื้อ</th>
                      <th className="py-3 px-4">ยอดเงิน & ช่องทาง</th>
                      <th className="py-3 px-4">สลิปโอนเงิน</th>
                      <th className="py-3 px-4">สถานะ</th>
                      <th className="py-3 px-4 text-right">ดูข้อมูลรหัสผ่าน & สลิป</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {orders.map((order) => (
                      <tr key={order.orderId} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-amber-400 block">{order.orderId}</span>
                          <span className="text-[10px] text-slate-500">{order.createdAt}</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                          {order.customerName}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <span className="font-mono text-amber-300 text-xs">#{order.accountId}</span>
                          <div className="truncate text-slate-300 text-xs">{order.accountTitle}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-white">{formatPrice(order.amountVND, order.amountTHB)}</div>
                          <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
                            {order.paymentMethod}
                          </span>
                        </td>
                        
                        {/* Slip indicator */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {order.slipImage ? (
                            <span 
                              onClick={() => setInspectOrder(order)}
                              className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/30 transition-all flex items-center gap-1 w-max"
                            >
                              <span>📸</span>
                              <span>มีสลิปโอนเงิน</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500">ไม่มีรูปสลิป</span>
                          )}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          {order.status === 'completed' ? (
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border bg-emerald-950/60 text-emerald-400 border-emerald-800/40">
                              ✓ สำเร็จ & ส่งมอบแล้ว
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                if (window.confirm(`ยืนยันการรับชำระเงินและอนุมัติออเดอร์ ${order.orderId}?`)) {
                                  onUpdateOrderStatus(order.orderId, 'completed');
                                }
                              }}
                              className="text-[11px] font-bold px-2.5 py-1 rounded-full border bg-amber-950/60 text-amber-400 border-amber-800/40 hover:bg-amber-900/60 transition-all cursor-pointer"
                              title="คลิกเพื่ออนุมัติออเดอร์"
                            >
                              ⏳ รอตรวจสอบ (คลิกเพื่ออนุมัติ)
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => setInspectOrder(order)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black font-bold text-xs border border-amber-500/30 transition-all"
                          >
                            🔑 ดูข้อมูลรหัสผ่าน
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: STORE SETTINGS & PAYMENT & CLOUD DB */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Social & Contact Channels (Facebook & Discord) ⭐ */}
            <div className="bg-[#111723] p-6 rounded-2xl border border-amber-500/40 shadow-xl space-y-4 md:col-span-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">💬</span>
                  <div>
                    <h3 className="font-black text-white text-base">
                      ช่องทางติดต่อสั่งซื้อ (Facebook Page & Discord Server)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ลูกค้าร้าน PUBG SIAM จะนำรหัสไอดีและยอดเงินไปติดต่อสั่งซื้อกับแอดมินโดยตรงผ่าน 2 ช่องทางนี้
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Contact Order Mode เปิดใช้งานอยู่</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                {/* Facebook Page Config */}
                <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-blue-500/30">
                  <div className="flex items-center justify-between text-blue-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <span>📘</span>
                      <span>Facebook Page / Messenger URL:</span>
                    </span>
                    <a 
                      href={settingsForm.facebookPageUrl || 'https://facebook.com'} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[10px] text-blue-400 hover:underline"
                    >
                      เปิดทดสอบ ↗
                    </a>
                  </div>
                  <input
                    type="url"
                    placeholder="https://facebook.com/pubgsiampubg หรือ https://m.me/pubgsiampubg"
                    value={settingsForm.facebookPageUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, facebookPageUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-500 outline-none text-xs"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>เช่น ลิงก์แฟนเพจ หรือ ลิงก์ข้อความ m.me/เพจของคุณ</span>
                  </div>
                </div>

                {/* Discord Server Config */}
                <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-indigo-500/30">
                  <div className="flex items-center justify-between text-indigo-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <span>💜</span>
                      <span>Discord Server Invite URL:</span>
                    </span>
                    <a 
                      href={settingsForm.discordInviteUrl || 'https://discord.gg'} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[10px] text-indigo-400 hover:underline"
                    >
                      เปิดทดสอบ ↗
                    </a>
                  </div>
                  <input
                    type="url"
                    placeholder="https://discord.gg/pubgsiam"
                    value={settingsForm.discordInviteUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, discordInviteUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 outline-none text-xs"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>เช่น https://discord.gg/yourserver (ลิงก์คำเชิญถาวร)</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Real Payment Gateway & QR Configuration */}
            <div className="bg-[#111723] p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <span>💳</span>
                <span>ตั้งค่าบัญชีรับเงิน & QR Code สแกนจ่ายจริง</span>
              </h3>
              <p className="text-xs text-slate-400">
                ข้อมูลนี้จะถูกนำไปสร้าง <b>PromptPay QR (ไทย)</b> และ <b>VietQR (เวียดนาม)</b> อัตโนมัติพร้อมยอดเงินตรงเป๊ะ
              </p>

              <div className="space-y-3.5 pt-1 text-xs">
                {/* PromptPay Phone / National ID */}
                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">
                    🇹🇭 เบอร์พร้อมเพย์ (PromptPay ID) หรือ เลขบัตร ปชช./นิติบุคคล:
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น 0891234567 หรือ 0105558000000"
                    value={settingsForm.promptPayId || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, promptPayId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
                  />
                </div>

                {/* PromptPay Name */}
                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">
                    🇹🇭 ชื่อบัญชีผู้รับเงิน PromptPay:
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น นาย สิมะ ช็อป (PUBG SIAM)"
                    value={settingsForm.promptPayName || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, promptPayName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                  />
                </div>

                {/* VietQR Bank & Account */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="block text-slate-300 font-bold">
                      🇻🇳 ธนาคารเวียดนาม (VietQR Bank):
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น MB, VCB, TCB"
                      value={settingsForm.vietQrBank || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, vietQrBank: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-300 font-bold">
                      🇻🇳 เลขที่บัญชีเวียดนาม:
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น 0987654321"
                      value={settingsForm.vietQrAccountNo || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, vietQrAccountNo: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">
                    🇻🇳 ชื่อบัญชีธนาคารเวียดนาม (Account Name):
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น PUBG SIAM VN"
                    value={settingsForm.vietQrAccountName || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, vietQrAccountName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Cloud Database (Firebase 🔥 / Supabase ⚡) Integration */}
            <div className="bg-[#111723] p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <span>☁️</span>
                  <span>ฐานข้อมูล & สตอเรจคลาวด์ (Cloud Database & Storage)</span>
                </h3>
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsForm({ ...settingsForm, cloudDbProvider: "firebase" });
                      setCloudTestResult(null);
                    }}
                    className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                      (settingsForm.cloudDbProvider || "firebase") === "firebase"
                        ? "bg-amber-500 text-black shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>🔥</span>
                    <span>Google Firebase (แนะนำ)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsForm({ ...settingsForm, cloudDbProvider: "supabase" });
                      setCloudTestResult(null);
                    }}
                    className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                      settingsForm.cloudDbProvider === "supabase"
                        ? "bg-amber-500 text-black shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>⚡</span>
                    <span>Supabase</span>
                  </button>
                </div>
              </div>

              {/* Firebase Form */}
              {(settingsForm.cloudDbProvider || "firebase") === "firebase" ? (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 leading-relaxed">
                    <strong>🔥 Google Firebase (Firestore + Storage):</strong>
                    <div className="text-[11px] text-slate-300 mt-1">
                      ฟรีตลอดชีพ 100% <strong>ไม่มีระบบ Auto-Pause (ไม่หลับตลอดไป)</strong> เชื่อมต่อได้ตลอด 24 ชั่วโมง เหมาะที่สุดสำหรับเว็บขายไอดี
                    </div>
                  </div>

                  {/* Quick Snippet Box */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-200 font-bold">
                        📋 วางโค้ด firebaseConfig (จาก Firebase Console):
                      </label>
                      <span className="text-[10px] text-slate-400 font-normal">ระบบจะดึง Project ID & API Key ให้อัตโนมัติ</span>
                    </div>
                    <textarea
                      rows="4"
                      placeholder='const firebaseConfig = { apiKey: "AIzaSy...", projectId: "sima-shop-pubg", ... };'
                      value={settingsForm.firebaseConfigSnippet || ""}
                      onChange={(e) => {
                        const snippet = e.target.value;
                        let extracted = { firebaseConfigSnippet: snippet };
                        try {
                          const projMatch = snippet.match(/projectId\s*:\s*["']([^"']+)["']/);
                          const keyMatch = snippet.match(/apiKey\s*:\s*["']([^"']+)["']/);
                          const authMatch = snippet.match(/authDomain\s*:\s*["']([^"']+)["']/);
                          const bucketMatch = snippet.match(/storageBucket\s*:\s*["']([^"']+)["']/);
                          const senderMatch = snippet.match(/messagingSenderId\s*:\s*["']([^"']+)["']/);
                          const appMatch = snippet.match(/appId\s*:\s*["']([^"']+)["']/);
                          if (projMatch) extracted.firebaseProjectId = projMatch[1];
                          if (keyMatch) extracted.firebaseApiKey = keyMatch[1];
                          if (authMatch) extracted.firebaseAuthDomain = authMatch[1];
                          if (bucketMatch) extracted.firebaseStorageBucket = bucketMatch[1];
                          if (senderMatch) extracted.firebaseMessagingSenderId = senderMatch[1];
                          if (appMatch) extracted.firebaseAppId = appMatch[1];
                        } catch (_) {}
                        setSettingsForm({ ...settingsForm, ...extracted });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono text-[11px] focus:border-amber-500 outline-none"
                    />
                  </div>

                  {/* Individual fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-slate-300 font-bold">Firebase Project ID:</label>
                      <input
                        type="text"
                        placeholder="sima-shop-pubg"
                        value={settingsForm.firebaseProjectId || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, firebaseProjectId: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 outline-none text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-slate-300 font-bold">Firebase Web API Key:</label>
                      <input
                        type="text"
                        placeholder="AIzaSy..."
                        value={settingsForm.firebaseApiKey || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, firebaseApiKey: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 outline-none text-xs"
                      />
                    </div>
                  </div>

                  {/* Setup Guide Collapsible */}
                  <details className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2 cursor-pointer">
                    <summary className="font-bold text-amber-400 select-none">
                      📖 วิธีเปิดใช้งาน Google Firebase ฟรี (ใช้เวลา 2 นาที):
                    </summary>
                    <div className="pt-2 space-y-1.5 pl-2 text-slate-300 leading-relaxed">
                      <div>1. เข้าเว็บ <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-amber-400 underline font-bold">console.firebase.google.com</a> แล้วล็อกอินด้วย Gmail</div>
                      <div>2. กด <strong>"Add project"</strong> ตั้งชื่อโปรเจกต์ (เช่น sima-shop) แล้วกด Continue จนเสร็จ</div>
                      <div>3. เมนูซ้ายมือ เลือก <strong>Build &gt; Firestore Database</strong> &gt; กด <strong>"Create database"</strong> &gt; เลือก Location สิงคโปร์ (asia-southeast1) &gt; เลือก <strong>Start in test mode</strong></div>
                      <div>4. คลิกไอคอนรูปเฟือง ⚙️ (Project settings) &gt; เลื่อนลงมาที่หัวข้อ "Your apps" &gt; กดไอคอน <strong>&lt;/&gt; (Web)</strong> &gt; ก๊อปปี้โค้ด <code>firebaseConfig</code> มาวางในช่องด้านบนได้เลย!</div>
                    </div>
                  </details>
                </div>
              ) : (
                /* Supabase Form */
                <div className="space-y-3 pt-1 text-xs">
                  <div className="space-y-1">
                    <label className="block text-slate-300 font-bold">Supabase Project URL:</label>
                    <input
                      type="url"
                      placeholder="https://ldcafwhhchadgfijiqte.supabase.co"
                      value={settingsForm.supabaseUrl || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, supabaseUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-300 font-bold">Supabase Anon Public Key:</label>
                      <button
                        type="button"
                        onClick={() => setShowAnonKey(!showAnonKey)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
                      >
                        {showAnonKey ? "🙈 ซ่อนคีย์" : "👁️ แสดงคีย์"}
                      </button>
                    </div>
                    <input
                      type={showAnonKey ? "text" : "password"}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                      value={settingsForm.supabaseAnonKey || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, supabaseAnonKey: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 outline-none text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Toggle Enable Cloud DB */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-bold text-white text-xs">
                    เปิดใช้งาน Cloud Database & Storage ({(settingsForm.cloudDbProvider || "firebase") === "firebase" ? "🔥 Google Firebase" : "⚡ Supabase"})
                  </span>
                  <p className="text-[10px] text-slate-500">หากปิดไว้ ระบบจะใช้ LocalStorage ในเครื่องอัตโนมัติ</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.useCloudDb || false}
                    onChange={(e) => setSettingsForm({ ...settingsForm, useCloudDb: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Test Connection Button */}
              <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="button"
                  disabled={testingCloud}
                  onClick={handleTestCloudConnection}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs shadow transition-all flex items-center gap-2"
                >
                  <span>{testingCloud ? "⏳" : ((settingsForm.cloudDbProvider || "firebase") === "firebase" ? "🔥" : "⚡")}</span>
                  <span>{testingCloud ? "กำลังทดสอบการเชื่อมต่อ..." : `ทดสอบการเชื่อมต่อ ${(settingsForm.cloudDbProvider || "firebase") === "firebase" ? "Google Firebase" : "Supabase"}`}</span>
                </button>

                {cloudTestResult && (
                  <span className={`text-xs font-bold ${cloudTestResult.success ? "text-emerald-400" : "text-rose-400"}`}>
                    {cloudTestResult.message}
                  </span>
                )}
              </div>
            </div>

            {/* Delivered Count Metric Configuration */}
            <div className="bg-[#111723] p-6 rounded-2xl border border-slate-800 space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <span>📈</span>
                  <span>ตัวเลขสถิติยอดส่งมอบหน้าร้าน (Delivered Count Metric)</span>
                </h3>
                <span className="text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  ระบบนับจริง Real-time
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ตัวเลขนี้จะแสดงผลบนแบนเนอร์หน้าแรก (ใต้ปุ่มเลือกดูไอดี) โดยระบบจะคำนวณจากยอดคำสั่งซื้อจริงที่ส่งมอบสำเร็จในระบบอัตโนมัติ
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-xs">ยอดคำสั่งซื้อจริงในระบบ:</span>
                  <div className="text-xl font-black text-emerald-400">
                    {orders ? orders.filter((o) => o.status === 'completed' || !o.status).length : 0} ไอดี
                  </div>
                  <span className="text-[10px] text-slate-500">นับจากออเดอร์ที่สั่งซื้อสำเร็จ</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <label className="text-slate-300 text-xs font-bold block">
                    ยอดสะสมเริ่มต้น (Base Count):
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={settingsForm.baseDeliveredCount ?? 0}
                    onChange={(e) => setSettingsForm({ ...settingsForm, baseDeliveredCount: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono font-bold text-sm focus:border-amber-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">ใส่ 0 หากต้องการนับเฉพาะยอดในเว็บ</span>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-950/20 border border-amber-500/30 space-y-1">
                  <span className="text-amber-300 text-xs font-bold">ตัวเลขที่จะแสดงบนหน้าแรก:</span>
                  <div className="text-2xl font-black text-white">
                    {((orders ? orders.filter((o) => o.status === 'completed' || !o.status).length : 0) + Number(settingsForm.baseDeliveredCount || 0)) > 0
                      ? `${((orders ? orders.filter((o) => o.status === 'completed' || !o.status).length : 0) + Number(settingsForm.baseDeliveredCount || 0)).toLocaleString()}+`
                      : '0'}
                  </div>
                  <span className="text-[10px] text-amber-400/80">ไอดี Steam ที่ส่งมอบแล้ว</span>
                </div>
              </div>
            </div>

            {/* Announcement Bar & Save */}
            <div className="bg-[#111723] p-6 rounded-2xl border border-slate-800 space-y-4 md:col-span-2">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <span>📢</span>
                <span>แถบประกาศหน้าแรก (Announcement Bar)</span>
              </h3>

              <div>
                <textarea
                  rows={2}
                  value={settingsForm.announcementText || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-extrabold text-xs sm:text-sm shadow-md pubg-glow transition-all"
                >
                  💾 บันทึกการตั้งค่าทั้งหมด
                </button>
              </div>
            </div>

            {/* Data Management & Backup/Restore */}
            <div className="bg-[#111723] p-6 rounded-2xl border border-slate-800 space-y-4 md:col-span-2">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <span>🗄️</span>
                <span>สำรองข้อมูล & จัดการคลังสินค้า (Backup & Data Management)</span>
              </h3>
              <p className="text-xs text-slate-400">
                คุณสามารถ Export ดาวน์โหลดข้อมูลไอดีและออเดอร์ทั้งหมดเก็บไว้เป็นไฟล์ JSON หรือนำเข้าย้ายไปยังเซิร์ฟเวอร์อื่นได้ตลอดเวลา
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {/* Export JSON */}
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-4 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>📥</span>
                  <span>ดาวน์โหลดไฟล์สำรองข้อมูล (Export JSON)</span>
                </button>

                {/* Import JSON */}
                <label className="px-4 py-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 border border-blue-800/40 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span>📤</span>
                  <span>นำเข้าไฟล์สำรองข้อมูล (Import JSON)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackupFile}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('คุณต้องการลบข้อมูลไอดีตัวอย่างทั้งหมด เพื่อเริ่มลงไอดีจริงใช่หรือไม่?')) {
                      onClearAllAccounts();
                      alert('ล้างข้อมูลไอดีเรียบร้อยแล้ว คุณสามารถเริ่มกด "➕ ลงขายไอดีใหม่" เพื่อใส่ข้อมูลจริงได้ทันที!');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 font-bold text-xs transition-colors"
                >
                  🗑️ ล้างสต็อกไอดีทั้งหมด
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('ต้องการล้างประวัติคำสั่งซื้อทั้งหมด เพื่อเริ่มนับยอดขายใหม่ใช่หรือไม่?')) {
                      onClearOrders();
                      alert('ล้างประวัติคำสั่งซื้อเรียบร้อยแล้ว!');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-400 border border-amber-800/40 font-bold text-xs transition-colors"
                >
                  🧹 ล้างประวัติคำสั่งซื้อ (เริ่มนับ 0)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('ต้องการรีเซ็ตข้อมูลตัวอย่างทั้งหมด (ไอดี + ออเดอร์) ใช่หรือไม่?')) {
                      onResetDefaultAccounts();
                      onResetOrders();
                      alert('รีเซ็ตข้อมูลตัวอย่างเริ่มต้นเรียบร้อยแล้ว!');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                >
                  🔄 รีเซ็ตข้อมูลเริ่มต้น
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: CHINA REAL-TIME STOCK SYNC ENGINE 🇨🇳 */}
        {activeTab === 'china-sync' && (
          <div className="space-y-6">
            
            {/* Top Status Banner */}
            <div className="bg-gradient-to-r from-red-950/60 via-slate-900 to-amber-950/40 p-6 rounded-2xl border border-red-800/40 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>API เชื่อมต่อตรง: fzht.xuxug.com (คลังจีน 12,240+ ไอดี)</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <span>🇨🇳</span>
                    <span>ระบบซิงค์สต็อกไอดีจีน Real-time (China Auto-Sync)</span>
                  </h2>
                  <p className="text-xs text-slate-300">
                    ดึงข้อมูลไอดีจากตลาดจีน แปลงชื่อสกิน/ปืนเป็นภาษาไทย แปลงราคาหยวนเป็นบาท+กำไร และนำเข้าระบบอัตโนมัติ
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[120px]">
                    <span className="text-[10px] text-slate-400 font-bold block">ไอดีจีนในร้านเรา:</span>
                    <span className="text-xl font-black text-amber-400">
                      {accounts.filter((a) => a.region === 'cn').length} ไอดี
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[140px]">
                    <span className="text-[10px] text-slate-400 font-bold block">ซิงค์ล่าสุด:</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {settingsForm.chinaLastSyncTime ? new Date(settingsForm.chinaLastSyncTime).toLocaleTimeString('th-TH') : 'ยังไม่เคยซิงค์'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sync Configuration Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Formula & Margin Settings */}
              <div className="bg-[#111723] p-6 rounded-2xl border border-slate-800 space-y-5 lg:col-span-2">
                <div className="border-b border-slate-800/80 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-black text-white text-base flex items-center gap-2">
                      <span>🧮</span>
                      <span>ตั้งค่าระบบกำไรขั้นบันได & คลังจัดเก็บ (Tiered Pricing & Storage)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      กำหนดเปอร์เซ็นต์กำไรตามมูลค่าไอดี และเลือกบันทึกลงหน้าร้านโดยตรงเพื่อประหยัดโควต้า Firebase
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase">
                    Zero-DB Free Mode Ready
                  </span>
                </div>

                {/* 1. Storage Destination Mode */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
                    <span>💾</span>
                    <span>ปลายทางที่บันทึกข้อมูลสต็อกไอดีจีน:</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, chinaStorageMode: 'direct_json' })}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        (settingsForm.chinaStorageMode || 'direct_json') === 'direct_json'
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs flex items-center gap-1.5 text-amber-400">
                          <span>⚡</span>
                          <span>หน้าร้านโดยตรง (Direct JSON)</span>
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black">
                          แนะนำ (ฟรี 100%)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        ไม่บันทึกลง Firebase / ไม่กินโควต้าฐานข้อมูล โหลดเร็วระดับมิลลิวินาทีจาก static JSON & LocalStorage
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, chinaStorageMode: 'firebase' })}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        settingsForm.chinaStorageMode === 'firebase'
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs flex items-center gap-1.5 text-orange-400">
                          <span>🔥</span>
                          <span>Google Firebase / Supabase</span>
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold">
                          Cloud Database
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        บันทึกลงฐานข้อมูลคลาวด์ Firestore หรือ Supabase (อาจใช้โควต้า Read/Write ของแพ็กเกจ)
                      </p>
                    </button>
                  </div>
                </div>

                {/* 2. Markup Pricing Engine Mode */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
                      <span>📊</span>
                      <span>รูปแบบการคิดกำไรบวกเพิ่ม (% Markup):</span>
                    </label>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setSettingsForm({ ...settingsForm, chinaMarkupMode: 'tiered' })}
                        className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                          (settingsForm.chinaMarkupMode || 'tiered') === 'tiered'
                            ? 'bg-amber-500 text-black font-extrabold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        แบบขั้นบันไดตามราคา
                      </button>
                      <button
                        type="button"
                        onClick={() => setSettingsForm({ ...settingsForm, chinaMarkupMode: 'flat' })}
                        className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                          settingsForm.chinaMarkupMode === 'flat'
                            ? 'bg-amber-500 text-black font-extrabold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        เปอร์เซ็นต์คงที่
                      </button>
                    </div>
                  </div>

                  {(settingsForm.chinaMarkupMode || 'tiered') === 'tiered' ? (
                    /* Tiered Markup Settings */
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 block">
                            จุดแบ่งมูลค่าราคาไอดี (Threshold บาท):
                          </label>
                          <input
                            type="number"
                            step="5000"
                            min="10000"
                            value={settingsForm.chinaMarkupThreshold ?? 100000}
                            onChange={(e) => setSettingsForm({ ...settingsForm, chinaMarkupThreshold: parseFloat(e.target.value) || 100000 })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold text-sm focus:border-amber-500 outline-none"
                          />
                          <span className="text-[10px] text-slate-500 block">เช่น 100,000 บาท</span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 block">
                            ต่ำกว่า {Number(settingsForm.chinaMarkupThreshold || 100000).toLocaleString()}฿ (+% กำไร):
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="1"
                              min="0"
                              value={settingsForm.chinaMarkupTier1Percent ?? 10}
                              onChange={(e) => setSettingsForm({ ...settingsForm, chinaMarkupTier1Percent: parseFloat(e.target.value) || 0 })}
                              className="w-full bg-slate-900 border border-emerald-500/50 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold text-sm focus:border-emerald-500 outline-none pr-8"
                            />
                            <span className="absolute right-3 top-2 text-xs font-bold text-emerald-400">%</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block">ค่ามาตรฐาน: +10%</span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 block">
                            ตั้งแต่ {Number(settingsForm.chinaMarkupThreshold || 100000).toLocaleString()}฿ ขึ้นไป (+% กำไร):
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="1"
                              min="0"
                              value={settingsForm.chinaMarkupTier2Percent ?? 13}
                              onChange={(e) => setSettingsForm({ ...settingsForm, chinaMarkupTier2Percent: parseFloat(e.target.value) || 0 })}
                              className="w-full bg-slate-900 border border-amber-500/50 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold text-sm focus:border-amber-500 outline-none pr-8"
                            />
                            <span className="absolute right-3 top-2 text-xs font-bold text-amber-400">%</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block">ค่ามาตรฐาน: +13%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Flat Markup Settings */
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="space-y-1 max-w-xs">
                        <label className="text-[11px] font-bold text-slate-300 block">
                          เปอร์เซ็นต์กำไรคงที่ทุกไอดี (% Markup):
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="1"
                            min="0"
                            value={settingsForm.chinaMarkupPercent ?? 10}
                            onChange={(e) => setSettingsForm({ ...settingsForm, chinaMarkupPercent: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:border-amber-500 outline-none pr-8"
                          />
                          <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Exchange Rates Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">
                      เรทเงินหยวน (1 RMB = กี่บาท THB):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      value={settingsForm.chinaCnyRateThb ?? 5.2}
                      onChange={(e) => setSettingsForm({ ...settingsForm, chinaCnyRateThb: parseFloat(e.target.value) || 5.2 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:border-amber-500 outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block">มาตรฐานตลาด: 5.0 - 5.3 บาท/หยวน</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">
                      เรทเงินดงเวียดนาม (1 RMB = กี่ VND):
                    </label>
                    <input
                      type="number"
                      step="50"
                      min="1000"
                      value={settingsForm.chinaCnyRateVnd ?? 3700}
                      onChange={(e) => setSettingsForm({ ...settingsForm, chinaCnyRateVnd: parseFloat(e.target.value) || 3700 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:border-amber-500 outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block">มาตรฐาน: 3,500 - 3,800 ₫</span>
                  </div>
                </div>

                {/* Live Simulation Card (Two Cases) */}
                <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>💡</span>
                      <span>ตัวอย่างการคำนวณราคาขายจริง (Live Simulator):</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      เรท 1¥ = {settingsForm.chinaCnyRateThb ?? 5.2}฿
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Case 1: Below Threshold */}
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 font-bold text-[11px]">
                          🟢 ไอดีต่ำกว่า {Number(settingsForm.chinaMarkupThreshold || 100000).toLocaleString()}฿
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                          +{settingsForm.chinaMarkupTier1Percent ?? 10}%
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        ทุนจีน ¥1,000 RMB (≈ ฿{Math.round(1000 * (settingsForm.chinaCnyRateThb || 5.2)).toLocaleString()})
                      </div>
                      <div className="flex items-baseline justify-between pt-1 border-t border-slate-800">
                        <span className="text-slate-400 text-[10px]">ราคาขายหน้าร้าน:</span>
                        <span className="text-base font-black text-emerald-400 font-mono">
                          ฿{Math.round((1000 * (settingsForm.chinaCnyRateThb || 5.2) * (1 + (settingsForm.chinaMarkupTier1Percent ?? 10) / 100)) / 10) * 10}
                        </span>
                      </div>
                      <div className="text-right text-[10px] text-slate-500">
                        กำไร ฿{Math.round(1000 * (settingsForm.chinaCnyRateThb || 5.2) * ((settingsForm.chinaMarkupTier1Percent ?? 10) / 100))}
                      </div>
                    </div>

                    {/* Case 2: Above Threshold */}
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-bold text-[11px]">
                          🟡 ไอดีตั้งแต่ {Number(settingsForm.chinaMarkupThreshold || 100000).toLocaleString()}฿ ขึ้นไป
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                          +{settingsForm.chinaMarkupTier2Percent ?? 13}%
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        ทุนจีน ¥25,000 RMB (≈ ฿{Math.round(25000 * (settingsForm.chinaCnyRateThb || 5.2)).toLocaleString()})
                      </div>
                      <div className="flex items-baseline justify-between pt-1 border-t border-slate-800">
                        <span className="text-slate-400 text-[10px]">ราคาขายหน้าร้าน:</span>
                        <span className="text-base font-black text-amber-400 font-mono">
                          ฿{Math.round((25000 * (settingsForm.chinaCnyRateThb || 5.2) * (1 + (settingsForm.chinaMarkupTier2Percent ?? 13) / 100)) / 10) * 10}
                        </span>
                      </div>
                      <div className="text-right text-[10px] text-slate-500">
                        กำไร ฿{Math.round(25000 * (settingsForm.chinaCnyRateThb || 5.2) * ((settingsForm.chinaMarkupTier2Percent ?? 13) / 100))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Batch Size & Interval */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">
                      จำนวนหน้าดึงต่อรอบ (Batch Size):
                    </label>
                    <select
                      value={settingsForm.chinaSyncPages || 'all'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, chinaSyncPages: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-xs focus:border-amber-500 outline-none"
                    >
                      <option value="all">🔥 ดึงทั้งหมดที่มีในคลังจีน (All Stock - 1,000+ ไอดี)</option>
                      <option value="100">100 หน้า (2,000 ไอดี)</option>
                      <option value="50">50 หน้า (1,000 ไอดี) - แนะนำ</option>
                      <option value="25">25 หน้า (500 ไอดี)</option>
                      <option value="10">10 หน้า (200 ไอดี)</option>
                      <option value="5">5 หน้า (100 ไอดี)</option>
                      <option value="1">1 หน้า (20 ไอดี)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">
                      ความถี่ในการซิงค์อัตโนมัติ:
                    </label>
                    <select
                      value={settingsForm.chinaSyncIntervalMinutes || 15}
                      onChange={(e) => setSettingsForm({ ...settingsForm, chinaSyncIntervalMinutes: parseInt(e.target.value, 10) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-xs focus:border-amber-500 outline-none"
                    >
                      <option value="10">ทุกๆ 10 นาที (Real-time สูงสุด)</option>
                      <option value="15">ทุกๆ 15 นาที (แนะนำ)</option>
                      <option value="30">ทุกๆ 30 นาที</option>
                      <option value="60">ทุกๆ 1 ชั่วโมง</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons Toolbar */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={syncingChina}
                    onClick={handleTriggerChinaSync}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-amber-600 hover:from-red-500 hover:to-amber-500 text-black font-black text-xs sm:text-sm shadow-lg pubg-glow transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <span>{syncingChina ? '⏳' : '⚡'}</span>
                    <span>{syncingChina ? 'กำลังประมวลผลสต็อกจีน...' : 'สั่งซิงค์สต็อกจีนเดี๋ยวนี้ (Sync Now)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-colors"
                  >
                    💾 บันทึกค่าคอนฟิกซิงค์
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadChinaJson}
                    className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs border border-amber-500/30 transition-colors flex items-center gap-1.5"
                  >
                    <span>📥</span>
                    <span>ดาวน์โหลด china_stock.json</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearOnlyChinaAccounts}
                    className="px-4 py-3 rounded-xl bg-red-950/40 hover:bg-red-900/40 text-red-400 font-bold text-xs border border-red-800/40 transition-colors flex items-center gap-1.5"
                  >
                    <span>🗑️</span>
                    <span>ลบเฉพาะไอดีจีนออกจากหน้าร้าน</span>
                  </button>
                </div>
              </div>

              {/* In-Browser Auto-Sync & Cloud Scheduler Info */}
              <div className="space-y-4">
                
                {/* Browser Real-time Loop Card */}
                <div className="bg-[#111723] p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">ซิงค์อัตโนมัติในเบราว์เซอร์</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoSyncInPage}
                        onChange={(e) => setAutoSyncInPage(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    เมื่อเปิดสวิตช์นี้ ตราบใดที่คุณเปิดหน้าแอดมินทิ้งไว้ ระบบจะวนลูปซิงค์สต็อกไอดีใหม่เข้าหน้าร้านอัตโนมัติทุกๆ <strong>{settingsForm.chinaSyncIntervalMinutes || 15} นาที</strong>
                  </p>
                  {autoSyncInPage && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] flex items-center gap-2 font-bold animate-pulse">
                      <span>🟢</span>
                      <span>ระบบ Auto-Sync กำลังทำงานสดในเบราว์เซอร์</span>
                    </div>
                  )}
                </div>

                {/* Node.js Daemon & GitHub Actions Card (Zero-DB Free Automation) */}
                <div className="bg-[#111723] p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">☁️</span>
                    <h4 className="font-bold text-white text-xs">ระบบกวาดสต็อกจีน 24 ชม. (Zero Firebase)</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    รันสคริปต์เพื่อกวาดสต็อกจีนลงไฟล์ <strong>china_stock.json</strong> โดยตรง ไม่เปลืองฐานข้อมูล และประหยัดค่าใช้จ่าย 100%:
                  </p>
                  
                  <div className="p-3 rounded-xl bg-black border border-slate-800 text-[11px] font-mono text-amber-400 space-y-1">
                    <div className="text-slate-500 text-[10px]"># คำสั่งรันกวาดไอดีจีนทันที (เช่น 5 หน้า = 100 ไอดี):</div>
                    <div className="select-all">node scripts/syncChinaStock.js --pages 5</div>
                    <div className="text-slate-500 text-[10px] pt-1"># คำสั่งรันวนลูปตลอด 24 ชั่วโมง:</div>
                    <div className="select-all">node scripts/syncChinaStock.js --watch</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-400 space-y-1 font-mono">
                    <div>✓ อัปเดตผ่าน GitHub Actions ทุก 30 นาที 24/7</div>
                    <div>✓ ปลายทาง: new-react-app/public/data/china_stock.json</div>
                    <div>✓ ค่าใช้จ่าย: 0 บาท (ฟรีตลอดชีพ)</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Real-time Streaming Sync Terminal Console */}
            <div className="bg-[#0b0f17] p-5 rounded-2xl border border-slate-800 space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-mono font-bold text-slate-300 ml-2">
                    Terminal Output (บันทึกกิจกรรมซิงค์ Real-time)
                  </span>
                </div>
                {syncingChina && (
                  <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5 animate-pulse">
                    <span>⚡</span> กำลังประมวลผล...
                  </span>
                )}
              </div>

              <div className="bg-black/80 rounded-xl p-4 font-mono text-xs max-h-64 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                {chinaSyncLogs.length === 0 ? (
                  <div className="text-slate-600 italic">
                    ยังไม่มีกิจกรรมในเซสชันนี้ กดปุ่ม "สั่งซิงค์สต็อกจีนเดี๋ยวนี้" เพื่อเริ่มการกวาดข้อมูล
                  </div>
                ) : (
                  chinaSyncLogs.map((log, idx) => (
                    <div 
                      key={idx} 
                      className={`${
                        log.includes('✓') || log.includes('สำเร็จ') 
                          ? 'text-emerald-400' 
                          : log.includes('❌') 
                          ? 'text-rose-400' 
                          : 'text-slate-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Add / Edit Account Modal */}
      <AddAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAccount}
        editingAccount={editingAccount}
        lang={lang}
      />

      {/* Inspect Order Credentials & Payment Slip Modal ⭐ */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111723] border border-slate-700 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-black text-white text-lg flex items-center gap-2">
                  <span className="text-amber-400">🔑 ข้อมูลคำสั่งซื้อ</span>
                  <span className="font-mono text-xs bg-slate-800 text-amber-300 px-2 py-0.5 rounded">#{inspectOrder.orderId}</span>
                </h4>
                <p className="text-xs text-slate-400">ลูกค้า: {inspectOrder.customerName} ({inspectOrder.paymentMethod})</p>
              </div>
              <button
                onClick={() => setInspectOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Payment Slip Inspection */}
            {inspectOrder.slipImage && (
              <div className="space-y-2 bg-slate-950 p-3.5 rounded-2xl border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span>📸</span>
                  <span>สลิปโอนเงินที่ลูกค้าแนบมา:</span>
                </span>
                <div className="max-h-60 overflow-hidden rounded-xl border border-slate-800 flex items-center justify-center bg-black">
                  <img
                    src={inspectOrder.slipImage}
                    alt="Customer Payment Slip"
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={() => {
                      const w = window.open('');
                      w.document.write(`<img src="${inspectOrder.slipImage}" style="max-width:100%"/>`);
                    }}
                    title="คลิกเพื่อดูรูปขนาดเต็ม"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block text-center">
                  คลิกที่รูปเพื่อเปิดดูสลิปขนาดเต็ม
                </span>
              </div>
            )}

            {/* Steam Credentials Sent */}
            <div className="space-y-3 text-xs">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                🔐 ข้อมูลบัญชี Steam ที่ส่งมอบให้ลูกค้า:
              </span>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Steam Username:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{inspectOrder.steamUser}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Steam Password:</span>
                <span className="font-mono font-bold text-white text-sm">{inspectOrder.steamPass}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Original Email & Password:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{inspectOrder.mailInfo}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              {inspectOrder.status !== 'completed' ? (
                <button
                  onClick={() => {
                    onUpdateOrderStatus(inspectOrder.orderId, 'completed');
                    setInspectOrder({ ...inspectOrder, status: 'completed' });
                    alert('อนุมัติคำสั่งซื้อเรียบร้อยแล้ว!');
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs"
                >
                  ✓ อนุมัติการชำระเงิน
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-400">✓ สถานะ: ชำระเงินสำเร็จแล้ว</span>
              )}

              <button
                onClick={() => setInspectOrder(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

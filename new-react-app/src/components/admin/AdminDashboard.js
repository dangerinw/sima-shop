import React, { useState } from 'react';
import AddAccountModal from './AddAccountModal';
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
    const result = await dbService.testConnection(settingsForm.supabaseUrl, settingsForm.supabaseAnonKey);
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
              S
            </div>
            <div>
              <div className="text-lg font-black tracking-wider text-white flex items-center gap-2">
                SIMA <span className="text-amber-400">ADMIN</span>
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
                    {filteredInventory.map((item) => {
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
                    placeholder="เช่น นาย สิมะ ช็อป (SIMA SHOP)"
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
                    placeholder="เช่น SIMA SHOP VN"
                    value={settingsForm.vietQrAccountName || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, vietQrAccountName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Cloud Database (Supabase) Integration */}
            <div className="bg-[#111723] p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <span>☁️</span>
                  <span>ฐานข้อมูลออนไลน์ (Supabase Cloud DB)</span>
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                  PostgreSQL Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                เชื่อมต่อฐานข้อมูลกลางเพื่อให้ลูกค้าและแอดมินทุกเครื่องเห็นข้อมูลตรงกันแบบ Real-time
              </p>

              <div className="space-y-3 pt-1 text-xs">
                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">Supabase Project URL:</label>
                  <input
                    type="url"
                    placeholder="https://xxxxxxxx.supabase.co"
                    value={settingsForm.supabaseUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, supabaseUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 outline-none text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">Supabase Anon Public Key:</label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    value={settingsForm.supabaseAnonKey || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, supabaseAnonKey: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 outline-none text-xs"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <span className="font-bold text-white text-xs">เปิดใช้งาน Cloud Database</span>
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
                <div className="pt-1 flex items-center gap-3">
                  <button
                    type="button"
                    disabled={testingCloud}
                    onClick={handleTestCloudConnection}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 transition-colors"
                  >
                    {testingCloud ? '⏳ กำลังทดสอบ...' : '⚡ ทดสอบการเชื่อมต่อ Supabase'}
                  </button>

                  {cloudTestResult && (
                    <span className={`text-xs font-bold ${cloudTestResult.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {cloudTestResult.message}
                    </span>
                  )}
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

import React, { useState } from 'react';

export default function UserPurchasesModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  orders = [], 
  currency, 
  lang,
  onBrowseStore 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  if (!isOpen || !currentUser) return null;

  // Filter orders belonging to this user
  // Match by userId, or customerName, or username
  const userOrders = orders.filter((order) => {
    if (order.userId && order.userId === currentUser.id) return true;
    if (order.customerName && currentUser.name && order.customerName.toLowerCase() === currentUser.name.toLowerCase()) return true;
    if (order.customerName && currentUser.username && order.customerName.toLowerCase() === currentUser.username.toLowerCase()) return true;
    return false;
  });

  const filteredOrders = userOrders.filter((order) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      order.orderId?.toLowerCase().includes(q) ||
      order.accountId?.toLowerCase().includes(q) ||
      order.accountTitle?.toLowerCase().includes(q) ||
      order.steamUser?.toLowerCase().includes(q)
    );
  });

  const totalSpentTHB = userOrders.reduce((sum, o) => sum + (o.amountTHB || 0), 0);
  const totalSpentVND = userOrders.reduce((sum, o) => sum + (o.amountVND || 0), 0);

  const formatPrice = (vnd, thb) => {
    if (currency === 'THB') {
      return `฿${Number(thb).toLocaleString()}`;
    }
    return `${Number(vnd).toLocaleString()} ₫`;
  };

  const togglePasswordReveal = (orderId) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleCopyAll = (order) => {
    const content = `[SIMA SHOP - ข้อมูลไอดี PUBG PC]
รหัสคำสั่งซื้อ: ${order.orderId}
ไอดี: #${order.accountId} - ${order.accountTitle}
Steam Username: ${order.steamUser}
Steam Password: ${order.steamPass}
Original Mail: ${order.mailInfo}
การรับประกัน: ${order.warranty || 'มีประกันมือ 1 แท้ (ปลอดภัย 100%)'}
วันที่ซื้อ: ${order.createdAt}`;

    handleCopy(content, `all_${order.orderId}`);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-[#111723] border border-amber-500/40 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5 sm:p-6 bg-[#0f1522] sticky top-0 z-20">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl shadow-lg pubg-glow">
              {currentUser.avatar || '👑'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">
                  {currentUser.name || currentUser.username}
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                  @{currentUser.username}
                </span>
                <span className="text-xs">
                  {currentUser.country === 'th' ? '🇹🇭' : '🇻🇳'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>📦 คลังไอดีส่วนตัว (My Purchased Accounts)</span>
                <span>•</span>
                <span>สมาชิกตั้งแต่ {currentUser.joinedDate || '2026'}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-semibold">ไอดีที่ครอบครอง</span>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {userOrders.length} <span className="text-xs text-slate-400 font-normal">ไอดี</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-semibold">ยอดสั่งซื้อรวม</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {formatPrice(totalSpentVND, totalSpentTHB)}
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1 flex flex-col justify-center">
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <span>🛡️</span>
                <span>{showGuide ? 'ปิดคู่มือความปลอดภัย' : 'คู่มือเปิด Steam Guard'}</span>
              </button>
            </div>
          </div>

          {/* Steam Guard Safety Guide Accordion */}
          {showGuide && (
            <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 rounded-2xl p-4 sm:p-5 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs sm:text-sm">
                <span>🛡️</span>
                <span>3 ขั้นตอนหลังรับไอดี Steam เพื่อความปลอดภัย 100%:</span>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
                <li>
                  <b>เข้าสู่ระบบ Steam และอีเมลแรก (Original Mail):</b> ตรวจสอบให้แน่ใจว่าเข้าได้ทั้ง Steam และกล่องข้อความอีเมล
                </li>
                <li>
                  <b>เปลี่ยนรหัสผ่าน Steam & อีเมล:</b> เข้าไปที่เมนู <i>Settings &gt; Security &gt; Change Password</i> ตั้งรหัสผ่านใหม่ที่ปลอดภัย
                </li>
                <li>
                  <b>เปิดการยืนยันสองชั้น (Steam Guard Mobile Authenticator):</b> ผูกเบอร์มือถือของคุณบนแอป Steam Guard เพื่อป้องกันการเข้าถึงจากบุคคลอื่นโดยสมบูรณ์
                </li>
              </ol>
            </div>
          )}

          {/* Search / Filter Orders */}
          {userOrders.length > 0 && (
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-xs">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="ค้นหาไอดีในคลัง เช่น Beryl, #PC-1002, หรือชื่อไอดี..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                />
              </div>
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                แสดง {filteredOrders.length} / {userOrders.length} ไอดี
              </span>
            </div>
          )}

          {/* Purchased Accounts List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isRevealed = revealedPasswords[order.orderId];
                return (
                  <div 
                    key={order.orderId}
                    className="bg-slate-950/90 rounded-2xl border border-slate-800 hover:border-amber-500/40 p-4 sm:p-5 space-y-4 transition-all"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500 text-black">
                            {order.orderId}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300">
                            #{order.accountId}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <span>✓</span>
                            <span>ส่งมอบแล้ว (Delivered)</span>
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-black text-white mt-1.5 leading-snug">
                          {order.accountTitle}
                        </h4>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-400 block font-mono">{order.createdAt}</span>
                        <div className="text-base font-black text-amber-400">
                          {formatPrice(order.amountVND, order.amountTHB)}
                        </div>
                      </div>
                    </div>

                    {/* Steam Credentials Vault Box */}
                    <div className="bg-slate-900/90 rounded-xl border border-amber-500/30 p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                          <span>🔐</span>
                          <span>ข้อมูลบัญชี Steam & เมลแรก (Steam Vault)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyAll(order)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold transition-all flex items-center gap-1"
                        >
                          <span>{copiedKey === `all_${order.orderId}` ? '✓ คัดลอกทั้งหมดแล้ว' : '📋 คัดลอกทั้งหมด'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        
                        {/* Steam Username */}
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                          <span className="text-[10px] text-slate-400 block mb-1">Steam Username:</span>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono font-bold text-white text-xs truncate">
                              {order.steamUser}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(order.steamUser, `usr_${order.orderId}`)}
                              className="text-[10px] text-amber-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 transition-colors"
                              title="คัดลอก Username"
                            >
                              {copiedKey === `usr_${order.orderId}` ? '✓' : 'คัดลอก'}
                            </button>
                          </div>
                        </div>

                        {/* Steam Password */}
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-slate-400 block">Steam Password:</span>
                            <button
                              type="button"
                              onClick={() => togglePasswordReveal(order.orderId)}
                              className="text-[10px] text-slate-400 hover:text-amber-400"
                            >
                              {isRevealed ? '👁️ ซ่อน' : '👁️ แสดง'}
                            </button>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono font-bold text-amber-300 text-xs truncate">
                              {isRevealed ? order.steamPass : '••••••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(order.steamPass, `pass_${order.orderId}`)}
                              className="text-[10px] text-amber-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 transition-colors"
                              title="คัดลอก Password"
                            >
                              {copiedKey === `pass_${order.orderId}` ? '✓' : 'คัดลอก'}
                            </button>
                          </div>
                        </div>

                        {/* Original Mail & Pass */}
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                          <span className="text-[10px] text-slate-400 block mb-1">Original Email (เมลแรก):</span>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono font-bold text-emerald-400 text-xs truncate" title={order.mailInfo}>
                              {order.mailInfo}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(order.mailInfo, `mail_${order.orderId}`)}
                              className="text-[10px] text-emerald-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 transition-colors"
                              title="คัดลอก Email Info"
                            >
                              {copiedKey === `mail_${order.orderId}` ? '✓' : 'คัดลอก'}
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Footer Row: Warranty & Support */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <span>🛡️</span>
                          <span>{order.warranty || 'มีประกันมือ 1 แท้ (ปลอดภัย 100%)'}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => alert(`SIMA Support Hotline:\n- แอดมินดูแลออเดอร์: ${order.orderId}\n- ติดต่อเคลมประกันหรือสอบถามวิธีเปลี่ยนรหัสได้ที่ LINE/Discord: @SIMASHOP`)}
                          className="text-xs text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 underline"
                        >
                          <span>💬</span>
                          <span>ติดต่อเคลมประกัน / แจ้งปัญหา</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="py-12 text-center bg-slate-950/60 rounded-3xl border border-slate-800/80 p-6 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center mx-auto text-3xl">
                🎮
              </div>
              <h3 className="text-lg font-bold text-white">ยังไม่มีประวัติการซื้อไอดี PUBG PC</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                เมื่อคุณซื้อไอดีจากร้าน SIMA Shop รหัสผ่านและอีเมลแรกจะถูกเก็บรักษาไว้ที่คลังนี้ตลอดไป
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => { onClose(); onBrowseStore && onBrowseStore(); }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-md transition-all"
                >
                  🛒 ไปเลือกซื้อไอดีที่หน้าร้าน
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Sticky Footer */}
        <div className="border-t border-slate-800 p-4 sm:p-5 bg-[#0f1522] flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span>🔒</span>
            <span>ข้อมูลรหัสผ่านทั้งหมดได้รับการเข้ารหัสและจัดเก็บบนเครื่องของคุณ</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
}

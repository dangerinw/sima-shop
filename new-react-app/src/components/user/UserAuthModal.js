import React, { useState } from 'react';
import { getStoredUsers, saveUsersToStorage } from '../../data/mockUsers';

export default function UserAuthModal({ isOpen, onClose, onLoginSuccess, lang }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  // Login fields
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register fields
  const [regUsername, setRegUsername] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const users = getStoredUsers();
    const query = loginInput.trim().toLowerCase();

    // Match by username or email
    const foundUser = users.find(
      (u) =>
        (u.username.toLowerCase() === query || u.email.toLowerCase() === query) &&
        u.password === loginPassword
    );

    if (foundUser) {
      onLoginSuccess(foundUser);
      onClose();
    } else {
      setLoginError(
        lang === 'th'
          ? 'ชื่อผู้ใช้/อีเมล หรือรหัสผ่านไม่ถูกต้อง (ลองใช้ somchai / 1234)'
          : 'Invalid username/email or password (try somchai / 1234)'
      );
    }
  };

  // Quick 1-Click Login for Testing
  const handleQuickLogin = (username, password) => {
    const users = getStoredUsers();
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser) {
      onLoginSuccess(foundUser);
      onClose();
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (regPassword !== regConfirmPassword) {
      setRegError(lang === 'th' ? 'รหัสผ่านยืนยันไม่ตรงกัน' : 'Passwords do not match');
      return;
    }

    if (regPassword.length < 4) {
      setRegError(lang === 'th' ? 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร' : 'Password must be at least 4 characters');
      return;
    }

    const users = getStoredUsers();
    const cleanUsername = regUsername.trim().toLowerCase();

    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      setRegError(lang === 'th' ? 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' : 'Username is already taken');
      return;
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      username: regUsername.trim(),
      password: regPassword,
      name: regName.trim() || regUsername.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      avatar: '🎮',
      role: 'customer',
      country: lang === 'th' ? 'th' : 'vn',
      balanceTHB: 0,
      balanceVND: 0,
      joinedDate: new Date().toLocaleDateString('th-TH')
    };

    const updatedUsers = [...users, newUser];
    saveUsersToStorage(updatedUsers);

    setRegSuccess(lang === 'th' ? 'สมัครสมาชิกสำเร็จ! กำลังเข้าสู่ระบบ...' : 'Registered successfully! Logging in...');
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-[#111723] border border-amber-500/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Glowing Accent */}
        <div className="relative p-6 sm:p-7 border-b border-slate-800 bg-gradient-to-r from-amber-500/10 via-slate-900 to-[#111723]">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl shadow-lg pubg-glow">
              👤
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>SIMA Member</span>
                <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded font-black uppercase">
                  PUBG PC
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'th' 
                  ? 'เข้าสู่ระบบเพื่อดูคลังไอดีและรหัสผ่าน Steam ที่ซื้อแล้ว'
                  : 'Sign in to access your purchased PUBG Steam accounts & passwords'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 mt-5">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setLoginError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'login'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'th' ? '🔑 เข้าสู่ระบบ' : '🔑 Sign In'}
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setRegError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'register'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'th' ? '✨ สมัครสมาชิกใหม่' : '✨ Create Account'}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          
          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Quick Demo Test Bar */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>{lang === 'th' ? 'คลิกทดสอบเข้าสู่ระบบด่วน (Demo Customers):' : 'One-Click Demo Customer Login:'}</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('somchai', '1234')}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-amber-300">👑 สมชาย รักการยิง</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">มีประวัติ</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">somchai / 1234 (🇹🇭 ไทย)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('nguyen_pro', '1234')}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-amber-300">⚡ Nguyễn Văn Minh</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">มีประวัติ</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">nguyen_pro / 1234 (🇻🇳 เวียดนาม)</span>
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{loginError}</span>
                </div>
              )}

              {/* Username / Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  {lang === 'th' ? 'ชื่อผู้ใช้ หรือ อีเมล' : 'Username or Email'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-sm">
                    👤
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="เช่น somchai หรือ somchai@gmail.com"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-300">
                    {lang === 'th' ? 'รหัสผ่าน' : 'Password'}
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    (เดโม: 1234)
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-sm">
                    🔒
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-lg pubg-glow transition-all flex items-center justify-center gap-2"
              >
                <span>🚀</span>
                <span>{lang === 'th' ? 'เข้าสู่ระบบทันที' : 'Sign In Now'}</span>
              </button>

            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {regError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <span>✓</span>
                  <span>{regSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">
                    {lang === 'th' ? 'ชื่อผู้ใช้ (Username) *' : 'Username *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. pubg_pro_2026"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">
                    {lang === 'th' ? 'ชื่อ-นามสกุล หรือชื่อเล่น' : 'Full Name / Nickname'}
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น กิตติพงษ์ หรือ Minh"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">
                    {lang === 'th' ? 'อีเมลสำหรับรับข้อมูล' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">
                    {lang === 'th' ? 'เบอร์โทรศัพท์' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    placeholder="08X-XXX-XXXX"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">
                    {lang === 'th' ? 'รหัสผ่าน *' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="อย่างน้อย 4 ตัวอักษร"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">
                    {lang === 'th' ? 'ยืนยันรหัสผ่าน *' : 'Confirm Password *'}
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="กรอกรหัสผ่านซ้ำอีกครั้ง"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-lg pubg-glow transition-all flex items-center justify-center gap-2"
              >
                <span>✨</span>
                <span>{lang === 'th' ? 'ยืนยันการสมัครสมาชิก' : 'Complete Registration'}</span>
              </button>
            </form>
          )}

          {/* Benefits Feature Box */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block mb-2">
              🛡️ {lang === 'th' ? 'สิทธิประโยชน์ของสมาชิก SIMA Shop:' : 'SIMA Member Privileges:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400">✓</span>
                <span>คลังไอดีส่วนตัว ดูรหัสผ่านได้ตลอด 24 ชม.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span>
                <span>รับประกันดึงคืน 100% พร้อมใบเสร็จออเดอร์</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-blue-400">✓</span>
                <span>คัดลอกรหัส Steam & เมลแรกในคลิกเดียว</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400">✓</span>
                <span>รับสิทธิพิเศษและโปรโมชั่นลดราคาก่อนใคร</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

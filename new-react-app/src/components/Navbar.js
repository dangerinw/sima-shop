import React from 'react';

export default function Navbar({ 
  currency, 
  setCurrency, 
  lang, 
  setLang, 
  t, 
  onSearchFocus, 
  onOpenAdmin,
  currentUser,
  onOpenUserAuth,
  onOpenUserPurchases,
  onUserLogout,
  userPurchasedCount = 0
}) {
  return (
    <>
      {/* Top Banner Announcement */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-black text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
        <span className="inline-block animate-pulse">🔥</span>
        <span>{t.announcement}</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* LOGO: SIMA SHOP */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-2xl shadow-lg pubg-glow tracking-tighter">
              S
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-wider text-white flex items-center gap-1.5">
                SIMA<span className="text-amber-400">SHOP</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">PUBG PC</span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-1 font-medium tracking-wide">{t.brandSub}</p>
            </div>
          </div>

          {/* NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <a href="#hero" className="text-amber-400 font-semibold transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              {t.navHome}
            </a>
            <a href="#catalog" className="text-slate-300 hover:text-white transition-colors">{t.navCatalog}</a>
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">{t.navWarranty}</a>
            <a href="#reviews" className="text-slate-300 hover:text-white transition-colors">{t.navReviews}</a>
            <a href="#faq" className="text-slate-300 hover:text-white transition-colors">{t.navFaq}</a>
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* ADMIN BUTTON */}
            <button
              onClick={onOpenAdmin}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="เข้าสู่หน้าผู้ดูแลระบบ"
            >
              <span>⚙️</span>
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* LANGUAGE SWITCHER */}
            <div className="flex bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs font-semibold">
              <button 
                onClick={() => setLang('th')} 
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${lang === 'th' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'}`}
                title="ภาษาไทย"
              >
                <span>🇹🇭</span>
                <span>TH</span>
              </button>
              <button 
                onClick={() => setLang('en')} 
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${lang === 'en' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'}`}
                title="English"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            {/* CURRENCY TOGGLE */}
            <div className="hidden sm:flex bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs font-semibold">
              <button 
                onClick={() => setCurrency('VND')} 
                className={`px-2.5 py-1 rounded-md transition-all ${currency === 'VND' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'}`}
              >
                ₫ VND
              </button>
              <button 
                onClick={() => setCurrency('THB')} 
                className={`px-2.5 py-1 rounded-md transition-all ${currency === 'THB' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'}`}
              >
                ฿ THB
              </button>
            </div>

            {/* SEARCH TRIGGER */}
            <button 
              onClick={onSearchFocus} 
              aria-label="Search"
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>

            {/* CUSTOMER SECTION: LOGGED IN VS LOGGED OUT ⭐ */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* My Purchases Button with badge count */}
                <button
                  onClick={onOpenUserPurchases}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/50 text-amber-300 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                  title="ดูคลังไอดีและรหัสผ่าน Steam ที่ซื้อแล้ว"
                >
                  <span className="text-sm">📦</span>
                  <span className="hidden md:inline">คลังไอดีของฉัน</span>
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[11px] font-black flex items-center justify-center">
                    {userPurchasedCount}
                  </span>
                </button>

                {/* User Profile Pill */}
                <div 
                  onClick={onOpenUserPurchases}
                  className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 cursor-pointer hover:border-amber-500/60 transition-all"
                  title="คลิกเพื่อเปิดคลังไอดี"
                >
                  <span className="text-base">{currentUser.avatar || '👑'}</span>
                  <span className="text-xs font-bold text-white max-w-[80px] sm:max-w-[110px] truncate">
                    {currentUser.name || currentUser.username}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onUserLogout}
                  className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-rose-950/80 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-all text-xs"
                  title="ออกจากระบบ (Sign Out)"
                >
                  🚪
                </button>
              </div>
            ) : (
              /* LOGIN / SIGN IN BUTTON */
              <button 
                onClick={onOpenUserAuth}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md pubg-glow whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span>{lang === 'th' ? 'เข้าสู่ระบบ / สมาชิก' : t.loginBtn}</span>
              </button>
            )}

          </div>

        </div>
      </header>
    </>
  );
}

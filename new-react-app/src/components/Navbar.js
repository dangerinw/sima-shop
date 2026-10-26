import React, { useState } from 'react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Banner Announcement */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-black text-[11px] sm:text-xs font-bold py-1.5 px-3 sm:px-4 text-center flex items-center justify-center gap-2 shadow-inner">
        <span className="inline-block animate-pulse shrink-0">🔥</span>
        <span className="truncate max-w-[85vw] sm:max-w-none">{t.announcement}</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#0b0f17]/95 backdrop-blur-md border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* LOGO: SIMA SHOP */}
          <a href="#hero" className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-xl sm:text-2xl shadow-lg pubg-glow tracking-tighter shrink-0 transition-transform group-hover:scale-105">
              S
            </div>
            <div className="shrink-0">
              <div className="text-lg sm:text-xl font-extrabold tracking-wider text-white flex items-center gap-1.5 whitespace-nowrap">
                SIMA<span className="text-amber-400">SHOP</span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">PUBG PC</span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400 -mt-0.5 font-medium tracking-wide whitespace-nowrap">{t.brandSub}</p>
            </div>
          </a>

          {/* DESKTOP NAV LINKS (xl screens: strictly whitespace-nowrap, never awkward breaks) */}
          <nav className="hidden xl:flex items-center gap-5 2xl:gap-6 text-sm font-medium shrink-0">
            <a href="#hero" className="text-amber-400 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <span>{t.navHome}</span>
            </a>
            <a href="#catalog" className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">{t.navCatalog}</a>
            <a href="#features" className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">{t.navWarranty}</a>
            <a href="#reviews" className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">{t.navReviews}</a>
            <a href="#faq" className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">{t.navFaq}</a>
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* ADMIN BUTTON (Desktop / Laptop) */}
            <button
              onClick={onOpenAdmin}
              className="hidden lg:flex px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black border border-amber-500/40 text-xs font-bold transition-all items-center gap-1.5 shadow-sm whitespace-nowrap"
              title="เข้าสู่หน้าผู้ดูแลระบบ"
            >
              <span>⚙️</span>
              <span>Admin</span>
            </button>

            {/* LANGUAGE SWITCHER */}
            <div className="flex bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs font-semibold shrink-0">
              <button 
                onClick={() => setLang('th')} 
                className={`px-1.5 sm:px-2 py-1 rounded-md transition-all flex items-center gap-1 ${lang === 'th' ? 'bg-amber-500 text-black shadow font-bold' : 'text-slate-400 hover:text-white'}`}
                title="ภาษาไทย"
              >
                <span>🇹🇭</span>
                <span>TH</span>
              </button>
              <button 
                onClick={() => setLang('en')} 
                className={`px-1.5 sm:px-2 py-1 rounded-md transition-all flex items-center gap-1 ${lang === 'en' ? 'bg-amber-500 text-black shadow font-bold' : 'text-slate-400 hover:text-white'}`}
                title="English"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            {/* CURRENCY TOGGLE (Desktop/Tablet) */}
            <div className="hidden lg:flex bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs font-semibold shrink-0">
              <button 
                onClick={() => setCurrency('THB')} 
                className={`px-2 sm:px-2.5 py-1 rounded-md transition-all ${currency === 'THB' ? 'bg-amber-500 text-black shadow font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                ฿ THB
              </button>
              <button 
                onClick={() => setCurrency('VND')} 
                className={`px-2 sm:px-2.5 py-1 rounded-md transition-all ${currency === 'VND' ? 'bg-amber-500 text-black shadow font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                ₫ VND
              </button>
            </div>

            {/* SEARCH TRIGGER */}
            <button 
              onClick={onSearchFocus} 
              aria-label="Search"
              className="p-1.5 sm:p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-amber-400 transition-colors shrink-0"
              title="ค้นหาไอดี PUBG"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>

            {/* CUSTOMER SECTION: LOGGED IN VS LOGGED OUT */}
            {currentUser ? (
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {/* My Purchases Button with badge count */}
                <button
                  onClick={onOpenUserPurchases}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/50 text-amber-300 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                  title="ดูคลังไอดีและรหัสผ่าน Steam ที่ซื้อแล้ว"
                >
                  <span className="text-sm">📦</span>
                  <span className="hidden sm:inline">คลังของฉัน</span>
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-500 text-black text-[10px] sm:text-[11px] font-black flex items-center justify-center">
                    {userPurchasedCount}
                  </span>
                </button>

                {/* User Profile Pill */}
                <div 
                  onClick={onOpenUserPurchases}
                  className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-2 sm:px-2.5 py-1.5 cursor-pointer hover:border-amber-500/60 transition-all shrink-0"
                  title="คลิกเพื่อเปิดคลังไอดี"
                >
                  <span className="text-sm sm:text-base">{currentUser.avatar || '👑'}</span>
                  <span className="text-xs font-bold text-white max-w-[70px] sm:max-w-[100px] truncate hidden xs:inline">
                    {currentUser.name || currentUser.username}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onUserLogout}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-900 hover:bg-rose-950/80 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-all text-xs shrink-0"
                  title="ออกจากระบบ (Sign Out)"
                >
                  🚪
                </button>
              </div>
            ) : (
              /* LOGIN / SIGN IN BUTTON */
              <button 
                onClick={onOpenUserAuth}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md pubg-glow whitespace-nowrap shrink-0"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span>{lang === 'th' ? 'เข้าสู่ระบบ' : t.loginBtn}</span>
              </button>
            )}

            {/* MOBILE / TABLET MENU TOGGLE BUTTON (shown on < xl) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-amber-400 transition-colors shrink-0 ml-1"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

          </div>

        </div>

        {/* MOBILE / TABLET EXPANDABLE DRAWER */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#0d121c]/98 border-t border-slate-800/80 px-4 pt-3 pb-5 space-y-3 shadow-2xl backdrop-blur-lg animate-fadeIn">
            <nav className="flex flex-col space-y-1.5 text-sm font-medium">
              <a 
                href="#hero" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 font-bold flex items-center gap-2.5 border border-amber-500/20"
              >
                <span>🏠</span>
                <span>{t.navHome}</span>
              </a>
              <a 
                href="#catalog" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800/60 hover:text-white flex items-center gap-2.5 transition-colors"
              >
                <span>🎮</span>
                <span>{t.navCatalog}</span>
              </a>
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800/60 hover:text-white flex items-center gap-2.5 transition-colors"
              >
                <span>🛡️</span>
                <span>{t.navWarranty}</span>
              </a>
              <a 
                href="#reviews" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800/60 hover:text-white flex items-center gap-2.5 transition-colors"
              >
                <span>⭐</span>
                <span>{t.navReviews}</span>
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800/60 hover:text-white flex items-center gap-2.5 transition-colors"
              >
                <span>❓</span>
                <span>{t.navFaq}</span>
              </a>
            </nav>

            {/* Mobile Actions: Currency & Admin Access */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">สกุลเงิน:</span>
                <div className="flex bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 font-bold">
                  <button
                    onClick={() => setCurrency('THB')}
                    className={`px-2.5 py-1 rounded-md transition-all ${currency === 'THB' ? 'bg-amber-500 text-black shadow' : 'text-slate-400'}`}
                  >
                    ฿ THB
                  </button>
                  <button
                    onClick={() => setCurrency('VND')}
                    className={`px-2.5 py-1 rounded-md transition-all ${currency === 'VND' ? 'bg-amber-500 text-black shadow' : 'text-slate-400'}`}
                  >
                    ₫ VND
                  </button>
                </div>
              </div>

              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 hover:text-black text-amber-400 border border-amber-500/30 font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>⚙️</span>
                <span>เข้าสู่ระบบแอดมิน</span>
              </button>
            </div>
          </div>
        )}

      </header>
    </>
  );
}

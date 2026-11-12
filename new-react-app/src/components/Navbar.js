import React, { useState } from 'react';

export default function Navbar({ 
  currency, 
  setCurrency, 
  lang, 
  setLang, 
  t, 
  onSearchFocus, 
  onOpenAdmin,
  storeSettings = {}
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Banner Announcement */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-black text-[11px] sm:text-xs font-bold py-1.5 px-3 sm:px-4 text-center flex items-center justify-center gap-2 shadow-inner overflow-hidden">
        <span className="inline-block animate-pulse shrink-0">🔥</span>
        <span className="truncate max-w-[90vw] sm:max-w-none">{t.announcement}</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#0b0f17]/95 backdrop-blur-md border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* LOGO: PUBG SIAM */}
          <a href="#hero" className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-xl sm:text-2xl shadow-lg pubg-glow tracking-tighter shrink-0 transition-transform group-hover:scale-105">
              PS
            </div>
            <div className="shrink-0">
              <div className="text-base sm:text-xl font-extrabold tracking-wider text-white flex items-center gap-1.5 whitespace-nowrap">
                PUBG<span className="text-amber-400"> SIAM</span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">PUBG PC</span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400 -mt-0.5 font-medium tracking-wide whitespace-nowrap">{t.brandSub}</p>
            </div>
          </a>

          {/* DESKTOP NAV LINKS (lg and up) */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium shrink-0">
            <a href="#hero" className="text-amber-400 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <span>{t.navHome}</span>
            </a>
            <a href="#catalog" className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">{t.navCatalog}</a>
            <a href="#features" className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">{t.navWarranty}</a>
            <a href="#reviews" className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">{t.navReviews}</a>
            <a href="#faq" className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">{t.navFaq}</a>
          </nav>

          {/* RIGHT ACTIONS: Social contact + Language + Currency + Search + Admin + Mobile toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* SUNSNAPPZ BADGE (Trade Manager) */}
            <a 
              href={storeSettings.facebookPageUrl || 'https://www.facebook.com/profile.php?id=61596307388431'} 
              target="_blank" 
              rel="noreferrer" 
              className="hidden xl:inline-flex items-center gap-2 bg-[#121824] hover:bg-slate-800 border border-amber-500/30 hover:border-amber-400 px-2.5 py-1.5 rounded-xl transition-all shadow-md group"
              title="ผู้ดูแลการซื้อขาย: SunsnappZ (Facebook)"
            >
              <img 
                src="/images/sunsnappz-logo.png" 
                alt="SunsnappZ" 
                className="w-7 h-7 object-contain drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)] group-hover:scale-110 transition-transform" 
              />
              <div className="text-left leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-white">SunsnappZ</span>
                  <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500 text-black font-extrabold uppercase">แอดมิน</span>
                </div>
                <div className="text-[10px] text-blue-400 font-semibold mt-0.5">Facebook</div>
              </div>
            </a>

            {/* AWESOMEZ SHOP BADGE (Discord Shop & Community) */}
            <a 
              href={storeSettings.discordInviteUrl || 'https://discord.gg/p9fHwmMUPd'} 
              target="_blank" 
              rel="noreferrer" 
              className="hidden xl:inline-flex items-center gap-2 bg-[#121824] hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-400 px-2.5 py-1.5 rounded-xl transition-all shadow-md group"
              title="ร้านค้า & คอมมูนิตี้: AWESOMEZ SHOP (Discord)"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center p-1 border border-indigo-500/30">
                <img 
                  src="/images/awesomez-shop-logo.png" 
                  alt="AWESOMEZ SHOP" 
                  className="w-full h-auto object-contain brightness-110 group-hover:scale-110 transition-transform" 
                />
              </div>
              <div className="text-left leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-black text-white">AWESOMEZ</span>
                  <span className="text-[8px] px-1 py-0.2 rounded bg-indigo-500 text-white font-extrabold uppercase">Shop</span>
                </div>
                <div className="text-[10px] text-indigo-400 font-semibold mt-0.5">Discord</div>
              </div>
            </a>

            {/* FACEBOOK CONTACT BUTTON */}
            <a 
              href={storeSettings.facebookPageUrl || 'https://www.facebook.com/profile.php?id=61596307388431'} 
              target="_blank" 
              rel="noreferrer" 
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold whitespace-nowrap bg-blue-500/10 hover:bg-blue-600 hover:text-white text-blue-400 px-2.5 py-1.5 rounded-lg border border-blue-500/30 transition-all shadow-sm"
              title="ติดต่อสั่งซื้อผ่าน Facebook: SunsnappZ"
            >
              <span>📘</span>
              <span className="hidden md:inline">Facebook</span>
            </a>

            {/* DISCORD CONTACT BUTTON */}
            <a 
              href={storeSettings.discordInviteUrl || 'https://discord.gg/p9fHwmMUPd'} 
              target="_blank" 
              rel="noreferrer" 
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold whitespace-nowrap bg-indigo-500/10 hover:bg-indigo-600 hover:text-white text-indigo-400 px-2.5 py-1.5 rounded-lg border border-indigo-500/30 transition-all shadow-sm"
              title="ติดต่อสั่งซื้อผ่าน Discord"
            >
              <span>💜</span>
              <span className="hidden md:inline">Discord</span>
            </a>

            {/* LANGUAGE SWITCHER */}
            <div className="flex bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs font-semibold shrink-0">
              <button 
                onClick={() => setLang('th')} 
                className={`px-1.5 sm:px-2 py-1 rounded-md transition-all flex items-center gap-1 ${lang === 'th' ? 'bg-amber-500 text-black shadow font-bold' : 'text-slate-400 hover:text-white'}`}
                title="ภาษาไทย"
              >
                <span>🇹🇭</span>
                <span className="hidden xs:inline">TH</span>
              </button>
              <button 
                onClick={() => setLang('en')} 
                className={`px-1.5 sm:px-2 py-1 rounded-md transition-all flex items-center gap-1 ${lang === 'en' ? 'bg-amber-500 text-black shadow font-bold' : 'text-slate-400 hover:text-white'}`}
                title="English"
              >
                <span>🇬🇧</span>
                <span className="hidden xs:inline">EN</span>
              </button>
            </div>

            {/* CURRENCY TOGGLE (Desktop/Tablet) */}
            <div className="hidden sm:flex bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs font-semibold shrink-0">
              <button 
                onClick={() => setCurrency('THB')} 
                className={`px-2 py-1 rounded-md transition-all ${currency === 'THB' ? 'bg-amber-500 text-black shadow font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                ฿ THB
              </button>
              <button 
                onClick={() => setCurrency('VND')} 
                className={`px-2 py-1 rounded-md transition-all ${currency === 'VND' ? 'bg-amber-500 text-black shadow font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                ₫ VND
              </button>
            </div>

            {/* SEARCH TRIGGER */}
            <button 
              onClick={onSearchFocus} 
              aria-label="Search"
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-amber-400 transition-colors shrink-0"
              title="ค้นหาไอดี PUBG"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>

            {/* ADMIN BUTTON */}
            <button
              onClick={onOpenAdmin}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0"
              title="เข้าสู่หน้าผู้ดูแลระบบ"
            >
              <span>⚙️</span>
              <span className="hidden xs:inline">Admin</span>
            </button>

            {/* MOBILE / TABLET MENU TOGGLE BUTTON */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-amber-400 transition-colors shrink-0"
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
          <div className="lg:hidden bg-[#0d121c]/98 border-t border-slate-800/80 px-4 pt-3 pb-5 space-y-3 shadow-2xl backdrop-blur-lg">
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

              {/* Trade Manager Card 1: SunsnappZ in Mobile Menu */}
              <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img 
                    src="/images/sunsnappz-logo.png" 
                    alt="SunsnappZ" 
                    className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)] shrink-0" 
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-white">SunsnappZ</span>
                      <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.2 rounded font-extrabold">ผู้ดูแลการซื้อขาย</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">โอนย้าย Steam ปลอดภัย 100%</p>
                  </div>
                </div>
                <a
                  href={storeSettings.facebookPageUrl || 'https://www.facebook.com/profile.php?id=61596307388431'}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow"
                >
                  <span>📘</span>
                  <span>Facebook</span>
                </a>
              </div>

              {/* Trade Manager Card 2: AWESOMEZ SHOP in Mobile Menu */}
              <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center p-1.5 shrink-0 border border-indigo-500/20">
                    <img src="/images/awesomez-shop-logo.png" alt="AWESOMEZ SHOP" className="w-full h-auto object-contain brightness-110" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-white">AWESOMEZ SHOP</span>
                      <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.2 rounded font-extrabold">Discord Shop</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">คอมมูนิตี้ & เปิดตั๋วสั่งซื้อ 24 ชม.</p>
                  </div>
                </div>
                <a
                  href={storeSettings.discordInviteUrl || 'https://discord.gg/p9fHwmMUPd'}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow"
                >
                  <span>💜</span>
                  <span>Discord</span>
                </a>
              </div>
              <a
                href={storeSettings.discordInviteUrl || 'https://discord.gg/p9fHwmMUPd'}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 font-bold flex items-center gap-2.5 transition-colors"
              >
                <span>💜</span>
                <span>Discord Server สั่งซื้อ & ซัพพอร์ต</span>
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
                <span>Admin Login</span>
              </button>
            </div>
          </div>
        )}

      </header>
    </>
  );
}

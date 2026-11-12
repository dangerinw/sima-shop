import React from 'react';

export default function HeroBanner({ currency, lang, t, onOpenAccount, hotAccount, deliveredCount = 0, storeSettings = {} }) {
  const formatPrice = (vnd, thb) => {
    if (currency === 'THB') {
      return `฿${thb.toLocaleString()}`;
    }
    return `${vnd.toLocaleString()} ₫`;
  };

  const hotTitle = hotAccount ? (lang === 'th' ? hotAccount.title_th : hotAccount.title_en) : '';
  const hotSubtitle = hotAccount ? (lang === 'th' ? hotAccount.subtitle_th : hotAccount.subtitle_en) : '';
  const hotPlaytime = hotAccount ? (lang === 'th' ? hotAccount.playtime_th : hotAccount.playtime_en) : '';

  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-800/50">
      {/* Background glow accents */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Presentation */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {t.heroBadge}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              {t.heroTitle1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500">PUBG PC</span><br className="hidden sm:inline" />
              {t.heroTitle2} <span className="underline decoration-amber-500 underline-offset-8">{t.heroTitleHighlight}</span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t.heroDesc}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a 
                href="#catalog" 
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-base shadow-xl pubg-glow transition-all flex items-center gap-2 group"
              >
                <span>{t.heroBtnExplore}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </a>
              <a 
                href="#features" 
                className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-base border border-slate-700 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <span>{t.heroBtnWarranty}</span>
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-2xl font-black text-white">
                  {typeof deliveredCount === 'number' 
                    ? (deliveredCount > 0 ? `${deliveredCount.toLocaleString()}+` : '0') 
                    : (deliveredCount || '0')}
                </div>
                <div className="text-xs text-slate-400 font-medium">{t.statDelivered}</div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-400">100%</div>
                <div className="text-xs text-slate-400 font-medium">{t.statOriginalMail}</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400">Zero VAC</div>
                <div className="text-xs text-slate-400 font-medium">{t.statNoVac}</div>
              </div>
            </div>

            {/* Two Prestigious Manager Showcase Cards: SunsnappZ & AWESOMEZ SHOP */}
            <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto lg:mx-0">
              
              {/* Card 1: SunsnappZ (Trade Manager) */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#0d131f] via-[#141b2b] to-[#0b0e14] border border-amber-500/40 shadow-xl shadow-amber-950/20 flex flex-col justify-between gap-3 hover:border-amber-400/80 transition-all">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    ผู้ดูแลการซื้อขาย
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wider">OFFICIAL ESCROW</span>
                </div>

                <div className="flex items-center gap-3.5 my-1">
                  <div 
                    style={{ width: '72px', height: '72px', minWidth: '72px', minHeight: '72px' }}
                    className="rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-center p-1.5 shadow-inner shrink-0"
                  >
                    <img 
                      src="/images/sunsnappz-logo.png" 
                      alt="SunsnappZ" 
                      style={{ width: '60px', height: '60px', maxWidth: '60px', maxHeight: '60px' }}
                      className="object-contain drop-shadow-[0_4px_16px_rgba(245,158,11,0.35)] hover:scale-105 transition-transform" 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-wide leading-tight truncate">
                      SunsnappZ
                    </h3>
                    <p className="text-xs text-amber-400 font-bold mt-0.5">
                      คนดูแลการซื้อขายทางการ
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      ตรวจเช็กคลัง & ส่งมอบไอดี ปลอดภัย 100%
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2.5">
                  ดูแลความปลอดภัยทุกขั้นตอน ตรวจเช็กคลังจริง โอนย้าย Steam ปลอดภัย 100%
                </p>
              </div>

              {/* Card 2: AWESOMEZ SHOP (Store & Community Manager) */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#0d131f] via-[#15172b] to-[#0b0e14] border border-indigo-500/40 shadow-xl shadow-indigo-950/20 flex flex-col justify-between gap-3 hover:border-indigo-400/80 transition-all">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                    ร้านค้าผู้ดูแล
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wider">OFFICIAL PARTNER</span>
                </div>

                <div className="flex items-center gap-3.5 my-1">
                  <div 
                    style={{ height: '72px', minHeight: '72px' }}
                    className="px-3 rounded-2xl bg-slate-950/80 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-inner"
                  >
                    <img 
                      src="/images/awesomez-shop-logo.png" 
                      alt="AWESOMEZ SHOP" 
                      style={{ height: '32px', width: 'auto', maxWidth: '130px' }}
                      className="object-contain brightness-110 drop-shadow-[0_2px_10px_rgba(99,102,241,0.5)] hover:scale-105 transition-transform" 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-wide leading-tight truncate">
                      AWESOMEZ SHOP
                    </h3>
                    <p className="text-xs text-indigo-400 font-bold mt-0.5">
                      ร้านค้าทางการ & ทีมงาน
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      ดูแลระบบสต็อก คัดสรรไอดีคุณภาพ ปลอดภัย 24 ชม.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2.5">
                  ทีมงานดูแลระบบ สต็อกไอดีคุณภาพสูง พร้อมบริการดูแลลูกค้าตลอด 24 ชม.
                </p>
              </div>

            </div>
          </div>

          {/* Right Spotlight: Hot Deal Card */}
          {hotAccount && (
            <div className="lg:col-span-5 relative">
              <div className="relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-amber-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
                {/* Badge */}
                <div className="absolute -top-3.5 right-6 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-xs uppercase tracking-wider shadow-md">
                  {t.hotDealBadge}
                </div>

                <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[16/10] mb-5 border border-slate-700/60 group">
                  <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-amber-950/40 to-slate-800 flex items-center justify-center relative">
                    <div className="text-center p-4">
                      <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-bold border border-amber-500/30 mb-2">
                        STEAM PC • PROGRESSIVE MAX
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-white tracking-wide leading-tight">{hotTitle}</div>
                      <div className="text-xs text-slate-300 mt-1 line-clamp-1">{hotSubtitle}</div>
                    </div>
                  </div>
                  <span className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {t.hotDealDelivery}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-5">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">{t.specPlaytime}</span>
                    <span className="font-bold text-white">{hotPlaytime}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">{t.specRank}</span>
                    <span className="font-bold text-amber-400">{hotAccount.rank}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-xs text-slate-500 line-through">
                      {formatPrice(hotAccount.originalPriceVND, hotAccount.originalPriceTHB)}
                    </span>
                    <div className="text-2xl font-black text-amber-400">
                      {formatPrice(hotAccount.priceVND, hotAccount.priceTHB)}
                    </div>
                  </div>
                  <button 
                    onClick={() => onOpenAccount(hotAccount)}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all shadow-md"
                  >
                    {t.btnViewAndBuy}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

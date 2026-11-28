import React from 'react';

export default function HeroBanner({ currency, lang, t, onOpenAccount, hotAccount, deliveredCount = 0, storeSettings = {}, onOpenRules }) {
  const formatPrice = (vnd, thb) => {
    if (currency === 'THB') {
      return `฿${thb.toLocaleString()}`;
    }
    return `${vnd.toLocaleString()} ₫`;
  };

  const hotTitle = hotAccount ? (lang === 'th' ? hotAccount.title_th : hotAccount.title_en) : '';
  const hotSubtitle = hotAccount ? (lang === 'th' ? hotAccount.subtitle_th : hotAccount.subtitle_en) : '';
  const hotPlaytime = hotAccount ? (lang === 'th' ? hotAccount.playtime_th : hotAccount.playtime_en) : '';

  const displayDelivered = (typeof deliveredCount === 'number' && deliveredCount > 0)
    ? `${deliveredCount.toLocaleString()}+`
    : '1,850+';

  const accountImg = hotAccount?.coverImg || 
    (hotAccount?.images && hotAccount.images.length > 0 ? hotAccount.images[0] : null) || 
    '/images/hot-deal-showcase.jpg';

  const discountPercent = (hotAccount?.originalPriceTHB && hotAccount?.priceTHB && hotAccount.originalPriceTHB > hotAccount.priceTHB)
    ? Math.round(((hotAccount.originalPriceTHB - hotAccount.priceTHB) / hotAccount.originalPriceTHB) * 100)
    : 0;

  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-purple-900/40">
      {/* Background glow accents matching new Royal Purple & Amber Gold theme */}
      <div className="absolute -top-32 left-1/3 -translate-x-1/2 w-[700px] h-[350px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Presentation */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/15 via-fuchsia-500/15 to-amber-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <img src="/images/pubg-siam-logo.png" alt="" className="w-4 h-4 object-contain" />
              <span>{t.heroBadge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              {t.heroTitle1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-400">PUBG PC</span><br className="hidden sm:inline" />
              {t.heroTitle2} <span className="underline decoration-purple-500 underline-offset-8 decoration-4">{t.heroTitleHighlight}</span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t.heroDesc}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a 
                href="#catalog" 
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-base shadow-xl pubg-royal-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
              >
                <span>{t.heroBtnExplore}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </a>
              <a 
                href="#rules" 
                onClick={(e) => {
                  if (onOpenRules) {
                    e.preventDefault();
                    onOpenRules('th');
                  }
                }}
                className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-base border border-slate-700 transition-all flex items-center gap-2"
              >
                <span className="text-amber-400">📜</span>
                <span>{lang === 'th' ? 'กฎการซื้อขาย & การรับประกัน' : 'Trading Rules & Guarantee'}</span>
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-2xl font-black text-white">
                  {displayDelivered}
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
                    <h3 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-wide leading-tight">
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
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#0e101f] via-[#141529] to-[#0a0c16] border border-purple-500/40 shadow-xl shadow-purple-950/20 flex flex-col justify-between gap-3 hover:border-purple-400/80 transition-all">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/40 text-purple-300 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                    ร้านค้าผู้ดูแล
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wider">OFFICIAL PARTNER</span>
                </div>

                <div className="flex items-center gap-3.5 my-1">
                  <div 
                    style={{ width: '72px', height: '72px', minWidth: '72px', minHeight: '72px' }}
                    className="p-1.5 rounded-2xl bg-slate-950/80 border border-purple-500/30 flex items-center justify-center shrink-0 shadow-inner"
                  >
                    <img 
                      src="/images/awesomez-shop-logo.png" 
                      alt="AWESOMEZ SHOP" 
                      style={{ maxHeight: '42px', maxWidth: '58px' }}
                      className="object-contain brightness-110 drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)] hover:scale-105 transition-transform" 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-wide leading-tight break-words">
                      AWESOMEZ SHOP
                    </h3>
                    <p className="text-xs text-purple-400 font-bold mt-0.5">
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
              <div className="relative bg-gradient-to-b from-[#16122b]/95 via-[#0f111e]/95 to-[#0b0c14]/98 border border-purple-500/40 hover:border-amber-400/60 rounded-3xl p-5 sm:p-6 shadow-[0_10px_40px_rgba(147,51,234,0.18)] hover:shadow-[0_15px_50px_rgba(245,158,11,0.22)] backdrop-blur-xl transition-all duration-300 group">
                
                {/* Glowing Aura Accent */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500"></div>

                {/* Hot Deal Badge */}
                <div className="absolute -top-3.5 right-6 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 pubg-gold-glow z-20">
                  <span className="w-2 h-2 rounded-full bg-black animate-ping"></span>
                  <span>{t.hotDealBadge || '⚡ PUBG SIAM HOT DEAL ประจำวัน'}</span>
                </div>

                {/* Real Account Image Showcase ⭐ */}
                <div 
                  onClick={() => onOpenAccount && onOpenAccount(hotAccount)}
                  className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-4 border border-purple-500/30 group-hover:border-amber-400/50 shadow-2xl bg-slate-950 cursor-pointer"
                >
                  <img 
                    src={accountImg} 
                    alt={hotTitle}
                    onError={(e) => { e.currentTarget.src = '/images/hot-deal-showcase.jpg'; }}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  
                  {/* High contrast gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-black/35 pointer-events-none"></div>

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-10">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-black/80 backdrop-blur-md text-amber-300 border border-amber-500/40 shadow-md flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                      STEAM PC • PROGRESSIVE MAX
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-950/85 backdrop-blur-md text-purple-200 border border-purple-500/40 shadow-md">
                      👑 คัดเกรดพรีเมียม
                    </span>
                  </div>

                  {/* Bottom Badges */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-10">
                    <span className="bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      {t.hotDealDelivery || 'โอนย้าย Steam ทันที'}
                    </span>
                    <span className="bg-purple-900/80 group-hover:bg-amber-500 group-hover:text-black transition-colors backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-purple-200 border border-purple-400/40 flex items-center gap-1 shadow">
                      🔍 ดูรูปคลังไอดี
                    </span>
                  </div>
                </div>

                {/* Account Details */}
                <div className="space-y-2.5 mb-4">
                  <div>
                    <h3 
                      onClick={() => onOpenAccount && onOpenAccount(hotAccount)}
                      className="text-lg sm:text-xl font-black text-white hover:text-amber-400 transition-colors cursor-pointer line-clamp-1 leading-snug"
                      title={hotTitle}
                    >
                      {hotTitle}
                    </h3>
                    {hotSubtitle && (
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {hotSubtitle}
                      </p>
                    )}
                  </div>

                  {/* Gun Level / Highlight Pill */}
                  {hotAccount.gunLevel_th && (
                    <div className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-medium flex items-center gap-2">
                      <span className="text-amber-400 shrink-0">🎯</span>
                      <span className="truncate">{hotAccount.gunLevel_th}</span>
                    </div>
                  )}

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 block text-[11px]">{t.specPlaytime || 'ชั่วโมงบิน Steam:'}</span>
                      <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                        <span>⏱️</span> {hotPlaytime || '1,500 ชม.'}
                      </span>
                    </div>
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 block text-[11px]">{t.specRank || 'ระดับแรงค์:'}</span>
                      <span className="font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                        <span>🏆</span> {hotAccount.rank || 'Master'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing & CTA Action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 line-through">
                        {formatPrice(hotAccount.originalPriceVND, hotAccount.originalPriceTHB)}
                      </span>
                      {discountPercent > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          ลด {discountPercent}%
                        </span>
                      )}
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">
                      {formatPrice(hotAccount.priceVND, hotAccount.priceTHB)}
                    </div>
                  </div>

                  <button 
                    onClick={() => onOpenAccount && onOpenAccount(hotAccount)}
                    className="px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-sm transition-all shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0 group/btn cursor-pointer"
                  >
                    <span>{t.btnViewAndBuy || 'ดูรายละเอียด & สั่งซื้อ'}</span>
                    <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
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

import React, { useState, useEffect } from 'react';
import { countryRulesData } from '../data/countryRulesData';
import PosterLightbox from './PosterLightbox';

export default function CountryRulesSection({ lang = 'th', t }) {
  const [selectedCountry, setSelectedCountry] = useState('th');
  const [sectionLang, setSectionLang] = useState(lang);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'poster'
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Sync with global lang if sectionLang not manually changed
  useEffect(() => {
    setSectionLang(lang);
  }, [lang]);

  const currentCountry = countryRulesData[selectedCountry] || countryRulesData.th;
  const isTh = sectionLang === 'th';
  const posterUrl = currentCountry.posterImg?.[sectionLang] || currentCountry.posterImg?.th;

  const toggleLang = () => {
    setSectionLang((prev) => (prev === 'th' ? 'en' : 'th'));
  };

  return (
    <section id="rules" className="py-16 sm:py-20 bg-gradient-to-b from-slate-950 via-[#0d101a] to-slate-950 border-t border-slate-800/80 relative">
      {/* Background neon ambient glows */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3 shadow">
            <span>📜</span>
            <span className="uppercase tracking-wider">
              {isTh ? 'กฎระเบียบและเงื่อนไขการซื้อขาย' : 'Trading Rules & Regulations'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {isTh ? 'กฎการซื้อขายไอดีของ' : 'Account Trading Rules for'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500">
              {isTh ? 'แต่ละประเทศ' : 'Each Country'}
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2.5 max-w-2xl mx-auto leading-relaxed">
            {isTh 
              ? 'โปรดอ่านและทำความเข้าใจกฎระเบียบ 13 ข้อ และเงื่อนไขการรับประกันของแต่ละประเทศ เพื่อความปลอดภัยและรักษาสิทธิ์สูงสุดของคุณ' 
              : 'Please read and understand our 13 terms and warranty guidelines for each country to protect your account and maximize security.'}
          </p>

          {/* Controls: Country Switcher + Language Switcher + View Mode */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {/* Country Tabs */}
            <div className="flex bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1.5 gap-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => setSelectedCountry('th')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
                  selectedCountry === 'th'
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>🇹🇭</span>
                <span>{isTh ? 'ไอดีไทย' : 'Thailand'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCountry('cn')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
                  selectedCountry === 'cn'
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>🇨🇳</span>
                <span>{isTh ? 'ไอดีจีน' : 'China'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCountry('vn')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
                  selectedCountry === 'vn'
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>🇻🇳</span>
                <span>{isTh ? 'ไอดีเวียดนาม' : 'Vietnam'}</span>
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1 text-xs font-bold shadow-xl">
              <button
                type="button"
                onClick={() => setSectionLang('th')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  sectionLang === 'th' ? 'bg-amber-500 text-black shadow font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇹🇭</span>
                <span>TH</span>
              </button>
              <button
                type="button"
                onClick={() => setSectionLang('en')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  sectionLang === 'en' ? 'bg-amber-500 text-black shadow font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            {/* View Mode Toggle (Cards VS Poster) */}
            <div className="flex bg-slate-900/90 border border-purple-500/40 rounded-2xl p-1 text-xs font-bold shadow-xl">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  viewMode === 'cards' ? 'bg-purple-600 text-white shadow font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📋</span>
                <span>{isTh ? 'ข้อความสรุป' : 'Text Rules'}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('poster')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  viewMode === 'poster' ? 'bg-purple-600 text-white shadow font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🖼️</span>
                <span>{isTh ? 'โปสเตอร์ภาพ' : 'Poster'}</span>
              </button>
            </div>

            {/* Fullscreen Poster Lightbox Button */}
            {posterUrl && (
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="px-3.5 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500 hover:text-black text-amber-400 border border-amber-500/40 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow-lg"
                title={isTh ? 'เปิดดูรูปภาพเต็มจอ' : 'Open fullscreen image'}
              >
                <span>🔍</span>
                <span>{isTh ? 'ขยายเต็มจอ' : 'Fullscreen'}</span>
              </button>
            )}
          </div>
        </div>

        {/* POSTER VIEW MODE */}
        {viewMode === 'poster' && posterUrl && (
          <div className="bg-[#0f131d]/90 border border-amber-500/40 rounded-3xl p-4 sm:p-8 shadow-2xl flex flex-col items-center space-y-4">
            <div className="flex items-center justify-between w-full max-w-2xl px-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentCountry.flag}</span>
                <span className="text-sm sm:text-base font-black text-white">
                  {currentCountry.countryName[sectionLang]}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition-all flex items-center gap-1 shadow"
              >
                <span>🔍</span>
                <span>{isTh ? 'คลิกเพื่อขยายดูเต็มจอ' : 'Click to Fullscreen'}</span>
              </button>
            </div>

            <div 
              className="w-full max-w-2xl rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-black cursor-zoom-in group"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img 
                src={posterUrl} 
                alt="Rules Poster" 
                className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]" 
              />
            </div>
          </div>
        )}

        {/* CARDS VIEW MODE */}
        {viewMode === 'cards' && (
          <div className="bg-[#0f131d]/90 border border-slate-800/90 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl space-y-7 relative">
            
            {/* TOP COUNTRY BADGE & NOTICE */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">{currentCountry.flag}</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {currentCountry.countryName[sectionLang]}
                    </h3>
                    <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                      {currentCountry.badge[sectionLang]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isTh ? 'อ่านให้เข้าใจก่อนทำการสั่งซื้อหรือส่งมอบบัญชี' : 'Please read carefully before trading or transferring account'}
                  </p>
                </div>
              </div>

              {/* Country Special Callout Notice */}
              {currentCountry.bannerNotice && (
                <div className={`p-3.5 px-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 max-w-lg ${
                  currentCountry.bannerType === 'danger'
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                    : currentCountry.bannerType === 'warning'
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                }`}>
                  <span className="text-lg shrink-0">
                    {currentCountry.bannerType === 'danger' ? '📢' : currentCountry.bannerType === 'warning' ? '🇨🇳' : '🛡️'}
                  </span>
                  <span className="leading-snug">{currentCountry.bannerNotice[sectionLang]}</span>
                </div>
              )}
            </div>

            {/* 13 RULES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {currentCountry.rules.map((rule) => {
                const isHighlight = rule.highlight;
                return (
                  <div
                    key={rule.id}
                    className={`p-4 rounded-2xl border transition-all flex gap-3.5 ${
                      isHighlight
                        ? 'bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-purple-950/25 border-amber-500/50 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    {/* Number Badge & Icon */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs font-mono shadow ${
                        isHighlight
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black'
                          : 'bg-purple-900/60 border border-purple-500/40 text-purple-200'
                      }`}>
                        {rule.id}
                      </div>
                      <span className="text-xl mt-1 select-none">{rule.icon}</span>
                    </div>

                    {/* Content */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className={`text-sm sm:text-base font-black leading-snug ${
                        isHighlight ? 'text-amber-300' : 'text-white'
                      }`}>
                        {rule.title[sectionLang]}
                      </h4>

                      {rule.desc && (
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {rule.desc[sectionLang]}
                        </p>
                      )}

                      {/* Rule 7 Checklist */}
                      {rule.checklist && (
                        <div className="mt-2 space-y-1 bg-black/50 p-2.5 rounded-xl border border-amber-500/30">
                          {rule.checklist.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-bold text-amber-200">
                              <span className="text-emerald-400 font-bold">✓</span>
                              <span>{item[sectionLang]}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3 BOTTOM POLICY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              
              {/* 1. Item Verification */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-[#141824] to-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-wider">
                    <span>👕</span>
                    <span>{isTh ? 'การตรวจสอบสินค้าในคลัง' : 'Item Verification'}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mt-1 leading-snug">
                    {currentCountry.itemVerification.title[sectionLang]}
                  </h4>
                  <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    {currentCountry.itemVerification.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-1 truncate">
                        <span className="text-amber-400">♦</span>
                        <span className="truncate">{it[sectionLang]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2 italic">
                  {currentCountry.itemVerification.warning[sectionLang]}
                </p>
              </div>

              {/* 2. Buyback Policy */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-950 border border-amber-500/40 space-y-3 flex flex-col justify-between shadow-lg shadow-amber-950/20">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                      <span>💰</span>
                      <span>{isTh ? 'นโยบายรับซื้อคืน' : 'Buyback Policy'}</span>
                    </div>
                    <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                      PUBG SIAM
                    </span>
                  </div>

                  <div className="my-2.5 text-center py-3 bg-slate-900/80 rounded-xl border border-amber-500/30">
                    <span className="text-xs text-slate-400 block">{isTh ? 'รับซื้อคืนสูงสุด' : 'Buyback Rate'}</span>
                    <span className="text-3xl sm:text-4xl font-black text-amber-400">
                      {currentCountry.buybackPolicy.percent}
                    </span>
                    <span className="text-xs text-slate-300 block font-semibold mt-0.5">
                      {isTh ? 'ของราคาที่ซื้อไป' : 'of Purchase Price'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 text-center border-t border-slate-800/80 pt-2 font-medium">
                  {currentCountry.buybackPolicy.period[sectionLang]}
                </div>
              </div>

              {/* 3. Recovery Compensation */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 border border-purple-500/40 space-y-3 flex flex-col justify-between shadow-lg shadow-purple-950/20">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-purple-300 text-xs font-black uppercase tracking-wider">
                      <span>🛡️</span>
                      <span>{isTh ? 'กรณีถูกกู้คืนโดยเจ้าของเดิม' : 'Recovery Compensation'}</span>
                    </div>
                    <span className="text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full">
                      72h
                    </span>
                  </div>

                  <div className="my-2.5 text-center py-3 bg-slate-900/80 rounded-xl border border-purple-500/30">
                    <span className="text-xs text-slate-400 block">{isTh ? 'การันตีเงินคืน' : 'Guarantee'}</span>
                    <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                      100%
                    </span>
                    <span className="text-xs text-slate-300 block font-semibold mt-0.5">
                      {currentCountry.recoveryCompensation.amount[sectionLang]}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-purple-200 text-center border-t border-slate-800/80 pt-2 font-bold flex items-center justify-center gap-1">
                  <span>⏱️</span>
                  <span>{currentCountry.recoveryCompensation.deadline[sectionLang]}</span>
                </div>
              </div>

            </div>

            {/* FOOTER NOTES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {currentCountry.footerNotes.map((note, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="text-lg shrink-0">{note.icon}</span>
                  <span>{note[sectionLang]}</span>
                </div>
              ))}
            </div>

            {/* SAFE BRANDING FOOTER STRIP */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-950 to-amber-950/60 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-amber-400 font-black text-base tracking-wider uppercase flex items-center justify-center sm:justify-start gap-2">
                  <span>🛡️</span>
                  <span>Play Safe with PUBG SIAM</span>
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isTh 
                    ? 'ระบบตัวกลางซื้อขายไอดีเกม PUBG PC (Steam) ที่มีมาตรฐานความปลอดภัยสูงสุด การันตีไม่มีการดึงคืน'
                    : 'Highest security standards for PUBG PC Steam accounts with 100% anti-pullback guarantee.'}
                </p>
              </div>

              {posterUrl && (
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0 hover:scale-105"
                >
                  <span>🔍</span>
                  <span>{isTh ? 'ดูโปสเตอร์ภาพกราฟิกฉบับเต็ม' : 'View Full Infographic Poster'}</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>

      {/* FULLSCREEN POSTER LIGHTBOX VIA PORTAL (Z-INDEX 99999) */}
      <PosterLightbox
        isOpen={isLightboxOpen}
        posterUrl={posterUrl}
        countryName={currentCountry.countryName[sectionLang]}
        flag={currentCountry.flag}
        lang={sectionLang}
        onToggleLang={toggleLang}
        onClose={() => setIsLightboxOpen(false)}
      />

    </section>
  );
}

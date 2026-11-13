import React, { useState, useEffect } from 'react';
import { countryRulesData } from '../data/countryRulesData';
import PosterLightbox from './PosterLightbox';

export default function CountryRulesModal({
  isOpen,
  onClose,
  initialCountry = 'th',
  lang = 'th'
}) {
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [ruleLang, setRuleLang] = useState(lang);
  const [showPosterLightbox, setShowPosterLightbox] = useState(false);

  // Sync initial country and language when opened
  useEffect(() => {
    if (initialCountry) {
      setSelectedCountry(initialCountry);
    }
  }, [initialCountry, isOpen]);

  useEffect(() => {
    if (lang) {
      setRuleLang(lang);
    }
  }, [lang, isOpen]);

  // Lock body scroll when modal or lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setShowPosterLightbox(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentCountry = countryRulesData[selectedCountry] || countryRulesData.th;
  const posterUrl = currentCountry.posterImg?.[ruleLang] || currentCountry.posterImg?.th;

  const isTh = ruleLang === 'th';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Main Modal Box */}
      <div 
        className="relative bg-[#0d1017] border border-amber-500/40 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER BAR */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-[#121622] to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-xl shadow-lg shrink-0">
              📜
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  PUBG SIAM RULES & WARRANTY
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                  {isTh ? 'อ่านให้เข้าใจก่อนซื้อขาย' : 'Please read carefully before trading'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 mt-0.5">
                <span>{isTh ? 'กฎการซื้อขายไอดีแต่ละประเทศ' : 'Account Trading Rules by Country'}</span>
                <span className="text-xs font-normal text-amber-300/80 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  {currentCountry.countryName[ruleLang]}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Rule Language Toggle */}
            <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setRuleLang('th')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  ruleLang === 'th' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="เวอร์ชั่นภาษาไทย"
              >
                <span>🇹🇭</span>
                <span>ไทย</span>
              </button>
              <button
                type="button"
                onClick={() => setRuleLang('en')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  ruleLang === 'en' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="English Version"
              >
                <span>🇬🇧</span>
                <span>ENG</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
              title={isTh ? 'ปิด' : 'Close'}
            >
              ✕
            </button>
          </div>
        </div>

        {/* COUNTRY SELECTOR TABS */}
        <div className="bg-slate-950/80 px-4 sm:px-6 py-2.5 border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold hidden md:inline shrink-0">
              {isTh ? 'เลือกประเทศ:' : 'Select Country:'}
            </span>

            {/* Thailand Tab */}
            <button
              type="button"
              onClick={() => setSelectedCountry('th')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border ${
                selectedCountry === 'th'
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>🇹🇭</span>
              <span>{isTh ? 'ไอดีไทย' : 'Thailand'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                selectedCountry === 'th' ? 'bg-black/20 text-black' : 'bg-slate-800 text-amber-400'
              }`}>
                TH
              </span>
            </button>

            {/* China Tab */}
            <button
              type="button"
              onClick={() => setSelectedCountry('cn')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border ${
                selectedCountry === 'cn'
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>🇨🇳</span>
              <span>{isTh ? 'ไอดีจีน' : 'China'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                selectedCountry === 'cn' ? 'bg-black/20 text-black' : 'bg-slate-800 text-amber-400'
              }`}>
                CN
              </span>
            </button>

            {/* Vietnam Tab */}
            <button
              type="button"
              onClick={() => setSelectedCountry('vn')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border ${
                selectedCountry === 'vn'
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>🇻🇳</span>
              <span>{isTh ? 'ไอดีเวียดนาม' : 'Vietnam'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                selectedCountry === 'vn' ? 'bg-black/20 text-black' : 'bg-slate-800 text-amber-400'
              }`}>
                VN
              </span>
            </button>
          </div>

          {/* View Full Graphic Poster Button */}
          {posterUrl && (
            <button
              type="button"
              onClick={() => setShowPosterLightbox(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 hover:text-white text-xs font-bold border border-purple-500/40 transition-all flex items-center gap-1.5 shrink-0 shadow"
              title={isTh ? 'ดูภาพกราฟิกโปสเตอร์ต้นฉบับ' : 'View original graphic poster'}
            >
              <span>🖼️</span>
              <span className="hidden sm:inline">{isTh ? 'ดูภาพโปสเตอร์ฉบับเต็ม' : 'View Original Poster'}</span>
              <span className="sm:hidden">{isTh ? 'โปสเตอร์' : 'Poster'}</span>
            </button>
          )}
        </div>

        {/* MODAL BODY (Scrollable) */}
        <div className="p-4 sm:p-6 lg:p-7 overflow-y-auto flex-1 space-y-6 text-slate-200 scrollbar-thin scrollbar-thumb-amber-500/50 scrollbar-track-slate-900">
          
          {/* SPECIAL COUNTRY CALLOUT BANNER */}
          {currentCountry.bannerNotice && (
            <div className={`p-4 rounded-2xl border flex items-start gap-3 shadow-lg ${
              currentCountry.bannerType === 'danger'
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                : currentCountry.bannerType === 'warning'
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            }`}>
              <span className="text-2xl shrink-0">
                {currentCountry.bannerType === 'danger' ? '📢' : currentCountry.bannerType === 'warning' ? '🇨🇳' : '🛡️'}
              </span>
              <div>
                <span className="text-xs uppercase font-black tracking-wider block opacity-75">
                  {isTh ? 'เงื่อนไขพิเศษเฉพาะประเทศนี้:' : 'Country Special Condition:'}
                </span>
                <p className="text-sm font-bold mt-0.5 leading-relaxed">
                  {currentCountry.bannerNotice[ruleLang]}
                </p>
              </div>
            </div>
          )}

          {/* 13 RULES GRID */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>🛡️</span>
                <span>{isTh ? 'กฎระเบียบ 13 ข้อ (อ่านให้เข้าใจก่อนซื้อขาย)' : '13 Rules & Regulations (Please read before trade)'}</span>
              </h3>
              <span className="text-xs text-amber-400 font-mono">13 Rules</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
              {currentCountry.rules.map((rule) => {
                const isHighlight = rule.highlight;
                return (
                  <div
                    key={rule.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex gap-3 ${
                      isHighlight
                        ? 'bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-purple-950/30 border-amber-500/50 shadow-md shadow-amber-500/10'
                        : 'bg-[#121622]/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Rule Number & Icon */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs font-mono shadow ${
                        isHighlight 
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black' 
                          : 'bg-purple-900/70 border border-purple-500/40 text-purple-200'
                      }`}>
                        {rule.id}
                      </div>
                      <span className="text-lg mt-1 select-none">{rule.icon}</span>
                    </div>

                    {/* Rule Content */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className={`text-xs sm:text-sm font-black leading-snug ${
                        isHighlight ? 'text-amber-300' : 'text-white'
                      }`}>
                        {rule.title[ruleLang]}
                      </h4>

                      {rule.desc && (
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {rule.desc[ruleLang]}
                        </p>
                      )}

                      {/* Rule 7 Checklist Items */}
                      {rule.checklist && (
                        <div className="mt-2 space-y-1 bg-black/40 p-2.5 rounded-xl border border-amber-500/30">
                          {rule.checklist.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-bold text-amber-200">
                              <span className="text-emerald-400">✓</span>
                              <span>{item[ruleLang]}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3 BOTTOM POLICIES: Item Verification, Buyback, Recovery Compensation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            {/* Box 1: Item Verification */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-[#141824] to-slate-950 border border-slate-800 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-wider mb-1">
                  <span>👕</span>
                  <span>{isTh ? 'การตรวจสอบสินค้าในคลัง' : 'Item Verification'}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                  {currentCountry.itemVerification.title[ruleLang]}
                </h4>
                <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  {currentCountry.itemVerification.items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-1 truncate">
                      <span className="text-amber-400">♦</span>
                      <span className="truncate">{it[ruleLang]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2 italic">
                {currentCountry.itemVerification.warning[ruleLang]}
              </p>
            </div>

            {/* Box 2: Buyback Policy */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-950 border border-amber-500/40 space-y-2.5 flex flex-col justify-between shadow-lg shadow-amber-950/20">
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

                <div className="my-2 text-center py-2 bg-slate-900/80 rounded-xl border border-amber-500/30">
                  <span className="text-xs text-slate-400 block">{isTh ? 'รับซื้อคืนสูงสุด' : 'Buyback Rate'}</span>
                  <span className="text-3xl font-black text-amber-400">
                    {currentCountry.buybackPolicy.percent}
                  </span>
                  <span className="text-[11px] text-slate-300 block font-semibold mt-0.5">
                    {isTh ? 'ของราคาที่ซื้อไป' : 'of Purchase Price'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 text-center border-t border-slate-800/80 pt-2 font-medium">
                {currentCountry.buybackPolicy.period[ruleLang]}
              </div>
            </div>

            {/* Box 3: Recovery Compensation */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 border border-purple-500/40 space-y-2.5 flex flex-col justify-between shadow-lg shadow-purple-950/20">
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

                <div className="my-2 text-center py-2 bg-slate-900/80 rounded-xl border border-purple-500/30">
                  <span className="text-xs text-slate-400 block">{isTh ? 'การันตีเงินคืน' : 'Guarantee'}</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                    100%
                  </span>
                  <span className="text-[11px] text-slate-300 block font-semibold mt-0.5">
                    {currentCountry.recoveryCompensation.amount[ruleLang]}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-purple-200 text-center border-t border-slate-800/80 pt-2 font-bold flex items-center justify-center gap-1">
                <span>⏱️</span>
                <span>{currentCountry.recoveryCompensation.deadline[ruleLang]}</span>
              </div>
            </div>

          </div>

          {/* FOOTER PILLS / IMPORTANT NOTICES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {currentCountry.footerNotes.map((note, idx) => (
              <div 
                key={idx} 
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed"
              >
                <span className="text-base shrink-0">{note.icon}</span>
                <span>{note[ruleLang]}</span>
              </div>
            ))}
          </div>

          {/* PLAY SAFE BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-950 to-amber-950/50 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <span className="text-amber-400 font-black text-sm tracking-wider uppercase">
                Play Safe with PUBG SIAM
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                {isTh 
                  ? 'ระบบตัวกลางซื้อขายไอดีเกม PUBG PC ที่มั่นใจได้ ปลอดภัย ไร้กังวล 100%' 
                  : 'The most trusted PUBG PC Steam account marketplace. 100% Safe and guaranteed.'}
              </p>
            </div>

            {posterUrl && (
              <button
                type="button"
                onClick={() => setShowPosterLightbox(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black shadow-lg transition-transform hover:scale-105 shrink-0 flex items-center gap-1.5"
              >
                <span>🔍</span>
                <span>{isTh ? 'เปิดดูรูปภาพโปสเตอร์' : 'View Full Infographic'}</span>
              </button>
            )}
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{isTh ? 'กฎระเบียบมีผลบังคับใช้ทุกคำสั่งซื้อ' : 'Rules apply to all purchases'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            {isTh ? 'รับทราบและปิด' : 'Understood & Close'}
          </button>
        </div>

      </div>

      {/* LIGHTBOX FOR ORIGINAL INFOGRAPHIC POSTER VIA PORTAL (Z-INDEX 99999) */}
      <PosterLightbox
        isOpen={showPosterLightbox}
        posterUrl={posterUrl}
        countryName={currentCountry.countryName[ruleLang]}
        flag={currentCountry.flag}
        lang={ruleLang}
        onToggleLang={() => setRuleLang(ruleLang === 'th' ? 'en' : 'th')}
        onClose={() => setShowPosterLightbox(false)}
      />

    </div>
  );
}

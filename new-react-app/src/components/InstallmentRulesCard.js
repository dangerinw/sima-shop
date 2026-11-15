import React, { useState } from 'react';
import { sunsnappzInstallmentRules } from '../data/countryRulesData';
import PosterLightbox from './PosterLightbox';
import installmentPosterImg from '../assets/sunsnappz-installment-rules.jpg';

export default function InstallmentRulesCard({ onOpenWarranty, lang = 'th', standalone = false }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const isTh = lang === 'th';
  const rules = sunsnappzInstallmentRules.rules;

  return (
    <>
      <div 
        id="installment-rules-section"
        className="rounded-3xl bg-gradient-to-br from-[#150d28] via-[#0d101d] to-[#1a0f30] border-2 border-purple-500/50 p-5 sm:p-7 shadow-[0_0_50px_rgba(168,85,247,0.22)] relative overflow-hidden"
      >
        {/* Neon Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-600/20 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-[110px] pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-5 border-b border-purple-500/30 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-lg shadow-purple-600/30 shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  SUNSNAPPZ OFFICIAL
                </span>
                <span className="text-[10px] sm:text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  7 ข้อสำคัญ
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
                <span>{isTh ? 'กฎการผ่อนไอดี Sunsnappz' : 'Sunsnappz Installment Rules'}</span>
                <span className="text-purple-400 text-xs sm:text-sm font-normal">
                  ({isTh ? 'เงื่อนไขสัญญาผ่อนชำระไอดี' : 'Official Agreement'})
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="px-3 py-2 rounded-xl bg-purple-600/25 hover:bg-purple-600/45 text-purple-200 hover:text-white font-bold text-xs border border-purple-500/40 transition-all flex items-center gap-1.5 shadow"
              title="ดูภาพโปสเตอร์กราฟิกฉบับเต็ม"
            >
              <span>🖼️</span>
              <span>{isTh ? 'ขยายรูปโปสเตอร์' : 'Enlarge Poster'}</span>
            </button>

            {onOpenWarranty && (
              <button
                type="button"
                onClick={() => onOpenWarranty(null, 'installment')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs transition shadow-lg shadow-purple-600/30 flex items-center gap-1.5 active:scale-95 border border-purple-400/30"
              >
                <span>🛡️</span>
                <span>{isTh ? 'เปิดสัญญาผ่อนไอดี (A4)' : 'Create A4 Contract'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Warning Callout Notice & Thai ID Restriction */}
        <div className="my-4 space-y-2 relative z-10">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/40 text-purple-200 text-xs sm:text-sm font-bold flex items-center gap-2.5">
            <span className="text-xl shrink-0">🇹🇭</span>
            <span className="leading-relaxed">
              {isTh
                ? 'สัญญาผ่อนชำระไอดีสงวนสิทธิ์เฉพาะ "ไอดีไทย" เท่านั้น สำหรับไอดีต่างประเทศ (จีน / เวียดนาม) จำหน่ายแบบชำระสดเต็มจำนวน'
                : 'Installment contracts are strictly reserved for "Thailand Accounts" only. Foreign accounts (China / Vietnam) are cash purchase only.'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-bold flex items-center gap-2.5">
            <span className="text-lg shrink-0">⚠️</span>
            <span className="leading-relaxed">
              {isTh
                ? 'ผู้ผ่อนชำระทุกคนต้องยอมรับเงื่อนไข 7 ข้อนี้อย่างเคร่งครัด เพื่อความปลอดภัยและรักษาสิทธิ์ของท่าน'
                : 'All installment buyers must strictly follow these 7 rules to protect the account and warranty rights.'}
            </span>
          </div>
        </div>

        {/* MAIN BODY: Infographic Poster (Left) + 7 Rule Cards (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10 mt-5">
          
          {/* LEFT COLUMN: Visual Poster with Click-to-Zoom */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div 
              className="w-full max-w-[340px] sm:max-w-[380px] rounded-2xl overflow-hidden border-2 border-purple-500/60 shadow-[0_10px_40px_rgba(168,85,247,0.35)] bg-black group relative cursor-zoom-in transition-all hover:border-purple-400"
              onClick={() => setIsLightboxOpen(true)}
              title="คลิกเพื่อขยายดูรูปภาพฉบับเต็ม"
            >
              <img
                src={installmentPosterImg}
                alt="กฎการผ่อนไอดี Sunsnappz (7 ข้อ)"
                className="w-full h-auto object-contain block transition-transform duration-300 group-hover:scale-[1.02]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/sunsnappz-installment-rules.jpg';
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                <span className="px-3.5 py-2 rounded-xl bg-purple-600/90 text-white font-black text-xs shadow-xl backdrop-blur-md flex items-center gap-1.5 border border-purple-400/50">
                  <span>🔍</span>
                  <span>แตะเพื่อขยายดูโปสเตอร์ฉบับเต็ม</span>
                </span>
              </div>
            </div>
            <p className="text-[11px] text-purple-300/80 mt-2.5 text-center font-medium">
              👆 {isTh ? 'แตะที่รูปเพื่อขยายดูภาพโปสเตอร์คมชัดสูง' : 'Tap image to view high-resolution poster'}
            </p>
          </div>

          {/* RIGHT COLUMN: 7 Rule Cards */}
          <div className="lg:col-span-7 space-y-2.5">
            {rules.map((rule) => {
              const isHighlight = rule.highlight;
              return (
                <div
                  key={rule.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex gap-3 ${
                    isHighlight
                      ? 'bg-purple-950/40 border-purple-500/60 shadow-md shadow-purple-950/30'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-purple-500/40'
                  }`}
                >
                  {/* Number Badge & Icon */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow">
                      {rule.id}
                    </div>
                    <span className="text-lg mt-1 select-none">{rule.icon}</span>
                  </div>

                  {/* Rule Content */}
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-white leading-snug">
                      {rule.title[lang] || rule.title.th}
                    </h4>
                    <p className="text-xs text-purple-200/85 leading-relaxed">
                      {rule.desc[lang] || rule.desc.th}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer Notes */}
        <div className="mt-6 pt-5 border-t border-purple-500/30 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-purple-200/90 relative z-10">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30">
            <span className="text-base shrink-0">⚡</span>
            <span>สัญญาการผ่อนชำระมีผลบังคับใช้ทันทีเมื่อผู้ผ่อนชำระเงินดาวน์งวดแรก</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30">
            <span className="text-base shrink-0">🛡️</span>
            <span>เมื่อผ่อนครบ แอดมินจะดำเนินการโอนย้ายข้อมูลและส่งมอบสิทธิ์ขาดให้ 100%</span>
          </div>
        </div>

      </div>

      {/* Lightbox for Infographic Poster */}
      <PosterLightbox
        isOpen={isLightboxOpen}
        posterUrl={installmentPosterImg}
        countryName="กฎการผ่อนไอดี Sunsnappz (7 ข้อสำคัญ)"
        flag="⚡"
        lang={lang}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}

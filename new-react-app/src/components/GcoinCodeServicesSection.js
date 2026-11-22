import React from 'react';

export default function GcoinCodeServicesSection({ lang = 'th', t = {} }) {
  const isTh = lang === 'th';
  const pageUrl = 'https://www.facebook.com/Allnewcodepubg?locale=th_TH';
  const messengerUrl = 'https://m.me/Allnewcodepubg';

  return (
    <section 
      id="gcoin-codes" 
      className="py-16 sm:py-20 bg-gradient-to-b from-slate-950 via-[#0e1222] to-slate-950 border-t border-b border-slate-800/80 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-blue-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold shadow-sm">
            <img 
              src="/images/allnew-viper-logo.jpg" 
              alt="All New Viper Logo" 
              className="w-5 h-5 rounded-full object-cover border border-amber-400 shrink-0 shadow"
            />
            <span>{isTh ? 'All New Viper Loot Topup • เครือข่ายพาร์ทเนอร์ทางการ' : 'All New Viper Loot Topup • Official Partner'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isTh ? (
              <>
                ต้องการกด <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">Code Item</span> หรือ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">เติม G-Coin</span> PUBG?
              </>
            ) : (
              <>
                Need to Redeem <span className="text-amber-400">Item Codes</span> or <span className="text-blue-400">Top-up G-Coin</span>?
              </>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {isTh
              ? 'สำหรับลูกค้าที่ต้องการซื้อโค้ดสกินลิมิเต็ด, กล่องไอเทมแรร์ หรือเติมเหรียญ G-Coin ราคาพิเศษสุดคุ้ม ปลอดภัย 100% สามารถติดต่อใช้บริการได้โดยตรงที่เพจ "All New Viper Loot Topup (All New Code PUBG)"'
              : 'Looking to purchase limited weapon codes, exclusive skins, or top-up G-Coin at the best discount rates safely? Contact our official partner page "All New Viper Loot Topup" directly!'}
          </p>
        </div>

        {/* 2 MAIN SERVICE CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch mb-10">

          {/* CARD 1: CODE ITEM REDEEM SERVICE */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121829] via-[#0f172a] to-[#141226] border-2 border-amber-500/40 hover:border-amber-400/80 transition-all shadow-xl shadow-amber-950/20 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>

            <div className="space-y-5">
              {/* Card Header */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-2xl shadow-inner">
                    🎟️
                  </div>
                  <div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400 block">
                      {isTh ? 'สกินปืน & ชุดแฟชั่น' : 'Weapon & Outfit Skins'}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {isTh ? 'บริการกด Code Item PUBG' : 'PUBG Item Code Service'}
                    </h3>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
                  ✓ {isTh ? 'โค้ดแท้ 100%' : '100% Genuine'}
                </span>
              </div>

              {/* Service Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isTh
                  ? 'รับกดและจัดหา Code ไอเทมเกม PUBG PC ทุกรูปแบบ ทั้งโค้ดสกินปืน Progressive, BATTLESTAT, ชุดแฟชั่นลิมิเต็ด, เสื้อผ้าอีเวนต์ และคอลแลปส์พิเศษ แลกรับเข้าบัญชี Steam ได้ทันที'
                  : 'Sourcing and redeeming all PUBG PC Steam item codes: Progressive skins, BATTLESTAT, limited event outfits, and special collaboration skins directly to your Steam account.'}
              </p>

              {/* Features List */}
              <div className="space-y-2.5 pt-2">
                {[
                  { icon: '🔫', textTh: 'โค้ดสกินปืน Progressive, โค้ดกล่องสกินลิมิเต็ดหายาก', textEn: 'Progressive weapon codes & rare limited skin crates' },
                  { icon: '👗', textTh: 'โค้ดชุดเซ็ตแฟชั่น, คอลแลปส์ K-Pop, เสื้อผ้าสตรีมเมอร์', textEn: 'Fashion collab sets, K-Pop outfits & streamer skins' },
                  { icon: '🛡️', textTh: 'โค้ดแท้ 100% ปลอดภัย เคลมได้ ไม่มีประวัติถูกแบน', textEn: '100% genuine codes with guarantee & zero ban risk' },
                  { icon: '⚡', textTh: 'อัปเดตโค้ดใหม่ตามแพตช์เกม PUBG ตลอดทุกสัปดาห์', textEn: 'Constant weekly code updates for every PUBG patch' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-base shrink-0">{item.icon}</span>
                    <span>{isTh ? item.textTh : item.textEn}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-6 mt-6 border-t border-slate-800/80">
              <a
                href={pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-950/50 active:scale-98"
              >
                <span>🎟️</span>
                <span>{isTh ? 'สั่งซื้อ / สอบถาม Code Item ทักเพจนี้' : 'Order Item Codes via Facebook'}</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* CARD 2: G-COIN TOP-UP SERVICE */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#101b33] to-[#11192e] border-2 border-blue-500/40 hover:border-blue-400/80 transition-all shadow-xl shadow-blue-950/20 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>

            <div className="space-y-5">
              {/* Card Header */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-2xl shadow-inner">
                    🪙
                  </div>
                  <div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-blue-400 block">
                      {isTh ? 'เรทพิเศษ คุ้มที่สุด' : 'Best Discount Rates'}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {isTh ? 'บริการเติม G-Coin PUBG' : 'PUBG G-Coin Top-up Service'}
                    </h3>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm">
                  ⚡ {isTh ? 'เติมไว ปลอดภัย' : 'Fast & Secure'}
                </span>
              </div>

              {/* Service Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isTh
                  ? 'บริการเติมเหรียญ G-Coin ราคาพิเศษ คุ้มกว่าการกดเติมเองในเกมโดยตรง เหมาะสำหรับผู้เล่นที่ต้องการเปิดกล่องสุ่ม ซื้อ Survivor Pass หรืออัปเลเวลปืน Progressive ได้เหรียญครบ เข้าไว'
                  : 'Top-up PUBG G-Coin at discounted rates much cheaper than in-game store. Ideal for opening crates, purchasing Survivor Passes, and upgrading Progressive weapon levels.'}
              </p>

              {/* Features List */}
              <div className="space-y-2.5 pt-2">
                {[
                  { icon: '💰', textTh: 'ราคาถูกกว่าเติมเองในเกม เซฟเงินได้มากกว่าทุกแพ็ก', textEn: 'Significantly cheaper rates than official in-game store' },
                  { icon: '🚀', textTh: 'ดำเนินการรวดเร็ว ได้รับเหรียญ G-Coin เข้าบัญชีทันใจ', textEn: 'Fast execution with instant G-Coin delivery to your account' },
                  { icon: '🔒', textTh: 'ปลอดภัย 100% ทำรายการถูกต้อง ไม่เสี่ยงโดนล็อกบัญชี', textEn: '100% legal & secure methods with zero account lock risk' },
                  { icon: '🎯', textTh: 'รองรับทุกแพ็กเกจ ทั้งเติมเล่นเบาๆ และแพ็กเกจใหญ่', textEn: 'Supports all package tiers from casual to bulk top-ups' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-base shrink-0">{item.icon}</span>
                    <span>{isTh ? item.textTh : item.textEn}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-6 mt-6 border-t border-slate-800/80">
              <a
                href={pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-950/50 active:scale-98"
              >
                <span>🪙</span>
                <span>{isTh ? 'เติม G-Coin เรทพิเศษ ทักเพจนี้' : 'Top-up G-Coin via Facebook'}</span>
                <span>↗</span>
              </a>
            </div>
          </div>

        </div>

        {/* OFFICIAL PARTNER BANNER STRIP */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-[#10182b] to-slate-900 border-2 border-slate-800/90 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <img 
              src="/images/allnew-viper-logo.jpg" 
              alt="All New Viper Loot Topup" 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-xl drop-shadow-[0_4px_16px_rgba(245,158,11,0.35)] shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base sm:text-lg font-black text-white">
                  All New Viper Loot Topup
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                  <span>✓</span>
                  <span>เพจทางการ Facebook</span>
                </span>
              </div>
              <p className="text-xs text-amber-300 font-semibold mt-0.5">
                Facebook: All New Code PUBG (All New Viper Loot Topup)
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isTh 
                  ? 'เพจพันธมิตรผู้เชี่ยวชาญด้านการกด Code Item & เติม G-Coin ในเครือข่าย PUBG SIAM มั่นใจในความปลอดภัยและเครดิต 100%'
                  : 'Official affiliated partner for PUBG item codes & G-Coin top-ups in PUBG SIAM network.'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
            <a
              href={pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-black transition-all shadow-lg shadow-blue-900/40 border border-blue-400 flex items-center justify-center gap-2 active:scale-95"
            >
              <span>ไปที่เพจ Facebook</span>
              <span>↗</span>
            </a>

            <a
              href={messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-bold transition-all border border-slate-700 flex items-center justify-center gap-2 active:scale-95"
            >
              <span>💬</span>
              <span>ทัก Messenger</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

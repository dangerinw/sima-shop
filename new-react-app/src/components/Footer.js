import React from 'react';

export default function Footer({ t, storeSettings = {}, onOpenRules, onOpenWarranty, lang = 'th' }) {
  const isTh = lang === 'th';
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-10 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-black text-sm">
              PS
            </div>
            <div>
              <span className="text-slate-300 font-bold tracking-wider">PUBG SIAM (PUBG PC Steam Marketplace)</span>
              <p>{t.footerCopy}</p>
            </div>
          </div>

          {/* Trade Manager Badges (Separated) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* SunsnappZ Badge */}
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 shadow-md"
              title="ผู้ดูแลการซื้อขาย: SunsnappZ"
            >
              <img 
                src="/images/sunsnappz-logo.png" 
                alt="SunsnappZ" 
                className="w-7 h-7 object-contain drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)] shrink-0" 
              />
              <div className="text-left leading-tight">
                <span className="text-[10px] text-amber-400 block font-bold">SunsnappZ</span>
                <span className="text-[9px] text-slate-400">ผู้ดูแลการซื้อขาย</span>
              </div>
            </div>

            {/* AWESOMEZ SHOP Badge */}
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-indigo-500/30 shadow-md"
              title="ร้านค้าผู้ดูแล: AWESOMEZ SHOP"
            >
              <div className="h-5 flex items-center justify-center">
                <img src="/images/awesomez-shop-logo.png" alt="AWESOMEZ SHOP" className="h-3.5 w-auto object-contain brightness-110" />
              </div>
              <div className="text-left leading-tight">
                <span className="text-[9px] text-indigo-400 block font-bold">ร้านค้าผู้ดูแล</span>
              </div>
            </div>

            {/* All New Code PUBG Partner Badge */}
            <a 
              href="https://www.facebook.com/Allnewcodepubg?locale=th_TH"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-400/60 shadow-md transition-all group"
              title="บริการกด Code Item & เติม G-Coin: All New Code PUBG"
            >
              <img 
                src="/images/allnew-viper-logo.jpg" 
                alt="All New Viper Loot Topup" 
                className="w-6 h-6 rounded-lg object-cover border border-amber-500/40 shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="text-left leading-tight">
                <span className="text-[10px] text-amber-400 block font-bold group-hover:text-amber-300 transition-colors">All New Code PUBG</span>
                <span className="text-[9px] text-slate-400">กด Code & เติม G-Coin</span>
              </div>
            </a>

            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <span>🛡️</span>
              <span>ประกันมือ 1 แท้ 100%</span>
            </span>
          </div>
        </div>

        {/* Country Rules Quick Links Strip */}
        <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">📜 {isTh ? 'กฎระเบียบการซื้อขายแต่ละประเทศ:' : 'Trading Rules by Country:'}</span>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => onOpenRules ? onOpenRules('th') : (window.location.hash = '#rules')}
                className="hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold"
              >
                <span>🇹🇭</span>
                <span>{isTh ? 'กฎบัญชีไทย' : 'Thailand Rules'}</span>
              </button>
              <span className="text-slate-700">•</span>
              <button
                type="button"
                onClick={() => onOpenRules ? onOpenRules('cn') : (window.location.hash = '#rules')}
                className="hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold"
              >
                <span>🇨🇳</span>
                <span>{isTh ? 'กฎบัญชีจีน' : 'China Rules'}</span>
              </button>
              <span className="text-slate-700">•</span>
              <button
                type="button"
                onClick={() => onOpenRules ? onOpenRules('vn') : (window.location.hash = '#rules')}
                className="hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold"
              >
                <span>🇻🇳</span>
                <span>{isTh ? 'กฎบัญชีเวียดนาม' : 'Vietnam Rules'}</span>
              </button>
              <span className="text-slate-700">•</span>
              <button
                type="button"
                onClick={() => onOpenRules ? onOpenRules('installment') : (window.location.hash = '#rules')}
                className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 font-semibold"
              >
                <span>⚡</span>
                <span>{isTh ? 'กฎผ่อนไอดี (7 ข้อ)' : 'Installment Rules'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onOpenWarranty && (
              <button
                type="button"
                onClick={onOpenWarranty}
                className="text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1"
              >
                <span>🛡️</span>
                <span>{isTh ? 'ใบรับประกัน & สัญญาผ่อนไอดี (A4)' : 'A4 Warranty & Installment Contract'}</span>
              </button>
            )}
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="text-slate-600 hidden sm:block">
              Play Safe with PUBG SIAM • Guaranteed & Escrow Protected
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

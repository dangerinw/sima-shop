import React from 'react';

export default function Footer({ t, storeSettings = {} }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-10 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
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

          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <span>🛡️</span>
            <span>ประกันมือ 1 แท้ 100%</span>
          </span>
        </div>

      </div>
    </footer>
  );
}

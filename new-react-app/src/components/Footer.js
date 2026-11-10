import React from 'react';

export default function Footer({ t, storeSettings = {} }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-10 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-black text-lg">
            S
          </div>
          <div>
            <span className="text-slate-300 font-bold tracking-wider">SIMA SHOP (PUBG PC Steam Marketplace)</span>
            <p>{t.footerCopy}</p>
          </div>
        </div>

        {/* Official Contact Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={storeSettings.facebookPageUrl || 'https://facebook.com/simashoppubg'}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <span>📘</span>
            <span>Facebook Page</span>
          </a>
          <a
            href={storeSettings.discordInviteUrl || 'https://discord.gg/simashop'}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 text-indigo-400 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <span>💜</span>
            <span>Discord Server</span>
          </a>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <span>🛡️</span>
            <span>ประกันมือ 1 แท้ 100%</span>
          </span>
        </div>

      </div>
    </footer>
  );
}

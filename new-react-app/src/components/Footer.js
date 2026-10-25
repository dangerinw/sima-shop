import React from 'react';

export default function Footer({ t }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-10 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-black text-lg">
            S
          </div>
          <div>
            <span className="text-slate-300 font-bold tracking-wider">SIMA SHOP (VN & TH)</span>
            <p>{t.footerCopy}</p>
          </div>
        </div>

        {/* Accepted Payment Badges */}
        <div className="flex flex-wrap items-center gap-2 text-slate-400">
          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px]">PromptPay QR</span>
          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px]">TrueMoney</span>
          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px]">MoMo Wallet</span>
          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px]">VNPAY / Bank</span>
        </div>

      </div>
    </footer>
  );
}

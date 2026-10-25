import React from 'react';

export default function AccountCard({ account, currency, lang, t, onSelect }) {
  const formatPrice = (vnd, thb) => {
    if (currency === 'THB') {
      return `฿${thb.toLocaleString()}`;
    }
    return `${vnd.toLocaleString()} ₫`;
  };

  const title = lang === 'th' ? account.title_th : account.title_en;
  const subtitle = lang === 'th' ? account.subtitle_th : account.subtitle_en;
  const playtime = lang === 'th' ? account.playtime_th : account.playtime_en;
  const gunLevel = lang === 'th' ? account.gunLevel_th : account.gunLevel_en;
  const warranty = lang === 'th' ? account.warranty_th : account.warranty_en;

  // Region Badge Helper
  const getRegionBadge = (region) => {
    switch (region) {
      case 'th':
        return {
          flag: '🇹🇭',
          label: lang === 'th' ? 'ไอดีไทย' : 'Thailand',
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
        };
      case 'cn':
        return {
          flag: '🇨🇳',
          label: lang === 'th' ? 'ไอดีจีน' : 'China',
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
        };
      case 'vn':
        return {
          flag: '🇻🇳',
          label: lang === 'th' ? 'ไอดีเวียดนาม' : 'Vietnam',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        };
      default:
        return {
          flag: '🌐',
          label: 'Global',
          color: 'bg-slate-500/20 text-slate-300 border-slate-500/40'
        };
    }
  };

  const regionInfo = getRegionBadge(account.region);

  return (
    <div className="card-hover bg-[#111723] rounded-2xl border border-slate-800/90 overflow-hidden flex flex-col transition-all">
      {/* Card Header & Thumbnail */}
      <div className={`relative aspect-video ${account.images && account.images.length > 0 ? 'bg-black' : `bg-gradient-to-br ${account.accentColor}`} p-4 flex flex-col justify-between overflow-hidden group`}>
        
        {/* Real Cover Image if uploaded ⭐ */}
        {account.images && account.images.length > 0 && (
          <img
            src={account.images[0]}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
          />
        )}
        
        {/* Dark overlay for high contrast text */}
        {account.images && account.images.length > 0 && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#111723] via-black/40 to-black/60 pointer-events-none"></div>
        )}

        <div className="flex items-center justify-between z-10 gap-2">
          
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold border bg-amber-500/20 text-amber-400 border-amber-500/30 flex items-center gap-1 shadow-sm backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              STEAM PC
            </span>

            {/* Region Country Badge ⭐ */}
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border flex items-center gap-1 shadow-sm backdrop-blur-md ${regionInfo.color}`}>
              <span>{regionInfo.flag}</span>
              <span>{regionInfo.label}</span>
            </span>
          </div>

          <span className="px-2 py-0.5 rounded bg-black/75 text-slate-200 text-[11px] font-mono backdrop-blur-md border border-slate-700/50">
            #{account.id}
          </span>
        </div>

        <div className="z-10">
          <h3 className="font-extrabold text-white text-base sm:text-lg leading-snug line-clamp-1 drop-shadow-md">
            {title}
          </h3>
          <p className="text-xs text-slate-200 line-clamp-1 mt-0.5 drop-shadow">
            {subtitle}
          </p>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {/* Steam Specific Feature Badges */}
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
            🎯 {gunLevel}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
            ⏱️ {playtime}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
            🏆 {account.rank}
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-medium">
            🛡️ {warranty}
          </span>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 line-through">
              {formatPrice(account.originalPriceVND, account.originalPriceTHB)}
            </span>
            <div className="text-lg font-black text-amber-400">
              {formatPrice(account.priceVND, account.priceTHB)}
            </div>
          </div>
          <button 
            onClick={() => onSelect(account)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow"
          >
            {t.btnCardDetails}
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import filterCategoriesData from '../data/filterCategories.json';

const allFilterItemsMap = new Map();
filterCategoriesData.forEach((cat) => {
  cat.items.forEach((it) => {
    if (!allFilterItemsMap.has(it.id)) {
      allFilterItemsMap.set(it.id, it);
    }
  });
});

export default function FilterToolbar({
  activeCategory,
  setActiveCategory,
  activeRegion,
  setActiveRegion,
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  sortBy,
  setSortBy,
  searchInputRef,
  counts,
  t,
  lang = 'th',
  onRefreshStock,
  isStockRefreshing,
  lastStockUpdated,
  totalAccountsCount,
  onOpenItemFilter,
  selectedItemIds = [],
  onRemoveSelectedItem,
  onClearItemFilter
}) {
  const quickTags = [
    { id: 'Progressive', label: t.tagProgressive },
    { id: 'RankReady', label: t.tagRankReady },
    { id: 'BAPE', label: t.tagBape },
    { id: 'Budget', label: t.tagBudget },
  ];

  const selectedItems = (selectedItemIds || [])
    .map((id) => allFilterItemsMap.get(id))
    .filter(Boolean);

  return (
    <section id="catalog" className="py-8 bg-slate-900/60 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Main Controls Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* PC Category Filter Tabs */}
          <div className="flex flex-wrap items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs sm:text-sm font-bold gap-1">
            <button 
              onClick={() => setActiveCategory('all')} 
              className={`px-3.5 py-2 rounded-lg transition-all ${activeCategory === 'all' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'}`}
            >
              {t.catAll} ({counts.all})
            </button>
            <button 
              onClick={() => setActiveCategory('progressive')} 
              className={`px-3.5 py-2 rounded-lg transition-all ${activeCategory === 'progressive' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'}`}
            >
              {t.catProgressive} ({counts.progressive})
            </button>
            <button 
              onClick={() => setActiveCategory('rank-ready')} 
              className={`px-3.5 py-2 rounded-lg transition-all ${activeCategory === 'rank-ready' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'}`}
            >
              {t.catRankReady} ({counts.rankReady})
            </button>
            <button 
              onClick={() => setActiveCategory('rare-skins')} 
              className={`px-3.5 py-2 rounded-lg transition-all ${activeCategory === 'rare-skins' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'}`}
            >
              {t.catRareSkins} ({counts.rareSkins})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input 
              ref={searchInputRef}
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-white placeholder-slate-500 outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Item Image Filter Button ⭐ (Noctis-style filter) */}
          <button
            type="button"
            onClick={onOpenItemFilter}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 border shadow-lg cursor-pointer shrink-0 ${
              selectedItemIds && selectedItemIds.length > 0
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/25 scale-[1.02]'
                : 'bg-slate-950 hover:bg-slate-850 text-amber-400 border-amber-500/40 hover:border-amber-400'
            }`}
            title="เปิดตัวกรองไอเทมและสกินแบบเลือกดูจากรูปภาพ (Progressive, ซูเปอร์คาร์, เสื้อผ้าแรร์)"
          >
            <span className="text-base">🎯</span>
            <span>{lang === 'th' ? 'กรองด้วยรูปไอเทม' : 'Filter by Item'}</span>
            {selectedItemIds && selectedItemIds.length > 0 ? (
              <span className="w-5 h-5 rounded-full bg-black text-amber-400 text-xs font-black flex items-center justify-center">
                {selectedItemIds.length}
              </span>
            ) : (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono border border-amber-500/30">
                240+ รูป
              </span>
            )}
          </button>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-300 outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="newest">{t.sortNewest}</option>
              <option value="price-asc">{t.sortPriceAsc}</option>
              <option value="price-desc">{t.sortPriceDesc}</option>
            </select>
          </div>

        </div>

        {/* Active Selected Item Chips Row ⭐ */}
        {selectedItems.length > 0 && (
          <div className="p-3 rounded-2xl bg-slate-950/95 border border-amber-500/40 flex items-center gap-2 flex-wrap shadow-xl animate-in fade-in">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 shrink-0">
              <span>🎯</span>
              <span>{lang === 'th' ? 'ไอเทมที่เลือกกรอง:' : 'Selected Items:'}</span>
            </span>

            {selectedItems.map((it) => (
              <span
                key={it.id}
                className="inline-flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-xl bg-amber-500/15 border border-amber-500/50 text-amber-300 text-xs font-bold shadow-sm"
              >
                {it.localIcon && (
                  <img
                    src={it.localIcon}
                    alt={it.name}
                    className="w-5 h-5 object-contain"
                  />
                )}
                <span>{lang === 'th' && it.thaiName ? it.thaiName : it.name}</span>
                <button
                  type="button"
                  onClick={() => onRemoveSelectedItem && onRemoveSelectedItem(it.id)}
                  className="w-4 h-4 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center text-[10px] transition-colors ml-0.5 cursor-pointer"
                  title="ลบตัวกรองไอเทมนี้"
                >
                  ✕
                </button>
              </span>
            ))}

            <button
              type="button"
              onClick={onClearItemFilter}
              className="text-xs text-rose-400 hover:underline px-2 py-1 font-semibold cursor-pointer"
            >
              {lang === 'th' ? 'ล้างทั้งหมด' : 'Clear all'}
            </button>

            <button
              type="button"
              onClick={onOpenItemFilter}
              className="text-xs text-amber-400 hover:text-amber-300 hover:underline px-2 py-1 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>+</span>
              <span>{lang === 'th' ? 'เลือกไอเทมเพิ่ม' : 'Add more items'}</span>
            </button>
          </div>
        )}

        {/* Region Country Filter Pills ⭐ with Live Real-time Stock Sync */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/60 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-semibold whitespace-nowrap">{t.filterRegionTitle}</span>
            
            <button
              onClick={() => setActiveRegion('all')}
              className={`px-3 py-1 rounded-lg border transition-all ${
                activeRegion === 'all'
                  ? 'bg-amber-500 text-black border-amber-500 font-bold shadow'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              🌐 {t.regionAll}
            </button>

            <button
              onClick={() => setActiveRegion('th')}
              className={`px-3 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                activeRegion === 'th'
                  ? 'bg-blue-600 text-white border-blue-500 font-bold shadow'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-blue-500/50 hover:text-blue-300'
              }`}
            >
              <span>🇹🇭</span>
              <span>{t.regionTH}</span>
            </button>

            <button
              onClick={() => setActiveRegion('cn')}
              className={`px-3 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                activeRegion === 'cn'
                  ? 'bg-rose-600 text-white border-rose-500 font-bold shadow'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-rose-500/50 hover:text-rose-300'
              }`}
            >
              <span>🇨🇳</span>
              <span>{t.regionCN}</span>
            </button>

            <button
              onClick={() => setActiveRegion('vn')}
              className={`px-3 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                activeRegion === 'vn'
                  ? 'bg-emerald-600 text-white border-emerald-500 font-bold shadow'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-emerald-500/50 hover:text-emerald-300'
              }`}
            >
              <span>🇻🇳</span>
              <span>{t.regionVN}</span>
            </button>
          </div>

          {/* Real-time Live Stock Sync Indicator & Refresh Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold">{t.liveStock || 'สต็อกสด:'}</span>
              <span className="font-mono font-bold text-white">{(totalAccountsCount || 0).toLocaleString()}</span>
              {lastStockUpdated && (
                <span className="text-[10px] text-emerald-300/80 hidden md:inline font-mono">
                  • {lastStockUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              )}
            </div>

            {onRefreshStock && (
              <button
                type="button"
                onClick={onRefreshStock}
                disabled={isStockRefreshing}
                className="px-3 py-1 rounded-lg bg-slate-950 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="คลิกเพื่อรีเฟรชอัปเดตสต็อกไอดีจีนล่าสุดทันที"
              >
                <span className={`text-xs ${isStockRefreshing ? 'animate-spin inline-block' : ''}`}>🔄</span>
                <span>{isStockRefreshing ? (t.refreshing || 'กำลังดึงล่าสุด...') : (t.refreshStock || 'รีเฟรชสต็อก')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Tag Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-500 font-semibold whitespace-nowrap">{t.popularTags}</span>
          {quickTags.map((tag) => {
            const isActive = selectedTag === tag.id;
            return (
              <button 
                key={tag.id}
                onClick={() => setSelectedTag(isActive ? '' : tag.id)}
                className={`px-3 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                  isActive 
                    ? 'bg-amber-500 text-black border-amber-500 font-bold' 
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-amber-500/20 hover:text-amber-400'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
          {(selectedTag || activeRegion !== 'all') && (
            <button 
              onClick={() => {
                setSelectedTag('');
                setActiveRegion('all');
              }}
              className="px-2 py-1 rounded-lg text-slate-400 hover:text-amber-400 text-xs underline"
            >
              {t.clearFilters}
            </button>
          )}
        </div>

      </div>
    </section>
  );
}

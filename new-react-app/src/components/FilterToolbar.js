import React from 'react';

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
  t
}) {
  const quickTags = [
    { id: 'Progressive', label: t.tagProgressive },
    { id: 'OriginalMail', label: t.tagOriginalMail },
    { id: 'RankReady', label: t.tagRankReady },
    { id: 'BAPE', label: t.tagBape },
    { id: 'Budget', label: t.tagBudget },
  ];

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

        {/* Region Country Filter Pills ⭐ */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60 text-xs">
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

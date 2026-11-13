import React, { useState, useMemo, useEffect } from 'react';
import filterCategoriesData from '../data/filterCategories.json';

export default function ItemFilterModal({
  isOpen,
  onClose,
  selectedItemIds = [],
  onApplyFilter,
  accounts = [],
  lang = 'th'
}) {
  const [selectedIds, setSelectedIds] = useState(selectedItemIds);
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(selectedItemIds || []);
      setSearchQuery('');
    }
  }, [isOpen, selectedItemIds]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose && onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Flatten all items across all categories for global search
  const allItems = useMemo(() => {
    const map = new Map();
    filterCategoriesData.forEach((cat) => {
      cat.items.forEach((item) => {
        if (!map.has(item.id)) {
          map.set(item.id, {
            ...item,
            categoryName: cat.name,
            categoryNameTh: cat.categoryNameTh,
            categoryIcon: cat.localIcon
          });
        }
      });
    });
    return Array.from(map.values());
  }, []);

  // Filter items by active category and search query
  const displayedItems = useMemo(() => {
    let list = activeCategoryId === 'all'
      ? allItems
      : (filterCategoriesData.find((c) => c.id === activeCategoryId)?.items || []);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = allItems.filter((item) => {
        const nameMatch = (item.name || '').toLowerCase().includes(q);
        const thMatch = (item.thaiName || '').toLowerCase().includes(q);
        const cnMatch = (item.chineseName || '').toLowerCase().includes(q);
        const catMatch = (item.categoryName || '').toLowerCase().includes(q) || (item.categoryNameTh || '').toLowerCase().includes(q);
        const kwMatch = (item.keywords || []).some((kw) => kw.toLowerCase().includes(q));
        return nameMatch || thMatch || cnMatch || catMatch || kwMatch;
      });
    }

    return list;
  }, [activeCategoryId, searchQuery, allItems]);

  // Toggle an item selection
  const handleToggleItem = (itemId) => {
    setSelectedIds((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  // Clear all selections
  const handleClearAll = () => {
    setSelectedIds([]);
  };

  // Confirm and apply filter
  const handleConfirm = () => {
    onApplyFilter && onApplyFilter(selectedIds);
    onClose && onClose();
  };

  // Selected item objects
  const selectedItems = useMemo(() => {
    const set = new Set(selectedIds);
    return allItems.filter((it) => set.has(it.id));
  }, [selectedIds, allItems]);

  // Calculate live matching accounts for the current selection
  const matchingAccountsCount = useMemo(() => {
    if (selectedIds.length === 0) return accounts.length;

    return accounts.filter((acc) => {
      const targetText = ((acc.title_th || '') + ' ' + (acc.title || '') + ' ' + (acc.gunLevel_th || '') + ' ' + (acc.subtitle_th || '')).toLowerCase();
      // Match accounts that have at least one of the selected items (OR mode across selected items)
      return selectedItems.some((item) => {
        return (item.keywords || []).some((kw) => targetText.includes(kw.toLowerCase()));
      });
    }).length;
  }, [selectedIds, selectedItems, accounts]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#0e1422] border border-amber-500/40 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL TOP HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/95 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shrink-0 shadow-inner">
              🎯
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white truncate">
                  {lang === 'th' ? 'เลือกกรองไอดีตามรูปภาพไอเทม' : 'Filter by Item Skins'}
                </h3>
                {selectedIds.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-black shadow animate-pulse">
                    {selectedIds.length} {lang === 'th' ? 'เลือกแล้ว' : 'selected'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                {lang === 'th' 
                  ? 'คลิกเลือกสกินปืนอัปเกรด, ซูเปอร์คาร์, ชุดแฟชั่นแรร์ หรือสโมก เพื่อค้นหาไอดีที่ครอบครองไอเทมทันที' 
                  : 'Click on progressive weapons, supercars, rare outfits or colored smoke to filter matching accounts'}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0 shadow"
            title="ปิดหน้าต่าง"
          >
            ✕
          </button>
        </div>

        {/* SEARCH & CATEGORY SELECTOR TOOLBAR */}
        <div className="p-3 sm:p-4 border-b border-slate-800/90 bg-[#121929]/90 space-y-3">
          {/* Quick Search Input */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'th' ? 'ค้นหาชื่อปืน, สกิน, รถ, เสื้อผ้า (เช่น Glacier, BAPE, Bugatti, สโมกชมพู, เมดูซ่า)...' : 'Search skin name, weapon, car...'}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Horizontal Scrolling Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {/* All Pill */}
            <button
              type="button"
              onClick={() => {
                setActiveCategoryId('all');
                setSearchQuery('');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border shrink-0 ${
                activeCategoryId === 'all' && !searchQuery
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <span>🔥</span>
              <span>{lang === 'th' ? 'ทั้งหมด (All)' : 'All Items'}</span>
              <span className="text-[10px] opacity-75">({allItems.length})</span>
            </button>

            {/* Category Pills with Icons */}
            {filterCategoriesData.map((cat) => {
              const isActive = activeCategoryId === cat.id && !searchQuery;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    setSearchQuery('');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-black border-amber-400 shadow-md scale-[1.02]'
                      : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:bg-slate-850 hover:text-white'
                  }`}
                >
                  {cat.localIcon ? (
                    <img
                      src={cat.localIcon}
                      alt={cat.name}
                      className="w-4 h-4 object-contain brightness-110"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>{cat.badge || '🎮'}</span>
                  )}
                  <span>{lang === 'th' ? cat.categoryNameTh : cat.name}</span>
                  <span className="text-[10px] opacity-70">({cat.items.length})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TILES GRID CONTAINER */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 bg-[#0a0f1a] scrollbar-thin scrollbar-thumb-amber-500/50 scrollbar-track-slate-900">
          {displayedItems.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <span className="text-4xl block">🔍</span>
              <p className="text-sm font-semibold">
                {lang === 'th' ? 'ไม่พบไอเทมที่ตรงกับคำค้นหา' : 'No items match your search'}
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-amber-400 hover:underline"
              >
                {lang === 'th' ? 'ล้างคำค้นหา' : 'Clear search'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {displayedItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const imgSrc = item.localIcon || item.iconUrl;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleItem(item.id)}
                    className={`group relative flex flex-col items-center justify-between p-3 rounded-2xl border text-center transition-all cursor-pointer overflow-hidden ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 text-white shadow-[0_0_16px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/60 scale-[1.02]'
                        : 'bg-[#121929]/90 border-slate-800 hover:border-slate-600 hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    {/* Selected Golden Ambient Haze */}
                    {isSelected && (
                      <span className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent pointer-events-none" />
                    )}

                    {/* Top Status & Checkmark Badges */}
                    <div className="w-full flex items-center justify-between gap-1 z-10 mb-1">
                      {/* Match Count Badge */}
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-amber-400 border border-amber-500/30">
                        {item.matchCount ? `${item.matchCount.toLocaleString()} ไอดี` : 'แรร์'}
                      </span>

                      {/* Selection Checkmark */}
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                          isSelected
                            ? 'bg-amber-400 text-black shadow-md scale-110'
                            : 'border border-slate-700 bg-slate-900/60 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                    </div>

                    {/* Item Image */}
                    <div className="w-full h-24 sm:h-28 flex items-center justify-center my-1 relative overflow-hidden">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-200"
                          onError={(e) => {
                            if (e.currentTarget.src !== ('https://noctismarket.online' + item.iconUrl)) {
                              e.currentTarget.src = 'https://noctismarket.online' + item.iconUrl;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-800/80 flex items-center justify-center text-2xl">
                          🎮
                        </div>
                      )}
                    </div>

                    {/* Item Name */}
                    <div className="w-full z-10 mt-1">
                      <div className="text-xs font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                        {lang === 'th' && item.thaiName ? item.thaiName : item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 font-mono mt-0.5">
                        {item.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/95 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClearAll}
            disabled={selectedIds.length === 0}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
              selectedIds.length > 0
                ? 'bg-slate-900 hover:bg-slate-800 text-rose-400 border-rose-500/40 hover:border-rose-400 cursor-pointer shadow-sm'
                : 'bg-slate-900/50 text-slate-600 border-slate-800 cursor-not-allowed'
            }`}
          >
            <span>🗑️</span>
            <span>{lang === 'th' ? 'ล้างการเลือกทั้งหมด' : 'Clear All'}</span>
          </button>

          {/* Center Info Status */}
          <div className="text-center text-xs text-slate-300">
            {selectedIds.length > 0 ? (
              <span>
                {lang === 'th' ? 'เลือกแล้ว' : 'Selected'}{' '}
                <strong className="text-amber-400 font-bold">{selectedIds.length}</strong>{' '}
                {lang === 'th' ? 'ไอเทม (พบ' : 'items ('}
                <strong className="text-emerald-400 font-bold mx-1">
                  {matchingAccountsCount.toLocaleString()}
                </strong>{' '}
                {lang === 'th' ? 'ไอดีที่ตรงเงื่อนไข)' : 'matching accounts)'}
              </span>
            ) : (
              <span className="text-slate-500">
                {lang === 'th'
                  ? 'ยังไม่ได้เลือกไอเทม (คลิกเพื่อเลือกไอเทมที่ต้องการ)'
                  : 'No items selected yet'}
              </span>
            )}
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>✓</span>
            <span>
              {lang === 'th'
                ? `ยืนยันการกรอง (${selectedIds.length})`
                : `Apply Filter (${selectedIds.length})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

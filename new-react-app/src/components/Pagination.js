import React, { useState } from 'react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 24,
  pageSizeOptions = [24, 48, 96],
  onPageChange,
  onPageSizeChange,
  lang = 'th',
  t = {}
}) {
  const [jumpInput, setJumpInput] = useState('');

  if (totalPages <= 1 && totalItems <= pageSize) {
    return null;
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to display with smart ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // how many pages around current to show

    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const target = parseInt(jumpInput, 10);
    if (!isNaN(target) && target >= 1 && target <= totalPages) {
      onPageChange(target);
      setJumpInput('');
    }
  };

  const labelShowing = t.paginationShowing || (lang === 'th' ? 'แสดง' : 'Showing');
  const labelTo = t.paginationTo || (lang === 'th' ? 'ถึง' : 'to');
  const labelOf = t.paginationOf || (lang === 'th' ? 'จากทั้งหมด' : 'of');
  const labelAccounts = t.paginationAccounts || (lang === 'th' ? 'รายการ' : 'items');
  const labelPage = t.paginationPage || (lang === 'th' ? 'หน้า' : 'Page');
  const labelPerPage = t.paginationPerPage || (lang === 'th' ? 'ต่อหน้า' : 'per page');
  const labelJump = t.paginationJump || (lang === 'th' ? 'ไปหน้า' : 'Go to');
  const labelGo = t.paginationGo || (lang === 'th' ? 'ไป' : 'Go');

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 px-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-sm mt-8 shadow-inner">
      {/* Left: Summary & Per-page selector */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <div>
          <span>{labelShowing} </span>
          <span className="font-bold text-amber-400">{startItem.toLocaleString()}</span>
          <span> {labelTo} </span>
          <span className="font-bold text-amber-400">{endItem.toLocaleString()}</span>
          <span> {labelOf} </span>
          <span className="font-bold text-white">{totalItems.toLocaleString()}</span>
          <span> {labelAccounts}</span>
        </div>

        {pageSizeOptions && pageSizeOptions.length > 1 && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-800">
            <span>{labelPerPage}:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
              aria-label={labelPerPage}
              className="bg-slate-950 border border-slate-700/80 text-amber-400 text-xs rounded-lg px-2 py-1 outline-none focus:border-amber-500 cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Center: Navigation Buttons */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
          title="หน้าแรก"
        >
          «
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2.5 h-8 rounded-lg flex items-center justify-center text-xs font-semibold border transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
          title="ก่อนหน้า"
        >
          ‹
        </button>

        {/* Dynamic Page Buttons */}
        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-1.5 text-xs text-slate-500 select-none">
                •••
              </span>
            );
          }

          const isActive = p === currentPage;
          return (
            <button
              key={`page-${p}`}
              onClick={() => onPageChange(p)}
              className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold border transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 scale-105'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2.5 h-8 rounded-lg flex items-center justify-center text-xs font-semibold border transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
          title="ถัดไป"
        >
          ›
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
          title="หน้าสุดท้าย"
        >
          »
        </button>
      </div>

      {/* Right: Quick Jump to page */}
      <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5 text-xs text-slate-400">
        <span>{labelJump}:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={jumpInput}
          onChange={(e) => setJumpInput(e.target.value)}
          placeholder={`${labelPage} ${currentPage}`}
          aria-label={labelJump}
          className="w-16 bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1 text-center text-xs text-white focus:outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          className="px-2.5 py-1 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 hover:border-amber-400 rounded-lg text-xs font-bold text-slate-300 transition-colors"
        >
          {labelGo}
        </button>
      </form>
    </div>
  );
}

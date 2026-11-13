import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function PosterLightbox({
  isOpen,
  posterUrl,
  countryName,
  flag,
  lang = 'th',
  onToggleLang,
  onClose
}) {
  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !posterUrl) return null;

  const isTh = lang === 'th';

  const lightboxContent = (
    <div 
      className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}
    >
      {/* Lightbox Top Control Toolbar */}
      <div 
        className="w-full max-w-4xl flex items-center justify-between p-3 sm:p-4 bg-slate-900/95 border border-slate-700/80 rounded-2xl mb-2 sm:mb-3 shadow-2xl backdrop-blur-md shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl shrink-0">{flag || '📜'}</span>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-black text-white truncate">
              {countryName || (isTh ? 'กฎการซื้อขายไอดี' : 'Account Trading Rules')}
            </h3>
            <span className="text-[10px] text-amber-400 font-medium block">
              PUBG SIAM Official Poster ({isTh ? 'เวอร์ชั่นภาษาไทย' : 'English Version'})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Language Toggle */}
          {onToggleLang && (
            <button
              type="button"
              onClick={onToggleLang}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white text-xs font-bold border border-slate-600 transition-all flex items-center gap-1.5 shadow"
            >
              <span>{isTh ? '🇬🇧' : '🇹🇭'}</span>
              <span className="hidden sm:inline">
                {isTh ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
              </span>
              <span className="sm:hidden">{isTh ? 'ENG' : 'ไทย'}</span>
            </button>
          )}

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-base font-bold shadow"
            title={isTh ? 'ปิด (ESC)' : 'Close (ESC)'}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Poster Image Container */}
      <div 
        className="relative max-h-[85vh] w-auto max-w-[92vw] sm:max-w-md md:max-w-lg overflow-y-auto rounded-2xl border border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.25)] bg-black scrollbar-thin scrollbar-thumb-amber-500/50 scrollbar-track-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={posterUrl} 
          alt="Original Rules Poster"
          className="w-full h-auto object-contain block mx-auto" 
          style={{ aspectRatio: '682 / 1024' }}
        />
      </div>

      <div className="text-[11px] text-slate-400 mt-2 text-center pointer-events-none">
        {isTh ? 'กด ESC หรือคลิกที่พื้นที่ว่างรอบนอกเพื่อปิด' : 'Press ESC or click outside to close'}
      </div>
    </div>
  );

  return createPortal(lightboxContent, document.body);
}

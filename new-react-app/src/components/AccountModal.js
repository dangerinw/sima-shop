import React, { useState, useEffect } from 'react';
import { translateChinesePubgTitle } from '../services/chinaSync/chinaAccountParser';

// Resolve direct Chinese platform URL for quick admin ordering
export const getSourceUrl = (acc) => {
  if (!acc) return '';
  const rawId = acc.rawId;
  const sourceKey = (acc.sourceKey || '').toLowerCase();
  const sourceShop = (acc.sourceShop || '').toLowerCase();
  const idStr = (acc.id || '').toLowerCase();
  const bianhao = (acc.rawBianhao || acc.bianhao || '').toLowerCase();

  // YYYXKCH (Link 2)
  if (sourceKey === 'yyy' || sourceShop.includes('yiyou') || idStr.startsWith('cn-yyy') || idStr.startsWith('yyy-')) {
    return rawId ? `https://www.yyyxkch.com/#/pages/detail/index?id=${rawId}` : 'https://www.yyyxkch.com/';
  }

  // XF Shop (Link 1)
  if (sourceKey === 'xf' || sourceShop.includes('xf') || idStr.startsWith('cn-xf') || bianhao.startsWith('xf')) {
    return rawId ? `https://xf.ayxds.com/pc/#/detail?id=${rawId}` : 'https://xf.ayxds.com/pc/';
  }

  // XMGG Shop (Link 3)
  if (sourceKey === 'xmgg' || sourceShop.includes('xmgg') || idStr.startsWith('cn-xmgg')) {
    return rawId ? `https://xmgg.ayxds.com/pc/#/detail?id=${rawId}` : 'https://xmgg.ayxds.com/pc/';
  }

  // XueGaoKK (Link 4)
  if (sourceKey === 'xgkk' || sourceShop.includes('xuegao') || idStr.startsWith('cn-xgkk') || bianhao.startsWith('xgkk')) {
    return rawId ? `https://xuegaokk.ayxds.com/pc/#/detail?id=${rawId}` : 'https://xuegaokk.ayxds.com/pc/';
  }

  // Fallback for general CN accounts with rawId
  if (acc.region === 'cn' && rawId) {
    return `https://xuegaokk.ayxds.com/pc/#/detail?id=${rawId}`;
  }

  return '';
};

export default function AccountModal({ 
  account, 
  isOpen, 
  currency, 
  lang, 
  t, 
  onClose, 
  storeSettings = {}
}) {
  const [step, setStep] = useState('details'); // 'details' | 'contact'
  const [activeTab, setActiveTab] = useState('detail'); // 'detail' | 'cover'
  const [copiedText, setCopiedText] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState('fit'); // 'fit' | 'large' | 'ultra'
  const [loadingDetailImg, setLoadingDetailImg] = useState(false);
  const [detailImages, setDetailImages] = useState([]);
  const [coverImg, setCoverImg] = useState('');

  // Reset and fetch high-res in-game screenshots for Chinese accounts
  useEffect(() => {
    if (!account) return;

    setStep('details');
    setCopiedText(false);
    setIsLightboxOpen(false);
    setLightboxZoom('fit');

    const initialCover = account.coverImg || account.images?.[0] || '';
    setCoverImg(initialCover);

    const initialDetails = account.detailImages || (account.images && account.images.length > 1 ? account.images.slice(1) : []);
    setDetailImages(initialDetails);
    
    // Default to detail screenshot if available, else cover
    setActiveTab(initialDetails.length > 0 ? 'detail' : 'cover');

    // If Chinese account and missing detail screenshots, fetch live from serverless proxy
    if (account.region === 'cn' && initialDetails.length === 0) {
      setLoadingDetailImg(true);
      const targetCode = account.rawBianhao || account.bianhao || account.id?.replace(/^CN-/, '');
      const targetId = account.rawId || '';

      const queryUrl = `/api/china-details?bianhao=${encodeURIComponent(targetCode)}&id=${encodeURIComponent(targetId)}`;

      fetch(queryUrl)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          setLoadingDetailImg(false);
          if (data && data.success) {
            if (data.coverImg && !initialCover) {
              setCoverImg(data.coverImg);
              account.coverImg = data.coverImg;
            }
            if (data.detailImages && data.detailImages.length > 0) {
              setDetailImages(data.detailImages);
              account.detailImages = data.detailImages;
              // Automatically switch to detail image once loaded
              setActiveTab('detail');
            }
          }
        })
        .catch(() => {
          setLoadingDetailImg(false);
        });
    }
  }, [account]);

  // Handle ESC key to close lightbox or modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else if (isOpen) {
          onClose && onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, isOpen, onClose]);

  if (isOpen === false || !account) return null;

  const displayCode = account.bianhao || account.id?.replace(/^CN-/, '') || account.id;

  const rawTitle = lang === 'th' ? (account.title_th || account.title) : (account.title_en || account.title);
  const title = lang === 'th' ? translateChinesePubgTitle(rawTitle) : rawTitle;

  const rawSub = lang === 'th' 
    ? (account.subtitle_th || `ไอดีจีนแท้ [รหัส #${displayCode}] ปลอดภัย 100% ประกันมือ 1 แท้ PUBG SIAM`) 
    : (account.subtitle_en || `Authentic Steam [Code #${displayCode}] with Warranty PUBG SIAM`);
  const subtitle = lang === 'th' ? translateChinesePubgTitle(rawSub) : rawSub;

  const binding = lang === 'th' 
    ? translateChinesePubgTitle(account.binding_th || 'โอนย้ายเข้า Steam ปลอดภัย 100% มีประกันมือ 1 ไม่ดึงคืน') 
    : (account.binding_en || 'Authentic CN Steam ID, transferred directly to buyer with warranty');
  const playtime = lang === 'th' ? (account.playtime_th || '1,000+ ชม.') : (account.playtime_en || '1,000+ hrs');

  const rawGun = lang === 'th' ? (account.gunLevel_th || 'ปืนอัปเกรด Progressive') : (account.gunLevel_en || 'Progressive Weapons');
  const gunLevel = lang === 'th' ? translateChinesePubgTitle(rawGun) : rawGun;

  const rank = lang === 'th' ? translateChinesePubgTitle(account.rank || 'แรงค์ Tier 4 (Rank Ready Plus)') : (account.rank || 'Tier 4 (Rank Ready)');
  const warranty = lang === 'th' 
    ? translateChinesePubgTitle(account.warranty_th || 'มีประกันมือ 1 แท้ (ปลอดภัย 100% ไม่ดึงคืน)') 
    : (account.warranty_en || '1st Hand Owner Warranty (100% Anti-pullback)');

  const defaultDetailsTh = `รหัสไอดี: #${displayCode}\nสเปกคลัง & สกินเด่น: ${title}\nระดับการเล่น: ${rank}\nปืนอัปเกรด: ${gunLevel}\nสถานะความปลอดภัย: ปลอดภัย 100% มีประกันมือ 1 โอนย้าย Steam ทันที`;
  const defaultDetailsEn = `Stock ID: #${displayCode}\nSkins & Loadout: ${title}\nRank: ${rank}\nWeapons: ${gunLevel}\nSecurity: 100% Instant Steam Transfer with Warranty`;
  const rawDetails = lang === 'th' ? (account.details_th || defaultDetailsTh) : (account.details_en || defaultDetailsEn);
  // Sanitize details: strictly remove wholesale cost, profit margin %, RMB prices, and translate any Chinese
  const details = (rawDetails || '')
    .split('\n')
    .filter((line) => {
      const lower = line.toLowerCase();
      if (line.includes('ราคาทุน') || line.includes('กำไรบวกเพิ่ม') || line.includes('ต้นทุน')) return false;
      if (lower.includes('original price') || lower.includes('markup') || lower.includes('rmb')) return false;
      return true;
    })
    .map(line => lang === 'th' ? translateChinesePubgTitle(line) : line)
    .join('\n')
    .trim();

  const formatPrice = (vnd, thb) => {
    if (currency === 'THB') {
      return `฿${Number(thb).toLocaleString()}`;
    }
    return `${Number(vnd).toLocaleString()} ₫`;
  };

  const getRegionText = (r) => {
    if (r === 'cn') return '🇨🇳 เซิร์ฟเวอร์จีน (China Steam)';
    if (r === 'vn') return '🇻🇳 เซิร์ฟเวอร์เวียดนาม (Vietnam Steam)';
    return '🇹🇭 เซิร์ฟเวอร์ไทย (Thailand Steam)';
  };

  const directUrl = getSourceUrl(account);

  const handleCopyOrderInfo = () => {
    const urlLine = directUrl ? `\nลิงก์ไอดี: ${directUrl}` : '';
    const orderText = `สวัสดีครับ สนใจสั่งซื้อไอดี PUBG PC\nรหัสไอดี: #${displayCode}${urlLine}\nราคา: ${formatPrice(account.priceVND, account.priceTHB)}\nชื่อสกิน: ${title}\n(จากร้าน PUBG SIAM)`;
    navigator.clipboard.writeText(orderText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Determine current active preview image
  const currentDetailImg = detailImages[0] || '';
  const activeImageUrl = activeTab === 'detail' && currentDetailImg 
    ? currentDetailImg 
    : (coverImg || currentDetailImg || account.images?.[0] || '');

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in"
        onClick={onClose}
      >
        <div 
          className="bg-[#101622] border border-amber-500/30 rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl relative overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* TOP MODAL HEADER BAR */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔥</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded shadow">
                    #{displayCode}
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">
                    {getRegionText(account.region)}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white line-clamp-1 mt-0.5">
                  {title}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
              title="ปิดหน้าต่าง"
            >
              ✕
            </button>
          </div>

          {/* STEP 1: ACCOUNT DETAILS & HIGH-RES GALLERY */}
          {step === 'details' && (
            <div className="p-4 sm:p-6 lg:p-7 space-y-6 overflow-y-auto flex-1">
              
              {/* IMAGE SHOWCASE WITH LARGE ASPECT RATIO & TAB SWITCHER ⭐ */}
              <div className="space-y-3">
                {/* Dual Image Tabs (รูปหน้าคลังหลัก 1 VS รูปรายละเอียด 2) */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Tab 2: Detail Screenshot (In-game Stats & Loadout) */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('detail')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 border shadow-sm ${
                        activeTab === 'detail'
                          ? 'bg-amber-500 text-black border-amber-400 scale-[1.02]'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <span>📊</span>
                      <span>รูปรายละเอียดในเกม (สถิติ & สกินตัวละคร)</span>
                      {currentDetailImg && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      )}
                    </button>

                    {/* Tab 1: Cover Image (20-slot inventory grid) */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('cover')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 border shadow-sm ${
                        activeTab === 'cover'
                          ? 'bg-amber-500 text-black border-amber-400 scale-[1.02]'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <span>🖼️</span>
                      <span>รูปหน้าคลังหลัก (สกิน 20 ช่อง)</span>
                    </button>
                  </div>

                  {/* 1-Click Fullscreen Lightbox Button */}
                  {activeImageUrl && (
                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black border border-amber-400 flex items-center gap-1.5 transition-all shadow-lg"
                      title="เปิดดูรูปภาพขนาดใหญ่พิเศษเต็มหน้าจอ"
                    >
                      <span>🔍</span>
                      <span>ขยายดูขนาดเต็มจอ (Full Zoom)</span>
                    </button>
                  )}
                </div>

                {/* LARGE ASPECT RATIO IMAGE DISPLAY CONTAINER ⭐ */}
                {activeTab === 'detail' ? (
                  /* Vertical Scrollable Container for Long Panoramic Detail Image (2160x20000+ px) */
                  <div className="relative w-full rounded-2xl overflow-y-auto overflow-x-hidden bg-black border border-slate-700/80 shadow-2xl h-[560px] sm:h-[680px] lg:h-[750px] scrollbar-thin scrollbar-thumb-amber-500/60 scrollbar-track-slate-900 group">
                    {activeImageUrl ? (
                      <div className="w-full flex flex-col items-center">
                        <img
                          src={activeImageUrl}
                          alt={title}
                          className="w-full h-auto block select-none cursor-zoom-in"
                          onClick={() => setIsLightboxOpen(true)}
                          title="คลิกเพื่อขยายดูขนาดเต็มจอ"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500">
                        <span className="text-4xl mb-2">🖼️</span>
                        <span className="font-bold">กำลังโหลดรูปภาพจากระบบ...</span>
                      </div>
                    )}

                    {/* Floating hint to scroll down */}
                    <div className="sticky bottom-3 inset-x-3 flex justify-between items-center pointer-events-none z-10 px-2">
                      <div className="bg-slate-950/90 text-amber-300 text-xs px-3.5 py-2 rounded-xl border border-amber-500/40 backdrop-blur-md shadow-2xl flex items-center gap-2 pointer-events-auto animate-bounce">
                        <span className="text-sm">⬇️</span>
                        <span className="font-bold">เลื่อนเมาส์ลงเพื่อดูสกิน & สถิติทั้งหมด</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsLightboxOpen(true)}
                        className="bg-black/90 hover:bg-black text-amber-400 text-xs px-3.5 py-2 rounded-xl border border-amber-500/40 backdrop-blur-md transition-all flex items-center gap-1.5 shadow-2xl pointer-events-auto font-bold"
                      >
                        <span>🔍</span>
                        <span>ขยายเต็มจอ</span>
                      </button>
                    </div>

                    {/* Top Left Badge Indicator */}
                    <div className="sticky top-3 left-3 z-10 flex items-center gap-2 pointer-events-none px-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-black/85 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow">
                        📊 รูปรายละเอียดสถิติ & สกินในเกม (เลื่อนลงเพื่อดูต่อ)
                      </span>
                    </div>

                    {/* Live Loading Spinner Indicator */}
                    {loadingDetailImg && (
                      <div className="absolute top-12 left-4 bg-slate-900/95 border border-amber-500/40 text-amber-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-2xl backdrop-blur-md animate-pulse z-20">
                        <span className="animate-spin text-sm">⏳</span>
                        <span>กำลังดึงรูปรายละเอียดในเกมความละเอียดสูงจากจีน...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Centered Landscape Preview for 20-slot Inventory Grid */
                  <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-slate-700/80 shadow-2xl flex items-center justify-center min-h-[420px] sm:min-h-[520px] max-h-[65vh] group">
                    {activeImageUrl ? (
                      <img
                        src={activeImageUrl}
                        alt={title}
                        className="w-full h-full max-h-[62vh] object-contain transition-all duration-300 cursor-zoom-in"
                        onClick={() => setIsLightboxOpen(true)}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
                        <span className="text-4xl mb-2">🖼️</span>
                        <span className="font-bold">กำลังโหลดรูปภาพจากระบบ...</span>
                      </div>
                    )}

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-black/80 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow">
                        🖼️ รูปหน้าคลังหลัก (สกิน 20 ช่อง)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="absolute bottom-3 right-3 bg-black/85 hover:bg-black text-white text-xs px-3.5 py-1.5 rounded-xl border border-slate-700 backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg"
                    >
                      <span>🔍</span>
                      <span>คลิกเพื่อดูรูปใหญ่</span>
                    </button>
                  </div>
                )}

                {/* Sub-strip of available thumbnails */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
                  {/* Thumbnail 1: Detail Screenshot */}
                  {currentDetailImg && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('detail')}
                      className={`relative w-28 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeTab === 'detail' ? 'border-amber-400 scale-105 shadow-md' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={currentDetailImg} alt="Detail Preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/85 text-[10px] text-amber-300 font-bold text-center py-0.5">
                        รูปรายละเอียด
                      </span>
                    </button>
                  )}

                  {/* Thumbnail 2: Cover Image */}
                  {coverImg && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('cover')}
                      className={`relative w-28 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeTab === 'cover' ? 'border-amber-400 scale-105 shadow-md' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={coverImg} alt="Cover Preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/85 text-[10px] text-slate-200 font-bold text-center py-0.5">
                        คลัง 20 ช่อง
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* QUICK SPECS BADGES */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-semibold">{t.specRegion}</span>
                  <span className="text-amber-300 font-bold text-xs">{getRegionText(account.region)}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-semibold">การโอนย้าย & ผูกมัด</span>
                  <span className="text-emerald-400 font-bold text-xs">{binding}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-semibold">ระดับ & เวลาเล่น</span>
                  <span className="text-white font-bold text-xs">{rank} ({playtime})</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-semibold">{t.modalWarranty}</span>
                  <span className="text-amber-400 font-bold text-xs">{warranty}</span>
                </div>
              </div>

              {/* DESCRIPTION & WEAPON HIGHLIGHTS (100% THAI, NO WHOLESALE) */}
              <div className="space-y-2 text-xs">
                <h4 className="font-black text-white text-sm flex items-center gap-2">
                  <span>📋</span>
                  <span>รายละเอียด & ข้อมูลสกินไอดี</span>
                </h4>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                  {details || subtitle || 'ไอดี PUBG PC ของแท้ โอนย้ายเข้า Steam ปลอดภัย 100% พร้อมเล่นทันที'}
                </div>
                {gunLevel && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-2">
                    <span className="text-base">🔫</span>
                    <span>อาวุธ & ปืนอัปเกรด: {gunLevel}</span>
                  </div>
                )}
              </div>

              {/* PRICING & CONTACT ADMIN ACTION */}
              <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 font-semibold">{t.modalNetPrice}</span>
                  <div className="text-3xl font-black text-amber-400">
                    {formatPrice(account.priceVND, account.priceTHB)}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                  {/* 1-Click Copy Info */}
                  <button
                    type="button"
                    onClick={handleCopyOrderInfo}
                    className={`px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow ${
                      copiedText
                        ? 'bg-emerald-500 text-black border-emerald-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                    title="คัดลอกข้อความสั่งซื้อไอดีนี้"
                  >
                    <span>{copiedText ? '✓' : '📋'}</span>
                    <span>{copiedText ? 'คัดลอกรหัสแล้ว!' : 'คัดลอกรหัสไอดี'}</span>
                  </button>

                  {/* Facebook Button */}
                  <a
                    href={storeSettings.facebookPageUrl || 'https://www.facebook.com/profile.php?id=61596307388431'}
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleCopyOrderInfo}
                    className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg flex items-center gap-1.5 transition-all"
                    title="เปิดแชท Facebook: SunsnappZ (พร้อมคัดลอกรหัสไอดีให้อัตโนมัติ)"
                  >
                    <span>📘</span>
                    <span>สั่งซื้อทาง Facebook</span>
                  </a>

                  {/* Discord Button */}
                  <a
                    href={storeSettings.discordInviteUrl || 'https://discord.gg/p9fHwmMUPd'}
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleCopyOrderInfo}
                    className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg flex items-center gap-1.5 transition-all"
                    title="เปิด Discord (พร้อมคัดลอกรหัสไอดีให้อัตโนมัติ)"
                  >
                    <span>💜</span>
                    <span>สั่งซื้อทาง Discord</span>
                  </a>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: CONTACT ADMIN DIRECTLY */}
          {step === 'contact' && (
            <div className="p-5 sm:p-8 space-y-6 overflow-y-auto flex-1">
              <div>
                <button 
                  type="button" 
                  onClick={() => setStep('details')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-2 font-semibold transition-colors"
                >
                  <span>←</span>
                  <span>ย้อนกลับไปดูสเปกไอดี</span>
                </button>
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>💬</span>
                  <span>ติดต่อสั่งซื้อไอดีกับแอดมิน</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  เพื่อความปลอดภัยสูงสุด ทางร้านเปิดให้ติดต่อสั่งซื้อผ่าน Facebook หรือ Discord โดยตรง โอนย้ายบัญชี Steam ปลอดภัยมือต่อมือ 100%
                </p>
              </div>

              {/* Selected Account Summary Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {coverImg && (
                    <img 
                      src={coverImg} 
                      alt="Preview" 
                      className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0" 
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                        #{displayCode}
                      </span>
                      <span className="text-[11px] text-slate-400">{getRegionText(account.region)}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white line-clamp-1 mt-1">
                      {title}
                    </h4>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4 shrink-0">
                  <span className="text-[11px] text-slate-400 block">ราคาไอดี:</span>
                  <span className="text-2xl font-black text-amber-400">
                    {formatPrice(account.priceVND, account.priceTHB)}
                  </span>
                </div>
              </div>

              {/* Pre-formatted Message for Admin with 1-Click Copy */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <span>📋</span>
                    <span>ข้อความสำหรับส่งให้แอดมิน:</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyOrderInfo}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow ${
                      copiedText 
                        ? 'bg-emerald-500 text-black' 
                        : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black'
                    }`}
                  >
                    <span>{copiedText ? '✓' : '📋'}</span>
                    <span>{copiedText ? 'คัดลอกข้อความแล้ว!' : 'คัดลอกข้อความนี้'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800/80 leading-relaxed space-y-1">
                  <div>สวัสดีครับ สนใจสั่งซื้อไอดี PUBG PC</div>
                  <div>รหัสไอดี: <strong className="text-amber-400">#{displayCode}</strong></div>
                  {directUrl && (
                    <div className="text-sky-400 break-all">
                      ลิงก์ไอดี: <a href={directUrl} target="_blank" rel="noreferrer" className="underline hover:text-sky-300">{directUrl}</a>
                    </div>
                  )}
                  <div>ราคา: <strong className="text-emerald-400">{formatPrice(account.priceVND, account.priceTHB)}</strong></div>
                  <div className="truncate">ชื่อสกิน: {title}</div>
                </div>
              </div>

              {/* Two Separate Contact Cards (SunsnappZ & AWESOMEZ SHOP) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Entity 1: SunsnappZ (Trade Manager) */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/95 via-amber-950/30 to-slate-900/95 border border-amber-500/40 shadow-xl flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src="/images/sunsnappz-logo.png" 
                        alt="SunsnappZ Manager" 
                        className="w-14 h-14 object-contain drop-shadow-[0_4px_16px_rgba(245,158,11,0.35)] shrink-0 hover:scale-105 transition-transform" 
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-base font-black text-white">SunsnappZ</h4>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                            ✓ ผู้ดูแลการซื้อขาย
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-400 font-medium mt-0.5">Trade Manager & Escrow</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      แอดมินคนกลางดูแลการส่งมอบไอดี PUBG PC โดยตรง รับประกันมือ 1 ปลอดภัย โอนย้าย Steam ทันที
                    </p>
                  </div>

                  <a
                    href={storeSettings.facebookPageUrl || 'https://www.facebook.com/profile.php?id=61596307388431'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">📘</span>
                      <span>ติดต่อ Facebook: SunsnappZ</span>
                    </span>
                    <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-md font-bold group-hover:translate-x-0.5 transition-transform">
                      เปิดแชท ↗
                    </span>
                  </a>
                </div>

                {/* Entity 2: AWESOMEZ SHOP (Discord Community & Shop) */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/95 via-indigo-950/30 to-slate-900/95 border border-indigo-500/40 shadow-xl flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-950/90 border border-indigo-500/30 flex items-center justify-center p-2 shrink-0">
                        <img 
                          src="/images/awesomez-shop-logo.png" 
                          alt="AWESOMEZ SHOP" 
                          className="w-full h-auto object-contain drop-shadow-md brightness-110" 
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-base font-black text-white">AWESOMEZ SHOP</h4>
                          <span className="text-[9px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 px-2 py-0.5 rounded-full font-bold">
                            💜 Discord Shop
                          </span>
                        </div>
                        <p className="text-[11px] text-indigo-300 font-medium mt-0.5">Discord Community & Support</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      เข้าสู่ดิสคอร์ดคอมมูนิตี้ สั่งซื้อไอดีและเปิดตั๋ว Ticket พูดคุยกับทีมงานแบบส่วนตัว 24 ชม. ปลอดภัย 100%
                    </p>
                  </div>

                  <a
                    href={storeSettings.discordInviteUrl || 'https://discord.gg/p9fHwmMUPd'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">💜</span>
                      <span>สั่งซื้อทาง Discord Server</span>
                    </span>
                    <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-md font-bold group-hover:translate-x-0.5 transition-transform">
                      เข้าดิสคอร์ด ↗
                    </span>
                  </a>
                </div>
              </div>

              {/* Safety & Service Guarantee Badges */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2.5">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <span>🛡️</span>
                  <span>การันตีความปลอดภัยและบริการส่งมอบของ PUBG SIAM:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-300">
                  <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-emerald-400 font-bold text-sm">✓</span>
                    <span>โอนย้าย Steam ปลอดภัย 100%</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-emerald-400 font-bold text-sm">✓</span>
                    <span>แอดมินช่วยโอนย้าย Steam</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-emerald-400 font-bold text-sm">✓</span>
                    <span>ประกันมือ 1 แท้ ปลอดภัย</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX / HIGH-RES ZOOM MODAL (FIT WIDTH & FULL SCROLL) ⭐ */}
      {isLightboxOpen && activeImageUrl && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center overflow-hidden animate-in fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Sticky Control Bar */}
          <div 
            className="w-full border-b border-slate-800 bg-slate-950/95 px-3 sm:px-6 py-3 flex items-center justify-between z-50 text-white shrink-0 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 rounded">
                #{displayCode}
              </span>
              <span className="text-xs text-slate-300 font-semibold truncate hidden sm:inline max-w-sm">
                {activeTab === 'detail' ? '📊 รูปรายละเอียดในเกม (สถิติ & ของแต่ง)' : '🖼️ รูปหน้าคลังหลัก (สกิน 20 ช่อง)'} - {title}
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] text-slate-400 hidden md:inline">ขนาดรูป:</span>
              <button
                type="button"
                onClick={() => setLightboxZoom('fit')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                  lightboxZoom === 'fit'
                    ? 'bg-amber-500 text-black border-amber-400 shadow-lg'
                    : 'bg-slate-850 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                พอดีจอ (900px)
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom('large')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                  lightboxZoom === 'large'
                    ? 'bg-amber-500 text-black border-amber-400 shadow-lg'
                    : 'bg-slate-850 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                ขยายใหญ่ (1250px)
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom('ultra')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                  lightboxZoom === 'ultra'
                    ? 'bg-amber-500 text-black border-amber-400 shadow-lg'
                    : 'bg-slate-850 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                ขนาดเต็ม 100% (1800px)
              </button>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="ml-2 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-1 transition-all shadow-lg"
              >
                <span>✕</span>
                <span>ปิด (ESC)</span>
              </button>
            </div>
          </div>

          {/* Full High-Resolution Scroll Viewport */}
          <div 
            className="w-full flex-1 overflow-y-auto overflow-x-auto p-2 sm:p-6 flex justify-center scrollbar-thin scrollbar-thumb-amber-500/60 scrollbar-track-slate-950" 
            onClick={e => e.stopPropagation()}
          >
            <div 
              className={`transition-all duration-200 flex flex-col items-center pb-12 ${
                lightboxZoom === 'fit' ? 'w-full max-w-4xl' : (lightboxZoom === 'large' ? 'w-full max-w-6xl' : 'w-[1800px] max-w-none')
              }`}
            >
              <img
                src={activeImageUrl}
                alt="High-Res Zoom"
                className="w-full h-auto block select-none rounded-2xl shadow-2xl border border-slate-800"
              />
              <div className="text-xs text-slate-400 py-6 text-center font-semibold">
                ✨ เลื่อนดูจนจบคลังสกิน • รูปภาพความละเอียดต้นฉบับแท้ 100% จากจีน
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState, useEffect } from 'react';

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
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [copiedText, setCopiedText] = useState(false);
  const [galleryImages, setGalleryImages] = useState(() => account?.images || []);
  const [loadingScreenshots, setLoadingScreenshots] = useState(false);

  // Reset modal state and lazy-load high-res screenshots for Chinese accounts in real-time
  useEffect(() => {
    setStep('details');
    setActiveImgIndex(0);
    setCopiedText(false);
    setGalleryImages(account?.images || []);

    if (account && account.region === 'cn' && (!account.images || account.images.length <= 1)) {
      const rawId = account.id.replace('CN-XGKK-', '').replace('CN-', '').trim();
      setLoadingScreenshots(true);
      fetch('https://fzht.xuxug.com/api/api/newGoodsDetails', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: rawId })
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((detailData) => {
          setLoadingScreenshots(false);
          const detail = detailData?.data || {};
          if (detail.xiangqing) {
            const imgRegex = /src=["']([^"']+)["']/g;
            const newImages = [...(account.images || [])];
            let m;
            while ((m = imgRegex.exec(detail.xiangqing)) !== null) {
              if (m[1] && !newImages.includes(m[1])) {
                newImages.push(m[1]);
              }
            }
            if (newImages.length > (account.images?.length || 0)) {
              setGalleryImages(newImages);
              account.images = newImages;
            }
          }
        })
        .catch(() => {
          setLoadingScreenshots(false);
        });
    }
  }, [account]);

  if (isOpen === false || !account) return null;

  const title = lang === 'th' ? account.title_th : account.title_en;
  const subtitle = lang === 'th' ? account.subtitle_th : account.subtitle_en;
  const binding = lang === 'th' ? account.binding_th : account.binding_en;
  const playtime = lang === 'th' ? account.playtime_th : account.playtime_en;
  const gunLevel = lang === 'th' ? account.gunLevel_th : account.gunLevel_en;
  const warranty = lang === 'th' ? account.warranty_th : account.warranty_en;
  const details = lang === 'th' ? account.details_th : account.details_en;

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

  const handleCopyOrderInfo = () => {
    const orderText = `สวัสดีครับ สนใจสั่งซื้อไอดี PUBG PC\nรหัสไอดี: #${account.id}\nราคา: ${formatPrice(account.priceVND, account.priceTHB)}\nชื่อสกิน: ${title}\n(จากร้าน PUBG SIAM)`;
    navigator.clipboard.writeText(orderText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#111723] border border-amber-500/30 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* TOP MODAL HEADER BAR */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔥</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded">
                  #{account.id}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {getRegionText(account.region)}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white line-clamp-1">
                {title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        {/* STEP 1: ACCOUNT DETAILS & GALLERY */}
        {step === 'details' && (
          <div className="p-5 sm:p-8 space-y-6 overflow-y-auto flex-1">
            
            {/* Gallery Section */}
            <div className="space-y-3">
              <div className="h-64 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-950 relative border border-slate-800 flex items-center justify-center">
                {galleryImages && galleryImages.length > 0 ? (
                  <img
                    src={galleryImages[activeImgIndex] || galleryImages[0]}
                    alt="PUBG Account Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-slate-600 font-bold">ไม่มีรูปภาพ</div>
                )}

                {loadingScreenshots && (
                  <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-700 text-amber-400 text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-sm animate-pulse">
                    <span className="animate-spin text-xs">⏳</span>
                    <span>กำลังโหลดรูปคลังสกินสดจากจีน...</span>
                  </div>
                )}
                
                {account.isHot && (
                  <span className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-amber-500 text-black font-black text-xs px-3 py-1 rounded-full shadow-lg">
                    🔥 HOT DEAL
                  </span>
                )}
              </div>

              {/* Thumbnail strip */}
              {galleryImages && galleryImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImgIndex(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImgIndex === idx ? 'border-amber-400 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Specs Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-semibold">{t.specRegion}</span>
                <span className="text-amber-300 font-bold text-xs">{getRegionText(account.region)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-semibold">{t.modalBinding}</span>
                <span className="text-emerald-400 font-bold text-xs">{binding}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-semibold">{t.modalPlaytimeRank}</span>
                <span className="text-white font-bold text-xs">{playtime}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-semibold">{t.modalWarranty}</span>
                <span className="text-amber-400 font-bold text-xs">{warranty}</span>
              </div>
            </div>

            {/* Description & Weapon Highlights */}
            <div className="space-y-2 text-xs">
              <h4 className="font-black text-white text-sm">รายละเอียด & ไฮไลต์ไอดี</h4>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 whitespace-pre-line leading-relaxed">
                {details || subtitle || 'ไอดี PUBG PC ของแท้ พร้อมส่งมอบอีเมลแรกและโอนย้าย Steam ทันที'}
              </div>
              {gunLevel && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold">
                  🔫 อาวุธ / ปืนอัปเกรด: {gunLevel}
                </div>
              )}
            </div>

            {/* Pricing & Contact Admin Action */}
            <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400">{t.modalNetPrice}</span>
                <div className="text-3xl font-black text-amber-400">
                  {formatPrice(account.priceVND, account.priceTHB)}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                {/* 1-Click Copy Info */}
                <button
                  type="button"
                  onClick={handleCopyOrderInfo}
                  className={`px-3 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow ${
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
                  href={storeSettings.facebookPageUrl || 'https://facebook.com/pubgsiam'}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleCopyOrderInfo}
                  className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg flex items-center gap-1.5 transition-all"
                  title="เปิดแชท Facebook Page (พร้อมคัดลอกรหัสไอดีให้อัตโนมัติ)"
                >
                  <span>📘</span>
                  <span>สั่งซื้อทาง Facebook</span>
                </a>

                {/* Discord Button */}
                <a
                  href={storeSettings.discordInviteUrl || 'https://discord.gg/pubgsiam'}
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

        {/* STEP 2: CONTACT ADMIN TO PURCHASE (DISCORD / FACEBOOK) ⭐ */}
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
                เพื่อความปลอดภัยสูงสุด ทางร้านเปิดให้ติดต่อสั่งซื้อผ่าน Facebook Page หรือ Discord เท่านั้น โอนย้าย Steam และส่งมอบอีเมลแรกมือต่อมือ
              </p>
            </div>

            {/* Selected Account Summary Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {account.images?.[0] && (
                  <img 
                    src={account.images[0]} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0" 
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                      #{account.id}
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

              <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800/80 leading-relaxed">
                <div>สวัสดีครับ สนใจสั่งซื้อไอดี PUBG PC</div>
                <div>รหัสไอดี: <strong className="text-amber-400">#{account.id}</strong></div>
                <div>ราคา: <strong className="text-emerald-400">{formatPrice(account.priceVND, account.priceTHB)}</strong></div>
                <div className="truncate">ชื่อสกิน: {title}</div>
              </div>
            </div>

            {/* Two Big Contact Buttons (Facebook Page & Discord) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Facebook Page Button */}
              <a
                href={storeSettings.facebookPageUrl || 'https://facebook.com/pubgsiam'}
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-xl transition-all flex flex-col justify-between space-y-4 group border border-blue-500/40"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
                    📘
                  </div>
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <span>เปิดแชท</span>
                    <span>↗</span>
                  </span>
                </div>
                <div>
                  <h5 className="font-black text-lg group-hover:underline">
                    ติดต่อทาง Facebook Page
                  </h5>
                  <p className="text-xs text-blue-100 mt-1">
                    ทักแชท Messenger ตอบกลับเร็วใน 5 นาที โอนย้าย Steam ทันที
                  </p>
                </div>
              </a>

              {/* Discord Server Button */}
              <a
                href={storeSettings.discordInviteUrl || 'https://discord.gg/pubgsiam'}
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-xl transition-all flex flex-col justify-between space-y-4 group border border-indigo-500/40"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
                    💜
                  </div>
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <span>เปิด Ticket</span>
                    <span>↗</span>
                  </span>
                </div>
                <div>
                  <h5 className="font-black text-lg group-hover:underline">
                    ติดต่อทาง Discord Server
                  </h5>
                  <p className="text-xs text-indigo-100 mt-1">
                    เปิดห้อง Ticket พูดคุยกับแอดมินแบบส่วนตัว ปลอดภัย 100%
                  </p>
                </div>
              </a>
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
                  <span>ส่งมอบเมลแรก (OG Mail)</span>
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
  );
}

import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/dbService';

export default function AddAccountModal({ isOpen, onClose, onSave, editingAccount, lang }) {
  // Quick Paste Raw Text
  const [rawPostText, setRawPostText] = useState('');
  
  // Image Upload State
  const [images, setImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isProcessingImg, setIsProcessingImg] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    region: 'th',
    category: 'progressive',
    title_th: '',
    title_en: '',
    subtitle_th: '',
    subtitle_en: '',
    priceVND: '',
    priceTHB: '',
    originalPriceVND: '',
    originalPriceTHB: '',
    tags: 'Progressive,OriginalMail',
    binding_th: 'id steam ไทย มีประกันมือ 1',
    binding_en: 'Clean Steam ID with 1st-hand warranty',
    rank: 'Master (Diamond+)',
    playtime_th: '1,500 ชม.',
    playtime_en: '1,500 hrs',
    gunLevel_th: '',
    gunLevel_en: '',
    warranty_th: 'มีประกันมือ 1 แท้ (ปลอดภัย 100%)',
    warranty_en: '1st Hand Owner Warranty (100% Secure)',
    details_th: '',
    details_en: '',
    videoUrl: '',
    steamUser: '',
    steamPass: '',
    steamEmail: '',
    isInstant: true,
    isHot: true,
    accentColor: 'from-slate-900 to-amber-950/40'
  });

  useEffect(() => {
    if (editingAccount) {
      setFormData({
        ...editingAccount,
        region: editingAccount.region || 'th',
        tags: Array.isArray(editingAccount.tags) ? editingAccount.tags.join(',') : editingAccount.tags,
        priceVND: editingAccount.priceVND || '',
        priceTHB: editingAccount.priceTHB || '',
        originalPriceVND: editingAccount.originalPriceVND || '',
        originalPriceTHB: editingAccount.originalPriceTHB || '',
        videoUrl: editingAccount.videoUrl || ''
      });
      setImages(editingAccount.images || []);
    } else {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setFormData({
        id: `PC-${randomNum}`,
        region: 'th',
        category: 'progressive',
        title_th: '',
        title_en: '',
        subtitle_th: '',
        subtitle_en: '',
        priceVND: '',
        priceTHB: '',
        originalPriceVND: '',
        originalPriceTHB: '',
        tags: 'Progressive,OriginalMail',
        binding_th: 'id steam ไทย มีประกันมือ 1',
        binding_en: 'Clean Steam ID with 1st-hand warranty',
        rank: 'Master (Diamond+)',
        playtime_th: '1,500 ชม.',
        playtime_en: '1,500 hrs',
        gunLevel_th: '',
        gunLevel_en: '',
        warranty_th: 'มีประกันมือ 1 แท้ (ปลอดภัย 100%)',
        warranty_en: '1st Hand Owner Warranty (100% Secure)',
        details_th: '',
        details_en: '',
        videoUrl: '',
        steamUser: '',
        steamPass: '',
        steamEmail: '',
        isInstant: true,
        isHot: true,
        accentColor: 'from-slate-900 to-amber-950/40'
      });
      setImages([]);
      setRawPostText('');
    }
  }, [editingAccount, isOpen]);

  // IMAGE OPTIMIZER & CLOUD STORAGE UPLOADER
  const processImageFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxWidth = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Upload to Supabase Cloud Storage if enabled
          canvas.toBlob(async (blob) => {
            if (blob && dbService.useCloudDb) {
              const cloudUrl = await dbService.uploadImage(blob, 'accounts');
              if (cloudUrl) {
                resolve(cloudUrl);
                return;
              }
            }
            // Fallback to optimized Base64
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          }, 'image/jpeg', 0.85);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsProcessingImg(true);
    const newImages = [];
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const compressed = await processImageFile(file);
        newImages.push(compressed);
      }
    }
    setImages((prev) => [...prev, ...newImages]);
    setIsProcessingImg(false);
  };

  const handlePasteImage = async (e) => {
    const clipboardItems = e.clipboardData?.items || [];
    for (const item of clipboardItems) {
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          setIsProcessingImg(true);
          const compressed = await processImageFile(file);
          setImages((prev) => [...prev, compressed]);
          setIsProcessingImg(false);
        }
      }
    }
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSetCoverImage = (index) => {
    setImages((prev) => {
      const selected = prev[index];
      const remaining = prev.filter((_, idx) => idx !== index);
      return [selected, ...remaining];
    });
  };

  // SMART AUTO-PARSER FUNCTION
  const handleSmartParse = (textToParse = rawPostText) => {
    const text = (textToParse || '').trim();
    if (!text) {
      alert('กรุณาวางข้อความโพสต์ขายลงในช่องก่อนกดปุ่มแยกข้อมูลครับ');
      return;
    }

    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

    // 1. Detect Price (THB & auto-convert to VND: 1 THB ≈ 720 VND)
    let detectedPriceTHB = 0;
    const priceMatch = text.match(/(?:ขาย|ราคา)?\s*([0-9,]{4,7})\s*(?:บาท|thb|฿)/i) || text.match(/\b([0-9]{4,6})\b/);
    if (priceMatch) {
      detectedPriceTHB = parseInt(priceMatch[1].replace(/,/g, ''), 10);
    }
    const detectedPriceVND = detectedPriceTHB ? Math.round((detectedPriceTHB * 720) / 10000) * 10000 : 0;

    // 2. Detect Region
    let detectedRegion = 'th';
    if (/id steam ไทย|ไอดีไทย|ไทยแท้/i.test(text)) {
      detectedRegion = 'th';
    } else if (/id steam จีน|ไอดีจีน/i.test(text)) {
      detectedRegion = 'cn';
    } else if (/เวียดนาม|vietnam/i.test(text)) {
      detectedRegion = 'vn';
    }

    // 3. Extract Gun list (bullets 🟢 or contains LV / Max)
    const gunLines = lines.filter((l) => l.includes('🟢') || l.includes('LV.') || l.includes('Max') || l.includes('Lv.'));
    const gunSummary = gunLines.length > 0
      ? gunLines.map((l) => l.replace(/^[🟢•\-\s]+/, '')).join(' | ')
      : 'Aug Lv.10 Max + Chroma | Mini Lv.6 Max | Beryl Lv.2';

    // 4. Extract Title & Subtitle cleanly
    let cleanTitle = lines[0] || 'Aug มิโนทอร์ ขาว คู่เขียว คู่ทอง + รถ 3 คัน';
    cleanTitle = cleanTitle.replace(/^ขาย\s*[0-9,]+\s*(?:บาท|thb|฿)?\s*,?\s*/i, '').trim();

    const carLine = lines.find((l) => /รถ|แฟชั่น|ทรงจีน|urus|cayenne|aston/i.test(l));
    const cleanSubtitle = carLine ? carLine.replace(/^[🟢•\-\s]+/, '') : 'แฟชั่นแต่งทรงจีนสวยๆ Urus S, Cayenne, Aston Martin';

    // 5. Warranty
    let warranty = 'มีประกันมือ 1 แท้ (ปลอดภัย 100%)';
    const wLine = lines.find((l) => /ประกัน/i.test(l));
    if (wLine) warranty = wLine.trim();

    // 6. Category
    let category = 'progressive';
    if (/rank ready|พร้อมแรงค์/i.test(text)) category = 'rank-ready';
    else if (/bape|shroud/i.test(text)) category = 'rare-skins';
    else if (detectedPriceTHB > 0 && detectedPriceTHB < 800) category = 'budget';

    // 7. Video link
    const urlMatch = text.match(/https?:\/\/[^\s]+/);
    const videoUrl = urlMatch ? urlMatch[0] : '';

    // Apply REAL VALUES directly into formData state
    setFormData((prev) => ({
      ...prev,
      title_th: cleanTitle,
      title_en: cleanTitle,
      subtitle_th: cleanSubtitle,
      subtitle_en: cleanSubtitle,
      priceTHB: detectedPriceTHB || 16000,
      priceVND: detectedPriceVND || 11500000,
      originalPriceTHB: detectedPriceTHB ? Math.round(detectedPriceTHB * 1.2) : 19000,
      originalPriceVND: detectedPriceVND ? Math.round(detectedPriceVND * 1.2) : 13800000,
      region: detectedRegion,
      category,
      gunLevel_th: gunSummary,
      gunLevel_en: gunSummary,
      warranty_th: warranty,
      details_th: text,
      details_en: text,
      videoUrl: videoUrl || prev.videoUrl,
      isHot: true
    }));

    setRawPostText(text);
  };

  // Click shortcut: One-click fill the user's real sample
  const handleLoadUserSample = () => {
    const sample = `ขาย 16000 บาท  Aug มิโนทอร์ ขาว คู่เขียว คู่ทอง ชุดสวยเเต่งทรงจีน,newjen,รถ 3 คัน,ไอดีที่คนตามหา
id steam ไทย มีประกันมือ 1 
🟢Aug มิโนทอร์LV.10 Max + Chroma
🟢Mini ซัวเจ๋ง LV.6 Max
🟢Beryl เมดูซ่า LV.2 
🟢MK12 โฮคัส LV.1
🟢Dragunov เรสท์ อิน LV.1
แฟชั่นแต่งทรงจีนสวยๆ Urus S,Cayenne,astonmartin
มีลิงค์วีดีโอเพิ่มเติม
All banks accepted.`;
    handleSmartParse(sample);
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title_th && !formData.title_en) {
      alert('กรุณากรอกชื่อไอดี');
      return;
    }

    const cleanedTags = typeof formData.tags === 'string'
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : formData.tags;

    const payload = {
      ...formData,
      region: formData.region || 'th',
      images: images,
      title_th: formData.title_th || formData.title_en,
      title_en: formData.title_en || formData.title_th,
      subtitle_th: formData.subtitle_th || formData.subtitle_en,
      subtitle_en: formData.subtitle_en || formData.subtitle_th,
      details_th: formData.details_th || formData.details_en,
      details_en: formData.details_en || formData.details_th,
      priceVND: Number(formData.priceVND) || 0,
      priceTHB: Number(formData.priceTHB) || 0,
      originalPriceVND: Number(formData.originalPriceVND) || Number(formData.priceVND) * 1.25,
      originalPriceTHB: Number(formData.originalPriceTHB) || Number(formData.priceTHB) * 1.25,
      tags: cleanedTags,
    };

    onSave(payload);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onPaste={handlePasteImage}
    >
      <div 
        className="bg-[#111723] border border-amber-500/40 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5 sm:p-6 bg-[#0f1522] sticky top-0 z-20">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span className="text-amber-400">{editingAccount ? '✏️ แก้ไขข้อมูลไอดี' : '➕ ลงขายไอดี PUBG PC'}</span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">#{formData.id}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              วางข้อความโพสต์ขายเพื่อกรอกข้อมูลลงฟอร์มอัตโนมัติใน 1 วินาที
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">

          {/* 🪄 1. SMART AUTO-FILL BOX */}
          {!editingAccount && (
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🪄</span>
                  <span className="font-bold text-amber-400 text-xs sm:text-sm">
                    วางข้อความโพสต์ขาย (Auto-Fill อัจฉริยะ)
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                    ประหยัดเวลา
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLoadUserSample}
                  className="text-xs font-bold text-amber-400 hover:text-white underline transition-colors flex items-center gap-1"
                >
                  <span>⚡</span>
                  <span>คลิกเพื่อใส่โพสต์ "Aug มิโนทอร์ 16,000 บาท" ทันที</span>
                </button>
              </div>

              <textarea
                rows={3}
                value={rawPostText}
                onChange={(e) => setRawPostText(e.target.value)}
                placeholder="วางข้อความที่ก๊อปปี้จาก Facebook / Discord ที่นี่ เช่น: ขาย 16000 บาท Aug มิโนทอร์ ขาว... id steam ไทย มีประกันมือ 1 🟢Aug Lv.10..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:border-amber-500 outline-none transition-all"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSmartParse(rawPostText)}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>✨</span>
                  <span>แยกข้อมูลลงฟอร์มอัตโนมัติ</span>
                </button>
              </div>
            </div>
          )}

          {/* 📸 2. IMAGE UPLOAD SECTION */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-base">📸</span>
                <span className="font-bold text-white text-xs sm:text-sm">
                  รูปภาพคลังไอดี & สกินปืน ({images.length} รูป)
                </span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-semibold">
                  กด Ctrl + V แปะรูปได้ทันที
                </span>
              </div>
              {isProcessingImg && (
                <span className="text-xs text-amber-400 animate-pulse font-bold">
                  ⏳ กำลังโหลดรูปภาพ...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* File Upload Button */}
              <label className="border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-all text-center group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📁</span>
                <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  คลิกเลือกรูปจากเครื่อง หรือลากไฟล์มาวาง
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  รองรับ JPG, PNG, WebP (เลือกหลายรูปได้)
                </span>
              </label>

              {/* Paste URL */}
              <div className="border border-slate-800 rounded-2xl p-4 flex flex-col justify-between bg-slate-900/30 space-y-2">
                <span className="text-xs font-bold text-slate-300">
                  🔗 หรือใส่ลิงก์รูปภาพ (Image URL)
                </span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://...รูปภาพ.jpg"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-slate-700"
                  >
                    + เพิ่ม
                  </button>
                </div>
                <span className="text-[10px] text-slate-500">
                  แคปหน้าจอแล้วกด <b>Ctrl + V</b> ที่หน้านี้เพื่อแปะรูปได้ทันที
                </span>
              </div>
            </div>

            {/* Uploaded Thumbnails */}
            {images.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                  * รูปแรกสุดคือ <b>รูปปกหลัก (Cover Image)</b> ที่จะโชว์บนการ์ดหน้าร้าน:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {images.map((imgSrc, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 group bg-slate-950">
                      <img src={imgSrc} alt="Preview" className="w-full h-full object-cover" />
                      
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-amber-500 text-black font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                          รูปปก
                        </span>
                      )}

                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetCoverImage(idx)}
                            className="p-1 rounded bg-amber-500 text-black text-[10px] font-bold"
                            title="ตั้งเป็นรูปปก"
                          >
                            ⭐ ปก
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1 rounded bg-red-600 text-white text-[10px] font-bold"
                          title="ลบรูปนี้"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 📝 3. FORM FIELDS */}
          <form id="account-form" onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            
            {/* Row 1: ID, Region, Category, Hot Deal */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">รหัสไอดี (ID)</label>
                <input
                  type="text"
                  required
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">ประเทศของไอดี 🌍</label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2 text-amber-300 font-bold focus:border-amber-500 outline-none"
                >
                  <option value="th">🇹🇭 ไอดีไทย (Thailand)</option>
                  <option value="cn">🇨🇳 ไอดีจีน (China)</option>
                  <option value="vn">🇻🇳 ไอดีเวียดนาม (Vietnam)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">หมวดหมู่</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                >
                  <option value="progressive">ปืนอัปเกรด Progressive</option>
                  <option value="rank-ready">พร้อมลงแรงค์ (Rank Ready)</option>
                  <option value="rare-skins">ของสะสม & สกินแรร์ (BAPE/Shroud)</option>
                  <option value="budget">ไอดีงบประหยัด</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">ดีลเด่น (Spotlight)</label>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isHot}
                    onChange={(e) => setFormData({ ...formData, isHot: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-950 border-slate-800"
                  />
                  <span className="text-amber-400 font-bold">⚡ Hot Deal</span>
                </label>
              </div>
            </div>

            {/* Row 2: Title TH & EN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">ชื่อไอดี (หัวข้อขาย) 🇹🇭</label>
                <input
                  type="text"
                  required
                  placeholder="กรอกชื่อหัวข้อไอดี เช่น Aug มิโนทอร์ ขาว คู่เขียว คู่ทอง"
                  value={formData.title_th}
                  onChange={(e) => setFormData({ ...formData, title_th: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">ชื่อไอดี (English) 🇬🇧</label>
                <input
                  type="text"
                  placeholder="English title (or leave same as TH)"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Row 3: Subtitle / Fashion / Cars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">สกินรถ / แฟชั่นเด่น 🇹🇭</label>
                <input
                  type="text"
                  placeholder="เช่น แฟชั่นแต่งทรงจีนสวยๆ Urus S, Cayenne, Aston Martin"
                  value={formData.subtitle_th}
                  onChange={(e) => setFormData({ ...formData, subtitle_th: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">การรับประกัน & อีเมล</label>
                <input
                  type="text"
                  placeholder="เช่น id steam ไทย มีประกันมือ 1"
                  value={formData.warranty_th}
                  onChange={(e) => setFormData({ ...formData, warranty_th: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Row 4: Pricing */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">ราคาขาย (฿ THB) 🇹🇭</label>
                <input
                  type="number"
                  required
                  placeholder="16000"
                  value={formData.priceTHB}
                  onChange={(e) => {
                    const thb = e.target.value;
                    const vnd = thb ? Math.round((Number(thb) * 720) / 10000) * 10000 : '';
                    setFormData({ ...formData, priceTHB: thb, priceVND: vnd });
                  }}
                  className="w-full bg-slate-900 border border-amber-500/50 rounded-xl px-3 py-2 text-amber-400 font-black text-base focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">ราคาขาย (₫ VND) 🇻🇳</label>
                <input
                  type="number"
                  required
                  placeholder="11500000"
                  value={formData.priceVND}
                  onChange={(e) => setFormData({ ...formData, priceVND: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-black text-base focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">ราคาเต็ม (฿ THB)</label>
                <input
                  type="number"
                  placeholder="19000"
                  value={formData.originalPriceTHB}
                  onChange={(e) => setFormData({ ...formData, originalPriceTHB: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-400 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">ราคาเต็ม (₫ VND)</label>
                <input
                  type="number"
                  placeholder="13800000"
                  value={formData.originalPriceVND}
                  onChange={(e) => setFormData({ ...formData, originalPriceVND: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-400 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Row 5: Gun Highlight Summary */}
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                สรุปรายการปืนอัปเกรด (Gun Summary)
              </label>
              <input
                type="text"
                placeholder="เช่น Aug Lv.10 Max + Chroma | Mini Lv.6 Max | Beryl Lv.2"
                value={formData.gunLevel_th}
                onChange={(e) => setFormData({ ...formData, gunLevel_th: e.target.value, gunLevel_en: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
              />
            </div>

            {/* Row 6: Video Link */}
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                🎬 ลิงก์คลิปวิดีโอรีวิวคลังไอดี (YouTube / Facebook / TikTok) - ถ้ามี
              </label>
              <input
                type="url"
                placeholder="https://youtu.be/... หรือ https://www.facebook.com/..."
                value={formData.videoUrl || ''}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-blue-400 placeholder-slate-600 focus:border-amber-500 outline-none font-mono text-xs"
              />
            </div>

            {/* Row 7: Steam Credentials for Auto Delivery */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <span>🔐 ข้อมูลรหัส Steam สำหรับส่งมอบอัตโนมัติ (ลูกค้าจะเห็นหลังชำระเงินสำเร็จ)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 text-[11px]">Steam Username</label>
                  <input
                    type="text"
                    placeholder="steam_username"
                    value={formData.steamUser || ''}
                    onChange={(e) => setFormData({ ...formData, steamUser: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 text-[11px]">Steam Password</label>
                  <input
                    type="text"
                    placeholder="Passw0rd#2026"
                    value={formData.steamPass || ''}
                    onChange={(e) => setFormData({ ...formData, steamPass: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 text-[11px]">Original Mail & Pass</label>
                  <input
                    type="text"
                    placeholder="email@gmail.com | pass"
                    value={formData.steamEmail || ''}
                    onChange={(e) => setFormData({ ...formData, steamEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>

          </form>

        </div>

        {/* Sticky Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 p-4 sm:p-5 bg-[#0f1522] sticky bottom-0 z-20">
          <span className="text-xs text-slate-400">
            {images.length > 0 ? `📸 มีรูปภาพแนบ ${images.length} รูป` : '⚠️ ยังไม่ได้แนบรูปภาพ (แนบหรือไม่ก็ได้)'}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              form="account-form"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-black text-xs sm:text-sm shadow-lg pubg-glow transition-all"
            >
              {editingAccount ? '💾 บันทึกการแก้ไข' : '🚀 เพิ่มไอดีเข้าสู่หน้าร้านทันที'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

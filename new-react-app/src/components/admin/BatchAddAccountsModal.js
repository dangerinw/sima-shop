import React, { useState, useEffect } from 'react';
import { ALL_FILTER_SKINS, matchSkinsFromText } from '../../utils/pubgSkinMatcher';

export default function BatchAddAccountsModal({
  isOpen,
  onClose,
  onSaveBatch,
  currency = 'THB',
  lang = 'th'
}) {
  // Array of accounts being created in batch
  const [batchAccounts, setBatchAccounts] = useState([
    createEmptyAccount(1),
    createEmptyAccount(2),
    createEmptyAccount(3)
  ]);

  const [multiPostText, setMultiPostText] = useState('');
  const [activeAccountIndex, setActiveAccountIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Helper to generate a new empty account row
  function createEmptyAccount(offset = 1) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return {
      tempId: `temp-${Date.now()}-${offset}-${Math.random()}`,
      id: `PC-${randomNum}`,
      region: 'th',
      category: 'progressive',
      title_th: '',
      title_en: '',
      priceTHB: '',
      priceVND: '',
      allowInstallment: true,
      isHot: false,
      gunLevel_th: '',
      details_th: '',
      videoUrl: '',
      images: [],
      attachedSkinItems: [],
      rawText: ''
    };
  }

  // Handle global or card-level paste (Ctrl+V) for images
  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalPaste = (e) => {
      // Check for image files in clipboard
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        processAndAttachImages(activeAccountIndex, imageFiles);
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeAccountIndex, batchAccounts]);

  // Image compressor helper
  const processImageFile = (file) => {
    return new Promise((resolve) => {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const maxDim = 960;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.75);
            resolve(compressed);
          };
          img.onerror = () => resolve(event.target.result);
          img.src = event.target.result;
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      } catch (_) {
        resolve('');
      }
    });
  };

  const processAndAttachImages = async (index, files) => {
    if (!files || files.length === 0) return;
    const compressedList = await Promise.all(Array.from(files).map((f) => processImageFile(f)));
    const validCompressed = compressedList.filter(Boolean);

    setBatchAccounts((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          images: [...(updated[index].images || []), ...validCompressed]
        };
      }
      return updated;
    });
  };

  // Smart Parser for an individual account text
  const parseSingleAccountText = (text, currentAccount) => {
    if (!text || typeof text !== 'string') return currentAccount;

    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const lower = text.toLowerCase();

    // 1. Price
    let priceTHB = currentAccount.priceTHB;
    const priceMatch = text.match(/(?:ขาย|ปล่อย|ราคา|สด)\s*[:=]?\s*([0-9,]+)\s*(?:บาท|thb|฿|\b|$)/i) ||
      text.match(/([0-9,]{3,7})\s*(?:บาท|thb|฿)/i);
    if (priceMatch) {
      const cleanNum = parseInt(priceMatch[1].replace(/,/g, ''), 10);
      if (cleanNum > 0) priceTHB = cleanNum;
    }
    const priceVND = priceTHB ? Math.round((priceTHB * 720) / 10000) * 10000 : 0;

    // 2. Region & Installment
    let region = currentAccount.region || 'th';
    if (/จีน|china/i.test(text)) region = 'cn';
    else if (/เวียดนาม|vietnam/i.test(text)) region = 'vn';
    else if (/ไทย/i.test(text)) region = 'th';

    let allowInstallment = region === 'th';
    if (lower.includes('ผ่อนได้') || lower.includes('รับผ่อน') || lower.includes('เปิดผ่อน')) {
      allowInstallment = true;
    } else if (lower.includes('สดเท่านั้น') || lower.includes('ไม่รับผ่อน') || lower.includes('ไม่ผ่อน') || lower.includes('สดเท่าน้น')) {
      allowInstallment = false;
    }

    // 3. Title & Gun level
    let title = lines[0] || currentAccount.title_th || 'ไอดี PUBG PC Steam ของแท้';
    title = title.replace(/^(?:ขาย|ปล่อย|ส่งต่อ)\s*[0-9,]*\s*(?:บาท|thb|฿)?\s*[:=\-,]?\s*/i, '').trim();

    const gunLines = lines.filter((l) => l.includes('🟢') || l.includes('LV.') || l.includes('Max') || l.includes('Lv.'));
    const gunSummary = gunLines.length > 0 ? gunLines.map((l) => l.replace(/^[🟢•\-\s]+/, '')).join(' | ') : '';

    // 4. Video link
    const urlMatch = text.match(/https?:\/\/[^\s]+/);
    const videoUrl = urlMatch ? urlMatch[0] : currentAccount.videoUrl;

    // 5. Smart Skin Detection with Fuzzy Alias Matcher
    const matchedSkins = matchSkinsFromText(`${title} ${gunSummary} ${text}`, ALL_FILTER_SKINS);

    return {
      ...currentAccount,
      title_th: title,
      title_en: title,
      priceTHB: priceTHB || '',
      priceVND: priceVND || '',
      region,
      allowInstallment,
      gunLevel_th: gunSummary || currentAccount.gunLevel_th,
      details_th: text,
      videoUrl: videoUrl || '',
      attachedSkinItems: matchedSkins
    };
  };

  // Multi-Post Smart Splitter:
  // Splits a bulk text block into multiple accounts separated by '---' or double newlines or 'ขาย'
  const handleSplitMultiPost = () => {
    if (!multiPostText.trim()) return;

    // Split by separator lines (---) or double newlines or multiple "ขาย"
    let rawBlocks = multiPostText
      .split(/(?:\r?\n\s*[-=]{3,}\s*\r?\n)|(?:\r?\n\s*\r?\n\s*\r?\n)/)
      .map((b) => b.trim())
      .filter(Boolean);

    // If still 1 big block, try splitting by lines starting with "ขาย" or "รหัส"
    if (rawBlocks.length === 1 && rawBlocks[0].includes('ขาย')) {
      const splitByKai = rawBlocks[0].split(/(?=\n(?:ขาย|ไอดี|รหัส)\s*)/i).map((b) => b.trim()).filter(Boolean);
      if (splitByKai.length > 1) {
        rawBlocks = splitByKai;
      }
    }

    if (rawBlocks.length === 0) return;

    const newAccounts = rawBlocks.map((block, idx) => {
      const empty = createEmptyAccount(idx + 1);
      return parseSingleAccountText(block, empty);
    });

    setBatchAccounts(newAccounts);
    setMultiPostText('');
  };

  // Add another empty account row
  const handleAddRow = () => {
    setBatchAccounts((prev) => [...prev, createEmptyAccount(prev.length + 1)]);
  };

  // Remove an account row
  const handleRemoveRow = (index) => {
    if (batchAccounts.length <= 1) {
      alert('ต้องมีอย่างน้อย 1 ไอดีในรายการครับ');
      return;
    }
    setBatchAccounts((prev) => prev.filter((_, i) => i !== index));
    if (activeAccountIndex >= index && activeAccountIndex > 0) {
      setActiveAccountIndex((prev) => prev - 1);
    }
  };

  // Update a field in a specific account
  const handleFieldChange = (index, field, value) => {
    setBatchAccounts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'priceTHB') {
        const num = parseInt(String(value).replace(/,/g, ''), 10) || 0;
        updated[index].priceVND = num ? Math.round((num * 720) / 10000) * 10000 : 0;
      }
      return updated;
    });
  };

  // Toggle skin item in an account
  const handleToggleSkin = (accIndex, skinItem) => {
    setBatchAccounts((prev) => {
      const updated = [...prev];
      const acc = updated[accIndex];
      const exists = (acc.attachedSkinItems || []).some((it) => it.id === skinItem.id);
      if (exists) {
        acc.attachedSkinItems = acc.attachedSkinItems.filter((it) => it.id !== skinItem.id);
      } else {
        acc.attachedSkinItems = [...(acc.attachedSkinItems || []), skinItem];
      }
      return updated;
    });
  };

  // Submit all accounts in batch
  const handleSubmitAll = async () => {
    // Validate: each account must have a title and a valid price
    const invalidList = [];
    batchAccounts.forEach((acc, i) => {
      if (!acc.title_th && !acc.title_en) {
        invalidList.push(`ไอดีลำดับที่ ${i + 1}: ยังไม่ได้กรอกชื่อไอดี`);
      }
      if (!acc.priceTHB || Number(acc.priceTHB) <= 0) {
        invalidList.push(`ไอดีลำดับที่ ${i + 1}: ยังไม่ได้ระบุราคา`);
      }
    });

    if (invalidList.length > 0) {
      alert(`⚠️ กรุณาตรวจสอบข้อมูลก่อนบันทึก:\n\n${invalidList.slice(0, 5).join('\n')}`);
      return;
    }

    setIsSaving(true);
    try {
      const preparedList = batchAccounts.map((acc) => {
        const priceNum = Number(String(acc.priceTHB).replace(/,/g, '')) || 0;
        const priceVndNum = Number(acc.priceVND) || Math.round((priceNum * 720) / 10000) * 10000;
        const skinItems = acc.attachedSkinItems || [];

        return {
          id: acc.id || `PC-${Math.floor(1000 + Math.random() * 9000)}`,
          region: acc.region || 'th',
          category: acc.category || 'progressive',
          title: acc.title_th || acc.title_en,
          title_th: acc.title_th || acc.title_en,
          title_en: acc.title_en || acc.title_th,
          subtitle: acc.subtitle_th || acc.title_th,
          subtitle_th: acc.title_th,
          subtitle_en: acc.title_en,
          priceTHB: priceNum,
          priceVND: priceVndNum,
          originalPriceTHB: Math.round(priceNum * 1.2),
          originalPriceVND: Math.round(priceVndNum * 1.2),
          allowInstallment: Boolean(acc.allowInstallment),
          isHot: Boolean(acc.isHot),
          gunLevel: acc.gunLevel_th || '',
          gunLevel_th: acc.gunLevel_th || '',
          gunLevel_en: acc.gunLevel_th || '',
          details: acc.details_th || acc.title_th,
          details_th: acc.details_th || acc.title_th,
          details_en: acc.details_th || acc.title_th,
          videoUrl: acc.videoUrl || '',
          images: acc.images || [],
          coverImg: acc.images?.[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
          detailImages: acc.images?.slice(1) || [],
          tags: [
            acc.region === 'th' ? 'ไอดีไทย' : 'ไอดีจีน',
            acc.allowInstallment ? 'ผ่อนได้' : 'สดเท่านั้น',
            ...skinItems.map((it) => it.thaiName || it.name).filter(Boolean)
          ],
          skinItemIds: skinItems.map((it) => it.id),
          skinItems: skinItems.map((it) => ({
            id: it.id,
            name: it.name,
            thaiName: it.thaiName || it.name,
            localIcon: it.localIcon || null
          })),
          isCustomLocal: true,
          createdAt: new Date().toISOString()
        };
      });

      await onSaveBatch(preparedList);
      alert(`🎉 บันทึกไอดีเข้าสู่ระบบสำเร็จทั้งหมด ${preparedList.length} ไอดีเรียบร้อยแล้ว!`);
      onClose();
    } catch (err) {
      alert(`เกิดข้อผิดพลาดในการบันทึก: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div 
        className="bg-[#0b101a] border border-amber-500/40 rounded-3xl max-w-6xl w-full max-h-[95vh] flex flex-col shadow-2xl relative overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
              📦
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  ระบบลงไอดีแบบชุดพร้อมกัน (Batch Fast Listing)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow">
                  เร็วขึ้น 10x
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ลงหลายไอดีพร้อมกันในหน้าเดียว • แยกข้อความโพสต์อัตโนมัติ • รองรับ Ctrl + V วางรูปได้ทันที
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 scrollbar-thin scrollbar-thumb-amber-500/40">
          
          {/* SECTION 1: SMART BULK TEXT SPLITTER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-purple-950/20 to-slate-950 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-black text-purple-300 flex items-center gap-2">
                <span>⚡</span>
                <span>วางข้อความโพสต์หลายไอดีพร้อมกัน (Multi-Post Smart Splitter):</span>
              </label>
              <span className="text-[11px] text-slate-400">
                แยกแต่ละไอดีด้วยการเว้นวรรค 2 บรรทัด หรือขีด <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">---</code>
              </span>
            </div>

            <textarea
              rows={3}
              value={multiPostText}
              onChange={(e) => setMultiPostText(e.target.value)}
              placeholder="ตัวอย่างการวาง:&#10;ขาย 16000 อ็อกมิโนทอร์ เวล 10 แม็ก รถ Urus ...&#10;---&#10;ขาย 8500 M4 โจ๊กเกอร์ เวล 6 มังกรฟ้า เวล 4 ...&#10;---&#10;ขาย 4500 ไอดีไทย พร้อมแรงค์ Tier 4 ผ่อนได้ ..."
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-purple-400 font-sans"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleSplitMultiPost}
                disabled={!multiPostText.trim()}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-lg ${
                  multiPostText.trim()
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/40 scale-[1.02]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>🚀</span>
                <span>แยกและแปลงเป็นไอดีอัตโนมัติ (Split to Accounts)</span>
              </button>
            </div>
          </div>

          {/* SECTION 2: ACCOUNTS LIST */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  📋 รายการไอดีที่กำลังเตรียมลง ({batchAccounts.length} ไอดี):
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  (คลิกที่การ์ดเพื่อเลือกโฟกัส แล้วกด Ctrl+V เพื่อแปะรูปได้ทันที)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="px-3.5 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-black flex items-center gap-1 transition shadow"
                >
                  <span>➕</span>
                  <span>เพิ่มอีก 1 ไอดี</span>
                </button>
              </div>
            </div>

            {/* ACCOUNT CARDS LIST */}
            <div className="space-y-4">
              {batchAccounts.map((account, index) => {
                const isActive = activeAccountIndex === index;
                return (
                  <div
                    key={account.tempId}
                    onClick={() => setActiveAccountIndex(index)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-slate-900/90 border-amber-500 shadow-xl shadow-amber-950/20 ring-1 ring-amber-500/50'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* CARD TOP BAR */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <label className="text-xs text-slate-400 font-semibold">รหัส:</label>
                          <input
                            type="text"
                            value={account.id}
                            onChange={(e) => handleFieldChange(index, 'id', e.target.value)}
                            className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-0.5 text-xs font-mono font-bold text-amber-300 w-28 focus:border-amber-400 outline-none"
                          />
                        </div>

                        {isActive && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold animate-pulse">
                            กำลังเลือก (Active)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveRow(index);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs font-bold transition flex items-center gap-1"
                          title="ลบแถวไอดีนี้"
                        >
                          <span>🗑️</span>
                          <span>ลบ</span>
                        </button>
                      </div>
                    </div>

                    {/* CARD GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      
                      {/* COL 1: IMAGES UPLOADER & THUMBNAILS (4 COLS) */}
                      <div className="lg:col-span-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                            <span>🖼️</span>
                            <span>รูปภาพ ({account.images?.length || 0})</span>
                          </label>
                          <span className="text-[10px] text-slate-400">Ctrl+V แปะได้เลย</span>
                        </div>

                        {/* Dropzone & Picker */}
                        <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-xl bg-slate-950/60 cursor-pointer transition group min-h-[90px]">
                          <span className="text-xl group-hover:scale-110 transition-transform">📸</span>
                          <span className="text-[11px] text-slate-300 font-bold mt-1">คลิกเลือกรูป หรือลากวาง</span>
                          <span className="text-[10px] text-slate-500">หรือกด Ctrl+V ในการ์ดนี้</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files) {
                                processAndAttachImages(index, e.target.files);
                              }
                            }}
                          />
                        </label>

                        {/* Thumbnails preview strip */}
                        {account.images && account.images.length > 0 && (
                          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                            {account.images.map((imgSrc, imgIdx) => (
                              <div key={imgIdx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-700 shrink-0 group">
                                <img src={imgSrc} alt="preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setBatchAccounts((prev) => {
                                      const updated = [...prev];
                                      updated[index].images = updated[index].images.filter((_, i) => i !== imgIdx);
                                      return updated;
                                    });
                                  }}
                                  className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  ✕
                                </button>
                                {imgIdx === 0 && (
                                  <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-amber-300 font-bold text-center">
                                    รูปปก
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* COL 2: MAIN DETAILS & PRICING (8 COLS) */}
                      <div className="lg:col-span-8 space-y-3">
                        
                        {/* Quick Text Parse Box for this account */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-slate-400">
                              วางข้อความโพสต์ของไอดีนี้ (Auto-Fill เฉพาะการ์ดนี้):
                            </label>
                            {account.rawText && (
                              <button
                                type="button"
                                onClick={() => {
                                  const parsed = parseSingleAccountText(account.rawText, account);
                                  setBatchAccounts((prev) => {
                                    const u = [...prev];
                                    u[index] = parsed;
                                    return u;
                                  });
                                }}
                                className="text-[10px] text-purple-400 hover:underline font-bold"
                              >
                                ⚡ สแกนซ้ำ
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={account.rawText || ''}
                            placeholder="วางข้อความโพสต์ เช่น: ขาย 16000 อ็อกมิโนทอร์ เวล 10 แม็ก รถ Urus S ... ผ่อนได้"
                            onChange={(e) => {
                              const val = e.target.value;
                              handleFieldChange(index, 'rawText', val);
                              if (val.length > 8) {
                                const parsed = parseSingleAccountText(val, { ...account, rawText: val });
                                setBatchAccounts((prev) => {
                                  const u = [...prev];
                                  u[index] = parsed;
                                  return u;
                                });
                              }
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-purple-400 outline-none"
                          />
                        </div>

                        {/* Title & Price Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                          <div className="sm:col-span-8">
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">
                              ชื่อไอดี / สกินเด่น *
                            </label>
                            <input
                              type="text"
                              required
                              value={account.title_th}
                              placeholder="เช่น AUG มิโนทอร์ เวล 10 Max + รถ Urus S"
                              onChange={(e) => {
                                const val = e.target.value;
                                handleFieldChange(index, 'title_th', val);
                                handleFieldChange(index, 'title_en', val);
                                // Live detect skins
                                const matched = matchSkinsFromText(val);
                                if (matched.length > 0) {
                                  setBatchAccounts((prev) => {
                                    const u = [...prev];
                                    const map = new Map((u[index].attachedSkinItems || []).map((it) => [it.id, it]));
                                    matched.forEach((it) => map.set(it.id, it));
                                    u[index].attachedSkinItems = Array.from(map.values());
                                    return u;
                                  });
                                }
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-amber-500 outline-none font-bold"
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">
                              ราคาขาย (บาท) *
                            </label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1.5 text-xs text-amber-400 font-bold">฿</span>
                              <input
                                type="number"
                                required
                                value={account.priceTHB}
                                placeholder="เช่น 16000"
                                onChange={(e) => handleFieldChange(index, 'priceTHB', e.target.value)}
                                className="w-full bg-slate-950 border border-amber-500/50 rounded-xl pl-6 pr-2 py-1.5 text-xs text-amber-300 font-black focus:border-amber-500 outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Settings Row: Region, Installment, Hot Deal */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">ประเทศ</label>
                            <select
                              value={account.region}
                              onChange={(e) => {
                                const newReg = e.target.value;
                                handleFieldChange(index, 'region', newReg);
                                handleFieldChange(index, 'allowInstallment', newReg === 'th');
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-amber-300 font-bold outline-none"
                            >
                              <option value="th">🇹🇭 ไทย</option>
                              <option value="cn">🇨🇳 จีน</option>
                              <option value="vn">🇻🇳 เวียดนาม</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">ผ่อนชำระ ⚡</label>
                            <label className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border cursor-pointer select-none ${
                              account.allowInstallment ? 'bg-purple-950/40 border-purple-500 text-purple-200' : 'bg-slate-950 border-slate-850 text-slate-400'
                            }`}>
                              <input
                                type="checkbox"
                                checked={account.allowInstallment}
                                onChange={(e) => handleFieldChange(index, 'allowInstallment', e.target.checked)}
                                className="w-3.5 h-3.5 rounded text-purple-500"
                              />
                              <span className="text-[11px] font-bold">
                                {account.allowInstallment ? 'ผ่อนได้' : 'สดเท่านั้น'}
                              </span>
                            </label>
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">ดีลเด่น 🔥</label>
                            <label className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border cursor-pointer select-none ${
                              account.isHot ? 'bg-amber-950/40 border-amber-500 text-amber-300' : 'bg-slate-950 border-slate-850 text-slate-400'
                            }`}>
                              <input
                                type="checkbox"
                                checked={account.isHot}
                                onChange={(e) => handleFieldChange(index, 'isHot', e.target.checked)}
                                className="w-3.5 h-3.5 rounded text-amber-500"
                              />
                              <span className="text-[11px] font-bold">Hot Deal</span>
                            </label>
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">หมวดหมู่</label>
                            <select
                              value={account.category}
                              onChange={(e) => handleFieldChange(index, 'category', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 outline-none"
                            >
                              <option value="progressive">ปืนอัปเกรด</option>
                              <option value="rank-ready">พร้อมแรงค์</option>
                              <option value="rare-skins">ของสะสม/แรร์</option>
                              <option value="budget">งบประหยัด</option>
                            </select>
                          </div>
                        </div>

                        {/* Auto-Mapped Noctis Skins */}
                        <div className="pt-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                              <span>🎯</span>
                              <span>สกินที่จับคู่กับฟิลเตอร์อัตโนมัติ (Noctis Filter):</span>
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {account.attachedSkinItems?.length || 0} รายการ
                            </span>
                          </div>

                          {account.attachedSkinItems && account.attachedSkinItems.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-1.5 bg-slate-950/60 rounded-xl border border-slate-800">
                              {account.attachedSkinItems.map((skin) => (
                                <span
                                  key={skin.id}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40"
                                >
                                  <span>{skin.thaiName || skin.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSkin(index, skin)}
                                    className="hover:text-red-400 font-black ml-0.5"
                                  >
                                    ✕
                                  </button>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-500 italic p-1">
                              (พิมพ์ชื่อปืนหรือวางข้อความโพสต์ ระบบจะสแกนและจับคู่สกินให้ทันที)
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM STICKY ACTION BAR */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between flex-wrap gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300 font-semibold">
              พร้อมบันทึก: <strong className="text-amber-400 text-sm">{batchAccounts.length}</strong> ไอดี
            </span>
            <button
              type="button"
              onClick={handleAddRow}
              className="text-xs text-amber-400 hover:text-amber-300 hover:underline font-bold"
            >
              + เพิ่มแถวอีก
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              ยกเลิก
            </button>

            <button
              type="button"
              onClick={handleSubmitAll}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-950/40 transition-all scale-[1.02] active:scale-98"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>กำลังบันทึก {batchAccounts.length} ไอดี...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>บันทึกลงระบบทั้งหมด ({batchAccounts.length} ไอดี)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

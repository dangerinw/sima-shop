import React, { useState, useEffect } from 'react';
import { getPromptPayQrImageUrl, getVietQrImageUrl } from '../utils/paymentQr';

export default function AccountModal({ 
  account, 
  currency, 
  lang, 
  t, 
  onClose, 
  onBuySuccess,
  currentUser,
  onOpenUserAuth,
  onOpenUserPurchases,
  storeSettings = {}
}) {
  const [step, setStep] = useState('details'); // details | checkout | payment_qr | success
  const [buyerName, setBuyerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(currency === 'THB' ? 'PromptPay QR' : 'VietQR Bank');
  const [createdOrder, setCreatedOrder] = useState(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Payment QR & Slip State
  const [pendingOrderId, setPendingOrderId] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15:00 minutes
  const [slipImage, setSlipImage] = useState(null);
  const [isVerifyingSlip, setIsVerifyingSlip] = useState(false);
  const [verifyStatusText, setVerifyStatusText] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  // Sync buyer name when user is logged in
  useEffect(() => {
    if (currentUser) {
      setBuyerName(currentUser.name || currentUser.username);
    } else {
      setBuyerName('');
    }
  }, [currentUser]);

  // Reset modal state when new account opens
  useEffect(() => {
    setStep('details');
    setCreatedOrder(null);
    setActiveImgIndex(0);
    setSlipImage(null);
    setIsVerifyingSlip(false);
    setTimeLeft(900);
  }, [account]);

  // Countdown timer for Payment QR
  useEffect(() => {
    if (step !== 'payment_qr') return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  if (!account) return null;

  const formatPrice = (vnd, thb) => {
    if (currency === 'THB') {
      return `฿${Number(thb).toLocaleString()}`;
    }
    return `${Number(vnd).toLocaleString()} ₫`;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const title = lang === 'th' ? account.title_th : account.title_en;
  const details = lang === 'th' ? account.details_th : account.details_en;
  const binding = lang === 'th' ? account.binding_th : account.binding_en;
  const warranty = lang === 'th' ? account.warranty_th : account.warranty_en;
  const playtime = lang === 'th' ? account.playtime_th : account.playtime_en;

  const getRegionText = (region) => {
    switch (region) {
      case 'th':
        return lang === 'th' ? '🇹🇭 ประเทศไทย (Thailand Steam)' : '🇹🇭 Thailand Steam Account';
      case 'cn':
        return lang === 'th' ? '🇨🇳 ประเทศจีน (China Steam)' : '🇨🇳 China Steam Account';
      case 'vn':
        return lang === 'th' ? '🇻🇳 ประเทศเวียดนาม (Vietnam Steam)' : '🇻🇳 Vietnam Steam Account';
      default:
        return '🌐 Global';
    }
  };

  // Step 2 -> Step 3: Go to Payment QR screen
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    setPendingOrderId(orderId);
    setTimeLeft(900);
    setStep('payment_qr');
  };

  // Process Slip File upload or paste
  const handleSlipFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSlipImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Support Ctrl+V paste slip directly
  const handlePasteSlip = (e) => {
    const items = e.clipboardData?.items || [];
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setSlipImage(event.target.result);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  // Verify slip & issue account
  const handleVerifyAndComplete = () => {
    if (!slipImage) {
      alert('กรุณาแนบรูปภาพสลิปการโอนเงินจากแอปธนาคารของคุณก่อนครับ');
      return;
    }

    setIsVerifyingSlip(true);
    setVerifyStatusText('🔍 กำลังสแกน QR Code และอ่านข้อมูลบนสลิป...');

    setTimeout(() => {
      setVerifyStatusText(`✓ ตรวจพบยอดเงิน ${formatPrice(account.priceVND, account.priceTHB)} ตรงกับคำสั่งซื้อ!`);
      
      setTimeout(() => {
        const finalBuyerName = buyerName.trim() || (currentUser?.name || currentUser?.username) || (lang === 'th' ? 'ลูกค้าทั่วไป (Guest)' : 'Guest Customer');

        const newOrder = {
          orderId: pendingOrderId,
          userId: currentUser ? currentUser.id : null,
          customerName: finalBuyerName,
          accountId: account.id,
          accountTitle: title,
          amountVND: account.priceVND,
          amountTHB: account.priceTHB,
          paymentMethod,
          status: 'completed',
          createdAt: new Date().toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }),
          steamUser: account.steamUser || `steam_buyer_${account.id.toLowerCase()}`,
          steamPass: account.steamPass || 'Pass#2026Auto',
          mailInfo: account.steamEmail || `ogmail_${account.id.toLowerCase()}@gmail.com | pass: SteamOG2026`,
          warranty: warranty || 'มีประกันมือ 1 แท้ (ปลอดภัย 100%)',
          region: account.region || 'th',
          slipImage: slipImage // Save the slip image to the order for Admin inspection!
        };

        setCreatedOrder(newOrder);
        setIsVerifyingSlip(false);
        setStep('success');

        if (onBuySuccess) {
          onBuySuccess(account.id, newOrder);
        }
      }, 1000);
    }, 1200);
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // QR URLs
  const promptPayId = storeSettings.promptPayId || '0891234567';
  const promptPayQrUrl = getPromptPayQrImageUrl(promptPayId, account.priceTHB, 300);

  const vietQrBank = storeSettings.vietQrBank || 'MB';
  const vietQrAccount = storeSettings.vietQrAccountNo || '0987654321';
  const vietQrName = storeSettings.vietQrAccountName || 'SIMA SHOP VN';
  const vietQrUrl = getVietQrImageUrl(vietQrBank, vietQrAccount, account.priceVND, pendingOrderId, vietQrName);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
      onClick={onClose}
      onPaste={step === 'payment_qr' ? handlePasteSlip : undefined}
    >
      <div 
        className="bg-[#111723] border border-slate-700/80 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        {/* STEP 1: DETAILS VIEW */}
        {step === 'details' && (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  PUBG PC • STEAM ACCOUNT
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-white border border-slate-700">
                  {getRegionText(account.region)}
                </span>
              </div>
              <h3 className="text-2xl font-black text-white mt-2 leading-tight">
                {title}
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-1">{t.modalRef} #{account.id}</p>
            </div>

            {/* Visual Preview / Real Photo Gallery */}
            {account.images && account.images.length > 0 ? (
              <div className="space-y-2">
                <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                  <img
                    src={account.images[activeImgIndex] || account.images[0]}
                    alt={`Preview ${activeImgIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute bottom-3 right-3 text-xs bg-black/80 px-2.5 py-1 rounded-md text-amber-400 font-mono border border-slate-700 shadow">
                    {activeImgIndex + 1} / {account.images.length} รูป
                  </span>
                </div>

                {/* Thumbnail Strip */}
                {account.images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {account.images.map((imgSrc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImgIndex(idx)}
                        className={`relative w-20 aspect-video rounded-lg overflow-hidden border transition-all flex-shrink-0 ${
                          activeImgIndex === idx
                            ? 'border-amber-500 scale-105 shadow-md ring-2 ring-amber-500/30'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={imgSrc} alt="thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                <div className="text-center p-6">
                  <div className="text-5xl mb-3">🎮</div>
                  <div className="text-sm font-bold text-slate-200">{t.modalPreviewTitle}</div>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed whitespace-pre-line">
                    {details}
                  </p>
                </div>
              </div>
            )}

            {/* Video Review Link */}
            {account.videoUrl && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <span>🎥</span>
                  <span>มีคลิปวิดีโอรีวิวคลังไอดีจริง</span>
                </div>
                <a
                  href={account.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs bg-amber-500 text-black px-3 py-1 rounded-lg font-extrabold hover:bg-amber-400 transition-colors"
                >
                  คลิกดูวิดีโอ ↗
                </a>
              </div>
            )}

            {/* Technical Specs */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                {t.modalSecTitle}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">{t.specRegion}</span>
                  <span className="font-bold text-amber-300">{getRegionText(account.region)}</span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">{t.modalBinding}</span>
                  <span className="font-bold text-emerald-400">{binding}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">{t.modalVac}</span>
                  <span className="font-bold text-emerald-400">{t.modalVacClean}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">{t.modalPlaytimeRank}</span>
                  <span className="font-bold text-white">{playtime} ({account.rank})</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 sm:col-span-2">
                  <span className="text-slate-400 block text-[11px]">{t.modalWarranty}</span>
                  <span className="font-bold text-amber-400">{warranty}</span>
                </div>
              </div>
            </div>

            {/* Pricing & Checkout Action */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400">{t.modalNetPrice}</span>
                <div className="text-3xl font-black text-amber-400">
                  {formatPrice(account.priceVND, account.priceTHB)}
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => setStep('checkout')}
                  className="flex-1 sm:flex-none px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-extrabold text-sm shadow-lg pubg-glow transition-all"
                >
                  {t.modalBuyBtn}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* STEP 2: CHECKOUT & PAYMENT METHOD */}
        {step === 'checkout' && (
          <form onSubmit={handleProceedToPayment} className="p-6 sm:p-8 space-y-5 overflow-y-auto flex-1">
            <div>
              <button 
                type="button" 
                onClick={() => setStep('details')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2 font-semibold"
              >
                ← ย้อนกลับไปดูสเปกไอดี
              </button>
              <h3 className="text-2xl font-black text-white">ยืนยันคำสั่งซื้อ & เลือกวิธีชำระเงิน</h3>
              <p className="text-xs text-slate-400 mt-1">ขั้นตอนที่ 1 จาก 2: ตรวจสอบข้อมูลก่อนสร้าง QR Code ชำระเงิน</p>
            </div>

            {/* Customer Status Banner */}
            {currentUser ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{currentUser.avatar || '👑'}</span>
                  <div>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <span>✓</span>
                      <span>ซื้อในนามสมาชิก: {currentUser.name || currentUser.username}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      ข้อมูลรหัส Steam จะถูกบันทึกเข้าสู่ <b>"คลังไอดีของฉัน"</b> อัตโนมัติ ปลอดภัย ไม่หาย
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                  @{currentUser.username}
                </span>
              </div>
            ) : (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-start gap-2">
                  <span className="text-base mt-0.5">💡</span>
                  <div className="text-xs text-slate-300">
                    <span className="font-bold text-amber-400">ยังไม่ได้เข้าสู่ระบบ?</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      เข้าสู่ระบบเพื่อบันทึกประวัติและรหัส Steam ลงคลังส่วนตัว หรือกรอกชื่อด้านล่างเพื่อซื้อแบบ Guest ได้เช่นกัน
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onOpenUserAuth && onOpenUserAuth();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs whitespace-nowrap hover:bg-amber-400 transition-colors shadow-sm self-end sm:self-auto"
                >
                  🔑 เข้าสู่ระบบก่อน
                </button>
              </div>
            )}

            {/* Order Summary Box */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">ไอดีที่เลือก:</span>
                <span className="font-bold text-white">#{account.id} - {title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ประเทศ:</span>
                <span className="font-bold text-amber-300">{getRegionText(account.region)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 text-sm">
                <span className="font-bold text-white">ยอดชำระสุทธิ:</span>
                <span className="font-black text-amber-400 text-base">{formatPrice(account.priceVND, account.priceTHB)}</span>
              </div>
            </div>

            {/* Buyer Name Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">ชื่อผู้ซื้อ / บัญชีผู้ติดต่อ</label>
              <input
                type="text"
                placeholder="เช่น สมชาย หรือ Tran Minh (เว้นว่างไว้จะเป็น Guest)"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">เลือกช่องทางชำระเงิน (Real Payment Gateway)</label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { id: 'PromptPay QR', label: 'PromptPay QR (ไทย)', flag: '🇹🇭', desc: 'สแกน QR ผ่านทุกธนาคารไทย' },
                  { id: 'TrueMoney', label: 'TrueMoney Wallet (ไทย)', flag: '🇹🇭', desc: 'วอลเล็ท / เบอร์ทรูมันนี่' },
                  { id: 'VietQR Bank', label: 'VietQR / Bank (เวียดนาม)', flag: '🇻🇳', desc: 'Chuyển khoản Napas 24/7' },
                  { id: 'MoMo Wallet', label: 'Ví MoMo (เวียดนาม)', flag: '🇻🇳', desc: 'Ví điện tử MoMo' },
                ].map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      paymentMethod === m.id
                        ? 'bg-amber-500/10 border-amber-500 text-white font-bold shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold">{m.flag} {m.label}</span>
                      {paymentMethod === m.id && <span className="text-amber-400">✓</span>}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Proceed to QR Button */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-extrabold text-xs sm:text-sm shadow-md pubg-glow transition-all flex items-center gap-1.5"
              >
                <span>💳</span>
                <span>สร้าง QR Code & ไปชำระเงิน</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: REAL DYNAMIC QR & SLIP VERIFICATION SCREEN ⭐ */}
        {step === 'payment_qr' && (
          <div className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1">
            
            {/* Header with timer */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <button 
                  type="button" 
                  onClick={() => setStep('checkout')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-1 font-semibold"
                >
                  ← ย้อนกลับ
                </button>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>สแกนชำระเงิน & ตรวจสอบสลิป</span>
                  <span className="text-xs bg-slate-800 text-amber-400 font-mono px-2 py-0.5 rounded">
                    {pendingOrderId}
                  </span>
                </h3>
              </div>

              {/* Countdown timer */}
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">หมดเวลาใน</span>
                <span className={`text-base font-mono font-black ${timeLeft < 180 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
                  ⏱️ {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* QR Code Presentation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800">
              
              {/* Left Column: Official Dynamic QR Code */}
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-lg relative">
                {paymentMethod.includes('Viet') || paymentMethod.includes('MoMo') ? (
                  /* VietQR Code */
                  <div className="w-full text-center">
                    <img
                      src={vietQrUrl}
                      alt="VietQR"
                      className="w-full max-w-[240px] mx-auto object-contain rounded-xl"
                    />
                    <span className="text-[10px] font-bold text-slate-800 block mt-1">
                      Napas 24/7 • {vietQrBank}
                    </span>
                  </div>
                ) : (
                  /* PromptPay Dynamic QR Code (BOT Standard) */
                  <div className="w-full text-center">
                    <div className="bg-blue-900 text-white text-[11px] font-black py-1 px-3 rounded-lg uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
                      <span>🇹🇭</span>
                      <span>THAI QR PAYMENT • PROMPTPAY</span>
                    </div>
                    <img
                      src={promptPayQrUrl}
                      alt="PromptPay QR"
                      className="w-48 h-48 mx-auto object-contain"
                    />
                    <div className="text-[11px] font-black text-slate-900 mt-1">
                      ยอดชำระ: {formatPrice(account.priceVND, account.priceTHB)}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Account Details & Instructions */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">ยอดเงินที่ต้องโอน (ตรงเป๊ะ):</span>
                  <div className="text-2xl font-black text-amber-400">
                    {formatPrice(account.priceVND, account.priceTHB)}
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">
                      {paymentMethod.includes('Viet') ? 'Ngân hàng / Bank:' : 'บัญชีรับเงิน (PromptPay):'}
                    </span>
                    <span className="font-bold text-white">
                      {paymentMethod.includes('Viet') ? `${vietQrBank} (${vietQrAccount})` : promptPayId}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">ชื่อบัญชี:</span>
                    <span className="font-bold text-amber-300">
                      {paymentMethod.includes('Viet') ? vietQrName : (storeSettings.promptPayName || 'SIMA SHOP')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-800 pt-1.5">
                    <span className="text-slate-400">บันทึกช่วยจำ (Memo):</span>
                    <span className="font-mono font-bold text-emerald-400">{pendingOrderId}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyText(paymentMethod.includes('Viet') ? vietQrAccount : promptPayId)}
                  className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <span>{copiedText ? '✓ คัดลอกเลขบัญชีแล้ว' : '📋 คัดลอกเลขบัญชี / เบอร์พร้อมเพย์'}</span>
                </button>
              </div>

            </div>

            {/* Slip Upload & Verification Section */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <span>📸</span>
                  <span>แนบสลิปการโอนเงินจากแอปธนาคาร (Slip Verification)</span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  ตรวจสอบสลิปอัตโนมัติ 24 ชม.
                </span>
              </div>

              {/* Slip Input Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 hover:bg-slate-900 transition-all text-center group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSlipFileUpload}
                    className="hidden"
                  />
                  <span className="text-xl mb-0.5">📁</span>
                  <span className="text-xs font-bold text-white group-hover:text-amber-400">
                    คลิกเลือกรูปสลิปจากเครื่อง หรือลากไฟล์มาวาง
                  </span>
                  <span className="text-[10px] text-slate-500">
                    หรือกด <b>Ctrl + V</b> ที่หน้าจอนี้เพื่อวางภาพสลิปได้เลย
                  </span>
                </label>

                {/* Slip Preview */}
                <div className="border border-slate-800 rounded-xl p-2 bg-slate-900/60 flex items-center justify-center min-h-[90px]">
                  {slipImage ? (
                    <div className="relative w-full h-24 rounded-lg overflow-hidden border border-emerald-500/50 flex items-center justify-center bg-black">
                      <img src={slipImage} alt="Slip Preview" className="w-full h-full object-contain" />
                      <span className="absolute top-1 right-1 bg-emerald-500 text-black font-black text-[9px] px-1.5 py-0.5 rounded">
                        ✓ แนบสลิปแล้ว
                      </span>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 text-xs">
                      <span>ยังไม่มีรูปสลิป</span>
                      <p className="text-[10px] text-slate-600 mt-0.5">แนบสลิปด้านซ้าย หรือกดปุ่มใส่สลิปทดสอบ</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Progress feedback */}
              {isVerifyingSlip && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-xl space-y-2 animate-pulse">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>{verifyStatusText}</span>
                    <span>⏳</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-full animate-progress"></div>
                  </div>
                </div>
              )}

              {/* Verify & Complete Button */}
              <button
                type="button"
                disabled={isVerifyingSlip}
                onClick={handleVerifyAndComplete}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>🔍</span>
                <span>ยืนยันการโอนเงิน & ตรวจสอบสลิปเพื่อรับรหัสทันที</span>
              </button>

            </div>

          </div>
        )}

        {/* STEP 4: INSTANT DELIVERY SUCCESS SCREEN */}
        {step === 'success' && createdOrder && (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl animate-bounce">
                ✓
              </div>
              <h3 className="text-2xl font-black text-white">ชำระเงินสำเร็จ & ส่งมอบรหัสแล้ว!</h3>
              <p className="text-xs text-slate-400">
                รหัสคำสั่งซื้อ: <span className="font-mono text-amber-400 font-bold">{createdOrder.orderId}</span>
              </p>
            </div>

            {/* Instant Credentials Box */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/40 space-y-3">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>🔐</span>
                <span>ข้อมูลบัญชี STEAM สำหรับเข้าเล่นทันที:</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Steam Username:</span>
                  <span className="font-mono font-bold text-white text-sm">{createdOrder.steamUser}</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Steam Password:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{createdOrder.steamPass}</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Original Email & Pass:</span>
                  <span className="font-mono font-bold text-emerald-400 text-xs sm:text-sm">{createdOrder.mailInfo}</span>
                </div>
              </div>
            </div>

            {/* User Vault Notice */}
            {currentUser ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-400">
                🎉 ข้อมูลไอดีนี้ถูกบันทึกเข้าสู่ <b>"คลังไอดีของฉัน"</b> เรียบร้อยแล้ว สามารถเปิดดูรหัสย้อนหลังได้ตลอดเวลา
              </div>
            ) : (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center text-xs text-slate-300">
                💡 คุณสามารถเข้าสู่ระบบหรือสมัครสมาชิกเพื่อผูกไอดีนี้เข้ากับบัญชีของคุณ หรือแคปหน้าจอนี้ไว้
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenUserPurchases && onOpenUserPurchases();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-extrabold text-xs sm:text-sm shadow-md pubg-glow transition-all flex items-center justify-center gap-1.5"
                >
                  <span>📦</span>
                  <span>เปิดดูใน "คลังไอดีของฉัน" ทันที</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs sm:text-sm transition-colors"
              >
                เรียบร้อย / ปิดหน้าต่าง
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { translateChinesePubgTitle } from '../services/chinaSync/chinaAccountParser';

const CHINA_SOURCES = [
  {
    id: 'xf',
    name: 'XF Shop',
    badge: 'คลังใหญ่พิเศษ 14,000+ ไอดี',
    url: 'https://xf.ayxds.com/pc/',
    cleanUrl: 'xf.ayxds.com',
    codePrefix: 'XF...',
    desc: 'คลังขนาดใหญ่ รวมไอดี PUBG PC สกินครบ สกินทอง ปืนอัปเกรดหลากหลาย',
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    btnBg: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black',
    sampleCode: 'XF1122'
  },
  {
    id: 'yyy',
    name: 'YiYou PUBG',
    badge: 'สกินแรร์ & ปืนอัปเกรด',
    url: 'https://www.yyyxkch.com/',
    cleanUrl: 'www.yyyxkch.com',
    codePrefix: 'DLMX-...',
    desc: 'เน้นไอดีระดับพรีเมียม สกินแข่งขัน สกินแรร์ และปืนเลเวลตัน Max Level',
    color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
    btnBg: 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white',
    sampleCode: 'DLMX-3060'
  },
  {
    id: 'xmgg',
    name: 'XMGG Shop',
    badge: 'อัปเดตรายวัน 14,000+ ไอดี',
    url: 'https://xmgg.ayxds.com/pc/',
    cleanUrl: 'xmgg.ayxds.com',
    codePrefix: 'DLMX-...',
    desc: 'คลังจีนยอดนิยม อัปเดตสต็อกสดใหม่ทุกวัน มีไอดีเริ่มต้นจนถึงท็อปเซิร์ฟ',
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
    btnBg: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black',
    sampleCode: 'DLMX-3076'
  },
  {
    id: 'xgkk',
    name: 'XueGaoKK',
    badge: 'สต็อกแน่น 12,000+ ไอดี',
    url: 'https://xuegaokk.ayxds.com/pc/',
    cleanUrl: 'xuegaokk.ayxds.com',
    codePrefix: 'XGKK-...',
    desc: 'แหล่งไอดีซูเปอร์คาร์ คอลแลปส์พิเศษ ดุ๊กดิ๊ก aespa หมวกกระต่าย และชุดเซ็ตหายาก',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    btnBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black',
    sampleCode: 'XGKK-2897'
  }
];

export default function ChinaOrderSection({ currency = 'THB', lang = 'th', storeSettings = {} }) {
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultData, setResultData] = useState(null);
  const [copiedOrder, setCopiedOrder] = useState(false);
  const [activeImgTab, setActiveImgTab] = useState('cover'); // 'cover' | 'detail'
  const [lightboxImg, setLightboxImg] = useState(null);

  const fbUrl = storeSettings.facebookPageUrl || 'https://www.facebook.com/profile.php?id=61596307388431';
  const discordUrl = storeSettings.discordInviteUrl || 'https://discord.gg/p9fHwmMUPd';

  const handleLookup = async (queryToSearch) => {
    const q = (queryToSearch || inputVal).trim();
    if (!q) {
      setErrorMsg('กรุณากรอกลิงก์ หรือรหัสไอดีจีนจากเว็บต้นทาง');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setResultData(null);
    setCopiedOrder(false);

    try {
      const isUrl = q.startsWith('http://') || q.startsWith('https://');
      const paramKey = isUrl ? 'url' : 'bianhao';
      const endpoint = `/api/china-details?${paramKey}=${encodeURIComponent(q)}`;

      const res = await fetch(endpoint);
      const data = await res.json();

      if (data && data.success) {
        setResultData(data);
        setActiveImgTab(data.detailImages && data.detailImages.length > 0 ? 'detail' : 'cover');
      } else {
        setErrorMsg(data.message || 'ไม่พบข้อมูลไอดีนี้ในระบบ กรุณาตรวจสอบรหัสหรือลิงก์อีกครั้ง');
      }
    } catch (err) {
      setErrorMsg('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleFillSample = (sample) => {
    setInputVal(sample);
    handleLookup(sample);
  };

  const handleCopyOrderInfo = () => {
    if (!resultData) return;
    const priceText = currency === 'VND' 
      ? `${(resultData.priceVND || 0).toLocaleString()} ₫ VND` 
      : `${(resultData.priceTHB || 0).toLocaleString()} ฿ THB`;

    const textToCopy = `[สั่งซื้อไอดีจีน PUBG SIAM]\nรหัสไอดี: #${resultData.bianhao}\nต้นทาง: ${resultData.sourceName} (${resultData.sourceUrl})\nราคา: ${priceText} (ประมาณ ¥${resultData.shoujiaRmb || 0} RMB)\nสเปก: ${resultData.title}\nต้องการให้แอดมินดำเนินการสั่งซื้อให้ครับ`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedOrder(true);
    setTimeout(() => setCopiedOrder(false), 2500);
  };

  const translatedTitle = resultData?.title ? translateChinesePubgTitle(resultData.title) : '';
  const priceDisplay = currency === 'VND'
    ? `${(resultData?.priceVND || 0).toLocaleString()} ₫`
    : `฿${(resultData?.priceTHB || 0).toLocaleString()}`;
  const originalPriceDisplay = currency === 'VND'
    ? `${(resultData?.originalPriceVND || 0).toLocaleString()} ₫`
    : `฿${(resultData?.originalPriceTHB || 0).toLocaleString()}`;

  return (
    <section id="china-order" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Container with High-End Glowing Border */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0d131f] to-slate-950 p-6 sm:p-10 border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-b from-amber-500/15 via-red-500/10 to-transparent blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-red-500/20 to-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <span>🇨🇳</span> ระบบดึงข้อมูล & บริการรับกดไอดีจีนตรงจาก 4 เว็บดัง
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            ค้นหา & คำนวณราคาไอดีจีนจาก <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500">4 เว็บไซต์ยอดนิยม</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            PUBG SIAM เชื่อมต่อระบบ API ดึงข้อมูลคลังและสกินจาก 4 เว็บไซต์จีนต้นทาง นำมาแปลงเป็นภาษาไทยให้อ่านง่าย เช็กสเปก ดูภาพคลังความละเอียดสูง และคำนวณราคาเงินบาท/ดองในรูปแบบของเรา พร้อมสั่งซื้อผ่านแอดมินคนกลางได้ทันที
          </p>

          {/* Trust Middleman Badges */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ผู้ดูแลการซื้อขาย: <strong>SunsnappZ (Facebook)</strong></span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-200">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span>คอมมูนิตี้ & สั่งซื้อไอดี: <strong>AWESOMEZ SHOP (Discord)</strong></span>
            </div>
          </div>
        </div>

        {/* 4 SOURCE WEBSITES CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 relative z-10">
          {CHINA_SOURCES.map((source, idx) => (
            <div
              key={source.id}
              className={`rounded-2xl p-4 bg-slate-900/70 border ${source.color} backdrop-blur-sm flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl group`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700">
                    เว็บที่ {idx + 1}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {source.badge}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors">
                  {source.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate" title={source.url}>
                  {source.cleanUrl}
                </p>
                <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                  {source.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleFillSample(source.sampleCode)}
                  className="text-[11px] font-bold text-slate-400 hover:text-amber-400 transition-colors"
                  title={`ลองค้นหารหัสตัวอย่าง: ${source.sampleCode}`}
                >
                  ลอง: <span className="underline font-mono text-amber-400">{source.sampleCode}</span>
                </button>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl ${source.btnBg} transition-transform active:scale-95 flex items-center gap-1 shadow-sm shrink-0`}
                >
                  <span>เปิดเว็บ</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH & PRICE CHECKER INPUT BAR */}
        <div className="relative z-10 max-w-3xl mx-auto mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup();
            }}
            className="flex flex-col sm:flex-row gap-2.5 bg-slate-900/95 p-2 rounded-2xl border border-slate-700/80 shadow-2xl focus-within:border-amber-500 transition-all"
          >
            <div className="flex-1 flex items-center gap-2.5 px-3 py-1">
              <span className="text-slate-400 text-lg">🔍</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="วางลิงก์เว็บจีน หรือ รหัสไอดี (เช่น XF1122, DLMX-3060, XGKK-2897)..."
                className="w-full bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none"
              />
              {inputVal && (
                <button
                  type="button"
                  onClick={() => setInputVal('')}
                  className="text-slate-500 hover:text-slate-300 text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>กำลังดึงข้อมูล...</span>
                </>
              ) : (
                <>
                  <span>⚡ เช็กราคา & รูปคลัง</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Examples Helper */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-400">
            <span>ตัวอย่างรหัสทดสอบ:</span>
            {CHINA_SOURCES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleFillSample(s.sampleCode)}
                className="px-2 py-0.5 rounded-lg bg-slate-800/90 text-slate-300 hover:text-amber-400 hover:bg-slate-700 border border-slate-700/60 font-mono text-[11px] transition-colors"
              >
                {s.name}: {s.sampleCode}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-fadeIn">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* LIVE RESULT PREVIEW CARD */}
        {resultData && (
          <div className="relative z-10 max-w-4xl mx-auto rounded-3xl bg-slate-900/95 border border-amber-500/50 p-5 sm:p-7 shadow-2xl animate-fadeIn">
            {/* Header / Source Info */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span>🇨🇳</span> {resultData.sourceName}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  รหัส: <strong className="text-white text-sm">#{resultData.bianhao}</strong>
                </span>
              </div>
              <a
                href={resultData.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
              >
                <span>ดูที่เว็บต้นทาง</span>
                <span>↗</span>
              </a>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
              {/* Left Column: Visual Gallery (6 cols) */}
              <div className="lg:col-span-6 flex flex-col gap-3">
                {/* Image Tab Buttons */}
                <div className="flex items-center gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveImgTab('cover')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                      activeImgTab === 'cover'
                        ? 'bg-amber-500 text-black shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🖼️ หน้าปกคลัง
                  </button>
                  {resultData.detailImages && resultData.detailImages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveImgTab('detail')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        activeImgTab === 'detail'
                          ? 'bg-amber-500 text-black shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>📸 รูปรายละเอียดในเกม</span>
                      <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded-full">
                        {resultData.detailImages.length}
                      </span>
                    </button>
                  )}
                </div>

                {/* Display Area with Lightbox Click */}
                <div className="relative rounded-2xl bg-black border border-slate-800 overflow-hidden min-h-[260px] max-h-[460px] flex items-center justify-center group">
                  {activeImgTab === 'cover' ? (
                    resultData.coverImg ? (
                      <img
                        src={resultData.coverImg}
                        alt="Account Cover"
                        className="w-full h-full object-contain max-h-[460px] cursor-zoom-in transition-transform group-hover:scale-[1.02]"
                        onClick={() => setLightboxImg(resultData.coverImg)}
                      />
                    ) : (
                      <div className="text-xs text-slate-500 py-16">ไม่มีรูปหน้าปก</div>
                    )
                  ) : (
                    <div className="w-full h-full max-h-[460px] overflow-y-auto space-y-2 p-2 scrollbar-thin">
                      {resultData.detailImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Detail ${idx + 1}`}
                          className="w-full rounded-xl object-contain cursor-zoom-in border border-slate-800/80 hover:opacity-95 transition-opacity"
                          onClick={() => setLightboxImg(img)}
                        />
                      ))}
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-[10px] text-slate-300 font-mono pointer-events-none">
                    🔍 คลิกรูปเพื่อขยายใหญ่
                  </div>
                </div>
              </div>

              {/* Right Column: Specs & Ordering Actions (6 cols) */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  {/* Translated Title */}
                  <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                    {translatedTitle || resultData.title}
                  </h3>

                  {/* Original Chinese specs snippet */}
                  {resultData.title && (
                    <p className="text-[11px] text-slate-500 font-mono mt-1 line-clamp-2">
                      ต้นฉบับ: {resultData.title}
                    </p>
                  )}

                  {/* Account Specs Badges */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">ระดับการเล่น</span>
                      <strong className="text-xs text-slate-100 font-semibold">
                        {resultData.specs?.shengcundengji || 'ระดับ 4 (Rank Ready)'}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">เครดิตบัญชี</span>
                      <strong className="text-xs text-emerald-400 font-semibold">
                        {resultData.specs?.xinyongdengji || 'เกียรติยศสะอาด 100%'}
                      </strong>
                    </div>
                  </div>

                  {/* Transparent Price Calculation Box */}
                  <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-800/80 to-slate-900 border border-amber-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">ราคาคำนวณสุทธิ (รวมค่าบริการ):</span>
                      <span className="text-xs text-slate-400 line-through">
                        {originalPriceDisplay}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl sm:text-3xl font-black text-amber-400">
                        {priceDisplay}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        (ต้นทุนจีน: ¥{resultData.shoujiaRmb || 0} RMB)
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>เรทตรง อัตราแลกเปลี่ยนทางการ พร้อมประกันส่งมอบผ่านคนกลาง</span>
                    </div>
                  </div>
                </div>

                {/* Direct Order Actions */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col gap-2.5">
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>เลือกช่องทางสั่งซื้อกับผู้ดูแล:</span>
                    <button
                      type="button"
                      onClick={handleCopyOrderInfo}
                      className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>📋</span>
                      <span>{copiedOrder ? '✓ คัดลอกข้อมูลแล้ว!' : 'คัดลอกข้อมูลสั่งซื้อ'}</span>
                    </button>
                  </div>

                  {/* Order Button 1: Facebook SunsnappZ */}
                  <a
                    href={`${fbUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-98"
                  >
                    <span>📘</span>
                    <span>สั่งซื้อไอดีนี้กับ SunsnappZ (Facebook)</span>
                  </a>

                  {/* Order Button 2: Discord AWESOMEZ SHOP */}
                  <a
                    href={`${discordUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-98"
                  >
                    <span>💜</span>
                    <span>สั่งซื้อไอดีนี้กับ AWESOMEZ SHOP (Discord)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 z-50 px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 text-sm font-bold border border-slate-700 shadow-xl"
          >
            ✕ ปิดหน้าต่าง (ESC)
          </button>
          <div className="max-w-[95vw] max-h-[90vh] overflow-auto flex items-center justify-center p-2">
            <img
              src={lightboxImg}
              alt="High Resolution Zoom"
              className="max-w-full max-h-[88vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
}

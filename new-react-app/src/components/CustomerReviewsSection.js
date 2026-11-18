import React, { useState } from 'react';

export default function CustomerReviewsSection({ lang = 'th', t = {} }) {
  const fbPostUrl = 'https://www.facebook.com/photo?fbid=122106639411543579&set=a.122106640989543579';
  const fbEmbedUrl = 'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fphoto.php%3Ffbid%3D122106639411543579&show_text=true&width=500';

  // Toggle between Official Facebook Live Embed and Curated Cards
  const [activeView, setActiveView] = useState('live'); // 'live' | 'cards'
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Curated review cards for alternative quick glance
  const initialReviews = [
    {
      id: 'initial_1',
      name: 'JobJab Troy',
      initials: 'JT',
      comment: '++ ค้าบบบริการดีมาก🥰',
      rating: 5,
      date: '1 ชม. ที่แล้ว',
      verified: true,
      hasAuthorHeart: true,
      typeBadge: '🌟 คอมเมนต์จริงจากโพสต์ Facebook',
      highlight: 'ลูกค้ายืนยันจากเพจ PUBG SIAM'
    },
    {
      id: 'initial_2',
      name: "Freedyz M'Issarapong",
      initials: 'FI',
      comment: 'บริการดีจริงครับ',
      rating: 5,
      date: 'ล่าสุด',
      verified: true,
      hasAuthorHeart: false,
      typeBadge: '🌟 คอมเมนต์จริงจากโพสต์ Facebook',
      highlight: 'ลูกค้ายืนยันจากเพจ PUBG SIAM'
    }
  ];

  return (
    <section id="reviews" className="py-14 sm:py-20 bg-gradient-to-b from-slate-950 via-[#0d1424] to-slate-950 border-t border-b border-slate-800/80 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-bold shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>🟢 ถ่ายทอดสดเรียลไทม์ 100% จากโพสต์ทางการบน Facebook</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            เสียงตอบรับและความไว้วางใจจากผู้ซื้อจริง
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            ทุกความไว้วางใจ คือเครดิตที่เราตั้งใจสร้าง ทั้งการกดไอดี ซื้อขาย ฝากขาย และผ่อนชำระ มีสัญญาและใบรับประกันการซื้อขาย ตรวจสอบได้จริงบนโพสต์หลักของเพจแบบ Real-time ตลอด 24 ชม.
          </p>

          {/* VIEW SWITCHER TABS */}
          <div className="pt-4 flex items-center justify-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveView('live')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all ${
                activeView === 'live'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 border border-blue-400 scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>🔴 โพสต์สดและคอมเมนต์จริง Facebook (Real-time Live)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('cards')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all ${
                activeView === 'cards'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 border border-blue-400 scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span>⭐ การ์ดสรุปเสียงตอบรับ</span>
            </button>

            <a
              href={fbPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs sm:text-sm font-bold transition-all shadow active:scale-95"
            >
              <span>เปิดดูบนแอป Facebook</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* VIEW 1: OFFICIAL REAL-TIME FACEBOOK LIVE EMBED */}
        {activeView === 'live' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* The Live Facebook Post iFrame Container */}
            <div className="lg:col-span-7 bg-[#0b1220] border-2 border-blue-500/50 rounded-3xl p-3 sm:p-5 shadow-2xl shadow-blue-950/50 relative overflow-hidden flex flex-col items-center">
              
              {/* Top Bar inside Card */}
              <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80 px-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs">
                    f
                  </div>
                  <span className="font-bold text-white">PUBG SIAM (Facebook Official)</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>สดจาก Facebook 100%</span>
                </div>
              </div>

              {/* Skeleton loading spinner while iframe is rendering */}
              {!iframeLoaded && (
                <div className="w-full py-24 flex flex-col items-center justify-center text-slate-400 space-y-3">
                  <div className="w-9 h-9 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs sm:text-sm font-medium">กำลังโหลดโพสต์สดจากเซิร์ฟเวอร์ Facebook...</p>
                  <p className="text-[11px] text-slate-500">คอมเมนต์และยอดถูกใจทั้งหมดดึงสดจาก Facebook โดยตรง</p>
                </div>
              )}

              {/* The Official Meta Post Embed iframe */}
              <div className="w-full flex justify-center overflow-hidden rounded-2xl bg-white shadow-inner">
                <iframe
                  title="Official Facebook Post Live Embed"
                  src={fbEmbedUrl}
                  width="500"
                  height="680"
                  style={{ border: 'none', overflow: 'hidden', minHeight: '680px' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  onLoad={() => setIframeLoaded(true)}
                  className={`w-full max-w-[500px] transition-opacity duration-500 ${iframeLoaded ? 'opacity-100' : 'opacity-0 h-0'}`}
                />
              </div>

              {/* Action link below iframe */}
              <div className="w-full pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between px-2 text-xs text-slate-400">
                <span>🔄 คอมเมนต์ใน Facebook จะขึ้นในนี้ทันที</span>
                <a
                  href={fbPostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>ร่วมคอมเมนต์ใน Facebook ↗</span>
                </a>
              </div>
            </div>

            {/* Side Trust & Invitation Info */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Trust Guarantee Box */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121c32] to-[#0f172a] border border-blue-500/40 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 font-black flex items-center justify-center text-2xl">
                    🛡️
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      ทำไมต้องรีวิวบน Facebook จริง?
                    </h3>
                    <p className="text-xs text-emerald-400 font-bold mt-0.5">
                      ✓ ตรวจสอบได้ 100% โปร่งใส ปลอดภัย
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Real-time 100%:</strong> โพสต์และคอมเมนต์ด้านข้างดึงสดจาก Facebook ของจริง ใครคอมเมนต์ปุ๊บ จะโผล่ขึ้นมาทันทีโดยไม่มีการดัดแปลง</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>โปรไฟล์คนซื้อจริง:</strong> สามารถคลิกดูโปรไฟล์ Facebook ของผู้ซื้อที่มารีวิวได้ทุกคน เพื่อความมั่นใจสูงสุด</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>ร้านไม่สามารถแต่งคอมเมนต์เองได้:</strong> เพราะเป็นวิดเจ็ตฝังตรงจาก Facebook ตัวจริง จึงมั่นใจได้ว่าเป็นความเห็นจากผู้ซื้อจริง 100%</span>
                  </p>
                </div>
              </div>

              {/* Invitation to Review */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/20 via-slate-900/80 to-blue-950/30 border-2 border-dashed border-blue-500/40 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 font-black flex items-center justify-center text-xl">
                    ✍️
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-white">
                      เคยใช้บริการกับเราแล้ว?
                    </h4>
                    <p className="text-xs text-amber-400 font-bold mt-0.5">
                      ร่วมแชร์ความประทับใจ & รับบริการ VIP
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  ลูกค้าที่เคยกดไอดี ซื้อสด หรือผ่อนชำระกับ <strong>PUBG SIAM</strong> สามารถกดปุ่มด้านล่างเพื่อไปคอมเมนต์รีวิวในโพสต์หลักของเพจได้เลยครับ คอมเมนต์ของท่านจะโผล่ในหน้าร้านสดทันที!
                </p>

                <a
                  href={fbPostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-950/60 active:scale-95 border border-blue-400/50"
                >
                  <span>💬</span>
                  <span>คลิกไปร่วมเขียนรีวิวบน Facebook</span>
                  <span>↗</span>
                </a>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: CURATED CARDS VIEW */}
        {activeView === 'cards' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {initialReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#141e33] to-[#0f172a] border-2 border-blue-500/60 shadow-xl shadow-blue-950/40 flex flex-col justify-between relative overflow-hidden group hover:border-blue-400 transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none"></div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-slate-700 via-slate-800 to-slate-900 border-2 border-blue-400 text-white font-black text-sm flex items-center justify-center shadow-md shrink-0">
                        {rev.initials || 'FB'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm sm:text-base font-black text-white break-words">
                            {rev.name}
                          </h4>
                          {rev.hasAuthorHeart && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center gap-0.5 shadow-sm shrink-0">
                              <span>💖</span>
                              <span>โดยผู้เขียน</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 whitespace-nowrap">
                          <span>{rev.date || 'ล่าสุด'}</span>
                          <span>•</span>
                          <span className="text-blue-400 font-semibold flex items-center gap-0.5">
                            <span>✓</span>
                            <span>ยืนยันจาก Facebook</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex text-amber-400 text-xs shrink-0 tracking-tight">
                      ⭐⭐⭐⭐⭐
                    </div>
                  </div>

                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-blue-950/80 text-blue-300 border border-blue-500/40 shadow-sm">
                      <span>{rev.typeBadge || '🌟 คอมเมนต์จริงจากโพสต์ Facebook'}</span>
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                    <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                  <span className="text-slate-300 flex items-center gap-1 text-[11px] sm:text-xs">
                    <span>🛡️</span>
                    <strong className="text-amber-400 font-semibold">{rev.highlight || 'ลูกค้ายืนยันจากเพจ PUBG SIAM'}</strong>
                  </span>
                  <a
                    href={fbPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold hover:underline shrink-0 text-[11px] sm:text-xs"
                  >
                    <span>ตรวจคอมเมนต์จริง ↗</span>
                  </a>
                </div>
              </div>
            ))}

            {/* Invitation Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-950/20 via-slate-900/60 to-purple-950/30 border-2 border-dashed border-blue-500/40 flex flex-col justify-between shadow-xl shadow-slate-950/50">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 font-black flex items-center justify-center text-2xl shadow-inner">
                    ✍️
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-white">
                      เคยกดไอดีหรือใช้บริการกับเรา?
                    </h4>
                    <p className="text-xs text-amber-400 font-bold mt-0.5">
                      ร่วมแชร์เครดิต & รับบริการดูแล VIP
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
                  <p>
                    ลูกค้าที่เคยซื้อสด ผ่อนชำระ หรือฝากขายไอดีกับ <strong className="text-white">PUBG SIAM</strong> สามารถร่วมคอมเมนต์รีวิวในโพสต์ Facebook หลักของทางร้านได้เลยครับ
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-800/80">
                <a
                  href={fbPostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-950/50 active:scale-95 border border-blue-400/40"
                >
                  <span>💬</span>
                  <span>คลิกไปร่วมเขียนรีวิวบน Facebook</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM TRUST BANNER */}
        <div className="mt-10 sm:mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-purple-950/40 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <span>🛡️</span>
              <span>มั่นใจ ปลอดภัย ซื้อขายไอดี PUBG PC กับ PUBG SIAM</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              มีประกันมือ 1 แท้ทุกไอดี • มีระบบผ่อนชำระถูกต้องตามกฎหมาย • ออกใบรับประกัน A4 พร้อมตราประทับชัดเจน
            </p>
          </div>

          <a
            href={fbPostUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-blue-950/50 transition-all border border-blue-400/50 shrink-0 scale-[1.02] active:scale-98"
          >
            <span>💬</span>
            <span>ดูโพสต์และรีวิวทั้งหมดบน Facebook ↗</span>
          </a>
        </div>

      </div>
    </section>
  );
}

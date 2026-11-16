import React, { useState, useEffect, useRef } from 'react';

export default function CustomerReviewsSection({ lang = 'th', t = {} }) {
  const [viewMode, setViewMode] = useState('live'); // 'live' | 'summary'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fbEmbedRef = useRef(null);

  const fbPostUrl = 'https://www.facebook.com/photo?fbid=122106639411543579&set=a.122106640989543579';

  // Load and initialize Facebook JavaScript SDK
  useEffect(() => {
    // 1. Ensure #fb-root is present in body
    if (!document.getElementById('fb-root')) {
      const fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.appendChild(fbRoot);
    }

    // 2. Load SDK script if not already loaded
    if (!document.getElementById('facebook-jssdk')) {
      window.fbAsyncInit = function () {
        window.FB.init({
          xfbml: true,
          version: 'v19.0'
        });
      };

      const js = document.createElement('script');
      js.id = 'facebook-jssdk';
      js.src = 'https://connect.facebook.net/th_TH/sdk.js#xfbml=1&version=v19.0';
      js.async = true;
      js.defer = true;
      js.crossOrigin = 'anonymous';
      document.body.appendChild(js);
    } else if (window.FB) {
      // Re-parse XFBML whenever viewMode switches
      window.FB.XFBML.parse();
    }
  }, [viewMode]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (window.FB) {
      window.FB.XFBML.parse();
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  const reviewsData = [
    {
      id: 1,
      name: 'JobJab Troy',
      avatarBg: 'bg-gradient-to-tr from-slate-700 to-slate-900 border border-slate-600',
      initials: 'JT',
      typeBadge: '🌟 รีวิวจริงบนโพสต์ Facebook',
      rating: 5,
      date: 'ล่าสุด',
      verified: true,
      comment: '++ ค้าบบบริการดีมาก🥰',
      accountHighlight: 'ลูกค้าจริงบนโพสต์เพจ PUBG SIAM'
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
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>🔴 Facebook Live Sync • เรียลไทม์ 100%</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            รีวิว & เครดิตจากโพสต์จริงบน Facebook
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            ดึงข้อมูลสดจากเซิร์ฟเวอร์ Facebook โดยตรง ทั้งยอดคอมเมนต์ ยอดไลก์ และข้อความรีวิว อัปเดตแบบเรียลไทม์ โปร่งใส ตรวจสอบความถูกต้องได้ทันที
          </p>

          {/* VIEW MODE TOGGLE BUTTONS */}
          <div className="pt-3 flex items-center justify-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setViewMode('live')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shadow-md ${
                viewMode === 'live'
                  ? 'bg-blue-600 text-white shadow-blue-900/40 border border-blue-400 scale-[1.02]'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>🔴 กล่องโพสต์สด Facebook (นับคอมเมนต์จริง)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('summary')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shadow-md ${
                viewMode === 'summary'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-amber-900/40 scale-[1.02]'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>⭐</span>
              <span>การ์ดสรุปรีวิวง่ายๆ</span>
            </button>
          </div>
        </div>

        {/* 1. LIVE FACEBOOK EMBED MODE (DEFAULT) */}
        {viewMode === 'live' && (
          <div className="max-w-3xl mx-auto space-y-4">
            
            {/* Live Container Card */}
            <div className="p-4 sm:p-7 rounded-3xl bg-gradient-to-b from-[#111726] to-[#0c121e] border-2 border-blue-500/50 shadow-2xl shadow-blue-950/40">
              
              {/* Header Bar of the Live Box */}
              <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow">
                    f
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-white">
                      โพสต์เครดิตหลักเพจ PUBG SIAM
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>เชื่อมต่อกับเซิร์ฟเวอร์ Facebook โดยตรง • ข้อมูลสด</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-bold border border-slate-700 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                    title="คลิกเพื่อรีเฟรชข้อมูลโพสต์สด"
                  >
                    <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span>
                    <span>{isRefreshing ? 'กำลังโหลด...' : 'รีเฟรชคอมเมนต์'}</span>
                  </button>

                  <a
                    href={fbPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow"
                  >
                    <span>เปิดแอป FB</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>

              {/* The Official Facebook Post Embed */}
              <div className="flex justify-center items-center py-2 min-h-[350px] overflow-hidden rounded-2xl bg-slate-900/70 border border-slate-800/60 p-2 sm:p-4">
                <div
                  ref={fbEmbedRef}
                  className="fb-post"
                  data-href={fbPostUrl}
                  data-width="500"
                  data-show-text="true"
                >
                  <blockquote
                    cite={fbPostUrl}
                    className="fb-xfbml-parse-ignore text-center py-12 px-4 text-slate-400 text-xs space-y-3"
                  >
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-slate-300 font-semibold">กำลังเชื่อมต่อและโหลดข้อมูลสดจาก Facebook...</p>
                    <p className="text-[11px] text-slate-500">
                      (หากติดตั้งส่วนขยาย AdBlocker อาจต้องกดยกเว้นเพื่อให้ Facebook แสดงผล)
                    </p>
                    <div className="pt-2">
                      <a
                        href={fbPostUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
                      >
                        <span>เปิดดูโพสต์บน Facebook โดยตรง</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </blockquote>
                </div>
              </div>

              {/* Real-time Indicators & Invite banner below embed */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="text-blue-400 text-xs font-black">💬 ยอดคอมเมนต์จริง</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">นับสดตามหน้าเพจ 100%</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="text-pink-400 text-xs font-black">👍 ยอดกดถูกใจจริง</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">อัปเดตเรียลไทม์</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="text-emerald-400 text-xs font-black">✍️ โต้ตอบได้ทันที</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">พิมพ์คอมเมนต์จากเว็บได้</div>
                </div>
              </div>

            </div>

            {/* Quick CTA banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <h4 className="text-xs sm:text-sm font-black text-white">
                  ✍️ เคยซื้อไอดีหรือใช้บริการกับ PUBG SIAM?
                </h4>
                <p className="text-[11px] text-slate-400">
                  ร่วมแสดงความคิดเห็นหรือพิมพ์รีวิวในโพสต์ Facebook เพื่อสะสมยอดเครดิตให้ทางร้านได้เลยครับ
                </p>
              </div>

              <a
                href={fbPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <span>💬</span>
                <span>พิมพ์รีวิวบน Facebook ทันที</span>
                <span>↗</span>
              </a>
            </div>

          </div>
        )}

        {/* 2. SUMMARY CARDS MODE (Real comment + invite card) */}
        {viewMode === 'summary' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* CARD 1: REAL REVIEW FROM JOBJAB TROY */}
            {reviewsData.map((rev) => (
              <div
                key={rev.id}
                className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#141e33] to-[#0f172a] border-2 border-blue-500/60 shadow-xl shadow-blue-950/40 flex flex-col justify-between relative overflow-hidden group hover:border-blue-400 transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none"></div>

                <div className="space-y-4">
                  {/* Header: User avatar + name + badges */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-700 via-slate-800 to-slate-900 border-2 border-blue-400/80 text-white font-black text-sm flex items-center justify-center shadow-md">
                        {rev.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm sm:text-base font-black text-white">
                            {rev.name}
                          </h4>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center gap-0.5">
                            <span>💖</span>
                            <span>โดยผู้เขียน</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <span>{rev.date}</span>
                          <span>•</span>
                          <span className="text-blue-400 font-semibold flex items-center gap-0.5">
                            <span>✓</span>
                            <span>ยืนยันจาก Facebook</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex text-amber-400 text-sm">
                      {'⭐'.repeat(rev.rating)}
                    </div>
                  </div>

                  {/* Badge */}
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-blue-950/80 text-blue-300 border border-blue-500/40 shadow-sm">
                      <span>{rev.typeBadge}</span>
                    </span>
                  </div>

                  {/* Comment quote */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                    <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>

                {/* Bottom: Item highlight and link */}
                <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate max-w-[200px] text-slate-300">
                    🛡️ <strong className="text-amber-400 font-semibold">{rev.accountHighlight}</strong>
                  </span>
                  <a
                    href={fbPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold hover:underline shrink-0"
                  >
                    <span>ตรวจคอมเมนต์จริง</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ))}

            {/* CARD 2: INVITATION / SHARE CREDIT CARD */}
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
                  <p className="text-slate-400 text-xs">
                    ✨ ทุกความคิดเห็นมีความสำคัญมากในการพัฒนาบริการและสร้างความมั่นใจให้กับผู้ซื้อท่านอื่น
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

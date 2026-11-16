import React from 'react';

export default function CustomerReviewsSection({ lang = 'th', t = {} }) {
  const fbPostUrl = 'https://www.facebook.com/photo?fbid=122106639411543579&set=a.122106640989543579';

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
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            <span>💬 รีวิว & เครดิตจากลูกค้าตัวจริงบน Facebook</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            เสียงตอบรับและความไว้วางใจจากผู้ซื้อจริง
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            ทุกความไว้วางใจ คือเครดิตที่เราตั้งใจสร้าง ทั้งการกดไอดี ซื้อขาย ฝากขาย และผ่อนชำระ มีสัญญาและใบรับประกันการซื้อขาย ตรวจสอบได้จริงบนโพสต์หลักของเพจ
          </p>

          {/* Live Facebook Link Badge */}
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900 border border-blue-500/40 shadow">
              <span className="text-amber-400 text-sm">⭐⭐⭐⭐⭐</span>
              <span className="text-white text-xs font-black">โพสต์เครดิตหลักเพจร้าน</span>
              <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Verified FB Post</span>
              </span>
            </div>

            {/* DIRECT FACEBOOK POST LINK BUTTON */}
            <a
              href={fbPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-black transition-all shadow-lg shadow-blue-900/30 border border-blue-400 scale-[1.02] active:scale-98"
              title="เปิดดูโพสต์และคอมเมนต์จริงบน Facebook เพจร้าน"
            >
              <span>💬</span>
              <span>คลิกดูโพสต์ต้นฉบับบน Facebook</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* 2-COLUMN SHOWCASE (REAL REVIEW + INVITATION CARD) */}
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

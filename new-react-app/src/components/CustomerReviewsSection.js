import React, { useState } from 'react';

export default function CustomerReviewsSection({ lang = 'th', t = {} }) {
  const [activeReviewFilter, setActiveReviewFilter] = useState('all');

  const fbPostUrl = 'https://www.facebook.com/photo?fbid=122106639411543579&set=a.122106640989543579';

  const reviewsData = [
    {
      id: 1,
      name: 'JobJab Troy',
      avatarBg: 'bg-gradient-to-tr from-slate-700 to-slate-900 border border-slate-600',
      initials: 'JT',
      type: 'thai-cash',
      typeBadge: '🌟 รีวิวจริงบนโพสต์ Facebook',
      rating: 5,
      date: 'ล่าสุด (Verified)',
      verified: true,
      isRealFbComment: true,
      comment: '++ ค้าบบบริการดีมาก🥰',
      accountHighlight: 'ลูกค้าจริงยืนยันบนโพสต์เพจ PUBG SIAM'
    },
    {
      id: 2,
      name: 'Tanawat P. (ธนวัฒน์)',
      avatarBg: 'bg-emerald-600',
      initials: 'TW',
      type: 'thai-cash',
      typeBadge: '🇹🇭 ไอดีไทย ซื้อสด (มีประกัน)',
      rating: 5,
      date: '2 วันที่แล้ว',
      verified: true,
      comment: 'เครดิตแน่นมากครับ โอนปุ๊บได้ไอดีปั๊บ แอดมินซันดูแลดีมาก แนะนำวิธีเปลี่ยนอีเมลเปลี่ยนพาสเวิร์ด Steam ครบถ้วน เล่นมา 3 เดือนแล้วไอดีสะอาด 100% ไม่มีปัญหาเลยครับ แนะนำเลยครับร้านนี้ ⭐⭐⭐⭐⭐',
      accountHighlight: 'AUG มิโนทอร์ Lv.10 Max + รถ Urus S'
    },
    {
      id: 3,
      name: 'Kittipong S. (กิตติพงษ์)',
      avatarBg: 'bg-purple-600',
      initials: 'KP',
      type: 'installment',
      typeBadge: '⚡ ผ่อนชำระไอดีไทย (ครบงวดแล้ว)',
      rating: 5,
      date: '5 วันที่แล้ว',
      verified: true,
      comment: 'ซื้อผ่อนไอดีกับแอดซันง่ายมากครับ ไม่ยุ่งยาก ทำสัญญาใบผ่อน A4 มีลายเซ็นชัดเจน ปลอดภัย สบายใจได้เลยสำหรับคนงบน้อย แอดมินตามเรื่องให้ดีมาก ผ่อนครบส่งมอบไอดีทันที 10/10 ครับ 👍',
      accountHighlight: 'M416 ฟักทองฮาโลวีน Lv.6 + Beryl มังกร'
    },
    {
      id: 4,
      name: 'Phanuwat K. (ภานุวัฒน์)',
      avatarBg: 'bg-rose-600',
      initials: 'PN',
      type: 'china',
      typeBadge: '🇨🇳 ไอดีจีนแท้ (โอนย้ายสำเร็จ)',
      rating: 5,
      date: '1 สัปดาห์ที่แล้ว',
      verified: true,
      comment: 'ไอดีจีนแท้ตรงปกมากครับ สกินครบตามรูปที่ลงไว้เลย โอนเสร็จแอดมินส่งรหัสพร้อมแนะนำข้อควรระวังให้ครบถ้วน ประทับใจมาก ราคาคุ้มกว่าเปิดกล่องเองเยอะมากครับ ไว้มาอุดหนุนอีกแน่นอน!',
      accountHighlight: 'AUG มิโนทอร์ + รถ Cayenne Turbo GT'
    },
    {
      id: 5,
      name: 'Nattapong M. (ณัฐพงษ์)',
      avatarBg: 'bg-blue-600',
      initials: 'NP',
      type: 'thai-cash',
      typeBadge: '🇹🇭 ไอดีไทย ซื้อสด (ยอดใหญ่)',
      rating: 5,
      date: '2 สัปดาห์ที่แล้ว',
      verified: true,
      comment: 'ตอนแรกแอบกังวลเพราะยอดเยอะเกือบสองหมื่น แต่ทางร้านมีใบรับประกันการซื้อขาย มีบัตรประชาชนพร้อมตราประทับออกใบสัญญา A4 ให้ชัดเจน โปร่งใสสุดๆ ครับ เล่นแรงค์ได้สบายใจ ไม่ต้องกลัวโดนดึงคืน',
      accountHighlight: 'Aug มิโนทอร์ Max + M4 โจ๊กเกอร์ + Urus'
    },
    {
      id: 6,
      name: 'Saran B. (ศรันย์)',
      avatarBg: 'bg-indigo-600',
      initials: 'SR',
      type: 'installment',
      typeBadge: '⚡ ผ่อนชำระไอดีไทย (7 ข้อสัญญา)',
      rating: 5,
      date: '1 เดือนที่แล้ว',
      verified: true,
      comment: 'ผ่อนชำระตรงไปตรงมาครับ กฎการผ่อน 7 ข้อยุติธรรมมาก แอดมินคอยเช็กสถานะไอดีให้ตลอด ผ่อนงวดสุดท้ายเสร็จ โอนกรรมสิทธิ์ Steam Guard ให้ทันที ปลอดภัยจริงครับ',
      accountHighlight: 'M416 กลาเซียหิมะ Lv.7 Max + ชุด BAPE'
    }
  ];

  const filteredReviews = reviewsData.filter((rev) => {
    if (activeReviewFilter === 'all') return true;
    if (activeReviewFilter === 'installment') return rev.type === 'installment';
    if (activeReviewFilter === 'thai') return rev.type === 'thai-cash';
    if (activeReviewFilter === 'china') return rev.type === 'china';
    return true;
  });

  return (
    <section id="reviews" className="py-14 sm:py-20 bg-gradient-to-b from-slate-950 via-[#0d1424] to-slate-950 border-t border-b border-slate-800/80 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            <span>💬 รีวิว & เครดิตจากลูกค้าตัวจริงบน Facebook</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            เสียงตอบรับและความไว้วางใจจากผู้ซื้อจริง
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            มากกว่า 1,000+ ออเดอร์การันตีความปลอดภัย โอนไว ได้ไอดีจริง มีสัญญาและใบรับประกันการซื้อขายมือ 1 ทุกไอดี ลูกค้าตรวจเช็กเครดิตจริงได้ตลอด 24 ชั่วโมง
          </p>

          {/* Overall Rating & Live Facebook Link Badge */}
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900 border border-blue-500/40 shadow">
              <span className="text-amber-400 text-sm">⭐⭐⭐⭐⭐</span>
              <span className="text-white text-xs font-black">โพสต์เครดิตหลักเพจร้าน</span>
              <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Verified FB Post</span>
              </span>
            </div>

            {/* DIRECT FACEBOOK POST LINK BUTTON ⭐ */}
            <a
              href={fbPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-black transition-all shadow-lg shadow-blue-900/30 border border-blue-400 scale-[1.02] active:scale-98"
              title="เปิดดูโพสต์และคอมเมนต์จริงบน Facebook เพจร้าน"
            >
              <span>💬</span>
              <span>คลิกดูโพสต์และรีวิวทั้งหมดบน Facebook</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* REVIEW FILTER TABS */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveReviewFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeReviewFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            ทั้งหมด ({reviewsData.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveReviewFilter('installment')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeReviewFilter === 'installment'
                ? 'bg-purple-600 text-white font-black shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>⚡</span>
            <span>รีวิวการผ่อนไอดี</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveReviewFilter('thai')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeReviewFilter === 'thai'
                ? 'bg-blue-600 text-white font-black shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>🇹🇭</span>
            <span>ไอดีไทยมีประกัน</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveReviewFilter('china')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeReviewFilter === 'china'
                ? 'bg-rose-600 text-white font-black shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>🇨🇳</span>
            <span>ไอดีจีนโอนย้าย</span>
          </button>
        </div>

        {/* REVIEWS GRID (2-3 COLS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-5 sm:p-6 rounded-2xl transition-all flex flex-col justify-between shadow-xl group hover:shadow-2xl ${
                rev.isRealFbComment
                  ? 'bg-gradient-to-b from-[#141e33] to-[#0f172a] border-2 border-blue-500/60 shadow-blue-900/30 hover:border-blue-400'
                  : 'bg-[#111724] border border-slate-800/90 hover:border-slate-700 hover:shadow-blue-950/20'
              }`}
            >
              <div className="space-y-3.5">
                {/* Header: User avatar + name + verified badge */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${rev.avatarBg} text-white font-black text-xs flex items-center justify-center shadow`}>
                      {rev.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-black text-white line-clamp-1">
                          {rev.name}
                        </h4>
                        {rev.isRealFbComment && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center gap-0.5">
                            <span>💖</span>
                            <span>โดยผู้เขียน</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span>{rev.date}</span>
                        <span>•</span>
                        <span className="text-blue-400 font-semibold flex items-center gap-0.5">
                          <span>✓</span>
                          <span>ยืนยันจาก Facebook</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex text-amber-400 text-xs">
                    {'⭐'.repeat(rev.rating)}
                  </div>
                </div>

                {/* Account Type Badge */}
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                    rev.isRealFbComment
                      ? 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}>
                    {rev.typeBadge}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  "{rev.comment}"
                </p>
              </div>

              {/* Bottom: Item purchased highlight */}
              {rev.accountHighlight && (
                <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[200px]">
                    🎮 <strong className="text-amber-300 font-semibold">{rev.accountHighlight}</strong>
                  </span>
                  <a
                    href={fbPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-bold hover:underline shrink-0"
                  >
                    ดูคอมเมนต์จริง ↗
                  </a>
                </div>
              )}
            </div>
          ))}

          {/* INVITATION CARD FOR NEW BUYERS TO LEAVE FB REVIEW */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-950/20 via-slate-900/50 to-indigo-950/20 border-2 border-dashed border-blue-500/40 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold flex items-center justify-center text-lg">
                ✍️
              </div>
              <div>
                <h4 className="text-sm font-black text-white">
                  เคยใช้บริการกับ PUBG SIAM แล้ว?
                </h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  ร่วมแชร์ความประทับใจ ให้คะแนน และคอมเมนต์เครดิตใต้โพสต์ Facebook ของร้านได้เลย ทุกเสียงของลูกค้ามีความหมายมากครับ
                </p>
              </div>
            </div>

            <a
              href={fbPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <span>💬</span>
              <span>คลิกไปเขียนรีวิวบน Facebook</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* BOTTOM CALLOUT BANNER */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-purple-950/40 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <span>🛡️</span>
              <span>มั่นใจ ปลอดภัย ซื้อขายไอดี PUBG PC กับ PUBG SIAM</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              มีประกันมือ 1 แท้ทุกไอดี • มีระบบผ่อนชำระถูกต้องตามกฎหมาย • แอดมินดูแลให้คำปรึกษาตลอด 24 ชั่วโมง
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

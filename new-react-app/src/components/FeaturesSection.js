import React from 'react';

export default function FeaturesSection({ t }) {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      ),
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      title: t.f1Title,
      desc: t.f1Desc
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      ),
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      title: t.f2Title,
      desc: t.f2Desc
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      ),
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      title: t.f3Title,
      desc: t.f3Desc
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
      ),
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      title: t.f4Title,
      desc: t.f4Desc
    }
  ];

  return (
    <section id="features" className="py-14 bg-slate-900/40 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {t.featuresTitle} <span className="text-amber-400">PUBG SIAM</span>?
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {t.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#111723] border border-slate-800 space-y-3">
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${item.color}`}>
                {item.icon}
              </div>
              <h3 className="font-bold text-white text-base">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Verified Escrow & Trade Manager Guarantee Boxes (Separated: SunsnappZ & AWESOMEZ SHOP) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: SunsnappZ - Trade Manager */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#111723] via-amber-950/20 to-[#111723] border border-amber-500/40 flex flex-col justify-between gap-5 shadow-2xl hover:border-amber-400/70 transition-all">
            <div className="flex items-start gap-4">
              <img 
                src="/images/sunsnappz-logo.png" 
                alt="SunsnappZ Manager" 
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_4px_16px_rgba(245,158,11,0.35)] shrink-0 hover:scale-105 transition-transform" 
              />
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xl font-black text-white">SunsnappZ</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                    ✓ ผู้ดูแลการซื้อขายอย่างเป็นทางการ
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  แอดมินคนกลางดูแลการส่งมอบไอดี PUBG PC โดยตรง ตรวจเช็กคลังไอดีจริง โอนย้าย Steam ปลอดภัย 100% มีประกันมือ 1 ไม่ดึงคืน
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">ช่องทางติดต่อหลัก Facebook</span>
              <a
                href="https://www.facebook.com/profile.php?id=61596307388431"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
              >
                <span>📘</span>
                <span>Facebook แอดมิน</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* Card 2: AWESOMEZ SHOP - Official Discord Shop & Community */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#111723] via-indigo-950/20 to-[#111723] border border-indigo-500/40 flex flex-col justify-between gap-5 shadow-2xl hover:border-indigo-400/70 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-950/90 border border-indigo-500/30 flex items-center justify-center p-2 shrink-0">
                <img 
                  src="/images/awesomez-shop-logo.png" 
                  alt="AWESOMEZ SHOP" 
                  className="w-full h-auto object-contain drop-shadow-md brightness-110" 
                />
              </div>
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xl font-black text-white">AWESOMEZ SHOP</span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 px-2 py-0.5 rounded-full font-bold">
                    💜 Discord Community & Shop
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  คอมมูนิตี้และร้านค้าทางการ สั่งซื้อไอดี พูดคุยปรึกษาทีมงาน และเปิดตั๋ว Ticket สั่งซื้อปลอดภัยกับทีมงานตลอด 24 ชม.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">คอมมูนิตี้ & เปิดตั๋วสั่งซื้อไอดี</span>
              <a
                href="https://discord.gg/p9fHwmMUPd"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
              >
                <span>💜</span>
                <span>Discord Server</span>
                <span>↗</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

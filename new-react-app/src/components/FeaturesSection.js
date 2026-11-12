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
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0d131f] via-[#141b2b] to-[#0b0e14] border border-amber-500/40 shadow-xl shadow-amber-950/20 flex flex-col justify-between gap-5 hover:border-amber-400/80 transition-all">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                ผู้ดูแลการซื้อขายอย่างเป็นทางการ
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wider">OFFICIAL ESCROW</span>
            </div>

            <div className="flex items-center gap-4 sm:gap-5 my-1">
              <div 
                style={{ width: '96px', height: '96px', minWidth: '96px', minHeight: '96px' }}
                className="rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-center p-2 shadow-inner shrink-0"
              >
                <img 
                  src="/images/sunsnappz-logo.png" 
                  alt="SunsnappZ Manager" 
                  style={{ width: '80px', height: '80px', maxWidth: '80px', maxHeight: '80px' }}
                  className="object-contain drop-shadow-[0_4px_16px_rgba(245,158,11,0.4)] hover:scale-105 transition-transform" 
                />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide leading-tight truncate">
                  SunsnappZ
                </h3>
                <p className="text-xs sm:text-sm text-amber-400 font-bold">
                  คนกลางดูแลการส่งมอบไอดี PUBG PC
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ดูแลความปลอดภัยทุกขั้นตอน ตรวจเช็กคลัง & โอนย้าย Steam ปลอดภัย 100%
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
              แอดมินคนกลางดูแลการส่งมอบไอดี PUBG PC โดยตรง ตรวจเช็กคลังไอดีจริง โอนย้าย Steam ปลอดภัย 100% มีประกันมือ 1 ไม่ดึงคืน
            </p>
          </div>

          {/* Card 2: AWESOMEZ SHOP - Official Partner Shop */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0d131f] via-[#15172b] to-[#0b0e14] border border-indigo-500/40 shadow-xl shadow-indigo-950/20 flex flex-col justify-between gap-5 hover:border-indigo-400/80 transition-all">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                ร้านค้าผู้ดูแลร่วม
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wider">OFFICIAL PARTNER</span>
            </div>

            <div className="flex items-center gap-4 sm:gap-5 my-1">
              <div 
                style={{ height: '96px', minHeight: '96px' }}
                className="px-3.5 rounded-2xl bg-slate-950/80 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-inner"
              >
                <img 
                  src="/images/awesomez-shop-logo.png" 
                  alt="AWESOMEZ SHOP" 
                  style={{ height: '42px', width: 'auto', maxWidth: '170px' }}
                  className="object-contain brightness-110 drop-shadow-[0_2px_12px_rgba(99,102,241,0.5)] hover:scale-105 transition-transform" 
                />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide leading-tight truncate">
                  AWESOMEZ SHOP
                </h3>
                <p className="text-xs sm:text-sm text-indigo-400 font-bold">
                  ร้านค้าทางการและคอมมูนิตี้
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ร้านค้าและทีมงานดูแลระบบ คัดสรรสต็อกไอดีคุณภาพ ซัพพอร์ตตลอด 24 ชม.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
              ร้านค้าและคอมมูนิตี้ทางการ คัดสรรไอดีคุณภาพสูง ตรวจสอบประวัติบัญชีขาวสะอาด พร้อมทีมงานดูแลระบบและซัพพอร์ตตลอด 24 ชม.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

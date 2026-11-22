import React, { useState } from 'react';

export default function CommunitySection({ lang = 'th', t = {} }) {
  const isTh = lang === 'th';
  const tsIp = 'THPUBG-TS';
  const [copied, setCopied] = useState(false);

  const handleCopyIp = async () => {
    try {
      await navigator.clipboard.writeText(tsIp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {
      // Fallback
      const input = document.createElement('input');
      input.value = tsIp;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section
      id="community"
      className="py-16 sm:py-20 bg-gradient-to-b from-slate-950 via-[#0b1324] to-slate-950 border-t border-b border-slate-800/80 relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>🎧 {isTh ? 'PUBG Community & Voice Server • รวมพลคนเล่น PUBG' : 'PUBG Community & Voice Server'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isTh ? (
              <>
                หาเพื่อนเล่น PUBG? มาร่วมตี้กับเราที่ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">TeamSpeak 3</span>
              </>
            ) : (
              <>
                Looking for a Squad? Join our <span className="text-blue-400">TeamSpeak 3 Community</span>
              </>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {isTh
              ? 'พื้นที่สำหรับคอเกม PUBG PC ที่ต้องการหาตี้ ไต่แรงก์ หรือเล่นชิลล์ๆ พูดคุยด้วยเสียงคมชัด ปิงต่ำ เสถียรตลอด 24 ชั่วโมง มีห้องแยกให้เล่นทั้ง Duo และ Squad ฟรี!'
              : 'The ultimate PUBG PC community voice server. Find squadmates, rank push together, or chill with clear voice, low ping, and dedicated rooms 24/7.'}
          </p>
        </div>

        {/* MAIN HERO CARD: BANNER + IP BOX */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#10192e] via-[#0d1527] to-[#121c33] border-2 border-blue-500/50 hover:border-blue-400/80 transition-all rounded-3xl p-6 sm:p-10 shadow-2xl shadow-blue-950/40 relative overflow-hidden mb-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* LEFT: Official Graphic Banner */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="w-full bg-white rounded-2xl p-4 shadow-xl border border-slate-700/60 flex items-center justify-center overflow-hidden group hover:scale-[1.02] transition-transform">
                <img
                  src="/images/thpubg-ts-banner.png"
                  alt="TS สำหรับหาเพื่อน THPUBG-TS"
                  className="w-full h-auto max-h-48 object-contain"
                />
              </div>
              <span className="text-[11px] text-slate-400 font-semibold mt-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                <span>{isTh ? 'เซิร์ฟเวอร์เปิดให้บริการ 24 ชม. ออนไลน์ตลอด' : 'Server Online 24/7'}</span>
              </span>
            </div>

            {/* RIGHT: IP Address & One-click Actions */}
            <div className="md:col-span-7 space-y-5 text-left">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  🌐 {isTh ? 'ที่อยู่เซิร์ฟเวอร์ TeamSpeak (Server Address)' : 'TeamSpeak Server Address'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {isTh ? 'เชื่อมต่อง่ายๆ เพียงใช้ IP นี้:' : 'Connect instantly using this IP:'}
                </h3>
              </div>

              {/* IP Big Display & Copy Box */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border-2 border-blue-500/60 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400 text-blue-300 font-black text-lg flex items-center justify-center shrink-0">
                    🎙️
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">IP TS3 / Server Address</span>
                    <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono tracking-wider">
                      {tsIp}
                    </span>
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={handleCopyIp}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 ${
                    copied
                      ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  }`}
                  title="คลิกเพื่อคัดลอก IP ไปวางใน TeamSpeak 3"
                >
                  <span>{copied ? '✓' : '📋'}</span>
                  <span>{copied ? (isTh ? 'คัดลอก IP แล้ว!' : 'Copied!') : (isTh ? 'คัดลอก IP' : 'Copy IP')}</span>
                </button>
              </div>

              {/* Action Buttons: Direct Launch + Download TS3 */}
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap pt-1">
                <a
                  href={`ts3server://${tsIp}`}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-950/50 active:scale-98 border border-blue-400/40"
                  title="เปิดโปรแกรม TeamSpeak 3 และเชื่อมต่ออัตโนมัติ"
                >
                  <span>🚀</span>
                  <span>{isTh ? 'กดเพื่อเข้า TeamSpeak ทันที' : 'Launch TeamSpeak'}</span>
                </a>

                <a
                  href="https://www.teamspeak.com/en/downloads/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all border border-slate-700/80 active:scale-98 shrink-0"
                  title="ยังไม่มีโปรแกรม? ดาวน์โหลด TeamSpeak 3 ฟรี"
                >
                  <span>📥</span>
                  <span>{isTh ? 'โหลดโปรแกรม TS3' : 'Get TS3'}</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* 3 HIGHLIGHT FEATURE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-10">
          
          <div className="p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800/80 hover:border-blue-500/40 transition-all space-y-2.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center text-xl">
              ⚡
            </div>
            <h4 className="text-sm sm:text-base font-black text-white">
              {isTh ? 'ปิงต่ำ เสียงคมชัด ไม่ดีเลย์' : 'Low Ping & Crystal Clear Voice'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isTh
                ? 'เซิร์ฟเวอร์ตั้งอยู่ในไทย ได้ยินเสียงฝีเท้าและทิศทางปืนชัดเจน ไม่แล็ก ไม่ดีเลย์ พร้อมสื่อสารกับเพื่อนร่วมทีมได้ทันท่วงที'
                : 'Hosted in Thailand with ultra-low ping. Clear audio for footsteps and tactical callouts without delays.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800/80 hover:border-amber-500/40 transition-all space-y-2.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xl">
              👥
            </div>
            <h4 className="text-sm sm:text-base font-black text-white">
              {isTh ? 'หาตี้ Squad & Duo 24 ชม.' : 'Find Squad & Duo 24/7'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isTh
                ? 'มีผู้เล่นทุกระดับ ทั้งมือใหม่หัดเล่น สายสตรีมเมอร์ และโปรเพลเยอร์สายไต่แรงก์ ไม่ต้องเล่นคนเดียวอีกต่อไป'
                : 'Active community of casual and ranked players. Never drop alone again—squad up anytime!'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800/80 hover:border-purple-500/40 transition-all space-y-2.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center text-xl">
              🛡️
            </div>
            <h4 className="text-sm sm:text-base font-black text-white">
              {isTh ? 'สังคมคุณภาพ มีแอดมินดูแล' : 'Quality Community & Active Admins'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isTh
                ? 'มีห้องแยกอิสระ สามารถขอห้องถาวรสำหรับกลุ่มเพื่อนหรือแคลนได้ฟรี มีระบบรักษาความปลอดภัย ป้องกันการก่อกวน'
                : 'Free permanent custom channels for your clan or friends with active moderation to keep toxic players away.'}
            </p>
          </div>

        </div>

        {/* HOW TO JOIN (3 QUICK STEPS) */}
        <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 text-left">
          <h4 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>💡</span>
            <span>{isTh ? 'วิธีเข้าใช้งาน TeamSpeak ใน 3 ขั้นตอนง่ายๆ:' : 'How to join TeamSpeak in 3 easy steps:'}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="font-black text-amber-400 block mb-1">1. เปิดโปรแกรม</span>
              <span>เปิดโปรแกรม TeamSpeak 3 บนคอมพิวเตอร์ของคุณ</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="font-black text-blue-400 block mb-1">2. กด Connect</span>
              <span>เลือกเมนู Connections &gt; Connect (หรือกด Ctrl + S)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="font-black text-emerald-400 block mb-1">3. ใส่ IP เชื่อมต่อ</span>
              <span>พิมพ์ <strong className="text-amber-300 font-mono">THPUBG-TS</strong> แล้วกด Connect เข้าห้องได้เลย!</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

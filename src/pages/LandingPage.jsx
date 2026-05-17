import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, CalendarDays, Search, Palette, BookOpen, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans">

      {/* ===== Navbar ===== */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-gray-900" />
          </div>
          <span className="text-white font-black tracking-tight text-lg">MSU Schedule</span>
        </div>
        <span className="text-gray-500 text-sm hidden sm:block">
          มหาวิทยาลัยมหาสารคาม
        </span>
      </nav>

      {/* ===== Hero ===== */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">

        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-28 h-28 bg-yellow-400 rounded-3xl rotate-6 flex items-center justify-center shadow-2xl shadow-yellow-400/20">
            <CalendarDays className="w-14 h-14 text-gray-900 -rotate-6" />
          </div>
          <div className="absolute -bottom-1 -right-3 w-10 h-10 bg-green-400 rounded-2xl rotate-12 flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 text-white -rotate-12" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
          จัดตารางเรียน<br />
          <span className="text-yellow-400">ง่ายๆ ได้เลย</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-md mb-10 leading-relaxed">
          ค้นหาวิชา เลือกกลุ่มเรียน ปรับแต่งสี<br />
          แล้วดูตารางสวยๆ ของคุณได้เลยครับ
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate('/schedule')}
          className="group flex items-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-lg px-10 py-4 rounded-2xl transition-all shadow-xl shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:-translate-y-0.5 active:translate-y-0"
        >
          <CalendarDays className="w-5 h-5" />
          เริ่มการจัดตารางเรียน
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 w-full max-w-2xl">
          {[
            {
              icon: <Search className="w-6 h-6" />,
              color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
              title: 'ค้นหาง่าย',
              desc: 'ค้นจากรหัสวิชา ชื่อวิชา หรืออาจารย์',
            },
            {
              icon: <CalendarDays className="w-6 h-6" />,
              color: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
              title: 'ตารางชัดเจน',
              desc: 'เห็นช่วงเวลาทุกวันได้ทันที',
            },
            {
              icon: <Palette className="w-6 h-6" />,
              color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
              title: 'ปรับแต่งสีได้',
              desc: 'เลือกสีแต่ละวิชาตามใจชอบ',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left hover:bg-white/8 transition-colors"
            >
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border mb-3 ${f.color}`}>
                {f.icon}
              </div>
              <p className="text-white font-bold mb-1">{f.title}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ===== Footer ===== */}
      <footer className="py-4 text-center text-gray-600 text-xs border-t border-white/5">
        มหาวิทยาลัยมหาสารคาม · ระบบจัดตารางเรียน
      </footer>
    </div>
  );
}
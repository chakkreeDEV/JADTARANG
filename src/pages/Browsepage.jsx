import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ChevronDown, ChevronUp, ChevronRight,
  BookOpen, Clock, MapPin, User, Plus, Filter, Search, X,
} from 'lucide-react';
import { MOCK_COURSES } from '../mock/index';

const DAYS = {
  mon:'จันทร์', tue:'อังคาร', wed:'พุธ',
  thu:'พฤหัสบดี', fri:'ศุกร์', sat:'เสาร์', sun:'อาทิตย์',
};
const DAY_COLORS = {
  mon:'bg-yellow-100 text-yellow-800 border-yellow-300',
  tue:'bg-pink-100 text-pink-800 border-pink-300',
  wed:'bg-green-100 text-green-800 border-green-300',
  thu:'bg-orange-100 text-orange-800 border-orange-300',
  fri:'bg-blue-100 text-blue-800 border-blue-300',
  sat:'bg-purple-100 text-purple-800 border-purple-300',
  sun:'bg-red-100 text-red-800 border-red-300',
};

// ==========================================
// MiniCourseCard
// ==========================================
function MiniCourseCard({ course, onAddCourse, addedSections }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedSec, setSelectedSec] = useState(null);

  const isAdded = (sec) => addedSections.some((a) => a.code === course.code && a.sec === sec.sec);

  const handleAdd = () => {
    if (!selectedSec) return;
    onAddCourse({
      code: course.code, name: course.name,
      credits: course.credits, category: course.category,
      day: selectedSec.day, startTime: selectedSec.startTime,
      endTime: selectedSec.endTime, room: selectedSec.room,
      instructor: selectedSec.instructor, status: selectedSec.status,
      sec: selectedSec.sec,
    });
    setSelectedSec(null);
    setExpanded(false);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-sm transition-shadow">
      <button onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono text-xs font-bold text-yellow-600">{course.code}</span>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{course.credits} หน่วยกิต</span>
          </div>
          <p className="text-sm font-medium text-gray-800 truncate">{course.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{course.sections.length} กลุ่มเรียน</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 space-y-3">
          <p className="text-xs font-semibold text-gray-500">เลือกกลุ่มเรียน:</p>
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
            {course.sections.map((sec) => {
              const added = isAdded(sec);
              const isSelected = selectedSec?.sec === sec.sec;
              return (
                <button key={sec.sec} onClick={() => !added && setSelectedSec(isSelected ? null : sec)} disabled={added}
                  className={`w-full text-left px-3 py-2 rounded-lg border transition-all text-xs
                    ${added ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-200'
                      : isSelected ? 'bg-yellow-50 border-yellow-400 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-yellow-300 hover:bg-yellow-50/50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-800">Sec {sec.sec}</span>
                    {sec.day && (
                      <span className={`px-1.5 py-0.5 rounded-full border text-[10px] font-medium ${DAY_COLORS[sec.day] || ''}`}>
                        {DAYS[sec.day] || sec.day}
                      </span>
                    )}
                    {added && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">✓ เพิ่มแล้ว</span>}
                    {isSelected && !added && <span className="text-[10px] bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded-full">✓ เลือกแล้ว</span>}
                  </div>
                  <div className="flex flex-wrap gap-2 text-gray-500">
                    {sec.startTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{sec.startTime}–{sec.endTime}</span>}
                    {sec.room && <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{sec.room}</span>}
                  </div>
                  {sec.instructor && sec.instructor !== '-' && (
                    <div className="flex items-start gap-1 mt-0.5 text-gray-400">
                      <User className="w-3 h-3 mt-0.5 shrink-0"/><span className="line-clamp-1">{sec.instructor}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <button onClick={handleAdd} disabled={!selectedSec}
            className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-bold transition-all
              ${selectedSec ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            <Plus className="w-3.5 h-3.5"/>
            {selectedSec ? `เพิ่ม Sec ${selectedSec.sec}` : 'เลือก Section ก่อนครับ'}
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// CategorySection
// ==========================================
function CategorySection({ category, courses, onAddCourse, addedSections, globalQuery }) {
  const [open, setOpen] = useState(true);
  const [dayFilter, setDayFilter] = useState('all');

  const days = [
    { key:'all', label:'ทุกวัน' },
    { key:'mon', label:'จันทร์' }, { key:'tue', label:'อังคาร' },
    { key:'wed', label:'พุธ' },   { key:'thu', label:'พฤหัสบดี' },
    { key:'fri', label:'ศุกร์' }, { key:'sat', label:'เสาร์' },
    { key:'sun', label:'อาทิตย์' },
  ];

  const filtered = useMemo(() => {
    let list = courses;
    if (dayFilter !== 'all') list = list.filter((c) => c.sections.some((s) => s.day === dayFilter));
    if (globalQuery.trim()) {
      const q = globalQuery.toLowerCase();
      list = list.filter((c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.sections.some((s) => s.instructor?.toLowerCase().includes(q))
      );
    }
    return list;
  }, [courses, dayFilter, globalQuery]);

  // ถ้า search แล้วไม่เจออะไรเลยในหมวดนี้ ซ่อนทั้งหมวด
  if (globalQuery.trim() && filtered.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <button onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-800 text-white hover:bg-gray-700 transition-colors">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-yellow-400"/>
          <div className="text-left">
            <span className="font-bold">{category}</span>
            <span className="text-gray-400 text-sm ml-2">({filtered.length} วิชา)</span>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400"/> : <ChevronRight className="w-5 h-5 text-gray-400"/>}
      </button>

      {open && (
        <div className="p-5">
          {/* Day filter */}
          {!globalQuery.trim() && (
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
              <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0"/>
              {days.map((d) => (
                <button key={d.key} onClick={() => setDayFilter(d.key)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium transition-colors
                    ${dayFilter === d.key ? 'bg-yellow-400 border-yellow-400 text-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:border-yellow-300'}`}>
                  {d.label}
                </button>
              ))}
            </div>
          )}
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">ไม่มีวิชาในวันที่เลือกครับ</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((course) => (
                <MiniCourseCard key={course.code} course={course}
                  onAddCourse={onAddCourse} addedSections={addedSections}/>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ==========================================
// BrowsePage
// ==========================================
export default function BrowsePage({ courses, addCourse }) {
  const navigate = useNavigate();
  const [globalQuery, setGlobalQuery] = useState('');

  const grouped = useMemo(() => {
    const map = {};
    MOCK_COURSES.forEach((c) => {
      const cat = c.category || 'อื่นๆ';
      if (!map[cat]) map[cat] = [];
      map[cat].push(c);
    });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0], 'th'));
  }, []);

  // จำนวนที่พบทั้งหมด
  const totalFound = useMemo(() => {
    if (!globalQuery.trim()) return MOCK_COURSES.length;
    const q = globalQuery.toLowerCase();
    return MOCK_COURSES.filter((c) =>
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.sections.some((s) => s.instructor?.toLowerCase().includes(q))
    ).length;
  }, [globalQuery]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-gray-800 text-white px-4 py-3 sticky top-0 z-30 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/schedule')}
              className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm transition-colors">
              <ArrowLeft className="w-4 h-4"/> กลับ
            </button>
            <h1 className="font-bold text-base">เลือกวิชา</h1>
          </div>
          <button onClick={() => navigate('/schedule')}
            className="flex items-center gap-1.5 bg-yellow-400 text-gray-900 px-3 py-2 rounded-lg text-sm font-bold hover:bg-yellow-500 transition-colors">
            <BookOpen className="w-4 h-4"/> {courses.length} วิชา
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* ── Search box ด้านบน ── */}
        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
          <div className="relative">
            <input
              type="text"
              value={globalQuery}
              onChange={(e) => setGlobalQuery(e.target.value)}
              placeholder="ค้นหารหัสวิชา, ชื่อวิชา หรืออาจารย์..."
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 pl-9 pr-9 py-2.5 rounded-xl text-sm focus:outline-none focus:border-yellow-400 focus:bg-white transition-colors"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3"/>
            {globalQuery && (
              <button onClick={() => setGlobalQuery('')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4"/>
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {globalQuery.trim()
              ? <>พบ <span className="font-bold text-gray-700">{totalFound}</span> วิชา จากคำว่า "<span className="text-yellow-600 font-bold">{globalQuery}</span>"</>
              : <>รวม <span className="font-bold text-gray-700">{MOCK_COURSES.length}</span> วิชาทั้งหมด</>
            }
          </p>
        </div>

        {/* หมวดหมู่ */}
        {grouped.map(([category, courseList]) => (
          <CategorySection key={category} category={category} courses={courseList}
            onAddCourse={addCourse} addedSections={courses} globalQuery={globalQuery}/>
        ))}

        {globalQuery.trim() && totalFound === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Search className="w-12 h-12 text-gray-200 mx-auto mb-3"/>
            <p className="font-medium">ไม่พบวิชาที่ค้นหาครับ</p>
            <p className="text-sm mt-1">ลองค้นหาด้วยคำอื่นดูนะครับ</p>
          </div>
        )}
      </main>
    </div>
  );
}
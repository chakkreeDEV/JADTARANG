import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Clock, MapPin, User, Plus, ArrowLeft,
  Info, ChevronDown, ChevronUp, History, X, BookOpen,
} from 'lucide-react';
import { MOCK_COURSES } from '../mock/index';

// ==========================================
// 🗓️ Helpers
// ==========================================
const DAYS = {
  mon: 'จันทร์', tue: 'อังคาร', wed: 'พุธ',
  thu: 'พฤหัสบดี', fri: 'ศุกร์', sat: 'เสาร์', sun: 'อาทิตย์',
};

const DAY_COLORS = {
  mon: 'bg-red-100 text-red-600 border-yellow-300',
  tue: 'bg-pink-100 text-pink-800 border-pink-300',
  wed: 'bg-green-100 text-green-800 border-green-300',
  thu: 'bg-orange-100 text-orange-800 border-orange-300',
  fri: 'bg-blue-100 text-blue-800 border-blue-300',
  sat: 'bg-purple-100 text-purple-800 border-purple-300',
  sun: 'bg-red-100 text-red-500 border-red-300',
};

const STATUS_MAP = {
  W: { text: 'ลงได้ผ่าน WEB', color: 'bg-green-100 text-green-700' },
  A: { text: 'เพิ่มผ่าน WEB เท่านั้น', color: 'bg-blue-100 text-blue-700' },
  C: { text: 'ปิดไม่รับลง', color: 'bg-red-100 text-red-700' },
  N: { text: 'โดยเจ้าหน้าที่เท่านั้น', color: 'bg-gray-200 text-gray-700' },
};

// ==========================================
// 🃏 CourseCard — แสดงการ์ดวิชา + Dropdown เลือก Section
// ==========================================
function CourseCard({ course, onAddCourse, addedSections }) {
  const [open, setOpen] = useState(false);
  const [selectedSec, setSelectedSec] = useState(null);
  const ref = useRef(null);

  // ปิด dropdown เมื่อคลิกนอก
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelectSec = (sec) => {
    setSelectedSec(sec);
    setOpen(false);
  };

  const handleAdd = () => {
    if (!selectedSec) return;
    onAddCourse({
      code: course.code,
      name: course.name,
      credits: course.credits,
      category: course.category,
      day: selectedSec.day,
      startTime: selectedSec.startTime,
      endTime: selectedSec.endTime,
      room: selectedSec.room,
      instructor: selectedSec.instructor,
      status: selectedSec.status,
      sec: selectedSec.sec,
    });
    setSelectedSec(null);
  };

  const isAdded = (sec) =>
    addedSections.some((a) => a.code === course.code && a.sec === sec.sec);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-visible transition-shadow hover:shadow-md">

      {/* หัวการ์ด */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-5 py-4 rounded-t-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-red-500 font-bold text-sm tracking-wide">
                {course.code}
              </span>
              {course.category && (
                <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                  {course.category}
                </span>
              )}
            </div>
            <h3 className="font-bold text-sm leading-snug">{course.name}</h3>
          </div>
          <span className="shrink-0 bg-red-500 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full">
            {course.credits} หน่วยกิต
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          {course.sections.length} กลุ่มเรียน
        </div>
      </div>

      {/* เนื้อหาการ์ด: Dropdown เลือก Section */}
      <div className="px-5 py-4 space-y-3" ref={ref}>

        {/* Dropdown Section */}
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center justify-between bg-gray-100 border border-gray-200 hover:border-red-500 rounded-xl px-4 py-3 text-sm transition-colors"
          >
            {selectedSec ? (
              <span className="flex items-center gap-2 text-gray-800">
                <span className="font-bold text-red-500">Sec {selectedSec.sec}</span>
                {selectedSec.day && (
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${DAY_COLORS[selectedSec.day] || ''}`}>
                    {DAYS[selectedSec.day]}
                  </span>
                )}
                {selectedSec.startTime && (
                  <span className="text-gray-500">{selectedSec.startTime}–{selectedSec.endTime}</span>
                )}
              </span>
            ) : (
              <span className="text-gray-400">เลือกกลุ่มเรียน (Section)...</span>
            )}
            {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
          </button>

          {/* Dropdown list */}
          {open && (
            <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-72 overflow-y-auto">
              {course.sections.map((sec) => {
                const added = isAdded(sec);
                return (
                  <button
                    key={sec.sec}
                    onClick={() => !added && handleSelectSec(sec)}
                    disabled={added}
                    className={`w-full text-left px-4 py-3 border-b border-gray-50 last:border-0 transition-colors
                      ${added ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:bg-red-50 cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-800">Sec {sec.sec}</span>
                      {sec.day && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${DAY_COLORS[sec.day] || 'bg-gray-200 text-gray-600'}`}>
                          {DAYS[sec.day] || sec.day}
                        </span>
                      )}
                      {sec.status && STATUS_MAP[sec.status] && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_MAP[sec.status].color}`}>
                          {STATUS_MAP[sec.status].text}
                        </span>
                      )}
                      {added && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          ✓ เพิ่มแล้ว
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      {sec.startTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {sec.startTime}–{sec.endTime}
                        </span>
                      )}
                      {sec.room && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {sec.room}
                        </span>
                      )}
                    </div>
                    {sec.instructor && sec.instructor !== '-' && (
                      <div className="flex items-start gap-1 mt-1 text-xs text-gray-400">
                        <User className="w-3 h-3 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{sec.instructor}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* แสดงข้อมูล section ที่เลือก */}
        {selectedSec && (
          <div className="bg-red-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm space-y-1.5">
            <div className="flex flex-wrap gap-3 text-gray-700">
              {selectedSec.startTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                  {selectedSec.startTime}–{selectedSec.endTime}
                </span>
              )}
              {selectedSec.room && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  {selectedSec.room}
                </span>
              )}
            </div>
            {selectedSec.instructor && selectedSec.instructor !== '-' && (
              <div className="flex items-start gap-1 text-xs text-gray-500">
                <User className="w-3.5 h-3.5 mt-0.5 shrink-0 text-red-500" />
                <span>{selectedSec.instructor}</span>
              </div>
            )}
          </div>
        )}

        {/* ปุ่มเพิ่ม */}
        <button
          onClick={handleAdd}
          disabled={!selectedSec}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all
            ${selectedSec
              ? 'bg-red-500 hover:bg-red-600 text-gray-900 shadow-sm hover:shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          <Plus className="w-4 h-4" />
          {selectedSec ? `เพิ่ม Sec ${selectedSec.sec} ลงตาราง` : 'เลือก Section ก่อนครับ'}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 🔍 SearchPage
// ==========================================
export default function SearchPage({
  courses,
  addCourse,
  searchHistory,
  addSearchHistory,
  removeSearchHistory,
  clearSearchHistory,
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef(null);

  // ค้นหา
  const results = useMemo(() => {
    if (!submitted) return [];
    const term = submitted.toLowerCase();
    return MOCK_COURSES.filter((course) => {
      const codeMatch = course.code.toLowerCase().includes(term);
      const nameMatch = course.name.toLowerCase().includes(term);
      const instrMatch = course.sections.some(
        (s) => s.instructor && s.instructor.toLowerCase().includes(term)
      );
      return codeMatch || nameMatch || instrMatch;
    });
  }, [submitted]);

  const handleSearch = (term) => {
    const t = (term || searchTerm).trim();
    if (!t) return;
    setSubmitted(t);
    addSearchHistory(t);
    setShowHistory(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') setShowHistory(false);
  };

  const handleHistoryClick = (term) => {
    setSearchTerm(term);
    handleSearch(term);
  };

  const handleAddCourse = (courseData) => {
    addCourse(courseData);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">

      {/* ===== Header ===== */}
      <header className="bg-gray-600 text-white px-4 py-3 shadow-lg sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 bg-gray-600 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับ
          </button>

          {/* Search box */}
          <div className="flex-1 relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setShowHistory(true); }}
                  onFocus={() => setShowHistory(true)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-gray-600 border border-gray-600 text-white placeholder-gray-400 px-4 py-2.5 pl-10 rounded-xl focus:outline-none focus:border-red-500 text-sm"
                  placeholder="ค้นหารหัสวิชา, ชื่อวิชา, อาจารย์..."
                  autoFocus
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                {searchTerm && (
                  <button
                    onClick={() => { setSearchTerm(''); setSubmitted(''); inputRef.current?.focus(); }}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => handleSearch()}
                className="bg-red-500 hover:bg-red-600 text-gray-900 font-bold px-4 py-2 rounded-xl text-sm shrink-0 transition-colors"
              >
                ค้นหา
              </button>
            </div>

            {/* ประวัติการค้นหา */}
            {showHistory && searchHistory.length > 0 && !submitted && (
              <div className="absolute left-0 right-12 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                  <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                    <History className="w-3 h-3" /> ประวัติการค้นหา
                  </span>
                  <button
                    onClick={() => clearSearchHistory()}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    ลบทั้งหมด
                  </button>
                </div>
                {searchHistory.map((h) => (
                  <div
                    key={h}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-gray-50 last:border-0"
                  >
                    <button
                      className="flex items-center gap-2 text-sm text-gray-700 flex-1 text-left"
                      onClick={() => handleHistoryClick(h)}
                    >
                      <History className="w-3.5 h-3.5 text-gray-300" />
                      {h}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeSearchHistory(h); }}
                      className="text-gray-300 hover:text-red-400 ml-2"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* วิชาที่เลือกแล้ว */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 bg-red-500 text-gray-900 px-3 py-2 rounded-lg text-sm font-bold shrink-0 hover:bg-red-600 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            {courses.length}
          </button>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main
        className="max-w-4xl mx-auto px-4 py-6"
        onClick={() => setShowHistory(false)}
      >
        {/* ยังไม่ได้ค้นหา */}
        {!submitted && (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
            <Search className="w-16 h-16 text-gray-200 mb-4" />
            <p className="text-lg font-medium text-gray-500">ค้นหาวิชาที่ต้องการครับ</p>
            <p className="text-sm mt-1">รหัสวิชา, ชื่อวิชา หรือชื่ออาจารย์</p>

            {/* ประวัติล่าสุด */}
            {searchHistory.length > 0 && (
              <div className="mt-8 w-full max-w-sm">
                <p className="text-xs text-gray-400 font-semibold mb-2 flex items-center gap-1">
                  <History className="w-3 h-3" /> ค้นหาล่าสุด
                </p>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.slice(0, 6).map((h) => (
                    <button
                      key={h}
                      onClick={() => handleHistoryClick(h)}
                      className="flex items-center gap-1.5 text-sm bg-white border border-gray-200 hover:border-red-500 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors text-gray-700"
                    >
                      <History className="w-3 h-3 text-gray-300" />
                      {h}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeSearchHistory(h); }}
                        className="text-gray-300 hover:text-red-400 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ไม่พบผลลัพธ์ */}
        {submitted && results.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
            <Info className="w-16 h-16 text-gray-200 mb-4" />
            <p className="text-lg font-medium text-gray-500">ไม่พบวิชาที่ค้นหาครับ</p>
            <p className="text-sm mt-1">
              ลองค้นหาด้วย "{submitted}" ใหม่อีกครั้งนะครับ
            </p>
          </div>
        )}

        {/* ผลลัพธ์ */}
        {submitted && results.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              พบ <span className="font-bold text-gray-700">{results.length}</span> วิชา
              จากคำค้นหา "<span className="font-bold text-red-500">{submitted}</span>"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((course) => (
                <CourseCard
                  key={course.code}
                  course={course}
                  onAddCourse={handleAddCourse}
                  addedSections={courses}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
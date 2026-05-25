import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, GraduationCap, BookOpen, Hash, Star, Info,
  Plus, CheckCircle2, ChevronRight, AlertCircle,
  Clock, MapPin, User, X, Search, ChevronDown, ChevronUp,
} from 'lucide-react';
import { MAJORS, CURRICULUM_DATA, SEMESTER_OPTIONS } from '../mock/curriculum';
import { MOCK_COURSES } from '../mock/index';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** normalize รหัสวิชา: ตัดช่องว่าง + ตัด *, / ออก เพื่อ lookup */
const norm     = (code) => (code ?? '').replace(/\s/g, '').trim();
const normKey  = (code) => norm(code).replace(/[*/]/g, '');

/**
 * lookup วิชาใน MOCK_COURSES
 * รองรับ code แบบ "0300 110/120*" — ลอง exact ก่อน แล้วลอง prefix แรก
 */
const findMockCourse = (code) => {
  if (!code || code === '—') return null;
  const key = normKey(code);
  // exact match
  let found = MOCK_COURSES.find((c) => normKey(c.code) === key);
  if (found) return found;
  // ถ้า code มี "/" ลอง prefix แรก
  const slash = key.indexOf('/');
  if (slash !== -1) {
    const prefix = key.slice(0, slash);
    found = MOCK_COURSES.find((c) => normKey(c.code) === prefix);
    if (found) return found;
    // หรือ suffix หลัง /
    const suffix = key.slice(slash + 1);
    found = MOCK_COURSES.find((c) => normKey(c.code) === suffix);
  }
  return found || null;
};

const SEM_SHORT = {
  '1-1': 'ป.1 ต้น', '1-2': 'ป.1 ปลาย',
  '2-1': 'ป.2 ต้น', '2-2': 'ป.2 ปลาย',
  '3-1': 'ป.3 ต้น', '3-2': 'ป.3 ปลาย',
  '3-s': 'ป.3 ซัมฯ',
  '4-1': 'ป.4 ต้น', '4-2': 'ป.4 ปลาย',
};

const DAY_LABEL = {
  mon: 'จันทร์', tue: 'อังคาร', wed: 'พุธ',
  thu: 'พฤหัสบดี', fri: 'ศุกร์', sat: 'เสาร์', sun: 'อาทิตย์',
};
const DAY_COLOR = {
  mon: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  tue: 'bg-pink-100 text-pink-800 border-pink-300',
  wed: 'bg-green-100 text-green-800 border-green-300',
  thu: 'bg-orange-100 text-orange-800 border-orange-300',
  fri: 'bg-blue-100 text-blue-800 border-blue-300',
  sat: 'bg-purple-100 text-purple-800 border-purple-300',
  sun: 'bg-red-100 text-red-800 border-red-300',
};

// ─────────────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5
      bg-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl
      border border-white/10 pointer-events-none"
      style={{ animation: 'fadeInUp .25s ease' }}>
      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
      {msg}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SectionList — แสดง section ของวิชาที่กำหนด + ปุ่ม confirm
// ─────────────────────────────────────────────────────────────
function SectionList({ mockCourse, courses, onAdd, onClose }) {
  const [selected, setSelected] = useState(null);
  const sections = mockCourse?.sections ?? [];

  const isAdded = (sec) =>
    courses.some(
      (a) => normKey(a.code) === normKey(mockCourse.code) &&
             String(a.sec) === String(sec.sec),
    );

  if (sections.length === 0) {
    return (
      <div className="flex items-center justify-between gap-3 px-4 py-3
        bg-gray-50 border border-dashed border-gray-300 rounded-xl mt-2">
        <p className="text-xs text-gray-400 italic">ยังไม่มีข้อมูล Section ในระบบสำหรับวิชานี้ครับ</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
      </div>
    );
  }

  return (
    <div className="mt-2 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800 text-white">
        <p className="text-xs font-bold">
          เลือก Section — <span className="font-mono text-yellow-300">{mockCourse.code}</span>
          {' '}<span className="text-gray-400">({sections.length} กลุ่ม)</span>
        </p>
        <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
      </div>

      {/* list */}
      <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
        {sections.map((sec) => {
          const added  = isAdded(sec);
          const isSel  = selected?.sec === sec.sec;
          const dayCol = DAY_COLOR[sec.day] || 'bg-gray-100 text-gray-600 border-gray-200';
          return (
            <button key={sec.sec} disabled={added}
              onClick={() => !added && setSelected(isSel ? null : sec)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors
                ${added     ? 'opacity-50 cursor-not-allowed bg-gray-50'
                  : isSel   ? 'bg-yellow-50'
                  : 'hover:bg-gray-50'}`}>
              <span className={`shrink-0 mt-0.5 text-[11px] font-black px-2 py-0.5 rounded-lg border
                ${isSel ? 'bg-yellow-400 text-gray-900 border-yellow-400'
                        : 'bg-white text-gray-700 border-gray-300'}`}>
                Sec {sec.sec}
              </span>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  {sec.day && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${dayCol}`}>
                      {DAY_LABEL[sec.day] || sec.day}
                    </span>
                  )}
                  {added && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">✓ เพิ่มแล้ว</span>}
                  {isSel && !added && <span className="text-[10px] bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">✓ เลือกแล้ว</span>}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  {sec.startTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />{sec.startTime}–{sec.endTime}
                    </span>
                  )}
                  {sec.room && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{sec.room}
                    </span>
                  )}
                </div>
                {sec.instructor && sec.instructor !== '-' && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <User className="w-3 h-3 shrink-0" />
                    <span className="truncate">{sec.instructor}</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* confirm */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <button
          onClick={() => { if (selected) { onAdd(selected); setSelected(null); } }}
          disabled={!selected}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
            text-sm font-black transition-all active:scale-95
            ${selected
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          <Plus className="w-4 h-4" />
          {selected ? `เพิ่ม Sec ${selected.sec} เข้าตาราง` : 'เลือก Section ก่อนครับ'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SectionPicker — wrapper เดิม ใช้ findMockCourse ที่ fix แล้ว
// ─────────────────────────────────────────────────────────────
function SectionPicker({ courseCode, courses, onAdd, onClose }) {
  const mockCourse = useMemo(() => findMockCourse(courseCode), [courseCode]);

  if (!mockCourse) {
    return (
      <div className="flex items-center justify-between gap-3 px-4 py-3
        bg-gray-50 border border-dashed border-gray-300 rounded-xl mt-2">
        <p className="text-xs text-gray-400 italic">ยังไม่มีข้อมูล Section ในระบบสำหรับวิชานี้ครับ</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
      </div>
    );
  }

  return (
    <SectionList
      mockCourse={mockCourse}
      courses={courses}
      onAdd={onAdd}
      onClose={onClose}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// ElectivePicker — เลือกวิชาเลือก (isElective)
// ขั้นตอน: เลือก category → ค้นหา/เลือกวิชา → เลือก Section
// ─────────────────────────────────────────────────────────────

// จัด MOCK_COURSES ตาม category
const GROUPED_COURSES = (() => {
  const map = {};
  MOCK_COURSES.forEach((c) => {
    const cat = c.category || 'อื่นๆ';
    if (!map[cat]) map[cat] = [];
    map[cat].push(c);
  });
  return map;
})();

const ALL_CATEGORIES = Object.keys(GROUPED_COURSES).sort((a, b) =>
  a.localeCompare(b, 'th'),
);

// แยก category ศึกษาทั่วไปออกมาก่อน เพราะมักเลือกบ่อย
const GE_CATS   = ALL_CATEGORIES.filter((c) => c.startsWith('ศึกษาทั่วไป'));
const OTHER_CATS = ALL_CATEGORIES.filter((c) => !c.startsWith('ศึกษาทั่วไป'));
const SORTED_CATS = [...GE_CATS, ...OTHER_CATS];

function ElectivePicker({ label, courses, onAdd, onClose, showToast }) {
  const [step, setStep]           = useState('category'); // 'category' | 'course' | 'section'
  const [selCat, setSelCat]       = useState('');
  const [selCourse, setSelCourse] = useState(null);
  const [query, setQuery]         = useState('');

  const coursesInCat = useMemo(() => {
    if (!selCat) return [];
    const list = GROUPED_COURSES[selCat] || [];
    const q    = query.toLowerCase().trim();
    if (!q) return list;
    return list.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.sections.some((s) => s.instructor?.toLowerCase().includes(q)),
    );
  }, [selCat, query]);

  const handleAdd = (mockCourse, sec) => {
    onAdd({
      mockCourse,
      sec,
      label,
    });
    // ไม่ปิด picker ทันที — ให้ผู้ใช้เลือกต่อได้
    setStep('course');
    setSelCourse(null);
  };

  return (
    <div className="mt-2 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md">

      {/* ─── header ─────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-purple-700 text-white">
        <div className="flex items-center gap-2 text-xs font-bold">
          <Star className="w-3.5 h-3.5 text-purple-200" />
          <span>เลือก{label}</span>
          {step !== 'category' && (
            <>
              <ChevronRight className="w-3 h-3 text-purple-300" />
              <span className="text-purple-200">{selCat}</span>
            </>
          )}
          {step === 'section' && selCourse && (
            <>
              <ChevronRight className="w-3 h-3 text-purple-300" />
              <span className="text-purple-200 font-mono">{selCourse.code}</span>
            </>
          )}
        </div>
        <button onClick={onClose} className="text-purple-300 hover:text-white"><X className="w-4 h-4" /></button>
      </div>

      {/* ─── step 1: เลือก category ─────────── */}
      {step === 'category' && (
        <div className="p-4 space-y-2">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            เลือกหมวดวิชา
          </p>
          {SORTED_CATS.map((cat) => (
            <button key={cat}
              onClick={() => { setSelCat(cat); setQuery(''); setStep('course'); }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl
                border border-gray-200 hover:border-purple-300 hover:bg-purple-50
                text-left transition-colors group">
              <div>
                <p className="text-sm font-bold text-gray-800 group-hover:text-purple-700">
                  {cat}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {GROUPED_COURSES[cat]?.length || 0} วิชา
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-400" />
            </button>
          ))}
        </div>
      )}

      {/* ─── step 2: เลือกวิชา ──────────────── */}
      {step === 'course' && (
        <div className="flex flex-col" style={{ maxHeight: 420 }}>
          {/* back + search */}
          <div className="px-4 pt-3 pb-2 border-b border-gray-100 shrink-0">
            <button
              onClick={() => { setStep('category'); setQuery(''); setSelCourse(null); }}
              className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-bold mb-2">
              ← กลับ
            </button>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหารหัสวิชา ชื่อวิชา หรืออาจารย์..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-800
                  placeholder-gray-400 pl-8 pr-8 py-2 rounded-xl text-xs
                  focus:outline-none focus:border-purple-400 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              {query && (
                <button onClick={() => setQuery('')}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-1">พบ {coursesInCat.length} วิชา</p>
          </div>

          {/* list */}
          <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
            {coursesInCat.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-10">ไม่พบวิชาครับ</p>
            ) : (
              coursesInCat.map((course) => {
                const alreadyAdded = courses.some(
                  (a) => normKey(a.code) === normKey(course.code),
                );
                const isSel = selCourse?.code === course.code;
                return (
                  <button key={course.code}
                    onClick={() => { setSelCourse(course); setStep('section'); }}
                    className={`w-full text-left px-4 py-3 flex items-start justify-between gap-3 transition-colors
                      ${isSel ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-mono text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                          {course.code}
                        </span>
                        <span className="text-[10px] bg-gray-700 text-white px-1.5 py-0.5 rounded-full font-bold">
                          {course.credits} หน่วยกิต
                        </span>
                        {alreadyAdded && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                            ✓ ในตาราง
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-gray-800 leading-snug">{course.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{course.sections.length} กลุ่มเรียน</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 mt-1" />
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─── step 3: เลือก section ──────────── */}
      {step === 'section' && selCourse && (
        <div className="flex flex-col" style={{ maxHeight: 460 }}>
          {/* back */}
          <div className="px-4 pt-3 pb-2 border-b border-gray-100 shrink-0">
            <button
              onClick={() => { setStep('course'); setSelCourse(null); }}
              className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-bold">
              ← กลับ
            </button>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {selCourse.code}
              </span>
              <span className="text-sm font-bold text-gray-800">{selCourse.name}</span>
            </div>
          </div>

          {/* reuse SectionList */}
          <div className="p-3">
            <SectionList
              mockCourse={selCourse}
              courses={courses}
              onAdd={(sec) => handleAdd(selCourse, sec)}
              onClose={onClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CourseRow — แถววิชาเดียว (ทั้ง required และ elective)
// ─────────────────────────────────────────────────────────────
function CourseRow({ course, courses, addCourse, showToast, accentClass }) {
  const isElec = !!course.isElective;
  const [open, setOpen] = useState(false);

  // วิชาบังคับ: sec ที่เพิ่มแล้ว
  const addedSecs = courses.filter(
    (c) => normKey(c.code) === normKey(course.code),
  );
  const hasAny = addedSecs.length > 0;

  // วิชาบังคับ — เพิ่ม sec
  const handleAddRequired = (sec) => {
    const mockCourse = findMockCourse(course.code);
    addCourse({
      code:       mockCourse?.code ?? course.code,
      name:       course.name,
      credits:    course.credits,
      day:        sec.day,
      startTime:  sec.startTime,
      endTime:    sec.endTime,
      room:       sec.room,
      instructor: sec.instructor,
      sec:        sec.sec,
      status:     sec.status,
      category:   sec.category || '',
    });
    showToast(`เพิ่ม ${course.code} Sec ${sec.sec} แล้ว!`);
    setOpen(false);
  };

  // วิชาเลือก — เพิ่ม sec
  const handleAddElective = ({ mockCourse, sec }) => {
    addCourse({
      code:       mockCourse.code,
      name:       mockCourse.name,
      credits:    mockCourse.credits,
      day:        sec.day,
      startTime:  sec.startTime,
      endTime:    sec.endTime,
      room:       sec.room,
      instructor: sec.instructor,
      sec:        sec.sec,
      status:     sec.status,
      category:   mockCourse.category || '',
    });
    showToast(`เพิ่ม ${mockCourse.code} Sec ${sec.sec} แล้ว!`);
  };

  // วิชาเลือกที่เพิ่มแล้ว (ไม่มี fixed code — ดูจาก slot แต่ show ทุกตัวที่เป็น elective)
  // ใช้ key เดิมที่ parent ส่งมา (index-based) เพื่อ track ไม่ได้ — แค่แสดง badge ทั่วไป
  const elecAdded = isElec
    ? courses.filter((c) => {
        // หา mock course ที่ตรงกับ category ที่เหมาะสม ตาม label
        const cat = c.category || '';
        const lbl = (course.name || '').toLowerCase();
        if (lbl.includes('ศึกษาทั่วไป') || lbl.includes('general')) {
          return cat.startsWith('ศึกษาทั่วไป');
        }
        return true; // เลือกสาขา / เสรี
      })
    : [];

  return (
    <div className={`rounded-2xl border transition-all
      ${isElec ? 'bg-purple-50/70 border-purple-200' : 'bg-white border-gray-200 hover:shadow-sm'}`}>

      {/* แถวหลัก */}
      <div className="flex items-start gap-3 px-4 py-3.5">
        {/* icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5
          ${isElec ? 'bg-purple-100 text-purple-500' : accentClass}`}>
          {isElec ? <Star className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
        </div>

        {/* info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800 leading-snug">{course.name}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {course.code !== '—' && (
              <span className="font-mono text-[11px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                {course.code}
              </span>
            )}
            <span className="text-[11px] font-bold bg-gray-700 text-white px-2 py-0.5 rounded-full">
              {course.credits} หน่วยกิต
            </span>
            {isElec && (
              <span className="text-[10px] font-semibold bg-purple-100 text-purple-600
                px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-2.5 h-2.5" /> เลือก
              </span>
            )}
            {course.note && !isElec && (
              <span className="text-[10px] font-medium bg-amber-100 text-amber-700
                px-2 py-0.5 rounded-full flex items-center gap-1">
                <Info className="w-2.5 h-2.5" /> {course.note}
              </span>
            )}
            {/* sec ที่เพิ่มแล้ว (วิชาบังคับ) */}
            {!isElec && addedSecs.map((a, i) => (
              <span key={i}
                className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                ✓ Sec {a.sec}
              </span>
            ))}
          </div>
        </div>

        {/* ปุ่มเพิ่ม */}
        <button
          onClick={() => setOpen((v) => !v)}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold
            transition-all self-start mt-0.5 active:scale-95
            ${open
              ? 'bg-gray-200 text-gray-700'
              : isElec
                ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-sm'
                : hasAny
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-sm'
                  : 'bg-red-500 hover:bg-red-600 text-white shadow-sm'}`}>
          {open
            ? <><X className="w-3.5 h-3.5" /> ปิด</>
            : isElec
              ? <><Plus className="w-3.5 h-3.5" /> เลือกวิชา</>
              : hasAny
                ? <><Plus className="w-3.5 h-3.5" /> เพิ่ม Sec อีก</>
                : <><Plus className="w-3.5 h-3.5" /> เพิ่ม</>}
        </button>
      </div>

      {/* Picker */}
      {open && (
        <div className="px-4 pb-4">
          {isElec ? (
            <ElectivePicker
              label={course.name}
              courses={courses}
              onAdd={handleAddElective}
              onClose={() => setOpen(false)}
              showToast={showToast}
            />
          ) : (
            <SectionPicker
              courseCode={course.code}
              courses={courses}
              onAdd={handleAddRequired}
              onClose={() => setOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CurriculumPage — หน้าหลัก
// ─────────────────────────────────────────────────────────────
export default function CurriculumPage({ courses = [], addCourse }) {
  const navigate = useNavigate();
  const [selectedMajorId, setSelectedMajorId] = useState('');
  const [selectedSem,     setSelectedSem]     = useState('');
  const [toast,           setToast]           = useState('');

  const major   = MAJORS.find((m) => m.id === selectedMajorId);
  const semData = useMemo(() => {
    if (!selectedMajorId || !selectedSem) return null;
    return CURRICULUM_DATA[selectedMajorId]?.[selectedSem] ?? null;
  }, [selectedMajorId, selectedSem]);

  const totalCredits = semData
    ? semData.courses.reduce((s, c) => s + (c.credits || 0), 0)
    : 0;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-gray-900 text-white shadow-xl">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate('/schedule')}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20
                px-3 py-2 rounded-xl text-sm font-bold transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">กลับ</span>
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <GraduationCap className="w-5 h-5 text-yellow-400 shrink-0" />
              <h1 className="font-black text-sm sm:text-base tracking-tight truncate">
                วิชาแนะนำตามหลักสูตร
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-gray-400 text-xs hidden md:block">หลักสูตร 2565</span>
            {courses.length > 0 && (
              <button onClick={() => navigate('/schedule')}
                className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300
                  text-gray-900 px-3 py-1.5 rounded-xl text-xs font-black transition-colors">
                <BookOpen className="w-3.5 h-3.5" />
                {courses.length} วิชา
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6 pb-28">

        {/* ── ① เลือกสาขา ──────────────────────────────────── */}
        <section>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
            ① เลือกสาขาวิชา
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {MAJORS.map((m) => {
              const active = selectedMajorId === m.id;
              return (
                <button key={m.id}
                  onClick={() => { setSelectedMajorId(m.id); setSelectedSem(''); }}
                  className={`relative text-left p-4 rounded-2xl border-2 transition-all
                    active:scale-[0.97] focus:outline-none
                    ${active
                      ? `${m.accentClass} border-transparent shadow-lg`
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'}`}>
                  {active && (
                    <CheckCircle2 className="w-4 h-4 absolute top-2.5 right-2.5 text-white/70" />
                  )}
                  <span className="text-2xl mb-2 block">{m.emoji}</span>
                  <p className={`font-black text-sm leading-tight
                    ${active ? 'text-white' : 'text-gray-800'}`}>{m.name}</p>
                  <p className={`text-[10px] mt-1 leading-snug hidden sm:block
                    ${active ? 'text-white/70' : 'text-gray-400'}`}>{m.nameEn}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── ② เลือกเทอม ──────────────────────────────────── */}
        <section className={`transition-all duration-200
          ${selectedMajorId ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
            ② เลือกชั้นปีและเทอม
          </p>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {SEMESTER_OPTIONS.map((s) => {
                const available = !!(selectedMajorId && CURRICULUM_DATA[selectedMajorId]?.[s.key]);
                const active    = selectedSem === s.key;
                return (
                  <button key={s.key}
                    onClick={() => available && setSelectedSem(s.key)}
                    disabled={!available}
                    className={`py-2 px-1.5 rounded-xl border text-[11px] font-bold
                      transition-all text-center leading-tight
                      ${active
                        ? major
                          ? `${major.accentClass} border-transparent shadow-sm`
                          : 'bg-red-500 text-white border-transparent'
                        : available
                          ? 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                          : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'}`}>
                    <span className="sm:hidden">{SEM_SHORT[s.key]}</span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── ③ รายวิชา ─────────────────────────────────────── */}
        {semData && major && (
          <section>
            {/* หัว */}
            <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
              <div>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  ③ รายวิชาที่แนะนำ
                </p>
                <h2 className="text-base font-black text-gray-800 mt-0.5
                  flex items-center gap-2 flex-wrap">
                  <span>{major.emoji}</span>
                  <span>{major.name}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-500 font-bold text-sm">{semData.label}</span>
                </h2>
              </div>
              <div className="flex gap-2">
                <span className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded-full font-bold">
                  {semData.courses.length} วิชา
                </span>
                <span className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-full font-bold">
                  ~{totalCredits} หน่วยกิต
                </span>
              </div>
            </div>

            {/* info */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4
              flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                กดปุ่ม <span className="font-bold text-red-600">"เพิ่ม"</span> สำหรับวิชาบังคับ
                หรือ <span className="font-bold text-purple-600">"เลือกวิชา"</span> สำหรับวิชาเลือก/ศึกษาทั่วไป
                ระบบจะแสดง Section ให้เลือกพร้อมวัน/เวลา/ห้อง/อาจารย์ได้เลยครับ
              </p>
            </div>

            {/* legend */}
            <div className="flex gap-2 flex-wrap mb-4">
              <span className="flex items-center gap-1.5 text-xs text-gray-500
                bg-white border border-gray-200 px-2.5 py-1 rounded-full">
                <Hash className="w-3 h-3" /> วิชาบังคับ — กดเพิ่ม → เลือก Sec
              </span>
              <span className="flex items-center gap-1.5 text-xs text-purple-600
                bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
                <Star className="w-3 h-3" /> วิชาเลือก — กดเลือกวิชา → เลือก Sec
              </span>
            </div>

            {/* รายการ */}
            <div className="space-y-2">
              {semData.courses.map((course, i) => (
                <CourseRow
                  key={`${course.code}-${i}`}
                  course={course}
                  courses={courses}
                  addCourse={addCourse}
                  showToast={showToast}
                  accentClass={major.accentClass}
                />
              ))}
            </div>

            {/* สรุป */}
            <div className="mt-6 bg-gray-800 text-white rounded-2xl px-5 py-4
              flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">รวมโดยประมาณ</p>
                <p className="text-2xl font-black">
                  {totalCredits}
                  <span className="text-sm font-normal text-gray-400 ml-1">หน่วยกิต</span>
                </p>
              </div>
              <button onClick={() => navigate('/schedule')}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300
                  text-gray-900 font-black px-5 py-2.5 rounded-xl text-sm
                  transition-all active:scale-95 shadow-md">
                <BookOpen className="w-4 h-4" />
                ดูตารางเรียน
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* ── Empty states ─────────────────────────────────── */}
        {!selectedMajorId && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎓</div>
            <p className="text-base font-bold text-gray-600">เลือกสาขาวิชาก่อนเลยครับ</p>
            <p className="text-sm text-gray-400 mt-1">ระบบจะแสดงวิชาแนะนำตามหลักสูตร 2565</p>
          </div>
        )}
        {selectedMajorId && !selectedSem && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-sm font-bold text-gray-500">
              เลือกชั้นปีและเทอมด้านบนเพื่อดูวิชาครับ
            </p>
          </div>
        )}
      </main>

      <Toast msg={toast} />

      <style>{`
        @keyframes fadeInUp {
          from { opacity:0; transform:translate(-50%,12px); }
          to   { opacity:1; transform:translate(-50%,0); }
        }
      `}</style>
    </div>
  );
}
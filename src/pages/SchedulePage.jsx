import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, BookOpen, GraduationCap, Trash2, X, Save, BookMarked,
  Calendar, Clock, ChevronDown, ChevronUp, Download, FileText,
  MapPin, User, SlidersHorizontal, AlertTriangle, Share2,
  Moon, Sun, Copy, Check, BookCheck,
} from 'lucide-react';

// ==========================================
// Constants
// ==========================================
const HOUR_START = 7;
const HOUR_END   = 22;
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);

const DAYS_DISPLAY = [
  { key: 'mon', label: 'จันทร์'    },
  { key: 'tue', label: 'อังคาร'    },
  { key: 'wed', label: 'พุธ'       },
  { key: 'thu', label: 'พฤหัสบดี' },
  { key: 'fri', label: 'ศุกร์'     },
  { key: 'sat', label: 'เสาร์'     },
  { key: 'sun', label: 'อาทิตย์'  },
];

const COLOR_PALETTE = [
  '#fbbf24','#34d399','#60a5fa','#f87171',
  '#a78bfa','#fb923c','#2dd4bf','#e879f9',
  '#a3e635','#94a3b8',
];

function parseTime(t) {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  return h + m / 60;
}

function getDayLabel(key) {
  return DAYS_DISPLAY.find((d) => d.key === key)?.label || key || '';
}

// ==========================================
// Conflict Detection
// ==========================================
function detectConflicts(courses) {
  const conflicts = [];
  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      const a = courses[i];
      const b = courses[j];
      if (a.day !== b.day || !a.day) continue;
      const aS = parseTime(a.startTime), aE = parseTime(a.endTime);
      const bS = parseTime(b.startTime), bE = parseTime(b.endTime);
      if (!aS || !aE || !bS || !bE) continue;
      if (aS < bE && aE > bS) {
        conflicts.push({ a, b });
      }
    }
  }
  return conflicts;
}

// ==========================================
// ColorDot
// ==========================================
function ColorDot({ code, color, onChange, dark }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} title="เปลี่ยนสี"
        className="w-4 h-4 rounded-full border-2 border-white/70 shadow hover:scale-110 transition-transform shrink-0"
        style={{ background: color }} />
      {open && (
        <div className={`absolute z-50 border rounded-xl shadow-xl p-2 top-6 left-0 w-36
          ${dark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
          <div className="grid grid-cols-5 gap-1 mb-1.5">
            {COLOR_PALETTE.map((c) => (
              <button key={c} onClick={() => { onChange(code, c); setOpen(false); }}
                className="w-5 h-5 rounded-full border-2 hover:scale-110 transition-transform"
                style={{ background: c, borderColor: color === c ? '#111' : 'transparent' }} />
            ))}
          </div>
          <button onClick={() => setOpen(false)}
            className={`text-[10px] w-full text-center ${dark ? 'text-gray-400' : 'text-gray-400'}`}>
            ปิด
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ConflictBanner
// ==========================================
function ConflictBanner({ conflicts, dark }) {
  const [open, setOpen] = useState(true);
  if (conflicts.length === 0) return null;
  return (
    <div className={`rounded-2xl border overflow-hidden shadow-sm
      ${dark ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'}`}>
      <button onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3">
        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
        <span className={`font-bold text-sm flex-1 text-left ${dark ? 'text-red-300' : 'text-red-700'}`}>
          ⚠️ พบวิชาเวลาชนกัน {conflicts.length} คู่
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-red-400" /> : <ChevronDown className="w-4 h-4 text-red-400" />}
      </button>
      {open && (
        <div className="px-4 pb-3 space-y-2">
          {conflicts.map((c, i) => (
            <div key={i} className={`rounded-xl px-3 py-2 text-xs
              ${dark ? 'bg-red-900/40 text-red-200' : 'bg-red-100 text-red-800'}`}>
              <span className="font-bold">{c.a.code} Sec {c.a.sec}</span>
              <span className="mx-1">กับ</span>
              <span className="font-bold">{c.b.code} Sec {c.b.sec}</span>
              <span className="ml-1 opacity-70">
                — วัน{getDayLabel(c.a.day)} {c.a.startTime}–{c.a.endTime}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// CreditSummary
// ==========================================
function CreditSummary({ courses, dark }) {
  const total = useMemo(() =>
    courses.reduce((sum, c) => {
      const n = parseInt((c.credits || '0').toString());
      return sum + (isNaN(n) ? 0 : n);
    }, 0), [courses]);

  if (courses.length === 0) return null;
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold
      ${dark ? 'bg-gray-700 text-gray-200' : 'bg-white border border-gray-200 text-gray-700 shadow-sm'}`}>
      <BookCheck className="w-4 h-4 text-yellow-500" />
      {total} หน่วยกิต
    </div>
  );
}

// ==========================================
// ShareButton
// ==========================================
function ShareButton({ courses, scheduleName }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const link = useMemo(() => {
    if (courses.length === 0) return '';
    const payload = { n: scheduleName, c: courses.map((c) => ({
      code: c.code, name: c.name, credits: c.credits, sec: c.sec,
      day: c.day, startTime: c.startTime, endTime: c.endTime,
      room: c.room, instructor: c.instructor, category: c.category,
    })) };
    const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
    return `${window.location.origin}/schedule?s=${encoded}`;
  }, [courses, scheduleName]);

  const copy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (courses.length === 0) return null;
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">
        <Share2 className="w-4 h-4" /> แชร์
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-80">
          <p className="text-sm font-bold text-gray-800 mb-2">แชร์ตารางเรียน</p>
          <p className="text-xs text-gray-500 mb-2">คัดลอก link นี้เพื่อแชร์ให้เพื่อนดูตารางครับ</p>
          <div className="flex gap-2">
            <input readOnly value={link}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-600 truncate" />
            <button onClick={copy}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors
                ${copied ? 'bg-green-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
              {copied ? <><Check className="w-3.5 h-3.5" /> คัดลอกแล้ว!</> : <><Copy className="w-3.5 h-3.5" /> คัดลอก</>}
            </button>
          </div>
          <button onClick={() => setOpen(false)} className="mt-3 text-xs text-gray-400 hover:text-gray-600 w-full text-center">ปิด</button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ScheduleGrid — วันซ้าย เวลาบน
// ==========================================
function ScheduleGrid({ courses, courseColors, onRemoveCourse, onColorChange, cellW, rowH, conflicts, dark }) {
  const LABEL_W = 76;
  const conflictIds = new Set(conflicts.flatMap((c) => [c.a.id, c.b.id]));

  const byDay = {};
  DAYS_DISPLAY.forEach((d) => { byDay[d.key] = []; });
  courses.forEach((c) => { if (c.day && byDay[c.day]) byDay[c.day].push(c); });

  const coreDays  = DAYS_DISPLAY.slice(0, 5);
  const extraDays = DAYS_DISPLAY.slice(5).filter((d) => byDay[d.key].length > 0);
  const displayDays = [...coreDays, ...extraDays];

  return (
    <div className={`border rounded-2xl overflow-hidden shadow-sm ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="overflow-x-auto">
        <div style={{ minWidth: LABEL_W + HOURS.length * cellW }}>
          {/* Header เวลา */}
          <div className="flex bg-gray-900 text-white sticky top-0 z-10" style={{ paddingLeft: LABEL_W }}>
            {HOURS.map((h) => (
              <div key={h} className="shrink-0 border-l border-white/10 py-2 pl-1.5 font-mono text-[10px]"
                style={{ width: cellW }}>
                {h}:00
              </div>
            ))}
          </div>
          {/* Rows */}
          {displayDays.map((day) => (
            <div key={day.key} className={`flex border-t ${dark ? 'border-gray-700' : 'border-gray-100'}`} style={{ height: rowH }}>
              <div className={`shrink-0 flex items-center justify-center border-r text-xs font-bold
                ${dark ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                style={{ width: LABEL_W }}>
                {day.label}
              </div>
              <div className="relative" style={{ width: HOURS.length * cellW }}>
                {HOURS.map((h) => (
                  <div key={h} className={`absolute top-0 bottom-0 border-l ${dark ? 'border-gray-700' : 'border-gray-100'}`}
                    style={{ left: (h - HOUR_START) * cellW }} />
                ))}
                {byDay[day.key].map((course) => {
                  const s = parseTime(course.startTime);
                  const e = parseTime(course.endTime);
                  if (!s || !e) return null;
                  const left  = (s - HOUR_START) * cellW + 2;
                  const width = (e - s) * cellW - 4;
                  const color = courseColors[course.code] || '#fbbf24';
                  const hasConflict = conflictIds.has(course.id);
                  return (
                    <div key={course.id}
                      className="absolute top-1 bottom-1 rounded-lg overflow-hidden group cursor-default flex flex-col justify-start px-1.5 pt-1"
                      style={{
                        left, width, background: color,
                        outline: hasConflict ? '2px solid #ef4444' : 'none',
                        outlineOffset: '-1px',
                      }}>
                      {hasConflict && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500/60" />
                      )}
                      <button onClick={() => onRemoveCourse(course.id)}
                        className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 bg-black/20 hover:bg-red-500/70 rounded p-0.5 transition-opacity">
                        <X className="w-2.5 h-2.5 text-white" />
                      </button>
                      <div className="absolute bottom-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ColorDot code={course.code} color={color} onChange={onColorChange} dark={dark} />
                      </div>
                      <p className="text-[10px] font-black text-gray-900 leading-tight truncate">{course.code}</p>
                      {rowH > 36 && <p className="text-[9px] text-gray-700 leading-tight line-clamp-1">{course.name}</p>}
                      {rowH > 52 && course.room && <p className="text-[9px] text-gray-600">📍{course.room}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CourseCard
// ==========================================
function CourseCard({ course, color, onRemove, onColorChange, hasConflict, dark }) {
  return (
    <div className={`border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow
      ${hasConflict
        ? (dark ? 'border-red-600 bg-gray-800' : 'border-red-300 bg-red-50/40')
        : (dark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white')}`}>
      <div className="h-1.5 w-full" style={{ background: hasConflict ? '#ef4444' : color }} />
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs font-bold" style={{ color }}>
            {course.code}
          </span>
          {course.sec && (
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>
              Sec {course.sec}
            </span>
          )}
          {course.credits && (
            <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-400'}`}>{course.credits} หน่วยกิต</span>
          )}
          {hasConflict && (
            <span className="flex items-center gap-0.5 text-[10px] text-red-500 font-bold ml-1">
              <AlertTriangle className="w-3 h-3" /> เวลาชน
            </span>
          )}
          <div className="ml-auto">
            <ColorDot code={course.code} color={color} onChange={onColorChange} dark={dark} />
          </div>
        </div>
        <p className={`text-sm font-bold leading-snug mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
          {course.name}
        </p>
        <div className={`flex flex-wrap gap-x-3 gap-y-1 text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          {course.day && (
            <span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              วัน{getDayLabel(course.day)}
            </span>
          )}
          {course.startTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />{course.startTime}–{course.endTime}
            </span>
          )}
          {course.room && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />{course.room}
            </span>
          )}
        </div>
        {course.instructor && course.instructor !== '-' && (
          <div className={`flex items-start gap-1 mt-1.5 text-xs ${dark ? 'text-gray-400' : 'text-gray-400'}`}>
            <User className="w-3 h-3 mt-0.5 shrink-0" />
            <span className="line-clamp-1">{course.instructor}</span>
          </div>
        )}
        <div className="flex justify-end mt-2">
          <button onClick={() => onRemove(course.id)}
            className="flex items-center gap-1 text-[11px] text-gray-300 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> ลบออก
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CourseList
// ==========================================
function CourseList({ courses, courseColors, onRemoveCourse, onColorChange, clearCourses, conflicts, dark }) {
  const [query, setQuery] = useState('');
  const conflictIds = new Set(conflicts.flatMap((c) => [c.a.id, c.b.id]));

  const filtered = useMemo(() => {
    if (!query.trim()) return courses;
    const q = query.toLowerCase();
    return courses.filter((c) =>
      c.code?.toLowerCase().includes(q) ||
      c.name?.toLowerCase().includes(q) ||
      c.instructor?.toLowerCase().includes(q) ||
      c.room?.toLowerCase().includes(q)
    );
  }, [courses, query]);

  if (courses.length === 0) return null;

  return (
    <div className={`border rounded-2xl overflow-hidden shadow-sm ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="bg-gray-900 text-white px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">รายวิชาที่เลือก ({courses.length} วิชา)</span>
          <button onClick={clearCourses}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
            <Trash2 className="w-3.5 h-3.5" /> ล้างทั้งหมด
          </button>
        </div>
        <div className="relative">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาในรายวิชาที่เลือก..."
            className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 pl-8 pr-8 py-1.5 rounded-lg text-xs focus:outline-none focus:border-yellow-400" />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-2.5 top-2 text-gray-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {query && <p className="text-[10px] text-gray-400">พบ {filtered.length} / {courses.length} วิชา</p>}
      </div>
      <div className="p-4">
        {filtered.length === 0 ? (
          <p className={`text-center text-sm py-6 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>ไม่พบวิชาที่ค้นหาครับ</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((c) => (
              <CourseCard key={c.id} course={c}
                color={courseColors[c.code] || '#fbbf24'}
                onRemove={onRemoveCourse} onColorChange={onColorChange}
                hasConflict={conflictIds.has(c.id)} dark={dark} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// ExportView
// ==========================================
function ExportView({ courses, courseColors, scheduleName, forwardRef }) {
  const CELL_W = 100; const ROW_H = 70; const LABEL_W = 90;
  const byDay = {};
  DAYS_DISPLAY.forEach((d) => { byDay[d.key] = []; });
  courses.forEach((c) => { if (c.day && byDay[c.day]) byDay[c.day].push(c); });
  const coreDays = DAYS_DISPLAY.slice(0, 5);
  const extraDays = DAYS_DISPLAY.slice(5).filter((d) => byDay[d.key].length > 0);
  const displayDays = [...coreDays, ...extraDays];
  const totalW = LABEL_W + HOURS.length * CELL_W;
  return (
    <div ref={forwardRef} style={{
      position:'absolute', left:'-9999px', top:0,
      background:'#ffffff', fontFamily:'sans-serif', padding:20, width: totalW + 40,
    }}>
      <div style={{ marginBottom:12, fontWeight:800, fontSize:15, color:'#1f2937' }}>
        {scheduleName || 'ตารางเรียน'}
      </div>
      <div style={{ border:'1px solid #e5e7eb', borderRadius:10, overflow:'hidden' }}>
        <div style={{ display:'flex', background:'#1f2937' }}>
          <div style={{ width:LABEL_W, minWidth:LABEL_W, borderRight:'1px solid rgba(255,255,255,0.15)',
            padding:'8px 6px', fontSize:11, color:'#9ca3af', textAlign:'center' }}>วัน / เวลา</div>
          {HOURS.map((h) => (
            <div key={h} style={{ width:CELL_W, minWidth:CELL_W, borderLeft:'1px solid rgba(255,255,255,0.1)',
              padding:'8px 6px', fontSize:11, color:'#ffffff', fontFamily:'monospace', fontWeight:600 }}>
              {h}:00
            </div>
          ))}
        </div>
        {displayDays.map((day, di) => (
          <div key={day.key} style={{
            display:'flex', height:ROW_H,
            background: di%2===0 ? '#ffffff' : '#f9fafb',
            borderTop:'1px solid #e5e7eb', position:'relative',
          }}>
            <div style={{ width:LABEL_W, minWidth:LABEL_W, display:'flex', alignItems:'center',
              justifyContent:'center', borderRight:'1px solid #e5e7eb',
              fontSize:12, fontWeight:700, color:'#374151' }}>
              {day.label}
            </div>
            <div style={{ position:'relative', flex:1, overflow:'hidden' }}>
              {HOURS.map((h) => (
                <div key={h} style={{ position:'absolute', top:0, bottom:0,
                  left:(h-HOUR_START)*CELL_W, borderLeft:'1px solid #f3f4f6', width:CELL_W }} />
              ))}
              {(byDay[day.key]||[]).map((course) => {
                const s=parseTime(course.startTime), e=parseTime(course.endTime);
                if (!s||!e) return null;
                const left=(s-HOUR_START)*CELL_W+3, width=(e-s)*CELL_W-6;
                const color=courseColors[course.code]||'#fbbf24';
                return (
                  <div key={course.id} style={{
                    position:'absolute', top:4, bottom:4, left, width,
                    background:color, borderRadius:7, padding:'4px 7px', overflow:'hidden',
                  }}>
                    <div style={{ fontSize:11, fontWeight:800, color:'#1f2937', lineHeight:1.3 }}>{course.code}</div>
                    <div style={{ fontSize:10, color:'#374151', lineHeight:1.3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      ({course.credits}) Sec {course.sec} · {course.room}
                    </div>
                    <div style={{ fontSize:9, color:'#6b7280', lineHeight:1.3 }}>{course.startTime}–{course.endTime}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:16 }}>
        <div style={{ fontSize:12, fontWeight:700, color:'#1f2937', marginBottom:8 }}>รายวิชาที่เลือก</div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11 }}>
          <thead>
            <tr style={{ background:'#f3f4f6' }}>
              {['รหัสวิชา','ชื่อวิชา','Sec','หน่วยกิต','วัน','เวลา','ห้อง'].map((h) => (
                <th key={h} style={{ padding:'5px 8px', textAlign:'left', fontWeight:700,
                  color:'#374151', borderBottom:'1px solid #e5e7eb' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={c.id} style={{ background: i%2===0 ? '#fff' : '#f9fafb' }}>
                <td style={{ padding:'5px 8px', color:courseColors[c.code]||'#fbbf24',
                  fontWeight:700, fontFamily:'monospace', borderBottom:'1px solid #f3f4f6' }}>{c.code}</td>
                <td style={{ padding:'5px 8px', borderBottom:'1px solid #f3f4f6' }}>{c.name}</td>
                <td style={{ padding:'5px 8px', borderBottom:'1px solid #f3f4f6' }}>{c.sec}</td>
                <td style={{ padding:'5px 8px', borderBottom:'1px solid #f3f4f6' }}>{c.credits}</td>
                <td style={{ padding:'5px 8px', borderBottom:'1px solid #f3f4f6' }}>{getDayLabel(c.day)}</td>
                <td style={{ padding:'5px 8px', borderBottom:'1px solid #f3f4f6', fontFamily:'monospace' }}>{c.startTime}–{c.endTime}</td>
                <td style={{ padding:'5px 8px', borderBottom:'1px solid #f3f4f6' }}>{c.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// ExportPanel
// ==========================================
function ExportPanel({ exportRef, scheduleName, courses }) {
  const [loading, setLoading] = useState('');
  const loadLib = (src) => new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) { setTimeout(res, 200); return; }
    const s = document.createElement('script'); s.src=src; s.onload=res; s.onerror=rej;
    document.head.appendChild(s);
  });
  const capture = async () => {
    const el = exportRef.current; if (!el) throw new Error('no el');
    await loadLib('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    return window.html2canvas(el, { scale:2, useCORS:true, backgroundColor:'#ffffff',
      width:el.scrollWidth, height:el.scrollHeight, windowWidth:el.scrollWidth, windowHeight:el.scrollHeight });
  };
  const dl = (href, name) => { const a=document.createElement('a'); a.href=href; a.download=name; a.click(); };
  const exportPNG  = async () => { setLoading('png'); try { const c=await capture(); dl(c.toDataURL('image/png'), `${scheduleName||'schedule'}.png`); } catch { alert('export ไม่สำเร็จครับ'); } setLoading(''); };
  const exportJPEG = async () => { setLoading('jpg'); try { const c=await capture(); dl(c.toDataURL('image/jpeg',0.92), `${scheduleName||'schedule'}.jpg`); } catch { alert('export ไม่สำเร็จครับ'); } setLoading(''); };
  const exportPDF  = async () => {
    setLoading('pdf');
    try {
      const c=await capture();
      await loadLib('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      const {jsPDF}=window.jspdf;
      const pdf=new jsPDF({ orientation:'landscape', unit:'mm', format:'a4' });
      const pgW=pdf.internal.pageSize.getWidth(), pgH=pdf.internal.pageSize.getHeight();
      const iW=c.width/2, iH=c.height/2;
      const ratio=Math.min(pgW/iW, pgH/iH);
      pdf.addImage(c.toDataURL('image/png'), 'PNG', (pgW-iW*ratio)/2, (pgH-iH*ratio)/2, iW*ratio, iH*ratio);
      pdf.save(`${scheduleName||'schedule'}.pdf`);
    } catch { alert('export PDF ไม่สำเร็จครับ'); }
    setLoading('');
  };
  if (courses.length===0) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
        <Download className="w-3.5 h-3.5"/> ดาวน์โหลด:
      </span>
      {[
        { label:'PNG',  fn:exportPNG,  id:'png', cls:'bg-blue-500 hover:bg-blue-600 text-white' },
        { label:'JPEG', fn:exportJPEG, id:'jpg', cls:'bg-indigo-500 hover:bg-indigo-600 text-white' },
        { label:'PDF',  fn:exportPDF,  id:'pdf', cls:'bg-red-500 hover:bg-red-600 text-white' },
      ].map((btn) => (
        <button key={btn.id} onClick={btn.fn} disabled={!!loading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-60 transition-colors ${btn.cls}`}>
          {loading===btn.id
            ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
            : <Download className="w-3.5 h-3.5"/>}
          {loading===btn.id ? 'กำลังสร้าง...' : btn.label}
        </button>
      ))}
    </div>
  );
}

// ==========================================
// SavedPanel
// ==========================================
function SavedPanel({ savedSchedules, saveSchedule, loadSchedule, deleteSchedule, currentCount, dark }) {
  const [open, setOpen]=useState(false), [name, setName]=useState(''), [saving, setSaving]=useState(false), [confirm, setConfirm]=useState(null);
  const handleSave=()=>{ saveSchedule(name.trim()||`ตาราง ${new Date().toLocaleDateString('th-TH')}`); setName(''); setSaving(false); };
  return (
    <div className={`border rounded-2xl overflow-hidden shadow-sm ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <button onClick={()=>setOpen((v)=>!v)} className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
        <div className="flex items-center gap-2">
          <BookMarked className="w-4 h-4 text-yellow-500"/>
          <span className={`font-bold text-sm ${dark ? 'text-gray-200' : 'text-gray-800'}`}>ตารางที่บันทึกไว้</span>
          {savedSchedules.length>0 && <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">{savedSchedules.length}</span>}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400"/> : <ChevronDown className="w-4 h-4 text-gray-400"/>}
      </button>
      {open && (
        <div className={`border-t p-4 space-y-3 ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
          {currentCount>0 && (saving ? (
            <div className="flex gap-2">
              <input autoFocus type="text" value={name} onChange={(e)=>setName(e.target.value)}
                onKeyDown={(e)=>e.key==='Enter'&&handleSave()} placeholder={`ชื่อตาราง (${currentCount} วิชา)`}
                className={`flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 ${dark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}/>
              <button onClick={handleSave} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-4 py-2 rounded-xl text-sm">บันทึก</button>
              <button onClick={()=>setSaving(false)} className="text-gray-400 hover:text-gray-600 px-2"><X className="w-4 h-4"/></button>
            </div>
          ) : (
            <button onClick={()=>setSaving(true)} className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-xl text-sm">
              <Save className="w-4 h-4"/> บันทึกตารางปัจจุบัน ({currentCount} วิชา)
            </button>
          ))}
          {savedSchedules.length===0 ? (
            <p className={`text-center text-sm py-6 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>ยังไม่มีตารางที่บันทึกครับ</p>
          ) : (
            <div className="space-y-2">
              {savedSchedules.map((s)=>(
                <div key={s.id} className={`border rounded-xl p-3 ${dark ? 'border-gray-600' : 'border-gray-200'}`}>
                  {confirm===s.id ? (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-red-500">ลบ "{s.name}" ใช่ไหม?</span>
                      <div className="flex gap-2">
                        <button onClick={()=>{deleteSchedule(s.id);setConfirm(null);}} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold">ลบ</button>
                        <button onClick={()=>setConfirm(null)} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg">ยกเลิก</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm truncate ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{s.name}</p>
                        <div className={`flex items-center gap-3 mt-0.5 text-xs ${dark ? 'text-gray-400' : 'text-gray-400'}`}>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{s.createdAt}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{s.courses.length} วิชา</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {s.courses.slice(0,6).map((c,i)=>(
                            <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded ${dark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>{c.code}</span>
                          ))}
                          {s.courses.length>6 && <span className="text-[10px] text-gray-400">+{s.courses.length-6}</span>}
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={()=>loadSchedule(s)} className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1">
                          <Download className="w-3 h-3"/> โหลด
                        </button>
                        <button onClick={()=>setConfirm(s.id)} className="text-gray-300 hover:text-red-400 p-1.5"><Trash2 className="w-3.5 h-3.5"/></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// SchedulePage
// ==========================================
export default function SchedulePage(props) {
  const { courses, addCourse, removeCourse, clearCourses,
    scheduleName, setScheduleName,
    savedSchedules, saveSchedule, loadSchedule, deleteSchedule } = props;

  const navigate      = useNavigate();
  const [searchParams] = useSearchParams();
  const exportRef     = useRef(null);
  const [cellW, setCellW]       = useState(72);
  const [rowH,  setRowH]        = useState(56);
  const [showSizer, setShowSizer] = useState(false);
  const [dark, setDark]         = useState(() => localStorage.getItem('msu-dark') === '1');
  const [courseColors, setCourseColors] = useState({});

  // โหลดตารางจาก share link
  useEffect(() => {
    const s = searchParams.get('s');
    if (!s || courses.length > 0) return;
    try {
      const data = JSON.parse(decodeURIComponent(atob(s)));
      if (data.n) setScheduleName(data.n);
      if (data.c?.length) {
        data.c.forEach((c) => addCourse({ ...c, id: Date.now().toString() + Math.random() }));
      }
    } catch {}
  }, []);

  // dark mode persist
  useEffect(() => { localStorage.setItem('msu-dark', dark ? '1' : '0'); }, [dark]);

  // กำหนดสีวิชา
  useEffect(() => {
    setCourseColors((prev) => {
      const u = { ...prev }; let idx = Object.keys(u).length;
      courses.forEach((c) => { if (!u[c.code]) { u[c.code] = COLOR_PALETTE[idx % COLOR_PALETTE.length]; idx++; } });
      return u;
    });
  }, [courses]);

  const handleColorChange = (code, hex) => setCourseColors((p) => ({ ...p, [code]: hex }));
  const conflicts = useMemo(() => detectConflicts(courses), [courses]);

  return (
    <div className={`min-h-screen font-sans transition-colors ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ExportView courses={courses} courseColors={courseColors} scheduleName={scheduleName} forwardRef={exportRef} />

      {/* Header */}
      <header className={`px-4 py-3 sticky top-0 z-30 shadow-lg ${dark ? 'bg-gray-950' : 'bg-gray-800'} text-white`}>
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-gray-900"/>
            </div>
            <span className="font-black text-sm hidden sm:block">MSU Schedule</span>
          </div>
          <input type="text" value={scheduleName} onChange={(e)=>setScheduleName(e.target.value)}
            className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:border-yellow-400 min-w-0"
            placeholder="ชื่อตาราง..."/>
          {/* หน่วยกิตรวม */}
          <CreditSummary courses={courses} dark={dark} />
          {/* Dark mode toggle */}
          <button onClick={() => setDark((v) => !v)}
            className="shrink-0 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
            {dark ? <Sun className="w-4 h-4 text-yellow-400"/> : <Moon className="w-4 h-4 text-gray-300"/>}
          </button>
          <div className="shrink-0 bg-yellow-400 text-gray-900 text-sm font-bold px-2.5 py-1 rounded-full min-w-[28px] text-center">
            {courses.length}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* แถบปุ่ม */}
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={()=>navigate('/search')}
            className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-4 py-2 rounded-xl text-sm shadow-sm transition-colors">
            <Search className="w-4 h-4"/> ค้นหาวิชา
          </button>
          <button onClick={()=>navigate('/browse')}
            className={`flex items-center gap-1.5 font-bold px-4 py-2 rounded-xl text-sm shadow-sm transition-colors
              ${dark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}>
            <BookOpen className="w-4 h-4"/> ดูวิชาทั้งหมด
          </button>
          <button onClick={()=>navigate('/curriculum')}
            className={`flex items-center gap-1.5 font-bold px-4 py-2 rounded-xl text-sm shadow-sm transition-colors
              ${dark ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900' : 'bg-yellow-400 hover:bg-yellow-300 text-gray-900'}`}>
            <GraduationCap className="w-4 h-4"/> วิชาแนะนำ
          </button>
          <button onClick={()=>setShowSizer((v)=>!v)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors border
              ${dark ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            <SlidersHorizontal className="w-4 h-4"/> ปรับขนาด
          </button>
          <div className="flex-1 hidden sm:block"/>
          <ShareButton courses={courses} scheduleName={scheduleName}/>
          <ExportPanel exportRef={exportRef} scheduleName={scheduleName} courses={courses}/>
        </div>

        {/* Slider */}
        {showSizer && (
          <div className={`border rounded-2xl px-5 py-4 shadow-sm flex flex-wrap gap-6 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex-1 min-w-48">
              <label className={`text-xs font-semibold mb-2 block ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                ความกว้างต่อชั่วโมง: <span className="text-yellow-500">{cellW}px</span>
              </label>
              <input type="range" min={48} max={160} step={8} value={cellW} onChange={(e)=>setCellW(Number(e.target.value))} className="w-full accent-yellow-400"/>
              <div className={`flex justify-between text-[10px] mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                <span>แคบ</span><span>กว้าง</span>
              </div>
            </div>
            <div className="flex-1 min-w-48">
              <label className={`text-xs font-semibold mb-2 block ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                ความสูงต่อวัน: <span className="text-yellow-500">{rowH}px</span>
              </label>
              <input type="range" min={36} max={120} step={4} value={rowH} onChange={(e)=>setRowH(Number(e.target.value))} className="w-full accent-yellow-400"/>
              <div className={`flex justify-between text-[10px] mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                <span>เล็ก</span><span>ใหญ่</span>
              </div>
            </div>
          </div>
        )}

        {/* Conflict Banner */}
        <ConflictBanner conflicts={conflicts} dark={dark}/>

        {/* ตาราง */}
        <ScheduleGrid courses={courses} courseColors={courseColors}
          onRemoveCourse={removeCourse} onColorChange={handleColorChange}
          cellW={cellW} rowH={rowH} conflicts={conflicts} dark={dark}/>

        {/* รายวิชา */}
        <CourseList courses={courses} courseColors={courseColors}
          onRemoveCourse={removeCourse} onColorChange={handleColorChange}
          clearCourses={clearCourses} conflicts={conflicts} dark={dark}/>

        {/* ตารางที่บันทึก */}
        <SavedPanel savedSchedules={savedSchedules} saveSchedule={saveSchedule}
          loadSchedule={loadSchedule} deleteSchedule={deleteSchedule}
          currentCount={courses.length} dark={dark}/>

        {courses.length===0 && (
          <div className="text-center py-4">
            <p className={`text-sm mb-3 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>เพิ่มวิชาได้เลยครับ</p>
            <div className="flex justify-center gap-3">
              <button onClick={()=>navigate('/search')}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm">
                <Search className="w-4 h-4"/> ค้นหาวิชา
              </button>
              <button onClick={()=>navigate('/browse')}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm">
                <BookOpen className="w-4 h-4"/> ดูวิชาทั้งหมด
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
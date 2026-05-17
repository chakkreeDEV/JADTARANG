import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, BookOpen, GraduationCap, Trash2, X, Save, BookMarked,
  Calendar, Clock, ChevronDown, ChevronUp, Download, Image, FileText,
} from 'lucide-react';

// ==========================================
// Constants
// ==========================================
const HOUR_START = 7;
const HOUR_END   = 22;
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);

const DAYS_DISPLAY = [
  { key: 'mon', label: 'จันทร์',    short: 'จ.'  },
  { key: 'tue', label: 'อังคาร',    short: 'อ.'  },
  { key: 'wed', label: 'พุธ',       short: 'พ.'  },
  { key: 'thu', label: 'พฤหัสบดี', short: 'พฤ.' },
  { key: 'fri', label: 'ศุกร์',     short: 'ศ.'  },
  { key: 'sat', label: 'เสาร์',     short: 'ส.'  },
  { key: 'sun', label: 'อาทิตย์',  short: 'อา.' },
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

// ==========================================
// ColorDot
// ==========================================
function ColorDot({ code, color, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-4 h-4 rounded-full border-2 border-white/70 shadow hover:scale-110 transition-transform shrink-0"
        style={{ background: color }}
      />
      {open && (
        <div className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-2 top-6 left-0 w-36">
          <div className="grid grid-cols-5 gap-1 mb-1.5">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c}
                onClick={() => { onChange(code, c); setOpen(false); }}
                className="w-5 h-5 rounded-full border-2 hover:scale-110 transition-transform"
                style={{ background: c, borderColor: color === c ? '#111' : 'transparent' }}
              />
            ))}
          </div>
          <button onClick={() => setOpen(false)} className="text-[10px] text-gray-400 w-full text-center">ปิด</button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ScheduleGrid
// ==========================================
function ScheduleGrid({ courses, courseColors, onRemoveCourse, onColorChange }) {
  const CELL_H = 48;

  const byDay = {};
  DAYS_DISPLAY.forEach((d) => { byDay[d.key] = []; });
  courses.forEach((c) => { if (c.day && byDay[c.day]) byDay[c.day].push(c); });

  const coreDays  = DAYS_DISPLAY.slice(0, 5);
  const extraDays = DAYS_DISPLAY.slice(5).filter((d) => byDay[d.key].length > 0);
  const displayDays = [...coreDays, ...extraDays];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Day headers */}
      <div
        className="grid bg-gray-800 text-white text-xs"
        style={{ gridTemplateColumns: `52px repeat(${displayDays.length}, 1fr)` }}
      >
        <div className="py-3 text-center text-gray-500 text-[10px]">เวลา</div>
        {displayDays.map((d) => (
          <div key={d.key} className="py-3 text-center font-bold border-l border-white/10">
            <span className="hidden sm:block">{d.label}</span>
            <span className="sm:hidden">{d.short}</span>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: 400 }}>
          <div
            className="relative grid"
            style={{
              gridTemplateColumns: `52px repeat(${displayDays.length}, 1fr)`,
              height: `${HOURS.length * CELL_H}px`,
            }}
          >
            {/* Time column */}
            <div className="relative bg-gray-50 border-r border-gray-100">
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="absolute left-0 right-0 border-t border-gray-100 text-[10px] text-gray-400 pl-1.5 pt-0.5"
                  style={{ top: (h - HOUR_START) * CELL_H }}
                >
                  {h}:00
                </div>
              ))}
            </div>

            {/* Day columns */}
            {displayDays.map((day) => (
              <div key={day.key} className="relative border-l border-gray-100">
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="absolute left-0 right-0 border-t border-gray-100"
                    style={{ top: (h - HOUR_START) * CELL_H, height: CELL_H }}
                  />
                ))}
                {byDay[day.key].map((course) => {
                  const s = parseTime(course.startTime);
                  const e = parseTime(course.endTime);
                  if (!s || !e) return null;
                  const top    = (s - HOUR_START) * CELL_H + 2;
                  const height = (e - s) * CELL_H - 4;
                  const color  = courseColors[course.code] || '#fbbf24';
                  return (
                    <div
                      key={course.id}
                      className="absolute left-0.5 right-0.5 rounded-lg overflow-hidden group cursor-default"
                      style={{ top, height, background: color }}
                    >
                      <button
                        onClick={() => onRemoveCourse(course.id)}
                        className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-red-500/70 rounded p-0.5"
                      >
                        <X className="w-2.5 h-2.5 text-white" />
                      </button>
                      <div className="absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ColorDot code={course.code} color={color} onChange={onColorChange} />
                      </div>
                      <div className="px-1.5 pt-5 pb-1 select-none">
                        <p className="text-[10px] font-bold text-gray-900 leading-tight truncate">{course.code}</p>
                        {height > 38 && <p className="text-[9px] text-gray-700 leading-tight line-clamp-2">{course.name}</p>}
                        {height > 60 && course.room && <p className="text-[9px] text-gray-600 mt-0.5">📍{course.room}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ExportPanel — PNG / JPEG / PDF
// ==========================================
function ExportPanel({ gridRef, scheduleName, courses }) {
  const [loading, setLoading] = useState('');

  const capture = async () => {
    const el = gridRef.current;
    if (!el) return null;
    // dynamic import html2canvas จาก CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    document.head.appendChild(script);
    await new Promise((res) => { script.onload = res; });
    return window.html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
  };

  const exportPNG = async () => {
    setLoading('png');
    try {
      const canvas = await capture();
      const a = document.createElement('a');
      a.download = `${scheduleName || 'schedule'}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    } catch { alert('export ไม่สำเร็จครับ'); }
    setLoading('');
  };

  const exportJPEG = async () => {
    setLoading('jpg');
    try {
      const canvas = await capture();
      const a = document.createElement('a');
      a.download = `${scheduleName || 'schedule'}.jpg`;
      a.href = canvas.toDataURL('image/jpeg', 0.92);
      a.click();
    } catch { alert('export ไม่สำเร็จครับ'); }
    setLoading('');
  };

  const exportPDF = async () => {
    setLoading('pdf');
    try {
      const canvas = await capture();
      // load jsPDF
      const s2 = document.createElement('script');
      s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      document.head.appendChild(s2);
      await new Promise((res) => { s2.onload = res; });
      const { jsPDF } = window.jspdf;
      const imgData = canvas.toDataURL('image/png');
      const pxW = canvas.width / 2;
      const pxH = canvas.height / 2;
      // A4 landscape if wide
      const landscape = pxW > pxH;
      const pdf = new jsPDF({ orientation: landscape ? 'landscape' : 'portrait', unit: 'px', format: [pxW, pxH] });
      pdf.addImage(imgData, 'PNG', 0, 0, pxW, pxH);
      pdf.save(`${scheduleName || 'schedule'}.pdf`);
    } catch { alert('export PDF ไม่สำเร็จครับ'); }
    setLoading('');
  };

  if (courses.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
        <Download className="w-3.5 h-3.5" /> ดาวน์โหลด:
      </span>
      {[
        { label: 'PNG',  fn: exportPNG,  id: 'png',  icon: <Image className="w-3.5 h-3.5" />,    cls: 'bg-blue-500 hover:bg-blue-600 text-white' },
        { label: 'JPEG', fn: exportJPEG, id: 'jpg',  icon: <Image className="w-3.5 h-3.5" />,    cls: 'bg-indigo-500 hover:bg-indigo-600 text-white' },
        { label: 'PDF',  fn: exportPDF,  id: 'pdf',  icon: <FileText className="w-3.5 h-3.5" />, cls: 'bg-red-500 hover:bg-red-600 text-white' },
      ].map((btn) => (
        <button
          key={btn.id}
          onClick={btn.fn}
          disabled={!!loading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-60 ${btn.cls}`}
        >
          {loading === btn.id ? (
            <span className="animate-spin w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full" />
          ) : btn.icon}
          {loading === btn.id ? 'กำลังสร้าง...' : btn.label}
        </button>
      ))}
    </div>
  );
}

// ==========================================
// SavedPanel
// ==========================================
function SavedPanel({ savedSchedules, saveSchedule, loadSchedule, deleteSchedule, currentCount }) {
  const [open, setOpen]     = useState(false);
  const [name, setName]     = useState('');
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const handleSave = () => {
    const n = name.trim() || `ตาราง ${new Date().toLocaleDateString('th-TH')}`;
    saveSchedule(n);
    setName('');
    setSaving(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookMarked className="w-4 h-4 text-yellow-500" />
          <span className="font-bold text-sm text-gray-800">ตารางที่บันทึกไว้</span>
          {savedSchedules.length > 0 && (
            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {savedSchedules.length}
            </span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 p-4 space-y-3">
          {currentCount > 0 && (
            saving ? (
              <div className="flex gap-2">
                <input
                  autoFocus type="text" value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  placeholder={`ชื่อตาราง (${currentCount} วิชา)`}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                />
                <button onClick={handleSave} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-4 py-2 rounded-xl text-sm">บันทึก</button>
                <button onClick={() => setSaving(false)} className="text-gray-400 hover:text-gray-600 px-2"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <button
                onClick={() => setSaving(true)}
                className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                <Save className="w-4 h-4" /> บันทึกตารางปัจจุบัน ({currentCount} วิชา)
              </button>
            )
          )}

          {savedSchedules.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-6">ยังไม่มีตารางที่บันทึกครับ</p>
          ) : (
            <div className="space-y-2">
              {savedSchedules.map((s) => (
                <div key={s.id} className="border border-gray-200 rounded-xl p-3">
                  {confirm === s.id ? (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-red-600">ลบ "{s.name}" ใช่ไหม?</span>
                      <div className="flex gap-2">
                        <button onClick={() => { deleteSchedule(s.id); setConfirm(null); }} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold">ลบ</button>
                        <button onClick={() => setConfirm(null)} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg">ยกเลิก</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-800 truncate">{s.name}</p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{s.createdAt}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.courses.length} วิชา</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {s.courses.slice(0, 6).map((c, i) => (
                            <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{c.code}</span>
                          ))}
                          {s.courses.length > 6 && <span className="text-[10px] text-gray-400">+{s.courses.length - 6}</span>}
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={() => loadSchedule(s)} className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1">
                          <Download className="w-3 h-3" /> โหลด
                        </button>
                        <button onClick={() => setConfirm(s.id)} className="text-gray-300 hover:text-red-400 p-1.5 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
  const {
    courses, addCourse, removeCourse, clearCourses,
    scheduleName, setScheduleName,
    savedSchedules, saveSchedule, loadSchedule, deleteSchedule,
  } = props;

  const navigate = useNavigate();
  const gridRef  = useRef(null);
  const [courseColors, setCourseColors] = useState({});

  React.useEffect(() => {
    setCourseColors((prev) => {
      const updated = { ...prev };
      let idx = Object.keys(updated).length;
      courses.forEach((c) => {
        if (!updated[c.code]) {
          updated[c.code] = COLOR_PALETTE[idx % COLOR_PALETTE.length];
          idx++;
        }
      });
      return updated;
    });
  }, [courses]);

  const handleColorChange = (code, hex) =>
    setCourseColors((prev) => ({ ...prev, [code]: hex }));

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ===== Header ===== */}
      <header className="bg-gray-800 text-white px-4 py-3 sticky top-0 z-30 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-gray-900" />
            </div>
            <span className="font-black text-sm hidden sm:block">MSU Schedule</span>
          </div>
          <input
            type="text"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:border-yellow-400 min-w-0"
            placeholder="ชื่อตาราง..."
          />
          <div className="shrink-0 bg-yellow-400 text-gray-900 text-sm font-bold px-2.5 py-1 rounded-full min-w-[28px] text-center">
            {courses.length}
          </div>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">

        {/* ── แถบปุ่ม + Export เหนือตาราง ── */}
        <div className="flex flex-wrap items-center gap-3">
          {/* ปุ่มเพิ่มวิชา */}
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-4 py-2 rounded-xl text-sm transition-colors shadow-sm"
          >
            <Search className="w-4 h-4" /> ค้นหาวิชา
          </button>
          <button
            onClick={() => navigate('/browse')}
            className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors shadow-sm"
          >
            <BookOpen className="w-4 h-4" /> ดูวิชาทั้งหมด
          </button>

          {/* spacer */}
          <div className="flex-1 hidden sm:block" />

          {/* Export */}
          <ExportPanel
            gridRef={gridRef}
            scheduleName={scheduleName}
            courses={courses}
          />
        </div>

        {/* ── ตาราง (ห่อด้วย ref เพื่อ export) ── */}
        <div ref={gridRef}>
          <ScheduleGrid
            courses={courses}
            courseColors={courseColors}
            onRemoveCourse={removeCourse}
            onColorChange={handleColorChange}
          />
        </div>

        {/* ── รายการวิชา ── */}
        {courses.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gray-800 text-white px-4 py-2.5 flex items-center justify-between">
              <span className="text-sm font-bold">รายวิชาที่เลือก</span>
              <button
                onClick={clearCourses}
                className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> ล้างทั้งหมด
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {courses.map((c) => {
                const color    = courseColors[c.code] || '#fbbf24';
                const dayLabel = DAYS_DISPLAY.find((d) => d.key === c.day)?.label || '';
                return (
                  <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                    <ColorDot code={c.code} color={color} onChange={handleColorChange} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-gray-700">{c.code}</span>
                        {c.sec && <span className="text-xs text-gray-400">Sec {c.sec}</span>}
                        {c.credits && (
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                            {c.credits} หน่วยกิต
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-800 font-medium truncate">{c.name}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-400 mt-0.5">
                        {dayLabel && <span>วัน{dayLabel}</span>}
                        {c.startTime && <span>{c.startTime}–{c.endTime}</span>}
                        {c.room && <span>📍{c.room}</span>}
                        {c.instructor && c.instructor !== '-' && (
                          <span className="truncate max-w-[200px]">👤{c.instructor}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeCourse(c.id)}
                      className="shrink-0 text-gray-300 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ตารางที่บันทึก ── */}
        <SavedPanel
          savedSchedules={savedSchedules}
          saveSchedule={saveSchedule}
          loadSchedule={loadSchedule}
          deleteSchedule={deleteSchedule}
          currentCount={courses.length}
        />
      </main>
    </div>
  );
}
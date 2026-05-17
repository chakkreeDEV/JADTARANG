import React, { useState, useEffect } from 'react';
import { Trash2, Palette, ChevronDown } from 'lucide-react';

// ==========================================
// Constants
// ==========================================
const HOUR_START = 7;
const HOUR_END = 22;
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);

const DAYS_DISPLAY = [
  { key: 'mon', label: 'จันทร์',    short: 'จ'  },
  { key: 'tue', label: 'อังคาร',    short: 'อ'  },
  { key: 'wed', label: 'พุธ',       short: 'พ'  },
  { key: 'thu', label: 'พฤหัสบดี', short: 'พฤ' },
  { key: 'fri', label: 'ศุกร์',     short: 'ศ'  },
  { key: 'sat', label: 'เสาร์',     short: 'ส'  },
  { key: 'sun', label: 'อาทิตย์',  short: 'อา' },
];

// สีที่เลือกได้ (10 สี)
const COLOR_PALETTE = [
  { hex: '#fbbf24', name: 'เหลือง'   },
  { hex: '#34d399', name: 'เขียว'    },
  { hex: '#60a5fa', name: 'ฟ้า'      },
  { hex: '#f87171', name: 'แดง'      },
  { hex: '#a78bfa', name: 'ม่วง'     },
  { hex: '#fb923c', name: 'ส้ม'      },
  { hex: '#2dd4bf', name: 'ฟ้าเขียว' },
  { hex: '#e879f9', name: 'ชมพู'     },
  { hex: '#a3e635', name: 'เขียวเหลือง' },
  { hex: '#94a3b8', name: 'เทา'      },
];

// สีเริ่มต้นหมุนเวียนตามลำดับ
const DEFAULT_COLORS = COLOR_PALETTE.map((c) => c.hex);

function parseTime(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  return h + m / 60;
}

// ==========================================
// ColorPicker — popup เลือกสีของวิชา
// ==========================================
function ColorPicker({ code, color, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-5 h-5 rounded-full border-2 border-white/60 shadow-sm hover:scale-110 transition-transform"
        style={{ background: color }}
        title={`เปลี่ยนสี ${code}`}
      />
      {open && (
        <div
          className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-2 top-7 left-0"
          style={{ minWidth: 148 }}
        >
          <p className="text-[10px] text-gray-400 font-semibold px-1 mb-1.5">เลือกสีวิชา {code}</p>
          <div className="grid grid-cols-5 gap-1.5">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c.hex}
                onClick={() => { onChange(code, c.hex); setOpen(false); }}
                className="w-6 h-6 rounded-full border-2 transition-all hover:scale-110"
                style={{
                  background: c.hex,
                  borderColor: color === c.hex ? '#1f2937' : 'transparent',
                }}
                title={c.name}
              />
            ))}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="mt-2 w-full text-[10px] text-gray-400 hover:text-gray-600 text-center"
          >
            ปิด
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ScheduleTable — ตารางเรียนพร้อมเปลี่ยนสีวิชา
// ==========================================
export default function ScheduleTable({ courses, onRemoveCourse }) {
  const CELL_H = 48; // px per hour

  // กำหนดสีแต่ละวิชา (code → hex)
  const [courseColors, setCourseColors] = useState({});

  useEffect(() => {
    setCourseColors((prev) => {
      const updated = { ...prev };
      let idx = Object.keys(updated).length;
      courses.forEach((c) => {
        if (!updated[c.code]) {
          updated[c.code] = DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
          idx++;
        }
      });
      return updated;
    });
  }, [courses]);

  const handleColorChange = (code, hex) => {
    setCourseColors((prev) => ({ ...prev, [code]: hex }));
  };

  // จัดวิชาตามวัน
  const byDay = {};
  DAYS_DISPLAY.forEach((d) => { byDay[d.key] = []; });
  courses.forEach((c) => { if (c.day && byDay[c.day]) byDay[c.day].push(c); });

  // เฉพาะวันที่มีวิชา (ถ้าไม่มีเลย แสดง จ-ศ)
  const activeDays = DAYS_DISPLAY.filter((d) => byDay[d.key].length > 0);
  const displayDays = activeDays.length > 0 ? activeDays : DAYS_DISPLAY.slice(0, 5);
  const colCount = displayDays.length;

  // ==========================================
  // Empty state
  // ==========================================
  if (courses.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-300 rounded-2xl py-20 text-center text-gray-400">
        <div className="text-4xl mb-3">📅</div>
        <p className="text-base font-medium">ยังไม่มีวิชาในตารางครับ</p>
        <p className="text-sm mt-1">ค้นหาหรือ Browse วิชาแล้วกดเพิ่มนะครับ</p>
      </div>
    );
  }

  // ==========================================
  // Render
  // ==========================================
  return (
    <div className="space-y-3">

      {/* ===== Grid ===== */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

        {/* หัวตาราง: วัน */}
        <div
          className="grid bg-gray-600 text-white"
          style={{ gridTemplateColumns: `52px repeat(${colCount}, 1fr)` }}
        >
          <div className="py-2 text-center text-xs text-gray-500">เวลา</div>
          {displayDays.map((d) => (
            <div key={d.key} className="py-2 text-center text-xs font-bold border-l border-white/10">
              <span className="hidden sm:block">{d.label}</span>
              <span className="sm:hidden">{d.short}</span>
            </div>
          ))}
        </div>

        {/* Grid body */}
        <div className="overflow-x-auto">
          <div style={{ minWidth: 320 }}>
            <div
              className="relative grid"
              style={{
                gridTemplateColumns: `52px repeat(${colCount}, 1fr)`,
                height: `${HOURS.length * CELL_H}px`,
              }}
            >
              {/* เวลา */}
              <div className="relative bg-gray-100 border-r border-gray-100">
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="absolute left-0 right-0 border-t border-gray-100 text-[10px] text-gray-400 pl-1 pt-0.5"
                    style={{ top: (h - HOUR_START) * CELL_H }}
                  >
                    {h}:00
                  </div>
                ))}
              </div>

              {/* คอลัมน์วัน */}
              {displayDays.map((day) => (
                <div key={day.key} className="relative border-l border-gray-100">
                  {/* เส้นชั่วโมง */}
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      className="absolute left-0 right-0 border-t border-gray-100"
                      style={{ top: (h - HOUR_START) * CELL_H, height: CELL_H }}
                    />
                  ))}

                  {/* วิชา */}
                  {byDay[day.key].map((course) => {
                    const start = parseTime(course.startTime);
                    const end   = parseTime(course.endTime);
                    if (!start || !end) return null;
                    const top    = (start - HOUR_START) * CELL_H + 2;
                    const height = (end - start) * CELL_H - 4;
                    const color  = courseColors[course.code] || '#fbbf24';

                    return (
                      <div
                        key={course.id}
                        className="absolute left-0.5 right-0.5 rounded-lg overflow-hidden group"
                        style={{ top, height, background: color }}
                      >
                        {/* ปุ่มลบ (hover) */}
                        <button
                          onClick={() => onRemoveCourse(course.id)}
                          className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40 rounded p-0.5"
                        >
                          <Trash2 className="w-2.5 h-2.5 text-white" />
                        </button>

                        {/* เปลี่ยนสี (hover) */}
                        <div className="absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ColorPicker
                            code={course.code}
                            color={color}
                            onChange={handleColorChange}
                          />
                        </div>

                        {/* ข้อมูลวิชา */}
                        <div className="px-1.5 pt-5 pb-1">
                          <p className="text-[10px] font-bold text-gray-900 leading-tight truncate">
                            {course.code}
                          </p>
                          {height > 38 && (
                            <p className="text-[9px] text-gray-700 leading-tight line-clamp-2">
                              {course.name}
                            </p>
                          )}
                          {height > 60 && course.room && (
                            <p className="text-[9px] text-gray-600 mt-0.5">📍{course.room}</p>
                          )}
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

      {/* ===== รายการวิชา ===== */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gray-600 text-white px-4 py-2.5 flex items-center justify-between">
          <span className="text-sm font-bold">รายวิชาที่เลือก</span>
          <span className="text-xs text-gray-400">{courses.length} วิชา</span>
        </div>
        <div className="divide-y divide-gray-100">
          {courses.map((c) => {
            const color = courseColors[c.code] || '#fbbf24';
            const dayLabel = DAYS_DISPLAY.find((d) => d.key === c.day)?.label || c.day || '';
            return (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                {/* สี + เปลี่ยนสี */}
                <ColorPicker code={c.code} color={color} onChange={handleColorChange} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-700">{c.code}</span>
                    {c.sec && <span className="text-xs text-gray-400">Sec {c.sec}</span>}
                    {c.credits && (
                      <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">
                        {c.credits} หน่วยกิต
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 font-medium truncate">{c.name}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-400 mt-0.5">
                    {dayLabel && <span>วัน{dayLabel}</span>}
                    {c.startTime && <span>{c.startTime}–{c.endTime}</span>}
                    {c.room && <span>📍{c.room}</span>}
                  </div>
                </div>

                {/* ปุ่มลบ */}
                <button
                  onClick={() => onRemoveCourse(c.id)}
                  className="shrink-0 text-gray-300 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
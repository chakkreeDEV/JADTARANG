import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Clock, Calendar as CalendarIcon, MapPin, User, AlertCircle, Printer, Trash2, Search, ShoppingCart, Info } from 'lucide-react';

// ==========================================
// 📦 Import ข้อมูลวิชาจากไฟล์แยก (mock/index.js)
// ==========================================
import { MOCK_COURSES } from './mock/index';

// ==========================================
// 🗺️ แผนที่สถานะวิชาตามระบบ
// ==========================================
const STATUS_MAP = {
  'A': { text: 'เพิ่มผ่าน WEB ได้เท่านั้น', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'C': { text: 'ปิดไม่รับลง', color: 'bg-red-100 text-red-700 border-red-200' },
  'D': { text: 'ถอนผ่าน WEB ได้เท่านั้น', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  'N': { text: 'เปิดลงปกติ ทำการโดยเจ้าหน้าที่เท่านั้น', color: 'bg-gray-200 text-gray-800 border-gray-300' },
  'W': { text: 'เปิดลงปกติ สามารถลงทะเบียนผ่าน WEB ได้', color: 'bg-green-100 text-green-700 border-green-200' },
  'X': { text: 'เปลี่ยนกลุ่มผ่าน WEB ได้เท่านั้น', color: 'bg-purple-100 text-purple-700 border-purple-200' },
};

// ==========================================
// 📅 วันในสัปดาห์
// ==========================================
const DAYS = [
  { id: 'mon', label: 'จันทร์',    color: 'bg-yellow-400',  textColor: 'text-yellow-900' },
  { id: 'tue', label: 'อังคาร',    color: 'bg-pink-400',    textColor: 'text-pink-900'   },
  { id: 'wed', label: 'พุธ',       color: 'bg-green-400',   textColor: 'text-green-900'  },
  { id: 'thu', label: 'พฤหัสบดี', color: 'bg-orange-400',  textColor: 'text-orange-900' },
  { id: 'fri', label: 'ศุกร์',    color: 'bg-blue-400',    textColor: 'text-blue-900'   },
  { id: 'sat', label: 'เสาร์',    color: 'bg-purple-400',  textColor: 'text-purple-900' },
  { id: 'sun', label: 'อาทิตย์',  color: 'bg-red-400',     textColor: 'text-red-900'    },
];

// ==========================================
// 🕐 ค่าคงที่เวลา
// ==========================================
const START_HOUR = 8;
const END_HOUR = 22;
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// ==========================================
// 🚀 Component หลัก
// ==========================================
export default function App() {
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('msu-schedule');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [inputMode, setInputMode] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: 3,
    day: 'mon',
    startTime: '08:00',
    endTime: '09:30',
    room: '',
    instructor: '',
  });
  const [error, setError] = useState('');

  // บันทึกลง localStorage
  useEffect(() => {
    localStorage.setItem('msu-schedule', JSON.stringify(courses));
  }, [courses]);

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ==========================================
  // 🔍 ระบบค้นหา รองรับ รหัสวิชา, ชื่อวิชา, ชื่ออาจารย์
  // ==========================================
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase().trim();
    const results = [];

    MOCK_COURSES.forEach((course) => {
      const isCodeMatch = course.code.includes(term);
      const isExactCodeMatch = course.code === term;
      const isNameMatch = course.name.toLowerCase().includes(term);

      course.sections.forEach((sec) => {
        const isInstructorMatch =
          sec.instructor && sec.instructor.toLowerCase().includes(term);

        if (/^\d{7}$/.test(term)) {
          // พิมพ์รหัสครบ 7 หลัก → แสดงเฉพาะวิชานั้น
          if (isExactCodeMatch) {
            results.push({ ...course, ...sec, uniqueId: `${course.code}-${sec.sec}` });
          }
        } else {
          // ค้นหาบางส่วน
          if (isCodeMatch || isNameMatch || isInstructorMatch) {
            results.push({ ...course, ...sec, uniqueId: `${course.code}-${sec.sec}` });
          }
        }
      });
    });

    return results;
  }, [searchTerm]);

  // ==========================================
  // ⚠️ ตรวจสอบวิชาที่เวลาชนกัน
  // ==========================================
  const conflicts = useMemo(() => {
    const conflictSet = new Set();
    for (let i = 0; i < courses.length; i++) {
      for (let j = i + 1; j < courses.length; j++) {
        const c1 = courses[i];
        const c2 = courses[j];
        if (c1.day === c2.day) {
          const start1 = timeToMinutes(c1.startTime);
          const end1   = timeToMinutes(c1.endTime);
          const start2 = timeToMinutes(c2.startTime);
          const end2   = timeToMinutes(c2.endTime);
          if (start1 < end2 && end1 > start2) {
            conflictSet.add(c1.id);
            conflictSet.add(c2.id);
          }
        }
      }
    }
    return conflictSet;
  }, [courses]);

  // ==========================================
  // 🧮 รวมหน่วยกิต (นับแต่ละวิชา 1 ครั้ง)
  // ==========================================
  const totalCredits = useMemo(() => {
    const uniqueCourses = courses.reduce((acc, current) => {
      const exists = acc.find(
        (item) => item.code === current.code && current.code !== ''
      );
      return exists ? acc : [...acc, current];
    }, []);
    return uniqueCourses.reduce((sum, c) => sum + Number(c.credits || 0), 0);
  }, [courses]);

  // ==========================================
  // ➕ เพิ่มวิชาจากผลค้นหา
  // ==========================================
  const handleAddToCart = (item) => {
    const newCourse = {
      id: Date.now().toString(),
      code:       item.code,
      name:       item.name,
      credits:    item.credits,
      day:        item.day,
      startTime:  item.startTime,
      endTime:    item.endTime,
      room:       item.room,
      instructor: item.instructor,
      status:     item.status,
      category:   item.category || '',
    };
    setCourses((prev) => [...prev, newCourse]);
    setSearchTerm('');
    setIsSearching(false);
  };

  // ==========================================
  // ✍️ เพิ่มวิชาด้วยการกรอกเอง
  // ==========================================
  const handleAddManual = (e) => {
    e.preventDefault();
    setError('');

    const start = timeToMinutes(formData.startTime);
    const end   = timeToMinutes(formData.endTime);

    if (!formData.name) {
      setError('กรุณาใส่ชื่อวิชาครับ');
      return;
    }
    if (start >= end) {
      setError('เวลาเริ่มต้องมาก่อนเวลาเลิกเรียนนะครับ');
      return;
    }
    if (start < START_HOUR * 60 || end > END_HOUR * 60) {
      setError(`กรุณาจัดเวลาให้อยู่ในช่วง ${START_HOUR}:00 - ${END_HOUR}:00 ครับ`);
      return;
    }

    setCourses((prev) => [...prev, { ...formData, id: Date.now().toString() }]);
    setFormData((prev) => ({ ...prev, code: '', name: '', room: '', instructor: '' }));
  };

  // ==========================================
  // 🎨 UI
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

      {/* Header */}
      <header className="bg-gray-800 text-white p-4 shadow-md print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <CalendarIcon className="text-gray-800 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-yellow-400">MSU Schedule Planner</h1>
              <p className="text-sm text-gray-300">จัดตารางเรียนสไตล์เด็ก มมส.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-700 px-4 py-2 rounded-lg text-sm border border-gray-600">
              หน่วยกิตรวม:{' '}
              <span className="text-yellow-400 font-bold text-lg">{totalCredits}</span>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-yellow-400 text-gray-800 px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors font-medium shadow-sm"
            >
              <Printer className="w-4 h-4" /> พิมพ์ตาราง
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6 mt-4">

        {/* ===== Sidebar ===== */}
        <aside className="w-full lg:w-1/3 space-y-6 print:hidden">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">

            {/* Toggle Search / Manual */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                  inputMode === 'search'
                    ? 'bg-white text-gray-800 shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setInputMode('search')}
              >
                🔍 ค้นหาวิชา
              </button>
              <button
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                  inputMode === 'manual'
                    ? 'bg-white text-gray-800 shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setInputMode('manual')}
              >
                ✍️ กรอกเอง
              </button>
            </div>

            {/* ===== Search Mode ===== */}
            {inputMode === 'search' && (
              <div className="relative" ref={searchRef}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                  ค้นหาจากรหัส, ชื่อวิชา หรือ ชื่ออาจารย์
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    พร้อมใช้งาน {MOCK_COURSES.length} วิชา
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsSearching(true);
                    }}
                    onFocus={() => setIsSearching(true)}
                    className="w-full border-2 border-gray-200 p-3 pl-10 rounded-xl focus:ring-0 focus:border-yellow-400 outline-none transition-all text-sm"
                    placeholder="เช่น 0300130, Mathematics หรือชื่ออาจารย์..."
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>

                {/* Dropdown ผลการค้นหา */}
                {isSearching && searchTerm.trim() !== '' && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-80 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <ul className="divide-y divide-gray-100">
                        {searchResults.map((item) => (
                          <li
                            key={item.uniqueId}
                            className="p-3 hover:bg-yellow-50 transition-colors group"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1">
                                <div className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                  <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">
                                    {item.code}
                                  </span>
                                  {item.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-1.5 space-y-1.5">
                                  <p className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Sec {item.sec} |{' '}
                                    {DAYS.find((d) => d.id === item.day)?.label}{' '}
                                    {item.startTime}-{item.endTime}
                                  </p>
                                  <div className="flex flex-col gap-1.5">
                                    <span className="flex items-center">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      ห้อง {item.room} |{' '}
                                      <User className="w-3 h-3 ml-1 mr-1" />
                                      <span className="truncate max-w-[150px]">
                                        {item.instructor || '-'}
                                      </span>
                                    </span>
                                    {/* หมวดหมู่ */}
                                    {item.category && (
                                      <span className="w-fit px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200">
                                        {item.category}
                                      </span>
                                    )}
                                    {/* สถานะ */}
                                    {item.status && STATUS_MAP[item.status] && (
                                      <span
                                        className={`w-fit px-2 py-0.5 rounded text-[10px] font-semibold border ${STATUS_MAP[item.status].color}`}
                                      >
                                        {STATUS_MAP[item.status].text}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="bg-yellow-100 text-yellow-700 p-2 rounded-lg hover:bg-yellow-400 hover:text-gray-900 transition-colors flex items-center gap-1 text-xs font-bold shrink-0"
                              >
                                <ShoppingCart className="w-4 h-4" /> เพิ่ม
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm flex flex-col items-center">
                        <Info className="w-6 h-6 text-gray-300 mb-1" />
                        ไม่พบข้อมูลวิชานี้ครับ
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ===== Manual Mode ===== */}
            {inputMode === 'manual' && (
              <form onSubmit={handleAddManual} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">รหัสวิชา</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:border-yellow-400 outline-none text-sm"
                      placeholder="เว้นว่างได้"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">หน่วยกิต</label>
                    <input
                      type="number"
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                      min="0"
                      max="10"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:border-yellow-400 outline-none text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    ชื่อวิชา <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:border-yellow-400 outline-none text-sm"
                    placeholder="วิชาอะไรเอ่ย..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">เรียนวันไหน</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:border-yellow-400 outline-none bg-white text-sm"
                  >
                    {DAYS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">เวลาเริ่ม</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:border-yellow-400 outline-none text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">เวลาสิ้นสุด</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:border-yellow-400 outline-none text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">ห้อง</label>
                    <input
                      type="text"
                      value={formData.room}
                      onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:border-yellow-400 outline-none text-sm"
                      placeholder="EN-..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">อาจารย์</label>
                    <input
                      type="text"
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:border-yellow-400 outline-none text-sm"
                      placeholder="ชื่ออาจารย์"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors shadow-md text-sm mt-2"
                >
                  + เพิ่มลงตาราง
                </button>
              </form>
            )}
          </div>

          {/* ===== ตะกร้าวิชา ===== */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-64 overflow-y-auto">
            <h3 className="font-bold mb-4 text-gray-700 flex items-center justify-between">
              วิชาในตะกร้า
              <span className="bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full text-xs">
                {courses.length}
              </span>
            </h3>
            {courses.length === 0 ? (
              <div className="text-gray-400 text-sm text-center py-8 flex flex-col items-center">
                <ShoppingCart className="w-8 h-8 text-gray-200 mb-2" />
                ตะกร้าว่างเปล่า ลองหาวิชาดูสิครับ
              </div>
            ) : (
              <ul className="space-y-3">
                {courses.map((course) => {
                  const isConflict = conflicts.has(course.id);
                  return (
                    <li
                      key={course.id}
                      className={`p-3 rounded-xl border flex justify-between items-start ${
                        isConflict
                          ? 'border-red-400 bg-red-50'
                          : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <div>
                        <p
                          className={`font-semibold text-sm ${
                            isConflict ? 'text-red-700' : 'text-gray-800'
                          }`}
                        >
                          {course.code && (
                            <span className="text-xs bg-gray-200 text-gray-600 px-1 py-0.5 rounded mr-1.5">
                              {course.code}
                            </span>
                          )}
                          {course.name}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1.5">
                          <Clock className="w-3 h-3" />
                          {course.startTime} - {course.endTime} (
                          {DAYS.find((d) => d.id === course.day)?.label})
                        </p>
                        {/* หมวดหมู่ในตะกร้า */}
                        {course.category && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200">
                            {course.category}
                          </span>
                        )}
                        {/* สถานะในตะกร้า */}
                        {course.status && STATUS_MAP[course.status] && (
                          <div className="mt-1.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${
                                STATUS_MAP[course.status].color
                              }`}
                            >
                              {STATUS_MAP[course.status].text}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          setCourses((prev) => prev.filter((c) => c.id !== course.id))
                        }
                        className="text-gray-400 hover:text-red-500 bg-white p-1.5 rounded-lg shadow-sm border border-gray-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* ===== ตารางเรียน ===== */}
        <section className="w-full lg:w-2/3 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 print:w-full print:border-none print:shadow-none print:p-0 overflow-x-auto">
          <div className="min-w-[800px]">

            {/* แจ้งเตือนเวลาชน */}
            {conflicts.size > 0 && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl print:hidden flex items-center gap-3">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <p className="text-sm">
                  <strong>อ๊ะ! มีเวลาเรียนชนกันครับ:</strong>{' '}
                  กรุณาเช็กแถบสีแดงในตารางให้ดีนะครับ
                </p>
              </div>
            )}

            {/* หัวเวลา */}
            <div className="flex border-b-2 border-gray-300 pb-2 mb-4 relative">
              <div className="w-20 shrink-0 text-center font-bold text-gray-500 text-sm border-r border-gray-200 pr-2">
                เวลา
              </div>
              <div className="flex-1 relative h-6">
                {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => {
                  const hour = START_HOUR + i;
                  return (
                    <div
                      key={hour}
                      className="absolute text-xs text-gray-400 font-medium transform -translate-x-1/2"
                      style={{ left: `${(i * 60 / TOTAL_MINUTES) * 100}%` }}
                    >
                      {hour.toString().padStart(2, '0')}:00
                    </div>
                  );
                })}
              </div>
            </div>

            {/* แถววันเรียน */}
            <div className="space-y-4">
              {DAYS.map((day) => {
                const dayCourses = courses.filter((c) => c.day === day.id);
                return (
                  <div key={day.id} className="flex relative items-center group">
                    {/* ป้ายวัน */}
                    <div className="w-20 shrink-0 pr-4 z-10">
                      <div
                        className={`text-center py-3 rounded-xl font-bold text-sm shadow-sm ${day.color} ${day.textColor} opacity-90 group-hover:opacity-100 transition-opacity`}
                      >
                        {day.label}
                      </div>
                    </div>

                    {/* พื้นที่ตาราง */}
                    <div className="flex-1 h-24 bg-gray-50 rounded-xl relative border border-gray-100 overflow-hidden">
                      {/* เส้นแบ่งชั่วโมง */}
                      {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute top-0 bottom-0 border-l border-gray-200 border-dashed"
                          style={{ left: `${(i * 60 / TOTAL_MINUTES) * 100}%` }}
                        />
                      ))}

                      {/* บล็อกวิชา */}
                      {dayCourses.map((course) => {
                        const startMin = timeToMinutes(course.startTime);
                        const endMin   = timeToMinutes(course.endTime);
                        const leftPercent  = ((startMin - START_HOUR * 60) / TOTAL_MINUTES) * 100;
                        const widthPercent = ((endMin - startMin) / TOTAL_MINUTES) * 100;
                        const isConflict   = conflicts.has(course.id);

                        const blockClass = isConflict
                          ? 'bg-red-500 border-red-600 text-white animate-pulse z-20 shadow-md'
                          : 'bg-white border-yellow-400 border-l-4 shadow hover:shadow-lg hover:-translate-y-0.5 text-gray-800 transition-all z-10';

                        return (
                          <div
                            key={course.id}
                            className={`absolute top-1 bottom-1 rounded-lg p-2 flex flex-col justify-center overflow-hidden border ${blockClass}`}
                            style={{
                              left:     `${leftPercent}%`,
                              width:    `${widthPercent}%`,
                              minWidth: '4rem',
                            }}
                          >
                            <div className="truncate font-bold text-xs sm:text-sm">
                              {course.name}
                            </div>
                            <div
                              className={`text-[10px] sm:text-xs truncate mt-1 ${
                                isConflict ? 'text-red-100' : 'text-gray-500 font-medium'
                              }`}
                            >
                              {course.startTime} - {course.endTime}
                            </div>
                            {(course.room || course.instructor) && (
                              <div
                                className={`hidden sm:flex flex-col text-[10px] mt-1.5 ${
                                  isConflict ? 'text-red-100' : 'text-gray-400'
                                }`}
                              >
                                {course.room && (
                                  <span className="flex items-center truncate">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {course.room}
                                  </span>
                                )}
                                {course.instructor && (
                                  <span className="flex items-center truncate mt-0.5">
                                    <User className="w-3 h-3 mr-1" />
                                    {course.instructor}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* คำอธิบายสี */}
            <div className="mt-8 pt-4 border-t border-gray-200 flex gap-6 text-sm text-gray-500 print:hidden justify-end">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-l-4 border-yellow-400 rounded shadow-sm" />
                <span>เรียนปกติ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded border border-red-600 shadow-sm" />
                <span>เวลาชนกัน</span>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
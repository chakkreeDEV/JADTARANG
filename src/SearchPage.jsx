import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, MapPin, User, ShoppingCart, ArrowLeft, Info } from 'lucide-react';
import { MOCK_COURSES } from './mock/index';

const STATUS_MAP = {
  'A': { text: 'เพิ่มผ่าน WEB ได้เท่านั้น', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'C': { text: 'ปิดไม่รับลง', color: 'bg-red-100 text-red-700 border-red-200' },
  'D': { text: 'ถอนผ่าน WEB ได้เท่านั้น', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  'N': { text: 'เปิดลงปกติ ทำการโดยเจ้าหน้าที่เท่านั้น', color: 'bg-gray-200 text-gray-800 border-gray-300' },
  'W': { text: 'เปิดลงปกติ สามารถลงทะเบียนผ่าน WEB ได้', color: 'bg-green-100 text-green-700 border-green-200' },
  'X': { text: 'เปลี่ยนกลุ่มผ่าน WEB ได้เท่านั้น', color: 'bg-purple-100 text-purple-700 border-purple-200' },
};

const DAYS = {
  mon: 'จันทร์', tue: 'อังคาร', wed: 'พุธ',
  thu: 'พฤหัสบดี', fri: 'ศุกร์', sat: 'เสาร์', sun: 'อาทิตย์',
};

const DAY_COLORS = {
  mon: 'bg-yellow-100 text-yellow-800',
  tue: 'bg-pink-100 text-pink-800',
  wed: 'bg-green-100 text-green-800',
  thu: 'bg-orange-100 text-orange-800',
  fri: 'bg-blue-100 text-blue-800',
  sat: 'bg-purple-100 text-purple-800',
  sun: 'bg-red-100 text-red-800',
};

export default function SearchPage({ onAddCourse }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [submitted, setSubmitted] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setSubmitted(searchTerm.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // ค้นหาวิชาที่ตรงกัน แล้วรวบรวม sections ทั้งหมด
  const results = useMemo(() => {
    if (!submitted) return [];
    const term = submitted.toLowerCase();

    const matched = [];

    MOCK_COURSES.forEach((course) => {
      const isCodeMatch = course.code.toLowerCase().includes(term);
      const isNameMatch = course.name.toLowerCase().includes(term);

      // ตรวจสอบ instructor match ใน sections
      const hasInstructorMatch = course.sections.some(
        (sec) => sec.instructor && sec.instructor.toLowerCase().includes(term)
      );

      if (isCodeMatch || isNameMatch || hasInstructorMatch) {
        matched.push(course);
      }
    });

    return matched;
  }, [submitted]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Header */}
      <header className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> กลับ
          </button>
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 p-3 pl-10 rounded-xl focus:outline-none focus:border-yellow-400 text-sm"
                placeholder="ค้นหารหัสวิชา, ชื่อวิชา หรือชื่ออาจารย์..."
                autoFocus
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
            <button
              onClick={handleSearch}
              className="bg-yellow-400 text-gray-900 px-5 py-2 rounded-xl font-bold hover:bg-yellow-500 transition-colors text-sm"
            >
              ค้นหา
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">

        {/* ยังไม่ได้ค้นหา */}
        {!submitted && (
          <div className="flex flex-col items-center justify-center mt-24 text-gray-400">
            <Search className="w-16 h-16 text-gray-200 mb-4" />
            <p className="text-lg font-medium">พิมพ์แล้วกด Enter หรือกดปุ่มค้นหาครับ</p>
            <p className="text-sm mt-1">ค้นหาได้จาก รหัสวิชา, ชื่อวิชา หรือชื่ออาจารย์</p>
          </div>
        )}

        {/* ค้นหาแล้วไม่เจอ */}
        {submitted && results.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-24 text-gray-400">
            <Info className="w-16 h-16 text-gray-200 mb-4" />
            <p className="text-lg font-medium">ไม่พบวิชาที่ค้นหาครับ</p>
            <p className="text-sm mt-1">ลองค้นหาด้วยคำอื่นดูนะครับ</p>
          </div>
        )}

        {/* แสดงผลลัพธ์ */}
        {submitted && results.length > 0 && (
          <div className="space-y-6 mt-2">
            <p className="text-sm text-gray-500">
              พบ <span className="font-bold text-gray-700">{results.length}</span> วิชา
              จากคำค้นหา "<span className="font-bold text-yellow-600">{submitted}</span>"
            </p>

            {results.map((course) => (
              <div key={course.code} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                {/* หัววิชา */}
                <div className="bg-gray-800 text-white px-5 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-yellow-400 font-mono font-bold text-sm">{course.code}</span>
                      <h2 className="text-base font-bold mt-0.5">{course.name}</h2>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="bg-yellow-400 text-gray-900 px-2 py-0.5 rounded text-xs font-bold">
                        {course.credits} หน่วยกิต
                      </span>
                      {course.category && (
                        <p className="text-gray-400 text-xs mt-1">{course.category}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* sections */}
                <div className="divide-y divide-gray-100">
                  {course.sections.map((sec) => (
                    <div
                      key={`${course.code}-${sec.sec}`}
                      className="px-5 py-4 hover:bg-yellow-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">

                          {/* sec + วัน */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">
                              Sec {sec.sec}
                            </span>
                            {sec.day && (
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${DAY_COLORS[sec.day] || 'bg-gray-100 text-gray-700'}`}>
                                {DAYS[sec.day] || sec.day}
                              </span>
                            )}
                            {sec.status && STATUS_MAP[sec.status] && (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${STATUS_MAP[sec.status].color}`}>
                                {STATUS_MAP[sec.status].text}
                              </span>
                            )}
                          </div>

                          {/* เวลา + ห้อง */}
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            {sec.startTime && sec.endTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                {sec.startTime} - {sec.endTime}
                              </span>
                            )}
                            {sec.room && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                {sec.room}
                              </span>
                            )}
                          </div>

                          {/* อาจารย์ */}
                          {sec.instructor && sec.instructor !== '-' && (
                            <div className="flex items-start gap-1 text-xs text-gray-500">
                              <User className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-400" />
                              <span>{sec.instructor}</span>
                            </div>
                          )}
                        </div>

                        {/* ปุ่มเพิ่ม */}
                        <button
                          onClick={() => {
                            onAddCourse({
                              id: Date.now().toString(),
                              code: course.code,
                              name: course.name,
                              credits: course.credits,
                              day: sec.day,
                              startTime: sec.startTime,
                              endTime: sec.endTime,
                              room: sec.room,
                              instructor: sec.instructor,
                              status: sec.status,
                              category: sec.category,
                            });
                            navigate('/');
                          }}
                          className="shrink-0 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          เพิ่ม
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
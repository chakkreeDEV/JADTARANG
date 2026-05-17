import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen, Clock, MapPin, User, ShoppingCart, X, ChevronRight, Filter } from 'lucide-react';
import { MOCK_COURSES } from '../mock/index';

export default function CoursePage({ addCourse }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [selectedCourse, setSelectedCourse] = useState(null); // วิชาที่เลือกเพื่อดู sec

  // หมวดหมู่ทั้งหมด
  const categories = useMemo(() => {
    const cats = [...new Set(MOCK_COURSES.map((c) => c.category).filter(Boolean))];
    return ['ทั้งหมด', ...cats];
  }, []);

  // กรองวิชาตาม search และ category
  const filteredCourses = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return MOCK_COURSES.filter((course) => {
      const matchCat = selectedCategory === 'ทั้งหมด' || course.category === selectedCategory;
      const matchSearch = !term ||
        course.code.toLowerCase().includes(term) ||
        course.name.toLowerCase().includes(term);
      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCategory]);

  const dayInfo = (id) => DAYS.find((d) => d.id === id);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">

      {/* Header */}
      <header className="bg-gray-600 text-white p-4 shadow-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-1.5 bg-gray-600 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors text-sm shrink-0">
            <ArrowLeft className="w-4 h-4" /> กลับ
          </button>
          <div className="flex items-center gap-2 flex-1">
            <BookOpen className="w-5 h-5 text-red-500 shrink-0" />
            <h1 className="text-lg font-bold text-red-500 shrink-0">เลือกวิชา</h1>
            <span className="text-gray-400 text-xs">({filteredCourses.length} วิชา)</span>
          </div>
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-600 border border-gray-600 text-white placeholder-gray-400 p-2.5 pl-9 rounded-xl focus:outline-none focus:border-red-500 text-sm"
              placeholder="ค้นหาวิชา..."
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="max-w-6xl mx-auto mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Filter className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-red-500 text-gray-900'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        {/* Grid การ์ดวิชา */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <button
              key={course.code}
              onClick={() => setSelectedCourse(course)}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 text-left hover:shadow-md hover:border-red-500 transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-mono bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                    {course.code}
                  </span>
                  <h3 className="font-bold text-gray-800 text-sm mt-1.5 leading-snug line-clamp-2">
                    {course.name}
                  </h3>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-600 transition-colors shrink-0 mt-1" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                    {course.credits} หน่วยกิต
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                    {course.sections.length} กลุ่ม
                  </span>
                </div>
                {course.category && (
                  <span className="text-[10px] text-gray-400 truncate ml-2">{course.category}</span>
                )}
              </div>

              {/* Preview วัน */}
              <div className="mt-3 flex gap-1 flex-wrap">
                {[...new Set(course.sections.map((s) => s.day).filter(Boolean))].map((day) => {
                  const d = dayInfo(day);
                  return d ? (
                    <span key={day} className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${d.light}`}>
                      {d.short}
                    </span>
                  ) : null;
                })}
              </div>
            </button>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-lg font-medium">ไม่พบวิชาที่ค้นหาครับ</p>
          </div>
        )}
      </div>

      {/* ==========================================
          Modal แสดง Sec ของวิชาที่เลือก
      ========================================== */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedCourse(null)}>
          <div
            className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* หัว Modal */}
            <div className="bg-gray-600 text-white px-5 py-4 rounded-t-3xl sm:rounded-t-2xl shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-red-500 font-mono text-xs font-bold">{selectedCourse.code}</span>
                  <h2 className="text-base font-bold mt-0.5">{selectedCourse.name}</h2>
                  <div className="flex gap-2 mt-1.5">
                    <span className="bg-red-500 text-gray-900 px-2 py-0.5 rounded text-xs font-bold">
                      {selectedCourse.credits} หน่วยกิต
                    </span>
                    <span className="bg-gray-600 text-gray-300 px-2 py-0.5 rounded text-xs">
                      {selectedCourse.sections.length} กลุ่มเรียน
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedCourse(null)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* รายการ Sec */}
            <div className="overflow-y-auto flex-1">
              <div className="divide-y divide-gray-100">
                {selectedCourse.sections.map((sec) => {
                  const d = dayInfo(sec.day);
                  return (
                    <div key={`${selectedCourse.code}-${sec.sec}`}
                      className="px-5 py-4 hover:bg-red-50 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">
                              กลุ่ม {sec.sec}
                            </span>
                            {d && (
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${d.light}`}>{d.label}</span>
                            )}
                            {sec.status && STATUS_MAP[sec.status] && (
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${STATUS_MAP[sec.status].color}`}>
                                {STATUS_MAP[sec.status].text}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                            {sec.startTime && sec.endTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                {sec.startTime} - {sec.endTime}
                              </span>
                            )}
                            {sec.room && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-gray-400" />{sec.room}
                              </span>
                            )}
                          </div>
                          {sec.instructor && sec.instructor !== '-' && (
                            <div className="flex items-start gap-1 text-xs text-gray-500">
                              <User className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-400" />
                              <span>{sec.instructor}</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            addCourse({
                              code: selectedCourse.code,
                              name: selectedCourse.name,
                              credits: selectedCourse.credits,
                              day: sec.day, startTime: sec.startTime, endTime: sec.endTime,
                              room: sec.room, instructor: sec.instructor,
                              status: sec.status, category: selectedCourse.category,
                            });
                            setSelectedCourse(null);
                            navigate('/');
                          }}
                          className="shrink-0 bg-red-500 hover:bg-red-600 text-gray-900 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <ShoppingCart className="w-4 h-4" /> เพิ่ม
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
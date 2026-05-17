import React, { useState } from 'react';
import {
  BookMarked, Trash2, Download, Calendar,
  Clock, ChevronDown, ChevronUp, Save, X,
} from 'lucide-react';

// ==========================================
// SavedSchedules — แสดงรายการตารางที่บันทึกไว้
// ==========================================
export default function SavedSchedules({
  savedSchedules,
  loadSchedule,
  deleteSchedule,
  saveSchedule,
  currentCoursesCount,
}) {
  const [open, setOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSave = () => {
    const name = saveName.trim() || `ตารางเรียน ${new Date().toLocaleDateString('th-TH')}`;
    saveSchedule(name);
    setSaveName('');
    setShowSaveForm(false);
  };

  const handleDelete = (id) => {
    deleteSchedule(id);
    setConfirmDelete(null);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookMarked className="w-4 h-4 text-red-600" />
          <span className="font-bold text-sm text-gray-800">ตารางที่บันทึกไว้</span>
          {savedSchedules.length > 0 && (
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {savedSchedules.length}
            </span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 p-4 space-y-3">
          {/* ปุ่มบันทึกตารางปัจจุบัน */}
          {currentCoursesCount > 0 && (
            <div>
              {!showSaveForm ? (
                <button
                  onClick={() => setShowSaveForm(true)}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-gray-900 font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  <Save className="w-4 h-4" />
                  บันทึกตารางปัจจุบัน ({currentCoursesCount} วิชา)
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    placeholder="ชื่อตาราง (เช่น เทอม 1/2568)"
                    autoFocus
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                  />
                  <button
                    onClick={handleSave}
                    className="bg-red-500 hover:bg-red-600 text-gray-900 font-bold px-4 py-2 rounded-xl text-sm transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setShowSaveForm(false); setSaveName(''); }}
                    className="text-gray-400 hover:text-gray-600 px-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* รายการที่บันทึก */}
          {savedSchedules.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <BookMarked className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-sm">ยังไม่มีตารางที่บันทึกไว้ครับ</p>
            </div>
          ) : (
            <div className="space-y-2">
              {savedSchedules.map((s) => (
                <div
                  key={s.id}
                  className="border border-gray-200 rounded-xl p-3 hover:border-yellow-300 transition-colors"
                >
                  {confirmDelete === s.id ? (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-red-600 font-medium">ลบ "{s.name}" ใช่ไหมครับ?</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-red-600"
                        >
                          ลบ
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-xs bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-800 truncate">{s.name}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {s.createdAt}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {s.courses.length} วิชา
                          </span>
                        </div>
                        {/* Mini course list */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {s.courses.slice(0, 5).map((c, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded"
                            >
                              {c.code}
                            </span>
                          ))}
                          {s.courses.length > 5 && (
                            <span className="text-[10px] text-gray-400">
                              +{s.courses.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => loadSchedule(s)}
                          className="bg-gray-600 hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" /> โหลด
                        </button>
                        <button
                          onClick={() => setConfirmDelete(s.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors p-1.5"
                        >
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
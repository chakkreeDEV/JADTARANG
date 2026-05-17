import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage  from './pages/LandingPage';
import SchedulePage from './pages/SchedulePage';
import SearchPage   from './pages/SearchPage';
import BrowsePage   from './pages/Browsepage';
import CoursePage   from './pages/CoursePage';

export default function App() {
  const [courses, setCourses] = useState(() => {
    try { return JSON.parse(localStorage.getItem('msu-courses') || '[]'); }
    catch { return []; }
  });
  const [savedSchedules, setSavedSchedules] = useState(() => {
    try { return JSON.parse(localStorage.getItem('msu-saved') || '[]'); }
    catch { return []; }
  });
  const [scheduleName, setScheduleName] = useState(
    localStorage.getItem('msu-schedule-name') || 'ตารางเรียนของฉัน'
  );
  const [searchHistory, setSearchHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('msu-search-history') || '[]'); }
    catch { return []; }
  });

  useEffect(() => { localStorage.setItem('msu-courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('msu-saved', JSON.stringify(savedSchedules)); }, [savedSchedules]);
  useEffect(() => { localStorage.setItem('msu-schedule-name', scheduleName); }, [scheduleName]);
  useEffect(() => { localStorage.setItem('msu-search-history', JSON.stringify(searchHistory)); }, [searchHistory]);

  const addCourse = (course) => {
    setCourses((prev) => {
      const dup = prev.some((c) => c.code === course.code && c.sec === course.sec);
      if (dup) return prev;
      return [...prev, { ...course, id: Date.now().toString() }];
    });
  };
  const removeCourse    = (id)  => setCourses((prev) => prev.filter((c) => c.id !== id));
  const clearCourses    = ()    => setCourses([]);
  const saveSchedule    = (n)   => setSavedSchedules((prev) => [{
    id: Date.now().toString(), name: n || scheduleName,
    courses: [...courses], createdAt: new Date().toLocaleDateString('th-TH'),
  }, ...prev]);
  const loadSchedule    = (s)   => { setCourses([...s.courses]); setScheduleName(s.name); };
  const deleteSchedule  = (id)  => setSavedSchedules((prev) => prev.filter((s) => s.id !== id));
  const addSearchHistory    = (t) => { if (!t.trim()) return; setSearchHistory((p) => [t, ...p.filter((h) => h !== t)].slice(0, 10)); };
  const removeSearchHistory = (t) => setSearchHistory((p) => p.filter((h) => h !== t));
  const clearSearchHistory  = ()  => setSearchHistory([]);

  const sharedProps = {
    courses, setCourses, addCourse, removeCourse, clearCourses,
    scheduleName, setScheduleName,
    savedSchedules, saveSchedule, loadSchedule, deleteSchedule,
    searchHistory, addSearchHistory, removeSearchHistory, clearSearchHistory,
  };

  return (
    <Routes>
      <Route path="/"         element={<LandingPage />} />
      <Route path="/schedule" element={<SchedulePage {...sharedProps} />} />
      <Route path="/search"   element={<SearchPage   {...sharedProps} />} />
      <Route path="/browse"   element={<BrowsePage   {...sharedProps} />} />
      <Route path="/courses"  element={<CoursePage   {...sharedProps} />} />
    </Routes>
  );
}
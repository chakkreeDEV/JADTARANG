// ==========================================
// 📦 Import ข้อมูลดิบจากแต่ละไฟล์ (อยู่ใน folder เดียวกัน)
// ==========================================
import { RAW_COURSES_ENG } from './engineering';
import { COURSES_0041 } from './generaledu0041';
import { COURSES_0042 } from './generaledu0042';
import { COURSES_0043 } from './generaledu0043';
import { COURSES_0044 } from './generaledu0044';
import { COURSES_0045 } from './generaledu0045';

// ==========================================
// 🗺️ แปลงชื่อวันเป็น id
// ==========================================
const dayMap = {
  Mo: 'mon',
  Tu: 'tue',
  We: 'wed',
  Th: 'thu',
  Fr: 'fri',
  Sa: 'sat',
  Su: 'sun',
};

// ==========================================
// 🔧 แปลง array of objects → MOCK_COURSES format
// ==========================================
const convertToMockCourses = (rawArray, category) => {
  const courseMap = {};

  rawArray.forEach((item) => {
    const code = item.courseCode;
    if (!code) return;

    // ดึงหน่วยกิต เช่น "3 (3-0-6)" → 3
    const creditsMatch = (item.credits || '').match(/^(\d+)/);
    const credits = creditsMatch ? Number(creditsMatch[1]) : 0;

    const name = item.courseName || 'Unknown';

    // แปลงเวลา เช่น "Mo09:00-12:00"
    let day = '';
    let startTime = '';
    let endTime = '';

    const timeStr = item.time || '';
    const timeMatch = timeStr.match(/^([A-Z][a-z])(\d{2}:\d{2})-(\d{2}:\d{2})/);
    if (timeMatch) {
      day = dayMap[timeMatch[1]] || '';
      startTime = timeMatch[2];
      endTime = timeMatch[3];
    }

    const room = item.room || '';
    const sec = String(item.sec || '01').padStart(2, '0');
    const instructor = item.instructor || '-';
    const status = item.status || 'W';

    if (!courseMap[code]) {
      courseMap[code] = {
        code,
        name,
        credits,
        category,
        sections: [],
      };
    }

    courseMap[code].sections.push({
      sec,
      day,
      startTime,
      endTime,
      room,
      instructor,
      status,
      category,
    });
  });

  return Object.values(courseMap);
};

// ==========================================
// 📚 รวมข้อมูลทุกหมวด
// ==========================================
export const MOCK_COURSES = [
  ...convertToMockCourses(RAW_COURSES_ENG, 'วิศวกรรมศาสตร์'),
  ...convertToMockCourses(COURSES_0041,    'ศึกษาทั่วไป 0041'),
  ...convertToMockCourses(COURSES_0042,    'ศึกษาทั่วไป 0042'),
  ...convertToMockCourses(COURSES_0043,    'ศึกษาทั่วไป 0043'),
  ...convertToMockCourses(COURSES_0044,    'ศึกษาทั่วไป 0044'),
  ...convertToMockCourses(COURSES_0045,    'ศึกษาทั่วไป 0045'),
];
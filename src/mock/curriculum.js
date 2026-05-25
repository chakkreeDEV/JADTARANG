// ============================================================
// 📚 mock/curriculum.js
// ข้อมูลหลักสูตร ปี 2565 — ระบบปกติ
// สาขา: โยธา · เครื่องกล · การผลิต · ชีวภาพและอาหาร
//        ไฟฟ้า · สิ่งแวดล้อม
// ============================================================

// ── helpers ──────────────────────────────────────────────────
const c    = (code, name, credits, note = '') => ({ code, name, credits, note });
const elec = (name, credits) => ({ code: '—', name, credits, note: 'เลือก', isElective: true });

// ── วิชาปี 1 ฐาน (ทุกสาขาเหมือนกัน) ─────────────────────────
const YEAR1_SEM1_BASE = [
  c('0300 130',     'Engineering Mathematics 1',                       3),
  c('0204 101',     'Physics 1',                                       3),
  c('0204 191',     'Physics Laboratory 1',                            1),
  c('0300 100*',    'Engineering Workshop Practicum',                  1, 'ลงเทอม 1 หรือ 2'),
  c('0300 101*',    'Engineering Materials',                           3, 'ลงเทอม 1 หรือ 2'),
  c('0300 110/120*','Computer Programming / Graphic Drawing',          3, 'ลงเทอม 1 หรือ 2'),
  c('0041 001',     'Preparatory English',                             2),
  c('0041 022',     'Digital Literacy and Life for Transformation',    2),
  elec('วิชาศึกษาทั่วไป (เลือก)', 2),
  elec('วิชาศึกษาทั่วไป (เลือก)', 2),
];

const YEAR1_SEM2_BASE = [
  c('0300 131',     'Engineering Mathematics 2',                       3),
  c('0204 102',     'Physics 2',                                       3),
  c('0204 192',     'Physics Laboratory 2',                            1),
  c('0300 110/120*','Computer Programming / Graphic Drawing',          3, 'ลงเทอม 1 หรือ 2'),
  c('0300 100*',    'Engineering Workshop Practicum',                  1, 'ลงเทอม 1 หรือ 2'),
  c('0300 101*',    'Engineering Materials',                           3, 'ลงเทอม 1 หรือ 2'),
  c('0300 140',     'Engineering Mechanics: Statics',                  3),
  c('0202 100',     'General Chemistry',                               3),
  c('0202 190',     'General Chemistry Laboratory',                    1),
  c('0041 002',     'Communicative English',                           2),
  c('0043 001',     'Design Thinking',                                 2),
];

// ============================================================
// 1. วิศวกรรมโยธา (Civil Engineering)
// ============================================================
const CIVIL = {
  '1-1': { label: 'ปีที่ 1 เทอม 1', courses: YEAR1_SEM1_BASE },
  '1-2': { label: 'ปีที่ 1 เทอม 2', courses: YEAR1_SEM2_BASE },
  '2-1': {
    label: 'ปีที่ 2 เทอม 1',
    courses: [
      c('0301 210', 'Civil Engineering Materials and Testing',         3),
      c('0301 211', 'Civil Engineering Materials and Testing Lab',     1),
      c('0301 212', 'Strength of Materials',                           3),
      c('0301 230', 'Surveying',                                       3),
      c('0301 231', 'Surveying Laboratory',                            1),
      c('0301 320', 'Hydraulics',                                      3),
      c('0301 321', 'Hydraulics Laboratory',                           1),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '2-2': {
    label: 'ปีที่ 2 เทอม 2',
    courses: [
      c('0301 214', 'Structural Theory',                               3),
      c('0301 220', 'Hydrology',                                       3),
      c('0301 350', 'Soil Mechanics',                                  3),
      c('0301 351', 'Soil Mechanics Laboratory',                       1),
      c('0301 370', 'Applied Mathematics for Civil Engineers',         3),
      c('0301 414', 'Concrete Technology',                             3),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-1': {
    label: 'ปีที่ 3 เทอม 1',
    courses: [
      c('0301 232', 'Field Survey',                                    1, 'S/U · 80 ชม.'),
      c('0301 312', 'Structural Analysis',                             4),
      c('0301 314', 'Reinforced Concrete Design',                      3),
      c('0301 322', 'Hydraulic Engineering',                           3),
      c('0301 440', 'Transportation Engineering',                      3),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-2': {
    label: 'ปีที่ 3 เทอม 2',
    courses: [
      c('0301 340', 'Highway Engineering',                             3),
      c('0301 341', 'Highway Engineering Laboratory',                  1),
      c('0301 352', 'Foundation Engineering',                          3),
      c('0301 412', 'Timber and Steel Design',                         4),
      c('0301 460', 'Construction Management',                         3),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-s': {
    label: 'ปีที่ 3 ซัมเมอร์',
    courses: [c('0301 399', 'Civil Engineering Training', 3, '240 ชม.')],
  },
  '4-1': {
    label: 'ปีที่ 4 เทอม 1',
    courses: [
      c('0301 410', 'Building Design',                                 3),
      c('0301 411', 'Prestressed Concrete Design',                     3),
      c('0301 497', 'Civil Engineering Seminar',                       1, 'S/U'),
      c('0301 498', 'Civil Engineering Project 1',                     1),
      elec('วิชาเลือกวิศวกรรม (Engineering Elective)', 3),
    ],
  },
  '4-2': {
    label: 'ปีที่ 4 เทอม 2',
    courses: [
      c('0301 499', 'Civil Engineering Project 2',                     2),
      elec('วิชาเลือกวิศวกรรม (Engineering Elective)', 3),
      elec('วิชาเสรี (Free Elective)', 3),
      elec('วิชาเสรี (Free Elective)', 3),
    ],
  },
};

// ============================================================
// 2. วิศวกรรมเครื่องกล (Mechanical Engineering)
// ============================================================
const MECHANICAL = {
  '1-1': { label: 'ปีที่ 1 เทอม 1', courses: YEAR1_SEM1_BASE },
  '1-2': { label: 'ปีที่ 1 เทอม 2', courses: YEAR1_SEM2_BASE },
  '2-1': {
    label: 'ปีที่ 2 เทอม 1',
    courses: [
      c('0300 150', 'Engineering Economics',                           3),
      c('0303 283', 'Mathematics for Mechanical Engineering',          3),
      c('0303 281', 'Engineering Mechanics: Dynamics',                 3),
      c('0303 282', 'Thermodynamics 1',                                3),
      c('0303 291', 'Introduction to Mechanical Engineering',          2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '2-2': {
    label: 'ปีที่ 2 เทอม 2',
    courses: [
      c('0303 284', 'Numerical Methods for Engineers',                 3),
      c('0303 382', 'Fluid Mechanics',                                 3),
      c('0307 308', 'Fundamentals of Electrical Engineering',          3),
      c('0307 309', 'Fundamentals of Electrical Engineering Lab',      1),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-1': {
    label: 'ปีที่ 3 เทอม 1',
    courses: [
      c('0303 383', 'Manufacturing Process for Mechanical Engineering',3),
      c('0303 301', 'Mechanics of Machinery',                          3),
      c('0303 303', 'Mechanic of Vehicles',                            3),
      c('0303 321', 'Heat Transfer',                                   3),
      c('0303 381', 'Solids Mechanics',                                3),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-2': {
    label: 'ปีที่ 3 เทอม 2',
    courses: [
      c('0303 302', 'Machine Design',                                  3),
      c('0303 311', 'Computer Aided Mechanical Engineering Design',    3),
      c('0303 384', 'Health, Safety and Environment',                  2),
      c('0303 324', 'Refrigeration and Air Conditioning',              3),
      c('0303 391', 'Mechanical Engineering Laboratory 1',             1),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-s': {
    label: 'ปีที่ 3 ซัมเมอร์',
    courses: [c('0303 399', 'Mechanical Engineering Training', 3, '240 ชม.')],
  },
  '4-1': {
    label: 'ปีที่ 4 เทอม 1',
    courses: [
      c('0303 308', 'Mechanical Vibration',                            3),
      c('0303 441', 'Thermal System Design',                           3),
      c('0303 392', 'Mechanical Engineering Laboratory 2',             1),
      c('0303 461', 'Automatic Control',                               3),
      c('0303 497', 'Mechanical Engineering Seminar',                  1),
      c('0303 498', 'Mechanical Engineering Project 1',                1),
      elec('วิชาเลือกสาขา (Approved Elective)', 3),
      elec('วิชาเสรี (Free Elective)', 3),
    ],
  },
  '4-2': {
    label: 'ปีที่ 4 เทอม 2',
    courses: [
      c('0303 421', 'Power Plant Engineering',                         3),
      c('0303 499', 'Mechanical Engineering Project 2',                2),
      elec('วิชาเลือกสาขา (Approved Elective)', 3),
      elec('วิชาเสรี (Free Elective)', 3),
    ],
  },
};

// ============================================================
// 3. วิศวกรรมการผลิต (Manufacturing Engineering)
// ============================================================
const MANUFACTURING = {
  '1-1': { label: 'ปีที่ 1 เทอม 1', courses: YEAR1_SEM1_BASE },
  '1-2': { label: 'ปีที่ 1 เทอม 2', courses: YEAR1_SEM2_BASE },
  '2-1': {
    label: 'ปีที่ 2 เทอม 1',
    courses: [
      c('0300 363', 'Engineering Economics',                           3),
      c('0302 220', 'Engineering Statistics',                          3),
      c('0303 282', 'Thermodynamics 1',                                3),
      c('0307 308', 'Foundation of Electrical Engineering',            3),
      c('0307 309', 'Foundation of Electrical Engineering Lab',        1),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '2-2': {
    label: 'ปีที่ 2 เทอม 2',
    courses: [
      c('0300 102', 'Engineering Materials Laboratory',                1),
      c('0302 221', 'Manufacturing Materials',                         3),
      c('0302 210', 'Tool Engineering',                                3),
      c('0302 313', 'Mechanical Drawing and Computer Aided Design',    3),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-1': {
    label: 'ปีที่ 3 เทอม 1',
    courses: [
      c('0302 310', 'Machine Tools',                                   3),
      c('0302 311', 'Manufacturing Processes',                         3),
      c('0302 420', 'Industrial Work Study',                           3),
      c('0302 426', 'Industrial Safety Engineering',                   3),
      c('0303 391', 'Mechanical Engineering Laboratory 1',             1),
      c('0306 426', 'Automation and Control Systems',                  3),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-2': {
    label: 'ปีที่ 3 เทอม 2',
    courses: [
      c('0302 322', 'Forming Processes',                               3),
      c('0302 320', 'Quality Control',                                 3),
      c('0302 410', 'Computer Aided Manufacturing',                    3),
      c('0302 422', 'Industrial Plant Design',                         3),
      c('0302 321', 'Production Planning and Control',                 3),
      c('0302 323', 'Manufacturing Engineering Laboratory',            1),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-s': {
    label: 'ปีที่ 3 ซัมเมอร์',
    courses: [c('0302 399', 'Manufacturing Engineering Training', 3, '240 ชม.')],
  },
  '4-1': {
    label: 'ปีที่ 4 เทอม 1',
    courses: [
      c('0302 421', 'Operations Research for Engineers',               3),
      c('0302 416', 'Mold Design',                                     3),
      c('0302 429', 'Industrial Measurement and Instruments',          3),
      c('0302 498', 'Manufacturing Engineering Project 1',             1),
      elec('วิชาเลือกสาขา (Approved Elective)', 3),
      elec('วิชาเสรี (Free Elective)', 4),
    ],
  },
  '4-2': {
    label: 'ปีที่ 4 เทอม 2',
    courses: [
      c('0302 499', 'Manufacturing Engineering Project 2',             2),
      elec('วิชาเลือกสาขา (Approved Elective)', 3),
      elec('วิชาเสรี (Free Elective)', 2),
    ],
  },
};

// ============================================================
// 4. วิศวกรรมชีวภาพและอาหาร (Biological and Food Engineering)
// ============================================================
const BIOLOGICAL_FOOD = {
  '1-1': { label: 'ปีที่ 1 เทอม 1', courses: YEAR1_SEM1_BASE },
  '1-2': { label: 'ปีที่ 1 เทอม 2', courses: YEAR1_SEM2_BASE },
  '2-1': {
    label: 'ปีที่ 2 เทอม 1',
    courses: [
      c('0304 328', 'Applied Mathematics for Biological and Food Engineering', 3),
      c('0304 200', 'Engineering Computing',                           3),
      c('0303 282', 'Thermodynamics 1',                                3),
      c('0304 221', 'Introduction to Biological and Food Engineering', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '2-2': {
    label: 'ปีที่ 2 เทอม 2',
    courses: [
      c('0203 231', 'Microbiology',                                    3),
      c('0203 291', 'Microbiology Laboratory',                         1),
      c('0300 363', 'Engineering Economics',                           3),
      c('0304 222', 'Engineering and Chemical Properties of Biomaterials', 2),
      c('0304 223', 'Engineering Properties of Biomaterials Laboratory',1),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-1': {
    label: 'ปีที่ 3 เทอม 1',
    courses: [
      c('0303 382', 'Fluid Mechanics',                                 3),
      c('0304 300', 'Safety, Health and Environment',                  2),
      c('0304 322', 'Food Process Engineering 1',                      2),
      c('0304 323', 'Food Process Engineering Laboratory',             1),
      c('0304 327', 'Introduction to Food Chemistry and Microbiology', 3),
      c('0304 382', 'Heat and Mass Transfer',                          3),
      c('0303 391', 'Mechanical Engineering Laboratory 1',             1),
      c('0307 310', 'Foundation of Electrical Machine',                3),
      c('0307 311', 'Foundation of Electrical Machine Laboratory',     1),
    ],
  },
  '3-2': {
    label: 'ปีที่ 3 เทอม 2',
    courses: [
      c('0304 324', 'Food Process Engineering 2',                      3),
      c('0304 325', 'Principles of Refrigeration in Food Industry',    3),
      c('0304 302', 'Alternative Energy for Sustainable Development',  3),
      c('0304 421', 'Food Quality Control and Assurance',              3),
      c('0304 420', 'Statistics and Research Methodology for BFE',     3),
      c('0304 301', 'Biological and Food Engineering Laboratory',      1),
      elec('วิชาเสรี (Free Elective)', 3),
    ],
  },
  '3-s': {
    label: 'ปีที่ 3 ซัมเมอร์',
    courses: [c('0304 309', 'Biological and Food Engineering Training', 3, '240 ชม.')],
  },
  '4-1': {
    label: 'ปีที่ 4 เทอม 1',
    courses: [
      c('0304 400', 'Design of Food Plant and Agro-Industry',          3),
      c('0304 401', 'Process Instrument and Piping System',            3),
      c('0304 490', 'Seminar in Biological and Food Engineering',      1),
      c('0304 498', 'Biological and Food Engineering Project 1',       1),
      elec('วิชาเลือกสาขา (Approved Elective)', 3),
      elec('วิชาเลือกสาขา (Approved Elective)', 3),
    ],
  },
  '4-2': {
    label: 'ปีที่ 4 เทอม 2',
    courses: [
      c('0304 499', 'Biological and Food Engineering Project 2',       2),
      elec('วิชาเสรี (Free Elective)', 3),
    ],
  },
};

// ============================================================
// 5. วิศวกรรมไฟฟ้า (Electrical Engineering)
// ============================================================
const ELECTRICAL = {
  '1-1': { label: 'ปีที่ 1 เทอม 1', courses: YEAR1_SEM1_BASE },
  '1-2': { label: 'ปีที่ 1 เทอม 2', courses: YEAR1_SEM2_BASE },
  '2-1': {
    label: 'ปีที่ 2 เทอม 1',
    courses: [
      c('0307 200', 'Electromagnetic Fields',                          3),
      c('0307 201', 'Electric Circuits',                               3),
      c('0307 202', 'Electric Circuit Laboratory',                     1),
      c('0307 203', 'Electrical Instruments and Measurements',         3),
      c('0307 204', 'Electrical Instruments and Measurements Lab',     1),
      c('0307 205', 'Electrical Engineering Mathematics',              3),
      c('0307 207', 'Electromechanical Energy Conversion',             3),
      c('0307 208', 'Electromechanical Energy Conversion Laboratory',  1),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '2-2': {
    label: 'ปีที่ 2 เทอม 2',
    courses: [
      c('0307 209', 'Electric Circuit Analysis',                       3),
      c('0307 220', 'Engineering Electronics',                         3),
      c('0307 221', 'Engineering Electronics Laboratory',              1),
      c('0307 281', 'Principle of Digital Circuits',                   3),
      c('0307 282', 'Digital Circuit Laboratory',                      1),
      c('0307 301', 'Electrical Machines',                             3),
      c('0307 302', 'Electrical Machine Laboratory',                   1),
      c('0307 360', 'Signals and Systems',                             3),
    ],
  },
  '3-1': {
    label: 'ปีที่ 3 เทอม 1',
    courses: [
      c('0307 303', 'Power Transmission and Distribution',             3),
      c('0307 340', 'Principles of Communication',                     3),
      c('0307 341', 'Communication Engineering Laboratory',            1),
      c('0307 361', 'Control Systems',                                 3),
      c('0307 410', 'Power Electronics',                               3),
      c('0307 411', 'Power Electronic Laboratory',                     1),
      c('0307 419', 'Energy Storages',                                 3),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-2': {
    label: 'ปีที่ 3 เทอม 2',
    courses: [
      c('0307 403', 'Electrical Power System Analysis',                3),
      c('0307 404', 'Power System Protection',                         3),
      c('0307 405', 'Electrical System Design',                        3),
      c('0307 409', 'Power Plants and Substations',                    3),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-s': {
    label: 'ปีที่ 3 ซัมเมอร์',
    courses: [c('0307 399', 'Electrical Engineering Training', 3, '240 ชม.')],
  },
  '4-1': {
    label: 'ปีที่ 4 เทอม 1',
    courses: [
      c('0307 400', 'Electrical Engineering Project 1',                1),
      elec('วิชาเลือกสาขา (Approved Elective)', 3),
      elec('วิชาเสรี (Free Elective)', 3),
      elec('วิชาเสรี (Free Elective)', 3),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '4-2': {
    label: 'ปีที่ 4 เทอม 2',
    courses: [
      c('0307 401', 'Electrical Engineering Project 2',                2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
};

// ============================================================
// 6. วิศวกรรมสิ่งแวดล้อม (Environmental Engineering)
// ============================================================
const ENVIRONMENTAL = {
  '1-1': { label: 'ปีที่ 1 เทอม 1', courses: YEAR1_SEM1_BASE },
  '1-2': { label: 'ปีที่ 1 เทอม 2', courses: YEAR1_SEM2_BASE },
  '2-1': {
    label: 'ปีที่ 2 เทอม 1',
    courses: [
      c('0305 100', 'Mathematics for Environmental Engineering',       3),
      c('0305 101', 'Surveying for Environmental Engineering',         3),
      c('0305 105', 'Chemistry for Environmental Engineering',         3),
      c('0305 201', 'Environmental Engineering Parameter Analysis 1',  1),
      c('0305 213', 'Environmental Engineering Unit Operations',       3),
      c('0305 221', 'Solid Waste Engineering',                         3),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '2-2': {
    label: 'ปีที่ 2 เทอม 2',
    courses: [
      c('0305 102', 'Hydrology and Hydraulics for Environmental Engineering', 3),
      c('0305 103', 'Hydrology and Hydraulics Laboratory',             1),
      c('0305 104', 'Graphic Drawing for Environmental Engineering',   1),
      c('0305 106', 'Biology for Environmental Engineering',           3),
      c('0305 202', 'Environmental Engineering Parameter Analysis 2',  1),
      c('0305 214', 'Environmental Engineering Unit Processes',        3),
      c('0305 251', 'Noise Pollution and Vibration Control',           3),
      c('0305 261', 'Occupational Health and Safety Management',       3),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-1': {
    label: 'ปีที่ 3 เทอม 1',
    courses: [
      c('0305 331', 'Water Supply Engineering and Design',             3),
      c('0305 341', 'Drainage Engineering and Design',                 3),
      c('0305 361', 'Industrial Ecology',                              3),
      c('0305 362', 'System and Tools for Environmental Management',   3),
      elec('วิชาเลือกสาขา (Approved Elective)', 3),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-2': {
    label: 'ปีที่ 3 เทอม 2',
    courses: [
      c('0305 321', 'Hazardous Waste Management and Technology',       3),
      c('0305 332', 'Building Sanitation',                             3),
      c('0305 351', 'Air Pollution Control and Design',                3),
      elec('วิชาเลือกสาขา (Approved Elective)', 3),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาเสรี (Free Elective)', 3),
    ],
  },
  '3-s': {
    label: 'ปีที่ 3 ซัมเมอร์',
    courses: [c('0305 399', 'Environmental Engineering Training', 3, '240 ชม.')],
  },
  '4-1': {
    label: 'ปีที่ 4 เทอม 1',
    courses: [
      c('0305 441', 'Wastewater Engineering and Design',               3),
      c('0305 442', 'Industrial Water Supply and Wastewater Treatment',3),
      c('0305 461', 'Environmental Impact Assessment',                 3),
      c('0305 497', 'Environmental Engineering Seminar',               1, 'S/U'),
      c('0305 498', 'Environmental Engineering Project 1',             1),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '4-2': {
    label: 'ปีที่ 4 เทอม 2',
    courses: [
      c('0305 499', 'Environmental Engineering Project 2',             2),
      elec('วิชาเสรี (Free Elective)', 3),
    ],
  },
};


// ============================================================
// 7. วิศวกรรมเมคคาทรอนิกส์ (Mechatronics Engineering)
// ============================================================
const MECHATRONICS = {
  '1-1': { label: 'ปีที่ 1 เทอม 1', courses: YEAR1_SEM1_BASE },
  '1-2': { label: 'ปีที่ 1 เทอม 2', courses: YEAR1_SEM2_BASE },
  '2-1': {
    label: 'ปีที่ 2 เทอม 1',
    courses: [
      c('0306 213', 'Electric Circuits and Electronic Device',         3),
      c('0306 207', 'Electric Circuit and Electronic Device Lab',      1),
      c('0306 210', 'Data Acquisition and Signal Processing',          3),
      c('0306 212', 'Mathematics for Mechatronics Engineering',        3),
      c('0306 208', 'Embedded Programming Laboratory',                 1),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '2-2': {
    label: 'ปีที่ 2 เทอม 2',
    courses: [
      c('0306 310', 'Electrical Machines',                             3),
      c('0306 311', 'Electrical Machine Laboratory',                   1),
      c('0306 302', 'Digital Circuits and Logic Design',               3),
      c('0306 304', 'Microprocessor and Embedded Systems',             3),
      c('0306 211', 'Engineering Mechanics: Dynamics',                 3),
      c('0306 314', 'Graphic Drawing for Mechatronics Engineering',    1),
      c('0306 307', 'Mechatronics Laboratory 1',                       1),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-1': {
    label: 'ปีที่ 3 เทอม 1',
    courses: [
      c('0306 313', 'Sensors and Signal Conditioning',                 3),
      c('0306 315', 'Machine Design Engineering',                      3),
      c('0306 420', 'Actuation Systems',                               3),
      c('0306 406', 'Automation Technology',                           3),
      c('0306 308', 'Mechatronics Laboratory 2',                       1),
      c('0306 306', 'Artificial Neural Network and Fuzzy Theory',      3),
      c('0306 318', 'Digital Image Processing and Analysis',           3),
    ],
  },
  '3-2': {
    label: 'ปีที่ 3 เทอม 2',
    courses: [
      c('0306 305', 'Introduction to Robotics',                        3),
      c('0306 317', 'Mechanism and Dynamics of Machinery',             3),
      c('0306 319', 'Process Engineering',                             3),
      c('0306 428', 'SCADA and Industrial Internet of Things',         3),
      c('0306 309', 'Mechatronics Laboratory 3',                       1),
      c('0306 401', 'Mechatronics Engineering Project 1',              1),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-s': {
    label: 'ปีที่ 3 ซัมเมอร์',
    courses: [c('0306 399', 'Mechatronics Engineering Training', 3, '240 ชม.')],
  },
  '4-1': {
    label: 'ปีที่ 4 เทอม 1',
    courses: [
      c('0306 402', 'Mechatronics Engineering Project 2',              2),
      elec('วิชาเสรี (Free Elective)', 3),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '4-2': {
    label: 'ปีที่ 4 เทอม 2',
    courses: [
      c('0302 433', 'Manufacturing Processes and Quality Systems',     3),
      c('0306 316', 'Automatic Control Engineering',                   3),
      c('0306 421', 'Mechatronics System Design',                      2),
      elec('วิชาเลือกสาขา (Approved Elective)', 3),
      elec('วิชาเสรี (Free Elective)', 3),
    ],
  },
};

// ============================================================
// 8. วิศวกรรมรถไฟความเร็วสูง (High Speed Train Engineering)
// ============================================================
const HIGH_SPEED_TRAIN = {
  '1-1': { label: 'ปีที่ 1 เทอม 1', courses: YEAR1_SEM1_BASE },
  '1-2': { label: 'ปีที่ 1 เทอม 2', courses: YEAR1_SEM2_BASE },
  '2-1': {
    label: 'ปีที่ 2 เทอม 1',
    courses: [
      c('0300 150', 'Engineering Economics',                           3),
      c('0303 281', 'Dynamics',                                        3),
      c('0303 283', 'Mathematics for Mechanical Engineering',          3),
      c('0309 210', 'Railway Transportation Engineering',              3),
      c('0309 280', 'Thermodynamics and Heat Transfer',                3),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '2-2': {
    label: 'ปีที่ 2 เทอม 2',
    courses: [
      c('0303 233', 'Numerical and Finite Element Method',             3),
      c('0303 382', 'Fluid Mechanics',                                 3),
      c('0307 308', 'Foundation of Electrical Engineering',            3),
      c('0307 309', 'Foundation of Electrical Engineering Lab',        1),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-1': {
    label: 'ปีที่ 3 เทอม 1',
    courses: [
      c('0303 301', 'Mechanics of Machinery',                          3),
      c('0309 340', 'High Speed Train Electrification and Traction System', 3),
      c('0309 370', 'Railway Signalling and Control System',           3),
      c('0303 381', 'Solid Mechanics',                                 3),
      c('0303 383', 'Mechanical Engineering Processes',                3),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-2': {
    label: 'ปีที่ 3 เทอม 2',
    courses: [
      c('0303 302', 'Machine Design',                                  3),
      c('0303 311', 'Computer Aided Mechanical Engineering Design',    3),
      c('0303 324', 'Refrigeration and Air Conditioning',              3),
      c('0303 391', 'Mechanical Engineering Laboratory 1',             1),
      c('0303 441', 'Thermal System Design',                           3),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
      elec('วิชาศึกษาทั่วไป (เลือก)', 2),
    ],
  },
  '3-s': {
    label: 'ปีที่ 3 ซัมเมอร์',
    courses: [c('0309 399', 'High Speed Train Engineering Training', 3, '240 ชม.')],
  },
  '4-1': {
    label: 'ปีที่ 4 เทอม 1',
    courses: [
      c('0303 461', 'Automatic Control',                               3),
      c('0309 460', 'Mechanical Vibration for High Speed Train',       3),
      c('0309 492', 'High Speed Train Engineering Laboratory',         1),
      c('0309 497', 'High Speed Train Engineering Seminar',            1, 'S/U'),
      c('0309 498', 'High Speed Train Engineering Project 1',          1),
      elec('วิชาเลือกสาขา (Approved Elective)', 3),
      elec('วิชาเสรี (Free Elective)', 3),
    ],
  },
  '4-2': {
    label: 'ปีที่ 4 เทอม 2',
    courses: [
      c('0303 421', 'Power Plant Engineering',                         3),
      c('0309 499', 'High Speed Train Engineering Project 2',          2),
      elec('วิชาเลือกสาขา (Approved Elective)', 3),
      elec('วิชาเสรี (Free Elective)', 3),
    ],
  },
};

// ============================================================
// Export หลัก
// ============================================================

/** metadata ของแต่ละสาขา */
export const MAJORS = [
  {
    id:          'civil',
    name:        'วิศวกรรมโยธา',
    nameEn:      'Civil Engineering',
    shortName:   'CE',
    emoji:       '🏗️',
    accentClass: 'bg-sky-500 text-white',
    desc:        'ออกแบบและก่อสร้างโครงสร้างพื้นฐาน ถนน สะพาน อาคาร',
  },
  {
    id:          'mechanical',
    name:        'วิศวกรรมเครื่องกล',
    nameEn:      'Mechanical Engineering',
    shortName:   'ME',
    emoji:       '⚙️',
    accentClass: 'bg-orange-500 text-white',
    desc:        'ออกแบบเครื่องจักร ระบบความร้อน และพลังงาน',
  },
  {
    id:          'manufacturing',
    name:        'วิศวกรรมการผลิต',
    nameEn:      'Manufacturing Engineering',
    shortName:   'MfgE',
    emoji:       '🏭',
    accentClass: 'bg-indigo-500 text-white',
    desc:        'กระบวนการผลิต เครื่องมือกล ระบบอัตโนมัติ และควบคุมคุณภาพ',
  },
  {
    id:          'biological_food',
    name:        'วิศวกรรมชีวภาพและอาหาร',
    nameEn:      'Biological and Food Engineering',
    shortName:   'BFE',
    emoji:       '🌾',
    accentClass: 'bg-green-600 text-white',
    desc:        'วิศวกรรมอาหาร กระบวนการทางชีวภาพ และอุตสาหกรรมเกษตร',
  },
  {
    id:          'electrical',
    name:        'วิศวกรรมไฟฟ้า',
    nameEn:      'Electrical Engineering',
    shortName:   'EE',
    emoji:       '⚡',
    accentClass: 'bg-yellow-500 text-gray-900',
    desc:        'ระบบไฟฟ้ากำลัง อิเล็กทรอนิกส์ การสื่อสาร และระบบควบคุม',
  },
  {
    id:          'environmental',
    name:        'วิศวกรรมสิ่งแวดล้อม',
    nameEn:      'Environmental Engineering',
    shortName:   'EnvE',
    emoji:       '🌿',
    accentClass: 'bg-teal-500 text-white',
    desc:        'ระบบน้ำ ของเสีย มลพิษทางอากาศ และการจัดการสิ่งแวดล้อม',
  },
  {
    id:          'mechatronics',
    name:        'วิศวกรรมเมคคาทรอนิกส์',
    nameEn:      'Mechatronics Engineering',
    shortName:   'MCE',
    emoji:       '🤖',
    accentClass: 'bg-violet-500 text-white',
    desc:        'หุ่นยนต์ ระบบอัตโนมัติ เซนเซอร์ และการประมวลผลภาพ',
  },
  {
    id:          'high_speed_train',
    name:        'วิศวกรรมรถไฟความเร็วสูง',
    nameEn:      'High Speed Train Engineering',
    shortName:   'HSTE',
    emoji:       '🚄',
    accentClass: 'bg-red-600 text-white',
    desc:        'ระบบรถไฟความเร็วสูง ระบบส่งกำลัง สัญญาณ และการควบคุม',
  },
];

/** ตัวเลือก dropdown ปี+เทอม */
export const SEMESTER_OPTIONS = [
  { key: '1-1', label: 'ปีที่ 1  —  เทอม 1' },
  { key: '1-2', label: 'ปีที่ 1  —  เทอม 2' },
  { key: '2-1', label: 'ปีที่ 2  —  เทอม 1' },
  { key: '2-2', label: 'ปีที่ 2  —  เทอม 2' },
  { key: '3-1', label: 'ปีที่ 3  —  เทอม 1' },
  { key: '3-2', label: 'ปีที่ 3  —  เทอม 2' },
  { key: '3-s', label: 'ปีที่ 3  —  ซัมเมอร์' },
  { key: '4-1', label: 'ปีที่ 4  —  เทอม 1' },
  { key: '4-2', label: 'ปีที่ 4  —  เทอม 2' },
];

/** ข้อมูลหลักสูตรทั้งหมด — CURRICULUM_DATA[majorId][semKey] */
export const CURRICULUM_DATA = {
  civil:           CIVIL,
  mechanical:      MECHANICAL,
  manufacturing:   MANUFACTURING,
  biological_food: BIOLOGICAL_FOOD,
  electrical:      ELECTRICAL,
  environmental:   ENVIRONMENTAL,
  mechatronics:    MECHATRONICS,
  high_speed_train:HIGH_SPEED_TRAIN,
};
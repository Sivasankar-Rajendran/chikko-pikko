/* ─────────────────────────────────────────────
   SCHOOL
───────────────────────────────────────────── */
export const SCHOOL = {
  code:     'TN-KLK-001',
  name:     'GHSS Nedumanur',
  block:    'Sankarapuram',
  district: 'Kallakurichi',
  state:    'Tamil Nadu',
  hmId:     'HM001',
}

/* ─────────────────────────────────────────────
   CLASS LIST
   Class 5 has two sections: 5A and 5B
   All others are single section
───────────────────────────────────────────── */
export const CLASS_LIST = [
  '1', '2', '3', '4', '5A', '5B', '6', '7', '8', '9', '10', '11', '12',
]

/* ─────────────────────────────────────────────
   ALL STUDENTS  — managed via HM dashboard / Firebase
───────────────────────────────────────────── */
export const ALL_STUDENTS = []

/* ─────────────────────────────────────────────
   ALL STAFF  (20 teachers, same school)
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   ALL STAFF  — managed via HM dashboard / Firebase
───────────────────────────────────────────── */
export const ALL_STAFF = []

/* ─────────────────────────────────────────────
   CLASS–TEACHER ASSIGNMENTS
   Managed by HM. Not all staff need to be assigned.
   HM can change these anytime.
   Stored in localStorage under key 'hm_class_assignments'
   so HM changes persist across sessions.
───────────────────────────────────────────── */
export const DEFAULT_CLASS_ASSIGNMENTS = {
  '1':  'T005',   // Mr. Rajan M
  '2':  'T002',   // Ms. Revathi S
  '3':  'T003',   // Mr. Selvam R
  '4':  'T004',   // Ms. Kavitha P
  '5A': 'T001',   // Mr. Murugan K
  '5B': 'T006',   // Ms. Meenakshi K
  '6':  'T007',   // Mr. Suresh N
  '7':  'T008',   // Ms. Padmavathi R
  '8':  'T009',   // Mr. Arumugam S
  '9':  'T010',   // Ms. Vasantha K
  '10': 'T011',   // Mr. Krishnamurthy P
  '11': 'T012',   // Ms. Indrani M
  '12': 'T013',   // Mr. Senthilkumar R
  // T014–T020 are currently unassigned
}

const ASSIGNMENTS_VERSION = 'v2'

export function getClassAssignments() {
  try {
    const saved    = localStorage.getItem('hm_class_assignments')
    const version  = localStorage.getItem('hm_class_assignments_ver')
    if (!saved || version !== ASSIGNMENTS_VERSION) return DEFAULT_CLASS_ASSIGNMENTS
    return JSON.parse(saved)
  } catch {
    return DEFAULT_CLASS_ASSIGNMENTS
  }
}

export function saveClassAssignments(assignments) {
  localStorage.setItem('hm_class_assignments', JSON.stringify(assignments))
  localStorage.setItem('hm_class_assignments_ver', ASSIGNMENTS_VERSION)
}

/* ─────────────────────────────────────────────
   AUTH USERS  (mock login — one per role)
   Student  → Arjun M  (Class 1)
   Teacher  → Mr. Rajan M  (Class 1 teacher)
   HM       → Mr. Suresh Kumar
───────────────────────────────────────────── */
export const USERS = {
  student: {
    id: 'S001',
    name: 'Arjun M',
    role: 'student',
    class: '1',
    school: SCHOOL.name,
    schoolCode: SCHOOL.code,
    block: SCHOOL.block,
    district: SCHOOL.district,
    state: SCHOOL.state,
    avatar: '🐿️',
    streak: 4,
    coins: 320,
    points: 1200,
    badges: 6,
    level: 1,
    assignedSubjects: ['Maths', 'English'],
    password: 'student123',
  },
  teacher: {
    id: 'T005',
    name: 'Mr. Rajan M',
    role: 'teacher',
    class: '1',
    school: SCHOOL.name,
    schoolCode: SCHOOL.code,
    block: SCHOOL.block,
    district: SCHOOL.district,
    state: SCHOOL.state,
    avatar: '👨‍🏫',
    subject: 'Maths',
    password: 'teacher123',
  },
  headmaster: {
    id: 'HM001',
    name: 'Mr. Suresh Kumar',
    role: 'headmaster',
    school: SCHOOL.name,
    schoolCode: SCHOOL.code,
    block: SCHOOL.block,
    district: SCHOOL.district,
    state: SCHOOL.state,
    avatar: '🏫',
    password: 'hm123',
  },
  district: {
    id: 'D001',
    name: 'Dr. Anand Kumar',
    role: 'district',
    district: SCHOOL.district,
    state: SCHOOL.state,
    avatar: '🏛️',
    password: 'district123',
  },
  state: {
    id: 'ST001',
    name: 'Sec. Priya Mohan',
    role: 'state',
    state: SCHOOL.state,
    avatar: '🏛️',
    password: 'state123',
  },
}

/* ─────────────────────────────────────────────
   ISLANDS  (student dashboard)
───────────────────────────────────────────── */
export const ISLANDS = [
  { id: 1,  name: 'Numbers Island',    subject: 'Maths',   icon: '🔢', color: '#1E88E5', completed: true,  progress: 100, level: 1 },
  { id: 2,  name: 'Fractions Island',  subject: 'Maths',   icon: '½',  color: '#28B463', completed: true,  progress: 100, level: 2 },
  { id: 3,  name: 'Decimals Island',   subject: 'Maths',   icon: '📊', color: '#FF8A00', completed: false, progress: 72,  level: 3, current: true },
  { id: 4,  name: 'Algebra Island',    subject: 'Maths',   icon: '➕', color: '#8E44AD', completed: false, progress: 0,   level: 4, locked: true },
  { id: 5,  name: 'Geometry Island',   subject: 'Maths',   icon: '📐', color: '#E53935', completed: false, progress: 0,   level: 5, locked: true },
  { id: 6,  name: 'ABCs Island',       subject: 'English', icon: '🔤', color: '#FFC107', completed: true,  progress: 100, level: 1 },
  { id: 7,  name: 'Story Island',      subject: 'English', icon: '📖', color: '#1E88E5', completed: true,  progress: 100, level: 2 },
  { id: 8,  name: 'Grammar Island',    subject: 'English', icon: '📝', color: '#28B463', completed: false, progress: 58,  level: 3, current: true },
  { id: 9,  name: 'Vocabulary Island', subject: 'English', icon: '💬', color: '#8E44AD', completed: false, progress: 0,   level: 4, locked: true },
  { id: 10, name: 'Essay Island',      subject: 'English', icon: '✍️', color: '#FF8A00', completed: false, progress: 0,   level: 5, locked: true },
]

/* ─────────────────────────────────────────────
   GAMES
───────────────────────────────────────────── */
export const GAMES = [
  { id: 1, name: 'Number Ninja',   subject: 'Maths',   icon: '⚔️', coins: 50,  description: 'Slice the correct answer!', color: '#1E88E5' },
  { id: 2, name: 'Word Wizard',    subject: 'English', icon: '🔮', coins: 50,  description: 'Spell your way to victory!', color: '#8E44AD' },
  { id: 3, name: 'Fraction Flyer', subject: 'Maths',   icon: '✈️', coins: 75,  description: 'Fly through fractions!',     color: '#FF8A00' },
  { id: 4, name: 'Story Scramble', subject: 'English', icon: '🧩', coins: 75,  description: 'Unscramble the story!',      color: '#28B463' },
  { id: 5, name: 'Math Marathon',  subject: 'Maths',   icon: '🏃', coins: 100, description: 'Race against the clock!',    color: '#E53935' },
  { id: 6, name: 'Vocab Valley',   subject: 'English', icon: '🌺', coins: 100, description: 'Explore new words!',         color: '#FFC107' },
]

/* ─────────────────────────────────────────────
   STORE ITEMS
───────────────────────────────────────────── */
export const STORE_ITEMS = [
  { id: 1,  name: 'Cool Cap',       icon: '🧢', price: 200,  category: 'accessories', owned: false },
  { id: 2,  name: 'Gold Watch',     icon: '⌚', price: 500,  category: 'accessories', owned: true  },
  { id: 3,  name: 'Sunglasses',     icon: '🕶️', price: 300,  category: 'accessories', owned: false },
  { id: 4,  name: 'Superhero Cape', icon: '🦸', price: 800,  category: 'outfits',     owned: false },
  { id: 5,  name: 'Party Dress',    icon: '👗', price: 600,  category: 'outfits',     owned: true  },
  { id: 6,  name: 'Sports Jersey',  icon: '👕', price: 400,  category: 'outfits',     owned: false },
  { id: 7,  name: 'Magic Wand',     icon: '🪄', price: 350,  category: 'accessories', owned: false },
  { id: 8,  name: 'Star Backpack',  icon: '🎒', price: 450,  category: 'accessories', owned: false },
  { id: 9,  name: 'Rocket Shoes',   icon: '🚀', price: 700,  category: 'outfits',     owned: false },
  { id: 10, name: 'Crown',          icon: '👑', price: 1000, category: 'accessories', owned: false },
  { id: 11, name: 'Rainbow Wings',  icon: '🦋', price: 900,  category: 'outfits',     owned: false },
  { id: 12, name: 'Cool Headset',   icon: '🎧', price: 550,  category: 'accessories', owned: false },
]

/* ─────────────────────────────────────────────
   ASSIGNMENTS  (teacher-issued to students)
───────────────────────────────────────────── */
export const ASSIGNMENTS = [
  { id: 1, subject: 'Maths',   title: 'Fractions Practice',    type: 'daily',  dueDate: '2026-06-25', status: 'pending',   questions: 10, estimatedMin: 20 },
  { id: 2, subject: 'English', title: 'Reading Comprehension', type: 'daily',  dueDate: '2026-06-25', status: 'pending',   questions: 5,  estimatedMin: 15 },
  { id: 3, subject: 'Maths',   title: 'Decimals Worksheet',    type: 'weekly', dueDate: '2026-06-28', status: 'pending',   questions: 20, estimatedMin: 40 },
  { id: 4, subject: 'English', title: 'Vocabulary Quiz',       type: 'weekly', dueDate: '2026-06-28', status: 'completed', questions: 15, estimatedMin: 25 },
  { id: 5, subject: 'Maths',   title: 'Number Patterns',       type: 'daily',  dueDate: '2026-06-24', status: 'completed', questions: 8,  estimatedMin: 15 },
]

/* ─────────────────────────────────────────────
   BADGES
───────────────────────────────────────────── */
export const BADGES = [
  { id: 1, name: 'Streak Star',  icon: '⭐', description: '7-day streak',       earned: true  },
  { id: 2, name: 'Math Wizard',  icon: '🧙', description: 'Top Maths score',    earned: true  },
  { id: 3, name: 'Story Teller', icon: '📚', description: 'Read 10 stories',    earned: true  },
  { id: 4, name: 'Speed Runner', icon: '⚡', description: 'Fastest completion', earned: true  },
  { id: 5, name: 'Explorer',     icon: '🗺️', description: 'Visited 5 islands',  earned: true  },
  { id: 6, name: 'Coin Master',  icon: '🏆', description: 'Earned 1000 coins',  earned: false },
]


export const WEEKLY_ACTIVITY = [
  { day: 'Mon', students: 38 },
  { day: 'Tue', students: 35 },
  { day: 'Wed', students: 40 },
  { day: 'Thu', students: 42 },
  { day: 'Fri', students: 36 },
  { day: 'Sat', students: 20 },
  { day: 'Sun', students: 12 },
]

export const WEAKEST_TOPICS = [
  { topic: 'Fractions',             subject: 'Maths',   percent: 42 },
  { topic: 'Reading Comprehension', subject: 'English', percent: 38 },
  { topic: 'Grammar',               subject: 'English', percent: 31 },
  { topic: 'Decimals',              subject: 'Maths',   percent: 28 },
]

/* ─────────────────────────────────────────────
   DISTRICT DATA
───────────────────────────────────────────── */
export const DISTRICT_SCHOOLS = [
  { id: 1, name: 'GHSS Nedumanur',        code: 'TN-KLK-001', students: 600,  teachers: 20, mathAvg: 74, engAvg: 70, attendance: 89, trend: '+7%', status: 'good'      },
  { id: 2, name: 'GHSS Sankarapuram',     code: 'TN-KLK-002', students: 540,  teachers: 18, mathAvg: 68, engAvg: 65, attendance: 82, trend: '+4%', status: 'average'   },
  { id: 3, name: 'GHSS Kallakurichi',     code: 'TN-KLK-003', students: 720,  teachers: 24, mathAvg: 81, engAvg: 79, attendance: 93, trend: '+9%', status: 'excellent' },
  { id: 4, name: 'GHSS Chinnasalem',      code: 'TN-KLK-004', students: 480,  teachers: 16, mathAvg: 55, engAvg: 52, attendance: 74, trend: '-2%', status: 'attention' },
  { id: 5, name: 'GHSS Tirukoilur',       code: 'TN-KLK-005', students: 660,  teachers: 22, mathAvg: 77, engAvg: 72, attendance: 88, trend: '+5%', status: 'good'      },
  { id: 6, name: 'GHSS Rishivandiyam',    code: 'TN-KLK-006', students: 390,  teachers: 13, mathAvg: 48, engAvg: 44, attendance: 68, trend: '-5%', status: 'attention' },
]

export const GRADE_HEATMAP = [
  { grade: 'Grade 3',  maths: 'good',    english: 'good'    },
  { grade: 'Grade 4',  maths: 'good',    english: 'average' },
  { grade: 'Grade 5',  maths: 'average', english: 'good'    },
  { grade: 'Grade 6',  maths: 'average', english: 'average' },
  { grade: 'Grade 7',  maths: 'poor',    english: 'average' },
  { grade: 'Grade 8',  maths: 'poor',    english: 'poor'    },
]

/* ─────────────────────────────────────────────
   STATE DATA
───────────────────────────────────────────── */
export const STATE_DISTRICTS = [
  { id: 1, name: 'Kallakurichi',    schools: 320, students: 160000, teachers: 5400, mathAvg: 74, engAvg: 70, attendance: 85, status: 'good'      },
  { id: 2, name: 'Chennai',         schools: 500, students: 250000, teachers: 8500, mathAvg: 72, engAvg: 68, attendance: 85, status: 'good'      },
  { id: 3, name: 'Coimbatore',      schools: 420, students: 210000, teachers: 7200, mathAvg: 73, engAvg: 69, attendance: 83, status: 'good'      },
  { id: 4, name: 'Tiruchirappalli', schools: 380, students: 190000, teachers: 6500, mathAvg: 71, engAvg: 67, attendance: 81, status: 'good'      },
  { id: 5, name: 'Salem',           schools: 310, students: 155000, teachers: 5300, mathAvg: 42, engAvg: 40, attendance: 72, status: 'attention' },
  { id: 6, name: 'Dharmapuri',      schools: 280, students: 140000, teachers: 4800, mathAvg: 45, engAvg: 43, attendance: 70, status: 'attention' },
  { id: 7, name: 'Madurai',         schools: 450, students: 225000, teachers: 7700, mathAvg: 68, engAvg: 65, attendance: 79, status: 'average'   },
  { id: 8, name: 'Ramanathapuram',  schools: 240, students: 120000, teachers: 4100, mathAvg: 36, engAvg: 34, attendance: 65, status: 'attention' },
]

export const GOVT_ALERTS = [
  { id: 1, type: 'warning', message: 'Grade 5 Maths below target in 23 schools',        time: '2h ago' },
  { id: 2, type: 'warning', message: 'Attendance below 60% in 12 schools',              time: '5h ago' },
  { id: 3, type: 'info',    message: '8 schools inactive for more than 7 days',         time: '1d ago' },
  { id: 4, type: 'success', message: 'Reading Improvement Drive: 150 schools met target', time: '2d ago' },
]

export const INITIATIVES = [
  { id: 1, name: 'Reading Improvement Drive', progress: 68, schools: 320, color: '#1E88E5' },
  { id: 2, name: 'Maths Mastery Program',     progress: 45, schools: 210, color: '#28B463' },
  { id: 3, name: 'Teacher Training Phase 2',  progress: 82, schools: 450, color: '#FF8A00' },
]

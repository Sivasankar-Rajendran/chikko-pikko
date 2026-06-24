export const USERS = {
  student: {
    id: 'S001',
    name: 'Karthik R',
    role: 'student',
    class: '5A',
    school: 'Govt. Higher Secondary School',
    schoolCode: 'TN-1234',
    district: 'Chennai',
    state: 'Tamil Nadu',
    avatar: '🐿️',
    streak: 12,
    coins: 1250,
    points: 7850,
    badges: 24,
    level: 4,
    assignedSubjects: ['Maths', 'English'],
    password: 'student123',
  },
  teacher: {
    id: 'T001',
    name: 'Ms. Revathi',
    role: 'teacher',
    class: '5A',
    school: 'Govt. Higher Secondary School',
    schoolCode: 'TN-1234',
    district: 'Chennai',
    state: 'Tamil Nadu',
    avatar: '👩‍🏫',
    password: 'teacher123',
  },
  district: {
    id: 'D001',
    name: 'Dr. Anand Kumar',
    role: 'district',
    district: 'Chennai',
    state: 'Tamil Nadu',
    avatar: '🏛️',
    password: 'district123',
  },
  state: {
    id: 'ST001',
    name: 'Sec. Priya Mohan',
    role: 'state',
    state: 'Tamil Nadu',
    avatar: '🏛️',
    password: 'state123',
  },
}

export const ISLANDS = [
  { id: 1, name: 'Numbers Island',    subject: 'Maths',   icon: '🔢', color: '#1E88E5', completed: true,  progress: 100, level: 1 },
  { id: 2, name: 'Fractions Island',  subject: 'Maths',   icon: '½',  color: '#28B463', completed: true,  progress: 100, level: 2 },
  { id: 3, name: 'Decimals Island',   subject: 'Maths',   icon: '📊', color: '#FF8A00', completed: false, progress: 72,  level: 3, current: true },
  { id: 4, name: 'Algebra Island',    subject: 'Maths',   icon: '➕', color: '#8E44AD', completed: false, progress: 0,   level: 4, locked: true },
  { id: 5, name: 'Geometry Island',   subject: 'Maths',   icon: '📐', color: '#E53935', completed: false, progress: 0,   level: 5, locked: true },
  { id: 6, name: 'ABCs Island',       subject: 'English', icon: '🔤', color: '#FFC107', completed: true,  progress: 100, level: 1 },
  { id: 7, name: 'Story Island',      subject: 'English', icon: '📖', color: '#1E88E5', completed: true,  progress: 100, level: 2 },
  { id: 8, name: 'Grammar Island',    subject: 'English', icon: '📝', color: '#28B463', completed: false, progress: 58,  level: 3, current: true },
  { id: 9, name: 'Vocabulary Island', subject: 'English', icon: '💬', color: '#8E44AD', completed: false, progress: 0,   level: 4, locked: true },
  { id: 10, name: 'Essay Island',     subject: 'English', icon: '✍️', color: '#FF8A00', completed: false, progress: 0,   level: 5, locked: true },
]

export const GAMES = [
  { id: 1, name: 'Number Ninja',   subject: 'Maths',   icon: '⚔️',  coins: 50,  description: 'Slice the correct answer!', color: '#1E88E5' },
  { id: 2, name: 'Word Wizard',    subject: 'English', icon: '🔮',  coins: 50,  description: 'Spell your way to victory!', color: '#8E44AD' },
  { id: 3, name: 'Fraction Flyer', subject: 'Maths',   icon: '✈️',  coins: 75,  description: 'Fly through fractions!',     color: '#FF8A00' },
  { id: 4, name: 'Story Scramble', subject: 'English', icon: '🧩',  coins: 75,  description: 'Unscramble the story!',      color: '#28B463' },
  { id: 5, name: 'Math Marathon',  subject: 'Maths',   icon: '🏃',  coins: 100, description: 'Race against the clock!',    color: '#E53935' },
  { id: 6, name: 'Vocab Valley',   subject: 'English', icon: '🌺',  coins: 100, description: 'Explore new words!',         color: '#FFC107' },
]

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

export const ASSIGNMENTS = [
  { id: 1,  subject: 'Maths',   title: 'Fractions Practice',    type: 'daily',  dueDate: '2026-06-25', status: 'pending',   questions: 10, estimatedMin: 20 },
  { id: 2,  subject: 'English', title: 'Reading Comprehension', type: 'daily',  dueDate: '2026-06-25', status: 'pending',   questions: 5,  estimatedMin: 15 },
  { id: 3,  subject: 'Maths',   title: 'Decimals Worksheet',    type: 'weekly', dueDate: '2026-06-28', status: 'pending',   questions: 20, estimatedMin: 40 },
  { id: 4,  subject: 'English', title: 'Vocabulary Quiz',       type: 'weekly', dueDate: '2026-06-28', status: 'completed', questions: 15, estimatedMin: 25 },
  { id: 5,  subject: 'Maths',   title: 'Number Patterns',       type: 'daily',  dueDate: '2026-06-24', status: 'completed', questions: 8,  estimatedMin: 15 },
]

export const BADGES = [
  { id: 1, name: 'Streak Star',    icon: '⭐', description: '7-day streak',       earned: true  },
  { id: 2, name: 'Math Wizard',    icon: '🧙', description: 'Top Maths score',    earned: true  },
  { id: 3, name: 'Story Teller',   icon: '📚', description: 'Read 10 stories',    earned: true  },
  { id: 4, name: 'Speed Runner',   icon: '⚡', description: 'Fastest completion', earned: true  },
  { id: 5, name: 'Explorer',       icon: '🗺️', description: 'Visited 5 islands',  earned: true  },
  { id: 6, name: 'Coin Master',    icon: '🏆', description: 'Earned 1000 coins',  earned: false },
]

// Teacher data
export const CLASS_STUDENTS = [
  { id: 'S001', name: 'Karthik R',   mathScore: 85, engScore: 78, attendance: 95, status: 'good',      lastActive: '2h ago' },
  { id: 'S002', name: 'Priya S',     mathScore: 92, engScore: 88, attendance: 98, status: 'excellent', lastActive: '1h ago' },
  { id: 'S003', name: 'Arun Kumar',  mathScore: 45, engScore: 55, attendance: 72, status: 'attention', lastActive: '3 days ago' },
  { id: 'S004', name: 'Meena V',     mathScore: 78, engScore: 82, attendance: 90, status: 'good',      lastActive: '5h ago' },
  { id: 'S005', name: 'Hari Prakash',mathScore: 88, engScore: 76, attendance: 93, status: 'good',      lastActive: '3h ago' },
  { id: 'S006', name: 'Divya R',     mathScore: 95, engScore: 91, attendance: 99, status: 'excellent', lastActive: '30m ago' },
  { id: 'S007', name: 'Kumar M',     mathScore: 38, engScore: 42, attendance: 65, status: 'attention', lastActive: '5 days ago' },
  { id: 'S008', name: 'Asha L',      mathScore: 82, engScore: 86, attendance: 91, status: 'good',      lastActive: '2h ago' },
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

// District data
export const DISTRICT_SCHOOLS = [
  { id: 1, name: 'Govt. HS School, Anna Nagar',  code: 'TN-1234', students: 1250, teachers: 45, mathAvg: 74, engAvg: 70, attendance: 89, trend: '+7%', status: 'good'      },
  { id: 2, name: 'Govt. HS School, T. Nagar',    code: 'TN-1235', students: 980,  teachers: 38, mathAvg: 68, engAvg: 65, attendance: 82, trend: '+4%', status: 'average'   },
  { id: 3, name: 'Govt. HS School, Adyar',       code: 'TN-1236', students: 1100, teachers: 42, mathAvg: 81, engAvg: 79, attendance: 93, trend: '+9%', status: 'excellent' },
  { id: 4, name: 'Govt. HS School, Velachery',   code: 'TN-1237', students: 850,  teachers: 32, mathAvg: 55, engAvg: 52, attendance: 74, trend: '-2%', status: 'attention' },
  { id: 5, name: 'Govt. HS School, Tambaram',    code: 'TN-1238', students: 1320, teachers: 50, mathAvg: 77, engAvg: 72, attendance: 88, trend: '+5%', status: 'good'      },
  { id: 6, name: 'Govt. HS School, Porur',       code: 'TN-1239', students: 760,  teachers: 29, mathAvg: 48, engAvg: 44, attendance: 68, trend: '-5%', status: 'attention' },
]

export const GRADE_HEATMAP = [
  { grade: 'Grade 3', maths: 'good',    english: 'good'    },
  { grade: 'Grade 4', maths: 'good',    english: 'average' },
  { grade: 'Grade 5', maths: 'average', english: 'good'    },
  { grade: 'Grade 6', maths: 'average', english: 'average' },
  { grade: 'Grade 7', maths: 'poor',    english: 'average' },
  { grade: 'Grade 8', maths: 'poor',    english: 'poor'    },
]

// State data
export const STATE_DISTRICTS = [
  { id: 1, name: 'Chennai',        schools: 500, students: 250000, teachers: 8500, mathAvg: 72, engAvg: 68, attendance: 85, status: 'good'      },
  { id: 2, name: 'Coimbatore',     schools: 420, students: 210000, teachers: 7200, mathAvg: 73, engAvg: 69, attendance: 83, status: 'good'      },
  { id: 3, name: 'Tiruchirappalli',schools: 380, students: 190000, teachers: 6500, mathAvg: 71, engAvg: 67, attendance: 81, status: 'good'      },
  { id: 4, name: 'Salem',          schools: 310, students: 155000, teachers: 5300, mathAvg: 42, engAvg: 40, attendance: 72, status: 'attention' },
  { id: 5, name: 'Dharmapuri',     schools: 280, students: 140000, teachers: 4800, mathAvg: 45, engAvg: 43, attendance: 70, status: 'attention' },
  { id: 6, name: 'Madurai',        schools: 450, students: 225000, teachers: 7700, mathAvg: 68, engAvg: 65, attendance: 79, status: 'average'   },
  { id: 7, name: 'Thanjavur',      schools: 360, students: 180000, teachers: 6100, mathAvg: 69, engAvg: 66, attendance: 80, status: 'average'   },
  { id: 8, name: 'Ramanathapuram', schools: 240, students: 120000, teachers: 4100, mathAvg: 36, engAvg: 34, attendance: 65, status: 'attention' },
]

export const GOVT_ALERTS = [
  { id: 1, type: 'warning', message: 'Grade 5 Maths below target in 23 schools',  time: '2h ago'  },
  { id: 2, type: 'warning', message: 'Attendance below 60% in 12 schools',        time: '5h ago'  },
  { id: 3, type: 'info',    message: '8 schools inactive for more than 7 days',   time: '1d ago'  },
  { id: 4, type: 'success', message: 'Reading Improvement Drive: 150 schools met target', time: '2d ago' },
]

export const INITIATIVES = [
  { id: 1, name: 'Reading Improvement Drive', progress: 68, schools: 320, color: '#1E88E5' },
  { id: 2, name: 'Maths Mastery Program',     progress: 45, schools: 210, color: '#28B463' },
  { id: 3, name: 'Teacher Training Phase 2',  progress: 82, schools: 450, color: '#FF8A00' },
]

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
   ALL STUDENTS  (2 per class-section = 26 total)
───────────────────────────────────────────── */
export const ALL_STUDENTS = [
  // Class 1
  { id: 'S001', emis: '1234567801', name: 'Arjun M',      gender: 'Male',   dob: '15-Jun-2015', class: '1',  section: 'A', fatherName: 'Murugan K',      motherName: 'Priya M',      mobile: '9876543201', address: '12 Anna Nagar, Kallakurichi',   bloodGroup: 'O+',  differentlyAbled: 'No',  avatar: '🐿️', coins: 320,  streak: 4,  points: 1200, mathScore: 72, engScore: 68, attendance: 91, lastActive: '1h ago'   },
  { id: 'S002', emis: '1234567802', name: 'Priya K',       gender: 'Female', dob: '22-Mar-2015', class: '1',  section: 'A', fatherName: 'Kannan R',       motherName: 'Suma K',       mobile: '9876543202', address: '45 Gandhi St, Sankarapuram',    bloodGroup: 'A+',  differentlyAbled: 'No',  avatar: '🐦', coins: 410,  streak: 7,  points: 1580, mathScore: 80, engScore: 85, attendance: 95, lastActive: '30m ago'  },
  // Class 2
  { id: 'S003', emis: '1234567803', name: 'Karthik R',     gender: 'Male',   dob: '08-Nov-2014', class: '2',  section: 'A', fatherName: 'Rajan T',        motherName: 'Kavitha R',    mobile: '9876543203', address: '78 Nehru Rd, Nedumanur',         bloodGroup: 'B+',  differentlyAbled: 'No',  avatar: '🐿️', coins: 530,  streak: 9,  points: 2100, mathScore: 65, engScore: 70, attendance: 88, lastActive: '2h ago'   },
  { id: 'S004', emis: '1234567804', name: 'Divya S',        gender: 'Female', dob: '14-Apr-2014', class: '2',  section: 'A', fatherName: 'Selvam K',       motherName: 'Radha S',      mobile: '9876543204', address: '33 Temple St, Kallakurichi',     bloodGroup: 'AB+', differentlyAbled: 'No',  avatar: '🐦', coins: 620,  streak: 12, points: 2450, mathScore: 88, engScore: 82, attendance: 97, lastActive: '45m ago'  },
  // Class 3
  { id: 'S005', emis: '1234567805', name: 'Rahul T',        gender: 'Male',   dob: '30-Jul-2013', class: '3',  section: 'A', fatherName: 'Thiyagu R',      motherName: 'Valli T',      mobile: '9876543205', address: '90 Market Rd, Sankarapuram',     bloodGroup: 'O-',  differentlyAbled: 'No',  avatar: '🐿️', coins: 280,  streak: 3,  points: 980,  mathScore: 55, engScore: 60, attendance: 79, lastActive: '1d ago'   },
  { id: 'S006', emis: '1234567806', name: 'Kavitha N',      gender: 'Female', dob: '05-Dec-2013', class: '3',  section: 'A', fatherName: 'Natarajan K',    motherName: 'Selvi N',      mobile: '9876543206', address: '67 Kovil St, Nedumanur',         bloodGroup: 'A-',  differentlyAbled: 'No',  avatar: '🐦', coins: 740,  streak: 14, points: 3100, mathScore: 91, engScore: 89, attendance: 99, lastActive: '20m ago'  },
  // Class 4
  { id: 'S007', emis: '1234567807', name: 'Surya P',        gender: 'Male',   dob: '18-Feb-2012', class: '4',  section: 'A', fatherName: 'Palanivel S',    motherName: 'Meena P',      mobile: '9876543207', address: '14 Bus Stand Rd, Kallakurichi',  bloodGroup: 'B-',  differentlyAbled: 'No',  avatar: '🐿️', coins: 460,  streak: 6,  points: 1870, mathScore: 74, engScore: 71, attendance: 90, lastActive: '3h ago'   },
  { id: 'S008', emis: '1234567808', name: 'Meena R',        gender: 'Female', dob: '26-Aug-2012', class: '4',  section: 'A', fatherName: 'Ramesh M',       motherName: 'Geetha R',     mobile: '9876543208', address: '52 School Lane, Sankarapuram',   bloodGroup: 'O+',  differentlyAbled: 'No',  avatar: '🐦', coins: 550,  streak: 10, points: 2200, mathScore: 83, engScore: 87, attendance: 94, lastActive: '1h ago'   },
  // Class 5A
  { id: 'S009', emis: '1234567809', name: 'Vikram S',       gender: 'Male',   dob: '03-Jan-2011', class: '5',  section: 'A', fatherName: 'Selvam P',       motherName: 'Meena S',      mobile: '9876543209', address: '23 Anna St, Nedumanur',          bloodGroup: 'AB-', differentlyAbled: 'No',  avatar: '🐿️', coins: 1250, streak: 12, points: 7850, mathScore: 85, engScore: 78, attendance: 95, lastActive: '2h ago'   },
  { id: 'S010', emis: '1234567810', name: 'Anitha K',       gender: 'Female', dob: '17-May-2011', class: '5',  section: 'A', fatherName: 'Krishnan A',     motherName: 'Leela K',      mobile: '9876543210', address: '88 Gandhi Rd, Kallakurichi',     bloodGroup: 'A+',  differentlyAbled: 'No',  avatar: '🐦', coins: 980,  streak: 15, points: 5600, mathScore: 92, engScore: 90, attendance: 98, lastActive: '30m ago'  },
  // Class 5B
  { id: 'S011', emis: '1234567811', name: 'Rajan M',        gender: 'Male',   dob: '09-Oct-2011', class: '5',  section: 'B', fatherName: 'Murugan R',      motherName: 'Vimala M',     mobile: '9876543211', address: '31 Nehru Nagar, Sankarapuram',   bloodGroup: 'B+',  differentlyAbled: 'No',  avatar: '🐿️', coins: 430,  streak: 5,  points: 1650, mathScore: 60, engScore: 65, attendance: 83, lastActive: '4h ago'   },
  { id: 'S012', emis: '1234567812', name: 'Lakshmi P',      gender: 'Female', dob: '28-Feb-2011', class: '5',  section: 'B', fatherName: 'Palanivel K',    motherName: 'Rani P',       mobile: '9876543212', address: '56 Market Rd, Nedumanur',        bloodGroup: 'O+',  differentlyAbled: 'No',  avatar: '🐦', coins: 720,  streak: 11, points: 3400, mathScore: 78, engScore: 84, attendance: 92, lastActive: '1h ago'   },
  // Class 6
  { id: 'S013', emis: '1234567813', name: 'Arun K',         gender: 'Male',   dob: '12-Jun-2010', class: '6',  section: 'A', fatherName: 'Kumaran A',      motherName: 'Kamala K',     mobile: '9876543213', address: '19 Kovil Rd, Kallakurichi',      bloodGroup: 'A-',  differentlyAbled: 'No',  avatar: '🐿️', coins: 390,  streak: 5,  points: 1500, mathScore: 62, engScore: 58, attendance: 80, lastActive: '3h ago'   },
  { id: 'S014', emis: '1234567814', name: 'Sumitha R',      gender: 'Female', dob: '07-Sep-2010', class: '6',  section: 'A', fatherName: 'Rajendran S',    motherName: 'Sumathi R',    mobile: '9876543214', address: '74 Temple Nagar, Sankarapuram',  bloodGroup: 'B+',  differentlyAbled: 'No',  avatar: '🐦', coins: 810,  streak: 13, points: 4200, mathScore: 89, engScore: 86, attendance: 96, lastActive: '40m ago'  },
  // Class 7
  { id: 'S015', emis: '1234567815', name: 'Deepak N',       gender: 'Male',   dob: '24-Mar-2009', class: '7',  section: 'A', fatherName: 'Natarajan D',    motherName: 'Deepa N',      mobile: '9876543215', address: '41 Station Rd, Nedumanur',       bloodGroup: 'O+',  differentlyAbled: 'Yes', avatar: '🐿️', coins: 340,  streak: 4,  points: 1300, mathScore: 50, engScore: 54, attendance: 76, lastActive: '2d ago'   },
  { id: 'S016', emis: '1234567816', name: 'Nithya S',       gender: 'Female', dob: '11-Nov-2009', class: '7',  section: 'A', fatherName: 'Suresh N',       motherName: 'Nirmala S',    mobile: '9876543216', address: '63 Park St, Kallakurichi',       bloodGroup: 'AB+', differentlyAbled: 'No',  avatar: '🐦', coins: 670,  streak: 9,  points: 3000, mathScore: 81, engScore: 83, attendance: 93, lastActive: '1h ago'   },
  // Class 8
  { id: 'S017', emis: '1234567817', name: 'Manoj R',        gender: 'Male',   dob: '02-Aug-2008', class: '8',  section: 'A', fatherName: 'Ravi M',         motherName: 'Usha R',       mobile: '9876543217', address: '86 Anna Nagar, Sankarapuram',    bloodGroup: 'B-',  differentlyAbled: 'No',  avatar: '🐿️', coins: 500,  streak: 7,  points: 2050, mathScore: 70, engScore: 66, attendance: 87, lastActive: '5h ago'   },
  { id: 'S018', emis: '1234567818', name: 'Revathi K',      gender: 'Female', dob: '16-Apr-2008', class: '8',  section: 'A', fatherName: 'Kandasamy R',    motherName: 'Revathi K',    mobile: '9876543218', address: '27 Gandhi St, Nedumanur',        bloodGroup: 'O-',  differentlyAbled: 'No',  avatar: '🐦', coins: 880,  streak: 16, points: 5100, mathScore: 94, engScore: 91, attendance: 99, lastActive: '15m ago'  },
  // Class 9
  { id: 'S019', emis: '1234567819', name: 'Santhosh P',     gender: 'Male',   dob: '20-Jan-2007', class: '9',  section: 'A', fatherName: 'Prabhu S',       motherName: 'Chitra P',     mobile: '9876543219', address: '58 Nehru Rd, Kallakurichi',      bloodGroup: 'A+',  differentlyAbled: 'No',  avatar: '🐿️', coins: 420,  streak: 6,  points: 1750, mathScore: 67, engScore: 63, attendance: 85, lastActive: '3h ago'   },
  { id: 'S020', emis: '1234567820', name: 'Preethi M',      gender: 'Female', dob: '04-Jul-2007', class: '9',  section: 'A', fatherName: 'Mani P',         motherName: 'Priya M',      mobile: '9876543220', address: '39 Market Lane, Sankarapuram',   bloodGroup: 'B+',  differentlyAbled: 'No',  avatar: '🐦', coins: 760,  streak: 11, points: 3800, mathScore: 86, engScore: 88, attendance: 94, lastActive: '2h ago'   },
  // Class 10
  { id: 'S021', emis: '1234567821', name: 'Gokul S',        gender: 'Male',   dob: '29-Oct-2006', class: '10', section: 'A', fatherName: 'Suresh G',       motherName: 'Kokila S',     mobile: '9876543221', address: '72 Kovil St, Nedumanur',         bloodGroup: 'O+',  differentlyAbled: 'No',  avatar: '🐿️', coins: 610,  streak: 8,  points: 2700, mathScore: 75, engScore: 72, attendance: 89, lastActive: '1h ago'   },
  { id: 'S022', emis: '1234567822', name: 'Dharani R',      gender: 'Female', dob: '13-Feb-2006', class: '10', section: 'A', fatherName: 'Ramesh D',       motherName: 'Dharani R',    mobile: '9876543222', address: '15 Raja St, Kallakurichi',       bloodGroup: 'AB+', differentlyAbled: 'No',  avatar: '🐦', coins: 930,  streak: 14, points: 6200, mathScore: 93, engScore: 92, attendance: 97, lastActive: '25m ago'  },
  // Class 11
  { id: 'S023', emis: '1234567823', name: 'Prasad K',       gender: 'Male',   dob: '06-May-2005', class: '11', section: 'A', fatherName: 'Kathir P',       motherName: 'Kamala K',     mobile: '9876543223', address: '48 School Rd, Sankarapuram',     bloodGroup: 'A-',  differentlyAbled: 'No',  avatar: '🐿️', coins: 480,  streak: 7,  points: 2300, mathScore: 69, engScore: 67, attendance: 86, lastActive: '4h ago'   },
  { id: 'S024', emis: '1234567824', name: 'Kavya N',        gender: 'Female', dob: '21-Sep-2005', class: '11', section: 'A', fatherName: 'Natarajan K',    motherName: 'Kavitha N',    mobile: '9876543224', address: '83 Temple Rd, Nedumanur',        bloodGroup: 'B+',  differentlyAbled: 'No',  avatar: '🐦', coins: 840,  streak: 13, points: 4800, mathScore: 90, engScore: 88, attendance: 96, lastActive: '50m ago'  },
  // Class 12
  { id: 'S025', emis: '1234567825', name: 'Vinoth R',       gender: 'Male',   dob: '10-Dec-2004', class: '12', section: 'A', fatherName: 'Rajan V',        motherName: 'Valli R',      mobile: '9876543225', address: '36 Gandhi Nagar, Kallakurichi',  bloodGroup: 'O+',  differentlyAbled: 'No',  avatar: '🐿️', coins: 560,  streak: 9,  points: 2600, mathScore: 77, engScore: 74, attendance: 90, lastActive: '2h ago'   },
  { id: 'S026', emis: '1234567826', name: 'Selvi M',        gender: 'Female', dob: '25-Mar-2004', class: '12', section: 'A', fatherName: 'Muthu S',        motherName: 'Selvi M',      mobile: '9876543226', address: '61 Nehru St, Sankarapuram',      bloodGroup: 'A+',  differentlyAbled: 'No',  avatar: '🐦', coins: 990,  streak: 17, points: 7100, mathScore: 96, engScore: 94, attendance: 98, lastActive: '10m ago'  },
]

/* ─────────────────────────────────────────────
   ALL STAFF  (20 teachers, same school)
───────────────────────────────────────────── */
export const ALL_STAFF = [
  { id: 'T001', emis: '2100000001', name: 'Mr. Murugan K',       avatar: '👨‍🏫', gender: 'Male',   subject: 'Maths',   qualification: 'B.Ed', experience: 14, dob: '12-03-1980', bloodGroup: 'O+' },
  { id: 'T002', emis: '2100000002', name: 'Ms. Revathi S',        avatar: '👩‍🏫', gender: 'Female', subject: 'English', qualification: 'B.Ed', experience: 10, dob: '25-07-1984', bloodGroup: 'A+' },
  { id: 'T003', emis: '2100000003', name: 'Mr. Selvam R',         avatar: '👨‍🏫', gender: 'Male',   subject: 'Maths',   qualification: 'M.Ed', experience: 18, dob: '08-11-1976', bloodGroup: 'B+' },
  { id: 'T004', emis: '2100000004', name: 'Ms. Kavitha P',        avatar: '👩‍🏫', gender: 'Female', subject: 'English', qualification: 'B.Ed', experience: 8,  dob: '14-06-1986', bloodGroup: 'AB+' },
  { id: 'T005', emis: '2100000005', name: 'Mr. Rajan M',          avatar: '👨‍🏫', gender: 'Male',   subject: 'Maths',   qualification: 'B.Ed', experience: 12, dob: '30-01-1982', bloodGroup: 'O-' },
  { id: 'T006', emis: '2100000006', name: 'Ms. Meenakshi K',      avatar: '👩‍🏫', gender: 'Female', subject: 'English', qualification: 'M.Ed', experience: 15, dob: '19-09-1979', bloodGroup: 'A-' },
  { id: 'T007', emis: '2100000007', name: 'Mr. Suresh N',         avatar: '👨‍🏫', gender: 'Male',   subject: 'Maths',   qualification: 'B.Ed', experience: 9,  dob: '05-04-1985', bloodGroup: 'B-' },
  { id: 'T008', emis: '2100000008', name: 'Ms. Padmavathi R',     avatar: '👩‍🏫', gender: 'Female', subject: 'English', qualification: 'B.Ed', experience: 11, dob: '22-12-1983', bloodGroup: 'O+' },
  { id: 'T009', emis: '2100000009', name: 'Mr. Arumugam S',       avatar: '👨‍🏫', gender: 'Male',   subject: 'Maths',   qualification: 'M.Ed', experience: 20, dob: '17-08-1974', bloodGroup: 'AB-' },
  { id: 'T010', emis: '2100000010', name: 'Ms. Vasantha K',       avatar: '👩‍🏫', gender: 'Female', subject: 'English', qualification: 'B.Ed', experience: 7,  dob: '03-02-1987', bloodGroup: 'A+' },
  { id: 'T011', emis: '2100000011', name: 'Mr. Krishnamurthy P',  avatar: '👨‍🏫', gender: 'Male',   subject: 'Maths',   qualification: 'M.Ed', experience: 22, dob: '11-05-1972', bloodGroup: 'O+' },
  { id: 'T012', emis: '2100000012', name: 'Ms. Indrani M',        avatar: '👩‍🏫', gender: 'Female', subject: 'English', qualification: 'B.Ed', experience: 6,  dob: '28-10-1988', bloodGroup: 'B+' },
  { id: 'T013', emis: '2100000013', name: 'Mr. Senthilkumar R',   avatar: '👨‍🏫', gender: 'Male',   subject: 'Maths',   qualification: 'B.Ed', experience: 13, dob: '16-07-1981', bloodGroup: 'A-' },
  { id: 'T014', emis: '2100000014', name: 'Ms. Dhanalakshmi S',   avatar: '👩‍🏫', gender: 'Female', subject: 'English', qualification: 'M.Ed', experience: 16, dob: '09-03-1978', bloodGroup: 'O-' },
  { id: 'T015', emis: '2100000015', name: 'Mr. Palanivel K',      avatar: '👨‍🏫', gender: 'Male',   subject: 'Maths',   qualification: 'B.Ed', experience: 5,  dob: '21-11-1989', bloodGroup: 'AB+' },
  { id: 'T016', emis: '2100000016', name: 'Ms. Saranya R',        avatar: '👩‍🏫', gender: 'Female', subject: 'English', qualification: 'B.Ed', experience: 4,  dob: '07-06-1990', bloodGroup: 'B+' },
  { id: 'T017', emis: '2100000017', name: 'Mr. Balamurugan N',    avatar: '👨‍🏫', gender: 'Male',   subject: 'Maths',   qualification: 'M.Ed', experience: 19, dob: '14-01-1975', bloodGroup: 'O+' },
  { id: 'T018', emis: '2100000018', name: 'Ms. Karpagam P',       avatar: '👩‍🏫', gender: 'Female', subject: 'English', qualification: 'B.Ed', experience: 8,  dob: '31-08-1986', bloodGroup: 'A+' },
  { id: 'T019', emis: '2100000019', name: 'Mr. Thiyagarajan S',   avatar: '👨‍🏫', gender: 'Male',   subject: 'Maths',   qualification: 'M.Ed', experience: 25, dob: '02-04-1969', bloodGroup: 'B-' },
  { id: 'T020', emis: '2100000020', name: 'Ms. Nirmala K',        avatar: '👩‍🏫', gender: 'Female', subject: 'English', qualification: 'B.Ed', experience: 3,  dob: '18-09-1991', bloodGroup: 'AB+' },
]

/* ─────────────────────────────────────────────
   CLASS–TEACHER ASSIGNMENTS
   Managed by HM. Not all staff need to be assigned.
   HM can change these anytime.
   Stored in localStorage under key 'hm_class_assignments'
   so HM changes persist across sessions.
───────────────────────────────────────────── */
export const DEFAULT_CLASS_ASSIGNMENTS = {
  '1':  'T001',   // Mr. Murugan K
  '2':  'T002',   // Ms. Revathi S
  '3':  'T003',   // Mr. Selvam R
  '4':  'T004',   // Ms. Kavitha P
  '5A': 'T005',   // Mr. Rajan M
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

export function getClassAssignments() {
  try {
    const saved = localStorage.getItem('hm_class_assignments')
    return saved ? JSON.parse(saved) : DEFAULT_CLASS_ASSIGNMENTS
  } catch {
    return DEFAULT_CLASS_ASSIGNMENTS
  }
}

export function saveClassAssignments(assignments) {
  localStorage.setItem('hm_class_assignments', JSON.stringify(assignments))
}

/* ─────────────────────────────────────────────
   AUTH USERS  (mock login — one per role)
   Student  → Vikram S  (Class 5A)
   Teacher  → Mr. Rajan M  (Class 5A teacher)
   HM       → Mr. Suresh Kumar
───────────────────────────────────────────── */
export const USERS = {
  student: {
    id: 'S009',
    name: 'Vikram S',
    role: 'student',
    class: '5A',
    school: SCHOOL.name,
    schoolCode: SCHOOL.code,
    block: SCHOOL.block,
    district: SCHOOL.district,
    state: SCHOOL.state,
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
    id: 'T005',
    name: 'Mr. Rajan M',
    role: 'teacher',
    class: '5A',
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

/* ─────────────────────────────────────────────
   TEACHER DASHBOARD — Class 5A students
───────────────────────────────────────────── */
export const CLASS_STUDENTS = ALL_STUDENTS
  .filter(s => s.class === '5A')
  .map(s => ({
    id:         s.id,
    name:       s.name,
    mathScore:  s.mathScore,
    engScore:   s.engScore,
    attendance: s.attendance,
    status:     s.mathScore >= 85 ? 'excellent' : s.mathScore >= 65 ? 'good' : 'attention',
    lastActive: s.lastActive,
  }))

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

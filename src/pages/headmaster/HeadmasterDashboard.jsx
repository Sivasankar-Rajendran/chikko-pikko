import React, { useState, useRef, useEffect } from 'react'
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import { useAuth } from '../../context/AuthContext'
import {
  SCHOOL, CLASS_LIST, ALL_STAFF, ALL_STUDENTS,
  DEFAULT_CLASS_ASSIGNMENTS,
} from '../../data/mockData'
import {
  getAllStudentsFS, getAllStaffFS, getClassAssignmentsFS,
  saveClassAssignmentsFS, saveStudentFS, updateStudentFS,
  deleteStudentFS, saveStaffFS, deleteStaffFS,
  seedDatabase, isSeeded, deleteAllStudentsFS, deleteAllStaffFS,
} from '../../services/firestore'

/* ── Custom dropdown (preserves app font in option list) ─── */
function CustomSelect({ value, onChange, options, disabled, tight }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = options.find(o => o.value === value) || options[0]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(v => !v)}
        className={`flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-xl border-2 text-sm font-semibold text-gray-700 bg-white transition-colors whitespace-nowrap
          ${open ? 'border-blue-400' : 'border-gray-200 hover:border-gray-300'}
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
        {selected.label}
        <span className="text-gray-400 text-xs">▼</span>
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-30 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-full">
          {options.map(o => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false) }}
              className={`w-full text-left px-4 ${tight ? 'py-1' : 'py-1.5'} text-sm font-semibold transition-colors
                ${o.value === value ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Teacher-picker modal ────────────────────────────────── */
function AssignModal({ cls, currentTeacherId, assignments, staffList, onSave, onClose }) {
  const [selected, setSelected] = useState(currentTeacherId || '')

  // teacher → [classes] (supports multiple classes per teacher)
  const assignedClassesMap = staffList.reduce((acc, s) => {
    acc[s.id] = Object.entries(assignments)
      .filter(([, tid]) => tid === s.id)
      .map(([c]) => c)
    return acc
  }, {})

  function handleSave() {
    onSave(cls, selected)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Modal header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5">
          <h2 className="text-xl font-display text-white font-bold">Assign Class Teacher</h2>
          <p className="text-white/80 text-sm mt-0.5">Standard {cls.split('|')[0]}{cls.split('|')[1] ? ` · Section ${cls.split('|')[1]}` : ''} — select a teacher below</p>
        </div>

        {/* Staff list */}
        <div className="overflow-y-auto max-h-[420px] px-4 py-3 space-y-2">
          {/* Unassign option */}
          <label className={`flex items-center gap-4 px-4 py-3 rounded-2xl border-2 cursor-pointer transition-all ${
            selected === '' ? 'border-red-300 bg-red-50' : 'border-gray-100 hover:border-gray-200'
          }`}>
            <input type="radio" name="teacher" value=""
              checked={selected === ''}
              onChange={() => setSelected('')}
              className="accent-red-500 w-4 h-4 flex-shrink-0" />
            <div className="text-xl flex-shrink-0">🚫</div>
            <div>
              <div className="text-sm font-bold text-gray-600">No Teacher (Unassign)</div>
              <div className="text-xs text-gray-400">Remove current assignment for Std {cls}</div>
            </div>
          </label>

          {staffList.map(s => {
            const otherClasses = assignedClassesMap[s.id].filter(c => c !== cls)
            const isCurrent    = s.id === currentTeacherId
            const isChosen     = selected === s.id

            return (
              <label key={s.id} className={`flex items-center gap-4 px-4 py-3 rounded-2xl border-2 cursor-pointer transition-all ${
                isChosen ? 'border-amber-400 bg-amber-50' : 'border-gray-100 hover:border-gray-200'
              }`}>
                <input type="radio" name="teacher" value={s.id}
                  checked={isChosen}
                  onChange={() => setSelected(s.id)}
                  className="accent-amber-500 w-4 h-4 flex-shrink-0" />
                <div className="text-2xl flex-shrink-0">{s.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-800">{s.name}</div>
                  <div className="text-xs text-gray-400">{s.subject} · {s.qualification} · {s.experience} yrs exp</div>
                </div>
                <div className="flex flex-wrap gap-1 flex-shrink-0 justify-end">
                  {isCurrent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">Current</span>
                  )}
                  {otherClasses.map(c => (
                    <span key={c} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Std {c.includes('|') ? c.split('|')[0] + (c.split('|')[1] ? c.split('|')[1] : '') : c}</span>
                  ))}
                </div>
              </label>
            )
          })}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={handleSave}
            className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all shadow-md">
            Save Assignment
          </button>
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Student edit modal ──────────────────────────────────── */
const CLASS_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1))
const DOB_RE = /^\d{2}-\d{2}-\d{4}$/
function isValidDOB(dob, minYear = 2000) {
  if (!DOB_RE.test(dob)) return null
  const [dd, mm, yyyy] = dob.split('-').map(Number)
  if (mm < 1 || mm > 12) return 'Invalid month — must be 01 to 12'
  if (dd < 1 || dd > 31) return 'Invalid day — must be 01 to 31'
  const d = new Date(yyyy, mm - 1, dd)
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd)
    return 'Invalid date'
  if (yyyy < minYear) return `Year must be ${minYear} or later`
  if (d > new Date()) return 'Date of birth cannot be in the future'
  return null
}
const nameOnly  = v => v.replace(/[^a-zA-Z\s.]/g, '')
const sectionFmt = v => v.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()

function EditStudentModal({ student, onSave, onClose, existingEmis }) {
  const isNew = !student.id
  const [form, setForm] = useState({
    ...student,
    class: (student.class || '').replace(/[A-Za-z]/g, ''),
  })
  const [dobErr, setDobErr]   = useState('')
  const [emisErr, setEmisErr] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function handleSave() {
    let valid = true
    if (isNew) {
      if (!form.emis || !/^\d{10}$/.test(form.emis)) { setEmisErr('EMIS must be exactly 10 digits'); valid = false }
      else if (existingEmis && existingEmis.has(form.emis)) { setEmisErr('EMIS already exists'); valid = false }
      else setEmisErr('')
    }
    if (DOB_RE.test(form.dob)) {
      const dobError = isValidDOB(form.dob)
      if (dobError) { setDobErr(dobError); valid = false } else setDobErr('')
    } else if (form.dob) {
      setDobErr('Enter a valid date in DD-MM-YYYY format'); valid = false
    } else setDobErr('')
    if (!valid) return
    onSave({
      ...form,
      id: student.id || `S_${form.emis}`,
      avatar: '🎒', coins: 0, streak: 0, points: 0,
      mathScore: 0, engScore: 0, attendance: 0, lastActive: '—',
    })
  }

  const inp = 'w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 focus:outline-none focus:border-blue-400'
  const sel = inp + ' bg-white'

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display text-white font-bold">{isNew ? 'Add New Student' : 'Edit Student'}</h2>
            {!isNew && <p className="text-white/80 text-sm mt-0.5">EMIS: {student.emis}</p>}
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="overflow-y-auto max-h-[70vh] px-6 py-5">
          <div className="grid grid-cols-2 gap-4">

            {/* EMIS */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">EMIS Number <span className="text-red-400">*</span></label>
              <input className={inp} value={form.emis || ''} maxLength={10}
                readOnly={!isNew}
                onChange={e => set('emis', e.target.value.replace(/\D/g, '').slice(0, 10))}
                style={!isNew ? { background: '#f9fafb', color: '#6b7280' } : {}} />
              {emisErr && <p className="text-red-500 text-xs mt-1">{emisErr}</p>}
            </div>

            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Student Name <span className="text-red-400">*</span></label>
              <input className={inp} value={form.name || ''}
                onChange={e => set('name', nameOnly(e.target.value))} />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Gender <span className="text-red-400">*</span></label>
              <CustomSelect tight value={form.gender || ''} onChange={v => set('gender', v)}
                options={[{ value:'', label:'— select —' }, ...['Male','Female','Transgender'].map(g => ({ value: g, label: g }))]} />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Date of Birth <span className="text-red-400">*</span> <span className="font-normal text-gray-400">(DD-MM-YYYY)</span></label>
              <input
                className={inp + (dobErr ? ' border-red-400' : '')}
                value={form.dob || ''}
                placeholder="DD-MM-YYYY"
                maxLength={10}
                onChange={e => { set('dob', e.target.value); setDobErr('') }} />
              {dobErr && <p className="text-red-500 text-[11px] mt-0.5 font-semibold">{dobErr}</p>}
            </div>

            {/* Class */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Class <span className="text-red-400">*</span></label>
              <CustomSelect tight value={form.class || ''} onChange={v => set('class', v)}
                options={[{ value:'', label:'— select —' }, ...CLASS_OPTIONS.map(n => ({ value: n, label: `Std ${n}` }))]} />
            </div>

            {/* Section */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Section <span className="font-normal text-gray-400">(optional · A–Z or A1, B2…)</span></label>
              <input className={inp} value={form.section || ''}
                placeholder="e.g. A, B, A1, B2"
                onChange={e => set('section', sectionFmt(e.target.value))} />
            </div>

            {/* Father Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Father Name</label>
              <input className={inp} value={form.fatherName || ''}
                onChange={e => set('fatherName', nameOnly(e.target.value))} />
            </div>

            {/* Mother Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Mother Name</label>
              <input className={inp} value={form.motherName || ''}
                onChange={e => set('motherName', nameOnly(e.target.value))} />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Mobile Number</label>
              <input className={inp} value={form.mobile || ''}
                onChange={e => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} />
            </div>

            {/* Blood Group + Differently Abled side by side in right column */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Blood Group</label>
                <CustomSelect tight value={form.bloodGroup || ''} onChange={v => set('bloodGroup', v)}
                  options={[{ value:'', label:'— select —' }, ...['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => ({ value: b, label: b }))]} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Differently Abled</label>
                <CustomSelect tight value={form.differentlyAbled || 'No'} onChange={v => set('differentlyAbled', v)}
                  options={[{ value:'No', label:'No' }, { value:'Yes', label:'Yes' }]} />
              </div>
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1">Address</label>
              <input className={inp} value={form.address || ''}
                onChange={e => set('address', e.target.value)} />
            </div>

          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={handleSave}
            className="flex-1 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-all shadow-md">
            {isNew ? 'Add Student' : 'Save Changes'}
          </button>
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Staff edit / add modal ─────────────────────────────── */
const SUBJECTS       = ['Maths', 'English', 'Tamil', 'Science', 'Social Science', 'Computer Science']
const QUALIFICATIONS = ['B.Ed', 'M.Ed', 'B.A B.Ed', 'M.A M.Ed', 'B.Sc B.Ed', 'M.Sc M.Ed']
const BLOOD_GROUPS   = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

function EditStaffModal({ staff, onSave, onClose, existingEmis }) {
  const isNew = !staff.id
  const inp   = 'w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-blue-400'
  const sel   = inp + ' bg-white'

  const [form, setForm] = useState({
    emis:          staff.emis          || '',
    name:          staff.name          || '',
    gender:        staff.gender        || '',
    subject:       staff.subject       || '',
    qualification: staff.qualification || '',
    experience:    staff.experience    || '',
    dob:           staff.dob           || '',
    bloodGroup:    staff.bloodGroup    || '',
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function handleSave() {
    const errs = {}
    if (!form.emis || !/^\d{10}$/.test(form.emis)) errs.emis = 'EMIS must be exactly 10 digits'
    else if (existingEmis.has(form.emis) && form.emis !== staff.emis) errs.emis = 'EMIS already exists'
    if (!form.name.trim()) errs.name = 'Name is required'
    if (form.dob && DOB_RE.test(form.dob)) {
      const dobErr = isValidDOB(form.dob, 1950)
      if (dobErr) errs.dob = dobErr
    } else if (form.dob) {
      errs.dob = 'Use DD-MM-YYYY format'
    }
    if (!form.experience || isNaN(Number(form.experience)) || Number(form.experience) < 0)
      errs.experience = 'Enter valid years'
    if (Object.keys(errs).length) { setErrors(errs); return }

    const avatar = form.gender === 'Male' ? '👨‍🏫' : '👩‍🏫'
    onSave({
      ...staff,
      emis:          form.emis,
      name:          form.name.trim(),
      gender:        form.gender,
      subject:       form.subject,
      qualification: form.qualification,
      experience:    Number(form.experience),
      dob:           form.dob,
      bloodGroup:    form.bloodGroup,
      avatar,
      id: staff.id || `T_${form.emis}`,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-display font-bold text-lg">{isNew ? 'Add New Staff' : 'Edit Staff'}</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-4">

            {/* EMIS */}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1">EMIS <span className="text-red-400">*</span></label>
              <input className={inp} value={form.emis} maxLength={10}
                onChange={e => set('emis', e.target.value.replace(/\D/g, ''))} placeholder="10-digit EMIS" />
              {errors.emis && <p className="text-red-500 text-xs mt-1">{errors.emis}</p>}
            </div>

            {/* Name */}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1">Name <span className="text-red-400">*</span></label>
              <input className={inp} value={form.name}
                onChange={e => set('name', e.target.value.replace(/[^a-zA-Z\s.]/g, ''))} placeholder="e.g. Mr. Murugan K" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Gender</label>
              <CustomSelect tight value={form.gender} onChange={v => set('gender', v)}
                options={[{ value:'', label:'— select —' }, ...['Male','Female','Transgender'].map(g => ({ value: g, label: g }))]} />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Experience (yrs) <span className="text-red-400">*</span></label>
              <input className={inp} value={form.experience} type="number" min="0" max="50" step="0.1"
                onChange={e => {
                  const v = e.target.value
                  if (v === '' || /^\d+(\.\d?)?$/.test(v)) set('experience', v)
                }} placeholder="e.g. 10" />
              {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Subject</label>
              <CustomSelect tight value={form.subject} onChange={v => set('subject', v)}
                options={[{ value:'', label:'— select —' }, ...SUBJECTS.map(s => ({ value: s, label: s }))]} />
            </div>

            {/* Qualification */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Qualification</label>
              <CustomSelect tight value={form.qualification} onChange={v => set('qualification', v)}
                options={[{ value:'', label:'— select —' }, ...QUALIFICATIONS.map(q => ({ value: q, label: q }))]} />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">DOB (DD-MM-YYYY)</label>
              <input className={inp} value={form.dob} maxLength={10} placeholder="e.g. 15-06-1985"
                onChange={e => {
                  let v = e.target.value.replace(/[^\d-]/g, '')
                  set('dob', v)
                }} />
              {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Blood Group</label>
              <CustomSelect tight value={form.bloodGroup} onChange={v => set('bloodGroup', v)}
                options={[{ value:'', label:'— Select —' }, ...BLOOD_GROUPS.map(b => ({ value: b, label: b }))]} />
            </div>

          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={handleSave}
            className="flex-1 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-all shadow-md">
            {isNew ? 'Add Staff' : 'Save Changes'}
          </button>
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Dashboard ──────────────────────────────────────── */
export default function HeadmasterDashboard() {
  // ── all hooks first ──
  const { user, logout } = useAuth()
  const [assignments,     setAssignments]     = useState(DEFAULT_CLASS_ASSIGNMENTS)
  const [modalClass,      setModalClass]      = useState(null)
  const [savedMsg,        setSavedMsg]        = useState('')
  const [showAssignments, setShowAssignments] = useState(true)
  const [showStaff,       setShowStaff]       = useState(true)
  const [showStudents,    setShowStudents]    = useState(true)
  const [staffSort,       setStaffSort]       = useState('unassigned-first')
  const [staffList,       setStaffList]       = useState([])
  const [editingStaff,    setEditingStaff]    = useState(null)
  const [deleteStaffConfirm, setDeleteStaffConfirm] = useState(null)
  const [students,        setStudents]        = useState([])
  const [editingStudent,  setEditingStudent]  = useState(null)
  const [classFilter,     setClassFilter]     = useState('All')
  const [sectionFilter,   setSectionFilter]   = useState('All')
  const [studentSearch,   setStudentSearch]   = useState('')
  const [deleteConfirm,   setDeleteConfirm]   = useState(null)
  const [uploadResults,   setUploadResults]   = useState(null)
  const [dbLoading,       setDbLoading]       = useState(true)
  const [seeding,         setSeeding]         = useState(false)
  const uploadRef = useRef()

  // Load all data from Firestore on mount
  useEffect(() => {
    async function loadAll() {
      setDbLoading(true)
      try {
        const seeded = await isSeeded()
        if (!seeded) {
          // First run — auto-seed Firestore from mockData
          setSeeding(true)
          await seedDatabase(DEFAULT_CLASS_ASSIGNMENTS)
          setSeeding(false)
        }
        const [fsStudents, fsStaff, fsAssignments] = await Promise.all([
          getAllStudentsFS(),
          getAllStaffFS(),
          getClassAssignmentsFS(),
        ])
        setStudents(fsStudents)
        setStaffList(fsStaff.length ? fsStaff : ALL_STAFF)
        setAssignments(fsAssignments || DEFAULT_CLASS_ASSIGNMENTS)
      } catch (err) {
        console.error('Firestore load failed, using local data', err)
        setStudents(ALL_STUDENTS)
        setStaffList(ALL_STAFF)
        setAssignments(DEFAULT_CLASS_ASSIGNMENTS)
      } finally {
        setDbLoading(false)
      }
    }
    loadAll()
  }, [])

  // ── derived values ──
  const staffById = Object.fromEntries(staffList.map(s => [s.id, s]))

  // Key format: "classNum|section"  e.g. '11|A', '5|B', '1|'
  // Separator avoids ambiguity when section starts with a digit (e.g. class 11 + section A3 ≠ class 113)
  const clsKey = s => {
    const num = (s.class || '').replace(/[A-Za-z]/g, '')
    const sec = s.section || ''
    return `${num}|${sec}`
  }
  const clsNum  = k => k.split('|')[0]
  const clsSec  = k => k.split('|')[1] || ''

  // Look up teacher: try new key → old combined (e.g. '5A') → number-only (e.g. '5')
  const getAssignment = cls => {
    if (assignments[cls] !== undefined) return assignments[cls]
    const [num, sec] = cls.split('|')
    const oldCombined = (num || '') + (sec || '')
    if (assignments[oldCombined] !== undefined) return assignments[oldCombined]
    // Only fall back to number-only key when this class has no section
    if (!sec) return assignments[num]
    return undefined
  }

  // unique class+section keys from live students, sorted numerically then by section
  const numOf = k => parseInt(clsNum(k), 10) || 0
  const dynamicClassList = [...new Set(students.map(clsKey).filter(k => clsNum(k)))]
    .sort((a, b) => {
      const diff = numOf(a) - numOf(b)
      if (diff !== 0) return diff
      return clsSec(a).localeCompare(clsSec(b))
    })

  const studentCount = Object.fromEntries(
    dynamicClassList.map(cls => [cls, students.filter(s => clsKey(s) === cls).length])
  )
  const classesWithTeacher    = dynamicClassList.filter(cls => !!getAssignment(cls)).length
  const classesWithoutTeacher = dynamicClassList.length - classesWithTeacher
  // Resolved assignments: what each staff member is actually covering (via getAssignment)
  const resolvedAssignments = Object.fromEntries(
    dynamicClassList.map(cls => [cls, getAssignment(cls)]).filter(([, tid]) => tid)
  )
  const staffAssigned   = new Set(Object.values(resolvedAssignments).filter(Boolean)).size
  const staffUnassigned = staffList.length - staffAssigned

  // Lowest class number assigned to a staff member (for ordering within assigned group)
  function minClassNum(staffId) {
    const nums = Object.entries(resolvedAssignments)
      .filter(([, tid]) => tid === staffId)
      .map(([c]) => parseInt(c.split('|')[0]) || 0)
    return nums.length ? Math.min(...nums) : Infinity
  }

  const sortedStaff = [...staffList].sort((a, b) => {
    const aAssigned = Object.values(resolvedAssignments).some(tid => tid === a.id)
    const bAssigned = Object.values(resolvedAssignments).some(tid => tid === b.id)

    if (staffSort === 'unassigned-first') {
      if (aAssigned !== bAssigned) return aAssigned ? 1 : -1
      if (!aAssigned) return 0
      return minClassNum(a.id) - minClassNum(b.id)
    } else {
      if (aAssigned !== bAssigned) return bAssigned ? 1 : -1
      if (!aAssigned) return 0
      return minClassNum(a.id) - minClassNum(b.id)
    }
  })

  function handleStudentSave(updated) {
    setStudents(prev => {
      const exists = prev.find(s => s.id === updated.id)
      return exists ? prev.map(s => s.id === updated.id ? updated : s) : [...prev, updated]
    })
    saveStudentFS(updated).catch(console.error)
    setEditingStudent(null)
  }

  async function handleDownloadTemplate() {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet('Students')

    ws.columns = [
      { header: 'EMIS',             key: 'emis',             width: 14 },
      { header: 'Student Name',     key: 'name',             width: 20 },
      { header: 'Gender',           key: 'gender',           width: 13 },
      { header: 'DOB',              key: 'dob',              width: 13 },
      { header: 'Class',            key: 'class',            width: 8  },
      { header: 'Section',          key: 'section',          width: 9  },
      { header: 'Father Name',      key: 'fatherName',       width: 18 },
      { header: 'Mother Name',      key: 'motherName',       width: 18 },
      { header: 'Mobile',           key: 'mobile',           width: 14 },
      { header: 'Blood Group',      key: 'bloodGroup',       width: 13 },
      { header: 'Differently Abled',key: 'differentlyAbled', width: 17 },
      { header: 'Address',          key: 'address',          width: 30 },
    ]

    // Style header row
    const header = ws.getRow(1)
    header.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } }
    header.alignment = { vertical: 'middle', horizontal: 'center' }
    header.height = 20

    // Sample row
    ws.addRow(['1234567801','Arjun M','Male','15-06-2012','5','A','Murugan K','Priya M','9876543201','O+','No','48 School Rd, Sankarapuram'])
    ws.getRow(2).font = { color: { argb: 'FF6B7280' }, italic: true }

    // Add dropdowns for rows 2–500
    for (let r = 2; r <= 500; r++) {
      ws.getCell(`C${r}`).dataValidation = {
        type: 'list', allowBlank: true,
        formulae: ['"Male,Female,Transgender"'],
        showErrorMessage: true,
        errorTitle: 'Invalid Gender',
        error: 'Select Male, Female, or Transgender',
      }
      ws.getCell(`E${r}`).dataValidation = {
        type: 'list', allowBlank: true,
        formulae: ['"1,2,3,4,5,6,7,8,9,10,11,12"'],
        showErrorMessage: true,
        errorTitle: 'Invalid Class',
        error: 'Select a class between 1 and 12',
      }
      ws.getCell(`J${r}`).dataValidation = {
        type: 'list', allowBlank: true,
        formulae: ['"A+,A-,B+,B-,AB+,AB-,O+,O-"'],
        showErrorMessage: true,
        errorTitle: 'Invalid Blood Group',
        error: 'Select a valid blood group',
      }
    }

    // Force DOB column as Text so Excel doesn't auto-convert to Date type
    for (let r = 2; r <= 500; r++) {
      ws.getCell(`D${r}`).numFmt = '@'
    }

    // DOB column hint
    ws.getColumn('D').note = 'Format: DD-MM-YYYY  e.g. 15-06-2012'

    const buffer = await wb.xlsx.writeBuffer()
    const blob   = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url    = URL.createObjectURL(blob)
    const a      = document.createElement('a')
    a.href = url
    a.download = 'student_upload_template.xlsx'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleExcelUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      const wb   = XLSX.read(evt.target.result, { type: 'binary', cellDates: true })
      const ws   = wb.Sheets[wb.SheetNames[0]]
      // raw:false + dateNF forces any date-type cell to come back as DD-MM-YYYY string
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false, dateNF: 'DD-MM-YYYY' })

      const ok = [], errors = []
      const existingEmis = new Set(students.map(s => s.emis))

      rows.forEach((row, idx) => {
        const rowNum = idx + 2
        const emis   = String(row['EMIS'] || '').trim().replace(/\.0$/, '')
        const name   = String(row['Student Name'] || '').trim()
        const dob    = String(row['DOB'] || '').trim()
        const cls    = String(row['Class'] || '').trim()
        const gender = String(row['Gender'] || '').trim()

        if (!emis)                           { errors.push({ rowNum, emis: emis||'—', name, reason: 'EMIS is mandatory' }); return }
        if (!/^\d{10}$/.test(emis))          { errors.push({ rowNum, emis, name, reason: 'EMIS must be exactly 10 digits' }); return }
        if (existingEmis.has(emis))          { errors.push({ rowNum, emis, name, reason: 'EMIS already exists' }); return }
        if (!name)                           { errors.push({ rowNum, emis, name: '—', reason: 'Student Name is required' }); return }
        if (!['Male','Female','Transgender'].includes(gender)) { errors.push({ rowNum, emis, name, reason: `Invalid gender${gender ? ` "${gender}"` : ''}` }); return }
        if (!DOB_RE.test(dob))              { errors.push({ rowNum, emis, name, reason: 'DOB must be DD-MM-YYYY (e.g. 15-06-2012)' }); return }
        const dobErr = isValidDOB(dob)
        if (dobErr)                         { errors.push({ rowNum, emis, name, reason: dobErr }); return }
        if (!cls || isNaN(parseInt(cls)) || parseInt(cls) < 1 || parseInt(cls) > 12)
                                             { errors.push({ rowNum, emis, name, reason: `Invalid class${cls ? ` "${cls}"` : ''}` }); return }

        const section = String(row['Section'] || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
        const student = {
          id:               `S_${emis}`,
          emis,
          name,
          gender,
          dob,
          class:            cls,
          section,
          fatherName:       String(row['Father Name']       || '').trim(),
          motherName:       String(row['Mother Name']       || '').trim(),
          mobile:           String(row['Mobile']            || '').trim(),
          bloodGroup:       String(row['Blood Group']       || '').trim(),
          differentlyAbled: String(row['Differently Abled'] || 'No').trim(),
          address:          String(row['Address']           || '').trim(),
          avatar: '🎒', coins: 0, streak: 0, points: 0,
          mathScore: 0, engScore: 0, attendance: 0, lastActive: '—',
        }
        existingEmis.add(emis)
        ok.push(student)
      })

      setStudents(prev => [...prev, ...ok])
      setUploadResults({ ok, errors, total: rows.length })
    }
    reader.readAsBinaryString(file)
    e.target.value = ''
  }

  function handleStudentDelete(id) {
    setStudents(prev => prev.filter(s => s.id !== id))
    deleteStudentFS(id).catch(console.error)
    setDeleteConfirm(null)
  }

  function handleStaffSave(updated) {
    setStaffList(prev => {
      const exists = prev.find(s => s.id === updated.id)
      return exists ? prev.map(s => s.id === updated.id ? updated : s) : [...prev, updated]
    })
    saveStaffFS(updated).catch(console.error)
    setEditingStaff(null)
  }

  function handleStaffDelete(id) {
    setStaffList(prev => prev.filter(s => s.id !== id))
    const updated = { ...assignments }
    Object.keys(updated).forEach(k => { if (updated[k] === id) delete updated[k] })
    setAssignments(updated)
    saveClassAssignmentsFS(updated).catch(console.error)
    deleteStaffFS(id).catch(console.error)
    setDeleteStaffConfirm(null)
  }

  // unique class numbers derived from actual students (e.g. '5A' → '5')
  const uniqueClassNums = [...new Set(students.map(s => s.class.replace(/[A-Za-z]/g, '')))]
    .sort((a, b) => parseInt(a) - parseInt(b))

  // sections available for the currently selected class
  const availableSections = [...new Set(
    students
      .filter(s => classFilter === 'All' || s.class.replace(/[A-Za-z]/g, '') === classFilter)
      .map(s => s.section)
      .filter(Boolean)
  )].sort()

  const filteredStudents = students
    .filter(s => {
      const classNum = s.class.replace(/[A-Za-z]/g, '')
      if (classFilter !== 'All' && classNum !== classFilter) return false
      if (sectionFilter !== 'All' && s.section !== sectionFilter) return false
      return true
    })
    .filter(s => !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.emis.includes(studentSearch))
    .sort((a, b) => {
      const clsDiff = parseInt(a.class) - parseInt(b.class)
      if (clsDiff !== 0) return clsDiff
      const secDiff = (a.section || '').localeCompare(b.section || '')
      if (secDiff !== 0) return secDiff
      return a.name.localeCompare(b.name)
    })

  function handleSave(cls, teacherId) {
    const updated = { ...assignments }
    // Remove legacy keys (old combined e.g. '5A', and number-only '5')
    const [num, sec] = cls.split('|')
    delete updated[(num || '') + (sec || '')]
    delete updated[num]
    if (teacherId) updated[cls] = teacherId
    else           delete updated[cls]
    setAssignments(updated)
    saveClassAssignmentsFS(updated).catch(console.error)
    const teacher = teacherId ? staffById[teacherId]?.name : null
    setSavedMsg(teacher ? `Std ${cls} → ${teacher}` : `Std ${cls} unassigned`)
    setTimeout(() => setSavedMsg(''), 3000)
  }

  if (dbLoading || seeding) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🏫</div>
          <div className="font-display text-xl text-gray-700 mb-2">
            {seeding ? 'Setting up database…' : 'Loading school data…'}
          </div>
          <div className="text-sm text-gray-400">
            {seeding ? 'Uploading staff and student records to Firebase' : 'Fetching from Firebase'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">🏫</div>
          <div>
            <h1 className="text-lg font-display font-bold text-gray-800">{SCHOOL.name}</h1>
            <p className="text-xs text-gray-400">{SCHOOL.block} Block · {SCHOOL.district} · <span className="font-semibold text-gray-500">{user?.name}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && (
            <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full animate-pulse">
              ✓ {savedMsg}
            </span>
          )}
          <button onClick={logout}
            className="text-xs font-bold text-gray-400 hover:text-red-500 px-4 py-2 rounded-xl hover:bg-red-50 transition-all border border-gray-200">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: 'Total Students', value: students.length,
              icon: '🎒', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600',
              sub: null,
            },
            {
              label: 'Total Staff', value: staffList.length,
              icon: '👩‍🏫', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600',
              sub: `${staffAssigned} assigned · ${staffUnassigned} free`,
            },
            {
              label: 'Classes Covered', value: classesWithTeacher,
              icon: '✅', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600',
              sub: `out of ${dynamicClassList.length} classes`,
            },
            {
              label: 'Classes Pending', value: classesWithoutTeacher,
              icon: '⏳', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-500',
              sub: classesWithoutTeacher === 0 ? 'All classes covered!' : 'Need a teacher',
            },
          ].map(c => (
            <div key={c.label} className={`rounded-2xl border-2 p-5 ${c.bg} ${c.border}`}>
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className={`text-3xl font-display font-bold ${c.text}`}>{c.value}</div>
              <div className={`text-xs font-semibold mt-0.5 ${c.text} opacity-70`}>{c.label}</div>
              {c.sub && <div className="text-[11px] text-gray-400 mt-1">{c.sub}</div>}
            </div>
          ))}
        </div>

        {/* Assignment table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowAssignments(v => !v)}
            className="w-full px-6 py-4 flex items-center justify-between bg-amber-50 hover:bg-amber-100 transition-colors border-l-4 border-amber-400">
            <div className="text-left">
              <h2 className="text-lg font-display font-bold text-gray-800">Class Teacher Assignments</h2>
              {showAssignments && <p className="text-xs text-gray-400 mt-0.5">Click Assign / Change to update a class teacher. Changes are saved immediately.</p>}
            </div>
            <span className="text-gray-400 text-lg ml-4">{showAssignments ? '▲' : '▼'}</span>
          </button>

          {showAssignments && <>
          {/* Column headers */}
          <div className="grid items-center bg-gray-50 border-y border-gray-100 px-6 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider"
            style={{ gridTemplateColumns: '220px 150px 1fr 130px' }}>
            <span>Class / Section</span>
            <span>Students</span>
            <span>Class Teacher</span>
            <span></span>
          </div>

          <div className="divide-y divide-gray-50">
            {dynamicClassList.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-gray-400">No students enrolled yet.</div>
            ) : dynamicClassList.map(cls => {
              const teacherId = getAssignment(cls)
              const teacher   = teacherId ? staffById[teacherId] : null
              const count     = studentCount[cls] || 0
              const num       = clsNum(cls)
              const section   = clsSec(cls)

              return (
                <div key={cls}
                  className="grid items-center px-6 py-4 hover:bg-gray-50/60 transition-colors"
                  style={{ gridTemplateColumns: '220px 150px 1fr 130px' }}>

                  {/* Class / Section */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-display font-bold text-amber-700">{num}</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">Standard {num}</div>
                      <div className="text-xs text-gray-400">
                        {section ? `Section ${section}` : 'No section'}
                      </div>
                    </div>
                  </div>

                  {/* Student count */}
                  <div>
                    <span className="text-sm font-bold text-gray-700">{count}</span>
                    <span className="text-xs text-gray-400 ml-1">students</span>
                  </div>

                  {/* Assigned teacher */}
                  <div>
                    {teacher ? (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-lg flex-shrink-0">
                          {teacher.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800">{teacher.name}</div>
                          <div className="text-xs text-gray-400">{teacher.subject} · {teacher.experience} yrs exp</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                          —
                        </div>
                        <span className="text-sm text-gray-400 italic">Not assigned</span>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => setModalClass(cls)}
                      className={`px-5 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                        teacher
                          ? 'border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100'
                          : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                      }`}>
                      {teacher ? '✏️ Change' : '＋ Assign'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          </>}
        </div>

        {/* Staff overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowStaff(v => !v)}
            className="w-full px-6 py-4 flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition-colors border-l-4 border-blue-400">
            <div className="text-left">
              <h2 className="text-lg font-display font-bold text-gray-800">All Staff</h2>
              {showStaff && <p className="text-xs text-gray-400 mt-0.5">Add staff manually. Use ✏️ to edit or 🗑️ to delete. Assignments update automatically.</p>}
            </div>
            <span className="text-gray-400 text-lg ml-4">{showStaff ? '▲' : '▼'}</span>
          </button>

          {showStaff && <>
          {/* Add Staff button */}
          <div className="px-6 pt-3 pb-4 border-b border-gray-100 bg-gray-50/50">
            <button
              onClick={() => setEditingStaff({ emis:'', name:'', gender:'', subject:'', qualification:'', experience:'', dob:'', bloodGroup:'' })}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors shadow-sm">
              + Add New Staff
            </button>
          </div>

          {/* Column headers */}
          <div className="grid items-center bg-gray-50 border-b border-gray-100 px-6 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider"
            style={{ gridTemplateColumns: '140px 1fr 120px 100px 180px 80px' }}>
            <span>EMIS</span>
            <span>Name</span>
            <span>Subject</span>
            <span>Experience</span>
            <button
              onClick={() => setStaffSort(s => s === 'unassigned-first' ? 'assigned-first' : 'unassigned-first')}
              className="flex items-center gap-1 hover:text-gray-700 transition-colors group">
              <span>Status</span>
              <span className="text-gray-300 group-hover:text-gray-500">
                {staffSort === 'unassigned-first' ? '↑' : '↓'}
              </span>
            </button>
            <span></span>
          </div>

          <div className="divide-y divide-gray-50">
            {sortedStaff.map(s => {
              const assignedClasses = Object.entries(resolvedAssignments)
                .filter(([, tid]) => tid === s.id)
                .map(([c]) => c)
              return (
                <div key={s.id}
                  className="grid items-center px-6 py-3.5 hover:bg-gray-50/60 transition-colors"
                  style={{ gridTemplateColumns: '140px 1fr 120px 100px 180px 80px' }}>
                  <div className="text-xs font-mono text-gray-400">{s.emis || '—'}</div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-lg flex-shrink-0">
                      {s.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">{s.name}</div>
                      <div className="text-xs text-gray-400">{s.qualification}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 font-semibold">{s.subject}</div>
                  <div className="text-sm text-gray-600">{s.experience} yrs</div>
                  <div className="flex flex-wrap gap-1">
                    {assignedClasses.length > 0 ? assignedClasses.map(c => (
                      <span key={c} className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                        Std {c.split('|')[0]}{c.split('|')[1] ? ' ' + c.split('|')[1] : ''}
                      </span>
                    )) : (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-400">
                        Unassigned
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingStaff(s)} title="Edit"
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-blue-200 text-blue-500 bg-blue-50 hover:bg-blue-100 transition-all text-base">
                      ✏️
                    </button>
                    <button onClick={() => setDeleteStaffConfirm(s)} title="Delete"
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 transition-all text-base">
                      🗑️
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          </>}
        </div>

        {/* Students table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button onClick={() => setShowStudents(v => !v)}
            className="w-full px-6 py-4 flex items-center justify-between bg-rose-50 hover:bg-rose-100 transition-colors border-l-4 border-rose-400">
            <div className="text-left">
              <h2 className="text-lg font-display font-bold text-gray-800">Students</h2>
              {showStudents && <p className="text-xs text-gray-400 mt-0.5">Add students one by one or upload in bulk. Use ✏️ to edit or 🗑️ to delete a student.</p>}
            </div>
            <span className="text-gray-400 text-lg ml-4">{showStudents ? '▲' : '▼'}</span>
          </button>

          {showStudents && <>
            {/* Upload bar */}
            <div className="px-6 pt-3 pb-4 flex items-center gap-3 border-b border-gray-100 bg-gray-50/50">
              <input
                ref={uploadRef}
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={handleExcelUpload}
              />
              <button
                onClick={() => setEditingStudent({ id:'', emis:'', name:'', gender:'', class:'', section:'', dob:'', fatherName:'', motherName:'', mobile:'', bloodGroup:'', differentlyAbled:'No', address:'' })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors shadow-sm">
                + Add New Student
              </button>
              <button
                onClick={() => uploadRef.current.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-colors shadow-sm">
                ⬆ Upload Excel
              </button>
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-blue-300 text-blue-600 hover:bg-blue-50 text-sm font-bold transition-colors">
                ⬇ Download Template
              </button>
              <span className="text-xs text-gray-400">Upload .xlsx with student data</span>
              {uploadResults && (
                <button
                  onClick={() => setUploadResults(null)}
                  className="ml-auto text-xs text-gray-400 hover:text-gray-600 font-semibold">
                  Clear results ×
                </button>
              )}
            </div>

            {/* Upload results panel */}
            {uploadResults && (
              <div className="px-6 py-3 border-b border-gray-100 bg-blue-50/40">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm font-bold text-gray-700">
                    Upload Results — {uploadResults.total} rows processed
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                    ✓ {uploadResults.ok.length} imported
                  </span>
                  {uploadResults.errors.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                      ✗ {uploadResults.errors.length} errors
                    </span>
                  )}
                </div>
                {uploadResults.errors.length > 0 && (
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {uploadResults.errors.map((e, i) => (
                      <div key={i} className="text-xs text-red-700 bg-red-50 rounded-lg px-3 py-1 flex gap-3">
                        <span className="font-bold whitespace-nowrap">Row {e.rowNum}</span>
                        <span className="text-gray-500">EMIS: {e.emis}</span>
                        <span>{e.name}</span>
                        <span className="ml-auto font-semibold">{e.reason}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Filters */}
            <div className="px-6 pt-4 pb-4 flex items-center gap-3 border-b border-gray-100">
              <div className="relative w-96">
                <input
                  type="text"
                  placeholder="Search by name or EMIS..."
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  className="w-full px-4 pr-9 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
                {studentSearch && (
                  <button
                    onClick={() => setStudentSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-lg leading-none">
                    ×
                  </button>
                )}
              </div>
              <CustomSelect
                value={classFilter}
                onChange={v => { setClassFilter(v); setSectionFilter('All') }}
                options={[{ value: 'All', label: 'All Classes' }, ...uniqueClassNums.map(n => ({ value: n, label: `Std ${n}` }))]}
              />
              <CustomSelect
                value={sectionFilter}
                onChange={setSectionFilter}
                disabled={availableSections.length <= 1}
                options={[{ value: 'All', label: 'All Sections' }, ...availableSections.map(s => ({ value: s, label: `Section ${s}` }))]}
              />
              <span className="text-xs text-gray-400 font-semibold whitespace-nowrap ml-auto">
                {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Horizontally scrollable table */}
            <div className="overflow-x-auto">
              {/* Column headers */}
              <div className="grid items-center bg-gray-50 border-b border-gray-100 px-6 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider"
                style={{ gridTemplateColumns: '150px 200px 80px 100px 80px 110px 130px 200px 200px 150px 90px', minWidth: '1510px' }}>
                <span>EMIS</span>
                <span>Name</span>
                <span>Gender</span>
                <span>Class</span>
                <span>Section</span>
                <span>DOB</span>
                <span>Blood Group</span>
                <span>Father Name</span>
                <span>Mother Name</span>
                <span>Mobile</span>
                <span></span>
              </div>

              <div className="divide-y divide-gray-50">
                {filteredStudents.map(s => (
                  <div key={s.id}
                    className="grid items-center px-6 py-3.5 hover:bg-gray-50/60 transition-colors"
                    style={{ gridTemplateColumns: '150px 200px 80px 100px 80px 110px 130px 200px 200px 150px 90px', minWidth: '1510px' }}>

                    <div className="text-xs font-mono text-gray-500">{s.emis}</div>

                    <div className="text-sm font-bold text-gray-800">{s.name}</div>

                    <div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        s.gender === 'Male' ? 'bg-blue-50 text-blue-600' :
                        s.gender === 'Transgender' ? 'bg-purple-50 text-purple-600' :
                        'bg-pink-50 text-pink-600'
                      }`}>{s.gender}</span>
                    </div>

                    <div className="text-sm font-bold text-gray-700">
                      Std {s.class.replace(/[A-Za-z]/g, '')}
                    </div>

                    <div className="text-sm text-gray-600 font-semibold">
                      {s.section || '—'}
                    </div>

                    <div className="text-xs text-gray-500">{s.dob}</div>
                    <div className="text-xs font-semibold text-gray-600">{s.bloodGroup || '—'}</div>
                    <div className="text-xs text-gray-600 pr-4">{s.fatherName || '—'}</div>
                    <div className="text-xs text-gray-600 pr-4">{s.motherName || '—'}</div>
                    <div className="text-xs text-gray-500">{s.mobile || '—'}</div>

                    <div className="flex items-center gap-2 pr-3">
                      <button onClick={() => setEditingStudent(s)} title="Edit"
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-blue-200 text-blue-500 bg-blue-50 hover:bg-blue-100 transition-all text-base">
                        ✏️
                      </button>
                      <button onClick={() => setDeleteConfirm(s)} title="Delete"
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 transition-all text-base">
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>}
        </div>

      </div>{/* end max-w-5xl */}

      {/* Assignment modal */}
      {modalClass && (
        <AssignModal
          cls={modalClass}
          currentTeacherId={getAssignment(modalClass)}
          assignments={assignments}
          staffList={staffList}
          onSave={handleSave}
          onClose={() => setModalClass(null)}
        />
      )}

      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          existingEmis={new Set(students.map(s => s.emis))}
          onSave={handleStudentSave}
          onClose={() => setEditingStudent(null)}
        />
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-5 text-center">
              <div className="text-4xl mb-1">🗑️</div>
              <h2 className="text-lg font-display font-bold text-white">Delete Student?</h2>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-gray-700 font-semibold text-sm">
                Are you sure you want to delete
              </p>
              <p className="text-gray-900 font-bold text-base mt-1">{deleteConfirm.name}</p>
              <p className="text-gray-400 text-xs mt-1">EMIS: {deleteConfirm.emis}</p>
              <p className="text-red-500 text-xs mt-3 font-semibold">This action cannot be undone.</p>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm transition-all">
                Cancel
              </button>
              <button
                onClick={() => handleStudentDelete(deleteConfirm.id)}
                className="flex-1 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Staff modal */}
      {editingStaff && (
        <EditStaffModal
          staff={editingStaff}
          existingEmis={new Set(staffList.map(s => s.emis))}
          onSave={handleStaffSave}
          onClose={() => setEditingStaff(null)}
        />
      )}

      {/* Delete Staff confirmation */}
      {deleteStaffConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-5 text-center">
              <div className="text-4xl mb-1">🗑️</div>
              <h2 className="text-lg font-display font-bold text-white">Delete Staff?</h2>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-gray-700 font-semibold text-sm">Are you sure you want to delete</p>
              <p className="text-gray-900 font-bold text-base mt-1">{deleteStaffConfirm.name}</p>
              <p className="text-gray-400 text-xs mt-1">EMIS: {deleteStaffConfirm.emis}</p>
              {Object.values(resolvedAssignments).includes(deleteStaffConfirm.id) && (
                <p className="text-amber-600 text-xs mt-2 font-semibold">⚠ This teacher is currently assigned to a class.</p>
              )}
              <p className="text-red-500 text-xs mt-2 font-semibold">This action cannot be undone.</p>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setDeleteStaffConfirm(null)}
                className="flex-1 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm transition-all">
                Cancel
              </button>
              <button onClick={() => handleStaffDelete(deleteStaffConfirm.id)}
                className="flex-1 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

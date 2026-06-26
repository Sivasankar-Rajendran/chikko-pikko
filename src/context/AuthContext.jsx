import React, { createContext, useContext, useState } from 'react'
import { USERS, SCHOOL, ALL_STUDENTS, ALL_STAFF } from '../data/mockData'
import { getAllStudentsFS, getStaffByEmisFS, getClassAssignmentsFS } from '../services/firestore'

const AuthContext = createContext(null)

/* Parse 'DD-Mon-YYYY' (mockData) or 'DD-MM-YYYY' (upload) and compare to 'YYYY-MM-DD' (date input) */
function dobMatches(stored, inputYMD) {
  if (!stored || !inputYMD) return false
  const [iy, im, id] = inputYMD.split('-').map(Number)
  const MONTHS = { Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12 }

  const m1 = stored.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/)
  if (m1) {
    return parseInt(m1[1]) === id && MONTHS[m1[2]] === im && parseInt(m1[3]) === iy
  }
  const m2 = stored.match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (m2) {
    return parseInt(m2[1]) === id && parseInt(m2[2]) === im && parseInt(m2[3]) === iy
  }
  return false
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  /* Staff / HM / District / State login — synchronous, password-based */
  const login = (role, password) => {
    const found = USERS[role]
    if (found && found.password === password) {
      setUser(found)
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  /* Student login — EMIS + DOB, looks up in Firestore (falls back to mockData) */
  const loginStudent = async (emis, dobYMD) => {
    try {
      let students = []
      try { students = await getAllStudentsFS() } catch {}
      if (!students.length) students = ALL_STUDENTS

      const student = students.find(s => s.emis === emis.trim())
      if (!student) {
        return { success: false, error: 'EMIS number not found. Please check and try again.' }
      }

      if (!dobMatches(student.dob, dobYMD)) {
        return { success: false, error: 'Date of birth does not match our records.' }
      }

      setUser({
        ...student,
        role:             'student',
        school:           SCHOOL.name,
        schoolCode:       SCHOOL.code,
        block:            SCHOOL.block,
        district:         SCHOOL.district,
        state:            SCHOOL.state,
        assignedSubjects: ['Maths', 'English'],
        level:            student.level  || 1,
        badges:           student.badges || 0,
      })
      return { success: true }
    } catch {
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  /* Teacher login — Staff EMIS + DOB */
  const loginStaff = async (emis, dobYMD) => {
    // 1. Look up staff by EMIS directly in Firestore
    let member = null
    try {
      member = await getStaffByEmisFS(emis.trim())
    } catch (err) {
      return { success: false, error: `Could not reach database: ${err.message}` }
    }

    if (!member) {
      return { success: false, error: 'Staff EMIS number not found. Please check and try again.' }
    }

    // 2. Validate DOB
    if (!dobMatches(member.dob, dobYMD)) {
      return { success: false, error: 'Date of birth does not match our records.' }
    }

    // 3. Find assigned class (optional — staff can login even without one)
    let assignedClass = ''
    try {
      const assignments = await getClassAssignmentsFS()
      if (assignments) {
        const entry = Object.entries(assignments).find(([, tid]) => tid === member.id)
        if (entry) assignedClass = entry[0]
      }
    } catch {}

    setUser({
      ...member,
      role:       'teacher',
      class:      assignedClass,
      school:     SCHOOL.name,
      schoolCode: SCHOOL.code,
      block:      SCHOOL.block,
      district:   SCHOOL.district,
      state:      SCHOOL.state,
    })
    return { success: true }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, loginStudent, loginStaff, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

import { db } from '../firebase'
import {
  collection, doc, getDocs, getDoc, setDoc, updateDoc,
  deleteDoc, writeBatch, query, where,
} from 'firebase/firestore'

/* ── STUDENTS ──────────────────────────────────────────────── */
export async function getAllStudentsFS() {
  const snap = await getDocs(collection(db, 'students'))
  return snap.docs.map(d => d.data())
}

export async function getStudentsByClassFS(classLabel) {
  let q
  if (classLabel === '5A') {
    q = query(collection(db, 'students'), where('class', '==', '5'), where('section', '==', 'A'))
  } else if (classLabel === '5B') {
    q = query(collection(db, 'students'), where('class', '==', '5'), where('section', '==', 'B'))
  } else {
    q = query(collection(db, 'students'), where('class', '==', classLabel))
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data())
}

export async function saveStudentFS(student) {
  await setDoc(doc(db, 'students', student.id), student)
}

export async function updateStudentFS(studentId, data) {
  await updateDoc(doc(db, 'students', studentId), data)
}

export async function deleteStudentFS(studentId) {
  await deleteDoc(doc(db, 'students', studentId))
}

export async function seedStudentsFS(students) {
  const batch = writeBatch(db)
  students.forEach(s => batch.set(doc(db, 'students', s.id), s))
  await batch.commit()
}

export async function deleteAllStudentsFS() {
  const snap = await getDocs(collection(db, 'students'))
  if (snap.empty) return
  // Firestore batch limit is 500 — chunk if needed
  const ids = snap.docs.map(d => d.id)
  for (let i = 0; i < ids.length; i += 500) {
    const batch = writeBatch(db)
    ids.slice(i, i + 500).forEach(id => batch.delete(doc(db, 'students', id)))
    await batch.commit()
  }
}

/* ── STAFF ─────────────────────────────────────────────────── */
export async function getAllStaffFS() {
  const snap = await getDocs(collection(db, 'staff'))
  return snap.docs.map(d => d.data())
}

export async function getStaffByEmisFS(emis) {
  const q    = query(collection(db, 'staff'), where('emis', '==', emis))
  const snap = await getDocs(q)
  return snap.empty ? null : snap.docs[0].data()
}

export async function saveStaffFS(member) {
  await setDoc(doc(db, 'staff', member.id), member)
}

export async function updateStaffFS(staffId, data) {
  await updateDoc(doc(db, 'staff', staffId), data)
}

export async function deleteStaffFS(staffId) {
  await deleteDoc(doc(db, 'staff', staffId))
}

export async function seedStaffFS(staff) {
  const batch = writeBatch(db)
  staff.forEach(s => batch.set(doc(db, 'staff', s.id), s))
  await batch.commit()
}

export async function deleteAllStaffFS() {
  const snap = await getDocs(collection(db, 'staff'))
  if (snap.empty) return
  const ids = snap.docs.map(d => d.id)
  for (let i = 0; i < ids.length; i += 500) {
    const batch = writeBatch(db)
    ids.slice(i, i + 500).forEach(id => batch.delete(doc(db, 'staff', id)))
    await batch.commit()
  }
}

/* ── CLASS ASSIGNMENTS ─────────────────────────────────────── */
export async function getClassAssignmentsFS() {
  const snap = await getDoc(doc(db, 'config', 'classAssignments'))
  return snap.exists() ? snap.data() : null
}

export async function saveClassAssignmentsFS(assignments) {
  await setDoc(doc(db, 'config', 'classAssignments'), assignments)
}

/* ── STUDENT PROGRESS ──────────────────────────────────────── */
export async function getProgressFS(studentId) {
  const snap = await getDoc(doc(db, 'progress', studentId))
  return snap.exists() ? snap.data() : {}
}

export async function saveProgressFS(studentId, data) {
  await setDoc(doc(db, 'progress', studentId), data)
}

/* One read for all students — use in teacher view instead of N individual reads */
export async function getAllProgressFS() {
  const snap = await getDocs(collection(db, 'progress'))
  const result = {}
  snap.docs.forEach(d => { result[d.id] = d.data() })
  return result
}

/* ── SEED / CHECK ──────────────────────────────────────────── */
export async function isSeeded() {
  const snap = await getDocs(collection(db, 'staff'))
  return !snap.empty
}

export async function seedDatabase(assignments) {
  await saveClassAssignmentsFS(assignments)
}

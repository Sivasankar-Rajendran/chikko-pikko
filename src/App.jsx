import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import StudentDashboard from './pages/student/StudentDashboard'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import HeadmasterDashboard from './pages/headmaster/HeadmasterDashboard'
import DistrictDashboard from './pages/district/DistrictDashboard'
import StateDashboard from './pages/state/StateDashboard'

function ProtectedRoute({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={`/${user.role}`} replace /> : <Landing />} />
      <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/headmaster" element={<ProtectedRoute role="headmaster"><HeadmasterDashboard /></ProtectedRoute>} />
      <Route path="/district" element={<ProtectedRoute role="district"><DistrictDashboard /></ProtectedRoute>} />
      <Route path="/state" element={<ProtectedRoute role="state"><StateDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

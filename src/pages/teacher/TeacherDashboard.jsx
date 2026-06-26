import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { WEEKLY_ACTIVITY, WEAKEST_TOPICS, ASSIGNMENTS, DEFAULT_CLASS_ASSIGNMENTS, ALL_STUDENTS } from '../../data/mockData'
import { LESSON_MAP } from '../../data/questions/index'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { getAllStudentsFS, getClassAssignmentsFS, getProgressFS } from '../../services/firestore'

function getRealLessonProgress(progressData, cls, subject, lesson) {
  const key = `${cls}__${subject}__${lesson}`
  const lp  = progressData[key]
  if (!lp) return null  // no real data — caller will fall back
  const DIFFS = ['easy', 'medium', 'hard']
  const doneCount = DIFFS.filter(d => lp[d]?.status === 'completed').length
  return {
    easy:   lp.easy?.status   || 'locked',
    medium: lp.medium?.status || 'locked',
    hard:   lp.hard?.status   || 'locked',
    pct:    Math.round((doneCount / 3) * 100),
  }
}

/* 'num|sec' (HM format) → human label e.g. '5|A' → 'Class 5 · A' */
function formatClassLabel(cls) {
  if (!cls) return ''
  if (cls.includes('|')) {
    const [num, sec] = cls.split('|')
    return sec ? `Class ${num} · ${sec}` : `Class ${num}`
  }
  return `Class ${cls}`
}

function getStudentsForClass(classLabel, allStudents = ALL_STUDENTS) {
  let raw
  if (classLabel.includes('|')) {
    // HM pipe format: 'num|sec'  e.g. '1|', '5|A'
    const [num, sec] = classLabel.split('|')
    raw = allStudents.filter(s => {
      const sNum = (s.class || '').replace(/[A-Za-z]/g, '')
      if (sNum !== num) return false
      return sec === '' || (s.section || '') === sec
    })
  } else if (classLabel === '5A') {
    raw = allStudents.filter(s => s.class === '5' && s.section === 'A')
  } else if (classLabel === '5B') {
    raw = allStudents.filter(s => s.class === '5' && s.section === 'B')
  } else {
    raw = allStudents.filter(s => s.class === classLabel)
  }
  return raw.map(s => ({
    id:         s.id,
    name:       s.name,
    mathScore:  s.mathScore  ?? 0,
    engScore:   s.engScore   ?? 0,
    attendance: s.attendance ?? 0,
    lastActive: s.lastActive ?? '-',
    status:     (s.mathScore ?? 0) >= 85 ? 'excellent' : (s.mathScore ?? 0) >= 65 ? 'good' : 'attention',
  }))
}

const NAV = [
  { label: 'Dashboard',   icon: '📊' },
  { label: 'My Classes',  icon: '🏫' },
  { label: 'Students',    icon: '👥' },
  { label: 'Assessments', icon: '📝' },
  { label: 'Assignments', icon: '📋' },
  { label: 'Reports',     icon: '📈' },
  { label: 'Interventions', icon: '🎯' },
  { label: 'Messages',    icon: '💬' },
  { label: 'Resources',   icon: '📚' },
  { label: 'Settings',    icon: '⚙️' },
]

function Ring({ value, color, size = 90, sw = 8 }) {
  const r = (size - sw) / 2
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={sw} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={`${(value/100)*c} ${c - (value/100)*c}`} strokeLinecap="round" />
    </svg>
  )
}

function Sidebar({ tab, setTab, user, onLogout }) {
  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shadow-sm min-h-screen flex-shrink-0">
      <div className="px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-green flex items-center justify-center text-lg shadow-sm">🐦</div>
          <div>
            <div className="font-display text-base text-gray-800 leading-none">Chikko&Pikko</div>
            <div className="text-[10px] text-gray-400 font-semibold">Teacher Portal</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(item => (
          <button key={item.label} onClick={() => setTab(item.label)}
            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === item.label ? 'bg-green-50 text-brand-green border border-green-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}>
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="border-t border-gray-100 p-3 space-y-2">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-base">{user.avatar}</div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-gray-700 truncate">{user.name}</div>
            <div className="text-[10px] text-gray-400">Class Teacher · {user.class}</div>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}

/* ── Dashboard Tab ───────────────────────────────────────────────────────── */
function DashboardTab({ students = [] }) {
  const total   = students.length
  const present = students.filter(s => s.attendance > 70).length
  const absent  = total - present
  const mathAvg = total > 0 ? Math.round(students.reduce((a, s) => a + s.mathScore, 0) / total) : 0
  const engAvg  = total > 0 ? Math.round(students.reduce((a, s) => a + s.engScore,  0) / total) : 0
  const attn    = students.filter(s => s.status === 'attention')
  const topImp  = [...students].sort((a, b) => (b.mathScore + b.engScore) - (a.mathScore + a.engScore)).slice(0, 3)

  return (
    <div className="space-y-5">
      {/* 4-stat row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: '👥', value: total,   label: 'Total Students', color: 'text-brand-blue',   iconBg: 'bg-blue-100'   },
          { icon: '✅', value: present, label: 'Present Today',  color: 'text-brand-green',  iconBg: 'bg-green-100'  },
          { icon: '❌', value: absent,  label: 'Absent Today',   color: 'text-red-500',      iconBg: 'bg-red-100'    },
          { icon: '📊', value: `${Math.round((present/total)*100)}%`, label: 'Average Activity', color: 'text-brand-purple', iconBg: 'bg-purple-100' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center text-2xl flex-shrink-0`}>{s.icon}</div>
            <div>
              <div className={`font-display text-2xl leading-none ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-400 font-semibold mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 3-column row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Students Needing Attention */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-display text-sm text-gray-700 mb-3">Students Needing Attention</h3>
          <div className="space-y-2.5">
            {attn.map(s => (
              <div key={s.id} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                  {s.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-700 truncate">{s.name}</div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {s.mathScore < 50 ? 'Struggling in Maths' : s.engScore < 50 ? 'Struggling in English' : `Not Active for ${s.lastActive}`}
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                  s.status === 'attention' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'
                }`}>{s.attendance < 70 ? 'High' : 'Medium'}</span>
              </div>
            ))}
            {students.filter(s => s.attendance < 80 && s.status !== 'attention').slice(0,1).map(s => (
              <div key={s.id} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                  {s.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-700 truncate">{s.name}</div>
                  <div className="text-[10px] text-gray-400">Not Active for 5 Days</div>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">High</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-1.5 rounded-xl text-[10px] font-bold text-brand-blue border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors">
            View All ({attn.length}) →
          </button>
        </div>

        {/* Class Performance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-display text-sm text-gray-700 mb-3">Class Performance</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Maths Average', value: mathAvg, color: '#FF8A00', trend: '+6%' },
              { label: 'English Average', value: engAvg, color: '#1E88E5', trend: '+4%' },
            ].map((m, i) => (
              <div key={i} className="text-center">
                <div className="text-sm font-semibold text-gray-500 mb-2">{m.label}</div>
                <div className="relative inline-block">
                  <Ring value={m.value} color={m.color} size={80} sw={7} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-base" style={{ color: m.color }}>{m.value}%</span>
                  </div>
                </div>
                <div className="text-[10px] text-green-500 font-bold mt-1">{m.trend} vs last month</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weakest Topics */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-display text-sm text-gray-700 mb-3">Weakest Topics</h3>
          <div className="space-y-3">
            {WEAKEST_TOPICS.map((t, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                  i === 0 ? 'bg-red-500' : i === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                }`}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-700">{t.topic}</div>
                  <div className="text-[10px] text-red-500 font-semibold">{t.percent}% students weak</div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                    <div className="h-1.5 bg-red-400 rounded-full" style={{ width: `${t.percent}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-1.5 rounded-xl text-[10px] font-bold text-brand-blue border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors">
            View Full Report →
          </button>
        </div>
      </div>

      {/* 2-column row: Top Improvers + Activity + Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {/* Top Improvers */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-display text-sm text-gray-700 mb-3">Top Improvers</h3>
          <div className="space-y-3">
            {topImp.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                  {s.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 text-xs font-bold text-gray-700 truncate">{s.name}</div>
                <span className="text-xs font-bold text-green-500 flex-shrink-0">+{Math.max(s.mathScore - 70, s.engScore - 65)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Class Activity Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-display text-sm text-gray-700 mb-2">Class Activity (This Week)</h3>
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={WEEKLY_ACTIVITY} barSize={14}>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Bar dataKey="students" fill="#28B463" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-green" />
            <span className="text-[10px] text-gray-400">Active Students</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-display text-sm text-gray-700 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Assign Homework',  icon: '📝', color: 'bg-orange-500' },
              { label: 'Create Assessment',icon: '📋', color: 'bg-blue-500'   },
              { label: 'Send Parent Alert',icon: '🔔', color: 'bg-purple-500' },
              { label: 'Download Report',  icon: '📥', color: 'bg-green-500'  },
            ].map((a, i) => (
              <button key={i} className={`${a.color} text-white rounded-xl px-3 py-2.5 text-[10px] font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-sm`}>
                <span>{a.icon}</span><span className="leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 flex items-center gap-3">
        <span className="text-xl">💡</span>
        <p className="text-xs font-semibold text-yellow-800">
          Tip: Encourage students to practice daily to build strong concepts.
        </p>
      </div>
    </div>
  )
}

/* ── Student Progress Helpers ────────────────────────────────────────────── */
function getLessonProgress(score, idx, total) {
  const start = (idx / total) * 100
  const end   = ((idx + 1) / total) * 100
  if (score >= end) return { easy: 'completed', medium: 'completed', hard: 'completed', pct: 100 }
  if (score > start) {
    const prog = (score - start) / (end - start)
    if (prog >= 0.67) return { easy: 'completed', medium: 'completed', hard: 'unlocked', pct: 66 }
    if (prog >= 0.33) return { easy: 'completed', medium: 'unlocked', hard: 'locked',   pct: 33 }
    return { easy: 'unlocked', medium: 'locked', hard: 'locked', pct: 10 }
  }
  return { easy: 'locked', medium: 'locked', hard: 'locked', pct: 0 }
}

const DIFF_DISPLAY = {
  completed: { icon: '✅', cls: 'text-green-600 bg-green-50',  label: 'Done'    },
  unlocked:  { icon: '🔓', cls: 'text-orange-500 bg-orange-50', label: 'Active' },
  locked:    { icon: '🔒', cls: 'text-gray-300 bg-gray-50',    label: 'Locked'  },
}

function SubjectProgress({ label, icon, color, score, lessons }) {
  const done = lessons.filter(l => l.pct === 100).length
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <h4 className="font-display text-sm text-gray-700">{label}</h4>
          <span className="text-[10px] text-gray-400 font-semibold">{done}/{lessons.length} lessons done</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-2 rounded-full" style={{ width: `${score}%`, background: color }} />
          </div>
          <span className="text-xs font-bold" style={{ color }}>{score}%</span>
        </div>
      </div>
      <div className="space-y-2">
        {lessons.map((l, i) => (
          <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${l.pct === 100 ? 'bg-green-50' : l.pct > 0 ? 'bg-orange-50' : 'bg-gray-50'}`}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: l.pct === 100 ? '#28B463' : l.pct > 0 ? color : '#d1d5db' }}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-700 mb-1">{l.lesson}</div>
              <div className="flex items-center gap-1.5">
                {['easy','medium','hard'].map(d => {
                  const dd = DIFF_DISPLAY[l[d]]
                  return (
                    <span key={d} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-lg ${dd.cls}`}>
                      {dd.icon} {d.charAt(0).toUpperCase() + d.slice(1)}
                    </span>
                  )
                })}
              </div>
            </div>
            <div className="flex-shrink-0 text-right min-w-[52px]">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden mb-0.5 ml-auto">
                <div className="h-1.5 rounded-full" style={{ width: `${l.pct}%`, background: l.pct === 100 ? '#28B463' : color }} />
              </div>
              <span className={`text-[10px] font-bold ${l.pct === 100 ? 'text-green-600' : l.pct > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                {l.pct === 100 ? 'Done ✓' : l.pct > 0 ? `${l.pct}%` : 'Locked'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Student Detail View ─────────────────────────────────────────────────── */
function StudentDetailView({ student, userClass, onBack }) {
  const full        = ALL_STUDENTS.find(s => s.id === student.id) || {}
  const mathLessons = LESSON_MAP[userClass]?.maths   || []
  const engLessons  = LESSON_MAP[userClass]?.english || []

  const [realData,     setRealData]     = useState({})
  const [progressLoad, setProgressLoad] = useState(true)

  useEffect(() => {
    getProgressFS(student.id)
      .then(data => {
        // Fall back to localStorage if Firestore has nothing
        if (Object.keys(data).length === 0) {
          try {
            const local = JSON.parse(localStorage.getItem(`chikko_quiz_v1_${student.id}`) || '{}')
            setRealData(local)
          } catch { setRealData({}) }
        } else {
          setRealData(data)
        }
      })
      .catch(() => {
        try {
          const local = JSON.parse(localStorage.getItem(`chikko_quiz_v1_${student.id}`) || '{}')
          setRealData(local)
        } catch { setRealData({}) }
      })
      .finally(() => setProgressLoad(false))
  }, [student.id])

  const hasRealData = Object.keys(realData).length > 0

  const mathProgress = mathLessons.map((lesson, i) => {
    const real = hasRealData ? getRealLessonProgress(realData, userClass, 'maths', lesson) : null
    return { lesson, ...(real ?? getLessonProgress(student.mathScore, i, mathLessons.length)) }
  })
  const engProgress = engLessons.map((lesson, i) => {
    const real = hasRealData ? getRealLessonProgress(realData, userClass, 'english', lesson) : null
    return { lesson, ...(real ?? getLessonProgress(student.engScore, i, engLessons.length)) }
  })

  const inProgress = [
    ...mathProgress.filter(l => l.pct > 0 && l.pct < 100).map(l => ({ ...l, subject: 'Maths',   color: '#FF8A00' })),
    ...engProgress.filter(l  => l.pct > 0 && l.pct < 100).map(l => ({ ...l, subject: 'English', color: '#1E88E5' })),
  ]
  const notStarted = [
    ...mathProgress.filter(l => l.pct === 0).map(l => ({ ...l, subject: 'Maths' })),
    ...engProgress.filter(l  => l.pct === 0).map(l => ({ ...l, subject: 'English' })),
  ]
  const mathDone = mathProgress.filter(l => l.pct === 100).length
  const engDone  = engProgress.filter(l  => l.pct === 100).length

  const STATUS_PILL = { excellent: 'bg-green-100 text-green-700', good: 'bg-blue-100 text-blue-700', attention: 'bg-red-100 text-red-700' }

  if (progressLoad) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-3xl mb-3 animate-bounce">📊</div>
          <div className="text-sm font-semibold text-gray-500">Loading progress from Firebase…</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Back + title */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 text-lg transition-colors">
          ←
        </button>
        <h2 className="font-display text-lg text-gray-700">Student Progress</h2>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-1 ${STATUS_PILL[student.status]}`}>{student.status}</span>
        {hasRealData && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 ml-1">🔥 Live from Firebase</span>}
      </div>

      {/* Profile banner */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600 flex-shrink-0">
          {student.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl text-gray-800">{student.name}</h3>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400 flex-wrap">
            <span className="font-semibold">Class {userClass}</span>
            {full.streak   && <span>🔥 {full.streak} day streak</span>}
            {full.coins !== undefined && <span>🪙 {full.coins.toLocaleString()} coins</span>}
            <span>⏱ {student.lastActive}</span>
            {full.bloodGroup && <span>🩸 {full.bloodGroup}</span>}
          </div>
        </div>
        <div className="flex gap-6 flex-shrink-0">
          {[
            { val: `${student.mathScore}%`,  lbl: 'Maths',       col: '#FF8A00' },
            { val: `${student.engScore}%`,   lbl: 'English',     col: '#1E88E5' },
            { val: `${student.attendance}%`, lbl: 'Attendance',  col: '#28B463' },
            { val: `${mathDone + engDone}/${mathLessons.length + engLessons.length}`, lbl: 'Lessons Done', col: '#8E44AD' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-xl leading-none" style={{ color: s.col }}>{s.val}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main 3-col layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Lesson progress — spans 2 cols */}
        <div className="col-span-2 space-y-4">
          <SubjectProgress label="Maths"   icon="🐿️" color="#FF8A00" score={student.mathScore} lessons={mathProgress} />
          <SubjectProgress label="English" icon="🐦" color="#1E88E5" score={student.engScore}  lessons={engProgress}  />
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Currently working on */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h4 className="font-display text-sm text-gray-700 mb-3">🎯 In Progress</h4>
            {inProgress.length > 0 ? (
              <div className="space-y-2.5">
                {inProgress.map((l, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: l.color }} />
                    <div>
                      <div className="text-xs font-bold text-gray-700">{l.lesson}</div>
                      <div className="text-[10px] text-gray-400">{l.subject} · {l.pct}% done</div>
                      <div className="w-20 h-1 bg-gray-100 rounded-full mt-0.5 overflow-hidden">
                        <div className="h-1 rounded-full" style={{ width: `${l.pct}%`, background: l.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-green-600 font-semibold">🎉 All lessons in progress done!</p>
            )}
          </div>

          {/* Not yet started */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h4 className="font-display text-sm text-gray-700 mb-3">🔒 Not Started</h4>
            {notStarted.length > 0 ? (
              <div className="space-y-1.5">
                {notStarted.slice(0, 6).map((l, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs">🔒</span>
                    <div>
                      <div className="text-[10px] font-bold text-gray-500">{l.lesson}</div>
                      <div className="text-[9px] text-gray-400">{l.subject}</div>
                    </div>
                  </div>
                ))}
                {notStarted.length > 6 && (
                  <p className="text-[10px] text-gray-400 mt-1">+{notStarted.length - 6} more</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-green-600 font-semibold">🎉 All topics started!</p>
            )}
          </div>

          {/* Completion summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h4 className="font-display text-sm text-gray-700 mb-3">📊 Completion</h4>
            {[
              { label: 'Maths',   done: mathDone, total: mathLessons.length, color: '#FF8A00' },
              { label: 'English', done: engDone,  total: engLessons.length,  color: '#1E88E5' },
            ].map((r, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-[10px] font-semibold text-gray-500 mb-1">
                  <span>{r.label}</span>
                  <span style={{ color: r.color }}>{r.done}/{r.total} lessons</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-2 rounded-full" style={{ width: `${r.total ? (r.done/r.total)*100 : 0}%`, background: r.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Students Tab ────────────────────────────────────────────────────────── */
function StudentsTab({ students = [], userClass = 1 }) {
  const [search,          setSearch]          = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

  if (selectedStudent) {
    return <StudentDetailView student={selectedStudent} userClass={userClass} onBack={() => setSelectedStudent(null)} />
  }

  const STATUS = {
    excellent: 'bg-green-100 text-green-700',
    good:      'bg-blue-100 text-blue-700',
    attention: 'bg-red-100 text-red-700',
  }
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input type="text" placeholder="Search students…" value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-green-400 text-sm font-semibold" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Student','Maths','English','Last Active','Status',''].map(h => (
                <th key={h} className="text-left py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(s => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                      {s.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <span className="font-semibold text-gray-700 text-xs">{s.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-14 bg-gray-100 rounded-full overflow-hidden"><div className="h-1.5 rounded-full bg-brand-orange" style={{ width: `${s.mathScore}%` }} /></div>
                    <span className="text-[10px] font-bold text-gray-600">{s.mathScore}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-14 bg-gray-100 rounded-full overflow-hidden"><div className="h-1.5 rounded-full bg-brand-blue" style={{ width: `${s.engScore}%` }} /></div>
                    <span className="text-[10px] font-bold text-gray-600">{s.engScore}%</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-[10px] text-gray-400">{s.lastActive}</td>
                <td className="py-3 px-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS[s.status]}`}>{s.status}</span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => setSelectedStudent(s)}
                    className="text-[10px] text-brand-blue font-bold hover:underline hover:text-blue-700 transition-colors">
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Assignments Tab ─────────────────────────────────────────────────────── */
function AssignmentsTab() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ subject: 'Maths', title: '', type: 'daily', dueDate: '', questions: 10 })
  const [list, setList] = useState(ASSIGNMENTS)

  const create = (e) => {
    e.preventDefault()
    setList(p => [{ id: Date.now(), ...form, status: 'pending', estimatedMin: form.questions * 2 }, ...p])
    setShowForm(false)
    setForm({ subject: 'Maths', title: '', type: 'daily', dueDate: '', questions: 10 })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-lg text-gray-700">📋 Assignments</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary gradient-green px-4 py-2 text-sm">
          + Create Assignment
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border-2 border-green-200 shadow-sm p-5">
          <h3 className="font-display text-base text-gray-700 mb-4">New Assignment</h3>
          <form onSubmit={create} className="grid grid-cols-2 gap-4">
            {[
              { label: 'Subject', type: 'select', key: 'subject', opts: ['Maths','English'] },
              { label: 'Type',    type: 'select', key: 'type',    opts: ['daily','weekly'] },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{f.label}</label>
                <select value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-green-400 text-sm font-semibold">
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Title</label>
              <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Fractions Practice"
                className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-green-400 text-sm font-semibold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Due Date</label>
              <input required type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-green-400 text-sm font-semibold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Questions</label>
              <input type="number" min="1" max="50" value={form.questions} onChange={e => setForm(p => ({ ...p, questions: +e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-green-400 text-sm font-semibold" />
            </div>
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="btn-primary gradient-green px-5 py-2 text-sm">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-sm text-gray-500 border-2 border-gray-200 font-semibold hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {list.map(a => (
          <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${a.subject === 'Maths' ? 'bg-orange-50' : 'bg-blue-50'}`}>
              {a.subject === 'Maths' ? '🐿️' : '🐦'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-gray-700">{a.title}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${a.type === 'daily' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>{a.type}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${a.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-700'}`}>{a.status}</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{a.subject} · {a.questions}Q · Due: {a.dueDate}</div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="text-xs text-brand-blue font-bold hover:underline">Edit</button>
              <button className="text-xs text-red-500 font-bold hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Reports Tab ─────────────────────────────────────────────────────────── */
function ReportsTab() {
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-5 text-white">
        <h2 className="font-display text-xl">📈 Class Reports — Class {5}A</h2>
        <p className="text-blue-100 text-sm mt-1">Weekly analytics and topic strength overview</p>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-display text-sm text-gray-700 mb-3">Weekly Active Students</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={WEEKLY_ACTIVITY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="students" stroke="#28B463" strokeWidth={2.5} dot={{ fill: '#28B463', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-display text-sm text-gray-700 mb-3">Topic Strength</h3>
          <div className="space-y-2.5">
            {[
              { topic: 'Numbers',    value: 85, color: '#FF8A00' },
              { topic: 'Fractions',  value: 58, color: '#E53935' },
              { topic: 'Decimals',   value: 72, color: '#FF8A00' },
              { topic: 'Grammar',    value: 69, color: '#1E88E5' },
              { topic: 'Reading',    value: 62, color: '#E53935' },
              { topic: 'Vocabulary', value: 74, color: '#1E88E5' },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[10px] font-semibold text-gray-500 w-20 flex-shrink-0">{t.topic}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-2 rounded-full" style={{ width: `${t.value}%`, background: t.color }} />
                </div>
                <span className="text-[10px] font-bold text-gray-600 w-8 text-right">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TeacherDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Dashboard')
  const handleLogout = () => { logout(); navigate('/') }

  const [allStudents,   setAllStudents]   = useState(ALL_STUDENTS)
  const [assignments,   setAssignments]   = useState(DEFAULT_CLASS_ASSIGNMENTS)
  const [dataLoading,   setDataLoading]   = useState(true)

  // Load students + assignments from Firestore
  useEffect(() => {
    Promise.all([getAllStudentsFS(), getClassAssignmentsFS()])
      .then(([fsStudents, fsAssign]) => {
        if (fsStudents.length) setAllStudents(fsStudents)
        if (fsAssign)          setAssignments(fsAssign)
      })
      .catch(() => {})
      .finally(() => setDataLoading(false))
  }, [])

  const myClasses = Object.entries(assignments)
    .filter(([, tid]) => tid === user.id)
    .map(([cls]) => cls)

  const [selectedClass, setSelectedClass] = useState(user.class || '')

  // After Firestore loads, pick the right default class
  useEffect(() => {
    if (dataLoading) return
    if (myClasses.includes(selectedClass)) return
    setSelectedClass(myClasses[0] ?? '')
  }, [dataLoading, assignments])

  // Re-derive classStudents from Firestore data using the local helper
  const classStudents = getStudentsForClass(selectedClass, allStudents)

  const renderTab = () => {
    switch (tab) {
      case 'Dashboard':   return <DashboardTab students={classStudents} />
      case 'Students':    return <StudentsTab students={classStudents} userClass={parseInt(selectedClass.split('|')[0]) || 1} />
      case 'Assignments': return <AssignmentsTab />
      case 'Reports':     return <ReportsTab />
      default:            return <DashboardTab students={classStudents} />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-body">
      <Sidebar tab={tab} setTab={setTab} user={user} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto min-w-0">
        <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div>
            <h1 className="font-display text-xl text-gray-800">Welcome, {user.name} 👋</h1>
            <p className="text-xs text-gray-400">Class Teacher — {formatClassLabel(selectedClass)} · {user.school}</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 focus:outline-none bg-white">
              {myClasses.length > 0
                ? myClasses.map(cls => <option key={cls} value={cls}>{formatClassLabel(cls)}</option>)
                : <option value="">No class assigned</option>
              }
            </select>
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg cursor-pointer">🔔</div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-base">{user.avatar}</div>
          </div>
        </div>
        <div className="p-6">{renderTab()}</div>
      </main>
    </div>
  )
}

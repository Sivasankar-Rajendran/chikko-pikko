import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { CLASS_STUDENTS, WEEKLY_ACTIVITY, WEAKEST_TOPICS, ASSIGNMENTS } from '../../data/mockData'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'

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
function DashboardTab() {
  const total   = CLASS_STUDENTS.length
  const present = CLASS_STUDENTS.filter(s => s.attendance > 70).length
  const absent  = total - present
  const mathAvg = Math.round(CLASS_STUDENTS.reduce((a, s) => a + s.mathScore, 0) / total)
  const engAvg  = Math.round(CLASS_STUDENTS.reduce((a, s) => a + s.engScore,  0) / total)
  const attn    = CLASS_STUDENTS.filter(s => s.status === 'attention')
  const topImp  = [...CLASS_STUDENTS].sort((a, b) => (b.mathScore + b.engScore) - (a.mathScore + a.engScore)).slice(0, 3)

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
            {CLASS_STUDENTS.filter(s => s.attendance < 80 && s.status !== 'attention').slice(0,1).map(s => (
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

/* ── Students Tab ────────────────────────────────────────────────────────── */
function StudentsTab() {
  const [search, setSearch] = useState('')
  const filtered = CLASS_STUDENTS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
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
        <button className="btn-primary gradient-green px-5 text-sm">+ Add Student</button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Student','Maths','English','Attendance','Last Active','Status',''].map(h => (
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
                <td className="py-3 px-4 text-xs font-bold text-gray-600">{s.attendance}%</td>
                <td className="py-3 px-4 text-[10px] text-gray-400">{s.lastActive}</td>
                <td className="py-3 px-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS[s.status]}`}>{s.status}</span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-[10px] text-brand-blue font-bold hover:underline">View →</button>
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

  const renderTab = () => {
    switch (tab) {
      case 'Dashboard':   return <DashboardTab />
      case 'Students':    return <StudentsTab />
      case 'Assignments': return <AssignmentsTab />
      case 'Reports':     return <ReportsTab />
      default:            return <DashboardTab />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-body">
      <Sidebar tab={tab} setTab={setTab} user={user} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto min-w-0">
        <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div>
            <h1 className="font-display text-xl text-gray-800">Welcome, {user.name} 👋</h1>
            <p className="text-xs text-gray-400">Class Teacher — {user.class} · {user.school}</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 focus:outline-none bg-white">
              <option>Class 5A</option>
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

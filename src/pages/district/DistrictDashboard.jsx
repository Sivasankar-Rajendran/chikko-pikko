import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { DISTRICT_SCHOOLS, GRADE_HEATMAP } from '../../data/mockData'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const NAV = [
  { label: 'Overview',         icon: '📊' },
  { label: 'School Performance',icon: '🏆' },
  { label: 'Grades & Classes', icon: '📋' },
  { label: 'Teachers',         icon: '👩‍🏫' },
  { label: 'Students',         icon: '👥' },
  { label: 'Reports',          icon: '📈' },
  { label: 'Interventions',    icon: '🎯' },
  { label: 'Communication',    icon: '💬' },
  { label: 'Settings',         icon: '⚙️' },
]

const HEAT_STATUS = {
  good:    { dot: 'bg-green-400',  title: 'Good' },
  average: { dot: 'bg-yellow-400', title: 'Average' },
  poor:    { dot: 'bg-red-400',    title: 'Needs Attention' },
}

function Ring({ value, color, size = 90, sw = 7 }) {
  const r = (size - sw) / 2
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={sw} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={`${(value/100)*c} ${c-(value/100)*c}`} strokeLinecap="round" />
    </svg>
  )
}

function Sidebar({ tab, setTab, user, onLogout }) {
  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shadow-sm min-h-screen flex-shrink-0">
      <div className="px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-blue flex items-center justify-center text-lg shadow-sm">🏛️</div>
          <div>
            <div className="font-display text-base text-gray-800 leading-none">Chikko&Pikko</div>
            <div className="text-[10px] text-gray-400 font-semibold">School Admin</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(item => (
          <button key={item.label} onClick={() => setTab(item.label)}
            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === item.label ? 'bg-blue-50 text-brand-blue border border-blue-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}>
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="border-t border-gray-100 p-3 space-y-2">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-base">🏛️</div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-gray-700 truncate">{user.name}</div>
            <div className="text-[10px] text-gray-400">CEO · {user.district}</div>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}

/* ── Overview Tab ────────────────────────────────────────────────────────── */
function OverviewTab() {
  const total      = DISTRICT_SCHOOLS.reduce((a, s) => a + s.students, 0)
  const teachers   = DISTRICT_SCHOOLS.reduce((a, s) => a + s.teachers, 0)
  const activeToday = Math.round(total * 0.89)
  const avgAtt     = Math.round(DISTRICT_SCHOOLS.reduce((a, s) => a + s.attendance, 0) / DISTRICT_SCHOOLS.length)
  const avgMath    = Math.round(DISTRICT_SCHOOLS.reduce((a, s) => a + s.mathAvg, 0) / DISTRICT_SCHOOLS.length)
  const avgEng     = Math.round(DISTRICT_SCHOOLS.reduce((a, s) => a + s.engAvg,  0) / DISTRICT_SCHOOLS.length)

  const topClasses = [
    { cls: '5A', avg: 70, color: 'bg-brand-orange' },
    { cls: '4B', avg: 75, color: 'bg-brand-blue'   },
    { cls: '7C', avg: 72, color: 'bg-brand-green'  },
  ]

  return (
    <div className="space-y-5">
      {/* 4-stat row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: '👥', value: total.toLocaleString(),       label: 'Total Students', iconBg: 'bg-blue-100',   val: 'text-brand-blue'   },
          { icon: '👩‍🏫', value: teachers,                    label: 'Teachers',       iconBg: 'bg-green-100',  val: 'text-brand-green'  },
          { icon: '✅', value: activeToday.toLocaleString(), label: 'Active Today',   iconBg: 'bg-orange-100', val: 'text-brand-orange' },
          { icon: '📊', value: `${avgAtt}%`,                 label: 'Attendance Today',iconBg:'bg-purple-100', val: 'text-brand-purple' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center text-2xl flex-shrink-0`}>{s.icon}</div>
            <div>
              <div className={`font-display text-2xl leading-none ${s.val}`}>{s.value}</div>
              <div className="text-xs text-gray-400 font-semibold mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 3-column row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Learning Performance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-display text-sm text-gray-700 mb-4">Learning Performance</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Maths Average',   value: avgMath, color: '#FF8A00', trend: '+7%' },
              { label: 'English Average', value: avgEng,  color: '#1E88E5', trend: '+5%' },
            ].map((m, i) => (
              <div key={i} className="text-center">
                <div className="text-xs font-semibold text-gray-500 mb-1.5">{m.label}</div>
                <div className="relative inline-block">
                  <Ring value={m.value} color={m.color} size={76} sw={7} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-base" style={{ color: m.color }}>{m.value}%</span>
                  </div>
                </div>
                <div className="text-[10px] text-green-500 font-bold mt-1">{m.trend} vs last month</div>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Performance Heat Map */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-display text-sm text-gray-700 mb-3">Grade Performance Heat Map</h3>
          <div className="flex gap-2 text-[10px] font-bold text-gray-400 mb-2 px-1">
            <span className="w-16">Grade</span>
            <span className="flex-1 text-center">Maths</span>
            <span className="flex-1 text-center">English</span>
          </div>
          <div className="space-y-2">
            {GRADE_HEATMAP.map((g, i) => (
              <div key={i} className="flex items-center gap-2 px-1">
                <span className="text-[10px] font-semibold text-gray-600 w-16">{g.grade}</span>
                <div className={`flex-1 flex justify-center`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${HEAT_STATUS[g.maths].dot}`}>
                    <div className="w-3 h-3 rounded-full bg-white/40" />
                  </div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${HEAT_STATUS[g.english].dot}`}>
                    <div className="w-3 h-3 rounded-full bg-white/40" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-3 flex-wrap">
            {[['bg-green-400','Good'],['bg-yellow-400','Average'],['bg-red-400','Attention']].map(([cls, label]) => (
              <div key={label} className="flex items-center gap-1 text-[9px] text-gray-400 font-semibold">
                <div className={`w-2.5 h-2.5 rounded-full ${cls}`} />{label}
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Effectiveness */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-display text-sm text-gray-700 mb-3">Teacher Effectiveness</h3>
          <div className="text-[10px] font-bold text-gray-400 mb-2">Top Performing Classes</div>
          <div className="space-y-2.5">
            {topClasses.map((cls, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-xl ${cls.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {cls.cls}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] font-semibold text-gray-500 mb-0.5">
                    <span>Class {cls.cls}</span>
                    <span>Average {cls.avg}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-1.5 bg-brand-blue rounded-full" style={{ width: `${cls.avg}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-1.5 rounded-xl text-[10px] font-bold text-brand-blue border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors">
            View All Classes →
          </button>
        </div>
      </div>

      {/* Bottom 3-column row */}
      <div className="grid grid-cols-3 gap-4">
        {/* School Impact */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-display text-sm text-gray-700 mb-3">School Impact</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: '📝', value: '1.8M',  label: 'Questions Solved' },
              { icon: '📚', value: '5,200', label: 'Reading Hours'    },
              { icon: '🎓', value: '12,450',label: 'Skills Mastered'  },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-display text-base text-brand-blue leading-none">{s.value}</div>
                <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 relative overflow-hidden">
          <div className="absolute bottom-0 right-2 text-5xl opacity-10 select-none">🤖</div>
          <h3 className="font-display text-sm text-gray-700 mb-2">AI Recommendation</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Grade 6 English performance is below target. Recommend focused Reading Program and extra practice for 3 weeks.
          </p>
          <button className="mt-3 w-full py-2 rounded-xl text-xs font-bold text-white bg-brand-purple hover:opacity-90 transition-opacity shadow-sm">
            View Intervention Plan →
          </button>
          <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-brand-purple flex items-center justify-center text-white text-sm font-bold shadow">
            🤖
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-display text-sm text-gray-700 mb-3">Alerts</h3>
          <div className="space-y-2">
            {[
              { type: 'warn', msg: '3 Classes need attention',     icon: '⚠️' },
              { type: 'info', msg: '15 Students inactive',         icon: 'ℹ️' },
              { type: 'info', msg: '2 Assessments pending',        icon: '📋' },
            ].map((a, i) => (
              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                a.type === 'warn' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
              }`}>
                <span>{a.icon}</span>
                <span className="flex-1">{a.msg}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-1.5 rounded-xl text-[10px] font-bold text-brand-blue border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors">
            View All Alerts →
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Schools Tab ─────────────────────────────────────────────────────────── */
function SchoolsTab() {
  const [search, setSearch] = useState('')
  const filtered = DISTRICT_SCHOOLS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
  const STATUS = {
    excellent: { badge: 'bg-green-100 text-green-700',  label: 'Excellent' },
    good:      { badge: 'bg-blue-100 text-blue-700',    label: 'Good'      },
    average:   { badge: 'bg-yellow-100 text-yellow-700',label: 'Average'   },
    attention: { badge: 'bg-red-100 text-red-700',      label: 'Attention' },
  }
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input type="text" placeholder="Search schools…" value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-400 text-sm font-semibold" />
        <button className="btn-primary gradient-blue px-5 text-sm">📥 Export</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(school => {
          const st = STATUS[school.status]
          return (
            <div key={school.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-sm text-gray-700">{school.name}</h3>
                  <div className="text-[10px] text-gray-400 mt-0.5">Code: {school.code}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.badge}`}>{st.label}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label:'Students',   value: school.students.toLocaleString() },
                  { label:'Teachers',   value: school.teachers },
                  { label:'Attendance', value: `${school.attendance}%` },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-2 text-center">
                    <div className="font-display text-base text-brand-blue">{s.value}</div>
                    <div className="text-[9px] text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                {[
                  { label:'🐿️ Maths',   value: school.mathAvg, color:'#FF8A00' },
                  { label:'🐦 English', value: school.engAvg,  color:'#1E88E5' },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-gray-500 w-20">{m.label}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-1.5 rounded-full" style={{ width: `${m.value}%`, background: m.color }} />
                    </div>
                    <span className="text-[10px] font-bold w-8 text-right" style={{ color: m.color }}>{m.value}%</span>
                    <span className={`text-[9px] font-bold ${school.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{school.trend}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DistrictDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Overview')
  const handleLogout = () => { logout(); navigate('/') }

  const renderTab = () => {
    switch (tab) {
      case 'Overview':          return <OverviewTab />
      case 'School Performance': return <SchoolsTab />
      default:                  return <OverviewTab />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-body">
      <Sidebar tab={tab} setTab={setTab} user={user} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto min-w-0">
        <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div>
            <h1 className="font-display text-xl text-gray-800">ABC Public School</h1>
            <p className="text-xs text-gray-400">School Code: TN-1234 · {user.district} District</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 focus:outline-none bg-white">
              <option>Academic Year 2025</option>
            </select>
            <button className="btn-primary gradient-blue px-4 py-1.5 text-sm">📥 Download Report</button>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-base">🏛️</div>
          </div>
        </div>
        <div className="p-6">{renderTab()}</div>
      </main>
    </div>
  )
}

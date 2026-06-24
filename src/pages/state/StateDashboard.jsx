import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { STATE_DISTRICTS, GOVT_ALERTS, INITIATIVES } from '../../data/mockData'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const NAV = [
  { label: 'State Overview',      icon: '🗺️' },
  { label: 'Districts',           icon: '🏛️' },
  { label: 'Schools',             icon: '🏫' },
  { label: 'Students',            icon: '👥' },
  { label: 'Teachers',            icon: '👩‍🏫' },
  { label: 'Reports & Analytics', icon: '📈' },
  { label: 'Interventions',       icon: '🎯' },
  { label: 'Alerts',              icon: '🔔' },
  { label: 'Settings',            icon: '⚙️' },
]

function Sidebar({ tab, setTab, user, onLogout }) {
  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shadow-sm min-h-screen flex-shrink-0">
      <div className="px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-purple flex items-center justify-center text-lg shadow-sm">🦅</div>
          <div>
            <div className="font-display text-base text-gray-800 leading-none">Chikko&Pikko</div>
            <div className="text-[10px] text-gray-400 font-semibold">State Dashboard</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(item => (
          <button key={item.label} onClick={() => setTab(item.label)}
            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === item.label ? 'bg-purple-50 text-brand-purple border border-purple-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}>
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="border-t border-gray-100 p-3 space-y-2">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-base">🦅</div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-gray-700 truncate">{user.name}</div>
            <div className="text-[10px] text-gray-400">Secretary · {user.state}</div>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}

/* ── TN district "map" — simplified SVG placeholder ─────────────────────── */
function DistrictMap() {
  const legend = [
    { color: '#28B463', label: 'Excellent (80%+)' },
    { color: '#FFC107', label: 'Good (60-79%)'    },
    { color: '#1E88E5', label: 'Average (40-59%)' },
    { color: '#E53935', label: 'Needs Attention'  },
  ]
  const spots = [
    { x: 60,  y: 20,  r: 22, color: '#FFC107', label: 'Chennai'     },
    { x: 30,  y: 60,  r: 18, color: '#FFC107', label: 'Coimbatore'  },
    { x: 55,  y: 50,  r: 16, color: '#FFC107', label: 'Trichy'      },
    { x: 70,  y: 65,  r: 14, color: '#FFC107', label: 'Madurai'     },
    { x: 20,  y: 35,  r: 14, color: '#E53935', label: 'Salem'       },
    { x: 40,  y: 30,  r: 13, color: '#E53935', label: 'Dharmapuri'  },
    { x: 80,  y: 80,  r: 12, color: '#E53935', label: 'Ramanath.'   },
    { x: 50,  y: 75,  r: 14, color: '#FFC107', label: 'Thanjavur'   },
  ]
  return (
    <div className="w-full">
      <svg viewBox="0 0 100 100" className="w-full max-h-48" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }}>
        {/* TN silhouette — rough approximation */}
        <path d="M 30 5 L 75 8 L 90 25 L 88 50 L 80 70 L 75 90 L 55 95 L 40 88 L 25 75 L 15 55 L 10 35 L 20 15 Z"
          fill="#EEF2FF" stroke="#c7d2fe" strokeWidth="0.5" />
        {spots.map((s, i) => (
          <g key={i}>
            <circle cx={s.x} cy={s.y} r={s.r} fill={s.color} fillOpacity="0.75" />
            <text x={s.x} y={s.y + 1} textAnchor="middle" dominantBaseline="middle"
              fontSize="4" fill="white" fontWeight="bold" fontFamily="Nunito">
              {s.label.slice(0, 6)}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {legend.map(l => (
          <div key={l.label} className="flex items-center gap-1 text-[9px] text-gray-400 font-semibold">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── State Overview Tab ──────────────────────────────────────────────────── */
function StateOverviewTab() {
  const totalStudents = STATE_DISTRICTS.reduce((a, d) => a + d.students, 0)
  const totalSchools  = STATE_DISTRICTS.reduce((a, d) => a + d.schools,  0)
  const totalTeachers = STATE_DISTRICTS.reduce((a, d) => a + d.teachers, 0)
  const avgMath = Math.round(STATE_DISTRICTS.reduce((a, d) => a + d.mathAvg, 0) / STATE_DISTRICTS.length)
  const avgEng  = Math.round(STATE_DISTRICTS.reduce((a, d) => a + d.engAvg,  0) / STATE_DISTRICTS.length)
  const avgAtt  = Math.round(STATE_DISTRICTS.reduce((a, d) => a + d.attendance, 0) / STATE_DISTRICTS.length)
  const top3    = [...STATE_DISTRICTS].sort((a, b) => b.mathAvg - a.mathAvg).slice(0, 3)
  const atRisk  = STATE_DISTRICTS.filter(d => d.status === 'attention').slice(0, 3)

  const barData = STATE_DISTRICTS.map(d => ({
    name: d.name.length > 7 ? d.name.slice(0, 7) : d.name,
    M: d.mathAvg,
    E: d.engAvg,
  }))

  return (
    <div className="space-y-5">
      {/* 4-stat row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon:'👥', value:`${(totalStudents/1000).toFixed(0)}K+`, label:'Total Students',     iconBg:'bg-blue-100',   val:'text-brand-blue'   },
          { icon:'🏫', value: totalSchools,                          label:'Total Schools',       iconBg:'bg-green-100',  val:'text-brand-green'  },
          { icon:'👩‍🏫', value:`${(totalTeachers/1000).toFixed(1)}K`, label:'Teachers',            iconBg:'bg-orange-100', val:'text-brand-orange' },
          { icon:'📊', value:`${avgAtt}%`,                           label:'Overall Attendance',  iconBg:'bg-purple-100', val:'text-brand-purple' },
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

      {/* 3-column: State Index + Map + Top/AtRisk */}
      <div className="grid grid-cols-3 gap-4">
        {/* State Learning Index */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-display text-sm text-gray-700 mb-4">State Learning Index</h3>
          {[
            { label: 'Maths',   value: avgMath, color: '#FF8A00', trend: '+6%' },
            { label: 'English', value: avgEng,  color: '#1E88E5', trend: '+4%' },
          ].map((m, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-gray-600">{m.label}</span>
                <span style={{ color: m.color }}>{m.value}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-3 rounded-full" style={{ width: `${m.value}%`, background: m.color }} />
              </div>
              <div className="text-[10px] text-green-500 font-bold mt-0.5">{m.trend} vs last month</div>
            </div>
          ))}
        </div>

        {/* District Performance Map */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm text-gray-700">District Performance Map</h3>
            <select className="text-[10px] border border-gray-200 rounded-lg px-2 py-1 font-semibold text-gray-500 focus:outline-none">
              <option>All Districts</option>
            </select>
          </div>
          <DistrictMap />
        </div>

        {/* Top + At-Risk */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-display text-sm text-gray-700 mb-3">Top Districts</h3>
            <div className="space-y-2">
              {top3.map((d, i) => (
                <div key={d.id} className="flex items-center gap-2">
                  <span className={`w-5 text-xs font-bold text-gray-500 flex-shrink-0`}>{i + 1}</span>
                  <span className="flex-1 text-xs font-semibold text-gray-700 truncate">{d.name}</span>
                  <span className="text-xs font-bold text-green-500">{d.mathAvg}%</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-2 py-1.5 rounded-xl text-[10px] font-bold text-brand-blue border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors">
              View Full List →
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-display text-sm text-gray-700 mb-3">At-Risk Districts</h3>
            <div className="space-y-2">
              {atRisk.map((d, i) => (
                <div key={d.id} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[10px] font-bold text-red-600 flex-shrink-0">!</span>
                  <span className="flex-1 text-xs font-semibold text-gray-700 truncate">{d.name}</span>
                  <span className="text-xs font-bold text-red-500">{d.mathAvg}%</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-2 py-1.5 rounded-xl text-[10px] font-bold text-red-600 border border-red-100 bg-red-50 hover:bg-red-100 transition-colors">
              View Full List →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 3-column: Impact + Alerts + Initiatives */}
      <div className="grid grid-cols-3 gap-4">
        {/* Impact Counter */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-display text-sm text-gray-700 mb-3">Impact Counter (This Month)</h3>
          <div className="space-y-3">
            {[
              { icon: '📝', value: '52 Million',  label: 'Questions Solved', color: 'text-brand-blue'   },
              { icon: '📚', value: '3,20,000',    label: 'Reading Hours',    color: 'text-brand-green'  },
              { icon: '🎓', value: '4.8 Million', label: 'Skills Mastered',  color: 'text-brand-orange' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <div className={`font-display text-base ${s.color} leading-none`}>{s.value}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Government Alerts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-display text-sm text-gray-700 mb-3">Government Alerts</h3>
          <div className="space-y-2">
            {GOVT_ALERTS.map(a => (
              <div key={a.id} className={`flex items-start gap-2 px-3 py-2 rounded-xl ${
                a.type === 'warning' ? 'bg-red-50' : a.type === 'success' ? 'bg-green-50' : 'bg-blue-50'
              }`}>
                <span className="text-base flex-shrink-0 mt-0.5">
                  {a.type === 'warning' ? '⚠️' : a.type === 'success' ? '✅' : 'ℹ️'}
                </span>
                <div>
                  <div className="text-[10px] font-semibold text-gray-700 leading-snug">{a.message}</div>
                  <div className="text-[9px] text-gray-400 mt-0.5">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-2 py-1.5 rounded-xl text-[10px] font-bold text-brand-blue border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors">
            View All Alerts →
          </button>
        </div>

        {/* Recent Initiatives */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-display text-sm text-gray-700 mb-3">Recent Initiatives</h3>
          <div className="space-y-3">
            {INITIATIVES.map(init => (
              <div key={init.id}>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: init.color }} />
                  <div className="flex-1 text-[10px] font-bold text-gray-700 leading-tight">{init.name}</div>
                  <div className="text-[9px] text-gray-400">{init.schools} schools</div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-1.5 rounded-full" style={{ width: `${init.progress}%`, background: init.color }} />
                </div>
                <div className="text-[9px] font-bold mt-0.5" style={{ color: init.color }}>{init.progress}% complete</div>
              </div>
            ))}
          </div>
          <button className="w-full mt-2 py-1.5 rounded-xl text-[10px] font-bold text-brand-blue border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors">
            View All Initiatives →
          </button>
        </div>
      </div>

      {/* District comparison bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="font-display text-sm text-gray-700 mb-3">District-wise Comparison</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0,100]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #f0f0f0' }} />
            <Bar dataKey="M" name="Maths"   fill="#FF8A00" radius={[4,4,0,0]} />
            <Bar dataKey="E" name="English" fill="#1E88E5" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ── Districts Tab ───────────────────────────────────────────────────────── */
function DistrictsTab() {
  const STATUS = {
    good:      { badge: 'bg-blue-100 text-blue-700',    label: 'Good'      },
    average:   { badge: 'bg-yellow-100 text-yellow-700',label: 'Average'   },
    attention: { badge: 'bg-red-100 text-red-700',      label: 'Attention' },
  }
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input type="text" placeholder="Search districts…"
          className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-purple-400 text-sm font-semibold" />
        <select className="px-3 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-sm focus:outline-none">
          <option>All Districts</option><option>Attention Only</option><option>Top Performers</option>
        </select>
        <button className="btn-primary bg-brand-purple px-5 text-sm">Export</button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['District','Schools','Students','Maths Avg','English Avg','Attendance','Status'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {STATE_DISTRICTS.map(d => {
              const st = STATUS[d.status]
              return (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-sm text-gray-700">{d.name}</td>
                  <td className="py-3 px-4 text-xs text-gray-500">{d.schools}</td>
                  <td className="py-3 px-4 text-xs text-gray-500">{d.students.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-14 bg-gray-100 rounded-full overflow-hidden"><div className="h-1.5 rounded-full bg-brand-orange" style={{ width: `${d.mathAvg}%` }} /></div>
                      <span className="text-xs font-bold text-gray-600">{d.mathAvg}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-14 bg-gray-100 rounded-full overflow-hidden"><div className="h-1.5 rounded-full bg-brand-blue" style={{ width: `${d.engAvg}%` }} /></div>
                      <span className="text-xs font-bold text-gray-600">{d.engAvg}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs font-bold text-gray-600">{d.attendance}%</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.badge}`}>{st.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function StateDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('State Overview')
  const handleLogout = () => { logout(); navigate('/') }

  const renderTab = () => {
    switch (tab) {
      case 'State Overview': return <StateOverviewTab />
      case 'Districts':      return <DistrictsTab />
      default:               return <StateOverviewTab />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-body">
      <Sidebar tab={tab} setTab={setTab} user={user} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto min-w-0">
        <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div>
            <h1 className="font-display text-xl text-gray-800">Tamil Nadu Learning Mission</h1>
            <p className="text-xs text-gray-400">State Coordinator / Secretary Level</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 focus:outline-none bg-white">
              <option>Academic Year 2025</option>
            </select>
            <button className="btn-primary bg-brand-purple px-4 py-1.5 text-sm">Filters</button>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-base">🦅</div>
          </div>
        </div>
        <div className="p-6">{renderTab()}</div>
      </main>
    </div>
  )
}

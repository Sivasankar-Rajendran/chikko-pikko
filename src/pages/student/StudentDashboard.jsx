import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { GAMES, STORE_ITEMS, ASSIGNMENTS, BADGES } from '../../data/mockData'
import { LESSON_MAP } from '../../data/questions/index'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import QuizGenerator from '../../components/quiz/QuizGenerator'
import { useQuizProgress } from '../../hooks/useQuizProgress'

/* ── lesson → icon map ───────────────────────────────────────────────────── */
const LESSON_ICONS = {
  'Numbers (1–100)':'🔢','Numbers (100–1000)':'📟','Place Value':'🏛️','Large Numbers':'🔭',
  'Addition':'➕','Subtraction':'➖','Multiplication Basics':'✖️','Multiplication':'✖️',
  'Division':'➗','Fractions':'🍕','Decimals':'📊','Percentage Basics':'%',
  'Integers':'±','Algebra Basics':'𝑥','Simple Equations':'=','Linear Equations':'📈',
  'Exponents':'⚡','Rational Numbers':'½','Number Systems':'∞','Polynomials':'𝑃',
  'Real Numbers':'𝑅','Quadratic Equations':'²','Sets & Functions':'🎯','Trigonometry':'📐',
  'Relations & Functions':'🔗','Calculus':'∫','Factors & Multiples':'🔢','Perimeter & Area':'📏',
  'Geometry Basics':'📐','Shapes':'🔷','Time Basics':'⏰','Money':'💰','Measurement':'📏',
  'Data Handling':'📈','Alphabets':'🔤','Words':'💬','Sentences':'📝',
  'Reading':'📚','Picture Writing':'🖼️','Nouns':'📌','Verbs':'⚡',
  'Comprehension':'🔍','Simple Writing':'✏️','Parts of Speech':'📋','Tenses':'⏳',
  'Reading Skills':'📖','Paragraph Writing':'📄','Vocabulary':'🔤','Grammar Basics':'📝',
  'Story Writing':'📚','Synonyms/Antonyms':'🔄','Articles & Prepositions':'📝',
  'Letter Writing':'✉️','Active/Passive Voice':'🔄','Modals':'💡','Tenses Advanced':'⏳',
  'Reported Speech':'💬','Voice':'🔊','Grammar':'📝','Writing Skills':'✍️',
  'Advanced Grammar':'📖','Literature Analysis':'📚','Advanced Writing':'✏️','Literature':'📖',
  'Nouns & Pronouns':'📌','Adjectives':'🎨',
}

const NAV_ITEMS = [
  { label: 'Home',        icon: '🏠', tab: 'Home'        },
  { label: 'My Learning', icon: '📚', tab: 'Islands'     },
  { label: 'Assignments', icon: '📋', tab: 'Assignments' },
  { label: 'Quiz',        icon: '🧠', tab: 'Quiz'        },
  { label: 'Tests',       icon: '✏️', tab: 'Tests'       },
  { label: 'Progress',    icon: '📈', tab: 'Progress'    },
  { label: 'Badges',      icon: '🏅', tab: 'Badges'      },
  { label: 'Library',     icon: '📖', tab: 'Library'     },
  { label: 'My Garden',   icon: '🌳', tab: 'Garden'      },
  { label: 'Games',       icon: '🎮', tab: 'Games'       },
  { label: 'Store',       icon: '🛍️', tab: 'Store'       },
]

const WEEK_DATA = [
  { d: 'Mon', M: 80, E: 65 },
  { d: 'Tue', M: 72, E: 70 },
  { d: 'Wed', M: 85, E: 75 },
  { d: 'Thu', M: 78, E: 80 },
  { d: 'Fri', M: 90, E: 72 },
]

/* ── Reusable circular progress ─────────────────────────────────────────── */
function Ring({ value, color, size = 80, strokeWidth = 7 }) {
  const r   = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
    </svg>
  )
}

/* ── Sidebar ─────────────────────────────────────────────────────────────── */
function Sidebar({ tab, setTab, user, onLogout }) {
  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shadow-sm min-h-screen flex-shrink-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-orange flex items-center justify-center text-lg shadow-sm">🐿️</div>
          <div>
            <div className="font-display text-base text-gray-800 leading-none">Chikko&Pikko</div>
            <div className="text-[10px] text-gray-400 font-semibold">Learn · Grow · Excel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <button
            key={item.tab}
            onClick={() => setTab(item.tab)}
            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
              tab === item.tab
                ? 'bg-orange-50 text-brand-orange border border-orange-100'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User + logout */}
      <div className="border-t border-gray-100 p-3 space-y-2">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-base">{user.avatar}</div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-gray-700 truncate">{user.name}</div>
            <div className="text-[10px] text-gray-400">Class {user.class}</div>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}

/* ── Home Tab ────────────────────────────────────────────────────────────── */
function HomeTab({ user, coins, setTab, userClass, getProgressPct }) {
  const pending = ASSIGNMENTS.filter(a => a.status === 'pending')
  const mathLessons = LESSON_MAP[userClass]?.maths || []
  const engLessons  = LESSON_MAP[userClass]?.english || []
  const mathOverall = mathLessons.length
    ? Math.round(mathLessons.reduce((s, l) => s + getProgressPct(userClass, 'maths', l), 0) / mathLessons.length)
    : 0
  const engOverall = engLessons.length
    ? Math.round(engLessons.reduce((s, l) => s + getProgressPct(userClass, 'english', l), 0) / engLessons.length)
    : 0

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-display text-gray-800">Good Morning, {user.name.split(' ')[0]}! 👋</h2>
        <p className="text-sm text-gray-400 font-semibold">Let's learn something new today.</p>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: '🔥', value: user.streak, sub: 'Day Streak',    bg: 'bg-orange-50',  border: 'border-orange-100', val: 'text-brand-orange' },
          { icon: '🏆', value: user.points.toLocaleString(), sub: 'Points', bg: 'bg-yellow-50', border: 'border-yellow-100', val: 'text-yellow-600' },
          { icon: '🌳', value: `Level ${user.level}`, sub: 'Garden Level',  bg: 'bg-green-50',  border: 'border-green-100',  val: 'text-brand-green'  },
          { icon: '🏅', value: user.badges, sub: 'Badges',       bg: 'bg-blue-50',   border: 'border-blue-100',   val: 'text-brand-blue'   },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} border ${s.border} rounded-2xl px-4 py-3 flex items-center gap-3`}>
            <span className="text-3xl">{s.icon}</span>
            <div>
              <div className={`font-display text-xl leading-none ${s.val}`}>{s.value}</div>
              <div className="text-xs text-gray-400 font-semibold mt-0.5">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main two-column layout */}
      <div className="flex gap-5">
        {/* Left 60% */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* Today's Mission */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base text-gray-700">Today's Mission</h3>
              <span className="text-xs text-gray-400">Complete your tasks and earn points</span>
            </div>
            <div className="space-y-2">
              {pending.slice(0, 2).map(a => (
                <div key={a.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${
                  a.subject === 'Maths' ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'
                }`}>
                  <span className="text-xl">{a.subject === 'Maths' ? '🐿️' : '🐦'}</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-700">{a.subject}</div>
                    <div className="text-xs text-gray-500">{a.questions} Questions</div>
                  </div>
                  <button className={`text-xs font-bold px-3 py-1.5 rounded-xl text-white ${
                    a.subject === 'Maths' ? 'bg-brand-orange' : 'bg-brand-blue'
                  }`}>Start →</button>
                </div>
              ))}
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-yellow-50 border border-yellow-100">
                <span className="text-xl">⭐</span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-700">Bonus</div>
                  <div className="text-xs text-gray-500">Vocabulary Challenge</div>
                </div>
                <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-lg">+50 🪙</span>
              </div>
            </div>
            <button
              onClick={() => setTab('Quiz')}
              className="w-full mt-3 py-2.5 gradient-orange rounded-xl text-white font-display text-base shadow hover:opacity-90 transition-opacity"
            >
              Start Mission 🚀
            </button>
          </div>

          {/* Quiz Practice Shortcut */}
          <div
            onClick={() => setTab('Quiz')}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-all shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🧠</span>
                  <h3 className="font-display text-lg text-white">Quiz Practice</h3>
                </div>
                <p className="text-purple-100 text-xs">Test yourself · Easy, Medium or Hard · Class {user.class}</p>
              </div>
              <div className="bg-white/20 rounded-xl px-3 py-2 text-white font-bold text-sm">
                Practice Now →
              </div>
            </div>
          </div>

          {/* Learning Islands */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-display text-base text-gray-700 mb-3">Learning Islands</h3>
            {/* Dynamic maths path */}
            <div className="relative flex items-end gap-2 pb-2">
              <div className="absolute left-7 right-7 top-6 h-1 border-t-2 border-dashed border-gray-200 z-0" />
              {mathLessons.map((les, idx) => {
                const pct  = getProgressPct(userClass, 'maths', les)
                const done = pct === 100
                const cur  = !done && pct > 0
                const icon = LESSON_ICONS[les] || '📐'
                return (
                  <div key={les} className="flex-1 flex flex-col items-center z-10 relative">
                    {cur && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow">
                        {pct}%
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-md mb-1.5 transition-transform hover:scale-105 ${
                      done ? 'bg-brand-green text-white'
                      : cur ? 'text-white ring-4 ring-orange-300 ring-offset-1 animate-pulse-slow'
                      : 'bg-orange-50 text-brand-orange'
                    }`}
                      style={cur ? { background: '#FF8A00' } : {}}>
                      {done ? '✅' : icon}
                    </div>
                    <div className="text-[10px] text-center text-gray-500 font-semibold leading-tight">
                      {les}<br/><span className="text-gray-300">Island</span>
                    </div>
                    {cur && (
                      <button onClick={() => setTab('Quiz')} className="mt-1 text-[10px] bg-brand-orange text-white px-2 py-0.5 rounded-full font-bold">Continue</button>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Progress bars */}
            <div className="mt-4 space-y-2 border-t border-gray-50 pt-3">
              <div className="text-xs font-bold text-gray-500 mb-2">My Progress</div>
              {[
                { label: 'Maths',   value: mathOverall, color: '#FF8A00' },
                { label: 'English', value: engOverall,  color: '#1E88E5' },
              ].map(p => (
                <div key={p.label} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-600 w-12">{p.label}</span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2.5 rounded-full transition-all" style={{ width: `${p.value}%`, background: p.color }} />
                  </div>
                  <span className="text-xs font-bold text-gray-500 w-8 text-right">{p.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* School Challenge */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base text-gray-700">School Challenge</h3>
                <p className="text-xs text-gray-400">Let's make our school the best!</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <div className="text-sm font-bold text-gray-700">Rank <span className="text-brand-orange font-display text-lg">12</span> / 450</div>
                    <div className="text-xs text-gray-400">Schools</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">850 / 1200 pts</div>
              </div>
            </div>
            <div className="mt-3 h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-2.5 bg-brand-yellow rounded-full" style={{ width: '70%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>850 pts</span><span>Next: Forest 🌲 — 1200 pts</span>
            </div>
          </div>
        </div>

        {/* Right — Knowledge Garden */}
        <div className="w-52 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-full flex flex-col">
            <h3 className="font-display text-base text-gray-700 mb-1">My Knowledge Garden</h3>
            <p className="text-xs text-gray-400 mb-4">Level {user.level} Tree</p>

            {/* Tree */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-8xl animate-float">🌳</div>
              <div className="mt-3 text-center">
                <div className="text-sm font-bold text-brand-green">Level {user.level}</div>
                <div className="text-xs text-gray-400">Forest Tree</div>
              </div>
              {/* mini tree row */}
              <div className="flex gap-1 mt-3">
                {['🌱','🌿','🌳','⬜','⬜'].map((t, i) => (
                  <div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center text-base ${i < user.level ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}>
                    {i < user.level ? t : '🔒'}
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Next: Forest</div>
            </div>

            {/* XP bar */}
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold mb-1">
                <span>850 XP</span><span>1200 XP</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-2 bg-brand-green rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Badges */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-base text-gray-700">Recent Badges</h3>
          <span className="text-xs text-brand-blue font-bold cursor-pointer hover:underline">View All →</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {BADGES.filter(b => b.earned).map(b => (
              <div key={b.id} className="w-12 h-12 rounded-2xl bg-yellow-50 border-2 border-yellow-200 flex items-center justify-center text-2xl hover:scale-110 transition-transform cursor-pointer" title={b.name}>
                {b.icon}
              </div>
            ))}
          </div>
          <div className="flex-1 ml-4 bg-green-50 border border-green-100 rounded-xl px-4 py-2">
            <div className="text-sm font-bold text-green-700">Keep Going! 🌟</div>
            <div className="text-xs text-green-500">Every step counts.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Islands Tab ─────────────────────────────────────────────────────────── */
const MATHS_COLS   = ['#FF8A00','#E65C00','#28A745','#7B2D8B','#1565C0']
const ENGLISH_COLS = ['#1E88E5','#00897B','#6D4C41','#8E24AA','#1565C0']

function playWaveSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const len = ctx.sampleRate * 2
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d   = buf.getChannelData(0)
    let last  = 0
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1
      d[i]  = (last + 0.02 * w) / 1.02
      last  = d[i]
      d[i] *= 3.5
    }
    const src  = ctx.createBufferSource()
    src.buffer = buf
    const flt  = ctx.createBiquadFilter()
    flt.type   = 'lowpass'
    flt.frequency.value = 500
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.4)
    gain.gain.linearRampToValueAtTime(0,    ctx.currentTime + 1.8)
    src.connect(flt); flt.connect(gain); gain.connect(ctx.destination)
    src.start(); src.stop(ctx.currentTime + 2)
  } catch (_) { /* audio unavailable */ }
}

function makeWavePath(y, amp, period, totalW, offset = 0) {
  let d = `M ${-offset},${y}`
  let x = -offset
  let up = true
  while (x < totalW + period) {
    const mid = x + period / 2
    d += ` Q ${x + period / 4},${up ? y - amp : y + amp} ${mid},${y}`
    x = mid
    up = !up
  }
  return d
}

function IslandsTab({ userClass, quizProgress, goToQuiz }) {
  const { getProgressPct, resetLesson } = quizProgress
  const [subject,     setSubject]     = useState('Maths')
  const [mathsSailed, setMathsSailed] = useState(() => new Set())
  const [engSailed,   setEngSailed]   = useState(() => new Set())
  const [sailTarget,  setSailTarget]  = useState(null)   // rightIdx currently sailing to
  const [justArrived, setJustArrived] = useState(null)   // rightIdx for arrival flash

  const subKey    = subject === 'Maths' ? 'maths' : 'english'
  const lessons   = LESSON_MAP[userClass]?.[subKey] || []
  const cols      = subject === 'Maths' ? MATHS_COLS : ENGLISH_COLS
  const sailedTo  = subject === 'Maths' ? mathsSailed : engSailed
  const setSailed = subject === 'Maths' ? setMathsSailed : setEngSailed

  const islands = lessons.map((les, i) => {
    const pct          = getProgressPct(userClass, subKey, les)
    const prevComplete = i === 0 || getProgressPct(userClass, subKey, lessons[i - 1]) === 100
    const locked       = !prevComplete
    return {
      name: les, level: i + 1,
      icon:  LESSON_ICONS[les] || (subKey === 'maths' ? '📐' : '📖'),
      color: cols[i] || cols[0],
      pct, locked,
      completed:  !locked && pct === 100,
      inProgress: !locked && pct > 0 && pct < 100,
    }
  })

  const overall = lessons.length
    ? Math.round(lessons.reduce((s, l) => s + getProgressPct(userClass, subKey, l), 0) / lessons.length)
    : 0

  // 'locked' | 'waiting' | 'sailing' | 'passed'
  function boatStatus(leftIdx) {
    const rightIdx = leftIdx + 1
    const left  = islands[leftIdx]
    const right = islands[rightIdx]
    if (!left?.completed) return 'locked'
    if (sailTarget === rightIdx) return 'sailing'
    if (right?.pct > 0 || sailedTo.has(rightIdx)) return 'passed'
    return 'waiting'
  }

  function handleSail(rightIdx) {
    if (sailTarget !== null) return
    setSailTarget(rightIdx)
    playWaveSound()
    setTimeout(() => {
      setSailed(prev => new Set([...prev, rightIdx]))
      setSailTarget(null)
      setJustArrived(rightIdx)
      setTimeout(() => setJustArrived(null), 2500)
    }, 1900)
  }

  function handleReset() {
    if (window.confirm(`Reset all ${subject} progress? This cannot be undone.`)) {
      lessons.forEach(l => resetLesson(userClass, subKey, l))
      setSailed(new Set())
      setSailTarget(null)
    }
  }

  // Island width + connector width — sized for ~3.5 visible on standard screen
  const ISLE_W = 220   // px
  const CONN_W = 120   // px

  return (
    <div className="space-y-4">

      {/* Subject toggle + reset */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {['Maths','English'].map(s => (
            <button key={s} onClick={() => setSubject(s)}
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                subject === s
                  ? s === 'Maths' ? 'gradient-orange text-white shadow-lg' : 'gradient-blue text-white shadow-lg'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
              }`}>
              {s === 'Maths' ? '🐿️' : '🐦'} {s}
            </button>
          ))}
        </div>
        <button onClick={handleReset}
          className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-xl transition-all bg-white">
          🔄 Reset Progress
        </button>
      </div>

      {/* Ocean journey card */}
      <div className="rounded-3xl overflow-hidden shadow-lg border border-blue-100">

        {/* Header bar */}
        <div className="bg-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg text-gray-700">{subject} Island Journey 🗺️</h3>
            <p className="text-xs text-gray-400 mt-0.5">Complete each island, then click the boat ⛵ to sail to the next!</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display font-bold" style={{ color: cols[0] }}>{overall}%</div>
            <div className="text-[11px] text-gray-400">Overall Progress</div>
          </div>
        </div>

        {/* Ocean scene */}
        <div className="relative px-8 py-10 overflow-x-auto"
          style={{
            backgroundImage: "url('/ocean-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 60%',
            backgroundRepeat: 'no-repeat',
          }}>
          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-black/20 pointer-events-none" style={{ zIndex: 0 }} />
          {/* SVG wave bands on top of photo */}
          {(() => {
            const totalW = islands.length * ISLE_W + (islands.length - 1) * CONN_W + 64
            return (
              <svg style={{ position:'absolute', top:0, left:0, width:totalW, height:'100%', pointerEvents:'none', zIndex:1 }}
                xmlns="http://www.w3.org/2000/svg">
                <path d={makeWavePath(88,  17, 320, totalW, 0)}   stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" fill="none" />
                <path d={makeWavePath(148, 13, 270, totalW, 90)}  stroke="rgba(255,255,255,0.12)" strokeWidth="2"   fill="none" />
                <path d={makeWavePath(202, 10, 210, totalW, 40)}  stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" />
              </svg>
            )
          })()}
          <div className="relative flex items-end"
            style={{ minWidth: `${islands.length * ISLE_W + (islands.length - 1) * CONN_W}px`, gap: 0, zIndex: 2 }}>

            {islands.map((island, idx) => {
              const st          = idx < islands.length - 1 ? boatStatus(idx) : null
              const isJustArr   = justArrived === idx
              // "Start" is only available once the boat has sailed there (or it's island 0, or already in progress)
              const canStart    = !island.locked && (idx === 0 || island.pct > 0 || sailedTo.has(idx))

              return (
                <React.Fragment key={island.name}>

                  {/* ── Island ── */}
                  <div className="flex flex-col items-center flex-shrink-0 transition-transform duration-500"
                    style={{ width: `${ISLE_W}px`, transform: isJustArr ? 'scale(1.07)' : 'scale(1)' }}>

                    {/* Badge row */}
                    <div className="h-8 flex items-center justify-center mb-1">
                      {island.inProgress && !isJustArr && (
                        <div className="text-[11px] font-bold px-3 py-0.5 rounded-full text-white shadow-md"
                          style={{ background: island.color }}>{island.pct}%</div>
                      )}
                      {isJustArr && (
                        <div className="text-[11px] font-bold px-3 py-0.5 rounded-full text-white shadow-md animate-bounce bg-yellow-400">
                          ⚡ You arrived!
                        </div>
                      )}
                    </div>

                    {/* Island shape */}
                    <div className="relative flex flex-col items-center">
                      {/* Hill */}
                      <div className={`w-28 h-24 rounded-t-full flex items-center justify-center text-5xl shadow-inner transition-all duration-300
                          ${island.locked ? 'bg-gray-400' : island.completed ? 'bg-green-400' : 'bg-green-500'}
                          ${isJustArr ? 'ring-4 ring-yellow-300 ring-offset-4' : ''}
                          ${island.inProgress ? 'ring-3 ring-white ring-offset-2' : ''}`}>
                        <span className="drop-shadow-lg select-none">
                          {island.locked ? '🔒' : island.completed ? '✅' : island.icon}
                        </span>
                      </div>
                      {/* Sandy base */}
                      <div className={`w-36 h-7 rounded-b-3xl border-b-4
                        ${island.locked ? 'bg-gray-300 border-gray-400' : 'bg-yellow-200 border-yellow-400'}`} />
                    </div>

                    {/* Name */}
                    <div className={`mt-2 text-sm font-bold text-center leading-tight px-2
                      ${island.locked ? 'text-white/40' : 'text-white drop-shadow'}`}>
                      {island.name}
                    </div>

                    {/* Progress bar */}
                    <div className="w-32 mt-1.5 h-2 bg-white/25 rounded-full overflow-hidden">
                      <div className="h-2 rounded-full transition-all duration-700"
                        style={{ width: `${island.pct}%`, background: island.locked ? 'rgba(255,255,255,0.15)' : '#fff' }} />
                    </div>

                    {/* Action button */}
                    <div className="mt-2.5 h-9 flex items-center justify-center">
                      {island.locked ? (
                        <div className="text-[9px] text-white/35 text-center font-semibold leading-tight">
                          Complete previous<br/>island first
                        </div>
                      ) : island.completed ? (
                        <div className="text-[11px] text-yellow-200 font-bold">⭐ Mastered!</div>
                      ) : canStart ? (
                        <button onClick={() => goToQuiz(subKey, island.name)}
                          className="text-[12px] text-white font-bold px-5 py-1.5 rounded-full shadow-lg hover:scale-105 transition-all border-2 border-white/40"
                          style={{ background: island.color }}>
                          {island.inProgress ? 'Continue →' : 'Start →'}
                        </button>
                      ) : (
                        <div className="text-[9px] text-white/50 font-semibold text-center">
                          ⛵ Sail here first
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Boat connector ── */}
                  {idx < islands.length - 1 && (() => {
                    const isWaiting = st === 'waiting'
                    const isSailing = st === 'sailing'
                    const isPassed  = st === 'passed'
                    const isLocked  = st === 'locked'
                    const rightIdx  = idx + 1
                    // Boat: waits near completed island (left), sails to next island (right)
                    const boatLeft  = (isSailing || isPassed) ? '95%' : isWaiting ? '12%' : '50%'

                    return (
                      <div className="relative flex-shrink-0"
                        style={{ width: `${CONN_W}px`, height: '190px' }}>

                        {/* Boat + character */}
                        <div
                          className="absolute flex flex-col items-center"
                          style={{
                            left: boatLeft,
                            bottom: '3.75rem',
                            transform: 'translateX(-50%)',
                            transition: isSailing ? 'left 1.9s ease-in-out' : 'none',
                            zIndex: 10,
                            cursor: isWaiting ? 'pointer' : 'default',
                          }}
                          onClick={isWaiting ? () => handleSail(rightIdx) : undefined}
                          title={isWaiting ? 'Click to sail to next island!' : undefined}
                        >
                          {/* Character */}
                          {(isWaiting || isSailing) && (
                            <div className={`text-2xl leading-none mb-0.5 select-none
                              ${isSailing ? 'animate-bounce' : 'animate-bounce'}`}>
                              👦
                            </div>
                          )}

                          {/* Boat */}
                          <div className={`leading-none select-none transition-all ${
                            isWaiting
                              ? 'text-4xl drop-shadow-[0_0_12px_rgba(255,220,0,1)] animate-pulse'
                              : isSailing
                              ? 'text-4xl drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]'
                              : isPassed
                              ? 'text-2xl opacity-50'
                              : 'text-3xl opacity-15 grayscale'
                          }`}>
                            ⛵
                          </div>

                          {/* Click label */}
                          {isWaiting && (
                            <div className="mt-1 text-[9px] font-bold text-white bg-orange-500 px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-lg animate-bounce">
                              ⚡ Click to sail!
                            </div>
                          )}

                          {/* Sailed indicator */}
                          {isPassed && (
                            <div className="mt-0.5 text-[8px] text-white/40 font-semibold whitespace-nowrap">⚓</div>
                          )}
                        </div>

                        {/* Glow ring behind waiting boat */}
                        {isWaiting && (
                          <div className="absolute pointer-events-none"
                            style={{ left: '12%', bottom: '4.2rem', transform: 'translateX(-50%)', zIndex: 5 }}>
                            <div className="w-16 h-16 rounded-full border-2 border-yellow-300/60 animate-ping" />
                          </div>
                        )}
                      </div>
                    )
                  })()}

                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* Footer legend */}
        <div className="bg-white px-6 py-3 border-t border-gray-100 flex flex-wrap items-center gap-4">
          <span className="text-xs font-bold text-gray-500">Level requirements:</span>
          {[['🌱','Easy','33%','#28B463'],['⚡','Medium','67%','#F0A500'],['🔥','Hard','100%','#E53935']].map(([icon,name,pct,col]) => (
            <div key={name} className="flex items-center gap-1">
              <span>{icon}</span>
              <span className="text-xs font-semibold text-gray-600">{name}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded ml-0.5" style={{ background: col + '22', color: col }}>{pct}</span>
            </div>
          ))}
          <span className="ml-auto text-[10px] text-gray-400">👦 Complete an island → click ⛵ to sail!</span>
        </div>
      </div>
    </div>
  )
}

/* ── Assignments Tab ─────────────────────────────────────────────────────── */
function AssignmentsTab() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? ASSIGNMENTS : ASSIGNMENTS.filter(a => a.status === filter || a.type === filter)
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {['all','pending','completed','daily','weekly'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl font-bold text-xs capitalize transition-all ${
              filter === f ? 'gradient-orange text-white shadow' : 'bg-white text-gray-500 border-2 border-gray-200 hover:border-gray-300'
            }`}>{f}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(a => (
          <div key={a.id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 ${a.status === 'completed' ? 'opacity-60' : ''}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${a.subject === 'Maths' ? 'bg-orange-50' : 'bg-blue-50'}`}>
              {a.subject === 'Maths' ? '🐿️' : '🐦'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-gray-700">{a.title}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${a.type === 'daily' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>{a.type}</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{a.subject} · {a.questions}Q · ~{a.estimatedMin} min · Due {a.dueDate}</div>
            </div>
            {a.status === 'completed'
              ? <span className="text-green-500 font-bold text-sm flex-shrink-0">✅ Done</span>
              : <button className="btn-primary gradient-orange px-4 py-2 text-xs flex-shrink-0">Start</button>}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Games Tab ───────────────────────────────────────────────────────────── */
function GamesTab() {
  const [playing, setPlaying] = useState(null)
  if (playing) return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
      <div className="text-8xl mb-4 animate-bounce">{playing.icon}</div>
      <h2 className="font-display text-2xl text-gray-700 mb-2">{playing.name}</h2>
      <p className="text-gray-400 mb-8">{playing.description}</p>
      <div className="inline-block bg-yellow-50 border-2 border-yellow-200 rounded-2xl px-12 py-6 mb-8">
        <div className="font-display text-4xl text-gray-700">🎮</div>
        <div className="text-xl font-display text-gray-600 mt-2">Score: <span className="text-brand-orange">450</span></div>
      </div>
      <br />
      <button onClick={() => setPlaying(null)} className="btn-primary gradient-green px-8 py-3">
        ✅ Finish · Collect +{playing.coins} 🪙
      </button>
    </div>
  )
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-5 text-white">
        <h2 className="font-display text-xl">🎮 Game Zone</h2>
        <p className="text-purple-200 text-sm mt-1">Play mini-games between islands to earn bonus coins!</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAMES.map(g => (
          <div key={g.id} onClick={() => setPlaying(g)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow group-hover:scale-110 transition-transform"
              style={{ background: g.color }}>{g.icon}</div>
            <h3 className="font-display text-base text-gray-700">{g.name}</h3>
            <p className="text-xs text-gray-400 mt-1 mb-3">{g.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs px-3 py-1 rounded-full text-white font-bold" style={{ background: g.color }}>{g.subject}</span>
              <span className="text-sm font-bold text-yellow-600">🪙 +{g.coins}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Store Tab ───────────────────────────────────────────────────────────── */
function StoreTab({ coins, onPurchase }) {
  const [items, setItems] = useState(STORE_ITEMS)
  const [cat, setCat] = useState('all')
  const [notif, setNotif] = useState(null)
  const filtered = cat === 'all' ? items : items.filter(i => i.category === cat)
  const buy = (item) => {
    if (item.owned || coins < item.price) {
      setNotif({ ok: false, msg: `Need ${item.price - coins} more coins!` })
    } else {
      setItems(p => p.map(i => i.id === item.id ? { ...i, owned: true } : i))
      onPurchase(item.price)
      setNotif({ ok: true, msg: `🎉 You got ${item.name}!` })
    }
    setTimeout(() => setNotif(null), 2000)
  }
  return (
    <div className="space-y-5">
      {notif && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-2xl font-bold text-white shadow-2xl ${notif.ok ? 'bg-green-500' : 'bg-red-500'}`}>
          {notif.msg}
        </div>
      )}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-5 text-white flex justify-between items-center">
        <div>
          <h2 className="font-display text-xl">🛍️ Virtual Stone</h2>
          <p className="text-yellow-100 text-sm mt-0.5">Buy cool stuff with your coins!</p>
        </div>
        <div className="bg-white/25 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
          <div className="font-display text-2xl coin-sparkle">🪙 {coins.toLocaleString()}</div>
          <div className="text-xs text-yellow-100">Your Coins</div>
        </div>
      </div>
      <div className="flex gap-2">
        {['all','accessories','outfits'].map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-xl font-bold text-xs capitalize transition-all ${
              cat === c ? 'gradient-yellow text-white shadow' : 'bg-white text-gray-500 border-2 border-gray-200'
            }`}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {filtered.map(item => (
          <div key={item.id} className={`bg-white rounded-2xl border shadow-sm p-3 text-center transition-all hover:shadow-md hover:-translate-y-0.5 ${item.owned ? 'border-green-300 ring-2 ring-green-200' : 'border-gray-100'}`}>
            <div className="text-4xl mb-2">{item.icon}</div>
            <div className="text-xs font-bold text-gray-700 mb-0.5">{item.name}</div>
            <div className="text-[10px] text-gray-400 capitalize mb-2">{item.category}</div>
            {item.owned
              ? <div className="text-xs bg-green-50 text-green-600 font-bold py-1.5 rounded-xl">✅ Owned</div>
              : <button onClick={() => buy(item)}
                  className={`w-full text-xs font-bold py-1.5 rounded-xl transition-all ${
                    coins >= item.price
                      ? 'gradient-yellow text-white hover:opacity-90 active:scale-95 shadow'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}>🪙 {item.price}</button>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Badges Tab ──────────────────────────────────────────────────────────── */
function BadgesTab() {
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-yellow-400 to-amber-400 rounded-2xl p-5 text-white">
        <h2 className="font-display text-xl">🏅 Your Badges</h2>
        <p className="text-yellow-100 text-sm mt-0.5">Earn badges by completing challenges!</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BADGES.map(b => (
          <div key={b.id} className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4 transition-all ${b.earned ? 'border-yellow-200 hover:shadow-lg hover:-translate-y-0.5' : 'border-gray-100 opacity-50'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${b.earned ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50 border-2 border-gray-200'}`}>{b.icon}</div>
            <div>
              <div className="font-bold text-gray-700 text-sm">{b.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{b.description}</div>
              <div className={`text-[10px] font-bold mt-1 ${b.earned ? 'text-green-500' : 'text-gray-400'}`}>{b.earned ? '✅ Earned' : '🔒 Not yet'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Root ────────────────────────────────────────────────────────────────── */
export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab,       setTab]       = useState('Home')
  const [coins,     setCoins]     = useState(user.coins)
  const [quizConfig,     setQuizConfig]     = useState(null)   // { subject, lesson } | null
  const [quizKey,        setQuizKey]        = useState(0)
  const [quizHeaderInfo, setQuizHeaderInfo] = useState(null)  // { diff, quizMode, current, total }
  const quizBackFn = React.useRef(null)

  const handleLogout   = () => { logout(); navigate('/') }
  const handlePurchase = (p) => setCoins(c => c - p)

  const userClassNum = parseInt((user.class || '5').toString().replace(/\D/g, '')) || 5
  const quizProgress = useQuizProgress()

  // Navigate from island "Continue/Start" → Quiz tab with pre-selected lesson
  function goToQuiz(subject, lesson) {
    setQuizConfig({ subject, lesson })
    setQuizKey(k => k + 1)
    setTab('Quiz')
  }

  const renderTab = () => {
    switch (tab) {
      case 'Home':        return (
        <HomeTab user={user} coins={coins} setTab={setTab}
          userClass={userClassNum} getProgressPct={quizProgress.getProgressPct} />
      )
      case 'Islands':     return (
        <IslandsTab userClass={userClassNum} quizProgress={quizProgress} goToQuiz={goToQuiz} />
      )
      case 'Assignments': return <AssignmentsTab />
      case 'Quiz': {
        const DIFF_COLORS = { easy: '#28B463', medium: '#F0A500', hard: '#E53935' }
        const DIFF_LABELS = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
        const subjLabel   = quizConfig?.subject === 'maths' ? '🐿️ Maths' : '🐦 English'
        const qhPct       = quizHeaderInfo
          ? Math.round(((quizHeaderInfo.current + 1) / quizHeaderInfo.total) * 100)
          : 0
        const diffCol     = DIFF_COLORS[quizHeaderInfo?.diff] || '#FF8A00'

        const handleQuizBack = () => {
          setQuizHeaderInfo(null)
          if (quizConfig) { setQuizConfig(null); setTab('My Learning') }
          else { quizBackFn.current?.() }
        }

        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-96">
            {/* Card header — moves here from inside QuizGenerator */}
            <div className="px-6 pt-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {/* Back arrow (black box) */}
                <button onClick={handleQuizBack}
                  className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 text-lg transition-colors flex-shrink-0">
                  ←
                </button>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-display font-bold text-gray-800">🧠 Quiz Practice</h2>
                  <p className="text-sm text-gray-400 truncate">
                    {quizHeaderInfo
                      ? `${subjLabel} · ${quizConfig?.lesson} · ${DIFF_LABELS[quizHeaderInfo.diff] || ''}${quizHeaderInfo.quizMode === 'retry' ? ' · 🔁 Retry' : ''}`
                      : quizConfig
                      ? `${subjLabel} — ${quizConfig.lesson}`
                      : 'Test yourself on any topic at any difficulty'}
                  </p>
                </div>
                {/* Question counter */}
                {quizHeaderInfo && (
                  <span className="text-sm font-bold text-gray-500 flex-shrink-0">
                    {quizHeaderInfo.current + 1} / {quizHeaderInfo.total}
                  </span>
                )}
              </div>
              {/* Progress bar */}
              {quizHeaderInfo && (
                <div className="mt-2.5 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${qhPct}%`, background: diffCol }} />
                </div>
              )}
            </div>
            <div className="p-4">
              <QuizGenerator
                key={`quiz_${quizKey}`}
                userClass={userClassNum}
                initialSubject={quizConfig?.subject ?? null}
                initialLesson={quizConfig?.lesson ?? null}
                quizProgress={quizProgress}
                lockToLesson={!!quizConfig}
                onBack={() => { setQuizHeaderInfo(null); setQuizConfig(null); setTab('My Learning') }}
                onHeaderChange={setQuizHeaderInfo}
                backFnRef={quizBackFn}
              />
            </div>
          </div>
        )
      }
      case 'Games':       return <GamesTab />
      case 'Store':       return <StoreTab coins={coins} onPurchase={handlePurchase} />
      case 'Badges':      return <BadgesTab />
      default:            return (
        <HomeTab user={user} coins={coins} setTab={setTab}
          userClass={userClassNum} getProgressPct={quizProgress.getProgressPct} />
      )
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-body">
      <Sidebar tab={tab} setTab={setTab} user={{ ...user, coins }} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="text-sm text-gray-400 font-semibold">{user.school} · Class {user.class}</div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 focus:outline-none bg-white">
              <option>English</option><option>Tamil</option>
            </select>
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg cursor-pointer hover:bg-gray-200 transition-colors">🔔</div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-base cursor-pointer">{user.avatar}</div>
          </div>
        </div>
        <div className="p-6">{renderTab()}</div>
      </main>
    </div>
  )
}

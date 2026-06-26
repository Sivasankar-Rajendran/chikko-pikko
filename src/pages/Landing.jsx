import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  )
}

const STUDENT_PORTAL = {
  role: 'student',
  label: 'Student',
  mascot: '🐿️',
  color: 'from-orange-400 to-yellow-400',
  border: 'border-orange-400',
  btnColor: 'bg-brand-orange',
  hint: 'student123',
}

const STAFF_PORTALS = [
  {
    role: 'teacher',
    label: 'Class Teacher',
    icon: '👩‍🏫',
    color: 'from-green-400 to-teal-400',
    border: 'border-green-400',
    bg: 'bg-green-50',
    btnColor: 'bg-brand-green',
    hint: 'teacher123',
    description: 'Manage your class & assignments',
  },
  {
    role: 'headmaster',
    label: 'HeadMaster',
    icon: '🏫',
    color: 'from-amber-400 to-orange-400',
    border: 'border-amber-400',
    bg: 'bg-amber-50',
    btnColor: 'bg-amber-500',
    hint: 'hm123',
    description: 'Manage teachers & school',
  },
  {
    role: 'district',
    label: 'District / CEO',
    icon: '🏛️',
    color: 'from-blue-400 to-indigo-400',
    border: 'border-blue-400',
    bg: 'bg-blue-50',
    btnColor: 'bg-brand-blue',
    hint: 'district123',
    description: 'Track district-wide progress',
  },
  {
    role: 'state',
    label: 'State / Secretary',
    icon: '🗺️',
    color: 'from-purple-400 to-pink-400',
    border: 'border-purple-400',
    bg: 'bg-purple-50',
    btnColor: 'bg-brand-purple',
    hint: 'state123',
    description: 'View state-wide insights',
  },
]

/* Teacher login — Staff EMIS + DOB */
function TeacherLoginModal({ portal, onClose }) {
  const { loginStaff } = useAuth()
  const navigate = useNavigate()
  const [emis,    setEmis]    = useState('')
  const [dob,     setDob]     = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!emis.trim()) { setError('Please enter your Staff EMIS number.'); return }
    if (!dob)         { setError('Please select your date of birth.'); return }
    setLoading(true)
    setError('')
    const result = await loginStaff(emis.trim(), dob)
    if (result.success) {
      navigate('/teacher')
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-sm border-4 ${portal.border} overflow-hidden`}>
        <div className={`bg-gradient-to-r ${portal.color} p-6 text-center`}>
          <div className="text-5xl mb-2">{portal.icon}</div>
          <h2 className="text-2xl font-display text-white">{portal.label} Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Staff EMIS Number
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">🆔</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={emis}
                onChange={e => { setEmis(e.target.value.replace(/\D/g, '')); setError('') }}
                placeholder="e.g. 2100000005"
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-green-400 font-bold text-gray-700 tracking-wider placeholder:font-normal placeholder:tracking-normal"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Date of Birth</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">🎂</span>
              <input
                type="date"
                value={dob}
                onChange={e => { setDob(e.target.value); setError('') }}
                max={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-green-400 font-semibold text-gray-700"
              />
            </div>
          </div>
          {error && (
            <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-semibold">
              <span className="flex-shrink-0">⚠️</span><span>{error}</span>
            </div>
          )}
          <button type="submit" disabled={loading || !emis || !dob}
            className={`w-full py-3 rounded-2xl text-white font-bold text-lg ${portal.btnColor} hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:scale-100`}>
            {loading ? <span className="flex items-center justify-center gap-2"><Spinner/>Checking...</span> : `Login as ${portal.label}`}
          </button>
          <button type="button" onClick={onClose}
            className="w-full py-2 rounded-xl text-gray-500 font-semibold hover:bg-gray-100 transition-all">
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

/* HM / District / State login — password based */
function LoginModal({ portal, onClose }) {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      const result = login(portal.role, password)
      if (result.success) {
        navigate(`/${portal.role}`)
      } else {
        setError('Invalid password. Hint: ' + portal.hint)
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-sm border-4 ${portal.border} overflow-hidden`}>
        <div className={`bg-gradient-to-r ${portal.color} p-6 text-center`}>
          <div className="text-5xl mb-2">{portal.icon}</div>
          <h2 className="text-2xl font-display text-white">{portal.label} Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder={`Hint: ${portal.hint}`} autoFocus
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-400 font-semibold" />
          </div>
          {error && (
            <div className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2 font-semibold">{error}</div>
          )}
          <button type="submit" disabled={loading}
            className={`w-full py-3 rounded-2xl text-white font-bold text-lg ${portal.btnColor} hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-60`}>
            {loading ? '✨ Logging in...' : `Login as ${portal.label}`}
          </button>
          <button type="button" onClick={onClose}
            className="w-full py-2 rounded-xl text-gray-500 font-semibold hover:bg-gray-100 transition-all">
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

function StaffPickerModal({ onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-5 text-center">
          <div className="text-3xl mb-1">🏫</div>
          <h2 className="text-xl font-display text-white">Staff Login</h2>
          <p className="text-gray-300 text-xs mt-1">Select your role to continue</p>
        </div>
        <div className="p-4 space-y-2.5">
          {STAFF_PORTALS.map(p => (
            <button key={p.role} onClick={() => onSelect(p)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border-2 ${p.border} ${p.bg} hover:scale-[1.02] transition-all text-left`}>
              <span className="text-3xl">{p.icon}</span>
              <div>
                <div className="font-bold text-gray-800 text-sm">{p.label}</div>
                <div className="text-xs text-gray-500">{p.description}</div>
              </div>
              <span className="ml-auto text-gray-400 text-sm">→</span>
            </button>
          ))}
        </div>
        <div className="px-4 pb-4">
          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl text-gray-500 font-semibold hover:bg-gray-100 transition-all text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const [activePortal,   setActivePortal]   = useState(null)
  const [showStaffPicker, setShowStaffPicker] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-purple-50 overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['⭐','🌟','✨','💫','🌈','🎈','🎉','🌸','🦋','🌺'].map((emoji, i) => (
          <div key={i} className="absolute text-2xl opacity-30 animate-float"
            style={{
              left: `${(i * 11) % 95}%`,
              top:  `${(i * 13 + 5) % 85}%`,
              animationDelay:    `${i * 0.4}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}>
            {emoji}
          </div>
        ))}
      </div>

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-6 pt-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐿️</span>
          <div>
            <span className="font-display text-lg text-brand-orange">Chikko</span>
            <span className="font-display text-lg text-gray-600"> & </span>
            <span className="font-display text-lg text-brand-blue">Pikko</span>
          </div>
        </div>
        <button
          onClick={() => setShowStaffPicker(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-gray-400 hover:shadow-md transition-all">
          🏫 Staff Login
        </button>
      </div>

      {/* Hero */}
      <header className="relative pt-8 pb-4 text-center px-4">
        <div className="flex items-center justify-center gap-8 mb-4">
          <div className="relative">
            <div className="w-28 h-28 bg-gradient-to-br from-orange-300 to-yellow-300 rounded-full flex items-center justify-center text-6xl shadow-lg animate-float border-4 border-white">
              🐿️
            </div>
            <div className="absolute -bottom-1 -right-1 bg-brand-orange text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
              Chikko
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-display leading-tight">
              <span className="text-brand-orange">Chikko</span>
              <span className="text-gray-700"> & </span>
              <span className="text-brand-blue">Pikko</span>
            </h1>
            <p className="text-xl font-bold mt-1">
              <span className="text-brand-orange">Learn.</span>{' '}
              <span className="text-brand-green">Play.</span>{' '}
              <span className="text-brand-purple">Grow!</span>
            </p>
          </div>
          <div className="relative">
            <div className="w-28 h-28 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full flex items-center justify-center text-6xl shadow-lg animate-float border-4 border-white" style={{ animationDelay: '1s' }}>
              🐦
            </div>
            <div className="absolute -bottom-1 -left-1 bg-brand-blue text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
              Pikko
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-2">
          <div className="flex items-center gap-2 bg-orange-100 text-brand-orange px-4 py-2 rounded-full font-bold text-sm border-2 border-orange-200">
            🔢 Chikko loves Maths!
          </div>
          <div className="flex items-center gap-2 bg-blue-100 text-brand-blue px-4 py-2 rounded-full font-bold text-sm border-2 border-blue-200">
            📖 Pikko loves English!
          </div>
        </div>
      </header>

      {/* Student login — main CTA */}
      <main className="relative max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl border-4 border-orange-300 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 px-6 py-5 text-center">
            <div className="text-4xl mb-1">🐿️🐦</div>
            <p className="text-white font-bold text-lg">Student Login</p>
            <p className="text-white/80 text-sm">Enter your EMIS number and date of birth</p>
          </div>
          <StudentLoginForm />
        </div>

        {/* Stats */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg p-5 border border-gray-100">
          <div className="grid grid-cols-4 gap-3 text-center">
            {[
              { icon: '🎓', value: '2,50,000+', label: 'Students' },
              { icon: '🏫', value: '500+',       label: 'Schools' },
              { icon: '🏝️', value: '50+',        label: 'Islands' },
              { icon: '🏆', value: '85%',         label: 'Progress' },
            ].map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="text-2xl">{s.icon}</div>
                <div className="text-lg font-display text-brand-blue">{s.value}</div>
                <div className="text-[10px] text-gray-500 font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-400 font-semibold text-xs mt-4">
          📚 Class 1–12 · Tamil Nadu State Board
        </p>
      </main>

      {/* Staff role picker */}
      {showStaffPicker && (
        <StaffPickerModal
          onSelect={(p) => { setShowStaffPicker(false); setActivePortal(p) }}
          onClose={() => setShowStaffPicker(false)}
        />
      )}

      {/* Login modal — teacher uses EMIS+DOB, others use password */}
      {activePortal && (
        activePortal.role === 'teacher'
          ? <TeacherLoginModal portal={activePortal} onClose={() => setActivePortal(null)} />
          : <LoginModal        portal={activePortal} onClose={() => setActivePortal(null)} />
      )}
    </div>
  )
}

function StudentLoginForm() {
  const { loginStudent } = useAuth()
  const navigate = useNavigate()
  const [emis,    setEmis]    = useState('')
  const [dob,     setDob]     = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!emis.trim()) { setError('Please enter your EMIS number.'); return }
    if (!dob)         { setError('Please select your date of birth.'); return }
    setLoading(true)
    setError('')
    const result = await loginStudent(emis.trim(), dob)
    if (result.success) {
      navigate('/student')
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {/* EMIS */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          Student EMIS Number
          <span className="ml-2 text-[10px] font-semibold text-gray-400 normal-case">
            (10-digit school ID)
          </span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">🆔</span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            value={emis}
            onChange={e => { setEmis(e.target.value.replace(/\D/g, '')); setError('') }}
            placeholder="e.g. 1234567801"
            autoFocus
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 font-bold text-gray-700 tracking-wider placeholder:font-normal placeholder:tracking-normal"
          />
        </div>
      </div>

      {/* DOB */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          Date of Birth
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">🎂</span>
          <input
            type="date"
            value={dob}
            onChange={e => { setDob(e.target.value); setError('') }}
            max={new Date().toISOString().split('T')[0]}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 font-semibold text-gray-700"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-semibold">
          <span className="flex-shrink-0 mt-0.5">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <button type="submit" disabled={loading || !emis || !dob}
        className="w-full py-3.5 rounded-2xl text-white font-bold text-lg bg-brand-orange hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:scale-100">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Checking...
          </span>
        ) : "Let's Go! 🚀"}
      </button>

      <p className="text-center text-[11px] text-gray-400 font-semibold">
        Ask your teacher if you don't know your EMIS number
      </p>
    </form>
  )
}

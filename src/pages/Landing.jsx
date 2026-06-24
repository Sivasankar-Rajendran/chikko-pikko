import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LOGIN_PORTALS = [
  {
    role: 'student',
    label: 'Student',
    icon: '🎒',
    mascot: '🐿️',
    color: 'from-orange-400 to-yellow-400',
    border: 'border-orange-400',
    bg: 'bg-orange-50',
    btnColor: 'bg-brand-orange',
    hint: 'student123',
    description: 'Start your adventure!',
  },
  {
    role: 'teacher',
    label: 'Class Teacher',
    icon: '👩‍🏫',
    mascot: '🦉',
    color: 'from-green-400 to-teal-400',
    border: 'border-green-400',
    bg: 'bg-green-50',
    btnColor: 'bg-brand-green',
    hint: 'teacher123',
    description: 'Guide your class!',
  },
  {
    role: 'district',
    label: 'District / CEO',
    icon: '🏫',
    mascot: '🦁',
    color: 'from-blue-400 to-indigo-400',
    border: 'border-blue-400',
    bg: 'bg-blue-50',
    btnColor: 'bg-brand-blue',
    hint: 'district123',
    description: 'Track district progress!',
  },
  {
    role: 'state',
    label: 'State / Secretary',
    icon: '🏛️',
    mascot: '🦅',
    color: 'from-purple-400 to-pink-400',
    border: 'border-purple-400',
    bg: 'bg-purple-50',
    btnColor: 'bg-brand-purple',
    hint: 'state123',
    description: 'View state-wide insights!',
  },
]

function LoginModal({ portal, onClose }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      const result = login(portal.role, password)
      if (result.success) {
        navigate(`/${portal.role}`)
      } else {
        setError('Invalid password. Try: ' + portal.hint)
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-sm border-4 ${portal.border} overflow-hidden`}>
        {/* Header */}
        <div className={`bg-gradient-to-r ${portal.color} p-6 text-center`}>
          <div className="text-5xl mb-2 animate-bounce-slow">{portal.mascot}</div>
          <h2 className="text-2xl font-display text-white">{portal.label} Login</h2>
          <p className="text-white/90 text-sm mt-1">{portal.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Username / ID</label>
            <input
              type="text"
              defaultValue={portal.role === 'student' ? 'karthik.r' : portal.role === 'teacher' ? 'revathi.t' : portal.role + '_admin'}
              readOnly
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-500 font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={`Hint: ${portal.hint}`}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-400 font-semibold"
              autoFocus
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2 font-semibold">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-2xl text-white font-bold text-lg ${portal.btnColor} hover:opacity-90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg disabled:opacity-60`}
          >
            {loading ? '✨ Logging in...' : `Login as ${portal.label}`}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl text-gray-500 font-semibold hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Landing() {
  const [activePortal, setActivePortal] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-purple-50 overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['⭐','🌟','✨','💫','🌈','🎈','🎉','🌸','🦋','🌺'].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-30 animate-float"
            style={{
              left: `${(i * 11) % 95}%`,
              top: `${(i * 13 + 5) % 85}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative pt-10 pb-4 text-center px-4">
        {/* Logo row */}
        <div className="flex items-center justify-center gap-6 mb-4">
          {/* Chikko mascot */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-300 to-yellow-300 rounded-full flex items-center justify-center text-5xl shadow-lg animate-float border-4 border-white">
              🐿️
            </div>
            <div className="absolute -bottom-1 -right-1 bg-brand-orange text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
              Chikko
            </div>
          </div>

          {/* Title */}
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

          {/* Pikko mascot */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full flex items-center justify-center text-5xl shadow-lg animate-float border-4 border-white" style={{ animationDelay: '1s' }}>
              🐦
            </div>
            <div className="absolute -bottom-1 -left-1 bg-brand-blue text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
              Pikko
            </div>
          </div>
        </div>

        {/* Subject tags */}
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-2 bg-orange-100 text-brand-orange px-4 py-2 rounded-full font-bold text-sm border-2 border-orange-200">
            🔢 <span>Chikko loves Maths!</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-100 text-brand-blue px-4 py-2 rounded-full font-bold text-sm border-2 border-blue-200">
            📖 <span>Pikko loves English!</span>
          </div>
        </div>
      </header>

      {/* Login portals */}
      <main className="relative max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-center text-3xl font-display text-gray-700 mb-2">Choose Your Portal</h2>
        <p className="text-center text-gray-500 font-semibold mb-8">Select your role to begin the adventure!</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LOGIN_PORTALS.map((portal) => (
            <button
              key={portal.role}
              onClick={() => setActivePortal(portal)}
              className={`group ${portal.bg} border-2 ${portal.border} rounded-3xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer`}
            >
              <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${portal.color} flex items-center justify-center text-4xl shadow-md mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {portal.mascot}
              </div>
              <div className="text-3xl mb-1">{portal.icon}</div>
              <h3 className="text-lg font-display text-gray-700 mb-1">{portal.label}</h3>
              <p className="text-xs text-gray-500 font-semibold mb-4">{portal.description}</p>
              <div className={`w-full py-2.5 rounded-2xl text-white font-bold text-sm ${portal.btnColor} shadow group-hover:shadow-lg transition-all`}>
                Login →
              </div>
            </button>
          ))}
        </div>

        {/* Stats banner */}
        <div className="mt-12 bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: '🎓', value: '2,50,000+', label: 'Students Learning' },
              { icon: '🏫', value: '500+',       label: 'Schools' },
              { icon: '🏝️', value: '50+',        label: 'Learning Islands' },
              { icon: '🏆', value: '85%',         label: 'Avg. Progress' },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-3xl">{stat.icon}</div>
                <div className="text-2xl font-display text-brand-blue">{stat.value}</div>
                <div className="text-xs text-gray-500 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Classes banner */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 font-semibold text-sm">
            📚 Available for <span className="text-brand-orange font-bold">Class 1 to 12</span> •
            Tamil Nadu State Board
          </p>
        </div>
      </main>

      {/* Login Modal */}
      {activePortal && (
        <LoginModal portal={activePortal} onClose={() => setActivePortal(null)} />
      )}
    </div>
  )
}

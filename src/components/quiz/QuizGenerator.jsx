import { useState, useRef } from 'react'
import { LESSON_MAP, getQuestions } from '../../data/questions/index'

const PASS_PCT = 70

const DIFF_META = [
  { key: 'easy',   label: 'Easy',   icon: '🌱', col: '#28B463', light: '#e8f8f5' },
  { key: 'medium', label: 'Medium', icon: '⚡', col: '#F0A500', light: '#fff8e6' },
  { key: 'hard',   label: 'Hard',   icon: '🔥', col: '#E53935', light: '#fde8e8' },
]

const SUBJ_META = [
  { key: 'maths',     label: 'Maths',     emoji: '🐿️', col: '#FF8A00' },
  { key: 'english',   label: 'English',   emoji: '🐦', col: '#1E88E5' },
  { key: 'physics',   label: 'Physics',   emoji: '⚡', col: '#1976D2' },
  { key: 'chemistry', label: 'Chemistry', emoji: '🧪', col: '#7B1FA2' },
]

function ProgressSteps({ pct }) {
  const steps = DIFF_META.length
  const stepPct = 100 / steps
  return (
    <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-2.5 rounded-full transition-all duration-700 bg-brand-green"
        style={{ width: `${pct}%` }} />
      {Array.from({ length: steps - 1 }, (_, i) => (
        <div key={i} className="absolute top-0 h-2.5 w-0.5 bg-white/80"
          style={{ left: `${(i + 1) * stepPct}%` }} />
      ))}
    </div>
  )
}

export default function QuizGenerator({
  userClass = 5,
  initialSubject = null,
  initialLesson  = null,
  quizProgress,
  lockToLesson   = false,
  onBack         = null,
  onHeaderChange = null,
  onCoinsEarned  = null,  // (amount: number) => void — 0 for retry, >0 for first-try correct answers
  backFnRef      = null,
}) {
  const { getDiffStatus, getFailedIds, getProgressPct, setDiffState, completeDiff } = quizProgress

  /* ─ Selection state ─────────────────────────────────────── */
  const [subject, setSubject] = useState(initialSubject)
  const [lesson,  setLesson]  = useState(initialLesson)

  /* ─ Quiz state ───────────────────────────────────────────── */
  const [phase,      setPhase]      = useState('select')  // select | quiz | result
  const [quizMode,   setQuizMode]   = useState('full')    // full | retry
  const [isReplay,   setIsReplay]   = useState(false)     // true when re-doing an already-completed diff
  const [diff,       setDiff]       = useState(null)
  const [questions,  setQuestions]  = useState([])
  const [current,    setCurrent]    = useState(0)
  const [selected,   setSelected]   = useState(null)
  const [showFb,     setShowFb]     = useState(false)
  const [resultInfo, setResultInfo] = useState(null)

  // Ref for answers to avoid stale-closure issues
  const answersRef   = useRef({})
  const [ansDisplay, setAnsDisplay] = useState({})  // drives renders

  const audioCtxRef = useRef(null)

  function getAudioCtx() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioCtxRef.current
  }

  function playCorrect() {
    try {
      const ctx = getAudioCtx()
      ;[523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc  = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain); gain.connect(ctx.destination)
        osc.type = 'sine'; osc.frequency.value = freq
        const t = ctx.currentTime + i * 0.13
        gain.gain.setValueAtTime(0.28, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
        osc.start(t); osc.stop(t + 0.22)
      })
    } catch {}
  }

  function playWrong() {
    try {
      const ctx  = getAudioCtx()
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sawtooth'; osc.frequency.value = 180
      const t = ctx.currentTime
      gain.gain.setValueAtTime(0.25, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45)
      osc.start(t); osc.stop(t + 0.45)
    } catch {}
  }

  const classLessons = LESSON_MAP[userClass] || {}

  /* ─ Kick off a difficulty ─────────────────────────────────────── */
  function launchDiff(d) {
    const status = getDiffStatus(userClass, subject, lesson, d)
    if (status === 'locked') return

    const all    = getQuestions(userClass, subject, lesson, d)
    const failed = getFailedIds(userClass, subject, lesson, d)
    // unlocked + has saved failedIds → retry mode; otherwise full
    const mode   = (status === 'unlocked' && failed.length > 0) ? 'retry' : 'full'
    const pool   = mode === 'retry' ? all.filter(q => failed.includes(q.id)) : all

    answersRef.current = {}
    setAnsDisplay({})
    setDiff(d)
    setIsReplay(status === 'completed')   // replay = already completed, no coins
    setQuizMode(mode)
    setQuestions(pool)
    setCurrent(0)
    setSelected(null)
    setShowFb(false)
    setResultInfo(null)
    setPhase('quiz')
    onHeaderChange?.({ diff: d, quizMode: mode, current: 0, total: pool.length })
  }

  /* ─ Student picks an option ───────────────────────────────────── */
  function handleAnswer(opt) {
    if (showFb) return
    setSelected(opt)
    setShowFb(true)
    answersRef.current[questions[current].id] = opt
    setAnsDisplay({ ...answersRef.current })
    if (opt === questions[current].answer) {
      playCorrect()
      // Award +10 immediately for each correct answer — only first try, never replays
      if (quizMode === 'full' && !isReplay) onCoinsEarned?.(10)
    } else {
      playWrong()
    }
  }

  /* ─ Move to next question or finish ──────────────────────────── */
  function goNext() {
    if (current + 1 < questions.length) {
      const nextIdx = current + 1
      setCurrent(nextIdx)
      setSelected(null)
      setShowFb(false)
      onHeaderChange?.({ diff, quizMode, current: nextIdx, total: questions.length })
    } else {
      processResults()
    }
  }

  /* ─ Score & decide what happens next ─────────────────────────── */
  function processResults() {
    const finals    = answersRef.current
    const failedIds = questions.filter(q => finals[q.id] !== q.answer).map(q => q.id)
    const sc        = questions.length - failedIds.length
    const pct       = Math.round((sc / questions.length) * 100)
    const total     = questions.length

    let type
    if (quizMode === 'full') {
      if (pct < PASS_PCT) {
        // <70% — clear failedIds so next attempt is full again
        setDiffState(userClass, subject, lesson, diff, { failedIds: [] })
        type = 'fail'
      } else if (failedIds.length === 0) {
        // Perfect: all correct in a single full attempt
        completeDiff(userClass, subject, lesson, diff, true)
        type = 'complete'
      } else {
        // ≥70% but some wrong — save for retry
        setDiffState(userClass, subject, lesson, diff, { failedIds })
        type = 'partial'
      }
    } else {
      // retry mode — had mistakes before, so NOT perfect
      if (failedIds.length === 0) {
        completeDiff(userClass, subject, lesson, diff, false)
        type = 'complete'
      } else {
        // still some wrong — update and loop
        setDiffState(userClass, subject, lesson, diff, { failedIds })
        type = 'retry_continue'
      }
    }

    // Per-answer +10 coins already given in handleAnswer (first try, non-replay only)
    // Here we only award the end-of-quiz bonus coins
    let bonusCoins = 0
    let lessonMastery = false
    if (quizMode === 'full' && !isReplay && failedIds.length === 0) {
      bonusCoins += 30  // perfect: all correct first try
      if (getProgressPct(userClass, subject, lesson) === 100) {
        bonusCoins += 50  // lesson mastery: all 3 difficulties now done
        lessonMastery = true
      }
    }
    if (bonusCoins > 0) onCoinsEarned?.(bonusCoins)
    onHeaderChange?.(null)
    const perAnswerCoins = (quizMode === 'full' && !isReplay) ? sc * 10 : 0
    setResultInfo({
      type, sc, total, pct, failedIds, failedCount: failedIds.length,
      perAnswerCoins,
      bonusCoins,
      coinsEarned: perAnswerCoins + bonusCoins,
      lessonMastery,
      isReplayResult: isReplay,
    })
    setPhase('result')
  }

  /* ─ Keep going with the remaining wrong questions ────────────── */
  function continueRetry() {
    const all  = getQuestions(userClass, subject, lesson, diff)
    const ids  = resultInfo.failedIds   // freshly computed in processResults
    const pool = all.filter(q => ids.includes(q.id))

    answersRef.current = {}
    setAnsDisplay({})
    setQuizMode('retry')
    setQuestions(pool)
    setCurrent(0)
    setSelected(null)
    setShowFb(false)
    setResultInfo(null)
    setPhase('quiz')
    onHeaderChange?.({ diff, quizMode: 'retry', current: 0, total: pool.length })
  }

  function retryFull()    { launchDiff(diff) }
  function backToSelect() {
    onHeaderChange?.(null)
    if (lockToLesson && onBack) { onBack(); return }
    setPhase('select'); setDiff(null); setResultInfo(null)
  }

  // Expose back function so parent header button can trigger it
  if (backFnRef) backFnRef.current = backToSelect

  /* ══════════════════════════════════════════════════════
     SELECT SCREEN
  ══════════════════════════════════════════════════════ */
  if (phase === 'select') {

    /* ── Shared: difficulty picker block ── */
    const diffPicker = lesson ? (
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Difficulty</p>

        {/* Lesson progress bar */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-5 border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-500">{lesson} — Progress</span>
            <span className="text-sm font-bold text-brand-green">{getProgressPct(userClass, subject, lesson)}%</span>
          </div>
          <ProgressSteps pct={getProgressPct(userClass, subject, lesson)} />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Easy · 33%</span><span>Medium · 67%</span><span>Hard · 100%</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {DIFF_META.map(d => {
            const status = getDiffStatus(userClass, subject, lesson, d.key)
            const failed = getFailedIds(userClass, subject, lesson, d.key)
            const locked    = status === 'locked'
            const completed = status === 'completed'
            const hasRetry  = status === 'unlocked' && failed.length > 0

            return (
              <button key={d.key} onClick={() => launchDiff(d.key)} disabled={locked}
                className={`flex flex-col items-center py-7 px-3 rounded-2xl border-2 font-bold transition-all relative ${
                  locked    ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                  : completed ? 'border-green-300 bg-green-50 text-green-600 hover:scale-[1.02] shadow-sm'
                  : 'hover:scale-[1.02] shadow-md cursor-pointer'
                }`}
                style={!locked && !completed ? { borderColor: d.col, background: d.light, color: d.col } : {}}>
                <span className="text-3xl mb-2">
                  {locked ? '🔒' : completed ? '✅' : d.icon}
                </span>
                <span className="text-base">{d.label}</span>
                <span className="text-xs mt-1 opacity-80">
                  {locked    ? 'Locked'
                  : completed ? 'Complete ✓'
                  : hasRetry  ? `${failed.length} to retry`
                  : 'Tap to start'}
                </span>
              </button>
            )
          })}
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          🔒 Complete the previous level with 100% to unlock the next one
        </p>
      </div>
    ) : null

    /* ── Locked: show only the difficulty picker for the pre-set lesson ── */
    if (lockToLesson && lesson) {
      const subjMeta = SUBJ_META.find(s => s.key === subject)
      const pct = getProgressPct(userClass, subject, lesson)
      return (
        <div>
          {/* Breadcrumb / back */}
          <div className="flex items-center gap-2 mb-5">
            {onBack && (
              <button onClick={onBack}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 text-lg transition-colors">
                ←
              </button>
            )}
            <div className="flex items-center gap-2 text-base">
              <span style={{ color: subjMeta?.col }} className="font-bold">{subjMeta?.emoji} {subjMeta?.label}</span>
              <span className="text-gray-300">/</span>
              <span className="font-bold text-gray-700">{lesson}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm font-bold text-gray-400">{pct}% complete</span>
              <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-2 rounded-full transition-all"
                  style={{ width: `${pct}%`, background: subjMeta?.col }} />
              </div>
            </div>
          </div>

          {diffPicker}
        </div>
      )
    }

    /* ── Free-browse: full subject → lesson → difficulty flow ── */
    return (
      <div>

        {/* Subject toggle */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Subject</p>
          <div className="grid grid-cols-2 gap-4">
            {SUBJ_META.filter(s => classLessons[s.key]).map(s => (
              <button key={s.key}
                onClick={() => { setSubject(s.key); setLesson(null) }}
                className={`flex items-center gap-3 p-5 rounded-2xl border-2 font-bold transition-all text-base ${
                  subject === s.key
                    ? 'border-transparent text-white shadow-lg scale-[1.02]'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
                style={subject === s.key ? { background: s.col } : {}}>
                <span className="text-3xl">{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lessons */}
        {subject && (
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Lesson</p>
            <div className="space-y-2">
              {(classLessons[subject] || []).map((l, i) => {
                const pct  = getProgressPct(userClass, subject, l)
                const col  = SUBJ_META.find(s => s.key === subject)?.col || '#FF8A00'
                const done = pct === 100
                return (
                  <button key={l} onClick={() => setLesson(l)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all ${
                      lesson === l
                        ? 'border-brand-orange bg-orange-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: col }}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-700 text-base">{l}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-1.5 rounded-full transition-all"
                            style={{ width: `${pct}%`, background: col }} />
                        </div>
                        <span className={`text-xs font-bold flex-shrink-0 ${done ? 'text-green-500' : 'text-gray-400'}`}>
                          {done ? '✓ Done' : `${pct}%`}
                        </span>
                      </div>
                    </div>
                    {done && <span className="text-green-400 text-lg">✅</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {diffPicker}
      </div>
    )
  }

  /* ══════════════════════════════════════════════════════
     QUIZ SCREEN
  ══════════════════════════════════════════════════════ */
  if (phase === 'quiz') {
    const q         = questions[current]
    const dm        = DIFF_META.find(d => d.key === diff)
    const isCorrect = selected === q.answer

    return (
      <div className="max-w-2xl mx-auto">
        {/* Retry banner */}
        {quizMode === 'retry' && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2">
            <span>🔁</span>
            <p className="text-xs text-purple-700 font-semibold">
              Retry Mode — {questions.length} question{questions.length !== 1 ? 's' : ''} from your last attempt
            </p>
          </div>
        )}

        {/* Question */}
        <div className="rounded-2xl shadow-sm border p-5 mb-4"
          style={{
            background: `linear-gradient(135deg, ${dm?.light || '#f0f9ff'} 0%, #ffffff 100%)`,
            borderColor: (dm?.col || '#FF8A00') + '55',
          }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm"
              style={{ background: dm?.col || '#FF8A00' }}>
              {current + 1}
            </div>
            <p className="text-gray-800 font-semibold text-sm leading-relaxed pt-1">{q.question}</p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2 mb-3">
          {q.options.map((opt, i) => {
            let cls  = 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            let mark = null
            if (showFb) {
              if (opt === q.answer)      { cls = 'border-green-400 bg-green-50 text-green-800'; mark = '✓' }
              else if (opt === selected) { cls = 'border-red-400 bg-red-50 text-red-700';       mark = '✗' }
              else                       { cls = 'border-gray-100 bg-gray-50 text-gray-400 opacity-40' }
            }
            return (
              <button key={i} onClick={() => handleAnswer(opt)} disabled={showFb}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl border-2 font-semibold text-left transition-all ${cls}`}>
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  showFb && opt === q.answer ? 'bg-green-500 text-white'
                  : showFb && opt === selected && !isCorrect ? 'bg-red-400 text-white'
                  : 'bg-gray-100 text-gray-500'
                }`}>
                  {['A','B','C','D'][i]}
                </span>
                <span className="flex-1 text-sm">{opt}</span>
                {mark && (
                  <span className={`text-sm flex-shrink-0 ${mark === '✓' ? 'text-green-500' : 'text-red-400'}`}>
                    {mark}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {showFb && (
          <div className={`rounded-xl px-4 py-3 mb-3 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-sm font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? '🎉 Correct!' : `❌ Correct answer: ${q.answer}`}
            </p>
          </div>
        )}

        {showFb && (
          <button onClick={goNext}
            className="w-full py-3 rounded-2xl text-white font-bold text-sm shadow-lg hover:scale-[1.02] transition-all"
            style={{ background: dm?.col || '#FF8A00' }}>
            {current + 1 < questions.length ? 'Next Question →' : 'View Results 🏆'}
          </button>
        )}
      </div>
    )
  }

  /* ══════════════════════════════════════════════════════
     RESULT SCREENS
  ══════════════════════════════════════════════════════ */
  if (phase === 'result' && resultInfo) {
    const { type, sc, total, pct, failedCount, perAnswerCoins = 0, bonusCoins = 0, coinsEarned = 0, lessonMastery = false, isReplayResult = false } = resultInfo
    const dm    = DIFF_META.find(d => d.key === diff)
    const dIdx  = DIFF_META.findIndex(d => d.key === diff)
    const nextD = DIFF_META[dIdx + 1]

    /* ── FAIL ────────────────────────────────────── */
    if (type === 'fail') return (
      <div className="max-w-xl mx-auto py-4">
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 mb-5 text-center">
          <div className="text-6xl mb-3">😓</div>
          <h2 className="font-display text-2xl text-red-500 mb-1">Keep Trying!</h2>
          <p className="text-sm text-gray-400 mb-6">
            You need 70% to pass. You scored <strong>{pct}%</strong>.
          </p>
          <div className="flex items-center justify-center gap-6 mb-5">
            <div><p className="text-4xl font-display text-brand-orange">{sc}</p><p className="text-xs text-gray-400">Correct</p></div>
            <div className="w-px h-10 bg-gray-200" />
            <div><p className="text-4xl font-display text-red-400">{total - sc}</p><p className="text-xs text-gray-400">Wrong</p></div>
            <div className="w-px h-10 bg-gray-200" />
            <div><p className="text-4xl font-display text-gray-500">{pct}%</p><p className="text-xs text-gray-400">Score</p></div>
          </div>
          <div className="w-full h-2 bg-red-100 rounded-full mb-1">
            <div className="h-2 bg-red-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[11px] text-gray-400 mb-1">
            Need: {Math.ceil(total * PASS_PCT / 100)}/{total} correct to pass
          </p>
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mt-4">
            <p className="text-xs text-red-600 font-semibold">
              All questions have been reset — give it another shot!
            </p>
          </div>
          {isReplayResult ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 mt-3 text-center">
              <p className="text-xs text-gray-400 font-semibold">🔄 Already completed — no coins for replays</p>
            </div>
          ) : perAnswerCoins > 0 ? (
            <div className="bg-yellow-50 border border-yellow-300 rounded-2xl px-4 py-3 mt-3 flex items-center justify-center gap-2">
              <span className="text-lg">🪙</span>
              <span className="font-bold text-yellow-600">+{perAnswerCoins} Coins Added</span>
              <span className="text-xs text-yellow-500">({sc} correct × 10, added as you answered)</span>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 mt-3 text-center">
              <p className="text-xs text-gray-400 font-semibold">No coins this round — answer correctly to earn 🪙</p>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={retryFull}
            className="flex-1 py-3.5 rounded-2xl text-white font-bold shadow-lg hover:scale-[1.02] transition-all"
            style={{ background: dm?.col }}>
            Try Again 🔄
          </button>
          <button onClick={backToSelect}
            className="flex-1 py-3.5 rounded-2xl bg-white text-gray-600 font-bold border-2 border-gray-200 hover:border-gray-300 transition-all">
            Choose Topic
          </button>
        </div>
      </div>
    )

    /* ── PARTIAL PASS ─────────────────────────────── */
    if (type === 'partial') return (
      <div className="max-w-xl mx-auto py-4">
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 mb-5 text-center">
          <div className="text-6xl mb-3">⭐</div>
          <h2 className="font-display text-2xl text-yellow-500 mb-1">Great Start!</h2>
          <p className="text-sm text-gray-400 mb-6">
            You passed with <strong>{pct}%</strong>! Now let's master the rest.
          </p>
          <div className="flex items-center justify-center gap-6 mb-5">
            <div><p className="text-4xl font-display text-brand-green">{sc}</p><p className="text-xs text-gray-400">Correct</p></div>
            <div className="w-px h-10 bg-gray-200" />
            <div><p className="text-4xl font-display text-yellow-400">{failedCount}</p><p className="text-xs text-gray-400">To Retry</p></div>
            <div className="w-px h-10 bg-gray-200" />
            <div><p className="text-4xl font-display text-brand-orange">{pct}%</p><p className="text-xs text-gray-400">Score</p></div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5">
            <p className="text-xs text-yellow-700 font-semibold">
              🔁 Retry Mode: {failedCount} question{failedCount !== 1 ? 's' : ''} will loop until you get them all right!
            </p>
          </div>
          {perAnswerCoins > 0 && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-2xl px-4 py-3 mt-3 flex items-center justify-center gap-2">
              <span className="text-lg">🪙</span>
              <span className="font-bold text-yellow-600">+{perAnswerCoins} Coins Added</span>
              <span className="text-xs text-yellow-500">({sc} correct × 10, added as you answered)</span>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={continueRetry}
            className="flex-1 py-3.5 rounded-2xl text-white font-bold shadow-lg hover:scale-[1.02] transition-all"
            style={{ background: dm?.col }}>
            Start Retry ({failedCount} Qs) →
          </button>
          <button onClick={backToSelect}
            className="flex-1 py-3.5 rounded-2xl bg-white text-gray-600 font-bold border-2 border-gray-200 hover:border-gray-300 transition-all">
            Choose Topic
          </button>
        </div>
      </div>
    )

    /* ── RETRY CONTINUE ───────────────────────────── */
    if (type === 'retry_continue') return (
      <div className="max-w-xl mx-auto py-4">
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 mb-5 text-center">
          <div className="text-6xl mb-3">💪</div>
          <h2 className="font-display text-2xl text-purple-500 mb-1">Almost There!</h2>
          <p className="text-sm text-gray-400 mb-6">
            {sc} of {total} retry questions correct — {failedCount} more to go!
          </p>
          <div className="flex items-center justify-center gap-6 mb-5">
            <div><p className="text-4xl font-display text-brand-green">{sc}</p><p className="text-xs text-gray-400">Correct</p></div>
            <div className="w-px h-10 bg-gray-200" />
            <div><p className="text-4xl font-display text-purple-400">{failedCount}</p><p className="text-xs text-gray-400">Still Need Work</p></div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5">
            <p className="text-xs text-purple-700 font-semibold">
              🔁 {failedCount} question{failedCount !== 1 ? 's' : ''} still repeating — keep going until all are correct!
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 mt-3 text-center">
            <p className="text-xs text-gray-400 font-semibold">🔁 Retry Mode — No coins awarded</p>
          </div>
        </div>
        <button onClick={continueRetry}
          className="w-full py-3.5 rounded-2xl text-white font-bold shadow-lg hover:scale-[1.02] transition-all bg-purple-500">
          Keep Going → ({failedCount} remaining)
        </button>
      </div>
    )

    /* ── COMPLETE ──────────────────────────────────── */
    if (type === 'complete') {
      const nowPct = getProgressPct(userClass, subject, lesson)
      return (
        <div className="max-w-xl mx-auto py-4">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 mb-5 text-center">
            <div className="text-6xl mb-2 animate-bounce">🎉</div>
            <h2 className="font-display text-2xl text-brand-green mb-1">Level Complete!</h2>
            <p className="text-sm font-bold text-gray-500 mb-0.5">
              {dm?.icon} {dm?.label} Mastered!
            </p>
            <p className="text-xs text-gray-400 mb-6">
              {sc}/{total} correct · {lesson}
            </p>

            {/* Updated lesson progress */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-gray-500 font-semibold mb-1.5">
                <span>Lesson Progress</span>
                <span className="text-brand-green font-bold">{nowPct}%</span>
              </div>
              <ProgressSteps pct={nowPct} />
            </div>

            {/* Difficulty status row */}
            <div className="flex justify-center gap-4 mt-4 mb-5">
              {DIFF_META.map((d, i) => {
                const st = getDiffStatus(userClass, subject, lesson, d.key)
                const justUnlocked = i === dIdx + 1 && st === 'unlocked'
                return (
                  <div key={d.key} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border-2 ${
                      st === 'completed' ? 'border-green-400 bg-green-50'
                      : st === 'unlocked' ? `border-dashed ${justUnlocked ? 'border-brand-orange' : 'border-gray-300'} bg-gray-50`
                      : 'border-gray-200 bg-gray-50 opacity-40'
                    }`}>
                      {st === 'completed' ? '✅' : st === 'unlocked' ? d.icon : '🔒'}
                    </div>
                    <span className="text-[10px] mt-1 font-bold text-gray-500">{d.label}</span>
                    {justUnlocked && (
                      <span className="text-[9px] text-brand-orange font-bold">Unlocked!</span>
                    )}
                    {st === 'completed' && (
                      <span className="text-[9px] text-green-500 font-bold">Done ✓</span>
                    )}
                  </div>
                )
              })}
            </div>

            {nextD && getDiffStatus(userClass, subject, lesson, nextD.key) === 'unlocked' && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                <p className="text-xs text-green-700 font-semibold">
                  🔓 {nextD.icon} {nextD.label} is now unlocked! Keep going!
                </p>
              </div>
            )}

            {/* Coin reward */}
            {coinsEarned > 0 ? (
              <div className={`rounded-2xl px-4 py-3 mt-3 border-2 ${
                lessonMastery ? 'bg-amber-50 border-amber-400' : 'bg-yellow-50 border-yellow-400'
              }`}>
                {lessonMastery ? (
                  <>
                    <p className="text-xs text-amber-700 font-bold text-center mb-2">🏆 Lesson Mastered! Perfect All Three!</p>
                    <div className="flex items-center justify-center gap-1.5 flex-wrap text-sm font-bold text-amber-600">
                      <span>+{perAnswerCoins} in-quiz</span>
                      <span className="text-amber-400">+</span>
                      <span>30 perfect</span>
                      <span className="text-amber-400">+</span>
                      <span>50 mastery</span>
                      <span className="text-amber-400">=</span>
                      <span className="font-display text-2xl">🪙 +{coinsEarned}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-yellow-700 font-bold text-center mb-2">🌟 Perfect First Try Bonus!</p>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-yellow-600">+{perAnswerCoins} in-quiz</span>
                      <span className="text-yellow-400 font-bold">+</span>
                      <span className="text-sm font-bold text-yellow-600">30 Bonus</span>
                      <span className="text-yellow-400 font-bold">=</span>
                      <span className="font-display text-2xl text-yellow-600">🪙 +{coinsEarned}</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 mt-3 text-center">
                <p className="text-xs text-gray-400 font-semibold">
                  {isReplayResult ? '🔄 Already mastered — no coins for replays' : '🔁 Retry Mode — No coins awarded'}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {nextD && getDiffStatus(userClass, subject, lesson, nextD.key) === 'unlocked' && (
              <button onClick={() => launchDiff(nextD.key)}
                className="flex-1 py-3.5 rounded-2xl text-white font-bold shadow-lg hover:scale-[1.02] transition-all"
                style={{ background: nextD.col }}>
                {nextD.icon} Practice {nextD.label} →
              </button>
            )}
            <button onClick={backToSelect}
              className="flex-1 py-3.5 rounded-2xl bg-white text-gray-600 font-bold border-2 border-gray-200 hover:border-gray-300 transition-all">
              Choose Topic
            </button>
          </div>
        </div>
      )
    }
  }

  return null
}

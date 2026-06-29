import { useState, useCallback, useEffect, useRef } from 'react'
import { getProgressFS, saveProgressFS } from '../services/firestore'

const STORAGE_KEY_PREFIX = 'chikko_quiz_v1'
const COINS_KEY_PREFIX   = 'chikko_coins_v1'
const STREAK_KEY_PREFIX  = 'chikko_streak_v1'
const BADGES_KEY_PREFIX  = 'chikko_badges_v1'
const DIFFS = ['easy', 'medium', 'hard']

function todayStr() { return new Date().toISOString().slice(0, 10) }
function yesterdayStr() {
  const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10)
}

const defaultLesson = () => ({
  easy:   { status: 'unlocked', failedIds: [] },
  medium: { status: 'locked',   failedIds: [] },
  hard:   { status: 'locked',   failedIds: [] },
})

function storageKey(uid)  { return uid ? `${STORAGE_KEY_PREFIX}_${uid}` : STORAGE_KEY_PREFIX }
function coinsKey(uid)    { return uid ? `${COINS_KEY_PREFIX}_${uid}`   : COINS_KEY_PREFIX   }
function streakKey(uid)   { return uid ? `${STREAK_KEY_PREFIX}_${uid}`  : STREAK_KEY_PREFIX  }
function badgesKey(uid)   { return uid ? `${BADGES_KEY_PREFIX}_${uid}`  : BADGES_KEY_PREFIX  }

function load(uid) {
  try {
    const saved = localStorage.getItem(storageKey(uid))
    if (saved) return JSON.parse(saved)
    // Migrate legacy (un-keyed) data once
    if (uid) {
      const legacy = localStorage.getItem(STORAGE_KEY_PREFIX)
      if (legacy) {
        const parsed = JSON.parse(legacy)
        localStorage.setItem(storageKey(uid), JSON.stringify(parsed))
        localStorage.removeItem(STORAGE_KEY_PREFIX)
        return parsed
      }
    }
    return {}
  } catch { return {} }
}

function loadCoins(uid, fallback = 0) {
  try {
    const val = localStorage.getItem(coinsKey(uid))
    return val !== null ? parseInt(val, 10) : fallback
  } catch { return fallback }
}

function loadStreak(uid) {
  try {
    const val = localStorage.getItem(streakKey(uid))
    return val ? JSON.parse(val) : { count: 0, lastDate: '' }
  } catch { return { count: 0, lastDate: '' } }
}

function loadBadges(uid) {
  try {
    const val = localStorage.getItem(badgesKey(uid))
    return val !== null ? parseInt(val, 10) : 0
  } catch { return 0 }
}

function persist(d, uid)           { localStorage.setItem(storageKey(uid), JSON.stringify(d)) }
function persistCoins(n, uid)      { localStorage.setItem(coinsKey(uid), String(n)) }
function persistStreak(s, uid)     { localStorage.setItem(streakKey(uid), JSON.stringify(s)) }
function persistBadges(n, uid)     { localStorage.setItem(badgesKey(uid), String(n)) }
function lk(cls, subj, les)        { return `${cls}__${subj}__${les}` }

export function useQuizProgress(userId, initialCoins = 0) {
  const [data,       setData]       = useState(() => load(userId))
  const [coins,      setCoinsState] = useState(() => loadCoins(userId, initialCoins))
  const [streak,     setStreakState] = useState(() => loadStreak(userId).count)
  const [badges,     setBadgesState] = useState(() => loadBadges(userId))
  const coinsRef  = useRef(loadCoins(userId, initialCoins))
  const streakRef = useRef(loadStreak(userId))   // { count, lastDate }
  const badgesRef = useRef(loadBadges(userId))
  const syncTimer = useRef(null)

  // On mount: pull Firestore → merge progress, take higher coin/streak value (cross-device sync)
  useEffect(() => {
    if (!userId) return
    getProgressFS(userId)
      .then(fsData => {
        if (Object.keys(fsData).length === 0) return
        const { __coins, __streak, __streakDate, __badges, ...progData } = fsData
        if (typeof __coins === 'number' && __coins > coinsRef.current) {
          coinsRef.current = __coins
          persistCoins(__coins, userId)
          setCoinsState(__coins)
        }
        if (typeof __streak === 'number' && __streak > streakRef.current.count) {
          const merged = { count: __streak, lastDate: __streakDate || '' }
          streakRef.current = merged
          persistStreak(merged, userId)
          setStreakState(__streak)
        }
        if (typeof __badges === 'number' && __badges > badgesRef.current) {
          badgesRef.current = __badges
          persistBadges(__badges, userId)
          setBadgesState(__badges)
        }
        if (Object.keys(progData).length > 0) {
          setData(prev => {
            const merged = { ...prev, ...progData }
            persist(merged, userId)
            return merged
          })
        }
      })
      .catch(() => {}) // offline — keep localStorage data
  }, [userId])

  // Firestore write — debounced 1.5 s, always includes __coins + __streak
  // Only called from completeDiff and resetLesson (NOT from setDiffState)
  const pushToFirestore = useCallback((snapshot) => {
    if (!userId) return
    clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(() => {
      saveProgressFS(userId, {
        ...snapshot,
        __coins:      coinsRef.current,
        __streak:     streakRef.current.count,
        __streakDate: streakRef.current.lastDate,
        __badges:     badgesRef.current,
      }).catch(() => {})
    }, 1500)
  }, [userId])

  // Call once per topic completion — increments streak only if first activity today
  const markDayActivity = useCallback(() => {
    const today = todayStr()
    const cur   = streakRef.current
    if (cur.lastDate === today) return   // already counted today
    const newCount = cur.lastDate === yesterdayStr() ? cur.count + 1 : 1
    const next = { count: newCount, lastDate: today }
    streakRef.current = next
    persistStreak(next, userId)
    setStreakState(newCount)
  }, [userId])

  const getLesson = useCallback((cls, subj, les) =>
    data[lk(cls, subj, les)] || defaultLesson()
  , [data])

  const getDiffStatus = useCallback((cls, subj, les, d) =>
    getLesson(cls, subj, les)[d]?.status || 'locked'
  , [getLesson])

  const getFailedIds = useCallback((cls, subj, les, d) =>
    getLesson(cls, subj, les)[d]?.failedIds || []
  , [getLesson])

  const getProgressPct = useCallback((cls, subj, les) => {
    const lp   = getLesson(cls, subj, les)
    const done = DIFFS.filter(d => lp[d]?.status === 'completed').length
    return Math.round((done / DIFFS.length) * 100)
  }, [getLesson])

  // localStorage ONLY — no Firebase write.
  // Called mid-quiz for fail / partial / retry states — too frequent for Firestore.
  const setDiffState = useCallback((cls, subj, les, d, updates) => {
    setData(prev => {
      const k    = lk(cls, subj, les)
      const cur  = prev[k] || defaultLesson()
      const next = { ...prev, [k]: { ...cur, [d]: { ...cur[d], ...updates } } }
      persist(next, userId)
      return next
    })
  }, [userId])

  // localStorage + Firebase — only when a difficulty is fully completed (max 3× per lesson)
  // isPerfect = true only when completed in full mode with zero wrong answers
  const completeDiff = useCallback((cls, subj, les, d, isPerfect = false) => {
    markDayActivity()
    const nextD = DIFFS[DIFFS.indexOf(d) + 1]
    setData(prev => {
      const k   = lk(cls, subj, les)
      const cur = prev[k] || defaultLesson()
      const updatedLesson = {
        ...cur,
        [d]: { status: 'completed', failedIds: [], perfect: isPerfect },
        ...(nextD ? { [nextD]: { ...cur[nextD], status: 'unlocked', failedIds: [] } } : {}),
      }
      // Award badge when all 3 diffs are now perfect (once per lesson)
      const allPerfect = !updatedLesson.badgeAwarded && DIFFS.every(df =>
        df === d
          ? isPerfect
          : (updatedLesson[df]?.status === 'completed' && updatedLesson[df]?.perfect === true)
      )
      if (allPerfect) {
        updatedLesson.badgeAwarded = true
        const nb = badgesRef.current + 1
        badgesRef.current = nb
        persistBadges(nb, userId)
        setBadgesState(nb)
      }
      const next = { ...prev, [k]: updatedLesson }
      persist(next, userId)
      pushToFirestore(next)
      return next
    })
  }, [userId, pushToFirestore, markDayActivity])

  // Adds coins: localStorage immediately, Firestore piggybacked on next completeDiff
  const addCoins = useCallback((amount) => {
    if (amount <= 0) return
    const next = coinsRef.current + amount
    coinsRef.current = next
    persistCoins(next, userId)
    setCoinsState(next)
  }, [userId])

  // Spends coins: localStorage immediately, Firestore piggybacked on next completeDiff
  const spendCoins = useCallback((amount) => {
    const next = Math.max(0, coinsRef.current - amount)
    coinsRef.current = next
    persistCoins(next, userId)
    setCoinsState(next)
  }, [userId])

  // localStorage + Firebase (lesson reset is a meaningful state change)
  const resetLesson = useCallback((cls, subj, les) => {
    setData(prev => {
      const next = { ...prev }
      delete next[lk(cls, subj, les)]
      persist(next, userId)
      pushToFirestore(next)
      return next
    })
  }, [userId, pushToFirestore])

  return {
    getLesson, getDiffStatus, getFailedIds, getProgressPct,
    setDiffState, completeDiff, resetLesson,
    coins, addCoins, spendCoins,
    streak, badges,
  }
}

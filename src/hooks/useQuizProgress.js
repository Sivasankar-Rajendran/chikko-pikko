import { useState, useCallback, useEffect, useRef } from 'react'
import { getProgressFS, saveProgressFS } from '../services/firestore'

const STORAGE_KEY_PREFIX = 'chikko_quiz_v1'
const DIFFS = ['easy', 'medium', 'hard']

const defaultLesson = () => ({
  easy:   { status: 'unlocked', failedIds: [] },
  medium: { status: 'locked',   failedIds: [] },
  hard:   { status: 'locked',   failedIds: [] },
})

function storageKey(userId) { return userId ? `${STORAGE_KEY_PREFIX}_${userId}` : STORAGE_KEY_PREFIX }

function load(userId) {
  try {
    const key   = storageKey(userId)
    const saved = localStorage.getItem(key)
    if (saved) return JSON.parse(saved)
    // Migrate legacy (un-keyed) data once
    if (userId) {
      const legacy = localStorage.getItem(STORAGE_KEY_PREFIX)
      if (legacy) {
        const parsed = JSON.parse(legacy)
        localStorage.setItem(key, JSON.stringify(parsed))
        localStorage.removeItem(STORAGE_KEY_PREFIX)
        return parsed
      }
    }
    return {}
  } catch { return {} }
}

function persist(d, userId) {
  localStorage.setItem(storageKey(userId), JSON.stringify(d))
}

function lk(cls, subj, les) { return `${cls}__${subj}__${les}` }

export function useQuizProgress(userId) {
  const [data, setData] = useState(() => load(userId))
  const syncTimer = useRef(null)

  // On mount: pull Firestore and merge (handles cross-device sync)
  useEffect(() => {
    if (!userId) return
    getProgressFS(userId)
      .then(fsData => {
        if (Object.keys(fsData).length === 0) return
        setData(prev => {
          const merged = { ...prev, ...fsData }
          persist(merged, userId)
          return merged
        })
      })
      .catch(() => {}) // offline — keep localStorage data
  }, [userId])

  // Debounced Firestore write so rapid quiz answers don't spam writes
  const pushToFirestore = useCallback((snapshot) => {
    if (!userId) return
    clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(() => {
      saveProgressFS(userId, snapshot).catch(() => {})
    }, 1500)
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

  const setDiffState = useCallback((cls, subj, les, d, updates) => {
    setData(prev => {
      const k    = lk(cls, subj, les)
      const cur  = prev[k] || defaultLesson()
      const next = { ...prev, [k]: { ...cur, [d]: { ...cur[d], ...updates } } }
      persist(next, userId)
      pushToFirestore(next)
      return next
    })
  }, [userId, pushToFirestore])

  const completeDiff = useCallback((cls, subj, les, d) => {
    const nextD = DIFFS[DIFFS.indexOf(d) + 1]
    setData(prev => {
      const k       = lk(cls, subj, les)
      const cur     = prev[k] || defaultLesson()
      const updated = {
        ...cur,
        [d]: { status: 'completed', failedIds: [] },
        ...(nextD ? { [nextD]: { ...cur[nextD], status: 'unlocked', failedIds: [] } } : {}),
      }
      const next = { ...prev, [k]: updated }
      persist(next, userId)
      pushToFirestore(next)
      return next
    })
  }, [userId, pushToFirestore])

  const resetLesson = useCallback((cls, subj, les) => {
    setData(prev => {
      const next = { ...prev }
      delete next[lk(cls, subj, les)]
      persist(next, userId)
      pushToFirestore(next)
      return next
    })
  }, [userId, pushToFirestore])

  return { getLesson, getDiffStatus, getFailedIds, getProgressPct, setDiffState, completeDiff, resetLesson }
}

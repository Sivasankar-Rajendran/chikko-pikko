import { useState, useCallback } from 'react'

const STORAGE_KEY = 'chikko_quiz_v1'
const DIFFS = ['easy', 'medium', 'hard']

const defaultLesson = () => ({
  easy:   { status: 'unlocked', failedIds: [] },
  medium: { status: 'locked',   failedIds: [] },
  hard:   { status: 'locked',   failedIds: [] },
})

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  catch { return {} }
}

function persist(d) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d))
}

function lk(cls, subj, les) { return `${cls}__${subj}__${les}` }

export function useQuizProgress() {
  const [data, setData] = useState(load)

  const getLesson = useCallback((cls, subj, les) =>
    data[lk(cls, subj, les)] || defaultLesson()
  , [data])

  const getDiffStatus = useCallback((cls, subj, les, d) =>
    getLesson(cls, subj, les)[d]?.status || 'locked'
  , [getLesson])

  const getFailedIds = useCallback((cls, subj, les, d) =>
    getLesson(cls, subj, les)[d]?.failedIds || []
  , [getLesson])

  // 0 done=0%, 1 done=33%, 2 done=67%, 3 done=100%
  const getProgressPct = useCallback((cls, subj, les) => {
    const lp = getLesson(cls, subj, les)
    const done = DIFFS.filter(d => lp[d]?.status === 'completed').length
    return Math.round((done / DIFFS.length) * 100)
  }, [getLesson])

  const setDiffState = useCallback((cls, subj, les, d, updates) => {
    setData(prev => {
      const k = lk(cls, subj, les)
      const cur = prev[k] || defaultLesson()
      const next = { ...prev, [k]: { ...cur, [d]: { ...cur[d], ...updates } } }
      persist(next)
      return next
    })
  }, [])

  // Mark difficulty complete and unlock the next one
  const completeDiff = useCallback((cls, subj, les, d) => {
    const nextD = DIFFS[DIFFS.indexOf(d) + 1]
    setData(prev => {
      const k = lk(cls, subj, les)
      const cur = prev[k] || defaultLesson()
      const updated = {
        ...cur,
        [d]: { status: 'completed', failedIds: [] },
        ...(nextD ? { [nextD]: { ...cur[nextD], status: 'unlocked', failedIds: [] } } : {}),
      }
      const next = { ...prev, [k]: updated }
      persist(next)
      return next
    })
  }, [])

  // Reset a lesson completely (for testing/dev)
  const resetLesson = useCallback((cls, subj, les) => {
    setData(prev => {
      const next = { ...prev }
      delete next[lk(cls, subj, les)]
      persist(next)
      return next
    })
  }, [])

  return { getLesson, getDiffStatus, getFailedIds, getProgressPct, setDiffState, completeDiff, resetLesson }
}

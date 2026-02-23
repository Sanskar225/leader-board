// Number formatting
export const formatNumber = (n) => {
  if (n === null || n === undefined) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

// Rank change display
export const formatRankChange = (change) => {
  if (!change) return null
  if (change > 0) return { label: `+${change}`, color: 'text-green-bright' }
  if (change < 0) return { label: `${change}`, color: 'text-red' }
  return null
}

// Percentile to tier
export const getTier = (percentile) => {
  if (percentile >= 95) return { label: 'LEGENDARY', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' }
  if (percentile >= 80) return { label: 'ELITE', color: '#a855f7', bg: 'rgba(168,85,247,0.1)' }
  if (percentile >= 60) return { label: 'EXPERT', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' }
  if (percentile >= 40) return { label: 'ADVANCED', color: '#10b981', bg: 'rgba(16,185,129,0.1)' }
  if (percentile >= 20) return { label: 'RISING', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' }
  return { label: 'NOVICE', color: '#5a5675', bg: 'rgba(90,86,117,0.1)' }
}

// Relative time
export const timeAgo = (date) => {
  if (!date) return 'Never'
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// Rank medal
export const getRankMedal = (rank) => {
  if (rank === 1) return { emoji: '🥇', class: 'rank-1' }
  if (rank === 2) return { emoji: '🥈', class: 'rank-2' }
  if (rank === 3) return { emoji: '🥉', class: 'rank-3' }
  return null
}

// Debounce
export const debounce = (fn, ms) => {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
}

// Clamp
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

// Score color gradient
export const getScoreColor = (score, max = 5000) => {
  const pct = clamp(score / max, 0, 1)
  if (pct > 0.8) return '#f59e0b'
  if (pct > 0.6) return '#a855f7'
  if (pct > 0.4) return '#06b6d4'
  if (pct > 0.2) return '#10b981'
  return '#5a5675'
}

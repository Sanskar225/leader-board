import React from 'react'
import { formatNumber, getTier, getRankMedal, formatRankChange } from '../utils/helpers'
import { TrendingUp, TrendingDown, Minus, Github, Code } from 'lucide-react'

// ── Skeleton ──────────────────────────────────────
export function Skeleton({ className = '' }) {
  return <div className={`shimmer rounded ${className}`} />
}

// ── Stat Card ─────────────────────────────────────
export function StatCard({ label, value, subvalue, icon, color = '#7c3aed', loading }) {
  if (loading) return (
    <div className="panel p-4">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-8 w-20 mb-1" />
      <Skeleton className="h-3 w-16" />
    </div>
  )

  return (
    <div className="panel p-4 group hover:border-accent/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-mono text-text-muted uppercase tracking-wider">{label}</span>
        {icon && (
          <div className="p-1.5 rounded-lg" style={{ background: `${color}15` }}>
            <div style={{ color }}>{icon}</div>
          </div>
        )}
      </div>
      <div className="score-display text-2xl font-bold" style={{ color }}>
        {formatNumber(value)}
      </div>
      {subvalue && <div className="text-xs text-text-muted mt-1">{subvalue}</div>}
    </div>
  )
}

// ── Rank Badge ────────────────────────────────────
export function RankBadge({ rank }) {
  const medal = getRankMedal(rank)
  if (medal) return (
    <span className={`font-mono text-sm font-bold ${medal.class}`}>
      {medal.emoji} #{rank}
    </span>
  )
  return (
    <span className="font-mono text-sm text-text-secondary">#{rank}</span>
  )
}

// ── Tier Badge ────────────────────────────────────
export function TierBadge({ percentile }) {
  const tier = getTier(percentile || 0)
  return (
    <span
      className="tag font-mono text-xs"
      style={{ color: tier.color, background: tier.bg, border: `1px solid ${tier.color}40` }}
    >
      {tier.label}
    </span>
  )
}

// ── Score Bar ─────────────────────────────────────
export function ScoreBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-text-muted">{label}</span>
        <span className="text-xs font-mono" style={{ color }}>{formatNumber(value)}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}90, ${color})` }}
        />
      </div>
    </div>
  )
}

// ── Avatar ────────────────────────────────────────
export function Avatar({ user, size = 40 }) {
  const src = user?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.username || 'anon'}`
  return (
    <img
      src={src}
      alt={user?.username || ''}
      className="rounded-full object-cover ring-2 ring-border"
      style={{ width: size, height: size }}
      onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.username}` }}
    />
  )
}

// ── Platform Tag ──────────────────────────────────
export function PlatformTag({ platform }) {
  const cfg = {
    github: { icon: <Github size={10} />, color: '#9490b5', label: 'GitHub' },
    leetcode: { icon: <Code size={10} />, color: '#f59e0b', label: 'LeetCode' },
  }[platform] || {}
  return (
    <span className="tag" style={{ color: cfg.color, background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}>
      {cfg.icon} {cfg.label}
    </span>
  )
}

// ── Rank Change Indicator ─────────────────────────
export function RankChange({ change }) {
  if (!change) return null
  if (change > 0) return (
    <span className="flex items-center gap-0.5 text-xs text-green-bright font-mono">
      <TrendingUp size={10} /> +{change}
    </span>
  )
  if (change < 0) return (
    <span className="flex items-center gap-0.5 text-xs text-red font-mono">
      <TrendingDown size={10} /> {change}
    </span>
  )
  return <span className="text-xs text-text-muted font-mono"><Minus size={10} /></span>
}

// ── Loading Spinner ───────────────────────────────
export function Spinner({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="spin-slow">
      <circle cx="12" cy="12" r="10" stroke="#1e1e2e" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// ── Empty State ───────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-4xl mb-4">{icon || '🏆'}</div>
      <div className="font-display text-lg text-text-primary mb-2">{title}</div>
      <div className="text-sm text-text-muted mb-6 max-w-xs">{description}</div>
      {action}
    </div>
  )
}

// ── Error Alert ───────────────────────────────────
export function ErrorAlert({ message }) {
  if (!message) return null
  return (
    <div className="p-3 rounded-lg bg-red/10 border border-red/20 text-red text-sm flex items-start gap-2">
      <span>⚠</span>
      <span>{message}</span>
    </div>
  )
}

// ── Success Alert ─────────────────────────────────
export function SuccessAlert({ message }) {
  if (!message) return null
  return (
    <div className="p-3 rounded-lg bg-green/10 border border-green/20 text-green-bright text-sm flex items-start gap-2">
      <span>✓</span>
      <span>{message}</span>
    </div>
  )
}

// ── Diff Stat ─────────────────────────────────────
export function DiffStat({ current, target, label, higherIsBetter = true }) {
  const diff = current - target
  const better = higherIsBetter ? diff > 0 : diff < 0
  const color = diff === 0 ? '#5a5675' : better ? '#10b981' : '#ef4444'
  return (
    <div className="text-center">
      <div className="text-xs text-text-muted mb-1">{label}</div>
      <div className="font-mono text-sm" style={{ color }}>
        {diff > 0 ? '+' : ''}{formatNumber(diff)}
      </div>
    </div>
  )
}

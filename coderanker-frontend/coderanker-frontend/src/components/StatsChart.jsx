import React from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Cell
} from 'recharts'
import { formatNumber } from '../utils/helpers'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass panel px-3 py-2 text-xs font-mono">
        <div className="text-text-muted mb-1">{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{ color: p.color }}>{formatNumber(p.value)}</div>
        ))}
      </div>
    )
  }
  return null
}

export function LeetCodeRadar({ stats }) {
  if (!stats) return null
  const max = Math.max(stats.easySolved || 1, stats.mediumSolved || 1, stats.hardSolved || 1)
  const data = [
    { subject: 'Easy', value: stats.easySolved || 0, fullMark: max * 1.2 },
    { subject: 'Medium', value: stats.mediumSolved || 0, fullMark: max * 1.2 },
    { subject: 'Hard', value: stats.hardSolved || 0, fullMark: max * 1.2 },
    { subject: 'Acceptance', value: stats.acceptanceRate || 0, fullMark: 100 },
  ]

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data}>
        <PolarGrid stroke="#1e1e2e" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9490b5', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
        <Radar
          name="Stats"
          dataKey="value"
          stroke="#06b6d4"
          fill="#06b6d4"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export function GitHubBars({ stats }) {
  if (!stats) return null
  const data = [
    { name: 'Repos', value: stats.publicRepos || 0, color: '#7c3aed' },
    { name: 'Stars', value: stats.totalStars || 0, color: '#f59e0b' },
    { name: 'Forks', value: stats.totalForks || 0, color: '#06b6d4' },
    { name: 'Followers', value: stats.followers || 0, color: '#10b981' },
  ]

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} barSize={20}>
        <XAxis
          dataKey="name"
          tick={{ fill: '#9490b5', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function ScoreBreakdown({ leetCodeScore = 0, githubScore = 0, totalScore = 0 }) {
  const lcPct = totalScore > 0 ? (leetCodeScore / totalScore) * 100 : 70
  const ghPct = totalScore > 0 ? (githubScore / totalScore) * 100 : 30

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-cyan font-mono">LeetCode</span>
          <span className="text-text-muted font-mono">{formatNumber(leetCodeScore)} pts</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${lcPct}%`, background: 'linear-gradient(90deg, #0891b2, #06b6d4)' }}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-accent font-mono">GitHub</span>
          <span className="text-text-muted font-mono">{formatNumber(githubScore)} pts</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${ghPct}%`, background: 'linear-gradient(90deg, #6d28d9, #7c3aed)' }}
          />
        </div>
      </div>
    </div>
  )
}

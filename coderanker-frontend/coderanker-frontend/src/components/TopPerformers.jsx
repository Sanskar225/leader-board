import React, { useState, useEffect } from 'react'
import { leaderboardAPI } from '../services/api'
import { Avatar, TierBadge } from './UI'
import { formatNumber } from '../utils/helpers'
import { Crown, Star, Github, Code } from 'lucide-react'

export default function TopPerformers() {
  const [performers, setPerformers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    leaderboardAPI.getTopPerformers(3).then(({ data }) => {
      setPerformers(data.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="panel p-6 shimmer h-48" />
      ))}
    </div>
  )

  if (!performers.length) return null

  const podium = [performers[1], performers[0], performers[2]].filter(Boolean)
  const medals = ['🥈', '🥇', '🥉']
  const heights = ['h-40', 'h-52', 'h-40']
  const borderColors = ['#9ca3af', '#f59e0b', '#d97706']

  return (
    <div className="relative">
      {/* Glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="flex items-end justify-center gap-3 md:gap-6">
        {podium.map((entry, i) => {
          const isFirst = i === 1
          const borderColor = borderColors[i]
          const rank = isFirst ? 1 : i === 0 ? 2 : 3

          return (
            <div
              key={entry?._id}
              className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl panel transition-all duration-300 hover:-translate-y-1 flex-1 max-w-[200px] ${
                isFirst ? 'border-gold/30 bg-gold/5' : ''
              }`}
              style={{ borderColor: `${borderColor}40` }}
            >
              {isFirst && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Crown size={20} className="text-gold" />
                </div>
              )}

              {/* Medal */}
              <div className="text-3xl">{medals[i]}</div>

              {/* Avatar */}
              <div className="relative">
                <Avatar user={entry?.user} size={isFirst ? 64 : 52} />
                {isFirst && (
                  <div className="absolute inset-0 rounded-full ring-2 ring-gold/50 animate-pulse-glow" />
                )}
              </div>

              {/* Name */}
              <div className="text-center">
                <div className={`font-display text-sm font-bold truncate max-w-[120px] ${
                  isFirst ? 'text-gold' : 'text-text-primary'
                }`}>
                  {entry?.user?.username || 'Unknown'}
                </div>
                <div className="text-xs font-mono text-text-muted mt-0.5">Rank #{rank}</div>
              </div>

              {/* Score */}
              <div className="text-center">
                <div className="font-mono text-lg font-bold" style={{ color: borderColor }}>
                  {formatNumber(entry?.totalScore)}
                </div>
                <div className="text-xs text-text-muted">points</div>
              </div>

              {/* Breakdown */}
              <div className="flex gap-2 text-xs">
                <div className="flex items-center gap-1 text-cyan">
                  <Code size={10} />
                  <span className="font-mono">{formatNumber(entry?.leetCodeScore)}</span>
                </div>
                <div className="flex items-center gap-1 text-accent">
                  <Github size={10} />
                  <span className="font-mono">{formatNumber(entry?.githubScore)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

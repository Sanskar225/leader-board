import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../services/api'
import { Avatar, TierBadge, Spinner, DiffStat } from '../components/UI'
import { formatNumber, timeAgo } from '../utils/helpers'
import { ArrowLeft, Github, Code, Trophy, Star, GitFork, Users } from 'lucide-react'

export default function ComparePage() {
  const { userId } = useParams()
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    userAPI.compareUser(userId)
      .then(({ data: d }) => setData(d.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load comparison'))
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <Spinner size={40} />
    </div>
  )

  if (error) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">⚔️</div>
        <div className="text-text-muted">{error}</div>
        <Link to="/leaderboard" className="btn-ghost mt-4 inline-block text-sm">← Back to Leaderboard</Link>
      </div>
    </div>
  )

  const { currentUser: me, targetUser: them, comparisons } = data
  const users = [
    { data: me, label: 'YOU', color: '#7c3aed', accent: true },
    { data: them, label: 'OPPONENT', color: '#06b6d4', accent: false },
  ]

  const renderUser = (u, color) => (
    <div className="panel p-5 flex-1">
      <div className="flex flex-col items-center text-center gap-3">
        <Avatar user={u.user?.user} size={64} />
        <div>
          <div className="font-display text-lg font-bold text-text-primary">{u.user?.user?.username || 'Unknown'}</div>
          {u.leaderboard?.rank && (
            <div className="font-mono text-sm" style={{ color }}>Rank #{u.leaderboard.rank}</div>
          )}
        </div>
        <div className="font-mono text-3xl font-bold" style={{ color }}>
          {formatNumber(u.leaderboard?.totalScore || 0)}
        </div>
        <div className="text-xs text-text-muted">total score</div>
        <div className="grid grid-cols-2 gap-2 w-full text-xs">
          <div className="panel p-2 text-center">
            <div className="text-cyan font-mono font-bold">{formatNumber(u.leaderboard?.leetCodeScore || 0)}</div>
            <div className="text-text-muted">LC Score</div>
          </div>
          <div className="panel p-2 text-center">
            <div className="text-accent font-mono font-bold">{formatNumber(u.leaderboard?.githubScore || 0)}</div>
            <div className="text-text-muted">GH Score</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/leaderboard" className="text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary">HEAD-TO-HEAD</h1>
            <p className="text-text-muted text-sm">Detailed comparison across all metrics</p>
          </div>
        </div>

        {/* Overview cards */}
        <div className="flex gap-4 mb-6">
          {renderUser(me, '#7c3aed')}
          <div className="flex flex-col items-center justify-center px-4 gap-2">
            <span className="text-2xl">⚔️</span>
            <span className="font-mono text-xs text-text-muted">VS</span>
          </div>
          {renderUser(them, '#06b6d4')}
        </div>

        {/* Diff bar */}
        {comparisons?.overall?.score && (
          <div className="panel p-4 mb-6">
            <div className="text-xs font-mono text-text-muted mb-3 text-center">SCORE DIFFERENCE</div>
            <div className="flex items-center gap-3">
              <div className="text-xs font-mono text-accent w-16 text-right">{formatNumber(me.leaderboard?.totalScore || 0)}</div>
              <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden flex">
                {(() => {
                  const total = (me.leaderboard?.totalScore || 0) + (them.leaderboard?.totalScore || 0)
                  const myPct = total > 0 ? ((me.leaderboard?.totalScore || 0) / total) * 100 : 50
                  return (
                    <>
                      <div style={{ width: `${myPct}%`, background: 'linear-gradient(90deg, #6d28d9, #7c3aed)' }} className="h-full transition-all duration-700" />
                      <div style={{ width: `${100 - myPct}%`, background: 'linear-gradient(90deg, #0891b2, #06b6d4)' }} className="h-full transition-all duration-700" />
                    </>
                  )
                })()}
              </div>
              <div className="text-xs font-mono text-cyan w-16">{formatNumber(them.leaderboard?.totalScore || 0)}</div>
            </div>
          </div>
        )}

        {/* LeetCode comparison */}
        <div className="panel p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Code size={15} className="text-cyan" />
            <h2 className="font-display text-sm font-bold text-text-primary">LEETCODE COMPARISON</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 text-left text-xs font-mono text-text-muted">Metric</th>
                  <th className="py-2 text-center text-xs font-mono text-accent">You</th>
                  <th className="py-2 text-center text-xs font-mono text-text-muted">Diff</th>
                  <th className="py-2 text-center text-xs font-mono text-cyan">Opponent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {comparisons?.leetcode && Object.entries(comparisons.leetcode).map(([key, val]) => (
                  <tr key={key}>
                    <td className="py-2.5 text-xs text-text-muted capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                    <td className={`py-2.5 text-center font-mono text-xs ${val.better === 'current' ? 'text-green-bright' : 'text-text-secondary'}`}>
                      {formatNumber(val.current)}
                    </td>
                    <td className="py-2.5 text-center">
                      <DiffStat current={val.current} target={val.target} higherIsBetter={key !== 'ranking'} />
                    </td>
                    <td className={`py-2.5 text-center font-mono text-xs ${val.better === 'target' ? 'text-green-bright' : 'text-text-secondary'}`}>
                      {formatNumber(val.target)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GitHub comparison */}
        <div className="panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <Github size={15} className="text-accent" />
            <h2 className="font-display text-sm font-bold text-text-primary">GITHUB COMPARISON</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 text-left text-xs font-mono text-text-muted">Metric</th>
                  <th className="py-2 text-center text-xs font-mono text-accent">You</th>
                  <th className="py-2 text-center text-xs font-mono text-text-muted">Diff</th>
                  <th className="py-2 text-center text-xs font-mono text-cyan">Opponent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {comparisons?.github && Object.entries(comparisons.github).map(([key, val]) => (
                  <tr key={key}>
                    <td className="py-2.5 text-xs text-text-muted capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                    <td className={`py-2.5 text-center font-mono text-xs ${val.better === 'current' ? 'text-green-bright' : 'text-text-secondary'}`}>
                      {formatNumber(val.current)}
                    </td>
                    <td className="py-2.5 text-center">
                      <DiffStat current={val.current} target={val.target} />
                    </td>
                    <td className={`py-2.5 text-center font-mono text-xs ${val.better === 'target' ? 'text-green-bright' : 'text-text-secondary'}`}>
                      {formatNumber(val.target)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect, useCallback } from 'react'
import { leaderboardAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import wsService from '../services/websocket'
import { Avatar, TierBadge, RankChange, Spinner, Skeleton } from './UI'
import { formatNumber, timeAgo } from '../utils/helpers'
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight, Trophy, Github, Code, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function LeaderboardTable() {
  const { user: currentUser, isAuthenticated } = useAuth()
  const [entries, setEntries] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 })
  const [currentUser2, setCurrentUser2] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState('all')
  const [sortBy, setSortBy] = useState('totalScore')
  const [liveUpdate, setLiveUpdate] = useState(false)

  const fetchLeaderboard = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const { data } = await leaderboardAPI.getLeaderboard({
        page,
        limit: 20,
        search,
        platform,
        sortBy,
      })
      setEntries(data.data.leaderboard)
      setPagination(data.data.pagination)
      setCurrentUser2(data.data.currentUser)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [search, platform, sortBy])

  useEffect(() => {
    const t = setTimeout(() => fetchLeaderboard(1), search ? 400 : 0)
    return () => clearTimeout(t)
  }, [fetchLeaderboard])

  // Subscribe to live WS updates
  useEffect(() => {
    const unsub = wsService.on('leaderboard_update', (msg) => {
      if (pagination.page === 1) {
        setEntries(msg.data.slice(0, 20))
        setLiveUpdate(true)
        setTimeout(() => setLiveUpdate(false), 2000)
      }
    })
    wsService.subscribe('leaderboard')
    return () => unsub()
  }, [pagination.page])

  const getRankDisplay = (rank) => {
    if (rank === 1) return <span className="font-mono font-bold text-gold rank-1">🥇 #1</span>
    if (rank === 2) return <span className="font-mono font-bold text-text-secondary rank-2">🥈 #2</span>
    if (rank === 3) return <span className="font-mono font-bold text-gold rank-3">🥉 #3</span>
    return <span className="font-mono text-sm text-text-secondary">#{rank}</span>
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search username..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={platform}
            onChange={e => setPlatform(e.target.value)}
            className="input-field w-auto text-sm cursor-pointer"
          >
            <option value="all">All Platforms</option>
            <option value="leetcode">LeetCode</option>
            <option value="github">GitHub</option>
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="input-field w-auto text-sm cursor-pointer"
          >
            <option value="totalScore">Total Score</option>
            <option value="leetCodeScore">LeetCode</option>
            <option value="githubScore">GitHub</option>
          </select>
          <button
            onClick={() => fetchLeaderboard(pagination.page)}
            className="btn-ghost p-2.5"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Live indicator */}
      {liveUpdate && (
        <div className="flex items-center gap-2 text-xs text-green-bright font-mono animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-green-bright" />
          LIVE UPDATE
        </div>
      )}

      {/* Current user position (if not on page 1) */}
      {currentUser2 && pagination.page === 1 && (
        <div className="panel p-3 border-accent/30 bg-accent/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-accent">YOUR RANK</span>
              <span className="font-mono font-bold text-accent-glow">#{currentUser2.rank}</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="font-mono text-text-secondary">Score: <span className="text-text-primary">{formatNumber(currentUser2.totalScore)}</span></span>
              <TierBadge percentile={currentUser2.percentile} />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-mono text-text-muted uppercase tracking-wider w-16">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-mono text-text-muted uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-right text-xs font-mono text-text-muted uppercase tracking-wider hidden sm:table-cell">LC Score</th>
                <th className="px-4 py-3 text-right text-xs font-mono text-text-muted uppercase tracking-wider hidden md:table-cell">GH Score</th>
                <th className="px-4 py-3 text-right text-xs font-mono text-text-muted uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-right text-xs font-mono text-text-muted uppercase tracking-wider hidden lg:table-cell">Tier</th>
                <th className="px-4 py-3 text-right text-xs font-mono text-text-muted uppercase tracking-wider hidden xl:table-cell">Δ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-8" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell"><Skeleton className="h-4 w-16 ml-auto" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-4 w-16 ml-auto" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-20 ml-auto" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><Skeleton className="h-5 w-20 ml-auto rounded" /></td>
                    <td className="px-4 py-3 hidden xl:table-cell"><Skeleton className="h-4 w-10 ml-auto" /></td>
                  </tr>
                ))
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-text-muted text-sm">
                    {search ? 'No users found matching your search.' : 'No entries yet.'}
                  </td>
                </tr>
              ) : (
                entries.map((entry, i) => {
                  const isCurrentUser = currentUser && entry.user?._id === currentUser._id
                  const globalRank = (pagination.page - 1) * pagination.limit + i + 1

                  return (
                    <tr
                      key={entry._id}
                      className={`transition-colors duration-200 ${
                        isCurrentUser
                          ? 'bg-accent/5 hover:bg-accent/10'
                          : 'hover:bg-surface'
                      }`}
                    >
                      <td className="px-4 py-3">
                        {getRankDisplay(entry.rank || globalRank)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={isAuthenticated ? `/compare/${entry.user?._id}` : '/login'}
                          className="flex items-center gap-3 group"
                        >
                          <Avatar user={entry.user} size={32} />
                          <div>
                            <div className={`text-sm font-medium group-hover:text-accent-glow transition-colors ${
                              isCurrentUser ? 'text-accent-glow' : 'text-text-primary'
                            }`}>
                              {entry.user?.username || 'Unknown'}
                              {isCurrentUser && <span className="ml-2 text-xs text-accent font-mono">(you)</span>}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span className="font-mono text-sm text-cyan">{formatNumber(entry.leetCodeScore)}</span>
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell">
                        <span className="font-mono text-sm text-accent">{formatNumber(entry.githubScore)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono text-sm font-bold text-text-primary">{formatNumber(entry.totalScore)}</span>
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell">
                        <TierBadge percentile={entry.percentile} />
                      </td>
                      <td className="px-4 py-3 text-right hidden xl:table-cell">
                        <RankChange change={entry.rankChange} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-text-muted font-mono">
              {pagination.total} total • page {pagination.page}/{pagination.pages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchLeaderboard(pagination.page - 1)}
                disabled={!pagination.hasPrev || loading}
                className="btn-ghost p-1.5 disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-xs font-mono text-text-secondary px-2">{pagination.page}</span>
              <button
                onClick={() => fetchLeaderboard(pagination.page + 1)}
                disabled={!pagination.hasNext || loading}
                className="btn-ghost p-1.5 disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

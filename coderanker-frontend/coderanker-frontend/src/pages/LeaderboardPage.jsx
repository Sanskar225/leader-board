import React, { useState, useEffect, useCallback } from 'react'
import { leaderboardAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import wsService from '../services/websocket'
import LoadingSpinner from '../components/LoadingSpinner'
import StatCard from '../components/StatCard'

const MEDAL = { 1: { icon: '🥇', color: '#FFD700' }, 2: { icon: '🥈', color: '#C0C0D0' }, 3: { icon: '🥉', color: '#CD7F32' } }

const RankBadge = ({ rank }) => {
  const m = MEDAL[rank]
  if (m) return <span style={{ fontSize: '18px' }}>{m.icon}</span>
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700,
      color: rank <= 10 ? 'var(--neon-cyan)' : 'var(--text-secondary)',
      minWidth: '24px', textAlign: 'right'
    }}>#{rank}</span>
  )
}

const ScoreBar = ({ score, max, color }) => (
  <div style={{ background: 'var(--border)', borderRadius: '2px', height: '4px', width: '80px', overflow: 'hidden' }}>
    <div style={{
      height: '100%', borderRadius: '2px',
      width: `${Math.min(100, (score / (max || 1)) * 100)}%`,
      background: color,
      transition: 'width 0.6s ease',
    }}/>
  </div>
)

const LeaderboardRow = ({ entry, index, currentUserId, maxScore, onCompare }) => {
  const isCurrentUser = entry.user?._id === currentUserId
  const rankPos = entry.rank || (index + 1)
  const medal = MEDAL[rankPos]

  return (
    <div className="fade-in" style={{
      display: 'grid',
      gridTemplateColumns: '60px 1fr 120px 120px 120px 80px',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 20px',
      background: isCurrentUser ? 'rgba(0,255,136,0.04)' : 'var(--bg-card)',
      border: `1px solid ${isCurrentUser ? 'rgba(0,255,136,0.25)' : 'var(--border)'}`,
      borderRadius: '8px',
      marginBottom: '4px',
      transition: 'all 0.2s',
      cursor: 'default',
      animationDelay: `${index * 0.03}s`,
      animationFillMode: 'both',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = isCurrentUser ? 'rgba(0,255,136,0.07)' : 'var(--bg-card-hover)'
      e.currentTarget.style.borderColor = isCurrentUser ? 'rgba(0,255,136,0.4)' : 'var(--border-bright)'
      e.currentTarget.style.transform = 'translateX(2px)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = isCurrentUser ? 'rgba(0,255,136,0.04)' : 'var(--bg-card)'
      e.currentTarget.style.borderColor = isCurrentUser ? 'rgba(0,255,136,0.25)' : 'var(--border)'
      e.currentTarget.style.transform = 'translateX(0)'
    }}>
      {/* Rank */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RankBadge rank={rankPos} />
        {entry.rankChange !== 0 && entry.rankChange != null && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px', marginLeft: '4px',
            color: entry.rankChange > 0 ? 'var(--neon-green)' : 'var(--neon-pink)'
          }}>
            {entry.rankChange > 0 ? '▲' : '▼'}{Math.abs(entry.rankChange)}
          </span>
        )}
      </div>

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: 34, height: 34, borderRadius: '8px',
          background: medal
            ? `linear-gradient(135deg, ${medal.color}40, ${medal.color}20)`
            : 'var(--bg-secondary)',
          border: `1px solid ${medal ? medal.color + '60' : 'var(--border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700,
          color: medal ? medal.color : 'var(--text-secondary)',
          flexShrink: 0
        }}>{entry.user?.username?.[0]?.toUpperCase() || '?'}</div>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700,
            color: isCurrentUser ? 'var(--neon-green)' : 'var(--text-primary)',
          }}>
            {entry.user?.username || 'Unknown'}
            {isCurrentUser && <span style={{ marginLeft: '8px', fontSize: '9px', color: 'var(--neon-green)', opacity: 0.7 }}>YOU</span>}
          </div>
          {entry.percentile != null && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-dim)', marginTop: '2px' }}>
              Top {(100 - entry.percentile).toFixed(1)}%
            </div>
          )}
        </div>
      </div>

      {/* Total Score */}
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '22px',
          color: medal ? medal.color : 'var(--text-primary)',
          letterSpacing: '1px'
        }}>{(entry.totalScore || 0).toLocaleString()}</div>
        <ScoreBar score={entry.totalScore || 0} max={maxScore} color="var(--neon-green)" />
      </div>

      {/* LeetCode Score */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--neon-orange)' }}>
          {(entry.leetCodeScore || 0).toLocaleString()}
        </div>
        <ScoreBar score={entry.leetCodeScore || 0} max={maxScore} color="var(--neon-orange)" />
      </div>

      {/* GitHub Score */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--neon-purple)' }}>
          {(entry.githubScore || 0).toLocaleString()}
        </div>
        <ScoreBar score={entry.githubScore || 0} max={maxScore} color="var(--neon-purple)" />
      </div>

      {/* Compare */}
      <div style={{ textAlign: 'center' }}>
        {entry.user?._id !== currentUserId && currentUserId && (
          <button onClick={() => onCompare(entry.user?._id)} style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px',
            color: 'var(--neon-cyan)', background: 'rgba(0,212,255,0.06)',
            border: '1px solid rgba(0,212,255,0.2)', borderRadius: '4px',
            padding: '4px 8px', cursor: 'pointer',
            transition: 'all 0.2s'
          }}>VS</button>
        )}
      </div>
    </div>
  )
}

const LeaderboardPage = () => {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [pagination, setPagination] = useState({})
  const [stats, setStats] = useState(null)
  const [topPerformers, setTopPerformers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState('all')
  const [page, setPage] = useState(1)
  const [currentUser, setCurrentUser] = useState(null)
  const [liveStatus, setLiveStatus] = useState('connecting')
  const [compareData, setCompareData] = useState(null)
  const [compareLoading, setCompareLoading] = useState(false)

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true)
      const [boardRes, statsRes, topRes] = await Promise.all([
        leaderboardAPI.getLeaderboard({ page, limit: 20, search, platform }),
        leaderboardAPI.getStats(),
        leaderboardAPI.getTopPerformers(3)
      ])
      setLeaderboard(boardRes.data.data.leaderboard)
      setPagination(boardRes.data.data.pagination)
      setCurrentUser(boardRes.data.data.currentUser)
      setStats(statsRes.data.data)
      setTopPerformers(topRes.data.data)
    } catch (err) {
      console.error('Failed to fetch leaderboard', err)
    } finally {
      setLoading(false)
    }
  }, [page, search, platform])

  useEffect(() => { fetchLeaderboard() }, [fetchLeaderboard])

  useEffect(() => {
    const unsub1 = wsService.on('connected', () => setLiveStatus('live'))
    const unsub2 = wsService.on('disconnected', () => setLiveStatus('offline'))
    const unsub3 = wsService.on('leaderboard_update', () => fetchLeaderboard())
    return () => { unsub1(); unsub2(); unsub3() }
  }, [fetchLeaderboard])

  const handleCompare = async (targetId) => {
    if (!user || !targetId) return
    setCompareLoading(true)
    try {
      const res = await leaderboardAPI.compareUsers(user._id, targetId)
      setCompareData(res.data.data)
    } catch (e) { console.error(e) } finally { setCompareLoading(false) }
  }

  const maxScore = leaderboard[0]?.totalScore || 1

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 24px 40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '52px', letterSpacing: '6px',
            background: 'linear-gradient(90deg, var(--neon-green) 0%, var(--neon-cyan) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            lineHeight: 1
          }}>LEADERBOARD</h1>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px',
            background: liveStatus === 'live' ? 'rgba(0,255,136,0.08)' : 'rgba(255,45,107,0.08)',
            border: `1px solid ${liveStatus === 'live' ? 'rgba(0,255,136,0.3)' : 'rgba(255,45,107,0.3)'}`,
            borderRadius: '20px',
            alignSelf: 'flex-end', marginBottom: '10px'
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: liveStatus === 'live' ? 'var(--neon-green)' : 'var(--neon-pink)',
              animation: liveStatus === 'live' ? 'pulse-glow 2s ease infinite' : 'none'
            }}/>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px',
              color: liveStatus === 'live' ? 'var(--neon-green)' : 'var(--neon-pink)' }}>
              {liveStatus === 'live' ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '1px' }}>
          COMPETITIVE CODING RANKINGS — GITHUB + LEETCODE
        </p>
      </div>

      {/* Stats Row */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
          <StatCard label="TOTAL CODERS" value={stats.totalUsers?.toLocaleString()} icon="👾" accent="var(--neon-cyan)" />
          <StatCard label="AVG SCORE" value={stats.averageScore?.toLocaleString()} icon="📊" accent="var(--neon-purple)" />
          <StatCard label="TOP SCORER" value={stats.topUser?.username} sub={`${stats.topUser?.score?.toLocaleString()} pts`} icon="🏆" accent="var(--gold)" />
          {currentUser && (
            <StatCard label="YOUR RANK" value={`#${currentUser.rank}`} sub={`Top ${(100 - currentUser.percentile).toFixed(1)}%`} icon="🎯" accent="var(--neon-green)" />
          )}
        </div>
      )}

      {/* Top 3 Podium */}
      {topPerformers.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px',
          marginBottom: '28px'
        }}>
          {topPerformers.map((p, i) => {
            const medal = MEDAL[i + 1]
            return (
              <div key={p._id} style={{
                background: 'var(--bg-card)',
                border: `1px solid ${medal.color}40`,
                borderRadius: '10px',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center'
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                  background: `linear-gradient(90deg, transparent, ${medal.color}, transparent)`
                }}/>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{medal.icon}</div>
                <div style={{
                  width: 44, height: 44, borderRadius: '10px', margin: '0 auto 10px',
                  background: `linear-gradient(135deg, ${medal.color}30, ${medal.color}10)`,
                  border: `1px solid ${medal.color}50`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: medal.color
                }}>{p.user?.username?.[0]?.toUpperCase()}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {p.user?.username}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: medal.color, letterSpacing: '2px' }}>
                  {(p.totalScore || 0).toLocaleString()}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>PTS</div>
              </div>
            )
          })}
        </div>
      )}

      {/* Filters */}
      <div style={{
        display: 'flex', gap: '12px', alignItems: 'center',
        marginBottom: '16px', flexWrap: 'wrap'
      }}>
        <div style={{
          flex: 1, minWidth: '200px',
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '8px', padding: '10px 14px',
        }}>
          <span style={{ color: 'var(--text-dim)', fontSize: '14px' }}>🔍</span>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search username..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '12px',
            }}
          />
        </div>
        {['all', 'leetcode', 'github'].map(p => (
          <button key={p} onClick={() => { setPlatform(p); setPage(1) }} style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px',
            color: platform === p ? '#000' : 'var(--text-secondary)',
            background: platform === p ? 'var(--neon-cyan)' : 'var(--bg-card)',
            border: `1px solid ${platform === p ? 'var(--neon-cyan)' : 'var(--border)'}`,
            borderRadius: '6px', padding: '8px 16px', cursor: 'pointer',
            textTransform: 'uppercase', fontWeight: platform === p ? 700 : 400
          }}>{p}</button>
        ))}
      </div>

      {/* Table Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '60px 1fr 120px 120px 120px 80px',
        gap: '12px', padding: '8px 20px', marginBottom: '4px'
      }}>
        {['RANK', 'CODER', 'TOTAL', 'LEETCODE', 'GITHUB', ''].map((h, i) => (
          <div key={i} style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px',
            color: 'var(--text-dim)', textAlign: i >= 2 ? 'right' : 'left'
          }}>{h}</div>
        ))}
      </div>

      {/* Table Rows */}
      {loading ? <LoadingSpinner /> : leaderboard.map((entry, i) => (
        <LeaderboardRow
          key={entry._id || i}
          entry={entry}
          index={i}
          currentUserId={user?._id}
          maxScore={maxScore}
          onCompare={handleCompare}
        />
      ))}

      {leaderboard.length === 0 && !loading && (
        <div style={{
          textAlign: 'center', padding: '60px',
          color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '2px'
        }}>NO CODERS FOUND</div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!pagination.hasPrev}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              color: pagination.hasPrev ? 'var(--neon-green)' : 'var(--text-dim)',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '6px', padding: '8px 16px', cursor: pagination.hasPrev ? 'pointer' : 'default',
            }}>← PREV</button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)'
          }}>
            <span style={{ color: 'var(--neon-green)' }}>{page}</span>
            <span>/ {pagination.pages}</span>
          </div>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!pagination.hasNext}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              color: pagination.hasNext ? 'var(--neon-green)' : 'var(--text-dim)',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '6px', padding: '8px 16px', cursor: pagination.hasNext ? 'pointer' : 'default',
            }}>NEXT →</button>
        </div>
      )}

      {/* Compare Modal */}
      {compareData && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, backdropFilter: 'blur(8px)'
        }} onClick={() => setCompareData(null)}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '32px', maxWidth: '600px', width: '90%',
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '4px',
              color: 'var(--neon-cyan)', marginBottom: '24px', textAlign: 'center'
            }}>HEAD TO HEAD</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: '16px', alignItems: 'center' }}>
              {/* User 1 */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--neon-green)', marginBottom: '8px' }}>
                  {compareData.user1?.profile?.user?.username || 'YOU'}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--text-primary)' }}>
                  {(compareData.user1?.profile?.totalScore || 0).toLocaleString()}
                </div>
              </div>
              <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--text-dim)' }}>VS</div>
              {/* User 2 */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--neon-purple)', marginBottom: '8px' }}>
                  {compareData.user2?.profile?.user?.username || 'OPPONENT'}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--text-primary)' }}>
                  {(compareData.user2?.profile?.totalScore || 0).toLocaleString()}
                </div>
              </div>
            </div>
            {/* Score diff */}
            <div style={{
              marginTop: '20px', textAlign: 'center',
              fontFamily: 'var(--font-mono)', fontSize: '12px',
              color: compareData.comparison?.scoreDiff > 0 ? 'var(--neon-green)' : 'var(--neon-pink)'
            }}>
              {compareData.comparison?.scoreDiff > 0
                ? `▲ You lead by ${Math.abs(compareData.comparison.scoreDiff).toLocaleString()} points`
                : `▼ You trail by ${Math.abs(compareData.comparison.scoreDiff).toLocaleString()} points`}
            </div>
            <button onClick={() => setCompareData(null)} style={{
              display: 'block', margin: '20px auto 0',
              fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px',
              color: 'var(--text-secondary)', background: 'var(--bg-secondary)',
              border: '1px solid var(--border)', borderRadius: '6px',
              padding: '8px 20px', cursor: 'pointer'
            }}>CLOSE</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaderboardPage

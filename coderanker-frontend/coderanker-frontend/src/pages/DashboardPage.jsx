import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userAPI, leaderboardAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import wsService from '../services/websocket'
import LoadingSpinner from '../components/LoadingSpinner'
import StatCard from '../components/StatCard'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '6px', padding: '8px 12px',
      fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)'
    }}>
      <div style={{ color: 'var(--text-dim)', marginBottom: '4px' }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value?.toLocaleString()}</div>
      ))}
    </div>
  )
}

const DashboardPage = () => {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [leaderboardStats, setLeaderboardStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [wsStatus, setWsStatus] = useState('connecting')

  const fetchData = async () => {
    try {
      const [profileRes, statsRes] = await Promise.all([
        userAPI.getProfile(),
        leaderboardAPI.getStats()
      ])
      setProfileData(profileRes.data.data)
      setLeaderboardStats(statsRes.data.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetchData()
    const unsub1 = wsService.on('connected', () => setWsStatus('live'))
    const unsub2 = wsService.on('disconnected', () => setWsStatus('offline'))
    const unsub3 = wsService.on('user_stats_updated', () => fetchData())
    return () => { unsub1(); unsub2(); unsub3() }
  }, [])

  if (loading) return <div style={{ paddingTop: '80px' }}><LoadingSpinner text="LOADING DASHBOARD..." /></div>

  const { stats, leaderboard, metrics, profile } = profileData || {}
  const github = stats?.github || {}
  const leetcode = stats?.leetcode || {}

  // Build chart data for difficulty breakdown
  const difficultyData = [
    { name: 'Easy', solved: leetcode.easySolved || 0, fill: '#22c55e' },
    { name: 'Medium', solved: leetcode.mediumSolved || 0, fill: 'var(--neon-orange)' },
    { name: 'Hard', solved: leetcode.hardSolved || 0, fill: 'var(--neon-pink)' },
  ]

  // Radar data
  const radarData = [
    { metric: 'Repos', value: Math.min(100, (github.publicRepos || 0) * 2) },
    { metric: 'Stars', value: Math.min(100, (github.totalStars || 0) * 5) },
    { metric: 'Followers', value: Math.min(100, (github.followers || 0) * 3) },
    { metric: 'LeetCode', value: Math.min(100, (leetcode.totalSolved || 0) / 3) },
    { metric: 'Hard ×5', value: Math.min(100, (leetcode.hardSolved || 0) * 5) },
    { metric: 'Acceptance', value: leetcode.acceptanceRate || 0 },
  ]

  const hasSetup = profile?.githubUsername || profile?.leetcodeUsername

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 24px 40px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '48px', letterSpacing: '5px',
            background: 'linear-gradient(90deg, var(--neon-green) 0%, var(--neon-cyan) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1
          }}>DASHBOARD</h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '1px', marginTop: '8px' }}>
            WELCOME BACK, <span style={{ color: 'var(--neon-green)' }}>{user?.username?.toUpperCase()}</span>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: wsStatus === 'live' ? 'var(--neon-green)' : '#666',
            animation: wsStatus === 'live' ? 'pulse-glow 2s infinite' : 'none'
          }}/>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '1px' }}>
            {wsStatus === 'live' ? 'LIVE SYNC' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Setup Banner */}
      {!hasSetup && (
        <div style={{
          background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.25)',
          borderRadius: '10px', padding: '20px 24px', marginBottom: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--neon-cyan)', marginBottom: '4px' }}>
              ⚡ COMPLETE YOUR PROFILE TO GET RANKED
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
              Add your GitHub and LeetCode usernames to appear on the leaderboard
            </div>
          </div>
          <Link to="/profile" style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px',
            color: '#000', background: 'var(--neon-cyan)', border: 'none',
            borderRadius: '6px', padding: '10px 20px', textDecoration: 'none', fontWeight: 700
          }}>SETUP NOW →</Link>
        </div>
      )}

      {/* Score Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <StatCard label="GLOBAL RANK" value={leaderboard?.rank ? `#${leaderboard.rank}` : '—'} icon="🏆" accent="var(--gold)" sub={metrics?.percentile ? `Top ${(100 - metrics.percentile).toFixed(1)}%` : undefined} />
        <StatCard label="TOTAL SCORE" value={(leaderboard?.totalScore || 0).toLocaleString()} icon="⭐" accent="var(--neon-green)" />
        <StatCard label="LEETCODE" value={(leaderboard?.leetCodeScore || 0).toLocaleString()} icon="🧩" accent="var(--neon-orange)" />
        <StatCard label="GITHUB" value={(leaderboard?.githubScore || 0).toLocaleString()} icon="🐙" accent="var(--neon-purple)" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

        {/* LeetCode Difficulty Breakdown */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '3px',
            color: 'var(--neon-orange)', marginBottom: '20px'
          }}>LEETCODE BREAKDOWN</div>
          {leetcode.totalSolved > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={difficultyData} barSize={40}>
                <XAxis dataKey="name" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-dim)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="solved" radius={[4,4,0,0]}>
                  {difficultyData.map((d, i) => (
                    <rect key={i} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              SET LEETCODE USERNAME TO SEE STATS
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '16px' }}>
            {difficultyData.map(d => (
              <div key={d.name} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: d.fill }}>{d.solved}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-dim)' }}>{d.name.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Radar */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '3px',
            color: 'var(--neon-cyan)', marginBottom: '20px'
          }}>SKILLS RADAR</div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--text-secondary)' }} />
              <Radar dataKey="value" stroke="var(--neon-cyan)" fill="rgba(0,212,255,0.15)" strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GitHub + LeetCode Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* GitHub */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '3px', color: 'var(--neon-purple)' }}>
              🐙 GITHUB
            </div>
            {profile?.githubUsername && (
              <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noreferrer"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)', textDecoration: 'none' }}>
                @{profile.githubUsername} ↗
              </a>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { l: 'REPOS', v: github.publicRepos },
              { l: 'STARS', v: github.totalStars },
              { l: 'FORKS', v: github.totalForks },
              { l: 'FOLLOWERS', v: github.followers },
              { l: 'FOLLOWING', v: github.following },
              { l: 'CONTRIB.', v: github.contributions },
            ].map(({ l, v }) => (
              <div key={l} style={{ background: 'var(--bg-secondary)', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--neon-purple)' }}>{v ?? '—'}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* LeetCode Detail */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '3px', color: 'var(--neon-orange)' }}>
              🧩 LEETCODE
            </div>
            {profile?.leetcodeUsername && (
              <a href={`https://leetcode.com/${profile.leetcodeUsername}`} target="_blank" rel="noreferrer"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)', textDecoration: 'none' }}>
                @{profile.leetcodeUsername} ↗
              </a>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {[
              { l: 'TOTAL SOLVED', v: leetcode.totalSolved },
              { l: 'ACCEPTANCE', v: leetcode.acceptanceRate ? `${leetcode.acceptanceRate}%` : '—' },
              { l: 'GLOBAL RANK', v: leetcode.ranking?.toLocaleString() },
              { l: 'REPUTATION', v: leetcode.reputation },
            ].map(({ l, v }) => (
              <div key={l} style={{ background: 'var(--bg-secondary)', borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--neon-orange)' }}>{v ?? '—'}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Progress bar for total solved vs estimated max */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-dim)' }}>PROBLEMS SOLVED</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--neon-orange)' }}>
                {leetcode.totalSolved || 0} / 3000
              </span>
            </div>
            <div style={{ background: 'var(--border)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '4px',
                width: `${Math.min(100, ((leetcode.totalSolved || 0) / 3000) * 100)}%`,
                background: 'linear-gradient(90deg, var(--neon-orange), var(--neon-pink))',
                transition: 'width 0.8s ease'
              }}/>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <Link to="/" style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px',
          color: 'var(--neon-green)', background: 'rgba(0,255,136,0.06)',
          border: '1px solid rgba(0,255,136,0.2)', borderRadius: '8px',
          padding: '12px 24px', textDecoration: 'none'
        }}>→ VIEW LEADERBOARD</Link>
        <Link to="/profile" style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px',
          color: 'var(--neon-cyan)', background: 'rgba(0,212,255,0.06)',
          border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px',
          padding: '12px 24px', textDecoration: 'none'
        }}>→ EDIT PROFILE</Link>
      </div>
    </div>
  )
}

export default DashboardPage

import React, { useState, useEffect } from 'react'
import { userAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import StatCard from '../components/StatCard'

const ProfilePage = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [leaderboard, setLeaderboard] = useState(null)
  const [refreshHistory, setRefreshHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({ githubUsername: '', leetcodeUsername: '', bio: '', location: '', website: '' })

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await userAPI.getProfile()
      const d = res.data.data
      setProfile(d.profile)
      setStats(d.stats)
      setLeaderboard(d.leaderboard)
      setRefreshHistory(d.refreshHistory || [])
      setForm({
        githubUsername: d.profile?.githubUsername || '',
        leetcodeUsername: d.profile?.leetcodeUsername || '',
        bio: d.profile?.bio || '',
        location: d.profile?.location || '',
        website: d.profile?.website || '',
      })
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProfile() }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true); setError(''); setSuccess('')
    try {
      await userAPI.updateProfile(form)
      setSuccess('Profile updated! Stats will refresh in background.')
      setTimeout(fetchProfile, 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save')
    } finally { setSaving(false) }
  }

  const handleRefresh = async (type = 'both') => {
    setRefreshing(true); setError(''); setSuccess('')
    try {
      await userAPI.refreshStats(type)
      setSuccess('Stats refreshed successfully!')
      setTimeout(fetchProfile, 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Refresh failed')
    } finally { setRefreshing(false) }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    borderRadius: '8px', color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)', fontSize: '12px', outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px',
    color: 'var(--text-secondary)', display: 'block', marginBottom: '6px'
  }

  if (loading) return <div style={{ paddingTop: '80px' }}><LoadingSpinner text="LOADING PROFILE..." /></div>

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '48px', letterSpacing: '5px',
          background: 'linear-gradient(90deg, var(--neon-purple), var(--neon-cyan))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1
        }}>MY PROFILE</h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '1px', marginTop: '8px' }}>
          MANAGE YOUR COMPETITIVE CODING IDENTITY
        </p>
      </div>

      {/* Rank Overview */}
      {leaderboard && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
          <StatCard label="GLOBAL RANK" value={leaderboard.rank ? `#${leaderboard.rank}` : 'UNRANKED'} icon="🏆" accent="var(--gold)" />
          <StatCard label="TOTAL SCORE" value={(leaderboard.totalScore || 0).toLocaleString()} icon="⭐" accent="var(--neon-green)" />
          <StatCard label="LEETCODE SCORE" value={(leaderboard.leetCodeScore || 0).toLocaleString()} icon="🧩" accent="var(--neon-orange)" />
          <StatCard label="GITHUB SCORE" value={(leaderboard.githubScore || 0).toLocaleString()} icon="🐙" accent="var(--neon-purple)" />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Edit Profile Form */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '3px',
            color: 'var(--neon-cyan)', marginBottom: '20px'
          }}>EDIT PROFILE</div>

          {error && <div style={{
            background: 'rgba(255,45,107,0.08)', border: '1px solid rgba(255,45,107,0.3)',
            borderRadius: '6px', padding: '8px 12px', marginBottom: '16px',
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--neon-pink)'
          }}>⚠ {error}</div>}
          {success && <div style={{
            background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.25)',
            borderRadius: '6px', padding: '8px 12px', marginBottom: '16px',
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--neon-green)'
          }}>✓ {success}</div>}

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>GITHUB USERNAME</label>
              <input value={form.githubUsername}
                onChange={e => setForm(f => ({...f, githubUsername: e.target.value}))}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--neon-purple)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                placeholder="octocat"
              />
            </div>
            <div>
              <label style={labelStyle}>LEETCODE USERNAME</label>
              <input value={form.leetcodeUsername}
                onChange={e => setForm(f => ({...f, leetcodeUsername: e.target.value}))}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--neon-orange)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                placeholder="leetcode_user"
              />
            </div>
            <div>
              <label style={labelStyle}>BIO</label>
              <textarea value={form.bio}
                onChange={e => setForm(f => ({...f, bio: e.target.value}))}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                onFocus={e => e.target.style.borderColor = 'var(--neon-cyan)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                placeholder="Tell the world about yourself..."
                maxLength={500}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>LOCATION</label>
                <input value={form.location}
                  onChange={e => setForm(f => ({...f, location: e.target.value}))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--neon-cyan)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  placeholder="Earth"
                />
              </div>
              <div>
                <label style={labelStyle}>WEBSITE</label>
                <input value={form.website}
                  onChange={e => setForm(f => ({...f, website: e.target.value}))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--neon-cyan)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  placeholder="https://..."
                />
              </div>
            </div>
            <button type="submit" disabled={saving} style={{
              padding: '12px', background: saving ? 'var(--border)' : 'var(--neon-cyan)',
              border: 'none', borderRadius: '8px',
              fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px',
              color: '#000', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer'
            }}>{saving ? 'SAVING...' : 'SAVE PROFILE'}</button>
          </form>
        </div>

        {/* Stats Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Refresh Controls */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '3px',
              color: 'var(--neon-green)', marginBottom: '16px'
            }}>SYNC STATS</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { type: 'both', label: 'SYNC ALL', color: 'var(--neon-green)' },
                { type: 'github', label: 'GITHUB', color: 'var(--neon-purple)' },
                { type: 'leetcode', label: 'LEETCODE', color: 'var(--neon-orange)' },
              ].map(({ type, label, color }) => (
                <button key={type} onClick={() => handleRefresh(type)} disabled={refreshing} style={{
                  flex: 1, padding: '10px 8px',
                  background: refreshing ? 'var(--bg-secondary)' : `rgba(${color === 'var(--neon-green)' ? '0,255,136' : color === 'var(--neon-purple)' ? '139,92,246' : '255,107,53'},0.1)`,
                  border: `1px solid ${refreshing ? 'var(--border)' : color.replace('var(', '').replace(')', '')}`,
                  borderRadius: '8px', cursor: refreshing ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px',
                  color: refreshing ? 'var(--text-dim)' : color
                }}>{refreshing ? '...' : label}</button>
              ))}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-dim)', marginTop: '10px', letterSpacing: '1px' }}>
              RATE LIMIT: 5 SYNCS PER HOUR
            </div>
          </div>

          {/* LeetCode Stats */}
          {stats?.leetcode && Object.keys(stats.leetcode).length > 0 && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '3px',
                color: 'var(--neon-orange)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'
              }}>🧩 LEETCODE</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {[
                  { label: 'TOTAL SOLVED', val: stats.leetcode.totalSolved },
                  { label: 'EASY', val: stats.leetcode.easySolved },
                  { label: 'MEDIUM', val: stats.leetcode.mediumSolved },
                  { label: 'HARD', val: stats.leetcode.hardSolved },
                  { label: 'ACCEPTANCE', val: stats.leetcode.acceptanceRate ? `${stats.leetcode.acceptanceRate}%` : '—' },
                  { label: 'RANKING', val: stats.leetcode.ranking?.toLocaleString() },
                ].map(({ label, val }) => (
                  <div key={label} style={{
                    background: 'var(--bg-secondary)', borderRadius: '6px', padding: '10px 12px'
                  }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--neon-orange)' }}>{val ?? '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GitHub Stats */}
          {stats?.github && Object.keys(stats.github).length > 0 && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '3px',
                color: 'var(--neon-purple)', marginBottom: '16px'
              }}>🐙 GITHUB</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { label: 'REPOS', val: stats.github.publicRepos },
                  { label: 'STARS', val: stats.github.totalStars },
                  { label: 'FORKS', val: stats.github.totalForks },
                  { label: 'FOLLOWERS', val: stats.github.followers },
                  { label: 'FOLLOWING', val: stats.github.following },
                  { label: 'CONTRIBUTIONS', val: stats.github.contributions },
                ].map(({ label, val }) => (
                  <div key={label} style={{
                    background: 'var(--bg-secondary)', borderRadius: '6px', padding: '10px 12px'
                  }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--neon-purple)' }}>{val ?? '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Refresh History */}
          {refreshHistory.length > 0 && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '3px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                SYNC HISTORY
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {refreshHistory.map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 10px', background: 'var(--bg-secondary)', borderRadius: '6px',
                    border: `1px solid ${r.status === 'success' ? 'rgba(0,255,136,0.1)' : 'rgba(255,45,107,0.1)'}`
                  }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px' }}>{r.status === 'success' ? '✅' : '❌'}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{r.type}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-dim)' }}>
                      {r.duration}ms · {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

import React from 'react'

const StatCard = ({ label, value, sub, accent = 'var(--neon-green)', icon }) => (
  <div style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '20px 24px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'border-color 0.2s, transform 0.2s',
    cursor: 'default',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.borderColor = accent
    e.currentTarget.style.transform = 'translateY(-2px)'
  }}
  onMouseLeave={e => {
    e.currentTarget.style.borderColor = 'var(--border)'
    e.currentTarget.style.transform = 'translateY(0)'
  }}>
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
      background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
      opacity: 0.6
    }}/>
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px',
      color: 'var(--text-secondary)', marginBottom: '8px',
      display: 'flex', alignItems: 'center', gap: '6px'
    }}>
      {icon && <span>{icon}</span>}
      {label}
    </div>
    <div style={{
      fontFamily: 'var(--font-display)', fontSize: '36px', letterSpacing: '2px',
      color: accent, lineHeight: 1, marginBottom: '4px'
    }}>{value ?? '—'}</div>
    {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>{sub}</div>}
  </div>
)

export default StatCard

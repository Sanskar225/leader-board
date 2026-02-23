import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'LEADERBOARD' },
    ...(user ? [
      { to: '/dashboard', label: 'DASHBOARD' },
      { to: '/profile', label: 'PROFILE' },
    ] : [])
  ]

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(5,5,8,0.95)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: '1400px', margin: '0 auto',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '60px'
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, var(--neon-green), var(--neon-cyan))',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 700, color: '#000',
            fontFamily: 'var(--font-mono)'
          }}>CR</div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            letterSpacing: '3px',
            background: 'linear-gradient(90deg, var(--neon-green), var(--neon-cyan))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>CODERANKER</span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '2px',
              color: location.pathname === link.to ? 'var(--neon-green)' : 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: '4px',
              border: location.pathname === link.to ? '1px solid rgba(0,255,136,0.3)' : '1px solid transparent',
              background: location.pathname === link.to ? 'rgba(0,255,136,0.05)' : 'transparent',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (location.pathname !== link.to) e.target.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { if (location.pathname !== link.to) e.target.style.color = 'var(--text-secondary)' }}
            >{link.label}</Link>
          ))}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--neon-green), var(--neon-cyan))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 700, color: '#000'
                }}>{user.username[0].toUpperCase()}</div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)' }}>
                  {user.username}
                </span>
              </div>
              <button onClick={handleLogout} style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px',
                color: 'var(--neon-pink)',
                background: 'rgba(255,45,107,0.08)',
                border: '1px solid rgba(255,45,107,0.3)',
                borderRadius: '4px',
                padding: '6px 14px', cursor: 'pointer',
                transition: 'all 0.2s'
              }}>LOGOUT</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
              <Link to="/login" style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px',
                color: 'var(--text-secondary)',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '6px 14px', textDecoration: 'none',
                transition: 'all 0.2s'
              }}>LOGIN</Link>
              <Link to="/register" style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px',
                color: '#000',
                background: 'var(--neon-green)',
                border: '1px solid var(--neon-green)',
                borderRadius: '4px',
                padding: '6px 14px', textDecoration: 'none',
                fontWeight: 700
              }}>REGISTER</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

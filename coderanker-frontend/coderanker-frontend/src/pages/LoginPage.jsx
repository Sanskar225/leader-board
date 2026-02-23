import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const result = await login(form.email, form.password)
    if (result.success) navigate('/dashboard')
    else setError(result.error)
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    borderRadius: '8px', color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)', fontSize: '13px', outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px',
    color: 'var(--text-secondary)', display: 'block', marginBottom: '6px'
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%', maxWidth: '400px',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '16px', padding: '40px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--neon-green), transparent)'
        }}/>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '36px', letterSpacing: '4px',
            background: 'linear-gradient(90deg, var(--neon-green), var(--neon-cyan))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>SIGN IN</div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '1px' }}>
            ACCESS YOUR RANK
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,45,107,0.08)', border: '1px solid rgba(255,45,107,0.3)',
            borderRadius: '6px', padding: '10px 14px', marginBottom: '20px',
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--neon-pink)'
          }}>⚠ {error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>EMAIL</label>
            <input
              type="email" required value={form.email}
              onChange={e => setForm(f => ({...f, email: e.target.value}))}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--neon-green)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label style={labelStyle}>PASSWORD</label>
            <input
              type="password" required value={form.password}
              onChange={e => setForm(f => ({...f, password: e.target.value}))}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--neon-green)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? 'var(--border)' : 'var(--neon-green)',
            border: 'none', borderRadius: '8px',
            fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '3px',
            color: '#000', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            marginTop: '8px'
          }}>
            {loading ? 'AUTHENTICATING...' : 'LOGIN →'}
          </button>
        </form>

        <div style={{
          textAlign: 'center', marginTop: '24px',
          fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)'
        }}>
          NO ACCOUNT?{' '}
          <Link to="/register" style={{ color: 'var(--neon-cyan)', textDecoration: 'none' }}>
            REGISTER HERE
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

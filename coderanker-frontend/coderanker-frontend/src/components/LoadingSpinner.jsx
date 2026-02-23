import React from 'react'

const LoadingSpinner = ({ size = 40, text = 'LOADING...' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '40px' }}>
    <div style={{
      width: size, height: size,
      border: `2px solid var(--border)`,
      borderTop: `2px solid var(--neon-green)`,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }}/>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--text-dim)' }}>{text}</span>
  </div>
)

export default LoadingSpinner

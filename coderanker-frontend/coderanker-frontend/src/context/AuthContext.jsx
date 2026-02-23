import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import wsService from '../services/websocket'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && user) {
      wsService.connect(token)
      wsService.subscribe('leaderboard')
      wsService.subscribe('global')
    }
  }, [])

  const login = async (email, password) => {
    setLoading(true); setError(null)
    try {
      const { data } = await authAPI.login({ email, password })
      const { user: u, token } = data.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(u))
      setUser(u)
      wsService.connect(token)
      wsService.subscribe('leaderboard')
      wsService.subscribe(`user_${u._id}`)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  const register = async (username, email, password) => {
    setLoading(true); setError(null)
    try {
      const { data } = await authAPI.register({ username, email, password })
      const { user: u, token } = data.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(u))
      setUser(u)
      wsService.connect(token)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    wsService.disconnect()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

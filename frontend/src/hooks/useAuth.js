import { useAuthStore } from '@store/auth.store'
import { authService } from '@services/auth.service'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export const useAuth = () => {
  const navigate = useNavigate()
  const { user, token, setAuth, clearAuth } = useAuthStore()

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password })
      setAuth(response.data.user, response.data.token)
      toast.success('Login successful!')
      navigate('/dashboard')
      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed')
      return { success: false, error: error.response?.data?.error }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      setAuth(response.data.user, response.data.token)
      toast.success('Registration successful!')
      navigate('/dashboard')
      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed')
      return { success: false, error: error.response?.data?.error }
    }
  }

  const logout = () => {
    authService.logout()
    clearAuth()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return {
    user,
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  }
}
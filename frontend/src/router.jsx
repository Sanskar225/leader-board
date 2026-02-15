import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@store/auth.store'
import Home from '@pages/Home'
import Dashboard from '@pages/Dashboard'
import Profile from '@pages/Profile'
import LeaderboardPage from '@pages/LeaderboardPage'
import Login from '@pages/Login'
import Register from '@pages/Register'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" />
}

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:userId"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default AppRouter
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import { profileService } from '@services/profile.service'
import StatsGrid from '@components/stats/StatsGrid'
import GrowthChart from '@components/stats/GrowthChart'
import DifficultyChart from '@components/stats/DifficultyChart'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import { fadeInUp } from '@animations/shared/animationVariants'
import { FaSync } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await profileService.getProfile()
      setProfile(response.data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await profileService.refreshStats()
      await fetchProfile()
      toast.success('Stats refreshed successfully!')
    } catch (error) {
      toast.error('Failed to refresh stats')
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500" />
      </div>
    )
  }

  const leetcodeData = [
    { name: 'Easy', value: profile?.stats?.leetcode?.easySolved || 0 },
    { name: 'Medium', value: profile?.stats?.leetcode?.mediumSolved || 0 },
    { name: 'Hard', value: profile?.stats?.leetcode?.hardSolved || 0 },
  ]

  const growthData = [
    { date: 'Week 1', score: 100 },
    { date: 'Week 2', score: 150 },
    { date: 'Week 3', score: 200 },
    { date: 'Week 4', score: 180 },
    { date: 'Week 5', score: 250 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, <span className="text-blue-400">{user?.username}</span>
            </h1>
            <p className="text-white/60">Track your progress and climb the leaderboard</p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <FaSync className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Sync Stats'}
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <StatsGrid stats={{
            totalUsers: 1000,
            totalSolved: profile?.stats?.leetcode?.totalSolved || 0,
            totalStars: profile?.stats?.github?.totalStars || 0,
            averageScore: profile?.leaderboard?.totalScore || 0,
          }} />
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Progress Over Time</h2>
              <GrowthChart data={growthData} />
            </Card>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Difficulty Breakdown</h2>
              <DifficultyChart data={leetcodeData} />
            </Card>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">GitHub Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-white/60">Public Repos</span>
                <span className="text-white font-bold">{profile?.stats?.github?.publicRepos || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Total Stars</span>
                <span className="text-white font-bold">{profile?.stats?.github?.totalStars || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Followers</span>
                <span className="text-white font-bold">{profile?.stats?.github?.followers || 0}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">LeetCode Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-white/60">Total Solved</span>
                <span className="text-white font-bold">{profile?.stats?.leetcode?.totalSolved || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Acceptance Rate</span>
                <span className="text-white font-bold">{profile?.stats?.leetcode?.acceptanceRate || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Ranking</span>
                <span className="text-white font-bold">#{profile?.stats?.leetcode?.ranking || 0}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
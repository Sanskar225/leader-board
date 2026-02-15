import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { profileService } from '@services/profile.service'
import { leaderboardService } from '@services/leaderboard.service'
import Card from '@components/ui/Card'
import { fadeInUp } from '@animations/shared/animationVariants'
import { FaGithub, FaCode } from 'react-icons/fa'
import { useAuth } from '@hooks/useAuth'

const Profile = () => {
  const { userId } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [userRank, setUserRank] = useState(null)
  const [loading, setLoading] = useState(true)

  const isOwnProfile = !userId || userId === currentUser?._id

  useEffect(() => {
    fetchData()
  }, [userId])

  const fetchData = async () => {
    try {
      if (isOwnProfile) {
        const response = await profileService.getProfile()
        setProfile(response.data)
      } else {
        const response = await leaderboardService.getUserRank(userId)
        setUserRank(response.data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500" />
      </div>
    )
  }

  const data = isOwnProfile ? profile : userRank

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto"
        >
          {/* Profile Header */}
          <Card className="p-8 mb-8">
            <div className="flex items-center gap-8">
              <img
                src={data?.user?.avatar || 'https://via.placeholder.com/100'}
                alt={data?.user?.username}
                className="w-24 h-24 rounded-full border-4 border-blue-500"
              />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {data?.user?.username}
                  {isOwnProfile && <span className="ml-2 text-blue-400 text-lg">(you)</span>}
                </h1>
                {data?.rank && (
                  <p className="text-white/60">Rank #{data.rank}</p>
                )}
                {data?.totalScore && (
                  <p className="text-white/60">Total Score: {data.totalScore}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* GitHub Stats */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <FaGithub className="text-2xl text-white" />
                <h2 className="text-xl font-bold text-white">GitHub Stats</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-white/60">Public Repos</span>
                  <span className="text-white font-bold">{data?.github?.publicRepos || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Total Stars</span>
                  <span className="text-white font-bold">{data?.github?.totalStars || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Followers</span>
                  <span className="text-white font-bold">{data?.github?.followers || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Contributions</span>
                  <span className="text-white font-bold">{data?.github?.contributions || 0}</span>
                </div>
              </div>
            </Card>

            {/* LeetCode Stats */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <FaCode className="text-2xl text-white" />
                <h2 className="text-xl font-bold text-white">LeetCode Stats</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-white/60">Total Solved</span>
                  <span className="text-white font-bold">{data?.leetcode?.totalSolved || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Easy</span>
                  <span className="text-white font-bold">{data?.leetcode?.easySolved || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Medium</span>
                  <span className="text-white font-bold">{data?.leetcode?.mediumSolved || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Hard</span>
                  <span className="text-white font-bold">{data?.leetcode?.hardSolved || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Acceptance Rate</span>
                  <span className="text-white font-bold">{data?.leetcode?.acceptanceRate || 0}%</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Refresh History (only for own profile) */}
          {isOwnProfile && profile?.refreshHistory?.length > 0 && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Syncs</h3>
                <div className="space-y-3">
                  {profile.refreshHistory.map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="text-white/80">
                          {log.type.charAt(0).toUpperCase() + log.type.slice(1)} Sync
                        </span>
                      </div>
                      <span className="text-white/40 text-sm">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
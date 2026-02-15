import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@animations/shared/animationVariants'
import CountUp from 'react-countup'

const StatsGrid = ({ stats }) => {
  const statItems = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥' },
    { label: 'Problems Solved', value: stats?.totalSolved || 0, icon: '✅' },
    { label: 'GitHub Stars', value: stats?.totalStars || 0, icon: '⭐' },
    { label: 'Avg Score', value: stats?.averageScore || 0, icon: '📊' },
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          variants={fadeInUp}
          whileHover={{ y: -5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">{item.icon}</span>
            <span className="text-white/60 text-sm">{item.label}</span>
          </div>
          <motion.div
            key={item.value}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-white"
          >
            <CountUp end={item.value} duration={2} separator="," />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default StatsGrid
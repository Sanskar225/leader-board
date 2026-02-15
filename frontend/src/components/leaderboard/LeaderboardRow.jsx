import { motion } from 'framer-motion'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import RankBadge from './RankBadge'
import DeltaIndicator from './DeltaIndicator'
import { useAuthStore } from '@store/auth.store'

const LeaderboardRow = memo(({ entry, index }) => {
  const { user } = useAuthStore()
  const isCurrentUser = user?._id === entry.user?._id

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ 
        delay: index * 0.03,
        type: 'spring',
        stiffness: 350,
        damping: 40
      }}
      className={`group cursor-pointer hover:bg-white/5 transition-colors ${
        isCurrentUser ? 'bg-blue-500/10 border-l-4 border-blue-500' : ''
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <RankBadge rank={entry.rank} />
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <Link to={`/profile/${entry.user?._id}`} className="flex items-center">
          <motion.img
            whileHover={{ scale: 1.1 }}
            className="h-10 w-10 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors"
            src={entry.user?.avatar || 'https://via.placeholder.com/40'}
            alt={entry.user?.username}
          />
          <div className="ml-4">
            <div className="text-sm font-medium text-white">
              {entry.user?.username}
              {isCurrentUser && (
                <span className="ml-2 text-xs text-blue-400">(you)</span>
              )}
            </div>
          </div>
        </Link>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-white/80">{entry.leetCodeScore}</div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-white/80">{entry.githubScore}</div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <motion.div
          key={entry.totalScore}
          initial={{ scale: 1.5, color: '#3b82f6' }}
          animate={{ scale: 1, color: '#ffffff' }}
          className="text-lg font-bold text-white"
        >
          {entry.totalScore}
        </motion.div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <DeltaIndicator change={entry.rankChange} />
      </td>
    </motion.tr>
  )
})

LeaderboardRow.displayName = 'LeaderboardRow'

export default LeaderboardRow
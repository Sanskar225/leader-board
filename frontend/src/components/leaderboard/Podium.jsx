import { motion } from 'framer-motion'
import { fadeInUp, layoutTransition } from '@animations/shared/animationVariants'
import { FaCrown } from 'react-icons/fa'

const Podium = ({ topPerformers }) => {
  if (!topPerformers?.length) return null

  // Arrange: 2nd, 1st, 3rd
  const ordered = [
    topPerformers[1], // 2nd place
    topPerformers[0], // 1st place
    topPerformers[2], // 3rd place
  ]

  const heights = ['h-36', 'h-48', 'h-28']
  const colors = ['gray', 'yellow', 'amber']

  return (
    <div className="grid grid-cols-3 gap-4 items-end">
      {ordered.map((user, index) => {
        if (!user) return <div key={index} />

        return (
          <motion.div
            key={user.user?._id}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: index * 0.1 }}
            layout={layoutTransition}
            className="flex flex-col items-center"
          >
            <div className="relative mb-4">
              {index === 1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <FaCrown className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 text-2xl" />
                </motion.div>
              )}
              
              <motion.img
                whileHover={{ scale: 1.1 }}
                src={user.user?.avatar || 'https://via.placeholder.com/80'}
                alt={user.user?.username}
                className={`w-20 h-20 rounded-full border-4 ${
                  index === 1 ? 'border-yellow-400' : 'border-gray-400'
                } object-cover`}
              />
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-sm font-bold ${
                  index === 1 ? 'bg-yellow-400 text-gray-900' : 'bg-gray-600 text-white'
                }`}
              >
                #{user.rank}
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`w-full ${heights[index]} glass-card flex flex-col items-center justify-end p-4 ${
                index === 1 ? 'bg-gradient-to-t from-yellow-500/20 to-transparent' : ''
              }`}
            >
              <h3 className="font-bold text-white truncate max-w-full">
                {user.user?.username}
              </h3>
              
              <motion.div
                key={user.totalScore}
                initial={{ scale: 1.5, color: '#3b82f6' }}
                animate={{ scale: 1, color: '#ffffff' }}
                className="flex items-center gap-2 mt-2"
              >
                <span className="text-lg font-bold text-white">
                  {user.totalScore}
                </span>
                <span className="text-xs text-white/60">pts</span>
              </motion.div>
              
              {user.rankChange > 0 && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-green-400"
                >
                  ↑ {user.rankChange}
                </motion.span>
              )}
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default Podium
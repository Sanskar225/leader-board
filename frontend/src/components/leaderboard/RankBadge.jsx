import { motion } from 'framer-motion'
import { FaCrown, FaTrophy, FaMedal } from 'react-icons/fa'

const RankBadge = ({ rank }) => {
  const getIcon = () => {
    if (rank === 1) return <FaCrown className="text-yellow-400" />
    if (rank === 2) return <FaTrophy className="text-gray-400" />
    if (rank === 3) return <FaMedal className="text-amber-600" />
    return null
  }

  const getColor = () => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
    if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-gray-600'
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800'
    return 'bg-gray-700'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`flex items-center justify-center w-10 h-10 rounded-full ${getColor()}`}
    >
      {getIcon() || (
        <span className="text-sm font-bold text-white">#{rank}</span>
      )}
    </motion.div>
  )
}

export default RankBadge
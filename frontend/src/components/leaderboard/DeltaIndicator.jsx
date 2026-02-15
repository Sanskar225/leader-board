import { motion } from 'framer-motion'
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa'

const DeltaIndicator = ({ change }) => {
  if (change > 0) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-1 text-green-400"
      >
        <FaArrowUp className="text-xs" />
        <span className="text-sm font-semibold">{change}</span>
      </motion.div>
    )
  }

  if (change < 0) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-1 text-red-400"
      >
        <FaArrowDown className="text-xs" />
        <span className="text-sm font-semibold">{Math.abs(change)}</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="text-white/40"
    >
      <FaMinus />
    </motion.div>
  )
}

export default DeltaIndicator
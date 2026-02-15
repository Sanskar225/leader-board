import { motion } from 'framer-motion'

const Skeleton = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
      className={`bg-white/5 rounded-xl ${className}`}
    />
  )
}

export default Skeleton
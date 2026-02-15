import { motion } from 'framer-motion'
import { cardHover } from '@animations/shared/animationVariants'

const Card = ({ children, className = '' }) => {
  return (
    <motion.div
      {...cardHover}
      className={`glass-card ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default Card
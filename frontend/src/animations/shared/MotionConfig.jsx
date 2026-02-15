import { MotionConfig as FramerMotionConfig } from 'framer-motion'

const MotionConfig = ({ children }) => {
  return (
    <FramerMotionConfig
      transition={{ type: 'spring', stiffness: 350, damping: 40 }}
    >
      {children}
    </FramerMotionConfig>
  )
}

export default MotionConfig
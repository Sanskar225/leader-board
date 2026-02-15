import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

const Hand = forwardRef(({ className }, ref) => {
  return (
    <motion.svg
      ref={ref}
      className={className}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M40 70L35 60L45 50L55 55L60 65L50 75L40 70Z"
        fill="url(#hand-gradient)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.5 }}
      />
      <math
        d="M45 45L55 40L65 45L70 55L65 65L55 70L45 65L40 55L45 45Z"
        fill="url(#hand-gradient)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
      />
      <defs>
        <linearGradient id="hand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </motion.svg>
  )
})

Hand.displayName = 'Hand'

export default Hand
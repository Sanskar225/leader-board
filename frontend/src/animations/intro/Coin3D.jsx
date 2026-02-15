import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

const Coin3D = forwardRef(({ className }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={`coin-3d ${className}`}
      style={{
        width: '120px',
        height: '120px',
        position: 'relative',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* GitHub Face */}
      <div
        className="coin-face absolute w-full h-full rounded-full"
        style={{
          backfaceVisibility: 'hidden',
          background: 'linear-gradient(145deg, #2b3137, #24292e)',
          border: '3px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'white',
          boxShadow: '0 0 30px rgba(59,130,246,0.3)',
        }}
      >
        <span className="text-4xl">GH</span>
      </div>

      {/* LeetCode Face */}
      <div
        className="coin-face absolute w-full h-full rounded-full"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: 'linear-gradient(145deg, #f97316, #f59e0b)',
          border: '3px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'white',
          boxShadow: '0 0 30px rgba(249,115,22,0.3)',
        }}
      >
        <span className="text-4xl">LC</span>
      </div>
    </motion.div>
  )
})

Coin3D.displayName = 'Coin3D'

export default Coin3D
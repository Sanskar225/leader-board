import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Coin3D from './Coin3D'
import Hand from './Hand'
import { useScrollAnimation } from './useScrollAnimation'
import { useIntroStore } from './intro.store'
import './intro.styles.css'

const IntroSequence = ({ onComplete }) => {
  const coinRef = useRef()
  const handRef = useRef()
  const { hasPlayed, setHasPlayed } = useIntroStore()
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const handleComplete = () => {
    setHasPlayed(true)
    setShowLeaderboard(true)
    setTimeout(() => {
      onComplete?.()
    }, 800)
  }

  useScrollAnimation(handleComplete)

  useEffect(() => {
    if (window.innerWidth < 768) {
      setHasPlayed(true)
      onComplete?.()
    }
  }, [])

  if (hasPlayed) return null

  return (
    <div className="intro-container fixed inset-0 z-50">
      <div className="scene relative w-full h-full overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Ambient glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Hand and coin container */}
        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2">
          <Hand ref={handRef} className="hand w-32 h-32" />
          <Coin3D ref={coinRef} className="coin absolute -top-24 left-1/2 transform -translate-x-1/2" />
        </div>

        {/* Leaderboard preview - fades in during scroll */}
        <AnimatePresence>
          {showLeaderboard && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="leaderboard-preview absolute top-1/3 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4"
            >
              <div className="glass-card p-8">
                <motion.h2
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-bold text-center mb-8"
                >
                  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    CodeRanker
                  </span>
                </motion.h2>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="h-16 bg-white/5 rounded-xl flex items-center px-6"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/10 mr-4" />
                      <div className="flex-1 h-4 bg-white/10 rounded" />
                      <div className="w-20 h-4 bg-white/10 rounded" />
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 text-center text-white/60 text-sm"
                >
                  Scroll to continue
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/40 rounded-full mt-2" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default IntroSequence
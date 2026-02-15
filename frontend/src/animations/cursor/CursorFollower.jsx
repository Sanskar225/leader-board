import { motion } from 'framer-motion'
import { useCursorMotion } from './useCursorMotion'
import { useIntroStore } from '../intro/intro.store'

const CursorFollower = () => {
  const { cursorX, cursorY, rotate, scale } = useCursorMotion()
  const { hasPlayed } = useIntroStore()

  if (typeof window === 'undefined' || window.innerWidth < 768 || !hasPlayed) return null

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x: cursorX,
        y: cursorY,
        rotate,
        scale,
        zIndex: 9999,
        pointerEvents: 'none',
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #3b82f6, #8b5cf6)',
        backdropFilter: 'blur(8px)',
        border: '2px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        mixBlendMode: 'difference',
        boxShadow: '0 0 30px rgba(59,130,246,0.5)',
      }}
    >
      ⚡
    </motion.div>
  )
}

export default CursorFollower
import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'

export const useCursorMotion = () => {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const lastX = useRef(-100)
  const lastY = useRef(-100)
  const velocity = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const smoothX = useSpring(cursorX, springConfig)
  const smoothY = useSpring(cursorY, springConfig)
  const rotate = useMotionValue(0)
  const scale = useMotionValue(1)

  useEffect(() => {
    let rafId
    const handleMouseMove = (e) => {
      const dx = e.clientX - lastX.current
      const dy = e.clientY - lastY.current
      const speed = Math.sqrt(dx*dx + dy*dy)
      
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      
      if (speed > 0.5) {
        rotate.set(rotate.get() + speed * 2)
        scale.set(1.2)
      } else {
        scale.set(1)
      }
      
      lastX.current = e.clientX
      lastY.current = e.clientY
      
      rafId = requestAnimationFrame(() => {})
    }

    const handleMouseLeave = () => {
      cursorX.set(-100)
      cursorY.set(-100)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return { cursorX: smoothX, cursorY: smoothY, rotate, scale }
}
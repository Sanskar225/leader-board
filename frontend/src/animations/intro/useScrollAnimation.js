import { useEffect, useRef } from 'react'
import * as anime from 'animejs'

export const useScrollAnimation = (onComplete) => {
  const timelineRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    // Create anime.js timeline
    const tl = anime.timeline({
      autoplay: false,
      easing: 'easeOutCubic',
      complete: onComplete,
    })

    // Define animation sequence
    tl.add({
      targets: '.coin',
      translateY: [-20, -300],
      rotateY: [0, 720],
      scale: [1, 1.2],
      duration: 1000,
      change: (anim) => {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
        anim.seek(anim.duration * Math.min(scrollPercent, 1))
      }
    })
    .add({
      targets: '.hand',
      translateY: 0,
      scale: 0.8,
      opacity: 0,
      duration: 400,
    }, '-=200')
    .add({
      targets: '.leaderboard-preview',
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 600,
    }, '-=300')

    timelineRef.current = tl

    // Scroll handler
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (timelineRef.current && scrollPercent <= 1) {
        timelineRef.current.seek(timelineRef.current.duration * scrollPercent)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timelineRef.current) {
        timelineRef.current.pause()
      }
    }
  }, [onComplete])

  return containerRef
}
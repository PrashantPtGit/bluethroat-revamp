'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

interface Ripple {
  id: number
  x: number
  y: number
}

export default function CursorGlow() {
  const [mounted, setMounted]         = useState(false)
  const [isTouchDevice, setIsTouch]   = useState(false)
  const [isHovering, setIsHovering]   = useState(false)
  const [isHoveringCTA, setIsCTA]     = useState(false)
  const [isIdle, setIsIdle]           = useState(false)
  const [ripples, setRipples]         = useState<Ripple[]>([])

  const idleTimerRef  = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const rippleIdRef   = useRef(0)

  // --- motion values & springs ---
  // Start at -9999 so the glow is off-screen until the first mousemove
  const rawX = useMotionValue(-9999)
  const rawY = useMotionValue(-9999)

  const x1 = useSpring(rawX, { stiffness: 40,  damping: 25, mass: 0.8 })
  const y1 = useSpring(rawY, { stiffness: 40,  damping: 25, mass: 0.8 })

  const x2 = useSpring(rawX, { stiffness: 80,  damping: 20, mass: 0.5 })
  const y2 = useSpring(rawY, { stiffness: 80,  damping: 20, mass: 0.5 })

  const x3 = useSpring(rawX, { stiffness: 200, damping: 25, mass: 0.2 })
  const y3 = useSpring(rawY, { stiffness: 200, damping: 25, mass: 0.2 })

  // --- mount ---
  useEffect(() => {
    setMounted(true)
    setIsTouch('ontouchstart' in window)
  }, [])

  // --- mouse move ---
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      clearTimeout(idleTimerRef.current)
      setIsIdle(false)
      idleTimerRef.current = setTimeout(() => setIsIdle(true), 2000)
    }
    window.addEventListener('mousemove', handleMove)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      clearTimeout(idleTimerRef.current)
    }
  }, [rawX, rawY])

  // --- hover detection ---
  useEffect(() => {
    const handleOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      const interactive = !!(
        t.closest('a') ||
        t.closest('button') ||
        t.closest('[data-cursor="hover"]')
      )
      const cta = !!t.closest('[data-cursor="cta"]')
      setIsHovering(interactive)
      setIsCTA(cta)
    }
    window.addEventListener('mouseover', handleOver)
    return () => window.removeEventListener('mouseover', handleOver)
  }, [])

  // --- click ripple ---
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const id = rippleIdRef.current++
      setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 650)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  if (!mounted || isTouchDevice) return null

  const opacityTransition = { duration: isIdle ? 1 : 0.3 }

  return (
    <>
      {/* Layer 1 — outer glow (sluggish, dreamy, 400px) */}
      <motion.div
        style={{
          position:      'fixed',
          left:          x1,
          top:           y1,
          width:         400,
          height:        400,
          borderRadius:  '50%',
          background:    'radial-gradient(circle, rgba(37,99,235,0.06) 0%, rgba(37,99,235,0.03) 40%, transparent 70%)',
          marginLeft:    -200,
          marginTop:     -200,
          pointerEvents: 'none',
          zIndex:        1,
        }}
        animate={{
          scale:   isHoveringCTA ? 1.8 : isHovering ? 1.4 : 1,
          opacity: isIdle ? 0 : 1,
        }}
        transition={{
          scale:   { duration: 0.3 },
          opacity: opacityTransition,
        }}
      />

      {/* Layer 2 — mid glow (medium, 120px) */}
      <motion.div
        style={{
          position:      'fixed',
          left:          x2,
          top:           y2,
          width:         120,
          height:        120,
          borderRadius:  '50%',
          background:    isHoveringCTA
            ? 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(37,99,235,0.1) 50%, transparent 70%)'
            : isHovering
              ? 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(6,182,212,0.08) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(6,182,212,0.06) 50%, transparent 70%)',
          marginLeft:    -60,
          marginTop:     -60,
          pointerEvents: 'none',
          zIndex:        2,
          transition:    'background 0.3s',
        }}
        animate={{
          scale:   isHoveringCTA ? 2 : isHovering ? 1.6 : 1,
          opacity: isIdle ? 0 : 1,
        }}
        transition={{
          scale:   { duration: 0.3 },
          opacity: opacityTransition,
        }}
      />

      {/* Layer 3 — core dot (snappy, 8px) */}
      <motion.div
        style={{
          position:      'fixed',
          left:          x3,
          top:           y3,
          width:         8,
          height:        8,
          borderRadius:  '50%',
          background:    'radial-gradient(circle, #93C5FD 0%, #2563EB 100%)',
          boxShadow:     '0 0 12px rgba(37,99,235,0.8)',
          marginLeft:    -4,
          marginTop:     -4,
          pointerEvents: 'none',
          zIndex:        3,
        }}
        animate={{
          scale:   isHovering || isHoveringCTA ? 0 : 1,
          opacity: isIdle ? 0 : 1,
        }}
        transition={{
          scale:   { duration: 0.2 },
          opacity: opacityTransition,
        }}
      />

      {/* CTA ring — appears when hovering CTA elements */}
      <AnimatePresence>
        {isHoveringCTA && (
          <motion.div
            key="cta-ring"
            style={{
              position:      'fixed',
              left:          x2,
              top:           y2,
              width:         50,
              height:        50,
              borderRadius:  '50%',
              border:        '1px solid rgba(37,99,235,0.3)',
              marginLeft:    -25,
              marginTop:     -25,
              pointerEvents: 'none',
              zIndex:        3,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{    scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Click ripples */}
      <AnimatePresence>
        {ripples.map(r => (
          <motion.div
            key={r.id}
            initial={{ width: 0,  height: 0,  opacity: 0.6 }}
            animate={{ width: 80, height: 80, opacity: 0   }}
            exit={{}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position:      'fixed',
              left:          r.x,
              top:           r.y,
              borderRadius:  '50%',
              border:        '1px solid rgba(37,99,235,0.6)',
              marginLeft:    -40,
              marginTop:     -40,
              pointerEvents: 'none',
              zIndex:        4,
            }}
          />
        ))}
      </AnimatePresence>
    </>
  )
}

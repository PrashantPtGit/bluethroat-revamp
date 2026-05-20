'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import Blue from './Blue'

export default function FloatingBlue() {
  const [mounted,        setMounted]        = useState(false)
  const [isHovering,     setIsHovering]     = useState(false)
  const [clickPulse,     setClickPulse]     = useState(false)
  const [isTouchDevice,  setIsTouchDevice]  = useState(false)

  const cursorX       = useMotionValue(0)
  const cursorY       = useMotionValue(0)
  const cursorSpringX = useSpring(cursorX, { stiffness: 400, damping: 28, mass: 0.3 })
  const cursorSpringY = useSpring(cursorY, { stiffness: 400, damping: 28, mass: 0.3 })

  // ------- mount ------------------------------------------------------------

  useEffect(() => {
    const mobile = window.innerWidth < 768 || 'ontouchstart' in window
    setIsTouchDevice(mobile)
    setMounted(true)
  }, [])

  // ------- cursor position --------------------------------------------------

  useEffect(() => {
    if (!mounted) return
    const handle = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    window.addEventListener('mousemove', handle, { passive: true })
    return () => window.removeEventListener('mousemove', handle)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  // ------- hover state ------------------------------------------------------

  useEffect(() => {
    if (!mounted) return
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      setIsHovering(!!(target.closest('a, button, [role="button"]')))
    }
    const handleOut = (e: MouseEvent) => {
      const to = e.relatedTarget as HTMLElement | null
      if (!to?.closest('a, button, [role="button"]')) setIsHovering(false)
    }
    window.addEventListener('mouseover', handleOver)
    window.addEventListener('mouseout',  handleOut)
    return () => {
      window.removeEventListener('mouseover', handleOver)
      window.removeEventListener('mouseout',  handleOut)
    }
  }, [mounted])

  // ------- click pulse ------------------------------------------------------

  useEffect(() => {
    if (!mounted) return
    let timer: ReturnType<typeof setTimeout> | null = null
    const handle = () => {
      setClickPulse(true)
      timer = setTimeout(() => setClickPulse(false), 300)
    }
    window.addEventListener('click', handle)
    return () => {
      window.removeEventListener('click', handle)
      if (timer) clearTimeout(timer)
    }
  }, [mounted])

  // ------- render -----------------------------------------------------------

  if (!mounted) return null

  return (
    <motion.div
      style={{
        position:      'fixed',
        left:          cursorSpringX,
        top:           cursorSpringY,
        translateX:    '-50%',
        translateY:    '-50%',
        zIndex:        99,
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isTouchDevice ? 0 : 0.9,
        scale:   clickPulse ? 2.0 : (isHovering ? 1.5 : 1.0),
      }}
      transition={{
        opacity: { duration: 0.5, delay: 0.5 },
        scale:   { duration: 0.2 },
      }}
    >
      <Blue size={85} mood="idle" />
    </motion.div>
  )
}

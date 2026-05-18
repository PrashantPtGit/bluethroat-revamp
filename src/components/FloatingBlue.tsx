'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion'
import Blue from './Blue'
import type { BlueMode } from './Blue'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HAPPY_MESSAGES = [
  "Let's go! 🚀",
  'Great choice!',
  "I'm on it ⚡",
  'Boom! 💥',
  "Yes! That's it!",
]

function randItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FloatingBlue() {
  const [mounted,   setMounted]   = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [mood,      setMood]      = useState<BlueMode>('idle')
  const [blueSize,     setBlueSize]     = useState(160)
  const [message,      setMessage]      = useState<string | null>(null)
  const [isHovering,   setIsHovering]   = useState(false)
  const [clickPulse,   setClickPulse]   = useState(false)
  const [isTouchDevice,setIsTouchDevice]= useState(false)

  // Motion values + springs
  const x       = useMotionValue(0)
  const y       = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 35, damping: 18, mass: 1.2 })
  const springY = useSpring(y, { stiffness: 35, damping: 18, mass: 1.2 })

  // Cursor Blue — snappy spring
  const cursorX       = useMotionValue(0)
  const cursorY       = useMotionValue(0)
  const cursorSpringX = useSpring(cursorX, { stiffness: 400, damping: 28, mass: 0.3 })
  const cursorSpringY = useSpring(cursorY, { stiffness: 400, damping: 28, mass: 0.3 })

  // Refs for stable access inside callbacks
  const isMountedRef    = useRef(false)
  const isMobileRef     = useRef(false)
  const moodRef         = useRef<BlueMode>('idle')
  const blueSizeRef     = useRef(160)
  const idleTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const msgTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const moodTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastScrollYRef  = useRef(0)

  // ------- helpers -----------------------------------------------------------

  function clampX(val: number, size = blueSizeRef.current) {
    const minX = window.scrollY < window.innerHeight
      ? window.innerWidth * 0.55
      : size / 2
    return Math.max(minX, Math.min(window.innerWidth - size / 2, val))
  }
  function clampY(val: number, size = blueSizeRef.current) {
    return Math.max(size / 2 + 64, Math.min(window.innerHeight - size / 2, val))
  }

  function safeXY(px: number, py: number): [number, number] {
    const W = window.innerWidth
    const H = window.innerHeight
    const textZones = [
      { x1: 0, y1: 60, x2: W * 0.55, y2: H },  // hero left text area
      { x1: 0, y1: 0,  x2: W,        y2: 80 },  // navbar
    ]
    let sx = px, sy = py
    for (const zone of textZones) {
      if (sx > zone.x1 && sx < zone.x2 && sy > zone.y1 && sy < zone.y2) {
        if (zone.y2 === 80) {
          sy = 120
        } else {
          sx = W * 0.65
        }
      }
    }
    return [sx, sy]
  }

  function setMoodSync(m: BlueMode, size: number) {
    moodRef.current    = m
    blueSizeRef.current = size
    setMood(m)
    setBlueSize(size)
  }

  function showMsg(msg: string, durationMs = 3000) {
    if (msgTimerRef.current) clearTimeout(msgTimerRef.current)
    setMessage(msg)
    msgTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) setMessage(null)
    }, durationMs)
  }

  // ------- idle schedule (stored in ref so it's always fresh) ---------------

  const scheduleIdleRef = useRef<() => void>(() => {})
  scheduleIdleRef.current = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    const delay = 6_000 + Math.random() * 6_000
    idleTimerRef.current = setTimeout(() => {
      if (!isMountedRef.current) return
      const pick = randItem(['wander', 'dance', 'sleepy'] as const)
      if (pick === 'wander') {
        const wx = window.innerWidth  * (0.60 + Math.random() * 0.30)
        const wy = window.innerHeight * (0.15 + Math.random() * 0.70)
        const [sx, sy] = safeXY(clampX(wx), clampY(wy))
        x.set(sx)
        y.set(sy)
      } else if (pick === 'dance') {
        setMoodSync('dancing', 200)
        setTimeout(() => isMountedRef.current && setMoodSync('curious', 200), 2_000)
      } else {
        setMoodSync('sleepy', 170)
        showMsg('zzz… 💤', 3_000)
        setTimeout(() => isMountedRef.current && setMoodSync('curious', 200), 3_000)
      }
      scheduleIdleRef.current()
    }, delay)
  }

  function resetIdle() { scheduleIdleRef.current() }

  // ------- mount ------------------------------------------------------------

  useEffect(() => {
    isMountedRef.current = true
    const mobile = window.innerWidth < 768 || 'ontouchstart' in window
    isMobileRef.current  = mobile
    setIsTouchDevice(mobile)

    const sx = clampX(window.innerWidth  * 0.82)
    const sy = clampY(mobile ? window.innerHeight * 0.72 : window.innerHeight * 0.30)
    x.set(sx); y.set(sy)

    setMounted(true)

    const entryT = setTimeout(() => {
      if (!isMountedRef.current) return
      setIsVisible(true)
      setMoodSync('curious', mobile ? 130 : 160)
      setTimeout(() => {
        if (isMountedRef.current) showMsg("Hi! I'm Blue 👋", 3_000)
      }, 500)
      scheduleIdleRef.current()
    }, 1_500)

    return () => {
      isMountedRef.current = false
      clearTimeout(entryT)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      if (msgTimerRef.current)  clearTimeout(msgTimerRef.current)
      if (moodTimerRef.current) clearTimeout(moodTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ------- cursor tracking --------------------------------------------------

  useEffect(() => {
    if (!mounted) return
    const handle = (e: MouseEvent) => {
      if (isMobileRef.current) return
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      resetIdle()
      const sx = springX.get(), sy = springY.get()
      const dx = e.clientX - sx, dy = e.clientY - sy
      const dist = Math.hypot(dx, dy)
      if (dist > 300) {
        const angle = Math.atan2(dy, dx)
        const size  = blueSizeRef.current
        const [cx, cy] = safeXY(
          clampX(e.clientX - Math.cos(angle) * 250, size),
          clampY(e.clientY - Math.sin(angle) * 250, size),
        )
        x.set(cx)
        y.set(cy)
        if (dist > 400) {
          setMoodSync('excited', 220)
          if (moodTimerRef.current) clearTimeout(moodTimerRef.current)
          moodTimerRef.current = setTimeout(() => {
            if (isMountedRef.current) setMoodSync('curious', 200)
          }, 1_000)
        }
      }
    }
    window.addEventListener('mousemove', handle, { passive: true })
    return () => window.removeEventListener('mousemove', handle)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  // ------- global click -----------------------------------------------------

  useEffect(() => {
    if (!mounted) return
    const handle = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('.floating-blue-inner')) return
      resetIdle()
      setClickPulse(true)
      setTimeout(() => { if (isMountedRef.current) setClickPulse(false) }, 300)
      setMoodSync('happy', 240)
      showMsg(randItem(HAPPY_MESSAGES), 1_500)
      if (moodTimerRef.current) clearTimeout(moodTimerRef.current)
      moodTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) setMoodSync('curious', 200)
      }, 1_500)
    }
    window.addEventListener('click', handle)
    return () => window.removeEventListener('click', handle)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  // ------- button hover (desktop) ------------------------------------------

  useEffect(() => {
    if (!mounted) return
    const handleOver = (e: MouseEvent) => {
      if (isMobileRef.current) return
      const target = e.target as HTMLElement
      setIsHovering(!!(target.closest('a, button, [role="button"]')))
      const cta = target.closest('a[href*="whatsapp"], [data-cursor="cta"]') as HTMLElement | null
      if (cta) {
        const rect = cta.getBoundingClientRect()
        x.set(clampX(rect.right + 50, 160))
        y.set(clampY(rect.top + rect.height / 2, 160))
        setMoodSync('pointing', 160)
        showMsg('This is the fastest way 👆', 2_000)
        return
      }
      if (target.closest('nav a')) {
        y.set(clampY(72, 200))
        setMoodSync('curious', 200)
      }
    }
    const handleOut = (e: MouseEvent) => {
      if (!isMobileRef.current) {
        const to = e.relatedTarget as HTMLElement | null
        if (!to?.closest('a, button, [role="button"]')) setIsHovering(false)
      }
      const fromCTA = (e.target as HTMLElement).closest('a[href*="whatsapp"], [data-cursor="cta"]')
      const to = e.relatedTarget as HTMLElement | null
      if (fromCTA && (!to || !to.closest('a[href*="whatsapp"], [data-cursor="cta"]'))) {
        setMoodSync('idle', 200)
        if (msgTimerRef.current) clearTimeout(msgTimerRef.current)
        setMessage(null)
      }
    }
    window.addEventListener('mouseover', handleOver)
    window.addEventListener('mouseout',  handleOut)
    return () => {
      window.removeEventListener('mouseover', handleOver)
      window.removeEventListener('mouseout',  handleOut)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  // ------- scroll reactions ------------------------------------------------

  useEffect(() => {
    if (!mounted) return
    const handle = () => {
      resetIdle()
      const cur = window.scrollY
      const vel = Math.abs(cur - lastScrollYRef.current)
      const down = cur > lastScrollYRef.current
      lastScrollYRef.current = cur

      if (vel > 80) {
        setMoodSync('leading', 200)
        const size = blueSizeRef.current
        y.set(clampY(down ? springY.get() - 100 : springY.get() + 100, size))
        showMsg('This way! →', 800)
        if (moodTimerRef.current) clearTimeout(moodTimerRef.current)
        moodTimerRef.current = setTimeout(() => {
          if (isMountedRef.current) setMoodSync('curious', 200)
        }, 800)
        return
      }

      const inView = (sel: string) => {
        const el = document.querySelector(sel)
        if (!el) return false
        const r = el.getBoundingClientRect()
        return r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.2
      }

      if (inView('[data-blue-mood="troubled"]') && moodRef.current !== 'troubled') {
        setMoodSync('troubled', 200)
        showMsg('This is the problem…', 2_000)
      } else if (inView('[data-blue-mood="confident"]') && moodRef.current !== 'confident') {
        setMoodSync('confident', 220)
      } else if (inView('[data-blue-mood="excited"]') && moodRef.current !== 'excited') {
        setMoodSync('excited', 200)
        showMsg("That's me! 👋", 2_000)
      }
    }
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  // ------- resize ----------------------------------------------------------

  useEffect(() => {
    if (!mounted) return
    const handle = () => {
      const size = blueSizeRef.current
      x.set(clampX(springX.get(), size))
      y.set(clampY(springY.get(), size))
    }
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  // ------- direct click on Blue -------------------------------------------

  function handleBlueClick() {
    resetIdle()
    setMoodSync('dancing', 280)
    showMsg('You found me! 🎉', 2_500)
    if (moodTimerRef.current) clearTimeout(moodTimerRef.current)
    moodTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) setMoodSync('idle', 200)
    }, 2_500)
  }

  // ------- render ----------------------------------------------------------

  if (!mounted) return null

  return (
    <>
      {/* Main floating Blue */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="floating-blue"
            style={{
              position:     'fixed',
              left:         springX,
              top:          springY,
              translateX:   '-50%',
              translateY:   '-50%',
              zIndex:       50,
              pointerEvents:'none',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{    opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="floating-blue-inner"
              style={{ position: 'relative', pointerEvents: 'auto', cursor: 'pointer' }}
              onClick={handleBlueClick}
            >
              <Blue size={blueSize} mood={mood} />

              {/* Speech bubble */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    key={message}
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0,  scale: 1   }}
                    exit={{    opacity: 0, y: -10, scale: 0.8 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      position:      'absolute',
                      top:           '-50px',
                      left:          '50%',
                      transform:     'translateX(-50%)',
                      background:    'rgba(13,15,18,0.92)',
                      border:        '1px solid rgba(37,99,235,0.3)',
                      borderRadius:  '12px 12px 12px 4px',
                      padding:       '8px 14px',
                      fontSize:      '12px',
                      color:         '#F8FAFC',
                      whiteSpace:    'nowrap',
                      boxShadow:     '0 0 20px rgba(37,99,235,0.2)',
                      pointerEvents: 'none',
                      zIndex:        101,
                    }}
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tiny cursor Blue — snaps to cursor, IS the cursor on desktop */}
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
          scale:   clickPulse ? 1.8 : (isHovering ? 1.3 : 1),
        }}
        transition={{
          opacity: { duration: 0.5, delay: 0.5 },
          scale:   { duration: 0.2 },
        }}
      >
        <Blue size={55} mood="idle" />
      </motion.div>
    </>
  )
}

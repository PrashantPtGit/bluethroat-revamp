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
  const [blueSize,  setBlueSize]  = useState(200)
  const [message,   setMessage]   = useState<string | null>(null)

  // Motion values + springs
  const x       = useMotionValue(0)
  const y       = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 35, damping: 18, mass: 1.2 })
  const springY = useSpring(y, { stiffness: 35, damping: 18, mass: 1.2 })

  // Refs for stable access inside callbacks
  const isMountedRef    = useRef(false)
  const isMobileRef     = useRef(false)
  const moodRef         = useRef<BlueMode>('idle')
  const blueSizeRef     = useRef(200)
  const idleTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const msgTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const moodTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastScrollYRef  = useRef(0)

  // ------- helpers -----------------------------------------------------------

  function clampX(val: number, size = blueSizeRef.current) {
    return Math.max(size / 2, Math.min(window.innerWidth - size / 2, val))
  }
  function clampY(val: number, size = blueSizeRef.current) {
    return Math.max(size / 2 + 64, Math.min(window.innerHeight - size / 2, val))
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
        x.set(clampX(window.innerWidth  * (0.15 + Math.random() * 0.7)))
        y.set(clampY(window.innerHeight * (0.20 + Math.random() * 0.6)))
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

    const sx = clampX(window.innerWidth  * 0.82)
    const sy = clampY(mobile ? window.innerHeight * 0.72 : window.innerHeight * 0.35)
    x.set(sx); y.set(sy)

    setMounted(true)

    const entryT = setTimeout(() => {
      if (!isMountedRef.current) return
      setIsVisible(true)
      setMoodSync('curious', mobile ? 140 : 200)
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
      resetIdle()
      const sx = springX.get(), sy = springY.get()
      const dx = e.clientX - sx, dy = e.clientY - sy
      const dist = Math.hypot(dx, dy)
      if (dist > 200) {
        const angle = Math.atan2(dy, dx)
        const size  = blueSizeRef.current
        x.set(clampX(e.clientX - Math.cos(angle) * 180, size))
        y.set(clampY(e.clientY - Math.sin(angle) * 180, size))
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
            zIndex:       100,
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
  )
}

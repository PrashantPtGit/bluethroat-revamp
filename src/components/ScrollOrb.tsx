'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'

// S-curve path from top to bottom of the viewport.
// Using H = window.innerHeight so coordinates are in screen-space — no scroll offset needed.
function buildPath(W: number, H: number): string {
  return [
    `M ${W * 0.5}  ${H * 0.05}`,
    `C ${W * 0.75} ${H * 0.15}, ${W * 0.2}  ${H * 0.25}, ${W * 0.5}  ${H * 0.35}`,
    `C ${W * 0.8}  ${H * 0.45}, ${W * 0.15} ${H * 0.55}, ${W * 0.5}  ${H * 0.65}`,
    `C ${W * 0.78} ${H * 0.72}, ${W * 0.25} ${H * 0.82}, ${W * 0.5}  ${H * 0.92}`,
    `C ${W * 0.7}  ${H * 0.97}, ${W * 0.3}  ${H * 1.05}, ${W * 0.5}  ${H * 1.1}`,
  ].join(' ')
}

interface Particle {
  id: number
  x: number
  y: number
}

interface RippleRing {
  id: number
}

const THRESHOLDS = [0.12, 0.28, 0.45, 0.62, 0.80]

export default function ScrollOrb() {
  // --- hydration guard ---
  const [mounted, setMounted] = useState(false)

  // --- viewport / path ---
  const [vw, setVw] = useState(0)
  const [vh, setVh] = useState(0)
  const [pathD, setPathD] = useState('')
  const [pathLength, setPathLength] = useState(0)
  const [trailOffset, setTrailOffset] = useState(99_999)

  // --- orb position ---
  const [orbX, setOrbX] = useState(0)
  const [orbY, setOrbY] = useState(0)
  const orbXRef = useRef(0)
  const orbYRef = useRef(0)

  // --- velocity / stretch ---
  const [velScaleY, setVelScaleY] = useState(1)
  const [velScaleX, setVelScaleX] = useState(1)
  const prevProgressRef = useRef(0)

  // --- pulse (section entry) ---
  const [ripples, setRipples] = useState<RippleRing[]>([])
  const lastThresholdRef = useRef(-1)
  const rippleIdRef = useRef(0)

  // --- particle trail ---
  const [particles, setParticles] = useState<Particle[]>([])
  const particleIdRef = useRef(0)
  const lastScrollTimeRef = useRef(0)

  // --- path ref ---
  const pathRef = useRef<SVGPathElement>(null)

  // --- scroll spring ---
  const { scrollYProgress } = useScroll()
  const rawProgress = useTransform(scrollYProgress, [0, 1], [0, 1])
  const smoothProgress = useSpring(rawProgress, { stiffness: 60, damping: 20 })

  // ── mount ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true)
    const W = window.innerWidth
    const H = window.innerHeight
    setVw(W); setVh(H)
    setOrbX(W * 0.5); setOrbY(H * 0.05)
    orbXRef.current = W * 0.5
    orbYRef.current = H * 0.05
  }, [])

  // ── resize ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => { setVw(window.innerWidth); setVh(window.innerHeight) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── build path ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (vw === 0 || vh === 0) return
    setPathD(buildPath(vw, vh))
  }, [vw, vh])

  // ── measure path ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!pathRef.current || !pathD) return
    const len = pathRef.current.getTotalLength()
    setPathLength(len)
    setTrailOffset(len) // fully hidden at start
  }, [pathD])

  // ── main scroll driver ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!pathLength) return

    return smoothProgress.on('change', (progress) => {
      // --- orb position ---
      if (pathRef.current) {
        const pt = pathRef.current.getPointAtLength(progress * pathLength)
        setOrbX(pt.x);   orbXRef.current = pt.x
        setOrbY(pt.y);   orbYRef.current = pt.y
      }

      // --- trail reveal ---
      setTrailOffset(pathLength * (1 - progress))

      // --- velocity → stretch ---
      const vel = Math.abs(progress - prevProgressRef.current) * 100
      setVelScaleY(Math.min(1 + vel * 0.08, 1.8))
      setVelScaleX(Math.max(1 - vel * 0.06, 0.7))
      prevProgressRef.current = progress

      // --- mark as "scrolling" for particle spawn ---
      lastScrollTimeRef.current = Date.now()

      // --- section-entry pulse ---
      const hitIdx = THRESHOLDS.findIndex(t => Math.abs(progress - t) < 0.012)
      if (hitIdx !== -1 && hitIdx !== lastThresholdRef.current) {
        lastThresholdRef.current = hitIdx
        const rid = rippleIdRef.current++
        setRipples(prev => [...prev, { id: rid }])
        // auto-remove after animation completes
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rid)), 700)
      }
    })
  }, [smoothProgress, pathLength])

  // ── particle spawner ───────────────────────────────────────────────────────
  useEffect(() => {
    const spawn = setInterval(() => {
      if (Date.now() - lastScrollTimeRef.current < 200) {
        const id = particleIdRef.current++
        setParticles(prev => [
          ...prev.slice(-10), // max 10 live particles
          { id, x: orbXRef.current, y: orbYRef.current },
        ])
      }
    }, 80)
    return () => clearInterval(spawn)
  }, [])

  // ── SSR guard ──────────────────────────────────────────────────────────────
  if (!mounted || vw === 0) return null

  return (
    <>
      {/* ── SVG layer: guide path + animated trail ── */}
      <svg
        className="scroll-orb"
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         '100%',
          height:        '100%',
          overflow:      'visible',
          pointerEvents: 'none',
          zIndex:        5,
        }}
        aria-hidden
      >
        <defs>
          {/* Vertical gradient following path direction */}
          <linearGradient
            id="orbTrailGradient"
            gradientUnits="userSpaceOnUse"
            x1={vw * 0.5} y1={0}
            x2={vw * 0.5} y2={vh}
          >
            <stop offset="0%"   stopColor="#2563EB" stopOpacity={0} />
            <stop offset="60%"  stopColor="#2563EB" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.8} />
          </linearGradient>
        </defs>

        {/* Dim dashed guide */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(37,99,235,0.06)"
          strokeWidth={1.5}
          strokeDasharray="4 8"
        />

        {/* Animated glowing trail — stroked via dash offset */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="url(#orbTrailGradient)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={pathLength > 0 ? pathLength : undefined}
          strokeDashoffset={trailOffset}
        />
      </svg>

      {/* ── Particle trail ── */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="scroll-orb"
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0,   scale: 0.3 }}
            exit={{}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onAnimationComplete={() =>
              setParticles(prev => prev.filter(pp => pp.id !== p.id))
            }
            style={{
              position:      'fixed',
              left:          p.x - 3,
              top:           p.y - 3,
              width:         6,
              height:        6,
              borderRadius:  '50%',
              background:    '#2563EB',
              pointerEvents: 'none',
              zIndex:        5,
            }}
          />
        ))}
      </AnimatePresence>

      {/* ── Orb container (fixed at computed position) ── */}
      <div
        className="scroll-orb"
        style={{
          position:      'fixed',
          left:          orbX,
          top:           orbY,
          transform:     'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex:        6,
          width:         1,
          height:        1,
        }}
        aria-hidden
      >
        {/* Outer glow — slow breathe */}
        <motion.div
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position:     'absolute',
            width:        60,
            height:       60,
            borderRadius: '50%',
            background:   'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
            left:         -30,
            top:          -30,
          }}
        />

        {/* Middle glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          style={{
            position:     'absolute',
            width:        30,
            height:       30,
            borderRadius: '50%',
            background:   'radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)',
            left:         -15,
            top:          -15,
          }}
        />

        {/* Core — breathes + velocity stretch */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position:     'absolute',
            width:        10,
            height:       10,
            borderRadius: '50%',
            background:   'radial-gradient(circle, #93C5FD 0%, #2563EB 60%, #1D4ED8 100%)',
            boxShadow:    '0 0 12px rgba(37,99,235,0.8), 0 0 24px rgba(37,99,235,0.4)',
            left:         -5,
            top:          -5,
            scaleX:       velScaleX,
            scaleY:       velScaleY,
          }}
        />

        {/* Pulse ripple rings — appear on section-entry threshold crossings */}
        <AnimatePresence>
          {ripples.map(r => (
            <motion.div
              key={r.id}
              initial={{ width: 10,  height: 10,  opacity: 0.8 }}
              animate={{ width: 80,  height: 80,  opacity: 0   }}
              exit={{}}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              style={{
                position:     'absolute',
                borderRadius: '50%',
                border:       '1.5px solid #2563EB',
                left:         '50%',
                top:          '50%',
                transform:    'translate(-50%, -50%)',
                pointerEvents:'none',
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}

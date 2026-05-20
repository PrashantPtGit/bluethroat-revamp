'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface BlueProps {
  size?: number
  showGlow?: boolean
  mood?: string
}

export default function Blue({ size = 300, showGlow = true }: BlueProps) {
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    const fire = () => {
      setBurst(true)
      setTimeout(() => setBurst(false), 600)
      setTimeout(fire, 3000 + Math.random() * 4000)
    }
    const t = setTimeout(fire, 3000 + Math.random() * 4000)
    return () => clearTimeout(t)
  }, [])

  const particles = [
    { r: 105, angle: 0,   s: 3,   c: '#06B6D4', spd: 16  },
    { r: 95,  angle: 45,  s: 2.5, c: '#2563EB', spd: 12  },
    { r: 100, angle: 90,  s: 2,   c: '#06B6D4', spd: 15  },
    { r: 85,  angle: 135, s: 3.5, c: '#2563EB', spd: 9   },
    { r: 92,  angle: 180, s: 3,   c: '#06B6D4', spd: 11  },
    { r: 88,  angle: 225, s: 2,   c: '#2563EB', spd: 13  },
    { r: 78,  angle: 270, s: 3.5, c: '#06B6D4', spd: 8   },
    { r: 105, angle: 315, s: 2.5, c: '#2563EB', spd: 14  },
    { r: 55,  angle: 60,  s: 2.5, c: '#60A5FA', spd: 4.5 },
    { r: 28,  angle: 0,   s: 2,   c: '#FFFFFF', spd: 2.5 },
    { r: 28,  angle: 120, s: 1.5, c: '#93C5FD', spd: 2.5 },
    { r: 28,  angle: 240, s: 2,   c: '#FFFFFF', spd: 2.5 },
  ]

  return (
    <motion.div
      style={{ width: size, height: size }}
      animate={{ y: [0, -20, 4, -16, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg width={size} height={size} viewBox="0 0 300 300">
        <defs>
          <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.95"/>
            <stop offset="30%"  stopColor="#93C5FD" stopOpacity="0.9"/>
            <stop offset="65%"  stopColor="#2563EB" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0"/>
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="coreF" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4"/>
          </filter>
        </defs>

        {/* RIPPLE RINGS */}
        {showGlow && [0, 1, 2].map(i => (
          <motion.circle key={i}
            cx={150} cy={150} r={118}
            fill="none"
            stroke={i === 2 ? '#06B6D4' : '#2563EB'}
            strokeWidth={i === 0 ? 0.8 : i === 1 ? 0.5 : 0.4}
            style={{ originX: '150px', originY: '150px' }}
            animate={{ scale: [1, 1.25, 1.25], opacity: [0.5, 0, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut', delay: i * 1.17, times: [0, 0.7, 1] }}
          />
        ))}

        {/* OUTER DASHED RING */}
        <motion.circle cx={150} cy={150} r={108}
          fill="none" stroke="#2563EB"
          strokeWidth={1} strokeDasharray="4 8" opacity={0.5}
          filter="url(#glow)"
          style={{ originX: '150px', originY: '150px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />

        {/* MID RING OPPOSITE */}
        <motion.circle cx={150} cy={150} r={88}
          fill="none" stroke="#06B6D4"
          strokeWidth={1} strokeDasharray="2 6" opacity={0.5}
          filter="url(#glow)"
          style={{ originX: '150px', originY: '150px' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
        />

        {/* INNER FAST RING */}
        <motion.circle cx={150} cy={150} r={65}
          fill="none" stroke="#60A5FA"
          strokeWidth={0.8} strokeDasharray="3 9" opacity={0.45}
          filter="url(#glow)"
          style={{ originX: '150px', originY: '150px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />

        {/* JARVIS ARC 1 */}
        <motion.path
          d="M 150 42 A 108 108 0 0 1 258 150"
          fill="none" stroke="#06B6D4" strokeWidth={2}
          strokeLinecap="round" strokeDasharray="28 310"
          filter="url(#glow)" opacity={0.9}
          animate={{ strokeDashoffset: [0, -338] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
        />

        {/* JARVIS ARC 2 */}
        <motion.path
          d="M 150 258 A 108 108 0 0 1 42 150"
          fill="none" stroke="#2563EB" strokeWidth={2}
          strokeLinecap="round" strokeDasharray="28 310"
          filter="url(#glow)" opacity={0.9}
          animate={{ strokeDashoffset: [0, -338] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', delay: 1.75 }}
        />

        {/* PARTICLES */}
        {particles.map((p, i) => {
          const cx = 150 + p.r * Math.cos(p.angle * Math.PI / 180)
          const cy = 150 + p.r * Math.sin(p.angle * Math.PI / 180)
          return (
            <motion.circle key={i}
              cx={cx} cy={cy} r={p.s}
              fill={p.c} filter="url(#glow)"
              style={{ originX: '150px', originY: '150px' }}
              animate={{ rotate: 360, opacity: [0.4, 1, 0.4] }}
              transition={{
                rotate:   { duration: p.spd, repeat: Infinity, ease: 'linear' },
                opacity:  { duration: 2, repeat: Infinity, delay: i * 0.2 },
              }}
            />
          )
        })}

        {/* GLOW HALOS */}
        <motion.circle cx={150} cy={150} r={52}
          fill="#2563EB" opacity={0.12} filter="url(#soft)"
          style={{ originX: '150px', originY: '150px' }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle cx={150} cy={150} r={38}
          fill="#2563EB" opacity={0.2} filter="url(#soft)"
          style={{ originX: '150px', originY: '150px' }}
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        <motion.circle cx={150} cy={150} r={25}
          fill="#06B6D4" opacity={0.25} filter="url(#soft)"
          style={{ originX: '150px', originY: '150px' }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        {/* CORE */}
        <motion.circle cx={150} cy={150} r={16}
          fill="url(#coreGrad)" filter="url(#coreF)"
          style={{ originX: '150px', originY: '150px' }}
          animate={{ scale: [1, 1.18, 0.95, 1.12, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* CORE WHITE */}
        <motion.circle cx={150} cy={150} r={8}
          fill="white" opacity={0.95} filter="url(#coreF)"
          style={{ originX: '150px', originY: '150px' }}
          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ELECTRIC ARCS */}
        {[
          { x1: 150, y1: 134, x2: 150, y2: 114, d: 0 },
          { x1: 166, y1: 150, x2: 186, y2: 150, d: 1 },
          { x1: 150, y1: 166, x2: 150, y2: 186, d: 2 },
          { x1: 134, y1: 150, x2: 114, y2: 150, d: 3 },
        ].map((a, i) => (
          <motion.line key={i}
            x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
            stroke="#60A5FA" strokeWidth={2}
            strokeLinecap="round"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.2 + i * 0.6, delay: a.d }}
          />
        ))}

        {/* RANDOM BURST */}
        <motion.circle cx={150} cy={150} r={20}
          fill="none" stroke="#60A5FA" strokeWidth={1.5}
          style={{ originX: '150px', originY: '150px' }}
          animate={burst
            ? { scale: [1, 5, 6], opacity: [0.9, 0.3, 0] }
            : { scale: 1, opacity: 0 }
          }
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        {/* ANTENNA */}
        <line x1={150} y1={134} x2={150} y2={114}
          stroke="#2563EB" strokeWidth={1.2} opacity={0.5}
        />
        <motion.circle cx={150} cy={110} r={3.5}
          fill="#06B6D4" filter="url(#glow)"
          style={{ originX: '150px', originY: '110px' }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  )
}

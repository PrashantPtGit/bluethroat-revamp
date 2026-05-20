'use client'
import { motion } from 'framer-motion'

interface BlueProps {
  size?: number
  showGlow?: boolean
  mood?: string
}

export default function Blue({ size = 300, showGlow = true }: BlueProps) {
  const particles = [
    { orbitRadius: 95,  speed: 12, startAngle: 0,   pSize: 3,   color: '#2563EB' },
    { orbitRadius: 85,  speed: 9,  startAngle: 45,  pSize: 2.5, color: '#06B6D4' },
    { orbitRadius: 100, speed: 15, startAngle: 90,  pSize: 2,   color: '#2563EB' },
    { orbitRadius: 78,  speed: 7,  startAngle: 135, pSize: 3.5, color: '#06B6D4' },
    { orbitRadius: 92,  speed: 11, startAngle: 180, pSize: 3,   color: '#2563EB' },
    { orbitRadius: 88,  speed: 13, startAngle: 225, pSize: 2,   color: '#06B6D4' },
    { orbitRadius: 75,  speed: 8,  startAngle: 270, pSize: 3.5, color: '#2563EB' },
    { orbitRadius: 105, speed: 16, startAngle: 315, pSize: 2.5, color: '#06B6D4' },
  ]

  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#93C5FD" />
            <stop offset="60%"  stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </radialGradient>
          <filter id="blueGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="coreFilter" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* LAYER 1: OUTER RIPPLE RINGS */}
        {showGlow && [0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={150} cy={150} r={120}
            fill="none"
            stroke={i === 2 ? '#06B6D4' : '#2563EB'}
            strokeWidth={i === 0 ? 0.5 : i === 1 ? 0.3 : 0.2}
            style={{ originX: '150px', originY: '150px' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0, 0.35] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 1,
            }}
          />
        ))}

        {/* LAYER 2: ROTATING OUTER DASHED RING */}
        <motion.circle
          cx={150} cy={150} r={108}
          fill="none"
          stroke="#2563EB"
          strokeWidth={1}
          strokeDasharray="4 8"
          opacity={0.45}
          filter="url(#blueGlow)"
          style={{ originX: '150px', originY: '150px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* LAYER 3: ROTATING MIDDLE RING OPPOSITE */}
        <motion.circle
          cx={150} cy={150} r={88}
          fill="none"
          stroke="#06B6D4"
          strokeWidth={1}
          strokeDasharray="2 6"
          opacity={0.5}
          filter="url(#blueGlow)"
          style={{ originX: '150px', originY: '150px' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        />

        {/* LAYER 4: INNER FAST RING */}
        <motion.circle
          cx={150} cy={150} r={65}
          fill="none"
          stroke="#60A5FA"
          strokeWidth={0.8}
          strokeDasharray="3 9"
          opacity={0.4}
          filter="url(#blueGlow)"
          style={{ originX: '150px', originY: '150px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        {/* LAYER 5: JARVIS ARC SEGMENT 1 */}
        <motion.path
          d="M 150 42 A 108 108 0 0 1 258 150"
          fill="none"
          stroke="#06B6D4"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeDasharray="28 310"
          filter="url(#blueGlow)"
          opacity={0.85}
          animate={{ strokeDashoffset: [0, -338] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />

        {/* LAYER 5B: JARVIS ARC SEGMENT 2 */}
        <motion.path
          d="M 150 258 A 108 108 0 0 1 42 150"
          fill="none"
          stroke="#2563EB"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeDasharray="28 310"
          filter="url(#blueGlow)"
          opacity={0.85}
          animate={{ strokeDashoffset: [0, -338] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 2.5 }}
        />

        {/* LAYER 6: ORBITING PARTICLES */}
        {particles.map((p, i) => {
          const cx = 150 + p.orbitRadius * Math.cos(p.startAngle * Math.PI / 180)
          const cy = 150 + p.orbitRadius * Math.sin(p.startAngle * Math.PI / 180)
          return (
            <motion.circle
              key={i}
              cx={cx} cy={cy}
              r={p.pSize}
              fill={p.color}
              filter="url(#blueGlow)"
              style={{ originX: '150px', originY: '150px' }}
              animate={{ rotate: 360, opacity: [0.4, 1, 0.4] }}
              transition={{
                rotate:   { duration: p.speed, repeat: Infinity, ease: 'linear' },
                opacity:  { duration: 2, repeat: Infinity, delay: i * 0.25 },
              }}
            />
          )
        })}

        {/* LAYER 7: ENERGY CORE GLOW */}
        <motion.circle
          cx={150} cy={150} r={45}
          fill="#2563EB" opacity={0.08}
          style={{ originX: '150px', originY: '150px' }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx={150} cy={150} r={32}
          fill="#2563EB" opacity={0.15}
          style={{ originX: '150px', originY: '150px' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        <motion.circle
          cx={150} cy={150} r={20}
          fill="#06B6D4" opacity={0.22}
          style={{ originX: '150px', originY: '150px' }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        />

        {/* LAYER 8: CORE */}
        <motion.circle
          cx={150} cy={150} r={14}
          fill="url(#coreGradient)"
          filter="url(#coreFilter)"
          style={{ originX: '150px', originY: '150px' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* LAYER 9: CORE WHITE CENTER */}
        <motion.circle
          cx={150} cy={150} r={6}
          fill="white" opacity={0.9}
          filter="url(#coreFilter)"
          style={{ originX: '150px', originY: '150px' }}
          animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* LAYER 10: ELECTRIC ARCS */}
        {[
          { x1: 150, y1: 136, x2: 150, y2: 116, delay: 0 },
          { x1: 164, y1: 150, x2: 184, y2: 150, delay: 1 },
          { x1: 150, y1: 164, x2: 150, y2: 184, delay: 2 },
          { x1: 136, y1: 150, x2: 116, y2: 150, delay: 3 },
        ].map((arc, i) => (
          <motion.line
            key={i}
            x1={arc.x1} y1={arc.y1}
            x2={arc.x2} y2={arc.y2}
            stroke="#60A5FA"
            strokeWidth={1.5}
            strokeLinecap="round"
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{
              duration:    0.4,
              repeat:      Infinity,
              repeatDelay: 2 + i,
              delay:       arc.delay,
            }}
          />
        ))}

        {/* LAYER 11: ANTENNA */}
        <line
          x1={150} y1={136}
          x2={150} y2={116}
          stroke="#2563EB"
          strokeWidth={1.2}
          opacity={0.5}
        />
        <motion.circle
          cx={150} cy={112} r={3.5}
          fill="#06B6D4"
          filter="url(#blueGlow)"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ originX: '150px', originY: '112px' }}
        />
      </svg>
    </motion.div>
  )
}

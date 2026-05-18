'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'

interface BlueProps {
  size?: number
  showGlow?: boolean
}

export default function Blue({ size = 200, showGlow = true }: BlueProps) {
  // Unique gradient id so multiple Blue instances on the same page don't collide
  const uid = useId().replace(/:/g, '')
  const gradientId = `blueGlow-${uid}`

  const height = Math.round((size * 240) / 200)

  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height, display: 'block' }}
    >
      <svg
        viewBox="0 0 200 240"
        width={size}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Blue — AI automation assistant"
        role="img"
      >
        <defs>
          <radialGradient
            id={gradientId}
            cx="50%"
            cy="50%"
            r="50%"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%"   stopColor="#2563EB" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* 1 · Outer glow ring */}
        {showGlow && (
          <motion.ellipse
            cx={100} cy={120} rx={85} ry={85}
            fill="none"
            stroke="#2563EB"
            strokeWidth={1}
            opacity={0.15}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '100px 120px' }}
          />
        )}

        {/* 2 · Main body circle */}
        <circle cx={100} cy={110} r={72} fill="#0D1520" stroke="#2563EB" strokeWidth={1.5} opacity={0.6} />

        {/* 3 · Inner glow */}
        <circle cx={100} cy={110} r={60} fill={`url(#${gradientId})`} />

        {/* 4 · Left eye */}
        <motion.g
          style={{ transformOrigin: '78px 102px' }}
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
        >
          <circle cx={78} cy={102} r={6}   fill="#2563EB" />
          <circle cx={78} cy={102} r={2.5} fill="#F8FAFC" />
        </motion.g>

        {/* 5 · Right eye */}
        <motion.g
          style={{ transformOrigin: '122px 102px' }}
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
        >
          <circle cx={122} cy={102} r={6}   fill="#2563EB" />
          <circle cx={122} cy={102} r={2.5} fill="#F8FAFC" />
        </motion.g>

        {/* 6 · Mouth — curved smile */}
        <path
          d="M 85 128 Q 100 138 115 128"
          fill="none"
          stroke="#2563EB"
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.8}
        />

        {/* 7 · Accent dots below mouth */}
        {([88, 100, 112] as const).map((cx, i) => (
          <motion.circle
            key={cx}
            cx={cx} cy={148} r={2}
            fill="#2563EB"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* 8 · Antenna */}
        <line x1={100} y1={38} x2={100} y2={18} stroke="#2563EB" strokeWidth={1.5} opacity={0.5} />
        <motion.circle
          cx={100} cy={14} r={4}
          fill="#2563EB"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </motion.div>
  )
}

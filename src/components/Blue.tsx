'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'

interface BlueProps {
  size?: number
  mood?: string
}

const PARTICLES = [
  { r: 100, angle: 0,   size: 2.5, color: '#06B6D4', speed: 22  },
  { r: 100, angle: 90,  size: 2,   color: '#2563EB', speed: 22  },
  { r: 100, angle: 180, size: 2.5, color: '#06B6D4', speed: 22  },
  { r: 100, angle: 270, size: 2,   color: '#2563EB', speed: 22  },
  { r: 72,  angle: 45,  size: 3,   color: '#60A5FA', speed: 11  },
  { r: 72,  angle: 135, size: 2.5, color: '#2563EB', speed: 11  },
  { r: 72,  angle: 225, size: 3,   color: '#60A5FA', speed: 11  },
  { r: 72,  angle: 315, size: 2.5, color: '#2563EB', speed: 11  },
  { r: 44,  angle: 0,   size: 3.5, color: '#93C5FD', speed: 5.5 },
  { r: 44,  angle: 120, size: 3,   color: '#06B6D4', speed: 5.5 },
  { r: 44,  angle: 240, size: 3.5, color: '#93C5FD', speed: 5.5 },
  { r: 28,  angle: 60,  size: 2.5, color: '#FFFFFF', speed: 3.5 },
]

export default function Blue({ size = 300 }: BlueProps) {
  const uid       = useId().replace(/:/g, '')
  const coreId    = `coreGrad-${uid}`
  const halo1Id   = `halo1-${uid}`
  const halo2Id   = `halo2-${uid}`
  const coreFId   = `coreF-${uid}`
  const glowFId   = `glowF-${uid}`
  const partFId   = `partF-${uid}`

  return (
    <motion.div
      animate={{ y: [0, -16, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size, display: 'block' }}
    >
      <svg
        viewBox="0 0 300 300"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={coreId} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity={0.95} />
            <stop offset="30%"  stopColor="#93C5FD" stopOpacity={0.85} />
            <stop offset="65%"  stopColor="#2563EB" stopOpacity={0.6}  />
            <stop offset="100%" stopColor="#1E40AF" stopOpacity={0}    />
          </radialGradient>
          <radialGradient id={halo1Id} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#2563EB" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#2563EB" stopOpacity={0}   />
          </radialGradient>
          <radialGradient id={halo2Id} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#06B6D4" stopOpacity={0.15} />
            <stop offset="100%" stopColor="transparent" stopOpacity={0} />
          </radialGradient>
          <filter id={coreFId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id={glowFId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3"/>
          </filter>
          <filter id={partFId} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="1.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* L1: Outer atmosphere */}
        <motion.circle
          cx={150} cy={150} r={135}
          fill={`url(#${halo2Id})`}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '150px', originY: '150px' }}
        />

        {/* L2: Ripple rings — expand outward and fade */}
        <motion.circle
          cx={150} cy={150} r={110}
          stroke="#2563EB" strokeWidth={0.7}
          animate={{ scale: [1, 1.2, 1.2], opacity: [0.5, 0, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut', times: [0, 0.7, 1] }}
          style={{ originX: '150px', originY: '150px' }}
        />
        <motion.circle
          cx={150} cy={150} r={110}
          stroke="#2563EB" strokeWidth={0.5}
          animate={{ scale: [1, 1.2, 1.2], opacity: [0.35, 0, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut', delay: 1.17, times: [0, 0.7, 1] }}
          style={{ originX: '150px', originY: '150px' }}
        />
        <motion.circle
          cx={150} cy={150} r={110}
          stroke="#06B6D4" strokeWidth={0.4}
          animate={{ scale: [1, 1.2, 1.2], opacity: [0.25, 0, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut', delay: 2.34, times: [0, 0.7, 1] }}
          style={{ originX: '150px', originY: '150px' }}
        />

        {/* L3: JARVIS dashed rotating rings */}
        <motion.circle
          cx={150} cy={150} r={100}
          stroke="#2563EB" strokeWidth={0.8}
          strokeDasharray="4 12" opacity={0.55}
          filter={`url(#${partFId})`}
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '150px', originY: '150px' }}
        />
        <motion.circle
          cx={150} cy={150} r={86}
          stroke="#06B6D4" strokeWidth={0.7}
          strokeDasharray="2 9" opacity={0.5}
          filter={`url(#${partFId})`}
          animate={{ rotate: -360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '150px', originY: '150px' }}
        />
        <motion.circle
          cx={150} cy={150} r={72}
          stroke="#60A5FA" strokeWidth={0.7}
          strokeDasharray="6 16 1 16" opacity={0.48}
          filter={`url(#${partFId})`}
          animate={{ rotate: 360 }}
          transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '150px', originY: '150px' }}
        />
        <motion.circle
          cx={150} cy={150} r={58}
          stroke="#2563EB" strokeWidth={0.9}
          strokeDasharray="3 8" opacity={0.55}
          filter={`url(#${partFId})`}
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '150px', originY: '150px' }}
        />
        <motion.circle
          cx={150} cy={150} r={44}
          stroke="#93C5FD" strokeWidth={0.8}
          strokeDasharray="2 5" opacity={0.6}
          filter={`url(#${partFId})`}
          animate={{ rotate: 360 }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '150px', originY: '150px' }}
        />

        {/* L4: JARVIS arc segments */}
        <motion.path
          d="M 150 50 A 100 100 0 0 1 250 150"
          stroke="#06B6D4" strokeWidth={1.6} strokeLinecap="round"
          strokeDasharray="25 290" opacity={0.85}
          filter={`url(#${partFId})`}
          animate={{ strokeDashoffset: [0, -315] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
        <motion.path
          d="M 150 250 A 100 100 0 0 1 50 150"
          stroke="#2563EB" strokeWidth={1.6} strokeLinecap="round"
          strokeDasharray="25 290" opacity={0.85}
          filter={`url(#${partFId})`}
          animate={{ strokeDashoffset: [0, -315] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 2.5 }}
        />
        <motion.path
          d="M 72 80 A 88 88 0 0 1 150 62"
          stroke="#60A5FA" strokeWidth={1.1} strokeLinecap="round"
          strokeDasharray="14 200" opacity={0.7}
          filter={`url(#${partFId})`}
          animate={{ strokeDashoffset: [0, -214] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', delay: 1 }}
        />
        <motion.path
          d="M 228 220 A 88 88 0 0 1 150 238"
          stroke="#60A5FA" strokeWidth={1.1} strokeLinecap="round"
          strokeDasharray="14 200" opacity={0.7}
          filter={`url(#${partFId})`}
          animate={{ strokeDashoffset: [0, -214] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', delay: 3 }}
        />

        {/* L5: Orbiting particles */}
        <g filter={`url(#${partFId})`}>
          {PARTICLES.map((p, i) => {
            const cx = 150 + p.r * Math.cos(p.angle * Math.PI / 180)
            const cy = 150 + p.r * Math.sin(p.angle * Math.PI / 180)
            return (
              <g key={i} transform="translate(150, 150)">
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: p.speed, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '0px 0px' }}
                >
                  <circle
                    cx={cx - 150}
                    cy={cy - 150}
                    r={p.size}
                    fill={p.color}
                  />
                </motion.g>
              </g>
            )
          })}
        </g>

        {/* L6: Glow halos — pure fill, no stroke */}
        <motion.circle
          cx={150} cy={150} r={52}
          fill={`url(#${halo1Id})`}
          filter={`url(#${glowFId})`}
          animate={{ scale: [1, 1.28, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '150px', originY: '150px' }}
        />
        <motion.circle
          cx={150} cy={150} r={38}
          fill="rgba(37,99,235,0.22)"
          filter={`url(#${glowFId})`}
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          style={{ originX: '150px', originY: '150px' }}
        />
        <motion.circle
          cx={150} cy={150} r={25}
          fill="rgba(96,165,250,0.28)"
          filter={`url(#${glowFId})`}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ originX: '150px', originY: '150px' }}
        />

        {/* L7: Core */}
        <motion.circle
          cx={150} cy={150} r={16}
          fill={`url(#${coreId})`}
          filter={`url(#${coreFId})`}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '150px', originY: '150px' }}
        />

        {/* L8: Core white center */}
        <motion.circle
          cx={150} cy={150} r={7}
          fill="white" opacity={0.92}
          filter={`url(#${coreFId})`}
          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '150px', originY: '150px' }}
        />

        {/* L9: Antenna */}
        <line
          x1={150} y1={134} x2={150} y2={115}
          stroke="#2563EB" strokeWidth={1.2} opacity={0.5}
        />
        <motion.circle
          cx={150} cy={111} r={3.5}
          fill="#06B6D4"
          filter={`url(#${partFId})`}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '150px', originY: '111px' }}
        />
      </svg>
    </motion.div>
  )
}

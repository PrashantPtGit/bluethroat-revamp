'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'

interface BlueProps {
  size?: number
  mood?: string
}

const PARTICLES = [
  // Outer orbit r=108
  { r: 108, angle: 0,   size: 2.5, color: '#06B6D4', speed: 22 },
  { r: 108, angle: 90,  size: 2,   color: '#2563EB', speed: 22 },
  { r: 108, angle: 180, size: 2.5, color: '#06B6D4', speed: 22 },
  { r: 108, angle: 270, size: 2,   color: '#2563EB', speed: 22 },
  // Mid orbit r=76
  { r: 76,  angle: 45,  size: 3,   color: '#60A5FA', speed: 11 },
  { r: 76,  angle: 135, size: 2.5, color: '#2563EB', speed: 11 },
  { r: 76,  angle: 225, size: 3,   color: '#60A5FA', speed: 11 },
  { r: 76,  angle: 315, size: 2.5, color: '#2563EB', speed: 11 },
  // Inner orbit r=48
  { r: 48,  angle: 0,   size: 3.5, color: '#93C5FD', speed: 6  },
  { r: 48,  angle: 120, size: 3,   color: '#06B6D4', speed: 6  },
  { r: 48,  angle: 240, size: 3.5, color: '#93C5FD', speed: 6  },
  // Close orbit r=32
  { r: 32,  angle: 60,  size: 2.5, color: '#FFFFFF', speed: 3.5},
]

export default function Blue({ size = 300 }: BlueProps) {
  const uid          = useId().replace(/:/g, '')
  const coreGradId   = `coreGrad-${uid}`
  const haloGradId   = `haloGrad-${uid}`
  const atmosGradId  = `atmosGrad-${uid}`
  const coreBlurId   = `coreBlur-${uid}`
  const softGlowId   = `softGlow-${uid}`
  const partGlowId   = `partGlow-${uid}`
  const ringGlowId   = `ringGlow-${uid}`

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
          <radialGradient id={coreGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity={0.95} />
            <stop offset="25%"  stopColor="#93C5FD" stopOpacity={0.9}  />
            <stop offset="60%"  stopColor="#2563EB" stopOpacity={0.7}  />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0}    />
          </radialGradient>
          <radialGradient id={haloGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#2563EB" stopOpacity={0.35} />
            <stop offset="50%"  stopColor="#2563EB" stopOpacity={0.08} />
            <stop offset="100%" stopColor="transparent" stopOpacity={0}/>
          </radialGradient>
          <radialGradient id={atmosGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#06B6D4" stopOpacity={0.06} />
            <stop offset="60%"  stopColor="#2563EB" stopOpacity={0.03} />
            <stop offset="100%" stopColor="transparent" stopOpacity={0}/>
          </radialGradient>
          <filter id={coreBlurId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id={softGlowId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4"/>
          </filter>
          <filter id={partGlowId} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.8" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id={ringGlowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* L1: Outer atmosphere */}
        <motion.circle
          cx={150} cy={150} r={138}
          fill={`url(#${atmosGradId})`}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '50% 50%' }}
        />

        {/* L2: Outer ripple rings — expand and fade */}
        <motion.circle
          cx={150} cy={150} r={125}
          stroke="#2563EB" strokeWidth={0.8}
          animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '150px', originY: '150px' }}
        />
        <motion.circle
          cx={150} cy={150} r={125}
          stroke="#06B6D4" strokeWidth={0.5}
          animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.3 }}
          style={{ originX: '150px', originY: '150px' }}
        />
        <motion.circle
          cx={150} cy={150} r={125}
          stroke="#2563EB" strokeWidth={0.4}
          animate={{ scale: [1, 1.18, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2.6 }}
          style={{ originX: '150px', originY: '150px' }}
        />

        {/* L3: JARVIS dashed rotating rings */}
        <motion.circle
          cx={150} cy={150} r={108}
          stroke="#2563EB" strokeWidth={0.7}
          strokeDasharray="5 14" opacity={0.55}
          filter={`url(#${ringGlowId})`}
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '150px', originY: '150px' }}
        />
        <motion.circle
          cx={150} cy={150} r={92}
          stroke="#06B6D4" strokeWidth={0.8}
          strokeDasharray="3 10" opacity={0.5}
          filter={`url(#${ringGlowId})`}
          animate={{ rotate: -360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '150px', originY: '150px' }}
        />
        <motion.circle
          cx={150} cy={150} r={76}
          stroke="#60A5FA" strokeWidth={0.7}
          strokeDasharray="8 18 2 18" opacity={0.5}
          filter={`url(#${ringGlowId})`}
          animate={{ rotate: 360 }}
          transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '150px', originY: '150px' }}
        />
        <motion.circle
          cx={150} cy={150} r={62}
          stroke="#2563EB" strokeWidth={0.9}
          strokeDasharray="4 8" opacity={0.55}
          filter={`url(#${ringGlowId})`}
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '150px', originY: '150px' }}
        />
        <motion.circle
          cx={150} cy={150} r={48}
          stroke="#93C5FD" strokeWidth={0.8}
          strokeDasharray="2 6" opacity={0.6}
          filter={`url(#${ringGlowId})`}
          animate={{ rotate: 360 }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '150px', originY: '150px' }}
        />

        {/* L4: JARVIS arc segments */}
        <motion.path
          d="M 150 42 A 108 108 0 0 1 258 150"
          stroke="#06B6D4" strokeWidth={1.8} strokeLinecap="round"
          strokeDasharray="30 300" opacity={0.8}
          filter={`url(#${partGlowId})`}
          animate={{ strokeDashoffset: [0, -340] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
        <motion.path
          d="M 150 258 A 108 108 0 0 1 42 150"
          stroke="#2563EB" strokeWidth={1.8} strokeLinecap="round"
          strokeDasharray="30 300" opacity={0.8}
          filter={`url(#${partGlowId})`}
          animate={{ strokeDashoffset: [0, -340] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 2.5 }}
        />
        <motion.path
          d="M 75 85 A 90 90 0 0 1 150 60"
          stroke="#60A5FA" strokeWidth={1.2} strokeLinecap="round"
          strokeDasharray="15 200" opacity={0.7}
          filter={`url(#${partGlowId})`}
          animate={{ strokeDashoffset: [0, -215] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', delay: 1 }}
        />
        <motion.path
          d="M 225 215 A 90 90 0 0 1 150 240"
          stroke="#60A5FA" strokeWidth={1.2} strokeLinecap="round"
          strokeDasharray="15 200" opacity={0.7}
          filter={`url(#${partGlowId})`}
          animate={{ strokeDashoffset: [0, -215] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', delay: 3 }}
        />

        {/* L5: Orbiting particles */}
        <g filter={`url(#${partGlowId})`}>
          {PARTICLES.map((p, i) => (
            <g key={i} transform="translate(150, 150)">
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: p.speed, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '0px 0px' }}
              >
                <circle
                  cx={p.r * Math.cos(p.angle * Math.PI / 180)}
                  cy={p.r * Math.sin(p.angle * Math.PI / 180)}
                  r={p.size}
                  fill={p.color}
                />
              </motion.g>
            </g>
          ))}
        </g>

        {/* L6: Glow halos — pure fill, no stroke */}
        <motion.circle
          cx={150} cy={150} r={55}
          fill={`url(#${haloGradId})`}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '150px', originY: '150px' }}
        />
        <motion.circle
          cx={150} cy={150} r={40}
          fill="rgba(37,99,235,0.22)"
          filter={`url(#${softGlowId})`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          style={{ originX: '150px', originY: '150px' }}
        />
        <motion.circle
          cx={150} cy={150} r={28}
          fill="rgba(96,165,250,0.28)"
          filter={`url(#${softGlowId})`}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ originX: '150px', originY: '150px' }}
        />

        {/* L7: Core */}
        <motion.circle
          cx={150} cy={150} r={18}
          fill={`url(#${coreGradId})`}
          filter={`url(#${coreBlurId})`}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '150px', originY: '150px' }}
        />

        {/* L8: Core white center */}
        <motion.circle
          cx={150} cy={150} r={8}
          fill="white" opacity={0.9}
          filter={`url(#${coreBlurId})`}
          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '150px', originY: '150px' }}
        />

        {/* L9: Antenna */}
        <line
          x1={150} y1={132} x2={150} y2={112}
          stroke="#2563EB" strokeWidth={1.2} opacity={0.5}
        />
        <motion.circle
          cx={150} cy={108} r={3.5}
          fill="#06B6D4"
          filter={`url(#${partGlowId})`}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '150px', originY: '108px' }}
        />
      </svg>
    </motion.div>
  )
}

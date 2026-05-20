'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'

interface BlueProps {
  size?: number
  mood?: string
}

const PARTICLES = [
  { r: 175, angle: 0,   size: 2.5, color: '#06B6D4', speed: 25, opacity: 0.9 },
  { r: 175, angle: 90,  size: 2,   color: '#2563EB', speed: 25, opacity: 0.7 },
  { r: 175, angle: 180, size: 2.5, color: '#06B6D4', speed: 25, opacity: 0.9 },
  { r: 175, angle: 270, size: 2,   color: '#2563EB', speed: 25, opacity: 0.7 },
  { r: 140, angle: 45,  size: 3,   color: '#60A5FA', speed: 12, opacity: 1.0 },
  { r: 140, angle: 135, size: 2,   color: '#2563EB', speed: 12, opacity: 0.8 },
  { r: 140, angle: 225, size: 3,   color: '#60A5FA', speed: 12, opacity: 1.0 },
  { r: 140, angle: 315, size: 2,   color: '#2563EB', speed: 12, opacity: 0.8 },
  { r: 100, angle: 0,   size: 3.5, color: '#93C5FD', speed: 8,  opacity: 1.0 },
  { r: 100, angle: 120, size: 2.5, color: '#2563EB', speed: 8,  opacity: 0.9 },
  { r: 100, angle: 240, size: 3.5, color: '#93C5FD', speed: 8,  opacity: 1.0 },
  { r: 80,  angle: 60,  size: 4,   color: '#60A5FA', speed: 6,  opacity: 1.0 },
  { r: 80,  angle: 180, size: 3,   color: '#06B6D4', speed: 6,  opacity: 0.9 },
  { r: 80,  angle: 300, size: 4,   color: '#60A5FA', speed: 6,  opacity: 1.0 },
  { r: 55,  angle: 90,  size: 3,   color: '#93C5FD', speed: 4,  opacity: 1.0 },
  { r: 55,  angle: 270, size: 3,   color: '#93C5FD', speed: 4,  opacity: 1.0 },
]

export default function Blue({ size = 400 }: BlueProps) {
  const uid          = useId().replace(/:/g, '')
  const coreGradId   = `coreGrad-${uid}`
  const innerGlowId  = `innerGlow-${uid}`
  const outerAtmosId = `outerAtmos-${uid}`
  const coreBlurId   = `coreBlur-${uid}`
  const softGlowId   = `softGlow-${uid}`
  const partGlowId   = `partGlow-${uid}`

  return (
    <motion.div
      animate={{ y: [0, -16, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size, display: 'block' }}
    >
      <svg
        viewBox="0 0 400 400"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={coreGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity={0.9} />
            <stop offset="20%"  stopColor="#93C5FD" stopOpacity={0.8} />
            <stop offset="50%"  stopColor="#2563EB" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0}   />
          </radialGradient>
          <radialGradient id={innerGlowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(37,99,235,0.5)"  />
            <stop offset="40%"  stopColor="rgba(37,99,235,0.15)" />
            <stop offset="100%" stopColor="transparent"           />
          </radialGradient>
          <radialGradient id={outerAtmosId} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(6,182,212,0.08)" />
            <stop offset="50%"  stopColor="rgba(37,99,235,0.04)" />
            <stop offset="100%" stopColor="transparent"           />
          </radialGradient>
          <filter id={coreBlurId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id={softGlowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3"/>
          </filter>
          <filter id={partGlowId} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* L1: Outer atmosphere */}
        <motion.circle
          cx={200} cy={200} r={190}
          fill={`url(#${outerAtmosId})`}
          filter={`url(#${softGlowId})`}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '50% 50%' }}
        />

        {/* L2: Outer dashed ring — slow CW */}
        <motion.circle
          cx={200} cy={200} r={175}
          stroke="#06B6D4" strokeWidth={0.6}
          strokeDasharray="3 12" opacity={0.5}
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '200px', originY: '200px' }}
        />

        {/* L3: Second ring — CCW */}
        <motion.circle
          cx={200} cy={200} r={158}
          stroke="#2563EB" strokeWidth={0.8}
          strokeDasharray="8 16 2 16" opacity={0.45}
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '200px', originY: '200px' }}
        />

        {/* L4: Third ring — CW */}
        <motion.circle
          cx={200} cy={200} r={140}
          stroke="#06B6D4" strokeWidth={0.6}
          strokeDasharray="1 8" opacity={0.4}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '200px', originY: '200px' }}
        />

        {/* L5: Fourth ring — bright CCW */}
        <motion.circle
          cx={200} cy={200} r={122}
          stroke="#60A5FA" strokeWidth={1.0}
          strokeDasharray="12 6 3 6" opacity={0.55}
          animate={{ rotate: -360 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '200px', originY: '200px' }}
        />

        {/* L6: Inner bright ring — CW */}
        <motion.circle
          cx={200} cy={200} r={100}
          stroke="#2563EB" strokeWidth={1.2}
          strokeDasharray="6 4" opacity={0.6}
          animate={{ rotate: 360 }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '200px', originY: '200px' }}
        />

        {/* L7: Innermost ring — CCW */}
        <motion.circle
          cx={200} cy={200} r={80}
          stroke="#93C5FD" strokeWidth={0.8}
          strokeDasharray="2 6" opacity={0.5}
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '200px', originY: '200px' }}
        />

        {/* L8: JARVIS arc segments */}
        <motion.path
          d="M 200 45 A 155 155 0 0 1 355 200"
          stroke="#06B6D4" strokeWidth={1.5} strokeLinecap="round"
          strokeDasharray="20 220" opacity={0.6}
          animate={{ strokeDashoffset: [0, -100, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 200 355 A 155 155 0 0 1 45 200"
          stroke="#2563EB" strokeWidth={1.5} strokeLinecap="round"
          strokeDasharray="20 220" opacity={0.6}
          animate={{ strokeDashoffset: [0, -100, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.path
          d="M 90 110 A 130 130 0 0 1 200 70"
          stroke="#60A5FA" strokeWidth={1} strokeLinecap="round"
          strokeDasharray="15 200" opacity={0.5}
          animate={{ strokeDashoffset: [0, -80, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.path
          d="M 310 290 A 130 130 0 0 1 200 330"
          stroke="#60A5FA" strokeWidth={1} strokeLinecap="round"
          strokeDasharray="15 200" opacity={0.5}
          animate={{ strokeDashoffset: [0, -80, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />

        {/* L9: Orbiting particles */}
        <g filter={`url(#${partGlowId})`}>
          {PARTICLES.map((p, i) => (
            <g key={i} transform="translate(200, 200)">
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
                  opacity={p.opacity}
                />
              </motion.g>
            </g>
          ))}
        </g>

        {/* L10: Glow halos */}
        <motion.circle
          cx={200} cy={200} r={68}
          fill="rgba(37,99,235,0.12)"
          filter={`url(#${softGlowId})`}
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '50% 50%' }}
        />
        <motion.circle
          cx={200} cy={200} r={50}
          fill="rgba(37,99,235,0.20)"
          filter={`url(#${softGlowId})`}
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          style={{ transformOrigin: '50% 50%' }}
        />
        <motion.circle
          cx={200} cy={200} r={35}
          fill="rgba(96,165,250,0.25)"
          filter={`url(#${softGlowId})`}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          style={{ transformOrigin: '50% 50%' }}
        />

        {/* L11: Core */}
        <motion.circle
          cx={200} cy={200} r={22}
          fill={`url(#${coreGradId})`}
          filter={`url(#${coreBlurId})`}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '50% 50%' }}
        />

        {/* L12: Core bright center */}
        <motion.circle
          cx={200} cy={200} r={10}
          fill="white" opacity={0.85}
          filter={`url(#${coreBlurId})`}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* L13: Antenna */}
        <line
          x1={200} y1={178} x2={200} y2={155}
          stroke="#2563EB" strokeWidth={1.5} opacity={0.6}
        />
        <motion.circle
          cx={200} cy={150} r={4}
          fill="#06B6D4"
          filter={`url(#${partGlowId})`}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </motion.div>
  )
}

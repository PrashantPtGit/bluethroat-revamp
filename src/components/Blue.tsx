'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'
import type { BlueMode } from '@/hooks/useBlueState'

export type { BlueMode }

interface BlueProps {
  size?:     number
  showGlow?: boolean
  mood?:     BlueMode
}

// 12 particles — 30° apart, varied radii/speeds/sizes, three colours
const PARTICLES = [
  { orbitRadius: 115, speed:  6, startAngle:   0, size: 5,   color: '#2563EB' },
  { orbitRadius: 108, speed:  8, startAngle:  30, size: 3.5, color: '#06B6D4' },
  { orbitRadius: 100, speed: 10, startAngle:  60, size: 4.5, color: '#60A5FA' },
  { orbitRadius:  95, speed:  7, startAngle:  90, size: 3,   color: '#2563EB' },
  { orbitRadius:  88, speed: 12, startAngle: 120, size: 5,   color: '#06B6D4' },
  { orbitRadius:  82, speed:  9, startAngle: 150, size: 3.5, color: '#60A5FA' },
  { orbitRadius:  75, speed: 14, startAngle: 180, size: 4,   color: '#2563EB' },
  { orbitRadius: 110, speed: 11, startAngle: 210, size: 3,   color: '#06B6D4' },
  { orbitRadius:  92, speed:  8, startAngle: 240, size: 4.5, color: '#60A5FA' },
  { orbitRadius:  78, speed: 13, startAngle: 270, size: 3.5, color: '#2563EB' },
  { orbitRadius: 105, speed:  7, startAngle: 300, size: 5,   color: '#06B6D4' },
  { orbitRadius:  85, speed: 10, startAngle: 330, size: 3,   color: '#60A5FA' },
]

const BURST_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]
const BURST_BASE_DELAYS = [1.5, 2.5, 3.5, 2, 4, 1.8, 3, 2.8]


// ── Per-mood animation tables ────────────────────────────────────────────────

type FloatAnim = { y: number[]; x?: number[]; rotate?: number[]; scaleY?: number[] }

const FLOAT_ANIM: Record<BlueMode, FloatAnim> = {
  idle:      { y: [0, -18, 0] },
  curious:   { y: [0, -22, 0, -14, 0],              x: [-4,  4, -2,  2, 0] },
  troubled:  { y: [0,  -8, 2, -12, 0, -6, 4, 0],    x: [-6,  4, -8,  6, -2, 8, -4, 0] },
  confident: { y: [0, -25, 0] },
  excited:   { y: [0, -30, 5, -25, 0, -20, 3, 0],   rotate: [-3, 3, -2, 2, 0] },
  dancing:   { y: [0, -40, 0, -20, 0],               x: [-15, 15, -10, 10, 0], rotate: [0, 360] },
  happy:     { y: [0, -35, 0, -15, 0],               rotate: [0, 360] },
  leading:   { y: [0, -20, 0, -15, 0],               scaleY: [1, 1.25, 1] },
  pointing:  { y: [0, -10, 0],                       x: [0, 6, 0] },
  sleepy:    { y: [0, -6, 0] },
}

const FLOAT_TRANS: Record<BlueMode, { duration: number; repeat: number; ease?: 'easeInOut' | 'linear' }> = {
  idle:      { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
  curious:   { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
  troubled:  { duration: 1.2, repeat: Infinity },
  confident: { duration: 5.0, repeat: Infinity, ease: 'easeInOut' },
  excited:   { duration: 1.8, repeat: Infinity },
  dancing:   { duration: 2.0, repeat: 0 },
  happy:     { duration: 1.2, repeat: 0 },
  leading:   { duration: 2.0, repeat: Infinity, ease: 'easeInOut' },
  pointing:  { duration: 3.0, repeat: Infinity, ease: 'easeInOut' },
  sleepy:    { duration: 7.0, repeat: Infinity, ease: 'easeInOut' },
}


type CorePulse = { scale: number[]; dur: number }
const CORE_PULSE: Record<BlueMode, CorePulse> = {
  idle:      { scale: [1, 1.1, 1],              dur: 2   },
  curious:   { scale: [1, 1.15, 0.95, 1.1, 1],  dur: 1.5 },
  troubled:  { scale: [1, 0.85, 1.1, 0.9, 1],   dur: 0.8 },
  confident: { scale: [1, 1.2, 1],               dur: 3   },
  excited:   { scale: [1, 1.3, 0.9, 1.2, 1],    dur: 0.6 },
  dancing:   { scale: [1, 2, 1, 1.5, 1],         dur: 0.4 },
  happy:     { scale: [1, 1.6, 0.8, 1.4, 1],     dur: 0.5 },
  leading:   { scale: [1, 1.15, 1],              dur: 1.5 },
  pointing:  { scale: [1, 1.08, 1],              dur: 2.5 },
  sleepy:    { scale: [1, 1.02, 1],              dur: 5   },
}

// Particle orbit speed multiplier (lower = faster)
const PARTICLE_MULT: Record<BlueMode, number> = {
  idle: 1, curious: 0.7, troubled: 1.3, confident: 1, excited: 0.5, dancing: 0.3,
  happy: 0.3, leading: 0.6, pointing: 1.5, sleepy: 3.0,
}

// Burst repeatDelay override (null = use per-burst base delays)
const BURST_DELAY: Record<BlueMode, number | null> = {
  idle: null, curious: 2, troubled: 5, confident: 1, excited: 0.4, dancing: 0.15,
  happy: 0.2, leading: 1.5, pointing: null, sleepy: 15,
}

// Glow scale amplifier for the three core-glow circles
const GLOW_MULT: Record<BlueMode, number> = {
  idle: 1, curious: 1, troubled: 0.9, confident: 1.3, excited: 1.4, dancing: 1.5,
  happy: 1.6, leading: 1.1, pointing: 0.8, sleepy: 0.4,
}

// Ripple-ring opacity range
const RIPPLE_OPACITY: Record<BlueMode, [number, number, number]> = {
  idle:      [0.3, 0,   0.3],
  curious:   [0.3, 0,   0.3],
  troubled:  [0.4, 0.1, 0.4],
  confident: [0.5, 0,   0.5],
  excited:   [0.6, 0.1, 0.6],
  dancing:   [0.8, 0.2, 0.8],
  happy:     [0.7, 0.2, 0.7],
  leading:   [0.4, 0,   0.4],
  pointing:  [0.2, 0,   0.2],
  sleepy:    [0.1, 0,   0.1],
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Blue({ size = 420, showGlow = true, mood = 'idle' }: BlueProps) {
  const uid           = useId().replace(/:/g, '')
  const gradientId    = `coreGradient-${uid}`
  const particleGlowId = `particleGlow-${uid}`
  const coreGlowId    = `coreGlow-${uid}`

  const floatAnim   = FLOAT_ANIM[mood]
  const floatTrans  = FLOAT_TRANS[mood]
  const corePulse   = CORE_PULSE[mood]
  const particleMul = PARTICLE_MULT[mood]
  const burstDelay  = BURST_DELAY[mood]
  const glowMult    = GLOW_MULT[mood]
  const rippleOp    = RIPPLE_OPACITY[mood]

  return (
    <motion.div
      animate={floatAnim}
      transition={floatTrans}
      style={{ width: size, height: size, display: 'block' }}
    >
      <svg
        viewBox="0 0 300 300"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Blue — AI energy entity"
        role="img"
        overflow="visible"
      >
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#93C5FD" />
            <stop offset="60%"  stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </radialGradient>
          <filter id={particleGlowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id={coreGlowId} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* L1: Outer ripple rings */}
        {showGlow && (
          <>
            {([
              { r: 120, d: 0.5, delay: 0, baseOp: 0.5,  minOp: 0.10 },
              { r: 130, d: 0.3, delay: 1, baseOp: 0.4,  minOp: 0.05 },
              { r: 140, d: 0.2, delay: 2, baseOp: 0.35, minOp: 0.05 },
            ] as const).map(({ r, d, delay, baseOp, minOp }) => {
              const moodScale = rippleOp[0] / 0.3
              const peakOp   = Math.min(baseOp * moodScale, 1)
              return (
                <motion.circle
                  key={r}
                  cx={150} cy={150} r={r}
                  stroke="#2563EB" strokeWidth={d} fill="none"
                  animate={{ scale: [1, 1.15, 1], opacity: [peakOp, minOp, peakOp] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}
                  style={{ transformOrigin: '50% 50%' }}
                />
              )
            })}
          </>
        )}

        {/* L7: Orbiting particles */}
        <g filter={`url(#${particleGlowId})`}>
          {PARTICLES.map((p, i) => {
            const a = p.startAngle * Math.PI / 180
            return (
              <g key={i} transform="translate(150, 150)">
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: p.speed * particleMul, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '0px 0px' }}
                >
                  <motion.circle
                    cx={p.orbitRadius * Math.cos(a)}
                    cy={p.orbitRadius * Math.sin(a)}
                    r={p.size}
                    fill={p.color}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                  />
                </motion.g>
              </g>
            )
          })}
        </g>

        {/* L8: Core glow circles */}
        {([
          { r: 70, fill: '#2563EB', opacity: 0.18, maxScale: 1.3, delay: 0   },
          { r: 55, fill: '#2563EB', opacity: 0.22, maxScale: 1.2, delay: 0.3 },
          { r: 38, fill: '#06B6D4', opacity: 0.30, maxScale: 1.15,delay: 0.6 },
        ] as const).map(({ r, fill, opacity, maxScale, delay }) => (
          <motion.circle
            key={r}
            cx={150} cy={150} r={r}
            fill={fill} opacity={opacity}
            animate={{ scale: [1, maxScale * glowMult, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay }}
            style={{ transformOrigin: '50% 50%' }}
          />
        ))}

        {/* L9: Solid core */}
        <motion.circle
          cx={150} cy={150} r={18}
          fill={`url(#${gradientId})`}
          filter={`url(#${coreGlowId})`}
          animate={{ scale: corePulse.scale }}
          transition={{ duration: corePulse.dur, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '50% 50%' }}
        />

        {/* L9b: Troubled — red tint overlay */}
        {mood === 'troubled' && (
          <motion.circle
            cx={150} cy={150} r={22}
            fill="rgba(239,68,68,0.12)"
            animate={{ opacity: [0.1, 0.35, 0.1], scale: [1, 1.05, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ transformOrigin: '50% 50%' }}
          />
        )}

        {/* L10: Energy burst starburst */}
        {BURST_ANGLES.map((deg, i) => {
          const rad         = deg * Math.PI / 180
          const bx1         = 150 + 20 * Math.cos(rad)
          const by1         = 150 + 20 * Math.sin(rad)
          const bx2         = 150 + 40 * Math.cos(rad)
          const by2         = 150 + 40 * Math.sin(rad)
          const repeatDelay = burstDelay ?? BURST_BASE_DELAYS[i]
          return (
            <motion.line
              key={i}
              x1={bx1} y1={by1} x2={bx2} y2={by2}
              stroke="#60A5FA" strokeWidth={0.8}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.3, repeat: Infinity, repeatDelay, delay: i * 0.1 }}
            />
          )
        })}

      </svg>
    </motion.div>
  )
}

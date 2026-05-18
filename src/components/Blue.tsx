'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'

interface BlueProps {
  size?: number
  showGlow?: boolean
}

// 12 particles, 30° apart, varied radii/speeds/sizes, three colours
const PARTICLES = [
  { orbitRadius: 115, speed:  6, startAngle:   0, size: 4,   color: '#2563EB' },
  { orbitRadius: 108, speed:  8, startAngle:  30, size: 2.5, color: '#06B6D4' },
  { orbitRadius: 100, speed: 10, startAngle:  60, size: 3.5, color: '#60A5FA' },
  { orbitRadius:  95, speed:  7, startAngle:  90, size: 2,   color: '#2563EB' },
  { orbitRadius:  88, speed: 12, startAngle: 120, size: 4,   color: '#06B6D4' },
  { orbitRadius:  82, speed:  9, startAngle: 150, size: 2.5, color: '#60A5FA' },
  { orbitRadius:  75, speed: 14, startAngle: 180, size: 3,   color: '#2563EB' },
  { orbitRadius: 110, speed: 11, startAngle: 210, size: 2,   color: '#06B6D4' },
  { orbitRadius:  92, speed:  8, startAngle: 240, size: 3.5, color: '#60A5FA' },
  { orbitRadius:  78, speed: 13, startAngle: 270, size: 2.5, color: '#2563EB' },
  { orbitRadius: 105, speed:  7, startAngle: 300, size: 4,   color: '#06B6D4' },
  { orbitRadius:  85, speed: 10, startAngle: 330, size: 2,   color: '#60A5FA' },
]

// Electric arc spikes from core edge (r=18) to ~40
const ARCS = [
  { x1: 150, y1: 132, x2: 150, y2: 110, delay: 0,   repeatDelay: 2   },
  { x1: 168, y1: 150, x2: 190, y2: 150, delay: 1,   repeatDelay: 3   },
  { x1: 150, y1: 168, x2: 150, y2: 190, delay: 2,   repeatDelay: 4   },
  { x1: 132, y1: 150, x2: 110, y2: 150, delay: 3,   repeatDelay: 2.5 },
]

// Starburst lines radiating from r=20 to r=40
const BURST_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]
const BURST_DELAYS = [1.5, 2.5, 3.5, 2, 4, 1.8, 3, 2.8]

// Data readout labels
const READOUTS = [
  { text: 'ONLINE',  x: 150, y:  28, anchor: 'middle', opacity: 0.5, color: '#2563EB', fontSize: 8, delay: 0    },
  { text: '■ ■ ■',  x: 268, y: 154, anchor: 'start',  opacity: 0.4, color: '#06B6D4', fontSize: 7, delay: 0.5  },
  { text: 'v2.4.1', x: 150, y: 280, anchor: 'middle', opacity: 0.4, color: '#2563EB', fontSize: 8, delay: 1    },
  { text: '■ ■ ■',  x:  32, y: 154, anchor: 'end',    opacity: 0.4, color: '#06B6D4', fontSize: 7, delay: 1.5  },
]

export default function Blue({ size = 420, showGlow = true }: BlueProps) {
  const uid = useId().replace(/:/g, '')
  const gradientId = `coreGradient-${uid}`

  return (
    <motion.div
      animate={{ y: [0, -18, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
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
        </defs>

        {/* ── L1: Outer ripple rings (showGlow) ────────────── */}
        {showGlow && (
          <>
            {[{ r: 120, d: 0.5, delay: 0 }, { r: 130, d: 0.3, delay: 1 }, { r: 140, d: 0.2, delay: 2 }].map(({ r, d, delay }) => (
              <motion.circle
                key={r}
                cx={150} cy={150} r={r}
                stroke="#2563EB" strokeWidth={d} fill="none"
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}
                style={{ transformOrigin: '50% 50%' }}
              />
            ))}
            <motion.circle
              cx={150} cy={150} r={140}
              stroke="#06B6D4" strokeWidth={0.15} fill="none"
              animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              style={{ transformOrigin: '50% 50%' }}
            />
          </>
        )}

        {/* ── L2: Ring A — outer dashed ────────────────────── */}
        <motion.circle
          cx={150} cy={150} r={108}
          stroke="#2563EB" strokeWidth={1} fill="none"
          strokeDasharray="4 8" opacity={0.4}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50% 50%' }}
        />

        {/* ── L3: Ring B — middle dashed counter ───────────── */}
        <motion.circle
          cx={150} cy={150} r={88}
          stroke="#06B6D4" strokeWidth={1} fill="none"
          strokeDasharray="2 6" opacity={0.5}
          animate={{ rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50% 50%' }}
        />

        {/* ── L4: Ring C — inner fine dashed ───────────────── */}
        <motion.circle
          cx={150} cy={150} r={70}
          stroke="#06B6D4" strokeWidth={0.8} fill="none"
          strokeDasharray="1 4" opacity={0.3}
          animate={{ rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50% 50%' }}
        />

        {/* ── L5: Ring D — tilted ellipse ──────────────────── */}
        <motion.ellipse
          cx={150} cy={150} rx={105} ry={28}
          stroke="#2563EB" strokeWidth={1} fill="none" opacity={0.25}
          animate={{ rotate: [35, 395] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50% 50%' }}
        />

        {/* ── L6: Ring E — opposite tilted ellipse ─────────── */}
        <motion.ellipse
          cx={150} cy={150} rx={105} ry={28}
          stroke="#06B6D4" strokeWidth={0.8} fill="none" opacity={0.2}
          animate={{ rotate: [-35, -395] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50% 50%' }}
        />

        {/* ── L7: Orbiting particles (12) ──────────────────── */}
        {PARTICLES.map((p, i) => {
          const a = p.startAngle * Math.PI / 180
          return (
            <g key={i} transform="translate(150, 150)">
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: p.speed, repeat: Infinity, ease: 'linear' }}
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

        {/* ── L8: Energy core glow (bigger) ────────────────── */}
        {[{ r: 55, fill: '#2563EB', opacity: 0.06, scale: 1.3, delay: 0   },
          { r: 40, fill: '#2563EB', opacity: 0.12, scale: 1.2, delay: 0.3 },
          { r: 26, fill: '#06B6D4', opacity: 0.2,  scale: 1.15,delay: 0.6 }].map(({ r, fill, opacity, scale, delay }) => (
          <motion.circle
            key={r}
            cx={150} cy={150} r={r}
            fill={fill} opacity={opacity}
            animate={{ scale: [1, scale, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay }}
            style={{ transformOrigin: '50% 50%' }}
          />
        ))}

        {/* ── L9: Solid core ───────────────────────────────── */}
        <motion.circle
          cx={150} cy={150} r={18}
          fill={`url(#${gradientId})`}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '50% 50%' }}
        />

        {/* ── L10: Energy burst starburst ──────────────────── */}
        {BURST_ANGLES.map((deg, i) => {
          const rad = deg * Math.PI / 180
          const x1 = 150 + 20 * Math.cos(rad)
          const y1 = 150 + 20 * Math.sin(rad)
          const x2 = 150 + 40 * Math.cos(rad)
          const y2 = 150 + 40 * Math.sin(rad)
          return (
            <motion.line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#60A5FA" strokeWidth={0.8}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{
                duration:    0.3,
                repeat:      Infinity,
                repeatDelay: BURST_DELAYS[i],
                delay:       i * 0.15,
              }}
            />
          )
        })}

        {/* ── L11: Electric arc lines ───────────────────────── */}
        {ARCS.map((arc, i) => (
          <motion.line
            key={i}
            x1={arc.x1} y1={arc.y1} x2={arc.x2} y2={arc.y2}
            stroke="#60A5FA" strokeWidth={1.5} strokeLinecap="round"
            animate={{ opacity: [0, 0.8, 0], scaleY: [0.5, 1, 0.5] }}
            transition={{
              duration:    0.4,
              repeat:      Infinity,
              repeatDelay: arc.repeatDelay,
              delay:       arc.delay,
            }}
            style={{ transformOrigin: 'center' }}
          />
        ))}

        {/* ── L12: Scan line ───────────────────────────────── */}
        <motion.line
          x1={90} x2={210} y1={0} y2={0}
          stroke="#2563EB" strokeWidth={0.5} opacity={0.4}
          animate={{ y: [60, 240, 60] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ── L13: Data readout text labels ────────────────── */}
        {READOUTS.map(({ text, x, y, anchor, opacity, color, fontSize, delay }, i) => (
          <motion.g
            key={i}
            animate={{ opacity: [opacity * 0.4, Math.min(opacity * 1.6, 1), opacity * 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, delay, ease: 'easeInOut' }}
          >
            <text
              x={x} y={y}
              textAnchor={anchor as 'middle' | 'start' | 'end'}
              fontSize={fontSize}
              fill={color}
              fontFamily="monospace"
              style={{ userSelect: 'none', pointerEvents: 'none', letterSpacing: '0.08em' }}
            >
              {text}
            </text>
          </motion.g>
        ))}
      </svg>
    </motion.div>
  )
}

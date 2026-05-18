'use client'

import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'

const BEATS = [
  { label: 'Meet Blue',   top: '0%'   },
  { label: 'The Problem', top: '20%'  },
  { label: 'The Fix',     top: '40%'  },
  { label: 'Our Work',    top: '60%'  },
  { label: 'The Team',    top: '80%'  },
  { label: "Let's Talk",  top: '100%' },
]

// Scroll ranges that activate each beat
const RANGES: [number, number][] = [
  [0, 0.12],
  [0.12, 0.28],
  [0.28, 0.45],
  [0.45, 0.62],
  [0.62, 0.80],
  [0.80, 1.0],
]

export default function ScrollStory() {
  const { scrollYProgress } = useScroll()
  const [activeBeat, setActiveBeat]     = useState(0)
  const [scrollPct,  setScrollPct]      = useState(0)

  // Progress bar height: 0 → 240px
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0px', '240px'])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setScrollPct(Math.round(v * 100))
    const idx = RANGES.findIndex(([lo, hi]) => v >= lo && v < hi)
    setActiveBeat(idx === -1 ? BEATS.length - 1 : idx)
  })

  return (
    // Hidden below 1024px via Tailwind
    <div
      className="hidden lg:flex"
      style={{
        position:       'fixed',
        right:          '32px',
        top:            '50%',
        transform:      'translateY(-50%)',
        zIndex:         10,
        pointerEvents:  'none',
        flexDirection:  'column',
        alignItems:     'flex-end',
      }}
      aria-hidden
    >
      {/* Vertical track */}
      <div style={{ position: 'relative', width: '1px', height: '240px', background: 'rgba(255,255,255,0.06)' }}>

        {/* Animated progress fill */}
        <motion.div
          style={{
            position:   'absolute',
            top:        0,
            left:       0,
            width:      '1px',
            height:     progressHeight,
            background: 'linear-gradient(to bottom, #2563EB, #06B6D4)',
          }}
        />

        {/* Beat dots */}
        {BEATS.map((beat, i) => {
          const isPassed = i < activeBeat
          const isActive = i === activeBeat

          return (
            <div
              key={beat.label}
              style={{
                position:  'absolute',
                top:       beat.top,
                left:      '-2.5px',
                display:   'flex',
                alignItems:'center',
                transform: beat.top === '100%' ? 'translateY(-100%)' : beat.top === '0%' ? 'translateY(0%)' : 'translateY(-50%)',
              }}
            >
              {/* Label + connector (left of dot, visible only when active) */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display:     'flex',
                    alignItems:  'center',
                    marginRight: '10px',
                  }}
                >
                  <span
                    style={{
                      fontSize:      '10px',
                      letterSpacing: '0.08em',
                      color:         '#94A3B8',
                      textTransform: 'uppercase',
                      whiteSpace:    'nowrap',
                      marginRight:   '8px',
                    }}
                  >
                    {beat.label}
                  </span>
                  <div style={{ width: '20px', height: '1px', background: '#2563EB' }} />
                </motion.div>
              )}

              {/* Dot */}
              <motion.div
                animate={{
                  scale:           isActive ? 1.5 : 1,
                  backgroundColor: isActive ? '#2563EB' : isPassed ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.15)',
                }}
                transition={{ duration: 0.3 }}
                style={{ width: '6px', height: '6px', borderRadius: '50%' }}
              />
            </div>
          )
        })}
      </div>

      {/* Live scroll % */}
      <div style={{ marginTop: '8px', fontSize: '9px', color: '#475569', letterSpacing: '0.05em' }}>
        {scrollPct}%
      </div>
    </div>
  )
}

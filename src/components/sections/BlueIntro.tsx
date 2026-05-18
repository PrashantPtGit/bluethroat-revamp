'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle, ArrowRight } from '@phosphor-icons/react'
import Blue from '@/components/Blue'
import { useBlueState } from '@/hooks/useBlueState'
import { useTypewriter } from '@/hooks/useTypewriter'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const TRAITS = ['⚡ Direct', '🧠 Smart', '🤝 On your side']

const BLUE_DOES = [
  {
    title: 'Audits your workflow',
    sub:   'Finds exactly where time is being lost in your day.',
  },
  {
    title: 'Builds the tools',
    sub:   'A custom platform built for your exact business — not a generic template.',
  },
  {
    title: 'Supports after launch',
    sub:   'Not disappearing after delivery. Ongoing, builder-led support.',
  },
]

const BUBBLE_TEXT =
  "I turn your admin chaos into a system that runs itself. No tech knowledge needed — I handle everything."

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const labelVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.6, delay: 0.1 } },
}

const headlineVariants = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
}

const bubbleVariants = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5 } },
}

const badgeContainerVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.15, delayChildren: 1 } },
}

const badgeVariants = {
  hidden: { opacity: 0, x: -20 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.5 } },
}

const itemsContainerVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1, delayChildren: 1.4 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.5 } },
}

const ctaVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.6, delay: 1.8 } },
}

const blueColVariants = {
  hidden: { opacity: 0, x: 60 },
  show:   { opacity: 1, x: 0,  transition: { duration: 1, delay: 0.4, ease: 'easeOut' as const } },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BlueIntro() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const { mood } = useBlueState()

  // Start typewriter only once section enters view
  const [bubbleText, setBubbleText] = useState('')

  useEffect(() => {
    if (isInView) setBubbleText(BUBBLE_TEXT)
  }, [isInView])

  const { displayed, isComplete } = useTypewriter(bubbleText, 30, 800)

  function scrollToWork() {
    const el = document.getElementById('work')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <motion.section
      ref={sectionRef}
      data-blue-mood="excited"
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      style={{
        background: '#0D0F12',
        padding:    '100px 24px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          className="flex flex-col md:flex-row"
          style={{ gap: '64px', alignItems: 'center' }}
        >

          {/* ── Left column ─────────────────────────────────────────── */}
          <div style={{ flex: '0 1 55%', minWidth: 0 }}>

            {/* Section label */}
            <motion.p
              variants={labelVariants}
              style={{
                fontSize:      '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color:         '#2563EB',
                marginBottom:  '24px',
              }}
            >
              Meet Blue
            </motion.p>

            {/* Headline */}
            <motion.h2
              variants={headlineVariants}
              style={{
                fontSize:     'clamp(36px, 5vw, 56px)',
                fontWeight:   600,
                color:        '#F8FAFC',
                lineHeight:   1.2,
                marginBottom: '24px',
              }}
            >
              Your automation strategist.
            </motion.h2>

            {/* Speech bubble */}
            <motion.div
              variants={bubbleVariants}
              style={{
                background:   'rgba(37,99,235,0.08)',
                border:       '1px solid rgba(37,99,235,0.2)',
                borderRadius: '16px 16px 16px 4px',
                padding:      '20px 24px',
                marginBottom: '32px',
                maxWidth:     '480px',
              }}
            >
              <p
                style={{
                  fontSize:   '16px',
                  color:      '#94A3B8',
                  lineHeight: 1.7,
                  minHeight:  '3em',
                }}
              >
                {displayed}
                {!isComplete && isInView && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                    style={{ display: 'inline-block', marginLeft: '1px' }}
                  >
                    |
                  </motion.span>
                )}
              </p>
            </motion.div>

            {/* Trait badges */}
            <motion.div
              variants={badgeContainerVariants}
              style={{
                display:      'flex',
                flexWrap:     'wrap',
                gap:          '12px',
                marginBottom: '40px',
              }}
            >
              {TRAITS.map((badge) => (
                <motion.span
                  key={badge}
                  variants={badgeVariants}
                  style={{
                    background:   'rgba(255,255,255,0.04)',
                    border:       '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    padding:      '8px 16px',
                    fontSize:     '13px',
                    color:        '#94A3B8',
                    userSelect:   'none',
                  }}
                >
                  {badge}
                </motion.span>
              ))}
            </motion.div>

            {/* What Blue does */}
            <motion.div
              variants={itemsContainerVariants}
              style={{ marginBottom: '40px' }}
            >
              {BLUE_DOES.map(({ title, sub }) => (
                <motion.div
                  key={title}
                  variants={itemVariants}
                  style={{
                    display:      'flex',
                    alignItems:   'flex-start',
                    gap:          '12px',
                    marginBottom: '16px',
                  }}
                >
                  <CheckCircle
                    size={20}
                    color="#2563EB"
                    weight="fill"
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  />
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 500, color: '#F8FAFC' }}>
                      {title}
                    </p>
                    <p style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
                      {sub}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={ctaVariants}>
              <motion.button
                onClick={scrollToWork}
                whileHover={{ color: '#60A5FA', x: 4 }}
                transition={{ type: 'tween', duration: 0.2 }}
                style={{
                  display:    'flex',
                  alignItems: 'center',
                  gap:        '6px',
                  fontSize:   '14px',
                  color:      '#2563EB',
                  background: 'transparent',
                  border:     'none',
                  cursor:     'pointer',
                  padding:    0,
                }}
              >
                See What Blue Has Built
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>

          </div>

          {/* ── Right column ─────────────────────────────────────────── */}
          <motion.div
            variants={blueColVariants}
            style={{
              flex:           '0 1 40%',
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '16px',
            }}
          >
            <Blue size={340} mood={mood} />

            <motion.p
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                fontSize:      '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color:         '#2563EB',
              }}
            >
              BLUE · ONLINE
            </motion.p>
          </motion.div>

        </div>
      </div>
    </motion.section>
  )
}

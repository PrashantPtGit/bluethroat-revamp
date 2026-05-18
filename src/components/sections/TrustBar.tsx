'use client'

import { Fragment, useRef } from 'react'
import type { CSSProperties } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const LOGOS = ['Codemagic', 'Mintlify', 'Dyte', 'Tolgee', 'Bloop']

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const labelVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.6 } },
}

const logoContainerVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
}

const logoItemVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5 } },
}

const pivotVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.8 } },
}

const pillsContainerVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1, delayChildren: 0.6 } },
}

const pillVariants = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const pillStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '20px',
  padding: '10px 20px',
}

const numberStyle: CSSProperties = {
  fontSize: '15px',
  fontWeight: 600,
  color: '#F8FAFC',
}

const labelStyle: CSSProperties = {
  fontSize: '13px',
  color: '#475569',
  marginLeft: '6px',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TrustBar() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const stat1 = useCountUp(500, 1800)
  const stat2 = useCountUp(6, 1500)

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      style={{
        background: '#0D0F12',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '64px 24px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Row 1: Founder credibility label ─────────────────────── */}
        <motion.p
          variants={labelVariants}
          style={{
            textAlign: 'center',
            fontSize: '12px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#475569',
            marginBottom: '24px',
          }}
        >
          The founder has shipped for
        </motion.p>

        {/* ── Logo strip ───────────────────────────────────────────── */}
        <motion.div
          variants={logoContainerVariants}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '40px',
          }}
        >
          {LOGOS.map((name, i) => (
            <Fragment key={i}>
              <motion.span
                variants={logoItemVariants}
                style={{
                  fontWeight: 600,
                  fontSize: '15px',
                  color: '#64748B',
                  cursor: 'default',
                  userSelect: 'none',
                  transition: 'color 250ms',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#F8FAFC' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B' }}
              >
                {name}
              </motion.span>

              {i < LOGOS.length - 1 && (
                <span
                  aria-hidden
                  style={{
                    color: '#2563EB',
                    fontSize: '8px',
                    opacity: 0.4,
                    userSelect: 'none',
                  }}
                >
                  ·
                </span>
              )}
            </Fragment>
          ))}
        </motion.div>

        {/* ── Vertical divider ─────────────────────────────────────── */}
        <div
          style={{
            width: '1px',
            height: '48px',
            background: 'rgba(255,255,255,0.08)',
            margin: '48px auto',
          }}
        />

        {/* ── Row 2: Pivot line ────────────────────────────────────── */}
        <motion.p
          variants={pivotVariants}
          style={{
            textAlign: 'center',
            fontSize: '22px',
            fontWeight: 500,
            color: '#F8FAFC',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: 1.5,
          }}
        >
          Now building the same quality — for{' '}
          <span style={{ color: '#2563EB' }}>your</span> business.
        </motion.p>

        {/* ── Row 3: Stat pills ────────────────────────────────────── */}
        <motion.div
          variants={pillsContainerVariants}
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '40px',
          }}
        >
          <motion.div ref={stat1.ref} variants={pillVariants} style={pillStyle}>
            <span style={numberStyle}>{stat1.count}+</span>
            <span style={labelStyle}>professionals mentored</span>
          </motion.div>

          <motion.div ref={stat2.ref} variants={pillVariants} style={pillStyle}>
            <span style={numberStyle}>{stat2.count}</span>
            <span style={labelStyle}>countries</span>
          </motion.div>

          <motion.div variants={pillVariants} style={pillStyle}>
            <span style={{ ...numberStyle, fontSize: '14px' }}>Irish-registered agency</span>
          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  )
}

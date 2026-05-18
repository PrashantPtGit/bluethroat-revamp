'use client'

import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { motion, useInView } from 'framer-motion'
import { ChatCircleDots, Receipt, CalendarX, ArrowDown } from '@phosphor-icons/react'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const CARDS = [
  {
    hud:   'PAIN // 001',
    Icon:  ChatCircleDots,
    title: 'WhatsApp booking chaos',
    desc:  'Clients messaging at midnight. Double bookings. Lost requests buried in chats. Your phone never stops.',
    readout: 'MSGS_UNREAD: 47 · BOOKINGS_LOST: ~3/week',
    delay:  0.6,
    shakeDelay: 0.6,
  },
  {
    hud:   'PAIN // 002',
    Icon:  Receipt,
    title: 'Manual invoicing every week',
    desc:  'Chasing payments. Sending reminders. Updating spreadsheets. Hours of admin that a system does in seconds.',
    readout: 'INVOICES_PENDING: 12 · HRS_WASTED: 4.5/week',
    delay:  0.8,
    shakeDelay: 0.8,
  },
  {
    hud:   'PAIN // 003',
    Icon:  CalendarX,
    title: 'No-shows killing revenue',
    desc:  'Clients forget. You lose the slot. No reminder system. Every no-show is money you\'ll never get back.',
    readout: 'NO_SHOWS: ~5/month · REVENUE_LOST: €400+',
    delay:  1.0,
    shakeDelay: 1.0,
  },
]

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const sectionLabelVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.6 } },
}

const headlineVariants = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 } },
}

const subVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.8, delay: 0.3 } },
}

const pivotVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4 } },
}

// Card entry + x-shake combined via keyframes
function makeCardVariants(delay: number) {
  return {
    hidden: { opacity: 0, y: 40, x: 0 },
    show: {
      opacity: 1,
      y: 0,
      x: [0, -6, 6, -4, 4, 0],
      transition: {
        opacity: { duration: 0.5, delay },
        y:       { duration: 0.5, delay },
        x:       { duration: 0.5, delay: delay + 0.05, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
      },
    },
  }
}

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const cardBase: CSSProperties = {
  background:   '#0D1117',
  border:       '1px solid rgba(255,255,255,0.06)',
  borderRadius: '16px',
  padding:      '28px 24px',
  position:     'relative',
  overflow:     'hidden',
  cursor:       'default',
}

// ---------------------------------------------------------------------------
// Sub-component — single pain card
// ---------------------------------------------------------------------------

function PainCard({
  hud, Icon, title, desc, readout, delay,
}: (typeof CARDS)[number]) {
  const cardVariants = makeCardVariants(delay)

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        scale: 1.02,
        borderColor: 'rgba(37,99,235,0.3)',
        backgroundColor: '#0F1420',
      }}
      transition={{ type: 'tween', duration: 0.3 }}
      style={cardBase}
    >
      {/* Top accent gradient line */}
      <div
        aria-hidden
        style={{
          position:   'absolute',
          top:        0,
          left:       0,
          right:      0,
          height:     '1px',
          background: 'linear-gradient(90deg, transparent, #2563EB, transparent)',
        }}
      />

      {/* HUD label */}
      <p
        style={{
          fontFamily:    'monospace',
          fontSize:      '10px',
          letterSpacing: '0.1em',
          color:         '#2563EB',
          opacity:       0.7,
          marginBottom:  '16px',
        }}
      >
        {hud}
      </p>

      {/* Icon */}
      <div style={{ marginBottom: '16px', opacity: 0.8 }}>
        <Icon size={36} color="#2563EB" />
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize:     '18px',
          fontWeight:   600,
          color:        '#F8FAFC',
          marginBottom: '8px',
          lineHeight:   1.3,
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize:   '14px',
          color:      '#475569',
          lineHeight: 1.6,
        }}
      >
        {desc}
      </p>

      {/* HUD readout */}
      <p
        style={{
          fontFamily:    'monospace',
          fontSize:      '11px',
          color:         '#2563EB',
          opacity:       0.6,
          marginTop:     '20px',
          letterSpacing: '0.02em',
        }}
      >
        {readout}
      </p>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ProblemBlock() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={sectionRef}
      data-blue-mood="troubled"
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      style={{
        background: '#0D0F12',
        padding:    '80px 24px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Section label ────────────────────────────────────────── */}
        <motion.p
          variants={sectionLabelVariants}
          style={{
            textAlign:     'center',
            fontSize:      '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color:         '#2563EB',
            marginBottom:  '16px',
          }}
        >
          The Problem
        </motion.p>

        {/* ── Headline ─────────────────────────────────────────────── */}
        <motion.div
          variants={headlineVariants}
          style={{ textAlign: 'center', marginBottom: '16px' }}
        >
          <h2
            style={{
              fontSize:   'clamp(36px, 5vw, 60px)',
              fontWeight: 600,
              color:      '#F8FAFC',
              lineHeight: 1.2,
              maxWidth:   '700px',
              margin:     '0 auto',
            }}
          >
            You&apos;re losing 3 hours
            <br />
            every day to admin.
          </h2>
        </motion.div>

        {/* ── Subheadline ──────────────────────────────────────────── */}
        <motion.p
          variants={subVariants}
          style={{
            textAlign:    'center',
            fontSize:     '17px',
            color:        '#475569',
            marginBottom: '64px',
          }}
        >
          Here&apos;s what that looks like — and what Blue fixes.
        </motion.p>

        {/* ── Pain cards grid ──────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: '20px' }}
        >
          {CARDS.map((card) => (
            <PainCard key={card.hud} {...card} />
          ))}
        </div>

        {/* ── Bottom pivot ─────────────────────────────────────────── */}
        <motion.div
          variants={pivotVariants}
          style={{
            textAlign: 'center',
            marginTop: '64px',
          }}
        >
          <p
            style={{
              fontSize:   'clamp(24px, 3.5vw, 40px)',
              fontWeight: 500,
              color:      '#F8FAFC',
              maxWidth:   '600px',
              margin:     '0 auto',
              lineHeight: 1.35,
            }}
          >
            What if those{' '}
            <span style={{ color: '#2563EB' }}>3 hours</span>{' '}
            were yours back?
          </p>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              display:        'flex',
              justifyContent: 'center',
              marginTop:      '16px',
            }}
          >
            <ArrowDown size={20} color="#2563EB" />
          </motion.div>
        </motion.div>

      </div>
    </motion.section>
  )
}

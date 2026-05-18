'use client'

import { Fragment, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { useCountUp } from '@/hooks/useCountUp'
import type { Lang } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Copy
// ---------------------------------------------------------------------------

type TrustCopy = { label: string; students: string; countries: string }

const TRUST_COPY: Record<Lang, TrustCopy> = {
  en: {
    label: 'Trusted by YC-backed companies',
    students: 'students mentored',
    countries: 'countries',
  },
  ga: {
    label: 'Muinínithe ag comhlachtaí YC',
    students: 'mac léinn meantóireachta',
    countries: 'tíortha',
  },
  fr: {
    label: 'Approuvé par des entreprises YC',
    students: 'étudiants mentorés',
    countries: 'pays',
  },
  es: {
    label: 'Confiado por empresas respaldadas por YC',
    students: 'estudiantes mentorizados',
    countries: 'países',
  },
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const LOGOS = [
  { name: 'Sarg.io',    fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', fontStyle: 'normal'  as const },
  { name: 'Codemagic',  fontWeight: 600, fontSize: 15, letterSpacing: '0',       fontStyle: 'normal'  as const },
  { name: 'Mintlify',   fontWeight: 700, fontSize: 15, letterSpacing: '0',       fontStyle: 'italic'  as const },
  { name: 'Tolgee',     fontWeight: 600, fontSize: 15, letterSpacing: '0',       fontStyle: 'normal'  as const },
  { name: 'Dyte',       fontWeight: 700, fontSize: 16, letterSpacing: '0.05em',  fontStyle: 'normal'  as const },
  { name: 'Bloop',      fontWeight: 600, fontSize: 15, letterSpacing: '0',       fontStyle: 'normal'  as const },
]

const BADGES = [
  '🇮🇪 Irish-registered',
  '⚡ Builder-led',
  '🏆 YC-adjacent clients',
]

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const labelVariants = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.6 } },
}

const logoContainerVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
}

const logoItemVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5 } },
}

const badgeContainerVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.15, delayChildren: 0.5 } },
}

const badgeItemVariants = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.5 } },
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Divider() {
  return (
    <div
      style={{
        height: '1px',
        background: 'rgba(255,255,255,0.06)',
        margin: '40px 0',
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function TrustBar() {
  const { lang } = useLanguage()
  const copy = TRUST_COPY[lang]

  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const stat1 = useCountUp(500, 2000, 0)
  const stat2 = useCountUp(6, 1500, 200)

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      style={{
        background: '#0D0F12',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 24px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Row 1: Trust label ───────────────────────────────────────── */}
        <motion.p
          variants={labelVariants}
          style={{
            textAlign: 'center',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#475569',
            marginBottom: '32px',
          }}
        >
          {copy.label}
        </motion.p>

        {/* ── Row 2: Logo strip ────────────────────────────────────────── */}
        <motion.div
          variants={logoContainerVariants}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '48px',
          }}
        >
          {LOGOS.map((logo, i) => (
            <Fragment key={i}>
              <motion.span
                variants={logoItemVariants}
                style={{
                  fontWeight: logo.fontWeight,
                  fontSize: `${logo.fontSize}px`,
                  letterSpacing: logo.letterSpacing,
                  fontStyle: logo.fontStyle,
                  color: '#94A3B8',
                  cursor: 'default',
                  userSelect: 'none',
                  transition: 'color 200ms',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#F8FAFC' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8' }}
              >
                {logo.name}
              </motion.span>

              {i < LOGOS.length - 1 && (
                <span
                  aria-hidden
                  style={{
                    color: '#2563EB',
                    fontSize: '8px',
                    opacity: 0.5,
                    userSelect: 'none',
                  }}
                >
                  ·
                </span>
              )}
            </Fragment>
          ))}
        </motion.div>

        <Divider />

        {/* ── Row 3: Stats ─────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '64px',
          }}
        >
          {/* Stat 1 — students */}
          <div style={{ textAlign: 'center' }}>
            <div
              ref={stat1.ref}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '40px', fontWeight: 600, color: '#F8FAFC', lineHeight: 1 }}>
                {stat1.count}
              </span>
              <span style={{ fontSize: '40px', fontWeight: 600, color: '#2563EB', lineHeight: 1 }}>
                +
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
              {copy.students}
            </p>
          </div>

          {/* Stat 2 — countries */}
          <div style={{ textAlign: 'center' }}>
            <div
              ref={stat2.ref}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '40px', fontWeight: 600, color: '#F8FAFC', lineHeight: 1 }}>
                {stat2.count}
              </span>
              <span style={{ fontSize: '40px', fontWeight: 600, color: '#2563EB', lineHeight: 1 }}>
                +
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
              {copy.countries}
            </p>
          </div>

          {/* Stat 3 — Irish-registered (static) */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '0',
              }}
            >
              <span style={{ fontSize: '40px', fontWeight: 600, color: '#F8FAFC', lineHeight: 1 }}>
                Irish
              </span>
              <span style={{ fontSize: '40px', fontWeight: 600, color: '#2563EB', lineHeight: 1 }}>
                -registered
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
              agency · .ie domain
            </p>
          </div>
        </div>

        <Divider />

        {/* ── Row 4: Trust badges ──────────────────────────────────────── */}
        <motion.div
          variants={badgeContainerVariants}
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {BADGES.map((badge, i) => (
            <motion.div
              key={i}
              variants={badgeItemVariants}
              whileHover={{ backgroundColor: 'rgba(37,99,235,0.15)', color: '#F8FAFC' }}
              transition={{ duration: 0.2 }}
              style={{
                backgroundColor: 'rgba(37,99,235,0.08)',
                border: '1px solid rgba(37,99,235,0.2)',
                borderRadius: '20px',
                padding: '8px 16px',
                fontSize: '12px',
                color: '#94A3B8',
                cursor: 'default',
                userSelect: 'none',
              }}
            >
              {badge}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </motion.section>
  )
}

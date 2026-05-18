'use client'

import { motion } from 'framer-motion'
import { WhatsappLogo, ArrowDown } from '@phosphor-icons/react'
import { useLanguage } from '@/context/LanguageContext'
import { useTypewriter } from '@/hooks/useTypewriter'
import type { Lang } from '@/lib/i18n'
import Blue from '@/components/Blue'

type HeroCopy = {
  boot: string
  headline: string
  headlineAccent: string
  sub: string
  cta1: string
  cta2: string
}

const HERO_COPY: Record<Lang, HeroCopy> = {
  en: {
    boot: 'BLUE · SYSTEM ONLINE // Connecting to your business...',
    headline: 'Meet Blue —',
    headlineAccent: 'saves you 2–4 hours every day',
    sub: 'AI automation for clinics, coaches, gym owners & consultants in Ireland',
    cta1: 'WhatsApp Blue',
    cta2: 'See What Blue Builds',
  },
  ga: {
    boot: 'BLUE · CÓRAS AR LÍNE // Ag nascadh le do ghnó...',
    headline: 'Cas le Blue —',
    headlineAccent: 'Sábhálann sé 2–4 uair an chloig gach lá',
    sub: 'Uathoibriú AI do chlinicí, cóitseálaithe, úinéirí gym & comhairleoirí in Éirinn',
    cta1: 'WhatsApp Blue',
    cta2: 'Féach ar Obair Blue',
  },
  fr: {
    boot: 'BLUE · SYSTÈME EN LIGNE // Connexion à votre entreprise...',
    headline: 'Rencontrez Blue —',
    headlineAccent: 'vous économise 2 à 4 heures par jour',
    sub: "Automatisation IA pour cliniques, coachs, propriétaires de salles & consultants en Irlande",
    cta1: 'WhatsApp Blue',
    cta2: 'Voir les réalisations de Blue',
  },
  es: {
    boot: 'BLUE · SISTEMA EN LÍNEA // Conectando con tu negocio...',
    headline: 'Conoce a Blue —',
    headlineAccent: 'te ahorra 2–4 horas cada día',
    sub: 'Automatización IA para clínicas, coaches, dueños de gimnasios y consultores en Irlanda',
    cta1: 'WhatsApp Blue',
    cta2: 'Ver lo que Blue crea',
  },
}

const wordVariants = {
  hidden: { y: 60, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

function AnimatedWords({
  text,
  color,
  delayChildren,
}: {
  text: string
  color: string
  delayChildren: number
}) {
  const words = text.split(' ')

  return (
    <motion.div
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren } },
      }}
      initial="hidden"
      animate="show"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: '0.28em',
        color,
        fontSize: 'clamp(42px, 6vw, 72px)',
        fontWeight: 600,
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
      }}
    >
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden' }}>
          <motion.span variants={wordVariants} style={{ display: 'inline-block' }}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  )
}

export default function Hero() {
  const { lang } = useLanguage()
  const copy = HERO_COPY[lang]
  const { displayed, isComplete } = useTypewriter(copy.boot, 40, 300)

  function scrollToWork() {
    const el = document.getElementById('work')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#0D0F12',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Radial gradient background glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 800px 600px at 50% 40%, rgba(37,99,235,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Main content column */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '800px',
          width: '100%',
          padding: '96px 24px 80px',
        }}
      >
        {/* Boot sequence text */}
        <div
          className="text-center md:text-left"
          style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: '0.15em',
            color: '#2563EB',
            textTransform: 'uppercase',
            marginBottom: '28px',
            minHeight: '16px',
          }}
        >
          {displayed}
          {!isComplete && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
              style={{ display: 'inline-block', marginLeft: '1px' }}
            >
              |
            </motion.span>
          )}
        </div>

        {/* Headline line 1 */}
        <div style={{ marginBottom: '4px' }}>
          <AnimatedWords text={copy.headline} color="#F8FAFC" delayChildren={1.8} />
        </div>

        {/* Headline line 2 — accent */}
        <div style={{ marginBottom: '36px' }}>
          <AnimatedWords text={copy.headlineAccent} color="#2563EB" delayChildren={2.4} />
        </div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 0.8 }}
          style={{
            fontSize: '18px',
            color: '#94A3B8',
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: '580px',
            margin: '0 0 40px',
          }}
        >
          {copy.sub}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row"
          style={{ gap: '12px' }}
        >
          {/* Primary — WhatsApp */}
          <motion.a
            href="https://wa.me/919336731183"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, backgroundColor: '#1D4ED8' }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="flex items-center justify-center sm:justify-start"
            style={{
              gap: '8px',
              backgroundColor: '#2563EB',
              color: '#ffffff',
              borderRadius: '10px',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            <WhatsappLogo size={18} weight="fill" />
            {copy.cta1}
          </motion.a>

          {/* Secondary — See what Blue builds */}
          <motion.button
            onClick={scrollToWork}
            whileHover={{
              scale: 1.02,
              borderColor: 'rgba(255,255,255,0.4)',
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="flex items-center justify-center sm:justify-start"
            style={{
              gap: '8px',
              background: 'transparent',
              color: '#F8FAFC',
              borderRadius: '10px',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 500,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(255,255,255,0.15)',
              cursor: 'pointer',
            }}
          >
            {copy.cta2}
            <ArrowDown size={18} />
          </motion.button>
        </motion.div>
      </div>

      {/* Blue character placeholder — desktop only */}
      <div
        className="hidden md:block"
        style={{
          position: 'absolute',
          right: '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Blue size={260} />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5, duration: 0.8 }}
        onClick={scrollToWork}
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            color: '#475569',
            fontSize: '12px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            userSelect: 'none',
          }}
        >
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} color="#475569" />
        </motion.div>
      </motion.div>
    </section>
  )
}

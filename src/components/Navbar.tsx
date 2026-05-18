'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValueEvent,
} from 'framer-motion'
import { List, X } from '@phosphor-icons/react'
import { useT } from '@/lib/i18n'
import { useLanguage } from '@/context/LanguageContext'
import type { Lang, TranslationKey } from '@/lib/i18n'

type LangConfig = {
  code: Lang
  flag: string
  labelKey: TranslationKey
}

const LANGS: LangConfig[] = [
  { code: 'en', flag: '🇮🇪', labelKey: 'lang.en' },
  { code: 'ga', flag: '🇮🇪', labelKey: 'lang.ga' },
  { code: 'fr', flag: '🇫🇷', labelKey: 'lang.fr' },
  { code: 'es', flag: '🇪🇸', labelKey: 'lang.es' },
]

const NAV_LINKS: { href: string; key: TranslationKey }[] = [
  { href: '/', key: 'nav.home' },
  { href: '/work', key: 'nav.projects' },
  { href: '/about', key: 'nav.about' },
  { href: '/contact', key: 'nav.contact' },
]

export default function Navbar() {
  const t = useT()
  const { lang, setLang } = useLanguage()
  const [langOpen, setLangOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 10)
  })

  const headerBg = useTransform(
    scrollY,
    [0, 60],
    ['rgba(13,15,18,0)', 'rgba(13,15,18,0.92)']
  )
  const blurPx = useTransform(scrollY, [0, 60], [0, 12])
  const backdropFilter = useMotionTemplate`blur(${blurPx}px)`
  const borderOpacity = useTransform(scrollY, [0, 60], [0, 0.08])
  const borderColor = useMotionTemplate`rgba(255,255,255,${borderOpacity})`

  const currentLang = LANGS.find((l) => l.code === lang) ?? LANGS[0]

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          background: headerBg,
          backdropFilter,
          borderBottom: scrolled ? `1px solid rgba(255,255,255,0.08)` : '1px solid transparent',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: '64px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            height: '100%',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontWeight: 600,
              color: '#F8FAFC',
              textDecoration: 'none',
              fontSize: '16px',
              letterSpacing: '-0.01em',
            }}
          >
            Bluethroat
            <span style={{ color: '#2563EB' }}>.</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex" style={{ gap: '32px', alignItems: 'center' }}>
            {NAV_LINKS.map(({ href, key }) => (
              <NavLink key={key} href={href}>
                {t(key)}
              </NavLink>
            ))}
          </nav>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Language switcher */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setLangOpen((v) => !v)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#94A3B8',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                }}
              >
                <span>{currentLang.flag}</span>
                <span>{lang.toUpperCase()}</span>
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      background: '#1A1D23',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      minWidth: '150px',
                      overflow: 'hidden',
                      zIndex: 100,
                    }}
                  >
                    {LANGS.map(({ code, flag, labelKey }) => (
                      <button
                        key={code}
                        onClick={() => {
                          setLang(code)
                          setLangOpen(false)
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          padding: '10px 14px',
                          textAlign: 'left',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '13px',
                          color: lang === code ? '#F8FAFC' : '#94A3B8',
                          fontWeight: lang === code ? 500 : 400,
                        }}
                      >
                        <span>{flag}</span>
                        <span>{t(labelKey)}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* WhatsApp CTA — hidden on very small screens */}
            <motion.a
              href="https://wa.me/919336731183"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, backgroundColor: '#1D4ED8' }}
              transition={{ duration: 0.15 }}
              className="hidden sm:flex"
              style={{
                alignItems: 'center',
                background: '#2563EB',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {t('nav.cta')}
            </motion.a>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex md:hidden"
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                color: '#F8FAFC',
                cursor: 'pointer',
                padding: '4px',
              }}
              aria-label="Open menu"
            >
              <List size={24} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: '#0D0F12',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Mobile header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                height: '64px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span style={{ fontWeight: 600, color: '#F8FAFC', fontSize: '16px' }}>
                Bluethroat<span style={{ color: '#2563EB' }}>.</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#F8FAFC',
                  cursor: 'pointer',
                  padding: '4px',
                }}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile nav links */}
            <nav
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '40px 24px',
                gap: '24px',
                flex: 1,
              }}
            >
              {NAV_LINKS.map(({ href, key }) => (
                <Link
                  key={key}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: '28px',
                    fontWeight: 500,
                    color: '#F8FAFC',
                    textDecoration: 'none',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {t(key)}
                </Link>
              ))}
            </nav>

            {/* Mobile CTA */}
            <div style={{ padding: '24px' }}>
              <a
                href="https://wa.me/919336731183"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#2563EB',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '14px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                {t('nav.cta')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        fontSize: '14px',
        color: '#94A3B8',
        textDecoration: 'none',
        transition: 'color 200ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#F8FAFC'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#94A3B8'
      }}
    >
      {children}
    </Link>
  )
}

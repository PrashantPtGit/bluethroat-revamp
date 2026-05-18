'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { translations, type Lang, type TranslationKey } from '@/lib/i18n'

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

const VALID_LANGS: Lang[] = ['en', 'ga', 'fr', 'es']

export const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const stored = localStorage.getItem('bt-lang')
    if (stored && VALID_LANGS.includes(stored as Lang)) {
      setLangState(stored as Lang)
    }
  }, [])

  function setLang(newLang: Lang) {
    setLangState(newLang)
    localStorage.setItem('bt-lang', newLang)
  }

  function t(key: TranslationKey): string {
    return translations[lang][key]
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

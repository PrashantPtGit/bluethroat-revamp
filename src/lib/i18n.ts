import { useContext } from 'react'
import { LanguageContext } from '@/context/LanguageContext'

export type Lang = 'en' | 'ga' | 'fr' | 'es'

export type TranslationKey =
  | 'nav.home'
  | 'nav.projects'
  | 'nav.about'
  | 'nav.contact'
  | 'nav.cta'
  | 'site.tagline'
  | 'lang.en'
  | 'lang.ga'
  | 'lang.fr'
  | 'lang.es'

export type Translations = Record<TranslationKey, string>
export type LanguageMap = Record<Lang, Translations>

export const translations: LanguageMap = {
  en: {
    'nav.home': 'Home',
    'nav.projects': 'Work',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cta': 'WhatsApp Blue',
    'site.tagline': 'AI Automation for Professionals · Ireland',
    'lang.en': 'English',
    'lang.ga': 'Gaeilge',
    'lang.fr': 'Français',
    'lang.es': 'Español',
  },
  ga: {
    'nav.home': 'Baile',
    'nav.projects': 'Obair',
    'nav.about': 'Fúm',
    'nav.contact': 'Teagmháil',
    'nav.cta': 'WhatsApp Blue',
    'site.tagline': 'Uathoibrithe AI do Ghairmithe · Éire',
    'lang.en': 'English',
    'lang.ga': 'Gaeilge',
    'lang.fr': 'Français',
    'lang.es': 'Español',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.projects': 'Travaux',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.cta': 'WhatsApp Blue',
    'site.tagline': 'Automatisation IA pour Professionnels · Irlande',
    'lang.en': 'English',
    'lang.ga': 'Gaeilge',
    'lang.fr': 'Français',
    'lang.es': 'Español',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.projects': 'Trabajos',
    'nav.about': 'Sobre mí',
    'nav.contact': 'Contacto',
    'nav.cta': 'WhatsApp Blue',
    'site.tagline': 'Automatización IA para Profesionales · Irlanda',
    'lang.en': 'English',
    'lang.ga': 'Gaeilge',
    'lang.fr': 'Français',
    'lang.es': 'Español',
  },
}

export function useT(): (key: TranslationKey) => string {
  const { t } = useContext(LanguageContext)
  return t
}

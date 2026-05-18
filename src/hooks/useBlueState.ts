'use client'

import { useState, useEffect, useRef } from 'react'

export type BlueMode =
  | 'idle' | 'curious' | 'troubled' | 'confident' | 'excited' | 'dancing'
  | 'happy' | 'leading' | 'pointing' | 'sleepy'

const ATTR_MAP: Record<string, BlueMode> = {
  curious:   'curious',
  troubled:  'troubled',
  confident: 'confident',
  excited:   'excited',
}

export function useBlueState(): { mood: BlueMode; isDancing: boolean } {
  const [mood, setMood]           = useState<BlueMode>('idle')
  const [isDancing, setIsDancing] = useState(false)

  const currentMoodRef  = useRef<BlueMode>('idle')
  const isDancingRef    = useRef(false)
  const danceTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMountedRef    = useRef(false)

  // Track which section is visible via IntersectionObserver
  useEffect(() => {
    isMountedRef.current = true
    const sections = document.querySelectorAll<HTMLElement>('[data-blue-mood]')
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section among the changed entries
        let best: { ratio: number; mood: BlueMode } | null = null
        entries.forEach(entry => {
          const attr      = entry.target.getAttribute('data-blue-mood') ?? ''
          const entryMood = ATTR_MAP[attr] ?? 'idle'
          if (entry.isIntersecting && (!best || entry.intersectionRatio > best.ratio)) {
            best = { ratio: entry.intersectionRatio, mood: entryMood }
          }
        })

        if (best && !isDancingRef.current) {
          const bm = (best as { ratio: number; mood: BlueMode }).mood
          currentMoodRef.current = bm
          setMood(bm)
        }
      },
      { threshold: [0, 0.2, 0.4, 0.6] }
    )

    sections.forEach(s => observer.observe(s))
    return () => {
      isMountedRef.current = false
      observer.disconnect()
    }
  }, [])

  // Autonomous dance timer — fires every 8–15 seconds
  useEffect(() => {
    const scheduleDance = () => {
      const delay = 8_000 + Math.random() * 7_000
      danceTimerRef.current = setTimeout(() => {
        if (!isMountedRef.current) return
        isDancingRef.current = true
        setIsDancing(true)
        setMood('dancing')

        setTimeout(() => {
          if (!isMountedRef.current) return
          isDancingRef.current = false
          setIsDancing(false)
          setMood(currentMoodRef.current)
          scheduleDance()
        }, 2_000)
      }, delay)
    }

    scheduleDance()
    return () => {
      if (danceTimerRef.current) clearTimeout(danceTimerRef.current)
    }
  }, [])

  return { mood, isDancing }
}

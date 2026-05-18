import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

export function useCountUp(end: number, duration = 2000, startDelay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    let rafId: number

    const timeoutId = setTimeout(() => {
      rafId = requestAnimationFrame(function step(timestamp: number) {
        if (startTime === null) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        // ease-out cubic for a natural deceleration
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(eased * end))
        if (progress < 1) {
          rafId = requestAnimationFrame(step)
        } else {
          setCount(end)
        }
      })
    }, startDelay)

    return () => {
      clearTimeout(timeoutId)
      cancelAnimationFrame(rafId)
    }
  }, [isInView, end, duration, startDelay])

  return { count, ref }
}

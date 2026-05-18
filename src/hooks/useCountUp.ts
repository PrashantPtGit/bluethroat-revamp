import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

export function useCountUp(end: number, duration = 1800) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    let rafId: number

    rafId = requestAnimationFrame(function step(timestamp: number) {
      if (startTime === null) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      } else {
        setCount(end)
      }
    })

    return () => cancelAnimationFrame(rafId)
  }, [isInView, end, duration])

  return { count, ref }
}

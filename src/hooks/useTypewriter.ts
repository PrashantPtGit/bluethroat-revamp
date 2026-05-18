import { useState, useEffect } from 'react'

export function useTypewriter(text: string, speed = 40, startDelay = 300) {
  const [displayed, setDisplayed] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setIsComplete(false)
    let index = 0
    let intervalId: ReturnType<typeof setInterval> | null = null

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        index += 1
        setDisplayed(text.slice(0, index))
        if (index >= text.length) {
          if (intervalId !== null) clearInterval(intervalId)
          intervalId = null
          setIsComplete(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(timeoutId)
      if (intervalId !== null) clearInterval(intervalId)
    }
  }, [text, speed, startDelay])

  return { displayed, isComplete }
}

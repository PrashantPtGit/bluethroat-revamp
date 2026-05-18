'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseOpacity: number
  opacity: number
  color: string
  twinkle: number
}

export default function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    function resize() {
      if (!canvas) return
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Build 80 particles
    const particles: Particle[] = Array.from({ length: 80 }, () => ({
      x:           Math.random() * canvas.width,
      y:           Math.random() * canvas.height,
      vx:          (Math.random() - 0.5) * 0.6,
      vy:          -(Math.random() * 0.4 + 0.1),
      radius:      Math.random() * 1.5 + 0.5,
      baseOpacity: Math.random() * 0.3 + 0.1,
      opacity:     0,
      color:       Math.random() > 0.5 ? '#2563EB' : '#06B6D4',
      twinkle:     Math.random() * Math.PI * 2,
    }))

    function drawBlob(cx: number, cy: number, r: number, rgba: string) {
      if (!ctx || !canvas) return
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      grad.addColorStop(0, rgba)
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()
    }

    function loop(time: number) {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Slow gradient blobs
      const b1x = canvas.width  * 0.2  + Math.sin(time * 0.0003)          * canvas.width  * 0.15
      const b1y = canvas.height * 0.3  + Math.cos(time * 0.0002)          * canvas.height * 0.2
      const b2x = canvas.width  * 0.8  + Math.sin(time * 0.0002 + 2)      * canvas.width  * 0.12
      const b2y = canvas.height * 0.6  + Math.cos(time * 0.0003 + 1)      * canvas.height * 0.15
      const b3x = canvas.width  * 0.5  + Math.sin(time * 0.00025 + 4)     * canvas.width  * 0.2
      const b3y = canvas.height * 0.8  + Math.cos(time * 0.00015)         * canvas.height * 0.1

      drawBlob(b1x, b1y, 300, 'rgba(37,99,235,0.025)')
      drawBlob(b2x, b2y, 250, 'rgba(6,182,212,0.02)')
      drawBlob(b3x, b3y, 200, 'rgba(37,99,235,0.015)')

      // Update + draw particles
      for (const p of particles) {
        p.x       += p.vx
        p.y       += p.vy
        p.twinkle += 0.02
        p.opacity  = p.baseOpacity * (0.5 + 0.5 * Math.sin(p.twinkle))

        // Wrap around edges
        if (p.y < -10)                p.y = canvas.height + 10, p.x = Math.random() * canvas.width
        if (p.x < -10)                p.x = canvas.width  + 10
        if (p.x > canvas.width  + 10) p.x = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x
          const dy   = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = '#2563EB'
            ctx.globalAlpha = (1 - dist / 120) * 0.08
            ctx.lineWidth   = 0.5
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      animationId = requestAnimationFrame(loop)
    }

    animationId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '100%',
        height:        '100%',
        zIndex:        0,
        pointerEvents: 'none',
      }}
      aria-hidden
    />
  )
}

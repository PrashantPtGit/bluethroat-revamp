'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  opacity: number
  twinkle: number
  color: string
}

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  length: number
  opacity: number
  life: number
  maxLife: number
  width: number
}

export default function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const _canvas = canvasRef.current
    if (!_canvas) return
    const _ctx = _canvas.getContext('2d')
    if (!_ctx) return

    // Explicit typed aliases so inner closures see non-null types
    const cv: HTMLCanvasElement        = _canvas
    const ctx: CanvasRenderingContext2D = _ctx

    let animId = 0
    let W = 0, H = 0
    let layer1: Star[] = []
    let layer2: Star[] = []
    let layer3: Star[] = []
    let shootingStars: ShootingStar[] = []
    let lastShootingStarTime = 0
    let nextShootingStarDelay = 3000 + Math.random() * 5000

    function rand(min: number, max: number) {
      return min + Math.random() * (max - min)
    }

    function init() {
      W = cv.width  = window.innerWidth
      H = cv.height = window.innerHeight

      layer1 = Array.from({ length: 200 }, () => ({
        x: rand(0, W), y: rand(0, H),
        r: rand(0.3, 0.8), opacity: rand(0.2, 0.5),
        twinkle: rand(0, Math.PI * 2), color: '#ffffff',
      }))

      layer2 = Array.from({ length: 120 }, () => ({
        x: rand(0, W), y: rand(0, H),
        r: rand(0.6, 1.4), opacity: rand(0.4, 0.8),
        twinkle: rand(0, Math.PI * 2),
        color: Math.random() > 0.5 ? '#ffffff' : '#E0F2FE',
      }))

      const brightColors = ['#ffffff', '#BFDBFE', '#93C5FD']
      layer3 = Array.from({ length: 40 }, () => ({
        x: rand(0, W), y: rand(0, H),
        r: rand(1.2, 2.5), opacity: rand(0.6, 1.0),
        twinkle: rand(0, Math.PI * 2),
        color: brightColors[Math.floor(Math.random() * brightColors.length)],
      }))

      shootingStars = []
    }

    function spawnShootingStar() {
      shootingStars.push({
        x: rand(0, W * 0.7), y: rand(0, H * 0.4),
        vx: rand(8, 18), vy: rand(2, 8),
        length: rand(80, 200), opacity: 0, life: 0,
        maxLife: rand(40, 80), width: rand(0.5, 1.5),
      })
    }

    function drawNebulas(time: number) {
      const n1x = W * 0.15 + Math.sin(time * 0.00018) * W * 0.08
      const n1y = H * 0.25 + Math.cos(time * 0.00012) * H * 0.12
      const g1  = ctx.createRadialGradient(n1x, n1y, 0, n1x, n1y, 350)
      g1.addColorStop(0, 'rgba(37,99,235,0.025)'); g1.addColorStop(1, 'transparent')
      ctx.fillStyle = g1; ctx.beginPath(); ctx.arc(n1x, n1y, 350, 0, Math.PI * 2); ctx.fill()

      const n2x = W * 0.82 + Math.sin(time * 0.00014 + 2) * W * 0.07
      const n2y = H * 0.55 + Math.cos(time * 0.00020 + 1) * H * 0.10
      const g2  = ctx.createRadialGradient(n2x, n2y, 0, n2x, n2y, 280)
      g2.addColorStop(0, 'rgba(6,182,212,0.018)'); g2.addColorStop(1, 'transparent')
      ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(n2x, n2y, 280, 0, Math.PI * 2); ctx.fill()

      const n3x = W * 0.5  + Math.sin(time * 0.00016 + 4) * W * 0.12
      const n3y = H * 0.78 + Math.cos(time * 0.00011 + 3) * H * 0.08
      const g3  = ctx.createRadialGradient(n3x, n3y, 0, n3x, n3y, 320)
      g3.addColorStop(0, 'rgba(139,92,246,0.015)'); g3.addColorStop(1, 'transparent')
      ctx.fillStyle = g3; ctx.beginPath(); ctx.arc(n3x, n3y, 320, 0, Math.PI * 2); ctx.fill()
    }

    function drawConnections() {
      for (let i = 0; i < layer3.length; i++) {
        for (let j = i + 1; j < layer3.length; j++) {
          const dx   = layer3[i].x - layer3[j].x
          const dy   = layer3[i].y - layer3[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.strokeStyle = `rgba(37,99,235,${(1 - dist / 120) * 0.06})`
            ctx.lineWidth   = 0.4
            ctx.beginPath()
            ctx.moveTo(layer3[i].x, layer3[i].y)
            ctx.lineTo(layer3[j].x, layer3[j].y)
            ctx.stroke()
          }
        }
      }
    }

    function drawStars() {
      for (const s of layer1) {
        s.twinkle += 0.015
        ctx.globalAlpha = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle))
        ctx.fillStyle   = s.color
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill()
      }
      for (const s of layer2) {
        s.twinkle += 0.015
        ctx.globalAlpha = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle))
        ctx.fillStyle   = s.color
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill()
      }
      for (const s of layer3) {
        s.twinkle += 0.015
        const op = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle))
        ctx.globalAlpha = op
        ctx.shadowBlur  = 6
        ctx.shadowColor = s.color
        ctx.fillStyle   = s.color
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill()
        ctx.shadowBlur  = 0
      }
      ctx.globalAlpha = 1
    }

    function updateShootingStars(time: number) {
      if (shootingStars.length < 2 && time - lastShootingStarTime > nextShootingStarDelay) {
        spawnShootingStar()
        lastShootingStarTime  = time
        nextShootingStarDelay = 3000 + Math.random() * 5000
      }

      shootingStars = shootingStars.filter(s => s.life <= s.maxLife)

      for (const s of shootingStars) {
        s.life++; s.x += s.vx; s.y += s.vy
        const p = s.life / s.maxLife
        s.opacity = p < 0.2 ? p / 0.2 : p > 0.8 ? (1 - p) / 0.2 : 1

        const spd  = Math.hypot(s.vx, s.vy)
        const tx   = s.x - (s.vx / spd) * s.length
        const ty   = s.y - (s.vy / spd) * s.length
        const grad = ctx.createLinearGradient(tx, ty, s.x, s.y)
        grad.addColorStop(0, 'rgba(255,255,255,0)')
        grad.addColorStop(1, `rgba(255,255,255,${s.opacity})`)
        ctx.strokeStyle = grad; ctx.lineWidth = s.width
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y); ctx.stroke()
      }
    }

    function animate(time: number) {
      ctx.clearRect(0, 0, W, H)
      drawNebulas(time)
      drawConnections()
      drawStars()
      updateShootingStars(time)
      animId = requestAnimationFrame(animate)
    }

    init()
    animId = requestAnimationFrame(animate)

    const onResize = () => init()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
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

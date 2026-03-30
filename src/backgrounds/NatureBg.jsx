import { useEffect, useRef } from 'react'
import useThemeStore from '../store/themeStore'

export default function NatureBg() {
  const staticRef = useRef(null)
  const animRef = useRef(null)
  const theme = useThemeStore(s => s.theme)
  const themeRef = useRef(theme)
  useEffect(() => { themeRef.current = theme }, [theme])

  useEffect(() => {
    const cS = staticRef.current
    const cA = animRef.current
    if (!cS || !cA) return
    const ctxS = cS.getContext('2d')
    const ctxA = cA.getContext('2d')

    function drawStatic() {
      cS.width = window.innerWidth
      cS.height = Math.max(window.innerHeight, document.documentElement.scrollHeight)
      const W = cS.width, H = cS.height
      if (!W || !H) return

      const sky = ctxS.createLinearGradient(0, 0, 0, H * 0.65)
      sky.addColorStop(0, '#03071a'); sky.addColorStop(0.25, '#060e22')
      sky.addColorStop(0.55, '#0a1828'); sky.addColorStop(0.8, '#081a12')
      sky.addColorStop(1, '#040e07')
      ctxS.fillStyle = sky; ctxS.fillRect(0, 0, W, H)

      const mx = W * 0.78, my = H * 0.07
      const mg = ctxS.createRadialGradient(mx, my, 0, mx, my, W * 0.22)
      mg.addColorStop(0, 'rgba(210,255,225,0.14)')
      mg.addColorStop(0.4, 'rgba(100,220,150,0.07)')
      mg.addColorStop(1, 'transparent')
      ctxS.fillStyle = mg; ctxS.fillRect(0, 0, W, H)

      const md = ctxS.createRadialGradient(mx, my, 0, mx, my, 24)
      md.addColorStop(0, 'rgba(245,255,248,0.95)')
      md.addColorStop(0.6, 'rgba(180,245,205,0.7)')
      md.addColorStop(1, 'transparent')
      ctxS.fillStyle = md
      ctxS.beginPath(); ctxS.arc(mx, my, 24, 0, Math.PI * 2); ctxS.fill()

      for (let i = 0; i < 220; i++) {
        const x = Math.random() * W, y = Math.random() * H * 0.58
        const r = Math.random() * 1.3 + 0.15, a = 0.5 + Math.random() * 0.5
        ctxS.fillStyle = `rgba(220,255,235,${a})`
        ctxS.beginPath(); ctxS.arc(x, y, r, 0, Math.PI * 2); ctxS.fill()
      }

      const auroras = [
        { y: 0.06, c1: 'rgba(0,255,130,0.07)', c2: 'rgba(0,180,255,0.05)', freq: 3.5, phase: 0 },
        { y: 0.13, c1: 'rgba(80,255,210,0.06)', c2: 'rgba(150,80,255,0.05)', freq: 4.5, phase: 1.2 },
        { y: 0.19, c1: 'rgba(0,210,110,0.05)', c2: 'rgba(0,255,190,0.04)', freq: 5, phase: 2.4 },
      ]
      auroras.forEach(a => {
        const y0 = H * a.y, bh = H * 0.13
        const ag = ctxS.createLinearGradient(0, y0, 0, y0 + bh)
        ag.addColorStop(0, 'transparent'); ag.addColorStop(0.35, a.c1)
        ag.addColorStop(0.7, a.c2); ag.addColorStop(1, 'transparent')
        ctxS.fillStyle = ag
        ctxS.beginPath(); ctxS.moveTo(0, y0 + bh)
        for (let x = 0; x <= W; x += W / 20)
          ctxS.lineTo(x, y0 + Math.sin(x / W * Math.PI * a.freq + a.phase) * bh * 0.35)
        ctxS.lineTo(W, y0 + bh); ctxS.closePath(); ctxS.fill()
      })

      ctxS.fillStyle = 'rgba(8,28,16,0.75)'
      ctxS.beginPath(); ctxS.moveTo(0, H * 0.58)
      for (let x = 0; x <= W; x += W / 30)
        ctxS.lineTo(x, H * (0.3 + Math.sin(x / W * Math.PI * 5 + 0.5) * 0.13 + Math.sin(x / W * Math.PI * 11) * 0.04))
      ctxS.lineTo(W, H * 0.58); ctxS.lineTo(W, H); ctxS.lineTo(0, H); ctxS.closePath(); ctxS.fill()

      const mist = ctxS.createLinearGradient(0, H * 0.52, 0, H * 0.65)
      mist.addColorStop(0, 'transparent')
      mist.addColorStop(0.5, 'rgba(50,180,95,0.1)')
      mist.addColorStop(1, 'transparent')
      ctxS.fillStyle = mist; ctxS.fillRect(0, H * 0.52, W, H * 0.13)

      ctxS.fillStyle = 'rgba(5,20,10,0.95)'
      ctxS.beginPath(); ctxS.moveTo(0, H * 0.65)
      for (let x = 0; x <= W; x += 4) {
        const h = Math.abs(Math.sin(x / W * Math.PI * 40)) * H * 0.14 + Math.abs(Math.sin(x / W * Math.PI * 16)) * H * 0.05
        ctxS.lineTo(x, H * 0.6 - h)
      }
      ctxS.lineTo(W, H * 0.65); ctxS.lineTo(W, H); ctxS.lineTo(0, H); ctxS.closePath(); ctxS.fill()

      const mushrooms = [[0.1, 0.7, 'rgba(100,255,160,0.5)'], [0.32, 0.74, 'rgba(200,120,255,0.45)'], [0.6, 0.71, 'rgba(80,220,255,0.4)'], [0.85, 0.7, 'rgba(255,180,80,0.4)']]
      mushrooms.forEach(([xp, yp, col]) => {
        const gx = W * xp, gy = H * yp
        const g = ctxS.createRadialGradient(gx, gy, 0, gx, gy, 22)
        g.addColorStop(0, col); g.addColorStop(1, 'transparent')
        ctxS.fillStyle = g; ctxS.beginPath(); ctxS.arc(gx, gy, 22, 0, Math.PI * 2); ctxS.fill()
      })

      ctxS.strokeStyle = 'rgba(18,85,38,0.3)'; ctxS.lineWidth = 1
      for (let x = 0; x < W; x += 7) {
        const h = 8 + Math.random() * 24
        ctxS.beginPath(); ctxS.moveTo(x, H)
        ctxS.quadraticCurveTo(x + Math.random() * 10 - 5, H - h * 0.5, x + Math.random() * 6 - 3, H - h)
        ctxS.stroke()
      }

      const gm = ctxS.createLinearGradient(0, H * 0.74, 0, H)
      gm.addColorStop(0, 'rgba(30,100,60,0.1)'); gm.addColorStop(1, 'rgba(8,30,16,0.2)')
      ctxS.fillStyle = gm; ctxS.fillRect(0, H * 0.74, W, H)
    }

    drawStatic()
    window.addEventListener('resize', drawStatic)

    const cols = ['rgba(100,255,160', 'rgba(180,255,220', 'rgba(255,220,100', 'rgba(160,200,255', 'rgba(220,180,255']
    function mkP() {
      return {
        x: Math.random() * window.innerWidth, y: window.innerHeight * (0.15 + Math.random() * 0.75),
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.25,
        r: 1 + Math.random() * 2.2, phase: Math.random() * Math.PI * 2,
        spd: 0.007 + Math.random() * 0.014, trail: [], trailLen: Math.floor(8 + Math.random() * 18),
        col: cols[Math.floor(Math.random() * cols.length)], fairy: Math.random() > 0.45
      }
    }
    const particles = Array.from({ length: 75 }, mkP)
    let aT = 0, rafId

    function drawAurora(W, H) {
      ctxA.save(); ctxA.globalCompositeOperation = 'screen'
      const bands = [
        [0.07, 0.13, 'rgba(0,255,130,', 'rgba(0,180,255,', 3.5, 0.28],
        [0.14, 0.12, 'rgba(80,255,200,', 'rgba(150,80,255,', 4.5, 0.2],
        [0.21, 0.1, 'rgba(0,200,110,', 'rgba(0,255,180,', 5, 0.35],
      ]
      bands.forEach(([yf, bh, c1, c2, freq, spd]) => {
        const y0 = H * yf, bH = H * bh
        const g = ctxA.createLinearGradient(0, y0, 0, y0 + bH)
        g.addColorStop(0, 'transparent'); g.addColorStop(0.35, c1 + '0.065)')
        g.addColorStop(0.7, c2 + '0.05)'); g.addColorStop(1, 'transparent')
        ctxA.fillStyle = g
        ctxA.beginPath(); ctxA.moveTo(0, y0 + bH)
        for (let x = 0; x <= W; x += W / 44)
          ctxA.lineTo(x, y0 + Math.sin(x / W * Math.PI * freq + aT * spd) * bH * 0.4 + Math.sin(x / W * Math.PI * freq * 2 + aT * spd * 1.6) * bH * 0.12)
        ctxA.lineTo(W, y0 + bH); ctxA.closePath(); ctxA.fill()
        for (let x = 0; x < W; x += W / 22) {
          const rh = bH * 0.7 + Math.sin(x / W * Math.PI * freq * 2 + aT * spd) * bH * 0.25
          const rg = ctxA.createLinearGradient(x, y0, x, y0 + rh)
          rg.addColorStop(0, c1 + '0.04)'); rg.addColorStop(1, 'transparent')
          ctxA.fillStyle = rg
          ctxA.fillRect(x - 1.5, y0 + Math.sin(x / W * Math.PI * freq + aT * spd) * bH * 0.4, 3, rh)
        }
      })
      ctxA.restore()
    }

    function animNature() {
      cA.width = window.innerWidth; cA.height = window.innerHeight
      const W = cA.width, H = cA.height
      rafId = requestAnimationFrame(animNature)
      if (themeRef.current !== 'nature') return
      ctxA.clearRect(0, 0, W, H); aT += 0.016
      drawAurora(W, H)
      particles.forEach(p => {
        p.phase += p.spd
        p.x += p.vx + Math.sin(p.phase) * 0.28
        p.y += p.vy + Math.cos(p.phase * 0.65) * 0.2
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < H * 0.1) p.y = H * 0.85; if (p.y > H * 0.92) p.y = H * 0.18
        p.trail.push({ x: p.x, y: p.y })
        if (p.trail.length > p.trailLen) p.trail.shift()
        const alpha = 0.22 + Math.sin(p.phase) * 0.22
        ctxA.save(); ctxA.globalCompositeOperation = 'screen'
        if (p.trail.length > 2) {
          for (let i = 1; i < p.trail.length; i++) {
            ctxA.strokeStyle = p.col + ',' + (i / p.trail.length * alpha * 0.55) + ')'
            ctxA.lineWidth = p.r * 0.45
            ctxA.beginPath()
            ctxA.moveTo(p.trail[i - 1].x, p.trail[i - 1].y)
            ctxA.lineTo(p.trail[i].x, p.trail[i].y)
            ctxA.stroke()
          }
        }
        const glow = ctxA.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.fairy ? p.r * 5.5 : p.r * 3.5)
        glow.addColorStop(0, p.col + ',' + alpha + ')')
        glow.addColorStop(0.5, p.col + ',' + (alpha * 0.35) + ')')
        glow.addColorStop(1, 'transparent')
        ctxA.fillStyle = glow
        ctxA.beginPath(); ctxA.arc(p.x, p.y, p.fairy ? p.r * 5.5 : p.r * 3.5, 0, Math.PI * 2); ctxA.fill()
        ctxA.fillStyle = p.col + ',0.9)'
        ctxA.beginPath(); ctxA.arc(p.x, p.y, p.r * 0.35, 0, Math.PI * 2); ctxA.fill()
        ctxA.restore()
      })
    }
    animNature()

    return () => {
      window.removeEventListener('resize', drawStatic)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <canvas ref={staticRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: theme === 'nature' ? 1 : 0, transition: 'opacity 1.2s' }} />
      <canvas ref={animRef} style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: theme === 'nature' ? 1 : 0, transition: 'opacity 1.2s' }} />
    </>
  )
}
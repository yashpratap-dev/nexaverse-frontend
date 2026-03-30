import { useEffect, useRef } from 'react'
import useThemeStore from '../store/themeStore'
import { playThunder } from '../audio/audioEngine'

export default function DestroyBg() {
  const staticRef = useRef(null)
  const animRef = useRef(null)
  const fogRef = useRef(null)
  const lgRef = useRef(null)
  const lgTimer = useRef(null)
  const theme = useThemeStore(s => s.theme)
  const themeRef = useRef(theme)
  useEffect(() => { themeRef.current = theme }, [theme])

  useEffect(() => {
    const cS = staticRef.current
    const cA = animRef.current
    const fogC = fogRef.current
    const lgC = lgRef.current
    if (!cS || !cA || !fogC || !lgC) return

    const ctxS = cS.getContext('2d')
    const ctxA = cA.getContext('2d')
    const fogCtx = fogC.getContext('2d')
    const lgCtx = lgC.getContext('2d')

    function drawHell() {
      cS.width = window.innerWidth
      cS.height = Math.max(window.innerHeight, document.documentElement.scrollHeight)
      const W = cS.width, H = cS.height
      if (!W || !H) return

      ctxS.fillStyle = '#080002'; ctxS.fillRect(0, 0, W, H)

      const sk = ctxS.createLinearGradient(0, 0, 0, H * 0.55)
      sk.addColorStop(0, '#0e0002'); sk.addColorStop(0.3, '#1c0205')
      sk.addColorStop(0.6, '#240408'); sk.addColorStop(1, '#0a0002')
      ctxS.fillStyle = sk; ctxS.fillRect(0, 0, W, H * 0.55)

      const glows = [[W / 2, 0, 'rgba(200,15,0,0.24)', W * 0.75], [W * 0.18, H * 0.88, 'rgba(255,90,0,0.28)', W * 0.42], [W * 0.82, H * 0.9, 'rgba(220,40,0,0.22)', W * 0.36], [W / 2, H, 'rgba(255,110,0,0.32)', W * 0.55]]
      glows.forEach(([x, y, col, r]) => {
        const g = ctxS.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, col); g.addColorStop(1, 'transparent')
        ctxS.fillStyle = g; ctxS.fillRect(0, 0, W, H)
      })

      ctxS.fillStyle = 'rgba(10,1,1,0.94)'
      ctxS.beginPath(); ctxS.moveTo(0, H * 0.58)
      const vp = [[0, 0.58], [0.07, 0.38], [0.13, 0.58], [0.21, 0.24], [0.27, 0.58], [0.37, 0.31], [0.43, 0.58], [0.51, 0.17], [0.57, 0.58], [0.67, 0.27], [0.74, 0.58], [0.84, 0.34], [0.9, 0.58], [1, 0.58]]
      vp.forEach(([xp, yp]) => ctxS.lineTo(W * xp, H * yp))
      ctxS.lineTo(W, H); ctxS.lineTo(0, H); ctxS.closePath(); ctxS.fill()

      const volcanoes = [[0.21, 0.24], [0.51, 0.17], [0.67, 0.27], [0.84, 0.34]]
      volcanoes.forEach(([xp, yp]) => {
        const vg = ctxS.createRadialGradient(W * xp, H * yp, 0, W * xp, H * yp, W * 0.09)
        vg.addColorStop(0, 'rgba(255,130,0,0.28)'); vg.addColorStop(1, 'transparent')
        ctxS.fillStyle = vg; ctxS.fillRect(0, 0, W, H)
      })

      ctxS.fillStyle = 'rgba(16,2,2,0.97)'
      ctxS.beginPath(); ctxS.moveTo(0, H * 0.68)
      for (let x = 0; x <= W; x += W / 65)
        ctxS.lineTo(x, H * (0.64 + Math.abs(Math.sin(x / W * Math.PI * 20)) * 0.04))
      ctxS.lineTo(W, H); ctxS.lineTo(0, H); ctxS.closePath(); ctxS.fill()

      for (let i = 0; i < 22; i++) {
        const sx = Math.random() * W, sy = H * (0.64 + Math.random() * 0.34)
        const cg = ctxS.createLinearGradient(sx, sy, sx, sy + 90)
        cg.addColorStop(0, 'rgba(255,130,0,0.65)'); cg.addColorStop(0.5, 'rgba(255,60,0,0.45)'); cg.addColorStop(1, 'rgba(180,20,0,0.1)')
        ctxS.strokeStyle = cg; ctxS.lineWidth = 1.5 + Math.random() * 2
        ctxS.shadowColor = 'rgba(255,80,0,0.6)'; ctxS.shadowBlur = 5
        ctxS.beginPath(); ctxS.moveTo(sx, sy)
        let cx = sx, cy = sy
        for (let j = 0; j < 9; j++) { cx += Math.random() * 55 - 27; cy += Math.random() * 38 + 12; ctxS.lineTo(cx, cy) }
        ctxS.stroke(); ctxS.shadowBlur = 0
      }

      const lavaPools = [[W * 0.14, H * 0.89, W * 0.1], [W * 0.5, H * 0.93, W * 0.14], [W * 0.83, H * 0.88, W * 0.09]]
      lavaPools.forEach(([px, py, pr]) => {
        const lg = ctxS.createRadialGradient(px, py, 0, px, py, pr)
        lg.addColorStop(0, 'rgba(255,150,0,0.75)'); lg.addColorStop(0.45, 'rgba(255,65,0,0.55)')
        lg.addColorStop(0.85, 'rgba(180,20,0,0.3)'); lg.addColorStop(1, 'transparent')
        ctxS.fillStyle = lg; ctxS.beginPath(); ctxS.ellipse(px, py, pr, pr * 0.32, 0, 0, Math.PI * 2); ctxS.fill()
      })

      ctxS.fillStyle = 'rgba(12,2,2,0.65)'
      const smokeCols = [[W * 0.21, H * 0.24], [W * 0.51, H * 0.17], [W * 0.67, H * 0.27]]
      smokeCols.forEach(([cx, cy]) => {
        for (let i = 0; i < 7; i++) {
          ctxS.beginPath(); ctxS.arc(cx + (Math.random() - 0.5) * 35, cy - i * H * 0.038, 22 + Math.random() * 16, 0, Math.PI * 2); ctxS.fill()
        }
      })
    }

    drawHell()
    window.addEventListener('resize', drawHell)

    // Embers
    function mkEmber() {
      return { x: Math.random() * window.innerWidth, y: window.innerHeight * (0.55 + Math.random() * 0.45), vx: (Math.random() - 0.5) * 0.55, vy: -(0.28 + Math.random() * 0.75), r: 0.8 + Math.random() * 2, life: Math.random(), decay: 0.003 + Math.random() * 0.006, col: Math.random() > 0.5 ? '255,100,0' : '255,55,0' }
    }
    const embers = Array.from({ length: 90 }, mkEmber)
    let dT = 0, rafEmber

    function animDestroy() {
      cA.width = window.innerWidth; cA.height = window.innerHeight
      rafEmber = requestAnimationFrame(animDestroy)
      if (themeRef.current !== 'destroy') { ctxA.clearRect(0, 0, cA.width, cA.height); return }
      const W = cA.width, H = cA.height
      ctxA.clearRect(0, 0, W, H); dT += 0.02
      embers.forEach(e => {
        e.x += e.vx + Math.sin(dT + e.r) * 0.45; e.y += e.vy; e.life -= e.decay
        if (e.life <= 0 || e.y < -10) Object.assign(e, mkEmber())
        ctxA.save(); ctxA.globalCompositeOperation = 'screen'
        const eg = ctxA.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 3.5)
        eg.addColorStop(0, `rgba(${e.col},${e.life * 0.8})`); eg.addColorStop(1, 'transparent')
        ctxA.fillStyle = eg; ctxA.beginPath(); ctxA.arc(e.x, e.y, e.r * 3.5, 0, Math.PI * 2); ctxA.fill()
        ctxA.restore()
      })
      ctxA.save(); ctxA.globalCompositeOperation = 'screen'
      const pulse = 0.07 + Math.sin(dT * 1.8) * 0.04
      const lg2 = ctxA.createLinearGradient(0, H * 0.68, 0, H)
      lg2.addColorStop(0, 'transparent'); lg2.addColorStop(1, `rgba(255,65,0,${pulse})`)
      ctxA.fillStyle = lg2; ctxA.fillRect(0, H * 0.68, W, H * 0.32); ctxA.restore()
    }
    animDestroy()

    // Fog
    const fogPuffs = Array.from({ length: 14 }, (_, i) => ({ x: (i / 14) * window.innerWidth, y: window.innerHeight * (0.42 + Math.random() * 0.35), w: 130 + Math.random() * 220, h: 45 + Math.random() * 70, vx: 0.14 + Math.random() * 0.22, alpha: 0.1 + Math.random() * 0.09, phase: Math.random() * Math.PI * 2 }))
    let rafFog

    function animFog() {
      fogC.width = window.innerWidth; fogC.height = window.innerHeight
      rafFog = requestAnimationFrame(animFog)
      if (themeRef.current !== 'destroy') { fogCtx.clearRect(0, 0, fogC.width, fogC.height); return }
      fogCtx.clearRect(0, 0, fogC.width, fogC.height)
      fogPuffs.forEach(p => {
        p.x += p.vx; p.phase += 0.007
        if (p.x > fogC.width + p.w) p.x = -p.w
        const a = p.alpha + Math.sin(p.phase) * 0.025
        const fg = fogCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.w * 0.5)
        fg.addColorStop(0, `rgba(80,18,8,${a})`); fg.addColorStop(1, 'transparent')
        fogCtx.fillStyle = fg; fogCtx.beginPath(); fogCtx.ellipse(p.x, p.y, p.w * 0.5, p.h * 0.5, 0, 0, Math.PI * 2); fogCtx.fill()
      })
    }
    animFog()

    // Lightning
    lgC.width = window.innerWidth; lgC.height = window.innerHeight
    function resizeLg() { lgC.width = window.innerWidth; lgC.height = window.innerHeight }
    window.addEventListener('resize', resizeLg)

    function drawBolt(ctx, x, y, angle, len, depth, progress, maxD) {
      if (depth <= 0 || len < 6) return
      const ex = x + Math.cos(angle) * len * progress
      const ey = y + Math.sin(angle) * len * progress
      ctx.save()
      ctx.shadowColor = 'rgba(255,200,60,0.7)'; ctx.shadowBlur = 14
      ctx.strokeStyle = `rgba(255,210,80,${0.25 + depth / maxD * 0.4})`; ctx.lineWidth = (depth * 0.65 + 0.4) * 2
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke()
      ctx.shadowBlur = 5
      ctx.strokeStyle = `rgba(255,255,240,${0.4 + depth / maxD * 0.5})`; ctx.lineWidth = depth * 0.65 + 0.4
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke()
      ctx.restore()
      if (progress >= 1) {
        drawBolt(ctx, ex, ey, angle + (Math.random() - 0.5) * 0.52, len * 0.66, depth - 1, 1, maxD)
        if (depth > 2 && Math.random() > 0.42)
          drawBolt(ctx, ex, ey, angle + (Math.random() - 0.5) * 1.05, len * 0.4, depth - 2, 1, maxD)
      }
    }

    function fireLightning() {
      if (themeRef.current !== 'destroy') return
      playThunder()
      const W = lgC.width, H = lgC.height
      const startX = W * 0.1 + Math.random() * W * 0.8
      const angle = Math.PI / 2 + (Math.random() - 0.5) * 0.32
      const totalLen = H * 0.58, maxD = 7
      let progress = 0
      lgCtx.fillStyle = 'rgba(140,0,0,0.09)'; lgCtx.fillRect(0, 0, W, H)
      function step() {
        progress = Math.min(progress + 0.038, 1)
        lgCtx.clearRect(0, 0, W, H)
        if (progress < 0.25) { lgCtx.fillStyle = `rgba(150,0,0,${0.07 * (1 - progress / 0.25)})`; lgCtx.fillRect(0, 0, W, H) }
        drawBolt(lgCtx, startX, 0, angle, totalLen, maxD, progress, maxD)
        if (progress < 1) { requestAnimationFrame(step) }
        else {
          setTimeout(() => {
            let fa = 1
            const fade = setInterval(() => {
              fa -= 0.1; lgCtx.clearRect(0, 0, W, H)
              if (fa <= 0) { clearInterval(fade); lgCtx.clearRect(0, 0, W, H); return }
              lgCtx.globalAlpha = fa; drawBolt(lgCtx, startX, 0, angle, totalLen, maxD, 1, maxD); lgCtx.globalAlpha = 1
            }, 35)
          }, 220)
          lgTimer.current = setTimeout(fireLightning, 2800 + Math.random() * 4500)
        }
      }
      requestAnimationFrame(step)
    }

    if (themeRef.current === 'destroy') {
      lgTimer.current = setTimeout(fireLightning, 1000)
    }

    return () => {
      window.removeEventListener('resize', drawHell)
      window.removeEventListener('resize', resizeLg)
      cancelAnimationFrame(rafEmber)
      cancelAnimationFrame(rafFog)
      if (lgTimer.current) clearTimeout(lgTimer.current)
    }
  }, [])

  useEffect(() => {
    if (theme === 'destroy' && lgRef.current) {
      if (lgTimer.current) clearTimeout(lgTimer.current)
    }
  }, [theme])

  const visible = theme === 'destroy'
  return (
    <>
      <canvas ref={staticRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: visible ? 1 : 0, transition: 'opacity 1.2s' }} />
      <canvas ref={animRef}   style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: visible ? 1 : 0, transition: 'opacity 1.2s' }} />
      <canvas ref={fogRef}    style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: visible ? 0.85 : 0, transition: 'opacity 1.2s' }} />
      <canvas ref={lgRef}     style={{ position: 'fixed', inset: 0, zIndex: 4, pointerEvents: 'none' }} />
    </>
  )
}
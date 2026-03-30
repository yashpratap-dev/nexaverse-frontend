import { useEffect, useRef } from 'react'

export default function CyberBg() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const c = canvasRef.current
    const ctx = c.getContext('2d')

    function draw() {
      c.width = window.innerWidth
      c.height = Math.max(window.innerHeight, document.documentElement.scrollHeight)
      const W = c.width, H = c.height
      ctx.fillStyle = '#020408'; ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = 'rgba(0,255,200,0.055)'; ctx.lineWidth = 0.5
      for (let x = 0; x < W; x += 52) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke() }
      for (let y = 0; y < H; y += 52) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke() }
      const g1 = ctx.createRadialGradient(W/2,H*0.1,0,W/2,H*0.1,W*0.55)
      g1.addColorStop(0,'rgba(0,70,190,0.09)'); g1.addColorStop(1,'transparent')
      ctx.fillStyle = g1; ctx.fillRect(0,0,W,H)
      const g2 = ctx.createRadialGradient(W*0.85,H*0.6,0,W*0.85,H*0.6,W*0.4)
      g2.addColorStop(0,'rgba(255,35,130,0.06)'); g2.addColorStop(1,'transparent')
      ctx.fillStyle = g2; ctx.fillRect(0,0,W,H)
    }

    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none'
    }} />
  )
}
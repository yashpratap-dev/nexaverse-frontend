import { useEffect, useRef } from 'react'
import { playHover, playTxt } from '../audio/audioEngine'

const TECHS = [
  { label:'Spring Boot', cls:'c' },{ label:'PostgreSQL', cls:'b' },{ label:'Redis', cls:'p' },
  { label:'Apache Kafka', cls:'c' },{ label:'WebSocket', cls:'b' },{ label:'Spring AI', cls:'p' },
  { label:'JWT Auth', cls:'c' },{ label:'Three.js', cls:'b' },{ label:'React + Vite', cls:'p' },
]

const COLORS = {
  c: { border:'rgba(0,255,200,0.28)', color:'rgba(0,255,200,0.68)', bg:'rgba(0,255,200,0.03)', hover:'rgba(0,255,200,0.09)', shadow:'rgba(0,255,200,0.12)' },
  b: { border:'rgba(0,128,255,0.28)', color:'rgba(0,128,255,0.68)', bg:'rgba(0,128,255,0.03)', hover:'rgba(0,128,255,0.09)', shadow:'rgba(0,128,255,0.12)' },
  p: { border:'rgba(255,60,172,0.28)', color:'rgba(255,60,172,0.68)', bg:'rgba(255,60,172,0.03)', hover:'rgba(255,60,172,0.09)', shadow:'rgba(255,60,172,0.12)' },
}

export default function TechStack() {
  const refs = useRef([])
  const cardRefs = useRef([])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1'
          e.target.style.transform = 'none'
          playTxt()
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.1 })
    ;[...refs.current, ...cardRefs.current].forEach(r => r && obs.observe(r))
    return () => obs.disconnect()
  }, [])

  const reveal = (delay=0) => ({ opacity:0, transform:'translateY(36px)', transition:`all 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms` })
  const revealS = (delay=0) => ({ opacity:0, transform:'scale(0.84)', transition:`all 0.8s ease ${delay}ms` })

  return (
    <section style={{ padding:'65px 48px', textAlign:'center', position:'relative', zIndex:5 }}>
      <div ref={el=>refs.current[0]=el} style={reveal(0)}>
        <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, letterSpacing:4, color:'#0080ff', textTransform:'uppercase', display:'block', marginBottom:12 }}>// Stack</span>
      </div>
      <div ref={el=>refs.current[1]=el} style={reveal(100)}>
        <h2 style={{ fontFamily:"'Orbitron',monospace", fontSize:'clamp(20px,4vw,34px)', fontWeight:700, color:'#e0f0ff', letterSpacing:4, marginBottom:10 }}>BUILT WITH</h2>
      </div>
      <div ref={el=>refs.current[2]=el} style={{ ...reveal(100), width:56, height:2, background:'#0080ff', margin:'0 auto 36px' }}/>

      <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:10, maxWidth:680, margin:'0 auto' }}>
        {TECHS.map((t, i) => {
          const col = COLORS[t.cls]
          return (
            <div
              key={t.label}
              ref={el => cardRefs.current[i] = el}
              onMouseEnter={e => {
                playHover()
                e.currentTarget.style.background = col.hover
                e.currentTarget.style.boxShadow = `0 7px 22px ${col.shadow}`
                e.currentTarget.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = col.bg
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'none'
              }}
              style={{
                ...revealS(Math.floor(i/3)*150),
                fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                letterSpacing:2, padding:'7px 18px',
                border:`1px solid ${col.border}`,
                color:col.color, background:col.bg,
                textTransform:'uppercase', cursor:'default',
                transition:'all 0.3s, opacity 0.8s ease, transform 0.8s ease'
              }}
            >{t.label}</div>
          )
        })}
      </div>
    </section>
  )
}
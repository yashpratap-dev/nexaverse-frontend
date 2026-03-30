import { useEffect, useRef } from 'react'
import { playHover, playTxt } from '../audio/audioEngine'

const FEATURES = [
  { num:'SYS::01', title:'3D World Engine',  desc:'Real-time WebSocket spatial sync. Dynamic world rooms and multi-player position tracking across infinite dimensions.' },
  { num:'SYS::02', title:'Avatar System',    desc:'WARRIOR · MAGE · RANGER classes. Inventory, leveling, and real-time movement synchronization.' },
  { num:'SYS::03', title:'Kafka Streams',    desc:'High-throughput event bus. Real-time chat, world events and movement via Apache Kafka.' },
  { num:'SYS::04', title:'Spring AI',        desc:'MIMIR & GUANYIN AI companions. Personality-driven OpenAI integration with contextual memory.' },
  { num:'SYS::05', title:'Redis Cache',      desc:'Sub-millisecond access. Session management, leaderboards, world state caching at scale.' },
  { num:'SYS::06', title:'JWT Security',     desc:'Role-based access control. Spring Security with encrypted token authentication.' },
]

export default function Features() {
  const cardRefs = useRef([])
  const headerRefs = useRef([])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1'
          e.target.style.transform = 'translateY(0)'
          playTxt()
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' })
    ;[...headerRefs.current, ...cardRefs.current].forEach(r => r && obs.observe(r))
    return () => obs.disconnect()
  }, [])

  const reveal = (delay = 0) => ({
    opacity: 0, transform: 'translateY(36px)',
    transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`
  })

  return (
    <section style={{ padding: '72px 48px', position: 'relative', zIndex: 5 }}>
      <div ref={el => headerRefs.current[0] = el} style={reveal(0)}>
        <span style={{
          fontFamily: "'Share Tech Mono',monospace", fontSize: 11,
          letterSpacing: 4, color: '#0080ff', textTransform: 'uppercase',
          display: 'block', marginBottom: 12
        }}>// Core Architecture</span>
      </div>

      <div ref={el => headerRefs.current[1] = el} style={reveal(100)}>
        <h2 style={{
          fontFamily: "'Orbitron',monospace", fontSize: 'clamp(20px,4vw,34px)',
          fontWeight: 700, color: '#e0f0ff', letterSpacing: 4, marginBottom: 10
        }}>CORE SYSTEMS</h2>
      </div>

      <div ref={el => headerRefs.current[2] = el} style={{ ...reveal(100), width: 56, height: 2, background: '#00ffc8', marginBottom: 44 }}/>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))',
        gap: 18, maxWidth: 960
      }}>
        {FEATURES.map((f, i) => (
          <div
            key={f.num}
            ref={el => cardRefs.current[i] = el}
            onMouseEnter={e => {
              playHover()
              e.currentTarget.style.borderColor = 'rgba(0,255,200,0.32)'
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 18px 50px rgba(0,0,0,0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(0,255,200,0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            style={{
              ...reveal(i % 4 * 150),
              background: 'rgba(6,12,28,0.95)',
              border: '1px solid rgba(0,255,200,0.1)',
              padding: '28px 24px', position: 'relative', overflow: 'hidden',
              clipPath: 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))',
              transition: 'all 0.4s, opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1)',
              cursor: 'default'
            }}
          >
            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'rgba(0,255,200,0.28)', letterSpacing:2, marginBottom:14 }}>{f.num}</div>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:12, fontWeight:700, color:'#00ffc8', letterSpacing:2, marginBottom:10, textTransform:'uppercase' }}>{f.title}</div>
            <div style={{ fontSize:13, color:'rgba(145,190,255,0.58)', lineHeight:1.75, fontWeight:300 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
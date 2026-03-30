import { useEffect, useRef } from 'react'
import { playHover, playTxt } from '../audio/audioEngine'

export default function Companions() {
  const refs = useRef([])

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
    refs.current.forEach(r => r && obs.observe(r))
    return () => obs.disconnect()
  }, [])

  const companions = [
    {
      id: 'mimir', name: 'MIMIR',
      tag: '⚔ God of War · The All-Knowing',
      color: '#00aaff', borderColor: 'rgba(0,128,255,0.22)',
      bg: 'rgba(0,12,44,0.9)', quoteBorder: '#00aaff',
      quoteColor: 'rgba(90,170,255,0.72)', quoteBg: 'rgba(0,50,130,0.18)',
      tagColor: 'rgba(0,160,255,0.45)',
      trait: 'Witty, sarcastic, impossibly wise. The smartest entity in NexaVerse — and he reminds you every session.',
      quote: '"Died again? Shocking. Shall we try using your brain this time, brother?"',
      from: 'translateX(-44px)'
    },
    {
      id: 'guanyin', name: 'GUANYIN',
      tag: '🐉 Black Myth · Goddess of Mercy',
      color: '#ff3cac', borderColor: 'rgba(255,60,172,0.22)',
      bg: 'rgba(28,0,36,0.9)', quoteBorder: '#ff3cac',
      quoteColor: 'rgba(255,130,195,0.72)', quoteBg: 'rgba(100,0,65,0.18)',
      tagColor: 'rgba(255,60,172,0.45)',
      trait: 'Calm, ancient, profoundly spiritual. Her wisdom cuts through chaos like moonlight through digital mist.',
      quote: '"Every defeat is written into your path — so is every triumph. Be still."',
      from: 'translateX(44px)'
    }
  ]

  return (
    <section style={{
      padding: '72px 48px',
      background: 'rgba(0,0,8,0.6)',
      borderTop: '1px solid rgba(255,60,172,0.07)',
      borderBottom: '1px solid rgba(0,128,255,0.07)',
      position: 'relative', zIndex: 5
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div ref={el => refs.current[0] = el} style={{ opacity:0, transform:'translateY(36px)', transition:'all 0.85s cubic-bezier(0.16,1,0.3,1)' }}>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, letterSpacing:4, color:'#0080ff', textTransform:'uppercase', display:'block', marginBottom:12 }}>// AI Companion Matrix</span>
        </div>
        <div ref={el => refs.current[1] = el} style={{ opacity:0, transform:'translateY(36px)', transition:'all 0.85s cubic-bezier(0.16,1,0.3,1) 0.1s' }}>
          <h2 style={{ fontFamily:"'Orbitron',monospace", fontSize:'clamp(20px,4vw,34px)', fontWeight:700, color:'#e0f0ff', letterSpacing:4, marginBottom:10 }}>YOUR GUIDES</h2>
        </div>
        <div ref={el => refs.current[2] = el} style={{ opacity:0, transform:'translateY(36px)', transition:'all 0.85s cubic-bezier(0.16,1,0.3,1) 0.1s', width:56, height:2, background:'#ff3cac', marginBottom:44 }}/>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          {companions.map((c, i) => (
            <div
              key={c.id}
              ref={el => refs.current[3+i] = el}
              onMouseEnter={e => {
                playHover()
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = c.id==='mimir' ? '0 18px 50px rgba(0,60,200,0.15)' : '0 18px 50px rgba(200,30,120,0.15)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = 'none'
              }}
              style={{
                opacity:0, transform: c.from,
                transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${i*0.15}s`,
                padding:30, border:`1px solid ${c.borderColor}`,
                background: c.bg, overflow:'hidden',
                clipPath:'polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px))',
                cursor:'default'
              }}
            >
              <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, letterSpacing:3, textTransform:'uppercase', marginBottom:8, color:c.tagColor }}>{c.tag}</div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:21, fontWeight:900, letterSpacing:4, marginBottom:14, color:c.color, textShadow:`0 0 18px ${c.color}55` }}>{c.name}</div>
              <div style={{ fontSize:13, color:'rgba(170,205,255,0.62)', lineHeight:1.8, marginBottom:14 }}>{c.trait}</div>
              <div style={{ padding:'11px 14px', fontFamily:"'Share Tech Mono',monospace", fontSize:11, fontStyle:'italic', lineHeight:1.7, borderLeft:`2px solid ${c.quoteBorder}`, color:c.quoteColor, background:c.quoteBg }}>{c.quote}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
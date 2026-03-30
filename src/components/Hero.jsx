import { useEffect, useRef } from 'react'
import { playHover, playClick, playTxt } from '../audio/audioEngine'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function Hero() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const refs = useRef([])

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
    }, { threshold: 0.1 })
    refs.current.forEach(r => r && obs.observe(r))
    return () => obs.disconnect()
  }, [])

  const reveal = (delay = 0) => ({
    opacity: 0,
    transform: 'translateY(36px)',
    transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`
  })

  const addRef = (i) => (el) => { refs.current[i] = el }

  function handleLaunch() {
    playClick()
    if (user) {
      navigate('/worlds')
    } else {
      navigate('/login')
    }
  }

  function handleExplore() {
    playClick()
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  return (
    <section style={{
      minHeight: '90vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '80px 40px 60px',
      position: 'relative', zIndex: 5
    }}>
      {/* Badge */}
      <div ref={addRef(0)} style={{ ...reveal(0), marginBottom: 30, position: 'relative' }}>
        <div style={{
          fontFamily: "'Share Tech Mono',monospace", fontSize: 11,
          letterSpacing: 3, color: '#ff3cac',
          border: '1px solid rgba(255,60,172,0.35)',
          padding: '5px 18px', textTransform: 'uppercase', display: 'inline-block'
        }}>
          <span style={{ position:'absolute', top:'50%', right:'calc(100% + 10px)', width:36, height:1, background:'rgba(255,60,172,0.4)', display:'block' }}/>
          ⬡ Metaverse Platform · V2.0 Online
          <span style={{ position:'absolute', top:'50%', left:'calc(100% + 10px)', width:36, height:1, background:'rgba(255,60,172,0.4)', display:'block' }}/>
        </div>
      </div>

      {/* Title */}
      <h1 ref={addRef(1)} style={{
        ...reveal(100),
        fontFamily: "'Orbitron',monospace", fontWeight: 900,
        fontSize: 'clamp(40px,9vw,90px)', lineHeight: 1,
        marginBottom: 10, letterSpacing: 8,
        background: 'linear-gradient(135deg,#00ffc8 0%,#0080ff 45%,#ff3cac 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>NEXAVERSE</h1>

      {/* Sub */}
      <div ref={addRef(2)} style={{
        ...reveal(200),
        fontFamily: "'Orbitron',monospace",
        fontSize: 'clamp(9px,1.6vw,13px)', letterSpacing: 10,
        color: 'rgba(100,160,255,0.5)', marginBottom: 28, textTransform: 'uppercase'
      }}>The Digital Frontier Awaits</div>

      {/* Divider */}
      <div ref={addRef(3)} style={{
        ...reveal(200),
        width: 160, height: 1,
        background: 'linear-gradient(90deg,transparent,#00ffc8,transparent)',
        margin: '0 auto 28px'
      }}/>

      {/* Desc */}
      <p ref={addRef(4)} style={{
        ...reveal(350),
        fontSize: 16, lineHeight: 1.9,
        color: 'rgba(170,210,255,0.68)',
        maxWidth: 560, marginBottom: 44, fontWeight: 300
      }}>
        An immersive multiplayer metaverse built on Spring Boot — real-time worlds,
        AI-guided companions, and infinite digital existence.
      </p>

      {/* Buttons */}
      <div ref={addRef(5)} style={{ ...reveal(500), display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onMouseEnter={playHover}
          onClick={handleLaunch}
          style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: 12,
            letterSpacing: 2, padding: '13px 34px',
            background: '#00ffc8', color: '#000', border: 'none',
            cursor: 'pointer', textTransform: 'uppercase', fontWeight: 700,
            clipPath: 'polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)',
            transition: 'all 0.3s'
          }}
          onMouseOver={e => { e.target.style.background='#00e8b5'; e.target.style.boxShadow='0 0 36px rgba(0,255,200,0.4)'; e.target.style.transform='translateY(-2px)' }}
          onMouseOut={e => { e.target.style.background='#00ffc8'; e.target.style.boxShadow='none'; e.target.style.transform='none' }}
        >
          {user ? 'Enter Worlds' : 'Launch Platform'}
        </button>

        <button
          onMouseEnter={playHover}
          onClick={handleExplore}
          style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: 12,
            letterSpacing: 2, padding: '13px 34px',
            background: 'transparent', color: '#0080ff',
            border: '1px solid rgba(0,128,255,0.4)',
            cursor: 'pointer', textTransform: 'uppercase',
            clipPath: 'polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)',
            transition: 'all 0.3s'
          }}
          onMouseOver={e => { e.target.style.background='rgba(0,128,255,0.1)'; e.target.style.transform='translateY(-2px)' }}
          onMouseOut={e => { e.target.style.background='transparent'; e.target.style.transform='none' }}
        >
          {user ? 'Dashboard' : 'Explore API'}
        </button>
      </div>
    </section>
  )
}
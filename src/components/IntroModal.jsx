import { useEffect, useRef, useState } from 'react'
import { playIntro, playTypeTone, playClick } from '../audio/audioEngine'

export default function IntroModal({ onEnter }) {
  const [logoText, setLogoText] = useState('')
  const [lineWidth, setLineWidth] = useState('0px')
  const [showSub, setShowSub] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const [showBtn, setShowBtn] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [ring1, setRing1] = useState(false)
  const [ring2, setRing2] = useState(false)
  const [ring3, setRing3] = useState(false)
  const played = useRef(false)

  useEffect(() => {
    if (played.current) return
    played.current = true

    playIntro()

    setTimeout(() => setRing1(true), 380)
    setTimeout(() => setRing2(true), 640)
    setTimeout(() => setRing3(true), 900)

    setTimeout(() => {
      const txt = 'NEXAVERSE'
      let i = 0
      setLogoText('')
      const iv = setInterval(() => {
        if (i < txt.length) {
          const idx = i
          setLogoText(txt.slice(0, idx + 1))
          playTypeTone(idx)
          i++
        } else {
          clearInterval(iv)
        }
      }, 78)
    }, 1050)

    setTimeout(() => setLineWidth('195px'), 1920)
    setTimeout(() => setShowSub(true), 2340)
    setTimeout(() => setShowQuote(true), 2780)
    setTimeout(() => {
      setShowBtn(true)
      setShowHint(true)
    }, 3500)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter') handleEnter()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  function handleEnter() {
    playClick()
    onEnter()
  }

  const corners = [
    { k: 'tl', v1: 'top', v2: 'left', b1: 'borderTop', b2: 'borderLeft' },
    { k: 'tr', v1: 'top', v2: 'right', b1: 'borderTop', b2: 'borderRight' },
    { k: 'bl', v1: 'bottom', v2: 'left', b1: 'borderBottom', b2: 'borderLeft' },
    { k: 'br', v1: 'bottom', v2: 'right', b1: 'borderBottom', b2: 'borderRight' },
  ]

  const ringList = [
    { id: 'ir1', size: 58, col: 'rgba(0,255,200,0.7)', shadow: 'rgba(0,255,200,0.28)', active: ring1 },
    { id: 'ir2', size: 98, col: 'rgba(0,128,255,0.45)', shadow: '', active: ring2 },
    { id: 'ir3', size: 138, col: 'rgba(255,60,172,0.3)', shadow: '', active: ring3 },
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(12px)'
    }}>
      <div style={{
        position: 'relative',
        width: 'min(500px,88vw)',
        padding: '46px 40px 36px',
        border: '1px solid rgba(0,255,200,0.3)',
        background: 'rgba(2,4,14,0.99)',
        clipPath: 'polygon(0 0,calc(100% - 26px) 0,100% 26px,100% 100%,26px 100%,0 calc(100% - 26px))'
      }}>

        {/* Corner accents */}
        {corners.map(({ k, v1, v2, b1, b2 }) => (
          <div key={k} style={{
            position: 'absolute', width: 14, height: 14,
            [v1]: 0, [v2]: 0,
            [b1]: '2px solid #00ffc8',
            [b2]: '2px solid #00ffc8'
          }} />
        ))}

        {/* Scan line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg,transparent,rgba(0,255,200,0.45),transparent)',
          animation: 'bscan 3s linear infinite',
          pointerEvents: 'none'
        }} />

        {/* Rings */}
        <div style={{
          position: 'relative', height: 120,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24
        }}>
          {ringList.map(r => (
            <div key={r.id} style={{
              position: 'absolute',
              borderRadius: '50%',
              width: r.size,
              height: r.size,
              border: r.active ? `1px solid ${r.col}` : '1px solid transparent',
              boxShadow: r.active && r.shadow ? `0 0 18px ${r.shadow}` : 'none',
              transition: 'all 0.7s ease'
            }} />
          ))}
          <svg viewBox="0 0 60 60" fill="none" width="46" height="46" style={{ position: 'absolute' }}>
            <polygon points="30,2 55,16 55,44 30,58 5,44 5,16" stroke="#00ffc8" strokeWidth="1" fill="rgba(0,255,200,0.06)" />
            <polygon points="30,10 47,20 47,40 30,50 13,40 13,20" stroke="#0080ff" strokeWidth="0.5" fill="none" />
          </svg>
        </div>

        {/* Logo */}
        <div style={{
          fontFamily: "'Orbitron',monospace",
          fontWeight: 900,
          fontSize: 'clamp(18px,3.5vw,32px)',
          letterSpacing: 6,
          color: '#fff',
          textAlign: 'center',
          minHeight: 48,
          marginBottom: 8,
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}>
          {logoText}
        </div>

        {/* Line */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg,transparent,#00ffc8,transparent)',
          width: lineWidth,
          margin: '0 auto 12px',
          transition: 'width 0.9s cubic-bezier(0.16,1,0.3,1)'
        }} />

        {/* Sub */}
        <div style={{
          fontFamily: "'Orbitron',monospace",
          fontSize: 9,
          letterSpacing: 10,
          color: 'rgba(0,200,255,0.45)',
          textAlign: 'center',
          marginBottom: 18,
          textTransform: 'uppercase',
          opacity: showSub ? 1 : 0,
          transition: 'opacity 0.6s'
        }}>
          Digital Reality Engine
        </div>

        {/* Quote */}
        <div style={{
          fontFamily: "'Share Tech Mono',monospace",
          fontSize: 12,
          letterSpacing: 1.5,
          color: 'rgba(0,255,200,0.62)',
          textAlign: 'center',
          lineHeight: 1.95,
          marginBottom: 28,
          padding: '0 8px',
          opacity: showQuote ? 1 : 0,
          transition: 'opacity 1s'
        }}>
          "The frontier between real and digital<br />
          has always been a myth.<br />
          Welcome to the world beyond it."
        </div>

        {/* Enter button */}
        <button
          onClick={handleEnter}
          style={{
            width: '100%',
            fontFamily: "'Share Tech Mono',monospace",
            fontSize: 12,
            letterSpacing: 3,
            padding: 14,
            border: '1px solid #00ffc8',
            color: '#00ffc8',
            background: 'transparent',
            cursor: 'pointer',
            textTransform: 'uppercase',
            clipPath: 'polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)',
            opacity: showBtn ? 1 : 0,
            transition: 'opacity 0.8s'
          }}
        >
          [ ENTER THE NEXAVERSE ]
        </button>

        {/* Hint */}
        <div style={{
          fontFamily: "'Share Tech Mono',monospace",
          fontSize: 10,
          letterSpacing: 3,
          color: 'rgba(0,255,200,0.35)',
          textAlign: 'center',
          marginTop: 12,
          animation: 'blink 1.6s ease-in-out infinite',
          opacity: showHint ? 0.55 : 0
        }}>
          PRESS ENTER OR CLICK ABOVE
        </div>

      </div>
    </div>
  )
}

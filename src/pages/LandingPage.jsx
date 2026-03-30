import { useState, useEffect } from 'react'
import useThemeStore from '../store/themeStore'
import { playKey } from '../audio/audioEngine'
import CyberBg from '../backgrounds/CyberBg'
import NatureBg from '../backgrounds/NatureBg'
import DestroyBg from '../backgrounds/DestroyBg'
import useAuthStore from '../store/authStore'
import IntroModal from '../components/IntroModal'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ThreeScene from '../components/ThreeScene'
import StatsBar from '../components/StatsBar'
import Features from '../components/Features'
import Companions from '../components/Companions'
import TechStack from '../components/TechStack'
import Footer from '../components/Footer'

// Nature quotes
const QUOTES = [
  '"In every walk with nature, one receives far more than he seeks." — John Muir',
  '"The earth has music for those who listen." — Shakespeare',
  '"Look deep into nature and you will understand everything better." — Einstein',
  '"The clearest way into the universe is through a forest wilderness." — John Muir',
  '"In the woods, we return to reason and faith." — Emerson',
  '"To walk in nature is to witness a thousand miracles." — Mary Davis',
]

export default function LandingPage() {
  const { user } = useAuthStore()
  const [showIntro, setShowIntro] = useState(() => {
    return !localStorage.getItem('nexaverse_token')
  })
  const [siteVisible, setSiteVisible] = useState(() => !!localStorage.getItem('nexaverse_token'))
  const [quote, setQuote] = useState(QUOTES[0])
  const [quoteVisible, setQuoteVisible] = useState(false)
  const [quoteIdx, setQuoteIdx] = useState(0)
  const theme = useThemeStore(s => s.theme)

  // Enter site handler
  function handleEnter() {
    setShowIntro(false)
    setSiteVisible(true)
  }
// Auto redirect to worlds if logged in
const handleLaunch = () => {
  playClick()
  if (user) {
    navigate('/worlds')
  } else {
    navigate('/login')
  }
}
  // Keypress ripple + sound effect
  useEffect(() => {
    if (!siteVisible) return
    const themeColors = { cyber: '#00ffc8', nature: '#60ff90', destroy: '#ff4422' }

    function onKey(e) {
      playKey(e.key.length === 1 ? e.key : 'X')
      const col = themeColors[theme] || '#00ffc8'

      // Ripple
      const rip = document.createElement('div')
      rip.style.cssText = `
        position:fixed; pointer-events:none; z-index:9500;
        border-radius:50%; border:1.5px solid ${col};
        width:36px; height:36px;
        left:${window.lmX || window.innerWidth/2}px;
        top:${window.lmY || window.innerHeight/2}px;
        margin-left:-18px; margin-top:-18px;
        animation:rout .55s ease-out forwards;
      `
      document.body.appendChild(rip)
      setTimeout(() => rip.remove(), 600)

      // Floating char
      if (e.key.length === 1) {
        const ch = document.createElement('div')
        ch.style.cssText = `
          position:fixed; pointer-events:none; z-index:9501;
          font-family:'Orbitron',monospace; font-size:13px; font-weight:700;
          color:${col}; text-shadow:0 0 8px ${col};
          left:${(window.lmX || window.innerWidth/2) + Math.random()*24 - 12}px;
          top:${(window.lmY || window.innerHeight/2) - 14}px;
          animation:cup .7s ease-out forwards;
        `
        ch.textContent = e.key.toUpperCase()
        document.body.appendChild(ch)
        setTimeout(() => ch.remove(), 750)
      }
    }

    function onMouseMove(e) {
      window.lmX = e.clientX
      window.lmY = e.clientY
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [siteVisible, theme])

  // Nature quotes cycling
  useEffect(() => {
    if (theme !== 'nature') { setQuoteVisible(false); return }
    setQuoteVisible(false)
    setTimeout(() => {
      setQuote(QUOTES[quoteIdx % QUOTES.length])
      setQuoteVisible(true)
    }, 800)
    const timer = setTimeout(() => {
      setQuoteIdx(prev => prev + 1)
    }, 14000)
    return () => clearTimeout(timer)
  }, [theme, quoteIdx])

  // Scanline style per theme
  const scanlineStyle = {
    cyber:   'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,200,0.012) 3px,rgba(0,255,200,0.012) 4px)',
    nature:  'repeating-linear-gradient(0deg,transparent,transparent 5px,rgba(80,200,100,0.007) 5px,rgba(80,200,100,0.007) 6px)',
    destroy: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,30,0,0.02) 2px,rgba(255,30,0,0.02) 3px)',
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>

      {/* ── BACKGROUNDS ── */}
      <CyberBg />
      <NatureBg />
      <DestroyBg />

      {/* ── SCANLINES ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none',
        background: scanlineStyle[theme] || scanlineStyle.cyber,
        animation: theme !== 'nature' ? 'scan 6s linear infinite' : 'none'
      }} />

      {/* ── NATURE QUOTES ── */}
      {theme === 'nature' && (
        <div style={{
          position: 'fixed', bottom: 36, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 6, pointerEvents: 'none',
          textAlign: 'center', width: '90%', maxWidth: 620,
          opacity: quoteVisible ? 1 : 0, transition: 'opacity 1.2s'
        }}>
          <p style={{
            fontFamily: "'Cinzel',serif", fontSize: 14,
            color: 'rgba(160,255,190,0.6)',
            letterSpacing: 2, fontStyle: 'italic', lineHeight: 1.8
          }}>{quote}</p>
        </div>
      )}

      {/* ── INTRO MODAL ── */}
      {showIntro && <IntroModal onEnter={handleEnter} />}

      {/* ── MAIN SITE ── */}
      <div style={{
        opacity: siteVisible ? 1 : 0,
        transition: 'opacity 1.2s ease',
        position: 'relative',
        zIndex: 5,
        minHeight: '100vh'
      }}>
        <Navbar />
        <Hero />
        <ThreeScene />
        <StatsBar />
        <Features />
        <Companions />
        <TechStack />
        <Footer />
      </div>

    </div>
  )
}
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../api/axiosConfig'

export default function DashboardPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ worlds: 0, avatars: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [worldsRes, avatarsRes] = await Promise.all([
          api.get('/api/worlds'),
          api.get('/api/avatars'),
        ])
        setStats({
          worlds: worldsRes.data.data?.length || 0,
          avatars: avatarsRes.data.data?.length || 0,
        })
      } catch (err) {
        console.error('Stats fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
  }

  const cards = [
    { label: 'Worlds', value: stats.worlds, icon: '🌐', path: '/worlds', color: '#00ffc8' },
    { label: 'Avatars', value: stats.avatars, icon: '⚔️', path: '/avatars', color: '#0080ff' },
    { label: 'AI Companions', value: 2, icon: '🤖', path: '/dashboard', color: '#ff3cac' },
    { label: 'Events/sec', value: '9.4K', icon: '⚡', path: '/dashboard', color: '#00ffc8' },
  ]

  return (
    <div style={{
      minHeight: '100vh', background: '#020408', color: '#e0f0ff',
      fontFamily: "'Rajdhani',sans-serif",
      backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 52px,rgba(0,255,200,0.025) 52px,rgba(0,255,200,0.025) 53px),repeating-linear-gradient(90deg,transparent,transparent 52px,rgba(0,255,200,0.025) 52px,rgba(0,255,200,0.025) 53px)'
    }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '15px 48px', borderBottom: '1px solid rgba(0,255,200,0.1)',
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 20, color: '#00ffc8', letterSpacing: 4 }}>
            NEXA<span style={{ color: '#0080ff' }}>VERSE</span>
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 12, color: 'rgba(0,255,200,0.6)', letterSpacing: 2 }}>
            👤 {user?.username || 'Warrior'}
          </div>
          <button onClick={handleLogout} style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: 11,
            letterSpacing: 2, padding: '7px 16px',
            border: '1px solid rgba(255,60,60,0.4)', color: 'rgba(255,100,100,0.8)',
            background: 'transparent', cursor: 'pointer', textTransform: 'uppercase',
            transition: 'all 0.3s'
          }}
            onMouseOver={e => { e.target.style.background = 'rgba(255,40,40,0.1)'; e.target.style.borderColor = 'rgba(255,60,60,0.8)' }}
            onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(255,60,60,0.4)' }}
          >Logout</button>
        </div>
      </nav>

      <div style={{ padding: '48px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Welcome */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, letterSpacing: 4, color: '#0080ff', textTransform: 'uppercase', marginBottom: 10 }}>
            // Welcome back
          </div>
          <h1 style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 'clamp(24px,4vw,42px)', color: '#e0f0ff', letterSpacing: 4, marginBottom: 8 }}>
            {user?.username?.toUpperCase() || 'WARRIOR'}
          </h1>
          <div style={{ width: 60, height: 2, background: '#00ffc8' }} />
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 48 }}>
          {cards.map((card) => (
            <Link key={card.label} to={card.path} style={{ textDecoration: 'none' }}>
              <div
                onMouseOver={e => { e.currentTarget.style.borderColor = card.color; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(0,255,200,0.12)'; e.currentTarget.style.transform = 'none' }}
                style={{
                  background: 'rgba(6,12,28,0.95)', border: '1px solid rgba(0,255,200,0.12)',
                  padding: '28px 24px', transition: 'all 0.3s', cursor: 'pointer',
                  clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))'
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{card.icon}</div>
                <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: 32, color: card.color, marginBottom: 6 }}>
                  {loading ? '...' : card.value}
                </div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, letterSpacing: 2, color: 'rgba(150,200,255,0.5)', textTransform: 'uppercase' }}>
                  {card.label}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, letterSpacing: 4, color: '#0080ff', textTransform: 'uppercase', marginBottom: 20 }}>
            // Quick Actions
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'Browse Worlds', path: '/worlds', color: '#00ffc8' },
              { label: 'My Avatars', path: '/avatars', color: '#0080ff' },
              { label: 'Talk to MIMIR', path: '/dashboard', color: '#ff3cac' },
            ].map(btn => (
              <Link key={btn.label} to={btn.path} style={{ textDecoration: 'none' }}>
                <button style={{
                  fontFamily: "'Share Tech Mono',monospace", fontSize: 12, letterSpacing: 2,
                  padding: '11px 28px', border: `1px solid ${btn.color}44`,
                  color: btn.color, background: 'transparent', cursor: 'pointer',
                  textTransform: 'uppercase', transition: 'all 0.3s',
                  clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)'
                }}
                  onMouseOver={e => { e.target.style.background = btn.color + '18' }}
                  onMouseOut={e => { e.target.style.background = 'transparent' }}
                >{btn.label}</button>
              </Link>
            ))}
          </div>
        </div>

        {/* AI Companions */}
        <div>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, letterSpacing: 4, color: '#0080ff', textTransform: 'uppercase', marginBottom: 20 }}>
            // AI Companions
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { name: 'MIMIR', tag: '⚔ God of War', color: '#00aaff', border: 'rgba(0,128,255,0.22)', bg: 'rgba(0,12,44,0.9)', quote: '"The smartest entity in NexaVerse — ask me anything, brother."' },
              { name: 'GUANYIN', tag: '🐉 Black Myth', color: '#ff3cac', border: 'rgba(255,60,172,0.22)', bg: 'rgba(28,0,36,0.9)', quote: '"Every question holds the seed of wisdom. Speak, warrior."' },
            ].map(c => (
              <div key={c.name} style={{
                padding: '24px', border: `1px solid ${c.border}`,
                background: c.bg, transition: 'all 0.3s',
                clipPath: 'polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px))'
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none' }}
              >
                <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 18, letterSpacing: 3, color: c.color, marginBottom: 6 }}>{c.name}</div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: 2, color: 'rgba(180,180,220,0.45)', marginBottom: 12, textTransform: 'uppercase' }}>{c.tag}</div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, fontStyle: 'italic', color: 'rgba(180,210,255,0.6)', lineHeight: 1.7 }}>{c.quote}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
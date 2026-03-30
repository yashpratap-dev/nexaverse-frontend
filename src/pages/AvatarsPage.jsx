import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosConfig'
import useAuthStore from '../store/authStore'

export default function AvatarsPage() {
  const { user } = useAuthStore()
  const [avatars, setAvatars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAvatars() {
      try {
        const res = await api.get('/api/avatars')
        setAvatars(res.data.data || [])
      } catch (err) {
        setError('Avatars load nahi hue! Backend check karo.')
      } finally {
        setLoading(false)
      }
    }
    fetchAvatars()
  }, [])

  const typeColors = {
    WARRIOR: '#ff4444', MAGE: '#aa44ff', RANGER: '#44ffaa',
    ROGUE: '#ffaa00', DEFAULT: '#00ffc8'
  }

  const typeIcons = {
    WARRIOR: '⚔️', MAGE: '🔮', RANGER: '🏹', ROGUE: '🗡️', DEFAULT: '👤'
  }

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
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/dashboard" style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: 'rgba(150,200,255,0.55)', textDecoration: 'none', letterSpacing: 2 }}>Dashboard</Link>
          <Link to="/worlds" style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: 'rgba(150,200,255,0.55)', textDecoration: 'none', letterSpacing: 2 }}>Worlds</Link>
        </div>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 12, color: 'rgba(0,255,200,0.6)', letterSpacing: 2 }}>
          👤 {user?.username}
        </div>
      </nav>

      <div style={{ padding: '48px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, letterSpacing: 4, color: '#0080ff', textTransform: 'uppercase', marginBottom: 10 }}>// Avatar Registry</div>
          <h1 style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 'clamp(22px,4vw,38px)', color: '#e0f0ff', letterSpacing: 4, marginBottom: 10 }}>ALL AVATARS</h1>
          <div style={{ width: 56, height: 2, background: '#0080ff' }} />
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Share Tech Mono',monospace", fontSize: 14, color: 'rgba(0,255,200,0.5)', letterSpacing: 3 }}>
            LOADING AVATARS...
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(255,40,40,0.1)', border: '1px solid rgba(255,40,40,0.3)', color: 'rgba(255,120,120,0.9)', padding: '16px 20px', fontFamily: "'Share Tech Mono',monospace", fontSize: 13, marginBottom: 24 }}>
            {error}
          </div>
        )}

        {/* Avatars Grid */}
        {!loading && !error && (
          <>
            {avatars.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Share Tech Mono',monospace", fontSize: 13, color: 'rgba(150,200,255,0.4)', letterSpacing: 2 }}>
                No avatars found. Create one from your backend!
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
                {avatars.map((avatar) => {
                  const col = typeColors[avatar.avatarType] || typeColors.DEFAULT
                  const icon = typeIcons[avatar.avatarType] || typeIcons.DEFAULT
                  return (
                    <div key={avatar.id}
                      onMouseOver={e => { e.currentTarget.style.borderColor = col; e.currentTarget.style.transform = 'translateY(-4px)' }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(0,255,200,0.12)'; e.currentTarget.style.transform = 'none' }}
                      style={{
                        background: 'rgba(6,12,28,0.95)', border: '1px solid rgba(0,255,200,0.12)',
                        padding: '28px 24px', transition: 'all 0.35s',
                        clipPath: 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))'
                      }}
                    >
                      {/* Icon + Type */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ fontSize: 28 }}>{icon}</div>
                        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: 2, color: col, border: `1px solid ${col}44`, padding: '3px 10px', textTransform: 'uppercase' }}>
                          {avatar.avatarType || 'UNKNOWN'}
                        </div>
                      </div>

                      {/* Name */}
                      <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: 16, color: '#e0f0ff', letterSpacing: 2, marginBottom: 16 }}>
                        {avatar.name}
                      </div>

                      {/* Stats */}
                      <div style={{ display: 'flex', gap: 20 }}>
                        <div>
                          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: 'rgba(150,200,255,0.4)', letterSpacing: 1, marginBottom: 3 }}>LEVEL</div>
                          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 20, fontWeight: 700, color: col }}>{avatar.level || 1}</div>
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: 'rgba(150,200,255,0.4)', letterSpacing: 1, marginBottom: 3 }}>POSITION</div>
                          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 12, color: 'rgba(180,210,255,0.6)' }}>
                            X:{avatar.positionX?.toFixed(1) || 0} Y:{avatar.positionY?.toFixed(1) || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
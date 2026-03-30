import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'
import useAuthStore from '../store/authStore'

export default function WorldsPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [worlds, setWorlds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchWorlds() {
      try {
        const res = await api.get('/api/worlds')
        setWorlds(res.data.data || [])
      } catch (err) {
        setError('Worlds load nahi hue! Backend check karo.')
      } finally {
        setLoading(false)
      }
    }
    fetchWorlds()
  }, [])

  const typeColors = {
    FOREST: '#40ff80', CITY: '#0080ff', DESERT: '#ffaa00',
    OCEAN: '#00ccff', DUNGEON: '#ff3cac', DEFAULT: '#00ffc8'
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#020408', color: '#e0f0ff',
      fontFamily: "'Rajdhani',sans-serif",
      backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 52px,rgba(0,255,200,0.025) 52px,rgba(0,255,200,0.025) 53px),repeating-linear-gradient(90deg,transparent,transparent 52px,rgba(0,255,200,0.025) 52px,rgba(0,255,200,0.025) 53px)'
    }}>

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
          <Link to="/avatars" style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: 'rgba(150,200,255,0.55)', textDecoration: 'none', letterSpacing: 2 }}>Avatars</Link>
        </div>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 12, color: 'rgba(0,255,200,0.6)', letterSpacing: 2 }}>
          👤 {user?.username}
        </div>
      </nav>

      <div style={{ padding: '48px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, letterSpacing: 4, color: '#0080ff', textTransform: 'uppercase', marginBottom: 10 }}>// World Registry</div>
          <h1 style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 'clamp(22px,4vw,38px)', color: '#e0f0ff', letterSpacing: 4, marginBottom: 10 }}>ACTIVE WORLDS</h1>
          <div style={{ width: 56, height: 2, background: '#00ffc8' }} />
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Share Tech Mono',monospace", fontSize: 14, color: 'rgba(0,255,200,0.5)', letterSpacing: 3 }}>
            LOADING WORLDS...
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(255,40,40,0.1)', border: '1px solid rgba(255,40,40,0.3)', color: 'rgba(255,120,120,0.9)', padding: '16px 20px', fontFamily: "'Share Tech Mono',monospace", fontSize: 13, marginBottom: 24 }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {worlds.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Share Tech Mono',monospace", fontSize: 13, color: 'rgba(150,200,255,0.4)', letterSpacing: 2 }}>
                No worlds found. Create one from your backend!
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
                {worlds.map((world) => {
                  const col = typeColors[world.worldType] || typeColors.DEFAULT
                  return (
                    <div key={world.id}
                      onMouseOver={e => { e.currentTarget.style.borderColor = col; e.currentTarget.style.transform = 'translateY(-4px)' }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(0,255,200,0.12)'; e.currentTarget.style.transform = 'none' }}
                      style={{
                        background: 'rgba(6,12,28,0.95)', border: '1px solid rgba(0,255,200,0.12)',
                        padding: '28px 24px', transition: 'all 0.35s',
                        clipPath: 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))'
                      }}
                    >
                      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: 2, color: col, border: `1px solid ${col}44`, padding: '3px 10px', display: 'inline-block', marginBottom: 14, textTransform: 'uppercase' }}>
                        {world.worldType || 'UNKNOWN'}
                      </div>

                      <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: 16, color: '#e0f0ff', letterSpacing: 2, marginBottom: 12 }}>
                        {world.name}
                      </div>

                      <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                        <div>
                          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: 'rgba(150,200,255,0.4)', letterSpacing: 1, marginBottom: 3 }}>MAX PLAYERS</div>
                          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 16, fontWeight: 700, color: col }}>{world.maxPlayers}</div>
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: 'rgba(150,200,255,0.4)', letterSpacing: 1, marginBottom: 3 }}>STATUS</div>
                          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 13, color: world.active ? '#40ff80' : 'rgba(255,100,100,0.7)' }}>
                            {world.active ? '● ONLINE' : '○ OFFLINE'}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/worlds/${world.id}/room`)}
                        style={{
                          width: '100%', padding: '10px',
                          fontFamily: "'Share Tech Mono',monospace", fontSize: 11,
                          letterSpacing: 2, border: `1px solid ${col}`,
                          color: col, background: 'transparent',
                          cursor: 'pointer', textTransform: 'uppercase',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={e => { e.target.style.background = col + '22'; e.target.style.boxShadow = `0 0 20px ${col}44` }}
                        onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.boxShadow = 'none' }}
                      >
                        Enter World →
                      </button>
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

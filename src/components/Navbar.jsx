import { useNavigate, Link } from 'react-router-dom'
import { playHover, playClick } from '../audio/audioEngine'
import useThemeStore from '../store/themeStore'
import useAuthStore from '../store/authStore'

export default function Navbar() {
  const { theme, setTheme } = useThemeStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    playClick()
    logout()
    navigate('/')
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '15px 48px',
      borderBottom: '1px solid rgba(0,255,200,0.1)',
      background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)'
    }}>

      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{
          fontFamily: "'Orbitron',monospace", fontWeight: 900,
          fontSize: 20, color: '#00ffc8', letterSpacing: 4,
          textShadow: '0 0 20px rgba(0,255,200,0.35)'
        }}>
          NEXA<span style={{ color: '#0080ff' }}>VERSE</span>
        </div>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: 28 }}>
        {[
          { label: 'Worlds',    path: '/worlds' },
          { label: 'Avatars',   path: '/avatars' },
          { label: 'AI Chat',   path: '/ai-chat' },
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Monitor',   path: '/monitor' },
        ].map(link => (
          <Link
            key={link.label}
            to={link.path}
            onMouseEnter={playHover}
            style={{
              fontFamily: "'Share Tech Mono',monospace", fontSize: 11,
              color: 'rgba(150,200,255,0.55)', textDecoration: 'none',
              letterSpacing: 2, textTransform: 'uppercase',
              transition: 'color 0.3s', paddingBottom: 2,
              borderBottom: '1px solid transparent'
            }}
            onMouseOver={e => {
              e.target.style.color = '#00ffc8'
              e.target.style.borderBottomColor = 'rgba(0,255,200,0.4)'
            }}
            onMouseOut={e => {
              e.target.style.color = 'rgba(150,200,255,0.55)'
              e.target.style.borderBottomColor = 'transparent'
            }}
          >{link.label}</Link>
        ))}
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

        {/* Theme Buttons */}
        {[
          { id: 'nature',  label: '🌿 Fairytale' },
          { id: 'destroy', label: '🔥 Hell' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { playClick(); setTheme(theme === t.id ? 'cyber' : t.id) }}
            onMouseEnter={playHover}
            style={{
              fontFamily: "'Share Tech Mono',monospace", fontSize: 10,
              letterSpacing: 2, padding: '7px 14px', border: '1px solid',
              borderColor: t.id === 'nature'
                ? (theme === 'nature' ? 'rgba(100,240,140,1)' : 'rgba(80,200,120,0.5)')
                : (theme === 'destroy' ? 'rgba(240,60,20,1)' : 'rgba(200,40,20,0.5)'),
              color: t.id === 'nature'
                ? (theme === 'nature' ? '#80ffaa' : 'rgba(120,230,160,0.7)')
                : (theme === 'destroy' ? '#ff5522' : 'rgba(220,80,40,0.7)'),
              background: theme === t.id
                ? (t.id === 'nature' ? 'rgba(40,120,60,0.3)' : 'rgba(140,20,10,0.4)')
                : 'rgba(0,0,0,0.8)',
              cursor: 'pointer', textTransform: 'uppercase',
              transition: 'all 0.3s'
            }}
          >{t.label}</button>
        ))}

        {/* Auth */}
        {user ? (
          <>
            <div style={{
              fontFamily: "'Share Tech Mono',monospace", fontSize: 11,
              color: 'rgba(0,255,200,0.6)', letterSpacing: 2, padding: '0 8px'
            }}>
              👤 {user.username}
            </div>
            <button
              onClick={handleLogout}
              onMouseEnter={playHover}
              style={{
                fontFamily: "'Share Tech Mono',monospace", fontSize: 11,
                letterSpacing: 2, padding: '7px 16px',
                border: '1px solid rgba(255,60,60,0.4)',
                color: 'rgba(255,100,100,0.8)',
                background: 'transparent', cursor: 'pointer',
                textTransform: 'uppercase', transition: 'all 0.3s'
              }}
              onMouseOver={e => { e.target.style.background = 'rgba(255,40,40,0.1)' }}
              onMouseOut={e => { e.target.style.background = 'transparent' }}
            >Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button
                onMouseEnter={playHover} onClick={playClick}
                style={{
                  fontFamily: "'Share Tech Mono',monospace", fontSize: 11,
                  letterSpacing: 2, padding: '7px 16px',
                  border: '1px solid rgba(0,255,200,0.4)',
                  color: '#00ffc8', background: 'transparent',
                  cursor: 'pointer', textTransform: 'uppercase',
                  transition: 'all 0.3s',
                  clipPath: 'polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%)'
                }}
                onMouseOver={e => { e.target.style.background = 'rgba(0,255,200,0.1)' }}
                onMouseOut={e => { e.target.style.background = 'transparent' }}
              >Login</button>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button
                onMouseEnter={playHover} onClick={playClick}
                style={{
                  fontFamily: "'Share Tech Mono',monospace", fontSize: 11,
                  letterSpacing: 2, padding: '7px 16px',
                  background: '#00ffc8', color: '#000',
                  border: 'none', cursor: 'pointer',
                  textTransform: 'uppercase', fontWeight: 700,
                  transition: 'all 0.3s',
                  clipPath: 'polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%)'
                }}
                onMouseOver={e => { e.target.style.background = '#00e8b5' }}
                onMouseOut={e => { e.target.style.background = '#00ffc8' }}
              >Register</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
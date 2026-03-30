import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../api/authApi'
import useAuthStore from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth, setLoading, setError, isLoading, error, clearError } = useAuthStore()
  const [form, setForm] = useState({ username: '', password: '' })

  function handleChange(e) {
    clearError()
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('Username aur password dono bharo!')
      return
    }
    setLoading(true)
    try {
        console.log('Sending:', form)
      const res = await loginUser(form)
      const { token, username } = res.data.data
      const role = 'USER'
      setAuth({ username, role }, token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed! Check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#020408',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Rajdhani',sans-serif",
      backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 52px,rgba(0,255,200,0.03) 52px,rgba(0,255,200,0.03) 53px),repeating-linear-gradient(90deg,transparent,transparent 52px,rgba(0,255,200,0.03) 52px,rgba(0,255,200,0.03) 53px)'
    }}>
      <div style={{
        width: 'min(420px,90vw)', padding: '44px 40px',
        border: '1px solid rgba(0,255,200,0.25)',
        background: 'rgba(2,4,14,0.97)',
        clipPath: 'polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))',
        position: 'relative'
      }}>
        {/* Corner accents */}
        {[['top','left','borderTop','borderLeft'],['top','right','borderTop','borderRight'],['bottom','left','borderBottom','borderLeft'],['bottom','right','borderBottom','borderRight']].map(([v1,v2,b1,b2],i) => (
          <div key={i} style={{ position:'absolute', width:12, height:12, [v1]:0, [v2]:0, [b1]:'2px solid #00ffc8', [b2]:'2px solid #00ffc8' }} />
        ))}

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:22, color:'#00ffc8', letterSpacing:4, marginBottom:6 }}>
            NEXA<span style={{ color:'#0080ff' }}>VERSE</span>
          </div>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, letterSpacing:3, color:'rgba(0,200,255,0.45)', textTransform:'uppercase' }}>
            Access Terminal
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background:'rgba(255,40,40,0.1)', border:'1px solid rgba(255,40,40,0.3)',
            color:'rgba(255,120,120,0.9)', padding:'10px 14px',
            fontFamily:"'Share Tech Mono',monospace", fontSize:12,
            marginBottom:20, letterSpacing:1
          }}>{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom:20 }}>
            <label style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, letterSpacing:2, color:'rgba(0,255,200,0.6)', textTransform:'uppercase', display:'block', marginBottom:8 }}>
              Username
            </label>
            <input
              name="username" value={form.username} onChange={handleChange}
              placeholder="Enter username"
              style={{
                width:'100%', padding:'12px 14px',
                background:'rgba(0,255,200,0.04)',
                border:'1px solid rgba(0,255,200,0.2)',
                color:'#e0f0ff', fontFamily:"'Rajdhani',sans-serif", fontSize:15,
                outline:'none', boxSizing:'border-box',
                transition:'border-color 0.3s'
              }}
              onFocus={e => e.target.style.borderColor='rgba(0,255,200,0.6)'}
              onBlur={e => e.target.style.borderColor='rgba(0,255,200,0.2)'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom:28 }}>
            <label style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, letterSpacing:2, color:'rgba(0,255,200,0.6)', textTransform:'uppercase', display:'block', marginBottom:8 }}>
              Password
            </label>
            <input
              name="password" type="password" value={form.password} onChange={handleChange}
              placeholder="Enter password"
              style={{
                width:'100%', padding:'12px 14px',
                background:'rgba(0,255,200,0.04)',
                border:'1px solid rgba(0,255,200,0.2)',
                color:'#e0f0ff', fontFamily:"'Rajdhani',sans-serif", fontSize:15,
                outline:'none', boxSizing:'border-box',
                transition:'border-color 0.3s'
              }}
              onFocus={e => e.target.style.borderColor='rgba(0,255,200,0.6)'}
              onBlur={e => e.target.style.borderColor='rgba(0,255,200,0.2)'}
            />
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={isLoading}
            style={{
              width:'100%', padding:'13px',
              background: isLoading ? 'rgba(0,200,150,0.5)' : '#00ffc8',
              color:'#000', border:'none', cursor: isLoading ? 'not-allowed' : 'pointer',
              fontFamily:"'Share Tech Mono',monospace", fontSize:12,
              letterSpacing:3, textTransform:'uppercase', fontWeight:700,
              clipPath:'polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)',
              transition:'all 0.3s'
            }}
          >
            {isLoading ? 'CONNECTING...' : 'LOGIN →'}
          </button>
        </form>

        {/* Register link */}
        <div style={{ textAlign:'center', marginTop:24, fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:'rgba(150,200,255,0.5)', letterSpacing:1 }}>
          No account?{' '}
          <Link to="/register" style={{ color:'#00ffc8', textDecoration:'none' }}>
            Register here
          </Link>
        </div>

        {/* Back to home */}
        <div style={{ textAlign:'center', marginTop:12 }}>
          <Link to="/" style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'rgba(100,150,200,0.4)', textDecoration:'none', letterSpacing:1 }}>
            ← Back to NexaVerse
          </Link>
        </div>
      </div>
    </div>
  )
}
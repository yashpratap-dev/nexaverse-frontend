import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../api/authApi'
import useAuthStore from '../store/authStore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setLoading, setError, isLoading, error, clearError } = useAuthStore()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })

  function handleChange(e) {
    clearError()
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.username || !form.email || !form.password) {
      setError('Sab fields bharo!')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords match nahi kar rahe!')
      return
    }
    if (form.password.length < 6) {
      setError('Password kam se kam 6 characters ka hona chahiye!')
      return
    }
    setLoading(true)
    try {
      await registerUser({ username: form.username, email: form.email, password: form.password })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width:'100%', padding:'12px 14px',
    background:'rgba(0,255,200,0.04)',
    border:'1px solid rgba(0,255,200,0.2)',
    color:'#e0f0ff', fontFamily:"'Rajdhani',sans-serif", fontSize:15,
    outline:'none', boxSizing:'border-box', transition:'border-color 0.3s'
  }
  const labelStyle = {
    fontFamily:"'Share Tech Mono',monospace", fontSize:11,
    letterSpacing:2, color:'rgba(0,255,200,0.6)',
    textTransform:'uppercase', display:'block', marginBottom:8
  }

  return (
    <div style={{
      minHeight:'100vh', background:'#020408',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:"'Rajdhani',sans-serif",
      backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 52px,rgba(0,255,200,0.03) 52px,rgba(0,255,200,0.03) 53px),repeating-linear-gradient(90deg,transparent,transparent 52px,rgba(0,255,200,0.03) 52px,rgba(0,255,200,0.03) 53px)'
    }}>
      <div style={{
        width:'min(440px,90vw)', padding:'44px 40px',
        border:'1px solid rgba(0,255,200,0.25)',
        background:'rgba(2,4,14,0.97)',
        clipPath:'polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))',
        position:'relative'
      }}>
        {[['top','left','borderTop','borderLeft'],['top','right','borderTop','borderRight'],['bottom','left','borderBottom','borderLeft'],['bottom','right','borderBottom','borderRight']].map(([v1,v2,b1,b2],i) => (
          <div key={i} style={{ position:'absolute', width:12, height:12, [v1]:0, [v2]:0, [b1]:'2px solid #00ffc8', [b2]:'2px solid #00ffc8' }} />
        ))}

        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:22, color:'#00ffc8', letterSpacing:4, marginBottom:6 }}>
            NEXA<span style={{ color:'#0080ff' }}>VERSE</span>
          </div>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, letterSpacing:3, color:'rgba(0,200,255,0.45)', textTransform:'uppercase' }}>
            Create Account
          </div>
        </div>

        {error && (
          <div style={{ background:'rgba(255,40,40,0.1)', border:'1px solid rgba(255,40,40,0.3)', color:'rgba(255,120,120,0.9)', padding:'10px 14px', fontFamily:"'Share Tech Mono',monospace", fontSize:12, marginBottom:20, letterSpacing:1 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:18 }}>
            <label style={labelStyle}>Username</label>
            <input name="username" value={form.username} onChange={handleChange} placeholder="Choose username" style={inputStyle}
              onFocus={e => e.target.style.borderColor='rgba(0,255,200,0.6)'}
              onBlur={e => e.target.style.borderColor='rgba(0,255,200,0.2)'} />
          </div>

          <div style={{ marginBottom:18 }}>
            <label style={labelStyle}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter email" style={inputStyle}
              onFocus={e => e.target.style.borderColor='rgba(0,255,200,0.6)'}
              onBlur={e => e.target.style.borderColor='rgba(0,255,200,0.2)'} />
          </div>

          <div style={{ marginBottom:18 }}>
            <label style={labelStyle}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" style={inputStyle}
              onFocus={e => e.target.style.borderColor='rgba(0,255,200,0.6)'}
              onBlur={e => e.target.style.borderColor='rgba(0,255,200,0.2)'} />
          </div>

          <div style={{ marginBottom:28 }}>
            <label style={labelStyle}>Confirm Password</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" style={inputStyle}
              onFocus={e => e.target.style.borderColor='rgba(0,255,200,0.6)'}
              onBlur={e => e.target.style.borderColor='rgba(0,255,200,0.2)'} />
          </div>

          <button type="submit" disabled={isLoading} style={{
            width:'100%', padding:'13px',
            background: isLoading ? 'rgba(0,200,150,0.5)' : '#00ffc8',
            color:'#000', border:'none', cursor: isLoading ? 'not-allowed' : 'pointer',
            fontFamily:"'Share Tech Mono',monospace", fontSize:12,
            letterSpacing:3, textTransform:'uppercase', fontWeight:700,
            clipPath:'polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)',
            transition:'all 0.3s'
          }}>
            {isLoading ? 'CREATING...' : 'REGISTER →'}
          </button>
        </form>

        <div style={{ textAlign:'center', marginTop:24, fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:'rgba(150,200,255,0.5)', letterSpacing:1 }}>
          Already registered?{' '}
          <Link to="/login" style={{ color:'#00ffc8', textDecoration:'none' }}>Login here</Link>
        </div>
        <div style={{ textAlign:'center', marginTop:12 }}>
          <Link to="/" style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'rgba(100,150,200,0.4)', textDecoration:'none', letterSpacing:1 }}>← Back to NexaVerse</Link>
        </div>
      </div>
    </div>
  )
}
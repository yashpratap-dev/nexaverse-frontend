import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../api/axiosConfig'

const COMPANIONS = {
  MIMIR: {
    name: 'MIMIR',
    title: 'The All-Knowing · God of War',
    color: '#00aaff',
    borderColor: 'rgba(0,128,255,0.3)',
    bg: 'rgba(0,12,44,0.95)',
    glowColor: 'rgba(0,128,255,0.2)',
    msgColor: 'rgba(0,170,255,0.85)',
    tagColor: 'rgba(0,160,255,0.45)',
    icon: '⚔',
    personality: 'Witty, sarcastic, impossibly wise',
    greeting: 'Ah, another soul seeks the wisdom of the smartest being in all the realms. Ask away — try not to waste my time with something obvious.',
  },
  GUANYIN: {
    name: 'GUANYIN',
    title: 'Goddess of Mercy · Black Myth',
    color: '#ff3cac',
    borderColor: 'rgba(255,60,172,0.3)',
    bg: 'rgba(28,0,36,0.95)',
    glowColor: 'rgba(255,60,172,0.2)',
    msgColor: 'rgba(255,60,172,0.85)',
    tagColor: 'rgba(255,60,172,0.45)',
    icon: '🐉',
    personality: 'Calm, ancient, profoundly spiritual',
    greeting: 'Warrior, you have sought guidance. The path before you is long, but every step taken with awareness brings you closer to your truth. What troubles your spirit?',
  },
}

export default function AiChatPage() {
  const { user } = useAuthStore()
  const [selectedCompanion, setSelectedCompanion] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Get userId from backend
  useEffect(() => {
    setUserId(1)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function selectCompanion(key) {
    setSelectedCompanion(key)
    const c = COMPANIONS[key]
    setMessages([{
      role: 'assistant',
      content: c.greeting,
      companion: key,
      timestamp: new Date().toLocaleTimeString()
    }])
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim() || loading || !selectedCompanion || !userId) return

    const userMsg = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString()
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      // Select companion first
      await api.post(`/api/ai/select/${userId}`, {
        companionType: selectedCompanion,
        customName: COMPANIONS[selectedCompanion].name
      })
      // Send message
      const res = await api.post(`/api/ai/chat/${userId}`, {
        message: input.trim()
      })
      const aiResponse = res.data.data?.response || 'Hmm... the realms are silent.'
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        companion: selectedCompanion,
        timestamp: new Date().toLocaleTimeString()
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: selectedCompanion === 'MIMIR'
          ? 'The ravens have gone quiet. Try again, boy.'
          : 'The connection to the spiritual realm is temporarily severed. Please try again.',
        companion: selectedCompanion,
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      }])
    } finally {
      setLoading(false)
    }
  }

  const c = selectedCompanion ? COMPANIONS[selectedCompanion] : null

  return (
    <div style={{
      minHeight: '100vh', background: '#020408', color: '#e0f0ff',
      fontFamily: "'Rajdhani',sans-serif",
      backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 52px,rgba(0,255,200,0.02) 52px,rgba(0,255,200,0.02) 53px),repeating-linear-gradient(90deg,transparent,transparent 52px,rgba(0,255,200,0.02) 52px,rgba(0,255,200,0.02) 53px)'
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

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, letterSpacing: 4, color: '#0080ff', textTransform: 'uppercase', marginBottom: 10 }}>
            // AI Companion Matrix
          </div>
          <h1 style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 'clamp(22px,4vw,36px)', color: '#e0f0ff', letterSpacing: 4, marginBottom: 10 }}>
            YOUR GUIDES
          </h1>
          <div style={{ width: 56, height: 2, background: '#ff3cac', marginBottom: 8 }} />
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 12, color: 'rgba(150,200,255,0.4)', letterSpacing: 1 }}>
            Choose your companion and seek wisdom from the ancient realms.
          </div>
        </div>

        {/* Companion Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 36 }}>
          {Object.entries(COMPANIONS).map(([key, comp]) => (
            <div
              key={key}
              onClick={() => selectCompanion(key)}
              style={{
                padding: '24px', border: `1px solid ${selectedCompanion === key ? comp.color : comp.borderColor}`,
                background: selectedCompanion === key ? comp.bg : 'rgba(6,12,28,0.9)',
                cursor: 'pointer', transition: 'all 0.3s',
                clipPath: 'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))',
                boxShadow: selectedCompanion === key ? `0 0 30px ${comp.glowColor}` : 'none',
                transform: selectedCompanion === key ? 'translateY(-3px)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 28 }}>{comp.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 18, color: comp.color, letterSpacing: 3 }}>
                    {comp.name}
                  </div>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: comp.tagColor, letterSpacing: 2, textTransform: 'uppercase' }}>
                    {comp.title}
                  </div>
                </div>
                {selectedCompanion === key && (
                  <div style={{ marginLeft: 'auto', fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: comp.color, border: `1px solid ${comp.color}`, padding: '3px 10px', letterSpacing: 2 }}>
                    ACTIVE
                  </div>
                )}
              </div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 13, color: 'rgba(170,205,255,0.6)', lineHeight: 1.6 }}>
                {comp.personality}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        {!selectedCompanion ? (
          <div style={{
            textAlign: 'center', padding: '60px 0',
            fontFamily: "'Share Tech Mono',monospace", fontSize: 13,
            color: 'rgba(150,200,255,0.3)', letterSpacing: 2
          }}>
            SELECT A COMPANION ABOVE TO BEGIN
          </div>
        ) : (
          <div style={{
            border: `1px solid ${c.borderColor}`,
            background: 'rgba(2,4,14,0.97)',
            clipPath: 'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,0 100%)',
          }}>

            {/* Chat header */}
            <div style={{
              padding: '14px 20px',
              borderBottom: `1px solid ${c.borderColor}`,
              display: 'flex', alignItems: 'center', gap: 12,
              background: c.bg
            }}>
              <div style={{ fontSize: 20 }}>{c.icon}</div>
              <div>
                <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: 14, color: c.color, letterSpacing: 3 }}>
                  {c.name}
                </div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: c.tagColor, letterSpacing: 2 }}>
                  {c.personality}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#40ff80', boxShadow: '0 0 8px #40ff80' }} />
                <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: 'rgba(150,200,255,0.5)', letterSpacing: 1 }}>ONLINE</span>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              height: 420, overflowY: 'auto', padding: '20px',
              display: 'flex', flexDirection: 'column', gap: 16
            }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  gap: 12, alignItems: 'flex-start'
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: msg.role === 'user' ? 'rgba(0,255,200,0.15)' : c.bg,
                    border: `1px solid ${msg.role === 'user' ? 'rgba(0,255,200,0.3)' : c.borderColor}`,
                    fontSize: 14
                  }}>
                    {msg.role === 'user' ? '👤' : c.icon}
                  </div>

                  {/* Bubble */}
                  <div style={{
                    maxWidth: '72%',
                    padding: '12px 16px',
                    background: msg.role === 'user'
                      ? 'rgba(0,255,200,0.06)'
                      : (msg.isError ? 'rgba(255,40,40,0.08)' : c.bg),
                    border: `1px solid ${msg.role === 'user' ? 'rgba(0,255,200,0.2)' : (msg.isError ? 'rgba(255,40,40,0.2)' : c.borderColor)}`,
                    clipPath: msg.role === 'user'
                      ? 'polygon(0 0,100% 0,100% 100%,10px 100%,0 calc(100% - 10px))'
                      : 'polygon(0 0,100% 0,calc(100% - 0px) 100%,0 100%)',
                  }}>
                    {msg.role === 'assistant' && (
                      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: c.tagColor, letterSpacing: 2, marginBottom: 6, textTransform: 'uppercase' }}>
                        {c.name} · {msg.timestamp}
                      </div>
                    )}
                    <div style={{
                      fontFamily: msg.role === 'assistant' ? "'Share Tech Mono',monospace" : "'Rajdhani',sans-serif",
                      fontSize: msg.role === 'assistant' ? 13 : 15,
                      color: msg.role === 'user' ? 'rgba(200,230,255,0.9)' : (msg.isError ? 'rgba(255,120,120,0.8)' : c.msgColor),
                      lineHeight: 1.75,
                      letterSpacing: msg.role === 'assistant' ? 0.5 : 0
                    }}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: 'rgba(0,255,200,0.3)', letterSpacing: 1, marginTop: 6, textAlign: 'right' }}>
                        {msg.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.bg, border: `1px solid ${c.borderColor}`, fontSize: 14 }}>
                    {c.icon}
                  </div>
                  <div style={{ padding: '12px 16px', background: c.bg, border: `1px solid ${c.borderColor}` }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {[0,1,2].map(i => (
                        <div key={i} style={{
                          width: 7, height: 7, borderRadius: '50%',
                          background: c.color, opacity: 0.6,
                          animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
                        }} />
                      ))}
                      <style>{`@keyframes pulse{0%,100%{opacity:0.2;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} style={{
              padding: '16px 20px',
              borderTop: `1px solid ${c.borderColor}`,
              display: 'flex', gap: 10, background: 'rgba(0,0,0,0.5)'
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={`Ask ${c.name} anything...`}
                disabled={loading}
                style={{
                  flex: 1, padding: '12px 16px',
                  background: 'rgba(0,0,0,0.6)',
                  border: `1px solid ${c.borderColor}`,
                  color: '#e0f0ff', fontFamily: "'Rajdhani',sans-serif",
                  fontSize: 15, outline: 'none', transition: 'border-color 0.3s'
                }}
                onFocus={e => e.target.style.borderColor = c.color}
                onBlur={e => e.target.style.borderColor = c.borderColor}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{
                  padding: '12px 24px',
                  background: loading || !input.trim() ? 'rgba(0,255,200,0.2)' : '#00ffc8',
                  border: 'none', color: '#000',
                  fontFamily: "'Share Tech Mono',monospace",
                  fontSize: 12, letterSpacing: 2,
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  textTransform: 'uppercase', fontWeight: 700,
                  clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)',
                  transition: 'all 0.3s'
                }}
              >
                {loading ? '...' : 'SEND →'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

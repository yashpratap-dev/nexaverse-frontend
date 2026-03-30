import { useState, useRef, useEffect } from 'react'

export default function ChatOverlay({ messages, onSend, avatarName }) {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend(e) {
    e.preventDefault()
    if (!input.trim()) return
    onSend(input.trim())
    setInput('')
  }

  return (
    <div style={{
      position: 'absolute', bottom: 20, right: 20,
      width: 300, zIndex: 100,
      fontFamily: "'Share Tech Mono',monospace"
    }}>
      {/* Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'rgba(0,0,0,0.9)',
          border: '1px solid rgba(0,255,200,0.3)',
          borderBottom: open ? 'none' : '1px solid rgba(0,255,200,0.3)',
          padding: '8px 14px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 11, letterSpacing: 2, color: '#00ffc8' }}>// WORLD CHAT</span>
        <span style={{ fontSize: 10, color: 'rgba(0,255,200,0.5)' }}>{open ? '▼' : '▲'}</span>
      </div>

      {open && (
        <>
          {/* Messages */}
          <div style={{
            background: 'rgba(0,0,0,0.85)',
            border: '1px solid rgba(0,255,200,0.2)',
            borderBottom: 'none',
            height: 180, overflowY: 'auto',
            padding: '10px 12px',
          }}>
            {messages.length === 0 && (
              <div style={{ fontSize: 11, color: 'rgba(150,200,255,0.3)', letterSpacing: 1 }}>
                No messages yet...
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <span style={{
                  fontSize: 10, color: msg.avatarName === avatarName ? '#00ffc8' : '#0080ff',
                  letterSpacing: 1
                }}>{msg.avatarName}: </span>
                <span style={{ fontSize: 11, color: 'rgba(200,220,255,0.8)' }}>{msg.content}</span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ display: 'flex' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type message..."
              style={{
                flex: 1, padding: '8px 10px',
                background: 'rgba(0,0,0,0.9)',
                border: '1px solid rgba(0,255,200,0.25)',
                borderRight: 'none',
                color: '#e0f0ff', fontSize: 12, outline: 'none',
                fontFamily: "'Share Tech Mono',monospace"
              }}
            />
            <button type="submit" style={{
              padding: '8px 14px',
              background: 'rgba(0,255,200,0.15)',
              border: '1px solid rgba(0,255,200,0.25)',
              color: '#00ffc8', cursor: 'pointer', fontSize: 12
            }}>→</button>
          </form>
        </>
      )}
    </div>
  )
}
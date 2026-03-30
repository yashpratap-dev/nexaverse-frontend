import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useWebSocket from '../hooks/useWebSocket'
import api from '../api/axiosConfig'
import WorldRoom3D from '../components/WorldRoom3D'
import ChatOverlay from '../components/ChatOverlay'

export default function WorldRoomPage() {
  const { worldId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [world, setWorld] = useState(null)
  const [myAvatar, setMyAvatar] = useState(null)
  const [players, setPlayers] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)

  // Fetch world + avatar data
  useEffect(() => {
    async function fetchData() {
      try {
        const [worldRes, avatarRes] = await Promise.all([
          api.get(`/api/worlds`),
          api.get(`/api/avatars`),
        ])
        const worldData = worldRes.data.data?.find(w => w.id === parseInt(worldId))
        const avatarData = avatarRes.data.data?.[0]
        setWorld(worldData)
        setMyAvatar(avatarData)
        setConnected(true)
      } catch (err) {
        console.error('Failed to load world data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [worldId])

  // Handle WebSocket messages
  const handleMessage = useCallback((msg) => {
    if (msg.isChat) {
      setChatMessages(prev => [...prev.slice(-50), msg])
      return
    }
    if (msg.type === 'AVATAR_JOINED') {
      setPlayers(prev => {
        const exists = prev.find(p => p.avatarId === msg.avatarId)
        if (exists) return prev
        return [...prev, { ...msg }]
      })
    } else if (msg.type === 'AVATAR_MOVED') {
      setPlayers(prev => prev.map(p =>
        p.avatarId === msg.avatarId
          ? { ...p, positionX: msg.positionX, positionY: msg.positionY }
          : p
      ))
    } else if (msg.type === 'AVATAR_LEFT') {
      setPlayers(prev => prev.filter(p => p.avatarId !== msg.avatarId))
    }
  }, [])

  const { moveAvatar, sendChat } = useWebSocket({
    worldId: parseInt(worldId),
    avatarId: myAvatar?.id,
    avatarName: myAvatar?.name,
    onMessage: handleMessage,
  })

  const handleMove = useCallback((x, z) => {
    moveAvatar(x, z)
  }, [moveAvatar])

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#000510',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Share Tech Mono',monospace", color: '#00ffc8',
      fontSize: 16, letterSpacing: 4
    }}>
      LOADING WORLD...
    </div>
  )

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#000510', position: 'relative',
      overflow: 'hidden', fontFamily: "'Rajdhani',sans-serif"
    }}>

      {/* 3D World */}
      {myAvatar && (
        <WorldRoom3D
          players={players}
          myAvatarId={myAvatar.id}
          worldType={world?.worldType}
          onMove={handleMove}
        />
      )}

      {/* HUD — Top Bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(180deg,rgba(0,0,0,0.85) 0%,transparent 100%)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/worlds" style={{ textDecoration: 'none' }}>
            <button style={{
              fontFamily: "'Share Tech Mono',monospace", fontSize: 11,
              letterSpacing: 2, padding: '6px 14px',
              border: '1px solid rgba(0,255,200,0.3)',
              color: 'rgba(0,255,200,0.7)', background: 'transparent',
              cursor: 'pointer', textTransform: 'uppercase'
            }}>← Exit</button>
          </Link>
          <div>
            <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: 16, color: '#00ffc8', letterSpacing: 3 }}>
              {world?.name || 'WORLD'}
            </div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: 'rgba(0,255,200,0.45)', letterSpacing: 2 }}>
              {world?.worldType} · MAX {world?.maxPlayers} PLAYERS
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {/* Connection status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: connected ? '#40ff80' : '#ff4444', boxShadow: connected ? '0 0 8px #40ff80' : 'none' }} />
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: 'rgba(150,200,255,0.6)', letterSpacing: 1 }}>
              {connected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
          {/* Players online */}
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: 'rgba(0,255,200,0.6)', letterSpacing: 2 }}>
            👥 {players.length + 1} ONLINE
          </div>
          {/* My avatar */}
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: '#00ffc8', letterSpacing: 2 }}>
            ⚔ {myAvatar?.name || user?.username}
          </div>
        </div>
      </div>

      {/* Controls hint */}
      <div style={{
        position: 'absolute', bottom: 20, left: 20,
        fontFamily: "'Share Tech Mono',monospace", fontSize: 11,
        color: 'rgba(0,255,200,0.35)', letterSpacing: 2,
        zIndex: 50
      }}>
        WASD / ↑↓←→ — MOVE
      </div>

      {/* Players list */}
      <div style={{
        position: 'absolute', top: 80, left: 20,
        background: 'rgba(0,0,0,0.7)',
        border: '1px solid rgba(0,255,200,0.15)',
        padding: '12px 16px', zIndex: 50, minWidth: 160
      }}>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: '#00ffc8', letterSpacing: 2, marginBottom: 10 }}>
          // PLAYERS
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ffc8' }} />
          <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: '#00ffc8' }}>
            {myAvatar?.name} (you)
          </span>
        </div>
        {players.map(p => (
          <div key={p.avatarId} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0080ff' }} />
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: 'rgba(150,200,255,0.7)' }}>
              {p.avatarName}
            </span>
          </div>
        ))}
      </div>

      {/* Minimap */}
      <div style={{
        position: 'absolute', top: 80, right: 20,
        width: 120, height: 120,
        background: 'rgba(0,0,0,0.75)',
        border: '1px solid rgba(0,255,200,0.2)',
        zIndex: 50, overflow: 'hidden'
      }}>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: '#00ffc8', letterSpacing: 1, padding: '4px 6px' }}>
          MINIMAP
        </div>
        <svg width="120" height="100" style={{ position: 'absolute', top: 18 }}>
          {/* Grid */}
          {[...Array(5)].map((_, i) => (
            <g key={i}>
              <line x1={i*24} y1="0" x2={i*24} y2="100" stroke="rgba(0,255,200,0.1)" strokeWidth="0.5" />
              <line x1="0" y1={i*20} x2="120" y2={i*20} stroke="rgba(0,255,200,0.1)" strokeWidth="0.5" />
            </g>
          ))}
          {/* My dot */}
          <circle cx="60" cy="50" r="4" fill="#00ffc8" />
          {/* Other players */}
          {players.map(p => {
            const px = 60 + (p.positionX || 0) * (60/28)
            const py = 50 + (p.positionY || 0) * (50/28)
            return <circle key={p.avatarId} cx={Math.max(4,Math.min(116,px))} cy={Math.max(4,Math.min(96,py))} r="3" fill="#0080ff" />
          })}
        </svg>
      </div>

      {/* Chat */}
      <ChatOverlay
        messages={chatMessages}
        onSend={sendChat}
        avatarName={myAvatar?.name}
      />
    </div>
  )
}
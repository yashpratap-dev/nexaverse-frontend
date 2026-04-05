import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../api/axiosConfig'

const RANK_COLORS = ['#ffd700', '#c0c0c0', '#cd7f32', '#00ffc8', '#0080ff']
const RANK_ICONS = ['👑', '🥈', '🥉', '⚔', '🔮']

const ACHIEVEMENTS_LIST = [
  { id: 'FIRST_LOGIN',     icon: '🚀', label: 'First Login',      desc: 'Welcome to NexaVerse!' },
  { id: 'WORLD_EXPLORER',  icon: '🌍', label: 'World Explorer',   desc: 'Visited 3+ worlds' },
  { id: 'CHAT_MASTER',     icon: '💬', label: 'Chat Master',      desc: 'Sent 50+ messages' },
  { id: 'AI_SEEKER',       icon: '🧠', label: 'AI Seeker',        desc: 'Talked to MIMIR' },
  { id: 'DRAGON_SLAYER',   icon: '🐉', label: 'Dragon Slayer',    desc: 'Defeated 10 enemies' },
  { id: 'SPEED_RUNNER',    icon: '⚡', label: 'Speed Runner',     desc: 'Moved 1000 units' },
  { id: 'DUNGEON_MASTER',  icon: '🏰', label: 'Dungeon Master',   desc: 'Explored dungeon' },
  { id: 'OCEAN_DIVER',     icon: '🌊', label: 'Ocean Diver',      desc: 'Visited ocean world' },
]

export default function LeaderboardPage() {
  const { user } = useAuthStore()
  const [players, setPlayers] = useState([])
  const [myRank, setMyRank] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('leaderboard')

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    try {
      const [topRes, rankRes, achRes] = await Promise.all([
        api.get('/api/leaderboard/top?limit=10'),
        api.get(`/api/leaderboard/rank/${user?.username || 'yash'}`),
        api.get(`/api/leaderboard/achievements/${user?.username || 'yash'}`),
      ])
      setPlayers(topRes.data.data || [])
      setMyRank(rankRes.data.data)
      setAchievements(achRes.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function unlockAchievement(id) {
    try {
      await api.post('/api/leaderboard/achievement', {
        username: user?.username || 'yash',
        achievement: id
      })
      fetchAll()
    } catch (err) {}
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#020408', color: '#e0f0ff',
      fontFamily: "'Rajdhani',sans-serif",
      backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 52px,rgba(0,255,200,0.02) 52px,rgba(0,255,200,0.02) 53px),repeating-linear-gradient(90deg,transparent,transparent 52px,rgba(0,255,200,0.02) 52px,rgba(0,255,200,0.02) 53px)'
    }}>

      {/* Navbar */}
      <nav style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'15px 48px', borderBottom:'1px solid rgba(0,255,200,0.1)',
        background:'rgba(0,0,0,0.9)', backdropFilter:'blur(20px)',
        position:'sticky', top:0, zIndex:100
      }}>
        <Link to="/" style={{ textDecoration:'none' }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:20, color:'#00ffc8', letterSpacing:4 }}>
            NEXA<span style={{ color:'#0080ff' }}>VERSE</span>
          </div>
        </Link>
        <div style={{ display:'flex', gap:20 }}>
          {['Dashboard','Worlds','AI Chat','Monitor'].map(l => (
            <Link key={l} to={`/${l.toLowerCase().replace(' ','-')}`} style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:'rgba(150,200,255,0.55)', textDecoration:'none', letterSpacing:2 }}>{l}</Link>
          ))}
        </div>
        <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:12, color:'rgba(0,255,200,0.6)', letterSpacing:2 }}>👤 {user?.username}</div>
      </nav>

      <div style={{ padding:'48px', maxWidth:1000, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom:36 }}>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, letterSpacing:4, color:'#0080ff', marginBottom:10 }}>// Hall of Fame</div>
          <h1 style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:'clamp(22px,4vw,36px)', color:'#e0f0ff', letterSpacing:4, marginBottom:10 }}>LEADERBOARD</h1>
          <div style={{ width:56, height:2, background:'#ffd700' }} />
        </div>

        {/* My Rank Card */}
        {myRank && (
          <div style={{
            background:'rgba(6,12,28,0.95)',
            border:'1px solid rgba(0,255,200,0.2)',
            padding:'20px 24px', marginBottom:32,
            display:'flex', alignItems:'center', gap:24, flexWrap:'wrap',
            clipPath:'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,0 100%)'
          }}>
            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'rgba(0,255,200,0.5)', letterSpacing:3 }}>YOUR STATS</div>
            <div style={{ display:'flex', gap:32, flexWrap:'wrap' }}>
              <div>
                <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, color:'rgba(150,200,255,0.4)', letterSpacing:2, marginBottom:4 }}>RANK</div>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:24, fontWeight:900, color:'#ffd700' }}>
                  #{myRank.rank === -1 ? '—' : myRank.rank}
                </div>
              </div>
              <div>
                <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, color:'rgba(150,200,255,0.4)', letterSpacing:2, marginBottom:4 }}>SCORE</div>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:24, fontWeight:900, color:'#00ffc8' }}>{myRank.score}</div>
              </div>
              <div>
                <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, color:'rgba(150,200,255,0.4)', letterSpacing:2, marginBottom:4 }}>PLAYER</div>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:24, fontWeight:900, color:'#e0f0ff' }}>{myRank.username}</div>
              </div>
              <div>
                <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, color:'rgba(150,200,255,0.4)', letterSpacing:2, marginBottom:4 }}>ACHIEVEMENTS</div>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:24, fontWeight:900, color:'#aa44ff' }}>{achievements.length}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:'flex', gap:0, marginBottom:24, borderBottom:'1px solid rgba(0,255,200,0.1)' }}>
          {['leaderboard','achievements'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              fontFamily:"'Share Tech Mono',monospace", fontSize:11, letterSpacing:2,
              padding:'12px 24px', border:'none', cursor:'pointer',
              textTransform:'uppercase',
              background: activeTab === tab ? 'rgba(0,255,200,0.08)' : 'transparent',
              color: activeTab === tab ? '#00ffc8' : 'rgba(150,200,255,0.4)',
              borderBottom: activeTab === tab ? '2px solid #00ffc8' : '2px solid transparent',
              transition:'all 0.3s'
            }}>{tab}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'60px 0', fontFamily:"'Share Tech Mono',monospace", fontSize:13, color:'rgba(0,255,200,0.4)', letterSpacing:3 }}>
            LOADING...
          </div>
        ) : activeTab === 'leaderboard' ? (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {players.map((p, i) => (
              <div key={p.username} style={{
                background: p.username === user?.username ? 'rgba(0,255,200,0.05)' : 'rgba(6,12,28,0.95)',
                border: `1px solid ${p.username === user?.username ? 'rgba(0,255,200,0.3)' : 'rgba(255,255,255,0.05)'}`,
                padding:'16px 24px',
                display:'flex', alignItems:'center', gap:20,
                transition:'all 0.3s',
                clipPath: i === 0 ? 'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,0 100%)' : 'none'
              }}
                onMouseOver={e => e.currentTarget.style.borderColor = RANK_COLORS[i] + '44'}
                onMouseOut={e => e.currentTarget.style.borderColor = p.username === user?.username ? 'rgba(0,255,200,0.3)' : 'rgba(255,255,255,0.05)'}
              >
                {/* Rank */}
                <div style={{ width:40, textAlign:'center' }}>
                  {i < 3 ? (
                    <span style={{ fontSize:20 }}>{RANK_ICONS[i]}</span>
                  ) : (
                    <span style={{ fontFamily:"'Orbitron',monospace", fontSize:16, fontWeight:700, color:'rgba(150,200,255,0.4)' }}>#{p.rank}</span>
                  )}
                </div>

                {/* Avatar dot */}
                <div style={{ width:36, height:36, borderRadius:'50%', background:`${RANK_COLORS[i] || '#00ffc8'}22`, border:`2px solid ${RANK_COLORS[i] || '#00ffc8'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontSize:14 }}>{RANK_ICONS[i] || '⚔'}</span>
                </div>

                {/* Name */}
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:14, fontWeight:700, color: p.username === user?.username ? '#00ffc8' : '#e0f0ff', letterSpacing:2 }}>
                    {p.username}
                    {p.username === user?.username && <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, color:'rgba(0,255,200,0.6)', letterSpacing:2, marginLeft:8 }}>YOU</span>}
                  </div>
                </div>

                {/* Score bar */}
                <div style={{ width:120, display:'flex', flexDirection:'column', gap:4 }}>
                  <div style={{ height:3, background:'rgba(255,255,255,0.05)', borderRadius:2 }}>
                    <div style={{ height:'100%', width:`${(p.score/1500)*100}%`, background:`linear-gradient(90deg,${RANK_COLORS[i] || '#00ffc8'}88,${RANK_COLORS[i] || '#00ffc8'})`, borderRadius:2 }} />
                  </div>
                </div>

                {/* Score */}
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:900, color: RANK_COLORS[i] || '#00ffc8', minWidth:70, textAlign:'right' }}>
                  {p.score.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
            {ACHIEVEMENTS_LIST.map(ach => {
              const unlocked = achievements.includes(ach.id)
              return (
                <div key={ach.id}
                  onClick={() => !unlocked && unlockAchievement(ach.id)}
                  style={{
                    background: unlocked ? 'rgba(170,68,255,0.08)' : 'rgba(6,12,28,0.95)',
                    border: `1px solid ${unlocked ? 'rgba(170,68,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    padding:'20px', cursor: unlocked ? 'default' : 'pointer',
                    transition:'all 0.3s', opacity: unlocked ? 1 : 0.5,
                    clipPath:'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)'
                  }}
                  onMouseOver={e => { if(!unlocked) e.currentTarget.style.borderColor='rgba(170,68,255,0.3)' }}
                  onMouseOut={e => { if(!unlocked) e.currentTarget.style.borderColor='rgba(255,255,255,0.06)' }}
                >
                  <div style={{ fontSize:32, marginBottom:10 }}>{ach.icon}</div>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:12, fontWeight:700, color: unlocked ? '#aa44ff' : 'rgba(150,200,255,0.5)', letterSpacing:1, marginBottom:6 }}>
                    {ach.label}
                  </div>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'rgba(150,200,255,0.4)', letterSpacing:1, marginBottom:12 }}>
                    {ach.desc}
                  </div>
                  <div style={{
                    fontFamily:"'Share Tech Mono',monospace", fontSize:9, letterSpacing:2,
                    color: unlocked ? '#aa44ff' : 'rgba(150,200,255,0.3)',
                    border:`1px solid ${unlocked ? 'rgba(170,68,255,0.4)' : 'rgba(150,200,255,0.1)'}`,
                    padding:'3px 8px', display:'inline-block'
                  }}>
                    {unlocked ? '✓ UNLOCKED' : 'CLICK TO UNLOCK'}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../api/axiosConfig'

function MetricCard({ title, value, unit, color, icon, max, description }) {
  const pct = max ? Math.min((value / max) * 100, 100) : null
  return (
    <div style={{
      background: 'rgba(6,12,28,0.95)',
      border: `1px solid ${color}22`,
      padding: '24px', transition: 'all 0.3s',
      clipPath: 'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,0 100%)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Glow bg */}
      <div style={{ position:'absolute', top:0, right:0, width:80, height:80, background:`radial-gradient(circle, ${color}15, transparent)`, borderRadius:'50%' }} />

      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <span style={{ fontSize:20 }}>{icon}</span>
        <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, letterSpacing:3, color:`${color}99`, textTransform:'uppercase' }}>{title}</span>
      </div>

      <div style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:32, color, marginBottom:4, letterSpacing:2 }}>
        {value}<span style={{ fontSize:14, fontWeight:400, marginLeft:4, color:`${color}88` }}>{unit}</span>
      </div>

      {description && (
        <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'rgba(150,200,255,0.4)', letterSpacing:1, marginBottom: pct !== null ? 12 : 0 }}>
          {description}
        </div>
      )}

      {pct !== null && (
        <div style={{ marginTop:10 }}>
          <div style={{ height:4, background:'rgba(255,255,255,0.05)', borderRadius:2, overflow:'hidden' }}>
            <div style={{
              height:'100%', width:`${pct}%`,
              background: `linear-gradient(90deg, ${color}88, ${color})`,
              transition: 'width 0.8s ease', borderRadius:2
            }} />
          </div>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, color:`${color}66`, marginTop:4, textAlign:'right' }}>
            {pct.toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  )
}

function MiniChart({ data, color, height = 60 }) {
  if (!data || data.length < 2) return null
  const max = Math.max(...data, 1)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 100 / (data.length - 1)

  const points = data.map((v, i) => {
    const x = i * w
    const y = height - ((v - min) / range) * (height - 8) - 4
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ display:'block' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${height} ${points} 100,${height}`} fill={`${color}15`} stroke="none" />
    </svg>
  )
}

export default function MonitorPage() {
  const { user } = useAuthStore()
  const [data, setData] = useState(null)
  const [history, setHistory] = useState({ cpu: [], heap: [], threads: [] })
  const [lastUpdate, setLastUpdate] = useState(null)
  const [online, setOnline] = useState(false)
  const intervalRef = useRef(null)

  async function fetchMetrics() {
    try {
      const res = await api.get('/api/monitor/system')
      const d = res.data
      setData(d)
      setOnline(true)
      setLastUpdate(new Date().toLocaleTimeString())
      setHistory(prev => ({
        cpu:     [...prev.cpu.slice(-29),     d.cpu || 0],
        heap:    [...prev.heap.slice(-29),    d.memory?.heap_used_mb || 0],
        threads: [...prev.threads.slice(-29), d.threads?.active_threads || 0],
      }))
    } catch (err) {
      setOnline(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    intervalRef.current = setInterval(fetchMetrics, 3000)
    return () => clearInterval(intervalRef.current)
  }, [])

  function formatUptime(sec) {
    if (!sec) return '0s'
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    if (h > 0) return `${h}h ${m}m ${s}s`
    if (m > 0) return `${m}m ${s}s`
    return `${s}s`
  }

  return (
    <div style={{
      minHeight:'100vh', background:'#020408', color:'#e0f0ff',
      fontFamily:"'Rajdhani',sans-serif",
      backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 52px,rgba(0,255,200,0.02) 52px,rgba(0,255,200,0.02) 53px),repeating-linear-gradient(90deg,transparent,transparent 52px,rgba(0,255,200,0.02) 52px,rgba(0,255,200,0.02) 53px)'
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
          {['Dashboard','Worlds','AI Chat'].map(l => (
            <Link key={l} to={`/${l.toLowerCase().replace(' ','-')}`} style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:'rgba(150,200,255,0.55)', textDecoration:'none', letterSpacing:2 }}>{l}</Link>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background: online ? '#40ff80' : '#ff4444', boxShadow: online ? '0 0 8px #40ff80' : 'none', transition:'all 0.3s' }} />
            <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color: online ? '#40ff80' : '#ff4444', letterSpacing:1 }}>{online ? 'LIVE' : 'OFFLINE'}</span>
          </div>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:12, color:'rgba(0,255,200,0.6)', letterSpacing:2 }}>👤 {user?.username}</div>
        </div>
      </nav>

      <div style={{ padding:'48px', maxWidth:1200, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom:40, display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, letterSpacing:4, color:'#0080ff', marginBottom:10 }}>// System Monitor</div>
            <h1 style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:'clamp(22px,4vw,36px)', color:'#e0f0ff', letterSpacing:4, marginBottom:10 }}>NEXAVERSE MONITOR</h1>
            <div style={{ width:56, height:2, background:'#00ffc8' }} />
          </div>
          {lastUpdate && (
            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:'rgba(0,255,200,0.4)', letterSpacing:2 }}>
              LAST UPDATE: {lastUpdate} · AUTO-REFRESH 3s
            </div>
          )}
        </div>

        {!data ? (
          <div style={{ textAlign:'center', padding:'80px 0', fontFamily:"'Share Tech Mono',monospace", fontSize:13, color:'rgba(0,255,200,0.4)', letterSpacing:3 }}>
            CONNECTING TO BACKEND...
          </div>
        ) : (
          <>
            {/* JVM Info Bar */}
            <div style={{
              background:'rgba(6,12,28,0.95)', border:'1px solid rgba(0,255,200,0.1)',
              padding:'16px 24px', marginBottom:24,
              display:'flex', gap:32, flexWrap:'wrap', alignItems:'center'
            }}>
              {[
                { label:'APP', value:'NexaVerse v1.0' },
                { label:'JAVA', value:data.jvm?.java_version || '-' },
                { label:'JVM', value:data.jvm?.jvm_name?.split(' ')[0] || '-' },
                { label:'PID', value:data.jvm?.pid || '-' },
                { label:'UPTIME', value:formatUptime(data.jvm?.uptime_sec) },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, color:'rgba(150,200,255,0.4)', letterSpacing:2, marginBottom:3 }}>{item.label}</div>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:13, color:'#00ffc8', letterSpacing:1 }}>{item.value}</div>
                </div>
              ))}
              <div style={{ marginLeft:'auto', fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'rgba(0,255,200,0.3)', letterSpacing:2 }}>
                ● MONITORING ACTIVE
              </div>
            </div>

            {/* Main Metrics Grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))', gap:20, marginBottom:32 }}>
              <MetricCard
                title="CPU Load"
                value={data.cpu ?? 0}
                unit=""
                color="#ff6b35"
                icon="⚡"
                description="System load average"
              />
              <MetricCard
                title="Heap Used"
                value={data.memory?.heap_used_mb ?? 0}
                unit="MB"
                color="#00ffc8"
                icon="🧠"
                max={data.memory?.heap_max_mb}
                description={`Max: ${data.memory?.heap_max_mb ?? 0} MB`}
              />
              <MetricCard
                title="Heap Free"
                value={data.memory?.heap_free_mb ?? 0}
                unit="MB"
                color="#40ff80"
                icon="💾"
                description="Available heap memory"
              />
              <MetricCard
                title="Active Threads"
                value={data.threads?.active_threads ?? 0}
                unit=""
                color="#aa44ff"
                icon="🔄"
                max={data.threads?.peak_threads}
                description={`Peak: ${data.threads?.peak_threads ?? 0} · Daemon: ${data.threads?.daemon_threads ?? 0}`}
              />
            </div>

            {/* Charts */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(350px,1fr))', gap:20, marginBottom:32 }}>
              {[
                { title:'CPU LOAD HISTORY', data:history.cpu, color:'#ff6b35', unit:'' },
                { title:'HEAP USAGE (MB)', data:history.heap, color:'#00ffc8', unit:'MB' },
                { title:'ACTIVE THREADS', data:history.threads, color:'#aa44ff', unit:'' },
              ].map(chart => (
                <div key={chart.title} style={{
                  background:'rgba(6,12,28,0.95)', border:'1px solid rgba(0,255,200,0.08)',
                  padding:'20px'
                }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, letterSpacing:3, color:`${chart.color}99` }}>{chart.title}</span>
                    <span style={{ fontFamily:"'Orbitron',monospace", fontSize:16, color:chart.color, fontWeight:700 }}>
                      {chart.data[chart.data.length-1] ?? 0}{chart.unit}
                    </span>
                  </div>
                  <MiniChart data={chart.data} color={chart.color} height={70} />
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, color:'rgba(150,200,255,0.3)' }}>-90s</span>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, color:'rgba(150,200,255,0.3)' }}>NOW</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Health Status */}
            <div style={{
              background:'rgba(6,12,28,0.95)', border:'1px solid rgba(64,255,128,0.2)',
              padding:'20px 24px',
              display:'flex', alignItems:'center', gap:16, flexWrap:'wrap'
            }}>
              <div style={{ width:12, height:12, borderRadius:'50%', background:'#40ff80', boxShadow:'0 0 12px #40ff80' }} />
              <div>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:14, color:'#40ff80', letterSpacing:2, fontWeight:700 }}>ALL SYSTEMS OPERATIONAL</div>
                <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'rgba(150,200,255,0.4)', letterSpacing:1, marginTop:3 }}>
                  NexaVerse Backend · Spring Boot · PostgreSQL · Redis · Kafka
                </div>
              </div>
              <div style={{ marginLeft:'auto', fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'rgba(0,255,200,0.4)', letterSpacing:2 }}>
                UPTIME: {formatUptime(data.jvm?.uptime_sec)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
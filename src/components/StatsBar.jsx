import { useEffect, useRef, useState } from 'react'

const STATS = [
  { id: 's1', end: 128,  label: 'Active Worlds' },
  { id: 's2', end: 2847, label: 'Avatars Online' },
  { id: 's3', end: 2,    label: 'AI Companions' },
  { id: 's4', end: 9400, label: 'Events/sec' },
]

export default function StatsBar() {
  const [counts, setCounts] = useState([0,0,0,0])
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !visible) {
        setVisible(true)
        STATS.forEach((s, i) => {
          let cur = 0
          const iv = setInterval(() => {
            cur = Math.min(cur + s.end / 90, s.end)
            setCounts(prev => {
              const next = [...prev]
              next[i] = Math.round(cur)
              return next
            })
            if (cur >= s.end) clearInterval(iv)
          }, 16)
        })
      }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [visible])

  return (
    <div ref={ref} style={{
      display: 'flex', justifyContent: 'center',
      background: 'rgba(0,255,200,0.015)',
      borderBottom: '1px solid rgba(0,255,200,0.07)',
      position: 'relative', zIndex: 5
    }}>
      {STATS.map((s, i) => (
        <div key={s.id} style={{
          flex: 1, maxWidth: 220, textAlign: 'center',
          padding: '26px 16px',
          borderRight: i < STATS.length-1 ? '1px solid rgba(0,255,200,0.06)' : 'none'
        }}>
          <span style={{
            fontFamily: "'Orbitron',monospace", fontSize: 28,
            fontWeight: 700, color: '#00ffc8', display: 'block', marginBottom: 5
          }}>{counts[i].toLocaleString()}</span>
          <span style={{
            fontSize: 11, letterSpacing: 2,
            color: 'rgba(130,180,255,0.4)', textTransform: 'uppercase',
            fontFamily: "'Share Tech Mono',monospace"
          }}>{s.label}</span>
        </div>
      ))}
    </div>
  )
}
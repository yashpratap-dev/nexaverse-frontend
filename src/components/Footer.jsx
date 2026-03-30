export default function Footer() {
  return (
    <footer style={{
      padding: '28px 48px', textAlign: 'center',
      borderTop: '1px solid rgba(0,255,200,0.06)',
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 11, color: 'rgba(70,120,170,0.32)',
      letterSpacing: 2, position: 'relative', zIndex: 5
    }}>
      NexaVerse © 2025 &nbsp;·&nbsp; All systems nominal &nbsp;·&nbsp;{' '}
      <span style={{ color: '#00ffc8' }}>ONLINE</span>
    </footer>
  )
}
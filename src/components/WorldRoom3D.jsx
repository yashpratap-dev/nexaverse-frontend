import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import SkySystem from './world/SkySystem'
import WeatherSystem from './world/WeatherSystem'
import DayNightCycle from './world/DayNightCycle'
import AmbientSound from './world/AmbientSound'
import { playFootstep } from '../audio/worldSounds'

const WORLD_CONFIGS = {
  FOREST:  { fogColor:'#0a1a0a', fogNear:80, fogFar:300, ambientColor:'#223322', ambientIntensity:2, sunColor:'#aaffaa', pointColor:'#00ff88', gridColor:'#00aa4422', gridColor2:'#00220822', floorColor:'#1a3a1a', weather:'clear',
    companion: { name:'MIMIR', color:'#0088ff', greetings:['The forest whispers your name, warrior.','I sense great power within these woods.','Stay close. The ancient trees have eyes.'] }
  },
  CITY:    { fogColor:'#000510', fogNear:60, fogFar:250, ambientColor:'#111133', ambientIntensity:1.5, sunColor:'#4488ff', pointColor:'#0066ff', gridColor:'#0066ff22', gridColor2:'#000a1a22', floorColor:'#0a0a1a', weather:'rain',
    companion: { name:'MIMIR', color:'#0088ff', greetings:['The city never sleeps, and neither do I.','Every light here hides a thousand secrets.','I have seen empires rise from rubble like this.'] }
  },
  DESERT:  { fogColor:'#2a1800', fogNear:100, fogFar:350, ambientColor:'#332200', ambientIntensity:2.5, sunColor:'#ffdd44', pointColor:'#ffaa00', gridColor:'#cc880022', gridColor2:'#1a0f0022', floorColor:'#3a2a0a', weather:'clear',
    companion: { name:'GUANYIN', color:'#ff3cac', greetings:['The desert teaches patience, child.','Even sand was once solid rock.','Listen to the wind — it carries wisdom.'] }
  },
  OCEAN:   { fogColor:'#000a20', fogNear:70, fogFar:280, ambientColor:'#001133', ambientIntensity:1.8, sunColor:'#44aaff', pointColor:'#00ccff', gridColor:'#0088cc22', gridColor2:'#000a1522', floorColor:'#001a2e', weather:'clear',
    companion: { name:'GUANYIN', color:'#ff3cac', greetings:['The ocean holds memories of all time.','Breathe deeply. The sea air cleanses the soul.','Every wave returns what the tide takes away.'] }
  },
  DUNGEON: { fogColor:'#080008', fogNear:30, fogFar:150, ambientColor:'#220022', ambientIntensity:0.8, sunColor:'#ff3cac', pointColor:'#ff00aa', gridColor:'#aa006622', gridColor2:'#0a000a22', floorColor:'#0a000a', weather:'clear',
    companion: { name:'MIMIR', color:'#0088ff', greetings:['Not all monsters lurk in darkness, boy.','I have been imprisoned in darker places than this.','Keep your torch burning. Keep your mind sharper.'] }
  },
}

// ── TERRAIN ────────────────────────────────────────────────
function Terrain({ worldType }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(400, 400, 120, 120)
    const pos = g.attributes.position.array
    for (let i = 0; i < pos.length; i += 3) {
      const x = pos[i], z = pos[i+1]
      if (worldType === 'FOREST') {
        pos[i+2] = Math.sin(x*0.04)*Math.cos(z*0.04)*5 + Math.sin(x*0.09)*2 + Math.sin(z*0.07)*2 + Math.random()*0.5
      } else if (worldType === 'DESERT') {
        pos[i+2] = Math.sin(x*0.025)*Math.cos(z*0.03)*10 + Math.sin(x*0.06)*3 + Math.random()*0.3
      } else if (worldType === 'OCEAN') {
        pos[i+2] = Math.sin(x*0.06)*Math.cos(z*0.05)*2 + Math.random()*0.15
      } else if (worldType === 'DUNGEON') {
        pos[i+2] = Math.random()*0.4
      } else {
        pos[i+2] = Math.sin(x*0.035)*Math.cos(z*0.035)*4 + Math.random()*0.3
      }
    }
    g.attributes.position.needsUpdate = true
    g.computeVertexNormals()
    return g
  }, [worldType])

  const colors = { FOREST:'#1a4a1a', CITY:'#0a0a1a', DESERT:'#6b5020', OCEAN:'#001a33', DUNGEON:'#0a000f' }

  return (
    <mesh geometry={geo} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
      <meshStandardMaterial color={colors[worldType]||'#1a1a2e'} roughness={0.95} metalness={0.05} />
    </mesh>
  )
}

// ── FOREST DECORATIONS ─────────────────────────────────────
function ForestDecorations() {
  const trees = useMemo(() => {
    const items = []
    for (let i = 0; i < 80; i++) {
      let x, z
      do { x=(Math.random()-0.5)*360; z=(Math.random()-0.5)*360 }
      while (Math.abs(x)<12 && Math.abs(z)<12)
      items.push({ x, z, scale:0.7+Math.random()*2.2, variant:Math.floor(Math.random()*4), hue:0.27+Math.random()*0.1 })
    }
    return items
  }, [])

  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} scale={t.scale}>
          <mesh position={[0,2,0]}><cylinderGeometry args={[0.25,0.4,4,8]}/><meshStandardMaterial color="#3d2000" roughness={1}/></mesh>
          {t.variant === 0 && (<>
            <mesh position={[0,6,0]}><coneGeometry args={[3,4.5,8]}/><meshStandardMaterial color={`hsl(${t.hue*360},55%,20%)`} roughness={0.9} emissive={`hsl(${t.hue*360},40%,8%)`} emissiveIntensity={0.4}/></mesh>
            <mesh position={[0,9,0]}><coneGeometry args={[2.2,3.5,8]}/><meshStandardMaterial color={`hsl(${t.hue*360},60%,24%)`} roughness={0.9} emissive={`hsl(${t.hue*360},45%,10%)`} emissiveIntensity={0.4}/></mesh>
            <mesh position={[0,11.5,0]}><coneGeometry args={[1.4,2.8,8]}/><meshStandardMaterial color={`hsl(${t.hue*360},65%,28%)`} roughness={0.9} emissive={`hsl(${t.hue*360},50%,12%)`} emissiveIntensity={0.5}/></mesh>
          </>)}
          {t.variant === 1 && (
            <mesh position={[0,6,0]}><sphereGeometry args={[3,9,7]}/><meshStandardMaterial color={`hsl(${t.hue*360},50%,22%)`} roughness={0.9} emissive={`hsl(${t.hue*360},35%,9%)`} emissiveIntensity={0.4}/></mesh>
          )}
          {t.variant === 2 && (<>
            {[0,1,2,3].map(l=>(
              <mesh key={l} position={[0,4.5+l*1.8,0]}><cylinderGeometry args={[3-l*0.5,3.3-l*0.5,1,9]}/><meshStandardMaterial color={`hsl(${t.hue*360},55%,${19+l*4}%)`} roughness={0.9} emissive={`hsl(${t.hue*360},40%,8%)`} emissiveIntensity={0.3}/></mesh>
            ))}
          </>)}
          {t.variant === 3 && (<>
            <mesh position={[0,5.5,0]}><coneGeometry args={[3.5,5,6]}/><meshStandardMaterial color={`hsl(${t.hue*360},45%,18%)`} roughness={1} emissive={`hsl(${t.hue*360},30%,7%)`} emissiveIntensity={0.4}/></mesh>
            <mesh position={[0,9.5,0]}><coneGeometry args={[2.2,4,6]}/><meshStandardMaterial color={`hsl(${t.hue*360},50%,22%)`} roughness={1}/></mesh>
            <mesh position={[0,12.5,0]}><coneGeometry args={[1.3,3,6]}/><meshStandardMaterial color={`hsl(${t.hue*360},55%,26%)`} roughness={1}/></mesh>
          </>)}
          {i%3===0 && (
            <group position={[Math.random()*2-1,0,Math.random()*2-1]}>
              <mesh position={[0,0.18,0]}><cylinderGeometry args={[0.07,0.1,0.35,6]}/><meshStandardMaterial color="#ddd"/></mesh>
              <mesh position={[0,0.4,0]}><sphereGeometry args={[0.22,7,6]}/><meshStandardMaterial color={['#ff88aa','#88ffcc','#aaaaff','#ffcc44'][i%4]} emissive={['#ff88aa','#88ffcc','#aaaaff','#ffcc44'][i%4]} emissiveIntensity={1}/></mesh>
              <pointLight color={['#ff88aa','#88ffcc','#aaaaff','#ffcc44'][i%4]} intensity={0.5} distance={4} position={[0,0.5,0]}/>
            </group>
          )}
        </group>
      ))}
      <Sparkles count={150} scale={[350,4,350]} size={2.5} speed={0.12} color="#88ffaa" opacity={0.35}/>
      <Sparkles count={80} scale={[300,15,300]} size={1.2} speed={0.35} color="#ffffaa" opacity={0.65}/>
    </group>
  )
}

function CityDecorations() {
  const buildings = useMemo(() => {
    const items = []
    for (let i=0;i<40;i++) {
      let x,z
      do{x=(Math.random()-0.5)*320;z=(Math.random()-0.5)*320}while(Math.abs(x)<12&&Math.abs(z)<12)
      items.push({x,z,w:3+Math.random()*6,h:10+Math.random()*30,d:3+Math.random()*6})
    }
    return items
  }, [])
  return (
    <group>
      {buildings.map((b,i)=>(
        <group key={i} position={[b.x,0,b.z]}>
          <mesh position={[0,b.h/2,0]}><boxGeometry args={[b.w,b.h,b.d]}/><meshStandardMaterial color="#050510" emissive="#000044" emissiveIntensity={0.4} metalness={0.95} roughness={0.05}/></mesh>
          <pointLight position={[0,b.h*0.7,0]} color={['#0044ff','#ff0044','#00ffff','#ffaa00'][i%4]} intensity={1} distance={10}/>
          <mesh position={[0,b.h+2,0]}><cylinderGeometry args={[0.06,0.06,4,4]}/><meshStandardMaterial color="#888"/></mesh>
          <mesh position={[0,b.h+4.2,0]}><sphereGeometry args={[0.18,6,6]}/><meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1}/><pointLight color="#ff0000" intensity={0.6} distance={5}/></mesh>
        </group>
      ))}
      <Sparkles count={50} scale={[320,50,320]} size={2} speed={0.1} color="#0066ff" opacity={0.4}/>
    </group>
  )
}

function DungeonDecorations() {
  const pillars = useMemo(()=>{const items=[];for(let i=0;i<25;i++){let x,z;do{x=(Math.random()-0.5)*300;z=(Math.random()-0.5)*300}while(Math.abs(x)<8&&Math.abs(z)<8);items.push({x,z})}return items},[])
  return (
    <group>
      {pillars.map((p,i)=>(
        <group key={i} position={[p.x,0,p.z]}>
          <mesh position={[0,6,0]}><cylinderGeometry args={[0.7,0.9,12,8]}/><meshStandardMaterial color="#1a0a1a" emissive="#0a000a" metalness={0.5} roughness={0.5}/></mesh>
          <pointLight position={[0,4,0]} color={['#ff3cac','#aa00ff','#ff0066','#cc00aa'][i%4]} intensity={1.5} distance={12}/>
          <mesh position={[0,12.5,0]}><octahedronGeometry args={[0.6]}/><meshStandardMaterial color="#ff3cac" emissive="#ff3cac" emissiveIntensity={1} transparent opacity={0.9}/></mesh>
        </group>
      ))}
      <Sparkles count={80} scale={[300,18,300]} size={1.5} speed={0.2} color="#ff3cac" opacity={0.6}/>
    </group>
  )
}

function DesertDecorations() {
  const rocks = useMemo(()=>{const items=[];for(let i=0;i<50;i++){let x,z;do{x=(Math.random()-0.5)*360;z=(Math.random()-0.5)*360}while(Math.abs(x)<8&&Math.abs(z)<8);items.push({x,z,s:0.5+Math.random()*3,rx:Math.random()*Math.PI,ry:Math.random()*Math.PI})}return items},[])
  return (
    <group>
      {rocks.map((r,i)=>(<mesh key={i} position={[r.x,r.s*0.4,r.z]} rotation={[r.rx,r.ry,0]} scale={r.s}><dodecahedronGeometry args={[1]}/><meshStandardMaterial color="#8b6914" roughness={0.95}/></mesh>))}
      {Array.from({length:20},(_,i)=>{const x=(Math.random()-0.5)*320,z=(Math.random()-0.5)*320;return(<group key={`c${i}`} position={[x,0,z]}><mesh position={[0,2.5,0]}><cylinderGeometry args={[0.35,0.45,5,8]}/><meshStandardMaterial color="#2a6a2a" roughness={0.8}/></mesh><mesh position={[1,3,0]}><cylinderGeometry args={[0.22,0.22,2,8]}/><meshStandardMaterial color="#2a6a2a" roughness={0.8}/></mesh></group>)})}
    </group>
  )
}

function OceanDecorations() {
  return (
    <group>
      {Array.from({length:30},(_,i)=>{const x=(Math.random()-0.5)*320,z=(Math.random()-0.5)*320,h=1+Math.random()*5;return(<group key={i} position={[x,0,z]}><mesh position={[0,h/2,0]}><cylinderGeometry args={[0.12,0.22,h,6]}/><meshStandardMaterial color="#004466" emissive="#002233"/></mesh><mesh position={[0,h+0.4,0]}><sphereGeometry args={[0.5,8,8]}/><meshStandardMaterial color="#00aacc" emissive="#00aacc" emissiveIntensity={0.7} transparent opacity={0.85}/><pointLight color="#00ccff" intensity={1} distance={6}/></mesh></group>)})}
      <Sparkles count={60} scale={[320,10,320]} size={2} speed={0.4} color="#00ccff" opacity={0.7}/>
    </group>
  )
}

// ── AI COMPANION IN WORLD ──────────────────────────────────
function AICompanion({ playerPos, worldType, onSpeak }) {
  const groupRef = useRef()
  const targetPos = useRef({ x: 4, z: 4 })
  const floatOffset = useRef(Math.random() * Math.PI * 2)
  const speakTimer = useRef(0)
  const cfg = WORLD_CONFIGS[worldType] || WORLD_CONFIGS.FOREST
  const col = cfg.companion.color

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!groupRef.current || !playerPos.current) return

    // Follow player at offset distance
    const px = playerPos.current.x
    const pz = playerPos.current.z
    const angle = t * 0.3 + floatOffset.current
    const radius = 4
    targetPos.current.x = px + Math.cos(angle) * radius
    targetPos.current.z = pz + Math.sin(angle) * radius

    // Smooth follow
    groupRef.current.position.x += (targetPos.current.x - groupRef.current.position.x) * 0.04
    groupRef.current.position.z += (targetPos.current.z - groupRef.current.position.z) * 0.04
    groupRef.current.position.y = 3 + Math.sin(t * 1.2 + floatOffset.current) * 0.5

    // Rotate to face player
    const dx = px - groupRef.current.position.x
    const dz = pz - groupRef.current.position.z
    groupRef.current.rotation.y = Math.atan2(dx, dz)

    // Speak occasionally
    speakTimer.current += 0.016
    if (speakTimer.current > 25 + Math.random() * 15) {
      speakTimer.current = 0
      const greetings = cfg.companion.greetings
      onSpeak && onSpeak(greetings[Math.floor(Math.random() * greetings.length)], cfg.companion.name)
    }
  })

  return (
    <group ref={groupRef} position={[4, 3, 4]}>
      {/* Companion body — orb shape */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.6} transparent opacity={0.85} metalness={0.3} roughness={0.2} />
      </mesh>
      {/* Inner core */}
      <mesh>
        <sphereGeometry args={[0.35, 12, 12]} />
        <meshStandardMaterial color="#ffffff" emissive={col} emissiveIntensity={1} transparent opacity={0.7} />
      </mesh>
      {/* Orbiting ring */}
      <mesh rotation={[Math.PI/3, 0, 0]}>
        <torusGeometry args={[1, 0.04, 8, 32]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI/4, Math.PI/3, 0]}>
        <torusGeometry args={[1.2, 0.03, 8, 32]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.6} transparent opacity={0.6} />
      </mesh>
      {/* Glow light */}
      <pointLight color={col} intensity={3} distance={12} />
      {/* Particles around companion */}
      <Sparkles count={20} scale={[3,3,3]} size={1.5} speed={0.8} color={col} opacity={0.8} />
    </group>
  )
}

// ── AVATAR ─────────────────────────────────────────────────
function Avatar({ position, color, isMe, avatarType, avatarRef }) {
  const localRef = useRef()
  const groupRef = avatarRef || localRef
  const ringRef = useRef()
  const typeColors = { WARRIOR:'#ff4444', MAGE:'#aa44ff', RANGER:'#44ffaa', ROGUE:'#ffaa00' }
  const col = isMe ? color : (typeColors[avatarType] || '#00ffc8')

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.025
      ringRef.current.material.opacity = 0.4 + Math.sin(t*2.5)*0.3
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0,0.01,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[0.7,20]}/><meshBasicMaterial color="#000000" transparent opacity={0.25}/></mesh>
      <mesh position={[-0.22,0.55,0]}><cylinderGeometry args={[0.14,0.17,1.1,8]}/><meshStandardMaterial color={col} metalness={0.6} roughness={0.3}/></mesh>
      <mesh position={[0.22,0.55,0]}><cylinderGeometry args={[0.14,0.17,1.1,8]}/><meshStandardMaterial color={col} metalness={0.6} roughness={0.3}/></mesh>
      <mesh position={[0,1.5,0]}><boxGeometry args={[0.75,1,0.48]}/><meshStandardMaterial color={col} metalness={0.7} roughness={0.2} emissive={col} emissiveIntensity={0.15}/></mesh>
      <mesh position={[-0.55,1.5,0]}><cylinderGeometry args={[0.13,0.15,0.85,8]}/><meshStandardMaterial color={col} metalness={0.6} roughness={0.3}/></mesh>
      <mesh position={[0.55,1.5,0]}><cylinderGeometry args={[0.13,0.15,0.85,8]}/><meshStandardMaterial color={col} metalness={0.6} roughness={0.3}/></mesh>
      <mesh position={[0,2.35,0]}><boxGeometry args={[0.58,0.58,0.52]}/><meshStandardMaterial color="#ffccaa" roughness={0.7}/></mesh>
      <mesh position={[-0.15,2.38,0.27]}><sphereGeometry args={[0.08,8,8]}/><meshStandardMaterial color="#000000" emissive={col} emissiveIntensity={1}/></mesh>
      <mesh position={[0.15,2.38,0.27]}><sphereGeometry args={[0.08,8,8]}/><meshStandardMaterial color="#000000" emissive={col} emissiveIntensity={1}/></mesh>
      <mesh position={[0,2.72,0]}><boxGeometry args={[0.6,0.22,0.54]}/><meshStandardMaterial color="#1a0a00" roughness={0.9}/></mesh>
      <mesh ref={ringRef} position={[0,0.06,0]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[0.75,0.055,8,32]}/><meshStandardMaterial color={col} emissive={col} emissiveIntensity={1} transparent opacity={0.7}/></mesh>
      <pointLight color={col} intensity={isMe?2.5:1.2} distance={10}/>
      {isMe&&<mesh position={[0,3.2,0]}><sphereGeometry args={[0.12,8,8]}/><meshStandardMaterial color={col} emissive={col} emissiveIntensity={1}/><pointLight color={col} intensity={1.2} distance={5}/></mesh>}
    </group>
  )
}

// ── MOVEMENT CONTROLLER ────────────────────────────────────
function MovementController({ keys, posRef, onMove, onStep, avatarRef }) {
  const stepTimer = useRef(0)
  const targetRotation = useRef(0)

  useFrame(() => {
    const SPEED=0.15, BOUND=180
    let dx=0, dz=0
    if (keys.current['w']||keys.current['arrowup'])    dz=-SPEED
    if (keys.current['s']||keys.current['arrowdown'])  dz=+SPEED
    if (keys.current['a']||keys.current['arrowleft'])  dx=-SPEED
    if (keys.current['d']||keys.current['arrowright']) dx=+SPEED
    const moved = dx!==0||dz!==0
    if (moved) {
      posRef.current.x = Math.max(-BOUND, Math.min(BOUND, posRef.current.x+dx))
      posRef.current.z = Math.max(-BOUND, Math.min(BOUND, posRef.current.z+dz))
      targetRotation.current = Math.atan2(dx, dz)
      onMove&&onMove(posRef.current.x, posRef.current.z)
      stepTimer.current += 0.15
      if (stepTimer.current>0.5){onStep&&onStep();stepTimer.current=0}
    }
    if (avatarRef?.current) {
      const cur = avatarRef.current.rotation.y
      const diff = targetRotation.current - cur
      const wrapped = ((diff+Math.PI)%(Math.PI*2))-Math.PI
      avatarRef.current.rotation.y += wrapped*0.12
    }
  })
  return null
}

// ── CAMERA FOLLOWER ────────────────────────────────────────
function CameraFollower({ posRef }) {
  const orbitRef = useRef()
  useFrame(() => {
    if (!posRef.current||!orbitRef.current) return
    orbitRef.current.target.x += (posRef.current.x - orbitRef.current.target.x) * 0.08
    orbitRef.current.target.z += (posRef.current.z - orbitRef.current.target.z) * 0.08
    orbitRef.current.target.y = 1.5
    orbitRef.current.update()
  })
  return (
    <OrbitControls ref={orbitRef} enablePan={false} enableZoom={true}
      minDistance={5} maxDistance={40}
      minPolarAngle={Math.PI/10} maxPolarAngle={Math.PI/2.1}
      rotateSpeed={0.6} zoomSpeed={0.8}
    />
  )
}

// ── COMPANION DIALOGUE UI ──────────────────────────────────
function CompanionDialogue({ message, name, color }) {
  if (!message) return null
  return (
    <div style={{
      position:'absolute', bottom:120, left:'50%', transform:'translateX(-50%)',
      background:'rgba(0,0,0,0.85)', border:`1px solid ${color}66`,
      padding:'14px 24px', maxWidth:500, zIndex:200,
      fontFamily:"'Share Tech Mono',monospace",
      boxShadow:`0 0 30px ${color}22`,
      animation:'fadeIn 0.3s ease'
    }}>
      <div style={{ fontSize:10, color:color, letterSpacing:3, marginBottom:6, textTransform:'uppercase' }}>
        ⬡ {name} · AI COMPANION
      </div>
      <div style={{ fontSize:13, color:'rgba(200,230,255,0.9)', lineHeight:1.7, letterSpacing:0.5 }}>
        "{message}"
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
    </div>
  )
}

// ── MAIN COMPONENT ─────────────────────────────────────────
export default function WorldRoom3D({ players, myAvatarId, worldType, onMove }) {
  const keys = useRef({})
  const myPos = useRef({ x:0, y:0, z:0 })
  const avatarRef = useRef()
  const [timeOfDay, setTimeOfDay] = useState(0.35)
  const [myPosition, setMyPosition] = useState([0,0,0])
  const [otherPlayers, setOtherPlayers] = useState([])
  const [companionMsg, setCompanionMsg] = useState('')
  const [companionName, setCompanionName] = useState('')
  const msgTimer = useRef(null)
  const cfg = WORLD_CONFIGS[worldType] || WORLD_CONFIGS.CITY

  // Web Speech API — companion voice
  function speak(text, name) {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 0.85
    utter.pitch = name === 'MIMIR' ? 0.7 : 1.1
    utter.volume = 0.8
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      utter.voice = voices.find(v => v.lang.startsWith('en')) || voices[0]
    }
    window.speechSynthesis.speak(utter)
  }

  function handleCompanionSpeak(msg, name) {
    setCompanionMsg(msg)
    setCompanionName(name)
    speak(msg, name)
    if (msgTimer.current) clearTimeout(msgTimer.current)
    msgTimer.current = setTimeout(() => setCompanionMsg(''), 6000)
  }

  // Greet on entry
  useEffect(() => {
    const timer = setTimeout(() => {
      const c = cfg.companion
      handleCompanionSpeak(c.greetings[0], c.name)
    }, 2000)
    return () => clearTimeout(timer)
  }, [worldType])

  useEffect(() => {
    const onKeyDown = e => { keys.current[e.key.toLowerCase()]=true }
    const onKeyUp   = e => { keys.current[e.key.toLowerCase()]=false }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown',onKeyDown)
      window.removeEventListener('keyup',onKeyUp)
      window.speechSynthesis?.cancel()
    }
  }, [])

  useEffect(() => {
    setOtherPlayers(players.filter(p => p.avatarId !== myAvatarId))
  }, [players, myAvatarId])

  const handleMove = useCallback((x,z) => {
    setMyPosition([x,0,z])
    onMove&&onMove(x,z)
  }, [onMove])

  const handleStep = useCallback(() => {
    playFootstep(worldType==='DESERT'?'sand':worldType==='OCEAN'?'water':'grass')
  }, [worldType])

  const typeColors = { WARRIOR:'#ff4444', MAGE:'#aa44ff', RANGER:'#44ffaa', ROGUE:'#ffaa00' }

  return (
    <div style={{ width:'100%', height:'100%', position:'absolute', inset:0 }}>
      <AmbientSound worldType={worldType} active={true} />

      <Canvas
        shadows={false}
        camera={{ position:[0,14,20], fov:68 }}
        gl={{ antialias:false, powerPreference:"high-performance", toneMapping:THREE.ACESFilmicToneMapping, toneMappingExposure:1.4 }}
        dpr={[1,1.5]}
      >
        <fog attach="fog" args={[cfg.fogColor, cfg.fogNear, cfg.fogFar]} />
        <ambientLight color={cfg.ambientColor} intensity={cfg.ambientIntensity} />
        <directionalLight color={cfg.sunColor} intensity={3} position={[60,100,40]} />
        <pointLight color="#ffffcc" intensity={5} distance={400} position={[100,150,80]} />
        <pointLight color={cfg.pointColor} intensity={2} distance={200} position={[0,30,0]} />
        <pointLight color={cfg.pointColor} intensity={1.5} distance={100} position={[0,3,0]} />

        <SkySystem timeOfDay={timeOfDay} worldType={worldType} />
        <DayNightCycle onTimeUpdate={setTimeOfDay} speed={0.0002} />
        <WeatherSystem weather={cfg.weather} worldType={worldType} />
        <Terrain worldType={worldType} />
        <gridHelper args={[400, 80, cfg.gridColor, cfg.gridColor2]} position={[0,0.05,0]} />

        {worldType==='FOREST'  && <ForestDecorations />}
        {worldType==='CITY'    && <CityDecorations />}
        {worldType==='DUNGEON' && <DungeonDecorations />}
        {worldType==='DESERT'  && <DesertDecorations />}
        {worldType==='OCEAN'   && <OceanDecorations />}

        <AICompanion playerPos={myPos} worldType={worldType} onSpeak={handleCompanionSpeak} />

        <Avatar position={myPosition} color="#00ffc8" isMe={true} avatarType="WARRIOR" avatarRef={avatarRef} />
        {otherPlayers.map(p => (
          <Avatar key={p.avatarId} position={[p.positionX||0,0,p.positionY||0]} color={typeColors[p.avatarType]||'#0080ff'} isMe={false} avatarType={p.avatarType} />
        ))}

        <CameraFollower posRef={myPos} />
        <MovementController keys={keys} posRef={myPos} onMove={handleMove} onStep={handleStep} avatarRef={avatarRef} />
      </Canvas>

      {/* Companion Dialogue */}
      <CompanionDialogue message={companionMsg} name={companionName} color={cfg.companion.color} />
    </div>
  )
}
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import SkySystem from './world/SkySystem'
import WeatherSystem from './world/WeatherSystem'
import TerrainSystem from './world/TerrainSystem'
import DayNightCycle from './world/DayNightCycle'
import AmbientSound from './world/AmbientSound'
import { playFootstep } from '../audio/worldSounds'

const WORLD_CONFIGS = {
  FOREST:  { fogColor:'#0a1a0a', ambientColor:'#112211', ambientIntensity:1.5, sunColor:'#88ff88', pointColor:'#00ff88', gridColor:'#00aa44', gridColor2:'#001a08', weather:'clear' },
  CITY:    { fogColor:'#000510', ambientColor:'#111122', ambientIntensity:1.2, sunColor:'#4488ff', pointColor:'#0066ff', gridColor:'#0066ff', gridColor2:'#000a1a', weather:'rain' },
  DESERT:  { fogColor:'#1a0f00', ambientColor:'#221a00', ambientIntensity:2,   sunColor:'#ffcc44', pointColor:'#ffaa00', gridColor:'#cc8800', gridColor2:'#1a0f00', weather:'clear' },
  OCEAN:   { fogColor:'#000a15', ambientColor:'#001122', ambientIntensity:1.3, sunColor:'#44aaff', pointColor:'#00ccff', gridColor:'#0088cc', gridColor2:'#000a15', weather:'clear' },
  DUNGEON: { fogColor:'#050005', ambientColor:'#110011', ambientIntensity:0.8, sunColor:'#ff3cac', pointColor:'#ff00aa', gridColor:'#aa0066', gridColor2:'#0a000a', weather:'clear' },
}

function ForestDecorations() {
  const trees = useMemo(() => {
    const items = []
    for (let i = 0; i < 60; i++) {
      let x, z
      do { x = (Math.random()-0.5)*180; z = (Math.random()-0.5)*180 }
      while (Math.abs(x) < 10 && Math.abs(z) < 10)
      items.push({ x, z, scale: 0.8+Math.random()*1.8, variant: Math.floor(Math.random()*4), hue: 0.28+Math.random()*0.08 })
    }
    return items
  }, [])

  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} scale={t.scale}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.22, 0.32, 3, 7]} />
            <meshStandardMaterial color="#2d1a00" roughness={1} />
          </mesh>
          {[0,1,2,3].map(r => (
            <mesh key={r} position={[Math.cos(r*Math.PI/2)*0.4, 0.2, Math.sin(r*Math.PI/2)*0.4]} rotation={[0, r*Math.PI/2, 0.4]}>
              <cylinderGeometry args={[0.08, 0.15, 0.8, 5]} />
              <meshStandardMaterial color="#2d1a00" roughness={1} />
            </mesh>
          ))}
          {t.variant === 0 && (<>
            <mesh position={[0,5.5,0]}><coneGeometry args={[2.8,3.5,7]}/><meshStandardMaterial color={`hsl(${t.hue*360},60%,18%)`} roughness={0.9} emissive={`hsl(${t.hue*360},40%,8%)`} emissiveIntensity={0.3}/></mesh>
            <mesh position={[0,7.5,0]}><coneGeometry args={[2.2,3,7]}/><meshStandardMaterial color={`hsl(${t.hue*360},65%,22%)`} roughness={0.9} emissive={`hsl(${t.hue*360},45%,10%)`} emissiveIntensity={0.3}/></mesh>
            <mesh position={[0,9.2,0]}><coneGeometry args={[1.5,2.5,7]}/><meshStandardMaterial color={`hsl(${t.hue*360},70%,25%)`} roughness={0.9} emissive={`hsl(${t.hue*360},50%,12%)`} emissiveIntensity={0.4}/></mesh>
          </>)}
          {t.variant === 1 && (<>
            <mesh position={[0,5,0]}><sphereGeometry args={[2.5,8,6]}/><meshStandardMaterial color={`hsl(${t.hue*360},55%,20%)`} roughness={0.9} emissive={`hsl(${t.hue*360},40%,8%)`} emissiveIntensity={0.3}/></mesh>
            <mesh position={[0.8,5.5,0.8]}><sphereGeometry args={[1.5,7,5]}/><meshStandardMaterial color={`hsl(${t.hue*360},60%,24%)`} roughness={0.9}/></mesh>
          </>)}
          {t.variant === 2 && (<>
            {[0,1,2,3].map(l => (
              <mesh key={l} position={[0,4+l*1.5,0]}>
                <cylinderGeometry args={[2.5-l*0.4, 2.8-l*0.4, 0.8, 8]}/>
                <meshStandardMaterial color={`hsl(${t.hue*360},60%,${18+l*3}%)`} roughness={0.9} emissive={`hsl(${t.hue*360},40%,8%)`} emissiveIntensity={0.3}/>
              </mesh>
            ))}
          </>)}
          {t.variant === 3 && (<>
            <mesh position={[0,5,0]}><coneGeometry args={[3,4,5]}/><meshStandardMaterial color={`hsl(${t.hue*360},50%,16%)`} roughness={1} emissive={`hsl(${t.hue*360},30%,6%)`} emissiveIntensity={0.4}/></mesh>
            <mesh position={[0,8,0]}><coneGeometry args={[2,3.5,5]}/><meshStandardMaterial color={`hsl(${t.hue*360},55%,20%)`} roughness={1}/></mesh>
            <mesh position={[0,10.5,0]}><coneGeometry args={[1.2,2.5,5]}/><meshStandardMaterial color={`hsl(${t.hue*360},60%,24%)`} roughness={1}/></mesh>
          </>)}
          {i % 4 === 0 && (
            <group position={[Math.random()*1.5-0.75, 0, Math.random()*1.5-0.75]}>
              <mesh position={[0,0.15,0]}><cylinderGeometry args={[0.06,0.08,0.3,6]}/><meshStandardMaterial color="#ddddcc"/></mesh>
              <mesh position={[0,0.35,0]}>
                <sphereGeometry args={[0.2,7,5]}/>
                <meshStandardMaterial color={['#ff88aa','#88ffcc','#aaaaff','#ffcc88'][i%4]} emissive={['#ff88aa','#88ffcc','#aaaaff','#ffcc88'][i%4]} emissiveIntensity={0.8}/>
              </mesh>
              <pointLight color={['#ff88aa','#88ffcc','#aaaaff','#ffcc88'][i%4]} intensity={0.6} distance={3} position={[0,0.5,0]}/>
            </group>
          )}
        </group>
      ))}
      <Sparkles count={120} scale={[180,3,180]} size={3} speed={0.15} color="#88ffaa" opacity={0.4}/>
      <Sparkles count={60} scale={[160,12,160]} size={1.5} speed={0.4} color="#ffffaa" opacity={0.7}/>
    </group>
  )
}

function CityDecorations() {
  const buildings = useMemo(() => {
    const items = []
    for (let i = 0; i < 30; i++) {
      let x, z
      do { x=(Math.random()-0.5)*160; z=(Math.random()-0.5)*160 }
      while (Math.abs(x)<10 && Math.abs(z)<10)
      items.push({ x, z, w:3+Math.random()*5, h:8+Math.random()*22, d:3+Math.random()*5 })
    }
    return items
  }, [])
  return (
    <group>
      {buildings.map((b,i) => (
        <group key={i} position={[b.x,0,b.z]}>
          <mesh position={[0,b.h/2,0]}><boxGeometry args={[b.w,b.h,b.d]}/><meshStandardMaterial color="#050510" emissive="#000033" emissiveIntensity={0.3} metalness={0.9} roughness={0.1}/></mesh>
          <pointLight position={[0,b.h*0.7,0]} color={['#0044ff','#ff0044','#00ffff','#ffaa00'][i%4]} intensity={0.8} distance={8}/>
          <mesh position={[0,b.h+1.5,0]}><cylinderGeometry args={[0.05,0.05,3,4]}/><meshStandardMaterial color="#aaaaaa"/></mesh>
          <mesh position={[0,b.h+3.2,0]}><sphereGeometry args={[0.15,6,6]}/><meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1}/><pointLight color="#ff0000" intensity={0.5} distance={4}/></mesh>
        </group>
      ))}
      <Sparkles count={40} scale={[160,40,160]} size={2} speed={0.1} color="#0066ff" opacity={0.5}/>
    </group>
  )
}

function DungeonDecorations() {
  const pillars = useMemo(() => {
    const items = []
    for (let i=0;i<20;i++) {
      let x,z
      do { x=(Math.random()-0.5)*160; z=(Math.random()-0.5)*160 }
      while (Math.abs(x)<8 && Math.abs(z)<8)
      items.push({x,z})
    }
    return items
  }, [])
  return (
    <group>
      {pillars.map((p,i) => (
        <group key={i} position={[p.x,0,p.z]}>
          <mesh position={[0,5,0]}><cylinderGeometry args={[0.6,0.8,10,8]}/><meshStandardMaterial color="#1a0a1a" emissive="#0a000a" metalness={0.5} roughness={0.5}/></mesh>
          <pointLight position={[0,3,0]} color={['#ff3cac','#aa00ff','#ff0066','#cc00aa'][i%4]} intensity={1.2} distance={10}/>
          <mesh position={[0,10.5,0]}><octahedronGeometry args={[0.5]}/><meshStandardMaterial color="#ff3cac" emissive="#ff3cac" emissiveIntensity={0.8} transparent opacity={0.8}/></mesh>
        </group>
      ))}
      <Sparkles count={60} scale={[160,15,160]} size={1.5} speed={0.2} color="#ff3cac" opacity={0.6}/>
    </group>
  )
}

function DesertDecorations() {
  const rocks = useMemo(() => {
    const items = []
    for (let i=0;i<35;i++) {
      let x,z
      do { x=(Math.random()-0.5)*180; z=(Math.random()-0.5)*180 }
      while (Math.abs(x)<6 && Math.abs(z)<6)
      items.push({x,z,s:0.5+Math.random()*2.5,rx:Math.random()*Math.PI,ry:Math.random()*Math.PI})
    }
    return items
  }, [])
  return (
    <group>
      {rocks.map((r,i) => (
        <mesh key={i} position={[r.x,r.s*0.4,r.z]} rotation={[r.rx,r.ry,0]} scale={r.s}>
          <dodecahedronGeometry args={[1]}/><meshStandardMaterial color="#8b6914" roughness={0.9}/>
        </mesh>
      ))}
      {Array.from({length:15},(_,i) => {
        const x=(Math.random()-0.5)*160, z=(Math.random()-0.5)*160
        return (
          <group key={`c${i}`} position={[x,0,z]}>
            <mesh position={[0,2,0]}><cylinderGeometry args={[0.3,0.4,4,8]}/><meshStandardMaterial color="#2a6a2a" roughness={0.8}/></mesh>
            <mesh position={[0.8,2.5,0]}><cylinderGeometry args={[0.2,0.2,1.5,8]}/><meshStandardMaterial color="#2a6a2a" roughness={0.8}/></mesh>
          </group>
        )
      })}
    </group>
  )
}

function OceanDecorations() {
  return (
    <group>
      {Array.from({length:25},(_,i) => {
        const x=(Math.random()-0.5)*160, z=(Math.random()-0.5)*160, h=1+Math.random()*4
        return (
          <group key={i} position={[x,0,z]}>
            <mesh position={[0,h/2,0]}><cylinderGeometry args={[0.1,0.2,h,6]}/><meshStandardMaterial color="#004466" emissive="#002233"/></mesh>
            <mesh position={[0,h+0.3,0]}><sphereGeometry args={[0.4,8,8]}/><meshStandardMaterial color="#00aacc" emissive="#00aacc" emissiveIntensity={0.6} transparent opacity={0.8}/><pointLight color="#00ccff" intensity={0.8} distance={5}/></mesh>
          </group>
        )
      })}
      <Sparkles count={50} scale={[160,8,160]} size={2} speed={0.4} color="#00ccff" opacity={0.7}/>
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
      ringRef.current.rotation.y += 0.02
      ringRef.current.material.opacity = 0.4+Math.sin(t*2)*0.3
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Shadow */}
      <mesh position={[0,0.01,0]} rotation={[-Math.PI/2,0,0]}>
        <circleGeometry args={[0.6,16]}/><meshBasicMaterial color="#000000" transparent opacity={0.3}/>
      </mesh>
      {/* Legs */}
      <mesh position={[-0.2,0.5,0]}><cylinderGeometry args={[0.15,0.18,1,8]}/><meshStandardMaterial color={col} metalness={0.6} roughness={0.3}/></mesh>
      <mesh position={[0.2,0.5,0]}><cylinderGeometry args={[0.15,0.18,1,8]}/><meshStandardMaterial color={col} metalness={0.6} roughness={0.3}/></mesh>
      {/* Body */}
      <mesh position={[0,1.4,0]}><boxGeometry args={[0.7,0.9,0.45]}/><meshStandardMaterial color={col} metalness={0.7} roughness={0.2} emissive={col} emissiveIntensity={0.15}/></mesh>
      {/* Arms */}
      <mesh position={[-0.5,1.4,0]}><cylinderGeometry args={[0.12,0.14,0.8,8]}/><meshStandardMaterial color={col} metalness={0.6} roughness={0.3}/></mesh>
      <mesh position={[0.5,1.4,0]}><cylinderGeometry args={[0.12,0.14,0.8,8]}/><meshStandardMaterial color={col} metalness={0.6} roughness={0.3}/></mesh>
      {/* Head */}
      <mesh position={[0,2.2,0]}><boxGeometry args={[0.55,0.55,0.5]}/><meshStandardMaterial color="#ffccaa" roughness={0.7}/></mesh>
      {/* Eyes */}
      <mesh position={[-0.14,2.25,0.26]}><sphereGeometry args={[0.07,8,8]}/><meshStandardMaterial color="#000000" emissive={col} emissiveIntensity={0.8}/></mesh>
      <mesh position={[0.14,2.25,0.26]}><sphereGeometry args={[0.07,8,8]}/><meshStandardMaterial color="#000000" emissive={col} emissiveIntensity={0.8}/></mesh>
      {/* Hair */}
      <mesh position={[0,2.55,0]}><boxGeometry args={[0.58,0.2,0.52]}/><meshStandardMaterial color="#1a0a00" roughness={0.9}/></mesh>
      {/* Glow ring */}
      <mesh ref={ringRef} position={[0,0.05,0]} rotation={[-Math.PI/2,0,0]}>
        <torusGeometry args={[0.7,0.05,8,32]}/><meshStandardMaterial color={col} emissive={col} emissiveIntensity={1} transparent opacity={0.7}/>
      </mesh>
      <pointLight color={col} intensity={isMe?2:1} distance={8}/>
      {isMe && (
        <mesh position={[0,3,0]}>
          <sphereGeometry args={[0.1,8,8]}/><meshStandardMaterial color={col} emissive={col} emissiveIntensity={1}/>
          <pointLight color={col} intensity={1} distance={4}/>
        </mesh>
      )}
    </group>
  )
}

// ── MOVEMENT + ROTATION CONTROLLER ────────────────────────
function MovementController({ keys, posRef, onMove, onStep, avatarRef }) {
  const stepTimer = useRef(0)
  const targetRotation = useRef(0)

  useFrame(() => {
    const SPEED=0.12, BOUND=90
    let dx=0, dz=0

    if (keys.current['w']||keys.current['arrowup'])    dz=-SPEED
    if (keys.current['s']||keys.current['arrowdown'])  dz=+SPEED
    if (keys.current['a']||keys.current['arrowleft'])  dx=-SPEED
    if (keys.current['d']||keys.current['arrowright']) dx=+SPEED

    const moved = dx !== 0 || dz !== 0

    if (moved) {
      posRef.current.x = Math.max(-BOUND, Math.min(BOUND, posRef.current.x + dx))
      posRef.current.z = Math.max(-BOUND, Math.min(BOUND, posRef.current.z + dz))
      targetRotation.current = Math.atan2(dx, dz)
      onMove && onMove(posRef.current.x, posRef.current.z)
      stepTimer.current += 0.12
      if (stepTimer.current > 0.5) { onStep && onStep(); stepTimer.current=0 }
    }

    // Smooth rotation
    if (avatarRef?.current) {
      const cur = avatarRef.current.rotation.y
      const diff = targetRotation.current - cur
      const wrapped = ((diff + Math.PI) % (Math.PI*2)) - Math.PI
      avatarRef.current.rotation.y += wrapped * 0.12
    }
  })
  return null
}

// ── CAMERA FOLLOW CONTROLLER ──────────────────────────────
function CameraFollower({ posRef }) {
  const { camera } = useThree()
  const orbitRef = useRef()

  useFrame(() => {
    if (!posRef.current) return
    const tx = posRef.current.x
    const tz = posRef.current.z
    // Softly move orbit target to follow player
    if (orbitRef.current) {
      orbitRef.current.target.x += (tx - orbitRef.current.target.x) * 0.08
      orbitRef.current.target.z += (tz - orbitRef.current.target.z) * 0.08
      orbitRef.current.target.y = 1
      orbitRef.current.update()
    }
  })

  return (
    <OrbitControls
      ref={orbitRef}
      enablePan={false}
      enableZoom={true}
      minDistance={6}
      maxDistance={35}
      minPolarAngle={Math.PI / 8}
      maxPolarAngle={Math.PI / 2.2}
      rotateSpeed={0.6}
      zoomSpeed={0.8}
    />
  )
}

// ── MAIN COMPONENT ─────────────────────────────────────────
export default function WorldRoom3D({ players, myAvatarId, worldType, onMove }) {
  const keys = useRef({})
  const myPos = useRef({ x:0, y:0, z:0 })
  const avatarRef = useRef()
  const [timeOfDay, setTimeOfDay] = useState(0.3)
  const [myPosition, setMyPosition] = useState([0,0,0])
  const [otherPlayers, setOtherPlayers] = useState([])
  const cfg = WORLD_CONFIGS[worldType] || WORLD_CONFIGS.CITY

  useEffect(() => {
    const onKeyDown = e => { keys.current[e.key.toLowerCase()]=true }
    const onKeyUp   = e => { keys.current[e.key.toLowerCase()]=false }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown',onKeyDown)
      window.removeEventListener('keyup',onKeyUp)
    }
  }, [])

  useEffect(() => {
    setOtherPlayers(players.filter(p => p.avatarId !== myAvatarId))
  }, [players, myAvatarId])

  const handleMove = useCallback((x,z) => {
    setMyPosition([x,0,z])
    onMove && onMove(x,z)
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
        camera={{ position:[0, 12, 18], fov:70 }}
        gl={{ antialias:false, powerPreference:"high-performance", toneMapping:THREE.ACESFilmicToneMapping, toneMappingExposure:1.2 }}
        dpr={[1,1.5]}
      >
        <fog attach="fog" args={[cfg.fogColor, 60, 250]} />
        <ambientLight color={cfg.ambientColor} intensity={cfg.ambientIntensity} />
        <directionalLight color={cfg.sunColor} intensity={2.5} position={[50,80,30]} />
        <pointLight color="#ffffaa" intensity={4} distance={300} position={[80,120,60]} />
        <pointLight color="#004422" intensity={2} distance={150} position={[-60,30,-60]} />
        <pointLight color="#00aa44" intensity={1.5} distance={80} position={[0,2,0]} />
        <pointLight color={cfg.pointColor} intensity={3} distance={80} position={[0,20,0]} />

        <SkySystem timeOfDay={timeOfDay} worldType={worldType} />
        <DayNightCycle onTimeUpdate={setTimeOfDay} speed={0.0003} />
        <WeatherSystem weather={cfg.weather} worldType={worldType} />
        <TerrainSystem worldType={worldType} size={200} />
        <gridHelper args={[200,60,cfg.gridColor,cfg.gridColor2]} position={[0,0.02,0]} />

        {worldType==='FOREST'  && <ForestDecorations />}
        {worldType==='CITY'    && <CityDecorations />}
        {worldType==='DUNGEON' && <DungeonDecorations />}
        {worldType==='DESERT'  && <DesertDecorations />}
        {worldType==='OCEAN'   && <OceanDecorations />}

        <Avatar position={myPosition} color="#00ffc8" isMe={true} avatarType="WARRIOR" avatarRef={avatarRef} />
        {otherPlayers.map(p => (
          <Avatar key={p.avatarId} position={[p.positionX||0,0,p.positionY||0]} color={typeColors[p.avatarType]||'#0080ff'} isMe={false} avatarType={p.avatarType} />
        ))}

        <CameraFollower posRef={myPos} />
        <MovementController keys={keys} posRef={myPos} onMove={handleMove} onStep={handleStep} avatarRef={avatarRef} />
      </Canvas>
    </div>
  )
}
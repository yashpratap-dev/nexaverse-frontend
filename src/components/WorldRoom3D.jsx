import { useEffect, useRef, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Sparkles, Environment } from '@react-three/drei'
import * as THREE from 'three'
import SkySystem from './world/SkySystem'
import WeatherSystem from './world/WeatherSystem'
import TerrainSystem from './world/TerrainSystem'
import DayNightCycle from './world/DayNightCycle'
import AmbientSound from './world/AmbientSound'
import { playFootstep, resumeAudio } from '../audio/worldSounds'

// ── WORLD CONFIGS ──────────────────────────────────────────
const WORLD_CONFIGS = {
  FOREST: {
    fogColor: '#0a1a0a', fogDensity: 0.018,
    ambientColor: '#112211', ambientIntensity: 1.5,
    sunColor: '#88ff88', pointColor: '#00ff88',
    gridColor: '#00aa44', gridColor2: '#001a08',
    floorColor: '#1a3a1a',
    weather: 'clear',
    decorations: 'forest',
  },
  CITY: {
    fogColor: '#000510', fogDensity: 0.012,
    ambientColor: '#111122', ambientIntensity: 1.2,
    sunColor: '#4488ff', pointColor: '#0066ff',
    gridColor: '#0066ff', gridColor2: '#000a1a',
    floorColor: '#0a0a1a',
    weather: 'rain',
    decorations: 'city',
  },
  DESERT: {
    fogColor: '#1a0f00', fogDensity: 0.01,
    ambientColor: '#221a00', ambientIntensity: 2,
    sunColor: '#ffcc44', pointColor: '#ffaa00',
    gridColor: '#cc8800', gridColor2: '#1a0f00',
    floorColor: '#3a2a0a',
    weather: 'clear',
    decorations: 'desert',
  },
  OCEAN: {
    fogColor: '#000a15', fogDensity: 0.015,
    ambientColor: '#001122', ambientIntensity: 1.3,
    sunColor: '#44aaff', pointColor: '#00ccff',
    gridColor: '#0088cc', gridColor2: '#000a15',
    floorColor: '#001a2e',
    weather: 'clear',
    decorations: 'ocean',
  },
  DUNGEON: {
    fogColor: '#050005', fogDensity: 0.025,
    ambientColor: '#110011', ambientIntensity: 0.8,
    sunColor: '#ff3cac', pointColor: '#ff00aa',
    gridColor: '#aa0066', gridColor2: '#0a000a',
    floorColor: '#0a000a',
    weather: 'clear',
    decorations: 'dungeon',
  },
}

// ── DECORATIONS ────────────────────────────────────────────
function ForestDecorations() {
  const trees = useMemo(() => {
    const items = []
    for (let i = 0; i < 40; i++) {
      let x, z
      do {
        x = (Math.random() - 0.5) * 180
        z = (Math.random() - 0.5) * 180
      } while (Math.abs(x) < 8 && Math.abs(z) < 8)
      const scale = 0.6 + Math.random() * 1.2
      const variant = Math.floor(Math.random() * 3)
      items.push({ x, z, scale, variant })
    }
    return items
  }, [])

  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} scale={t.scale}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.35, 2.4, 7]} />
            <meshStandardMaterial color="#3a1a00" roughness={0.9} />
          </mesh>
          {t.variant === 0 && (
            <>
              <mesh position={[0, 4, 0]} castShadow>
                <coneGeometry args={[2, 4, 8]} />
                <meshStandardMaterial color="#1a5a1a" roughness={0.8} emissive="#002200" emissiveIntensity={0.2} />
              </mesh>
              <mesh position={[0, 6.5, 0]} castShadow>
                <coneGeometry args={[1.4, 3, 8]} />
                <meshStandardMaterial color="#22661a" roughness={0.8} emissive="#003300" emissiveIntensity={0.2} />
              </mesh>
            </>
          )}
          {t.variant === 1 && (
            <mesh position={[0, 4.5, 0]} castShadow>
              <sphereGeometry args={[2.2, 8, 8]} />
              <meshStandardMaterial color="#1a6622" roughness={0.7} emissive="#002a00" emissiveIntensity={0.3} />
            </mesh>
          )}
          {t.variant === 2 && (
            <>
              <mesh position={[0, 3.5, 0]} castShadow>
                <coneGeometry args={[2.5, 5, 6]} />
                <meshStandardMaterial color="#0a4a0a" roughness={0.8} emissive="#001500" emissiveIntensity={0.2} />
              </mesh>
            </>
          )}
          {/* Glowing mushroom near base */}
          {Math.random() > 0.6 && (
            <mesh position={[Math.random() - 0.5, 0.15, Math.random() - 0.5]}>
              <sphereGeometry args={[0.2, 6, 6]} />
              <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.8} />
              <pointLight color="#00ff88" intensity={0.5} distance={3} />
            </mesh>
          )}
        </group>
      ))}
      {/* Fireflies */}
      <Sparkles count={80} scale={[160, 20, 160]} size={1.5} speed={0.3} color="#88ffaa" opacity={0.8} />
    </group>
  )
}

function CityDecorations() {
  const buildings = useMemo(() => {
    const items = []
    for (let i = 0; i < 30; i++) {
      let x, z
      do {
        x = (Math.random() - 0.5) * 160
        z = (Math.random() - 0.5) * 160
      } while (Math.abs(x) < 10 && Math.abs(z) < 10)
      const w = 3 + Math.random() * 5
      const h = 8 + Math.random() * 22
      const d = 3 + Math.random() * 5
      items.push({ x, z, w, h, d })
    }
    return items
  }, [])

  return (
    <group>
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, 0, b.z]}>
          <mesh position={[0, b.h / 2, 0]} castShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial
              color="#050510"
              emissive="#000033"
              emissiveIntensity={0.3}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Window lights */}
          <pointLight
            position={[0, b.h * 0.7, 0]}
            color={['#0044ff', '#ff0044', '#00ffff', '#ffaa00'][i % 4]}
            intensity={0.8}
            distance={8}
          />
          {/* Antenna */}
          <mesh position={[0, b.h + 1.5, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 3, 4]} />
            <meshStandardMaterial color="#aaaaaa" />
          </mesh>
          <mesh position={[0, b.h + 3.2, 0]}>
            <sphereGeometry args={[0.15, 6, 6]} />
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
            <pointLight color="#ff0000" intensity={0.5} distance={4} />
          </mesh>
        </group>
      ))}
      <Sparkles count={40} scale={[160, 40, 160]} size={2} speed={0.1} color="#0066ff" opacity={0.5} />
    </group>
  )
}

function DungeonDecorations() {
  const pillars = useMemo(() => {
    const items = []
    for (let i = 0; i < 20; i++) {
      let x, z
      do {
        x = (Math.random() - 0.5) * 160
        z = (Math.random() - 0.5) * 160
      } while (Math.abs(x) < 8 && Math.abs(z) < 8)
      items.push({ x, z })
    }
    return items
  }, [])

  return (
    <group>
      {pillars.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]}>
          <mesh position={[0, 5, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.8, 10, 8]} />
            <meshStandardMaterial color="#1a0a1a" emissive="#0a000a" metalness={0.5} roughness={0.5} />
          </mesh>
          <pointLight
            position={[0, 3, 0]}
            color={['#ff3cac', '#aa00ff', '#ff0066', '#cc00aa'][i % 4]}
            intensity={1.2}
            distance={10}
          />
          {/* Crystal on top */}
          <mesh position={[0, 10.5, 0]}>
            <octahedronGeometry args={[0.5]} />
            <meshStandardMaterial
              color="#ff3cac"
              emissive="#ff3cac"
              emissiveIntensity={0.8}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}
      <Sparkles count={60} scale={[160, 15, 160]} size={1.5} speed={0.2} color="#ff3cac" opacity={0.6} />
    </group>
  )
}

function DesertDecorations() {
  const rocks = useMemo(() => {
    const items = []
    for (let i = 0; i < 35; i++) {
      let x, z
      do {
        x = (Math.random() - 0.5) * 180
        z = (Math.random() - 0.5) * 180
      } while (Math.abs(x) < 6 && Math.abs(z) < 6)
      const s = 0.5 + Math.random() * 2.5
      const rx = Math.random() * Math.PI
      const ry = Math.random() * Math.PI
      items.push({ x, z, s, rx, ry })
    }
    return items
  }, [])

  return (
    <group>
      {rocks.map((r, i) => (
        <mesh key={i} position={[r.x, r.s * 0.4, r.z]} rotation={[r.rx, r.ry, 0]} scale={r.s} castShadow>
          <dodecahedronGeometry args={[1]} />
          <meshStandardMaterial color="#8b6914" roughness={0.9} />
        </mesh>
      ))}
      {/* Cacti */}
      {Array.from({ length: 15 }, (_, i) => {
        const x = (Math.random() - 0.5) * 160
        const z = (Math.random() - 0.5) * 160
        return (
          <group key={`c${i}`} position={[x, 0, z]}>
            <mesh position={[0, 2, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.4, 4, 8]} />
              <meshStandardMaterial color="#2a6a2a" roughness={0.8} />
            </mesh>
            <mesh position={[0.8, 2.5, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 1.5, 8]} />
              <meshStandardMaterial color="#2a6a2a" roughness={0.8} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function OceanDecorations() {
  return (
    <group>
      {Array.from({ length: 25 }, (_, i) => {
        const x = (Math.random() - 0.5) * 160
        const z = (Math.random() - 0.5) * 160
        const h = 1 + Math.random() * 4
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, h / 2, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.2, h, 6]} />
              <meshStandardMaterial color="#004466" emissive="#002233" />
            </mesh>
            <mesh position={[0, h + 0.3, 0]}>
              <sphereGeometry args={[0.4, 8, 8]} />
              <meshStandardMaterial color="#00aacc" emissive="#00aacc" emissiveIntensity={0.6} transparent opacity={0.8} />
              <pointLight color="#00ccff" intensity={0.8} distance={5} />
            </mesh>
          </group>
        )
      })}
      <Sparkles count={50} scale={[160, 8, 160]} size={2} speed={0.4} color="#00ccff" opacity={0.7} />
    </group>
  )
}

// ── AVATAR ─────────────────────────────────────────────────
function Avatar({ position, color, isMe, name, avatarType }) {
  const groupRef = useRef()
  const ringRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current && isMe) {
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.06
    }
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.02
      ringRef.current.material.opacity = 0.4 + Math.sin(t * 2) * 0.3
    }
  })

  const typeColors = {
    WARRIOR: '#ff4444', MAGE: '#aa44ff', RANGER: '#44ffaa', ROGUE: '#ffaa00'
  }
  const col = isMe ? color : (typeColors[avatarType] || '#00ffc8')

  return (
    <group ref={groupRef} position={position}>
      {/* Shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.2, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 1, 8]} />
        <meshStandardMaterial color={col} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.2, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 1, 8]} />
        <meshStandardMaterial color={col} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Body */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.7, 0.9, 0.45]} />
        <meshStandardMaterial color={col} metalness={0.7} roughness={0.2} emissive={col} emissiveIntensity={0.1} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.5, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.8, 8]} rotation={[0, 0, Math.PI / 6]} />
        <meshStandardMaterial color={col} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.5, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.8, 8]} rotation={[0, 0, -Math.PI / 6]} />
        <meshStandardMaterial color={col} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <boxGeometry args={[0.55, 0.55, 0.5]} />
        <meshStandardMaterial color="#ffccaa" roughness={0.7} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.14, 2.25, 0.26]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#000000" emissive={col} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.14, 2.25, 0.26]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#000000" emissive={col} emissiveIntensity={0.8} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 2.55, 0]}>
        <boxGeometry args={[0.58, 0.2, 0.52]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.9} />
      </mesh>

      {/* Glow ring */}
      <mesh ref={ringRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.05, 8, 32]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={1} transparent opacity={0.7} />
      </mesh>

      {/* Point light */}
      <pointLight color={col} intensity={isMe ? 2 : 1} distance={8} />

      {/* Name tag */}
      {isMe && (
        <mesh position={[0, 3, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={col} emissive={col} emissiveIntensity={1} />
          <pointLight color={col} intensity={1} distance={4} />
        </mesh>
      )}
    </group>
  )
}

// ── CAMERA CONTROLLER ──────────────────────────────────────
function CameraController({ targetRef, keys }) {
  const { camera } = useThree()

  useFrame(() => {
    if (!targetRef.current) return
    const target = targetRef.current
    camera.position.x += (target.x - camera.position.x + 0) * 0.08
    camera.position.z += (target.z + 20 - camera.position.z) * 0.08
    camera.position.y += (16 - camera.position.y) * 0.05
    camera.lookAt(target.x, target.y + 1, target.z)
  })
  return null
}

// ── MOVEMENT CONTROLLER ────────────────────────────────────
function MovementController({ keys, posRef, onMove, onStep }) {
  const stepTimer = useRef(0)

  useFrame((state) => {
    const SPEED = 0.12
    const BOUND = 90
    let moved = false

    if (keys.current['w'] || keys.current['arrowup'])    { posRef.current.z -= SPEED; moved = true }
    if (keys.current['s'] || keys.current['arrowdown'])  { posRef.current.z += SPEED; moved = true }
    if (keys.current['a'] || keys.current['arrowleft'])  { posRef.current.x -= SPEED; moved = true }
    if (keys.current['d'] || keys.current['arrowright']) { posRef.current.x += SPEED; moved = true }

    posRef.current.x = Math.max(-BOUND, Math.min(BOUND, posRef.current.x))
    posRef.current.z = Math.max(-BOUND, Math.min(BOUND, posRef.current.z))

    if (moved) {
      onMove && onMove(posRef.current.x, posRef.current.z)
      stepTimer.current += 0.12
      if (stepTimer.current > 0.5) {
        onStep && onStep()
        stepTimer.current = 0
      }
    }
  })
  return null
}

// ── MAIN COMPONENT ─────────────────────────────────────────
export default function WorldRoom3D({ players, myAvatarId, worldType, onMove }) {
  const keys = useRef({})
  const myPos = useRef({ x: 0, y: 0, z: 0 })
  const [timeOfDay, setTimeOfDay] = useState(0.3)
  const [myPosition, setMyPosition] = useState([0, 0, 0])
  const [otherPlayers, setOtherPlayers] = useState([])

  const cfg = WORLD_CONFIGS[worldType] || WORLD_CONFIGS.CITY

  useEffect(() => {
    function onKeyDown(e) { keys.current[e.key.toLowerCase()] = true }
    function onKeyUp(e)   { keys.current[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    setOtherPlayers(players.filter(p => p.avatarId !== myAvatarId))
  }, [players, myAvatarId])

  const handleMove = useCallback((x, z) => {
    setMyPosition([x, 0, z])
    onMove && onMove(x, z)
  }, [onMove])

  const handleStep = useCallback(() => {
    playFootstep(worldType === 'DESERT' ? 'sand' : worldType === 'OCEAN' ? 'water' : 'grass')
  }, [worldType])

  const typeColors = { WARRIOR:'#ff4444', MAGE:'#aa44ff', RANGER:'#44ffaa', ROGUE:'#ffaa00' }

  return (
    <div style={{ width:'100%', height:'100%', position:'absolute', inset:0 }}>
      <AmbientSound worldType={worldType} active={true} />
      <Canvas
        shadows
        camera={{ position:[0, 16, 20], fov:60 }}
        gl={{ antialias:true, toneMapping:THREE.ACESFilmicToneMapping, toneMappingExposure:0.9 }}
      >
        {/* Fog */}
        <fog attach="fog" args={[cfg.fogColor, 40, 180]} />

        {/* Ambient */}
        <ambientLight color={cfg.ambientColor} intensity={cfg.ambientIntensity} />
        <directionalLight
          color={cfg.sunColor}
          intensity={2}
          position={[50, 80, 30]}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={300}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />
        <pointLight color={cfg.pointColor} intensity={3} distance={80} position={[0, 20, 0]} />

        {/* Sky */}
        <SkySystem timeOfDay={timeOfDay} worldType={worldType} />

        {/* Day/Night */}
        <DayNightCycle onTimeUpdate={setTimeOfDay} speed={0.0003} />

        {/* Weather */}
        <WeatherSystem weather={cfg.weather} worldType={worldType} />

        {/* Terrain */}
        <TerrainSystem worldType={worldType} size={200} />

        {/* Grid overlay */}
        <gridHelper args={[200, 60, cfg.gridColor, cfg.gridColor2]} position={[0, 0.02, 0]} />

        {/* Decorations */}
        {worldType === 'FOREST'  && <ForestDecorations />}
        {worldType === 'CITY'    && <CityDecorations />}
        {worldType === 'DUNGEON' && <DungeonDecorations />}
        {worldType === 'DESERT'  && <DesertDecorations />}
        {worldType === 'OCEAN'   && <OceanDecorations />}

        {/* My Avatar */}
        <Avatar
          position={myPosition}
          color="#00ffc8"
          isMe={true}
          avatarType="WARRIOR"
        />

        {/* Other Players */}
        {otherPlayers.map(p => (
          <Avatar
            key={p.avatarId}
            position={[p.positionX || 0, 0, p.positionY || 0]}
            color={typeColors[p.avatarType] || '#0080ff'}
            isMe={false}
            name={p.avatarName}
            avatarType={p.avatarType}
          />
        ))}

        {/* Camera + Movement */}
        <CameraController targetRef={myPos} keys={keys} />
        <MovementController
          keys={keys}
          posRef={myPos}
          onMove={handleMove}
          onStep={handleStep}
        />

      </Canvas>
    </div>
  )
}

// Fix: useMemo import
import { useMemo } from 'react'
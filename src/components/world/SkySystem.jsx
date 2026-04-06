import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SkySystem({ timeOfDay, worldType }) {
  const sunRef = useRef()
  const moonRef = useRef()
  const skyRef = useRef()

  const skyConfigs = {
    FOREST:  { day:'#1a4a2a', horizon:'#4a8a3a', night:'#020a04', sun:'#ffffaa', moon:'#ccddff' },
    CITY:    { day:'#0a1a3a', horizon:'#1a3a6a', night:'#000510', sun:'#ffccaa', moon:'#8899ff' },
    DESERT:  { day:'#4a3a1a', horizon:'#8a6a2a', night:'#0a0800', sun:'#ffdd44', moon:'#ffeecc' },
    OCEAN:   { day:'#0a2a4a', horizon:'#1a5a8a', night:'#000a15', sun:'#aaddff', moon:'#cceeff' },
    DUNGEON: { day:'#1a0a2a', horizon:'#3a0a4a', night:'#050008', sun:'#ff3cac', moon:'#cc00ff' },
  }

  const sc = skyConfigs[worldType] || skyConfigs.CITY

  const isDay = timeOfDay > 0.2 && timeOfDay < 0.8
  const isDawn = timeOfDay > 0.15 && timeOfDay < 0.35
  const isDusk = timeOfDay > 0.65 && timeOfDay < 0.85

  const skyColor = isDawn || isDusk
    ? new THREE.Color('#ff6633').lerp(new THREE.Color(sc.horizon), 0.5)
    : isDay ? new THREE.Color(sc.day) : new THREE.Color(sc.night)

  const starPositions = useMemo(() => {
    const arr = new Float32Array(3000 * 3)
    for (let i = 0; i < 3000; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random())
      const r = 450
      arr[i*3]   = r * Math.sin(phi) * Math.cos(theta)
      arr[i*3+1] = Math.abs(r * Math.cos(phi)) + 20
      arr[i*3+2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return arr
  }, [])

  useFrame((state) => {
    const t = timeOfDay
    const angle = t * Math.PI * 2 - Math.PI / 2
    if (sunRef.current) {
      sunRef.current.position.set(Math.cos(angle) * 280, Math.sin(angle) * 280, -80)
      sunRef.current.visible = t > 0.15 && t < 0.85
    }
    if (moonRef.current) {
      const ma = (t + 0.5) * Math.PI * 2 - Math.PI / 2
      moonRef.current.position.set(Math.cos(ma) * 280, Math.sin(ma) * 280, -80)
      moonRef.current.visible = t < 0.2 || t > 0.8
    }
    if (skyRef.current) {
      skyRef.current.material.color.set(skyColor)
    }
  })

  const starOpacity = timeOfDay < 0.2 ? 1 : timeOfDay > 0.8 ? 1 : timeOfDay < 0.3 ? (0.3 - timeOfDay) * 10 : timeOfDay > 0.7 ? (timeOfDay - 0.7) * 10 : 0

  return (
    <group>
      {/* Sky dome */}
      <mesh ref={skyRef}>
        <sphereGeometry args={[480, 32, 16]} />
        <meshBasicMaterial color={sc.day} side={THREE.BackSide} />
      </mesh>

      {/* Horizon glow */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -5, 0]}>
        <ringGeometry args={[200, 480, 64]} />
        <meshBasicMaterial
          color={isDawn || isDusk ? '#ff4400' : sc.horizon}
          transparent opacity={0.4} side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sun */}
      <group ref={sunRef}>
        <mesh>
          <sphereGeometry args={[22, 16, 16]} />
          <meshBasicMaterial color={sc.sun} />
        </mesh>
        {/* Sun glow rings */}
        <mesh>
          <ringGeometry args={[24, 35, 32]} />
          <meshBasicMaterial color={sc.sun} transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <ringGeometry args={[36, 55, 32]} />
          <meshBasicMaterial color={sc.sun} transparent opacity={0.07} side={THREE.DoubleSide} />
        </mesh>
        <pointLight color={sc.sun} intensity={8} distance={800} />
      </group>

      {/* Moon */}
      <group ref={moonRef}>
        <mesh>
          <sphereGeometry args={[14, 16, 16]} />
          <meshBasicMaterial color={sc.moon} />
        </mesh>
        <pointLight color={sc.moon} intensity={2} distance={600} />
      </group>

      {/* Stars */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={3000} array={starPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#ffffff" size={1.8} transparent opacity={starOpacity} sizeAttenuation={false} />
      </points>

      {/* Dawn/Dusk color wash */}
      {(isDawn || isDusk) && (
        <mesh>
          <sphereGeometry args={[470, 16, 8]} />
          <meshBasicMaterial color={isDawn ? '#ff3300' : '#ff6600'} transparent opacity={0.08} side={THREE.BackSide} />
        </mesh>
      )}
    </group>
  )
}
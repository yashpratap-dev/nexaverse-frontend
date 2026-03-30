import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SkySystem({ timeOfDay, worldType }) {
  const skyRef = useRef()
  const sunRef = useRef()
  const moonRef = useRef()
  const starsRef = useRef()

  const skyColors = {
    FOREST: {
      dawn:    { top: '#1a0a2e', bottom: '#ff6b35' },
      day:     { top: '#1a3a1a', bottom: '#4a8a4a' },
      dusk:    { top: '#2a1a0e', bottom: '#ff4500' },
      night:   { top: '#000810', bottom: '#001a08' },
    },
    CITY: {
      dawn:    { top: '#1a0a2e', bottom: '#ff6b6b' },
      day:     { top: '#0a1a3a', bottom: '#1a3a6a' },
      dusk:    { top: '#2a0a1e', bottom: '#ff3366' },
      night:   { top: '#000510', bottom: '#000a20' },
    },
    DUNGEON: {
      dawn:    { top: '#1a000a', bottom: '#3a0020' },
      day:     { top: '#0a0010', bottom: '#1a0030' },
      dusk:    { top: '#2a0010', bottom: '#400020' },
      night:   { top: '#050005', bottom: '#0a0015' },
    },
    DESERT: {
      dawn:    { top: '#2a1a0a', bottom: '#ff8c00' },
      day:     { top: '#3a2a0a', bottom: '#ffd700' },
      dusk:    { top: '#3a1a00', bottom: '#ff4500' },
      night:   { top: '#05030a', bottom: '#100a00' },
    },
    OCEAN: {
      dawn:    { top: '#0a1a2a', bottom: '#4080ff' },
      day:     { top: '#001a3a', bottom: '#0066cc' },
      dusk:    { top: '#1a0a2a', bottom: '#8040ff' },
      night:   { top: '#000510', bottom: '#000820' },
    },
  }

  // Stars
  const starPositions = useMemo(() => {
    const pos = []
    for (let i = 0; i < 2000; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const r = 400 + Math.random() * 100
      pos.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      )
    }
    return new Float32Array(pos)
  }, [])

  const timePhase = timeOfDay < 0.25 ? 'dawn'
    : timeOfDay < 0.5 ? 'day'
    : timeOfDay < 0.75 ? 'dusk'
    : 'night'

  const wc = (skyColors[worldType] || skyColors.CITY)[timePhase]

  useFrame(() => {
    if (sunRef.current) {
      const angle = timeOfDay * Math.PI * 2 - Math.PI / 2
      sunRef.current.position.set(
        Math.cos(angle) * 300,
        Math.sin(angle) * 300,
        0
      )
      sunRef.current.visible = timeOfDay > 0.2 && timeOfDay < 0.8
    }
    if (moonRef.current) {
      const angle = (timeOfDay + 0.5) * Math.PI * 2 - Math.PI / 2
      moonRef.current.position.set(
        Math.cos(angle) * 300,
        Math.sin(angle) * 300,
        0
      )
      moonRef.current.visible = timeOfDay < 0.2 || timeOfDay > 0.8
    }
    if (starsRef.current) {
      starsRef.current.material.opacity = timeOfDay < 0.2 || timeOfDay > 0.8
        ? 1 : timeOfDay < 0.3 ? (0.3 - timeOfDay) * 10 : timeOfDay > 0.7 ? (timeOfDay - 0.7) * 10 : 0
    }
  })

  return (
    <group>
      {/* Sky sphere */}
      <mesh ref={skyRef}>
        <sphereGeometry args={[500, 32, 32]} />
        <meshBasicMaterial
          color={wc.bottom}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Sun */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[12, 16, 16]} />
        <meshBasicMaterial color="#fffaaa" />
        <pointLight color="#fff8cc" intensity={3} distance={800} />
      </mesh>

      {/* Moon */}
      <mesh ref={moonRef}>
        <sphereGeometry args={[8, 16, 16]} />
        <meshBasicMaterial color="#ccddff" />
        <pointLight color="#8899ff" intensity={1.5} distance={800} />
      </mesh>

      {/* Stars */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starPositions.length / 3}
            array={starPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={1.2}
          transparent
          opacity={1}
          sizeAttenuation={false}
        />
      </points>
    </group>
  )
}
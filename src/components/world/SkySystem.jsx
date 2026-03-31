import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SkySystem({ timeOfDay, worldType }) {
  const skyRef = useRef()
  const sunRef = useRef()

  const skyColors = {
    FOREST:  '#0d2b0d',
    CITY:    '#050a1a',
    DESERT:  '#2a1800',
    OCEAN:   '#001a33',
    DUNGEON: '#08000a',
  }

  const horizonColors = {
    FOREST:  '#1a4a1a',
    CITY:    '#0a1a3a',
    DESERT:  '#4a2800',
    OCEAN:   '#003366',
    DUNGEON: '#1a0020',
  }

  useFrame(() => {
    if (sunRef.current) {
      const angle = timeOfDay * Math.PI * 2 - Math.PI / 2
      sunRef.current.position.set(Math.cos(angle) * 200, Math.sin(angle) * 200, -50)
    }
  })

  const skyCol = skyColors[worldType] || '#050a1a'

  return (
    <group>
      {/* Sky dome */}
      <mesh ref={skyRef}>
        <sphereGeometry args={[450, 32, 16]} />
        <meshBasicMaterial color={skyCol} side={THREE.BackSide} />
      </mesh>

      {/* Sun */}
      <mesh ref={sunRef} position={[200, 150, -50]}>
        <sphereGeometry args={[18, 16, 16]} />
        <meshBasicMaterial color={worldType === 'DESERT' ? '#ffcc44' : worldType === 'DUNGEON' ? '#ff3cac' : '#ccffcc'} />
        <pointLight color={worldType === 'DESERT' ? '#ffcc44' : '#aaffaa'} intensity={5} distance={600} />
      </mesh>

      {/* Stars */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1500}
            array={(() => {
              const arr = new Float32Array(1500 * 3)
              for (let i = 0; i < 1500; i++) {
                const theta = Math.random() * Math.PI * 2
                const phi = Math.acos(Math.random() * 2 - 1)
                const r = 400
                arr[i*3]   = r * Math.sin(phi) * Math.cos(theta)
                arr[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
                arr[i*3+2] = r * Math.cos(phi)
              }
              return arr
            })()}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#ffffff" size={1.5} sizeAttenuation={false} />
      </points>
    </group>
  )
}
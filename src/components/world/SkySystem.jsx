import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cloud } from '@react-three/drei'
import * as THREE from 'three'

export default function SkySystem({ timeOfDay, worldType }) {
  const sunRef = useRef()
  const moonRef = useRef()
  const skyRef = useRef()

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

  const isDay = timeOfDay > 0.2 && timeOfDay < 0.8
  const isDawn = timeOfDay > 0.15 && timeOfDay < 0.3
  const isDusk = timeOfDay > 0.7 && timeOfDay < 0.85
  const isNight = timeOfDay < 0.2 || timeOfDay > 0.8

  const skyColor = isNight ? '#020a14' : isDawn || isDusk ? '#ff7733' : '#4488cc'

  useFrame(() => {
    const angle = timeOfDay * Math.PI * 2 - Math.PI / 2
    if (sunRef.current) {
      sunRef.current.position.set(Math.cos(angle)*280, Math.sin(angle)*280, -80)
      sunRef.current.visible = timeOfDay > 0.15 && timeOfDay < 0.85
    }
    if (moonRef.current) {
      const ma = (timeOfDay+0.5)*Math.PI*2 - Math.PI/2
      moonRef.current.position.set(Math.cos(ma)*280, Math.sin(ma)*280, -80)
      moonRef.current.visible = isNight
    }
    if (skyRef.current) {
      skyRef.current.material.color.set(skyColor)
    }
  })

  const starOpacity = isNight ? 1 : isDawn ? (0.3-timeOfDay)*10 : isDusk ? (timeOfDay-0.7)*10 : 0

  // Rainbow arc points
  const rainbowPoints = useMemo(() => {
    const points = []
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI
      points.push(new THREE.Vector3(
        Math.cos(angle) * 120,
        Math.sin(angle) * 80 + 10,
        -150
      ))
    }
    return points
  }, [])

  const rainbowColors = ['#ff0000','#ff7700','#ffff00','#00ff00','#0000ff','#8b00ff']

  return (
    <group>
      {/* Sky dome */}
      <mesh ref={skyRef}>
        <sphereGeometry args={[480, 32, 16]} />
        <meshBasicMaterial color={skyColor} side={THREE.BackSide} />
      </mesh>

      {/* Sun */}
      <group ref={sunRef}>
        <mesh>
          <sphereGeometry args={[20, 16, 16]} />
          <meshBasicMaterial color="#fffaaa" />
        </mesh>
        <mesh>
          <ringGeometry args={[22, 32, 32]} />
          <meshBasicMaterial color="#fffaaa" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
        <pointLight color="#fffaaa" intensity={8} distance={800} />
      </group>

      {/* Moon */}
      <group ref={moonRef}>
        <mesh>
          <sphereGeometry args={[14, 16, 16]} />
          <meshBasicMaterial color="#ccddff" />
        </mesh>
        <pointLight color="#ccddff" intensity={2} distance={600} />
      </group>

      {/* Stars */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={3000} array={starPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#ffffff" size={1.8} transparent opacity={Math.max(0, starOpacity)} sizeAttenuation={false} />
      </points>

      {/* Clouds */}
      {isDay && (<>
        <Cloud position={[-80, 80, -100]} speed={0.1} opacity={0.8} color="white" segments={20} />
        <Cloud position={[60, 100, -120]} speed={0.08} opacity={0.7} color="white" segments={15} />
        <Cloud position={[140, 90, -80]} speed={0.12} opacity={0.75} color="white" segments={18} />
        <Cloud position={[-150, 85, -90]} speed={0.09} opacity={0.65} color="white" segments={12} />
        <Cloud position={[0, 110, -140]} speed={0.07} opacity={0.6} color="white" segments={16} />
      </>)}

      {/* Rainbow */}
      {isDay && rainbowColors.map((col, idx) => {
        const offset = idx * 1.5
        const points = rainbowPoints.map(p => new THREE.Vector3(
          p.x * (1 + offset/100),
          p.y * (1 + offset/100),
          p.z
        ))
        const curve = new THREE.CatmullRomCurve3(points)
        const geo = new THREE.TubeGeometry(curve, 64, 0.8, 6, false)
        return (
          <mesh key={idx} geometry={geo}>
            <meshBasicMaterial color={col} transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
        )
      })}
    </group>
  )
}
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { playThunder } from '../../audio/worldSounds'

export default function WeatherSystem({ weather, worldType }) {
  const rainRef = useRef()
  const snowRef = useRef()
  const lightningRef = useRef()
  const lastLightning = useRef(0)

  const RAIN_COUNT = 8000
  const SNOW_COUNT = 3000

  const rainPositions = useMemo(() => {
    const pos = new Float32Array(RAIN_COUNT * 3)
    for (let i = 0; i < RAIN_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 200
      pos[i * 3 + 1] = Math.random() * 100
      pos[i * 3 + 2] = (Math.random() - 0.5) * 200
    }
    return pos
  }, [])

  const snowPositions = useMemo(() => {
    const pos = new Float32Array(SNOW_COUNT * 3)
    for (let i = 0; i < SNOW_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 200
      pos[i * 3 + 1] = Math.random() * 80
      pos[i * 3 + 2] = (Math.random() - 0.5) * 200
    }
    return pos
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Rain
    if (rainRef.current && weather === 'rain') {
      const pos = rainRef.current.geometry.attributes.position.array
      for (let i = 0; i < RAIN_COUNT; i++) {
        pos[i * 3 + 1] -= 1.5
        if (pos[i * 3 + 1] < 0) {
          pos[i * 3 + 1] = 100
          pos[i * 3]     = (Math.random() - 0.5) * 200
          pos[i * 3 + 2] = (Math.random() - 0.5) * 200
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Snow
    if (snowRef.current && weather === 'snow') {
      const pos = snowRef.current.geometry.attributes.position.array
      for (let i = 0; i < SNOW_COUNT; i++) {
        pos[i * 3 + 1] -= 0.2
        pos[i * 3]     += Math.sin(t + i) * 0.05
        if (pos[i * 3 + 1] < 0) {
          pos[i * 3 + 1] = 80
          pos[i * 3]     = (Math.random() - 0.5) * 200
          pos[i * 3 + 2] = (Math.random() - 0.5) * 200
        }
      }
      snowRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Lightning
    if (weather === 'storm' && t - lastLightning.current > 4 + Math.random() * 6) {
      lastLightning.current = t
      playThunder()
      if (lightningRef.current) {
        lightningRef.current.intensity = 20
        setTimeout(() => {
          if (lightningRef.current) lightningRef.current.intensity = 0
        }, 150)
      }
    }
  })

  if (weather === 'clear') return null

  return (
    <group>
      {/* Rain */}
      {weather === 'rain' || weather === 'storm' ? (
        <points ref={rainRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={RAIN_COUNT}
              array={rainPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#aaccff"
            size={0.15}
            transparent
            opacity={0.6}
          />
        </points>
      ) : null}

      {/* Snow */}
      {weather === 'snow' ? (
        <points ref={snowRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={SNOW_COUNT}
              array={snowPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#ffffff"
            size={0.5}
            transparent
            opacity={0.8}
          />
        </points>
      ) : null}

      {/* Lightning flash */}
      {weather === 'storm' ? (
        <pointLight ref={lightningRef} color="#ffffff" intensity={0} distance={500} position={[0, 100, 0]} />
      ) : null}
    </group>
  )
}
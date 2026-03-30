import { useMemo } from 'react'
import * as THREE from 'three'

export default function TerrainSystem({ worldType, size = 200 }) {
  const terrainData = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, 80, 80)
    const pos = geo.attributes.position.array

    for (let i = 0; i < pos.length; i += 3) {
      const x = pos[i], z = pos[i + 1]

      if (worldType === 'FOREST') {
        pos[i + 2] =
          Math.sin(x * 0.05) * Math.cos(z * 0.05) * 4 +
          Math.sin(x * 0.1 + 1) * Math.cos(z * 0.08) * 2 +
          Math.random() * 0.3
      } else if (worldType === 'DESERT') {
        pos[i + 2] =
          Math.sin(x * 0.03) * Math.cos(z * 0.04) * 6 +
          Math.sin(x * 0.08) * 2 +
          Math.random() * 0.4
      } else if (worldType === 'OCEAN') {
        pos[i + 2] =
          Math.sin(x * 0.08) * Math.cos(z * 0.06) * 1.5 +
          Math.random() * 0.2
      } else if (worldType === 'DUNGEON') {
        pos[i + 2] = Math.random() * 0.3
      } else {
        pos[i + 2] =
          Math.sin(x * 0.04) * Math.cos(z * 0.04) * 3 +
          Math.random() * 0.2
      }
    }

    geo.attributes.position.needsUpdate = true
    geo.computeVertexNormals()
    return geo
  }, [worldType, size])

  const terrainColors = {
    FOREST:  '#1a4a1a',
    CITY:    '#1a1a2e',
    DESERT:  '#8b6914',
    OCEAN:   '#001a33',
    DUNGEON: '#0a0a0f',
  }

  return (
    <mesh
      geometry={terrainData}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        color={terrainColors[worldType] || '#1a1a2e'}
        metalness={0.1}
        roughness={0.9}
      />
    </mesh>
  )
}
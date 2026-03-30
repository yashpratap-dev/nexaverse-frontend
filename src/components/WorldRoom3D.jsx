import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function WorldRoom3D({ players, myAvatarId, worldType, onMove }) {
  const mountRef = useRef(null)
  const sceneRef = useRef({})
  const keysRef = useRef({})
  const myPosRef = useRef({ x: 0, z: 0 })

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── SCENE SETUP ──
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000008, 0.025)

    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 200)
    camera.position.set(0, 18, 22)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setClearColor(0x000510)
    mount.appendChild(renderer.domElement)

    // ── LIGHTS ──
    const ambient = new THREE.AmbientLight(0x111122, 2)
    scene.add(ambient)

    const worldColors = {
      FOREST: { main: 0x00ff88, secondary: 0x004422, floor: 0x0a1a0a, fog: 0x001108 },
      CITY:   { main: 0x0088ff, secondary: 0x002244, floor: 0x0a0a1a, fog: 0x000811 },
      DESERT: { main: 0xffaa00, secondary: 0x442200, floor: 0x1a0f00, fog: 0x110800 },
      OCEAN:  { main: 0x00ccff, secondary: 0x002233, floor: 0x000a11, fog: 0x000811 },
      DUNGEON:{ main: 0xff3cac, secondary: 0x330022, floor: 0x0a000a, fog: 0x080008 },
    }
    const wc = worldColors[worldType] || worldColors.CITY

    scene.fog.color.set(wc.fog)
    renderer.setClearColor(wc.fog)

    const dirLight = new THREE.DirectionalLight(wc.main, 2)
    dirLight.position.set(10, 20, 10)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 2048
    dirLight.shadow.mapSize.height = 2048
    scene.add(dirLight)

    const pL1 = new THREE.PointLight(wc.main, 3, 40)
    pL1.position.set(0, 10, 0)
    scene.add(pL1)

    const pL2 = new THREE.PointLight(wc.secondary === 0x002244 ? 0xff3cac : 0x0080ff, 2, 30)
    pL2.position.set(-15, 8, -15)
    scene.add(pL2)

    // ── FLOOR GRID ──
    const floorGeo = new THREE.PlaneGeometry(60, 60, 30, 30)
    const floorMat = new THREE.MeshStandardMaterial({
      color: wc.floor, wireframe: false,
      metalness: 0.8, roughness: 0.3
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // Grid lines overlay
    const gridHelper = new THREE.GridHelper(60, 30, wc.main, wc.secondary || 0x001133)
    gridHelper.position.y = 0.01
    scene.add(gridHelper)

    // ── BOUNDARY WALLS ──
    const wallMat = new THREE.MeshStandardMaterial({
      color: wc.main, emissive: wc.main, emissiveIntensity: 0.1,
      metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.3,
      wireframe: true
    })
    const wallPositions = [[0, 2, -30], [0, 2, 30], [-30, 2, 0], [30, 2, 0]]
    const wallSizes = [[60,4,0.5], [60,4,0.5], [0.5,4,60], [0.5,4,60]]
    wallPositions.forEach(([x,y,z], i) => {
      const [w,h,d] = wallSizes[i]
      const wall = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), wallMat)
      wall.position.set(x,y,z)
      scene.add(wall)
    })

    // ── WORLD DECORATIONS by type ──
    function addDecorations() {
      if (worldType === 'FOREST' || !worldType) {
        // Trees
        for (let i = 0; i < 20; i++) {
          const x = (Math.random() - 0.5) * 50, z = (Math.random() - 0.5) * 50
          if (Math.abs(x) < 4 && Math.abs(z) < 4) continue
          const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.3, 2, 6),
            new THREE.MeshStandardMaterial({ color: 0x4a2800, metalness: 0.1, roughness: 0.9 })
          )
          trunk.position.set(x, 1, z)
          scene.add(trunk)
          const leaves = new THREE.Mesh(
            new THREE.ConeGeometry(1.5, 3, 7),
            new THREE.MeshStandardMaterial({ color: 0x00aa44, emissive: 0x004422, emissiveIntensity: 0.3, metalness: 0.2, roughness: 0.7 })
          )
          leaves.position.set(x, 3.5, z)
          scene.add(leaves)
        }
      } else if (worldType === 'CITY') {
        // Buildings
        for (let i = 0; i < 16; i++) {
          const x = (Math.random() - 0.5) * 50, z = (Math.random() - 0.5) * 50
          if (Math.abs(x) < 6 && Math.abs(z) < 6) continue
          const h = 4 + Math.random() * 10
          const building = new THREE.Mesh(
            new THREE.BoxGeometry(2 + Math.random() * 2, h, 2 + Math.random() * 2),
            new THREE.MeshStandardMaterial({ color: 0x0a0a2a, emissive: 0x0033ff, emissiveIntensity: 0.05, metalness: 0.9, roughness: 0.1 })
          )
          building.position.set(x, h / 2, z)
          building.castShadow = true
          scene.add(building)
          // Window lights
          const wLight = new THREE.PointLight(0x0066ff, 0.5, 5)
          wLight.position.set(x, h * 0.7, z)
          scene.add(wLight)
        }
      } else if (worldType === 'DUNGEON') {
        // Pillars
        for (let i = 0; i < 12; i++) {
          const x = (Math.random() - 0.5) * 45, z = (Math.random() - 0.5) * 45
          if (Math.abs(x) < 5 && Math.abs(z) < 5) continue
          const pillar = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.5, 6, 8),
            new THREE.MeshStandardMaterial({ color: 0x220022, emissive: 0xff3cac, emissiveIntensity: 0.08, metalness: 0.8, roughness: 0.3 })
          )
          pillar.position.set(x, 3, z)
          scene.add(pillar)
          const glow = new THREE.PointLight(0xff3cac, 0.8, 6)
          glow.position.set(x, 5, z)
          scene.add(glow)
        }
      } else if (worldType === 'DESERT') {
        // Rocks
        for (let i = 0; i < 18; i++) {
          const x = (Math.random() - 0.5) * 50, z = (Math.random() - 0.5) * 50
          if (Math.abs(x) < 4 && Math.abs(z) < 4) continue
          const rock = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.5 + Math.random() * 1.5),
            new THREE.MeshStandardMaterial({ color: 0x8b6914, metalness: 0.2, roughness: 0.9 })
          )
          rock.position.set(x, 0.5, z)
          rock.rotation.set(Math.random(), Math.random(), Math.random())
          scene.add(rock)
        }
      } else if (worldType === 'OCEAN') {
        // Coral / rocks
        for (let i = 0; i < 15; i++) {
          const x = (Math.random() - 0.5) * 50, z = (Math.random() - 0.5) * 50
          if (Math.abs(x) < 4 && Math.abs(z) < 4) continue
          const coral = new THREE.Mesh(
            new THREE.ConeGeometry(0.3, 2 + Math.random() * 2, 5),
            new THREE.MeshStandardMaterial({ color: 0x00aacc, emissive: 0x004455, emissiveIntensity: 0.3, metalness: 0.5, roughness: 0.5 })
          )
          coral.position.set(x, 1, z)
          scene.add(coral)
        }
      }
    }
    addDecorations()

    // ── PLAYER AVATARS ──
    const playerMeshes = {}
    const playerLabels = {}

    function getAvatarColor(type) {
      const colors = { WARRIOR: 0xff4444, MAGE: 0xaa44ff, RANGER: 0x44ffaa, ROGUE: 0xffaa00 }
      return colors[type] || 0x00ffc8
    }

    function createPlayerMesh(player) {
      const group = new THREE.Group()
      const isMe = player.avatarId === myAvatarId

      // Body
      const bodyMat = new THREE.MeshStandardMaterial({
        color: isMe ? 0x00ffc8 : getAvatarColor(player.avatarType),
        emissive: isMe ? 0x004433 : 0x220011,
        emissiveIntensity: 0.4, metalness: 0.8, roughness: 0.2
      })
      const body = new THREE.Mesh(new THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.4, 1, 4, 8) : new THREE.CylinderGeometry(0.35, 0.4, 1.5, 8), bodyMat)
      body.position.y = 1
      body.castShadow = true
      group.add(body)

      // Head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 8, 8),
        new THREE.MeshStandardMaterial({ color: isMe ? 0x00ffc8 : 0xffccaa, metalness: 0.3, roughness: 0.7 })
      )
      head.position.y = 2.1
      head.castShadow = true
      group.add(head)

      // Glow ring at feet
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.6, 0.05, 8, 24),
        new THREE.MeshStandardMaterial({ color: isMe ? 0x00ffc8 : getAvatarColor(player.avatarType), emissive: isMe ? 0x00ffc8 : getAvatarColor(player.avatarType), emissiveIntensity: 0.8 })
      )
      ring.rotation.x = Math.PI / 2
      ring.position.y = 0.05
      group.add(ring)

      // Point light on player
      const pLight = new THREE.PointLight(isMe ? 0x00ffc8 : getAvatarColor(player.avatarType), 1.5, 8)
      pLight.position.y = 1
      group.add(pLight)

      group.position.set(player.positionX || 0, 0, player.positionY || 0)
      scene.add(group)
      playerMeshes[player.avatarId] = group
    }

    // Create my avatar
    createPlayerMesh({
      avatarId: myAvatarId,
      avatarType: 'WARRIOR',
      positionX: myPosRef.current.x,
      positionY: myPosRef.current.z
    })

    // Create other players
    players.forEach(p => {
      if (p.avatarId !== myAvatarId) createPlayerMesh(p)
    })

    sceneRef.current = { scene, camera, renderer, playerMeshes, createPlayerMesh }

    // ── KEYBOARD ──
    function onKeyDown(e) { keysRef.current[e.key.toLowerCase()] = true }
    function onKeyUp(e) { keysRef.current[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    // ── ANIMATION LOOP ──
    let t = 0, rafId
    const SPEED = 0.1
    const BOUNDARY = 28

    function animate() {
      rafId = requestAnimationFrame(animate)
      t += 0.016

      // My avatar movement
      const myMesh = playerMeshes[myAvatarId]
      if (myMesh) {
        let moved = false
        const keys = keysRef.current
        if (keys['w'] || keys['arrowup'])    { myMesh.position.z -= SPEED; moved = true }
        if (keys['s'] || keys['arrowdown'])  { myMesh.position.z += SPEED; moved = true }
        if (keys['a'] || keys['arrowleft'])  { myMesh.position.x -= SPEED; moved = true }
        if (keys['d'] || keys['arrowright']) { myMesh.position.x += SPEED; moved = true }

        // Boundary clamp
        myMesh.position.x = Math.max(-BOUNDARY, Math.min(BOUNDARY, myMesh.position.x))
        myMesh.position.z = Math.max(-BOUNDARY, Math.min(BOUNDARY, myMesh.position.z))

        if (moved) {
          myPosRef.current = { x: myMesh.position.x, z: myMesh.position.z }
          onMove && onMove(myMesh.position.x, myMesh.position.z)
        }

        // Camera follows player
        camera.position.x += (myMesh.position.x - camera.position.x + 0) * 0.08
        camera.position.z += (myMesh.position.z + 22 - camera.position.z) * 0.08
        camera.lookAt(myMesh.position.x, 0, myMesh.position.z)

        // Floating animation
        myMesh.position.y = Math.sin(t * 2) * 0.08
      }

      // Pulse point light
      pL1.intensity = 2.5 + Math.sin(t * 1.5) * 0.5

      renderer.render(scene, camera)
    }
    animate()

    function onResize() {
      renderer.setSize(mount.clientWidth, mount.clientHeight)
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('resize', onResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  // Update other players positions from WebSocket
  useEffect(() => {
    const { playerMeshes, createPlayerMesh } = sceneRef.current
    if (!playerMeshes) return
    players.forEach(p => {
      if (p.avatarId === myAvatarId) return
      if (playerMeshes[p.avatarId]) {
        playerMeshes[p.avatarId].position.x += (p.positionX - playerMeshes[p.avatarId].position.x) * 0.15
        playerMeshes[p.avatarId].position.z += (p.positionY - playerMeshes[p.avatarId].position.z) * 0.15
      } else {
        createPlayerMesh && createPlayerMesh(p)
      }
    })
  }, [players])

  return (
    <div ref={mountRef} style={{
      width: '100%', height: '100%',
      position: 'absolute', inset: 0
    }} />
  )
}
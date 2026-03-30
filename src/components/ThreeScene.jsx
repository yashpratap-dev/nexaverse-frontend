import { useEffect, useRef } from 'react'
import useThemeStore from '../store/themeStore'
import * as THREE from 'three'

export default function ThreeScene() {
  const mountRef = useRef(null)
  const theme = useThemeStore(s => s.theme)
  const themeRef = useRef(theme)
  const sceneRefs = useRef({})

  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(65, mount.clientWidth / 280, 0.1, 200)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, 280)
    renderer.setClearColor(0, 0)
    mount.appendChild(renderer.domElement)
    scene.fog = new THREE.FogExp2(0x000005, 0.032)

    const aL = new THREE.AmbientLight(0x001122, 1.5)
    scene.add(aL)
    const pL1 = new THREE.PointLight(0x00ffc8, 4, 60)
    pL1.position.set(0, 8, 0)
    scene.add(pL1)
    const pL2 = new THREE.PointLight(0x0066ff, 3, 45)
    pL2.position.set(-10, 5, -10)
    scene.add(pL2)
    const pL3 = new THREE.PointLight(0xff3cac, 2.5, 40)
    pL3.position.set(10, 3, -12)
    scene.add(pL3)

    const gH = new THREE.GridHelper(80, 40, 0x00ffc8, 0x001a33)
    gH.position.y = -3
    scene.add(gH)

    const pillarGeo = new THREE.BoxGeometry(0.3, 7, 0.3)
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x00ffc8, emissive: 0x003322, metalness: 0.9, roughness: 0.1
    })
    const pillarPositions = [[6,-1,-14], [-6,-1,-14], [11,-1,-22], [-11,-1,-22]]
    pillarPositions.forEach(function(pos) {
      const m = new THREE.Mesh(pillarGeo, pillarMat)
      m.position.set(pos[0], pos[1], pos[2])
      scene.add(m)
    })

    const rings = []
    const ringColors = [0x00ffc8, 0x0080ff, 0xff3cac]
    const ringEmissive = [0x004433, 0x002244, 0x330022]
    const ringPositions = [[-5,1,-16], [0,2,-26], [7,0,-21]]
    ringPositions.forEach(function(pos, i) {
      const r = new THREE.Mesh(
        new THREE.TorusGeometry(2 - i * 0.3, 0.035, 8, 48),
        new THREE.MeshStandardMaterial({
          color: ringColors[i],
          emissive: ringEmissive[i],
          metalness: 0.8,
          roughness: 0.2
        })
      )
      r.position.set(pos[0], pos[1], pos[2])
      r.rotation.x = Math.PI / 3 + i * 0.4
      scene.add(r)
      rings.push(r)
    })

    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x00ffc8, emissive: 0x004433, metalness: 0.9, roughness: 0.05
    })
    const icoGeo = new THREE.IcosahedronGeometry(1.6, 1)
    const ico = new THREE.Mesh(icoGeo, icoMat)
    ico.position.set(0, 1, -16)
    scene.add(ico)
    const icoW = new THREE.Mesh(
      icoGeo,
      new THREE.MeshBasicMaterial({ color: 0x00ffc8, wireframe: true, transparent: true, opacity: 0.22 })
    )
    icoW.position.set(0, 1, -16)
    scene.add(icoW)

    const ppG = new THREE.BufferGeometry()
    const ppP = new Float32Array(300 * 3)
    for (let i = 0; i < 300; i++) {
      ppP[i * 3] = (Math.random() - 0.5) * 60
      ppP[i * 3 + 1] = (Math.random() - 0.5) * 18
      ppP[i * 3 + 2] = -5 - Math.random() * 55
    }
    ppG.setAttribute('position', new THREE.BufferAttribute(ppP, 3))
    const ppM = new THREE.Points(
      ppG,
      new THREE.PointsMaterial({ color: 0x00ffc8, size: 0.07, transparent: true, opacity: 0.42 })
    )
    scene.add(ppM)

    camera.position.set(0, 2, 10)
    camera.lookAt(0, 0, -5)

    sceneRefs.current = { aL, pL1, pL2, pL3, icoMat, ppM, gH, scene, renderer, camera, rings, ico, icoW }

    let mX = 0
    let mY = 0
    let t3 = 0
    let rafId

    function onMouseMove(e) {
      const r = mount.getBoundingClientRect()
      mX = (e.clientX - r.left) / r.width * 2 - 1
      mY = -(e.clientY - r.top) / r.height * 2 + 1
    }
    mount.addEventListener('mousemove', onMouseMove)

    function animate() {
      rafId = requestAnimationFrame(animate)
      t3 += 0.016
      ico.rotation.y += 0.007
      ico.rotation.x += 0.004
      icoW.rotation.y += 0.007
      icoW.rotation.x += 0.004
      rings.forEach(function(r, i) {
        r.rotation.z += 0.006 + i * 0.003
        r.rotation.y += 0.003
      })
      pL1.intensity = 3.5 + Math.sin(t3 * 1.5) * 0.5 +
        (themeRef.current === 'destroy' ? Math.abs(Math.sin(t3 * 5)) * 2 : 0)
      camera.position.x += (mX * 1.5 - camera.position.x) * 0.03
      camera.position.y += (mY * 0.5 + 2 - camera.position.y) * 0.03
      camera.lookAt(0, 0, -5)
      renderer.render(scene, camera)
    }
    animate()

    function onResize() {
      renderer.setSize(mount.clientWidth, 280)
      camera.aspect = mount.clientWidth / 280
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return function() {
      cancelAnimationFrame(rafId)
      mount.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  useEffect(function() {
    const r = sceneRefs.current
    if (!r || !r.aL || !r.pL1 || !r.pL2 || !r.pL3 || !r.icoMat || !r.ppM || !r.gH || !r.scene) return
    const map = {
      cyber:   [0x00ffc8, 0x0066ff, 0xff3cac, 0x001122, 0x000005, 0x001a33, 0x004433],
      nature:  [0x40ff80, 0x20cc60, 0x80ff40, 0x103010, 0x0a1a0a, 0x0a2a10, 0x103010],
      destroy: [0xff4400, 0xff2200, 0xff6600, 0x200000, 0x100005, 0x330000, 0x440000],
    }
    const colors = map[theme] || map.cyber
    const c1 = colors[0]
    const c2 = colors[1]
    const c3 = colors[2]
    const ca = colors[3]
    const cf = colors[4]
    const cg = colors[5]
    const ce = colors[6]
    try {
      r.pL1.color.set(c1)
      r.pL2.color.set(c2)
      r.pL3.color.set(c3)
      r.aL.color.set(ca)
      r.icoMat.color.set(c1)
      r.icoMat.emissive.set(ce)
      r.ppM.material.color.set(c1)
      r.gH.material[0].color.set(c1)
      r.gH.material[1].color.set(cg)
      r.scene.fog.color.set(cf)
    } catch (err) {
      console.warn('Theme update skipped:', err)
    }
  }, [theme])

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '280px',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 5,
        borderTop: '1px solid rgba(0,255,200,0.06)',
        borderBottom: '1px solid rgba(0,255,200,0.06)'
      }}
    />
  )
}

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

// Fear orb config
const ORBS = [
  { label: 'Loss Fear',  color: '#E24B4A', x: -2.2, y: 0.3 },
  { label: 'Jargon',    color: '#378ADD', x: -0.7, y: -0.2 },
  { label: 'Scam',      color: '#c0f18e', x:  0.7, y:  0.4 },
  { label: 'Trust',     color: '#1D9E75', x:  2.2, y: -0.1 },
]

interface Props {
  onReady?: () => void
  onCTAClick?: () => void
  triggerFlyOff?: boolean
}

export default function FearUniverse({ onReady, onCTAClick: _onCTAClick, triggerFlyOff }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const orbMeshesRef = useRef<THREE.Mesh[]>([])
  const frameRef = useRef<number>(0)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Scene
    const scene = new THREE.Scene()
    const w = canvasRef.current.clientWidth
    const h = canvasRef.current.clientHeight
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.z = 7

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    canvasRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Ambient starfield
    const starGeo = new THREE.BufferGeometry()
    const starCount = 400
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 30
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, opacity: 0.25, transparent: true })
    scene.add(new THREE.Points(starGeo, starMat))

    // Orbs
    const orbs: THREE.Mesh[] = []
    ORBS.forEach(cfg => {
      const geo = new THREE.SphereGeometry(0.45, 32, 32)
      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(cfg.x * 1.5, cfg.y * 1.5 + 2, 0) // start high, drift in
      scene.add(mesh)
      orbs.push(mesh)
    })
    orbMeshesRef.current = orbs

    // Light beam (cylinder along X)
    const beamGeo = new THREE.CylinderGeometry(0.012, 0.012, 8, 8)
    beamGeo.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 2))
    const beamMat = new THREE.MeshBasicMaterial({ color: '#c0f18e', transparent: true, opacity: 0 })
    const beam = new THREE.Mesh(beamGeo, beamMat)
    beam.position.y = 0
    scene.add(beam)

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambient)
    const point = new THREE.PointLight(0xc0f18e, 1.5, 12)
    point.position.set(0, 2, 3)
    scene.add(point)

    // Intro timeline
    const tl = gsap.timeline({ onComplete: () => onReady?.() })
    tlRef.current = tl

    // Orbs drift in
    orbs.forEach((orb, i) => {
      ;(orb.material as THREE.MeshStandardMaterial)
      tl.to(orb.material, { opacity: 0.65, duration: 0.8, ease: 'power2.out' }, i * 0.18)
      tl.to(orb.position, { y: ORBS[i].y * 0.4, duration: 1.0, ease: 'power3.out' }, i * 0.18)
      tl.to(orb.position, { x: ORBS[i].x, duration: 0.8, ease: 'power2.inOut' }, 0.6 + i * 0.1)
    })

    // Beam cuts through
    tl.to(beamMat, { opacity: 0.55, duration: 0.3 }, 1.4)
    tl.to(beamMat, { opacity: 0.22, duration: 0.6 }, 1.7)

    // Render loop
    let animating = true
    const clock = new THREE.Clock()

    function animate() {
      if (!animating) return
      frameRef.current = requestAnimationFrame(animate)
      if (document.visibilityState === 'hidden') return
      const t = clock.getElapsedTime()
      orbs.forEach((orb, i) => {
        orb.position.y = ORBS[i].y * 0.4 + Math.sin(t * 0.4 + i * 1.2) * 0.12
        orb.rotation.y = t * 0.2
      })
      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const onResize = () => {
      if (!canvasRef.current) return
      const w2 = canvasRef.current.clientWidth
      const h2 = canvasRef.current.clientHeight
      camera.aspect = w2 / h2
      camera.updateProjectionMatrix()
      renderer.setSize(w2, h2)
    }
    window.addEventListener('resize', onResize)

    return () => {
      animating = false
      cancelAnimationFrame(frameRef.current)
      tl.kill()
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      canvasRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  // Fly-off animation
  useEffect(() => {
    if (!triggerFlyOff) return
    const orbs = orbMeshesRef.current
    orbs.forEach((orb, i) => {
      gsap.to(orb.position, {
        x: (i % 2 === 0 ? -1 : 1) * 12,
        y: (Math.random() - 0.5) * 8,
        z: -3,
        duration: 0.8,
        ease: 'power3.in',
      })
      gsap.to(orb.material, { opacity: 0, duration: 0.6, delay: 0.1, ease: 'power2.in' })
    })
  }, [triggerFlyOff])

  return <div ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }} />
}

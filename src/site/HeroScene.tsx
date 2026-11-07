import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import * as THREE from 'three'
import { supportsWebGL } from '../lib/webgl'

const CENTERS = [0, 0.3, 0.55, 0.75, 1] as const
const WINDOWS = [0.24, 0.18, 0.18, 0.18, 0.2] as const
const WHITE = '#ffffff'
const EMERALD = new THREE.Color('#10b981')

function slideAlpha(progress: number, index: number) {
  const distance = Math.abs(progress - CENTERS[index])
  const raw = Math.max(0, 1 - distance / WINDOWS[index])
  return raw * raw * (3 - 2 * raw)
}

function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function geometryFrom(positions: Float32Array) {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  return geometry
}

function spherePoints(count: number, radius: number, seed: number) {
  const positions = new Float32Array(count * 3)
  const random = seeded(seed)
  for (let i = 0; i < count; i++) {
    const u = random() * 2 - 1
    const theta = random() * Math.PI * 2
    const rim = Math.sqrt(Math.max(0, 1 - u * u))
    const r = radius * (0.95 + random() * 0.1)
    positions[i * 3] = r * rim * Math.cos(theta)
    positions[i * 3 + 1] = r * u
    positions[i * 3 + 2] = r * rim * Math.sin(theta)
  }
  return geometryFrom(positions)
}

function helixPoints(count: number, radius: number, height: number, turns: number) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1)
    const angle = t * Math.PI * 2 * turns
    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = (t - 0.5) * height
    positions[i * 3 + 2] = Math.sin(angle) * radius
  }
  return geometryFrom(positions)
}

function ringPoints(count: number, radius: number, depth = 0.05) {
  const positions = new Float32Array(count * 3)
  const random = seeded(9041)
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + random() * 0.06
    const r = radius * (0.97 + random() * 0.06)
    positions[i * 3] = Math.cos(angle) * r
    positions[i * 3 + 1] = Math.sin(angle) * r
    positions[i * 3 + 2] = (random() - 0.5) * depth
  }
  return geometryFrom(positions)
}

function discPoints(count: number, radius: number, spread: number, seed: number) {
  const positions = new Float32Array(count * 3)
  const random = seeded(seed)
  for (let i = 0; i < count; i++) {
    const angle = random() * Math.PI * 2
    const r = Math.sqrt(random()) * radius
    positions[i * 3] = Math.cos(angle) * r
    positions[i * 3 + 1] = Math.sin(angle) * r
    positions[i * 3 + 2] = (random() - 0.5) * spread
  }
  return geometryFrom(positions)
}

function Points({
  geometry,
  size,
  opacity,
  color = WHITE,
}: {
  geometry: THREE.BufferGeometry
  size: number
  opacity: number
  color?: string
}) {
  return (
    <points geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  )
}

function Ring({
  radius,
  tube = 0.007,
  opacity = 0.3,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
}: {
  radius: number
  tube?: number
  opacity?: number
  rotation?: [number, number, number]
  position?: [number, number, number]
}) {
  return (
    <mesh rotation={rotation} position={position}>
      <torusGeometry args={[radius, tube, 6, 128]} />
      <meshBasicMaterial
        color={WHITE}
        transparent
        opacity={opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

/* ---------------------------------------------------------------- scene 1 */

function NeuralCore() {
  const surface = useMemo(() => spherePoints(170, 1.32, 11), [])
  const nodes = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => {
        const angle = (index / 6) * Math.PI * 2 + 0.4
        return [Math.cos(angle) * 1.34, Math.sin(angle * 1.7) * 0.7, Math.sin(angle) * 1.34] as [
          number,
          number,
          number,
        ]
      }),
    [],
  )

  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[1.32, 1]} />
        <meshBasicMaterial
          color={WHITE}
          wireframe
          transparent
          opacity={0.42}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[0.5, 0.9, 0.2]}>
        <icosahedronGeometry args={[1.18, 2]} />
        <meshBasicMaterial
          color="#c9c9d2"
          wireframe
          transparent
          opacity={0.12}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.33, 32, 32]} />
        <meshBasicMaterial color={WHITE} transparent opacity={0.9} toneMapped={false} />
      </mesh>
      <Points geometry={surface} size={0.03} opacity={0.85} color="#e9e9f2" />
      <Ring radius={1.72} rotation={[1.32, 0.2, 0.4]} opacity={0.26} />
      <Ring radius={1.94} rotation={[1.05, 0.62, -0.3]} opacity={0.16} />
      {nodes.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.042, 12, 12]} />
          <meshBasicMaterial color={WHITE} transparent opacity={0.9} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------------------------------------------------------------- scene 2 */

function Pipeline() {
  const helix = useMemo(() => helixPoints(120, 0.86, 2.5, 4), [])
  const nodes = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => {
        const t = index / 4
        const angle = t * Math.PI * 2 * 4
        return [Math.cos(angle) * 0.86, (t - 0.5) * 2.5, Math.sin(angle) * 0.86] as [
          number,
          number,
          number,
        ]
      }),
    [],
  )

  return (
    <group rotation={[0.18, -0.35, 0.05]}>
      <Points geometry={helix} size={0.026} opacity={0.55} color="#dfe2ea" />
      {nodes.map((position, index) => (
        <group key={index} position={position} rotation={[index * 0.6, index * 0.9, 0]}>
          <mesh>
            <boxGeometry args={[0.19, 0.19, 0.19]} />
            <meshBasicMaterial color={WHITE} transparent opacity={0.08} depthWrite={false} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshBasicMaterial
              color={WHITE}
              wireframe
              transparent
              opacity={0.82}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
      <Ring radius={0.97} rotation={[Math.PI / 2, 0, 0]} position={[0, 1.25, 0]} opacity={0.2} />
      <Ring radius={0.97} rotation={[Math.PI / 2, 0, 0]} position={[0, -1.25, 0]} opacity={0.2} />
      <Ring radius={1.42} rotation={[1.42, 0.3, 0]} opacity={0.14} />
    </group>
  )
}

/* ---------------------------------------------------------------- scene 3 */

function Vision() {
  const irisDots = useMemo(() => ringPoints(56, 1.46, 0.08), [])
  const rays = useMemo(
    () => Array.from({ length: 16 }, (_, index) => (index / 16) * Math.PI * 2),
    [],
  )

  return (
    <group rotation={[0.1, 0.3, 0]}>
      {[0.48, 0.78, 1.08, 1.38, 1.64].map((radius, index) => (
        <Ring
          key={radius}
          radius={radius}
          tube={index === 2 ? 0.011 : 0.006}
          opacity={0.44 - index * 0.055}
        />
      ))}
      <mesh position={[0, 0, -0.2]}>
        <circleGeometry args={[0.44, 64]} />
        <meshBasicMaterial color="#dfe6ff" transparent opacity={0.16} depthWrite={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.31, 56]} />
        <meshBasicMaterial color={WHITE} transparent opacity={0.85} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.34]}>
        <circleGeometry args={[0.14, 40]} />
        <meshBasicMaterial color={WHITE} transparent opacity={0.9} toneMapped={false} />
      </mesh>
      <Points geometry={irisDots} size={0.042} opacity={0.9} />
      {rays.map((angle, index) => (
        <mesh
          key={index}
          position={[Math.cos(angle) * 1.82, Math.sin(angle) * 1.82, 0]}
          rotation={[0, 0, angle]}
        >
          <boxGeometry args={[0.2, 0.012, 0.012]} />
          <meshBasicMaterial color={WHITE} transparent opacity={0.5} toneMapped={false} />
        </mesh>
      ))}
      <Ring radius={1.92} rotation={[1.25, 0.5, 0.2]} opacity={0.14} />
    </group>
  )
}

/* ---------------------------------------------------------------- scene 4 */

function shieldGeometries() {
  const shape = new THREE.Shape()
  shape.moveTo(0, -1.06)
  shape.bezierCurveTo(0.55, -0.84, 0.86, -0.6, 0.86, -0.16)
  shape.lineTo(0.86, 0.52)
  shape.quadraticCurveTo(0.86, 0.7, 0.66, 0.77)
  shape.lineTo(0.3, 0.9)
  shape.quadraticCurveTo(0.12, 0.97, 0, 0.97)
  shape.quadraticCurveTo(-0.12, 0.97, -0.3, 0.9)
  shape.lineTo(-0.66, 0.77)
  shape.quadraticCurveTo(-0.86, 0.7, -0.86, 0.52)
  shape.lineTo(-0.86, -0.16)
  shape.bezierCurveTo(-0.86, -0.6, -0.55, -0.84, 0, -1.06)

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.035,
    bevelSegments: 2,
    steps: 1,
  })
  geometry.center()
  const edges = new THREE.EdgesGeometry(geometry, 24)
  return { geometry, edges }
}

function Security() {
  const { geometry, edges } = useMemo(shieldGeometries, [])

  return (
    <group rotation={[0.05, -0.26, 0]}>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={WHITE}
          transparent
          opacity={0.05}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={WHITE} transparent opacity={0.68} depthWrite={false} />
      </lineSegments>
      <mesh position={[0, 0.02, 0.12]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.15, 0.026, 10, 32, Math.PI]} />
        <meshBasicMaterial color={WHITE} transparent opacity={0.9} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.12, 0.12]}>
        <boxGeometry args={[0.4, 0.3, 0.1]} />
        <meshBasicMaterial color={WHITE} transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.12, 0.12]}>
        <boxGeometry args={[0.4, 0.3, 0.1]} />
        <meshBasicMaterial
          color={WHITE}
          wireframe
          transparent
          opacity={0.72}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <Ring radius={1.5} rotation={[1.48, 0.2, 0]} opacity={0.24} />
      <Ring radius={1.76} rotation={[1.22, -0.42, 0.4]} opacity={0.14} />
    </group>
  )
}

/* ---------------------------------------------------------------- scene 5 */

function Portal() {
  const stream = useMemo(() => discPoints(120, 1.55, 0.7, 331), [])

  return (
    <group rotation={[0.06, 0.12, 0]}>
      <Ring radius={0.72} opacity={0.5} tube={0.01} />
      <Ring radius={1.06} rotation={[0.34, 0.18, 0.1]} opacity={0.34} />
      <Ring radius={1.4} rotation={[-0.28, -0.26, -0.12]} opacity={0.22} />
      <Ring radius={1.72} rotation={[0.58, 0.12, 0.18]} opacity={0.12} />
      <Ring radius={0.94} rotation={[Math.PI / 2, 0.4, 0]} opacity={0.16} />
      <mesh>
        <sphereGeometry args={[0.19, 28, 28]} />
        <meshBasicMaterial color={WHITE} transparent opacity={0.95} toneMapped={false} />
      </mesh>
      <Points geometry={stream} size={0.032} opacity={0.72} color="#e7ecfb" />
      {Array.from({ length: 10 }, (_, index) => {
        const angle = (index / 10) * Math.PI * 2 + 0.25
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[0.28, 0.01, 0.01]} />
            <meshBasicMaterial color={WHITE} transparent opacity={0.4} toneMapped={false} />
          </mesh>
        )
      })}
    </group>
  )
}

/* -------------------------------------------------------------- placement */

function SlideLayer({
  index,
  progress,
  spin,
  reduced,
  children,
}: {
  index: number
  progress: RefObject<number>
  spin: number
  reduced: boolean
  children: ReactNode
}) {
  const group = useRef<THREE.Group>(null)
  const tilt = useRef<THREE.Group>(null)
  const aura = useRef<THREE.Mesh>(null)
  const auraGlow = useRef<THREE.Mesh>(null)
  const wave = useRef<THREE.Mesh>(null)
  const hit = useRef<THREE.Mesh>(null)
  const materials = useRef<Array<{ material: THREE.Material; baseOpacity: number; baseColor: THREE.Color | null }>>([])
  const hover = useRef({
    hover: 0,
    target: 0,
    pulse: 0,
    wave: 1,
    spin: 0,
    px: 0,
    py: 0,
  })
  const { viewport, gl } = useThree()

  useEffect(() => {
    const found: Array<{
      material: THREE.Material
      baseOpacity: number
      baseColor: THREE.Color | null
    }> = []
    group.current?.traverse((object) => {
      if (object.userData.ignoreFade) return
      const material = (object as THREE.Mesh).material as
        | THREE.Material
        | THREE.Material[]
        | undefined
      if (!material) return
      const list = Array.isArray(material) ? material : [material]
      for (const entry of list) {
        if (!found.some((item) => item.material === entry)) {
          const tint = entry as THREE.Material & { color?: THREE.Color }
          found.push({
            material: entry,
            baseOpacity: entry.opacity,
            baseColor: tint.color ? tint.color.clone() : null,
          })
        }
      }
    })
    materials.current = found
  }, [])

  useEffect(() => {
    const canvas = gl.domElement
    return () => {
      canvas.style.cursor = ''
    }
  }, [gl])

  useFrame((state, delta) => {
    const node = group.current
    if (!node) return

    const alpha = slideAlpha(progress.current, index)
    const h = hover.current
    const interactive = alpha > 0.5
    if (hit.current) {
      if (interactive) hit.current.layers.set(0)
      else hit.current.layers.disableAll()
    }
    if (!interactive && h.target > 0) {
      h.target = 0
      gl.domElement.style.cursor = ''
    }
    node.visible = alpha > 0.004
    if (!node.visible) return

    const elapsed = state.clock.elapsedTime
    const compact = viewport.width < 5.6

    h.hover += (h.target - h.hover) * Math.min(1, delta * 7)
    h.pulse = Math.max(0, h.pulse - delta * 2.4)
    h.spin = Math.max(0, h.spin - delta * 1.8)

    const targetX = compact ? 0 : (index % 2 === 0 ? 1 : -1) * viewport.width * 0.227
    const targetY = compact ? 0.32 : 0.04
    node.position.x += (targetX - node.position.x) * 0.12
    node.position.y += (targetY - node.position.y) * 0.12
    node.scale.setScalar((compact ? 0.8 : 1) * (0.84 + alpha * 0.16))

    const dim = compact ? 0.46 : 1
    const glow = h.hover
    for (const { material, baseOpacity, baseColor } of materials.current) {
      const mat = material as THREE.Material & { color?: THREE.Color }
      mat.opacity = Math.min(1, baseOpacity * alpha * dim * (1 + glow * 0.35))
      if (baseColor && mat.color) {
        mat.color.copy(baseColor).lerp(EMERALD, glow * 0.55)
      }
    }

    if (!reduced) {
      node.rotation.y += delta * (spin + h.spin * 3.4)
      node.rotation.z = Math.sin(elapsed * 0.18 + index) * 0.06
    } else {
      node.rotation.y += delta * h.spin * 2
    }

    const tiltNode = tilt.current
    if (tiltNode) {
      const targetTiltX = -h.py * 0.34 * glow
      const targetTiltY = h.px * 0.46 * glow
      tiltNode.rotation.x += (targetTiltX - tiltNode.rotation.x) * Math.min(1, delta * 8)
      tiltNode.rotation.y += (targetTiltY - tiltNode.rotation.y) * Math.min(1, delta * 8)
      tiltNode.scale.setScalar(1 + glow * 0.05 + h.pulse * 0.1)
    }

    const breathe = 0.5 + 0.5 * Math.sin(elapsed * 2.1 + index)
    if (aura.current) {
      aura.current.rotation.z -= delta * 0.55
      const mat = aura.current.material as THREE.MeshBasicMaterial
      mat.opacity = glow * (0.14 + breathe * 0.1) * alpha * dim
      aura.current.scale.setScalar(1 + glow * (0.06 + breathe * 0.04))
    }
    if (auraGlow.current) {
      const mat = auraGlow.current.material as THREE.MeshBasicMaterial
      mat.opacity = glow * (0.04 + breathe * 0.035) * alpha * dim
      auraGlow.current.scale.setScalar(1 + glow * 0.08)
    }
    if (wave.current) {
      const mat = wave.current.material as THREE.MeshBasicMaterial
      if (h.wave < 1) {
        h.wave = Math.min(1, h.wave + delta * 1.5)
        const k = h.wave
        wave.current.scale.setScalar(1 + k * 1.9)
        mat.opacity = (1 - k) * (1 - k) * 0.7 * alpha * dim
      } else {
        mat.opacity = 0
      }
    }
  })

  const over = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    hover.current.target = 1
    gl.domElement.style.cursor = 'grab'
  }

  const move = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    const node = group.current
    if (!node) return
    hover.current.px = THREE.MathUtils.clamp((event.point.x - node.position.x) / 1.25, -1, 1)
    hover.current.py = THREE.MathUtils.clamp((event.point.y - node.position.y) / 1.25, -1, 1)
  }

  const out = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    hover.current.target = 0
    gl.domElement.style.cursor = ''
  }

  const down = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    hover.current.target = 1
    hover.current.pulse = 1
    hover.current.spin = 1
    hover.current.wave = 0
    gl.domElement.style.cursor = 'grabbing'
  }

  const up = () => {
    gl.domElement.style.cursor = hover.current.target > 0 ? 'grab' : ''
  }

  return (
    <group ref={group}>
      <mesh ref={auraGlow} userData={{ ignoreFade: true }} position={[0, 0, -0.62]} renderOrder={-3}>
        <circleGeometry args={[1.32, 64]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={aura} userData={{ ignoreFade: true }} position={[0, 0, -0.6]} renderOrder={-2}>
        <ringGeometry args={[1.32, 1.95, 128]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={wave} userData={{ ignoreFade: true }} position={[0, 0, -0.55]} renderOrder={-1}>
        <ringGeometry args={[1.0, 1.08, 128]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <group ref={tilt}>{children}</group>
      <mesh
        ref={hit}
        userData={{ ignoreFade: true }}
        scale={[1, 1.25, 1]}
        onPointerOver={over}
        onPointerOut={out}
        onPointerMove={move}
        onPointerDown={down}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <sphereGeometry args={[1.92, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
    </group>
  )
}

/* ----------------------------------------------------------------- canvas */

export function HeroScene({ progressRef }: { progressRef: RefObject<number> }) {
  const [webgl] = useState(() => supportsWebGL())
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [inView, setInView] = useState(true)
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = host.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? true),
      { threshold: 0.01 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  if (!webgl) return null

  return (
    <div className="hero__scene" ref={host} aria-hidden="true">
      <Canvas
        dpr={[1, 1.7]}
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [0, 0, 7], fov: 45, near: 0.1, far: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ raycaster }) => {
          raycaster.params.Points.threshold = 0.25
          raycaster.params.Line.threshold = 0.2
        }}
      >
        <SlideLayer index={0} progress={progressRef} spin={0.16} reduced={reduced}>
          <NeuralCore />
        </SlideLayer>
        <SlideLayer index={1} progress={progressRef} spin={0.22} reduced={reduced}>
          <Pipeline />
        </SlideLayer>
        <SlideLayer index={2} progress={progressRef} spin={0.12} reduced={reduced}>
          <Vision />
        </SlideLayer>
        <SlideLayer index={3} progress={progressRef} spin={-0.18} reduced={reduced}>
          <Security />
        </SlideLayer>
        <SlideLayer index={4} progress={progressRef} spin={0.14} reduced={reduced}>
          <Portal />
        </SlideLayer>
      </Canvas>
    </div>
  )
}

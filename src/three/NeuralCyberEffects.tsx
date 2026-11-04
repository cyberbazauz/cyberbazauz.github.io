import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { glowTexture } from './glow'

interface NeuralCyberEffectsProps {
  morph: number // 0 = organic human mind, 1 = cybernetic AI
  opacity: number
  velocity?: React.RefObject<number>
  reducedMotion?: boolean
  pointer?: { x: number; y: number }
  mouseSpeed?: number
  clickPulse?: number
}


const LOBE_DEFS = [
  {
    anchor: [0.42, 0.32, 0.65] as const,
    offset: [0.72, 0.48, 0.85] as const,
    title: 'FRONTAL LOBE',
    sub: 'EXECUTIVE AI // AGENTS',
    color: '#38bdf8',
  },
  {
    anchor: [0.35, 0.62, 0.12] as const,
    offset: [0.65, 0.88, 0.22] as const,
    title: 'PARIETAL LOBE',
    sub: '3D SPATIAL // WEBGL',
    color: '#00f0ff',
  },
  {
    anchor: [0.32, 0.18, -0.68] as const,
    offset: [0.62, 0.32, -0.88] as const,
    title: 'OCCIPITAL LOBE',
    sub: 'COMPUTER VISION // YOLO',
    color: '#fde68a',
  },
  {
    anchor: [0.75, -0.15, 0.12] as const,
    offset: [1.08, -0.22, 0.22] as const,
    title: 'TEMPORAL LOBE',
    sub: 'SPEECH AI // OSINT',
    color: '#f43f5e',
  },
]

export function NeuralCyberEffects({
  morph,
  opacity,
  velocity,
  reducedMotion = false,
  pointer,
  mouseSpeed = 0,
  clickPulse = 0,
}: NeuralCyberEffectsProps) {
  const rootRef = useRef<THREE.Group>(null)
  const stardustRef = useRef<THREE.Points>(null)
  const beamLinesRef = useRef<THREE.LineSegments>(null)
  const beamPhotonsRef = useRef<THREE.Points>(null)
  const lobeLinesRef = useRef<THREE.LineSegments>(null)
  const lobeSpritesRef = useRef<(THREE.Sprite | null)[]>([])

  // 1. Synaptic Stardust (ambient thought particles drifting around the brain)
  const stardustGeo = useMemo(() => {
    const count = 220
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const gold = new THREE.Color('#fde68a')
    const cyan = new THREE.Color('#38bdf8')

    for (let i = 0; i < count; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 0.7 + Math.random() * 1.1

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 0.95
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.8
      pos[i * 3 + 2] = r * Math.cos(phi) * 1.1

      const c = Math.random() > 0.5 ? gold : cyan
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return geo
  }, [])

  // 2. Vertical Synaptic Data Conduit (subtle vertical laser filaments)
  const beamGeo = useMemo(() => {
    const count = 12
    const pos = new Float32Array(count * 2 * 3)
    const col = new Float32Array(count * 2 * 3)
    const cCyan = new THREE.Color('#00f0ff')
    const cBlue = new THREE.Color('#4338ca')

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const rad = 0.15 + (i % 3) * 0.08
      const x = Math.cos(angle) * rad
      const z = Math.sin(angle) * rad
      const yLen = 1.8 + (i % 2) * 0.6

      const idx = i * 6
      pos[idx] = x
      pos[idx + 1] = -yLen
      pos[idx + 2] = z

      pos[idx + 3] = x
      pos[idx + 4] = yLen
      pos[idx + 5] = z

      col[idx] = cBlue.r
      col[idx + 1] = cBlue.g
      col[idx + 2] = cBlue.b

      col[idx + 3] = cCyan.r
      col[idx + 4] = cCyan.g
      col[idx + 5] = cCyan.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return geo
  }, [])

  // 3. Data pulses flowing down the conduit
  const { photonGeo, photonSpeeds } = useMemo(() => {
    const count = 20
    const pos = new Float32Array(count * 3)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const rad = 0.15 + (i % 3) * 0.08
      pos[i * 3] = Math.cos(angle) * rad
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3.2
      pos[i * 3 + 2] = Math.sin(angle) * rad
      speeds[i] = 1.4 + Math.random() * 2.0
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { photonGeo: geo, photonSpeeds: speeds }
  }, [])

  // 4. Lobe connector lines
  const lobeLinesGeo = useMemo(() => {
    const pos = new Float32Array(LOBE_DEFS.length * 2 * 3)
    LOBE_DEFS.forEach((l, i) => {
      const idx = i * 6
      pos[idx] = l.anchor[0]
      pos[idx + 1] = l.anchor[1]
      pos[idx + 2] = l.anchor[2]

      pos[idx + 3] = l.offset[0]
      pos[idx + 4] = l.offset[1]
      pos[idx + 5] = l.offset[2]
    })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return geo
  }, [])

  // 5. Billboard sprite textures for each lobe
  const lobeTextures = useMemo(() => {
    if (typeof document === 'undefined') return []
    return LOBE_DEFS.map((l) => {
      const canvas = document.createElement('canvas')
      canvas.width = 320
      canvas.height = 80
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, 320, 80)
        ctx.fillStyle = 'rgba(8, 10, 16, 0.88)'
        ctx.strokeStyle = l.color
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(4, 4, 312, 72, 8)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = l.color
        ctx.beginPath()
        ctx.arc(24, 40, 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 18px monospace'
        ctx.fillText(l.title, 42, 34)

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.font = '13px monospace'
        ctx.fillText(l.sub, 42, 58)
      }
      const tex = new THREE.CanvasTexture(canvas)
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      return tex
    })
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const speedBoost = 1 + (velocity?.current ?? 0) * 0.8
    const rotSpeed = reducedMotion ? 0.3 : 1.0



    // 3. Synaptic Stardust drift (swirls with cursor in 3D)
    if (stardustRef.current) {
      const px = pointer ? pointer.x : 0
      const py = pointer ? pointer.y : 0
      stardustRef.current.rotation.y = t * 0.04 * rotSpeed + px * 0.25
      stardustRef.current.rotation.x = -py * 0.20
      const pMat = stardustRef.current.material as THREE.PointsMaterial
      pMat.opacity = (0.22 + morph * 0.22 + mouseSpeed * 0.3 + clickPulse * 0.35) * opacity
    }

    // 4. Vertical Conduit & Photons
    const beamActive = Math.max(0, (morph - 0.1) / 0.8)
    if (beamLinesRef.current) {
      const bMat = beamLinesRef.current.material as THREE.LineBasicMaterial
      bMat.opacity = beamActive * opacity * 0.22
    }

    if (beamPhotonsRef.current && !reducedMotion) {
      const posAttr = photonGeo.getAttribute('position') as THREE.BufferAttribute
      const pArr = posAttr.array as Float32Array
      const count = pArr.length / 3

      for (let i = 0; i < count; i++) {
        let y = pArr[i * 3 + 1] - photonSpeeds[i] * 0.016 * speedBoost
        if (y < -1.8) y = 1.8
        pArr[i * 3 + 1] = y
      }
      posAttr.needsUpdate = true

      const bpMat = beamPhotonsRef.current.material as THREE.PointsMaterial
      bpMat.opacity = beamActive * opacity * 0.5
    }

    // 5. Lobe holographic callout labels
    const lobeAlpha = Math.max(0, 1.0 - morph * 1.8) * (0.35 + mouseSpeed * 0.35 + clickPulse * 0.25) * opacity
    if (lobeLinesRef.current) {
      const mat = lobeLinesRef.current.material as THREE.LineBasicMaterial
      mat.opacity = lobeAlpha * 0.4
    }
    lobeSpritesRef.current.forEach((sp) => {
      if (sp) {
        const mat = sp.material as THREE.SpriteMaterial
        mat.opacity = lobeAlpha * 0.85
      }
    })
  })

  return (
    <group ref={rootRef}>

      {/* 3. Synaptic Stardust Nebula around the brain */}
      <points ref={stardustRef} geometry={stardustGeo} frustumCulled={false}>
        <pointsMaterial
          size={0.038}
          map={glowTexture()}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.5}
        />
      </points>

      {/* 4. Vertical Data Conduit Beams */}
      <lineSegments ref={beamLinesRef} geometry={beamGeo} frustumCulled={false}>
        <lineBasicMaterial
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.2}
        />
      </lineSegments>

      {/* Traveling Data Photons */}
      <points ref={beamPhotonsRef} geometry={photonGeo} frustumCulled={false}>
        <pointsMaterial
          size={0.05}
          map={glowTexture()}
          color="#ffffff"
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.6}
        />
      </points>

      {/* 5. Holographic Lobe Callouts */}
      <lineSegments ref={lobeLinesRef} geometry={lobeLinesGeo} frustumCulled={false}>
        <lineBasicMaterial
          color="#00f0ff"
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.25}
        />
      </lineSegments>

      {LOBE_DEFS.map((l, i) => (
        <group key={l.title}>
          <mesh position={l.anchor}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshBasicMaterial color={l.color} />
          </mesh>

          {lobeTextures[i] && (
            <sprite
              ref={(el) => {
                lobeSpritesRef.current[i] = el
              }}
              position={l.offset}
              scale={[0.42, 0.105, 1]}
            >
              <spriteMaterial
                map={lobeTextures[i]}
                transparent
                depthWrite={false}
                opacity={0.6}
              />
            </sprite>
          )}
        </group>
      ))}
    </group>
  )
}

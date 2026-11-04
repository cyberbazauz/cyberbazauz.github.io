import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { generateMasterBrainData, type BrainModelData } from './brainGeometry'
import { glowTexture } from './glow'
import type { NeuralSystem } from './system'

interface BrainCortexProps {
  sys: NeuralSystem
  morph: number // 0 = human organic brain, 1 = machine compute net
  opacity: number
  mouseLocal?: THREE.Vector3
  mouseSpeed?: number
  clickPulse?: number
}

const CORTEX_VERTEX_SHADER = /* glsl */ `
  attribute float aGyri;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying vec3 vLocalPos;
  varying float vGyri;

  void main() {
    vGyri = aGyri;
    vLocalPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const CORTEX_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uOpacity;
  uniform vec3 uColorHumanBase;
  uniform vec3 uColorHumanRim;
  uniform vec3 uColorAiBase;
  uniform vec3 uColorAiRim;
  uniform vec3 uLocalMouse;
  uniform float uMouseSpeed;
  uniform float uClickPulse;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying vec3 vLocalPos;
  varying float vGyri;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Elegant Fresnel rim glow (only glows at glancing angles)
    float NdotV = abs(dot(normal, viewDir));
    float rim = pow(1.0 - NdotV, 3.0);

    // Bio-electric synaptic pulse traveling across the cortex
    float pulseSpeed = 2.4 + uMorph * 2.2 + uMouseSpeed * 3.2;
    float pulseFreq = 4.0 + uMorph * 2.0;
    float pulse = sin(vWorldPosition.z * pulseFreq - uTime * pulseSpeed + vGyri * 8.0);
    pulse = smoothstep(0.80, 1.0, pulse) * (0.35 + uMorph * 0.25);

    // Gyral convolutions catch subtle light
    float ridge = smoothstep(-0.02, 0.08, vGyri) * 0.16;

    // WOW Effect: Interactive cursor synaptic touch flare on the 3D cortex
    float mouseDist = length(vLocalPos - uLocalMouse);
    float mouseFlare = smoothstep(1.35, 0.08, mouseDist) * (0.55 + uMouseSpeed * 0.85);

    // WOW Effect: Click shockwave expanding outward across the lobes
    float clickWave = 0.0;
    if (uClickPulse > 0.01) {
      float waveRadius = (1.0 - uClickPulse) * 2.3;
      float d = abs(length(vLocalPos) - waveRadius);
      clickWave = smoothstep(0.35, 0.0, d) * uClickPulse * 0.85;
    }

    // Color transition from warm human amber to electric cyber cyan & ultraviolet
    vec3 rimCol = mix(uColorHumanRim, uColorAiRim, uMorph);
    vec3 baseCol = mix(uColorHumanBase, uColorAiBase, uMorph);

    vec3 finalColor = baseCol * 0.04 + rimCol * (rim * 1.25 + pulse * 0.8 + ridge * 0.25 + mouseFlare * 1.35 + clickWave * 1.6);

    // Translucent glass-holographic alpha: rim glows at glancing edges, center is crystal-clear to reveal inner neurons
    float alpha = (rim * 0.55 + pulse * 0.28 + ridge * 0.12 + mouseFlare * 0.35 + clickWave * 0.45 + 0.008) * uOpacity * 0.65;

    if (alpha < 0.005) discard;

    gl_FragColor = vec4(finalColor, alpha);
  }
`

export function BrainCortex({ sys, morph, opacity, mouseLocal, mouseSpeed = 0, clickPulse = 0 }: BrainCortexProps) {
  const brainData = useMemo<BrainModelData>(() => generateMasterBrainData(sys.maxR), [sys.maxR])
  
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const wireMeshRef = useRef<THREE.Mesh>(null)
  const wireMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const tractsRef = useRef<THREE.LineSegments>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uOpacity: { value: 1 },
      uColorHumanBase: { value: new THREE.Color(0.24, 0.18, 0.12) },
      uColorHumanRim: { value: new THREE.Color(1.0, 0.84, 0.60) },
      uColorAiBase: { value: new THREE.Color(0.04, 0.12, 0.28) },
      uColorAiRim: { value: new THREE.Color(0.0, 0.94, 1.0) },
      uLocalMouse: { value: new THREE.Vector3(100, 100, 100) },
      uMouseSpeed: { value: 0 },
      uClickPulse: { value: 0 },
    }),
    [],
  )

  const pointsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(brainData.corticalPoints, 3))
    return geo
  }, [brainData])

  const tractsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(brainData.curvedTractPositions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(brainData.curvedTractColors, 3))
    return geo
  }, [brainData])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t
      matRef.current.uniforms.uMorph.value = morph
      matRef.current.uniforms.uOpacity.value = Math.max(0.1, opacity * 0.75)
      if (mouseLocal) matRef.current.uniforms.uLocalMouse.value.copy(mouseLocal)
      matRef.current.uniforms.uMouseSpeed.value = mouseSpeed
      matRef.current.uniforms.uClickPulse.value = clickPulse
    }

    if (meshRef.current) {
      meshRef.current.visible = true
    }

    if (wireMeshRef.current && wireMatRef.current) {
      wireMeshRef.current.visible = true
      wireMatRef.current.opacity = Math.max(0.03, opacity * (0.08 + morph * 0.05 + mouseSpeed * 0.08))
      wireMatRef.current.color.set(morph > 0.4 ? 0x00f0ff : 0xfde68a)
    }

    if (pointsRef.current) {
      pointsRef.current.visible = true
      const pMat = pointsRef.current.material as THREE.PointsMaterial
      pMat.opacity = Math.max(0.18, opacity * (0.52 + morph * 0.18 + mouseSpeed * 0.35 + clickPulse * 0.4))
      pMat.color.set(morph > 0.4 ? 0x38bdf8 : 0xfff1dc)
    }

    if (tractsRef.current) {
      tractsRef.current.visible = true
      const tMat = tractsRef.current.material as THREE.LineBasicMaterial
      tMat.opacity = Math.max(0.2, opacity * (0.48 + mouseSpeed * 0.25 + clickPulse * 0.4))
    }
  })

  return (
    <group>
      {/* 1. Holographic 3D Brain Cortex Mesh */}
      <mesh ref={meshRef} geometry={brainData.geometry} frustumCulled={false}>
        <shaderMaterial
          ref={matRef}
          vertexShader={CORTEX_VERTEX_SHADER}
          fragmentShader={CORTEX_FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Subtle Wireframe Gyral Lattice Accent */}
      <mesh ref={wireMeshRef} geometry={brainData.geometry} frustumCulled={false}>
        <meshBasicMaterial
          ref={wireMatRef}
          wireframe
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color={morph > 0.5 ? 0x38bdf8 : 0xfde68a}
          opacity={0.14}
        />
      </mesh>

      {/* 2. High-density Cortical Synaptic Particles */}
      <points ref={pointsRef} geometry={pointsGeo} frustumCulled={false}>
        <pointsMaterial
          size={0.038}
          map={glowTexture()}
          transparent
          alphaTest={0.01}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color={morph > 0.5 ? 0x7dd3fc : 0xfff1dc}
        />
      </points>

      {/* 3. Curved Anatomical Axon Tracts (Corpus Callosum & U-Fibers) */}
      <lineSegments ref={tractsRef} geometry={tractsGeo} frustumCulled={false}>
        <lineBasicMaterial
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.65}
        />
      </lineSegments>
    </group>
  )
}

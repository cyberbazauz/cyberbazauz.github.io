import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import type { Spec } from '../hooks/useScrollStory'
import { generateInnerConnectome, type InnerConnectomeData } from './innerConnectomeData'
import type { NeuralTier } from '../config/neural'

interface InnerNeuralConnectomeProps {
  spec: Spec
  morph: number // 0 = organic human connectome, 1 = cybernetic machine net
  opacity: number
  mouseLocal?: THREE.Vector3
  mouseSpeed?: number
  clickPulse?: number
  reducedMotion?: boolean
}

const FILAMENT_VERTEX_SHADER = /* glsl */ `
  attribute float aPhase;
  attribute float aType;

  varying vec3 vColor;
  varying vec3 vLocalPos;
  varying float vPhase;
  varying float vType;

  void main() {
    vColor = color;
    vLocalPos = position;
    vPhase = aPhase;
    vType = aType;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FILAMENT_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uOpacity;
  uniform vec3 uLocalMouse;
  uniform float uMouseSpeed;
  uniform float uClickPulse;

  varying vec3 vColor;
  varying vec3 vLocalPos;
  varying float vPhase;
  varying float vType;

  void main() {
    // 1. High-frequency action potentials (impulses traveling through the axons)
    float waveSpeed = 3.8 + uMorph * 3.2 + uMouseSpeed * 4.0;
    float wave = sin(vLocalPos.y * 14.0 + vLocalPos.z * 10.0 - uTime * waveSpeed + vPhase * 6.28);
    float pulse = smoothstep(0.68, 1.0, wave);

    // 2. Interactive bio-electric cursor flare inside the connectome
    float mouseDist = length(vLocalPos - uLocalMouse);
    float mouseFlare = smoothstep(1.2, 0.05, mouseDist) * (0.65 + uMouseSpeed * 1.1);

    // 3. Expanding click shockwave
    float clickWave = 0.0;
    if (uClickPulse > 0.01) {
      float waveRadius = (1.0 - uClickPulse) * 2.3;
      float d = abs(length(vLocalPos) - waveRadius);
      clickWave = smoothstep(0.35, 0.0, d) * uClickPulse * 1.8;
    }

    // 4. Color morphing:
    // Human: warm radiant amber, incandescent synaptic gold & silver-white
    // AI: high-tech electric cyan, cobalt & ultraviolet
    vec3 humanColor = vColor * (1.1 + pulse * 1.3);
    vec3 aiColor = mix(vec3(0.0, 0.95, 1.0), vec3(0.65, 0.40, 1.0), vType * 0.35) * (1.15 + pulse * 1.4);
    vec3 finalColor = mix(humanColor, aiColor, uMorph);

    // Extra flare highlights on pulses and interaction
    vec3 flareColor = mix(vec3(1.0, 0.98, 0.85), vec3(0.75, 1.0, 1.0), uMorph);
    finalColor += flareColor * (pulse * 0.75 + mouseFlare * 1.5 + clickWave * 2.0);

    // High baseline alpha for unmistakable visibility
    float baseAlpha = (vType == 0.0 ? 0.88 : vType == 1.0 ? 0.82 : 0.68);
    float alpha = (baseAlpha + pulse * 0.45 + mouseFlare * 0.5 + clickWave * 0.6) * uOpacity;

    if (alpha < 0.01) discard;

    gl_FragColor = vec4(finalColor, min(1.0, alpha));
  }
`

const SYNAPSE_VERTEX_SHADER = /* glsl */ `
  attribute float aPhase;
  attribute float aScale;

  varying vec3 vColor;
  varying vec3 vLocalPos;
  varying float vPhase;

  uniform float uTime;
  uniform float uMorph;
  uniform float uClickPulse;
  uniform vec3 uLocalMouse;
  uniform float uMouseSpeed;

  void main() {
    vColor = color;
    vLocalPos = position;
    vPhase = aPhase;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // Stochastic synaptic firing & breathing
    float breathe = 1.0 + sin(uTime * 3.0 + aPhase * 6.28) * 0.28;

    // Proximity to cursor flares point size
    float mouseDist = length(position - uLocalMouse);
    float mouseFlare = smoothstep(1.1, 0.05, mouseDist) * (0.6 + uMouseSpeed * 0.9);
    float pulseBoost = 1.0 + uClickPulse * 1.2 + mouseFlare * 0.8;

    // World size calibrated for crystal-clear visibility (14px - 32px on screen)
    float baseSize = aScale * 72.0 * (1.0 + uMorph * 0.35);
    gl_PointSize = clamp(baseSize * breathe * pulseBoost * (1.0 / -mvPosition.z), 4.0, 48.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const SYNAPSE_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uOpacity;
  uniform vec3 uLocalMouse;
  uniform float uMouseSpeed;
  uniform float uClickPulse;

  varying vec3 vColor;
  varying vec3 vLocalPos;
  varying float vPhase;

  void main() {
    // Glowing circular point sprite with hot radiant core
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Hot incandescent white core
    float core = smoothstep(0.18, 0.0, dist);
    // Soft radiant aura
    float aura = smoothstep(0.5, 0.04, dist);

    // Stochastic synaptic firing
    float twinkle = sin(uTime * 3.5 + vPhase * 8.0) * 0.35 + 0.65;

    // Proximity to cursor
    float mouseDist = length(vLocalPos - uLocalMouse);
    float mouseFlare = smoothstep(1.2, 0.05, mouseDist) * (0.65 + uMouseSpeed * 1.0);

    // Click shockwave
    float clickWave = 0.0;
    if (uClickPulse > 0.01) {
      float waveRadius = (1.0 - uClickPulse) * 2.3;
      float d = abs(length(vLocalPos) - waveRadius);
      clickWave = smoothstep(0.35, 0.0, d) * uClickPulse * 1.8;
    }

    vec3 humanColor = mix(vColor * 1.2, vec3(1.0, 1.0, 0.95), core * 0.85);
    vec3 aiColor = mix(mix(vec3(0.15, 0.95, 1.0), vec3(0.85, 0.6, 1.0), sin(vPhase) * 0.5 + 0.5), vec3(1.0, 1.0, 1.0), core * 0.85);
    vec3 finalColor = mix(humanColor, aiColor, uMorph);

    vec3 flareColor = mix(vec3(1.0, 1.0, 0.9), vec3(0.8, 1.0, 1.0), uMorph);
    finalColor += flareColor * (mouseFlare * 1.6 + clickWave * 2.2);

    float alpha = (core * 0.95 + aura * 0.65) * (0.8 + twinkle * 0.35 + mouseFlare * 0.6 + clickWave * 0.8) * uOpacity;

    gl_FragColor = vec4(finalColor, min(1.0, alpha));
  }
`

export function InnerNeuralConnectome({
  spec,
  morph,
  opacity,
  mouseLocal,
  mouseSpeed = 0,
  clickPulse = 0,
  reducedMotion = false,
}: InnerNeuralConnectomeProps) {
  const tier: NeuralTier = spec.particles <= 42 ? 1 : spec.particles <= 72 ? 2 : 3

  const data = useMemo<InnerConnectomeData>(() => {
    return generateInnerConnectome(tier, 2.15)
  }, [tier])

  const filamentMatRef = useRef<THREE.ShaderMaterial>(null)
  const synapseMatRef = useRef<THREE.ShaderMaterial>(null)

  const filamentUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uOpacity: { value: 1 },
      uLocalMouse: { value: new THREE.Vector3(100, 100, 100) },
      uMouseSpeed: { value: 0 },
      uClickPulse: { value: 0 },
    }),
    [],
  )

  const synapseUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uOpacity: { value: 1 },
      uLocalMouse: { value: new THREE.Vector3(100, 100, 100) },
      uMouseSpeed: { value: 0 },
      uClickPulse: { value: 0 },
    }),
    [],
  )

  useEffect(() => {
    return () => {
      data.filamentGeometry.dispose()
      data.synapseGeometry.dispose()
    }
  }, [data])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (filamentMatRef.current) {
      filamentMatRef.current.uniforms.uTime.value = t
      filamentMatRef.current.uniforms.uMorph.value = morph
      filamentMatRef.current.uniforms.uOpacity.value = Math.max(0.4, opacity)
      if (mouseLocal) filamentMatRef.current.uniforms.uLocalMouse.value.copy(mouseLocal)
      filamentMatRef.current.uniforms.uMouseSpeed.value = reducedMotion ? 0 : mouseSpeed
      filamentMatRef.current.uniforms.uClickPulse.value = reducedMotion ? 0 : clickPulse
    }

    if (synapseMatRef.current) {
      synapseMatRef.current.uniforms.uTime.value = t
      synapseMatRef.current.uniforms.uMorph.value = morph
      synapseMatRef.current.uniforms.uOpacity.value = Math.max(0.45, opacity)
      if (mouseLocal) synapseMatRef.current.uniforms.uLocalMouse.value.copy(mouseLocal)
      synapseMatRef.current.uniforms.uMouseSpeed.value = reducedMotion ? 0 : mouseSpeed
      synapseMatRef.current.uniforms.uClickPulse.value = reducedMotion ? 0 : clickPulse
    }
  })

  return (
    <group renderOrder={2}>
      {/* 1. Volumetric Dense Axon Filaments (LineSegments - exactly 1 draw call) */}
      <lineSegments geometry={data.filamentGeometry} frustumCulled={false}>
        <shaderMaterial
          ref={filamentMatRef}
          vertexShader={FILAMENT_VERTEX_SHADER}
          fragmentShader={FILAMENT_FRAGMENT_SHADER}
          uniforms={filamentUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* 2. Synaptic Neuron Cell Bodies (Points - exactly 1 draw call) */}
      <points geometry={data.synapseGeometry} frustumCulled={false}>
        <shaderMaterial
          ref={synapseMatRef}
          vertexShader={SYNAPSE_VERTEX_SHADER}
          fragmentShader={SYNAPSE_FRAGMENT_SHADER}
          uniforms={synapseUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

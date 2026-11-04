import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import type { Spec } from '../hooks/useScrollStory'
import { FIELD_STATES, NEURAL_CONFIG } from '../config/neural'
import { DEFAULT_SCENE_TARGET, SCENE_TARGETS } from '../components/sceneStates'
import { dampValue } from './math'
import { createNeuralSystem, type NeuralSystem } from './system'
import { TransferPulse } from './TransferPulse'
import { BrainCortex } from './BrainCortex'
import { InnerNeuralConnectome } from './InnerNeuralConnectome'
import { NeuralCyberEffects } from './NeuralCyberEffects'

/** Shared event channel: NeuralField raises pulses, the scene reacts to them. */
export interface CoreEvent {
  target: number
}

export interface NeuralFieldProps {
  spec: Spec
  section: string
  projectId: RefObject<string | null>
  velocity: RefObject<number>
  reducedMotion: boolean
  corePulse: RefObject<CoreEvent>
  drag?: { sx: number; sy: number }
}

interface FieldState {
  r: number
  op: number
  edgeOp: number
  phase: number
  themeT: number
  hover: number
}

export function createFieldSystem(spec: Spec): NeuralSystem {
  const tier = spec.particles <= 42 ? 1 : spec.particles <= 72 ? 2 : 3
  return createNeuralSystem(NEURAL_CONFIG, tier)
}

export function NeuralField({
  spec,
  section,
  projectId,
  velocity,
  reducedMotion,
  corePulse,
  drag,
}: NeuralFieldProps) {
  const group = useRef<THREE.Group>(null)
  const sys = useMemo(() => createFieldSystem(spec), [spec])
  const pointer = useMemo(() => ({ x: 0, y: 0 }), [])
  const lastPointer = useRef({ x: 0, y: 0 })
  const smoothSpeed = useRef(0)
  const clickPulse = useRef(0)
  const lastT = useRef(0)
  const pulseTimer = useRef(0)

  // 3D Raycasting to project cursor onto brain's coordinate frame
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const pointerVec2 = useMemo(() => new THREE.Vector2(), [])
  const plane = useMemo(() => new THREE.Plane(), [])
  const mouseWorld = useMemo(() => new THREE.Vector3(), [])
  const mouseLocal = useMemo(() => new THREE.Vector3(100, 100, 100), [])
  const tmpForward = useMemo(() => new THREE.Vector3(), [])

  const s = useRef<FieldState>({
    r: FIELD_STATES.mind.r,
    op: FIELD_STATES.mind.op,
    edgeOp: FIELD_STATES.mind.edgeOp,
    phase: FIELD_STATES.mind.phase,
    themeT: 0,
    hover: 0,
  })

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    const onDown = () => {
      clickPulse.current = 1.0
      if (corePulse.current) {
        corePulse.current.target = Math.min(1.6, corePulse.current.target + 0.5)
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [pointer, corePulse])

  useFrame(({ clock, camera, size }) => {
    const t = clock.getElapsedTime()
    const dt = lastT.current === 0 ? 0.016 : Math.min(t - lastT.current, 0.05)
    lastT.current = t

    // Measure cursor motion velocity
    const pDist = Math.hypot(pointer.x - lastPointer.current.x, pointer.y - lastPointer.current.y)
    const rawSpeed = Math.min(3.0, (pDist / Math.max(dt, 0.001)) * 0.15)
    smoothSpeed.current = dampValue(smoothSpeed.current, rawSpeed, 6.0, dt)
    lastPointer.current.x = pointer.x
    lastPointer.current.y = pointer.y

    // Fade click shockwave
    if (clickPulse.current > 0.001) {
      clickPulse.current = Math.max(0, clickPulse.current - dt * 1.6)
    }

    const st = s.current
    const chapter = FIELD_STATES[section] ?? FIELD_STATES.mind
    const scene = SCENE_TARGETS[section] ?? DEFAULT_SCENE_TARGET
    const cfg = NEURAL_CONFIG

    const damp = (key: 'r' | 'op' | 'edgeOp' | 'phase' | 'themeT' | 'hover', target: number) =>
      (st[key] = dampValue(st[key], target, 3, dt))

    damp('r', chapter.r)
    damp('op', chapter.op)
    damp('edgeOp', chapter.edgeOp)
    damp('phase', chapter.phase)
    const pid = projectId.current
    const theme = pid === 'yotoqhonam' || pid === 'antifake' || pid === 'shieldx' ? pid : null
    damp('themeT', theme ? 1 : 0)
    damp('hover', Math.abs(pointer.x) < 0.22 && Math.abs(pointer.y) < 0.22 ? 1 : 0)

    const ph = st.phase
    const breath =
      reducedMotion || spec.particles <= 0
        ? 1
        : 1 + cfg.breathing.amp * Math.sin((t / cfg.breathing.period) * Math.PI * 2) * (1 - ph * 0.7)

    /* field group transform — a slow camera-like travel down the story */
    const groupObj = group.current
    if (groupObj) {
      const aspect = size.width / Math.max(size.height, 1)
      const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 34
      const halfH = Math.tan((fov * Math.PI) / 360) * 4.6

      // Project cursor ray onto 3D plane of the brain for local shader touch flares
      pointerVec2.set(pointer.x, pointer.y)
      raycaster.setFromCamera(pointerVec2, camera)
      camera.getWorldDirection(tmpForward).negate()
      plane.setFromNormalAndCoplanarPoint(tmpForward, groupObj.position)
      if (raycaster.ray.intersectPlane(plane, mouseWorld)) {
        groupObj.worldToLocal(mouseLocal.copy(mouseWorld))
      }

      // Parallax in 3D: subtle zero-g liquid floating responding to pointer
      const parallaxX = scene.x * halfH * aspect + pointer.x * 0.10
      const parallaxY = scene.yk * halfH + pointer.y * 0.08
      groupObj.position.x = dampValue(groupObj.position.x, parallaxX, 4.0, dt)
      groupObj.position.y = dampValue(groupObj.position.y, parallaxY, 4.0, dt)
      groupObj.position.z = dampValue(groupObj.position.z, scene.z, 3.0, dt)
      groupObj.scale.setScalar(scene.scale * st.r * breath)

      if (reducedMotion) {
        groupObj.rotation.set(0.32, 0.42, 0)
      } else {
        const life = 1 - ph * 0.85
        const basePitch = 0.32 * life
        const baseYaw = 0.42 * life
        const dx = drag ? drag.sx : 0
        const dy = drag ? drag.sy : 0

        // WOW: Fluid magnetic 3D orientation towards cursor
        const targetYaw = baseYaw - t * 0.03 * life + dx + pointer.x * 0.48
        const targetPitch = basePitch + Math.sin(t * 0.05) * 0.02 * life + dy * 0.7 - pointer.y * 0.38
        const targetRoll = -pointer.x * 0.16

        groupObj.rotation.y = dampValue(groupObj.rotation.y, targetYaw, 5.0, dt)
        groupObj.rotation.x = dampValue(groupObj.rotation.x, targetPitch, 5.0, dt)
        groupObj.rotation.z = dampValue(groupObj.rotation.z, targetRoll, 5.0, dt)
      }
      groupObj.updateMatrixWorld(true)
    }

    // Occasional subtle core pulse for scene reactivity
    pulseTimer.current += dt
    if (pulseTimer.current > 3.0) {
      pulseTimer.current = 0
      if (corePulse.current) {
        corePulse.current.target = Math.min(1.4, corePulse.current.target + 0.25)
      }
    }
  })

  const transferring = section === 'transfer' || section === 'ai'

  return (
    <group ref={group}>
      <BrainCortex
        sys={sys}
        morph={s.current.phase}
        opacity={s.current.op}
        mouseLocal={mouseLocal}
        mouseSpeed={smoothSpeed.current}
        clickPulse={clickPulse.current}
      />
      <InnerNeuralConnectome
        spec={spec}
        morph={s.current.phase}
        opacity={s.current.op}
        mouseLocal={mouseLocal}
        mouseSpeed={smoothSpeed.current}
        clickPulse={clickPulse.current}
        reducedMotion={reducedMotion}
      />
      <NeuralCyberEffects
        morph={s.current.phase}
        opacity={s.current.op}
        velocity={velocity}
        reducedMotion={reducedMotion}
        pointer={pointer}
        mouseSpeed={smoothSpeed.current}
        clickPulse={clickPulse.current}
      />
      {!reducedMotion && <TransferPulse active={transferring} />}
    </group>
  )
}

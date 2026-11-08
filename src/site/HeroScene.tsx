import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import * as THREE from 'three'
import { supportsWebGL } from '../lib/webgl'

const CENTERS = [0, 0.3, 0.55, 0.75, 1] as const
const BG = '#070709'
const COUNT_DESKTOP = 1_000_000
const COUNT_COMPACT = 320_000
const DUST_COUNT = 22_000
const CLICK_SECONDS = 1.7

/* ------------------------------------------------------------------ random */

function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

type Random = () => number
type Point3 = [number, number, number]

/* ------------------------------------------------------------------ shapes */

function spherePoint(random: Random, radius: number): Point3 {
  const u = random() * 2 - 1
  const theta = random() * Math.PI * 2
  const rim = Math.sqrt(Math.max(0, 1 - u * u))
  return [radius * rim * Math.cos(theta), radius * u, radius * rim * Math.sin(theta)]
}

/** Slide 1 — a dense luminous core. */
function coreSample(random: Random): Point3 {
  const mode = random()
  if (mode < 0.05) return spherePoint(random, 0.18 + random() * 0.14)
  if (mode < 0.66) return spherePoint(random, 1.46 + (random() - 0.5) * 0.05)
  if (mode < 0.82) return spherePoint(random, 1.38 * Math.pow(random(), 1.8))
  if (mode < 0.94) {
    const angle = random() * Math.PI * 2
    const radius = 1.7 + (random() - 0.5) * 0.06
    return [Math.cos(angle) * radius, (random() - 0.5) * 0.06, Math.sin(angle) * radius]
  }
  return spherePoint(random, 1.9 + random() * 0.25)
}

/** Slide 2 — a double helix pipeline. */
function helixSample(random: Random): Point3 {
  const mode = random()
  if (mode < 0.72) {
    const t = random()
    const strand = random() < 0.5 ? 0 : Math.PI
    const angle = t * Math.PI * 2 * 2.6 + strand
    const radius = 0.92 + (random() - 0.5) * 0.08
    return [
      Math.cos(angle) * radius,
      (t - 0.5) * 3.1 + (random() - 0.5) * 0.06,
      Math.sin(angle) * radius,
    ]
  }
  if (mode < 0.9) {
    const t = random()
    const k = random()
    const angle = t * Math.PI * 2 * 2.6
    const ax = Math.cos(angle) * 0.92
    const az = Math.sin(angle) * 0.92
    const bx = Math.cos(angle + Math.PI) * 0.92
    const bz = Math.sin(angle + Math.PI) * 0.92
    return [
      ax + (bx - ax) * k,
      (t - 0.5) * 3.1 + (random() - 0.5) * 0.03,
      az + (bz - az) * k,
    ]
  }
  const angle = random() * Math.PI * 2
  const radius = 1.2 + random() * 0.5
  return [Math.cos(angle) * radius, (random() - 0.5) * 3.4, Math.sin(angle) * radius]
}

/** Slide 3 — an iris / lens built from concentric particle rings. */
function visionSample(random: Random): Point3 {
  const mode = random()
  let radius: number
  if (mode < 0.72) {
    const rings = [0.36, 0.62, 0.94, 1.28, 1.6]
    radius = rings[Math.floor(random() * rings.length)] + (random() - 0.5) * 0.05
  } else if (mode < 0.9) {
    radius = 0.36 + random() * 1.3
  } else {
    radius = 1.82 + (random() - 0.5) * 0.05
  }
  const angle = random() * Math.PI * 2
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  const z = (random() - 0.5) * 0.12
  const tilt = 0.32
  const cy = Math.cos(tilt)
  const sy = Math.sin(tilt)
  return [x, y * cy - z * sy, y * sy + z * cy]
}

const SHIELD = [
  [0, 1.55],
  [1.16, 1.18],
  [1.3, 0.16],
  [0.98, -0.72],
  [0, -1.66],
  [-0.98, -0.72],
  [-1.3, 0.16],
  [-1.16, 1.18],
] as const

function insideShield(x: number, y: number) {
  let inside = false
  for (let i = 0, j = SHIELD.length - 1; i < SHIELD.length; j = i++) {
    const xi = SHIELD[i][0]
    const yi = SHIELD[i][1]
    const xj = SHIELD[j][0]
    const yj = SHIELD[j][1]
    const crosses = yi > y !== yj > y
    if (crosses && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

const SHIELD_EDGES = SHIELD.map((point, index) => {
  const next = SHIELD[(index + 1) % SHIELD.length]
  return {
    ax: point[0],
    ay: point[1],
    bx: next[0],
    by: next[1],
    len: Math.hypot(next[0] - point[0], next[1] - point[1]),
  }
})
const SHIELD_PERIMETER = SHIELD_EDGES.reduce((sum, edge) => sum + edge.len, 0)

function shieldEdge(random: Random): [number, number] {
  let distance = random() * SHIELD_PERIMETER
  let edge = SHIELD_EDGES[0]
  for (const candidate of SHIELD_EDGES) {
    if (distance <= candidate.len) {
      edge = candidate
      break
    }
    distance -= candidate.len
  }
  const k = distance / edge.len
  return [edge.ax + (edge.bx - edge.ax) * k, edge.ay + (edge.by - edge.ay) * k]
}

/** Slide 4 — a faceted shield lattice. */
function shieldSample(random: Random): Point3 {
  const mode = random()
  if (mode < 0.48) {
    const [x, y] = shieldEdge(random)
    return [x, y, (random() - 0.5) * 0.08]
  }
  if (mode < 0.62) {
    const [x, y] = shieldEdge(random)
    return [x * 0.8, y * 0.8, (random() - 0.5) * 0.08]
  }
  if (mode < 0.8) {
    const x = (Math.floor(random() * 15) - 7) * 0.17
    const y = (Math.floor(random() * 19) - 9) * 0.17
    if (insideShield(x, y)) {
      return [x + (random() - 0.5) * 0.02, y + (random() - 0.5) * 0.02, (random() - 0.5) * 0.42]
    }
  }
  if (mode < 0.94) {
    let x = 0
    let y = 0
    for (let attempt = 0; attempt < 30; attempt++) {
      x = (random() * 2 - 1) * 1.3
      y = random() * 3.25 - 1.66
      if (insideShield(x, y)) break
    }
    return [x, y, (random() - 0.5) * 0.36]
  }
  const y = -1.35 + random() * 2.75
  return [(random() - 0.5) * 0.04, y, (random() - 0.5) * 0.12]
}

/** Slide 5 — a portal of rings and an inward vortex. */
function portalSample(random: Random): Point3 {
  const mode = random()
  if (mode < 0.7) {
    const rings = [0.86, 1.26, 1.66]
    const radius = rings[Math.floor(random() * rings.length)]
    const theta = random() * Math.PI * 2
    const tube = 0.06 + random() * 0.06
    const phi = random() * Math.PI * 2
    return [
      (radius + tube * Math.cos(phi)) * Math.cos(theta),
      (radius + tube * Math.cos(phi)) * Math.sin(theta),
      tube * Math.sin(phi),
    ]
  }
  if (mode < 0.82) {
    const theta = random() * Math.PI * 2
    const tube = 0.035 + random() * 0.035
    const phi = random() * Math.PI * 2
    const radius = 0.46
    return [
      (radius + tube * Math.cos(phi)) * Math.cos(theta),
      (radius + tube * Math.cos(phi)) * Math.sin(theta),
      tube * Math.sin(phi),
    ]
  }
  const t = random()
  const radius = 0.22 + t * 1.48
  const angle = random() * Math.PI * 2 + t * 4.2
  return [
    Math.cos(angle) * radius,
    Math.sin(angle) * radius,
    -t * 2.4 + (random() - 0.5) * 0.18,
  ]
}

/* ------------------------------------------------------------------- field */

type Field = {
  positions: Float32Array[]
  seeds: Float32Array
  sizes: Float32Array
  tints: Float32Array
}

const SAMPLERS = [coreSample, helixSample, visionSample, shieldSample, portalSample]

function makeField(count: number): Field {
  const random = seeded(0x5eed)
  const positions = SAMPLERS.map(() => new Float32Array(count * 3))
  const seeds = new Float32Array(count)
  const sizes = new Float32Array(count)
  const tints = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    seeds[i] = random()
    sizes[i] = 0.5 + Math.pow(random(), 2.4) * 2.35
    tints[i] = random()
    for (let s = 0; s < SAMPLERS.length; s++) {
      const [x, y, z] = SAMPLERS[s](random)
      const offset = i * 3
      positions[s][offset] = x
      positions[s][offset + 1] = y
      positions[s][offset + 2] = z
    }
  }

  return { positions, seeds, sizes, tints }
}

/* ------------------------------------------------------------------ shaders */

const FIELD_VERTEX = /* glsl */ `
  attribute vec3 aPos1;
  attribute vec3 aPos2;
  attribute vec3 aPos3;
  attribute vec3 aPos4;
  attribute float aSeed;
  attribute float aSize;
  attribute float aTint;

  uniform float uTime;
  uniform float uMorph;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2 uPointer;
  uniform vec2 uPointerLocal;
  uniform vec2 uClickLocal;
  uniform float uAspect;
  uniform float uPointerStrength;
  uniform float uClick;
  uniform float uMotion;
  uniform float uOpacity;

  varying vec3 vColor;
  varying float vAlpha;

  vec2 rotate2(vec2 v, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
  }

  // A soft band centred on center, used for travelling pulses and ripples.
  float band(float x, float center, float width) {
    return smoothstep(width, 0.0, abs(x - center));
  }

  void main() {
    float w0 = max(0.0, 1.0 - abs(uMorph));
    float w1 = max(0.0, 1.0 - abs(uMorph - 1.0));
    float w2 = max(0.0, 1.0 - abs(uMorph - 2.0));
    float w3 = max(0.0, 1.0 - abs(uMorph - 3.0));
    float w4 = max(0.0, 1.0 - abs(uMorph - 4.0));
    float total = max(0.0001, w0 + w1 + w2 + w3 + w4);

    vec3 p = (
      position * w0 +
      aPos1 * w1 +
      aPos2 * w2 +
      aPos3 * w3 +
      aPos4 * w4
    ) / total;

    float phase = aSeed * 6.28318;
    float motion = uMotion;

    p += vec3(
      sin(uTime * 0.55 + phase) * 0.028,
      cos(uTime * 0.47 + phase * 1.3) * 0.028,
      sin(uTime * 0.39 + phase * 0.7) * 0.028
    ) * motion;

    float ang = sin(uTime * 0.16) * 0.16 * motion + uMorph * 0.1;
    float c = cos(ang);
    float s = sin(ang);
    p.xz = mat2(c, -s, s, c) * p.xz;

    // Project once to find how close this particle is to the cursor, then
    // build a shape-specific response around the object's local centre.
    vec4 originV = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    vec4 baseMv = modelViewMatrix * vec4(p, 1.0);
    vec4 baseClip = projectionMatrix * baseMv;
    vec2 ndc = baseClip.xy / max(0.0001, baseClip.w);
    vec2 diff = ndc - uPointer;
    diff.x *= uAspect;
    float dist = length(diff);

    float hover = smoothstep(0.52, 0.0, dist) * uPointerStrength * motion;

    // Shared click timeline (0 → 1 over the burst), split into envelopes.
    float ct = clamp(uClick, 0.0, 1.0) * motion;
    float implode = smoothstep(0.0, 0.14, ct) * (1.0 - smoothstep(0.14, 0.34, ct));
    float blast = smoothstep(0.12, 0.32, ct) * (1.0 - smoothstep(0.55, 1.0, ct));
    float open = smoothstep(0.0, 0.28, ct) * (1.0 - smoothstep(0.62, 1.0, ct));
    float shutter = smoothstep(0.0, 0.2, ct) * (1.0 - smoothstep(0.24, 0.62, ct));
    float flash = smoothstep(0.18, 0.3, ct) * (1.0 - smoothstep(0.35, 0.85, ct));

    vec3 lv = baseMv.xyz - originV.xyz;
    float rxy = length(lv.xy);
    vec2 radial = lv.xy / max(rxy, 0.0001);
    vec2 tangentLocal = vec2(-radial.y, radial.x);
    float hn = clamp(lv.y / 1.7, -1.0, 1.0);

    vec3 disp = vec3(0.0);
    float glow = 0.0;

    // Skip the five reaction systems entirely while the pointer is at rest,
    // so idle scrolling keeps its full frame rate.
    if (uPointerStrength > 0.001 || uClick < 0.999) {
    // 1 — Core: gravitational lens, heartbeat, then implosion + spherical blast.
    vec3 dCore = vec3(0.0);
    float gCore = 0.0;
    float lens = hover * smoothstep(2.0, 0.0, rxy);
    dCore.xy -= radial * lens * 0.18;
    dCore.xy += tangentLocal * lens * 0.28;
    dCore.z += lens * 0.08;
    float beat = 0.5 + 0.5 * sin(uTime * 3.0);
    dCore.xy += radial * beat * 0.012 * motion;
    gCore += lens * 0.55 + beat * 0.12;
    vec3 rdir = normalize(lv + vec3(0.0001));
    dCore += rdir * (blast * (0.45 + aSeed * 0.7) - implode * 0.35);
    gCore += blast * 1.1 + implode * 0.4;

    // 2 — Helix: differential unwind, upward flow, travelling spark; the
    //     click sends a pulse along the strands and springs the coil.
    vec3 dHelix = vec3(0.0);
    float gHelix = 0.0;
    float spinH = hover * 0.7;
    dHelix.xz = rotate2(lv.xz, spinH * (0.5 + aSeed * 0.9)) - lv.xz;
    dHelix.y += hover * (0.06 + 0.1 * aSeed) * sin(uTime * 2.2 + hn * 5.0);
    float head = fract(uTime * 0.22) * 2.0 - 1.0;
    float sparkH = band(hn, head, 0.16) * hover;
    gHelix += sparkH * 1.2;
    float travel = smoothstep(0.0, 0.72, ct) * 2.0 - 1.0;
    float waveH = band(hn, travel, 0.22) * (1.0 - smoothstep(0.75, 1.0, ct));
    dHelix.xy += radial * waveH * 0.28;
    dHelix.y *= 1.0 - implode * 0.12;
    gHelix += waveH * 1.0 + implode * 0.3;

    // 3 — Iris: counter-rotating rings, dilating pupil, scan line; the click
    //     snaps the shutter shut and reopens with a warp flash.
    vec3 dIris = vec3(0.0);
    float gIris = 0.0;
    float ringI = floor(rxy * 3.0);
    float signI = mod(ringI, 2.0) * 2.0 - 1.0;
    float spinI = hover * signI * 0.5 / (0.5 + rxy);
    dIris.xy = rotate2(lv.xy, spinI) - lv.xy;
    dIris.xy += radial * hover * smoothstep(0.8, 0.0, rxy) * 0.12;
    float scanI = band(rxy, fract(uTime * 0.16) * 1.9, 0.1) * hover;
    gIris += scanI * 0.9;
    dIris.y *= 1.0 - shutter * 0.9;
    dIris.xy += lv.xy * blast * 0.3;
    gIris += shutter * 0.5 + flash * 0.9;

    // 4 — Shield: surface bows toward the cursor with a grid scan; the click
    //     dents the panel and sends a ripple across the lattice.
    vec3 dShield = vec3(0.0);
    float gShield = 0.0;
    vec2 hit = uClickLocal;
    float bow = hover * smoothstep(0.9, 0.0, length(lv.xy - uPointerLocal));
    dShield.z += bow * 0.22;
    dShield.xy += radial * hover * 0.12 * smoothstep(0.4, 1.3, rxy);
    float scanS = band(lv.y, uPointerLocal.y, 0.4) * hover;
    gShield += scanS * 0.9 + bow * 0.4;
    float dd = length(lv.xy - hit);
    float dent = smoothstep(0.0, 0.12, ct) * (1.0 - smoothstep(0.16, 0.55, ct));
    dShield.z -= smoothstep(0.8, 0.0, dd) * dent * 0.6;
    float rr = smoothstep(0.0, 0.62, ct);
    float ripple = band(dd, rr * 2.1, 0.2) * (1.0 - smoothstep(0.62, 1.0, ct));
    dShield.z += ripple * 0.28;
    gShield += ripple * 0.9 + dent * 0.5;

    // 5 — Portal: rings counter-rotate as the well sucks particles in; the
    //     click opens the tunnel and fires a warp flash toward the viewer.
    vec3 dPortal = vec3(0.0);
    float gPortal = 0.0;
    float ringP = floor(rxy * 2.2);
    float signP = mod(ringP, 2.0) * 2.0 - 1.0;
    dPortal.xy = rotate2(lv.xy, hover * signP * 0.5) - lv.xy;
    float pull = hover * smoothstep(1.9, 0.0, rxy);
    dPortal.xy -= radial * pull * 0.26;
    dPortal.z -= pull * 0.45;
    float accretion = band(rxy, 0.95, 0.16) * hover;
    gPortal += accretion * 1.1 + pull * 0.4;
    dPortal.xy -= radial * open * 0.55;
    dPortal.z -= open * 1.5;
    dPortal.z += blast * 1.9 * smoothstep(0.35, 0.0, rxy);
    gPortal += open * 1.2 + blast * 1.2;

    // Blend the five reactions with the same morph weights as the forms.
    disp = (
      dCore * w0 +
      dHelix * w1 +
      dIris * w2 +
      dShield * w3 +
      dPortal * w4
    ) / total;
    glow = (
      gCore * w0 +
      gHelix * w1 +
      gIris * w2 +
      gShield * w3 +
      gPortal * w4
    ) / total;
    }

    lv += disp;

    vec4 mv = vec4(originV.xyz + lv, 1.0);
    gl_Position = projectionMatrix * mv;

    float depth = max(0.1, -mv.z);
    float star = step(0.985, aTint);
    gl_PointSize = aSize * uSize * uPixelRatio * (7.0 / depth) * (1.0 + star * 1.15);

    // Front-facing particles glow, back-facing ones recede so the form
    // reads as a solid volume instead of a flat wash of light.
    float facing = smoothstep(-9.0, -4.8, mv.z);
    float depthFade = mix(0.16, 1.0, facing);

    float twinkle = 0.72 + 0.28 * sin(uTime * 1.3 + phase * 4.0);
    float energy = clamp(hover * 1.2 + glow, 0.0, 2.4);
    // Squared seed keeps most particles dim and lets a sparse minority sparkle.
    float spark = pow(aSeed, 1.7);
    vAlpha = min(
      1.0,
      uOpacity * depthFade * (0.2 + 0.8 * spark) * twinkle * (1.0 + energy * 1.1)
    );
    vAlpha = min(1.0, vAlpha * (1.0 + star * 1.8));

    vec3 silver = vec3(0.52, 0.6, 0.68);
    vec3 white = vec3(0.97, 0.99, 1.0);
    vec3 color = mix(silver, white, smoothstep(0.3, 0.98, aSeed));
    color = mix(color, vec3(1.0), star);
    color = mix(color, white, clamp(energy * 0.5, 0.0, 0.9));
    vColor = color;
  }
`

const FIELD_FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    float alpha = pow(core, 2.4) * vAlpha;
    gl_FragColor = vec4(vColor * (0.65 + 0.8 * core), alpha);
    #include <colorspace_fragment>
  }
`

const DUST_VERTEX = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float phase = aSeed * 6.2831;
    p.x += sin(uTime * 0.08 + phase) * 0.3;
    p.y += cos(uTime * 0.06 + phase * 1.3) * 0.25;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (0.7 + aSeed * 1.1) * uPixelRatio * (5.0 / max(-mv.z, 0.1));
    vAlpha = 0.2 + 0.8 * aSeed;
  }
`

const DUST_FRAGMENT = /* glsl */ `
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d) * vAlpha * uOpacity;
    gl_FragColor = vec4(vec3(0.6, 0.7, 0.8), alpha);
    #include <colorspace_fragment>
  }
`

const AURA_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const AURA_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5);
    float alpha = smoothstep(0.5, 0.0, d);
    alpha *= alpha;
    gl_FragColor = vec4(uColor, alpha * uOpacity);
    #include <colorspace_fragment>
  }
`

/* --------------------------------------------------------------- components */

function morphTarget(progress: number) {
  if (progress <= CENTERS[0]) return 0
  for (let i = 0; i < CENTERS.length - 1; i++) {
    if (progress <= CENTERS[i + 1]) {
      const t = (progress - CENTERS[i]) / (CENTERS[i + 1] - CENTERS[i])
      return i + t * t * (3 - 2 * t)
    }
  }
  return CENTERS.length - 1
}

function Aura() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color('#d7e6ff') },
          uOpacity: { value: 0.028 },
        },
        vertexShader: AURA_VERTEX,
        fragmentShader: AURA_FRAGMENT,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  return (
    <mesh material={material} position={[0, 0, -2.6]} scale={[8.4, 6.2, 1]} renderOrder={-1}>
      <planeGeometry />
    </mesh>
  )
}

function Dust({ reduced }: { reduced: boolean }) {
  const geometry = useMemo(() => {
    const random = seeded(0xd057)
    const positions = new Float32Array(DUST_COUNT * 3)
    const seeds = new Float32Array(DUST_COUNT)
    for (let i = 0; i < DUST_COUNT; i++) {
      positions[i * 3] = (random() - 0.5) * 16
      positions[i * 3 + 1] = (random() - 0.5) * 10
      positions[i * 3 + 2] = -12 + random() * 16
      seeds[i] = random()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -2), 16)
    return g
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: 1 },
          uOpacity: { value: 0.42 },
        },
        vertexShader: DUST_VERTEX,
        fragmentShader: DUST_FRAGMENT,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  useFrame((state) => {
    material.uniforms.uTime.value = reduced ? 0 : state.clock.elapsedTime
    material.uniforms.uPixelRatio.value = state.gl.getPixelRatio()
  })

  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={-2} />
}

function ParticleField({
  progress,
  click,
  clickPoint,
  reduced,
}: {
  progress: RefObject<number>
  click: RefObject<number>
  clickPoint: RefObject<THREE.Vector2>
  reduced: boolean
}) {
  const compact = useThree((state) => state.viewport.width < 5.6)
  const group = useRef<THREE.Group>(null)
  const morph = useRef(0)
  const pointer = useRef({ x: 0, y: 0, active: false })
  const strength = useRef(0)
  const scratch = useRef({
    ndc: new THREE.Vector3(),
    dir: new THREE.Vector3(),
    hit: new THREE.Vector3(),
    clickLocal: new THREE.Vector2(0, 0),
  })
  const count = compact ? COUNT_COMPACT : COUNT_DESKTOP

  const field = useMemo(() => makeField(count), [count])

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(field.positions[0], 3))
    for (let i = 1; i < field.positions.length; i++) {
      g.setAttribute(`aPos${i}`, new THREE.BufferAttribute(field.positions[i], 3))
    }
    g.setAttribute('aSeed', new THREE.BufferAttribute(field.seeds, 1))
    g.setAttribute('aSize', new THREE.BufferAttribute(field.sizes, 1))
    g.setAttribute('aTint', new THREE.BufferAttribute(field.tints, 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 6)
    return g
  }, [field])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uSize: { value: compact ? 0.62 : 0.52 },
          uPixelRatio: { value: 1 },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uPointerLocal: { value: new THREE.Vector2(0, 0) },
          uClickLocal: { value: new THREE.Vector2(0, 0) },
          uAspect: { value: 1 },
          uPointerStrength: { value: 0 },
          uClick: { value: 1 },
          uMotion: { value: reduced ? 0 : 1 },
          uOpacity: { value: compact ? 0.34 : 0.26 },
        },
        vertexShader: FIELD_VERTEX,
        fragmentShader: FIELD_FRAGMENT,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      }),
    [compact, reduced],
  )

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1
      pointer.current.active = true
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const target = morphTarget(progress.current)
    // Track scroll tightly so the form never appears to trail behind the page.
    const damp = reduced ? 1 : 1 - Math.exp(-dt * 18)
    morph.current += (target - morph.current) * damp

    const side = Math.cos(morph.current * Math.PI)
    const cross = 1 - Math.abs(side)
    const baseOpacity = compact ? 0.34 : 0.26

    const uniforms = material.uniforms
    uniforms.uTime.value = reduced ? 0 : state.clock.elapsedTime
    uniforms.uMorph.value = morph.current
    uniforms.uPointer.value.set(pointer.current.x, pointer.current.y)
    // Ease the pointer influence so the first move doesn't pop.
    const wantStrength = reduced || !pointer.current.active ? 0 : 0.95
    const ease = reduced ? 1 : 1 - Math.exp(-dt * 10)
    strength.current += (wantStrength - strength.current) * ease
    uniforms.uPointerStrength.value = strength.current
    uniforms.uAspect.value = state.viewport.width / state.viewport.height
    uniforms.uPixelRatio.value = state.gl.getPixelRatio()
    // Recede into the background while passing behind the centred copy.
    uniforms.uOpacity.value = baseOpacity * (1 - cross * 0.45)

    const node = group.current
    if (!node) return
    const targetX = compact ? 0 : side * state.viewport.width * 0.227
    const targetY = compact ? 0.36 : 0
    const targetZ = -cross * 2.4
    const targetScale = (compact ? 0.62 : 0.8) * (1 - cross * 0.1)
    const follow = reduced ? 1 : 1 - Math.exp(-dt * 14)
    node.position.x += (targetX - node.position.x) * follow
    node.position.y += (targetY - node.position.y) * follow
    node.position.z += (targetZ - node.position.z) * follow
    const scale = node.scale.x + (targetScale - node.scale.x) * follow
    node.scale.setScalar(scale)
    node.rotation.x = reduced ? 0 : -pointer.current.y * 0.08
    node.rotation.y = reduced ? 0 : pointer.current.x * 0.12

    // Map cursor and click from screen space onto the object's local plane so
    // the shield scan / dent land where the user actually pointed.
    const camera = state.camera
    const toLocal = (nx: number, ny: number, out: THREE.Vector2) => {
      const far = scratch.current.ndc.set(nx, ny, 0.5).unproject(camera)
      const dir = scratch.current.dir.copy(far).sub(camera.position).normalize()
      const travel = (node.position.z - camera.position.z) / (dir.z || -1)
      const hit = scratch.current.hit.copy(camera.position).addScaledVector(dir, travel)
      const inv = 1 / Math.max(0.0001, node.scale.x)
      out.set((hit.x - node.position.x) * inv, (hit.y - node.position.y) * inv)
    }
    toLocal(pointer.current.x, pointer.current.y, uniforms.uPointerLocal.value)
    if (click.current === 0) {
      toLocal(clickPoint.current.x, clickPoint.current.y, scratch.current.clickLocal)
      uniforms.uClickLocal.value.copy(scratch.current.clickLocal)
    }
    click.current = Math.min(click.current + dt, CLICK_SECONDS)
    uniforms.uClick.value = click.current / CLICK_SECONDS
  })

  return (
    <group ref={group}>
      <Aura />
      <points
        geometry={geometry}
        material={material}
        frustumCulled={false}
        renderOrder={1}
      />
    </group>
  )
}

function CameraRig({ progress, reduced }: { progress: RefObject<number>; reduced: boolean }) {
  const { camera } = useThree()
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((frame, delta) => {
    const damp = 1 - Math.exp(-delta * 9)
    const px = reduced ? 0 : pointer.current.x
    const py = reduced ? 0 : pointer.current.y
    const breathe = reduced ? 0 : Math.sin(frame.clock.elapsedTime * 0.3) * 0.2
    const travel = Math.sin(progress.current * Math.PI)
    const depth = reduced ? 7 : 7 - travel * 0.9
    const drift = reduced ? 0 : (progress.current - 0.5) * 0.3

    camera.position.x += (px * 0.42 - camera.position.x) * damp
    camera.position.y += (-py * 0.28 + drift - camera.position.y) * damp
    camera.position.z += (depth + breathe - camera.position.z) * damp
    camera.lookAt(px * 0.3, -py * 0.18 + drift * 0.6, -6)
  })

  return null
}

function Effects({ compact }: { compact: boolean }) {
  const offset = useMemo(() => new THREE.Vector2(0.0004, 0.0007), [])
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={compact ? 0.5 : 0.62}
        luminanceThreshold={0.52}
        luminanceSmoothing={0.24}
        mipmapBlur
        radius={0.5}
      />
      {compact ? null : (
        <ChromaticAberration offset={offset} radialModulation modulationOffset={0.35} />
      )}
      <Noise opacity={0.026} blendFunction={BlendFunction.OVERLAY} />
      <Vignette offset={0.28} darkness={0.9} />
    </EffectComposer>
  )
}

function Scene({
  progress,
  click,
  clickPoint,
  reduced,
}: {
  progress: RefObject<number>
  click: RefObject<number>
  clickPoint: RefObject<THREE.Vector2>
  reduced: boolean
}) {
  const compact = useThree((state) => state.viewport.width < 5.6)
  return (
    <>
      <CameraRig progress={progress} reduced={reduced} />
      <Dust reduced={reduced} />
      <ParticleField
        progress={progress}
        click={click}
        clickPoint={clickPoint}
        reduced={reduced}
      />
      <Effects compact={compact} />
    </>
  )
}

/* ------------------------------------------------------------------- canvas */

export function HeroScene({ progressRef }: { progressRef: RefObject<number> }) {
  const [webgl] = useState(() => supportsWebGL())
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [inView, setInView] = useState(true)
  const host = useRef<HTMLDivElement>(null)
  const click = useRef(CLICK_SECONDS)
  const clickPoint = useRef(new THREE.Vector2(0, 0))

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

  // Some browsers mount the canvas in a background tab before layout settles,
  // leaving the drawing buffer at its default 300x150. Nudge a measure once.
  useEffect(() => {
    const nudge = () => window.dispatchEvent(new Event('resize'))
    const timers = [window.setTimeout(nudge, 120), window.setTimeout(nudge, 700)]
    const onVisible = () => {
      if (!document.hidden) nudge()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  if (!webgl) return null

  return (
    <div
      className="hero__scene"
      ref={host}
      aria-hidden="true"
      onPointerDown={(event) => {
        click.current = 0
        clickPoint.current.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
        )
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [0, 0, 7], fov: 45, near: 0.1, far: 60 }}
        gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(BG, 1)
          gl.toneMappingExposure = 1
        }}
      >
        <Scene
          progress={progressRef}
          click={click}
          clickPoint={clickPoint}
          reduced={reduced}
        />
      </Canvas>
    </div>
  )
}

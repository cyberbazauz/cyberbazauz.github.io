import * as THREE from 'three'
import type { NeuralTier } from '../config/neural'
import { generateMasterBrainData } from './brainGeometry'

/**
 * Anatomical 3D Inner Neural Connectome Generator.
 * Fills 100% of the internal 3D brain volume:
 * 1. Deep Thalamic / Limbic Reticular Core (central high-density convergence).
 * 2. Trans-Hemispheric Corpus Callosum Commissural Arches.
 * 3. White Matter & Lobar Association Pathways (Frontal, Parietal, Temporal, Occipital).
 * 4. Cerebellar Arbor Vitae and Brainstem Projection Conduits.
 * 5. Thousands of vibrant synaptic neuron cell bodies (soma).
 */

export interface InnerConnectomeData {
  filamentGeometry: THREE.BufferGeometry
  synapseGeometry: THREE.BufferGeometry
  nodeCount: number
  filamentCount: number
}

// Pseudo-random seeded PRNG (Mulberry32) for reproducible, stable generation
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface InternalNode {
  x: number
  y: number
  z: number
  hemi: number
  depth: number
  region: number // 0: core/thalamus, 1: frontal, 2: parietal, 3: occipital, 4: temporal, 5: cerebellum/stem
  seed: number
}

const TIER_BUDGETS: Record<NeuralTier, { nodes: number; filaments: number }> = {
  1: { nodes: 1800, filaments: 3800 },
  2: { nodes: 3200, filaments: 7200 },
  3: { nodes: 4800, filaments: 10500 },
}

export function generateInnerConnectome(tier: NeuralTier, envelope = 2.15): InnerConnectomeData {
  const budget = TIER_BUDGETS[tier] || TIER_BUDGETS[3]
  const rnd = mulberry32(0x8f1bbcdc)

  // 1. Obtain master brain geometry to get the exact anatomical surface bounds
  const master = generateMasterBrainData(envelope)
  const bPos = master.geometry.getAttribute('position')
  const totalVerts = bPos.count

  const nodes: InternalNode[] = []
  const N = budget.nodes

  // 2. Distribute neurons throughout the 3D volume
  // - 20% Deep Thalamic / Limbic Core (center of the brain: depth 0.08 .. 0.32)
  // - 50% Internal White Matter & Lobar Tracts (depth 0.32 .. 0.76)
  // - 30% Subcortical Synaptic Layer (depth 0.76 .. 0.94)
  for (let i = 0; i < N; i++) {
    const vIdx = Math.floor(rnd() * totalVerts)
    const vx = bPos.getX(vIdx)
    const vy = bPos.getY(vIdx)
    const vz = bPos.getZ(vIdx)

    const dice = rnd()
    let depth: number
    let isCore = false

    if (dice < 0.22) {
      depth = 0.06 + rnd() * 0.26
      isCore = true
    } else if (dice < 0.72) {
      depth = 0.30 + rnd() * 0.44
    } else {
      depth = 0.74 + rnd() * 0.20
    }

    let px = vx * depth
    let py = vy * depth
    let pz = vz * depth

    // Longitudinal fissure separation: keep midline clean except for corpus callosum arches
    if (!isCore && Math.abs(vx) > 0.08 && Math.abs(px) < 0.04 && py > -0.25) {
      px = Math.sign(vx) * 0.05
    }

    // Determine region
    let region = isCore ? 0 : 1
    if (!isCore) {
      if (py < -0.55 && pz < -0.45) region = 5 // Cerebellum / Stem
      else if (pz < -0.3) region = 3 // Occipital
      else if (py > 0.2) region = 2 // Parietal
      else if (py < -0.1 && Math.abs(px) > 0.45) region = 4 // Temporal
    }

    nodes.push({
      x: px,
      y: py,
      z: pz,
      hemi: Math.sign(vx),
      depth,
      region,
      seed: rnd(),
    })
  }

  // 3. Connect nodes with rich 3D axon filaments
  interface Edge {
    a: number
    b: number
    type: number // 0: core, 1: callosum, 2: projection, 3: association
    intensity: number
  }

  const edges: Edge[] = []
  const edgeSet = new Set<number>()
  const keyOf = (a: number, b: number) => (a < b ? a * 100000 + b : b * 100000 + a)

  const addEdge = (a: number, b: number, type: number, intensity = 1.0) => {
    if (a === b) return
    const key = keyOf(a, b)
    if (edgeSet.has(key)) return
    edgeSet.add(key)
    edges.push({ a, b, type, intensity })
  }

  // A. Corpus Callosum trans-hemispheric commissural arches (Left <-> Right)
  const leftCallosal: number[] = []
  const rightCallosal: number[] = []

  for (let i = 0; i < N; i++) {
    const nd = nodes[i]
    if (Math.abs(nd.x) < 0.45 && nd.y > -0.22 && nd.y < 0.45 && Math.abs(nd.z) < 0.8) {
      if (nd.x < 0) leftCallosal.push(i)
      else rightCallosal.push(i)
    }
  }

  const callosumCount = Math.floor(budget.filaments * 0.18)
  for (let k = 0; k < callosumCount && leftCallosal.length > 0 && rightCallosal.length > 0; k++) {
    const li = leftCallosal[Math.floor(rnd() * leftCallosal.length)]
    let bestR = -1
    let bestD = Infinity
    for (let s = 0; s < 10; s++) {
      const ri = rightCallosal[Math.floor(rnd() * rightCallosal.length)]
      const dy = nodes[li].y - nodes[ri].y
      const dz = nodes[li].z - nodes[ri].z
      const d = dy * dy + dz * dz
      if (d < bestD) {
        bestD = d
        bestR = ri
      }
    }
    if (bestR >= 0) {
      addEdge(li, bestR, 1, 1.3)
    }
  }

  // B. Spatial hash grid for dense 3D local and projection networks
  const cellSize = 0.30
  const grid = new Map<string, number[]>()

  for (let i = 0; i < N; i++) {
    const gx = Math.floor(nodes[i].x / cellSize)
    const gy = Math.floor(nodes[i].y / cellSize)
    const gz = Math.floor(nodes[i].z / cellSize)
    const key = `${gx},${gy},${gz}`
    let list = grid.get(key)
    if (!list) {
      list = []
      grid.set(key, list)
    }
    list.push(i)
  }

  const maxDistSq = 0.36 * 0.36
  const maxEdges = budget.filaments

  for (let i = 0; i < N && edges.length < maxEdges; i++) {
    const gx = Math.floor(nodes[i].x / cellSize)
    const gy = Math.floor(nodes[i].y / cellSize)
    const gz = Math.floor(nodes[i].z / cellSize)

    for (let ox = -1; ox <= 1 && edges.length < maxEdges; ox++) {
      for (let oy = -1; oy <= 1 && edges.length < maxEdges; oy++) {
        for (let oz = -1; oz <= 1 && edges.length < maxEdges; oz++) {
          const list = grid.get(`${gx + ox},${gy + oy},${gz + oz}`)
          if (!list) continue
          for (let m = 0; m < list.length && edges.length < maxEdges; m++) {
            const j = list[m]
            if (i >= j) continue

            // Don't cross hemispheres unless in deep core or near callosum
            const isCallosal =
              Math.abs(nodes[i].x) < 0.35 &&
              Math.abs(nodes[j].x) < 0.35 &&
              nodes[i].y > -0.2 &&
              nodes[i].y < 0.45
            if (nodes[i].hemi !== nodes[j].hemi && !isCallosal && nodes[i].region !== 0) continue

            const dx = nodes[i].x - nodes[j].x
            const dy = nodes[i].y - nodes[j].y
            const dz = nodes[i].z - nodes[j].z
            const dSq = dx * dx + dy * dy + dz * dz

            if (dSq < maxDistSq) {
              const type = nodes[i].region === 0 ? 0 : nodes[i].region === 5 ? 2 : 3
              addEdge(i, j, type, 1.0)
            }
          }
        }
      }
    }
  }

  // 4. Assemble Filament BufferGeometry (LineSegments)
  const edgeCount = edges.length
  const filamentPositions = new Float32Array(edgeCount * 2 * 3)
  const filamentColors = new Float32Array(edgeCount * 2 * 3)
  const filamentPhases = new Float32Array(edgeCount * 2)
  const filamentTypes = new Float32Array(edgeCount * 2)

  // Vivid emissive palette:
  // Core/Callosum: radiant warm incandescent gold/amber & white
  // Association: crisp luminous silver/amber
  const cCore = new THREE.Color(1.0, 0.94, 0.75)
  const cCallosum = new THREE.Color(1.0, 0.88, 0.60)
  const cAssoc = new THREE.Color(0.95, 0.84, 0.70)
  const cStem = new THREE.Color(0.85, 0.90, 1.0)

  for (let e = 0; e < edgeCount; e++) {
    const { a, b, type, intensity } = edges[e]
    const na = nodes[a]
    const nb = nodes[b]

    const idx6 = e * 6
    filamentPositions[idx6] = na.x
    filamentPositions[idx6 + 1] = na.y
    filamentPositions[idx6 + 2] = na.z

    filamentPositions[idx6 + 3] = nb.x
    filamentPositions[idx6 + 4] = nb.y
    filamentPositions[idx6 + 5] = nb.z

    const baseCol = type === 0 ? cCore : type === 1 ? cCallosum : type === 2 ? cStem : cAssoc
    const bright = intensity * (type === 0 ? 1.35 : 1.1)

    filamentColors[idx6] = baseCol.r * bright
    filamentColors[idx6 + 1] = baseCol.g * bright
    filamentColors[idx6 + 2] = baseCol.b * bright

    filamentColors[idx6 + 3] = baseCol.r * bright
    filamentColors[idx6 + 4] = baseCol.g * bright
    filamentColors[idx6 + 5] = baseCol.b * bright

    const idx2 = e * 2
    filamentPhases[idx2] = na.seed * Math.PI * 2
    filamentPhases[idx2 + 1] = nb.seed * Math.PI * 2

    filamentTypes[idx2] = type
    filamentTypes[idx2 + 1] = type
  }

  const filamentGeometry = new THREE.BufferGeometry()
  filamentGeometry.setAttribute('position', new THREE.BufferAttribute(filamentPositions, 3))
  filamentGeometry.setAttribute('color', new THREE.BufferAttribute(filamentColors, 3))
  filamentGeometry.setAttribute('aPhase', new THREE.BufferAttribute(filamentPhases, 1))
  filamentGeometry.setAttribute('aType', new THREE.BufferAttribute(filamentTypes, 1))

  // 5. Assemble Synapse Neuron Soma BufferGeometry (Points)
  const synapsePositions = new Float32Array(N * 3)
  const synapseColors = new Float32Array(N * 3)
  const synapsePhases = new Float32Array(N)
  const synapseScales = new Float32Array(N)

  const cSomaCore = new THREE.Color(1.0, 0.96, 0.82)
  const cSomaAssoc = new THREE.Color(1.0, 0.90, 0.72)
  const cSomaStem = new THREE.Color(0.70, 0.92, 1.0)

  for (let i = 0; i < N; i++) {
    const nd = nodes[i]
    synapsePositions[i * 3] = nd.x
    synapsePositions[i * 3 + 1] = nd.y
    synapsePositions[i * 3 + 2] = nd.z

    const isCore = nd.region === 0
    const col = isCore ? cSomaCore : nd.region === 5 ? cSomaStem : cSomaAssoc

    synapseColors[i * 3] = col.r
    synapseColors[i * 3 + 1] = col.g
    synapseColors[i * 3 + 2] = col.b

    synapsePhases[i] = nd.seed * Math.PI * 2
    // Large glowing cell bodies for core and active centers
    synapseScales[i] = isCore ? 1.6 + nd.seed * 0.8 : 0.9 + nd.seed * 0.7
  }

  const synapseGeometry = new THREE.BufferGeometry()
  synapseGeometry.setAttribute('position', new THREE.BufferAttribute(synapsePositions, 3))
  synapseGeometry.setAttribute('color', new THREE.BufferAttribute(synapseColors, 3))
  synapseGeometry.setAttribute('aPhase', new THREE.BufferAttribute(synapsePhases, 1))
  synapseGeometry.setAttribute('aScale', new THREE.BufferAttribute(synapseScales, 1))

  return {
    filamentGeometry,
    synapseGeometry,
    nodeCount: N,
    filamentCount: edgeCount,
  }
}

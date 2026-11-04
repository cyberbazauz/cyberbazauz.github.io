import type { Spec } from '../hooks/useScrollStory'

/**
 * Single source of truth for the NEURAL FIELD that surrounds the CORE.
 * Every density/size/timing knob lives here so the scene can be tuned
 * without touching the renderers.
 */

export type NeuralTier = 1 | 2 | 3

export interface NeuralTierBudget {
  nodes: number
  /** soft cap — the generator stops adding connections once reached */
  edges: number
  connectomeNodes: number
  connectomeFilaments: number
  signals: number
  stars: number
}

export interface NeuralConfig {
  tiers: Record<NeuralTier, NeuralTierBudget>
  /** how many separate organic clusters aggregate around the core */
  clusters: number
  /** nodes within this radius "reach the core" when a signal arrives */
  coreRadius: number
  /** below this radius nodes get a filament wired straight into the core */
  innerCutoff: number
  /** outer envelope radius in field units */
  outerR: number
  /** field "breathing" — amplitude + period of the slow expansion */
  breathing: { amp: number; period: number }
  /** radius of the leaves: use a rare sync event triggered periodically */
  syncInterval: [number, number]
  /** per-edge traversal speed in field units / second */
  signalSpeed: [number, number]
  /** idle movement: how fast the field slowly drifts and reorganizes */
  drift: number
  /** how strongly the pointer tilts the whole field */
  interactionTilt: number
  /** base node size in WORLD UNITS (the billboard is 1 world unit) */
  nodeSize: number
  /** size multiplier for the brighter / active nodes */
  nodeActiveSize: number
  /** gentle per-node breathing: 0..1 fraction of node size, phase-offset */
  nodePulse: number
  /** short dendrite stubs that make every node read as a neuron */
  dendrites: { perNode: number; length: number; ratio: number }
  /** traveling signal particle size (world units) */
  signalSize: number
  /** how fast spark energy fades from nodes */
  sparkDecay: number
  /** how many nodes are "active-capable" (subtle blue by default) */
  accentRatio: number
  /** per internal link: how many nodes of a cluster are woven together */
  weave: number
  /** max distance (field units) for a local weave link */
  weaveDist: number
  /** human-brain shaping of the surrounding field */
  brain: {
    /** cerebral hemisphere half-extents in design units: width, height, length */
    ax: number
    ay: number
    az: number
    /** sagittal interhemispheric fissure parameters */
    fissureWidth: number
    fissureDepth: number
    /** cortical folding (gyri/sulci) */
    gyriFreq: number
    gyriAmp: number
    /** cerebellum — fraction of nodes placed there plus its position + size */
    cerebellum: { frac: number; y: number; z: number; rx: number; ry: number; rz: number }
    /** brain stem — vertical neural conduit projecting downward */
    stem: { frac: number; y: number; z: number; r: number; len: number }
  }
}

export const NEURAL_CONFIG: NeuralConfig = {
  tiers: {
    1: { nodes: 100, edges: 110, connectomeNodes: 1500, connectomeFilaments: 3200, signals: 4, stars: 100 },
    2: { nodes: 210, edges: 240, connectomeNodes: 3000, connectomeFilaments: 6400, signals: 8, stars: 160 },
    3: { nodes: 340, edges: 400, connectomeNodes: 4800, connectomeFilaments: 10200, signals: 12, stars: 220 },
  },
  clusters: 8,
  coreRadius: 0.55,
  innerCutoff: 0.38,
  outerR: 2.15,
  breathing: { amp: 0.035, period: 12.5 },
  syncInterval: [8, 14],
  signalSpeed: [0.9, 1.5],
  drift: 0.08,
  interactionTilt: 0.065,
  nodeSize: 0.052,
  nodeActiveSize: 1.5,
  nodePulse: 0.16,
  dendrites: { perNode: 3, length: 0.16, ratio: 0.9 },
  signalSize: 0.052,
  sparkDecay: 2.2,
  accentRatio: 0.22,
  weave: 4,
  weaveDist: 0.75,
  brain: {
    ax: 0.86,
    ay: 0.72,
    az: 1.15,
    fissureWidth: 0.075,
    fissureDepth: 0.36,
    gyriFreq: 8.0,
    gyriAmp: 0.085,
    cerebellum: { frac: 0.12, y: -0.48, z: -0.72, rx: 0.52, ry: 0.28, rz: 0.38 },
    stem: { frac: 0.05, y: -0.68, z: -0.26, r: 0.15, len: 0.42 },
  },
}

export function tierFor(spec: Spec): NeuralTier {
  if (spec.particles <= 42) return 1
  if (spec.particles <= 72) return 2
  return 3
}

export function neuralBudget(spec: Spec): NeuralTierBudget {
  return NEURAL_CONFIG.tiers[tierFor(spec)]
}

/** Total neural connectome nodes rendered — used by the CoreStatus readout. */
export function networkNodeCount(spec: Spec): number {
  return neuralBudget(spec).connectomeNodes
}

/**
 * Per-chapter feel of the field. The story runs HUMAN → AI: `phase` drives
 * the morph between the organic human network (0) and the structured
 * machine network (1). `r` expands the envelope, `op/edgeOp` brighten it,
 * `sway` is the organic idle motion (fades out as the net regularizes).
 */
export interface FieldState {
  r: number
  op: number
  edgeOp: number
  phase: number
  sway: number
}

export const FIELD_STATES: Record<string, FieldState> = {
  mind: { r: 1.0, op: 0.68, edgeOp: 0.5, phase: 0, sway: 1.0 },
  idea: { r: 1.06, op: 0.88, edgeOp: 0.6, phase: 0.05, sway: 1.0 },
  transfer: { r: 1.14, op: 1.0, edgeOp: 0.72, phase: 0.5, sway: 0.5 },
  ai: { r: 1.2, op: 1.05, edgeOp: 0.9, phase: 1, sway: 0.05 },
  execution: { r: 1.16, op: 1.06, edgeOp: 0.94, phase: 1, sway: 0 },
  work: { r: 1.24, op: 1.0, edgeOp: 0.86, phase: 1, sway: 0 },
  experiments: { r: 1.2, op: 0.98, edgeOp: 0.82, phase: 1, sway: 0 },
  about: { r: 1.1, op: 0.9, edgeOp: 0.7, phase: 0.85, sway: 0.15 },
  contact: { r: 0.98, op: 0.86, edgeOp: 0.66, phase: 0.6, sway: 0.3 },
}
import type { Product } from './payload'

// ── Types ────────────────────────────────────────────────────────────────────

export type ProductType = 'ac' | 'heat-pump'

export type RoomSize = 'sub-25' | '25-35' | '35-50' | '50-70'

export type Distribution = 'pardoseala' | 'radiatoare'
export type BuildingSize = 'mica' | 'medie' | 'mare'
export type Phase = 'mono' | 'tri'

export type Priority =
  | 'efficiency'
  | 'silent'
  | 'air-quality'
  | 'design'
  | 'value'

export interface WizardAnswers {
  productType: ProductType
  // AC path
  roomSize?: RoomSize
  // Heat pump path
  distribution?: Distribution
  buildingSize?: BuildingSize
  phase?: Phase
  // Common
  priorities: Priority[]
}

export interface ScoredProduct {
  product: Product
  score: number
  matchReasons: string[]
}

// ── Capacity mapping ─────────────────────────────────────────────────────────

const ROOM_SIZE_KW: Record<RoomSize, { ideal: number; min: number; max: number }> = {
  'sub-25': { ideal: 2.5, min: 2.0, max: 3.5 },
  '25-35': { ideal: 3.5, min: 2.5, max: 5.0 },
  '35-50': { ideal: 5.0, min: 3.5, max: 7.0 },
  '50-70': { ideal: 7.0, min: 5.0, max: 10.0 },
}

const BUILDING_SIZE_KW: Record<BuildingSize, { ideal: number; min: number; max: number }> = {
  mica: { ideal: 6, min: 4, max: 10 },
  medie: { ideal: 10, min: 6, max: 16 },
  mare: { ideal: 16, min: 10, max: 25 },
}

// ── Priority weights ─────────────────────────────────────────────────────────

interface Weights {
  efficiency: number
  noise: number
  features: number
  series: number
  value: number
}

const BASE_WEIGHTS: Weights = {
  efficiency: 1,
  noise: 1,
  features: 1,
  series: 1,
  value: 1,
}

function getWeights(priorities: Priority[]): Weights {
  const w = { ...BASE_WEIGHTS }
  for (const p of priorities) {
    switch (p) {
      case 'efficiency':
        w.efficiency = 3
        break
      case 'silent':
        w.noise = 3
        break
      case 'air-quality':
        w.features = 3
        break
      case 'design':
        w.series = 3
        break
      case 'value':
        w.value = 3
        break
    }
  }
  return w
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseKw(val: string | null | undefined): number | null {
  if (!val) return null
  const match = val.match(/([\d.]+)\s*kW/i)
  if (match) return parseFloat(match[1])
  const num = parseFloat(val)
  return isNaN(num) ? null : num
}

function parseDb(val: string | null | undefined): number | null {
  if (!val) return null
  const match = val.match(/([\d.]+)\s*dB/i)
  if (match) return parseFloat(match[1])
  const num = parseFloat(val)
  return isNaN(num) ? null : num
}

function parseNumeric(val: string | null | undefined): number | null {
  if (!val) return null
  const num = parseFloat(val)
  return isNaN(num) ? null : num
}

const ENERGY_CLASS_SCORE: Record<string, number> = {
  'A+++': 10,
  'A++': 8,
  'A+': 6,
  'A': 4,
  'B': 2,
  'C': 1,
  'D': 0,
}

function energyScore(cls: string | null | undefined): number {
  if (!cls) return 3
  return ENERGY_CLASS_SCORE[cls] ?? 3
}

// ── Scoring ──────────────────────────────────────────────────────────────────

function scoreCapacityMatch(
  product: Product,
  target: { ideal: number; min: number; max: number },
): { score: number; reason: string | null } {
  const kw = parseKw(product.capacity) ?? parseKw(product.coolingCapacityNominal) ?? parseKw(product.heatingCapacityNominal)
  if (kw === null) return { score: 15, reason: null }

  if (kw >= target.min && kw <= target.max) {
    const distance = Math.abs(kw - target.ideal) / target.ideal
    const s = Math.round(35 * (1 - distance * 0.5))
    return {
      score: Math.max(20, s),
      reason: `Capacitate ${kw} kW — potrivită pentru spațiul ales`,
    }
  }

  // Outside range but close
  const distance = kw < target.min
    ? (target.min - kw) / target.ideal
    : (kw - target.max) / target.ideal
  const s = Math.max(5, Math.round(35 * (1 - distance)))
  return { score: s, reason: null }
}

function scoreEfficiency(product: Product, type: ProductType, weight: number): { score: number; reason: string | null } {
  let effValue: number | null = null
  let label = ''

  if (type === 'ac') {
    effValue = parseNumeric(product.seer)
    label = `SEER ${product.seer}`
  } else {
    effValue = parseNumeric(product.scop) ?? parseNumeric(product.scopAt35)
    label = product.scop ? `SCOP ${product.scop}` : product.scopAt35 ? `SCOP @35° ${product.scopAt35}` : ''
  }

  if (effValue === null) return { score: 0, reason: null }

  // Normalize: SEER 4-8 range, SCOP 3-5.5 range
  const min = type === 'ac' ? 4 : 3
  const max = type === 'ac' ? 8 : 5.5
  const normalized = Math.min(1, Math.max(0, (effValue - min) / (max - min)))
  const s = Math.round(normalized * 30 * weight / 3)

  const energyClass = type === 'ac' ? product.energyClassCooling : product.energyClassHeating
  const eScore = energyScore(energyClass) / 10 * 10 * weight / 3

  const total = Math.round(s + eScore)
  const reason = weight >= 2 && effValue > (min + max) / 2
    ? `Eficiență ridicată: ${label}, clasă ${energyClass || 'N/A'}`
    : null

  return { score: total, reason }
}

function scoreNoise(product: Product, type: ProductType, weight: number): { score: number; reason: string | null } {
  let db: number | null = null

  if (type === 'ac') {
    db = parseDb(product.indoorNoiseMax)
    // Try the quiet level from noiseLevels (last value is usually the quietest)
    if (db === null && product.indoorNoiseLevels) {
      const parts = product.indoorNoiseLevels.split('/').map((s) => parseDb(s.trim()))
      const valid = parts.filter((v): v is number => v !== null)
      if (valid.length) db = Math.min(...valid)
    }
  } else {
    db = parseDb(product.soundPowerLevel) ?? parseDb(product.outdoorNoiseMax)
  }

  if (db === null) return { score: 0, reason: null }

  // Lower is better. AC indoor: 18-55 range, Heat pump: 40-70 range
  const min = type === 'ac' ? 18 : 40
  const max = type === 'ac' ? 55 : 70
  const normalized = 1 - Math.min(1, Math.max(0, (db - min) / (max - min)))
  const s = Math.round(normalized * 25 * weight / 3)

  const reason = weight >= 2 && normalized > 0.5
    ? `Funcționare silențioasă: ${db} dB`
    : null

  return { score: s, reason }
}

function scoreFeatures(product: Product, weight: number): { score: number; reason: string | null } {
  const highlights = product.featureHighlights?.toLowerCase() || ''
  if (!highlights) return { score: 0, reason: null }

  const keywords = ['uv-c', 'uvc', 'humi', 'ifd', 'wifi', 'wi-fi', 'antibacterian', 'purificare', 'ionizare']
  const matched = keywords.filter((k) => highlights.includes(k))
  const normalized = Math.min(1, matched.length / 3)
  const s = Math.round(normalized * 20 * weight / 3)

  const reason = weight >= 2 && matched.length >= 2
    ? `Tehnologii avansate: ${matched.slice(0, 3).join(', ').toUpperCase()}`
    : null

  return { score: s, reason }
}

function scoreSeries(product: Product, weight: number): { score: number; reason: string | null } {
  const series = product.series?.toLowerCase() || ''
  const premiumSeries = ['pearl premium', 'pearl plus', 'expert']
  const isPremium = premiumSeries.some((s) => series.includes(s))

  if (isPremium) {
    const s = Math.round(15 * weight / 3)
    const reason = weight >= 2 ? `Modelul ${product.series} — design premium` : null
    return { score: s, reason }
  }

  return { score: Math.round(5 * weight / 3), reason: null }
}

function scoreValue(product: Product, type: ProductType, weight: number): { score: number; reason: string | null } {
  // Value = good efficiency at lower capacity (better price-performance ratio)
  const eff = type === 'ac' ? parseNumeric(product.seer) : parseNumeric(product.scop)
  const kw = parseKw(product.capacity)

  if (eff === null || kw === null) return { score: 0, reason: null }

  // Lower capacity + decent efficiency = better value
  const kwNorm = 1 - Math.min(1, kw / 10)
  const effNorm = type === 'ac'
    ? Math.min(1, Math.max(0, (eff - 4) / 4))
    : Math.min(1, Math.max(0, (eff - 3) / 2.5))
  const combined = (kwNorm * 0.4 + effNorm * 0.6)
  const s = Math.round(combined * 15 * weight / 3)

  const reason = weight >= 2 && combined > 0.5
    ? `Raport calitate-preț excelent`
    : null

  return { score: s, reason }
}

// ── Main scoring function ────────────────────────────────────────────────────

export function scoreProducts(products: Product[], answers: WizardAnswers): ScoredProduct[] {
  const weights = getWeights(answers.priorities)

  // 1. Filter by product type
  let filtered = products.filter((p) => {
    if (answers.productType === 'ac') {
      return !p.productType || p.productType === 'ac'
    }
    return p.productType === 'heat-pump'
  })

  // 2. Filter heat pumps by phase if specified
  if (answers.productType === 'heat-pump' && answers.phase) {
    const phaseLabel = answers.phase === 'mono' ? 'mono' : 'tri'
    filtered = filtered.filter((p) => {
      if (!p.phase && !p.powerSupply) return true
      const phaseLower = (p.phase || p.powerSupply || '').toLowerCase()
      if (answers.phase === 'tri') return phaseLower.includes('tri') || phaseLower.includes('400')
      return !phaseLower.includes('tri') && !phaseLower.includes('400')
    })
  }

  // 3. Determine capacity target
  const capacityTarget = answers.productType === 'ac' && answers.roomSize
    ? ROOM_SIZE_KW[answers.roomSize]
    : answers.productType === 'heat-pump' && answers.buildingSize
      ? BUILDING_SIZE_KW[answers.buildingSize]
      : { ideal: 5, min: 2, max: 10 }

  // 4. Score each product
  const scored: ScoredProduct[] = filtered.map((product) => {
    const reasons: string[] = []

    const cap = scoreCapacityMatch(product, capacityTarget)
    if (cap.reason) reasons.push(cap.reason)

    const eff = scoreEfficiency(product, answers.productType, weights.efficiency)
    if (eff.reason) reasons.push(eff.reason)

    const noise = scoreNoise(product, answers.productType, weights.noise)
    if (noise.reason) reasons.push(noise.reason)

    const feat = scoreFeatures(product, weights.features)
    if (feat.reason) reasons.push(feat.reason)

    const series = scoreSeries(product, weights.series)
    if (series.reason) reasons.push(series.reason)

    const value = scoreValue(product, answers.productType, weights.value)
    if (value.reason) reasons.push(value.reason)

    const rawScore = cap.score + eff.score + noise.score + feat.score + series.score + value.score
    const score = Math.min(99, Math.max(10, rawScore))

    // Ensure at least one reason
    if (reasons.length === 0) {
      if (product.series) reasons.push(`Modelul ${product.series}`)
      if (product.capacity) reasons.push(`Capacitate ${product.capacity}`)
    }

    return { product, score, matchReasons: reasons.slice(0, 3) }
  })

  // 5. Sort by score descending
  scored.sort((a, b) => b.score - a.score)

  // 6. Return top 5
  return scored.slice(0, 5)
}

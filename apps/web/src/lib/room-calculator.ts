import type { Product } from './payload'

// ── Types ────────────────────────────────────────────────────────────────────

export type SpaceType =
  | 'apartament'
  | 'casa'
  | 'fitness'
  | 'restaurant'
  | 'magazin'
  | 'pensiune'

export type Orientation = 'N' | 'S' | 'E' | 'V'
export type InsulationLevel = 'slaba' | 'medie' | 'buna'
export type WindowSize = 'mica' | 'medie' | 'mare'
export type RoomPreset = 'living' | 'dormitor' | 'bucatarie' | 'birou' | 'sala' | 'receptie' | 'custom'

export interface RoomConfig {
  id: string
  name: string
  preset: RoomPreset
  length: number // meters
  width: number // meters
  ceilingHeight: number // meters
  windows: number
  windowSize: WindowSize
  exteriorDoors: number
  orientation: Orientation
  insulation: InsulationLevel
}

export interface ConfigState {
  spaceType: SpaceType
  rooms: RoomConfig[]
  activeRoomId: string
}

export interface RoomThermalResult {
  roomId: string
  roomName: string
  area: number
  volume: number
  thermalLoadW: number
  requiredKw: number
}

export interface ThermalResult {
  rooms: RoomThermalResult[]
  totalArea: number
  totalVolume: number
  totalThermalLoadW: number
  totalRequiredKw: number
}

export interface ScoredProduct {
  product: Product
  score: number
  matchReasons: string[]
  coveragePercent: number
}

// ── Constants ────────────────────────────────────────────────────────────────

const BASE_LOAD_PER_M2 = 100 // W/m² base thermal load

const CEILING_FACTOR = 0.35 // extra W per m² per cm above 2.5m

const WINDOW_LOAD: Record<WindowSize, number> = {
  mica: 150, // W per window
  medie: 250,
  mare: 400,
}

const DOOR_LOAD = 100 // W per exterior door

const ORIENTATION_FACTOR: Record<Orientation, number> = {
  S: 1.15,
  V: 1.10,
  E: 1.05,
  N: 0.90,
}

const INSULATION_FACTOR: Record<InsulationLevel, number> = {
  slaba: 1.30,
  medie: 1.00,
  buna: 0.80,
}

const SPACE_TYPE_FACTOR: Record<SpaceType, number> = {
  apartament: 1.00,
  casa: 1.05,
  fitness: 1.30, // high body heat, ventilation needs
  restaurant: 1.25, // cooking heat, many people
  magazin: 1.15, // door openings, foot traffic
  pensiune: 1.05,
}

// ── Presets ───────────────────────────────────────────────────────────────────

export const SPACE_PRESETS: Record<SpaceType, Partial<RoomConfig>> = {
  apartament: { ceilingHeight: 2.7, windows: 2, windowSize: 'medie', exteriorDoors: 0, insulation: 'medie', orientation: 'S' },
  casa: { ceilingHeight: 2.7, windows: 2, windowSize: 'medie', exteriorDoors: 1, insulation: 'medie', orientation: 'S' },
  fitness: { ceilingHeight: 3.0, windows: 3, windowSize: 'mare', exteriorDoors: 1, insulation: 'medie', orientation: 'E' },
  restaurant: { ceilingHeight: 3.0, windows: 2, windowSize: 'mare', exteriorDoors: 1, insulation: 'medie', orientation: 'S' },
  magazin: { ceilingHeight: 3.0, windows: 2, windowSize: 'mare', exteriorDoors: 1, insulation: 'medie', orientation: 'S' },
  pensiune: { ceilingHeight: 2.7, windows: 1, windowSize: 'medie', exteriorDoors: 0, insulation: 'medie', orientation: 'S' },
}

export const ROOM_PRESETS: Record<RoomPreset, { name: string; defaultLength: number; defaultWidth: number }> = {
  living: { name: 'Living', defaultLength: 6, defaultWidth: 5 },
  dormitor: { name: 'Dormitor', defaultLength: 4, defaultWidth: 4 },
  bucatarie: { name: 'Bucătărie', defaultLength: 4, defaultWidth: 3 },
  birou: { name: 'Birou', defaultLength: 4, defaultWidth: 3 },
  sala: { name: 'Sală principală', defaultLength: 10, defaultWidth: 8 },
  receptie: { name: 'Recepție', defaultLength: 5, defaultWidth: 4 },
  custom: { name: 'Cameră', defaultLength: 5, defaultWidth: 4 },
}

export function getDefaultRoomsForSpace(spaceType: SpaceType): RoomConfig[] {
  const preset = SPACE_PRESETS[spaceType]

  switch (spaceType) {
    case 'apartament':
      return [createRoom('living', preset), createRoom('dormitor', preset)]
    case 'casa':
      return [createRoom('living', preset), createRoom('dormitor', preset), createRoom('bucatarie', preset)]
    case 'fitness':
      return [createRoom('sala', { ...preset, windows: 4 })]
    case 'restaurant':
      return [createRoom('sala', { ...preset, windows: 3 }), createRoom('bucatarie', { ...preset, windows: 1, windowSize: 'mica' })]
    case 'magazin':
      return [createRoom('sala', { ...preset, windows: 3 })]
    case 'pensiune':
      return [createRoom('dormitor', preset), createRoom('dormitor', preset), createRoom('receptie', preset)]
    default:
      return [createRoom('custom', preset)]
  }
}

let roomCounter = 0
export function createRoom(preset: RoomPreset, overrides: Partial<RoomConfig> = {}): RoomConfig {
  roomCounter++
  const p = ROOM_PRESETS[preset]
  return {
    id: `room-${roomCounter}-${Date.now()}`,
    name: p.name,
    preset,
    length: p.defaultLength,
    width: p.defaultWidth,
    ceilingHeight: 2.7,
    windows: 2,
    windowSize: 'medie',
    exteriorDoors: 0,
    orientation: 'S',
    insulation: 'medie',
    ...overrides,
  }
}

// ── Thermal calculation ──────────────────────────────────────────────────────

export function calculateRoomThermalLoad(room: RoomConfig, spaceType: SpaceType): RoomThermalResult {
  const area = room.length * room.width
  const volume = area * room.ceilingHeight

  // Base load
  let load = area * BASE_LOAD_PER_M2

  // Ceiling height adjustment (above 2.5m)
  if (room.ceilingHeight > 2.5) {
    const extraCm = (room.ceilingHeight - 2.5) * 100
    load += area * CEILING_FACTOR * extraCm
  }

  // Windows
  load += room.windows * WINDOW_LOAD[room.windowSize]

  // Exterior doors
  load += room.exteriorDoors * DOOR_LOAD

  // Orientation
  load *= ORIENTATION_FACTOR[room.orientation]

  // Insulation
  load *= INSULATION_FACTOR[room.insulation]

  // Space type factor
  load *= SPACE_TYPE_FACTOR[spaceType]

  const thermalLoadW = Math.round(load)
  const requiredKw = Math.round(thermalLoadW / 100) / 10 // round to 0.1 kW

  return {
    roomId: room.id,
    roomName: room.name,
    area: Math.round(area * 10) / 10,
    volume: Math.round(volume * 10) / 10,
    thermalLoadW,
    requiredKw,
  }
}

export function calculateTotalThermal(rooms: RoomConfig[], spaceType: SpaceType): ThermalResult {
  const roomResults = rooms.map((r) => calculateRoomThermalLoad(r, spaceType))

  return {
    rooms: roomResults,
    totalArea: Math.round(roomResults.reduce((s, r) => s + r.area, 0) * 10) / 10,
    totalVolume: Math.round(roomResults.reduce((s, r) => s + r.volume, 0) * 10) / 10,
    totalThermalLoadW: roomResults.reduce((s, r) => s + r.thermalLoadW, 0),
    totalRequiredKw: Math.round(roomResults.reduce((s, r) => s + r.requiredKw, 0) * 10) / 10,
  }
}

// ── Product scoring ──────────────────────────────────────────────────────────

function parseKw(val: string | null | undefined): number | null {
  if (!val) return null
  const match = val.match(/([\d.]+)\s*kW/i)
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
  'A+++': 10, 'A++': 8, 'A+': 6, 'A': 4, 'B': 2, 'C': 1, 'D': 0,
}

export function scoreProductsForRoom(
  products: Product[],
  requiredKw: number,
  spaceType: SpaceType,
): ScoredProduct[] {
  // Filter to AC products only (room-level solutions)
  const acProducts = products.filter((p) => !p.productType || p.productType === 'ac')

  const scored: ScoredProduct[] = acProducts.map((product) => {
    const reasons: string[] = []
    let totalScore = 0

    // 1. Capacity match (max 40 pts)
    const kw = parseKw(product.capacity) ?? parseKw(product.coolingCapacityNominal)
    if (kw !== null) {
      const ratio = kw / requiredKw
      const coveragePercent = Math.min(100, Math.round(ratio * 100))

      if (ratio >= 0.8 && ratio <= 1.3) {
        // Good fit
        const distance = Math.abs(1 - ratio)
        totalScore += Math.round(40 * (1 - distance * 2))
        reasons.push(`Capacitate ${kw} kW — potrivire excelentă pentru ${requiredKw} kW necesar`)
      } else if (ratio >= 0.6 && ratio <= 1.5) {
        totalScore += 20
        reasons.push(`Capacitate ${kw} kW — acoperă parțial nevoia de ${requiredKw} kW`)
      } else {
        totalScore += 5
      }

      // 2. Efficiency (max 25 pts)
      const seer = parseNumeric(product.seer)
      if (seer) {
        const effNorm = Math.min(1, Math.max(0, (seer - 4) / 4))
        totalScore += Math.round(effNorm * 25)
        if (seer >= 6) reasons.push(`Eficiență ridicată: SEER ${seer}`)
      }

      // 3. Energy class (max 10 pts)
      const energyClass = product.energyClassCooling
      if (energyClass) {
        totalScore += ENERGY_CLASS_SCORE[energyClass] ?? 3
        if (energyClass === 'A+++' || energyClass === 'A++') {
          reasons.push(`Clasă energetică ${energyClass}`)
        }
      }

      // 4. Space-type specific bonuses (max 15 pts)
      const features = (product.featureHighlights || '').toLowerCase()
      if (spaceType === 'fitness' || spaceType === 'restaurant') {
        // Air quality matters
        if (features.includes('uv-c') || features.includes('uvc')) {
          totalScore += 10
          reasons.push('Sterilizare UV-C — ideal pentru spații cu public')
        }
        if (features.includes('ifd') || features.includes('purificare')) {
          totalScore += 5
          reasons.push('Filtrare avansată IFD')
        }
      }
      if (spaceType === 'pensiune' || spaceType === 'apartament') {
        // Noise matters
        const noiseStr = product.indoorNoiseLevels || product.indoorNoiseMax
        if (noiseStr) {
          const match = noiseStr.match(/([\d.]+)\s*dB/i)
          const minNoise = match ? parseFloat(match[1]) : null
          if (minNoise && minNoise <= 22) {
            totalScore += 10
            reasons.push(`Ultra-silențios: ${minNoise} dB — perfect pentru oaspeți`)
          }
        }
      }

      // 5. Series premium bonus (max 10 pts)
      const series = (product.series || '').toLowerCase()
      if (series.includes('pearl premium') || series.includes('pearl plus')) {
        totalScore += 10
        if (!reasons.some((r) => r.includes('Serie'))) {
          reasons.push(`Seria ${product.series} — design premium`)
        }
      }

      const finalScore = Math.min(99, Math.max(10, totalScore))

      return {
        product,
        score: finalScore,
        matchReasons: reasons.slice(0, 3),
        coveragePercent,
      }
    }

    return {
      product,
      score: 10,
      matchReasons: [product.series ? `Seria ${product.series}` : 'Produs Haier'],
      coveragePercent: 0,
    }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 5)
}

export function scoreProductsForTotal(
  products: Product[],
  totalKw: number,
  spaceType: SpaceType,
): ScoredProduct[] {
  // For larger spaces, also consider heat pumps
  const allProducts = products

  const scored: ScoredProduct[] = allProducts.map((product) => {
    const reasons: string[] = []
    let totalScore = 0

    const isHeatPump = product.productType === 'heat-pump'
    const kw = parseKw(product.capacity)
      ?? parseKw(isHeatPump ? product.heatingCapacityNominal : product.coolingCapacityNominal)

    if (kw !== null) {
      const ratio = kw / totalKw
      const coveragePercent = Math.min(100, Math.round(ratio * 100))

      if (ratio >= 0.7 && ratio <= 1.4) {
        const distance = Math.abs(1 - ratio)
        totalScore += Math.round(40 * (1 - distance * 2))
        reasons.push(`Capacitate ${kw} kW — acoperă ${coveragePercent}% din nevoia totală`)
      } else if (ratio >= 0.5) {
        totalScore += 20
      } else {
        totalScore += 5
      }

      // Efficiency
      const eff = isHeatPump
        ? parseNumeric(product.scop) ?? parseNumeric(product.scopAt35)
        : parseNumeric(product.seer)
      if (eff) {
        const min = isHeatPump ? 3 : 4
        const max = isHeatPump ? 5.5 : 8
        const effNorm = Math.min(1, Math.max(0, (eff - min) / (max - min)))
        totalScore += Math.round(effNorm * 25)
        if (effNorm > 0.5) {
          reasons.push(`Eficiență ${isHeatPump ? 'SCOP' : 'SEER'} ${eff}`)
        }
      }

      // Energy class
      const energyClass = isHeatPump ? product.energyClassHeating : product.energyClassCooling
      if (energyClass) {
        totalScore += ENERGY_CLASS_SCORE[energyClass] ?? 3
        if (energyClass === 'A+++' || energyClass === 'A++') {
          reasons.push(`Clasă energetică ${energyClass}`)
        }
      }

      // Space bonuses
      const features = (product.featureHighlights || '').toLowerCase()
      if (spaceType === 'fitness' || spaceType === 'restaurant') {
        if (features.includes('uv-c') || features.includes('uvc')) {
          totalScore += 8
          reasons.push('Sterilizare UV-C')
        }
      }

      // Heat pump bonus for casa/pensiune (they need heating too)
      if (isHeatPump && (spaceType === 'casa' || spaceType === 'pensiune')) {
        totalScore += 10
        reasons.push('Soluție completă: încălzire + răcire + ACM')
      }

      const finalScore = Math.min(99, Math.max(10, totalScore))

      return {
        product,
        score: finalScore,
        matchReasons: reasons.slice(0, 3),
        coveragePercent,
      }
    }

    return {
      product,
      score: 10,
      matchReasons: [product.series ? `Seria ${product.series}` : 'Produs Haier'],
      coveragePercent: 0,
    }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 6)
}

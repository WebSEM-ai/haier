// ── Types ────────────────────────────────────────────────────────────────────

export type SystemType = 'ac' | 'gas-boiler' | 'electric' | 'wood-pellet' | 'other' | 'none'
export type SystemAge = '<5' | '5-10' | '10-15' | '>15'
export type ConsumptionMode = 'bill' | 'estimate'

export interface CurrentSystem {
  type: SystemType
  age?: SystemAge
}

export interface BillConsumption {
  mode: 'bill'
  monthlyBillElectric: number   // lei/lună — factura de electricitate (climatizare)
  monthlyBillGas?: number       // lei/lună — factura de gaz (doar centrală gaz)
  electricityPrice: number      // lei/kWh
  gasPrice: number              // lei/kWh
}

export interface EstimateConsumption {
  mode: 'estimate'
  area: number               // m²
  hoursPerDay: number        // ore/zi
  monthsCooling: number      // luni/an răcire
  monthsHeating: number      // luni/an încălzire
}

export type ConsumptionData = BillConsumption | EstimateConsumption

export interface SavingsInput {
  currentSystem: CurrentSystem
  consumption: ConsumptionData
  haierProduct: {
    seer: number
    scop: number
    coolingCapacity: number   // kW
    heatingCapacity: number   // kW
    capacityKw: number        // kW nominal
    series?: string           // seria produsului (pt estimare investiție)
  }
}

export interface SavingsResult {
  oldAnnualKwh: number
  newAnnualKwh: number
  oldAnnualCost: number
  newAnnualCost: number
  annualSaving: number
  oldMonthlyCost: number
  newMonthlyCost: number
  co2Old: number             // kg/an
  co2New: number             // kg/an
  co2Saved: number           // kg/an
  treesEquivalent: number
  carKmEquivalent: number
  estimatedInvestment: number
  paybackYears: number
  tenYearSaving: number
  isComparison: boolean      // false dacă "Fără sistem"
}

// ── Constants România ────────────────────────────────────────────────────────

export const DEFAULTS = {
  electricityPrice: 1.40,     // lei/kWh (preț reglementat 2026)
  gasPrice: 0.37,             // lei/kWh (preț piață post-plafonare Q2 2026)
  coolingHours: 600,          // ore echivalente full-load/an — răcire
  heatingHours: 1500,         // ore echivalente full-load/an — încălzire
  co2Electricity: 0.236,      // kg CO2/kWh (mix energetic RO)
  co2Gas: 0.244,              // kg CO2/kWh (gaz natural, inclusiv upstream)
  treeCo2PerYear: 22,         // kg CO2 absorbit/an/copac matur
  carCo2PerKm: 0.12,          // kg CO2/km autoturism mediu
  investmentPerKw: 1500,      // lei/kW (fallback generic)
  energyPriceGrowth: 0.04,   // 4%/an — creștere estimată preț energie
} as const

// SEER/EER estimat pentru AC vechi, în funcție de vârstă
const OLD_AC_SEER: Record<SystemAge, number> = {
  '<5': 5.5,
  '5-10': 4.0,
  '10-15': 3.0,
  '>15': 2.5,
}

const OLD_AC_COP: Record<SystemAge, number> = {
  '<5': 4.0,
  '5-10': 3.0,
  '10-15': 2.3,
  '>15': 1.8,
}

// Randament termic centrală gaz
const GAS_BOILER_EFFICIENCY: Record<SystemAge, number> = {
  '<5': 0.93,
  '5-10': 0.90,
  '10-15': 0.84,
  '>15': 0.70,
}

// W/m² pentru estimare capacitate din suprafață
const WATTS_PER_SQM = 100

// SEER presupus pentru AC-ul de răcire al utilizatorilor cu centrală gaz
const ASSUMED_COOLING_SEER = 3.0

// ── Investiție per serie ─────────────────────────────────────────────────────

const INVESTMENT_PER_KW: Record<string, number> = {
  'flexis plus': 2200,
  'flexis': 2000,
  'pearl premium': 2000,
  'pearl plus': 1800,
  'pearl': 1500,
  'tundra plus': 1700,
  'tundra': 1600,
  'revive plus mono': 1400,
  'revive plus': 1400,
  'revive': 1200,
  'tide plus': 1200,
  'tide': 1100,
}

function getInvestmentPerKw(series?: string): number {
  if (!series) return DEFAULTS.investmentPerKw
  const key = series.toLowerCase().trim()
  if (INVESTMENT_PER_KW[key]) return INVESTMENT_PER_KW[key]
  for (const [k, v] of Object.entries(INVESTMENT_PER_KW)) {
    if (key.includes(k) || k.includes(key)) return v
  }
  return DEFAULTS.investmentPerKw
}

// ── Thermal demand (cererea termică utilă) ───────────────────────────────────

interface ThermalDemand {
  coolingKwh: number  // kWh termici utili — răcire
  heatingKwh: number  // kWh termici utili — încălzire
}

/**
 * Calculează cererea termică și consumul vechi.
 * Conceptul cheie: aceeași cerere termică se păstrează și pt sistemul nou,
 * doar eficiența se schimbă → comparație corectă.
 */
function getOldSystemData(
  system: CurrentSystem,
  consumption: ConsumptionData,
  haierCapacityKw: number,
): { thermalDemand: ThermalDemand; electricKwh: number; gasKwh: number } {
  const age = system.age || '<5'

  // ── Mod factură ──────────────────────────────────────────────────────
  if (consumption.mode === 'bill') {
    switch (system.type) {
      case 'ac': {
        const annualKwh = (consumption.monthlyBillElectric / consumption.electricityPrice) * 12
        const seer = OLD_AC_SEER[age]
        const cop = OLD_AC_COP[age]
        // Proporție consum răcire/încălzire din ore echivalente standard
        const coolingRatio = DEFAULTS.coolingHours / (DEFAULTS.coolingHours + DEFAULTS.heatingHours)
        const coolingConsumed = annualKwh * coolingRatio
        const heatingConsumed = annualKwh * (1 - coolingRatio)
        return {
          thermalDemand: {
            coolingKwh: coolingConsumed * seer,
            heatingKwh: heatingConsumed * cop,
          },
          electricKwh: annualKwh,
          gasKwh: 0,
        }
      }
      case 'gas-boiler': {
        // Facturi separate: gaz (încălzire) + electricitate (răcire, dacă există)
        const gasAnnualKwh = consumption.monthlyBillGas
          ? (consumption.monthlyBillGas / consumption.gasPrice) * 12
          : 0
        const electricAnnualKwh = (consumption.monthlyBillElectric / consumption.electricityPrice) * 12
        const efficiency = GAS_BOILER_EFFICIENCY[age]
        return {
          thermalDemand: {
            coolingKwh: electricAnnualKwh * ASSUMED_COOLING_SEER,
            heatingKwh: gasAnnualKwh * efficiency,
          },
          electricKwh: electricAnnualKwh,
          gasKwh: gasAnnualKwh,
        }
      }
      case 'electric': {
        // COP = 1.0 pentru încălzire rezistivă (radiatoare, convectoare)
        const annualKwh = (consumption.monthlyBillElectric / consumption.electricityPrice) * 12
        const coolingRatio = DEFAULTS.coolingHours / (DEFAULTS.coolingHours + DEFAULTS.heatingHours)
        return {
          thermalDemand: {
            coolingKwh: annualKwh * coolingRatio,
            heatingKwh: annualKwh * (1 - coolingRatio),
          },
          electricKwh: annualKwh,
          gasKwh: 0,
        }
      }
      case 'wood-pellet':
      case 'other': {
        // Tratăm similar cu electric — COP ~1.0 pt sisteme neeficiente
        const annualKwh = (consumption.monthlyBillElectric / consumption.electricityPrice) * 12
        const coolingRatio = DEFAULTS.coolingHours / (DEFAULTS.coolingHours + DEFAULTS.heatingHours)
        return {
          thermalDemand: {
            coolingKwh: annualKwh * coolingRatio,
            heatingKwh: annualKwh * (1 - coolingRatio),
          },
          electricKwh: annualKwh,
          gasKwh: 0,
        }
      }
      case 'none':
        return { thermalDemand: { coolingKwh: 0, heatingKwh: 0 }, electricKwh: 0, gasKwh: 0 }
    }
  }

  // ── Mod estimare ─────────────────────────────────────────────────────
  const estimatedCapacity = (consumption.area * WATTS_PER_SQM) / 1000
  const capacity = Math.max(estimatedCapacity, haierCapacityKw)
  const coolingHours = consumption.hoursPerDay * consumption.monthsCooling * 30
  const heatingHours = consumption.hoursPerDay * consumption.monthsHeating * 30

  const thermalDemand: ThermalDemand = {
    coolingKwh: capacity * coolingHours,
    heatingKwh: capacity * heatingHours,
  }

  switch (system.type) {
    case 'ac': {
      const seer = OLD_AC_SEER[age]
      const cop = OLD_AC_COP[age]
      return {
        thermalDemand,
        electricKwh: thermalDemand.coolingKwh / seer + thermalDemand.heatingKwh / cop,
        gasKwh: 0,
      }
    }
    case 'gas-boiler': {
      const efficiency = GAS_BOILER_EFFICIENCY[age]
      return {
        thermalDemand,
        electricKwh: 0,
        gasKwh: thermalDemand.heatingKwh / efficiency,
      }
    }
    case 'electric':
    case 'wood-pellet':
    case 'other':
      // COP = 1.0 → consumul electric = cererea termică
      return {
        thermalDemand,
        electricKwh: thermalDemand.coolingKwh + thermalDemand.heatingKwh,
        gasKwh: 0,
      }
    case 'none':
      return { thermalDemand, electricKwh: 0, gasKwh: 0 }
  }
}

/**
 * Consumul Haier: aceeași cerere termică, eficiență superioară
 */
function getNewConsumption(
  thermalDemand: ThermalDemand,
  seer: number,
  scop: number,
): number {
  return (thermalDemand.coolingKwh / seer) + (thermalDemand.heatingKwh / scop)
}

// ── Main calculation ─────────────────────────────────────────────────────────

export function calculateSavings(input: SavingsInput): SavingsResult {
  const { currentSystem, consumption, haierProduct } = input
  const isComparison = currentSystem.type !== 'none'

  const electricityPrice = consumption.mode === 'bill'
    ? consumption.electricityPrice
    : DEFAULTS.electricityPrice
  const gasPrice = consumption.mode === 'bill'
    ? consumption.gasPrice
    : DEFAULTS.gasPrice

  // ─ Sistem vechi ────────────────────────────────────────────────────
  const old = getOldSystemData(currentSystem, consumption, haierProduct.capacityKw)
  const oldAnnualKwh = old.electricKwh + old.gasKwh
  const oldAnnualCost = (old.electricKwh * electricityPrice) + (old.gasKwh * gasPrice)

  // ─ Sistem nou (Haier) ─────────────────────────────────────────────
  let newAnnualKwh: number

  if (isComparison) {
    // Aceeași cerere termică → doar eficiența se schimbă
    newAnnualKwh = getNewConsumption(old.thermalDemand, haierProduct.seer, haierProduct.scop)
  } else {
    // Fără sistem vechi → estimăm consumul Haier din capacitate + ore
    const coolingHours = consumption.mode === 'estimate'
      ? consumption.hoursPerDay * consumption.monthsCooling * 30
      : DEFAULTS.coolingHours
    const heatingHours = consumption.mode === 'estimate'
      ? consumption.hoursPerDay * consumption.monthsHeating * 30
      : DEFAULTS.heatingHours

    newAnnualKwh = getNewConsumption(
      {
        coolingKwh: haierProduct.coolingCapacity * coolingHours,
        heatingKwh: haierProduct.heatingCapacity * heatingHours,
      },
      haierProduct.seer,
      haierProduct.scop,
    )
  }

  const newAnnualCost = newAnnualKwh * electricityPrice

  // ─ Economii ───────────────────────────────────────────────────────
  const annualSaving = isComparison ? oldAnnualCost - newAnnualCost : 0

  // ─ CO₂ ────────────────────────────────────────────────────────────
  const co2Old = (old.electricKwh * DEFAULTS.co2Electricity) + (old.gasKwh * DEFAULTS.co2Gas)
  const co2New = newAnnualKwh * DEFAULTS.co2Electricity
  const co2Saved = isComparison ? co2Old - co2New : 0

  // ─ Investiție & amortizare ────────────────────────────────────────
  const investmentPerKw = getInvestmentPerKw(haierProduct.series)
  const estimatedInvestment = haierProduct.capacityKw * investmentPerKw
  const paybackYears = annualSaving > 0 ? estimatedInvestment / annualSaving : 0

  // ─ Economie 10 ani (cu creștere preț energie 4%/an) ──────────────
  const g = DEFAULTS.energyPriceGrowth
  let tenYearSaving = 0
  for (let y = 0; y < 10; y++) {
    tenYearSaving += annualSaving * Math.pow(1 + g, y)
  }

  return {
    oldAnnualKwh: Math.round(oldAnnualKwh),
    newAnnualKwh: Math.round(newAnnualKwh),
    oldAnnualCost: Math.round(oldAnnualCost),
    newAnnualCost: Math.round(newAnnualCost),
    annualSaving: Math.round(annualSaving),
    oldMonthlyCost: Math.round(oldAnnualCost / 12),
    newMonthlyCost: Math.round(newAnnualCost / 12),
    co2Old: Math.round(co2Old),
    co2New: Math.round(co2New),
    co2Saved: Math.round(co2Saved),
    treesEquivalent: co2Saved > 0 ? Math.round(co2Saved / DEFAULTS.treeCo2PerYear) : 0,
    carKmEquivalent: co2Saved > 0 ? Math.round(co2Saved / DEFAULTS.carCo2PerKm) : 0,
    estimatedInvestment: Math.round(estimatedInvestment),
    paybackYears: annualSaving > 0 ? Math.round(paybackYears * 10) / 10 : 0,
    tenYearSaving: Math.round(tenYearSaving),
    isComparison,
  }
}

// ── Validare luni ────────────────────────────────────────────────────────────

export function validateMonths(cooling: number, heating: number): string | null {
  if (cooling + heating > 12) {
    return `Lunile de răcire (${cooling}) + încălzire (${heating}) depășesc 12 luni/an`
  }
  return null
}

// ── Parse product helpers ────────────────────────────────────────────────────

export function parseCapacity(capacityStr: string | null | undefined): number {
  if (!capacityStr) return 3.5
  const match = capacityStr.match(/([\d.]+)\s*kW/i)
  return match ? parseFloat(match[1]) : 3.5
}

export function parseNumeric(val: string | null | undefined): number {
  if (!val) return 0
  const match = val.match(/([\d.]+)/)
  return match ? parseFloat(match[1]) : 0
}

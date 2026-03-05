// ── Types ────────────────────────────────────────────────────────────────────

export type SystemType = 'ac' | 'gas-boiler' | 'electric' | 'none'
export type SystemAge = '<5' | '5-10' | '10-15' | '>15'
export type ConsumptionMode = 'bill' | 'estimate'

export interface CurrentSystem {
  type: SystemType
  age?: SystemAge
}

export interface BillConsumption {
  mode: 'bill'
  monthlyBill: number        // lei/lună
  electricityPrice: number   // lei/kWh
  gasPrice: number           // lei/kWh (doar pt centrală gaz)
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
    capacityKw: number        // kW nominal (for investment estimate)
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
  electricityPrice: 1.40,     // lei/kWh post-liberalizare
  gasPrice: 0.31,             // lei/kWh (plafonat până mar 2026)
  coolingHours: 600,          // ore echivalente full-load/an
  heatingHours: 1500,         // ore echivalente full-load/an
  co2Electricity: 0.236,      // kg CO2/kWh (grid RO)
  co2Gas: 0.244,              // kg CO2/kWh (inclusiv upstream)
  treeCo2PerYear: 22,         // kg CO2 absorbit/an/copac
  carCo2PerKm: 0.12,          // kg CO2/km auto mediu
  investmentPerKw: 1500,      // lei/kW (medie piață)
} as const

// SEER estimat pentru AC vechi
const OLD_AC_SEER: Record<SystemAge, number> = {
  '<5': 5.5,
  '5-10': 4.0,
  '10-15': 3.0,
  '>15': 2.5,
}

// COP estimat pentru AC vechi (aprox SEER * 0.75)
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

// W/m² for estimating capacity from area
const WATTS_PER_SQM = 100

// ── Helpers ──────────────────────────────────────────────────────────────────

function getOldSystemConsumption(
  system: CurrentSystem,
  consumption: ConsumptionData,
  haierCapacityKw: number,
): { electricKwh: number; gasKwh: number } {
  if (consumption.mode === 'bill') {
    if (system.type === 'gas-boiler') {
      // Split: assume 30% electric (AC cooling if any) + 70% gas heating
      const totalElectricKwh = (consumption.monthlyBill * 0.3 / consumption.electricityPrice) * 12
      const totalGasKwh = (consumption.monthlyBill * 0.7 / consumption.gasPrice) * 12
      return { electricKwh: totalElectricKwh, gasKwh: totalGasKwh }
    }
    // Pure electric system
    const annualKwh = (consumption.monthlyBill / consumption.electricityPrice) * 12
    return { electricKwh: annualKwh, gasKwh: 0 }
  }

  // Estimate mode
  const estimatedCapacity = (consumption.area * WATTS_PER_SQM) / 1000
  const capacity = Math.max(estimatedCapacity, haierCapacityKw)
  const dailyHours = consumption.hoursPerDay

  const coolingHours = dailyHours * consumption.monthsCooling * 30
  const heatingHours = dailyHours * consumption.monthsHeating * 30
  const age = system.age || '<5'

  switch (system.type) {
    case 'ac': {
      const seer = OLD_AC_SEER[age]
      const cop = OLD_AC_COP[age]
      const coolingKwh = (capacity * coolingHours) / seer
      const heatingKwh = (capacity * heatingHours) / cop
      return { electricKwh: coolingKwh + heatingKwh, gasKwh: 0 }
    }
    case 'gas-boiler': {
      const efficiency = GAS_BOILER_EFFICIENCY[age]
      const gasKwh = (capacity * heatingHours) / efficiency
      return { electricKwh: 0, gasKwh }
    }
    case 'electric': {
      const totalKwh = capacity * (coolingHours + heatingHours)
      return { electricKwh: totalKwh, gasKwh: 0 }
    }
    case 'none':
      return { electricKwh: 0, gasKwh: 0 }
  }
}

function getNewSystemConsumption(
  consumption: ConsumptionData,
  seer: number,
  scop: number,
  coolingCap: number,
  heatingCap: number,
): number {
  if (consumption.mode === 'bill') {
    // Use default hours for Haier calculation
    const coolingKwh = (coolingCap * DEFAULTS.coolingHours) / seer
    const heatingKwh = (heatingCap * DEFAULTS.heatingHours) / scop
    return coolingKwh + heatingKwh
  }

  const dailyHours = consumption.hoursPerDay
  const coolingHours = dailyHours * consumption.monthsCooling * 30
  const heatingHours = dailyHours * consumption.monthsHeating * 30

  const coolingKwh = (coolingCap * coolingHours) / seer
  const heatingKwh = (heatingCap * heatingHours) / scop
  return coolingKwh + heatingKwh
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

  // Old system
  const old = getOldSystemConsumption(currentSystem, consumption, haierProduct.capacityKw)
  const oldAnnualKwh = old.electricKwh + old.gasKwh
  const oldAnnualCost = (old.electricKwh * electricityPrice) + (old.gasKwh * gasPrice)

  // New system (Haier — always electric)
  const newAnnualKwh = getNewSystemConsumption(
    consumption,
    haierProduct.seer,
    haierProduct.scop,
    haierProduct.coolingCapacity,
    haierProduct.heatingCapacity,
  )
  const newAnnualCost = newAnnualKwh * electricityPrice

  // Savings
  const annualSaving = isComparison ? oldAnnualCost - newAnnualCost : 0

  // CO2
  const co2Old = (old.electricKwh * DEFAULTS.co2Electricity) + (old.gasKwh * DEFAULTS.co2Gas)
  const co2New = newAnnualKwh * DEFAULTS.co2Electricity
  const co2Saved = isComparison ? co2Old - co2New : 0

  // Investment & payback
  const estimatedInvestment = haierProduct.capacityKw * DEFAULTS.investmentPerKw
  const paybackYears = annualSaving > 0 ? estimatedInvestment / annualSaving : 0

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
    tenYearSaving: Math.round(annualSaving * 10),
    isComparison,
  }
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

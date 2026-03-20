'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { ProductCard } from './ProductCard'
import type { Product } from '@/lib/payload'
import type { ScoredProduct } from '@/lib/recommendation'

interface CategoryProductGridProps {
  products: Product[]
  advisorResults?: ScoredProduct[] | null
  activeCategory?: string
}

type SortKey = 'recommended' | 'capacity-asc' | 'efficiency'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'recommended', label: 'Recomandate' },
  { value: 'capacity-asc', label: 'Putere crescătoare' },
  { value: 'efficiency', label: 'Eficiență maximă' },
]

function getRoomLabel(capacity: string): string {
  const kw = parseFloat(capacity)
  if (kw <= 2.5) return `${capacity} · ~25 m²`
  if (kw <= 3.5) return `${capacity} · ~35 m²`
  if (kw <= 5.0) return `${capacity} · ~50 m²`
  if (kw <= 7.1) return `${capacity} · ~70 m²`
  return `${capacity} · ~${Math.round(kw * 10)} m²`
}

function parseDbValue(val: string | null | undefined): number | null {
  if (!val) return null
  const match = val.match(/([\d.]+)/)
  if (match) return parseFloat(match[1])
  return null
}

function getNoiseCategory(db: number): string {
  if (db < 30) return 'silent'
  if (db <= 45) return 'moderate'
  return 'normal'
}

const NOISE_LABELS: Record<string, string> = {
  silent: 'Silențios (< 30 dB)',
  moderate: 'Moderat (30–45 dB)',
  normal: 'Normal (> 45 dB)',
}

// ── FilterDropdown ──────────────────────────────────────────────────────────

function FilterDropdown({
  label,
  options,
  active,
  onSelect,
  renderLabel,
}: {
  label: string
  options: string[]
  active: string | null
  onSelect: (value: string | null) => void
  renderLabel?: (value: string) => string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [open])

  const displayLabel = active ? (renderLabel ? renderLabel(active) : active) : label

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
          active
            ? 'border-sky-200 bg-sky-50 text-sky-700'
            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
        }`}
      >
        {displayLabel}
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 min-w-[180px] rounded-xl border border-gray-100 bg-white p-1 shadow-lg">
          <button
            onClick={() => { onSelect(null); setOpen(false) }}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              active === null ? 'bg-sky-50 font-medium text-sky-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Toate
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onSelect(opt); setOpen(false) }}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                active === opt ? 'bg-sky-50 font-medium text-sky-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {renderLabel ? renderLabel(opt) : opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── FilterChip ──────────────────────────────────────────────────────────────

function FilterChip({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm text-sky-700">
      {label}
      <button
        onClick={onRemove}
        className="rounded-full p-0.5 transition-colors hover:bg-sky-100"
        aria-label={`Elimină filtrul ${label}`}
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
}

// ── CategoryProductGrid ─────────────────────────────────────────────────────

export function CategoryProductGrid({ products, advisorResults, activeCategory }: CategoryProductGridProps) {
  const [activeSeries, setActiveSeries] = useState<string | null>(null)
  const [activeEnergy, setActiveEnergy] = useState<string | null>(null)
  const [activeCapacity, setActiveCapacity] = useState<string | null>(null)
  const [activeCompressor, setActiveCompressor] = useState<string | null>(null)
  const [activeNoise, setActiveNoise] = useState<string | null>(null)
  const [activePhase, setActivePhase] = useState<string | null>(null)
  const [activeEnergyHeating, setActiveEnergyHeating] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortKey>('recommended')

  // Determine context
  const hasHeatPumps = products.some((p) => p.productType === 'heat-pump' || p.categorySlug === 'pompe-caldura')
  const isPumpCategory = activeCategory === 'pompe-caldura'

  // Extract unique filter values
  const seriesOptions = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => { if (p.series) set.add(p.series) })
    return Array.from(set).sort()
  }, [products])

  const energyOptions = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => { if (p.energyClassCooling) set.add(p.energyClassCooling) })
    const order = ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D']
    return Array.from(set).sort((a, b) => order.indexOf(a) - order.indexOf(b))
  }, [products])

  const capacityOptions = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => { if (p.capacity) set.add(p.capacity) })
    return Array.from(set).sort((a, b) => parseFloat(a) - parseFloat(b))
  }, [products])

  const compressorOptions = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => { if (p.compressorType) set.add(p.compressorType) })
    return Array.from(set).sort()
  }, [products])

  const noiseOptions = useMemo(() => {
    const categories = new Set<string>()
    products.forEach((p) => {
      const db = parseDbValue(p.indoorNoiseMax)
      if (db !== null) categories.add(getNoiseCategory(db))
    })
    return ['silent', 'moderate', 'normal'].filter((c) => categories.has(c))
  }, [products])

  const phaseOptions = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => { if (p.phase) set.add(p.phase) })
    return Array.from(set).sort()
  }, [products])

  const energyHeatingOptions = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => { if (p.energyClassHeating) set.add(p.energyClassHeating) })
    const order = ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D']
    return Array.from(set).sort((a, b) => order.indexOf(a) - order.indexOf(b))
  }, [products])

  const isAdvisorActive = !!(advisorResults && advisorResults.length > 0)

  const advisorProducts = useMemo(() => {
    if (!advisorResults || advisorResults.length === 0) return []
    const advisorProductIds = new Set(advisorResults.map((r) => r.product.id))
    const matched = products.filter((p) => advisorProductIds.has(p.id))
    matched.sort((a, b) => {
      const scoreA = advisorResults.find((r) => r.product.id === a.id)?.score ?? 0
      const scoreB = advisorResults.find((r) => r.product.id === b.id)?.score ?? 0
      return scoreB - scoreA
    })
    return matched
  }, [products, advisorResults])

  // Filter + sort
  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (activeSeries && p.series !== activeSeries) return false
      if (activeEnergy && p.energyClassCooling !== activeEnergy) return false
      if (activeCapacity && p.capacity !== activeCapacity) return false
      if (activeCompressor && p.compressorType !== activeCompressor) return false
      if (activeNoise) {
        const db = parseDbValue(p.indoorNoiseMax)
        if (db === null || getNoiseCategory(db) !== activeNoise) return false
      }
      if (activePhase && p.phase !== activePhase) return false
      if (activeEnergyHeating && p.energyClassHeating !== activeEnergyHeating) return false
      return true
    })

    switch (sortBy) {
      case 'capacity-asc':
        result = [...result].sort(
          (a, b) => parseFloat(a.capacity || '0') - parseFloat(b.capacity || '0')
        )
        break
      case 'efficiency':
        result = [...result].sort(
          (a, b) => parseFloat(b.seer || '0') - parseFloat(a.seer || '0')
        )
        break
      default:
        result = [...result].sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return (a.order || 0) - (b.order || 0)
        })
    }

    return result
  }, [products, activeSeries, activeEnergy, activeCapacity, activeCompressor, activeNoise, activePhase, activeEnergyHeating, sortBy])

  const activeFilters: { label: string; onRemove: () => void }[] = []
  if (activeSeries) activeFilters.push({ label: activeSeries, onRemove: () => setActiveSeries(null) })
  if (activeCapacity) activeFilters.push({ label: getRoomLabel(activeCapacity), onRemove: () => setActiveCapacity(null) })
  if (activeEnergy) activeFilters.push({ label: `Răcire: ${activeEnergy}`, onRemove: () => setActiveEnergy(null) })
  if (activeCompressor) activeFilters.push({ label: activeCompressor, onRemove: () => setActiveCompressor(null) })
  if (activeNoise) activeFilters.push({ label: NOISE_LABELS[activeNoise], onRemove: () => setActiveNoise(null) })
  if (activePhase) activeFilters.push({ label: activePhase, onRemove: () => setActivePhase(null) })
  if (activeEnergyHeating) activeFilters.push({ label: `Încălzire: ${activeEnergyHeating}`, onRemove: () => setActiveEnergyHeating(null) })

  const clearAll = useCallback(() => {
    setActiveSeries(null)
    setActiveEnergy(null)
    setActiveCapacity(null)
    setActiveCompressor(null)
    setActiveNoise(null)
    setActivePhase(null)
    setActiveEnergyHeating(null)
    setSortBy('recommended')
  }, [])

  if (isAdvisorActive) {
    return (
      <div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {advisorProducts.map((product, index) => {
            const scored = advisorResults!.find((r) => r.product.id === product.id)
            return (
              <div key={product.id} className="relative">
                {scored && scored.matchReasons.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {scored.matchReasons.map((reason, i) => (
                      <span key={i} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
                        {reason}
                      </span>
                    ))}
                  </div>
                )}
                <ProductCard product={product} index={index} />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* Dropdowns row */}
        <div className="flex flex-wrap items-center gap-2">
          {capacityOptions.length > 1 && (
            <FilterDropdown
              label="Suprafață"
              options={capacityOptions}
              active={activeCapacity}
              onSelect={setActiveCapacity}
              renderLabel={getRoomLabel}
            />
          )}

          {seriesOptions.length > 1 && (
            <FilterDropdown
              label="Serie"
              options={seriesOptions}
              active={activeSeries}
              onSelect={setActiveSeries}
            />
          )}

          {energyOptions.length > 1 && (
            <FilterDropdown
              label="Clasă energ. răcire"
              options={energyOptions}
              active={activeEnergy}
              onSelect={setActiveEnergy}
            />
          )}

          {/* New filters */}
          {compressorOptions.length > 1 && (
            <FilterDropdown
              label="Tip compresor"
              options={compressorOptions}
              active={activeCompressor}
              onSelect={setActiveCompressor}
            />
          )}

          {noiseOptions.length > 1 && (
            <FilterDropdown
              label="Nivel zgomot"
              options={noiseOptions}
              active={activeNoise}
              onSelect={setActiveNoise}
              renderLabel={(v) => NOISE_LABELS[v] || v}
            />
          )}

          {/* Contextual filters — phase for heat pumps */}
          {(isPumpCategory || hasHeatPumps) && phaseOptions.length > 1 && (
            <FilterDropdown
              label="Fază"
              options={phaseOptions}
              active={activePhase}
              onSelect={setActivePhase}
            />
          )}

          {/* Contextual — energy class heating for heat pumps or mixed */}
          {(isPumpCategory || hasHeatPumps) && energyHeatingOptions.length > 1 && (
            <FilterDropdown
              label="Clasă energ. încălzire"
              options={energyHeatingOptions}
              active={activeEnergyHeating}
              onSelect={setActiveEnergyHeating}
            />
          )}

          {/* Sort + reset pushed right */}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs font-medium text-gray-400">
                Sortare:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="rounded-lg border-0 bg-gray-50 py-1.5 pl-3 pr-8 text-sm font-medium text-gray-700 ring-1 ring-gray-200 focus:ring-2 focus:ring-sky-500"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {activeFilters.length > 0 && (
              <button
                onClick={clearAll}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
                aria-label="Resetează filtrele"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Active chips row */}
        {activeFilters.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
            {activeFilters.map((f) => (
              <FilterChip key={f.label} label={f.label} onRemove={f.onRemove} />
            ))}
            <span className="ml-auto text-sm text-gray-400">
              {filtered.length} {filtered.length === 1 ? 'produs' : 'produse'}
            </span>
          </div>
        )}
      </div>

      {/* Results count (when no filters active) */}
      {activeFilters.length === 0 && (
        <p className="mb-6 text-sm text-gray-500">
          {filtered.length} {filtered.length === 1 ? 'produs' : 'produse'}
        </p>
      )}

      {/* Product grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-gray-50 py-16 text-center">
          <p className="text-gray-500">
            Niciun produs nu corespunde filtrelor selectate.
          </p>
          <button
            onClick={clearAll}
            className="mt-3 text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            Resetează filtrele
          </button>
        </div>
      )}
    </div>
  )
}

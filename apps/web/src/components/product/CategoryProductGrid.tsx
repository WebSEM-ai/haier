'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { ProductCard } from './ProductCard'

interface Product {
  id: number
  title: string
  slug: string
  modelCode: string
  categorySlug?: string | null
  mainImageFilename?: string | null
  shortDescription?: string | null
  energyClassCooling?: string | null
  series?: string | null
  capacity?: string | null
  seer?: string | null
  featured?: boolean
  order?: number
}

interface CategoryProductGridProps {
  products: Product[]
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

export function CategoryProductGrid({ products }: CategoryProductGridProps) {
  const [activeSeries, setActiveSeries] = useState<string | null>(null)
  const [activeEnergy, setActiveEnergy] = useState<string | null>(null)
  const [activeCapacity, setActiveCapacity] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortKey>('recommended')

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

  // Filter + sort
  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (activeSeries && p.series !== activeSeries) return false
      if (activeEnergy && p.energyClassCooling !== activeEnergy) return false
      if (activeCapacity && p.capacity !== activeCapacity) return false
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
  }, [products, activeSeries, activeEnergy, activeCapacity, sortBy])

  const activeFilters: { label: string; onRemove: () => void }[] = []
  if (activeSeries) activeFilters.push({ label: activeSeries, onRemove: () => setActiveSeries(null) })
  if (activeCapacity) activeFilters.push({ label: getRoomLabel(activeCapacity), onRemove: () => setActiveCapacity(null) })
  if (activeEnergy) activeFilters.push({ label: activeEnergy, onRemove: () => setActiveEnergy(null) })

  const clearAll = useCallback(() => {
    setActiveSeries(null)
    setActiveEnergy(null)
    setActiveCapacity(null)
    setSortBy('recommended')
  }, [])

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
              label="Clasă energ."
              options={energyOptions}
              active={activeEnergy}
              onSelect={setActiveEnergy}
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

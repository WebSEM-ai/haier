'use client'

import { useState, useMemo } from 'react'
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

  const activeFilterCount = [activeSeries, activeEnergy, activeCapacity].filter(Boolean).length

  const clearAll = () => {
    setActiveSeries(null)
    setActiveEnergy(null)
    setActiveCapacity(null)
    setSortBy('recommended')
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 rounded-2xl bg-gray-50 p-5">
        {/* Header row */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
              Filtrează produse
            </h3>
            {activeFilterCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-600 px-1.5 text-xs font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs font-medium text-gray-400">
                Sortare:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="rounded-lg border-0 bg-white py-1.5 pl-3 pr-8 text-sm font-medium text-gray-700 ring-1 ring-gray-200 focus:ring-2 focus:ring-sky-500"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAll}
                className="text-sm font-medium text-sky-600 hover:text-sky-700"
              >
                Resetează
              </button>
            )}
          </div>
        </div>

        {/* Filter groups */}
        <div className="space-y-3">
          {/* Room size / Capacity — most useful for customers */}
          {capacityOptions.length > 1 && (
            <FilterGroup
              label="Suprafață cameră"
              options={capacityOptions}
              active={activeCapacity}
              onSelect={setActiveCapacity}
              renderLabel={getRoomLabel}
            />
          )}

          {/* Series */}
          {seriesOptions.length > 1 && (
            <FilterGroup
              label="Serie"
              options={seriesOptions}
              active={activeSeries}
              onSelect={setActiveSeries}
            />
          )}

          {/* Energy class */}
          {energyOptions.length > 1 && (
            <FilterGroup
              label="Clasă energetică"
              options={energyOptions}
              active={activeEnergy}
              onSelect={setActiveEnergy}
              variant="energy"
            />
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="mb-6 text-sm text-gray-500">
        {filtered.length} {filtered.length === 1 ? 'produs' : 'produse'}
        {activeFilterCount > 0 ? ' (filtrate)' : ''}
      </p>

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

function FilterGroup({
  label,
  options,
  active,
  onSelect,
  variant,
  renderLabel,
}: {
  label: string
  options: string[]
  active: string | null
  onSelect: (value: string | null) => void
  variant?: 'energy'
  renderLabel?: (value: string) => string
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-medium text-gray-500">{label}:</span>
      <button
        onClick={() => onSelect(null)}
        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
          active === null
            ? 'bg-sky-600 text-white shadow-sm'
            : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-gray-300'
        }`}
      >
        Toate
      </button>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(active === opt ? null : opt)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
            active === opt
              ? variant === 'energy'
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-sky-600 text-white shadow-sm'
              : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-gray-300'
          }`}
        >
          {renderLabel ? renderLabel(opt) : opt}
        </button>
      ))}
    </div>
  )
}

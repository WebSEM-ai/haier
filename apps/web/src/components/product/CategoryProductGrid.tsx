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
}

interface CategoryProductGridProps {
  products: Product[]
}

export function CategoryProductGrid({ products }: CategoryProductGridProps) {
  const [activeSeries, setActiveSeries] = useState<string | null>(null)
  const [activeEnergy, setActiveEnergy] = useState<string | null>(null)
  const [activeCapacity, setActiveCapacity] = useState<string | null>(null)

  // Extract unique filter values from products
  const seriesOptions = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => {
      if (p.series) set.add(p.series)
    })
    return Array.from(set).sort()
  }, [products])

  const energyOptions = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => {
      if (p.energyClassCooling) set.add(p.energyClassCooling)
    })
    const order = ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D']
    return Array.from(set).sort((a, b) => order.indexOf(a) - order.indexOf(b))
  }, [products])

  const capacityOptions = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => {
      if (p.capacity) set.add(p.capacity)
    })
    return Array.from(set).sort((a, b) => {
      const numA = parseFloat(a)
      const numB = parseFloat(b)
      return numA - numB
    })
  }, [products])

  // Apply filters
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeSeries && p.series !== activeSeries) return false
      if (activeEnergy && p.energyClassCooling !== activeEnergy) return false
      if (activeCapacity && p.capacity !== activeCapacity) return false
      return true
    })
  }, [products, activeSeries, activeEnergy, activeCapacity])

  const hasActiveFilters = activeSeries || activeEnergy || activeCapacity

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 space-y-4 rounded-2xl bg-gray-50 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
            Filtrează produse
          </h3>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setActiveSeries(null)
                setActiveEnergy(null)
                setActiveCapacity(null)
              }}
              className="text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              Resetează filtrele
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {/* Series filter */}
          {seriesOptions.length > 1 && (
            <FilterGroup
              label="Serie"
              options={seriesOptions}
              active={activeSeries}
              onSelect={setActiveSeries}
            />
          )}

          {/* Energy class filter */}
          {energyOptions.length > 1 && (
            <FilterGroup
              label="Clasă energetică"
              options={energyOptions}
              active={activeEnergy}
              onSelect={setActiveEnergy}
              variant="energy"
            />
          )}

          {/* Capacity filter */}
          {capacityOptions.length > 1 && (
            <FilterGroup
              label="Capacitate"
              options={capacityOptions}
              active={activeCapacity}
              onSelect={setActiveCapacity}
            />
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="mb-6 text-sm text-gray-500">
        {filtered.length} {filtered.length === 1 ? 'produs' : 'produse'}
        {hasActiveFilters ? ' (filtrate)' : ''}
      </p>

      {/* Product grid — 4 columns */}
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
            onClick={() => {
              setActiveSeries(null)
              setActiveEnergy(null)
              setActiveCapacity(null)
            }}
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
}: {
  label: string
  options: string[]
  active: string | null
  onSelect: (value: string | null) => void
  variant?: 'energy'
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">{label}:</span>
      <div className="flex flex-wrap gap-1.5">
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
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

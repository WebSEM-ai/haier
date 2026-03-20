'use client'

import { useState, useMemo, useCallback } from 'react'
import { CategoryProductGrid } from './CategoryProductGrid'
import { ProductAdvisor } from './ProductAdvisor'
import type { Product } from '@/lib/payload'
import type { ScoredProduct } from '@/lib/recommendation'

interface CategoryTab {
  key: string
  label: string
  icon: React.ReactNode
}

const CATEGORY_TABS: CategoryTab[] = [
  {
    key: 'all',
    label: 'Toate produsele',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    key: 'climatizare',
    label: 'Climatizare',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    key: 'pompe-caldura',
    label: 'Pompe de căldură',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
      </svg>
    ),
  },
]

function isHeatPump(p: Product): boolean {
  return p.productType === 'heat-pump' || p.categorySlug === 'pompe-caldura'
}

function isAC(p: Product): boolean {
  return (p.productType === 'ac' || !p.productType) && !isHeatPump(p)
}

interface AllProductsGridProps {
  products: Product[]
}

export function AllProductsGrid({ products }: AllProductsGridProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [advisorResults, setAdvisorResults] = useState<ScoredProduct[] | null>(null)

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products
    if (activeCategory === 'pompe-caldura') return products.filter(isHeatPump)
    if (activeCategory === 'climatizare') return products.filter(isAC)
    return products.filter((p) => p.categorySlug === activeCategory)
  }, [products, activeCategory])

  const tabCount = useCallback(
    (key: string) => {
      if (key === 'all') return products.length
      if (key === 'pompe-caldura') return products.filter(isHeatPump).length
      if (key === 'climatizare') return products.filter(isAC).length
      return products.filter((p) => p.categorySlug === key).length
    },
    [products],
  )

  const handleAdvisorResults = useCallback((scored: ScoredProduct[]) => {
    setAdvisorResults(scored)
  }, [])

  const handleAdvisorReset = useCallback(() => {
    setAdvisorResults(null)
  }, [])

  return (
    <div>
      {/* Product Advisor */}
      <ProductAdvisor
        products={products}
        onResults={handleAdvisorResults}
        onReset={handleAdvisorReset}
      />

      {/* Advisor results banner */}
      {advisorResults && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50 to-white px-5 py-3">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-sky-800">
              {advisorResults.length} produse recomandate pentru tine
            </p>
          </div>
          <button
            onClick={handleAdvisorReset}
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            Resetează
          </button>
        </div>
      )}

      {/* Category tabs — hide when advisor active */}
      {!advisorResults && (
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.key
            const count = tabCount(tab.key)
            return (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className={isActive ? 'text-sky-400' : 'text-gray-400'}>{tab.icon}</span>
                {tab.label}
                <span
                  className={`ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Existing filter + grid */}
      <CategoryProductGrid
        products={filteredProducts}
        advisorResults={advisorResults}
        activeCategory={activeCategory}
      />
    </div>
  )
}

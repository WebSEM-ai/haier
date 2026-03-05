'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { R2_PUBLIC_URL } from '@/lib/constants'
import { parseCapacity, parseNumeric } from '@/lib/savings'
import type { Product } from '@/lib/payload'

interface StepHaierProductProps {
  products: Product[]
  onSelect: (product: Product) => void
}

export function StepHaierProduct({ products, onSelect }: StepHaierProductProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const selectedProduct = products.find((p) => p.id === selectedId) ?? null

  const imageUrl = selectedProduct?.mainImageFilename
    ? `${R2_PUBLIC_URL}/${selectedProduct.mainImageFilename}`
    : null

  function handleCalculate() {
    if (selectedProduct) {
      onSelect(selectedProduct)
    }
  }

  return (
    <div className="mx-auto max-w-xl text-center">
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white sm:text-3xl">
        Cu ce produs Haier înlocuiești?
      </h2>
      <p className="mt-3 text-gray-400">
        Selectează produsul Haier pentru a calcula economiile
      </p>

      {/* Product dropdown */}
      <div className="mt-8">
        <select
          value={selectedId ?? ''}
          onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : null)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
        >
          <option value="" className="bg-gray-900">
            Alege un produs...
          </option>
          {products.map((p) => (
            <option key={p.id} value={p.id} className="bg-gray-900">
              {p.title}
              {p.capacity ? ` — ${p.capacity}` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Product preview card */}
      {selectedProduct && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="flex items-center gap-5">
            {imageUrl && (
              <div className="flex-shrink-0 overflow-hidden rounded-xl bg-white/5 p-3">
                <Image
                  src={imageUrl}
                  alt={selectedProduct.title}
                  width={100}
                  height={100}
                  className="h-20 w-20 object-contain"
                />
              </div>
            )}
            <div className="min-w-0 flex-1 text-left">
              <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-white">
                {selectedProduct.title}
              </h3>
              {selectedProduct.series && (
                <p className="mt-0.5 text-xs text-sky-400">{selectedProduct.series}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedProduct.seer && (
                  <span className="inline-flex items-center rounded-lg bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-400 ring-1 ring-sky-500/20">
                    SEER {parseNumeric(selectedProduct.seer)}
                  </span>
                )}
                {selectedProduct.scop && (
                  <span className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                    SCOP {parseNumeric(selectedProduct.scop)}
                  </span>
                )}
                {selectedProduct.energyClassCooling && (
                  <span className="inline-flex items-center rounded-lg bg-green-500/10 px-2.5 py-1 text-[11px] font-semibold text-green-400 ring-1 ring-green-500/20">
                    {selectedProduct.energyClassCooling}
                  </span>
                )}
                {selectedProduct.capacity && (
                  <span className="inline-flex items-center rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-gray-400 ring-1 ring-white/10">
                    {selectedProduct.capacity}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Link to recommendation wizard */}
      <p className="mt-6 text-sm text-gray-500">
        Nu știi ce produs?{' '}
        <Link href="/oferta-personalizata" className="text-sky-400 transition-colors hover:text-sky-300">
          Încearcă Oferta personalizată →
        </Link>
      </p>

      {/* Submit */}
      <button
        onClick={handleCalculate}
        disabled={!selectedProduct}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-sky-600 px-8 py-3 font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-sky-600/25 transition-all hover:bg-sky-500 hover:shadow-sky-500/30 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Calculează economiile
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      </button>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { InquiryDialog } from '@/components/product/InquiryDialog'
import { R2_PUBLIC_URL } from '@/lib/constants'
import type { ScoredProduct } from '@/lib/recommendation'

interface ResultsProps {
  results: ScoredProduct[]
  onReset: () => void
}

function AnimatedScore({ target }: { target: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 1200
    const startTime = performance.now()

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      start = Math.round(eased * target)
      setCount(start)
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [target])

  return <>{count}</>
}

export function Results({ results, onReset }: ResultsProps) {
  if (results.length === 0) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-display text-2xl font-bold text-white">
            Nu am găsit rezultate
          </h2>
          <p className="mt-3 text-gray-400">
            Încearcă să modifici criteriile de căutare
          </p>
          <button
            onClick={onReset}
            className="mt-6 rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            Reîncepe
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Recomandările tale
        </h2>
        <p className="mt-3 text-gray-400">
          Am analizat {results.length} produse și le-am clasat în funcție de criteriile tale
        </p>
      </motion.div>

      {/* Product cards */}
      <div className="space-y-4">
        {results.map((item, index) => {
          const imageUrl = item.product.mainImageFilename
            ? `${R2_PUBLIC_URL}/${item.product.mainImageFilename}`
            : null
          const isBest = index === 0

          return (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, type: 'spring', stiffness: 100 }}
              className={`relative overflow-hidden rounded-2xl border backdrop-blur-sm ${
                isBest
                  ? 'border-sky-500/30 bg-sky-500/5 shadow-[0_0_40px_rgba(14,165,233,0.08)]'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              {isBest && (
                <div className="absolute left-0 top-0 rounded-br-xl bg-sky-600 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                  Cea mai bună potrivire
                </div>
              )}

              <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
                {/* Image */}
                <div className="flex shrink-0 items-center justify-center sm:w-40">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.product.title}
                      width={160}
                      height={120}
                      className="h-auto max-h-[120px] w-auto object-contain"
                    />
                  ) : (
                    <div className="flex h-24 w-32 items-center justify-center rounded-lg bg-white/5">
                      <svg className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start gap-3">
                    <h3 className="font-display text-lg font-bold text-white">
                      {item.product.title}
                    </h3>
                    {/* Score */}
                    <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${
                      isBest ? 'bg-sky-500/20 text-sky-400' : 'bg-white/10 text-gray-300'
                    }`}>
                      <AnimatedScore target={item.score} />%
                    </div>
                  </div>

                  {/* Specs badges */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.product.capacity && (
                      <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-gray-400 ring-1 ring-white/10">
                        {item.product.capacity}
                      </span>
                    )}
                    {item.product.energyClassCooling && (
                      <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400 ring-1 ring-green-500/20">
                        {item.product.energyClassCooling}
                      </span>
                    )}
                    {item.product.energyClassHeating && (
                      <span className="inline-flex items-center rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-400 ring-1 ring-orange-500/20">
                        Încălzire {item.product.energyClassHeating}
                      </span>
                    )}
                    {item.product.series && (
                      <span className="inline-flex items-center rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs text-sky-400 ring-1 ring-sky-500/20">
                        {item.product.series}
                      </span>
                    )}
                  </div>

                  {/* Match reasons */}
                  <ul className="mt-3 space-y-1">
                    {item.matchReasons.map((reason, ri) => (
                      <li key={ri} className="flex items-center gap-2 text-sm text-gray-400">
                        <svg className="h-3.5 w-3.5 shrink-0 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTAs */}
                <div className="flex shrink-0 flex-col gap-2 sm:w-44">
                  <InquiryDialog product={item.product} />
                  <Link
                    href={`/produse/${item.product.categorySlug || 'climatizare'}/${item.product.slug}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
                  >
                    Mai multe detalii
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Comparison table */}
      {results.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + results.length * 0.1 }}
          className="mt-10 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Specificație
                </th>
                {results.map((item) => (
                  <th key={item.product.id} className="p-4 text-center text-xs font-semibold text-white">
                    {item.product.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <ComparisonRow label="Scor" values={results.map((r) => `${r.score}%`)} />
              <ComparisonRow label="Capacitate" values={results.map((r) => r.product.capacity || '—')} />
              <ComparisonRow label="SEER" values={results.map((r) => r.product.seer || '—')} />
              <ComparisonRow label="SCOP" values={results.map((r) => r.product.scop || r.product.scopAt35 || '—')} />
              <ComparisonRow label="Clasă răcire" values={results.map((r) => r.product.energyClassCooling || '—')} />
              <ComparisonRow label="Clasă încălzire" values={results.map((r) => r.product.energyClassHeating || '—')} />
              <ComparisonRow label="Zgomot interior" values={results.map((r) => r.product.indoorNoiseMax || r.product.soundPowerLevel || '—')} />
              <ComparisonRow label="Serie" values={results.map((r) => r.product.series || '—')} />
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Reset */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          Reîncepe
        </button>
      </motion.div>
    </div>
  )
}

function ComparisonRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr>
      <td className="p-4 text-xs font-medium text-gray-500">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="p-4 text-center text-gray-300">{v}</td>
      ))}
    </tr>
  )
}

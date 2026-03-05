'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { InquiryDialog } from '@/components/product/InquiryDialog'
import type { Product } from '@/lib/payload'
import type { SavingsResult } from '@/lib/savings'

interface SavingsResultsProps {
  result: SavingsResult
  product: Product
  onResetProduct: () => void
  onResetAll: () => void
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 150, damping: 20 } },
}

export function SavingsResults({ result, product, onResetProduct, onResetAll }: SavingsResultsProps) {
  const productSlug = product.slug
  const categorySlug = product.categorySlug || 'climatizare'

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      {/* A) Hero economii */}
      <motion.div variants={fadeUp} className="text-center">
        {result.isComparison ? (
          <>
            <p className="text-sm font-medium uppercase tracking-wider text-sky-400">
              Economisești anual
            </p>
            <div className="mt-2">
              <CountUpNumber value={result.annualSaving} className="text-5xl font-bold text-white sm:text-7xl" />
              <span className="ml-2 text-2xl font-medium text-gray-400 sm:text-3xl">lei/an</span>
            </div>
            <p className="mt-3 text-gray-500">
              față de sistemul tău actual
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium uppercase tracking-wider text-sky-400">
              Cost anual estimat cu Haier
            </p>
            <div className="mt-2">
              <CountUpNumber value={result.newAnnualCost} className="text-5xl font-bold text-white sm:text-7xl" />
              <span className="ml-2 text-2xl font-medium text-gray-400 sm:text-3xl">lei/an</span>
            </div>
          </>
        )}
        {product.energyClassCooling && (
          <span className="mt-4 inline-flex items-center rounded-full bg-green-500/10 px-4 py-1.5 text-sm font-semibold text-green-400 ring-1 ring-green-500/20">
            Clasă energetică {product.energyClassCooling}
          </span>
        )}
      </motion.div>

      {/* B) Grafice comparative */}
      {result.isComparison && (
        <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2">
          {/* Card 1 — Consum anual */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Consum anual
            </h3>
            <div className="mt-4 space-y-3">
              <BarComparison
                label="Sistem vechi"
                value={result.oldAnnualKwh}
                maxValue={Math.max(result.oldAnnualKwh, result.newAnnualKwh)}
                unit="kWh"
                color="bg-red-500/70"
                subtext={`${result.oldAnnualCost.toLocaleString('ro-RO')} lei`}
              />
              <BarComparison
                label="Haier"
                value={result.newAnnualKwh}
                maxValue={Math.max(result.oldAnnualKwh, result.newAnnualKwh)}
                unit="kWh"
                color="bg-sky-500"
                subtext={`${result.newAnnualCost.toLocaleString('ro-RO')} lei`}
              />
            </div>
          </div>

          {/* Card 2 — Cost lunar */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Cost lunar mediu
            </h3>
            <div className="mt-4 space-y-3">
              <BarComparison
                label="Sistem vechi"
                value={result.oldMonthlyCost}
                maxValue={Math.max(result.oldMonthlyCost, result.newMonthlyCost)}
                unit="lei"
                color="bg-red-500/70"
              />
              <BarComparison
                label="Haier"
                value={result.newMonthlyCost}
                maxValue={Math.max(result.oldMonthlyCost, result.newMonthlyCost)}
                unit="lei"
                color="bg-sky-500"
              />
            </div>
          </div>

          {/* Card 3 — Amortizare */}
          {result.paybackYears > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Amortizare investiție
              </h3>
              <div className="mt-4 flex items-center justify-center">
                <PaybackRing years={result.paybackYears} />
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Investiție estimată: {result.estimatedInvestment.toLocaleString('ro-RO')} lei
              </p>
            </div>
          )}

          {/* Card 4 — Economie 10 ani */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Economie pe 10 ani
            </h3>
            <div className="mt-4">
              <CountUpNumber
                value={result.tenYearSaving}
                className="text-3xl font-bold text-white sm:text-4xl"
              />
              <span className="ml-1 text-lg text-gray-400">lei</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">economisiți în decurs de 10 ani</p>
          </div>
        </motion.div>
      )}

      {/* C) Impact ecologic */}
      {result.isComparison && result.co2Saved > 0 && (
        <motion.div variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
            Impact ecologic anual
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center">
              <CountUpNumber value={result.co2Saved} className="text-2xl font-bold text-emerald-400" />
              <span className="ml-1 text-sm text-gray-400">kg CO₂</span>
              <p className="mt-1 text-xs text-gray-500">economisit pe an</p>
            </div>
            <div className="text-center">
              <CountUpNumber value={result.treesEquivalent} className="text-2xl font-bold text-emerald-400" />
              <span className="ml-1 text-sm text-gray-400">copaci</span>
              <p className="mt-1 text-xs text-gray-500">echivalent plantați</p>
            </div>
            <div className="text-center">
              <CountUpNumber value={result.carKmEquivalent} className="text-2xl font-bold text-emerald-400" />
              <span className="ml-1 text-sm text-gray-400">km</span>
              <p className="mt-1 text-xs text-gray-500">conduși în minus</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* D) CTA-uri */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
        <InquiryDialog product={product} />

        <Link
          href={`/produse/${categorySlug}/${productSlug}`}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          Mai multe detalii
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </Link>

        <button
          onClick={onResetProduct}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-gray-400 transition-all hover:border-white/20 hover:text-white"
        >
          Încearcă alt produs
        </button>

        <button
          onClick={onResetAll}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-gray-500 transition-colors hover:text-gray-300"
        >
          Reîncepe
        </button>
      </motion.div>
    </motion.div>
  )
}

// ── CountUpNumber ────────────────────────────────────────────────────────────

function CountUpNumber({ value, className }: { value: number; className: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const duration = 1200
    const start = performance.now()
    let raf: number

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])

  return (
    <span ref={ref} className={`font-[family-name:var(--font-display)] tabular-nums ${className}`}>
      {display.toLocaleString('ro-RO')}
    </span>
  )
}

// ── BarComparison ────────────────────────────────────────────────────────────

function BarComparison({
  label,
  value,
  maxValue,
  unit,
  color,
  subtext,
}: {
  label: string
  value: number
  maxValue: number
  unit: string
  color: string
  subtext?: string
}) {
  const percent = maxValue > 0 ? (value / maxValue) * 100 : 0

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className="font-medium text-white">
          {value.toLocaleString('ro-RO')} {unit}
          {subtext && <span className="ml-1 text-gray-500">({subtext})</span>}
        </span>
      </div>
      <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
    </div>
  )
}

// ── PaybackRing ──────────────────────────────────────────────────────────────

function PaybackRing({ years }: { years: number }) {
  const radius = 50
  const circumference = 2 * Math.PI * radius
  // Cap at 10 years for visual
  const progress = Math.min(years / 10, 1)
  const offset = circumference * (1 - progress)

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
        {/* Background circle */}
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
        />
        {/* Progress arc */}
        <motion.circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="rgb(14 165 233)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
          {years}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
          ani
        </span>
      </div>
    </div>
  )
}

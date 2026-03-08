'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { InquiryDialog } from '@/components/product/InquiryDialog'
import { R2_PUBLIC_URL } from '@/lib/constants'
import type { SpaceType, RoomConfig, ThermalResult, ScoredProduct } from '@/lib/room-calculator'

interface ConfigResultsProps {
  spaceType: SpaceType
  thermalResult: ThermalResult
  scoredProducts: ScoredProduct[]
  rooms: RoomConfig[]
  onSelectProducts: (products: ScoredProduct[]) => void
  onBack: () => void
  onReset: () => void
}

const SPACE_LABELS: Record<SpaceType, string> = {
  apartament: 'Apartament',
  casa: 'Casă / Vilă',
  fitness: 'Sală de fitness',
  restaurant: 'Restaurant / Cafe',
  magazin: 'Magazin / Retail',
  pensiune: 'Pensiune / Hotel',
}

function AnimatedScore({ target }: { target: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1200
    const startTime = performance.now()

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [target])

  return <>{count}</>
}

function AnimatedValue({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1000
    const startTime = performance.now()

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target * 10) / 10)
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [target])

  return <>{count}{suffix}</>
}

export function ConfigResults({
  spaceType,
  thermalResult,
  scoredProducts,
  rooms,
  onSelectProducts,
  onBack,
  onReset,
}: ConfigResultsProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => {
    // Pre-select top product
    if (scoredProducts.length > 0) return new Set([scoredProducts[0].product.id])
    return new Set()
  })

  function toggleProduct(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleContinue() {
    const selected = scoredProducts.filter((sp) => selectedIds.has(sp.product.id))
    if (selected.length > 0) {
      onSelectProducts(selected)
    } else if (scoredProducts.length > 0) {
      onSelectProducts([scoredProducts[0]])
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Soluții recomandate
        </h2>
        <p className="mt-3 text-gray-400">
          Am calculat necesarul termic și am identificat produsele optime
        </p>
      </motion.div>

      {/* Thermal summary cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <SummaryCard
          label={SPACE_LABELS[spaceType]}
          value={`${rooms.length}`}
          suffix={rooms.length === 1 ? ' cameră' : ' camere'}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          }
        />
        <SummaryCard
          label="Suprafață totală"
          value={`${thermalResult.totalArea}`}
          suffix=" m²"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          }
        />
        <SummaryCard
          label="Sarcină termică"
          value={`${Math.round(thermalResult.totalThermalLoadW / 100) / 10}`}
          suffix=" kW"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          }
          highlight
        />
        <SummaryCard
          label="Capacitate necesară"
          value={`${thermalResult.totalRequiredKw}`}
          suffix=" kW"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          }
          highlight
        />
      </motion.div>

      {/* Per-room breakdown */}
      {thermalResult.rooms.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
        >
          <div className="border-b border-white/10 px-5 py-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Detalii per cameră
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {thermalResult.rooms.map((room) => (
              <div key={room.roomId} className="flex items-center justify-between px-5 py-3">
                <div>
                  <span className="text-sm font-medium text-white">{room.roomName}</span>
                  <span className="ml-2 text-xs text-gray-500">{room.area} m²</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400">{room.thermalLoadW} W</span>
                  <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-400 ring-1 ring-sky-500/20">
                    {room.requiredKw} kW
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Product recommendations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-4"
      >
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Selectează produsele dorite
        </h3>
      </motion.div>

      <div className="space-y-4">
        {scoredProducts.map((item, index) => {
          const imageUrl = item.product.mainImageFilename
            ? `${R2_PUBLIC_URL}/${item.product.mainImageFilename}`
            : null
          const isBest = index === 0
          const isSelected = selectedIds.has(item.product.id)

          return (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 100 }}
              className={`relative cursor-pointer overflow-hidden rounded-2xl border backdrop-blur-sm transition-all ${
                isSelected
                  ? 'border-sky-500/40 bg-sky-500/[0.07] shadow-[0_0_40px_rgba(14,165,233,0.1)]'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              onClick={() => toggleProduct(item.product.id)}
            >
              {isBest && (
                <div className="absolute left-0 top-0 rounded-br-xl bg-sky-600 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                  Cea mai bună potrivire
                </div>
              )}

              <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
                {/* Checkbox */}
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-500'
                    : 'border-white/20 bg-transparent'
                }`}>
                  {isSelected && (
                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Image */}
                <div className="flex shrink-0 items-center justify-center sm:w-36">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.product.title}
                      width={144}
                      height={108}
                      className="h-auto max-h-[100px] w-auto object-contain"
                    />
                  ) : (
                    <div className="flex h-20 w-28 items-center justify-center rounded-lg bg-white/5">
                      <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
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
                    {item.coveragePercent > 0 && (
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                        item.coveragePercent >= 80
                          ? 'bg-green-500/10 text-green-400 ring-green-500/20'
                          : item.coveragePercent >= 50
                            ? 'bg-amber-500/10 text-amber-400 ring-amber-500/20'
                            : 'bg-red-500/10 text-red-400 ring-red-500/20'
                      }`}>
                        Acoperire {item.coveragePercent}%
                      </span>
                    )}
                    {item.product.energyClassCooling && (
                      <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400 ring-1 ring-green-500/20">
                        {item.product.energyClassCooling}
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
                <div className="flex shrink-0 flex-col gap-2 sm:w-40" onClick={(e) => e.stopPropagation()}>
                  <InquiryDialog product={item.product} />
                  <Link
                    href={`/produse/${item.product.categorySlug || 'climatizare'}/${item.product.slug}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
                  >
                    Detalii produs
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

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
      >
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Modifică spațiul
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            Reîncepe
          </button>
        </div>
        <button
          onClick={handleContinue}
          className="flex items-center gap-2 rounded-xl bg-sky-600 px-8 py-3 font-display text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-sky-600/25 transition-all hover:bg-sky-500 hover:shadow-sky-500/30"
        >
          Continuă cu selecția
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </motion.div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  suffix,
  icon,
  highlight,
}: {
  label: string
  value: string
  suffix: string
  icon: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div className={`rounded-2xl border p-5 ${
      highlight
        ? 'border-sky-500/20 bg-sky-500/5'
        : 'border-white/10 bg-white/[0.03]'
    }`}>
      <div className={`mb-3 inline-flex rounded-lg p-2 ${
        highlight ? 'bg-sky-500/15 text-sky-400' : 'bg-white/5 text-gray-500'
      }`}>
        {icon}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-gray-500">{label}</div>
      <div className="mt-1 font-display text-xl font-bold text-white">
        {value}<span className="text-sm font-normal text-gray-500">{suffix}</span>
      </div>
    </div>
  )
}

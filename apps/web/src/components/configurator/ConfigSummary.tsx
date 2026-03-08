'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { InquiryDialog } from '@/components/product/InquiryDialog'
import { R2_PUBLIC_URL } from '@/lib/constants'
import type { SpaceType, RoomConfig, ThermalResult, ScoredProduct } from '@/lib/room-calculator'

interface ConfigSummaryProps {
  spaceType: SpaceType
  thermalResult: ThermalResult
  selectedProducts: ScoredProduct[]
  rooms: RoomConfig[]
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

const ORIENTATION_LABELS: Record<string, string> = {
  N: 'Nord', S: 'Sud', E: 'Est', V: 'Vest',
}

const INSULATION_LABELS: Record<string, string> = {
  slaba: 'Slabă', medie: 'Medie', buna: 'Bună',
}

const WINDOW_SIZE_LABELS: Record<string, string> = {
  mica: 'Mici', medie: 'Medii', mare: 'Mari',
}

export function ConfigSummary({
  spaceType,
  thermalResult,
  selectedProducts,
  rooms,
  onBack,
  onReset,
}: ConfigSummaryProps) {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 ring-1 ring-green-500/20">
          <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Configurația ta
        </h2>
        <p className="mt-3 text-gray-400">
          Rezumat complet — solicită ofertă pentru produsele selectate
        </p>
      </motion.div>

      {/* Configuration summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
      >
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <svg className="h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configurație spațiu — {SPACE_LABELS[spaceType]}
          </h3>
        </div>

        <div className="divide-y divide-white/5">
          {rooms.map((room, i) => (
            <div key={room.id} className="px-6 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-display text-sm font-bold text-white">{room.name}</span>
                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-400 ring-1 ring-sky-500/20">
                  {thermalResult.rooms[i]?.requiredKw || '—'} kW necesar
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm sm:grid-cols-4">
                <DetailItem label="Dimensiuni" value={`${room.length} × ${room.width} m`} />
                <DetailItem label="Suprafață" value={`${Math.round(room.length * room.width)} m²`} />
                <DetailItem label="Înălțime" value={`${room.ceilingHeight} m`} />
                <DetailItem label="Ferestre" value={`${room.windows} (${WINDOW_SIZE_LABELS[room.windowSize]})`} />
                <DetailItem label="Uși ext." value={`${room.exteriorDoors}`} />
                <DetailItem label="Orientare" value={ORIENTATION_LABELS[room.orientation]} />
                <DetailItem label="Izolație" value={INSULATION_LABELS[room.insulation]} />
                <DetailItem label="Sarcină" value={`${thermalResult.rooms[i]?.thermalLoadW || '—'} W`} />
              </div>
            </div>
          ))}
        </div>

        {/* Total row */}
        <div className="border-t border-white/10 bg-white/[0.02] px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-400">Total</span>
            <div className="flex items-center gap-6 text-sm">
              <span className="text-gray-400">
                {thermalResult.totalArea} m² | {thermalResult.totalVolume} m³
              </span>
              <span className="font-display text-lg font-bold text-sky-400">
                {thermalResult.totalRequiredKw} kW
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Selected products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Produse selectate
        </h3>
        <div className="space-y-3">
          {selectedProducts.map((item, index) => {
            const imageUrl = item.product.mainImageFilename
              ? `${R2_PUBLIC_URL}/${item.product.mainImageFilename}`
              : null

            return (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-5 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5"
              >
                {/* Image */}
                <div className="flex shrink-0 items-center justify-center">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.product.title}
                      width={80}
                      height={60}
                      className="h-auto max-h-[60px] w-auto object-contain"
                    />
                  ) : (
                    <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-white/5">
                      <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h4 className="font-display text-sm font-bold text-white">{item.product.title}</h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {item.product.capacity && (
                      <span className="text-xs text-gray-400">{item.product.capacity}</span>
                    )}
                    {item.product.energyClassCooling && (
                      <span className="text-xs text-green-400">{item.product.energyClassCooling}</span>
                    )}
                    {item.product.series && (
                      <span className="text-xs text-sky-400">{item.product.series}</span>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="rounded-full bg-sky-500/20 px-3 py-1 text-sm font-bold text-sky-400">
                  {item.score}%
                </div>

                {/* Link */}
                <Link
                  href={`/produse/${item.product.categorySlug || 'climatizare'}/${item.product.slug}`}
                  className="shrink-0 rounded-lg border border-white/10 p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Main CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-sky-500/20 bg-gradient-to-b from-sky-500/10 to-transparent p-8 text-center"
      >
        <h3 className="font-display text-lg font-bold text-white">
          Dorești o ofertă personalizată?
        </h3>
        <p className="mt-2 text-sm text-gray-400">
          Trimite configurația ta și primești ofertă detaliată cu preț, montaj și garanție
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {selectedProducts[0] && (
            <InquiryDialog product={selectedProducts[0].product} />
          )}
          <Link
            href="/cerere-oferta"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-gray-300 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Formular complet
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex items-center justify-between"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Modifică selecția
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          Configurație nouă
        </button>
      </motion.div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-1">
      <span className="text-xs text-gray-600">{label}: </span>
      <span className="text-xs text-gray-300">{value}</span>
    </div>
  )
}

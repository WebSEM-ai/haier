'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { R2_PUBLIC_URL } from '@/lib/constants'
import type { Product } from '@/lib/payload'

interface FeaturedProductsProps {
  acProducts: Product[]
  heatPumpProducts: Product[]
}

export function FeaturedProducts({ acProducts, heatPumpProducts }: FeaturedProductsProps) {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle radial bg */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.04),transparent_60%)]" />

      <div className="relative">
        {/* Section header */}
        <div className="mx-auto max-w-7xl px-6 pt-20 lg:pt-28 xl:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-sky-600">
              Recomandate
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Produse populare
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-500">
              Cele mai apreciate soluții de climatizare și pompe de căldură, alese de clienții noștri
            </p>
          </motion.div>
        </div>

        {/* AC Carousel */}
        {acProducts.length > 0 && (
          <ProductCarousel
            products={acProducts}
            label="Aparate de Aer Condiționat"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            }
            ctaLink="/produse/climatizare"
            ctaText="Toate climatizatoarele"
            index={0}
          />
        )}

        {/* Heat Pump Carousel */}
        {heatPumpProducts.length > 0 && (
          <ProductCarousel
            products={heatPumpProducts}
            label="Pompe de Căldură"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 6.51 6.51 0 009 11.5a3 3 0 105.404-1.786 6.453 6.453 0 00.958-4.5z" />
              </svg>
            }
            ctaLink="/produse/pompe-de-caldura"
            ctaText="Toate pompele de căldură"
            index={1}
          />
        )}

        {/* Bottom spacer */}
        <div className="h-20 lg:h-28" />
      </div>
    </section>
  )
}

// ── ProductCarousel ──────────────────────────────────────────────────────────

function ProductCarousel({
  products,
  label,
  icon,
  ctaLink,
  ctaText,
  index: sectionIndex,
}: {
  products: Product[]
  label: string
  icon: React.ReactNode
  ctaLink: string
  ctaText: string
  index: number
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector('div')?.offsetWidth || 300
    el.scrollBy({ left: dir === 'left' ? -cardWidth - 20 : cardWidth + 20, behavior: 'smooth' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: sectionIndex * 0.15 }}
      viewport={{ once: true, margin: '-80px' }}
      className="mt-14 first:mt-12"
    >
      {/* Row header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 xl:px-10">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            {icon}
          </span>
          <h3 className="font-display text-lg font-bold uppercase tracking-tight text-gray-900">
            {label}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Arrow buttons */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-gray-300 hover:text-gray-700 disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500"
            aria-label="Anterior"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-gray-300 hover:text-gray-700 disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500"
            aria-label="Următor"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <Link
            href={ctaLink}
            className="ml-2 hidden items-center gap-1.5 text-sm font-medium text-sky-600 transition-colors hover:text-sky-700 sm:inline-flex"
          >
            {ctaText}
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Scrollable track */}
      <div className="relative mt-6">
        {/* Left fade */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
        )}
        {/* Right fade */}
        {canScrollRight && (
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />
        )}

        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-5 overflow-x-auto px-6 pb-4 xl:px-10"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="mt-4 px-6 sm:hidden">
        <Link
          href={ctaLink}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600"
        >
          {ctaText}
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      </div>
    </motion.div>
  )
}

// ── ProductCard ──────────────────────────────────────────────────────────────

function ProductCard({ product, index }: { product: Product; index: number }) {
  const categorySlug = product.categorySlug || 'produse'
  const imageUrl = product.mainImageFilename
    ? `${R2_PUBLIC_URL}/${product.mainImageFilename}`
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      viewport={{ once: true, margin: '-40px' }}
      className="w-[280px] flex-shrink-0 sm:w-[300px]"
      style={{ scrollSnapAlign: 'start' }}
    >
      <Link
        href={`/produse/${categorySlug}/${product.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-xl hover:ring-sky-100"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg className="h-14 w-14 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="rounded-full bg-white/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-900 shadow-lg backdrop-blur-sm">
              Vezi detalii
            </span>
          </div>

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.energyClassCooling && (
              <span className="rounded-md bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                {product.energyClassCooling}
              </span>
            )}
            {product.series && (
              <span className="rounded-md bg-sky-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                {product.series}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <h4 className="font-display text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-sky-600 line-clamp-2">
            {product.title}
          </h4>

          {product.capacity && (
            <p className="mt-1.5 text-xs text-gray-500">{product.capacity}</p>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-[11px] font-medium tracking-wider text-gray-400 line-clamp-1">
              {product.modelCode}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 transition-all group-hover:gap-1.5">
              Detalii
              <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

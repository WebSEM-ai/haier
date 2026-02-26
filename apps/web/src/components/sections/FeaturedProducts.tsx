'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { R2_PUBLIC_URL } from '@/lib/constants'
import type { Product } from '@/lib/payload'

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-gray-950 py-20 lg:py-28">
      {/* Grid texture */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Top accent line */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 xl:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-sky-400">
              Recomandate
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
              Produse populare
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-400">
              Cele mai apreciate soluții de climatizare, alese de clienții noștri
            </p>
          </div>

          <Link
            href="/produse"
            className="group hidden items-center gap-2 text-sm font-medium text-sky-400 transition-colors hover:text-sky-300 sm:inline-flex"
          >
            Vezi toate produsele
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>

        {/* Product grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {products.slice(0, 6).map((product, index) => (
            <FeaturedCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 text-center sm:hidden"
        >
          <Link
            href="/produse"
            className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 transition-all hover:bg-sky-500"
          >
            Vezi toate produsele
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Bottom accent line */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
    </section>
  )
}

// ── FeaturedCard ──────────────────────────────────────────────────────────────

function FeaturedCard({
  product,
  index,
}: {
  product: Product
  index: number
}) {
  const categorySlug = product.categorySlug || 'produse'
  const imageUrl = product.mainImageFilename
    ? `${R2_PUBLIC_URL}/${product.mainImageFilename}`
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true, margin: '-50px' }}
    >
      <Link
        href={`/produse/${categorySlug}/${product.slug}`}
        className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-sky-500/30 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-sky-500/10"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg className="h-16 w-16 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
            <span className="rounded-full bg-white/95 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-gray-900 shadow-lg">
              Vezi detalii
            </span>
          </div>

          {/* Top badges */}
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
        <div className="p-5">
          <h3 className="font-display text-sm font-bold text-white transition-colors group-hover:text-sky-400 line-clamp-2">
            {product.title}
          </h3>

          {product.shortDescription && (
            <p className="mt-2 text-xs leading-relaxed text-gray-500 line-clamp-2">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-[11px] font-medium tracking-wider text-gray-600">
              {product.modelCode}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 transition-all group-hover:gap-2">
              Detalii
              <svg
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

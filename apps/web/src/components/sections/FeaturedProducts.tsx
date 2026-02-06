'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product } from '@/lib/payload'

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-100/50 blur-3xl" />
      </div>

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-sky-600">
              Recomandate
            </span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Produse populare
            </h2>
            <p className="mt-4 max-w-xl text-lg text-gray-600">
              Cele mai apreciate soluții de climatizare, alese de clienții noștri
            </p>
          </div>
          <Link
            href="/produse"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700"
          >
            Vezi toate produsele
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {products.slice(0, 6).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-10 text-center sm:hidden"
        >
          <Link
            href="/produse"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white shadow-lg shadow-sky-600/25 transition-all hover:bg-sky-700"
          >
            Vezi toate produsele
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}

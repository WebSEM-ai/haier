'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import type { Category } from '@repo/payload-types'

interface CategoryGridProps {
  categories: Category[]
  showTitle?: boolean
}

const categoryIcons: Record<string, string> = {
  climatizare: '❄️',
  incalzire: '🔥',
  ventilatie: '💨',
  default: '🏠',
}

export function CategoryGrid({ categories, showTitle = true }: CategoryGridProps) {
  const rootCategories = categories.filter((c) => c.level === '1')

  if (rootCategories.length === 0) {
    return null
  }

  return (
    <section className="py-16 lg:py-24">
      <Container>
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-sky-600">
              Categorii
            </span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Explorează gama noastră
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Alege categoria potrivită pentru nevoile tale de climatizare
            </p>
          </motion.div>
        )}

        <div className={`${showTitle ? 'mt-12' : ''} grid gap-6 sm:grid-cols-2 lg:grid-cols-3`}>
          {rootCategories.map((category, index) => {
            const imageData = typeof category.image === 'object' ? category.image : null
            const imageUrl = imageData?.url || null
            const icon = categoryIcons[category.slug || ''] || categoryIcons.default

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: '-50px' }}
              >
                <Link
                  href={`/produse/${category.slug}`}
                  className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10"
                >
                  {/* Background image */}
                  {imageUrl && (
                    <div className="absolute inset-0">
                      <Image
                        src={imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover opacity-30 transition-all duration-500 group-hover:scale-110 group-hover:opacity-40"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative z-10 flex h-full min-h-[200px] flex-col justify-between">
                    <div>
                      <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur-sm ring-1 ring-white/20 transition-all group-hover:bg-sky-500 group-hover:ring-sky-400">
                        {icon}
                      </span>
                      <h3 className="mt-4 text-2xl font-bold text-white">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="mt-2 text-gray-300 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 flex items-center text-sky-400 transition-all group-hover:text-sky-300">
                      <span className="font-medium">Descoperă</span>
                      <svg
                        className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

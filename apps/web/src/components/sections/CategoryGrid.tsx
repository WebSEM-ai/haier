'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { Category } from '@/lib/payload'

// ── Category showcase data ──────────────────────────────────────────────────

interface Badge {
  label: string
  sub?: string
}

interface ShowcaseCategory {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  image: string
  imageAlt: string
  badges: Badge[]
  highlights: string[]
  series?: { label: string; href: string }[]
}

const showcaseCategories: ShowcaseCategory[] = [
  {
    id: 'climatizare',
    slug: 'climatizare',
    title: 'Climatizare',
    subtitle: 'Aer condiționat rezidențial',
    description:
      'Gamă completă de climatizatoare cu inverter, de la 2.5 kW la 7.1 kW — echipate cu sterilizare UV-C, filtru IFD și control Wi-Fi.',
    image: '/images/categories/climatizare.png',
    imageAlt: 'Climatizare Haier unitate interioară',
    badges: [
      { label: 'A+++', sub: 'Clasă energetică' },
      { label: 'R32', sub: 'Refrigerant ecologic' },
      { label: 'Wi-Fi', sub: 'Control inteligent' },
      { label: 'UV-C', sub: 'Sterilizare 99.9%' },
    ],
    highlights: ['Inverter DC', 'Funcționare silențioasă de la 18 dB(A)', 'Garanție 5 ani'],
    series: [
      { label: 'Pearl Premium', href: '/produse/climatizare?series=pearl-premium' },
      { label: 'Revive Plus', href: '/produse/climatizare?series=revive-plus' },
    ],
  },
  {
    id: 'pompe-caldura',
    slug: 'pompe-caldura',
    title: 'Pompe de căldură',
    subtitle: 'Încălzire & răcire eficientă',
    description:
      'Pompe de căldură monobloc și split cu refrigerant R290 — eficiență energetică A+++ și compatibilitate cu panouri fotovoltaice.',
    image: '/images/categories/pompa-caldura.webp',
    imageAlt: 'Pompă de căldură Haier monobloc',
    badges: [
      { label: 'A+++', sub: 'Clasă energetică' },
      { label: 'R290', sub: 'Eco-friendly' },
      { label: 'PV', sub: 'Fotovoltaic ready' },
      { label: 'SG', sub: 'Smart Grid' },
    ],
    highlights: ['Monobloc sau split', 'De la 4 kW la 16 kW', 'Temperaturi de până la -25°C'],
    series: [
      { label: 'Monobloc GT', href: '/produse/pompe-caldura?series=monobloc-gt' },
      { label: 'Hydro All-in-One', href: '/produse/pompe-caldura?series=hydro' },
    ],
  },
  {
    id: 'boilere',
    slug: 'pompe-caldura',
    title: 'Boilere cu pompă',
    subtitle: 'Apă caldă eficientă',
    description:
      'Boilere cu pompă de căldură pentru apă caldă menajeră — economie de energie de până la 75% față de boilerele electrice clasice.',
    image: '/images/categories/boiler.webp',
    imageAlt: 'Boiler Haier cu pompă de căldură',
    badges: [
      { label: 'A+', sub: 'Clasă energetică' },
      { label: 'R134a', sub: 'Refrigerant' },
      { label: '240L', sub: 'Capacitate' },
    ],
    highlights: ['Economie 75% energie', 'Capacitate 200–300 L', 'Funcționare silențioasă'],
  },
]

// ── Component ────────────────────────────────────────────────────────────────

interface CategoryGridProps {
  categories: Category[]
  showTitle?: boolean
}

export function CategoryGrid({ categories: _categories, showTitle = true }: CategoryGridProps) {
  const [active, setActive] = useState(0)
  const cat = showcaseCategories[active]

  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-24">
      {/* Subtle bg pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.04),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6 xl:px-10">
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-sky-600">
              Categorii de produse
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Explorează gama
            </h2>
          </motion.div>
        )}

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
          className={`flex flex-wrap justify-center gap-2 ${showTitle ? 'mt-10' : ''}`}
        >
          {showcaseCategories.map((c, i) => {
            const isActive = active === i
            return (
              <button
                key={c.id}
                onClick={() => setActive(i)}
                className={`relative rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive ? 'text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="cat-tab-bg"
                    className="absolute inset-0 rounded-full bg-gray-900"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{c.title}</span>
              </button>
            )
          })}
        </motion.div>

        {/* Category showcase card */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden rounded-3xl border border-gray-200/80 bg-gradient-to-br from-gray-50 to-white shadow-xl shadow-gray-200/40"
            >
              <div className="grid lg:grid-cols-2">
                {/* Image side */}
                <div className="relative flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 px-8 py-12 lg:min-h-[520px] lg:py-0">
                  {/* Soft glow */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-64 w-64 rounded-full bg-sky-100/60 blur-3xl" />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.imageAlt}
                      width={600}
                      height={500}
                      className="relative z-10 h-auto max-h-[400px] w-auto max-w-full object-contain drop-shadow-2xl"
                      priority
                    />
                  </motion.div>

                  {/* Category badge label */}
                  <div className="absolute left-6 top-6 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-900 shadow-sm ring-1 ring-gray-900/5 backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                      {cat.subtitle}
                    </span>
                  </div>
                </div>

                {/* Content side */}
                <div className="flex flex-col justify-center px-8 py-10 sm:px-12 lg:py-16 lg:px-14">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                  >
                    <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-gray-900 sm:text-4xl">
                      {cat.title}
                    </h3>
                    <p className="mt-4 max-w-md leading-relaxed text-gray-600">
                      {cat.description}
                    </p>
                  </motion.div>

                  {/* Badges row */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    className="mt-8 flex flex-wrap gap-3"
                  >
                    {cat.badges.map((b) => (
                      <div
                        key={b.label}
                        className="flex flex-col items-center rounded-xl bg-gray-900 px-4 py-3 text-center ring-1 ring-gray-800"
                      >
                        <span className="text-sm font-bold text-white">{b.label}</span>
                        {b.sub && (
                          <span className="mt-0.5 text-[10px] uppercase tracking-wider text-gray-400">
                            {b.sub}
                          </span>
                        )}
                      </div>
                    ))}
                  </motion.div>

                  {/* Highlights */}
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                    className="mt-6 space-y-2"
                  >
                    {cat.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2.5 text-sm text-gray-700">
                        <svg
                          className="h-4 w-4 shrink-0 text-sky-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {h}
                      </li>
                    ))}
                  </motion.ul>

                  {/* Series quick-links */}
                  {cat.series && cat.series.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="mt-8"
                    >
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Alege gama
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cat.series.map((s) => (
                          <Link
                            key={s.label}
                            href={s.href}
                            className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-900 shadow-sm transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md hover:shadow-sky-100/50"
                          >
                            {s.label}
                            <svg
                              className="h-3 w-3 text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:text-sky-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* CTA */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.45 }}
                    className="mt-8 flex items-center gap-4"
                  >
                    <Link
                      href={`/produse/${cat.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition-all hover:bg-gray-800 hover:shadow-gray-900/30"
                    >
                      Descoperă produsele
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                    <Link
                      href="/cerere-oferta"
                      className="text-sm font-medium text-gray-500 transition-colors hover:text-sky-600"
                    >
                      Cere ofertă →
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

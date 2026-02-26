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
  icon: React.ReactNode
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
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
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
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
      </svg>
    ),
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
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

// ── Component ────────────────────────────────────────────────────────────────

interface CategoryGridProps {
  categories: Category[]
  showTitle?: boolean
}

export function CategoryGrid({ categories: _categories, showTitle: _showTitle = true }: CategoryGridProps) {
  const [active, setActive] = useState(0)
  const cat = showcaseCategories[active]

  return (
    <section className="relative overflow-hidden bg-gray-950">
      {/* Grid texture — fine lines */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Top separator line */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative grid lg:grid-cols-[1fr_280px]">
        {/* Left: Content area */}
        <div className="relative min-h-[600px] lg:min-h-[700px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={cat.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid h-full md:grid-cols-2"
            >
              {/* Text content */}
              <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:py-20 lg:px-16">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <p className="text-xs font-medium uppercase tracking-widest text-sky-400">
                    {cat.subtitle}
                  </p>

                  <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {cat.title}
                  </h2>

                  <p className="mt-6 max-w-md text-base leading-relaxed text-gray-400">
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
                      className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center"
                    >
                      <span className="text-sm font-bold text-white">{b.label}</span>
                      {b.sub && (
                        <span className="mt-0.5 text-[10px] uppercase tracking-wider text-gray-500">
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
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="mt-6 space-y-2"
                >
                  {cat.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2.5 text-sm text-gray-300">
                      <svg className="h-4 w-4 shrink-0 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {h}
                    </li>
                  ))}
                </motion.ul>

                {/* Series quick-links + CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                  className="mt-8"
                >
                  {cat.series && cat.series.length > 0 && (
                    <div className="mb-6">
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                        Alege gama
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cat.series.map((s) => (
                          <Link
                            key={s.label}
                            href={s.href}
                            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:border-sky-500/30 hover:bg-sky-500/10 hover:text-sky-400"
                          >
                            {s.label}
                            <svg className="h-3 w-3 text-gray-500 transition-all group-hover:translate-x-0.5 group-hover:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/produse/${cat.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 transition-all hover:bg-sky-500 hover:shadow-sky-500/30"
                  >
                    Descoperă produsele
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>
              </div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="relative flex items-center justify-center px-6 py-12 md:px-0 md:py-0"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
                </div>

                <Image
                  src={cat.image}
                  alt={cat.imageAlt}
                  width={600}
                  height={500}
                  className="relative z-10 h-auto max-h-[500px] w-auto max-w-full object-contain"
                  priority
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Vertical tabs */}
        <div className="flex flex-row gap-2 border-t border-white/10 px-6 py-4 lg:flex-col lg:justify-center lg:gap-3 lg:border-l lg:border-t-0 lg:px-8 lg:py-20">
          {showcaseCategories.map((c, i) => {
            const isActive = active === i
            return (
              <button
                key={c.id}
                onClick={() => setActive(i)}
                className={`group relative flex items-center gap-3 rounded-xl px-5 py-4 text-left transition-all ${
                  isActive
                    ? 'bg-white/10 text-white shadow-lg shadow-white/5'
                    : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="cat-tab-indicator"
                    className="absolute inset-0 rounded-xl ring-1 ring-sky-500/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <span className={`relative z-10 shrink-0 ${isActive ? 'text-sky-400' : ''}`}>
                  {c.icon}
                </span>
                <span className="relative z-10 font-display text-xs font-semibold uppercase tracking-wider">
                  {c.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
    </section>
  )
}

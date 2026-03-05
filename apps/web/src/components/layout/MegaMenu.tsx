'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { CONTACT } from '@/lib/constants'

// ── Navigation data ──────────────────────────────────────────────────────────

interface ProductLink {
  label: string
  slug: string
}

interface ProductColumn {
  title: string
  subtitle?: string
  products: ProductLink[]
}

interface MenuSection {
  key: string
  categorySlug: string
  categoryLabel: string
  columns: ProductColumn[]
  promoImage: string
  promoLabel: string
  description: string
  previewImage: string
}

export const MENU_SECTIONS: MenuSection[] = [
  {
    key: 'climatizare',
    categorySlug: 'climatizare',
    categoryLabel: 'Climatizare',
    promoImage: '/images/categories/climatizare.png',
    promoLabel: 'Aer condiționat',
    description:
      'Gamă completă de climatizatoare cu inverter, sterilizare UV-C, filtru IFD și control Wi-Fi — eficiență energetică A+++.',
    previewImage: '/images/categories/climatizare.png',
    columns: [
      {
        title: 'Pearl Premium',
        subtitle: 'hUMI Fresh',
        products: [
          { label: '2.5 kW · ~25 m²', slug: 'pearl-premium-2-5-kw' },
          { label: '3.5 kW · ~35 m²', slug: 'pearl-premium-3-5-kw' },
          { label: '5.0 kW · ~50 m²', slug: 'pearl-premium-5-0-kw' },
          { label: '7.1 kW · ~70 m²', slug: 'pearl-premium-7-1-kw' },
        ],
      },
      {
        title: 'Revive Plus',
        subtitle: 'UVC 99.9%',
        products: [
          { label: '2.5 kW · ~25 m²', slug: 'revive-plus-2-5-kw' },
          { label: '3.5 kW · ~35 m²', slug: 'revive-plus-3-5-kw' },
          { label: '5.0 kW · ~50 m²', slug: 'revive-plus-5-0-kw' },
          { label: '7.1 kW · ~70 m²', slug: 'revive-plus-7-1-kw' },
        ],
      },
    ],
  },
  {
    key: 'pompe-caldura',
    categorySlug: 'pompe-caldura',
    categoryLabel: 'Pompe de căldură',
    promoImage: '/images/categories/pompa-caldura.webp',
    promoLabel: 'Pompe de căldură',
    description:
      'Pompe de căldură monobloc și split cu refrigerant R290 — eficiență A+++ și compatibilitate cu panouri fotovoltaice.',
    previewImage: '/images/categories/pompa-caldura.webp',
    columns: [
      {
        title: 'Monobloc GT R290',
        products: [
          { label: '4 kW', slug: 'monobloc-gt-r290-4-kw' },
          { label: '6 kW', slug: 'monobloc-gt-r290-6-kw' },
          { label: '10 kW Mono', slug: 'monobloc-gt-r290-10-kw-mono' },
          { label: '10 kW Tri', slug: 'monobloc-gt-r290-10-kw-tri' },
        ],
      },
      {
        title: 'Hydro All-in-One R290',
        products: [
          { label: '4 kW Mono', slug: 'hydro-all-in-one-r290-4-kw' },
          { label: '6 kW Mono', slug: 'hydro-all-in-one-r290-6-kw' },
          { label: '10 kW Mono', slug: 'hydro-all-in-one-r290-10-kw' },
          { label: '10 kW Tri', slug: 'hydro-all-in-one-r290-10-kw-tri' },
          { label: 'Un. Int. Mono', slug: 'hydro-all-in-one-unitate-interioara-mono' },
          { label: 'Un. Int. Tri', slug: 'hydro-all-in-one-unitate-interioara-tri' },
        ],
      },
      {
        title: 'Accesorii',
        products: [
          { label: 'PCB Box', slug: 'atw-a03n-pcb-control-box' },
          { label: 'Termostat', slug: 'hw-wa101adk-termostat' },
        ],
      },
    ],
  },
]

// ── MegaMenuPanel ────────────────────────────────────────────────────────────

interface MegaMenuPanelProps {
  section: MenuSection
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function MegaMenuPanel({ section, onMouseEnter, onMouseLeave }: MegaMenuPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute left-0 right-0 top-full z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Accent gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />

      <div className="relative overflow-hidden bg-gray-950">
        {/* Haier logo watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end">
          <Image
            src="/images/hero/haier-logo.png"
            alt=""
            width={500}
            height={200}
            className="mr-10 h-auto w-[400px] opacity-[0.03]"
            aria-hidden="true"
          />
        </div>

        {/* Subtle grid texture */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-8 xl:px-10">
          <div className="grid grid-cols-[280px_1fr_280px] gap-8">
            {/* Left column — Promo card */}
            <div className="flex flex-col">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="relative flex aspect-[4/3] items-center justify-center p-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
                  </div>
                  <Image
                    src={section.promoImage}
                    alt={section.categoryLabel}
                    width={300}
                    height={225}
                    className="relative z-10 h-auto max-h-[180px] w-auto object-contain"
                  />
                </div>
                <div className="border-t border-white/10 p-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-sky-400 ring-1 ring-sky-500/20">
                    {section.promoLabel}
                  </span>
                  <p className="mt-3 text-[13px] leading-relaxed text-gray-400">
                    {section.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Middle column — Series & products */}
            <div className="min-w-0">
              <div
                className="grid gap-8"
                style={{
                  gridTemplateColumns: `repeat(${section.columns.length}, minmax(0, 1fr))`,
                }}
              >
                {section.columns.map((col) => (
                  <div key={col.title}>
                    <h3 className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wider text-white">
                      {col.title}
                    </h3>
                    {col.subtitle && (
                      <span className="mt-0.5 block text-[11px] text-sky-400/80">
                        {col.subtitle}
                      </span>
                    )}

                    <ul className="mt-4 space-y-1">
                      {col.products.map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/produse/${section.categorySlug}/${p.slug}`}
                            className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-white/5"
                          >
                            <span className="inline-flex items-center rounded bg-white/5 px-2 py-0.5 text-[11px] font-medium text-sky-400 ring-1 ring-white/10">
                              {p.label.split('·')[0].trim()}
                            </span>
                            {p.label.includes('·') && (
                              <span className="text-[12px] text-gray-400 group-hover:text-gray-300">
                                {p.label.split('·')[1].trim()}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — Category preview */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Categorie
                </p>
                <h4 className="mt-2 font-[family-name:var(--font-display)] text-lg font-bold text-white">
                  {section.categoryLabel}
                </h4>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-400">
                  {section.description}
                </p>
                <Link
                  href={`/produse/${section.categorySlug}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-sky-600/25 transition-all hover:bg-sky-500 hover:shadow-sky-500/30"
                >
                  Vezi toate produsele
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>

              {/* Preview image */}
              <div className="mt-6 flex items-center justify-center">
                <Image
                  src={section.previewImage}
                  alt={section.categoryLabel}
                  width={240}
                  height={180}
                  className="h-auto max-h-[140px] w-auto object-contain opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
            <div className="flex items-center gap-6">
              <Link
                href={`/produse/${section.categorySlug}`}
                className="text-sm font-medium text-sky-400 transition-colors hover:text-sky-300"
              >
                Vezi toate produsele {section.categoryLabel} →
              </Link>
              <Link
                href="/oferta-personalizata"
                className="text-sm font-medium text-gray-400 transition-colors hover:text-sky-300"
              >
                Ofertă personalizată →
              </Link>
            </div>

            <a
              href={`tel:${CONTACT.phone}`}
              className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-300"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
              {CONTACT.phone}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

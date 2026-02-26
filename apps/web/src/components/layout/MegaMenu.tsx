'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

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
}

export const MENU_SECTIONS: MenuSection[] = [
  {
    key: 'climatizare',
    categorySlug: 'climatizare',
    categoryLabel: 'Climatizare',
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
  const colCount = section.columns.length

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

      <div className="bg-gray-900/98 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 py-8 xl:px-10">
          <div
            className="grid gap-10"
            style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
          >
            {section.columns.map((col) => (
              <div key={col.title}>
                {/* Column title */}
                <h3 className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wider text-white">
                  {col.title}
                </h3>
                {col.subtitle && (
                  <span className="mt-0.5 block text-[11px] text-sky-400/80">{col.subtitle}</span>
                )}

                {/* Product links */}
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

          {/* Footer */}
          <div className="mt-6 border-t border-white/10 pt-4">
            <Link
              href={`/produse/${section.categorySlug}`}
              className="text-sm font-medium text-sky-400 transition-colors hover:text-sky-300"
            >
              Vezi toate produsele {section.categoryLabel} →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

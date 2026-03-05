'use client'

import { motion } from 'framer-motion'
import type { ProductType } from '@/lib/recommendation'

interface StepProductTypeProps {
  onSelect: (type: ProductType) => void
}

const options: { type: ProductType; title: string; subtitle: string; icon: React.ReactNode }[] = [
  {
    type: 'ac',
    title: 'Aer condiționat',
    subtitle: 'Răcire eficientă + încălzire ușoară pentru spații interioare',
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    type: 'heat-pump',
    title: 'Pompă de căldură',
    subtitle: 'Încălzire principală + apă caldă menajeră pentru întreaga locuință',
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 6.51 6.51 0 009 11.5a3 3 0 105.356-1.857 6.474 6.474 0 011.006-4.429z" />
      </svg>
    ),
  },
]

export function StepProductType({ onSelect }: StepProductTypeProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10 text-center"
      >
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Ce soluție cauți?
        </h2>
        <p className="mt-3 text-gray-400">
          Selectează tipul de produs care se potrivește nevoilor tale
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {options.map((opt, i) => (
          <motion.button
            key={opt.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            onClick={() => onSelect(opt.type)}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-left backdrop-blur-sm transition-all duration-300 hover:border-sky-500/30 hover:bg-white/[0.08] hover:shadow-[0_0_30px_rgba(14,165,233,0.12)]"
          >
            <div className="mb-4 inline-flex rounded-xl bg-sky-500/10 p-3 text-sky-400 ring-1 ring-sky-500/20 transition-colors group-hover:bg-sky-500/20 group-hover:text-sky-300">
              {opt.icon}
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              {opt.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400 group-hover:text-gray-300">
              {opt.subtitle}
            </p>
            {/* Arrow indicator */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-sky-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import type { RoomSize } from '@/lib/recommendation'

interface StepRoomSizeProps {
  onSelect: (size: RoomSize) => void
}

const options: { value: RoomSize; label: string; subtitle: string; badge: string }[] = [
  { value: 'sub-25', label: 'Sub 25 m²', subtitle: 'Dormitor, birou', badge: '~9.000 BTU' },
  { value: '25-35', label: '25 – 35 m²', subtitle: 'Living mic, cameră mare', badge: '~12.000 BTU' },
  { value: '35-50', label: '35 – 50 m²', subtitle: 'Living, spațiu deschis', badge: '~18.000 BTU' },
  { value: '50-70', label: '50 – 70 m²', subtitle: 'Living mare, open-space', badge: '~24.000 BTU' },
]

export function StepRoomSize({ onSelect }: StepRoomSizeProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10 text-center"
      >
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Care este suprafața camerei?
        </h2>
        <p className="mt-3 text-gray-400">
          Selectează suprafața aproximativă pentru o recomandare precisă
        </p>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {options.map((opt, i) => (
          <motion.button
            key={opt.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            onClick={() => onSelect(opt.value)}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-sm transition-all duration-300 hover:border-sky-500/30 hover:bg-white/[0.08] hover:shadow-[0_0_30px_rgba(14,165,233,0.12)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  {opt.label}
                </h3>
                <p className="mt-1 text-sm text-gray-400 group-hover:text-gray-300">
                  {opt.subtitle}
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 ring-1 ring-sky-500/20">
                {opt.badge}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

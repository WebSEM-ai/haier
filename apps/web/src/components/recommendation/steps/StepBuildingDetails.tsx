'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Distribution, BuildingSize, Phase } from '@/lib/recommendation'

interface StepBuildingDetailsProps {
  onSubmit: (details: { distribution: Distribution; buildingSize: BuildingSize; phase: Phase }) => void
}

function Tile({
  selected,
  onClick,
  title,
  subtitle,
}: {
  selected: boolean
  onClick: () => void
  title: string
  subtitle?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition-all duration-200 ${
        selected
          ? 'border-sky-500/50 bg-sky-500/10 shadow-[0_0_20px_rgba(14,165,233,0.1)]'
          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]'
      }`}
    >
      <h4 className={`font-display text-sm font-semibold ${selected ? 'text-sky-400' : 'text-white'}`}>
        {title}
      </h4>
      {subtitle && (
        <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
      )}
    </button>
  )
}

export function StepBuildingDetails({ onSubmit }: StepBuildingDetailsProps) {
  const [distribution, setDistribution] = useState<Distribution | null>(null)
  const [buildingSize, setBuildingSize] = useState<BuildingSize | null>(null)
  const [phase, setPhase] = useState<Phase | null>(null)

  const isComplete = distribution && buildingSize && phase

  return (
    <div className="mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10 text-center"
      >
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Detalii despre locuință
        </h2>
        <p className="mt-3 text-gray-400">
          Completează toate cele 3 secțiuni pentru o recomandare precisă
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* Distribuție */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Sistem de distribuție
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Tile
              selected={distribution === 'pardoseala'}
              onClick={() => setDistribution('pardoseala')}
              title="Încălzire în pardoseală"
              subtitle="35-45°C temperatură apă"
            />
            <Tile
              selected={distribution === 'radiatoare'}
              onClick={() => setDistribution('radiatoare')}
              title="Radiatoare / Ventiloconvectoare"
              subtitle="45-55°C temperatură apă"
            />
          </div>
        </motion.div>

        {/* Dimensiune */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Dimensiune locuință
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <Tile
              selected={buildingSize === 'mica'}
              onClick={() => setBuildingSize('mica')}
              title="Mică"
              subtitle="< 120 m²"
            />
            <Tile
              selected={buildingSize === 'medie'}
              onClick={() => setBuildingSize('medie')}
              title="Medie"
              subtitle="120 – 200 m²"
            />
            <Tile
              selected={buildingSize === 'mare'}
              onClick={() => setBuildingSize('mare')}
              title="Mare"
              subtitle="> 200 m²"
            />
          </div>
        </motion.div>

        {/* Fază */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Alimentare electrică
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Tile
              selected={phase === 'mono'}
              onClick={() => setPhase('mono')}
              title="Monofazat"
              subtitle="230V standard"
            />
            <Tile
              selected={phase === 'tri'}
              onClick={() => setPhase('tri')}
              title="Trifazat"
              subtitle="400V"
            />
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-2"
        >
          <button
            disabled={!isComplete}
            onClick={() => {
              if (isComplete) onSubmit({ distribution, buildingSize, phase })
            }}
            className="w-full rounded-xl bg-sky-600 px-8 py-4 font-display text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-sky-600/25 transition-all hover:bg-sky-500 hover:shadow-sky-500/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            Continuă
          </button>
        </motion.div>
      </div>
    </div>
  )
}

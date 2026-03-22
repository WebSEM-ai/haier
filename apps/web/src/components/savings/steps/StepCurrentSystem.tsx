'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { SystemType, SystemAge } from '@/lib/savings'

interface StepCurrentSystemProps {
  onSelect: (type: SystemType, age?: SystemAge) => void
}

const SYSTEM_OPTIONS: { type: SystemType; label: string; desc: string; icon: React.ReactNode; hasAge: boolean }[] = [
  {
    type: 'ac',
    label: 'Aer condiționat',
    desc: 'Aer condiționat existent',
    hasAge: true,
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5m-16.5 0a2.25 2.25 0 00-2.25 2.25v6a2.25 2.25 0 002.25 2.25h16.5a2.25 2.25 0 002.25-2.25v-6a2.25 2.25 0 00-2.25-2.25m-16.5 0v-1.5A2.25 2.25 0 015.25 3.75h13.5A2.25 2.25 0 0121 6v1.5" />
      </svg>
    ),
  },
  {
    type: 'gas-boiler',
    label: 'Centrală pe gaz',
    desc: 'Încălzire cu gaz natural',
    hasAge: true,
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 6.51 6.51 0 009 11.855a.75.75 0 001.151.054l.33-.33a.75.75 0 00.153-.764A3.006 3.006 0 0112 8.022a3.006 3.006 0 012.362-2.808z" />
      </svg>
    ),
  },
  {
    type: 'electric',
    label: 'Calorifere electrice',
    desc: 'Radiatoare, convectoare',
    hasAge: false,
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    type: 'wood-pellet',
    label: 'Centrală pe lemne/peleți',
    desc: 'Încălzire cu combustibil solid',
    hasAge: true,
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    type: 'other',
    label: 'Altele',
    desc: 'Alt tip de sistem',
    hasAge: false,
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    type: 'none',
    label: 'Fără sistem',
    desc: 'Nu am nimic instalat',
    hasAge: false,
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const AGE_OPTIONS: { value: SystemAge; label: string }[] = [
  { value: '<5', label: '< 5 ani' },
  { value: '5-10', label: '5–10 ani' },
  { value: '10-15', label: '10–15 ani' },
  { value: '>15', label: '> 15 ani' },
]

export function StepCurrentSystem({ onSelect }: StepCurrentSystemProps) {
  const [selectedType, setSelectedType] = useState<SystemType | null>(null)

  function handleTypeSelect(type: SystemType, hasAge: boolean) {
    if (!hasAge) {
      onSelect(type)
      return
    }
    setSelectedType(type)
  }

  function handleAgeSelect(age: SystemAge) {
    if (selectedType) {
      onSelect(selectedType, age)
    }
  }

  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white sm:text-3xl">
        Ce sistem de încălzire/climatizare ai acum?
      </h2>
      <p className="mt-3 text-gray-400">
        Selectează tipul de sistem pe care îl folosești în prezent
      </p>

      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SYSTEM_OPTIONS.map((opt) => {
          const isSelected = selectedType === opt.type
          return (
            <motion.button
              key={opt.type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTypeSelect(opt.type, opt.hasAge)}
              className={`group relative flex items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
                isSelected
                  ? 'border-sky-500/50 bg-sky-500/10 shadow-lg shadow-sky-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
              }`}
            >
              <div
                className={`inline-flex rounded-xl p-3 ${
                  isSelected ? 'bg-sky-500/20 text-sky-400' : 'bg-white/10 text-gray-400 group-hover:text-white'
                }`}
              >
                {opt.icon}
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-white">
                  {opt.label}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">{opt.desc}</p>
              </div>
              <svg
                className={`absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-all ${
                  isSelected ? 'text-sky-400 opacity-100' : 'text-gray-600 opacity-0 group-hover:opacity-50'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          )
        })}
      </div>

      {/* Age sub-options */}
      {selectedType && (selectedType === 'ac' || selectedType === 'gas-boiler' || selectedType === 'wood-pellet') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="mt-8"
        >
          <p className="mb-4 text-sm text-gray-400">
            Câți ani are {selectedType === 'ac' ? 'aerul condiționat' : selectedType === 'gas-boiler' ? 'centrala pe gaz' : 'centrala pe lemne/peleți'}?
          </p>
          <div className="mx-auto flex max-w-md flex-wrap justify-center gap-2">
            {AGE_OPTIONS.map((opt) => (
              <motion.button
                key={opt.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAgeSelect(opt.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-white"
              >
                {opt.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Priority } from '@/lib/recommendation'

interface StepPrioritiesProps {
  onSubmit: (priorities: Priority[]) => void
}

const options: { value: Priority; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'efficiency',
    label: 'Eficiență energetică',
    description: 'Consum redus, clasă energetică superioară',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    value: 'silent',
    label: 'Funcționare silențioasă',
    description: 'Nivel de zgomot minim, ideal pentru dormitor',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    ),
  },
  {
    value: 'air-quality',
    label: 'Calitate aer & igienă',
    description: 'Sterilizare UV-C, purificare, filtru IFD',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    value: 'design',
    label: 'Design premium',
    description: 'Aspect elegant, serii premium Haier',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
  {
    value: 'value',
    label: 'Raport calitate-preț',
    description: 'Cea mai bună valoare la buget optim',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export function StepPriorities({ onSubmit }: StepPrioritiesProps) {
  const [selected, setSelected] = useState<Priority[]>([])

  function toggle(p: Priority) {
    setSelected((prev) => {
      if (prev.includes(p)) return prev.filter((v) => v !== p)
      if (prev.length >= 3) return prev
      return [...prev, p]
    })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10 text-center"
      >
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Ce contează cel mai mult?
        </h2>
        <p className="mt-3 text-gray-400">
          Selectează până la 3 priorități pentru recomandări personalizate
        </p>
      </motion.div>

      <div className="space-y-3">
        {options.map((opt, i) => {
          const isSelected = selected.includes(opt.value)
          const isDisabled = !isSelected && selected.length >= 3

          return (
            <motion.button
              key={opt.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              onClick={() => !isDisabled && toggle(opt.value)}
              disabled={isDisabled}
              className={`flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-sky-500/50 bg-sky-500/10 shadow-[0_0_20px_rgba(14,165,233,0.1)]'
                  : isDisabled
                    ? 'cursor-not-allowed border-white/5 bg-white/[0.02] opacity-40'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]'
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'bg-white/5 text-gray-500'
                }`}
              >
                {opt.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`font-display text-sm font-semibold ${isSelected ? 'text-sky-400' : 'text-white'}`}>
                  {opt.label}
                </h4>
                <p className="mt-0.5 text-xs text-gray-500">{opt.description}</p>
              </div>
              {/* Checkbox indicator */}
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-500'
                    : 'border-white/20 bg-transparent'
                }`}
              >
                {isSelected && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <button
          disabled={selected.length === 0}
          onClick={() => onSubmit(selected)}
          className="w-full rounded-xl bg-sky-600 px-8 py-4 font-display text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-sky-600/25 transition-all hover:bg-sky-500 hover:shadow-sky-500/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          Calculează recomandările
        </button>
        {selected.length > 0 && (
          <p className="mt-3 text-center text-xs text-gray-500">
            {selected.length}/3 priorități selectate
          </p>
        )}
      </motion.div>
    </div>
  )
}

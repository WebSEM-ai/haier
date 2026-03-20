'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '@/lib/payload'
import type {
  ProductType,
  RoomSize,
  BuildingSize,
  Priority,
  WizardAnswers,
  ScoredProduct,
} from '@/lib/recommendation'
import { scoreProducts } from '@/lib/recommendation'

// ── Types ────────────────────────────────────────────────────────────────────

type Destination = 'apartament' | 'vila' | 'birou' | 'comercial'
type AreaRange = 'sub-25' | '25-50' | '50-100' | '100-200' | 'peste-200'
type AdvisorStep = 'destination' | 'area' | 'priorities' | 'type'

interface ProductAdvisorProps {
  products: Product[]
  onResults: (scoredProducts: ScoredProduct[]) => void
  onReset: () => void
}

// ── Option button ────────────────────────────────────────────────────────────

function OptionButton({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
        selected
          ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <span className="text-xl">{icon}</span>
      {label}
    </button>
  )
}

function PriorityChip({
  label,
  selected,
  onClick,
  disabled,
}: {
  label: string
  selected: boolean
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled && !selected}
      className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
        selected
          ? 'border-sky-500 bg-sky-50 text-sky-700'
          : disabled
            ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export function ProductAdvisor({ products, onResults, onReset }: ProductAdvisorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<AdvisorStep>('destination')

  const [destination, setDestination] = useState<Destination | null>(null)
  const [area, setArea] = useState<AreaRange | null>(null)
  const [priorities, setPriorities] = useState<Priority[]>([])
  const [installType, setInstallType] = useState<ProductType | null>(null)

  const needsTypeStep = destination === 'vila' || destination === 'comercial' || (area && ['100-200', 'peste-200'].includes(area))

  function handleDestination(d: Destination) {
    setDestination(d)
    setStep('area')
  }

  function handleArea(a: AreaRange) {
    setArea(a)
    setStep('priorities')
  }

  function togglePriority(p: Priority) {
    setPriorities((prev) => {
      if (prev.includes(p)) return prev.filter((x) => x !== p)
      if (prev.length >= 2) return prev
      return [...prev, p]
    })
  }

  function handlePrioritiesSubmit() {
    if (needsTypeStep && !installType) {
      setStep('type')
      return
    }
    computeResults()
  }

  function handleTypeSelect(type: ProductType) {
    setInstallType(type)
    computeResultsWithType(type)
  }

  function computeResults() {
    computeResultsWithType(installType)
  }

  function computeResultsWithType(type: ProductType | null) {
    // Map destination + area to WizardAnswers
    const inferredType = type ?? inferProductType()
    const answers: WizardAnswers = {
      productType: inferredType,
      priorities: priorities.length > 0 ? priorities : ['efficiency'],
      ...(inferredType === 'ac' ? { roomSize: mapToRoomSize() } : { buildingSize: mapToBuildingSize() }),
    }

    const scored = scoreProducts(products, answers)
    onResults(scored)
    setIsOpen(false)
  }

  function inferProductType(): ProductType {
    if (destination === 'vila' && area && ['100-200', 'peste-200'].includes(area)) return 'heat-pump'
    if (destination === 'comercial' && area && ['100-200', 'peste-200'].includes(area)) return 'heat-pump'
    return 'ac'
  }

  function mapToRoomSize(): RoomSize {
    switch (area) {
      case 'sub-25': return 'sub-25'
      case '25-50': return '25-35'
      case '50-100': return '35-50'
      default: return '50-70'
    }
  }

  function mapToBuildingSize(): BuildingSize {
    switch (area) {
      case 'sub-25':
      case '25-50': return 'mica'
      case '50-100': return 'medie'
      default: return 'mare'
    }
  }

  function handleReset() {
    setStep('destination')
    setDestination(null)
    setArea(null)
    setPriorities([])
    setInstallType(null)
    onReset()
  }

  const stepNumber = step === 'destination' ? 1 : step === 'area' ? 2 : step === 'priorities' ? 3 : 4
  const totalSteps = needsTypeStep ? 4 : 3

  return (
    <div className="mb-6">
      {/* Collapsed state */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex w-full items-center gap-4 rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50 to-white p-4 text-left transition-all hover:border-sky-300 hover:shadow-md"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600 transition-colors group-hover:bg-sky-200">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Nu știi ce să alegi?</p>
            <p className="text-xs text-gray-500">Răspunde la câteva întrebări și îți recomandăm produsul potrivit</p>
          </div>
          <svg className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}

      {/* Expanded state */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-sky-200 bg-white p-5 shadow-sm">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Ghid de selecție</p>
                    <p className="text-xs text-gray-500">Pasul {stepNumber} din {totalSteps}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Progress bar */}
              <div className="mb-5 h-1 overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400"
                  animate={{ width: `${(stepNumber / totalSteps) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                />
              </div>

              {/* Steps */}
              <AnimatePresence mode="wait">
                {step === 'destination' && (
                  <motion.div key="destination" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <p className="mb-3 text-sm font-medium text-gray-700">Unde va fi instalat echipamentul?</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <OptionButton icon="🏢" label="Apartament" selected={destination === 'apartament'} onClick={() => handleDestination('apartament')} />
                      <OptionButton icon="🏡" label="Vilă / Casă" selected={destination === 'vila'} onClick={() => handleDestination('vila')} />
                      <OptionButton icon="🏬" label="Birou" selected={destination === 'birou'} onClick={() => handleDestination('birou')} />
                      <OptionButton icon="🏪" label="Spațiu comercial" selected={destination === 'comercial'} onClick={() => handleDestination('comercial')} />
                    </div>
                  </motion.div>
                )}

                {step === 'area' && (
                  <motion.div key="area" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <p className="mb-3 text-sm font-medium text-gray-700">Care este suprafața aproximativă?</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                      {([
                        { value: 'sub-25' as AreaRange, label: '< 25 m²' },
                        { value: '25-50' as AreaRange, label: '25–50 m²' },
                        { value: '50-100' as AreaRange, label: '50–100 m²' },
                        { value: '100-200' as AreaRange, label: '100–200 m²' },
                        { value: 'peste-200' as AreaRange, label: '> 200 m²' },
                      ]).map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleArea(opt.value)}
                          className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                            area === opt.value
                              ? 'border-sky-500 bg-sky-50 text-sky-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setStep('destination')} className="mt-3 text-xs font-medium text-gray-400 hover:text-gray-600">
                      ← Înapoi
                    </button>
                  </motion.div>
                )}

                {step === 'priorities' && (
                  <motion.div key="priorities" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <p className="mb-3 text-sm font-medium text-gray-700">Ce contează cel mai mult? <span className="text-gray-400">(max. 2)</span></p>
                    <div className="flex flex-wrap gap-2">
                      {([
                        { value: 'efficiency' as Priority, label: 'Eficiență energetică' },
                        { value: 'silent' as Priority, label: 'Liniște' },
                        { value: 'air-quality' as Priority, label: 'Calitate aer' },
                        { value: 'design' as Priority, label: 'Design' },
                        { value: 'value' as Priority, label: 'Preț accesibil' },
                      ]).map((opt) => (
                        <PriorityChip
                          key={opt.value}
                          label={opt.label}
                          selected={priorities.includes(opt.value)}
                          onClick={() => togglePriority(opt.value)}
                          disabled={priorities.length >= 2}
                        />
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <button onClick={() => setStep('area')} className="text-xs font-medium text-gray-400 hover:text-gray-600">
                        ← Înapoi
                      </button>
                      <button
                        onClick={handlePrioritiesSubmit}
                        disabled={priorities.length === 0}
                        className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {needsTypeStep ? 'Continuă' : 'Vezi recomandări'}
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'type' && (
                  <motion.div key="type" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <p className="mb-3 text-sm font-medium text-gray-700">Ce tip de instalație preferi?</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleTypeSelect('ac')}
                        className="rounded-xl border-2 border-gray-200 bg-white p-4 text-left transition-all hover:border-sky-300 hover:bg-sky-50"
                      >
                        <span className="text-2xl">❄️</span>
                        <p className="mt-2 text-sm font-semibold text-gray-900">Aer condiționat</p>
                        <p className="mt-1 text-xs text-gray-500">Răcire + încălzire pentru camere individuale</p>
                      </button>
                      <button
                        onClick={() => handleTypeSelect('heat-pump')}
                        className="rounded-xl border-2 border-gray-200 bg-white p-4 text-left transition-all hover:border-sky-300 hover:bg-sky-50"
                      >
                        <span className="text-2xl">🔥</span>
                        <p className="mt-2 text-sm font-semibold text-gray-900">Pompă de căldură</p>
                        <p className="mt-1 text-xs text-gray-500">Încălzire centrală eficientă pentru întreaga locuință</p>
                      </button>
                    </div>
                    <button onClick={() => setStep('priorities')} className="mt-3 text-xs font-medium text-gray-400 hover:text-gray-600">
                      ← Înapoi
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

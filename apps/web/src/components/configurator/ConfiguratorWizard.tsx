'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { StepSpaceType } from './StepSpaceType'
import { StepRoomConfig } from './StepRoomConfig'
import { ConfigResults } from './ConfigResults'
import { ConfigSummary } from './ConfigSummary'
import type { Product } from '@/lib/payload'
import type {
  SpaceType,
  RoomConfig,
  ThermalResult,
  ScoredProduct,
} from '@/lib/room-calculator'
import {
  getDefaultRoomsForSpace,
  calculateTotalThermal,
  scoreProductsForRoom,
  scoreProductsForTotal,
} from '@/lib/room-calculator'

interface ConfiguratorWizardProps {
  products: Product[]
}

type Step = 'space-type' | 'room-config' | 'results' | 'summary'

const STEP_LABELS = ['Tip spațiu', 'Configurare', 'Recomandări', 'Sumar']

function getStepIndex(step: Step): number {
  switch (step) {
    case 'space-type': return 0
    case 'room-config': return 1
    case 'results': return 2
    case 'summary': return 3
  }
}

function getStepNumber(step: Step): string {
  switch (step) {
    case 'space-type': return '01'
    case 'room-config': return '02'
    case 'results': return '03'
    case 'summary': return '04'
  }
}

type ProductTypeChoice = 'ac' | 'heat-pump'

const STORAGE_KEY = 'haier-configurator'

export function ConfiguratorWizard({ products }: ConfiguratorWizardProps) {
  const [step, setStep] = useState<Step>('space-type')
  const [direction, setDirection] = useState(1)
  const [productTypeChoice, setProductTypeChoice] = useState<ProductTypeChoice>('ac')

  const [spaceType, setSpaceType] = useState<SpaceType | null>(null)
  const [rooms, setRooms] = useState<RoomConfig[]>([])
  const [thermalResult, setThermalResult] = useState<ThermalResult | null>(null)
  const [scoredProducts, setScoredProducts] = useState<ScoredProduct[]>([])
  const [selectedProducts, setSelectedProducts] = useState<ScoredProduct[]>([])

  // Restore saved state from localStorage (rooms + step)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.rooms?.length) setRooms(data.rooms)
        if (data.spaceType) setSpaceType(data.spaceType)
        if (data.productType) setProductTypeChoice(data.productType)
        // Restore to room-config step if we have saved rooms
        if (data.rooms?.length && data.spaceType) {
          setStep('room-config')
        }
      }
    } catch { /* ignore */ }
  }, [])

  // Save rooms to localStorage on change
  useEffect(() => {
    if (rooms.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          rooms,
          spaceType,
          productType: productTypeChoice,
        }))
      } catch { /* ignore */ }
    }
  }, [rooms, spaceType, productTypeChoice])

  // Filter products by chosen type
  const filteredProducts = products.filter((p) => {
    if (productTypeChoice === 'heat-pump') {
      return p.productType === 'heat-pump' || p.categorySlug === 'pompe-caldura'
    }
    return !p.productType || p.productType === 'ac'
  })

  const stepIndex = getStepIndex(step)

  function goTo(next: Step) {
    const currentIdx = getStepIndex(step)
    const nextIdx = getStepIndex(next)
    setDirection(nextIdx >= currentIdx ? 1 : -1)
    setStep(next)
  }

  function handleSpaceType(type: SpaceType) {
    setSpaceType(type)
    const defaultRooms = getDefaultRoomsForSpace(type)
    setRooms(defaultRooms)
    goTo('room-config')
  }

  const handleRoomsChange = useCallback((updatedRooms: RoomConfig[]) => {
    setRooms(updatedRooms)
  }, [])

  function handleConfigComplete(finalRooms: RoomConfig[]) {
    setRooms(finalRooms)
    const thermal = calculateTotalThermal(finalRooms, spaceType!)
    setThermalResult(thermal)

    // Score products for total requirement (filtered by AC or heat pump)
    const scored = scoreProductsForTotal(filteredProducts, thermal.totalRequiredKw, spaceType!)
    setScoredProducts(scored)
    goTo('results')
  }

  function handleSelectProducts(selected: ScoredProduct[]) {
    setSelectedProducts(selected)
    goTo('summary')
  }

  function handleBackToConfig() {
    goTo('room-config')
  }

  function handleBackToResults() {
    goTo('results')
  }

  function handleReset() {
    setSpaceType(null)
    setRooms([])
    setThermalResult(null)
    setScoredProducts([])
    setSelectedProducts([])
    setDirection(-1)
    setStep('space-type')
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }

  const slideVariants = {
    enter: (d: number) => ({ x: d * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -60, opacity: 0 }),
  }

  return (
    <div className="relative min-h-screen bg-gray-950 pt-24 pb-16">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/5 blur-3xl" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/images/hero/haier-logo.png"
            alt=""
            width={500}
            height={200}
            className="h-auto w-[400px] select-none opacity-[0.03]"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Progress bar */}
        {step !== 'summary' && (
          <div className="mb-12">
            <div className="mx-auto flex max-w-lg items-center gap-2">
              {STEP_LABELS.slice(0, -1).map((label, i) => (
                <div key={label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400"
                      initial={{ width: '0%' }}
                      animate={{ width: stepIndex > i ? '100%' : stepIndex === i ? '50%' : '0%' }}
                      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    />
                  </div>
                  <span className={`text-[10px] font-medium uppercase tracking-wider ${
                    stepIndex >= i ? 'text-sky-400' : 'text-gray-600'
                  }`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ghost step number */}
        {step === 'space-type' && (
          <div className="pointer-events-none absolute left-1/2 top-32 -translate-x-1/2 select-none">
            <span
              className="block text-[200px] font-bold leading-none text-transparent"
              style={{ WebkitTextStroke: '1px rgba(255,255,255,0.03)' }}
            >
              {getStepNumber(step)}
            </span>
          </div>
        )}

        {/* Step content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            {step === 'space-type' && (
              <div>
                {/* Product type toggle */}
                <div className="mx-auto mb-10 flex max-w-md items-center justify-center">
                  <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
                    <button
                      onClick={() => setProductTypeChoice('ac')}
                      className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
                        productTypeChoice === 'ac'
                          ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/25'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                      </svg>
                      Aer condiționat
                    </button>
                    <button
                      onClick={() => setProductTypeChoice('heat-pump')}
                      className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
                        productTypeChoice === 'heat-pump'
                          ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/25'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                      </svg>
                      Pompă de căldură
                    </button>
                  </div>
                </div>
                <StepSpaceType onSelect={handleSpaceType} />
              </div>
            )}
            {step === 'room-config' && spaceType && (
              <StepRoomConfig
                spaceType={spaceType}
                initialRooms={rooms}
                products={filteredProducts}
                onRoomsChange={handleRoomsChange}
                onComplete={handleConfigComplete}
                onBack={() => { setDirection(-1); setStep('space-type') }}
              />
            )}
            {step === 'results' && thermalResult && (
              <ConfigResults
                spaceType={spaceType!}
                thermalResult={thermalResult}
                scoredProducts={scoredProducts}
                rooms={rooms}
                onSelectProducts={handleSelectProducts}
                onBack={handleBackToConfig}
                onReset={handleReset}
              />
            )}
            {step === 'summary' && thermalResult && selectedProducts.length > 0 && (
              <ConfigSummary
                spaceType={spaceType!}
                thermalResult={thermalResult}
                selectedProducts={selectedProducts}
                rooms={rooms}
                onBack={handleBackToResults}
                onReset={handleReset}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

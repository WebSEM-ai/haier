'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { StepProductType } from './steps/StepProductType'
import { StepRoomSize } from './steps/StepRoomSize'
import { StepBuildingDetails } from './steps/StepBuildingDetails'
import { StepPriorities } from './steps/StepPriorities'
import { Results } from './Results'
import { scoreProducts } from '@/lib/recommendation'
import type { Product } from '@/lib/payload'
import type {
  ProductType,
  RoomSize,
  Distribution,
  BuildingSize,
  Phase,
  Priority,
  WizardAnswers,
  ScoredProduct,
} from '@/lib/recommendation'

interface RecommendationWizardProps {
  products: Product[]
}

type Step = 'type' | 'room-size' | 'building-details' | 'priorities' | 'results'

const STEP_LABELS = ['Tip soluție', 'Detalii spațiu', 'Priorități', 'Rezultate']

function getStepIndex(step: Step, productType: ProductType | null): number {
  switch (step) {
    case 'type': return 0
    case 'room-size': return 1
    case 'building-details': return 1
    case 'priorities': return 2
    case 'results': return 3
  }
}

function getStepNumber(step: Step): string {
  switch (step) {
    case 'type': return '01'
    case 'room-size': return '02'
    case 'building-details': return '02'
    case 'priorities': return '03'
    case 'results': return '04'
  }
}

export function RecommendationWizard({ products }: RecommendationWizardProps) {
  const [step, setStep] = useState<Step>('type')
  const [direction, setDirection] = useState(1)

  // Answers
  const [productType, setProductType] = useState<ProductType | null>(null)
  const [roomSize, setRoomSize] = useState<RoomSize | null>(null)
  const [distribution, setDistribution] = useState<Distribution | null>(null)
  const [buildingSize, setBuildingSize] = useState<BuildingSize | null>(null)
  const [phase, setPhase] = useState<Phase | null>(null)
  const [priorities, setPriorities] = useState<Priority[]>([])

  const [results, setResults] = useState<ScoredProduct[]>([])

  const stepIndex = getStepIndex(step, productType)

  function goTo(next: Step) {
    const currentIdx = getStepIndex(step, productType)
    const nextIdx = getStepIndex(next, productType)
    setDirection(nextIdx >= currentIdx ? 1 : -1)
    setStep(next)
  }

  function handleProductType(type: ProductType) {
    setProductType(type)
    if (type === 'ac') {
      goTo('room-size')
    } else {
      goTo('building-details')
    }
  }

  function handleRoomSize(size: RoomSize) {
    setRoomSize(size)
    goTo('priorities')
  }

  function handleBuildingDetails(details: { distribution: Distribution; buildingSize: BuildingSize; phase: Phase }) {
    setDistribution(details.distribution)
    setBuildingSize(details.buildingSize)
    setPhase(details.phase)
    goTo('priorities')
  }

  function handlePriorities(p: Priority[]) {
    setPriorities(p)
    const answers: WizardAnswers = {
      productType: productType!,
      roomSize: roomSize ?? undefined,
      distribution: distribution ?? undefined,
      buildingSize: buildingSize ?? undefined,
      phase: phase ?? undefined,
      priorities: p,
    }
    const scored = scoreProducts(products, answers)
    setResults(scored)
    goTo('results')
  }

  function handleReset() {
    setProductType(null)
    setRoomSize(null)
    setDistribution(null)
    setBuildingSize(null)
    setPhase(null)
    setPriorities([])
    setResults([])
    setDirection(-1)
    setStep('type')
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
        {/* Grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:48px_48px]" />
        {/* Ambient glow */}
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/5 blur-3xl" />
        {/* Logo watermark */}
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

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Progress bar */}
        {step !== 'results' && (
          <div className="mb-12">
            <div className="mx-auto flex max-w-md items-center gap-2">
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
        {step !== 'results' && (
          <div className="pointer-events-none absolute left-1/2 top-32 -translate-x-1/2 select-none">
            <span
              className="block text-[200px] font-bold leading-none text-transparent"
              style={{ WebkitTextStroke: '1px rgba(255,255,255,0.03)' }}
            >
              {getStepNumber(step)}
            </span>
          </div>
        )}

        {/* Step content with directional slide animation */}
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
            {step === 'type' && (
              <StepProductType onSelect={handleProductType} />
            )}
            {step === 'room-size' && (
              <StepRoomSize onSelect={handleRoomSize} />
            )}
            {step === 'building-details' && (
              <StepBuildingDetails onSubmit={handleBuildingDetails} />
            )}
            {step === 'priorities' && (
              <StepPriorities onSubmit={handlePriorities} />
            )}
            {step === 'results' && (
              <Results results={results} onReset={handleReset} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

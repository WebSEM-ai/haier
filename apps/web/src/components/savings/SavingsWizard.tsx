'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { StepCurrentSystem } from './steps/StepCurrentSystem'
import { StepConsumption } from './steps/StepConsumption'
import { StepHaierProduct } from './steps/StepHaierProduct'
import { SavingsResults } from './SavingsResults'
import { calculateSavings, parseCapacity, parseNumeric } from '@/lib/savings'
import type { Product } from '@/lib/payload'
import type {
  SystemType,
  SystemAge,
  CurrentSystem,
  ConsumptionData,
  SavingsResult,
} from '@/lib/savings'

interface SavingsWizardProps {
  products: Product[]
}

type Step = 'system' | 'consumption' | 'product' | 'results'

const STEP_LABELS = ['Sistem actual', 'Consum', 'Produs Haier']

function getStepIndex(step: Step): number {
  switch (step) {
    case 'system': return 0
    case 'consumption': return 1
    case 'product': return 2
    case 'results': return 3
  }
}

function getStepNumber(step: Step): string {
  switch (step) {
    case 'system': return '01'
    case 'consumption': return '02'
    case 'product': return '03'
    case 'results': return '04'
  }
}

export function SavingsWizard({ products }: SavingsWizardProps) {
  const [step, setStep] = useState<Step>('system')
  const [direction, setDirection] = useState(1)

  // State
  const [currentSystem, setCurrentSystem] = useState<CurrentSystem | null>(null)
  const [consumption, setConsumption] = useState<ConsumptionData | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [result, setResult] = useState<SavingsResult | null>(null)

  const stepIndex = getStepIndex(step)

  function goTo(next: Step) {
    const currentIdx = getStepIndex(step)
    const nextIdx = getStepIndex(next)
    setDirection(nextIdx >= currentIdx ? 1 : -1)
    setStep(next)
  }

  function handleSystem(type: SystemType, age?: SystemAge) {
    setCurrentSystem({ type, age })
    goTo('consumption')
  }

  function handleConsumption(data: ConsumptionData) {
    setConsumption(data)
    goTo('product')
  }

  function handleProduct(product: Product) {
    setSelectedProduct(product)

    const capacityKw = parseCapacity(product.capacity)
    const seer = parseNumeric(product.seer) || 6.0
    const scop = parseNumeric(product.scop) || 4.0
    const coolingCap = parseCapacity(product.coolingCapacityNominal) || capacityKw
    const heatingCap = parseCapacity(product.heatingCapacityNominal) || capacityKw

    const savingsResult = calculateSavings({
      currentSystem: currentSystem!,
      consumption: consumption!,
      haierProduct: {
        seer,
        scop,
        coolingCapacity: coolingCap,
        heatingCapacity: heatingCap,
        capacityKw,
      },
    })

    setResult(savingsResult)
    goTo('results')
  }

  function handleResetProduct() {
    setSelectedProduct(null)
    setResult(null)
    goTo('product')
  }

  function handleResetAll() {
    setCurrentSystem(null)
    setConsumption(null)
    setSelectedProduct(null)
    setResult(null)
    setDirection(-1)
    setStep('system')
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

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Progress bar */}
        {step !== 'results' && (
          <div className="mb-12">
            <div className="mx-auto flex max-w-md items-center gap-2">
              {STEP_LABELS.map((label, i) => (
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
            {step === 'system' && (
              <StepCurrentSystem onSelect={handleSystem} />
            )}
            {step === 'consumption' && currentSystem && (
              <StepConsumption
                systemType={currentSystem.type}
                onSubmit={handleConsumption}
              />
            )}
            {step === 'product' && (
              <StepHaierProduct
                products={products}
                onSelect={handleProduct}
              />
            )}
            {step === 'results' && result && selectedProduct && (
              <SavingsResults
                result={result}
                product={selectedProduct}
                onResetProduct={handleResetProduct}
                onResetAll={handleResetAll}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

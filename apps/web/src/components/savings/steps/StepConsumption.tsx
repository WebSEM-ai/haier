'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DEFAULTS } from '@/lib/savings'
import type { SystemType, ConsumptionData } from '@/lib/savings'

interface StepConsumptionProps {
  systemType: SystemType
  onSubmit: (data: ConsumptionData) => void
}

type Mode = 'bill' | 'estimate'

export function StepConsumption({ systemType, onSubmit }: StepConsumptionProps) {
  const [mode, setMode] = useState<Mode>('bill')

  // Bill mode
  const [monthlyBill, setMonthlyBill] = useState(500)
  const [electricityPrice, setElectricityPrice] = useState<number>(DEFAULTS.electricityPrice)
  const [gasPrice, setGasPrice] = useState<number>(DEFAULTS.gasPrice)

  // Estimate mode
  const [area, setArea] = useState(60)
  const [hoursPerDay, setHoursPerDay] = useState(8)
  const [monthsCooling, setMonthsCooling] = useState(4)
  const [monthsHeating, setMonthsHeating] = useState(6)

  const isGas = systemType === 'gas-boiler'

  function handleSubmit() {
    if (mode === 'bill') {
      onSubmit({
        mode: 'bill',
        monthlyBill,
        electricityPrice,
        gasPrice: isGas ? gasPrice : DEFAULTS.gasPrice,
      })
    } else {
      onSubmit({
        mode: 'estimate',
        area,
        hoursPerDay,
        monthsCooling,
        monthsHeating,
      })
    }
  }

  return (
    <div className="mx-auto max-w-xl text-center">
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white sm:text-3xl">
        Cât consumi în prezent?
      </h2>
      <p className="mt-3 text-gray-400">
        Introdu datele despre consumul tău energetic
      </p>

      {/* Mode toggle */}
      <div className="mx-auto mt-8 inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          onClick={() => setMode('bill')}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${
            mode === 'bill'
              ? 'bg-sky-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Factură lunară
        </button>
        <button
          onClick={() => setMode('estimate')}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${
            mode === 'estimate'
              ? 'bg-sky-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Estimare spațiu
        </button>
      </div>

      <div className="mt-8 space-y-6 text-left">
        {mode === 'bill' ? (
          <motion.div
            key="bill"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Monthly bill */}
            <SliderField
              label="Factură lunară medie"
              value={monthlyBill}
              onChange={setMonthlyBill}
              min={200}
              max={2000}
              step={50}
              unit="lei/lună"
            />

            {/* Electricity price */}
            <SliderField
              label="Preț electricitate"
              value={electricityPrice}
              onChange={setElectricityPrice}
              min={0.80}
              max={2.00}
              step={0.05}
              unit="lei/kWh"
              decimals={2}
            />

            {/* Gas price — only for gas boiler */}
            {isGas && (
              <SliderField
                label="Preț gaz natural"
                value={gasPrice}
                onChange={setGasPrice}
                min={0.20}
                max={0.60}
                step={0.01}
                unit="lei/kWh"
                decimals={2}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="estimate"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Area */}
            <SliderField
              label="Suprafață"
              value={area}
              onChange={setArea}
              min={20}
              max={300}
              step={5}
              unit="m²"
            />

            {/* Hours per day */}
            <SliderField
              label="Ore utilizare / zi"
              value={hoursPerDay}
              onChange={setHoursPerDay}
              min={4}
              max={16}
              step={1}
              unit="ore"
            />

            {/* Months cooling */}
            <SliderField
              label="Luni răcire / an"
              value={monthsCooling}
              onChange={setMonthsCooling}
              min={0}
              max={12}
              step={1}
              unit="luni"
            />

            {/* Months heating */}
            <SliderField
              label="Luni încălzire / an"
              value={monthsHeating}
              onChange={setMonthsHeating}
              min={0}
              max={12}
              step={1}
              unit="luni"
            />
          </motion.div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-sky-600 px-8 py-3 font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-sky-600/25 transition-all hover:bg-sky-500 hover:shadow-sky-500/30"
      >
        Continuă
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
  )
}

// ── Slider field ─────────────────────────────────────────────────────────────

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  decimals = 0,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  unit: string
  decimals?: number
}) {
  const percent = ((value - min) / (max - min)) * 100

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <span className="font-[family-name:var(--font-display)] text-lg font-bold text-white">
          {decimals > 0 ? value.toFixed(decimals) : value}{' '}
          <span className="text-xs font-normal text-gray-500">{unit}</span>
        </span>
      </div>
      <div className="relative mt-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="slider-sky w-full cursor-pointer appearance-none bg-transparent"
          style={{
            background: `linear-gradient(to right, rgb(14 165 233) ${percent}%, rgba(255,255,255,0.1) ${percent}%)`,
            height: '6px',
            borderRadius: '3px',
          }}
        />
      </div>
    </div>
  )
}

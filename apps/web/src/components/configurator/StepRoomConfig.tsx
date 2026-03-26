'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoomVisualizer } from './RoomVisualizer'
import type { Product } from '@/lib/payload'
import type {
  SpaceType,
  RoomConfig,
  Orientation,
  InsulationLevel,
  WindowSize,
  RoomPreset,
} from '@/lib/room-calculator'
import {
  createRoom,
  SPACE_PRESETS,
  ROOM_PRESETS,
  calculateRoomThermalLoad,
  scoreProductsForRoom,
} from '@/lib/room-calculator'

interface StepRoomConfigProps {
  spaceType: SpaceType
  initialRooms: RoomConfig[]
  products: Product[]
  onRoomsChange: (rooms: RoomConfig[]) => void
  onComplete: (rooms: RoomConfig[]) => void
  onBack: () => void
}

const SPACE_LABELS: Record<SpaceType, string> = {
  apartament: 'Apartament',
  casa: 'Casă / Vilă',
  fitness: 'Sală de fitness',
  restaurant: 'Restaurant / Cafe',
  magazin: 'Magazin / Retail',
  pensiune: 'Pensiune / Hotel',
}

const ORIENTATION_OPTIONS: { value: Orientation; label: string }[] = [
  { value: 'N', label: 'Nord' },
  { value: 'E', label: 'Est' },
  { value: 'S', label: 'Sud' },
  { value: 'V', label: 'Vest' },
]

const INSULATION_OPTIONS: { value: InsulationLevel; label: string; desc: string }[] = [
  { value: 'slaba', label: 'Slabă', desc: 'Clădire veche, pereți subțiri' },
  { value: 'medie', label: 'Medie', desc: 'Izolație standard' },
  { value: 'buna', label: 'Bună', desc: 'Izolație termică performantă' },
]

const WINDOW_SIZE_OPTIONS: { value: WindowSize; label: string }[] = [
  { value: 'mica', label: 'Mică' },
  { value: 'medie', label: 'Medie' },
  { value: 'mare', label: 'Mare' },
]

const ROOM_PRESET_OPTIONS: { value: RoomPreset; label: string }[] = [
  { value: 'living', label: 'Living' },
  { value: 'dormitor', label: 'Dormitor' },
  { value: 'bucatarie', label: 'Bucătărie' },
  { value: 'birou', label: 'Birou' },
  { value: 'sala', label: 'Sală principală' },
  { value: 'receptie', label: 'Recepție' },
  { value: 'custom', label: 'Altă cameră' },
]

export function StepRoomConfig({
  spaceType,
  initialRooms,
  products,
  onRoomsChange,
  onComplete,
  onBack,
}: StepRoomConfigProps) {
  const [rooms, setRooms] = useState<RoomConfig[]>(initialRooms)
  const [activeRoomIndex, setActiveRoomIndex] = useState(0)

  const activeRoom = rooms[activeRoomIndex] || rooms[0]

  // Sync parent
  useEffect(() => {
    onRoomsChange(rooms)
  }, [rooms, onRoomsChange])

  const topProduct = useMemo(() => {
    if (!activeRoom) return null
    const thermal = calculateRoomThermalLoad(activeRoom, spaceType)
    const scored = scoreProductsForRoom(products, thermal.requiredKw, spaceType)
    return scored[0] || null
  }, [activeRoom, spaceType, products])

  const updateRoom = useCallback(
    (field: keyof RoomConfig, value: unknown) => {
      setRooms((prev) =>
        prev.map((r, i) => (i === activeRoomIndex ? { ...r, [field]: value } : r)),
      )
    },
    [activeRoomIndex],
  )

  function addRoom() {
    const preset = SPACE_PRESETS[spaceType]
    const newRoom = createRoom('custom', preset)
    setRooms((prev) => [...prev, newRoom])
    setActiveRoomIndex(rooms.length)
  }

  function removeRoom(index: number) {
    if (rooms.length <= 1) return
    setRooms((prev) => prev.filter((_, i) => i !== index))
    if (activeRoomIndex >= rooms.length - 1) {
      setActiveRoomIndex(Math.max(0, rooms.length - 2))
    }
  }

  const totalArea = rooms.reduce((s, r) => s + r.length * r.width, 0)

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 text-center"
      >
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Configurează spațiul
        </h2>
        <p className="mt-3 text-gray-400">
          {SPACE_LABELS[spaceType]} — ajustează dimensiunile și elementele termice
        </p>
      </motion.div>

      {/* Room tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6 flex flex-wrap items-center gap-2"
      >
        {rooms.map((room, i) => (
          <button
            key={room.id}
            onClick={() => setActiveRoomIndex(i)}
            className={`group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              i === activeRoomIndex
                ? 'bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30'
                : 'bg-white/5 text-gray-400 ring-1 ring-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {room.name}
            <span className="text-sm opacity-70">{Math.round(room.length * room.width)} m²</span>
            {rooms.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); removeRoom(i) }}
                className="ml-1 flex h-4 w-4 items-center justify-center rounded-full text-gray-600 opacity-0 transition-opacity hover:bg-white/10 hover:text-red-400 group-hover:opacity-100"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </button>
        ))}
        <button
          onClick={addRoom}
          className="flex items-center gap-1.5 rounded-xl border border-dashed border-white/15 px-4 py-2.5 text-sm text-gray-500 transition-all hover:border-sky-500/30 hover:text-sky-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Adaugă cameră
        </button>
        <div className="ml-auto text-xs text-gray-600">
          Total: <span className="font-bold text-gray-400">{Math.round(totalArea)} m²</span>
        </div>
      </motion.div>

      {/* Split screen: Config left, Visualizer right */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT: Configuration panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-5"
        >
          {/* Room preset */}
          <ConfigSection title="Tip cameră">
            <div className="flex flex-wrap gap-2">
              {ROOM_PRESET_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    const p = ROOM_PRESETS[opt.value]
                    updateRoom('preset', opt.value)
                    updateRoom('name', p.name)
                    updateRoom('length', p.defaultLength)
                    updateRoom('width', p.defaultWidth)
                  }}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                    activeRoom.preset === opt.value
                      ? 'bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30'
                      : 'bg-white/5 text-gray-300 ring-1 ring-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </ConfigSection>

          {/* Dimensions */}
          <ConfigSection title="Dimensiuni">
            <div className="space-y-4">
              <SliderField
                label="Lungime"
                value={activeRoom.length}
                min={2}
                max={20}
                step={0.5}
                unit="m"
                onChange={(v) => updateRoom('length', v)}
              />
              <SliderField
                label="Lățime"
                value={activeRoom.width}
                min={2}
                max={15}
                step={0.5}
                unit="m"
                onChange={(v) => updateRoom('width', v)}
              />
              <SliderField
                label="Înălțime plafon"
                value={activeRoom.ceilingHeight}
                min={2.3}
                max={5}
                step={0.1}
                unit="m"
                onChange={(v) => updateRoom('ceilingHeight', v)}
              />
            </div>
          </ConfigSection>

          {/* Thermal elements */}
          <ConfigSection title="Elemente termice">
            <div className="space-y-4">
              {/* Windows */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M12 3.75v16.5" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-gray-300">Ferestre</span>
                </div>
                <CounterControl
                  value={activeRoom.windows}
                  min={0}
                  max={8}
                  onChange={(v) => updateRoom('windows', v)}
                />
              </div>

              {/* Window size */}
              {activeRoom.windows > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-10"
                >
                  <div className="flex gap-2">
                    {WINDOW_SIZE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateRoom('windowSize', opt.value)}
                        className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all ${
                          activeRoom.windowSize === opt.value
                            ? 'bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30'
                            : 'bg-white/5 text-gray-400 ring-1 ring-white/10 hover:bg-white/10'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Exterior doors */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-7.5h-3m3 0v3m0-3l-4.5 4.5" />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-300">Uși exterioare</span>
                </div>
                <CounterControl
                  value={activeRoom.exteriorDoors}
                  min={0}
                  max={4}
                  onChange={(v) => updateRoom('exteriorDoors', v)}
                />
              </div>

              {/* Orientation */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-300">Orientare principală</span>
                </div>
                <div className="ml-10 flex gap-2">
                  {ORIENTATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateRoom('orientation', opt.value)}
                      className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all ${
                        activeRoom.orientation === opt.value
                          ? 'bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30'
                          : 'bg-white/5 text-gray-400 ring-1 ring-white/10 hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Insulation */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-300">Izolație termică</span>
                </div>
                <div className="ml-10 space-y-2">
                  {INSULATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateRoom('insulation', opt.value)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
                        activeRoom.insulation === opt.value
                          ? 'bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30'
                          : 'bg-white/5 text-gray-400 ring-1 ring-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className={`h-2 w-2 rounded-full ${
                        activeRoom.insulation === opt.value ? 'bg-sky-400' : 'bg-gray-600'
                      }`} />
                      <div>
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-xs text-gray-500">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ConfigSection>
        </motion.div>

        {/* RIGHT: Visualizer */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <RoomVisualizer
            room={activeRoom}
            spaceType={spaceType}
            topProduct={topProduct}
          />

          {/* Top product preview */}
          {topProduct && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15">
                  <svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-gray-500">Cel mai potrivit pentru această cameră</div>
                  <div className="font-display text-sm font-bold text-white">{topProduct.product.title}</div>
                </div>
                <div className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-bold text-sky-400">
                  {topProduct.score}%
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 flex items-center justify-between"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Înapoi
        </button>
        <button
          onClick={() => onComplete(rooms)}
          className="flex items-center gap-2 rounded-xl bg-sky-600 px-8 py-3 font-display text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-sky-600/25 transition-all hover:bg-sky-500 hover:shadow-sky-500/30"
        >
          Vezi recomandările
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </motion.div>
    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ConfigSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">{title}</h3>
      {children}
    </div>
  )
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (v: number) => void
}) {
  const percent = ((value - min) / (max - min)) * 100

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="font-display text-lg font-bold text-white">
          {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="slider-sky w-full cursor-pointer appearance-none rounded-full bg-transparent"
        style={{
          background: `linear-gradient(to right, rgb(14 165 233) ${percent}%, rgba(255,255,255,0.1) ${percent}%)`,
          height: '8px',
        }}
      />
      <div className="mt-1 flex justify-between text-xs text-gray-500">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}

function CounterControl({
  value,
  min,
  max,
  onChange,
}: {
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => value > min && onChange(value - 1)}
        disabled={value <= min}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
        </svg>
      </button>
      <span className="flex h-9 w-12 items-center justify-center font-display text-lg font-bold text-white">
        {value}
      </span>
      <button
        onClick={() => value < max && onChange(value + 1)}
        disabled={value >= max}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 ring-1 ring-white/10 transition-all hover:bg-sky-500/20 hover:text-sky-400 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  )
}

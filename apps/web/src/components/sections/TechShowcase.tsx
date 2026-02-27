'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
  {
    id: 'aer-conditionat',
    category: 'Aer Condiționat',
    title: 'Unitate\nInterioară',
    subtitle: 'Tehnologie de ultimă generație',
    image: '/images/sectiuni/schema-unitate-interioara.jpg',
    imageAlt: 'Schemă tehnică unitate interioară aer condiționat Haier',
    series: ['Revive Plus', 'Pearl', 'Flexis Plus', 'Tide Green Plus'],
    highlights: [
      { label: 'Super silențios', value: '15 dB(A)' },
      { label: 'Refrigerant ecologic', value: 'R32' },
      { label: 'Conectivitate', value: 'Wi-Fi integrat' },
      { label: 'Climat extrem', value: '-30°C / -20°C' },
    ],
    features: [
      'Ionizator Nano Aqua — Protejează sănătatea',
      'Ecopilot — Senzor uman și senzor de lumină',
      'Design 3D pentru flux de aer natural',
      'Funcționare în climat dur, încălzire la -30°C',
    ],
    cta: { label: 'Vezi gamele', href: '/produse/climatizare' },
  },
  {
    id: 'pompa-caldura',
    category: 'Pompe de Căldură',
    title: 'Unitate\nExterioară',
    subtitle: 'Eficiență maximă, impact minim',
    image: '/images/sectiuni/schema-unitate-exterioara.jpg',
    imageAlt: 'Schemă tehnică unitate exterioară pompa de căldură Haier',
    series: ['Super Aqua', 'ThermaFlex', 'AU082FYCRA(HW)'],
    highlights: [
      { label: 'Refrigerant natural', value: 'R290' },
      { label: 'Compresor', value: 'Inverter avansat' },
      { label: 'Instalare', value: 'Design prietenos' },
      { label: 'Performanță', value: 'Clasă A+++' },
    ],
    features: [
      'Vaporizator cu aripioare — eficiență superioară',
      'Racorduri apă tur-retur (split)',
      'Compresor Inverter avansat',
      'Concept de design prietenos pentru instalatori',
    ],
    cta: { label: 'Vezi gamele', href: '/produse/pompe-de-caldura' },
  },
]

const INTERVAL = 8000

export function TechShowcase() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > active ? 1 : -1)
      setActive(index)
    },
    [active],
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setActive((prev) => (prev + 1) % slides.length)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [active])

  const slide = slides[active]

  return (
    <section className="relative overflow-hidden bg-[#f8f9fa]">
      {/* Subtle blueprint grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.018)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.018)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Top accent line */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28 xl:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-sky-600">
            Descoperă Tehnologia
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Diagrame Tehnice
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-500">
            Explorează arhitectura și componentele cheie ale sistemelor Haier de climatizare
            rezidențială și pompe de căldură.
          </p>
        </motion.div>

        {/* Tab navigation */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex gap-2 rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm">
            {slides.map((s, i) => {
              const isActive = active === i
              return (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  className={`relative rounded-xl px-6 py-3 text-sm font-semibold transition-colors ${
                    isActive ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tech-tab-bg"
                      className="absolute inset-0 rounded-xl bg-gray-900"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{s.category}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
          >
            {/* Left: Image */}
            <div className="relative">
              {/* Soft glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-96 w-96 rounded-full bg-sky-100/60 blur-3xl" />
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-gray-200/60 bg-white/80 p-4 shadow-xl shadow-gray-200/40 backdrop-blur-sm">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  width={800}
                  height={1000}
                  className="h-auto w-full rounded-2xl object-contain"
                  priority
                />
              </div>

              {/* Progress bar */}
              <div className="mt-6 flex items-center gap-3">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="relative h-1 flex-1 overflow-hidden rounded-full bg-gray-200"
                  >
                    {active === i && (
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-sky-500 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <p className="text-xs font-medium uppercase tracking-widest text-sky-600">
                  {slide.subtitle}
                </p>
                <h3 className="mt-3 font-display text-4xl font-bold uppercase leading-tight tracking-tight text-gray-900 sm:text-5xl">
                  {slide.title.split('\n').map((line, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </h3>
              </motion.div>

              {/* Highlights grid */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-8 grid grid-cols-2 gap-3"
              >
                {slide.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                      {h.label}
                    </p>
                    <p className="mt-1 text-sm font-bold text-gray-900">{h.value}</p>
                  </div>
                ))}
              </motion.div>

              {/* Features list */}
              <motion.ul
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-8 space-y-3"
              >
                {slide.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-sky-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </motion.ul>

              {/* Series badges */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="mt-8"
              >
                <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-gray-400">
                  Game de produse
                </p>
                <div className="flex flex-wrap gap-2">
                  {slide.series.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-semibold text-sky-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mt-10"
              >
                <Link
                  href={slide.cta.href}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition-all hover:bg-gray-800 hover:shadow-gray-900/30"
                >
                  {slide.cta.label}
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom accent line */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent" />
    </section>
  )
}

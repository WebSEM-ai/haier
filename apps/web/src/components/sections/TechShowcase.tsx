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
    <section className="relative overflow-hidden bg-[#e8e8ea]">
      {/* Top accent line */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 pt-14 pb-12 lg:pt-16 lg:pb-14 xl:px-10">
        {/* Section header — compact */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-sky-600">
              Descoperă Tehnologia
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-bold uppercase tracking-tight text-gray-900 sm:text-3xl">
              Diagrame Tehnice
            </h2>
          </div>

          {/* Tab navigation — inline with header */}
          <div className="inline-flex gap-1.5 rounded-xl border border-gray-300/60 bg-white/60 p-1 backdrop-blur-sm">
            {slides.map((s, i) => {
              const isActive = active === i
              return (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  className={`relative rounded-lg px-5 py-2 text-xs font-semibold transition-colors ${
                    isActive ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tech-tab-bg"
                      className="absolute inset-0 rounded-lg bg-gray-900"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{s.category}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Main content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="grid items-center gap-6 lg:grid-cols-[1fr_380px] lg:gap-10"
          >
            {/* Left: Image — seamless, no card/border */}
            <div className="relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Fade edges to blend with section background */}
                <div className="pointer-events-none absolute inset-0 z-10" style={{
                  boxShadow: 'inset 0 0 60px 40px #e8e8ea',
                }} />

                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  width={800}
                  height={1000}
                  className="h-auto max-h-[520px] w-full object-contain"
                  priority
                />
              </div>

              {/* Progress bar — tight under image */}
              <div className="mx-auto mt-3 flex max-w-xs items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-gray-300"
                  >
                    {active === i && (
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-sky-500"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Content — compact */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <p className="text-[11px] font-medium uppercase tracking-widest text-sky-600">
                  {slide.subtitle}
                </p>
                <h3 className="mt-2 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-gray-900 sm:text-4xl">
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-5 grid grid-cols-2 gap-2"
              >
                {slide.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-white/50 px-3 py-2 backdrop-blur-sm"
                  >
                    <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                      {h.label}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-gray-900">{h.value}</p>
                  </div>
                ))}
              </motion.div>

              {/* Features list */}
              <motion.ul
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-5 space-y-2"
              >
                {slide.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] leading-snug text-gray-600">
                    <svg
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500"
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

              {/* Series badges + CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mt-5"
              >
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-400">
                  Game de produse
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {slide.series.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-sky-200/80 bg-sky-50/70 px-3 py-1 text-[11px] font-semibold text-sky-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <Link
                  href={slide.cta.href}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/15 transition-all hover:bg-gray-800"
                >
                  {slide.cta.label}
                  <svg
                    className="h-3.5 w-3.5"
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

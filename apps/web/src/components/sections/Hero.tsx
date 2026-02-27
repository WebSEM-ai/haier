'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface HotSpot {
  label: string
  detail: string
  top: string
  left: string
}

interface Slide {
  id: string
  bg: string
  product: string
  subtitle: string
  title: string
  titleLine2: string
  cta: string
  ctaLink: string
  watermarkText: string
  hotspots: HotSpot[]
  descTitle: string
  description: string
}

const slides: Slide[] = [
  {
    id: 'climatizare',
    bg: '/images/hero/hero-bg.webp',
    product: '/images/hero/hero-ac-unit.png',
    subtitle: 'Tehnologia viitorului, disponibilă azi!',
    title: 'SISTEME DE',
    titleLine2: 'CLIMATIZARE',
    cta: 'Vezi climatizatoare',
    ctaLink: '/produse/climatizare',
    watermarkText: 'A+++',
    hotspots: [
      { label: 'Wi-Fi integrat', detail: 'Control de la distanță prin aplicație mobilă hOn', top: '18%', left: '55%' },
      { label: 'R32 Ecologic', detail: 'Refrigerant nou cu potențial redus de încălzire globală', top: '42%', left: '15%' },
      { label: 'Ultra silențios', detail: 'Nivel de zgomot scăzut la doar 15 dB(A)', top: '65%', left: '70%' },
      { label: 'Inverter', detail: 'Compresor inverter cu eficiență energetică A+++', top: '80%', left: '30%' },
    ],
    descTitle: 'CLIMATIZARE',
    description: 'Gamă completă de aparate de aer condiționat cu tehnologie inverter, ionizare Nano Aqua și control Wi-Fi. Eficiență energetică până la clasa A+++ și nivel de zgomot de doar 15 dB(A).',
  },
  {
    id: 'pompe-caldura',
    bg: '/images/hero/naglowek-tlo-pompy-ciepla.webp',
    product: '/images/hero/hero-pompa-caldura.png',
    subtitle: 'Eficiență energetică maximă!',
    title: 'POMPE DE',
    titleLine2: 'CĂLDURĂ',
    cta: 'Vezi pompe de căldură',
    ctaLink: '/produse/pompe-de-caldura',
    watermarkText: 'R290',
    hotspots: [
      { label: 'Super Aqua', detail: 'Tehnologie avansată pentru încălzire și apă caldă', top: '15%', left: '60%' },
      { label: 'R290 Natural', detail: 'Refrigerant ecologic cu impact minim asupra mediului', top: '35%', left: '20%' },
      { label: 'Compresor Inverter', detail: 'Eficiență maximă și funcționare silențioasă', top: '60%', left: '65%' },
      { label: 'Climat extrem', detail: 'Funcționare la -30°C încălzire și -20°C răcire', top: '80%', left: '35%' },
    ],
    descTitle: 'POMPE DE CĂLDURĂ',
    description: 'Destinate încălzirii locuinței și preparării apei calde menajere. Disponibile în variante monofuncționale (apă caldă) și bifuncționale (încălzire + apă caldă), cu refrigerant natural R290.',
  },
]

const INTERVAL = 7000

function HotSpotButton({ spot, index }: { spot: HotSpot; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5 + index * 0.12, type: 'spring', stiffness: 260, damping: 20 }}
      className="absolute z-20"
      style={{ top: spot.top, left: spot.left }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen(!open)}
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 animate-ping rounded-full bg-white/20" />

      {/* Button */}
      <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-lg font-light text-white backdrop-blur-md transition-all hover:scale-110 hover:border-white/70 hover:bg-white/20">
        +
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-full z-30 mt-3 w-52 -translate-x-1/2 rounded-xl border border-white/15 bg-gray-950/90 px-4 py-3 backdrop-blur-xl"
          >
            {/* Arrow */}
            <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-white/15 bg-gray-950/90" />
            <p className="text-xs font-bold uppercase tracking-wider text-white">{spot.label}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-gray-400">{spot.detail}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const textVariants = {
  enter: (d: number) => ({ opacity: 0, x: d * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -60 }),
}

const productVariants = {
  enter: (d: number) => ({ opacity: 0, x: d * 80, scale: 0.92 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (d: number) => ({ opacity: 0, x: d * -80, scale: 0.92 }),
}

export function Hero() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1)
      setCurrent(index)
    },
    [current],
  )

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, INTERVAL)
    return () => clearInterval(timer)
  }, [next])

  const slide = slides[current]

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden bg-gray-950">
      {/* Background image */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={slide.bg}
            alt=""
            fill
            className="object-cover"
            priority={current === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/50" />
        </motion.div>
      </AnimatePresence>

      {/* Haier logo watermark — center background */}
      <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
        <Image
          src="/images/hero/haier-logo.png"
          alt=""
          width={500}
          height={500}
          className="h-auto w-[340px] select-none opacity-[0.03] lg:w-[500px]"
        />
      </div>

      {/* Large watermark text (A+++ / R290) — top right, faded */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`wm-${current}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute right-6 top-24 z-[2] select-none lg:right-16 lg:top-28"
        >
          <span
            className="font-display text-[120px] font-bold uppercase leading-none tracking-tight lg:text-[200px] xl:text-[260px]"
            style={{
              WebkitTextStroke: '1px rgba(255,255,255,0.08)',
              color: 'transparent',
            }}
          >
            {slide.watermarkText}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left — Text */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`text-${current}`}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="max-w-xl"
              >
                <p className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-400 lg:text-base">
                  {slide.subtitle}
                </p>
                <h1 className="mb-8 font-display text-5xl font-bold uppercase leading-none tracking-tight text-white lg:text-7xl xl:text-8xl">
                  {slide.title}
                  <br />
                  {slide.titleLine2}
                </h1>
                <Link
                  href={slide.ctaLink}
                  className="group inline-flex items-center gap-2 rounded-full border-2 border-white px-10 py-4 font-display text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-white hover:text-gray-900"
                >
                  {slide.cta}
                  <svg
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Right — Product with hotspots + description */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`product-${current}`}
                custom={direction}
                variants={productVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                className="relative flex flex-col items-center lg:items-end"
              >
                {/* Product image */}
                <div className="relative h-[28vh] max-h-[380px] lg:h-[40vh]">
                  <Image
                    src={slide.product}
                    alt={`${slide.title} ${slide.titleLine2}`}
                    width={650}
                    height={650}
                    className="h-full w-auto object-contain drop-shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                    priority={current === 0}
                  />

                  {/* Hotspots */}
                  {slide.hotspots.map((spot, i) => (
                    <HotSpotButton key={`${slide.id}-${i}`} spot={spot} index={i} />
                  ))}
                </div>

                {/* Description text below product */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-6 max-w-md text-right"
                >
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                    {slide.descTitle}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-gray-400">
                    {slide.description}
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all hover:border-white/60 hover:bg-white/10 hover:text-white lg:left-8"
        aria-label="Slide anterior"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all hover:border-white/60 hover:bg-white/10 hover:text-white lg:right-8"
        aria-label="Slide următor"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            aria-label={`Slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current
                ? 'w-8 bg-white'
                : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

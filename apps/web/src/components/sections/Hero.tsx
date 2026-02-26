'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface Slide {
  bg: string
  product: string
  subtitle: string
  title: string
  titleLine2?: string
  cta: string
  ctaLink: string
  productLabels?: { text: string; top?: string; bottom?: string; right?: string; left?: string }[]
  watermark?: string
}

const slides: Slide[] = [
  {
    bg: '/images/hero/hero-bg.webp',
    product: '/images/hero/ac-units.webp',
    subtitle: 'Tehnologia viitorului, disponibilă azi!',
    title: 'SISTEME DE',
    titleLine2: 'CLIMATIZARE',
    cta: 'Vezi climatizatoare',
    ctaLink: '/produse/climatizare',
  },
  {
    bg: '/images/hero/naglowek-tlo-pompy-ciepla.webp',
    product: '/images/hero/naglowek-pompa-ciepla.webp',
    subtitle: 'Eficiență energetică maximă!',
    title: 'POMPE DE',
    titleLine2: 'CĂLDURĂ',
    cta: 'Vezi pompe de căldură',
    ctaLink: '/produse/pompe-de-caldura',
    watermark: '/images/hero/oznaczeniea.webp',
  },
  {
    bg: '/images/hero/naglowek-tlo.webp',
    product: '/images/hero/naglowek-mrv-chiller.webp',
    subtitle: 'Soluții profesionale pentru business!',
    title: 'CHILLER',
    titleLine2: 'ȘI MRV',
    cta: 'Solicită ofertă',
    ctaLink: '/cerere-oferta',
  },
]

const INTERVAL = 6000

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

  const bgVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const textVariants = {
    enter: (d: number) => ({ opacity: 0, x: d * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -60 }),
  }

  const productVariants = {
    enter: (d: number) => ({ opacity: 0, x: d * 80, scale: 0.9 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: d * -80, scale: 0.9 }),
  }

  return (
    <section className="relative h-screen min-h-[600px] max-h-[850px] overflow-hidden bg-gray-950">
      {/* Background */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/50" />
        </motion.div>
      </AnimatePresence>

      {/* Watermark (A+++ for pompe de caldura) */}
      {slide.watermark && (
        <div className="absolute bottom-0 right-0 z-[1] opacity-30">
          <Image
            src={slide.watermark}
            alt=""
            width={600}
            height={250}
            className="pointer-events-none select-none"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
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
                  {slide.titleLine2 && (
                    <>
                      <br />
                      {slide.titleLine2}
                    </>
                  )}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Right — Product */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`product-${current}`}
                custom={direction}
                variants={productVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                className="relative flex items-center justify-center lg:justify-end"
              >
                <div className="relative h-[35vh] max-h-[500px] lg:h-[50vh]">
                  <Image
                    src={slide.product}
                    alt={slide.title}
                    width={700}
                    height={700}
                    className="h-full w-auto object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.4)]"
                    priority={current === 0}
                  />
                  {/* Plus button decorative — glass */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                    className="absolute -left-2 top-1/4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white/10 text-2xl font-light text-white backdrop-blur-sm"
                  >
                    +
                  </motion.div>
                </div>
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

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const panels = [
  {
    id: 'no1',
    tab: 'Nr. 1 Global',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    subtitle: 'Brandul Nr. 1 în lume',
    heading: 'Marca Nr. 1\nîn lume',
    body: (
      <>
        Haier este marca <strong className="text-white">Nr. 1</strong> în lume pentru
        echipamente de climatizare conectate și controlate de la distanță,{' '}
        <strong className="text-white">cu o cotă de piață de peste 33%</strong> la nivel global.
      </>
    ),
    badge: 'Calitate confirmată de certificatele Euromonitor International.',
    badgeIcon: (
      <svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    image: '/images/sections/grafika-no1.webp',
    imageAlt: 'Haier Nr. 1 Global Connected Air Conditioner Brand',
  },
  {
    id: 'garantie',
    tab: 'Garanție 5 ani',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    subtitle: 'Fiabilitate garantată',
    heading: 'Garanție extinsă\nde 5 ani',
    body: (
      <>
        Utilizarea celor mai avansate tehnologii ne permite să oferim{' '}
        <strong className="text-white">garanție completă de 5 ani</strong> pentru toate
        sistemele de climatizare și pompele de căldură Haier — inclusiv piese de schimb gratuite.
      </>
    ),
    badge: 'Echipamente prietenoase cu mediul, confortabile și construite solid.',
    badgeIcon: (
      <svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384-3.19a1.5 1.5 0 010-2.58l5.384-3.192a1.5 1.5 0 011.56 0l5.384 3.192a1.5 1.5 0 010 2.58l-5.384 3.19a1.5 1.5 0 01-1.56 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2.042-1.2M21 12l-2.042-1.2M3 12v5.586c0 .528.278 1.018.734 1.289l7.5 4.43a1.5 1.5 0 001.532 0l7.5-4.43c.456-.271.734-.761.734-1.29V12M3 12l9 5.25 9-5.25M12 22.5V17.25" />
      </svg>
    ),
    image: '/images/sections/grafika-gwarancja-pompa.webp',
    imageAlt: 'Haier unitate exterioară cu garanție 5 ani',
    cta: { label: 'Garanție', href: '/contact' },
  },
]

export function BrandShowcase() {
  const [active, setActive] = useState(0)
  const panel = panels[active]

  return (
    <section className="relative overflow-hidden bg-gray-950">
      {/* Subtle grid texture */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative grid lg:grid-cols-[280px_1fr]">
        {/* Left: Vertical tabs */}
        <div className="flex flex-row gap-2 border-b border-white/10 px-6 py-4 lg:flex-col lg:justify-center lg:gap-3 lg:border-b-0 lg:border-r lg:px-8 lg:py-20">
          {panels.map((p, i) => {
            const isActive = active === i
            return (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                className={`group relative flex items-center gap-3 rounded-xl px-5 py-4 text-left transition-all ${
                  isActive
                    ? 'bg-white/10 text-white shadow-lg shadow-white/5'
                    : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="brand-tab-indicator"
                    className="absolute inset-0 rounded-xl ring-1 ring-sky-500/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <span className={`relative z-10 shrink-0 ${isActive ? 'text-sky-400' : ''}`}>
                  {p.icon}
                </span>
                <span className="relative z-10 font-display text-xs font-semibold uppercase tracking-wider">
                  {p.tab}
                </span>
              </button>
            )
          })}
        </div>

        {/* Right: Content area */}
        <div className="relative min-h-[600px] lg:min-h-[700px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={panel.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid h-full md:grid-cols-2"
            >
              {/* Text content */}
              <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:py-20 lg:px-16">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <p className="text-xs font-medium uppercase tracking-widest text-sky-400">
                    {panel.subtitle}
                  </p>

                  <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {panel.heading.split('\n').map((line, i) => (
                      <span key={i}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </h2>

                  <p className="mt-6 max-w-md text-base leading-relaxed text-gray-400">
                    {panel.body}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-8"
                >
                  {/* Badge / certification */}
                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4">
                    <span className="mt-0.5 shrink-0">{panel.badgeIcon}</span>
                    <p className="text-sm font-medium leading-relaxed text-gray-300">
                      {panel.badge}
                    </p>
                  </div>

                  {panel.cta && (
                    <Link
                      href={panel.cta.href}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-sky-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 transition-all hover:bg-sky-500 hover:shadow-sky-500/30"
                    >
                      {panel.cta.label}
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  )}
                </motion.div>
              </div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="relative flex items-center justify-center px-6 py-12 md:px-0 md:py-0"
              >
                {/* Glow effect behind image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
                </div>

                <Image
                  src={panel.image}
                  alt={panel.imageAlt}
                  width={800}
                  height={600}
                  className="relative z-10 h-auto max-h-[500px] w-auto max-w-full object-contain"
                  priority
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
    </section>
  )
}

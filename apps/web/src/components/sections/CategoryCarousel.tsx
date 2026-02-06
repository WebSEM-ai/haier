'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const categories = [
  {
    title: 'Aer condiționat',
    subtitle: 'Pearl Premium',
    href: '/produse/pearl-premium',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-16 w-16 text-gray-700">
        <rect x="10" y="20" width="60" height="32" rx="4" />
        <path d="M18 36h44" strokeDasharray="2 3" />
        <path d="M25 52v12M40 52v16M55 52v12" strokeLinecap="round" />
        <circle cx="62" cy="28" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'Aer condiționat',
    subtitle: 'Revive Plus',
    href: '/produse/revive-plus',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-16 w-16 text-gray-700">
        <rect x="10" y="22" width="60" height="30" rx="4" />
        <path d="M18 37h30" strokeDasharray="2 3" />
        <path d="M30 52v14M50 52v14" strokeLinecap="round" />
        <path d="M56 30l6-6M56 37h8M56 44l6 6" strokeLinecap="round" strokeWidth="1.2" />
        <circle cx="62" cy="28" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'Pompe de căldură',
    subtitle: '4–6 kW',
    href: '/produse/pompe-caldura-4-6kw',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-16 w-16 text-gray-700">
        <rect x="14" y="16" width="52" height="48" rx="4" />
        <circle cx="40" cy="42" r="14" />
        <path d="M40 32v4M40 46v4M30 42h4M46 42h4M33 35l2.8 2.8M44.2 44.2l2.8 2.8M33 49l2.8-2.8M44.2 39.8l2.8-2.8" strokeLinecap="round" strokeWidth="1.2" />
        <path d="M20 22h6M54 22h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Pompe de căldură',
    subtitle: '10 kW',
    href: '/produse/pompe-caldura-10kw',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-16 w-16 text-gray-700">
        <rect x="10" y="16" width="60" height="48" rx="4" />
        <circle cx="40" cy="42" r="14" />
        <path d="M40 32v4M40 46v4M30 42h4M46 42h4M33 35l2.8 2.8M44.2 44.2l2.8 2.8M33 49l2.8-2.8M44.2 39.8l2.8-2.8" strokeLinecap="round" strokeWidth="1.2" />
        <path d="M18 22h10M52 22h10" strokeLinecap="round" />
        <path d="M24 64v8M56 64v8" strokeLinecap="round" />
      </svg>
    ),
  },
]

export function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.offsetWidth * 0.6
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          {/* Left side - Title + arrows */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="shrink-0 lg:max-w-[260px]"
          >
            <h2 className="text-3xl font-bold uppercase leading-tight tracking-tight text-gray-900 lg:text-4xl">
              Găsește
              <br />
              soluția
              <br />
              potrivită:
            </h2>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => scroll('left')}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-900 text-gray-900 transition-all hover:bg-gray-900 hover:text-white"
                aria-label="Anterior"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll('right')}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-900 text-gray-900 transition-all hover:bg-gray-900 hover:text-white"
                aria-label="Următor"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Right side - Scrollable cards */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-2 scrollbar-hide lg:gap-6"
          >
            {categories.map((cat, index) => (
              <motion.div
                key={cat.subtitle}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="shrink-0"
              >
                <Link
                  href={cat.href}
                  className="group flex h-[280px] w-[260px] flex-col items-center justify-between rounded-2xl bg-gray-50 p-8 transition-all duration-300 hover:bg-gray-100 hover:shadow-lg lg:w-[280px]"
                >
                  {/* Icon */}
                  <div className="flex flex-1 items-center justify-center">
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      {cat.icon}
                    </div>
                  </div>

                  {/* Text + Arrow */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">{cat.title}</p>
                    <p className="text-base font-bold text-gray-900">{cat.subtitle}</p>
                    <div className="mx-auto mt-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 transition-all group-hover:border-gray-900 group-hover:bg-gray-900 group-hover:text-white">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
}

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero-bg.webp"
          alt="Interior modern"
          fill
          className="object-cover object-left"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/60 to-black/90" />
      </div>

      {/* Large B&W text in background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 select-none"
      >
        <span className="text-[20rem] font-bold leading-none tracking-tighter text-white lg:text-[28rem]">
          B&W
        </span>
      </motion.div>

      {/* Content */}
      <div className="relative flex min-h-[90vh] items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Left side - Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.15 } },
              }}
              className="max-w-xl"
            >
              <motion.p
                variants={fadeInLeft}
                className="mb-4 text-lg text-gray-300"
              >
                Tehnologia viitorului, disponibilă azi!
              </motion.p>

              <motion.h1
                variants={fadeInLeft}
                className="mb-8 text-5xl font-bold uppercase leading-none tracking-tight text-white lg:text-7xl"
              >
                Sisteme de
                <br />
                Climatizare
              </motion.h1>

              <motion.div variants={fadeInLeft}>
                <Link
                  href="/produse/climatizare"
                  className="group inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 font-medium text-white transition-all hover:bg-white hover:text-gray-900"
                >
                  Vezi climatizatoare
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
            </motion.div>

            {/* Right side - Product + Info */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
              }}
              className="relative"
            >
              {/* Product Image */}
              <motion.div
                variants={fadeInRight}
                className="relative mb-8 flex justify-center lg:justify-end"
              >
                <div className="relative">
                  <Image
                    src="/images/hero/ac-units.webp"
                    alt="Climatizatoare Haier"
                    width={500}
                    height={350}
                    className="drop-shadow-2xl"
                    priority
                  />
                  {/* Plus button */}
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: 'spring' }}
                    className="absolute -left-4 bottom-1/3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl font-light text-gray-900 shadow-xl transition-transform hover:scale-110"
                  >
                    +
                  </motion.button>
                </div>
              </motion.div>

              {/* Product Info Card */}
              <motion.div
                variants={fadeInUp}
                className="rounded-2xl bg-white/5 p-6 backdrop-blur-sm lg:ml-auto lg:max-w-md"
              >
                <h2 className="mb-3 text-2xl font-bold uppercase tracking-wide text-white">
                  Climatizatoare
                  <br />
                  de perete
                </h2>
                <p className="text-gray-300">
                  Climatizatoare de înaltă calitate, soluția perfectă pentru casă,
                  apartament sau birou. Funcționare silențioasă, control Wi-Fi și
                  funcție de auto-curățare.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-4 flex items-center lg:left-8">
        <button className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition-all hover:border-white hover:bg-white/10">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center lg:right-8">
        <button className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition-all hover:border-white hover:bg-white/10">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

    </section>
  )
}

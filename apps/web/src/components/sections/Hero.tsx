'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24 lg:py-36">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute -right-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
          className="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-sky-600/10 blur-3xl"
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <Container className="relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center rounded-full bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-400 ring-1 ring-inset ring-sky-500/20">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
              Climatizare premium
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl"
          >
            Confort perfect pentru{' '}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                casa ta
              </span>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-sky-400 to-cyan-300 rounded-full"
              />
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-8 text-lg text-gray-300 sm:text-xl lg:text-2xl leading-relaxed"
          >
            Descoperă gama completă Haier — tehnologie japoneză,
            <br className="hidden sm:block" />
            eficiență maximă și design premium.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
          >
            <Link
              href="/produse"
              className="group relative w-full overflow-hidden rounded-xl bg-sky-600 px-8 py-4 text-center font-semibold text-white shadow-lg shadow-sky-600/25 transition-all hover:bg-sky-500 hover:shadow-xl hover:shadow-sky-500/30 sm:w-auto"
            >
              <span className="relative z-10">Explorează produsele</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            </Link>
            <Link
              href="/cerere-oferta"
              className="w-full rounded-xl border-2 border-white/20 px-8 py-4 text-center font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/5 sm:w-auto"
            >
              Cere ofertă gratuită
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats with animations */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4"
        >
          {[
            { value: 'A+++', label: 'Clasă energetică', icon: '⚡' },
            { value: '15 dB', label: 'Nivel zgomot minim', icon: '🔇' },
            { value: '5 ani', label: 'Garanție extinsă', icon: '🛡️' },
            { value: 'Wi-Fi', label: 'Control smart', icon: '📱' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="group rounded-2xl bg-white/5 p-6 text-center backdrop-blur-sm ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-white/20"
            >
              <div className="mb-2 text-2xl">{stat.icon}</div>
              <div className="text-2xl font-bold text-sky-400 lg:text-3xl">{stat.value}</div>
              <div className="mt-1 text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </Container>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}

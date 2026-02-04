'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'

const features = [
  {
    icon: '🌿',
    title: 'Eco-Friendly',
    description: 'Agent frigorific R32 cu impact minim asupra mediului',
  },
  {
    icon: '🔇',
    title: 'Super Silențios',
    description: 'Nivel de zgomot de doar 15 dB — mai silențios decât o șoaptă',
  },
  {
    icon: '📱',
    title: 'Control Smart',
    description: 'Aplicația hOn pentru control de la distanță, oriunde te-ai afla',
  },
  {
    icon: '🦠',
    title: 'Purificare Avansată',
    description: 'Filtru IFD și funcție Self Clean pentru aer curat și sănătos',
  },
  {
    icon: '⚡',
    title: 'Eficiență A+++',
    description: 'Consum redus de energie cu tehnologie inverter avansată',
  },
  {
    icon: '🌡️',
    title: 'Încălzire Puternică',
    description: 'Funcționare eficientă până la -20°C exterior',
  },
]

export function TechFeatures() {
  return (
    <section className="relative overflow-hidden bg-gray-900 py-20 lg:py-28">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Gradient blobs */}
      <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-cyan-500/20 blur-3xl" />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-sky-400">
            Tehnologii
          </span>
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            De ce să alegi Haier?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Inovație japoneză și calitate germană într-un singur produs
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group rounded-2xl bg-white/5 p-6 backdrop-blur-sm ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-sky-500/50"
            >
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-sky-500/10 text-3xl ring-1 ring-sky-500/20 transition-all group-hover:bg-sky-500 group-hover:ring-sky-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a
            href="/produse"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-8 py-4 font-semibold text-white shadow-lg shadow-sky-600/25 transition-all hover:bg-sky-500 hover:shadow-xl hover:shadow-sky-500/30"
          >
            Descoperă toate produsele
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </Container>
    </section>
  )
}

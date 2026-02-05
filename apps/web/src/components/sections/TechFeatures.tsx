'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const features = [
  {
    icon: '/images/features/self-purify.webp',
    category: 'Purificarea aerului',
    title: 'Self Purify | Filtru IFD',
  },
  {
    icon: '/images/features/uvc-pro.webp',
    category: 'Purificarea aerului',
    title: 'Sterilizare UV-C PRO',
  },
  {
    icon: '/images/features/self-clean.webp',
    category: 'Curățarea aparatului',
    title: 'Self Clean',
  },
  {
    icon: '/images/features/wifi.webp',
    category: 'Control',
    title: 'Wi-Fi',
  },
  {
    icon: '/images/features/coanda.webp',
    category: 'Confort',
    title: 'Coanda Plus',
  },
  {
    icon: '/images/features/i-feel.webp',
    category: 'Confort',
    title: 'I FEEL',
  },
  {
    icon: '/images/features/turbo-cool.webp',
    category: 'Confort',
    title: 'Mod Turbo Cooling',
  },
  {
    icon: '/images/features/silent.webp',
    category: 'Confort',
    title: 'Funcționare foarte silențioasă',
  },
]

export function TechFeatures() {
  return (
    <section className="relative min-h-[700px] overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/features/features-bg.webp"
          alt="Living modern cu climatizare Haier"
          fill
          className="object-cover"
        />
        {/* Gradient overlay - dark on right for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900/70 to-gray-900" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-[700px] items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="ml-auto max-w-3xl lg:max-w-4xl">
            {/* Section Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Tehnologii Haier
              </h2>
              <p className="mt-2 text-gray-300">
                Inovație și confort în fiecare detaliu
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="group rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-lg bg-white p-2">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={48}
                      height={48}
                      className="h-12 w-12 object-contain"
                    />
                  </div>
                  <p className="text-xs text-sky-400">{feature.category}</p>
                  <h3 className="text-sm font-semibold text-white">
                    {feature.title}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

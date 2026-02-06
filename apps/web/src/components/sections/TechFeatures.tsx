'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const tabs = [
  {
    label: 'Purificare & Igienă',
    features: [
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
    ],
  },
  {
    label: 'Confort & Performanță',
    features: [
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
        title: 'Funcționare silențioasă',
      },
    ],
  },
]

export function TechFeatures() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="grid lg:grid-cols-2">
        {/* Left side — Text + Tabs + Feature list */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:py-24 lg:pl-16 lg:pr-20 xl:pl-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-gray-500">Pentru confort și sănătate</p>
            <h2 className="mt-3 text-4xl font-bold uppercase tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Climatizatoare
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-gray-600">
              Alegerea soluției potrivite de climatizare este esențială pentru
              confortul locuinței. Oferim o gamă variată de modele cu specificații
              diverse, echipate cu cele mai noi tehnologii.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-10"
          >
            <p className="mb-4 text-sm font-bold text-gray-900">
              Descoperă tehnologia viitorului:
            </p>
            <div className="flex gap-2">
              {tabs.map((tab, index) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(index)}
                  className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                    activeTab === index
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {activeTab === index && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 rounded-full bg-gray-900"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Feature list — animated */}
          <div className="mt-6 min-h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="divide-y divide-gray-100"
              >
                {tabs[activeTab].features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.06 }}
                    className="group flex items-center justify-between py-6"
                  >
                    <div className="flex items-center gap-4">
                      <svg
                        className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-gray-900"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <div>
                        <span className="text-sm text-gray-500">{feature.category}: </span>
                        <span className="text-sm font-bold text-gray-900">{feature.title}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-50 p-2 transition-all group-hover:bg-gray-100 group-hover:shadow-md">
                      <Image
                        src={feature.icon}
                        alt={feature.title}
                        width={48}
                        height={48}
                        className="h-10 w-10 object-contain"
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right side — Lifestyle image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative min-h-[500px] lg:min-h-full"
        >
          <Image
            src="/images/features/features-bg.webp"
            alt="Living modern cu climatizare Haier"
            fill
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  )
}

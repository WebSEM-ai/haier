'use client'

import { motion } from 'framer-motion'

interface TrustItem {
  icon: string
  title: string
  description: string
}

export function TrustSignals({ items }: { items: TrustItem[] }) {
  return (
    <div className="mt-10 space-y-5">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          viewport={{ once: true }}
          className="flex items-start gap-4"
        >
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 text-xl">
            {item.icon}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-white">{item.title}</h3>
            <p className="mt-0.5 text-sm leading-relaxed text-gray-500">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

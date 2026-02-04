'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import type { Product, Category } from '@repo/payload-types'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const category = typeof product.category === 'object' ? product.category : null
  const categorySlug = category?.slug || 'produse'

  const firstImage = product.images?.[0]
  const imageData = firstImage?.image
  const imageUrl =
    typeof imageData === 'object' && imageData?.url ? imageData.url : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
    >
      <Link
        href={`/produse/${categorySlug}/${product.slug}`}
        className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-xl hover:ring-sky-100"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={firstImage?.alt || product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Quick view button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-900 shadow-lg backdrop-blur-sm">
              Vezi detalii
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {product.energyClass && (
              <Badge variant="success" className="text-xs">
                {product.energyClass}
              </Badge>
            )}
            {product.wifi && (
              <Badge variant="info" className="text-xs">
                Wi-Fi
              </Badge>
            )}
            {product.noiseLevel && (
              <Badge variant="default" className="text-xs">
                {product.noiseLevel}
              </Badge>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 line-clamp-2 transition-colors group-hover:text-sky-600">
            {product.title}
          </h3>

          {product.shortDescription && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="text-xs text-gray-500">{product.modelCode}</span>
            <span className="inline-flex items-center text-sm font-medium text-sky-600 transition-all group-hover:gap-2">
              Detalii
              <svg
                className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

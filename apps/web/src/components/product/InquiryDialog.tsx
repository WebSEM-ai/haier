'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { InquiryForm } from '@/components/product/InquiryForm'
import { R2_PUBLIC_URL } from '@/lib/constants'
import type { Product } from '@/lib/payload'

interface InquiryDialogProps {
  product?: Product | null
}

export function InquiryDialog({ product }: InquiryDialogProps) {
  const [open, setOpen] = useState(false)

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const imageUrl = product?.mainImageFilename
    ? `${R2_PUBLIC_URL}/${product.mainImageFilename}`
    : null

  return (
    <>
      <Button size="lg" className="w-full" onClick={() => setOpen(true)}>
        Solicită ofertă
      </Button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center gap-4 p-6 pb-4 sm:p-8 sm:pb-4">
                {imageUrl && (
                  <div className="flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 p-1.5">
                    <Image
                      src={imageUrl}
                      alt={product?.title || ''}
                      width={64}
                      height={64}
                      className="h-14 w-14 object-contain"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Solicită ofertă
                  </h2>
                  {product?.title && (
                    <p className="truncate text-sm text-gray-500">{product.title}</p>
                  )}
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Separator */}
              <div className="border-t border-gray-100 mx-6 sm:mx-8" />

              {/* Form */}
              <div className="p-6 pt-5 sm:p-8 sm:pt-5">
                <InquiryForm product={product} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

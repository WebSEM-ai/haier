'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { InquiryForm } from '@/components/product/InquiryForm'
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

  return (
    <>
      <Button size="lg" className="w-full" onClick={() => setOpen(true)}>
        Solicită ofertă
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Solicită ofertă
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <InquiryForm product={product} />
          </div>
        </div>
      )}
    </>
  )
}

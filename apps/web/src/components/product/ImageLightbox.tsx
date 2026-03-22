'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageLightboxProps {
  src: string
  alt: string
}

export function ImageLightbox({ src, alt }: ImageLightboxProps) {
  const [open, setOpen] = useState(false)

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
      {/* Clickable image */}
      <div
        className="relative aspect-[4/3] cursor-zoom-in"
        onClick={() => setOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-8"
          priority
        />
        {/* Zoom hint */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
          Click pentru mărire
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative h-[80vh] w-[90vw] max-w-4xl"
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
              />
              <button
                onClick={() => setOpen(false)}
                className="absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

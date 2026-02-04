'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { MegaMenu } from './MegaMenu'
import { MobileNav } from './MobileNav'
import type { Category } from '@repo/payload-types'

interface HeaderProps {
  categories: Category[]
}

export function Header({ categories }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/95 shadow-lg shadow-black/10 backdrop-blur-lg'
          : 'bg-gray-900'
      }`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 font-bold text-white transition-transform group-hover:scale-105">
              H
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">Haier</span>
              <span className="text-[10px] uppercase tracking-widest text-gray-400">România</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-1">
            <MegaMenu categories={categories} />
            <Link
              href="/contact"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link
              href="/cerere-oferta"
              className="group relative overflow-hidden rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 transition-all hover:bg-sky-500 hover:shadow-xl hover:shadow-sky-500/30"
            >
              <span className="relative z-10">Cere ofertă</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            </Link>
          </div>

          {/* Mobile Navigation */}
          <MobileNav categories={categories} />
        </div>
      </Container>
    </motion.header>
  )
}

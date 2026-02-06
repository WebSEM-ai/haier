'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MobileNav } from './MobileNav'
import type { Category } from '@/lib/payload'

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
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/95 shadow-lg shadow-black/10 backdrop-blur-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
              Haier
            </span>
          </Link>

          {/* Desktop Navigation — center */}
          <nav className="hidden items-center gap-1 lg:flex">
            <NavLink href="/produse/climatizare" hasDropdown>
              Climatizare
            </NavLink>
            <NavLink href="/produse/pompe-caldura">
              Pompe de căldură
            </NavLink>
            <NavSeparator />
            <NavLink href="/produse">
              Produse
            </NavLink>
            <NavLink href="/contact">
              Contact
            </NavLink>
          </nav>

          {/* Right side — CTA */}
          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href="/cerere-oferta"
              className="rounded-full border border-white/80 px-6 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white hover:text-gray-900"
            >
              Cere ofertă
            </Link>
          </div>

          {/* Mobile */}
          <MobileNav categories={categories} />
        </div>
      </div>
    </header>
  )
}

function NavLink({
  href,
  children,
  hasDropdown,
}: {
  href: string
  children: React.ReactNode
  hasDropdown?: boolean
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-1 px-4 py-2 text-[13px] font-medium uppercase tracking-wider text-gray-300 transition-colors hover:text-white"
    >
      {children}
      {hasDropdown && (
        <svg
          className="h-3 w-3 opacity-60 transition-transform group-hover:opacity-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </Link>
  )
}

function NavSeparator() {
  return <div className="mx-2 h-4 w-px bg-white/20" />
}

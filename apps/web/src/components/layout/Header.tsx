'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { MobileNav } from './MobileNav'
import { MegaMenuPanel, MENU_SECTIONS } from './MegaMenu'
import { CONTACT } from '@/lib/constants'
import type { Category } from '@/lib/payload'

interface HeaderProps {
  categories: Category[]
}

export function Header({ categories }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeMenuKey, setActiveMenuKey] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close everything on route change
  useEffect(() => {
    setActiveMenuKey(null)
    setDrawerOpen(false)
  }, [pathname])

  // Debounced megamenu open/close
  const openMenu = useCallback((key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveMenuKey(key)
  }, [])

  const scheduleClose = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setActiveMenuKey(null), 150)
  }, [])

  const cancelClose = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const activeSection = MENU_SECTIONS.find((s) => s.key === activeMenuKey) ?? null

  const headerBg = !isHome
    ? 'bg-gray-900 shadow-lg shadow-black/10'
    : isScrolled
      ? 'bg-gray-900/95 shadow-lg shadow-black/10 backdrop-blur-lg'
      : 'bg-transparent'

  // When megamenu is open, always show opaque bg
  const effectiveBg = activeMenuKey ? 'bg-gray-900 shadow-lg shadow-black/10' : headerBg

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${effectiveBg}`}
      onMouseLeave={scheduleClose}
    >
      <div className="flex h-16 items-center justify-between px-4 lg:h-[72px] lg:px-6 xl:px-10">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-white lg:text-[1.6rem]">
            Haier
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {/* Megamenu triggers */}
          <NavTrigger
            label="Climatizare"
            menuKey="climatizare"
            activeKey={activeMenuKey}
            onEnter={openMenu}
            onLeave={scheduleClose}
          />
          <NavTrigger
            label="Pompe de căldură"
            menuKey="pompe-caldura"
            activeKey={activeMenuKey}
            onEnter={openMenu}
            onLeave={scheduleClose}
          />

          <NavSeparator />

          <NavLink href="/produse">Produse</NavLink>
          <NavLink href="/oferta-personalizata">Ofertă</NavLink>
          <NavLink href="/calculator-economii">Calculator</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>

        {/* Right side */}
        <div className="hidden items-center gap-2 lg:flex">
          {/* Search */}
          <button
            onClick={() => {
              setSearchOpen(true)
              setTimeout(() => searchInputRef.current?.focus(), 100)
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Caută produse"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          {/* Configurator CTA */}
          <Link
            href="/configurator"
            className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-2 font-[family-name:var(--font-display)] text-[10px] font-semibold uppercase tracking-wider text-sky-400 transition-all hover:border-sky-400/50 hover:bg-sky-500/20 hover:text-sky-300 xl:px-4 xl:py-2.5 xl:text-[11px]"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configurator
          </Link>
          {/* CTA */}
          <Link
            href="/cerere-oferta"
            className="inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-4 py-2 font-[family-name:var(--font-display)] text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg shadow-sky-600/25 transition-all hover:bg-sky-500 hover:shadow-sky-500/30 xl:px-5 xl:py-2.5 xl:text-[11px]"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Solicită ofertă
          </Link>

          {/* Desktop Hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Resurse și evenimente"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile */}
        <MobileNav categories={categories} />
      </div>

      {/* Megamenu panels */}
      <AnimatePresence>
        {activeSection && (
          <MegaMenuPanel
            key={activeSection.key}
            section={activeSection}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          />
        )}
      </AnimatePresence>

      {/* Desktop Hamburger Drawer */}
      <HamburgerDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-[70] flex items-start justify-center pt-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (searchQuery.trim()) {
                    router.push(`/produse?q=${encodeURIComponent(searchQuery.trim())}`)
                    setSearchOpen(false)
                    setSearchQuery('')
                  }
                }}
                className="relative"
              >
                <svg className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Caută produse, modele, serii..."
                  className="w-full rounded-2xl border-0 bg-white py-4 pl-14 pr-14 text-lg text-gray-900 shadow-2xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchOpen(false)
                      setSearchQuery('')
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ── NavTrigger (megamenu hover) ──────────────────────────────────────────────

function NavTrigger({
  label,
  menuKey,
  activeKey,
  onEnter,
  onLeave,
}: {
  label: string
  menuKey: string
  activeKey: string | null
  onEnter: (key: string) => void
  onLeave: () => void
}) {
  const isActive = activeKey === menuKey
  return (
    <button
      onMouseEnter={() => onEnter(menuKey)}
      onMouseLeave={onLeave}
      className="group flex items-center gap-1 px-2.5 py-2 text-[11px] font-medium uppercase tracking-wider text-gray-300 transition-colors hover:text-white xl:px-3 xl:text-xs"
    >
      {label}
      <svg
        className={`h-3 w-3 opacity-60 transition-transform duration-200 group-hover:opacity-100 ${isActive ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

// ── NavLink ──────────────────────────────────────────────────────────────────

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-2.5 py-2 text-[11px] font-medium uppercase tracking-wider text-gray-300 transition-colors hover:text-white xl:px-3 xl:text-xs"
    >
      {children}
    </Link>
  )
}

function NavSeparator() {
  return <div className="mx-2 h-4 w-px bg-white/20" />
}

// ── HamburgerDrawer ──────────────────────────────────────────────────────────

function HamburgerDrawer({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-[60] w-full max-w-md bg-gray-900 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <Dialog.Title className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-wider text-white">
              Haier România
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white" aria-label="Închide">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          <div className="flex h-[calc(100%-73px)] flex-col overflow-y-auto">
            <div className="flex-1 space-y-8 p-6">
              {/* Resurse */}
              <section>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Resurse
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/images/sectiuni/haier_250907_PF_Res_Revive_Plus_Mono-ENG.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <svg className="h-4 w-4 shrink-0 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      Fișă produs — Revive Plus Mono
                    </a>
                  </li>
                  <li>
                    <span className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-500">
                      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      Mai multe fișe tehnice — în curând
                    </span>
                  </li>
                </ul>
              </section>

              {/* Evenimente */}
              <section>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Evenimente
                </h3>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-gray-400">
                    Evenimentele Haier România vor fi afișate aici.
                  </p>
                  <span className="mt-2 inline-block text-xs text-gray-500">În curând</span>
                </div>
              </section>

              {/* Contact rapid */}
              <section>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Contact rapid
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href={`tel:${CONTACT.phone}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <svg className="h-4 w-4 shrink-0 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      {CONTACT.phone}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <svg className="h-4 w-4 shrink-0 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      {CONTACT.email}
                    </a>
                  </li>
                </ul>
              </section>
            </div>

            {/* Footer CTA */}
            <div className="border-t border-white/10 p-6">
              <Link
                href="/cerere-oferta"
                onClick={() => onOpenChange(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-sky-600/25 transition-all hover:bg-sky-500"
              >
                Solicită ofertă
              </Link>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

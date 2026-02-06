'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import type { Category } from '@/lib/payload'

interface MobileNavProps {
  categories: Category[]
}

export function MobileNav({ categories }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const rootCategories = categories.filter((c) => c.level === '1')

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="lg:hidden p-2 text-gray-300 hover:text-white" aria-label="Meniu">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-gray-900 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <Dialog.Title className="text-lg font-semibold text-white">Meniu</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 text-gray-400 hover:text-white" aria-label="Închide">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          <nav className="space-y-6">
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Categorii
              </h3>
              <ul className="space-y-3">
                {rootCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/produse/${category.slug}`}
                      onClick={() => setOpen(false)}
                      className="block text-gray-300 hover:text-white"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/produse"
                    onClick={() => setOpen(false)}
                    className="block text-gray-300 hover:text-white"
                  >
                    Toate produsele
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="block text-gray-300 hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <Link
                href="/cerere-oferta"
                onClick={() => setOpen(false)}
                className="block w-full rounded-lg bg-sky-600 px-4 py-3 text-center font-medium text-white hover:bg-sky-700"
              >
                Cere ofertă
              </Link>
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

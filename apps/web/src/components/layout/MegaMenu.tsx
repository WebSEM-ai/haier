'use client'

import Link from 'next/link'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import type { Category } from '@repo/payload-types'

interface MegaMenuProps {
  categories: Category[]
}

export function MegaMenu({ categories }: MegaMenuProps) {
  // Categorii nivel 1 (rădăcini)
  const rootCategories = categories.filter((c) => c.level === '1')

  // Funcție pentru a găsi subcategoriile
  const getSubcategories = (parentId: number) =>
    categories.filter((c) => {
      const parent = c.parent
      if (typeof parent === 'number') return parent === parentId
      if (parent && typeof parent === 'object') return parent.id === parentId
      return false
    })

  return (
    <NavigationMenu.Root className="relative">
      <NavigationMenu.List className="flex items-center space-x-1">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="group flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white">
            Produse
            <svg
              className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </NavigationMenu.Trigger>

          <NavigationMenu.Content className="absolute left-0 top-full w-screen max-w-4xl">
            <div className="mt-2 rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-2xl">
              <div className="grid grid-cols-3 gap-8">
                {rootCategories.map((category) => {
                  const subcategories = getSubcategories(category.id)
                  return (
                    <div key={category.id}>
                      <Link
                        href={`/produse/${category.slug}`}
                        className="mb-3 block text-sm font-semibold text-white hover:text-sky-400"
                      >
                        {category.name}
                      </Link>
                      {subcategories.length > 0 && (
                        <ul className="space-y-2">
                          {subcategories.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={`/produse/${category.slug}/${sub.slug}`}
                                className="text-sm text-gray-400 transition-colors hover:text-white"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 border-t border-gray-700 pt-4">
                <Link
                  href="/produse"
                  className="text-sm font-medium text-sky-400 hover:text-sky-300"
                >
                  Vezi toate produsele →
                </Link>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  )
}

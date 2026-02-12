'use client'

import { useState, useMemo } from 'react'

export interface SpecSection {
  title: string
  rows: { label: string; value: string }[]
}

interface SpecsTabsProps {
  sections: SpecSection[]
  features?: string | null
}

export function SpecsTabs({ sections, features }: SpecsTabsProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [search, setSearch] = useState('')

  const query = search.trim().toLowerCase()

  // When searching, flatten all sections and filter
  const searchResults = useMemo(() => {
    if (!query) return null
    const results: { section: string; label: string; value: string }[] = []
    for (const section of sections) {
      for (const row of section.rows) {
        if (
          row.label.toLowerCase().includes(query) ||
          row.value.toLowerCase().includes(query)
        ) {
          results.push({ section: section.title, label: row.label, value: row.value })
        }
      }
    }
    // Also search in features
    if (features) {
      const featureList = features.split(',').map((f) => f.trim())
      for (const f of featureList) {
        if (f.toLowerCase().includes(query)) {
          results.push({ section: 'Funcționalități', label: f, value: '' })
        }
      }
    }
    return results
  }, [query, sections, features])

  const featureList = features ? features.split(',').map((f) => f.trim()) : []
  const allTabs = [
    ...sections,
    ...(featureList.length > 0 ? [{ title: 'Funcționalități', rows: [] as { label: string; value: string }[] }] : []),
  ]

  const isSearching = searchResults !== null

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Search bar */}
      <div className="border-b border-gray-100 px-5 py-3">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Caută specificație... (ex: SEER, zgomot, dimensiuni)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border-0 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Search results mode */}
      {isSearching ? (
        <div className="px-5 py-4">
          {searchResults.length > 0 ? (
            <>
              <p className="mb-3 text-xs font-medium text-gray-400">
                {searchResults.length} {searchResults.length === 1 ? 'rezultat' : 'rezultate'} pentru &quot;{search}&quot;
              </p>
              <dl className="divide-y divide-gray-100">
                {searchResults.map((r, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 py-2.5">
                    <div className="min-w-0">
                      <dt className="text-sm text-gray-900">{r.label}</dt>
                      <span className="text-xs text-gray-400">{r.section}</span>
                    </div>
                    {r.value && (
                      <dd className="shrink-0 text-sm font-semibold text-gray-900">{r.value}</dd>
                    )}
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <p className="py-6 text-center text-sm text-gray-400">
              Niciun rezultat pentru &quot;{search}&quot;
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Tab navigation */}
          <div className="scrollbar-hide flex overflow-x-auto border-b border-gray-200">
            {allTabs.map((tab, idx) => (
              <button
                key={tab.title}
                onClick={() => setActiveTab(idx)}
                className={`shrink-0 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                  activeTab === idx
                    ? 'border-sky-600 text-sky-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="px-5 py-1">
            {/* Spec rows for regular sections */}
            {activeTab < sections.length && (
              <dl className="divide-y divide-gray-100">
                {sections[activeTab].rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <dt className="text-sm text-gray-500">{row.label}</dt>
                    <dd className="shrink-0 text-sm font-semibold text-gray-900">{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {/* Features tab */}
            {activeTab === sections.length && featureList.length > 0 && (
              <div className="flex flex-wrap gap-2 py-4">
                {featureList.map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-sky-50 px-4 py-1.5 text-sm font-medium text-sky-700 ring-1 ring-sky-100"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    const slugRedirects = [
      // Pearl Premium
      ['pearl-premium-2-5-kw', 'aer-conditionat-pearl-premium-2-5-kw-9000-btu'],
      ['pearl-premium-3-5-kw', 'aer-conditionat-pearl-premium-3-5-kw-12000-btu'],
      ['pearl-premium-5-0-kw', 'aer-conditionat-pearl-premium-5-0-kw-18000-btu'],
      ['pearl-premium-7-1-kw', 'aer-conditionat-pearl-premium-7-1-kw-24000-btu'],
      // Expert
      ['expert-2-5-kw', 'aer-conditionat-expert-2-5-kw-9000-btu'],
      ['expert-3-5-kw', 'aer-conditionat-expert-3-5-kw-12000-btu'],
      ['expert-4-2-kw', 'aer-conditionat-expert-4-2-kw-14000-btu'],
      ['expert-5-0-kw', 'aer-conditionat-expert-5-0-kw-18000-btu'],
      ['expert-7-1-kw', 'aer-conditionat-expert-7-1-kw-24000-btu'],
      // Revive Plus
      ['revive-plus-2-5-kw', 'aer-conditionat-revive-plus-2-5-kw-9000-btu'],
      ['revive-plus-3-5-kw', 'aer-conditionat-revive-plus-3-5-kw-12000-btu'],
      ['revive-plus-5-0-kw', 'aer-conditionat-revive-plus-5-0-kw-18000-btu'],
      ['revive-plus-6-8-kw', 'aer-conditionat-revive-plus-6-8-kw-24000-btu'],
      // Monobloc GT R290
      ['monobloc-gt-r290-4-kw', 'pompa-de-caldura-monobloc-gt-r290-4-kw'],
      ['monobloc-gt-r290-6-kw', 'pompa-de-caldura-monobloc-gt-r290-6-kw'],
      ['monobloc-gt-r290-10-kw-mono', 'pompa-de-caldura-monobloc-gt-r290-10-kw-monofazic'],
      ['monobloc-gt-r290-10-kw-tri', 'pompa-de-caldura-monobloc-gt-r290-10-kw-trifazat'],
      // Hydro All-in-One R290
      ['hydro-all-in-one-r290-4-kw', 'pompa-de-caldura-hydro-all-in-one-r290-4-kw'],
      ['hydro-all-in-one-r290-6-kw', 'pompa-de-caldura-hydro-all-in-one-r290-6-kw'],
      ['hydro-all-in-one-r290-10-kw', 'pompa-de-caldura-hydro-all-in-one-r290-10-kw-monofazic'],
      ['hydro-all-in-one-r290-10-kw-tri', 'pompa-de-caldura-hydro-all-in-one-r290-10-kw-trifazat'],
      ['hydro-all-in-one-unitate-interioara-mono', 'pompa-de-caldura-hydro-all-in-one-unitate-interioara-monofazic'],
      ['hydro-all-in-one-unitate-interioara-tri', 'pompa-de-caldura-hydro-all-in-one-unitate-interioara-trifazat'],
      // Accessories
      ['atw-a03n-pcb-control-box', 'accesoriu-pcb-control-box-atw-a03n'],
      ['hw-wa101adk-termostat', 'accesoriu-termostat-hw-wa101dbt'],
    ] as const

    return slugRedirects.flatMap(([oldSlug, newSlug]) => [
      {
        source: `/produse/climatizare/${oldSlug}`,
        destination: `/produse/climatizare/${newSlug}`,
        permanent: true,
      },
      {
        source: `/produse/pompe-de-caldura/${oldSlug}`,
        destination: `/produse/pompe-de-caldura/${newSlug}`,
        permanent: true,
      },
    ])
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig

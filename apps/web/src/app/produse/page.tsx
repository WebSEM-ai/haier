import type { Metadata } from 'next'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { AllProductsGrid } from '@/components/product/AllProductsGrid'
import { getProducts } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Produse',
  description: 'Explorează catalogul complet de produse Haier pentru climatizare rezidențială.',
}

export default async function ProdusePage() {
  const products = await getProducts()

  return (
    <div>
      {/* Header banner */}
      <div className="relative overflow-hidden bg-gray-950 pt-28 pb-12">
        {/* Haier logo watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end">
          <Image
            src="/images/hero/haier-logo.png"
            alt=""
            width={600}
            height={240}
            className="mr-16 h-auto w-[500px] opacity-[0.03]"
            aria-hidden="true"
          />
        </div>

        {/* Grid texture */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <Container>
          <div className="relative">
            <p className="text-xs font-medium uppercase tracking-widest text-sky-400">
              Catalog complet
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
              Toate produsele
            </h1>
            <p className="mt-4 max-w-xl text-lg text-gray-400">
              Explorează catalogul complet de soluții de climatizare și pompe de căldură Haier
            </p>
          </div>
        </Container>

        {/* Bottom accent line */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
      </div>

      {/* Products grid */}
      <div className="py-12">
        <Container>
          <AllProductsGrid products={products} />
        </Container>
      </div>
    </div>
  )
}

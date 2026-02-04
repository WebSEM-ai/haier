import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { CategoryGrid } from '@/components/sections/CategoryGrid'
import { getCategories } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Produse',
  description: 'Explorează catalogul complet de produse Haier pentru climatizare rezidențială.',
}

export default async function ProdusePage() {
  const categories = await getCategories()

  return (
    <div className="py-12">
      <Container>
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Toate produsele
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Explorează catalogul complet de soluții de climatizare Haier
          </p>
        </div>
      </Container>

      <CategoryGrid categories={categories} />
    </div>
  )
}

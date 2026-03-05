import type { Metadata } from 'next'
import { getProducts } from '@/lib/payload'
import { RecommendationWizard } from '@/components/recommendation/RecommendationWizard'

export const metadata: Metadata = {
  title: 'Ofertă personalizată | Haier România',
  description:
    'Găsește soluția Haier perfectă pentru tine. Răspunde la câteva întrebări și primește recomandări personalizate pentru climatizare sau pompe de căldură.',
}

export default async function OfertaPersonalizataPage() {
  const products = await getProducts()

  return <RecommendationWizard products={products} />
}

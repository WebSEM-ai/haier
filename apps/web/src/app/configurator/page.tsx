import type { Metadata } from 'next'
import { getProducts } from '@/lib/payload'
import { ConfiguratorWizard } from '@/components/configurator/ConfiguratorWizard'

export const metadata: Metadata = {
  title: 'Configurator cameră | Haier România',
  description:
    'Configurează-ți spațiul și descoperă soluția Haier perfectă. Vizualizează camera, adaugă dimensiuni, ferestre și elemente termice — primești recomandări instant.',
}

export default async function ConfiguratorPage() {
  const products = await getProducts()

  return <ConfiguratorWizard products={products} />
}

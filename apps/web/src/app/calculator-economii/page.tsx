import type { Metadata } from 'next'
import { getProducts } from '@/lib/payload'
import { SavingsWizard } from '@/components/savings/SavingsWizard'

export const metadata: Metadata = {
  title: 'Calculator economii energetice | Haier România',
  description:
    'Calculează exact câți lei economisești anual trecând la un sistem Haier. Compară consumul actual cu eficiența Haier — grafice, CO2 salvat și amortizare investiție.',
}

export default async function CalculatorEconomiiPage() {
  const products = await getProducts()

  return <SavingsWizard products={products} />
}

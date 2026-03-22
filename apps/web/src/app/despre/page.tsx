import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'Despre companie',
  description: 'Despre Haier România — lider mondial în soluții de climatizare.',
}

export default function DesprePage() {
  return (
    <div className="pt-28 pb-16">
      <Container size="md">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Despre Haier România</h1>

        <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
          <p>
            Haier este lider mondial în electrocasnice mari, ocupând locul 1 la nivel global
            pentru 15 ani consecutivi conform Euromonitor International.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-4">Misiunea noastră</h2>
          <p>
            Ne dedicăm să oferim soluții de climatizare și pompe de căldură de înaltă calitate,
            eficiente energetic și prietenoase cu mediul, adaptate nevoilor specifice ale pieței
            din România.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-4">Tehnologie avansată</h2>
          <p>
            Produsele Haier integrează cele mai noi tehnologii: sterilizare UV-C, filtru IFD,
            compresoare inverter, refrigeranți ecologici R32 și R290, control Wi-Fi prin
            aplicația hOn și eficiență energetică de clasă A+++.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-4">Prezență locală</h2>
          <p>
            Haier România oferă suport complet: consultanță tehnică, montaj profesional,
            garanție standard de 36 luni cu posibilitate de extindere, și service autorizat
            pe tot teritoriul României.
          </p>
        </div>
      </Container>
    </div>
  )
}

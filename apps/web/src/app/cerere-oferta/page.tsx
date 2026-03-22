import type { Metadata } from 'next'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { TrustSignals } from './TrustSignals'
import { InquiryFormWrapper } from './InquiryFormWrapper'
import { getProducts } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Cerere ofertă',
  description: 'Solicită o ofertă personalizată pentru produsele Haier de climatizare.',
}

const trustItems = [
  {
    icon: '🛡️',
    title: 'Garanție 36 luni + 2 ani extra',
    description: 'Garanție standard 36 luni, cu posibilitate de extindere +2 ani contra cost.',
  },
  {
    icon: '💬',
    title: 'Consultanță gratuită',
    description: 'Echipa noastră te ajută să alegi soluția potrivită.',
  },
  {
    icon: '🚚',
    title: 'Livrare rapidă',
    description: 'Livrare pe tot teritoriul României în cel mai scurt timp.',
  },
  {
    icon: '🔧',
    title: 'Suport tehnic',
    description: 'Asistență tehnică profesională pentru instalare și service.',
  },
]

export default async function CerereOfertaPage() {
  const products = await getProducts()

  return (
    <div className="pt-28 pb-12 lg:pb-20">
      <Container size="lg">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left column — dark panel with trust signals */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 to-gray-900 p-8 lg:p-10">
            {/* Watermark logo */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Image
                src="/images/hero/haier-logo.png"
                alt=""
                width={400}
                height={400}
                className="h-auto w-[300px] select-none opacity-[0.03] lg:w-[400px]"
              />
            </div>

            <div className="relative z-10">
              <h1 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
                Solicită o ofertă personalizată
              </h1>
              <p className="mt-4 text-base leading-relaxed text-gray-400">
                Completează formularul și echipa noastră te va contacta cu cea mai bună ofertă pentru nevoile tale.
              </p>

              <TrustSignals items={trustItems} />
            </div>
          </div>

          {/* Right column — form card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Completează datele
            </h2>
            <InquiryFormWrapper products={products} />
          </div>
        </div>
      </Container>
    </div>
  )
}

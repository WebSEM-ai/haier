import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { InquiryForm } from '@/components/product/InquiryForm'

export const metadata: Metadata = {
  title: 'Cerere ofertă',
  description: 'Solicită o ofertă personalizată pentru produsele Haier de climatizare.',
}

export default function CerereOfertaPage() {
  return (
    <div className="py-12 lg:py-20">
      <Container size="sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Cerere ofertă
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Completează formularul și te vom contacta cu o ofertă personalizată.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8">
          <InquiryForm />
        </div>
      </Container>
    </div>
  )
}

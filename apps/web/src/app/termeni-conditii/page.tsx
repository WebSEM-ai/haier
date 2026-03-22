import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'Termeni și condiții',
  description: 'Termenii și condițiile de utilizare a site-ului Haier România.',
}

export default function TermeniConditiiPage() {
  return (
    <div className="pt-28 pb-16">
      <Container size="md">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Termeni și condiții</h1>
        <p className="mt-2 text-sm text-gray-400">Ultima actualizare: Martie 2026</p>

        <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
          <h2 className="text-xl font-bold text-gray-900">1. Informații generale</h2>
          <p>
            Prezentele Termeni și Condiții reglementează utilizarea site-ului web Haier România
            și relația dintre utilizator și operator. Prin accesarea site-ului, utilizatorul
            acceptă acești termeni în integralitate.
          </p>

          <h2 className="text-xl font-bold text-gray-900">2. Descrierea serviciilor</h2>
          <p>
            Site-ul oferă informații despre produsele Haier de climatizare și pompe de căldură,
            un configurator pentru dimensionarea soluțiilor, un calculator de economii și
            posibilitatea de a solicita oferte personalizate.
          </p>

          <h2 className="text-xl font-bold text-gray-900">3. Proprietate intelectuală</h2>
          <p>
            Conținutul site-ului, inclusiv texte, imagini, logo-uri, elemente grafice și
            software, este protejat de legislația privind drepturile de autor și proprietatea
            intelectuală. Reproducerea fără acord scris este interzisă.
          </p>

          <h2 className="text-xl font-bold text-gray-900">4. Limitarea răspunderii</h2>
          <p>
            Informațiile de pe site sunt furnizate cu scop informativ. Specificațiile tehnice
            ale produselor pot fi modificate de producător fără notificare prealabilă.
            Pentru oferte valabile, vă rugăm să contactați echipa noastră.
          </p>

          <h2 className="text-xl font-bold text-gray-900">5. Legislație aplicabilă</h2>
          <p>
            Acești termeni sunt guvernați de legislația României. Orice litigiu va fi soluționat
            de instanțele competente din România.
          </p>
        </div>
      </Container>
    </div>
  )
}

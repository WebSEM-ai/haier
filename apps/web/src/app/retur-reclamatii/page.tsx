import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { CONTACT } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Retur și reclamații',
  description: 'Politica de retur și reclamații — Haier România.',
}

export default function ReturReclamatiiPage() {
  return (
    <div className="pt-28 pb-16">
      <Container size="md">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Retur și reclamații</h1>
        <p className="mt-2 text-sm text-gray-400">Ultima actualizare: Martie 2026</p>

        <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
          <h2 className="text-xl font-bold text-gray-900">1. Politica de retur</h2>
          <p>
            Conform OUG 34/2014, aveți dreptul de a returna produsul în termen de 14 zile
            calendaristice de la primire, fără a fi necesară motivarea deciziei.
          </p>
          <p>Condiții pentru retur:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Produsul trebuie să fie în ambalajul original, nefolosit și nedeteriorat</li>
            <li>Toate accesoriile, documentele și etichetele originale trebuie incluse</li>
            <li>Produsele instalate nu pot fi returnate</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900">2. Garanție</h2>
          <p>
            Toate produsele Haier beneficiază de garanție standard de 36 luni de la data
            achiziției. Garanția poate fi extinsă cu 2 ani suplimentari contra cost.
          </p>
          <p>
            Garanția acoperă defectele de fabricație și componentele defecte. Nu acoperă
            daunele cauzate de instalare necorespunzătoare, utilizare improprie sau factori
            externi (supratensiune, calamități naturale).
          </p>

          <h2 className="text-xl font-bold text-gray-900">3. Reclamații</h2>
          <p>
            Pentru reclamații sau sesizări, ne puteți contacta prin:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email: {CONTACT.email}</li>
            <li>Telefon: {CONTACT.phone}</li>
            <li><Link href="/contact" className="text-sky-600 hover:underline">Formularul de contact</Link></li>
          </ul>
          <p>
            Vom răspunde la reclamații în termen de maximum 30 de zile calendaristice.
          </p>

          <h2 className="text-xl font-bold text-gray-900">4. ANPC</h2>
          <p>
            În cazul în care nu sunteți mulțumit de modul de soluționare a reclamației,
            vă puteți adresa Autorității Naționale pentru Protecția Consumatorilor (ANPC):
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Site: <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">anpc.ro</a>
            </li>
            <li>
              Soluționare alternativă a litigiilor (SAL/ODR):{' '}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                ec.europa.eu/consumers/odr
              </a>
            </li>
          </ul>
        </div>
      </Container>
    </div>
  )
}

import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'Politica de confidențialitate',
  description: 'Politica de confidențialitate și protecția datelor personale — Haier România.',
}

export default function PoliticaConfidentialitatePage() {
  return (
    <div className="pt-28 pb-16">
      <Container size="md">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Politica de confidențialitate (GDPR)
        </h1>
        <p className="mt-2 text-sm text-gray-400">Ultima actualizare: Martie 2026</p>

        <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
          <h2 className="text-xl font-bold text-gray-900">1. Operatorul de date</h2>
          <p>
            Operatorul de date cu caracter personal este Haier România, cu sediul în România.
            Protecția datelor dumneavoastră personale este o prioritate pentru noi.
          </p>

          <h2 className="text-xl font-bold text-gray-900">2. Date colectate</h2>
          <p>Colectăm următoarele categorii de date personale:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Date de identificare: nume, prenume</li>
            <li>Date de contact: email, telefon</li>
            <li>Date de utilizare: preferințe de produse, configurații solicitate</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900">3. Scopul prelucrării</h2>
          <p>Datele personale sunt prelucrate exclusiv pentru:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Răspunsul la cererile de ofertă</li>
            <li>Furnizarea de consultanță tehnică</li>
            <li>Comunicări comerciale (doar cu acordul explicit)</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900">4. Drepturile dumneavoastră</h2>
          <p>
            Conform GDPR (Regulamentul UE 2016/679), aveți dreptul de acces, rectificare,
            ștergere, restricționare, portabilitate și opoziție. Pentru exercitarea acestor
            drepturi, contactați-ne prin formularul de contact sau la adresa de email disponibilă
            pe pagina de contact.
          </p>

          <h2 className="text-xl font-bold text-gray-900">5. Perioada de stocare</h2>
          <p>
            Datele personale sunt stocate pe durata necesară îndeplinirii scopurilor pentru
            care au fost colectate, respectând obligațiile legale aplicabile.
          </p>

          <h2 className="text-xl font-bold text-gray-900">6. Securitatea datelor</h2>
          <p>
            Implementăm măsuri tehnice și organizatorice adecvate pentru protejarea datelor
            împotriva accesului neautorizat, pierderii sau distrugerii.
          </p>

          <h2 className="text-xl font-bold text-gray-900">7. Autoritatea de supraveghere</h2>
          <p>
            Dacă considerați că prelucrarea datelor dumneavoastră încalcă GDPR, aveți dreptul
            de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării
            Datelor cu Caracter Personal (ANSPDCP) — <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">www.dataprotection.ro</a>.
          </p>
        </div>
      </Container>
    </div>
  )
}

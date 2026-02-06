'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Spec {
  icon: string
  title: string
  description: string
}

const specs: Spec[] = [
  // --- Confort & Performanță ---
  {
    icon: '/images/specificatii/ikona-self-clean-80x80-1.webp',
    title: 'Self Clean',
    description:
      'Funcția de autocurățare elimină umezeala și previne formarea mucegaiului pe bateria evaporatorului.',
  },
  {
    icon: '/images/specificatii/ikona-steri-clean-80x80-1.webp',
    title: 'Steri Clean',
    description:
      'Sterilizare avansată care elimină până la 99.9% din bacterii și viruși din interiorul unității.',
  },
  {
    icon: '/images/specificatii/ikona-self-hygiene-80x80-1.webp',
    title: 'Self Hygiene',
    description:
      'Sistem automat de igienizare care menține curățenia internă a unității de aer condiționat.',
  },
  {
    icon: '/images/specificatii/ikona-przeplyw-powietrza-3d-80x80-1.webp',
    title: 'Flux de Aer 3D',
    description:
      'Distribuție uniformă a aerului în toate direcțiile pentru confort maxim în întreaga încăpere.',
  },
  {
    icon: '/images/specificatii/ikona-silny-przeplyw-powietrza-80x80-1.webp',
    title: 'Flux de Aer Puternic',
    description:
      'Debit mare de aer pentru răcire sau încălzire rapidă a spațiilor mari.',
  },
  {
    icon: '/images/specificatii/ikona-tryb-turbo-cooling-80x80-1.webp',
    title: 'Răcire Turbo',
    description:
      'Răcire rapidă a încăperii la temperatura dorită în cel mai scurt timp posibil.',
  },
  {
    icon: '/images/specificatii/ikona-i-feel-80x80-1.webp',
    title: 'I-Feel',
    description:
      'Senzorul de pe telecomandă măsoară temperatura din jurul utilizatorului pentru control precis.',
  },
  {
    icon: '/images/specificatii/ikona-bardzo-cicha-praca-80x80-1.webp',
    title: 'Funcționare Silențioasă',
    description:
      'Nivel de zgomot extrem de redus, ideal pentru dormitor și birouri.',
  },
  {
    icon: '/images/specificatii/ikona-komfortowy-sen-80x80-1.webp',
    title: 'Somn Confortabil',
    description:
      'Ajustare automată a temperaturii pe timpul nopții pentru un somn odihnitor.',
  },
  {
    icon: '/images/specificatii/ikona-tryb-quiet-80x80-1.webp',
    title: 'Mod Silențios',
    description:
      'Mod de funcționare cu zgomot redus pentru liniște maximă în orice situație.',
  },
  {
    icon: '/images/specificatii/ikona-precyzyjna-nastawa-temperatur-80x80-1.webp',
    title: 'Temperatură Precisă',
    description:
      'Setare precisă a temperaturii cu precizie de 0.5°C pentru confort personalizat.',
  },
  {
    icon: '/images/specificatii/ikona-precyzyjne-osuszanie-80x80-1.webp',
    title: 'Dezumidificare Precisă',
    description:
      'Control precis al nivelului de umiditate pentru un climat interior optim.',
  },
  {
    icon: '/images/specificatii/ikona-funkcja-osuszania-80x80-1.webp',
    title: 'Funcție Dezumidificare',
    description:
      'Mod dedicat de dezumidificare a aerului din încăpere, fără răcire semnificativă.',
  },
  {
    icon: '/images/specificatii/ikona-cieply-start-80x80-1.webp',
    title: 'Start Cald',
    description:
      'Evită suflarea aerului rece la pornirea modului de încălzire, oferind confort imediat.',
  },
  {
    icon: '/images/specificatii/ikona-regulacja-zaluzji-w-pionie-80x80-1.webp',
    title: 'Reglare Jaluzele Verticale',
    description:
      'Motorul pas cu pas permite reglarea jaluzelelor pe verticală, oferind un flux de aer mai larg.',
  },
  // --- Control ---
  {
    icon: '/images/specificatii/ikona-sterowanie-wifi-80x80-1.webp',
    title: 'Control Wi-Fi',
    description:
      'Control de la distanță prin aplicația hOn, direct de pe smartphone.',
  },
  {
    icon: '/images/specificatii/ikona-czujnik-eco-80x80-1.webp',
    title: 'Senzor ECO',
    description:
      'Detectează prezența persoanelor și ajustează automat funcționarea pentru economie de energie.',
  },
  {
    icon: '/images/specificatii/ikona-sterowanie-przewodowe-80x80-1.webp',
    title: 'Control Cu Fir',
    description:
      'Posibilitate de conectare a unui termostat cu fir pentru control centralizat.',
  },
  {
    icon: '/images/specificatii/ikona-karta-on-off-80x80-1.webp',
    title: 'Card On/Off',
    description:
      'Funcție card on/off pentru controlul automat al alimentării unității.',
  },
  {
    icon: '/images/specificatii/ikona-wyswietlacz-led-80x80-1.webp',
    title: 'Afișaj LED',
    description:
      'Afișaj LED elegant și ușor de citit pe unitatea interioară.',
  },
  {
    icon: '/images/specificatii/ikona-regulator-czasowy-24h-80x80-1.webp',
    title: 'Timer 24h',
    description:
      'Programare pornire/oprire automată pe 24 de ore, pentru comoditate maximă.',
  },
  {
    icon: '/images/specificatii/ikona-5-stopniowa-regulacja-wentylatora-80x80-1.webp',
    title: 'Ventilator 5 Trepte',
    description:
      '5 trepte de viteză pentru ventilator, adaptabile nevoilor de confort.',
  },
  // --- Tehnologie ---
  {
    icon: '/images/specificatii/ikona-technologia-inwerterowa-80x80-1.webp',
    title: 'Tehnologie Inverter',
    description:
      'Compresor cu tehnologie inverter pentru economie de energie și confort constant.',
  },
  {
    icon: '/images/specificatii/ikona-silnik-dc-80x80-1.webp',
    title: 'Motor DC',
    description:
      'Motor DC cu eficiență energetică ridicată și funcționare silențioasă.',
  },
  {
    icon: '/images/specificatii/ikona-sprezarka-dc-80x80-1.webp',
    title: 'Compresor DC',
    description:
      'Compresor cu curent continuu pentru performanță și durabilitate superioară.',
  },
  {
    icon: '/images/specificatii/ikona-pid-80x80-1.webp',
    title: 'Control PID',
    description:
      'Algoritm PID avansat pentru reglarea precisă a temperaturii și reducerea fluctuațiilor.',
  },
  {
    icon: '/images/specificatii/ikona-blue-fin-80x80-1.webp',
    title: 'Blue Fin',
    description:
      'Tratament anticoroziv Blue Fin pentru bateriile schimbătoarelor de căldură, mărind durabilitatea.',
  },
  // --- Protecție & Întreținere ---
  {
    icon: '/images/specificatii/ikona-ochrona-3-minutowa-80x80-1.webp',
    title: 'Protecție 3 Minute',
    description:
      'Protejează compresorul prin întârzierea repornirii cu 3 minute după oprire.',
  },
  {
    icon: '/images/specificatii/ikona-inteligentne-odszranianie-80x80-1.webp',
    title: 'Dezghețare Inteligentă',
    description:
      'Sistem inteligent de dezghețare care optimizează ciclul pentru eficiență maximă.',
  },
  {
    icon: '/images/specificatii/ikona-utrzymywanie-temperatury-10-stopni-80x80-1.webp',
    title: 'Menținere 10°C',
    description:
      'Menține temperatura minimă de 10°C pentru protecția încăperii în perioadele reci.',
  },
  {
    icon: '/images/specificatii/ikona-auto-restart-80x80-1.webp',
    title: 'Auto Restart',
    description:
      'Repornire automată cu ultimele setări după o întrerupere de curent.',
  },
  {
    icon: '/images/specificatii/ikona-autodiagnoza-80x80-1.webp',
    title: 'Autodiagnoză',
    description:
      'Sistem automat de diagnosticare a erorilor pentru identificare și service rapid.',
  },
  // --- Instalare & Service ---
  {
    icon: '/images/specificatii/ikona-zdejmowana-pokrywa-80x80-1.webp',
    title: 'Capac Detașabil',
    description:
      'Capac frontal detașabil pentru curățare și întreținere ușoară.',
  },
  {
    icon: '/images/specificatii/ikona-latwa-naprawa-silnika-80x80-1.webp',
    title: 'Reparare Ușoară Motor',
    description:
      'Acces facil la motorul ventilatorului pentru service și întreținere rapidă.',
  },
  {
    icon: '/images/specificatii/ikona-2-drogowe-podlaczenie-rur-80x80-1.webp',
    title: 'Conexiune Țevi 2 Căi',
    description:
      'Flexibilitate în instalare cu posibilitate de conectare a țevilor din 2 direcții.',
  },
  {
    icon: '/images/specificatii/ikona-trwaly-pcb-80x80-1.webp',
    title: 'PCB Durabil',
    description:
      'Placă electronică protejată și durabilă pentru fiabilitate pe termen lung.',
  },
  {
    icon: '/images/specificatii/ikona-zintegrowana-konstrukcja-80x80-1.webp',
    title: 'Construcție Integrată',
    description:
      'Design compact și integrat pentru o instalare eficientă și estetică.',
  },
  {
    icon: '/images/specificatii/ikona-pokrywa-zaworu.webp',
    title: 'Capac Supapă',
    description:
      'Capac de protecție pentru supapele de conectare, inclus în echiparea standard.',
  },
]

export function ProductSpecs() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section className="mt-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Specificații tehnice
        </h2>
        <p className="mt-1 text-gray-500">
          Tehnologii și funcționalități disponibile
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {specs.map((spec, index) => (
          <div
            key={index}
            className="relative cursor-pointer"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onClick={() =>
              setActiveIndex(activeIndex === index ? null : index)
            }
          >
            <div
              className={`rounded-xl p-4 transition-all duration-300 ${
                activeIndex === index
                  ? 'bg-sky-800 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-900 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative h-9 w-9 shrink-0">
                  <Image
                    src={spec.icon}
                    alt=""
                    width={36}
                    height={36}
                    className={`h-9 w-9 object-contain transition-all duration-300 ${
                      activeIndex === index ? 'invert' : ''
                    }`}
                  />
                </div>
                <span className="text-xs font-semibold leading-tight">
                  {spec.title}
                </span>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index
                    ? 'mt-2.5 max-h-32 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-xs leading-relaxed opacity-90">
                  {spec.description}
                </p>
              </div>
            </div>
            {/* Triangle pointer */}
            <div
              className={`flex justify-center transition-all duration-300 ${
                activeIndex === index ? 'opacity-100' : 'h-0 opacity-0'
              }`}
            >
              <div className="h-0 w-0 border-x-[10px] border-t-[8px] border-x-transparent border-t-sky-800" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

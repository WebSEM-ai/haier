'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Feature {
  icon: string
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: '/images/descriere/ikona-1@2.webp',
    title: 'Agent Frigorific R32',
    description:
      'Agent frigorific ecologic R32 cu potențial scăzut de încălzire globală (GWP=675), contribuind la protecția mediului.',
  },
  {
    icon: '/images/descriere/ikona-sterowanie-wifi-80x80-1.webp',
    title: 'Control Wi-Fi',
    description:
      'Controlează unitatea de oriunde prin intermediul aplicației hOn, direct de pe smartphone.',
  },
  {
    icon: '/images/descriere/ikona-8@2.webp',
    title: 'Senzor ECO',
    description:
      'Detectează automat prezența persoanelor în cameră și ajustează temperatura pentru economie maximă de energie.',
  },
  {
    icon: '/images/descriere/ikona-3@2.webp',
    title: 'Self Clean',
    description:
      'Funcția de autocurățare previne acumularea de bacterii și mucegai pe bateria evaporatorului.',
  },
  {
    icon: '/images/descriere/ikona-10@2.webp',
    title: 'Somn Confortabil',
    description:
      'Modul de somn ajustează automat temperatura și reduce nivelul de zgomot pentru un somn odihnitor.',
  },
  {
    icon: '/images/descriere/ikona-precyzyjna-nastawa-temperatur-80x80-1.webp',
    title: 'Temperatură Precisă',
    description:
      'Control precis al temperaturii cu precizie de 0.5°C pentru confort maxim în orice anotimp.',
  },
  {
    icon: '/images/descriere/ikona-13@2.webp',
    title: 'Sterilizare 56°C',
    description:
      'Procesul de sterilizare la 56°C elimină până la 99.9% din bacterii și viruși de pe bateria interioară.',
  },
  {
    icon: '/images/descriere/ikona-12@2.webp',
    title: 'Filtrare Avansată',
    description:
      'Sistem de filtrare cu mai multe straturi care asigură un aer curat și sănătos în întreaga locuință.',
  },
]

export function ProductFeatures() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section className="mt-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Caracteristici principale
        </h2>
        <p className="mt-1 text-gray-500">
          Tehnologii avansate pentru confort și eficiență
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="relative cursor-pointer"
            onClick={() =>
              setActiveIndex(activeIndex === index ? null : index)
            }
          >
            <div
              className={`rounded-2xl p-5 transition-all duration-300 ${
                activeIndex === index
                  ? 'bg-sky-800 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0">
                  <Image
                    src={feature.icon}
                    alt=""
                    width={40}
                    height={40}
                    className={`h-10 w-10 object-contain transition-all duration-300 ${
                      activeIndex === index ? 'invert' : ''
                    }`}
                  />
                </div>
                <span className="text-sm font-semibold leading-tight">
                  {feature.title}
                </span>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index
                    ? 'mt-3 max-h-40 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-sm leading-relaxed opacity-90">
                  {feature.description}
                </p>
              </div>
            </div>
            {/* Triangle pointer */}
            <div
              className={`flex justify-center transition-all duration-300 ${
                activeIndex === index ? 'opacity-100' : 'h-0 opacity-0'
              }`}
            >
              <div className="h-0 w-0 border-x-[12px] border-t-[10px] border-x-transparent border-t-sky-800" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

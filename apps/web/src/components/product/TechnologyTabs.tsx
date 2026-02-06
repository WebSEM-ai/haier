'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const tabs = [
  {
    label: 'Control Wi-Fi',
    icon: '/images/sectiuni/i-feel.webp',
    photo: '/images/sectiuni/haier_sterowanie_wi_fi.webp',
    title: 'Control Total, Chiar și de la Distanță',
    subtitle: 'Tehnologia Wi-Fi Standard de la Haier',
    intro:
      'Imaginează-ți cum ar fi să pășești într-o casă perfect răcorită, exact în momentul în care afară canicula devine insuportabilă. Cu aparatele de aer condiționat Haier, acest lucru nu mai este un lux, ci o realitate zilnică.',
    benefitsHeading: 'De ce să alegi controlul inteligent prin aplicația hOn?',
    benefits: [
      {
        title: 'Confort înainte de sosire',
        text: 'Pornește răcirea prin smartphone sau tabletă în timp ce ești încă la birou sau în trafic. Te vei întoarce mereu într-o oază de prospețime.',
      },
      {
        title: 'Simplitate la un click distanță',
        text: 'Interfața aplicației hOn este intuitivă și ușor de utilizat, oferindu-ți control deplin asupra tuturor setărilor, oriunde te-ai afla.',
      },
      {
        title: 'Programare personalizată',
        text: 'Uită de grija setărilor zilnice! Poți crea scenarii săptămânale și programe de funcționare care să se adapteze ritmului tău de viață, economisind în același timp energie.',
      },
      {
        title: 'O singură aplicație, control total',
        text: 'Gestionează mai multe unități de aer condiționat dintr-o singură aplicație inteligentă creată pentru a-ți simplifica viața.',
      },
    ],
  },
  {
    label: 'Senzor ECO',
    icon: '/images/sectiuni/ikona-8@2.webp',
    photo: '/images/sectiuni/haier_czujnik_eco.webp',
    title: 'Senzorul ECO',
    subtitle: 'Tehnologia care te „simte" și are grijă de bugetul tău',
    intro:
      'Uită de setările complicate și de grija facturilor la energie! Cu Senzorul Inteligent ECO de la Haier, aparatul tău de aer condiționat devine un aliat care lucrează proactiv pentru confortul și buzunarul tău.',
    benefitsHeading: 'De ce este Senzorul ECO o dotare esențială?',
    benefits: [
      {
        title: 'Confort fără curent direct',
        text: 'Senzorul monitorizează în timp real prezența și mișcările tale în cameră, având grijă să direcționeze fluxul de aer departe de tine. Bucură-te de răcoare fără senzația neplăcută de „aer care te trage" direct în față.',
      },
      {
        title: 'Economie inteligentă pe pilot automat',
        text: 'Atunci când părăsești încăperea, senzorul detectează absența și trece automat aparatul într-un mod de consum redus. Astfel, elimini pierderile de energie fără să ridici un deget.',
      },
      {
        title: 'Eficiență fără compromis',
        text: 'Obții climatul ideal exact atunci când ai nevoie, dar cu un consum minim de resurse. Este soluția sustenabilă care îmbină grija pentru mediu cu relaxarea ta absolută.',
      },
    ],
  },
  {
    label: 'Precizie 0.5°C',
    icon: '/images/sectiuni/ikona-precyzyjna-nastawa-temp-150x150-1.webp',
    photo: '/images/sectiuni/haier_precyzyjne_dopasowanie_temperatury.webp',
    title: 'Control Milimetric',
    subtitle: 'Precizie Absolută de 0,5°C',
    intro:
      'Majoritatea aparatelor de aer condiționat îți permit să modifici temperatura doar din grad în grad, lăsându-te adesea într-o dilemă: la 24°C este prea cald, iar la 23°C deja simți răcoare. Haier elimină acest compromis prin sistemul de reglaj fin al temperaturii.',
    benefitsHeading: 'De ce contează precizia de 0,5°C?',
    benefits: [
      {
        title: 'Confort personalizat la micro-nivel',
        text: 'Corpul uman este extrem de sensibil la micile variații termice. Reglajul fin îți permite să găsești „punctul ideal" de confort, adaptând atmosfera exact după preferințele tale.',
      },
      {
        title: 'Echilibrul perfect între consum și performanță',
        text: 'Fiecare grad în minus înseamnă un consum suplimentar de energie. Prin posibilitatea de a seta 24,5°C în loc de 24°C, aparatul funcționează mai eficient, cu economie vizibilă la factură.',
      },
      {
        title: 'Stabilitate constantă',
        text: 'Sistemul nu doar că permite setarea precisă, dar menține acea valoare constantă pe tot parcursul zilei. Vei uita de fluctuațiile bruște de temperatură care pot apărea la sistemele convenționale.',
      },
      {
        title: 'Somn odihnitor și sănătate',
        text: 'Setarea precisă este esențială pe timpul nopții, când temperatura corpului scade. O jumătate de grad poate face diferența dintre un somn agitat și unul profund.',
      },
    ],
  },
  {
    label: '56°C Steri Clean',
    icon: '/images/sectiuni/ikona-13@2.webp',
    photo: '/images/sectiuni/haier_56oc_steri_clean.webp',
    title: 'Igienă Absolută și Sterilizare prin Căldură',
    subtitle: '56°C Steri Clean',
    intro:
      'Sănătatea ta și a familiei tale depinde de calitatea aerului pe care îl respiri. Tehnologia 56°C Steri Clean de la Haier este gardianul tău împotriva agenților patogeni, asigurându-se că interiorul aparatului rămâne la fel de curat ca aerul de munte.',
    benefitsHeading: 'Cum funcționează procesul de sterilizare?',
    benefits: [
      {
        title: 'Dezinfectare termică radicală',
        text: 'Funcția ridică temperatura schimbătorului de căldură la 56°C și o menține constantă timp de 30 de minute. Această valoare este pragul termic letal pentru majoritatea bacteriilor și virusurilor.',
      },
      {
        title: 'Eliminarea microorganismelor',
        text: 'Prin acest proces de „pasteurizare" a aparatului, sunt distruse sursele de poluare biologică ce se pot acumula pe componentele interne, prevenind dezvoltarea mucegaiului și a mirosurilor neplăcute.',
      },
      {
        title: 'Aer pur la fiecare pornire',
        text: 'Deoarece interiorul aparatului este sterilizat periodic, aerul suflat în cameră va fi întotdeauna proaspăt, oferindu-ți liniște deplină.',
      },
      {
        title: 'Control inteligent prin aplicație',
        text: 'Poți activa funcția Steri Clean direct din aplicația hOn de pe telefonul tău, oricând simți nevoia unei igienizări profesionale, fără intervenția unui tehnician.',
      },
    ],
  },
  {
    label: 'Self Hygiene',
    icon: '/images/sectiuni/ikona-12@2.webp',
    photo: '/images/sectiuni/grafika-4.webp',
    title: 'Inovația din Spatele Prospețimii',
    subtitle: 'Protecție cu Ioni de Argint',
    intro:
      'Componentele interne prin care circulă aerul sunt tratate cu un strat special cu nanoparticule de argint. Acestea au proprietăți antiseptice naturale, care distrug bacteriile și mucegaiul în momentul în care intră în contact cu suprafața tratată.',
    benefitsHeading: 'De ce contează Self Hygiene?',
    benefits: [
      {
        title: 'Prevenție activă 24/7',
        text: 'Spre deosebire de funcțiile care se activează la cerere, Self Hygiene lucrează în permanență. Stratul antibacterian inhibă dezvoltarea microorganismelor pe termen lung, prevenind formarea coloniilor de bacterii în locurile greu accesibile.',
      },
      {
        title: 'Eliminarea mirosurilor neplăcute',
        text: 'De cele mai multe ori, mirosurile grele provin din acumularea de bacterii în interiorul aparatului. Datorită barierei de argint, sursa acestor mirosuri este eliminată, asigurând un flux de aer proaspăt și curat la fiecare utilizare.',
      },
      {
        title: 'Eficiență pe termen lung',
        text: 'Această tehnologie nu doar că îmbunătățește calitatea aerului respirat, dar protejează și permite o circulație mai bună a aerului și o durată de viață mai lungă a componentelor.',
      },
    ],
  },
  {
    label: 'Self Clean',
    icon: '/images/sectiuni/ikona-3@2.webp',
    photo: '/images/sectiuni/grafika-5.webp',
    title: 'Autocurățare Inteligentă',
    subtitle: 'Tehnologia Self Clean',
    intro:
      'Impuritățile acumulate pe schimbătorul de căldură favorizează dezvoltarea bacteriilor, degradează calitatea aerului și pot reduce eficiența răcirii cu 15-30%. Self Clean elimină această problemă automat.',
    benefitsHeading: 'Cum funcționează Self Clean?',
    benefits: [
      {
        title: 'Curățare prin îngheț și dezgheț',
        text: 'Self Clean utilizează aerul umed pentru a îngheța suprafața evaporatorului, apoi elimină impuritățile în timpul dezghețării, asigurând aer curat și proaspăt.',
      },
      {
        title: 'Igienă îmbunătățită',
        text: 'Prin curățarea automată regulată, se previne acumularea de bacterii și mucegai pe bateria evaporatorului, menținând un mediu sănătos.',
      },
      {
        title: 'Performanță constantă',
        text: 'Un evaporator curat funcționează la capacitate maximă. Self Clean previne scăderea eficienței de răcire cauzată de depunerile de impurități.',
      },
    ],
  },
]

export function TechnologyTabs() {
  const [activeTab, setActiveTab] = useState(0)
  const current = tabs[activeTab]

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mt-20"
    >
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
          Tehnologii Haier
        </p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
          Inovație în fiecare detaliu
        </h2>
      </div>

      {/* Tab buttons */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(index)}
            className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === index
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {activeTab === index && (
              <motion.div
                layoutId="tech-tab-bg"
                className="absolute inset-0 rounded-full bg-sky-600"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Image
              src={tab.icon}
              alt=""
              width={24}
              height={24}
              className="relative z-10 h-6 w-6 object-contain"
            />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden rounded-2xl bg-gray-50"
        >
          <div className="grid lg:grid-cols-2">
            {/* Left column — text */}
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100">
                  <Image
                    src={current.icon}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {current.title}
                  </h3>
                  <p className="text-sm text-sky-600">{current.subtitle}</p>
                </div>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-gray-600">
                {current.intro}
              </p>

              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                {current.benefitsHeading}
              </p>

              <ul className="space-y-4">
                {current.benefits.map((benefit, i) => (
                  <motion.li
                    key={benefit.title}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="flex gap-3"
                  >
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-600 text-[10px] font-bold text-white">
                      ✓
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-gray-900">
                        {benefit.title}
                      </span>
                      <p className="mt-0.5 text-sm leading-relaxed text-gray-500">
                        {benefit.text}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Right column — photo */}
            <div className="relative min-h-[400px] lg:min-h-[500px]">
              <Image
                src={current.photo}
                alt={current.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  )
}

import Image from 'next/image'

const conveniences = [
  {
    image: '/images/pompe-caldura/control-usor.webp',
    title: 'Control ușor',
    description:
      'Panoul de control integrat oferă atât o interfață simplă pentru utilizator, cât și una dedicată instalatorului, făcând operarea mai confortabilă și intuitivă.',
  },
  {
    image: '/images/pompe-caldura/mod-boost.webp',
    title: 'Mod BOOST',
    description:
      'Permite furnizarea rapidă de apă caldă, asigurând eficiență maximă în cel mai scurt timp.',
  },
  {
    image: '/images/pompe-caldura/mod-eco.webp',
    title: 'Mod ECO',
    description:
      'Modul ECO permite setarea temperaturii apei la un nivel mai scăzut decât cel standard, reducând consumul de energie.',
  },
]

const features = [
  {
    image: '/images/pompe-caldura/recuperare-caldura.webp',
    title: 'Recuperare de căldură',
    subtitle: 'Fără costuri suplimentare pentru apă caldă',
    description:
      'Sistemul Haier utilizează o tehnologie modernă de recuperare a căldurii, care folosește inteligent căldura captată din încăperi pentru a încălzi apa din boiler. Astfel, se asigură simultan climatizarea și încălzirea apei, maximizând eficiența energetică și minimizând pierderile de căldură.',
    imagePosition: 'right' as const,
  },
  {
    image: '/images/pompe-caldura/rezervor-emailat.webp',
    title: 'Rezervor emailat',
    description:
      'Rezervorul emailat combină o rezistență excepțională cu protecție avansată împotriva coroziunii, fiind o soluție fiabilă și durabilă. Garantează performanță de lungă durată, oferind liniște și siguranță utilizatorilor pentru mulți ani.',
    imagePosition: 'left' as const,
  },
  {
    image: '/images/pompe-caldura/dezinfectie-rezervor.webp',
    title: 'Funcția de dezinfecție a rezervorului',
    description:
      'Funcția de sterilizare, executată o dată pe săptămână, asigură furnizarea igienică a apei calde menajere, menținând curățenia și siguranța utilizatorilor în permanență.',
    imagePosition: 'right' as const,
  },
  {
    image: '/images/pompe-caldura/incalzire-75c.webp',
    title: 'Încălzire apă până la 75°C',
    description:
      'Temperatura maximă a apei fără rezistența electrică este de 55°C, iar cu aceasta pornită poate ajunge până la 75°C. Sistemul asigură încălzirea confortabilă a apei, adaptând temperatura la nevoile utilizatorilor. Rezistența electrică permite ridicarea rapidă a temperaturii, garantând confort și eficiență în orice situație.',
    imagePosition: 'left' as const,
  },
]

export function HeatPumpFeatures() {
  return (
    <>
      {/* ═══ Convenience Cards (3 columns) ═══ */}
      <section className="mt-16">
        <h2 className="mb-10 text-center text-2xl font-bold uppercase tracking-wide text-gray-900">
          Facilități adaptate nevoilor zilnice
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {conveniences.map((item) => (
            <div key={item.title} className="group text-center">
              <div className="mx-auto mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-bold uppercase tracking-wide text-gray-900">
                {item.title}
              </h3>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Feature Sections (alternating layout) ═══ */}
      {features.map((feature, index) => {
        const isImageLeft = feature.imagePosition === 'left'
        const bgClass = index % 2 === 1 ? 'bg-stone-50' : 'bg-white'

        return (
          <section
            key={feature.title}
            className={`mt-0 -mx-4 px-4 py-16 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 ${bgClass}`}
          >
            <div className="mx-auto max-w-6xl">
              <div
                className={`grid items-center gap-10 lg:grid-cols-2 ${
                  isImageLeft ? '' : 'lg:[&>*:first-child]:order-2'
                }`}
              >
                {/* Image */}
                <div className="overflow-hidden rounded-2xl">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-2xl font-bold uppercase leading-tight text-gray-900 lg:text-3xl">
                    {feature.title}
                  </h3>
                  {feature.subtitle && (
                    <p className="mt-2 text-lg font-medium text-sky-600">
                      {feature.subtitle}
                    </p>
                  )}
                  <p className="mt-4 text-base leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { InquiryDialog } from '@/components/product/InquiryDialog'
import { ProductFeatures } from '@/components/product/ProductFeatures'
import { TechnologyTabs } from '@/components/product/TechnologyTabs'
import { ProductSpecs } from '@/components/product/ProductSpecs'
import { getProductBySlug, getCategoryBySlug, type Product } from '@/lib/payload'
import { R2_PUBLIC_URL } from '@/lib/constants'

/* ─── Energy class label (arrow style) ─── */

const energyClassColors: Record<string, string> = {
  'A+++': 'bg-green-700',
  'A++': 'bg-green-600',
  'A+': 'bg-green-500',
  A: 'bg-lime-500',
  B: 'bg-yellow-500',
  C: 'bg-orange-500',
  D: 'bg-red-500',
}

function EnergyLabel({ type, value }: { type: 'cooling' | 'heating'; value: string }) {
  const bgClass = energyClassColors[value] || 'bg-green-600'
  const borderClass = bgClass.replace('bg-', 'border-l-')
  const icon =
    type === 'cooling'
      ? 'M12 3v1m0 16v1m-8-9H3m18 0h-1M5.636 5.636l.707.707m11.314 11.314l.707.707M5.636 18.364l.707-.707m11.314-11.314l.707-.707'
      : 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 6.51 6.51 0 009 11.5a3 3 0 105.356-1.857 6.474 6.474 0 011.006-4.429z'
  const label = type === 'cooling' ? 'Răcire' : 'Încălzire'

  return (
    <div className="flex items-center">
      <div className={`${bgClass} flex items-center gap-1.5 rounded-l-md px-3 py-1.5 text-sm font-bold text-white`}>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
        {label}: {value}
      </div>
      <div className={`h-0 w-0 border-y-[16px] border-l-[10px] border-y-transparent ${borderClass}`} />
    </div>
  )
}

/* ─── Spec row helper ─── */

interface SpecRow {
  label: string
  value: string | null | undefined
  unit?: string
}

function buildSpecSections(product: Product) {
  const sections: { title: string; rows: SpecRow[] }[] = [
    {
      title: 'Răcire',
      rows: [
        { label: 'Capacitate nominală', value: product.coolingCapacityNominal },
        { label: 'Interval capacitate', value: product.coolingCapacityRange },
        { label: 'Consum putere', value: product.coolingPowerConsumption },
        { label: 'Interval consum', value: product.coolingPowerRange },
        { label: 'SEER', value: product.seer },
        { label: 'EER', value: product.eer },
        { label: 'Clasă energetică', value: product.energyClassCooling },
      ],
    },
    {
      title: 'Încălzire',
      rows: [
        { label: 'Capacitate nominală', value: product.heatingCapacityNominal },
        { label: 'Interval capacitate', value: product.heatingCapacityRange },
        { label: 'Consum putere', value: product.heatingPowerConsumption },
        { label: 'Interval consum', value: product.heatingPowerRange },
        { label: 'SCOP', value: product.scop },
        { label: 'COP', value: product.cop },
        { label: 'Clasă energetică', value: product.energyClassHeating },
      ],
    },
    {
      title: 'Unitate Interioară',
      rows: [
        { label: 'Dimensiuni (L x A x Î)', value: product.indoorDimensions },
        { label: 'Greutate', value: product.indoorWeight },
        { label: 'Zgomot maxim', value: product.indoorNoiseMax },
        { label: 'Nivele zgomot', value: product.indoorNoiseLevels },
      ],
    },
    {
      title: 'Unitate Exterioară',
      rows: [
        { label: 'Dimensiuni (L x A x Î)', value: product.outdoorDimensions },
        { label: 'Greutate', value: product.outdoorWeight },
        { label: 'Zgomot maxim', value: product.outdoorNoiseMax },
        { label: 'Tip compresor', value: product.compressorType },
      ],
    },
    {
      title: 'General',
      rows: [
        { label: 'Agent frigorific', value: product.refrigerant },
        { label: 'Alimentare', value: product.powerSupply },
        { label: 'Garanție', value: product.warranty },
        { label: 'Fabricat în', value: product.madeIn },
      ],
    },
  ]

  // Only return sections that have at least one value
  return sections
    .map((s) => ({
      ...s,
      rows: s.rows.filter((r) => r.value),
    }))
    .filter((s) => s.rows.length > 0)
}

/* ─── Page ─── */

interface ProductPageProps {
  params: Promise<{ category: string; slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: 'Produs negăsit' }
  }

  return {
    title: product.title,
    description: product.shortDescription || `${product.title} - ${product.modelCode}`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const category = product.categorySlug ? await getCategoryBySlug(product.categorySlug) : null
  const imageUrl = product.mainImageFilename
    ? `${R2_PUBLIC_URL}/${product.mainImageFilename}`
    : null

  const specSections = buildSpecSections(product)

  // Key specs for the right-side summary
  const keySpecs = [
    { label: 'Putere răcire', value: product.coolingCapacityNominal },
    { label: 'Putere încălzire', value: product.heatingCapacityNominal },
    { label: 'SEER', value: product.seer },
    { label: 'SCOP', value: product.scop },
    { label: 'Agent frigorific', value: product.refrigerant },
    { label: 'Alimentare', value: product.powerSupply },
    { label: 'Garanție', value: product.warranty },
  ].filter((s) => s.value)

  return (
    <div className="pt-28 pb-12">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-900">Acasă</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/produse" className="hover:text-gray-900">Produse</Link>
            </li>
            {category && (
              <>
                <li>/</li>
                <li>
                  <Link href={`/produse/${category.slug}`} className="hover:text-gray-900">
                    {category.name}
                  </Link>
                </li>
              </>
            )}
            <li>/</li>
            <li className="truncate max-w-[200px] text-gray-900">{product.title}</li>
          </ol>
        </nav>

        {/* ═══ Hero: Image + Key Info ═══ */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left — Image */}
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="relative aspect-[4/3]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.title}
                  fill
                  className="object-contain p-8"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <svg className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Right — Product info + key specs */}
          <div>
            {product.series && (
              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-sky-600">
                {product.series}
              </p>
            )}

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{product.title}</h1>
            <p className="mt-1 text-sm text-gray-400">Cod: {product.modelCode}</p>

            {/* Energy labels */}
            {(product.energyClassCooling || product.energyClassHeating) && (
              <div className="mt-4 flex flex-wrap gap-3">
                {product.energyClassCooling && (
                  <EnergyLabel type="cooling" value={product.energyClassCooling} />
                )}
                {product.energyClassHeating && (
                  <EnergyLabel type="heating" value={product.energyClassHeating} />
                )}
              </div>
            )}

            {product.shortDescription && (
              <p className="mt-4 text-gray-600">{product.shortDescription}</p>
            )}

            {/* Key specs — compact table */}
            {keySpecs.length > 0 && (
              <dl className="mt-6 divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white">
                {keySpecs.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between px-4 py-2.5">
                    <dt className="text-sm text-gray-500">{spec.label}</dt>
                    <dd className="text-sm font-semibold text-gray-900">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {/* Feature icons */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                { icon: '/images/descriere/ikona-1@2.webp', title: 'R32' },
                { icon: '/images/descriere/ikona-sterowanie-wifi-80x80-1.webp', title: 'Wi-Fi' },
                { icon: '/images/descriere/ikona-8@2.webp', title: 'Senzor ECO' },
                { icon: '/images/descriere/ikona-3@2.webp', title: 'Self Clean' },
                { icon: '/images/descriere/ikona-10@2.webp', title: 'Somn' },
                { icon: '/images/descriere/ikona-precyzyjna-nastawa-temperatur-80x80-1.webp', title: '0.5°C' },
                { icon: '/images/descriere/ikona-13@2.webp', title: '56°C' },
                { icon: '/images/descriere/ikona-12@2.webp', title: 'Filtrare' },
              ].map((f) => (
                <div
                  key={f.title}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 ring-1 ring-gray-100"
                  title={f.title}
                >
                  <Image src={f.icon} alt={f.title} width={24} height={24} className="h-6 w-6 object-contain" />
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8">
              <InquiryDialog product={product} />
            </div>
          </div>
        </div>

        {/* ═══ Specifications Accordion ═══ */}
        {specSections.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-gray-900">
              Specificații tehnice
            </h2>
            <div className="divide-y divide-gray-200 rounded-xl border border-gray-200">
              {specSections.map((section, idx) => (
                <details key={section.title} className="group" open={idx === 0}>
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 transition-colors hover:bg-gray-50">
                    <span className="text-sm font-bold uppercase tracking-wider text-gray-700">
                      {section.title}
                    </span>
                    <svg
                      className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-45"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </summary>
                  <div className="border-t border-gray-100 bg-gray-50/50 px-5 pb-1">
                    <dl className="divide-y divide-gray-100">
                      {section.rows.map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between py-3"
                        >
                          <dt className="text-sm text-gray-500">{row.label}</dt>
                          <dd className="text-sm font-medium text-gray-900">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Feature highlights */}
        {product.featureHighlights && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-bold uppercase tracking-wide text-gray-900">
              Funcționalități
            </h2>
            <div className="flex flex-wrap gap-2">
              {product.featureHighlights.split(',').map((f) => (
                <span
                  key={f.trim()}
                  className="rounded-full bg-sky-50 px-4 py-1.5 text-sm font-medium text-sky-700 ring-1 ring-sky-100"
                >
                  {f.trim()}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Marketing sections */}
        <TechnologyTabs />
        <ProductFeatures />
        <ProductSpecs />
      </Container>
    </div>
  )
}

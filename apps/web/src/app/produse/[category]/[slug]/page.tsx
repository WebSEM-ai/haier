import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { InquiryDialog } from '@/components/product/InquiryDialog'
import { SpecsTabs, type SpecSection } from '@/components/product/SpecsTabs'
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

/* ─── Build spec sections for tabs ─── */

function buildSpecSections(product: Product): SpecSection[] {
  type RawRow = { label: string; value: string | null | undefined }

  const isHeatPump = product.productType === 'heat-pump'

  const raw: { title: string; rows: RawRow[] }[] = isHeatPump
    ? [
        {
          title: 'Performanță Încălzire',
          rows: [
            { label: 'Capacitate nominală', value: product.heatingCapacityNominal },
            { label: 'SCOP la 35°C', value: product.scopAt35 },
            { label: 'SCOP la 55°C', value: product.scopAt55 },
            { label: 'COP', value: product.cop },
            { label: 'Clasă energetică @35°C', value: product.energyClassHeating35 },
            { label: 'Clasă energetică @55°C', value: product.energyClassHeating55 },
            { label: 'Temp. max apă', value: product.maxWaterTemp },
          ],
        },
        {
          title: 'Performanță Răcire',
          rows: [
            { label: 'Capacitate nominală', value: product.coolingCapacityNominal },
            { label: 'EER', value: product.eer },
            { label: 'Clasă energetică', value: product.energyClassCooling },
          ],
        },
        {
          title: 'Unitate Monobloc',
          rows: [
            { label: 'Dimensiuni (L x A x Î)', value: product.unitDimensions },
            { label: 'Greutate', value: product.unitWeight },
            { label: 'Nivel putere sonoră', value: product.soundPowerLevel },
          ],
        },
        {
          title: 'General',
          rows: [
            { label: 'Agent frigorific', value: product.refrigerant },
            { label: 'Sarcină refrigerant', value: product.refrigerantCharge },
            { label: 'Alimentare', value: product.powerSupply },
            { label: 'Faze', value: product.phase },
            { label: 'Temp. min funcționare', value: product.operatingRangeMin },
            { label: 'Temp. max funcționare', value: product.operatingRangeMax },
            { label: 'Garanție', value: product.warranty },
          ],
        },
      ]
    : [
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

  return raw
    .map((s) => ({
      title: s.title,
      rows: s.rows.filter((r): r is { label: string; value: string } => !!r.value),
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

  const isHeatPump = product.productType === 'heat-pump'

  // Key specs for the right-side summary — different for AC vs heat pump
  const keySpecs = (
    isHeatPump
      ? [
          { label: 'Putere încălzire', value: product.heatingCapacityNominal },
          { label: 'SCOP @35°C', value: product.scopAt35 },
          { label: 'SCOP @55°C', value: product.scopAt55 },
          { label: 'Clasă energetică @35°C', value: product.energyClassHeating35 },
          { label: 'Temp. max apă', value: product.maxWaterTemp },
          { label: 'Agent frigorific', value: product.refrigerant },
          { label: 'Faze', value: product.phase },
          { label: 'Garanție', value: product.warranty },
        ]
      : [
          { label: 'Putere răcire', value: product.coolingCapacityNominal },
          { label: 'Putere încălzire', value: product.heatingCapacityNominal },
          { label: 'SEER', value: product.seer },
          { label: 'SCOP', value: product.scop },
          { label: 'Agent frigorific', value: product.refrigerant },
          { label: 'Alimentare', value: product.powerSupply },
          { label: 'Garanție', value: product.warranty },
        ]
  ).filter((s) => s.value)

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

        {/* ═══ Specifications Tabs + Search ═══ */}
        {specSections.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-gray-900">
              Specificații tehnice
            </h2>
            <SpecsTabs sections={specSections} features={product.featureHighlights} />
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

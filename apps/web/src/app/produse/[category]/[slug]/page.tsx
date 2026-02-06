import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { InquiryDialog } from '@/components/product/InquiryDialog'
import { ProductFeatures } from '@/components/product/ProductFeatures'
import { TechnologyTabs } from '@/components/product/TechnologyTabs'
import { ProductSpecs } from '@/components/product/ProductSpecs'
import { getProductBySlug, getCategoryBySlug } from '@/lib/payload'
import { R2_PUBLIC_URL } from '@/lib/constants'

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
  const { category: categorySlug, slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Fetch category separately using the categorySlug from product
  const category = product.categorySlug ? await getCategoryBySlug(product.categorySlug) : null

  // Build image URL from filename + R2 public URL
  const imageUrl = product.mainImageFilename
    ? `${R2_PUBLIC_URL}/${product.mainImageFilename}`
    : null

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
            <li className="text-gray-900 truncate max-w-[200px]">{product.title}</li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Galerie imagini */}
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.title}
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
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

          {/* Info produs */}
          <div>
            {product.series && (
              <p className="mb-2 text-sm font-medium text-sky-600">{product.series}</p>
            )}

            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="mt-1 text-sm text-gray-500">Cod model: {product.modelCode}</p>

            {/* Energy class labels — arrow style */}
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
              <p className="mt-6 text-lg text-gray-600">{product.shortDescription}</p>
            )}

            {/* Feature icons — compact row */}
            <div className="mt-6 flex flex-wrap gap-3">
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
                  className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-50"
                  title={f.title}
                >
                  <Image src={f.icon} alt={f.title} width={28} height={28} className="h-7 w-7 object-contain" />
                </div>
              ))}
            </div>

            {/* Specificații principale */}
            <div className="mt-8 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Specificații principale</h2>
              <dl className="grid grid-cols-2 gap-4">
                {product.coolingCapacityNominal && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <dt className="text-sm text-gray-500">Putere răcire</dt>
                    <dd className="mt-1 font-semibold text-gray-900">{product.coolingCapacityNominal}</dd>
                  </div>
                )}
                {product.heatingCapacityNominal && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <dt className="text-sm text-gray-500">Putere încălzire</dt>
                    <dd className="mt-1 font-semibold text-gray-900">{product.heatingCapacityNominal}</dd>
                  </div>
                )}
                {product.seer && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <dt className="text-sm text-gray-500">SEER</dt>
                    <dd className="mt-1 font-semibold text-gray-900">{product.seer}</dd>
                  </div>
                )}
                {product.scop && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <dt className="text-sm text-gray-500">SCOP</dt>
                    <dd className="mt-1 font-semibold text-gray-900">{product.scop}</dd>
                  </div>
                )}
                {product.refrigerant && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <dt className="text-sm text-gray-500">Agent frigorific</dt>
                    <dd className="mt-1 font-semibold text-gray-900">{product.refrigerant}</dd>
                  </div>
                )}
                {product.warranty && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <dt className="text-sm text-gray-500">Garanție</dt>
                    <dd className="mt-1 font-semibold text-gray-900">{product.warranty}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Dimensiuni */}
            {(product.indoorDimensions || product.outdoorDimensions) && (
              <div className="mt-8 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Dimensiuni</h2>
                <dl className="grid grid-cols-2 gap-4">
                  {product.indoorDimensions && (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <dt className="text-sm text-gray-500">Unitate interioară</dt>
                      <dd className="mt-1 font-semibold text-gray-900">{product.indoorDimensions}</dd>
                    </div>
                  )}
                  {product.outdoorDimensions && (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <dt className="text-sm text-gray-500">Unitate exterioară</dt>
                      <dd className="mt-1 font-semibold text-gray-900">{product.outdoorDimensions}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Feature highlights */}
            {product.featureHighlights && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Caracteristici</h2>
                <p className="text-gray-600">{product.featureHighlights}</p>
              </div>
            )}

            {/* Buton cerere ofertă — deschide popup */}
            <div className="mt-10">
              <InquiryDialog product={product} />
            </div>
          </div>
        </div>

        {/* Secțiunea: Tehnologii Haier (tabs) */}
        <TechnologyTabs />

        {/* Secțiunea 1: Caracteristici principale + Clasă energetică */}
        <ProductFeatures />

        {/* Secțiunea 2: Specificații tehnice universale */}
        <ProductSpecs />
      </Container>
    </div>
  )
}

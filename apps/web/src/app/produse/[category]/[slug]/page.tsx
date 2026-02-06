import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { InquiryForm } from '@/components/product/InquiryForm'
import { getProductBySlug, getCategoryBySlug } from '@/lib/payload'
import { R2_PUBLIC_URL } from '@/lib/constants'

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
    ? `${R2_PUBLIC_URL}/media/${product.mainImageFilename}`
    : null

  return (
    <div className="py-12">
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
            <div className="mb-4 flex flex-wrap gap-2">
              {product.energyClassCooling && <Badge variant="success">Răcire: {product.energyClassCooling}</Badge>}
              {product.energyClassHeating && <Badge variant="info">Încălzire: {product.energyClassHeating}</Badge>}
              {product.series && <Badge variant="default">{product.series}</Badge>}
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="mt-2 text-sm text-gray-500">Cod model: {product.modelCode}</p>

            {product.shortDescription && (
              <p className="mt-6 text-lg text-gray-600">{product.shortDescription}</p>
            )}

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

            {/* Formular cerere ofertă */}
            <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Solicită ofertă pentru acest produs
              </h2>
              <InquiryForm product={product} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

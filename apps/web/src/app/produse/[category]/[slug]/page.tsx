import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { InquiryForm } from '@/components/product/InquiryForm'
import { getProductBySlug, getCategoryBySlug } from '@/lib/payload'

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

  const category = typeof product.category === 'object' ? product.category : null
  const firstImage = product.images?.[0]
  const imageData = firstImage?.image
  const imageUrl = typeof imageData === 'object' && imageData?.url ? imageData.url : null

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
                  alt={firstImage?.alt || product.title}
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

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {product.images.slice(0, 4).map((img, i) => {
                  const thumb = typeof img.image === 'object' && img.image?.url ? img.image.url : null
                  return thumb ? (
                    <div key={i} className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={thumb}
                        alt={img.alt || `${product.title} - ${i + 1}`}
                        width={200}
                        height={200}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null
                })}
              </div>
            )}
          </div>

          {/* Info produs */}
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {product.energyClass && <Badge variant="success">{product.energyClass}</Badge>}
              {product.wifi && <Badge variant="info">Wi-Fi</Badge>}
              {product.noiseLevel && <Badge variant="default">{product.noiseLevel}</Badge>}
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
                {product.coolingCapacity && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <dt className="text-sm text-gray-500">Putere răcire</dt>
                    <dd className="mt-1 font-semibold text-gray-900">{product.coolingCapacity}</dd>
                  </div>
                )}
                {product.heatingCapacity && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <dt className="text-sm text-gray-500">Putere încălzire</dt>
                    <dd className="mt-1 font-semibold text-gray-900">{product.heatingCapacity}</dd>
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

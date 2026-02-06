import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { ProductCard } from '@/components/product/ProductCard'
import { getCategoryBySlug, getProductsByCategorySlug } from '@/lib/payload'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return { title: 'Categorie negăsită' }
  }

  return {
    title: category.name,
    description: category.description || `Produse din categoria ${category.name}`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const products = await getProductsByCategorySlug(slug)

  return (
    <div className="pt-28 pb-12">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-900">
                Acasă
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/produse" className="hover:text-gray-900">
                Produse
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{category.name}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-4 text-lg text-gray-600">{category.description}</p>
          )}
        </div>

        {/* Produse */}
        {products.length > 0 ? (
          <div>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Produse ({products.length})
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-600">
            Nu există produse în această categorie momentan.
          </p>
        )}
      </Container>
    </div>
  )
}

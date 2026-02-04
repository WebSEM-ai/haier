import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { ProductCard } from '@/components/product/ProductCard'
import { getCategoryBySlug, getSubcategories, getProductsByCategory } from '@/lib/payload'

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

  const [subcategories, products] = await Promise.all([
    getSubcategories(category.id),
    getProductsByCategory(category.id),
  ])

  return (
    <div className="py-12">
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

        {/* Subcategorii (dacă există) */}
        {subcategories.length > 0 && (
          <div className="mb-16">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Subcategorii</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/produse/${slug}/${sub.slug}`}
                  className="rounded-xl bg-gray-100 p-6 transition-colors hover:bg-gray-200"
                >
                  <h3 className="font-semibold text-gray-900">{sub.name}</h3>
                  {sub.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {sub.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Produse */}
        {products.length > 0 ? (
          <div>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Produse ({products.length})
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : subcategories.length === 0 ? (
          <p className="text-gray-600">
            Nu există produse în această categorie momentan.
          </p>
        ) : null}
      </Container>
    </div>
  )
}

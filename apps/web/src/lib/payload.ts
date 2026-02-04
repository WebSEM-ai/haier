import type { Product, Category } from '@repo/payload-types'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${CMS_URL}/api/products?limit=100&sort=order&depth=1`, {
    next: { tags: ['products'] },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.docs
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const res = await fetch(
    `${CMS_URL}/api/products?where[featured][equals]=true&limit=10&sort=order&depth=1`,
    { next: { tags: ['products'] } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.docs
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(
    `${CMS_URL}/api/products?where[slug][equals]=${encodeURIComponent(slug)}&depth=2`,
    { next: { tags: [`product-${slug}`] } }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.docs[0] || null
}

export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
  const res = await fetch(
    `${CMS_URL}/api/products?where[category][equals]=${categoryId}&sort=order&depth=1`,
    { next: { tags: ['products'] } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.docs
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${CMS_URL}/api/categories?limit=100&sort=order&depth=1`, {
    next: { tags: ['categories'] },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.docs
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const res = await fetch(
    `${CMS_URL}/api/categories?where[slug][equals]=${encodeURIComponent(slug)}&depth=1`,
    { next: { tags: ['categories'] } }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.docs[0] || null
}

export async function getCategoriesByLevel(level: '1' | '2' | '3'): Promise<Category[]> {
  const res = await fetch(
    `${CMS_URL}/api/categories?where[level][equals]=${level}&sort=order&depth=1`,
    { next: { tags: ['categories'] } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.docs
}

export async function getSubcategories(parentId: number): Promise<Category[]> {
  const res = await fetch(
    `${CMS_URL}/api/categories?where[parent][equals]=${parentId}&sort=order&depth=1`,
    { next: { tags: ['categories'] } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.docs
}

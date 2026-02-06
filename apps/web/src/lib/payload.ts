const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'

export interface Product {
  id: number
  title: string
  slug: string
  modelCode: string
  categorySlug?: string | null
  mainImageFilename?: string | null
  shortDescription?: string | null
  series?: string | null
  capacity?: string | null
  energyClassCooling?: string | null
  energyClassHeating?: string | null
  coolingCapacityNominal?: string | null
  heatingCapacityNominal?: string | null
  seer?: string | null
  scop?: string | null
  indoorDimensions?: string | null
  outdoorDimensions?: string | null
  refrigerant?: string | null
  warranty?: string | null
  featureHighlights?: string | null
  featured?: boolean
  order?: number
}

export interface Category {
  id: number
  name: string
  slug: string
  level: string
  description?: string | null
  order?: number
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${CMS_URL}/api/products?limit=100&sort=order&depth=0`, {
    next: { tags: ['products'] },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.docs
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const res = await fetch(
    `${CMS_URL}/api/products?where[featured][equals]=true&limit=10&sort=order&depth=0`,
    { next: { tags: ['products'] } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.docs
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(
    `${CMS_URL}/api/products?where[slug][equals]=${encodeURIComponent(slug)}&depth=0`,
    { next: { tags: [`product-${slug}`] } }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.docs[0] || null
}

export async function getProductsByCategorySlug(categorySlug: string): Promise<Product[]> {
  const res = await fetch(
    `${CMS_URL}/api/products?where[categorySlug][equals]=${encodeURIComponent(categorySlug)}&sort=order&depth=0`,
    { next: { tags: ['products'] } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.docs
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${CMS_URL}/api/categories?limit=100&sort=order&depth=0`, {
    next: { tags: ['categories'] },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.docs
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const res = await fetch(
    `${CMS_URL}/api/categories?where[slug][equals]=${encodeURIComponent(slug)}&depth=0`,
    { next: { tags: ['categories'] } }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.docs[0] || null
}

export async function getCategoriesByLevel(level: '1' | '2' | '3'): Promise<Category[]> {
  const res = await fetch(
    `${CMS_URL}/api/categories?where[level][equals]=${level}&sort=order&depth=0`,
    { next: { tags: ['categories'] } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.docs
}

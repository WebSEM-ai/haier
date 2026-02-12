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
  // Cooling
  coolingCapacityNominal?: string | null
  coolingCapacityRange?: string | null
  coolingPowerConsumption?: string | null
  coolingPowerRange?: string | null
  seer?: string | null
  eer?: string | null
  energyClassCooling?: string | null
  // Heating
  heatingCapacityNominal?: string | null
  heatingCapacityRange?: string | null
  heatingPowerConsumption?: string | null
  heatingPowerRange?: string | null
  scop?: string | null
  cop?: string | null
  energyClassHeating?: string | null
  // Indoor unit
  indoorDimensions?: string | null
  indoorWeight?: string | null
  indoorNoiseMax?: string | null
  indoorNoiseLevels?: string | null
  // Outdoor unit
  outdoorDimensions?: string | null
  outdoorWeight?: string | null
  outdoorNoiseMax?: string | null
  compressorType?: string | null
  // General
  refrigerant?: string | null
  powerSupply?: string | null
  warranty?: string | null
  madeIn?: string | null
  // Features
  featureHighlights?: string | null
  featured?: boolean
  order?: number
  updatedAt: string
  createdAt: string
}

export interface Category {
  id: number
  name: string
  slug: string
  level: '1' | '2' | '3'
  description?: string | null
  order?: number
  updatedAt: string
  createdAt: string
}

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${CMS_URL}/api/products?limit=100&sort=order&depth=0`, {
      next: { tags: ['products'] },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.docs
  } catch {
    return []
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/products?where[featured][equals]=true&limit=10&sort=order&depth=0`,
      { next: { tags: ['products'] } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.docs
  } catch {
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/products?where[slug][equals]=${encodeURIComponent(slug)}&depth=0`,
      { next: { tags: [`product-${slug}`] } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.docs[0] || null
  } catch {
    return null
  }
}

export async function getProductsByCategorySlug(categorySlug: string): Promise<Product[]> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/products?where[categorySlug][equals]=${encodeURIComponent(categorySlug)}&sort=order&depth=0`,
      { next: { tags: ['products'] } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.docs
  } catch {
    return []
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${CMS_URL}/api/categories?limit=100&sort=order&depth=0`, {
      next: { tags: ['categories'] },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.docs
  } catch {
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/categories?where[slug][equals]=${encodeURIComponent(slug)}&depth=0`,
      { next: { tags: [`category-${slug}`] } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.docs[0] || null
  } catch {
    return null
  }
}

export async function getCategoriesByLevel(level: '1' | '2' | '3'): Promise<Category[]> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/categories?where[level][equals]=${level}&sort=order&depth=0`,
      { next: { tags: ['categories'] } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.docs
  } catch {
    return []
  }
}

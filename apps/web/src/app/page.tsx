import { Hero } from '@/components/sections/Hero'
import { CategoryGrid } from '@/components/sections/CategoryGrid'
import { FeaturedProducts } from '@/components/sections/FeaturedProducts'
import { TechFeatures } from '@/components/sections/TechFeatures'
import { getCategories, getFeaturedProducts } from '@/lib/payload'

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ])

  return (
    <>
      <Hero />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <TechFeatures />
    </>
  )
}

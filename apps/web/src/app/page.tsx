import { Hero } from '@/components/sections/Hero'
import { TechFeatures } from '@/components/sections/TechFeatures'
import { BrandShowcase } from '@/components/sections/BrandShowcase'
import { CategoryGrid } from '@/components/sections/CategoryGrid'
import { FeaturedProducts } from '@/components/sections/FeaturedProducts'
import { getCategories, getFeaturedProducts } from '@/lib/payload'

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ])

  return (
    <>
      <Hero />
      <TechFeatures />
      <BrandShowcase />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featuredProducts} />
    </>
  )
}

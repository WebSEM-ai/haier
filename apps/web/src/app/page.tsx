import { Hero } from '@/components/sections/Hero'
import { TechFeatures } from '@/components/sections/TechFeatures'
import { BrandShowcase } from '@/components/sections/BrandShowcase'
import { TechShowcase } from '@/components/sections/TechShowcase'
import { CategoryGrid } from '@/components/sections/CategoryGrid'
import { FeaturedProducts } from '@/components/sections/FeaturedProducts'
import { getCategories, getProductsByCategorySlug } from '@/lib/payload'

export default async function HomePage() {
  const [categories, acProducts, heatPumpProducts] = await Promise.all([
    getCategories(),
    getProductsByCategorySlug('climatizare'),
    getProductsByCategorySlug('pompe-de-caldura'),
  ])

  return (
    <>
      <Hero />
      <TechFeatures />
      <BrandShowcase />
      <TechShowcase />
      <CategoryGrid categories={categories} />
      <FeaturedProducts acProducts={acProducts} heatPumpProducts={heatPumpProducts} />
    </>
  )
}

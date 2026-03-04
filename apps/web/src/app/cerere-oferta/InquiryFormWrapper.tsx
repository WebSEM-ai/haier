'use client'

import { InquiryForm } from '@/components/product/InquiryForm'
import type { Product } from '@/lib/payload'

export function InquiryFormWrapper({ products }: { products: Product[] }) {
  return <InquiryForm products={products} />
}

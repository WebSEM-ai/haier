import type { CollectionAfterChangeHook } from 'payload'

export const revalidateProduct: CollectionAfterChangeHook = async ({ doc }) => {
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL
  const secret = process.env.REVALIDATION_SECRET

  if (!webUrl || !secret) return doc

  try {
    await fetch(`${webUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, tags: ['products', `product-${doc.slug}`] }),
    })
  } catch (err) {
    console.error('Revalidation failed:', err)
  }

  return doc
}

export const revalidateCategory: CollectionAfterChangeHook = async ({ doc }) => {
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL
  const secret = process.env.REVALIDATION_SECRET

  if (!webUrl || !secret) return doc

  try {
    await fetch(`${webUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, tags: ['categories', `category-${doc.slug}`] }),
    })
  } catch (err) {
    console.error('Revalidation failed:', err)
  }

  return doc
}

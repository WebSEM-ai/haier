import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

async function triggerRevalidation(tags: string[]) {
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL
  const secret = process.env.REVALIDATION_SECRET

  if (!webUrl || !secret) return

  try {
    await fetch(`${webUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, tags }),
    })
  } catch (err) {
    console.error('Revalidation failed:', err)
  }
}

export const revalidateProduct: CollectionAfterChangeHook = async ({ doc }) => {
  await triggerRevalidation(['products', `product-${doc.slug}`])
  return doc
}

export const revalidateProductDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await triggerRevalidation(['products', `product-${doc.slug}`])
  return doc
}

export const revalidateCategory: CollectionAfterChangeHook = async ({ doc }) => {
  await triggerRevalidation(['categories', `category-${doc.slug}`])
  return doc
}

export const revalidateCategoryDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await triggerRevalidation(['categories', `category-${doc.slug}`])
  return doc
}

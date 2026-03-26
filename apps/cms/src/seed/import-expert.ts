/**
 * Import Expert products into Payload CMS
 *
 * Usage:
 *   cd apps/cms
 *   npx tsx src/seed/import-expert.ts
 *
 * Or via API (if CMS is running on port 3001):
 *   node -e "
 *     const products = require('./src/seed/expert-products.json');
 *     for (const p of products) {
 *       fetch('http://localhost:3001/api/products', {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify(p)
 *       }).then(r => r.json()).then(d => console.log(d.doc?.slug || d.errors))
 *     }
 *   "
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import products from './expert-products.json'

async function importExpert() {
  const payload = await getPayload({ config })

  for (const product of products) {
    try {
      const doc = await payload.create({
        collection: 'products',
        data: product as any,
      })
      console.log(`Created: ${doc.slug}`)
    } catch (err: any) {
      console.error(`Failed: ${product.slug}`, err.message || err)
    }
  }

  console.log(`\nDone! ${products.length} Expert products imported.`)
  process.exit(0)
}

importExpert()

import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Produs', plural: 'Produse' },
  admin: {
    useAsTitle: 'title',
    group: 'Catalog',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Titlu Produs',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'modelCode',
      label: 'Cod Model',
      type: 'text',
      required: true,
    },
    {
      name: 'categorySlug',
      label: 'Categorie (slug)',
      type: 'text',
      admin: {
        description: 'Introdu slug-ul categoriei (ex: climatizare)',
      },
    },
    {
      name: 'shortDescription',
      label: 'Descriere scurtă',
      type: 'textarea',
    },
  ],
}

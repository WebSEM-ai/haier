import type { CollectionConfig } from 'payload'
import { revalidateCategory, revalidateCategoryDelete } from '../hooks/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Categorie', plural: 'Categorii' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'parent', 'level', 'order'],
  },
  access: {
    read: () => true, // Public read access
  },
  hooks: {
    afterChange: [revalidateCategory],
    afterDelete: [revalidateCategoryDelete],
  },
  fields: [
    {
      name: 'name',
      label: 'Nume categorie',
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
      name: 'parent',
      label: 'Categorie părinte',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
    },
    {
      name: 'level',
      label: 'Nivel ierarhic',
      type: 'select',
      required: true,
      options: [
        { label: 'Nivel 1 — Tip principal', value: '1' },
        { label: 'Nivel 2 — Subtip', value: '2' },
        { label: 'Nivel 3 — Serie/Gamă', value: '3' },
      ],
    },
    {
      name: 'description',
      label: 'Descriere categorie',
      type: 'textarea',
    },
    {
      name: 'image',
      label: 'Imagine categorie',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'order',
      label: 'Ordine afișare',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}

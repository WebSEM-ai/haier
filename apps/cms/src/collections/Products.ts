import type { CollectionConfig } from 'payload'
import { revalidateProduct } from '../hooks/revalidate'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Produs', plural: 'Produse' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'modelCode', 'category', 'coolingCapacity'],
    group: 'Catalog',
  },
  hooks: {
    afterChange: [revalidateProduct],
    afterDelete: [revalidateProduct],
  },
  fields: [
    // ── Informații principale ──
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
      label: 'Cod Model (ID)',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      label: 'Categorie',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      hasMany: false,
    },
    {
      name: 'shortDescription',
      label: 'Descriere scurtă',
      type: 'textarea',
    },
    {
      name: 'description',
      label: 'Descriere completă',
      type: 'richText',
    },

    // ── Imagini ──
    {
      name: 'images',
      label: 'Galerie Imagini',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'image',
          label: 'Imagine',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          label: 'Text alternativ',
          type: 'text',
        },
      ],
    },

    // ── Specificații tehnice ──
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Performanță',
          fields: [
            {
              name: 'coolingCapacity',
              label: 'Putere Răcire (Nominală)',
              type: 'text',
            },
            {
              name: 'heatingCapacity',
              label: 'Putere Încălzire (Nominală)',
              type: 'text',
            },
            {
              name: 'energyClass',
              label: 'Clasă Energetică (Răcire/Încălzire)',
              type: 'text',
            },
            {
              name: 'refrigerant',
              label: 'Agent Frigorific',
              type: 'text',
            },
          ],
        },
        {
          label: 'Funcționalități',
          fields: [
            {
              name: 'wifi',
              label: 'Wi-Fi',
              type: 'text',
            },
            {
              name: 'noiseLevel',
              label: 'Nivel Zgomot (Minim)',
              type: 'text',
            },
            {
              name: 'airFiltration',
              label: 'Filtrare Aer',
              type: 'text',
            },
            {
              name: 'hygieneFunctions',
              label: 'Funcții Igienă',
              type: 'text',
            },
            {
              name: 'presenceSensor',
              label: 'Senzor Prezență',
              type: 'text',
            },
          ],
        },
        {
          label: 'Dimensiuni & Aspect',
          fields: [
            {
              name: 'color',
              label: 'Culoare',
              type: 'text',
            },
            {
              name: 'dimensions',
              label: 'Dimensiuni UI (W×D×H)',
              type: 'text',
            },
            {
              name: 'weight',
              label: 'Greutate UI',
              type: 'text',
            },
          ],
        },
        {
          label: 'Garanție',
          fields: [
            {
              name: 'warranty',
              label: 'Garanție',
              type: 'text',
              defaultValue: '5 ani',
            },
          ],
        },
      ],
    },

    // ── Documente atașate ──
    {
      name: 'documents',
      label: 'Documente (fișe tehnice PDF)',
      type: 'array',
      fields: [
        {
          name: 'file',
          label: 'Fișier',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'label',
          label: 'Denumire document',
          type: 'text',
        },
      ],
    },

    // ── Meta ──
    {
      name: 'featured',
      label: 'Produs recomandat (homepage)',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
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

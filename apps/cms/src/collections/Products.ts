import type { CollectionConfig } from 'payload'
import { revalidateProduct, revalidateProductDelete } from '../hooks/revalidate'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Produs', plural: 'Produse' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'series', 'modelCode', 'capacity', 'category'],
    group: 'Catalog',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateProduct],
    afterDelete: [revalidateProductDelete],
  },
  fields: [
    // ══════════════════════════════════════
    // INFORMAȚII PRINCIPALE
    // ══════════════════════════════════════
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
      name: 'series',
      label: 'Serie / Gamă',
      type: 'text',
      admin: {
        description: 'Ex: Pearl Premium, Revive Plus, etc.',
      },
    },
    {
      name: 'modelCode',
      label: 'Cod Model Haier',
      type: 'text',
      required: true,
      admin: {
        description: 'Ex: AS35PBPHRA-PRE1U35MEPFRA-PRE',
      },
    },
    {
      name: 'capacity',
      label: 'Capacitate',
      type: 'text',
      admin: {
        description: 'Ex: 3.5 kW, 10 kW mono, etc.',
      },
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

    // ══════════════════════════════════════
    // IMAGINE PRINCIPALĂ
    // ══════════════════════════════════════
    {
      name: 'mainImage',
      label: 'Imagine principală',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'images',
      label: 'Galerie Imagini (opțional)',
      type: 'array',
      fields: [
        {
          name: 'image',
          label: 'Imagine',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'alt',
          label: 'Text alternativ',
          type: 'text',
        },
      ],
    },

    // ══════════════════════════════════════
    // SPECIFICAȚII TEHNICE (TABS)
    // ══════════════════════════════════════
    {
      type: 'tabs',
      tabs: [
        // ── Tab: Performanță Răcire ──
        {
          label: 'Răcire',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'coolingCapacityNominal',
                  label: 'Capacitate nominală (kW)',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'coolingCapacityRange',
                  label: 'Interval capacitate (kW)',
                  type: 'text',
                  admin: { width: '50%', description: 'Ex: 0.8–4.0' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'coolingPowerConsumption',
                  label: 'Consum putere (kW)',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'coolingPowerRange',
                  label: 'Interval consum (kW)',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'seer',
                  label: 'SEER',
                  type: 'text',
                  admin: { width: '33%' },
                },
                {
                  name: 'eer',
                  label: 'EER',
                  type: 'text',
                  admin: { width: '33%' },
                },
                {
                  name: 'energyClassCooling',
                  label: 'Clasă energetică răcire',
                  type: 'select',
                  options: ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D'],
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'coolingTempMin',
                  label: 'Temp. min funcționare (°C)',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'coolingTempMax',
                  label: 'Temp. max funcționare (°C)',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },

        // ── Tab: Performanță Încălzire ──
        {
          label: 'Încălzire',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'heatingCapacityNominal',
                  label: 'Capacitate nominală (kW)',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'heatingCapacityRange',
                  label: 'Interval capacitate (kW)',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'heatingPowerConsumption',
                  label: 'Consum putere (kW)',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'heatingPowerRange',
                  label: 'Interval consum (kW)',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'scop',
                  label: 'SCOP',
                  type: 'text',
                  admin: { width: '33%' },
                },
                {
                  name: 'cop',
                  label: 'COP',
                  type: 'text',
                  admin: { width: '33%' },
                },
                {
                  name: 'energyClassHeating',
                  label: 'Clasă energetică încălzire',
                  type: 'select',
                  options: ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D'],
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'heatingTempMin',
                  label: 'Temp. min funcționare (°C)',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'heatingTempMax',
                  label: 'Temp. max funcționare (°C)',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },

        // ── Tab: Unitate Interioară ──
        {
          label: 'Unitate Interioară',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'indoorDimensions',
                  label: 'Dimensiuni (L×A×Î mm)',
                  type: 'text',
                  admin: { width: '50%', description: 'Ex: 805×200×292' },
                },
                {
                  name: 'indoorWeight',
                  label: 'Greutate (kg)',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'indoorNoiseMax',
                  label: 'Nivel zgomot max (dB)',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'indoorNoiseLevels',
                  label: 'Nivele zgomot (Hi/Med/Lo/Silent)',
                  type: 'text',
                  admin: { width: '50%', description: 'Ex: 38/33/29/18 dB' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'indoorAirflow',
                  label: 'Debit aer max (m³/h)',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'indoorColor',
                  label: 'Culoare',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },

        // ── Tab: Unitate Exterioară ──
        {
          label: 'Unitate Exterioară',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'outdoorDimensions',
                  label: 'Dimensiuni (L×A×Î mm)',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'outdoorWeight',
                  label: 'Greutate (kg)',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'outdoorNoiseMax',
                  label: 'Nivel zgomot max (dB)',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'outdoorNoisePressure',
                  label: 'Presiune sonoră (dB)',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'outdoorAirflow',
                  label: 'Debit aer max (m³/h)',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'compressorType',
                  label: 'Tip compresor',
                  type: 'text',
                  admin: { width: '50%', description: 'Ex: Rotary, Dual Rotary' },
                },
              ],
            },
          ],
        },

        // ── Tab: General ──
        {
          label: 'General',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'refrigerant',
                  label: 'Agent frigorific',
                  type: 'text',
                  admin: { width: '50%' },
                  defaultValue: 'R32',
                },
                {
                  name: 'powerSupply',
                  label: 'Alimentare',
                  type: 'text',
                  admin: { width: '50%' },
                  defaultValue: '220-240V/50Hz',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'warranty',
                  label: 'Garanție',
                  type: 'text',
                  admin: { width: '50%' },
                  defaultValue: '5 ani',
                },
                {
                  name: 'madeIn',
                  label: 'Fabricat în',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },

        // ── Tab: Funcționalități ──
        {
          label: 'Funcționalități',
          fields: [
            {
              name: 'features',
              label: 'Lista funcționalități (opțional)',
              type: 'array',
              admin: {
                description: 'Adaugă funcțiile produsului',
              },
              fields: [
                {
                  name: 'feature',
                  label: 'Funcționalitate',
                  type: 'text',
                },
              ],
            },
            {
              name: 'featureHighlights',
              label: 'Funcții principale (pentru card)',
              type: 'textarea',
              admin: {
                description: 'Câteva funcții cheie separate prin virgulă, pentru afișare în card',
              },
            },
          ],
        },
      ],
    },

    // ══════════════════════════════════════
    // DOCUMENTE
    // ══════════════════════════════════════
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

    // ══════════════════════════════════════
    // META (SIDEBAR)
    // ══════════════════════════════════════
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

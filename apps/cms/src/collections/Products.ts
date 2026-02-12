import type { CollectionConfig } from 'payload'
import { revalidateProduct, revalidateProductDelete } from '../hooks/revalidate'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Produs', plural: 'Produse' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'series', 'modelCode', 'categorySlug'],
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
      name: 'categorySlug',
      label: 'Categorie (slug)',
      type: 'text',
      required: true,
      admin: {
        description: 'Slug-ul categoriei: climatizare, pompe-caldura, etc.',
      },
    },
    {
      name: 'shortDescription',
      label: 'Descriere scurtă',
      type: 'textarea',
    },
    {
      name: 'mainImageFilename',
      label: 'Imagine principală (filename)',
      type: 'text',
      admin: {
        description: 'Numele fișierului din Media (ex: pearl-premium.webp)',
      },
    },

    // ══════════════════════════════════════
    // SPECIFICAȚII TEHNICE (TABS)
    // ══════════════════════════════════════
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Răcire',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'coolingCapacityNominal', label: 'Capacitate nominală (kW)', type: 'text', admin: { width: '50%' } },
                { name: 'coolingCapacityRange', label: 'Interval capacitate (kW)', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'coolingPowerConsumption', label: 'Consum putere (kW)', type: 'text', admin: { width: '50%' } },
                { name: 'coolingPowerRange', label: 'Interval consum (kW)', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'seer', label: 'SEER', type: 'text', admin: { width: '33%' } },
                { name: 'eer', label: 'EER', type: 'text', admin: { width: '33%' } },
                { name: 'energyClassCooling', label: 'Clasă energetică', type: 'select', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D'], admin: { width: '33%' } },
              ],
            },
          ],
        },
        {
          label: 'Încălzire',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'heatingCapacityNominal', label: 'Capacitate nominală (kW)', type: 'text', admin: { width: '50%' } },
                { name: 'heatingCapacityRange', label: 'Interval capacitate (kW)', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'heatingPowerConsumption', label: 'Consum putere (kW)', type: 'text', admin: { width: '50%' } },
                { name: 'heatingPowerRange', label: 'Interval consum (kW)', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'scop', label: 'SCOP', type: 'text', admin: { width: '33%' } },
                { name: 'cop', label: 'COP', type: 'text', admin: { width: '33%' } },
                { name: 'energyClassHeating', label: 'Clasă energetică', type: 'select', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D'], admin: { width: '33%' } },
              ],
            },
          ],
        },
        {
          label: 'Unitate Interioară',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'indoorDimensions', label: 'Dimensiuni (L×A×Î mm)', type: 'text', admin: { width: '50%' } },
                { name: 'indoorWeight', label: 'Greutate (kg)', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'indoorNoiseMax', label: 'Zgomot max (dB)', type: 'text', admin: { width: '50%' } },
                { name: 'indoorNoiseLevels', label: 'Nivele zgomot', type: 'text', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Unitate Exterioară',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'outdoorDimensions', label: 'Dimensiuni (L×A×Î mm)', type: 'text', admin: { width: '50%' } },
                { name: 'outdoorWeight', label: 'Greutate (kg)', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'outdoorNoiseMax', label: 'Zgomot max (dB)', type: 'text', admin: { width: '50%' } },
                { name: 'compressorType', label: 'Tip compresor', type: 'text', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'General',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'refrigerant', label: 'Agent frigorific', type: 'text', admin: { width: '50%' }, defaultValue: 'R32' },
                { name: 'powerSupply', label: 'Alimentare', type: 'text', admin: { width: '50%' }, defaultValue: '220-240V/50Hz' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'warranty', label: 'Garanție', type: 'text', admin: { width: '50%' }, defaultValue: '5 ani' },
                { name: 'madeIn', label: 'Fabricat în', type: 'text', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Funcționalități',
          fields: [
            {
              name: 'featureHighlights',
              label: 'Funcții principale',
              type: 'textarea',
              admin: { description: 'Funcții cheie separate prin virgulă' },
            },
          ],
        },
      ],
    },

    // ══════════════════════════════════════
    // META (SIDEBAR)
    // ══════════════════════════════════════
    {
      name: 'featured',
      label: 'Produs recomandat',
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

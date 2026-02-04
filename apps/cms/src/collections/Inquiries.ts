import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Cerere ofertă', plural: 'Cereri ofertă' },
  admin: {
    defaultColumns: ['name', 'email', 'product', 'createdAt'],
    group: 'Cereri',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      label: 'Nume complet',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      label: 'Telefon',
      type: 'text',
      required: true,
    },
    {
      name: 'product',
      label: 'Produs solicitat',
      type: 'relationship',
      relationTo: 'products',
      hasMany: false,
    },
    {
      name: 'message',
      label: 'Mesaj',
      type: 'textarea',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Nouă', value: 'new' },
        { label: 'Contactat', value: 'contacted' },
        { label: 'Finalizat', value: 'completed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}

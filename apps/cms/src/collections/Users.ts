import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utilizator', plural: 'Utilizatori' },
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [],
}

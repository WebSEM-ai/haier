import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { Inquiries } from './collections/Inquiries'
import { Media } from './collections/Media'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [Users, Products, Categories, Inquiries, Media],

  editor: lexicalEditor({}),

  secret: process.env.PAYLOAD_SECRET || 'default-secret-change-me-in-production',

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
  }),

  plugins: [
    // S3 temporar dezactivat pentru debugging
  ],

  typescript: {
    outputFile: path.resolve(dirname, '../../../packages/payload-types/generated-types.ts'),
  },

  sharp,

  cors: [
    process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000',
  ],
})

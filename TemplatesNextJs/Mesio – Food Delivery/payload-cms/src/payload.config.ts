// storage-adapter-import-placeholder
import {postgresAdapter} from '@payloadcms/db-postgres';
import {payloadCloudPlugin} from '@payloadcms/payload-cloud';
import {lexicalEditor} from '@payloadcms/richtext-lexical';
import path from 'path';
import {buildConfig} from 'payload';
import {fileURLToPath} from 'url';
import sharp from 'sharp';

import {Users} from './collections/Users';
import {Media} from './collections/Media';
import {Dishes} from './collections/Dishes';
import {Promocodes} from './collections/Promocodes';
import {Categories} from './collections/Categories';
import {Ingredients} from './collections/Ingredients';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Promocodes, Categories, Dishes, Ingredients],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  cors: ['http://localhost:4000', 'http://localhost:3000'],
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
});

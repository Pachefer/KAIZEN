import type {CollectionConfig} from 'payload';

export const Promocodes: CollectionConfig = {
  slug: 'promocodes',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'code', 'discount', 'expiresAt', 'isActive'],
  },
  endpoints: [
    {
      path: '/data',
      method: 'get',
      handler: async (req) => {
        const result = await req.payload.find({collection: 'promocodes', depth: 1});
        const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000';
        const promocodes = result.docs.map((promocode) => ({
          id: promocode.id,
          name: promocode.title,
          code: promocode.code,
          discount: promocode.discount,
          expiresAt: promocode.expiresAt
            ? new Date(promocode.expiresAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : null,
          isActive: promocode.isActive,
          logo:
            promocode.logo && typeof promocode.logo === 'object' && promocode.logo.url
              ? promocode.logo.url.startsWith('http')
                ? promocode.logo.url
                : `${baseUrl}${promocode.logo.url}`
              : null,
        }));

        return Response.json({
          data: promocodes,
        });
      },
    },
  ],
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Code',
    },
    {
      name: 'discount',
      type: 'number',
      required: true,
      label: 'Discount Percentage',
      min: 0,
      max: 100,
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Expiration Date',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Is Active?',
    },
  ],
};

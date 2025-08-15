import type {CollectionConfig} from 'payload';

export const Offers: CollectionConfig = {
  slug: 'offers',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image',
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
      name: 'dishId',
      type: 'relationship',
      relationTo: 'dishes',
      required: true,
      label: 'Related Dish',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Is Active?',
    },
  ],
  endpoints: [
    {
      path: '/data',
      method: 'get',
      handler: async (req) => {
        const result = await req.payload.find({collection: 'offers', depth: 1});
        const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000';
        const offers = result.docs.map((offer) => ({
          id: offer.id,
          name: offer.title,
          discount: offer.discount,
          isActive: offer.isActive,
          image:
            offer.image && typeof offer.image === 'object' && offer.image.url
              ? offer.image.url.startsWith('http')
                ? offer.image.url
                : `${baseUrl}${offer.image.url}`
              : null,
        }));

        return Response.json({
          data: offers,
        });
      },
    },
  ],
};

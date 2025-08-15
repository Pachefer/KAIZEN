import type {CollectionConfig} from 'payload';

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
  },
  hooks: {
    beforeDelete: [
      async ({req, id}) => {
        const relatedDishes = await req.payload.find({
          collection: 'dishes',
          where: {
            category: {
              contains: id,
            },
          },
          limit: 1,
        });

        if (relatedDishes.totalDocs > 0) {
          throw new Error(
            `Cannot delete this category because it is used in ${relatedDishes.totalDocs} dish(s). Please remove it from all dishes first.`,
          );
        }
      },
    ],
  },
  endpoints: [
    {
      path: '/data',
      method: 'get',
      handler: async (req) => {
        const result = await req.payload.find({
          collection: 'categories',
          depth: 1,
        });
        const categories = result.docs.map((category) => ({
          id: category.id,
          name: category.name,
        }));

        return Response.json({
          data: categories,
        });
      },
    },
  ],
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: 'Category Name',
    },
  ],
};

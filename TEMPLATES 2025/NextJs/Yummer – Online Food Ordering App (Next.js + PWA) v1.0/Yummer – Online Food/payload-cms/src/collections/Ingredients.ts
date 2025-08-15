import type {CollectionConfig} from 'payload';

export const Ingredients: CollectionConfig = {
  slug: 'ingredients',
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
            `Cannot delete this ingredient because it is used in ${relatedDishes.totalDocs} dish(s). Please remove it from all dishes first.`,
          );
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: 'Ingredient Name',
      admin: {
        description: 'The name of the ingredient, e.g., "Sugar", "Flour", etc.',
      },
    },
  ],
  access: {
    read: () => true,
  },
  timestamps: true,
};

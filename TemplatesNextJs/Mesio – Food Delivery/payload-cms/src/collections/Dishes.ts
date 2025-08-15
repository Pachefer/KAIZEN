import {Ingredient} from '@/payload-types';
import type {CollectionConfig} from 'payload';

export const Dishes: CollectionConfig = {
  slug: 'dishes',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'isAvailable'],
  },
  endpoints: [
    {
      path: '/data',
      method: 'get',
      handler: async (req) => {
        const result = await req.payload.find({collection: 'dishes', depth: 1});
        const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000';
        const dishes = result.docs.map((dish) => ({
          id: dish.id,
          name: dish.name,
          type: dish.type,
          description: dish.description,
          price: dish.price,
          category:
            typeof dish.category === 'object' && dish.category !== null
              ? dish.category.name
              : dish.category,
          cookingTime: dish.cookingTime,
          weight: dish.weight,
          ingredients: dish.ingredients
            .filter(
              (ingredient): ingredient is Ingredient =>
                typeof ingredient === 'object' && ingredient !== null,
            )
            .map((ingredient) => ingredient.name),
          isAvailable: dish.isAvailable,
          image:
            dish.image && typeof dish.image === 'object' && dish.image.url
              ? dish.image.url.startsWith('http')
                ? dish.image.url
                : `${baseUrl}${dish.image.url}`
              : null,
          isPopular: dish.isPopular,
          isRecommended: dish.isRecommended,
        }));

        return Response.json({
          data: dishes,
        });
      },
    },
  ],
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Food',
          value: 'food',
        },
        {
          label: 'Drink',
          value: 'drink',
        },
      ],
      defaultValue: 'food',
      label: 'Type',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Description',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Price',
      min: 0,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Category',
    },
    {
      name: 'cookingTime',
      type: 'number',
      required: true,
      min: 1,
      max: 300,
      label: 'Cooking Time (in minutes)',
    },
    {
      name: 'weight',
      type: 'number',
      label: 'Weight (in grams)',
    },
    {
      name: 'ingredients',
      type: 'relationship',
      relationTo: 'ingredients',
      hasMany: true,
      required: true,
      label: 'Ingredients',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image',
    },
    {
      name: 'isAvailable',
      type: 'checkbox',
      defaultValue: true,
      label: 'Is Available?',
    },
    {
      name: 'isPopular',
      type: 'checkbox',
      defaultValue: false,
      label: 'Is Popular?',
    },
    {
      name: 'isRecommended',
      type: 'checkbox',
      defaultValue: false,
      label: 'Is Recommended?',
    },
  ],
};

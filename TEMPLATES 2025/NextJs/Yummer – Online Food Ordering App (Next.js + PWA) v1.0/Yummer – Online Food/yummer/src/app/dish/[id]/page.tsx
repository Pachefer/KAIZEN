import {Dish} from '@/app/dish/[id]/Dish';

type Params = {
  params: Promise<{id: string}>;
};

export default async function DishPage({params}: Params) {
  const id = (await params).id;
  return <Dish id={id} />;
}

import {ShopCategory} from './ShopCategory';

type Params = {
  params: Promise<{category: string}>;
};

export default async function ShopCategoryPage({params}: Params) {
  const category = (await params).category;
  return <ShopCategory category={category} />;
}

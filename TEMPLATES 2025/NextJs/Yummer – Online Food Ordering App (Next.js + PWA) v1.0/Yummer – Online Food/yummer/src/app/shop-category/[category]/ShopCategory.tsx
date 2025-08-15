'use client';

import React, {useMemo} from 'react';

import {hooks} from '@/hooks';
import {items} from '@/items';
import {DishType} from '@/types';
import {constants} from '@/constants';
import {components} from '@/components';

type Props = {
  category: string;
};

export const ShopCategory: React.FC<Props> = ({category}) => {
  const decodedCategory = category ? decodeURIComponent(category) : '';
  const {dishes: data, loading} = hooks.useGetDishes();

  const dishes = data && data.length > 0 ? data : [];

  const filtered = useMemo(() => {
    if (!decodedCategory) return [];
    return dishes.filter(
      (dish: DishType) =>
        dish?.category?.toLowerCase() === decodedCategory.toLowerCase()
    );
  }, [dishes, decodedCategory]);

  if (loading) return <components.Loader />;

  const capitalizeWords = (str: string) => {
    if (!str) return 'Shop';

    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        showBasket={true}
        title={capitalizeWords(decodedCategory)}
      />
    );
  };

  const renderDishes = () => {
    if (!filtered || filtered.length === 0) {
      return null;
    }
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          padding: '18px 20px 20px 20px',
          overflowY: 'auto',
        }}
      >
        <ul
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 15,
          }}
        >
          {filtered.map((dish: DishType) => {
            return <items.ShopItem key={dish.id} dish={dish} />;
          })}
        </ul>
      </main>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderHeader()}
        {renderDishes()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};

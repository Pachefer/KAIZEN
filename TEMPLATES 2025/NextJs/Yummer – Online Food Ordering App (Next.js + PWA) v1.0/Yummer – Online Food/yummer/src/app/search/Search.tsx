'use client';

import React from 'react';
import 'swiper/swiper-bundle.css';
import {useRouter} from 'next/navigation';
import {Swiper, SwiperSlide} from 'swiper/react';

import {hooks} from '@/hooks';
import {items} from '@/items';
import {DishType} from '@/types';
import {constants} from '@/constants';
import {components} from '@/components';

export const Search: React.FC = () => {
  const router = useRouter();

  const {dishes} = hooks.useGetDishes();

  const categories = dishes
    ? Array.from(new Set(dishes.map((dish: DishType) => dish.category)))
    : [];

  const renderHeader = () => {
    return (
      <components.Header title="Search" showUser={true} showBasket={true} />
    );
  };

  const renderCategories = () => {
    return (
      <div style={{marginBottom: 30}}>
        <Swiper
          spaceBetween={10}
          slidesPerView={'auto'}
          pagination={{clickable: true}}
          mousewheel={true}
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 18,
          }}
        >
          {categories?.map((category: any) => {
            return (
              <SwiperSlide key={category.id} style={{width: 'auto'}}>
                <button
                  style={{
                    borderRadius: 5,
                    padding: 10,
                    userSelect: 'none',
                    backgroundColor: constants.colors.whiteColor,
                    marginBottom: 8,
                    ...constants.flex.columnCenterCenter,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(
                      `/shop-category/${encodeURIComponent(category)}`
                    );
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      textAlign: 'center',
                      fontWeight: 600,
                      color: constants.colors.textColor,
                    }}
                  >
                    {category}
                  </span>
                </button>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  };

  const renderRecomended = () => {
    return (
      <section>
        <components.BlockHeading
          title="Popular Dishes"
          href={'/shop/popular'}
          containerStyle={{marginBottom: 16}}
        />
        <ul
          style={{
            ...constants.flex.flexColumn,
            paddingLeft: 20,
            paddingRight: 20,
            gap: 14,
          }}
        >
          {dishes
            ?.filter((dish: DishType) => dish.isPopular)
            .map((dish: DishType) => {
              return <items.PopularItem dish={dish} key={dish.id} />;
            })}
        </ul>
      </section>
    );
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          height: '100%',
          overflowY: 'auto',
          marginBottom: constants.sizes.tabBarHeight,
        }}
      >
        {renderCategories()}
        {renderRecomended()}
      </main>
    );
  };

  const renderBottomBar = () => {
    return <components.BottomTabBar />;
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderHeader()}
        {renderContent()}
        {renderBottomBar()}
        <components.SafeAreaInsetBottom />
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};

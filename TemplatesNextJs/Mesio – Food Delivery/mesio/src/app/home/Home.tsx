'use client';

import Link from 'next/link';
import 'swiper/swiper-bundle.css';
import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';

import {hooks} from '@/hooks';
import {items} from '@/items';
import {DishType} from '@/types';
import {constants} from '@/constants';
import {components} from '@/components';

export const Home: React.FC = () => {
  const {data, isLoading} = hooks.useGetDishes();

  if (isLoading) return <components.Loader />;

  const categories = data
    ? Array.from(new Set(data.map((dish: DishType) => dish.category)))
    : [];

  const renderHeader = () => {
    return (
      <components.Header
        showBurger={true}
        title="mesio"
        titleStyle={{textTransform: 'uppercase', fontWeight: 'bold'}}
        showBasket={true}
      />
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
                <Link
                  href={`${
                    constants.routes.shopCategory
                  }/${category.toLowerCase()}`}
                  style={{
                    display: 'flex',
                    border: '1px solid #E0E0E0',
                    borderRadius: 10,
                    padding: 10,
                    userSelect: 'none',
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      color: constants.colors.textColor,
                    }}
                  >
                    {category}
                  </span>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  };

  const renderPopular = () => {
    return (
      <section style={{marginBottom: 30}}>
        <components.BlockHeading
          title="Popular Dishes"
          href={`${constants.routes.shop}/popular`}
        />
        <Swiper
          spaceBetween={14}
          slidesPerView={'auto'}
          pagination={{clickable: true}}
          mousewheel={true}
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 20,
            paddingTop: 18,
          }}
        >
          {data
            ?.filter((dish: DishType) => dish.isPopular)
            .map((dish: DishType) => {
              return (
                <SwiperSlide key={dish.id} style={{width: 'auto'}}>
                  <items.PopularItem dish={dish} key={dish.id} />
                </SwiperSlide>
              );
            })}
        </Swiper>
      </section>
    );
  };

  const renderRecomended = () => {
    return (
      <section>
        <components.BlockHeading
          title="Recommended Dishes"
          href={`${constants.routes.shop}/recommended`}
        />
        <ul
          style={{
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 18,
            gap: 14,
          }}
        >
          {data
            ?.filter((dish: DishType) => dish.isRecommended)
            .map((dish: DishType) => {
              return <items.RecommendedItem dish={dish} key={dish.id} />;
            })}
        </ul>
      </section>
    );
  };

  const renderContent = () => {
    return (
      <main
        style={{
          overflowY: 'auto',
          marginTop: constants.sizes.headerHeight,
          marginBottom: constants.sizes.tabBarHeight,
          paddingBottom: 20,
        }}
      >
        {renderCategories()}
        {renderPopular()}
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
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};

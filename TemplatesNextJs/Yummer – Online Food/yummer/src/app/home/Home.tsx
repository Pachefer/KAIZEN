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

export const Home: React.FC = () => {
  const router = useRouter();
  const {dishes, loading: isLoading} = hooks.useGetDishes();
  const {offers, loading: offersIsLoading} = hooks.useGetOffers();

  if (isLoading || offersIsLoading) return <components.Loader />;

  const renderHeader = () => {
    return (
      <components.Header
        showBasket={true}
        showBurger={true}
        title="Yummer"
        showUser={true}
        titleStyle={{fontWeight: 500}}
      />
    );
  };

  const renderHotOffers = () => {
    return (
      <section style={{marginBottom: 40}}>
        <components.BlockHeading
          title="Hot offers"
          href={constants.routes.offers}
          containerStyle={{marginBottom: 15}}
        />
        <Swiper
          spaceBetween={16}
          slidesPerView={'auto'}
          pagination={{clickable: true}}
          mousewheel={true}
          style={{
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          {offers?.map((offer: any) => {
            return (
              <SwiperSlide key={offer.id} style={{width: 'auto'}}>
                <img
                  src={offer.image}
                  alt={offer.title}
                  style={{
                    width: '100%',
                    maxWidth: 300,
                    height: 'auto',
                    borderRadius: 5,
                    objectFit: 'cover',
                  }}
                  onClick={() => {
                    router.push(constants.routes.dish + `?id=${offer.dishId}`);
                  }}
                />
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
          title="Recommended"
          href={'/shop/recommended'}
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
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        {renderHotOffers()}
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

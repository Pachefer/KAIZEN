'use client';

import React, {useEffect} from 'react';
import {useRouter} from 'next/navigation';

import {items} from '@/items';
import {constants} from '@/constants';
import {components} from '@/components';
import {useAppSelector} from '@/lib/store';

export const Wishlist: React.FC = () => {
  const {list: wishlist} = useAppSelector((state) => state.wishlist);

  const navigate = useRouter();

  useEffect(() => {
    if (wishlist.length === 0) {
      navigate.push(constants.routes.wishlistEmpty);
    }
  }, [wishlist, navigate]);

  const renderHeader = () => {
    return (
      <components.Header showGoBack={true} title="Wishlist" showBasket={true} />
    );
  };

  const renderBottomBar = () => {
    return <components.BottomTabBar />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          marginBottom: constants.sizes.tabBarHeight,
          padding: 20,
          overflowY: 'auto',
        }}
      >
        <ul style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          {wishlist.map((dish) => {
            return <items.WishlistItem key={dish.id} dish={dish} />;
          })}
        </ul>
      </main>
    );
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

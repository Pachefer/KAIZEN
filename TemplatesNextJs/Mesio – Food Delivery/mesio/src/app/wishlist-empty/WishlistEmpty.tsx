'use client';

import React, {useEffect} from 'react';
import {useRouter} from 'next/navigation';

import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';
import {useAppSelector} from '@/lib/store';

export const WishlistEmpty: React.FC = () => {
  const {list: wishlist} = useAppSelector((state) => state.wishlist);
  const navigate = useRouter();

  useEffect(() => {
    if (wishlist.length > 0) {
      navigate.push(constants.routes.wishlist);
    }
  }, [wishlist, navigate]);

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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <div style={{marginBottom: 20}}>
          <svg.EmptyBagSvg />
        </div>
        <h2
          style={{
            marginBottom: 11,
            fontSize: 20,
            fontWeight: 700,
            textTransform: 'capitalize',
            color: constants.colors.seaGreenColor,
          }}
        >
          Your Wishlist is empty
        </h2>
        <p
          style={{
            maxWidth: 234,
            textAlign: 'center',
            marginBottom: 26,
            color: constants.colors.textColor,
          }}
        >
          Looks like you have not added any items to your wishlist yet.
        </p>
        <components.Button
          label="Shop now"
          onClickAction={() => navigate.push(constants.routes.shop)}
        />
      </main>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderContent()}
        {renderBottomBar()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};

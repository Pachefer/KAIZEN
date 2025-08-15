'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

export const CartEmpty: React.FC = () => {
  const router = useRouter();

  const renderHeader = () => {
    return (
      <components.Header
        showBurger={true}
        showBasket={true}
        title="Cart is empty"
      />
    );
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
          Your Cart is empty
        </h2>
        <p
          style={{
            maxWidth: 234,
            textAlign: 'center',
            marginBottom: 26,
            color: constants.colors.textColor,
          }}
        >
          {`Looks like you haven't added anything to your cart yet.`}
        </p>
        <components.Button
          label="Shop now"
          onClickAction={() => router.push(constants.routes.shop)}
        />
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

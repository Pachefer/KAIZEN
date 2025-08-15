'use client';

import React from 'react';

import {constants} from '@/constants';
import {components} from '@/components';

export const CartEmpty: React.FC = () => {
  const renderHeader = () => {
    return <components.Header showGoBack={true} />;
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
          ...constants.flex.columnCenterCenter,
          width: '100%',
          height: '100%',
        }}
      >
        <img
          src={'/elements/02.png'}
          alt="Empty Cart"
          style={{
            maxWidth: 314,
            width: '80%',
            height: 'auto',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 52,
          }}
        />
        <h2
          style={{
            marginBottom: 16,
            textAlign: 'center',
            textTransform: 'capitalize',
            ...constants.typography.h2,
          }}
        >
          Your cart is empty!
        </h2>
        <p
          style={{
            maxWidth: 234,
            textAlign: 'center',
            marginBottom: 26,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {`Looks like you haven't added anything to your cart yet.`}
        </p>
      </main>
    );
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

'use client';

import React, {useEffect} from 'react';
import {useRouter} from 'next/navigation';

import {items} from '@/items';
import {DishType} from '@/types';
import {constants} from '@/constants';
import {components} from '@/components';
import {useAppSelector} from '@/lib/store';

export const Order: React.FC = () => {
  const router = useRouter();
  const cart = useAppSelector((state) => state.cart.list);
  const total = useAppSelector((state) => state.cart.total);

  useEffect(() => {
    if (cart.length === 0) {
      router.push(constants.routes.cartEmpty);
    }
  }, [cart]);

  const renderHeader = () => {
    return (
      <components.Header title="Order" showGoBack={true} showBasket={true} />
    );
  };

  const renderBottomBar = () => {
    return <components.BottomTabBar />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginBottom: constants.sizes.tabBarHeight,
          marginTop: constants.sizes.headerHeight,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          paddingTop: 18,
          overflowY: 'auto',
        }}
      >
        <ul style={{...constants.flex.flexColumn, gap: 10, marginBottom: 30}}>
          {cart.map((dish: DishType, index: number) => {
            return <items.OrderItem dish={dish} key={index} />;
          })}
        </ul>
        <div style={{...constants.flex.flexRow, gap: 6, marginBottom: 20}}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: constants.colors.mainDarkColor,
            }}
          >
            Total: ({cart.length}) items:
          </span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#E94F08',
            }}
          >
            ${total.toFixed(2)}
          </span>
        </div>
        <components.Button
          label="Process to Checkout"
          onClickAction={() => {
            if (cart.length > 0) {
              router.push(constants.routes.checkout);
            }
          }}
        />
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

'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {items} from '@/items';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

export const Profile: React.FC = () => {
  const router = useRouter();

  const renderHeader = () => {
    return (
      <components.Header title="Profile" showUser={true} showBasket={true} />
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
          paddingTop: '14%',
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          overflowY: 'auto',
          marginBottom: constants.sizes.tabBarHeight,
        }}
      >
        <button
          style={{
            marginBottom: 30,
            ...constants.flex.flexColumn,
          }}
          onClick={() => {
            router.push(constants.routes.editProfile);
          }}
        >
          <h4
            style={{
              ...constants.typography.h4,
              textTransform: 'capitalize',
              marginBottom: 2,
            }}
          >
            Kristin Watson
          </h4>
          <span style={{fontSize: 14, color: constants.colors.textColor}}>
            kristinwatson@mail.com
          </span>
        </button>
        <div style={{...constants.flex.flexColumn, gap: 23}}>
          <items.ProfileMenuItem
            title="Order History"
            icon={<svg.CalendarSvg />}
            to={constants.routes.orderHistory}
            description="Review Your Order History"
          />
          <items.ProfileMenuItem
            title="My Promocodes"
            icon={<svg.GiftSvg />}
            to={constants.routes.myPromocodes}
            description="Review Your Order History"
          />
          <items.ProfileMenuItem
            title="My Favorite"
            icon={<svg.HeartSvg />}
            to={constants.routes.myFavorite}
            description="Review Your Order History"
          />
          <items.ProfileMenuItem
            title="Sign out"
            icon={<svg.LogOutSvg />}
            to={constants.routes.signIn}
            description="Review Your Order History"
          />
          <items.ProfileMenuItem
            title="Delete Account"
            icon={<svg.CrossSvg />}
            to={constants.routes.signIn}
            description="Review Your Order History"
          />
        </div>
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

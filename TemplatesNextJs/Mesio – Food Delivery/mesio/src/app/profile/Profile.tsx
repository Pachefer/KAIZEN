'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {items} from '@/items';
import {constants} from '@/constants';
import {components} from '@/components';

export const Profile: React.FC = () => {
  const router = useRouter();

  const renderHeader = () => {
    return (
      <components.Header showBurger={true} showBasket={true} title="Profile" />
    );
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          paddingTop: 25,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          overflowY: 'auto',
          marginBottom: constants.sizes.tabBarHeight,
        }}
      >
        <div
          style={{marginBottom: 34}}
          onClick={() => router.push(constants.routes.editProfile)}
        >
          <img
            src="https://george-fx.github.io/mesio-data/users/01.jpg"
            alt="User Avatar"
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              marginBottom: 12,
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
          <h2
            style={{
              fontWeight: 700,
              fontSize: 16,
              textAlign: 'center',
              textTransform: 'capitalize',
              marginBottom: 5,
              color: constants.colors.seaGreenColor,
            }}
          >
            Kristin Watsan
          </h2>
          <span
            style={{
              textAlign: 'center',
              display: 'block',
              color: constants.colors.textColor,
            }}
          >
            +880123 456 789
          </span>
        </div>
        <div style={{...constants.flex.column, gap: 18}}>
          <items.ProfileMenuItem
            title="Order History"
            icon={'https://george-fx.github.io/mesio-data/icons/06.png'}
            to={constants.routes.orderHistory}
            description="Review Your Order History"
          />
          <items.ProfileMenuItem
            title="Notifications"
            icon={'https://george-fx.github.io/mesio-data/icons/07.png'}
            to={constants.routes.notifications}
            description="Your Notifications"
          />
          <items.ProfileMenuItem
            title="FAQ"
            icon={'https://george-fx.github.io/mesio-data/icons/08.png'}
            to={constants.routes.faq}
            description="Frequently Questions"
          />
          <items.ProfileMenuItem
            title="My Promocodes"
            icon={'https://george-fx.github.io/mesio-data/icons/11.png'}
            to={constants.routes.myPromocodes}
            description="Your Promocodes"
          />
          <items.ProfileMenuItem
            title="My Promocodes Empty"
            icon={'https://george-fx.github.io/mesio-data/icons/11.png'}
            to={constants.routes.myPromocodesEmpty}
            description="Your Promocodes"
          />
          <items.ProfileMenuItem
            title="Logout"
            icon={'https://george-fx.github.io/mesio-data/icons/10.png'}
            to={constants.routes.signIn}
            description="Logout from your account"
          />
        </div>
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

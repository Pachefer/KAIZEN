'use client';

import React, {useEffect, useState} from 'react';
import {useRouter, usePathname} from 'next/navigation';

import {constants} from '@/constants';
import {useAppSelector} from '@/lib/store';

type Props = {
  containerStyle?: React.CSSProperties;
  tabsContainerStyle?: React.CSSProperties;
};

export const BottomTabBar: React.FC<Props> = ({
  containerStyle,
  tabsContainerStyle,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const {list: cart} = useAppSelector((state) => state.cart);
  const [isMobile, setIsMobile] = useState(false);
  const {list: wishlist} = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    const check = () =>
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    setIsMobile(check());
  }, []);

  return (
    <div
      style={{
        maxWidth: isMobile ? '100%' : constants.sizes.screenWidth,
        width: '100%',
        zIndex: 100,
        position: 'fixed',
        left: 0,
        right: 0,
        margin: '0 auto',
        bottom: 'env(safe-area-inset-bottom)',
        backgroundColor: constants.colors.whiteColor,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F5',
        borderTopStyle: 'solid',
        ...containerStyle,
      }}
    >
      <footer
        style={{
          backgroundColor: 'var(--main-dark-color)',
          borderRadius: 70,
          width: '100%',
          height: constants.sizes.tabBarHeight,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          ...tabsContainerStyle,
        }}
      >
        {constants.tabs.map((tab, index) => {
          const color =
            pathname === tab.route
              ? constants.colors.seaGreenColor
              : pathname === constants.routes.cartEmpty &&
                tab.route === constants.routes.order
              ? constants.colors.seaGreenColor
              : pathname === constants.routes.wishlistEmpty &&
                tab.route === constants.routes.wishlist
              ? constants.colors.seaGreenColor
              : constants.colors.textColor;
          const Icon = tab.icon;
          return (
            <button
              key={index}
              onClick={() => {
                if (cart.length === 0 && tab.route === constants.routes.order) {
                  router.push(constants.routes.cartEmpty);
                  return;
                }

                if (
                  wishlist.length === 0 &&
                  tab.route === constants.routes.wishlist
                ) {
                  router.push(constants.routes.wishlistEmpty);
                  return;
                }

                router.push(tab.route);
              }}
              type="button"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon color={color} />
            </button>
          );
        })}
      </footer>
    </div>
  );
};

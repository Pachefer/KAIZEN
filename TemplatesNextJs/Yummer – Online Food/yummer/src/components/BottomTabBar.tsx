'use client';

import React, {useEffect, useState} from 'react';
import {useRouter, usePathname} from 'next/navigation';

import {constants} from '@/constants';

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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () =>
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    setIsMobile(check());
  }, []);

  const iconColor = (route: string) => {
    if (
      pathname === constants.routes.cartEmpty &&
      route === constants.routes.order
    ) {
      return constants.colors.mainColor;
    }

    if (pathname === route) {
      return constants.colors.mainColor;
    }

    if (pathname !== route) {
      return constants.colors.textColor;
    }
  };

  return (
    <div
      style={{
        maxWidth: isMobile ? '100%' : constants.sizes.screenWidth,
        zIndex: 100,
        position: 'fixed',
        left: 0,
        right: 0,
        margin: '0 auto',
        bottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: constants.colors.whiteColor,
        borderTopWidth: 1,
        borderTopColor: '#E2E2E2',
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
          ...constants.flex.rowAlignCenterSpaceAround,
          ...tabsContainerStyle,
        }}
      >
        {constants.tabs.map((tab, index) => {
          const color = iconColor(tab.route);
          return (
            <button
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => {
                router.push(tab.route);
              }}
              type="button"
            >
              <tab.icon color={color} />
              <span
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                  marginTop: 6,
                  color: color,
                }}
              >
                {tab.title}
              </span>
            </button>
          );
        })}
      </footer>
    </div>
  );
};

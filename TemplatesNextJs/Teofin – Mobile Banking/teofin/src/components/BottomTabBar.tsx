'use client';

import React from 'react';
import {useRouter, usePathname} from 'next/navigation';

import {hooks} from '@/hooks';
import {constants} from '@/constants';

export const BottomTabBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = hooks.useIsMobile();

  return (
    <div>
      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          paddingLeft: 10,
          paddingRight: 10,
          alignItems: 'center',
          backgroundColor: constants.colors.whiteColor,
          height: constants.sizes.tabBarHeight,
          position: 'fixed',
          bottom: 'var(--safe-bottom)',
          width: '100%',
          maxWidth: isMobile ? '100%' : constants.sizes.screenWidth,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        {constants.tabs.map((tab) => {
          const isActive = pathname === tab.route;
          return (
            <button
              key={tab.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 'calc(100% / 5)',
              }}
              onClick={() => router.push(tab.route)}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <tab.icon
                  color={
                    isActive
                      ? constants.colors.linkColor
                      : constants.colors.bodyTextColor
                  }
                />
              </div>
              <span
                style={{
                  fontSize: 10,
                  marginTop: 7,
                  fontWeight: '600',
                  color: isActive
                    ? constants.colors.linkColor
                    : constants.colors.mainDarkColor,
                }}
              >
                {tab.name}
              </span>
            </button>
          );
        })}
      </footer>
    </div>
  );
};

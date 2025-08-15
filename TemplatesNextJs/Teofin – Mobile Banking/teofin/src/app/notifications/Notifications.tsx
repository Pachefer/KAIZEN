'use client';

import React from 'react';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

const notifications = [
  {
    id: 1,
    status: 'success',
    icon: svg.NtfCheckSvg,
    title: 'loan has been approved!',
    description: '',
    date: 'Aug 29, 2022 at 12:36 PM',
  },
  {
    id: 2,
    status: 'warning',
    icon: svg.NtfAlertSvg,
    title: 'The loan repayment period expires!',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: 'Aug 29, 2022 at 12:36 PM',
  },
  {
    id: 3,
    status: 'error',
    icon: svg.NtfRejectedSvg,
    title: 'Your loan application was rejected!',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
    date: 'Aug 29, 2022 at 12:36 PM',
  },
];

export const Notifications: React.FC = () => {
  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const isMobile = hooks.useIsMobile();

  const renderContent = () => {
    return (
      <main
        style={{
          paddingTop: constants.sizes.headerHeight,
          marginBottom: constants.sizes.tabBarHeight,
          paddingLeft: 20,
          paddingRight: 20,
          overflowY: 'auto',
          paddingBottom: 20,
        }}
      >
        <h2 style={{...constants.typography.h2, marginBottom: 20}}>
          Notifications
        </h2>
        <ul style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          {notifications.map((notification) => {
            return (
              <li
                key={notification.id}
                style={{
                  backgroundColor: constants.colors.whiteColor,
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    paddingBottom: 14,
                  }}
                >
                  <notification.icon />
                  <h5 style={{...constants.typography.h5}}>
                    {notification.title}
                  </h5>
                </div>
                {notification.description && (
                  <p
                    style={{
                      ...constants.typography.bodyText,
                      paddingBottom: 14,
                      borderBottom: `1px solid #CED6E1`,
                      marginBottom: 14,
                    }}
                  >
                    {notification.description}
                  </p>
                )}
                <div />
                <span
                  style={{fontSize: 12, color: constants.colors.bodyTextColor}}
                >
                  {notification.date}
                </span>
              </li>
            );
          })}
        </ul>
      </main>
    );
  };

  const renderBottomBar = () => {
    return <components.BottomTabBar />;
  };

  const renderHomeIndicatorBG = () => {
    return (
      <div
        style={{
          backgroundColor: constants.colors.whiteColor,
          height: 'env(safe-area-inset-bottom, 0px)',
          width: isMobile ? '100%' : constants.sizes.screenWidth,
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      ></div>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderContent()}
        {renderBottomBar()}
      </components.SafeAreaView>
      {renderHomeIndicatorBG()}
    </components.MotionWrapper>
  );
};

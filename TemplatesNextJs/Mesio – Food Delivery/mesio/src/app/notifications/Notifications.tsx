'use client';

import React from 'react';

import {items} from '@/items';
import {constants} from '@/constants';
import {components} from '@/components';

export const Notifications: React.FC = () => {
  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Notifications" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          ...constants.flex.column,
          gap: 10,
        }}
      >
        {constants.data.notifications.map((notification, index) => {
          return (
            <items.NotificationItem key={index} notification={notification} />
          );
        })}
      </main>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderHeader()}
        {renderContent()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};

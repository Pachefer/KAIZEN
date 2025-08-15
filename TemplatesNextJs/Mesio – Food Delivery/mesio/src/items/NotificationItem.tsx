'use client';

import React from 'react';

import {constants} from '@/constants';

type Props = {
  notification: any;
};

export const NotificationItem: React.FC<Props> = ({notification}) => {
  return (
    <div
      style={{
        border: '1px solid #ECECEC',
        padding: '19px 15px',
        borderRadius: 10,
        ...constants.flex.rowCenter,
        gap: 15,
      }}
    >
      <notification.icon width={40} />
      <div style={{...constants.flex.column, flex: 1}}>
        <span
          style={{
            fontSize: 16,
            color: constants.colors.mainDarkColor,
            fontWeight: 'bold',
            marginBottom: 3,
          }}
          className="number-of-lines-1"
        >
          {notification.title}
        </span>
        <span
          className="number-of-lines-1"
          style={{fontSize: 14, color: constants.colors.textColor}}
        >
          {notification.message}
        </span>
      </div>
    </div>
  );
};

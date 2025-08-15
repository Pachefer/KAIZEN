'use client';

import React from 'react';

import {constants} from '@/constants';

type Props = {
  isActive?: boolean;
  onClickAction?: () => void;
};

export const Switcher: React.FC<Props> = ({onClickAction, isActive}) => {
  return (
    <div
      onClick={onClickAction}
      style={{
        width: 39.49,
        borderRadius: 20.9,
        padding: 1.55,
        display: 'flex',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.2s, justify-content 0.2s',
        backgroundColor: isActive ? '#3eb290' : 'lightgrey',
        justifyContent: isActive ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          backgroundColor: constants.colors.whiteColor,
          width: 20.9,
          height: 20.9,
          borderRadius: '50%',
          transition: 'background 0.2s',
        }}
      />
    </div>
  );
};

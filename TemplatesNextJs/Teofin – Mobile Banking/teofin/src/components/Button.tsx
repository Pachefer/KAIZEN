'use client';

import React from 'react';

import {constants} from '@/constants';

interface ButtonProps {
  title: string;
  onClickAction?: () => void;
  containerStyle?: React.CSSProperties;
  colorScheme?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  colorScheme = 'primary',
  onClickAction,
  containerStyle,
}) => {
  return (
    <div style={{width: '100%', ...containerStyle}}>
      <button
        onClick={onClickAction}
        style={{
          width: '100%',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          border: colorScheme === 'primary' ? 'none' : '1px solid',
          borderColor: colorScheme === 'primary' ? 'transparent' : '#CED6E1',
          background:
            colorScheme === 'primary'
              ? 'linear-gradient(91.28deg, #97daff 0%, #16579d 100%)'
              : '#F1F5FD',
        }}
      >
        <span
          style={{
            color:
              colorScheme === 'primary'
                ? constants.colors.whiteColor
                : constants.colors.mainDarkColor,
            fontWeight: 600,
            textTransform: 'capitalize',
            fontSize: '16px',
          }}
        >
          {title}
        </span>
      </button>
    </div>
  );
};

'use client';

import React from 'react';

import {constants} from '@/constants';

type Props = {
  label: string;
  onClickAction?: () => void;
  colorScheme?: 'primary' | 'secondary';
  containerStyle?: React.CSSProperties;
};

export const Button: React.FC<Props> = ({
  label,
  onClickAction,
  containerStyle,
  colorScheme = 'primary',
}) => {
  return (
    <div style={{width: '100%'}}>
      <button
        type="button"
        style={{
          backgroundColor:
            colorScheme === 'primary'
              ? constants.colors.seaGreenColor
              : '#E8F9F1',
          width: '100%',
          borderRadius: 10,
          color: '#fff',
          height: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...containerStyle,
        }}
        onClick={onClickAction}
      >
        <span
          style={{
            fontWeight: 700,

            color:
              colorScheme === 'primary'
                ? '#fff'
                : constants.colors.seaGreenColor,
            fontSize: 16,
            textTransform: 'capitalize',
          }}
        >
          {label}
        </span>
      </button>
    </div>
  );
};

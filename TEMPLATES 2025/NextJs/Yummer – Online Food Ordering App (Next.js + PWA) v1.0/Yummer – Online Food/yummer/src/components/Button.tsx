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
}) => {
  return (
    <div style={{width: '100%'}}>
      <button
        type="button"
        style={{
          background:
            'linear-gradient(102.97deg, #FF7F56 0%, rgba(232, 57, 57, 0.8) 100%)',
          width: '100%',
          borderRadius: 5,
          color: '#fff',
          height: 50,
          position: 'relative',
          ...constants.flex.rowAlignCenterCenter,
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
            fontSize: 14,
            color: constants.colors.whiteColor,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
        <img
          src={'/elements/01.png'}
          alt="Element"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            height: '100%',
            width: 'auto',
          }}
        />
      </button>
    </div>
  );
};

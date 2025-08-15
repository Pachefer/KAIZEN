'use client';

import React, {useState} from 'react';

import {constants} from '@/constants';

type Props = {
  value?: string;
  label?: string;
  placeholder?: string;
  onClickAction?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputType?: 'text' | 'password';
  containerStyle?: React.CSSProperties;
};

export const InputField: React.FC<Props> = ({
  placeholder,
  containerStyle,
  onClickAction,
  value,
  inputType = 'text',
  rightIcon,
}) => {
  const [visible, _] = useState(false);

  const isPlaceholder = !value;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        position: 'relative',
      }}
    >
      <button
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          height: 50,
          borderRadius: 10,
          paddingLeft: 20,
          backgroundColor: constants.colors.whiteColor,
          ...containerStyle,
        }}
        onClick={onClickAction}
        type="button"
      >
        <span
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            marginRight: 'auto',
            paddingRight: 20,
            background: 'none',
            border: 'none',
            color: isPlaceholder
              ? constants.colors.placeholderColor
              : constants.colors.mainDarkColor,
          }}
        >
          {inputType === 'password' && !visible
            ? value
              ? '•'.repeat(value.length)
              : placeholder || 'Enter text...'
            : value || placeholder || 'Enter text...'}
        </span>
        {rightIcon && (
          <span
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={onClickAction}
          >
            {rightIcon}
          </span>
        )}
      </button>
    </div>
  );
};

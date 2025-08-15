'use client';

import React, {useState} from 'react';

import {constants} from '@/constants';

type Props = {
  onClickAction?: () => void;
  placeholder?: string;
  value?: string;
  isValid?: boolean;
  inputType?: 'text' | 'password';
  containerStyle?: React.CSSProperties;
  className?: string;
  leftIcon?: React.ReactNode;
};

export const Input: React.FC<Props> = ({
  placeholder,
  containerStyle,
  onClickAction,
  value,
  inputType = 'text',
}) => {
  const [visible, _] = useState(false);

  const isPlaceholder = !value;

  return (
    <button
      style={{
        backgroundColor: constants.colors.lightGrayColor,
        width: '100%',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        height: 50,
        paddingLeft: 20,
        border: '1px solid #EEEEEE',
        cursor: 'pointer',
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
            ? constants.colors.textColor
            : constants.colors.mainDarkColor,
        }}
      >
        {inputType === 'password' && !visible
          ? value
            ? '•'.repeat(value.length)
            : placeholder || 'Enter text...'
          : value || placeholder || 'Enter text...'}
      </span>
    </button>
  );
};

'use client';

import React, {useState} from 'react';

import {constants} from '@/constants';

type Props = {
  onClickAction?: () => void;
  placeholder?: string;
  value?: string;
  label?: string;
  isValid?: boolean;
  inputType?: 'text' | 'password';
  containerStyle?: React.CSSProperties;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const Input: React.FC<Props> = ({
  label,
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
      <span
        style={{
          marginBottom: 14,
          ...constants.typography.inputLabel,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <button
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          paddingBottom: 10,
          borderBottom: '1px solid #E2E2E2',
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

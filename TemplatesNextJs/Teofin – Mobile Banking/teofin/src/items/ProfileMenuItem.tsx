'use client';

import React from 'react';

import {constants} from '@/constants';
import {Switcher} from '@/components/Switcher';

type Props = {
  title: string;
  onClickAction?: () => void;
  checked?: boolean;
  onToggleAction?: (newValue: boolean) => void;
  leftSideIcon: React.ReactNode;
  rightSideIcon?: React.ReactNode;
};

export const ProfileMenuItem: React.FC<Props> = ({
  onClickAction,
  title,
  leftSideIcon,
  rightSideIcon,
  checked,
  onToggleAction,
}) => {
  const handleClick = () => {
    if (onToggleAction && typeof checked === 'boolean') {
      onToggleAction(!checked);
    }
    if (onClickAction) {
      onClickAction();
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        backgroundColor: constants.colors.whiteColor,
        padding: 20,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {leftSideIcon}
      <h5
        style={{
          marginRight: 'auto',
          ...constants.typography.h5,
          color:
            title === 'Log Out'
              ? constants.colors.linkColor
              : constants.colors.mainDarkColor,
        }}
      >
        {title}
      </h5>
      {title !== 'Log Out' && rightSideIcon}
      {onToggleAction && typeof checked === 'boolean' && (
        <Switcher
          onClickAction={() => {
            if (onToggleAction) {
              onToggleAction(!checked);
            }
          }}
          isActive={checked}
        />
      )}
    </div>
  );
};

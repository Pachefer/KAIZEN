'use client';

import React from 'react';

import {svg} from '@/assets/svg';

import {constants} from '@/constants';

type Props = {
  checked?: boolean;
};

export const Checkbox: React.FC<Props> = ({checked}) => {
  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: constants.colors.seaGreenColor,
        borderRadius: 3,
        borderStyle: 'solid',
        ...constants.flex.rowCenter,
      }}
    >
      {checked && <svg.CheckSvg />}
    </div>
  );
};

'use client';

import React from 'react';

import {svg} from '@/assets/svg';
import {constants} from '@/constants';

type Props = {
  rating?: number;
  containerStyle?: React.CSSProperties;
};

export const DishRating: React.FC<Props> = ({rating, containerStyle}) => {
  return (
    <div
      style={{
        backgroundColor: constants.colors.whiteColor,
        paddingLeft: 10,
        paddingRight: 14,
        height: 26,
        borderRadius: '5px 0 5px 0',
        ...constants.flex.flexRow,
        gap: 6,
        ...constants.flex.rowAlignCenter,
        ...containerStyle,
      }}
    >
      <svg.StarSvg />
      <span
        style={{
          fontSize: 12,
          lineHeight: 1.2,
          marginBottom: 2,
          fontWeight: 600,
          color: constants.colors.titlesColor,
        }}
      >
        {rating}
      </span>
    </div>
  );
};

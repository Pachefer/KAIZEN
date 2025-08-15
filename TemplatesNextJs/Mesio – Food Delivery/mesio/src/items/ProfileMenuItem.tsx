'use client';

import React from 'react';
import Link from 'next/link';

import {constants} from '@/constants';

type Props = {
  to: string;
  title: string;
  description?: string;
  icon: string;
};

export const ProfileMenuItem: React.FC<Props> = ({
  icon,
  description,
  title,
  to = '#',
}) => {
  return (
    <Link
      href={to}
      style={{
        ...constants.flex.rowCenter,
        gap: 12,
        borderBottom: '1px solid #C8C8D3',
        borderBottomStyle: 'dashed',
        paddingBottom: 14,
      }}
    >
      <img src={icon} alt={title} style={{width: 40, height: 40}} />
      <div style={{flex: 1}}>
        <h3
          style={{
            fontSize: 16,
            color: constants.colors.mainDarkColor,
          }}
        >
          {title}
        </h3>
        {description && (
          <p style={{fontSize: 12, color: constants.colors.textColor}}>
            {description}
          </p>
        )}
      </div>
      {/* <RightArrowSvg /> */}
    </Link>
  );
};

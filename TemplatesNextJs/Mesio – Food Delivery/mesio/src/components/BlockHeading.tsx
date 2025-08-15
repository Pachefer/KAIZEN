'use client';

import React from 'react';
import Link from 'next/link';

import {constants} from '@/constants';

type Props = {
  href?: string;
  title?: string;
  containerStyle?: React.CSSProperties;
};

export const BlockHeading: React.FC<Props> = ({
  title,
  href,
  containerStyle,
}) => {
  return (
    <div
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        ...constants.flex.rowCenterBetween,
        ...containerStyle,
      }}
    >
      <h2
        style={{
          fontWeight: 600,
          color: constants.colors.mainDarkColor,
          fontSize: 18,
          textTransform: 'capitalize',
        }}
      >
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          style={{
            color: constants.colors.seaGreenColor,
            fontSize: 14,
            fontWeight: 400,
            textDecoration: 'none',
          }}
        >
          View All
        </Link>
      )}
    </div>
  );
};

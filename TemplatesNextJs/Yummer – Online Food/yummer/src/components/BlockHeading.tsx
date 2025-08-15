'use client';

import React from 'react';
import Link from 'next/link';

import {svg} from '@/assets/svg';
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...containerStyle,
      }}
    >
      <h2
        style={{
          textTransform: 'capitalize',
          ...constants.typography.h2,
          color: constants.colors.mainDarkColor,
        }}
      >
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg.ViewAllSvg />
        </Link>
      )}
    </div>
  );
};

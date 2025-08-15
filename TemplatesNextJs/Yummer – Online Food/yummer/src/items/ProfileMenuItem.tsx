'use client';

import React from 'react';
import Link from 'next/link';

import {svg} from '@/assets/svg';
import {constants} from '@/constants';

type Props = {
  to: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
};

export const ProfileMenuItem: React.FC<Props> = ({icon, title, to = '#'}) => {
  return (
    <Link
      href={to}
      style={{
        ...constants.flex.rowAlignCenter,
        gap: 12,
        borderBottom: '1px solid #E2E2E2',
        borderBottomStyle: 'solid',
        paddingBottom: 23,
      }}
    >
      {icon}
      <div style={{flex: 1}}>
        <h5 style={{marginBottom: 2, ...constants.typography.h5}}>{title}</h5>
      </div>
      {title !== 'Sign out' && title !== 'Delete Account' && (
        <svg.RightArrowSvg />
      )}
    </Link>
  );
};

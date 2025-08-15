'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {svg} from '@/assets/svg';
import {constants} from '@/constants';

type Props = {
  limit: {
    id: number;
    type: string;
    defaultLimit: string;
    icon: React.FC;
    link: string | null;
  };
};

export const LimitItem: React.FC<Props> = ({limit}) => {
  const router = useRouter();
  return (
    <li>
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #ced6e1',
          paddingTop: 8,
          paddingBottom: 10,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={() => {
          if (limit.link) {
            router.push(limit.link);
          } else {
            alert('This limit is not available for modification yet.');
          }
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 2,
            }}
          >
            <limit.icon />
            <h5 style={{...constants.typography.h5}}>{limit.type}</h5>
          </div>
          <span
            style={{
              fontSize: 12,
              color: constants.colors.bodyTextColor,
            }}
          >
            Default limit: {limit.defaultLimit}
          </span>
        </div>
        <svg.RightArrowSvg />
      </div>
    </li>
  );
};

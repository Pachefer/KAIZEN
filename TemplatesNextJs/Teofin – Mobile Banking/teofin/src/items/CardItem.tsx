'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {svg} from '@/assets/svg';
import {constants} from '@/constants';

type Props = {
  card: {
    id: number;
    type: string;
    number: string;
    balance: string;
  };
};

export const CardItem: React.FC<Props> = ({card}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`${constants.routes.cardDetails}?cardId=${card.id}`);
  };

  return (
    <div
      style={{
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        border: 'none',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      {/* Image */}
      <span
        style={{
          background:
            'linear-gradient(110.75deg, #c285ab 0%, #7aa1ce 49.34%, #1b1f6a 100.78%)',
          width: 72,
          height: 46,
          borderRadius: 5,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}
      >
        <span
          style={{
            color: constants.colors.whiteColor,
            fontSize: 12,
            margin: 10,
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          teofin
        </span>
      </span>
      {/* Details */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: constants.colors.bodyTextColor,
          }}
        >
          {card.number}
        </span>
        <h6 style={{...constants.typography.h6}}>{card.balance}</h6>
      </div>
      <svg.RightArrowSvg />
    </div>
  );
};

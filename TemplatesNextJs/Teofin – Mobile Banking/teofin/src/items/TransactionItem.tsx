'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {constants} from '@/constants';

import type {TransactionType} from '@/types';

type Props = {
  transaction: TransactionType;
};

export const TransactionItem: React.FC<Props> = ({transaction}) => {
  const router = useRouter();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 10,
        backgroundColor: constants.colors.whiteColor,
        borderRadius: 10,
        border: 'none',
        cursor: 'pointer',
      }}
      onClick={() => {
        router.push(
          `${constants.routes.transactionDetails}?txId=${transaction.id}`
        );
      }}
    >
      <img
        src={transaction.icon}
        alt={transaction.name}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          marginRight: 14,
        }}
      />
      <div style={{flexGrow: 1}}>
        <h6 style={{...constants.typography.h6, lineHeight: 1.2}}>
          {transaction.name}
        </h6>
        <span
          style={{
            fontSize: 12,
            color: constants.colors.bodyTextColor,
          }}
        >
          {transaction.category}
        </span>
      </div>
      <h6
        style={{
          ...constants.typography.h6,
          color:
            transaction.direction === 'in'
              ? '#3eb290'
              : constants.colors.mainDarkColor,
        }}
      >
        {transaction.direction === 'in' ? '+' : '-'}{' '}
        {transaction.amount.toFixed(2)}
      </h6>
    </div>
  );
};

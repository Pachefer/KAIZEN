import * as React from 'react';

export const MoneyTransferSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={60}
      height={60}
      fill='none'
    >
      <rect
        width={60}
        height={60}
        fill='#55ACEE'
        rx={30}
      />
      <path
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='m35 19 4 4-4 4'
      />
      <path
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M21 29v-2a4 4 0 0 1 4-4h14M25 41l-4-4 4-4'
      />
      <path
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M39 31v2a4 4 0 0 1-4 4H21'
      />
    </svg>
  );
};

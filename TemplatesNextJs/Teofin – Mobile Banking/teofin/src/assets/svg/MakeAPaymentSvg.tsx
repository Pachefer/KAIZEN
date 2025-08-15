import * as React from 'react';

export const MakeAPaymentSvg: React.FC = () => {
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
        fill='#EC5'
        rx={30}
      />
      <path
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M30 19v22M35 23h-7.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H24'
      />
    </svg>
  );
};

import * as React from 'react';

export const NtfRejectedSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={18}
      height={18}
      fill='none'
    >
      <rect
        width={18}
        height={18}
        fill='#FF5887'
        rx={9}
      />
      <path
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='m11.5 6.5-5 5M6.5 6.5l5 5'
      />
    </svg>
  );
};

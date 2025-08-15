import * as React from 'react';

export const HeartSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={50}
      height={50}
      fill='none'
    >
      <rect
        width={50}
        height={50}
        fill='#FF5887'
        rx={25}
      />
      <path
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M33.84 17.61a5.5 5.5 0 0 0-7.78 0L25 18.67l-1.06-1.06a5.501 5.501 0 0 0-7.78 7.78l1.06 1.06L25 34.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78v0Z'
      />
    </svg>
  );
};

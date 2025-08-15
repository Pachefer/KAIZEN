import * as React from 'react';

export const CrossSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={20}
      height={20}
      fill='none'
    >
      <g
        stroke='#7D849A'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
      >
        <path d='M16.015 16.011 3.994 3.991M3.994 16.02l12.02-12.021' />
      </g>
      <defs>
        <clipPath id='a'>
          <path
            fill='#fff'
            d='M0 0h20v20H0z'
          />
        </clipPath>
      </defs>
    </svg>
  );
};

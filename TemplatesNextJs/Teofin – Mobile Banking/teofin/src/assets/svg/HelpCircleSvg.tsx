import * as React from 'react';

export const HelpCircleSvg: React.FC = () => {
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
        fill='#FF8A71'
        rx={25}
      />
      <g
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
      >
        <path d='M25 33.333a8.333 8.333 0 1 0 0-16.666 8.333 8.333 0 0 0 0 16.666Z' />
        <path d='M22.575 22.5a2.5 2.5 0 0 1 4.858.833c0 1.667-2.5 2.5-2.5 2.5M25 29.167h.008' />
      </g>
      <defs>
        <clipPath id='a'>
          <path
            fill='#fff'
            d='M15 15h20v20H15z'
          />
        </clipPath>
      </defs>
    </svg>
  );
};

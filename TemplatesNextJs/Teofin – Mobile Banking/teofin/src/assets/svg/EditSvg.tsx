import * as React from 'react';

export const EditSvg: React.FC = () => {
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
        <path d='M24.667 17.083h-5.834a1.667 1.667 0 0 0-1.666 1.667v11.667a1.666 1.666 0 0 0 1.666 1.666H30.5a1.667 1.667 0 0 0 1.667-1.666v-5.834' />
        <path d='M30.917 15.833a1.768 1.768 0 0 1 2.5 2.5L25.5 26.25l-3.333.833L23 23.75l7.917-7.917Z' />
      </g>
      <defs>
        <clipPath id='a'>
          <path
            fill='#fff'
            d='M15.5 13.75h20v20h-20z'
          />
        </clipPath>
      </defs>
    </svg>
  );
};

import * as React from 'react';

export const OpenArrowSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={40}
      height={24}
      fill='none'
    >
      <g>
        <path
          stroke='#FF5887'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.5}
          d='m29.429 14.428 4.285-4.285L38 14.428'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path
            fill='#fff'
            d='M39 9.143v5.714H29V9.143z'
          />
        </clipPath>
      </defs>
    </svg>
  );
};

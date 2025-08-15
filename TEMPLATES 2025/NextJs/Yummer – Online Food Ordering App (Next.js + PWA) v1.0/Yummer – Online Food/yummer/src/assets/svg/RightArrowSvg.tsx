import * as React from 'react';

export const RightArrowSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={8}
      height={12}
      fill='none'
    >
      <g>
        <path
          stroke='#7D849A'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.5}
          d='M2 10.8 6.8 6 2 1.2'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path
            fill='#fff'
            d='M.8 0H8v12H.8z'
          />
        </clipPath>
      </defs>
    </svg>
  );
};

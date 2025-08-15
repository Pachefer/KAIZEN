import * as React from 'react';

export const LinkSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={12}
      height={12}
      fill='none'
    >
      <g>
        <path
          stroke='#B4B4C6'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={0.857}
          d='m5.143 2.571 1.255-1.255a3.03 3.03 0 0 1 4.286 4.286L9.429 6.857M6.857 9.43l-1.255 1.255a3.03 3.03 0 0 1-4.286-4.286l1.255-1.255m5.143-.857L4.286 7.714'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path
            fill='#fff'
            d='M0 0h12v12H0z'
          />
        </clipPath>
      </defs>
    </svg>
  );
};

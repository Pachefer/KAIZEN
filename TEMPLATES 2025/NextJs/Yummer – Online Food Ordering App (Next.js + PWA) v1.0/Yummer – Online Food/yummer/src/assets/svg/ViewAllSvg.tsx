import * as React from 'react';

export const ViewAllSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={34}
      height={24}
      fill='none'
    >
      <path
        fill='#E83939'
        d='M2.043 18H.363L5.435 6.608h1.392L11.9 18h-1.664L5.9 7.856h.512L2.043 18Zm.512-2.816.608-1.312h5.904l.592 1.312H2.555ZM13.23 18V6.224h1.617V18H13.23Zm3.97 0V6.224h1.615V18H17.2Z'
      />
      <g>
        <path
          stroke='#E83939'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.5}
          d='m29 17 4-4-4-4'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path
            fill='#fff'
            d='M28 8h6v10h-6z'
          />
        </clipPath>
      </defs>
    </svg>
  );
};

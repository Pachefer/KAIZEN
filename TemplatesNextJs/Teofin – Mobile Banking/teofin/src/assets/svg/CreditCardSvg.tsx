import * as React from 'react';

export const CreditCardSvg: React.FC = () => {
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
        fill='#3EB290'
        rx={25}
      />
      <path
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M32.5 18.333h-15c-.92 0-1.667.747-1.667 1.667v10c0 .92.747 1.667 1.667 1.667h15c.92 0 1.667-.747 1.667-1.667V20c0-.92-.747-1.667-1.667-1.667ZM15.833 23.333h18.334'
      />
    </svg>
  );
};

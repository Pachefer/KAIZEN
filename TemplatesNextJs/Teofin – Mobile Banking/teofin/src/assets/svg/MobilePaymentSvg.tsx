import * as React from 'react';

export const MobilePaymentSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={60}
      height={60}
      fill='none'
    >
      <rect
        width={60}
        height={60}
        fill='#FF8A71'
        rx={30}
      />
      <path
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M35 20H25a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V22a2 2 0 0 0-2-2ZM30 36h.01'
      />
    </svg>
  );
};

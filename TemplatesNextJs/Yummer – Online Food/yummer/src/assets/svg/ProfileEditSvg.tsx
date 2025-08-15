import * as React from 'react';

export const ProfileEditSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={30}
      height={30}
      fill='none'
    >
      <circle
        cx={15}
        cy={15}
        r={13.5}
        fill='#7D849A'
        stroke='#fff'
        strokeWidth={3}
      />
      <path
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M15 19.667h5.25M17.625 10.042a1.238 1.238 0 0 1 1.75 1.75l-7.292 7.291-2.333.584.583-2.334 7.292-7.291Z'
      />
    </svg>
  );
};

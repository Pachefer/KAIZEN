import * as React from 'react';

export const ProfileUserSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={22}
      height={22}
      fill='none'
    >
      <g>
        <rect
          width={22}
          height={22}
          fill='#B5D0FF'
          rx={11}
        />
        <path
          fill='#3B5999'
          d='M18 18c0 2.761-3.134 5-7 5s-7-2.239-7-5 3.134-5 7-5 7 2.239 7 5Z'
        />
        <path
          fill='#3B5999'
          d='M15 9a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'
        />
      </g>
      <rect
        width={21}
        height={21}
        x={0.5}
        y={0.5}
        stroke='#fff'
        strokeOpacity={0.3}
        rx={10.5}
      />
      <defs>
        <clipPath id='a'>
          <rect
            width={22}
            height={22}
            fill='#fff'
            rx={11}
          />
        </clipPath>
      </defs>
    </svg>
  );
};

import * as React from 'react';

export const ChartSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={150}
      height={150}
      fill='none'
    >
      <mask
        id='a'
        width={150}
        height={150}
        x={0}
        y={0}
        maskUnits='userSpaceOnUse'
        style={{
          maskType: 'alpha',
        }}
      >
        <path
          fill='#1B1D4D'
          fillRule='evenodd'
          d='M75 40c-19.33 0-35 15.67-35 35s15.67 35 35 35 35-15.67 35-35-15.67-35-35-35ZM0 75C0 33.579 33.579 0 75 0s75 33.579 75 75-33.579 75-75 75S0 116.421 0 75Z'
          clipRule='evenodd'
        />
      </mask>
      <g mask='url(#a)'>
        <path
          fill='url(#b)'
          d='M150 75c0 29.778-17.354 55.502-42.5 67.612L75 75H0C0 33.579 33.579 0 75 0s75 33.579 75 75Z'
        />
        <path
          fill='url(#c)'
          d='M75 150c11.644 0 22.668-2.653 32.5-7.388L75 75l-34 66.869C51.206 147.068 62.76 150 75 150Z'
        />
        <path
          fill='url(#d)'
          d='M41 141.869 75 75l-64.377 38.5A75.346 75.346 0 0 0 41 141.869Z'
        />
        <path
          fill='url(#e)'
          d='m75 75-64.377 38.5a74.557 74.557 0 0 1-8.324-20L75 75Z'
        />
        <path
          fill='url(#f)'
          d='M0 75h75L2.299 93.5A75.148 75.148 0 0 1 0 75Z'
        />
      </g>
      <defs>
        <linearGradient
          id='b'
          x1={75}
          x2={75}
          y1={0}
          y2={142.612}
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#55ACEE' />
          <stop
            offset={1}
            stopColor='#1A669F'
          />
        </linearGradient>
        <linearGradient
          id='c'
          x1={74.25}
          x2={74.25}
          y1={75}
          y2={150}
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#FE917A' />
          <stop
            offset={1}
            stopColor='#CB4C31'
          />
        </linearGradient>
        <linearGradient
          id='d'
          x1={54.5}
          x2={42.811}
          y1={87}
          y2={141.869}
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#EC5' />
          <stop
            offset={1}
            stopColor='#B56E05'
          />
        </linearGradient>
        <linearGradient
          id='e'
          x1={61}
          x2={2}
          y1={80}
          y2={114}
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#3EB290' />
          <stop
            offset={1}
            stopColor='#03956A'
          />
        </linearGradient>
        <linearGradient
          id='f'
          x1={52.5}
          x2={0}
          y1={79.5}
          y2={84}
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#3F60B4' />
          <stop
            offset={1}
            stopColor='#102559'
          />
        </linearGradient>
      </defs>
    </svg>
  );
};

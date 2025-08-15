import * as React from 'react';

export const CVVSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={46}
      height={27}
      fill='none'
    >
      <rect
        width={44.632}
        height={26.013}
        x={0.527}
        y={0.262}
        fill='url(#a)'
        fillOpacity={0.15}
        rx={4.507}
      />
      <rect
        width={43.731}
        height={25.112}
        x={0.978}
        y={0.712}
        stroke='url(#b)'
        strokeOpacity={0.5}
        strokeWidth={0.901}
        rx={4.056}
      />
      <path
        fill='#fff'
        d='M15.616 17.866c-.765 0-1.414-.159-1.947-.476a3.16 3.16 0 0 1-1.233-1.352c-.281-.584-.422-1.28-.422-2.088 0-.807.14-1.5.422-2.076a3.16 3.16 0 0 1 1.233-1.352c.533-.318 1.182-.476 1.947-.476.54 0 1.024.083 1.449.248.425.166.797.408 1.114.725l-.335.714a3.676 3.676 0 0 0-1.028-.66c-.339-.144-.735-.216-1.19-.216-.872 0-1.535.27-1.99.811-.454.54-.681 1.302-.681 2.282s.227 1.745.681 2.293c.455.541 1.118.812 1.99.812.455 0 .851-.069 1.19-.206a3.788 3.788 0 0 0 1.028-.681l.335.724c-.317.31-.689.552-1.114.725a3.968 3.968 0 0 1-1.45.249Zm6.305-.098-3.32-7.625h.962l2.953 6.912h-.335l2.974-6.912h.93l-3.342 7.625h-.822Zm7.552 0-3.32-7.625h.962l2.953 6.912h-.335l2.974-6.912h.93l-3.342 7.625h-.822Z'
      />
      <defs>
        <linearGradient
          id='a'
          x1={0.527}
          x2={44.13}
          y1={0.262}
          y2={28.599}
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#fff' />
          <stop
            offset={1}
            stopColor='#fff'
            stopOpacity={0}
          />
        </linearGradient>
        <linearGradient
          id='b'
          x1={0.527}
          x2={24.782}
          y1={3.764}
          y2={39.938}
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#161966' />
          <stop
            offset={0.484}
            stopColor='#AEB1FF'
          />
          <stop
            offset={1}
            stopColor='#FF97B4'
          />
        </linearGradient>
      </defs>
    </svg>
  );
};

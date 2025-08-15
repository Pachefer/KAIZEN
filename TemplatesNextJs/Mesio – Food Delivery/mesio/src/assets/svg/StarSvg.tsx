import * as React from 'react';

export const StarSvg: React.FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} fill="none">
      <path
        fill="#FFCA40"
        stroke="#FFCA40"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m7.5 1.25 1.931 3.912 4.319.632-3.125 3.044.738 4.3L7.5 11.105l-3.862 2.031.737-4.3L1.25 5.795l4.319-.631L7.5 1.25Z"
      />
    </svg>
  );
};

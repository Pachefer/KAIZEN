import * as React from 'react';

export const ChfSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width={21}
      height={15}
      fill='none'
    >
      <path
        fill='url(#a)'
        d='M0 .5h20.588v14H0z'
      />
      <defs>
        <pattern
          id='a'
          width={1}
          height={1}
          patternContentUnits='objectBoundingBox'
        >
          <use
            xlinkHref='#b'
            transform='matrix(.0909 0 0 .13369 0 -.235)'
          />
        </pattern>
        <image
          xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAIAAAAmzuBxAAAAwklEQVQokVWQvW3DQBSDv0tuCRWaw1MYHsBFsobhUdx5B2+U1KkE3N37YQopUESweAD5CIJF7MjjvbIIuN8BZVIKIDNakzvu/fGoAEhf30TwfEoCdLnIjGlKqIBSRBCxyZLMNAyzBALydsvMiAgPdzezMUbvvV+vP2sGpUjaA/6w9q2AWpMkhI6OZUmoCaU1nc+46/XaxNNJZmWeN8e7u8ww29/H0Bhr05rwZs40yYyPTyR6K/OMu8wSyvJvvjyuufIXLIPJgig7KekAAAAASUVORK5CYII='
          id='b'
          width={11}
          height={11}
          preserveAspectRatio='none'
        />
      </defs>
    </svg>
  );
};

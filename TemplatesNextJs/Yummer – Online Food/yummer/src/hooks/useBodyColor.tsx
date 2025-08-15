'use client';

import {useEffect} from 'react';

export const useBodyColor = (color: string) => {
  useEffect(() => {
    const prevColor = document.body.style.backgroundColor;
    document.body.style.backgroundColor = color;

    return () => {
      document.body.style.backgroundColor = prevColor;
    };
  }, [color]);
};

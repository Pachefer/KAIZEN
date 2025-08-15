'use client';

import React from 'react';

type Props = {
  backgroundColor?: string;
};

export const SafeAreaInsetBottom: React.FC<Props> = ({
  backgroundColor = '#fff',
}) => {
  return (
    <div
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        width: '100%',
        height: 'env(safe-area-inset-bottom)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: backgroundColor,
        zIndex: 1000,
      }}
    />
  );
};

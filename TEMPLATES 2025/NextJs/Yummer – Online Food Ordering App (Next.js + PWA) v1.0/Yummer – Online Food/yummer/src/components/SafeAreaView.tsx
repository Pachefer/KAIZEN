'use client';

import React, {useEffect, useState} from 'react';

import {constants} from '@/constants';

type SafeAreaViewProps = {
  children: React.ReactNode;
  top?: string;
  bottom?: string;
};

export const SafeAreaView: React.FC<SafeAreaViewProps> = ({
  children,
  top,
  bottom,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () =>
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    setIsMobile(check());
  }, []);

  return (
    <div
      style={{
        paddingBottom: bottom || 'env(safe-area-inset-bottom)',
        paddingTop: top || 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        height: '100%',
        width: '100%',
        maxWidth: isMobile ? '100%' : constants.sizes.screenWidth,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        margin: '0 auto',
      }}
    >
      {children}
    </div>
  );
};

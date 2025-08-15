'use client';

import React from 'react';

import {constants} from '@/constants';
import {useIsMobile} from '@/hooks/useIsMobile';

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
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        paddingBottom: bottom || 'env(safe-area-inset-bottom, 0px)',
        paddingTop: top || 'env(safe-area-inset-top, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        minHeight: '100dvh',
        height: '100%',
        width: '100%',
        maxWidth: isMobile ? '100%' : constants.sizes.screenWidth,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        margin: '0 auto',
        overflowX: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

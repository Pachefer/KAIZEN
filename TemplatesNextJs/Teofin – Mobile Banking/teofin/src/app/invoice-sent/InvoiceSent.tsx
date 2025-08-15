'use client';

import React, {useRef, useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

export const InvoiceSent: React.FC = () => {
  const router = useRouter();

  const [buttonHeight, setButtonHeight] = useState<number | null>(null);

  hooks.useThemeColor('#fff');
  hooks.useBodyColor('#fff');

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setButtonHeight(ref.current.clientHeight);
    }
  }, [ref.current]);

  const renderContent = () => {
    return (
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          marginBottom: buttonHeight ? buttonHeight : 0,
        }}
      >
        <img
          src={'/bg/03.png'}
          alt="bg"
          style={{
            position: 'absolute',
            width: '100%',
            height: 'auto',
            zIndex: -1,
            maxWidth: constants.sizes.screenWidth,
            margin: '0 auto',
          }}
        />
        <svg.EmailSent />
        <h2
          style={{
            ...constants.typography.h2,
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          Your invoice <br /> has been sent!
        </h2>
        <p style={{...constants.typography.bodyText, textAlign: 'center'}}>
          Your invoice has been <br /> sent successfully.
        </p>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <div style={{padding: 20}} ref={ref}>
        <components.Button
          title="Done"
          onClickAction={() => {
            router.push(constants.routes.dashboard);
          }}
        />
      </div>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderContent()}
        {renderButton()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};

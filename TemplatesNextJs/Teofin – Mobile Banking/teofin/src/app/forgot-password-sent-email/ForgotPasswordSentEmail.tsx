'use client';

import {useRouter} from 'next/navigation';
import React, {useRef} from 'react';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

export const ForgotPasswordSentEmail: React.FC = () => {
  hooks.useThemeColor('#fff');
  hooks.useBodyColor('#fff');

  const router = useRouter();

  const isMobile = hooks.useIsMobile();

  const buttonRef = useRef<HTMLDivElement>(null);

  const renderBackground = () => {
    return (
      <img
        src={'/bg/03.png'}
        alt="bg"
        style={{
          position: 'absolute',
          width: '100%',
          height: 'auto',
          zIndex: 1,
          maxWidth: isMobile ? '100%' : constants.sizes.screenWidth,
          margin: '0 auto',
          left: 0,
          right: 0,
        }}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        style={{
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          zIndex: 2,
          overflowY: 'auto',
        }}
      >
        <svg.PasswordKeySvg />
        <h2
          style={{
            textAlign: 'center',
            marginBottom: 20,
            ...constants.typography.h2,
          }}
        >
          Your password <br /> has been reset!
        </h2>
        <p
          style={{
            textAlign: 'center',
            maxWidth: 290,
            fontSize: 16,
            color: constants.colors.bodyTextColor,
          }}
        >
          Qui ex aute ipsum duis. Incididunt adipisicing voluptate laborum
        </p>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <div ref={buttonRef} style={{width: '100%', padding: 20, zIndex: 5}}>
        <components.Button
          title="Done"
          onClickAction={() => {
            router.push(constants.routes.signIn);
          }}
        />
      </div>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderBackground()}
        {renderContent()}
        {renderButton()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};

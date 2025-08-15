'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

export const SignUpAccountCreated: React.FC = () => {
  const router = useRouter();

  hooks.useThemeColor('#fff');
  hooks.useBodyColor('#fff');

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
          padding: 20,
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
        <svg.PersonalBankingSvg />
        <h2 style={{...constants.typography.h2, marginBottom: 20}}>
          Account created!
        </h2>
        <p style={{...constants.typography.bodyText, textAlign: 'center'}}>
          Your account had beed created <br /> successfully.
        </p>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <div style={{padding: 20}}>
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
        {renderContent()}
        {renderButton()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};

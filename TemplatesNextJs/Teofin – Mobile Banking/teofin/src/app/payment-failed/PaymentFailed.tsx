'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

export const PaymentFailed: React.FC = () => {
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
          overflowY: 'auto',
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
        <svg.PaymentFailed />
        <h2
          style={{
            ...constants.typography.h2,
            marginBottom: 20,
            color: constants.colors.linkColor,
          }}
        >
          Oops!
        </h2>
        <p style={{...constants.typography.bodyText, textAlign: 'center'}}>
          Something went wrong. Please try <br /> again or contact the support
          team.
        </p>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <div style={{padding: 20}}>
        <components.Button
          title="Back to dashboard"
          onClickAction={() => {
            router.push(constants.routes.dashboard);
          }}
          colorScheme="secondary"
          containerStyle={{marginBottom: 14}}
        />
        <components.Button
          title="Try Again"
          onClickAction={() => {
            router.back();
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

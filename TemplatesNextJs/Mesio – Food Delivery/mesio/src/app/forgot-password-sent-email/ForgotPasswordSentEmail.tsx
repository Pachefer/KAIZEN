'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

export const ForgotPasswordSentEmail: React.FC = () => {
  const router = useRouter();

  const renderContent = () => {
    return (
      <main
        style={{
          padding: 20,
          ...constants.flex.column,
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <div
          style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 36}}
        >
          <svg.DoneSvg />
        </div>
        <h2
          style={{
            ...constants.typography.h2,
            textTransform: 'capitalize',
            marginBottom: 10,
            marginLeft: 'auto',
            marginRight: 'auto',
            color: constants.colors.seaGreenColor,
          }}
        >
          Password Successfully Reset!
        </h2>
        <p
          style={{
            maxWidth: 274,
            textAlign: 'center',
            fontSize: 16,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 20,
            color: constants.colors.textColor,
          }}
        >
          You can now log in with your new password.
        </p>
        <components.Button
          label="Take me to sign in"
          onClickAction={() => router.replace(constants.routes.signIn)}
        />
      </main>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>{renderContent()}</components.SafeAreaView>
    </components.MotionWrapper>
  );
};

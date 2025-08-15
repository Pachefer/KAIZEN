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
          ...constants.flex.flexColumn,
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <div
          style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 40}}
        >
          <svg.KeySvg />
        </div>
        <h2
          style={{
            ...constants.typography.h2,
            textTransform: 'capitalize',
            marginBottom: 16,
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: 253,
            textAlign: 'center',
            ...constants.typography.h2,
          }}
        >
          Your password has been reset!
        </h2>
        <p
          style={{
            maxWidth: 320,
            textAlign: 'center',
            fontSize: 16,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 50,
          }}
        >
          Qui ex aute ipsum duis. Incididunt adipisicing voluptate laborum
        </p>
        <components.Button
          label="done"
          onClickAction={() => {
            router.push(constants.routes.signIn);
          }}
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

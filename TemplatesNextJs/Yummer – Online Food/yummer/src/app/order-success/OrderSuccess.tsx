'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {constants} from '@/constants';
import {components} from '@/components';

export const OrderSuccess: React.FC = () => {
  const router = useRouter();

  const renderContent = () => {
    return (
      <main
        style={{
          padding: 20,
          ...constants.flex.columnCenterCenter,
          height: '100%',
          width: '100%',
        }}
      >
        <img
          src="/elements/03.png"
          alt="Order Success"
          style={{
            maxWidth: 234,
            width: '80%',
            height: 'auto',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 52,
          }}
        />
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
          Thank you for your order!
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
          You will receive an email confirmation shortly.
        </p>
        <components.Button
          label="Done"
          onClickAction={() => {
            router.push(constants.routes.home);
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

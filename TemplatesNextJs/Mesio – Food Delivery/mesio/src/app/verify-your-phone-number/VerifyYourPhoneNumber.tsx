'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const VerifyYourPhoneNumber: React.FC = () => {
  const router = useRouter();
  const {form, handleChangeField} = hooks.useFormField({phoneNumber: ''});

  const renderHeader = () => {
    return (
      <components.Header showGoBack={true} title="Verify Your Phone Number" />
    );
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: '10%',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            ...constants.typography.h2,
            color: constants.colors.seaGreenColor,
            marginBottom: 10,
          }}
        >
          Verify
        </h2>
        <p
          style={{
            maxWidth: 250,
            textAlign: 'center',
            margin: '0 auto',
            marginBottom: 27,
            color: constants.colors.textColor,
          }}
        >
          We have sent you an SMS with a code to number +17 0123456789
        </p>
        <components.Input
          placeholder="+190 111 222 333"
          containerStyle={{marginBottom: 20}}
          value={form.phoneNumber}
          onClickAction={() => handleChangeField('phoneNumber', 'phone number')}
        />
        <components.Button
          label="Confirm"
          onClickAction={() => {
            router.push(constants.routes.confirmationCode);
          }}
        />
      </main>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderHeader()}
        {renderContent()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};

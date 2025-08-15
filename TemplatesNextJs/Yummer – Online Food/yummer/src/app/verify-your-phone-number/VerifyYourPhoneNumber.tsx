'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const VerifyYourPhoneNumber: React.FC = () => {
  hooks.useThemeColor('#EEF3FC');
  hooks.useBodyColor('#EEF3FC');

  const router = useRouter();
  const {form, handleChangeField} = hooks.useFormField({phoneNumber: ''});

  const handleSignIn = () => {
    router.push(constants.routes.confirmationCode);
  };

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Verify Your Number" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 28,
        }}
      >
        <p
          style={{
            maxWidth: 319,
            marginBottom: 30,
          }}
        >
          We have sent you an SMS with a code to number +17 0123456789.
        </p>
        <components.Input
          label="phone number"
          placeholder="+17123456789"
          containerStyle={{marginBottom: 30}}
          value={form.phoneNumber}
          onClickAction={() => handleChangeField('phoneNumber', 'phone number')}
        />
        <components.Button label="Confirm" onClickAction={handleSignIn} />
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

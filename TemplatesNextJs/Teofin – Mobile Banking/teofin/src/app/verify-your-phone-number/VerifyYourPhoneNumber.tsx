'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const VerifyYourPhoneNumber: React.FC = () => {
  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const router = useRouter();
  const {form, handleChangeField} = hooks.useFormField({
    phoneNumber: '',
  });

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Verify  Number" />;
  };

  const renderContent = () => {
    return (
      <main style={{marginTop: constants.sizes.headerHeight + 10, padding: 20}}>
        <p style={{...constants.typography.bodyText, marginBottom: 20}}>
          We have sent you an SMS with a code to number +17 0123456789.
        </p>
        <components.InputField
          value={form.phoneNumber}
          placeholder="••••••••"
          containerStyle={{marginBottom: 14}}
          inputType="password"
          onClickAction={() => handleChangeField('phoneNumber', 'Phone Number')}
        />
        <components.Button
          title="Confirm"
          containerStyle={{marginBottom: 30}}
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

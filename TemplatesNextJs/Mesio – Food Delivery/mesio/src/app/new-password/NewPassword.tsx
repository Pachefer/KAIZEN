'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const NewPassword: React.FC = () => {
  const router = useRouter();

  const {form, handleChangeField} = hooks.useFormField({
    newPassword: '',
  });

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Reset Password" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          padding: 20,
          width: '100%',
        }}
      >
        <p
          style={{
            marginBottom: 25,
            maxWidth: 302,
            textAlign: 'center',
            lineHeight: 1.5,
            marginLeft: 'auto',
            marginRight: 'auto',
            color: constants.colors.textColor,
          }}
        >
          Please enter your new password.
        </p>
        <components.Input
          placeholder="New Password"
          value={form.newPassword}
          onClickAction={() => handleChangeField('newPassword', 'New Password')}
          containerStyle={{marginBottom: 20}}
        />
        <components.Button
          label="Reset Password"
          onClickAction={() =>
            router.push(constants.routes.forgotPasswordSentEmail)
          }
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

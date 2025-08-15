'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const ForgotPassword: React.FC = () => {
  const router = useRouter();

  const {form, handleChangeField} = hooks.useFormField({email: ''});

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Forgot Password" />;
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
            lineHeight: 1.5,
            color: constants.colors.textColor,
          }}
        >
          Please enter your email address. You will receive a link to create a
          new password via email.
        </p>
        <components.Input
          placeholder="Email Address"
          containerStyle={{marginBottom: 20}}
          value={form.email}
          onClickAction={() => handleChangeField('email', 'Email Address')}
        />
        <components.Button
          label="Send"
          onClickAction={() => router.push(constants.routes.newPassword)}
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

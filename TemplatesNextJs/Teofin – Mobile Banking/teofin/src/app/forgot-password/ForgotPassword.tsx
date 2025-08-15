'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const ForgotPassword: React.FC = () => {
  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
  });

  const handleChangeField = (field: keyof typeof form, label: string) => {
    const result = window.prompt(`Enter your ${label}`, form[field]);
    if (result !== null) {
      setForm((prev) => ({...prev, [field]: result}));
    }
  };

  const renderHeader = () => {
    return <components.Header title="Forgot password" showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          padding: 20,
          marginTop: constants.sizes.headerHeight,
        }}
      >
        <p
          style={{
            marginBottom: 20,
            fontSize: 16,
            color: constants.colors.bodyTextColor,
          }}
        >
          Please enter your email address. You will receive a link to create a
          new password via email.
        </p>
        <components.InputField
          placeholder="cristinawolf@mail.com"
          containerStyle={{marginBottom: 14}}
          value={form.email}
          onClickAction={() => handleChangeField('email', 'Email')}
        />
        <components.Button
          title="Send"
          onClickAction={() => {
            router.push(constants.routes.newPassword);
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

'use client';

import {useRouter} from 'next/navigation';

import React, {useState} from 'react';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const NewPassword: React.FC = () => {
  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const router = useRouter();

  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangeField = (field: keyof typeof form, label: string) => {
    const result = window.prompt(`Enter your ${label}`, form[field]);
    if (result !== null) {
      setForm((prev) => ({...prev, [field]: result}));
    }
  };

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title="New password"
        containerStyle={{backgroundColor: constants.colors.antiFlashWhite}}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        style={{
          padding: 20,
          marginTop: constants.sizes.headerHeight,
          overflowY: 'auto',
        }}
      >
        <p
          style={{
            marginBottom: 20,
            fontSize: 16,
            color: constants.colors.bodyTextColor,
          }}
        >
          Enter new password and confirm.
        </p>
        <components.InputField
          inputType="password"
          placeholder="New Password"
          containerStyle={{marginBottom: 10}}
          onClickAction={() => handleChangeField('newPassword', 'new password')}
          value={form.newPassword}
        />
        <components.InputField
          inputType="password"
          placeholder="Confirm Password"
          containerStyle={{marginBottom: 14}}
          onClickAction={() =>
            handleChangeField('confirmPassword', 'confirm password')
          }
          value={form.confirmPassword}
        />
        <components.Button
          title="Change Password"
          onClickAction={() => {
            router.push(constants.routes.forgotPasswordSentEmail);
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

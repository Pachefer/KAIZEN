'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const ChangePinCode: React.FC = () => {
  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const router = useRouter();

  const [form, setForm] = useState({
    currentPin: '',
    newPin: '',
    confirmNewPin: '',
  });

  const handleChangeField = (field: keyof typeof form, label: string) => {
    const result = window.prompt(`Enter your ${label}`, form[field]);
    if (result !== null) {
      setForm((prev) => ({...prev, [field]: result}));
    }
  };

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Change PIN code" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          padding: 20,
          marginTop: constants.sizes.headerHeight,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            marginBottom: 14,
          }}
        >
          <components.InputField
            placeholder="Current PIN code"
            value={form.currentPin}
            inputType="password"
            onClickAction={() =>
              handleChangeField('currentPin', 'current PIN code')
            }
          />
          <components.InputField
            placeholder="New PIN code"
            value={form.newPin}
            inputType="password"
            onClickAction={() => handleChangeField('newPin', 'new PIN code')}
          />
          <components.InputField
            placeholder="Confirm new PIN code"
            value={form.confirmNewPin}
            inputType="password"
            onClickAction={() =>
              handleChangeField('confirmNewPin', 'confirm new PIN code')
            }
          />
        </div>
        <components.Button
          title="Save"
          onClickAction={() => {
            router.back();
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

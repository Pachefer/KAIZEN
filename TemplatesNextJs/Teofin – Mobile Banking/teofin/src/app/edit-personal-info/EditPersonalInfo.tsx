'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

export const EditPersonalInfo: React.FC = () => {
  const router = useRouter();

  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const [form, setForm] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    birthDate: '',
    address: '',
  });

  const handleChangeField = (field: keyof typeof form, label: string) => {
    const result = window.prompt(`Enter your ${label}`, form[field]);
    if (result !== null) {
      setForm((prev) => ({...prev, [field]: result}));
    }
  };

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Edit personal info" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          padding: 20,
          marginTop: constants.sizes.headerHeight,
        }}
      >
        {/* User photo */}
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto',
            overflow: 'hidden',
            background: 'rgba(27, 29, 77, 0.5)',
            marginBottom: 20,
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={() => {
            alert('User photo change functionality is not implemented yet.');
          }}
        >
          <img
            alt="user"
            src="https://george-fx.github.io/teofin-data/photos/01.jpg"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              borderRadius: '50%',
              zIndex: -1,
            }}
          />
          <svg.CameraSvg />
        </div>

        {/* Inputs */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            marginBottom: 14,
          }}
        >
          <components.InputField
            placeholder="Cristina Wolf"
            onClickAction={() => handleChangeField('name', 'name')}
            value={form.name}
          />
          <components.InputField
            placeholder="+171 123 456 7890"
            onClickAction={() =>
              handleChangeField('phoneNumber', 'phone number')
            }
            value={form.phoneNumber}
          />
          <components.InputField
            placeholder="Enter your email"
            onClickAction={() => handleChangeField('email', 'email')}
            value={form.email}
          />
          <components.InputField
            placeholder="MM/DD/YYYY"
            onClickAction={() => handleChangeField('birthDate', 'birth date')}
            value={form.birthDate}
          />
          <components.InputField
            placeholder="Enter your address"
            onClickAction={() => handleChangeField('address', 'address')}
            value={form.address}
          />
        </section>

        {/* Button */}
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

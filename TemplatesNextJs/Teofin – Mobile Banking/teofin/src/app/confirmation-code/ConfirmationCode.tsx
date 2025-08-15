'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

import {constants} from '@/constants';
import {components} from '@/components';
import {hooks} from '@/hooks';

export const ConfirmationCode: React.FC = () => {
  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const router = useRouter();

  const [otpCode, setOtpCode] = useState(['', '', '', '', '']);

  const handleCodeChange = (index: number, value: string) => {
    const result = window.prompt('Enter Code', value);
    if (result !== null) {
      const chars = result.split('');
      const newOtpCode = [...otpCode];
      for (let i = 0; i < chars.length && index + i < otpCode.length; i++) {
        newOtpCode[index + i] = chars[i];
      }
      setOtpCode(newOtpCode);
    }
  };

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Verify  Number" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        <p style={{marginBottom: 30, ...constants.typography.bodyText}}>
          Enter your OTP code here.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 6,
            marginBottom: 30,
          }}
        >
          {otpCode.map((code, index) => {
            return (
              <button
                key={index}
                onClick={() => handleCodeChange(index, code)}
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  textAlign: 'center',
                  fontSize: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  aspectRatio: '1',
                  backgroundColor: constants.colors.whiteColor,
                  color: constants.colors.mainDarkColor,
                }}
              >
                {code || '_'}
              </button>
            );
          })}
        </div>
        <span
          style={{
            marginBottom: 30,
            display: 'block',
            ...constants.typography.bodyText,
          }}
        >
          Didn’t receive the OTP?{' '}
          <span
            onClick={() => {
              alert('Resend OTP logic goes here');
            }}
            style={{
              color: constants.colors.linkColor,
              cursor: 'pointer',
            }}
          >
            Resend.
          </span>
        </span>
        <components.Button
          title="Confirm"
          onClickAction={() => {
            router.push(constants.routes.signUpAccountCreated);
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

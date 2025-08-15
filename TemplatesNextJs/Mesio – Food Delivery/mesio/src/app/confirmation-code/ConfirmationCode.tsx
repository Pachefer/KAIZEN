'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

import {constants} from '@/constants';
import {components} from '@/components';

export const ConfirmationCode: React.FC = () => {
  const router = useRouter();

  const [otpCode, setOtpCode] = useState(['', '', '', '', '']);

  const handleCodeChange = (index: number, value: string) => {
    const result = window.prompt('Enter code', value);
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
    return (
      <components.Header showGoBack={true} title="Verify your phone number" />
    );
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
        <h2
          style={{
            color: constants.colors.seaGreenColor,
            fontSize: 22,
            marginBottom: 24,
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          OTP Verification
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 9,
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
                  borderRadius: '50%',
                  padding: '13px 20px',
                  textAlign: 'center',
                  fontSize: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  aspectRatio: '1',
                  border: '1px solid #2e2e2eff',
                  color: constants.colors.mainDarkColor,
                }}
              >
                {code || '_'}
              </button>
            );
          })}
        </div>
        <span style={{color: constants.colors.textColor}}>
          Didn’t receive the OTP?{' '}
          <span
            onClick={() => {
              alert('Resend OTP logic goes here');
            }}
            style={{
              color: constants.colors.redColor,
              cursor: 'pointer',
            }}
          >
            Resend.
          </span>
        </span>
        <components.Button
          label="Confirm"
          containerStyle={{marginTop: 20}}
          onClickAction={() => {
            router.push(constants.routes.accountCreated);
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

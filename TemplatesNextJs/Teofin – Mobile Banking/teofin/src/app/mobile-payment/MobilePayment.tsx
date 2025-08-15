'use client';

import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

import React, {useState} from 'react';

export const MobilePayment: React.FC = () => {
  const router = useRouter();

  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const [form, setForm] = useState({
    phone: '',
  });

  const [amount, setAmount] = useState(10);

  const amountParts = amount.toFixed(2).split('.');

  const handleChangeField = (field: keyof typeof form, label: string) => {
    const result = window.prompt(`Enter your ${label}`, form[field]);
    if (result !== null) {
      setForm((prev) => ({...prev, [field]: result}));
    }
  };

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Mobile payment" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          padding: 20,
          marginTop: constants.sizes.headerHeight,
          overflowY: 'auto',
          height: '100%',
        }}
      >
        <components.InputField
          placeholder="+1234567890"
          value={form.phone}
          containerStyle={{marginBottom: 14}}
          onClickAction={() => handleChangeField('phone', 'phone number')}
        />
        <span
          style={{
            fontSize: 12,
            marginBottom: 6,
            display: 'block',
            color: constants.colors.bodyTextColor,
          }}
        >
          Your balance: 4 863.27 USD
        </span>
        <div
          style={{
            display: 'flex',
            gap: 14,
            alignItems: 'center',
          }}
        >
          <button
            style={{
              backgroundColor: constants.colors.whiteColor,
              borderRadius: 10,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 12,
              paddingBottom: 12,
              alignSelf: 'flex-start',
            }}
            onClick={() => {
              const result = window.prompt('Enter amount', amount.toString());
              if (result !== null) {
                const parsedAmount = parseFloat(result);
                if (!isNaN(parsedAmount) && parsedAmount > 0) {
                  setAmount(parsedAmount);
                }
              }
            }}
          >
            <span
              style={{
                fontSize: 28,
                fontWeight: 500,
              }}
            >
              ${amountParts[0]}.
              <span style={{fontSize: 16, fontWeight: 500}}>
                {amountParts[1]}
              </span>
            </span>
          </button>
          <span
            style={{
              fontSize: 12,
              color: constants.colors.bodyTextColor,
            }}
          >
            No fees
          </span>
        </div>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <div
        style={{
          padding: 20,
        }}
      >
        <components.Button
          title="Confirm"
          onClickAction={() => {
            router.replace(constants.routes.paymentSuccess);
          }}
        />
      </div>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderHeader()}
        {renderContent()}
        {renderButton()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};

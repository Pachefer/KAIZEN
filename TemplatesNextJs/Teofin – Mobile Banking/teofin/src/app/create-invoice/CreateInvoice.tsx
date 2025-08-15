'use client';

import {useRouter} from 'next/navigation';
import React, {useRef, useEffect, useState} from 'react';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const CreateInvoice: React.FC = () => {
  const router = useRouter();

  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const ref = useRef<HTMLDivElement>(null);

  const [buttonHeight, setButtonHeight] = useState(0);
  const [currency, setCurrency] = useState('USD');

  const {form, handleChangeField} = hooks.useFormField({
    companyName: '',
    country: '',
    companyEmail: '',
    amount: '',
    comment: '',
  });

  useEffect(() => {
    if (ref.current) {
      setButtonHeight(ref.current.clientHeight);
    }
  }, [ref]);

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Create invoice" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          marginBottom: buttonHeight,
          padding: 20,
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <components.InputField
          value={form.companyName}
          placeholder="Company Name"
          containerStyle={{marginBottom: 14}}
          onClickAction={() => handleChangeField('companyName', 'Company Name')}
        />
        <components.InputField
          value={form.country}
          placeholder="Country"
          containerStyle={{marginBottom: 14}}
          onClickAction={() => handleChangeField('country', 'Country')}
        />
        <components.InputField
          value={form.companyEmail}
          placeholder="Company Email"
          containerStyle={{marginBottom: 14}}
          onClickAction={() =>
            handleChangeField('companyEmail', 'Company Email')
          }
        />
        <components.InputField
          value={form.amount}
          placeholder="Amount"
          containerStyle={{marginBottom: 14}}
          onClickAction={() => handleChangeField('amount', 'Amount')}
        />
        <div style={{marginBottom: 14}}>
          <span
            style={{
              fontSize: 12,
              color: constants.colors.bodyTextColor,
              marginBottom: 6,
              display: 'block',
            }}
          >
            Choose currency:
          </span>
          <ul style={{display: 'flex', gap: 14}}>
            {['USD', 'EUR'].map((curr) => (
              <li
                key={curr}
                style={{
                  padding: '8px 20px',
                  backgroundColor:
                    currency === curr
                      ? constants.colors.mainDarkColor
                      : constants.colors.whiteColor,
                  borderRadius: 10,
                  cursor: 'pointer',
                }}
                onClick={() => setCurrency(curr)}
              >
                <h5
                  style={{
                    ...constants.typography.h5,
                    color:
                      currency === curr
                        ? constants.colors.whiteColor
                        : constants.colors.mainDarkColor,
                  }}
                >
                  {curr}
                </h5>
              </li>
            ))}
          </ul>
        </div>
        <components.InputField
          value={form.comment}
          placeholder="Goods or services you provided"
          containerStyle={{
            marginBottom: 14,
            height: 120,
            alignItems: 'flex-start',
            paddingTop: 12,
          }}
          onClickAction={() => handleChangeField('comment', 'Comment')}
        />
        <p
          style={{
            fontSize: 12,
            color: constants.colors.bodyTextColor,
          }}
        >
          Bank fee is charged from the payer.
        </p>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <div
        ref={ref}
        style={{
          padding: 20,
        }}
      >
        <components.Button
          title="Send invoice"
          onClickAction={() => {
            router.push(constants.routes.invoiceSent);
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

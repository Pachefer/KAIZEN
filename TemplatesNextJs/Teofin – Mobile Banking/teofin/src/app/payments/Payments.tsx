'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

const payments = [
  {
    id: '1',
    title: 'Money transfer',
    icon: '/icons/09.png',
    link: constants.routes.fundTransfer,
  },
  {
    id: '2',
    title: 'Mobile payment',
    icon: '/icons/10.png',
    link: constants.routes.mobilePayment,
  },
  {
    id: '3',
    title: 'IBAN payment',
    icon: '/icons/11.png',
    link: constants.routes.ibanPayment,
  },
  {
    id: '4',
    title: 'Utility bills',
    icon: '/icons/12.png',
    link: null,
  },
  {
    id: '5',
    title: 'Transport',
    icon: '/icons/13.png',
    link: null,
  },
  {
    id: '6',
    title: 'Insurance',
    icon: '/icons/14.png',
    link: null,
  },
  {
    id: '7',
    title: 'Penalties',
    icon: '/icons/15.png',
    link: null,
  },
  {
    id: '8',
    title: 'Charity',
    icon: '/icons/16.png',
    link: null,
  },
];

export const Payments: React.FC = () => {
  const router = useRouter();

  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Payments" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          overflowY: 'auto',
        }}
      >
        <ul style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {payments.map((payment) => {
            return (
              <li key={payment.id}>
                <button
                  style={{
                    backgroundColor: constants.colors.whiteColor,
                    borderRadius: 10,
                    padding: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    width: '100%',
                  }}
                  onClick={() => payment.link && router.push(payment.link)}
                >
                  <img
                    src={payment.icon}
                    alt={payment.title}
                    style={{width: 40, height: 40}}
                  />
                  <h6 style={{...constants.typography.h6}}>{payment.title}</h6>
                </button>
              </li>
            );
          })}
        </ul>
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

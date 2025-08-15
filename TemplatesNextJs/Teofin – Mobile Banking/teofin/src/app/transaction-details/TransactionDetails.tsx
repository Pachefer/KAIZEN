'use client';

import React from 'react';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

import type {TransactionType} from '@/types';

type Props = {
  txId: string;
};

export const TransactionDetails: React.FC<Props> = ({txId}) => {
  hooks.useThemeColor('#fff');
  hooks.useBodyColor('#fff');

  const transaction: TransactionType | undefined = constants.transactions.find(
    (tx) => tx.id === Number(txId)
  );

  const transactionDetails = [
    {label: 'Sent to', value: transaction?.to || 'Hillary Holmes'},
    {label: 'Card', value: '**** 4253'},
    {
      label: 'Amount',
      value: transaction?.amount ? `$ ${transaction.amount}` : '$ 263.57',
    },
    {label: 'Fee', value: '1.8 USD'},
    {label: 'Residual balance', value: '4 863.27 USD'},
  ];

  const date = new Date(transaction?.date || '2022-09-10T11:34:00Z');

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const formatted = date
    .toLocaleString('en-US', options)
    .replace(',', '')
    .replace(/(\d{4}) (.*)/, '$1 at $2');

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        containerStyle={{backgroundColor: constants.colors.whiteColor}}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          height: '100%',
          overflowY: 'auto',
          marginTop: constants.sizes.headerHeight,
        }}
      >
        <svg.RepeatSvg />
        <span
          style={{
            fontSize: 12,
            marginTop: 30,
            marginBottom: 10,
            color: constants.colors.bodyTextColor,
          }}
        >
          {formatted}
        </span>
        <div style={{fontSize: 28, fontWeight: 700, marginBottom: 10}}>
          {transaction?.amount ? `$ ${transaction?.amount}` : '$ 263'}
        </div>
        <span style={{marginBottom: 9}}>
          Sent to {transaction?.name || 'Hillary Holmes'}
        </span>
        <svg.DetailsSuccessSvg />

        <div
          style={{
            width: '100%',
            borderTop: '1px solid #e0e0e0',
            marginTop: 30,
          }}
        >
          {transactionDetails.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '17px 0',
                  borderBottom: '1px solid #e0e0e0',
                  marginLeft: 20,
                  marginRight: 20,
                }}
              >
                <span>{item.label}</span>
                <h5 style={{...constants.typography.h5}}>{item.value}</h5>
              </div>
            );
          })}
        </div>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <section
        style={{
          padding: 20,
        }}
      >
        <components.Button
          title="Download PDF"
          onClickAction={() => {
            alert('Download PDF clicked');
          }}
        />
      </section>
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

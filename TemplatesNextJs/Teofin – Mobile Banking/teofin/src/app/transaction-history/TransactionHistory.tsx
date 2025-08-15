'use client';

import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

import type {TransactionType} from '@/types';

import React, {useState} from 'react';

export const TransactionHistory: React.FC = () => {
  const router = useRouter();

  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const [value, setValue] = useState<string>('');

  const handleSetValue = () => {
    const result = window.prompt('Enter search term', value);
    if (result !== null) {
      setValue(result);
    }
  };

  const filtered = constants.transactions.filter(
    (tx) =>
      !value ||
      tx.name.toLowerCase().includes(value.toLowerCase()) ||
      tx?.category?.toLowerCase().includes(value.toLowerCase())
  );

  type Transaction = (typeof constants.transactions)[number];
  const grouped = filtered.reduce<Record<string, Transaction[]>>((acc, tx) => {
    if (!tx.date) return acc; // skip items without a date
    if (!acc[tx.date]) acc[tx.date] = [];
    acc[tx.date].push(tx);
    return acc;
  }, {});

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Transaction history" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          overflowY: 'auto',
          marginTop: constants.sizes.headerHeight,
          paddingTop: 20,
        }}
      >
        {/* Search */}
        <section style={{marginBottom: 14}}>
          <components.InputField
            placeholder="Search..."
            value={value}
            onClickAction={handleSetValue}
          />
        </section>
        {/* transactions */}
        {Object.entries(grouped)
          .filter(([, txs]) => txs.length > 0)
          .map(([date, txs]) => (
            <section key={date}>
              <span
                style={{
                  fontSize: 12,
                  marginBottom: 6,
                  display: 'block',
                  color: constants.colors.bodyTextColor,
                }}
              >
                {date}
              </span>
              <ul>
                {txs.map((tx: TransactionType, idx, array) => {
                  const isLast = idx === array.length - 1;
                  return (
                    <li key={idx}>
                      <div
                        style={{
                          backgroundColor: constants.colors.whiteColor,
                          width: '100%',
                          borderRadius: 10,
                          padding: 10,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          marginBottom: isLast ? 14 : 6,
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          router.push(
                            `${constants.routes.transactionDetails}?txId=${tx.id}`
                          );
                        }}
                      >
                        <img
                          src={tx.icon}
                          alt={tx.name}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                          }}
                        />
                        <div style={{marginRight: 'auto'}}>
                          <h6
                            style={{
                              ...constants.typography.h6,
                              lineHeight: 1.2,
                            }}
                          >
                            {tx.name}
                          </h6>
                          <span
                            style={{
                              fontSize: 12,
                              lineHeight: 1.2,
                              color: constants.colors.bodyTextColor,
                            }}
                          >
                            {tx.category}
                          </span>
                        </div>
                        <h5
                          style={{
                            ...constants.typography.h6,
                            color:
                              tx.direction === 'out'
                                ? constants.colors.mainDarkColor
                                : '#3EB290',
                          }}
                        >
                          {tx.direction === 'out' ? '-' : '+'} {tx.amount}
                        </h5>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
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

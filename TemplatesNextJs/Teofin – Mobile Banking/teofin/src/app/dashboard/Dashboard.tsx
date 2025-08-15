'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {items} from '@/items';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

import type {CardType} from '@/types';

const actions = [
  {
    id: 1,
    title: 'Top-Up<br>Payment',
    icon: svg.TopUpSvg,
    link: constants.routes.topUpPayment,
  },
  {
    id: 2,
    title: 'Mobile<br>Payment',
    icon: svg.MobilePaymentSvg,
    link: constants.routes.mobilePayment,
  },
  {
    id: 3,
    title: 'Money<br>Transfer',
    icon: svg.MoneyTransferSvg,
    link: constants.routes.fundTransfer,
  },
  {
    id: 4,
    title: 'Make<br>Payment',
    icon: svg.MakeAPaymentSvg,
    link: constants.routes.payments,
  },
];

import React from 'react';

export const Dashboard: React.FC = () => {
  const router = useRouter();

  const isMobile = hooks.useIsMobile();

  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const renderHeader = () => {
    return (
      <components.Header
        showUser={true}
        showBorder={true}
        showCurrency={true}
        showCreditCard={true}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          height: '100%',
          padding: 20,
          marginTop: constants.sizes.headerHeight,
          marginBottom: constants.sizes.tabBarHeight,
        }}
      >
        {/* Actions */}
        <section>
          <ul
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20,
              paddingBottom: 15,
              borderBottom: '1px solid #ced6e1',
              marginBottom: 30,
            }}
          >
            {actions.map((action) => {
              return (
                <li key={action.id}>
                  <Link
                    href={action.link}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    type="button"
                  >
                    {action.icon ? <action.icon /> : null}
                    <span
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        marginTop: 6,
                        fontSize: 10,
                        color: constants.colors.bodyTextColor,
                      }}
                      dangerouslySetInnerHTML={{__html: action.title}}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Cards */}
        <section style={{marginBottom: 30}}>
          <span
            style={{
              fontSize: 12,
              display: 'block',
              marginBottom: 6,
              color: constants.colors.bodyTextColor,
            }}
          >
            Cards
          </span>
          <div
            style={{
              display: 'flex',
              gap: 6,
              flexDirection: 'column',
            }}
          >
            {constants.cards.map((card: CardType) => {
              return <items.CardItem key={card.id} card={card} />;
            })}
          </div>
        </section>

        {/* Transactions */}
        <section>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <h4 style={{...constants.typography.h4}}>Latest transactions</h4>
            <button
              style={{background: 'none', border: 'none', cursor: 'pointer'}}
              onClick={() => {
                router.push(constants.routes.transactionHistory);
              }}
              type="button"
            >
              <span
                style={{color: constants.colors.linkColor, fontWeight: 500}}
              >
                View all
              </span>
            </button>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {constants.transactions.map((transaction, index) => {
              return (
                <items.TransactionItem key={index} transaction={transaction} />
              );
            })}
          </div>
        </section>
      </main>
    );
  };

  const renderBottomBar = () => {
    return <components.BottomTabBar />;
  };

  const renderHomeIndicatorBG = () => {
    return (
      <div
        style={{
          backgroundColor: constants.colors.whiteColor,
          height: 'env(safe-area-inset-bottom, 0px)',
          width: isMobile ? '100%' : constants.sizes.screenWidth,
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      ></div>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderHeader()}
        {renderContent()}
        {renderBottomBar()}
      </components.SafeAreaView>
      {renderHomeIndicatorBG()}
    </components.MotionWrapper>
  );
};

'use client';

import React, {useState} from 'react';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

export const TopUpPayment: React.FC = () => {
  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const cards = [
    {
      id: 1,
      type: 'Visa',
      number: '**** **** **** 1945',
      balance: '2 648.11 USD',
    },
    {
      id: 2,
      type: 'Visa',
      number: '**** **** **** 7895',
      balance: '4 863.27 USD',
    },
  ];

  const otherMethods = [
    {
      title: 'Card from another bank',
      icon: '/icons/17.png',
    },
    {
      title: 'SWIFT',
      icon: '/icons/18.png',
    },
    {
      title: 'SEPA',
      icon: '/icons/19.png',
    },
    {
      title: 'Western Union',
      icon: '/icons/20.png',
    },
    {
      title: 'Paypal',
      icon: '/icons/21.png',
    },
    {
      title: 'Payoneer',
      icon: '/icons/22.png',
    },
  ];

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Top-Up payment" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          paddingBottom: 20,
          paddingLeft: 20,
          paddingRight: 20,
          overflowY: 'auto',
          marginTop: constants.sizes.headerHeight,
          paddingTop: 20,
        }}
      >
        {/* Cards */}
        <section style={{marginBottom: 14}}>
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
            {cards.map((card) => {
              const selected = selectedCard === card.id;
              return (
                <div
                  key={card.id}
                  style={{
                    padding: 12,
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    border:
                      '1px solid ' +
                      (selected
                        ? 'rgba(0,0,0,0.4)'
                        : constants.colors.whiteColor),
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedCard(card.id);
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      background:
                        'linear-gradient(110.75deg, #c285ab 0%, #7aa1ce 49.34%, #1b1f6a 100.78%)',
                      width: 72,
                      height: 46,
                      borderRadius: 5,
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                    }}
                  >
                    <span
                      style={{
                        color: constants.colors.whiteColor,
                        fontSize: 12,
                        margin: 10,
                        marginBottom: 8,
                        fontWeight: 600,
                      }}
                    >
                      teofin
                    </span>
                  </div>
                  {/* Details */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: constants.colors.bodyTextColor,
                      }}
                    >
                      {card.number}
                    </span>
                    <h6 style={{...constants.typography.h6}}>{card.balance}</h6>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Entrepreneur accounts */}
        <section style={{marginBottom: 14}}>
          <span style={{display: 'block', marginBottom: 6, fontSize: 12}}>
            Entrepreneur accounts
          </span>
          <div
            style={{
              padding: 12,
              backgroundColor: constants.colors.whiteColor,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              width: '100%',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() => {
              alert('Selected method: Entrepreneur account');
            }}
          >
            <svg.EntrAccSvg />
            <div>
              <span
                style={{fontSize: 12, color: constants.colors.bodyTextColor}}
              >
                US**********************4571
              </span>
              <h6 style={{...constants.typography.h6}}>39 863.62 USD</h6>
            </div>
          </div>
        </section>

        {/* Other methods */}
        <section>
          <span
            style={{
              fontSize: 12,
              display: 'block',
              marginBottom: 6,
              color: constants.colors.bodyTextColor,
            }}
          >
            Other methods
          </span>
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {otherMethods.map((method, index) => {
              return (
                <li key={index}>
                  <div
                    key={method.title}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 10,
                      backgroundColor: constants.colors.whiteColor,
                      borderRadius: 10,
                      gap: 14,
                      width: '100%',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      alert(`Selected method: ${method.title}`);
                    }}
                  >
                    <img
                      src={method.icon}
                      alt={method.title}
                      style={{width: 40, height: 40}}
                    />
                    <h6
                      style={{marginRight: 'auto', ...constants.typography.h6}}
                    >
                      {method.title}
                    </h6>
                    {method.title !== 'Card from another bank' && (
                      <svg.InfoSvg />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
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

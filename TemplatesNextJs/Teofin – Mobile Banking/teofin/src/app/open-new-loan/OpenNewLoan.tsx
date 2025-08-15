'use client';

import {useRouter} from 'next/navigation';
import React, {useRef, useEffect, useState} from 'react';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const OpenNewLoan: React.FC = () => {
  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const router = useRouter();

  const currencies = [
    {id: 1, label: 'USD'},
    {id: 2, label: 'EUR'},
  ];

  const depositPeriods = [
    {id: 1, label: '1 mon', value: 1},
    {id: 2, label: '3 mos', value: 3},
    {id: 3, label: '6 mos', value: 6},
    {id: 4, label: '12 mos', value: 12},
    {id: 5, label: '18 mos', value: 18},
    {id: 6, label: '24 mos', value: 24},
  ];

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

  const buttonRef = useRef<HTMLDivElement>(null);

  const [amount, setAmount] = useState(1000);
  const [buttonSectionHeight, setButtonSectionHeight] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0].id);
  const [selectedDepositPeriod, setSelectedDepositPeriod] = useState(
    depositPeriods[0].id
  );
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [earlyWithdrawal, setEarlyWithdrawal] = useState(false);

  const amountParts = amount.toFixed(2).split('.');

  useEffect(() => {
    if (buttonRef.current) {
      const height = buttonRef.current.offsetHeight;
      setButtonSectionHeight(height);
    }
  }, []);

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Open new loan" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          overflowY: 'auto',
          padding: 20,
          marginTop: constants.sizes.headerHeight,
          marginBottom: buttonSectionHeight,
        }}
      >
        {/* Choose currency */}
        <section style={{marginBottom: 14}}>
          <span
            style={{
              fontSize: 12,
              marginBottom: 6,
              display: 'block',
              color: constants.colors.bodyTextColor,
            }}
          >
            Choose currency:
          </span>
          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            {currencies.map((currency) => {
              const selected = selectedCurrency === currency.id;
              return (
                <li key={currency.id}>
                  <div
                    style={{
                      padding: '8px 20px',
                      borderRadius: 10,
                      backgroundColor: selected
                        ? constants.colors.mainDarkColor
                        : constants.colors.whiteColor,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedCurrency(currency.id);
                    }}
                  >
                    <h5
                      style={{
                        ...constants.typography.h5,
                        color: selected
                          ? constants.colors.whiteColor
                          : constants.colors.mainDarkColor,
                      }}
                    >
                      {currency.label}
                    </h5>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Choose deposit period */}
        <section style={{marginBottom: 14}}>
          <span
            style={{
              fontSize: 12,
              marginBottom: 6,
              display: 'block',
              color: constants.colors.bodyTextColor,
            }}
          >
            Choose deposit period:
          </span>
          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            {depositPeriods.map((period) => {
              const selected = selectedDepositPeriod === period.id;
              return (
                <li key={period.id}>
                  <div
                    style={{
                      padding: '8px 20px',
                      borderRadius: 10,
                      backgroundColor: selected
                        ? constants.colors.mainDarkColor
                        : constants.colors.whiteColor,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedDepositPeriod(period.id);
                    }}
                  >
                    <h5
                      style={{
                        color: selected
                          ? constants.colors.whiteColor
                          : constants.colors.mainDarkColor,
                      }}
                    >
                      {period.label}
                    </h5>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Amount */}
        <section style={{marginBottom: 14}}>
          <span
            style={{
              fontSize: 12,
              marginBottom: 6,
              display: 'block',
              color: constants.colors.bodyTextColor,
            }}
          >
            Amount:
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
                border: 'none',
                cursor: 'pointer',
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
              type="button"
            >
              <span style={{fontSize: 28, fontWeight: 500}}>
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
              You rate is 8%.
            </span>
          </div>
        </section>

        {/* Use card: */}
        <section style={{marginBottom: 30}}>
          <span
            style={{
              fontSize: 12,
              marginBottom: 6,
              display: 'block',
              color: constants.colors.bodyTextColor,
            }}
          >
            Use card:
          </span>
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
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
                    width: '100%',
                    border:
                      '1px solid ' +
                      (selected
                        ? 'rgba(0,0,0,0.5)'
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
          </ul>
        </section>

        {/* Early deposit withdrawal */}
        <section>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #ced6e1',
              paddingBottom: 18,
            }}
          >
            <h5>Early deposit withdrawal</h5>
            <components.Switcher
              onClickAction={() => {
                setEarlyWithdrawal(!earlyWithdrawal);
              }}
              isActive={earlyWithdrawal}
            />
          </div>
        </section>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <section
        ref={buttonRef}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          padding: 20,
          backgroundColor: constants.colors.antiFlashWhite,
          bottom: 0,
        }}
      >
        <components.Button
          title="open new loan"
          onClickAction={() => {
            router.back();
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

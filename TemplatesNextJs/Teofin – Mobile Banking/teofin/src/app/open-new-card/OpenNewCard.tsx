'use client';

import {useRouter} from 'next/navigation';
import React, {useState, useRef, useEffect} from 'react';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const OpenNewCard: React.FC = () => {
  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const router = useRouter();

  const currencies = ['USD', 'EUR'];

  const cardTypes = ['Debet', 'Credit'];
  const paymentSystems = ['Visa', 'MasterCard'];

  const ref = useRef<HTMLDivElement>(null);
  const [buttonHeight, setButtonHeight] = useState<number>(0);

  useEffect(() => {
    if (ref.current) {
      setButtonHeight(ref.current.clientHeight);
    }
  }, [ref]);

  const [selectedCardType, setSelectedCardType] = useState<string | null>(
    cardTypes[0]
  );
  const [selectedPaymentSystem, setSelectedPaymentSystem] = useState<
    string | null
  >(paymentSystems[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Open new card" />;
  };

  const renderBackground = () => {
    return (
      <img
        src={'/bg/03.png'}
        alt="bg"
        style={{
          position: 'absolute',
          width: '100%',
          height: 'auto',
          maxWidth: constants.sizes.screenWidth,
          margin: '0 auto',
          zIndex: 1,
        }}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: 20,
          marginRight: 20,
          zIndex: 2,
          marginTop: constants.sizes.headerHeight,
          marginBottom: buttonHeight,
          paddingTop: 20,
          overflowY: 'auto',
        }}
      >
        {/* Card Types */}
        <section style={{marginBottom: 14}}>
          <span
            style={{
              fontSize: 12,
              display: 'block',
              marginBottom: 6,
              color: constants.colors.bodyTextColor,
            }}
          >
            Type:
          </span>
          <div style={{display: 'flex', flexDirection: 'row', gap: 14}}>
            {cardTypes.map((type, index) => {
              return (
                <div
                  key={index}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 8,
                    backgroundColor:
                      selectedCardType === type
                        ? constants.colors.mainDarkColor
                        : '#fff',
                  }}
                  onClick={() => setSelectedCardType(type)}
                >
                  <h5
                    style={{
                      ...constants.typography.h5,
                      color:
                        selectedCardType === type
                          ? constants.colors.whiteColor
                          : constants.colors.mainDarkColor,
                    }}
                  >
                    {type}
                  </h5>
                </div>
              );
            })}
          </div>
        </section>

        {/* Payment system: */}
        <section style={{marginBottom: 20}}>
          <span
            style={{
              fontSize: 12,
              display: 'block',
              marginBottom: 6,
              color: constants.colors.bodyTextColor,
            }}
          >
            Payment system:
          </span>
          <div style={{display: 'flex', flexDirection: 'row', gap: 14}}>
            {paymentSystems.map((system, index) => {
              return (
                <div
                  key={index}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 8,
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                  onClick={() => {
                    setSelectedPaymentSystem(system);
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: '2px solid #CED6E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {selectedPaymentSystem === system && (
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor: 'green',
                          borderRadius: '50%',
                        }}
                      />
                    )}
                  </div>
                  {system === 'Visa' && (
                    <img
                      src="https://george-fx.github.io/teofin-data/icons/04.png"
                      alt="Visa"
                      style={{width: 40.43, height: 12}}
                    />
                  )}
                  {system === 'MasterCard' && (
                    <img
                      src="https://george-fx.github.io/teofin-data/icons/05.png"
                      alt="Visa"
                      style={{width: 26.35, height: 16}}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Card */}
        <section style={{marginBottom: 30}}>
          <div
            style={{
              width: '100%',
              height: 213,
              background:
                'linear-gradient(69.78deg, rgba(27, 29, 77, 0.3) 36.98%, rgba(232, 138, 164, 0.3) 73.96%, rgba(32, 141, 224, 0.3) 95.83%)',
              backdropFilter: 'blur(11.2414px)',
              borderRadius: 10,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '0 auto',
            }}
          >
            <span
              style={{
                fontSize: 14,
                color: constants.colors.whiteColor,
                letterSpacing: '0.2em',
                marginBottom: 17,
              }}
            >
              teofin debet card
            </span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'auto',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: constants.colors.whiteColor,
                  lineHeight: 1.6,
                }}
              >
                4325 **** **** 6475
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 7,
              }}
            >
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'uppercase',
                  fontSize: 12,
                }}
              >
                balance
              </span>
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'uppercase',
                  fontSize: 12,
                }}
              >
                expire
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  color: constants.colors.whiteColor,
                  fontWeight: 700,
                  fontSize: 24,
                }}
              >
                $ 200 000.00
              </span>
              <span
                style={{
                  color: constants.colors.whiteColor,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                12/25
              </span>
            </div>
          </div>
        </section>

        {/* Descriptino */}
        <section>
          <p
            style={{
              marginBottom: 20,
              color: constants.colors.bodyTextColor,
              fontSize: 16,
            }}
          >
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </p>
        </section>

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
          <ul style={{display: 'flex', alignItems: 'center', gap: 14}}>
            {currencies.map((currency, index) => {
              return (
                <li key={index}>
                  <div
                    style={{
                      padding: '8px 20px',
                      borderRadius: 10,
                      backgroundColor:
                        selectedCurrency === currency
                          ? constants.colors.mainDarkColor
                          : constants.colors.whiteColor,
                    }}
                    onClick={() => {
                      setSelectedCurrency(currency);
                    }}
                  >
                    <h5
                      style={{
                        color:
                          selectedCurrency === currency
                            ? constants.colors.whiteColor
                            : constants.colors.mainDarkColor,
                      }}
                    >
                      {currency}
                    </h5>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <div
        ref={ref}
        style={{
          bottom: 0,
          width: '100%',
          padding: 20,
          position: 'fixed',
          margin: '0 auto',
          flexDirection: 'column',
          display: 'flex',
          maxWidth: constants.sizes.screenWidth,
          zIndex: 2,
          backgroundColor: constants.colors.antiFlashWhite,
        }}
      >
        <components.Button
          title="Add new card"
          onClickAction={() => {
            router.back();
          }}
        />
      </div>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderBackground()}
        {renderHeader()}
        {renderContent()}
        {renderButton()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};

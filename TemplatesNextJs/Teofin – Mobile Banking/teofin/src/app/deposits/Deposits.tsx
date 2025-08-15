'use client';

import {useRouter} from 'next/navigation';
import React, {useRef, useState, useEffect} from 'react';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

import {svg} from '@/assets/svg';

export const Deposits: React.FC = () => {
  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const router = useRouter();

  const isMobile = hooks.useIsMobile();

  const [buttonHeight, setButtonHeight] = useState(0);

  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buttonsRef.current) {
      const height = buttonsRef.current.offsetHeight;
      setButtonHeight(height);
    }
  }, []);

  const deposits = [
    {
      amount: 3000.0,
      currency: 'USD',
      interestRate: 8,
      profit: 60.57,
      period: {
        start: '2022-09-01',
        end: '2022-03-01',
      },
      status: 'active',
      icon: 'safe',
      actions: [
        {
          label: 'Top-Up',
          color: '#55ACEE',
          link: constants.routes.topUpPayment,
        },
        {
          label: 'Withdrawal',
          color: '#3EB290',
          link: null,
        },
      ],
    },
    {
      amount: 1500.0,
      currency: 'USD',
      interestRate: 10,
      profit: 150.0,
      period: {
        start: '2021-09-01',
        end: '2022-09-01',
      },
      status: 'completed',
      icon: 'check',
      actions: [
        {
          label: 'Extend',
          color: '#FF8A71',
          link: null,
        },
        {
          label: 'Withdrawal',
          color: '#3EB290',
          link: null,
        },
      ],
    },
  ];

  const moneyboxes = [
    {
      title: 'New iPhone Pro Max',
      targetAmount: 1200.0,
      currentAmount: 650.27,
      currency: 'USD',
      buttons: [
        {
          label: 'Top - Up',
          color: '#55ACEE',
          link: constants.routes.topUpPayment,
        },
        {
          label: 'Withdrawal',
          color: '#3EB290',
          link: null,
        },
      ],
    },
  ];

  const formatPeriod = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const startStr = startDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const endStr = endDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const yearStr = endDate.getFullYear();

    return `${startStr} - ${endStr}, ${yearStr}`;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          height: '100%',
          paddingTop: constants.sizes.headerHeight,
          marginBottom: constants.sizes.tabBarHeight + buttonHeight,
          paddingBottom: 20,
        }}
      >
        <h2 style={{marginBottom: 20, ...constants.typography.h2}}>Deposits</h2>

        {/* Current deposits */}
        <section style={{marginBottom: 20}}>
          <span
            style={{
              fontSize: 12,
              display: 'block',
              marginBottom: 6,
              color: constants.colors.bodyTextColor,
            }}
          >
            Current deposits
          </span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {deposits.map((deposit, index) => {
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: constants.colors.whiteColor,
                    padding: 20,
                    borderRadius: 10,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* top section */}
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
                    <div style={{marginRight: 10}}>
                      <svg.SafeDepositSvg />
                    </div>
                    <div style={{flex: 1}}>
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'space-between',
                        }}
                      >
                        <>
                          <span style={{fontSize: 20}}>
                            {deposit.amount.toFixed(2)}
                          </span>
                          <span
                            style={{
                              marginLeft: 4,
                              fontSize: 14,
                              fontWeight: 700,
                            }}
                          >
                            {deposit.currency}
                          </span>
                        </>
                        <h5
                          style={{marginBottom: 1, ...constants.typography.h5}}
                        >
                          {deposit.interestRate}%
                        </h5>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <>
                          <span
                            style={{
                              fontSize: 12,
                              color: constants.colors.bodyTextColor,
                            }}
                          >
                            {formatPeriod(
                              deposit.period.start,
                              deposit.period.end
                            )}
                          </span>
                        </>
                        <h5
                          style={{
                            ...constants.typography.h5,
                            color: '#3eb290',
                          }}
                        >
                          + {deposit.profit.toFixed(2)}
                        </h5>
                      </div>
                    </div>
                  </div>
                  {/* bottom section */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 7,
                      marginTop: 13,
                    }}
                  >
                    {deposit.actions.map((action, actionIndex) => {
                      return (
                        <button
                          key={actionIndex}
                          style={{
                            height: 30,
                            borderRadius: 5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: action.color,
                          }}
                          onClick={() => {
                            if (action.link) {
                              router.push(action.link);
                            } else {
                              alert(
                                `Action "${action.label}" is not implemented yet.`
                              );
                            }
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              color: constants.colors.whiteColor,
                              fontWeight: 600,
                            }}
                          >
                            {action.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Moneyboxes */}
        <section>
          <span
            style={{
              fontSize: 12,
              display: 'block',
              marginBottom: 6,
              color: constants.colors.bodyTextColor,
            }}
          >
            Current moneyboxes
          </span>
          {moneyboxes.map((moneybox, index) => {
            const [int, frac] = moneybox.currentAmount
              .toFixed(2)
              .split('.') as [string, string];
            return (
              <div
                key={index}
                style={{
                  backgroundColor: constants.colors.whiteColor,
                  padding: 20,
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexDirection: 'row',
                    marginBottom: 7,
                  }}
                >
                  <svg.PyggyBankSvg />
                  <span style={{marginRight: 'auto'}}>{moneybox.title}</span>
                  <span>
                    {moneybox.currentAmount.toFixed(2)}{' '}
                    <span style={{fontSize: 14, fontWeight: 700}}>
                      {moneybox.currency}
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    height: 5,
                    backgroundColor: '#dbdbdf',
                    borderRadius: 10,
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: '#3eb290',
                      borderRadius: 10,
                      width: `${
                        (moneybox.currentAmount / moneybox.targetAmount) * 100
                      }%`,
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                >
                  <div>
                    {int}
                    <span
                      style={{
                        fontSize: 12,
                        color: '#888',
                        marginLeft: 1,
                        textAlign: 'center',
                      }}
                    >
                      .{frac} {moneybox.currency}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 7,
                  }}
                >
                  {moneybox.buttons.map((button, buttonIndex) => {
                    return (
                      <button
                        key={buttonIndex}
                        style={{
                          height: 30,
                          borderRadius: 5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: button.color,
                        }}
                        onClick={() => {
                          if (button.link) {
                            router.push(button.link);
                          } else {
                            alert(
                              `Action "${button.label}" is not implemented yet.`
                            );
                          }
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            color: constants.colors.whiteColor,
                            fontWeight: 600,
                          }}
                        >
                          {button.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
      </main>
    );
  };

  const renderButtons = () => {
    return (
      <section
        ref={buttonsRef}
        style={{
          position: 'fixed',
          width: '100%',
          padding: 20,
          maxWidth: constants.sizes.screenWidth,
          backgroundColor: constants.colors.antiFlashWhite,
          bottom: constants.sizes.tabBarHeight,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 11,
          }}
        >
          <button
            style={{
              backgroundColor: '#f1f5fd',
              height: 50,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #ced6e1',
            }}
            onClick={() => router.push(constants.routes.openMoneybox)}
          >
            <span style={{color: constants.colors.mainDarkColor}}>
              + Moneybox
            </span>
          </button>
          <button
            style={{
              background: 'linear-gradient(91.28deg, #97daff 0%, #16579d 100%)',
              height: 50,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => router.push(constants.routes.openDeposit)}
          >
            <span style={{color: constants.colors.whiteColor}}>+ Deposit</span>
          </button>
        </div>
      </section>
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
        {renderContent()}
        {renderButtons()}
        {renderBottomBar()}
      </components.SafeAreaView>
      {renderHomeIndicatorBG()}
    </components.MotionWrapper>
  );
};

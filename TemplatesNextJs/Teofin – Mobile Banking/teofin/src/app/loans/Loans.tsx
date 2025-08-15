'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect, useRef, useState} from 'react';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

export const Loans: React.FC = () => {
  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const router = useRouter();

  const loans = [
    {
      amount: -20532.0,
      currency: 'USD',
      rate: 13,
      periodMonths: 24,
      monthlyPayment: 1117.0,
      totalPaid: 4468.0,
      status: 'active',
      action: 'Repay',
    },
  ];

  const isMobile = hooks.useIsMobile();

  const [buttonHeight, setButtonHeight] = useState(0);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      const height = buttonRef.current.offsetHeight;
      setButtonHeight(height);
    }
  }, []);

  const renderHeader = () => {
    return <components.Header />;
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
          marginBottom: constants.sizes.tabBarHeight + buttonHeight,
        }}
      >
        <h2 style={{marginBottom: 20, ...constants.typography.h2}}>Loans</h2>
        <>
          <span style={{marginBottom: 12, display: 'block'}}>
            Current loans
          </span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {loans.map((loan, index) => {
              return (
                <div
                  key={index}
                  style={{
                    padding: 20,
                    borderRadius: 10,
                    backgroundColor: constants.colors.whiteColor,
                  }}
                >
                  {/* top section */}
                  <section
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      flexDirection: 'row',
                      borderBottom: '1px solid #ced6e1',
                      paddingBottom: 20,
                      marginBottom: 14,
                    }}
                  >
                    <svg.LoansWalletSvg />
                    <span style={{marginRight: 'auto', fontSize: 20}}>
                      {loan.amount}
                      <span style={{fontSize: 14}}>.00</span>
                      <span
                        style={{fontSize: 14, fontWeight: 700, marginLeft: 4}}
                      >
                        {loan.currency}
                      </span>
                    </span>
                    <button
                      style={{
                        backgroundColor: '#3eb290',
                        height: 30,
                        borderRadius: 5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: 32,
                        paddingRight: 32,
                      }}
                      onClick={() => {
                        alert('Your logic for loan action here');
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: constants.colors.whiteColor,
                          fontWeight: 600,
                        }}
                      >
                        {loan.action}
                      </span>
                    </button>
                  </section>
                  {/* bottom section */}
                  <section>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: constants.colors.bodyTextColor,
                        }}
                      >
                        Rate
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: constants.colors.bodyTextColor,
                        }}
                      >
                        Period
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr',
                        marginBottom: 16,
                      }}
                    >
                      <h6 style={{...constants.typography.h6}}>{loan.rate}%</h6>
                      <h6 style={{...constants.typography.h6}}>
                        {loan.periodMonths} months
                      </h6>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: constants.colors.bodyTextColor,
                        }}
                      >
                        Monthly payment
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: constants.colors.bodyTextColor,
                        }}
                      >
                        Total paid
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr',
                      }}
                    >
                      <h6>
                        {loan.monthlyPayment.toFixed(2)} {loan.currency}
                      </h6>
                      <h6>
                        {loan.totalPaid.toFixed(2)} {loan.currency}
                      </h6>
                    </div>
                  </section>
                </div>
              );
            })}
          </div>
        </>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <section
        ref={buttonRef}
        style={{
          position: 'fixed',
          width: '100%',
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 20,
          paddingBottom: 20,
          maxWidth: constants.sizes.screenWidth,
          backgroundColor: constants.colors.antiFlashWhite,
          bottom: constants.sizes.tabBarHeight,
        }}
      >
        <components.Button
          title="+ new Loan"
          onClickAction={() => {
            router.push(constants.routes.openNewLoan);
          }}
        />
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
        {renderHeader()}
        {renderContent()}
        {renderButton()}
        {renderBottomBar()}
      </components.SafeAreaView>
      {renderHomeIndicatorBG()}
    </components.MotionWrapper>
  );
};

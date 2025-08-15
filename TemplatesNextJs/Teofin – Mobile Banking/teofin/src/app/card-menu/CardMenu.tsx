'use client';

import {useRouter} from 'next/navigation';
import React, {useRef} from 'react';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

const stylesInline = {
  section: {
    marginBottom: 14,
  } as React.CSSProperties,
  sectionTitle: {
    display: 'block',
    marginBottom: 6,
    fontSize: 12,
    color: constants.colors.bodyTextColor,
  } as React.CSSProperties,
  cardList: {
    display: 'flex',
    gap: 6,
    flexDirection: 'column',
  } as React.CSSProperties,
  sharedBtn: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    width: '100%',
  } as React.CSSProperties,
  sharedImage: {
    background:
      'linear-gradient(110.75deg, #c285ab 0%, #7aa1ce 49.34%, #1b1f6a 100.78%)',
    width: 72,
    height: 46,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  } as React.CSSProperties,
  cardImageText: {
    color: constants.colors.whiteColor,
    fontSize: 12,
    margin: 10,
    marginBottom: 8,
    fontWeight: 600,
  } as React.CSSProperties,
  sharedDetails: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  } as React.CSSProperties,
  creditAmount: {
    ...constants.typography.h6,
  } as React.CSSProperties,
};

export const CardMenu: React.FC = () => {
  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const router = useRouter();

  const buttonRef = useRef<HTMLDivElement>(null);

  const cards = [
    {
      id: 1,
      type: 'Visa',
      number: '**** **** **** 1945',
      balance: '2 648.11',
      currency: 'USD',
    },
    {
      id: 2,
      type: 'Visa',
      number: '**** **** **** 7895',
      balance: '4 863.27',
      currency: 'EUR',
    },
  ];

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Card menu" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 20,
          overflowY: 'auto',
          paddingBottom: 40,
        }}
      >
        {/* Cards */}
        <section style={stylesInline.section}>
          <span style={stylesInline.sectionTitle}>Cards</span>
          <div style={stylesInline.cardList}>
            {cards.map((card) => {
              return (
                <button
                  key={card.id}
                  style={stylesInline.sharedBtn}
                  onClick={() => {
                    router.push(constants.routes.cardDetails);
                  }}
                >
                  {/* Image */}
                  <div style={stylesInline.sharedImage}>
                    <span style={stylesInline.cardImageText}>teofin</span>
                  </div>
                  {/* Details */}
                  <div style={stylesInline.sharedDetails}>
                    <span
                      style={{
                        fontSize: 12,
                        color: constants.colors.bodyTextColor,
                      }}
                    >
                      {card.number}
                    </span>
                    <h6 style={{...constants.typography.h6}}>
                      {card.balance} {card.currency}
                    </h6>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Entrepreneur accounts */}
        <section style={stylesInline.section}>
          <span style={stylesInline.sectionTitle}>Entrepreneur accounts</span>
          <div
            style={stylesInline.sharedBtn}
            onClick={() => {
              alert('Your entrepreneur accounts are not available yet.');
            }}
          >
            <svg.EntrAccSvg />
            <div style={stylesInline.sharedDetails}>
              <span
                style={{
                  fontSize: 12,
                  color: constants.colors.bodyTextColor,
                }}
              >
                US**********************4571
              </span>
              <h6 style={{...constants.typography.h6}}>39 863.62 USD</h6>
            </div>
          </div>
        </section>

        {/* Ongoing credits */}
        <section>
          <span style={stylesInline.sectionTitle}>Ongoing credits</span>
          <div
            style={stylesInline.sharedBtn}
            onClick={() => {
              alert('Your ongoing credits are not available yet.');
            }}
          >
            <div style={stylesInline.sharedImage}>
              <span style={stylesInline.cardImageText}>teofin</span>
            </div>
            <div style={stylesInline.sharedDetails}>
              <span
                style={{
                  fontSize: 12,
                  color: constants.colors.bodyTextColor,
                }}
              >
                **** **** 6547
              </span>
              <h6 style={stylesInline.creditAmount}>1687.62 USD</h6>
            </div>
          </div>
        </section>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <div
        ref={buttonRef}
        style={{display: 'flex', padding: 20, justifyContent: 'center'}}
      >
        <button
          onClick={() => {
            router.push(constants.routes.openNewCard);
          }}
        >
          <svg.AddANewCardSvg />
        </button>
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
